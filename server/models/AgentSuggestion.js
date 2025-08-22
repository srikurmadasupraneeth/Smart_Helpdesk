const mongoose = require("mongoose");

const agentSuggestionSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },
    predictedCategory: { type: String },
    articleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    draftReply: { type: String },
    confidence: { type: Number },
    autoClosed: { type: Boolean, default: false },
    modelInfo: {
      provider: String,
      model: String,
      promptVersion: String,
      latencyMs: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgentSuggestion", agentSuggestionSchema);
