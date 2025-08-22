const Ticket = require("../models/Ticket");
const AuditLog = require("../models/AuditLog");
const { v4: uuidv4 } = require("uuid");
const { startTriage } = require("../services/agentService");

// User: Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const ticket = new Ticket({
      title,
      description,
      category: category || "other",
      createdBy: req.user._id, // Set from auth middleware
    });
    const createdTicket = await ticket.save();

    // Asynchronously start the AI triage process
    startTriage(createdTicket._id);

    res.status(201).json(createdTicket);
  } catch (error) {
    res.status(400).json({ message: "Invalid ticket data" });
  }
};

// Get tickets based on user role and status filters
const getTickets = async (req, res) => {
  try {
    const filter = {};
    // Regular users can only see their own tickets
    if (req.user.role === "user") {
      filter.createdBy = req.user._id;
    }
    // Filter by status if query param is present
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name")
      .populate("assignee", "name")
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignee", "name email");
    if (ticket) {
      // Users should only access their own tickets, agents/admins can access all
      if (
        req.user.role !== "user" ||
        ticket.createdBy._id.equals(req.user._id)
      ) {
        res.json(ticket);
      } else {
        res.status(403).json({ message: "Not authorized to view this ticket" });
      }
    } else {
      res.status(404).json({ message: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get the audit log for a specific ticket
const getTicketAudit = async (req, res) => {
  try {
    const auditLogs = await AuditLog.find({ ticketId: req.params.id }).sort({
      createdAt: "asc",
    });
    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Agent/Admin: Post a reply to a ticket
const postReply = async (req, res) => {
  try {
    const { reply } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (ticket) {
      // For simplicity, replies are stored in the audit log.
      // A more complex system might have a dedicated 'replies' array in the Ticket model.
      await new AuditLog({
        ticketId: ticket._id,
        traceId: uuidv4(), // New trace for this specific action
        actor: req.user.role, // 'agent' or 'admin'
        action: "REPLY_SENT",
        meta: { reply, author: req.user.name },
      }).save();

      ticket.status = "waiting_customer"; // Status changes after agent replies
      await ticket.save();
      res.json(ticket);
    } else {
      res.status(404).json({ message: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Agent/Admin: Resolve a ticket
const resolveTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (ticket) {
      ticket.status = "resolved";
      await ticket.save();
      await new AuditLog({
        ticketId: ticket._id,
        traceId: uuidv4(),
        actor: req.user.role,
        action: "TICKET_RESOLVED",
        meta: { resolver: req.user.name },
      }).save();
      res.json(ticket);
    } else {
      res.status(404).json({ message: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Agent/Admin: Reopen a ticket
const reopenTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (ticket) {
      ticket.status = "waiting_human"; // Reopened tickets go back to agents
      await ticket.save();
      await new AuditLog({
        ticketId: ticket._id,
        traceId: uuidv4(),
        actor: req.user.role,
        action: "TICKET_REOPENED",
        meta: { reopener: req.user.name },
      }).save();
      res.json(ticket);
    } else {
      res.status(404).json({ message: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  getTicketAudit,
  postReply,
  resolveTicket,
  reopenTicket,
};
