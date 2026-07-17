resource "aws_dynamodb_table" "app_state" {
  name         = "ric-badminton-practice-state"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "key"

  attribute {
    name = "key"
    type = "S"
  }

  tags = {
    Project     = "RIC Badminton"
    Environment = "practice"
    ManagedBy   = "Terraform"
  }
}