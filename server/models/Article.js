const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String, index: true }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

// Create a text index on title and body for efficient searching
articleSchema.index({ title: "text", body: "text" });

module.exports = mongoose.model("Article", articleSchema);
