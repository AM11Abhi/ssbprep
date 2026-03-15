/**
 * LLM Service — Abstraction layer for the LLM API.
 *
 * Currently a placeholder. Actual Gemini integration will be
 * implemented in Phase 2.
 *
 * This abstraction lets us switch LLM providers later without
 * changing the interview service.
 */

/**
 * Sends a chat request to the LLM.
 *
 * @param {string} systemPrompt - System-level instructions for the model.
 * @param {Array<{role: string, parts: Array<{text: string}>}>} chatHistory - Conversation history in Gemini format.
 * @returns {string} The model's response text.
 */
async function chat(systemPrompt, chatHistory) {
  // TODO: Phase 2 — Replace with actual Gemini API call
  return '[LLM placeholder] — Gemini integration pending (Phase 2)';
}

module.exports = { chat };
