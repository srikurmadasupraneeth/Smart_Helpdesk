const AgentSuggestion = require("../models/AgentSuggestion");

const getSuggestionForTicket = async (req, res) => {
  try {
    const suggestion = await AgentSuggestion.findOne({
      ticketId: req.params.ticketId,
    }).populate("articleIds", "title");

    if (suggestion) {
      res.json(suggestion);
    } else {
      // 404 is appropriate if the suggestion hasn't been generated yet or doesn't exist.
      res
        .status(404)
        .json({ message: "Suggestion not found or not yet generated." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getSuggestionForTicket };
