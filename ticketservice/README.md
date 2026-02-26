# 🎟️ Ticket Service

A production-ready backend microservice for managing event ticket bookings, built with **Node.js**, **Express.js**, and **MongoDB**. Part of a cloud-based Event Management System using microservices architecture.

---

## 📁 Project Structure

```
TicketService/
├── package.json
├── .env.example
├── .gitignore
├── Dockerfile
├── README.md
└── src/
    ├── app.js                      # Application entry point
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── models/
    │   └── Ticket.js               # Mongoose Ticket schema
    ├── controllers/
    │   └── ticketController.js     # CRUD + inter-service handlers
    ├── routes/
    │   └── ticketRoutes.js         # Route definitions
    └── middlewares/
        └── errorHandler.js         # Centralized error handling
```

---

## ⚙️ Environment Variables

| Variable            | Description                          | Default                               |
|---------------------|--------------------------------------|---------------------------------------|
| `PORT`              | Port the server listens on           | `5000`                                |
| `MONGO_URI`         | MongoDB connection string            | `mongodb://localhost:27017/ticketdb`   |
| `EVENT_SERVICE_URL` | Base URL of the Event Service        | `http://localhost:4000`               |

Create a `.env` file in the project root (use `.env.example` as a template):

```bash
cp .env.example .env
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 🚀 Local Setup

### Prerequisites

- [Node.js 20 LTS](https://nodejs.org/) or higher
- [MongoDB](https://www.mongodb.com/) running locally or a cloud instance (e.g. MongoDB Atlas)
- **Event Service** running (default: `http://localhost:4000`)

### Install & Run

```bash
# Install dependencies
npm install

# Start in development mode (with hot-reload)
npm run dev

# Start in production mode
npm start
```

The service will be available at `http://localhost:5000`.

---

## 🐳 Docker

### Build the Image

```bash
docker build -t ticket-service .
```

### Run the Container

```bash
docker run -d \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/ticketdb \
  -e EVENT_SERVICE_URL=http://host.docker.internal:4000 \
  --name ticket-service \
  ticket-service
```

> Replace `MONGO_URI` and `EVENT_SERVICE_URL` with actual values in production.

---

## 📡 API Endpoints

Base URL: `/api/tickets`

| Method   | Endpoint                    | Description                | Success Code |
|----------|-----------------------------|----------------------------|--------------|
| `POST`   | `/api/tickets`              | Create a new ticket        | `201`        |
| `GET`    | `/api/tickets`              | Get all tickets            | `200`        |
| `GET`    | `/api/tickets/:id`          | Get a single ticket        | `200`        |
| `GET`    | `/api/tickets/user/:userId` | Get tickets by user        | `200`        |
| `PUT`    | `/api/tickets/:id`          | Update a ticket            | `200`        |
| `DELETE` | `/api/tickets/:id`          | Delete a ticket            | `200`        |

### Create Ticket — `POST /api/tickets`

**Request Body:**

```json
{
  "eventId": "665f1a2b3c4d5e6f7a8b9c0d",
  "userId": "665f1a2b3c4d5e6f7a8b9c0e",
  "seatCount": 2,
  "price": 49.99
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "eventId": "665f1a2b3c4d5e6f7a8b9c0d",
    "userId": "665f1a2b3c4d5e6f7a8b9c0e",
    "seatCount": 2,
    "status": "pending",
    "price": 49.99,
    "bookingDate": "2026-02-25T06:50:00.000Z",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Conflict Response (409) — not enough seats:**

```json
{
  "success": false,
  "message": "Insufficient seats. Requested: 5, Available: 2"
}
```

### Get All Tickets — `GET /api/tickets`

Supports optional query filter: `GET /api/tickets?userId=665f1a2b3c4d5e6f7a8b9c0e`

**Response (200):**

```json
{
  "success": true,
  "count": 2,
  "data": [ /* array of ticket objects */ ]
}
```

### Get Ticket by ID — `GET /api/tickets/:id`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "eventId": "...",
    "userId": "...",
    "seatCount": 2,
    "status": "pending",
    "price": 49.99,
    "bookingDate": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Get Tickets by User — `GET /api/tickets/user/:userId`

**Response (200):**

```json
{
  "success": true,
  "count": 1,
  "data": [ /* array of ticket objects */ ]
}
```

### Update Ticket — `PUT /api/tickets/:id`

To cancel a ticket (seats are automatically returned to the Event Service):

```json
{
  "status": "cancelled"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": { /* updated ticket object */ }
}
```

### Delete Ticket — `DELETE /api/tickets/:id`

**Response (200):**

```json
{
  "success": true,
  "message": "Ticket deleted successfully",
  "data": { /* deleted ticket object */ }
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Seat count must be at least 1"]
}
```

---

## 🔗 Inter-Service Communication

This service communicates with the **Event Service** to:

1. **Check seat availability** — `GET /api/events/:eventId` to read `availableSeats`
2. **Reserve seats** — `PUT /api/events/:eventId` to decrement `availableSeats`
3. **Return seats on cancellation** — `PUT /api/events/:eventId` to increment `availableSeats`

If the Event Service is unreachable, the Ticket Service responds with `503 Service Unavailable`.

---

## 🛠 Tech Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **HTTP Client**: Axios (inter-service calls)
- **Containerisation**: Docker (Alpine-based image)
- **Deployment Target**: Azure Container Apps
