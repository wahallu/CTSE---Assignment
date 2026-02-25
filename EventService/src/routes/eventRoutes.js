const express = require("express");
const router = express.Router();
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} = require("../controllers/eventController");

// POST   /api/events       — Create a new event
router.post("/", createEvent);

// GET    /api/events       — Get all events
router.get("/", getAllEvents);

// GET    /api/events/:id   — Get a single event
router.get("/:id", getEventById);

// PUT    /api/events/:id   — Update an event
router.put("/:id", updateEvent);

// DELETE /api/events/:id   — Delete an event
router.delete("/:id", deleteEvent);

module.exports = router;
