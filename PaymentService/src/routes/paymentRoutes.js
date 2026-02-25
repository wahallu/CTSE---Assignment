const express = require("express");
const router = express.Router();
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentsByUserId,
    updatePayment,
    deletePayment,
} = require("../controllers/paymentController");

// POST   /api/payments              — Process a new payment
router.post("/", createPayment);

// GET    /api/payments              — Get all payments
router.get("/", getAllPayments);

// GET    /api/payments/user/:userId — Get payments by user ID
// NOTE: This route must be defined BEFORE /:id to avoid conflicts
router.get("/user/:userId", getPaymentsByUserId);

// GET    /api/payments/:id          — Get a single payment
router.get("/:id", getPaymentById);

// PUT    /api/payments/:id          — Update payment status
router.put("/:id", updatePayment);

// DELETE /api/payments/:id          — Delete a payment
router.delete("/:id", deletePayment);

module.exports = router;
