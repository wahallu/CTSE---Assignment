# Security & Secrets Strategy

This document outlines the security practices and secret management strategy for the Event Management System.

## 1. Local Development
For local development, secrets are stored in `.env` files.
- **Never commit `.env` files to version control.** They are included in `.gitignore`.
- Reference the `.env.example` files in each service directory to see which variables need to be configured.

### Required Environment Variables (Local)
- `MONGODB_URI`: Connection string for MongoDB. (Default in docker-compose: `mongodb://mongodb:27017/<service_db>`)
- `PORT`: Port the service runs on.
- `JWT_SECRET`: Secret key used for signing JSON Web Tokens in `UserService` and API Gateway (if applicable).

## 2. CI/CD Pipeline (GitHub Actions)
The CI/CD pipeline requires several secrets to function correctly. These must be added to your repository settings under **Settings > Secrets and variables > Actions**.

### Required GitHub Secrets
| Secret Name           | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| `DOCKER_USERNAME`     | DockerHub username for pushing images.                                      |
| `DOCKER_PASSWORD`     | DockerHub personal access token or password.                                |
| `SONAR_TOKEN`         | Token generated from SonarCloud for code analysis.                          |
| `AZURE_CREDENTIALS`   | Service Principal JSON for Azure Container Apps deployment.                 |

## 3. Production Deployment (Azure Container Apps)
In production, environment variables should be securely injected into the containers.

- Use **Azure Key Vault** to store highly sensitive information like database connection strings and JWT secrets.
- Map the Key Vault secrets to the Container Apps environment variables.
- Ensure that the Azure Container Apps environment is configured to restrict traffic to the API Gateway only. Internal services (`event-service`, `ticket-service`, `user-service`, `payment-service`) should not have public endpoints enabled.

## 4. API Security
- The API Gateway is the single point of entry. Implement Rate Limiting and CORS policies at the gateway level.
- Authentication: Generate JWTs in the `UserService` and validate them in the API Gateway before routing to protected endpoints.
