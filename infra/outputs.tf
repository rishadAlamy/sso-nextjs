output "user_pool_id" {
  description = "The ID of the Cognito User Pool."
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_client_id" {
  description = "The ID of the Cognito User Pool Client."
  value       = aws_cognito_user_pool_client.main.id
}

output "saml_provider_name" {
  description = "The name of the SAML provider."
  value       = aws_cognito_identity_provider.saml.provider_name
}
