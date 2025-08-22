// Deterministic LLM Stub Provider

/**
 * @typedef {Object} ClassificationResult
 * @property {string} predictedCategory - One of 'billing', 'tech', 'shipping', 'other'.
 * @property {number} confidence - A score from 0.0 to 1.0.
 */

/**
 * @typedef {Object} DraftResult
 * @property {string} draftReply - The suggested reply text.
 * @property {string[]} citations - An array of article IDs used.
 */

class LLMProvider {
  /**
   * **IMPROVED LOGIC**
   * Classifies text by counting keyword matches for each category
   * and selecting the one with the highest score.
   * @param {string} text The input text from the ticket.
   * @returns {Promise<ClassificationResult>}
   */
  async classify(text) {
    const lowerText = text.toLowerCase();

    const categories = {
      billing: {
        keywords: /\b(refund|invoice|charge|payment|bill|double charge)\b/g,
        score: 0,
      },
      tech: {
        keywords: /\b(error|bug|stack|crash|500|fail|not working|login)\b/g,
        score: 0,
      },
      shipping: {
        keywords: /\b(delivery|shipment|package|track|where is|late)\b/g,
        score: 0,
      },
    };

    let totalMatches = 0;
    for (const category in categories) {
      const matches = (lowerText.match(categories[category].keywords) || [])
        .length;
      categories[category].score = matches;
      totalMatches += matches;
    }

    let predictedCategory = "other";
    let highestScore = 0;

    for (const category in categories) {
      if (categories[category].score > highestScore) {
        highestScore = categories[category].score;
        predictedCategory = category;
      }
    }

    // Generate a pseudo-confidence score
    let confidence = 0.4; // Base confidence for 'other'
    if (totalMatches > 0 && highestScore > 0) {
      // Confidence is based on the proportion of matches for the winning category
      // with a base of 0.7 for having at least one strong indicator.
      confidence = 0.7 + (highestScore / totalMatches) * 0.25;
    }

    return {
      predictedCategory,
      confidence: Math.min(confidence, 0.99), // Cap confidence at 0.99
    };
  }

  /**
   * Drafts a reply using a simple template.
   * @param {string} ticketContent The title and description of the ticket.
   * @param {Array<Object>} articles An array of KB articles with _id and title.
   * @returns {Promise<DraftResult>}
   */
  async draft(ticketContent, articles) {
    const citations = articles.map((a) => a._id.toString());

    if (!articles || articles.length === 0) {
      return {
        draftReply:
          "Hello,\n\nThank you for reaching out. We are looking into your issue and will get back to you shortly. We couldn't find any specific articles related to your problem at this moment.\n\nBest,\nYour AI Assistant",
        citations: [],
      };
    }

    const shortDescription =
      ticketContent.length > 60
        ? `${ticketContent.substring(0, 60)}...`
        : ticketContent;

    const articleList = articles
      .map((a, i) => `${i + 1}. "${a.title}"`)
      .join("\n  ");

    const draftReply = `Hello,
  
  Thank you for your query regarding: "${shortDescription}".
  
  Based on your question, we found some articles that might help:
    ${articleList}
  
  Please review them and let us know if they resolve your issue. If not, a support agent will get back to you.
  
  Best,
  Your AI Assistant`;

    return { draftReply, citations };
  }
}

const llmProvider = new LLMProvider();
module.exports = llmProvider;
