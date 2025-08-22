const express = require("express");
const router = express.Router();
const { getSuggestionForTicket } = require("../controllers/agentController");
const { protect, agent } = require("../middleware/authMiddleware");

// Route for agents/admins to fetch the AI-generated suggestion for a ticket
router.get("/suggestion/:ticketId", protect, agent, getSuggestionForTicket);

module.exports = router;
