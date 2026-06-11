import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB Document Client (standard SDK v3)
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "ric_badminton_state";

export const handler = async (event) => {
  // Support both API Gateway REST (v1) and HTTP (v2) payloads
  const method = event.requestContext?.http?.method || event.httpMethod;
  const path = event.requestContext?.http?.path || event.path;
  
  // Standard response headers to handle Cross-Origin Resource Sharing (CORS)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Admin-Passcode",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle browser preflight OPTIONS requests
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    // ----------------- GET /state (Public Read Endpoint) -----------------
    if (method === "GET" && (path === "/state" || path.endsWith("/state"))) {
      const scanResult = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
      
      // Default state payload if table is new/empty
      const state = {
        badmin_queue: [],
        badmin_players: [],
        badmin_club_players: [],
        badmin_match_history: []
      };

      // Map scanned items back to state
      if (scanResult.Items) {
        scanResult.Items.forEach(item => {
          if (item.key && state.hasOwnProperty(item.key)) {
            try {
              state[item.key] = JSON.parse(item.value);
            } catch (err) {
              console.error(`Failed to parse value for database key ${item.key}:`, err);
              state[item.key] = [];
            }
          }
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(state)
      };
    }

    // ----------------- POST /state (Admin Write Endpoint) -----------------
    if (method === "POST" && (path === "/state" || path.endsWith("/state"))) {
      // 1. Verify passcode in header against the Lambda Environment Variable
      const clientPasscode = event.headers?.["x-admin-passcode"] || event.headers?.["X-Admin-Passcode"];
      const actualPasscode = process.env.ADMIN_PASSCODE;

      if (!actualPasscode || clientPasscode !== actualPasscode) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: "Unauthorized: Invalid or missing admin passcode" })
        };
      }

      // 2. Parse request payload
      let body;
      try {
        body = JSON.parse(event.body);
      } catch (err) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Invalid JSON request body" })
        };
      }

      const { key, value } = body;
      const validKeys = ["badmin_queue", "badmin_players", "badmin_club_players", "badmin_match_history"];

      if (!key || !validKeys.includes(key)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Invalid or missing key. Must be one of: ${validKeys.join(", ")}` })
        };
      }

      // 3. Write value to DynamoDB as stringified JSON document
      const stringifiedValue = JSON.stringify(value);
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          key: key,
          value: stringifiedValue,
          updatedAt: new Date().toISOString()
        }
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: `Successfully updated state for key: ${key}` })
      };
    }

    // fallback for unmatched requests
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Not Found" })
    };

  } catch (err) {
    console.error("Error executing serverless logic:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message })
    };
  }
};
