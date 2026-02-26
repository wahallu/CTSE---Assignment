require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Health Check ---------------
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Event Service",
        status: "running",
    });
});

// --------------- Routes ---------------
app.use("/api/events", eventRoutes);

// --------------- Centralized Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Event Service running on port ${PORT}`);
    });
});
