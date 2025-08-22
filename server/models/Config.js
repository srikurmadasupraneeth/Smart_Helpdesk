const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  autoCloseEnabled: { type: Boolean, default: true },
  confidenceThreshold: {
    type: Number,
    default: 0.75,
    min: 0,
    max: 1,
  },
  slaHours: { type: Number, default: 24 },
});

// Use a singleton pattern by naming the collection specifically
// This ensures there's only ever one config document.
module.exports = mongoose.model("Config", configSchema, "config");
