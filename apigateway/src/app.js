require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const { authenticate } = require("./middleware/auth");
const rateLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 7000;

// ─── Service URLs ───────────────────────────────────────────────
const USER_SERVICE_URL =
    process.env.USER_SERVICE_URL || "http://localhost:3000";
const EVENT_SERVICE_URL =
    process.env.EVENT_SERVICE_URL || "http://localhost:4000";
const TICKET_SERVICE_URL =
    process.env.TICKET_SERVICE_URL || "http://localhost:5000";
const PAYMENT_SERVICE_URL =
    process.env.PAYMENT_SERVICE_URL || "http://localhost:6000";

// ─── Global Middleware ──────────────────────────────────────────
app.use(cors());
app.use(morgan("dev"));
app.use(rateLimiter);

// ─── Health Check ───────────────────────────────────────────────
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        service: "API Gateway",
        status: "running",
    });
});

// ─── Public paths that skip authentication ──────────────────────
const PUBLIC_PATHS = ["/api/users/register", "/api/users/login"];

/**
 * Conditionally apply auth — skip for public paths.
 */
const conditionalAuth = (req, res, next) => {
    if (PUBLIC_PATHS.some((p) => req.originalUrl.startsWith(p))) {
        return next();
    }
    return authenticate(req, res, next);
};

// ─── Proxy Options Factory ──────────────────────────────────────
const proxyOptions = (target) => ({
    target,
    changeOrigin: true,
    onError: (err, req, res) => {
        console.error(`Proxy error: ${err.message}`);
        res.status(502).json({
            success: false,
            message: "Service unavailable",
        });
    },
});

// ─── Route Proxies ──────────────────────────────────────────────
app.use(
    "/api/users",
    conditionalAuth,
    createProxyMiddleware(proxyOptions(USER_SERVICE_URL))
);

app.use(
    "/api/events",
    createProxyMiddleware(proxyOptions(EVENT_SERVICE_URL))
);

app.use(
    "/api/tickets",
    authenticate,
    createProxyMiddleware(proxyOptions(TICKET_SERVICE_URL))
);

app.use(
    "/api/payments",
    authenticate,
    createProxyMiddleware(proxyOptions(PAYMENT_SERVICE_URL))
);

// ─── Centralized Error Handling ─────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`   → User Service:    ${USER_SERVICE_URL}`);
    console.log(`   → Event Service:   ${EVENT_SERVICE_URL}`);
    console.log(`   → Ticket Service:  ${TICKET_SERVICE_URL}`);
    console.log(`   → Payment Service: ${PAYMENT_SERVICE_URL}`);
});

module.exports = app;
