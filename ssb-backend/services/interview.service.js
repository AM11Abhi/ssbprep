const { buildInterviewPrompt } = require('../prompts/interviewPrompt');
const { buildFeedbackPrompt } = require('../prompts/feedbackPrompt');
const llmService = require('./llm.service');

/**
 * Gets the next interview question from the AI.
 *
 * @param {object} piq - Candidate's PIQ data.
 * @param {Array<{role: string, content: string}>} messages - Conversation history.
 * @param {string} userMessage - The candidate's latest message.
 * @returns {Promise<string>} The AI interviewer's next question.
 */
async function getNextQuestion(piq, messages, userMessage) {
  // Add the user's new message to history
  const updatedMessages = [...messages, { role: 'user', content: userMessage }];

  // Build prompt — returns { systemInstruction, contents }
  const { systemInstruction, contents } = buildInterviewPrompt(piq, updatedMessages);

  // Call LLM (stateless — full context is sent each time)
  const response = await llmService.chat(systemInstruction, contents);

  return response;
}

/**
 * Generates preparation advice after the interview ends.
 *
 * @param {object} piq - Candidate's PIQ data.
 * @param {Array<{role: string, content: string}>} conversation - Full conversation history.
 * @returns {Promise<string>} Preparation advice from the AI.
 */
async function getFeedback(piq, conversation) {
  // Build prompt — returns { systemInstruction, contents }
  const { systemInstruction, contents } = buildFeedbackPrompt(piq, conversation);

  // Call LLM — higher token limit for detailed multi-section advice
  const response = await llmService.chat(systemInstruction, contents, { maxOutputTokens: 1024 });

  return response;
}

module.exports = { getNextQuestion, getFeedback };
