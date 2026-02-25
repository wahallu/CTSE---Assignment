# 💳 Payment Service

> Microservice for processing and managing payments in the **Event Management System**.

Built with **Node.js**, **Express.js**, and **MongoDB** — designed for deployment on **Azure Container Apps**.

---

## 📁 Project Structure

```
PaymentService/
├── src/
│   ├── app.js                  # Entry point
│   ├── controllers/
│   │   └── paymentController.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Payment.js
│   └── routes/
│       └── paymentRoutes.js
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

| Variable             | Description                          | Default                   |
| -------------------- | ------------------------------------ | ------------------------- |
| `PORT`               | Port the service listens on          | `4000`                    |
| `MONGO_URI`          | MongoDB connection string            | —                         |
| `TICKET_SERVICE_URL` | Base URL of the Ticket Service       | `http://localhost:5000`   |

Create a `.env` file from the template:

```bash
cp .env.example .env
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ (LTS)
- **MongoDB** (local or Atlas)
- **Ticket Service** running (for inter-service ticket verification)

### Install Dependencies

```bash
npm install
```

### Run in Development Mode

```bash
npm run dev
```

### Run in Production Mode

```bash
npm start
```

---

## 🐳 Docker

### Build the Image

```bash
docker build -t payment-service .
```

### Run the Container

```bash
docker run -p 4000:4000 \
  -e MONGO_URI=your_mongodb_connection_string \
  -e TICKET_SERVICE_URL=http://ticket-service:5000 \
  payment-service
```

---

## 📡 API Endpoints

Base URL: `/api/payments`

| Method   | Endpoint                     | Description                        |
| -------- | ---------------------------- | ---------------------------------- |
| `POST`   | `/api/payments`              | Process a new payment              |
| `GET`    | `/api/payments`              | Retrieve all payments              |
| `GET`    | `/api/payments/:id`          | Retrieve a single payment          |
| `GET`    | `/api/payments/user/:userId` | Retrieve all payments for a user   |
| `PUT`    | `/api/payments/:id`          | Update payment status              |
| `DELETE` | `/api/payments/:id`          | Delete a payment                   |

### Request / Response Examples

#### POST `/api/payments`

**Request Body:**

```json
{
  "ticketId": "664f1a2b3c4d5e6f7a8b9c0d",
  "userId": "664f1a2b3c4d5e6f7a8b9c0e",
  "amount": 2500,
  "paymentMethod": "card"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0f",
    "ticketId": "664f1a2b3c4d5e6f7a8b9c0d",
    "userId": "664f1a2b3c4d5e6f7a8b9c0e",
    "amount": 2500,
    "paymentMethod": "card",
    "status": "pending",
    "paymentDate": "2026-02-25T09:00:00.000Z",
    "createdAt": "2026-02-25T09:00:00.000Z",
    "updatedAt": "2026-02-25T09:00:00.000Z"
  }
}
```

#### PUT `/api/payments/:id`

**Request Body:**

```json
{
  "status": "completed"
}
```

---

## 🔗 Inter-Service Communication

When creating a payment, the service verifies the ticket exists by calling:

```
GET {TICKET_SERVICE_URL}/api/tickets/{ticketId}
```

- Returns **404** if the ticket does not exist.
- Returns **503** if the Ticket Service is unavailable.

---

## 🛠 Tech Stack

- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **HTTP Client:** Axios
- **Containerization:** Docker (Alpine)
- **Deployment Target:** Azure Container Apps
