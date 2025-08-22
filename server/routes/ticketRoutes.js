const express = require("express");
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  getTicketAudit,
  postReply,
  resolveTicket,
  reopenTicket,
} = require("../controllers/ticketController");
const { protect, agent } = require("../middleware/authMiddleware");

// User-accessible routes
router.route("/").post(protect, createTicket).get(protect, getTickets);
router.route("/:id").get(protect, getTicketById);
router.route("/:id/audit").get(protect, getTicketAudit);

// Agent/Admin-only routes
router.route("/:id/reply").post(protect, agent, postReply);
router.route("/:id/resolve").post(protect, agent, resolveTicket);
router.route("/:id/reopen").post(protect, agent, reopenTicket);

module.exports = router;
