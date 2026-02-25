const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const paymentRoutes = require("./routes/paymentRoutes");
const errorHandler = require("./middlewares/errorHandler");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Health Check ---------------
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Payment Service",
        status: "running",
    });
});

// --------------- Routes ---------------
app.use("/api/payments", paymentRoutes);

// --------------- Centralized Error Handler ---------------
app.use(errorHandler);

// --------------- Database Connection & Server Start ---------------
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Payment Service running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });

module.exports = app;
