const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },
    traceId: { type: String, required: true },
    actor: {
      type: String,
      enum: ["system", "agent", "admin", "user"],
      required: true,
    },
    action: { type: String, required: true }, // e.g., TICKET_CREATED, AGENT_CLASSIFIED
    meta: { type: mongoose.Schema.Types.Mixed }, // For storing extra data
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
