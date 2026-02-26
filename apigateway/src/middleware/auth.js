const jwt = require("jsonwebtoken");

/**
 * JWT authentication middleware for the API Gateway.
 * Verifies the Bearer token and attaches the decoded payload to req.user.
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "eventhub"
        );

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token is invalid",
        });
    }
};

module.exports = { authenticate };
