const rateLimit = require("express-rate-limit");

/**
 * Rate limiter — 100 requests per 15 minutes per IP.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later",
    },
});

module.exports = limiter;
