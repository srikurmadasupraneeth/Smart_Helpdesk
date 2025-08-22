import { describe, it, expect } from "vitest";
import llmProvider from "../services/llmProvider"; // Testing the stub directly

describe("Agentic Triage LLM Stub", () => {
  it("should classify billing issues correctly", async () => {
    const result = await llmProvider.classify(
      "I got a double charge on my invoice"
    );
    expect(result.predictedCategory).toBe("billing");
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it("should classify tech issues correctly", async () => {
    const result = await llmProvider.classify(
      "The app is showing a 500 error and a stack trace"
    );
    expect(result.predictedCategory).toBe("tech");
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it("should classify shipping issues correctly", async () => {
    const result = await llmProvider.classify(
      "Where is my shipment? The delivery is late."
    );
    expect(result.predictedCategory).toBe("shipping");
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it("should default to 'other' for ambiguous text", async () => {
    const result = await llmProvider.classify("Hello, I need some help.");
    expect(result.predictedCategory).toBe("other");
    expect(result.confidence).toBeLessThan(0.5);
  });

  it("should draft a reply with citations when articles are found", async () => {
    const articles = [
      { _id: "1", title: "How to reset password" },
      { _id: "2", title: "Troubleshooting login" },
    ];
    const result = await llmProvider.draft("I cannot log in", articles);
    expect(result.draftReply).toContain("How to reset password");
    expect(result.draftReply).toContain("Troubleshooting login");
    expect(result.citations).toEqual(["1", "2"]);
  });

  it("should draft a generic reply when no articles are found", async () => {
    const result = await llmProvider.draft("Some obscure issue", []);
    expect(result.draftReply).toContain("couldn't find any specific articles");
    expect(result.citations).toEqual([]);
  });
});
