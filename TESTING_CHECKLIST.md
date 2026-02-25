# Testing & Demo Checklist

Use this checklist to verify that all systems, Docker configurations, and the API Gateway are functioning correctly.

## 1. Starting the Environment Locally
- [ ] Ensure Docker Engine is running on your machine.
- [ ] Open a terminal in the root directory `d:\Y4S1\CTSE---Assignment`.
- [ ] Run the following command:
  ```bash
  docker-compose up --build -d
  ```
- [ ] Verify that all 6 containers are running (`frontend`, `event-service`, `ticket-service`, `user-service`, `payment-service`).
  ```bash
  docker ps
  ```

## 2. Service Health Tests
Test the services directly via their exposed ports.

- [ ] **Event Service Route**: 
  - `GET http://localhost:4000/api/events/health` (Assuming service has a health route, adjust path as necessary)
- [ ] **Ticket Service Route**:
  - `GET http://localhost:5000/api/tickets/health`
- [ ] **User Service Route**:
  - `GET http://localhost:3000/api/users/health`
- [ ] **Payment Service Route**:
  - `GET http://localhost:6000/api/payments/health`

## 3. Database Persistence Test
- [ ] Create an entity (User/Event) using a POST request via the API Gateway.
- [ ] Run `docker-compose down`.
- [ ] Run `docker-compose up -d`.
- [ ] Verify that the entity still exists across container restarts (validating `mongodb_data` volume is working).

## 4. CI/CD Verification
- [ ] Commit and push a minor code change or a README update to the `main` branch.
- [ ] Navigate to the **Actions** tab in GitHub.
- [ ] Verify that the `CI/CD Pipeline` workflow triggers.
- [ ] Check `SonarCloud Analysis` job completes without failing quality gates.
- [ ] Check `Build & Push to DockerHub` creates new images with the latest commit SHA.
- [ ] (If Azure is configured) Check `Deploy to Azure Container Apps` successfully updates the revisions.

## 5. Security & Routing Check
- [ ] Make a direct request to `http://localhost:4000/api/events`. It should work locally since ports are mapped.
- [ ] *For Production*: Assuming you use Azure API Management, verify that attempting to access a specific Container App URL directly bypasses the Azure API Management is denied (by configuring internal ingress for the apps).
