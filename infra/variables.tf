variable "aws_region" {
  description = "AWS region to deploy resources."
  type        = string
  default     = "ap-south-1"
}

variable "user_pool_name" {
  description = "Name for the Cognito User Pool."
  type        = string
  default     = "nextjs-sso-demo-user-pool"
}

variable "callback_url" {
  description = "OAuth2 callback URL for Cognito app client."
  type        = string
  default     = "http://localhost:3000/api/sso"
}

variable "logout_url" {
  description = "Logout URL for Cognito app client."
  type        = string
  default     = "http://localhost:3000/"
}

variable "saml_provider_name" {
  description = "Name for the SAML identity provider."
  type        = string
  default     = "SAMLProvider"
}

variable "saml_metadata_file" {
  description = "Path to the SAML metadata XML file."
  type        = string
  default     = "./saml-metadata.xml"
}
