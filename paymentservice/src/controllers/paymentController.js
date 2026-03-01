const axios = require("axios");
const Payment = require("../models/Payment");

const TICKET_SERVICE_URL =
    process.env.TICKET_SERVICE_URL || "http://127.0.0.1:5000";

// --------------- Helpers ---------------

/**
 * Verify ticket existence via Ticket Service.
 * Returns the ticket data object or throws with a descriptive error.
 */
const verifyTicket = async (ticketId) => {
    try {
        const { data } = await axios.get(
            `${TICKET_SERVICE_URL}/api/tickets/${ticketId}`
        );
        return data.data; // Ticket Service wraps payload in { success, data }
    } catch (error) {
        if (error.response) {
            const err = new Error(
                error.response.data?.message ||
                `Ticket not found with id ${ticketId}`
            );
            err.statusCode = error.response.status;
            throw err;
        }
        // Network / timeout error
        const err = new Error(
            "Ticket Service is unavailable. Please try again later."
        );
        err.statusCode = 503;
        throw err;
    }
};

// --------------- Controllers ---------------

// @desc    Process a new payment
// @route   POST /api/payments
const createPayment = async (req, res, next) => {
    try {
        const { ticketId, userId, amount, paymentMethod, status } = req.body;

        // ---- Input validation ----
        if (!ticketId || !userId || amount === undefined || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message:
                    "Missing required fields: ticketId, userId, amount, paymentMethod",
            });
        }

        if (typeof amount !== "number" || amount < 0) {
            return res.status(400).json({
                success: false,
                message: "amount must be a number >= 0",
            });
        }

        const validMethods = ["card", "cash", "online"];
        if (!validMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: `paymentMethod must be one of: ${validMethods.join(", ")}`,
            });
        }

        // ---- Verify ticket existence via Ticket Service ----
        const ticket = await verifyTicket(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: `Ticket not found with id ${ticketId}`,
            });
        }

        // ---- Create payment ----
        const payment = await Payment.create({
            ticketId,
            userId,
            amount,
            paymentMethod,
            status: status || "pending",
        });

        res.status(201).json({
            success: true,
            data: {
                _id: payment._id,
                ticketId: payment.ticketId,
                userId: payment.userId,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                status: payment.status,
                paymentDate: payment.paymentDate,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all payments
// @route   GET /api/payments
const getAllPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find().sort({ paymentDate: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single payment by ID
// @route   GET /api/payments/:id
const getPaymentById = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: `Payment not found with id ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all payments for a specific user
// @route   GET /api/payments/user/:userId
const getPaymentsByUserId = async (req, res, next) => {
    try {
        const payments = await Payment.find({
            userId: req.params.userId,
        }).sort({ paymentDate: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update payment status (e.g., mark as completed or failed)
// @route   PUT /api/payments/:id
const updatePayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: `Payment not found with id ${req.params.id}`,
            });
        }

        const updatedPayment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedPayment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
const deletePayment = async (req, res, next) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: `Payment not found with id ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentsByUserId,
    updatePayment,
    deletePayment,
};
