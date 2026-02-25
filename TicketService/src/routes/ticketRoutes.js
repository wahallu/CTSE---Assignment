const express = require("express");
const router = express.Router();
const {
    createTicket,
    getAllTickets,
    getTicketById,
    getTicketsByUserId,
    updateTicket,
    deleteTicket,
} = require("../controllers/ticketController");

// POST   /api/tickets            — Create a new ticket
router.post("/", createTicket);

// GET    /api/tickets            — Get all tickets (supports ?userId filter)
router.get("/", getAllTickets);

// GET    /api/tickets/user/:userId — Get tickets by user ID
// NOTE: This route must be defined BEFORE /:id to avoid conflicts
router.get("/user/:userId", getTicketsByUserId);

// GET    /api/tickets/:id        — Get a single ticket
router.get("/:id", getTicketById);

// PUT    /api/tickets/:id        — Update a ticket
router.put("/:id", updateTicket);

// DELETE /api/tickets/:id        — Delete a ticket
router.delete("/:id", deleteTicket);

module.exports = router;
