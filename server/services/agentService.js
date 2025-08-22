const { v4: uuidv4 } = require("uuid");
const llmProvider = require("./llmProvider");
const Ticket = require("../models/Ticket");
const Article = require("../models/Article");
const AgentSuggestion = require("../models/AgentSuggestion");
const AuditLog = require("../models/AuditLog");
const Config = require("../models/Config");

// Helper function to create consistent audit logs
const createLog = async (ticketId, traceId, actor, action, meta = {}) => {
  try {
    const log = new AuditLog({ ticketId, traceId, actor, action, meta });
    await log.save();
    console.log(`[TraceID: ${traceId}] Action: ${action}`);
  } catch (error) {
    console.error(`Failed to create audit log for action ${action}`, error);
  }
};

const startTriage = async (ticketId) => {
  const traceId = uuidv4();
  const startTime = Date.now();

  await createLog(ticketId, traceId, "system", "TRIAGE_STARTED");

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      console.error(`Triage failed: Ticket ${ticketId} not found.`);
      return;
    }

    // 1. Classify the ticket
    const classificationResult = await llmProvider.classify(
      `${ticket.title} ${ticket.description}`
    );
    await createLog(ticketId, traceId, "system", "AGENT_CLASSIFIED", {
      result: classificationResult,
    });

    // 2. Retrieve relevant KB articles
    const searchKeywords = ticket.title.split(" ").join("|");
    const articles = await Article.find({
      $or: [
        { title: { $regex: searchKeywords, $options: "i" } },
        { tags: classificationResult.predictedCategory },
      ],
      status: "published",
    }).limit(3);
    await createLog(ticketId, traceId, "system", "KB_RETRIEVED", {
      count: articles.length,
      articleIds: articles.map((a) => a._id),
    });

    // 3. Draft a reply
    const draftResult = await llmProvider.draft(
      `${ticket.title}: ${ticket.description}`,
      articles
    );
    await createLog(ticketId, traceId, "system", "DRAFT_GENERATED");

    const triageDuration = Date.now() - startTime;

    // 4. Store the suggestion
    const suggestion = new AgentSuggestion({
      ticketId,
      predictedCategory: classificationResult.predictedCategory,
      articleIds: articles.map((a) => a._id),
      draftReply: draftResult.draftReply,
      confidence: classificationResult.confidence,
      autoClosed: false,
      modelInfo: {
        provider: process.env.STUB_MODE ? "stub" : "openai",
        model: "keyword-v1",
        promptVersion: "1.0.0",
        latencyMs: triageDuration,
      },
    });
    await suggestion.save();

    ticket.agentSuggestionId = suggestion._id;

    // 5. Make a decision: auto-close or assign to human
    const config = (await Config.findOne()) || new Config();

    if (
      config.autoCloseEnabled &&
      suggestion.confidence >= config.confidenceThreshold
    ) {
      suggestion.autoClosed = true;
      await suggestion.save();
      ticket.status = "resolved";

      await createLog(ticketId, traceId, "system", "AUTO_REPLY_SENT", {
        reply: draftResult.draftReply,
        citations: articles.map((a) => ({ _id: a._id, title: a.title })),
      });

      await createLog(ticketId, traceId, "system", "AUTO_CLOSED", {
        confidence: suggestion.confidence,
        threshold: config.confidenceThreshold,
      });
    } else {
      ticket.status = "waiting_human";
      await createLog(ticketId, traceId, "system", "ASSIGNED_TO_HUMAN", {
        confidence: suggestion.confidence,
        threshold: config.confidenceThreshold,
      });
    }

    await ticket.save();
    await createLog(ticketId, traceId, "system", "TRIAGE_COMPLETED");
  } catch (error) {
    console.error(
      `[TraceID: ${traceId}] Error during triage for ticket ${ticketId}:`,
      error
    );
    await createLog(ticketId, traceId, "system", "TRIAGE_FAILED", {
      error: error.message,
    });
  }
};

module.exports = { startTriage };
