# AGENTS.md — Universal Project Memory
# Any AI agent or CLI (Claude Code, OpenAI Codex, Google Antigravity, Cursor, etc.) should read this file first.

## Project Identity
- **Name**: RIC Badminton — Match Queue Board
- **Owner**: kyaw-hein222
- **Repo**: https://github.com/kyaw-hein222/RIC-badminton.git
- **Description**: A real-time badminton court match queue system for RIC (club). Public scoreboard + admin panel + historical records.

## Folder Structure
```
RIC_badminton/
├── frontend/                  # Static site — deploy to AWS S3
│   ├── index.html             # Public scoreboard (ongoing matches, queue, checked-in players)
│   ├── admin.html             # Admin panel (manage players, matches, courts, check-ins)
│   └── records.html           # Club records & match history
├── backend/                   # Serverless — deploy to AWS Lambda
│   └── lambda_function.js     # Node.js 20 (ES module), DynamoDB CRUD via SDK v3
├── docs/                      # Reference documents (not deployed)
│   ├── aws_deployment_guide.pdf
│   └── chat_log.md            # Learning log from initial build sessions
├── AGENTS.md                  # ← You are here. Universal project context.
├── SPEC.md                    # Original design spec & data model
├── .gitignore
└── README.md
```

## Tech Stack
| Layer       | Technology                | Notes |
|-------------|---------------------------|-------|
| Frontend    | Vanilla HTML/CSS/JS       | Single-page apps, no build step, Google Fonts (Outfit, Inter) |
| Backend     | AWS Lambda (Node.js 20)   | ES module (`import`), handler: `handler` |
| Database    | Amazon DynamoDB           | Table: `ric_badminton_state`, partition key: `key` (String) |
| API         | Amazon API Gateway (HTTP) | Routes: `GET /state`, `POST /state`, `OPTIONS /state` |
| CDN/Hosting | Amazon CloudFront + S3    | S3 private bucket, CloudFront OAC for access |
| Auth        | Custom header passcode    | Header: `X-Admin-Passcode`, Lambda env var: `ADMIN_PASSCODE` |

## Data Model (DynamoDB)
Table `ric_badminton_state` stores 4 keys, each holding a JSON array as a stringified value:
| Key                     | Content |
|-------------------------|---------|
| `badmin_queue`          | Array of match objects `{ id, team1a, team1b, team2a, team2b, court, status, order, date, startTime }` |
| `badmin_players`        | Array of checked-in player objects `{ name, avatar, rank, matchesPlayed, order }` |
| `badmin_club_players`   | Array of registered club member objects (permanent roster) |
| `badmin_match_history`  | Array of completed match records |

## API Contract
**Base URL**: Set in `API_URL` constant at the top of each HTML file's `<script>` block.

### `GET /state` (Public)
Returns all 4 keys merged into one JSON object. No auth required.

### `POST /state` (Admin)
Writes a single key. Requires header `X-Admin-Passcode`.
```json
{ "key": "badmin_queue", "value": [ ... ] }
```

### `OPTIONS /state`
CORS preflight. Returns `200` with CORS headers.

## Deployment Status
- [x] DynamoDB table `ric_badminton_state` created
- [x] Lambda function deployed with `ADMIN_PASSCODE` env var
- [x] API Gateway HTTP API created with routes
- [x] S3 bucket created and frontend files uploaded
- [x] CloudFront distribution created with OAC
- [x] `API_URL` set in all 3 HTML files
- [x] GitHub repo updated with new structure

## Configuration Points
When deploying, these values must be set:
1. **`API_URL`** in `frontend/index.html` (line ~611), `frontend/admin.html` (line ~926), `frontend/records.html` (line ~465) — set to the API Gateway invoke URL
2. **`ADMIN_PASSCODE`** as a Lambda environment variable — the admin panel sends this via `X-Admin-Passcode` header
3. **`TABLE_NAME`** in `backend/lambda_function.mjs` (line 10) — currently `ric_badminton_state`
4. **`S3_BUCKET_NAME`** (UPPERCASE) as a Lambda environment variable (must be uppercase in code: `process.env.S3_BUCKET_NAME`, check AWS Console env configuration to match case).

## Deployed Resources (AWS Console)
- **Region:** Sydney (`ap-southeast-2`)
- **DynamoDB Table:** `ric_badminton_state` (Partition key: `key`)
- **IAM execution role:** `ric-badminton-lambda-role` (with DynamoDB & S3 Put/Delete permissions)
- **Lambda Function:** `ric-badminton-backend` (Node.js 24, architecture: arm64)
  - Code: `lambda_function.mjs` (ES Module, handler: `lambda_function.handler`)
- **API Gateway HTTP API:** `ric-badminton-api`
  - Invoke URL: `https://ku8xwdi7sd.execute-api.ap-southeast-2.amazonaws.com`
- **S3 Bucket:** `ric-badminton` (private, stores static files & avatars/)
- **CloudFront Distribution:** `E26LI7EAJOB2B7`
  - Origin Access Control (OAC) enabled
  - Default root object: `index.html`

## Recent Debugging & Lessons Learned
1. **Node.js ESM vs. CommonJS in Lambda**:
   - Lambda treats `.js` as CommonJS by default. Since we use `import`, the file extension must be `.mjs` (renamed to `lambda_function.mjs`).
   - The Handler setting must match this file extension: `lambda_function.handler`.
2. **API Gateway vs. Lambda CORS**:
   - If API Gateway has CORS configured at the Gateway level, it strips/overwrites CORS headers returned by Lambda.
   - If CORS is configured at the Gateway level, it **MUST** include `"AllowOrigins": ["*"]` (or a specific domain). If it is missing, AWS strips CORS headers entirely, causing the browser to block fetch requests.
3. **Case-Sensitivity of Environment Variables**:
   - Environment variables are case-sensitive. The bucket name variable in code is `S3_BUCKET_NAME` (UPPERCASE), so ensure the Lambda environment configuration uses UPPERCASE instead of lowercase `s3_bucket_name`.

## Git Config
```
user.name: kyaw-hein222
user.email: kyawhtethein.pt@gmail.com
remote origin: https://github.com/kyaw-hein222/RIC-badminton.git
branch: main
```

## Design Language
- Dark theme: navy `#0f111a`, surface `#1a1d2e`
- Accent: coral `#ff6b6b`, teal `#4ecdc4`, green `#2ecc71`
- Fonts: Outfit (headings, 800), Inter (body)
- Glassmorphism, subtle gradients, micro-animations, SVG shuttlecock logo

## Key Decisions & Context
- Frontend uses `localStorage` as offline fallback when `API_URL` is empty or API is unreachable.
- Admin passcode validation is **server-side only** (Lambda checks env var). The frontend never stores the actual passcode.
- Match queue uses manual refresh to minimize API Gateway costs.
- Player avatars are stored as Base64 Data URLs in DynamoDB (via the players array).
- The project was originally scaffolded in OpenAI Codex CLI, then continued in Google Antigravity.

## Agent Instructions
- **DO NOT** create a `.claude/`, `.codex/`, or similar agent-specific config folder. Use this `AGENTS.md` as the single source of truth.
- **DO NOT** install npm/node dependencies at the project root. The frontend is vanilla. The backend Lambda uses AWS SDK v3 which is pre-installed in the Lambda runtime.
- **Before modifying HTML files**, check `API_URL` — if it's empty, the app is in local-only mode.
- **DO NOT** run automated AWS CLI scripts/commands directly to deploy things. The user is studying AWS and wants to do it manually to learn.
- **AWS Study & Deployment Roadmap**:
  1. **Console First (Current Phase)**: Explain step-by-step how to configure and deploy resources using the AWS Web Console.
  2. **CLI Second**: Transition to scripting the deployment using the AWS CLI.
  3. **IaC Third**: Automate the infrastructure using Infrastructure as Code (like CloudFormation or Terraform).

## Future Tasks: Resume & Portfolio Strategy
Once AWS deployment is finished, the user plans to:
1. **Resume & Portfolio HTML Hub**: Create a static portfolio site of their resume in a new directory, deploy it on S3, and configure it under CloudFront.
2. **Clickable Link Layout**: Use the clean hyperlink structure `[Live Demo]` / `[GitHub]` to link to this project and others.
3. **Bullet Point Templates**: Update their official PDF resume using the high-impact AWS architectural bullet points formulated during this session.
4. **Architectural Diagrams**: Create block diagrams showing the service integrations (S3 -> CloudFront OAC -> API Gateway -> Lambda -> DynamoDB) and display them on their GitHub README and portfolio website instead of the resume.
