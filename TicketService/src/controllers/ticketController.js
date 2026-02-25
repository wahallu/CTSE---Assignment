const axios = require("axios");
const Ticket = require("../models/Ticket");

const EVENT_SERVICE_URL =
    process.env.EVENT_SERVICE_URL || "http://localhost:4000";

// --------------- Helpers ---------------

/**
 * Fetch event details from Event Service.
 * Returns the event data object or throws with a descriptive error.
 */
const fetchEvent = async (eventId) => {
    try {
        const { data } = await axios.get(
            `${EVENT_SERVICE_URL}/api/events/${eventId}`
        );
        return data.data; // Event Service wraps payload in { success, data }
    } catch (error) {
        if (error.response) {
            const err = new Error(
                error.response.data?.message ||
                `Event not found with id ${eventId}`
            );
            err.statusCode = error.response.status;
            throw err;
        }
        // Network / timeout error
        const err = new Error(
            "Event Service is unavailable. Please try again later."
        );
        err.statusCode = 503;
        throw err;
    }
};

/**
 * Update availableSeats on Event Service via PUT.
 */
const updateEventSeats = async (eventId, newSeatCount) => {
    try {
        await axios.put(`${EVENT_SERVICE_URL}/api/events/${eventId}`, {
            availableSeats: newSeatCount,
        });
    } catch (error) {
        if (error.response) {
            const err = new Error(
                error.response.data?.message ||
                "Failed to update seats on Event Service"
            );
            err.statusCode = error.response.status;
            throw err;
        }
        const err = new Error(
            "Event Service is unavailable. Please try again later."
        );
        err.statusCode = 503;
        throw err;
    }
};

// --------------- Controllers ---------------

// @desc    Create a new ticket
// @route   POST /api/tickets
const createTicket = async (req, res, next) => {
    try {
        const { eventId, userId, seatCount, price, status } = req.body;

        // ---- Input validation ----
        if (!eventId || !userId || !seatCount || price === undefined) {
            return res.status(400).json({
                success: false,
                message:
                    "Missing required fields: eventId, userId, seatCount, price",
            });
        }

        if (!Number.isInteger(seatCount) || seatCount < 1) {
            return res.status(400).json({
                success: false,
                message: "seatCount must be an integer >= 1",
            });
        }

        if (typeof price !== "number" || price < 0) {
            return res.status(400).json({
                success: false,
                message: "price must be a number >= 0",
            });
        }

        // ---- Check seat availability via Event Service ----
        const event = await fetchEvent(eventId);

        if (event.availableSeats < seatCount) {
            return res.status(409).json({
                success: false,
                message: `Insufficient seats. Requested: ${seatCount}, Available: ${event.availableSeats}`,
            });
        }

        // ---- Reserve seats (decrement on Event Service) ----
        await updateEventSeats(eventId, event.availableSeats - seatCount);

        // ---- Create ticket ----
        const ticket = await Ticket.create({
            eventId,
            userId,
            seatCount,
            price,
            status: status || "pending",
        });

        res.status(201).json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all tickets (supports optional ?userId filter)
// @route   GET /api/tickets
const getAllTickets = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.userId) {
            filter.userId = req.query.userId;
        }

        const tickets = await Ticket.find(filter).sort({ bookingDate: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single ticket by ID
// @route   GET /api/tickets/:id
const getTicketById = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: `Ticket not found with id ${req.params.id}`,
            });
        }

        // Consistent JSON format for inter-service communication
        res.status(200).json({
            success: true,
            data: {
                _id: ticket._id,
                eventId: ticket.eventId,
                userId: ticket.userId,
                seatCount: ticket.seatCount,
                status: ticket.status,
                price: ticket.price,
                bookingDate: ticket.bookingDate,
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get tickets by user ID
// @route   GET /api/tickets/user/:userId
const getTicketsByUserId = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({
            userId: req.params.userId,
        }).sort({ bookingDate: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a ticket (e.g., change status to cancelled)
// @route   PUT /api/tickets/:id
const updateTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: `Ticket not found with id ${req.params.id}`,
            });
        }

        // If cancelling, return seats to Event Service
        if (
            req.body.status === "cancelled" &&
            ticket.status !== "cancelled"
        ) {
            const event = await fetchEvent(ticket.eventId);
            await updateEventSeats(
                ticket.eventId,
                event.availableSeats + ticket.seatCount
            );
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedTicket,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a ticket
// @route   DELETE /api/tickets/:id
const deleteTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: `Ticket not found with id ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully",
            data: ticket,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    getTicketsByUserId,
    updateTicket,
    deleteTicket,
};
