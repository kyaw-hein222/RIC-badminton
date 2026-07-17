terraform {
  backend "s3" {
    bucket       = "ric-badminton-terraform-state"
    key          = "practice/terraform.tfstate"
    region       = "ap-southeast-2"
    encrypt      = true
    use_lockfile = true
  }
}