data "aws_iam_policy_document" "lambda_app_permissions" {
  statement {
    sid = "DynamoDBStateAccess"

    actions = [
      "dynamodb:Scan",
      "dynamodb:PutItem"
    ]

    resources = [aws_dynamodb_table.app_state.arn]
  }

  statement {
    sid = "AvatarStorageAccess"

    actions = [
      "s3:PutObject",
      "s3:DeleteObject"
    ]

    resources = ["${aws_s3_bucket.practice_website.arn}/avatars/*"]
  }
}

resource "aws_iam_role_policy" "lambda_app_permissions" {
  name   = "ric-badminton-practice-app-access"
  role   = aws_iam_role.app_lambda.id
  policy = data.aws_iam_policy_document.lambda_app_permissions.json
}