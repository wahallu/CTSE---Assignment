# User Service

Backend microservice for user management in the cloud-based Event Management System. Built with **Node.js**, **Express.js**, and **MongoDB**.

## Project Structure

```
User service/
├── src/
│   ├── models/
│   │   └── User.js            # Mongoose user schema
│   ├── controllers/
│   │   └── userController.js   # Business logic for all endpoints
│   ├── routes/
│   │   └── userRoutes.js       # Route definitions
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT authentication middleware
│   │   └── errorHandler.js     # Centralized error handling
│   └── app.js                  # Application entry point
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

## Environment Variables

| Variable     | Description                  | Default |
| ------------ | ---------------------------- | ------- |
| `PORT`       | Server port                  | `4000`  |
| `MONGO_URI`  | MongoDB connection string    | —       |
| `JWT_SECRET` | Secret key for JWT signing   | —       |

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Local Setup

```bash
# Install dependencies
npm install

# Run in development mode (with hot-reload)
npm run dev

# Run in production mode
npm start
```

## Docker

```bash
# Build the image
docker build -t user-service .

# Run the container
docker run -p 4000:4000 \
  -e MONGO_URI=your_mongodb_uri \
  -e JWT_SECRET=your_jwt_secret \
  user-service
```

## API Endpoints

Base URL: `/api/users`

| Method   | Endpoint              | Auth     | Description               | Success Code |
| -------- | --------------------- | -------- | ------------------------- | ------------ |
| `POST`   | `/api/users/register` | No       | Register a new user       | `201`        |
| `POST`   | `/api/users/login`    | No       | Login & receive JWT token | `200`        |
| `GET`    | `/api/users`          | Required | Get all users             | `200`        |
| `GET`    | `/api/users/:id`      | Required | Get user by ID            | `200`        |
| `PUT`    | `/api/users/:id`      | Required | Update user by ID         | `200`        |
| `DELETE` | `/api/users/:id`      | Required | Delete user by ID         | `200`        |

### Authentication

Protected endpoints require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Tokens are returned in the response body of `/register` and `/login`.

### Register

```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"secret123"}'
```

### Login

```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```

### Inter-Service Communication

`GET /api/users/:id` returns a consistent JSON structure for other microservices (e.g., Ticket Booking Service) to validate user identity:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John",
    "email": "john@example.com",
    "role": "customer"
  }
}
```
