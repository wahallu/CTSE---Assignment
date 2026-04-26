require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const ticketRoutes = require("./routes/ticketRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Health Check ---------------
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Ticket Service",
        status: "running",
    });
});

// --------------- Routes ---------------
app.use("/api/tickets", ticketRoutes);

// --------------- Centralized Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Ticket Service running on port ${PORT}`);
    });
});

// test commit