# 🎫 Event Service

A production-ready backend microservice for managing events, built with **Node.js**, **Express.js**, and **MongoDB**. Part of a cloud-based Event Management System using microservices architecture.

---

## 📁 Project Structure

```
Event Service/
├── package.json
├── .env.example
├── .gitignore
├── Dockerfile
├── README.md
└── src/
    ├── app.js                  # Application entry point
    ├── config/
    │   └── db.js               # MongoDB connection
    ├── models/
    │   └── Event.js            # Mongoose Event schema
    ├── controllers/
    │   └── eventController.js  # CRUD request handlers
    ├── routes/
    │   └── eventRoutes.js      # Route definitions
    └── middlewares/
        └── errorHandler.js     # Centralized error handling
```

---

## ⚙️ Environment Variables

| Variable    | Description                    | Default                              |
|-------------|--------------------------------|--------------------------------------|
| `PORT`      | Port the server listens on     | `4000`                               |
| `MONGO_URI` | MongoDB connection string      | `mongodb://localhost:27017/eventdb`   |

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

### Install & Run

```bash
# Install dependencies
npm install

# Start in development mode (with hot-reload)
npm run dev

# Start in production mode
npm start
```

The service will be available at `http://localhost:4000`.

---

## 🐳 Docker

### Build the Image

```bash
docker build -t event-service .
```

### Run the Container

```bash
docker run -d \
  -p 4000:4000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/eventdb \
  --name event-service \
  event-service
```

> Replace `MONGO_URI` with your actual MongoDB connection string in production.

---

## 📡 API Endpoints

Base URL: `/api/events`

| Method   | Endpoint           | Description              | Success Code |
|----------|--------------------|--------------------------|--------------|
| `POST`   | `/api/events`      | Create a new event       | `201`        |
| `GET`    | `/api/events`      | Get all events           | `200`        |
| `GET`    | `/api/events/:id`  | Get a single event       | `200`        |
| `PUT`    | `/api/events/:id`  | Update an event          | `200`        |
| `DELETE` | `/api/events/:id`  | Delete an event          | `200`        |

### Request Body (POST / PUT)

```json
{
  "name": "Tech Conference 2026",
  "location": "Colombo, Sri Lanka",
  "date": "2026-06-15T09:00:00.000Z",
  "availableSeats": 500
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Tech Conference 2026",
    "location": "Colombo, Sri Lanka",
    "date": "2026-06-15T09:00:00.000Z",
    "availableSeats": 500,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Event name is required"]
}
```

---

## 🔗 Integration with Ticket Booking Service

The `GET /api/events/:id` endpoint returns `availableSeats` in a consistent JSON format, enabling the Ticket Booking Service to validate seat availability before confirming bookings.

---

## 🛠 Tech Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Containerisation**: Docker (Alpine-based image)
- **Deployment Target**: Azure Container Apps
