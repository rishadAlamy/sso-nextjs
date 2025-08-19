# Terraform Cognito SSO Setup

This Terraform configuration sets up AWS Cognito for SSO with SAML 2.0, following security best practices.

## Features

- Secure password policy (min 12 chars, upper/lowercase, numbers, symbols)
- Email verification and recovery
- OAuth2 app client (no client secret for web)
- SAML 2.0 IdP integration
- Variables for all sensitive and environment-specific values

## Usage

1. Copy your SAML metadata XML to `infra/saml-metadata.xml` or update the `saml_metadata_file` variable.
2. Review and update variables in `variables.tf` as needed.
3. Initialize and apply:

```sh
cd infra
terraform init
terraform apply
```

4. Outputs will provide Cognito User Pool IDs and SAML provider name for your app config.

## Security Notes

- Never commit real secrets or private keys.
- Use AWS IAM roles with least privilege for Terraform.
- Rotate credentials regularly.
- Use HTTPS for all callback/logout URLs in production.
