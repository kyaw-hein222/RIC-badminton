data "aws_caller_identity" "current" {}
resource "aws_s3_bucket" "practice_website" {
  bucket = "ric-badminton-terraform"

  tags = {
    Project     = "RIC Badminton"
    Environment = "practice"
    ManagedBy   = "Terraform"
  }
}
resource "aws_s3_bucket_public_access_block" "practice_website" {
  bucket = aws_s3_bucket.practice_website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "practice_website" {
  bucket = aws_s3_bucket.practice_website.id

  versioning_configuration {
    status = "Enabled"
  }
}