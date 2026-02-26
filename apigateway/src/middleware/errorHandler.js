/**
 * Centralized error handler for the API Gateway.
 */
const errorHandler = (err, req, res, _next) => {
    console.error(`[Gateway Error] ${err.message}`);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

module.exports = errorHandler;
