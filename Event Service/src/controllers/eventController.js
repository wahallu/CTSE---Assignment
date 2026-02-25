const Event = require("../models/Event");

// @desc    Create a new event
// @route   POST /api/events
const createEvent = async (req, res, next) => {
    try {
        const { name, location, date, availableSeats } = req.body;

        const event = await Event.create({ name, location, date, availableSeats });

        res.status(201).json({
            success: true,
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all events
// @route   GET /api/events
const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: `Event not found with id ${req.params.id}`,
            });
        }

        // Consistent JSON format for Ticket Booking Service integration
        res.status(200).json({
            success: true,
            data: {
                _id: event._id,
                name: event.name,
                location: event.location,
                date: event.date,
                availableSeats: event.availableSeats,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
const updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: `Event not found with id ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: `Event not found with id ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
