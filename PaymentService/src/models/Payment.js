const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            required: [true, "Ticket ID is required"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount must be greater than or equal to 0"],
        },
        paymentMethod: {
            type: String,
            required: [true, "Payment method is required"],
            enum: {
                values: ["card", "cash", "online"],
                message: "Payment method must be one of: card, cash, online",
            },
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["pending", "completed", "failed"],
                message: "Status must be one of: pending, completed, failed",
            },
            default: "pending",
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Payment", paymentSchema);
