const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event ID is required"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        seatCount: {
            type: Number,
            required: [true, "Seat count is required"],
            min: [1, "Seat count must be at least 1"],
            validate: {
                validator: Number.isInteger,
                message: "Seat count must be an integer",
            },
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["booked", "cancelled", "pending"],
                message: "Status must be one of: booked, cancelled, pending",
            },
            default: "pending",
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Ticket", ticketSchema);
