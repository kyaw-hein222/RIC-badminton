output "practice_bucket_name" {
  description = "The name of the practice S3 bucket"
  value       = aws_s3_bucket.practice_website.bucket
}

output "practice_bucket_arn" {
  description = "The AWS ID of the practice S3 bucket"
  value       = aws_s3_bucket.practice_website.arn
}
output "database_name" {
  description = "The name of the DynamoDB table for practice state"
  value       = aws_dynamodb_table.app_state.name
}