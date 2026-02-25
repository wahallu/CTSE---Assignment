# 🎪 EventHub — Event Management UI

A production-ready **React** frontend for the Event Management System, built with **Vite** and connected to microservices (User, Event, Ticket, Payment). Features a dark theme, responsive design, and client-side routing.

---

## 📁 Project Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── Dockerfile
├── .env.example
├── .gitignore
├── public/
└── src/
    ├── main.jsx                    # Entry point
    ├── App.jsx                     # Router + layout
    ├── index.css                   # Design system + styles
    ├── components/
    │   ├── Header.jsx              # Navigation bar
    │   └── EventCard.jsx           # Event listing card
    ├── pages/
    │   ├── Login.jsx               # User login
    │   ├── Register.jsx            # User registration
    │   ├── Events.jsx              # Event listing + search
    │   ├── EventDetails.jsx        # Single event view
    │   ├── Booking.jsx             # Ticket booking flow
    │   ├── Payment.jsx             # Simulated payment
    │   └── MyTickets.jsx           # User's ticket management
    └── services/
        ├── api.js                  # Reusable axios instance
        ├── userService.js          # /api/users
        ├── eventService.js         # /api/events
        ├── ticketService.js        # /api/tickets
        └── paymentService.js       # /api/payments
```

---

## ⚙️ Environment Variables

| Variable       | Description                     | Default                  |
|----------------|---------------------------------|--------------------------|
| `VITE_API_URL` | Backend API base URL            | `http://localhost:4000`  |

Create a `.env` file from the example:

```bash
cp .env.example .env
```

> In production / Docker, set `VITE_API_URL` to your API gateway URL at **build time** (Vite embeds it during `vite build`).

---

## 🚀 Local Setup

### Prerequisites

- [Node.js 20 LTS](https://nodejs.org/) or higher
- Backend services running (User, Event, Ticket, Payment)

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (hot-reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

Dev server runs at `http://localhost:5173`.

---

## 🐳 Docker

### Build the Image

```bash
docker build -t event-management-ui .
```

### Run the Container

```bash
docker run -d -p 80:80 --name event-management-ui event-management-ui
```

The UI will be available at `http://localhost`.

> **Note:** `VITE_API_URL` must be set at **build time**. To use a custom API URL:
> ```bash
> docker build --build-arg VITE_API_URL=https://api.example.com -t event-management-ui .
> ```

---

## 📡 API Endpoints Consumed

| Service  | Base Path        | Key Endpoints                                |
|----------|------------------|----------------------------------------------|
| User     | `/api/users`     | `POST /register`, `POST /login`              |
| Event    | `/api/events`    | `GET /`, `GET /:id`, `POST /`, `PUT /:id`    |
| Ticket   | `/api/tickets`   | `POST /`, `GET /`, `GET /:id`, `GET /user/:userId`, `PUT /:id` |
| Payment  | `/api/payments`  | `POST /`, `GET /:id`, `GET /user/:userId`    |

---

## 🔐 Authentication

This app uses **demo authentication** — the user object from login/register is stored in `localStorage`. No JWT or token-based auth is implemented.

---

## 🗺️ Pages & Routes

| Route                | Page          | Description                            |
|----------------------|---------------|----------------------------------------|
| `/`                  | —             | Redirects to `/events`                 |
| `/login`             | Login         | Email + password sign-in               |
| `/register`          | Register      | Create account form                    |
| `/events`            | Events        | Browse events with search              |
| `/events/:id`        | EventDetails  | Full event details                     |
| `/booking/:eventId`  | Booking       | Book tickets with seat/price preview   |
| `/payment/:ticketId` | Payment       | Simulated payment + confirmation       |
| `/my-tickets`        | MyTickets     | View, pay, or cancel tickets           |

---

## 📝 Next Steps

- **Replace localStorage auth** with secure token-based authentication (JWT / OAuth)
- **Add a UI component library** (e.g. Shadcn, Radix) for richer interactions
- **Configure API Gateway** — point `VITE_API_URL` to a single gateway that routes to microservices
- **Add form libraries** (React Hook Form + Zod) for advanced validation
- **Implement loading skeletons** for better UX during data fetching

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 7
- **Routing**: react-router-dom v7
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS v4 + custom CSS
- **Build**: Vite (dev + production)
- **Deployment**: Docker (nginx) → Azure Container Apps
