const { buildInterviewPrompt } = require('../prompts/interviewPrompt');
const { buildFeedbackPrompt } = require('../prompts/feedbackPrompt');
const llmService = require('./llm.service');

/**
 * Gets the next interview question from the AI.
 *
 * @param {object} piq - Candidate's PIQ data.
 * @param {Array<{role: string, content: string}>} messages - Conversation history.
 * @param {string} userMessage - The candidate's latest message.
 * @returns {string} The AI interviewer's next question.
 */
async function getNextQuestion(piq, messages, userMessage) {
  // Add the user's new message to history
  const updatedMessages = [...messages, { role: 'user', content: userMessage }];

  // Build prompt using interview prompt template
  const { systemPrompt, chatHistory } = buildInterviewPrompt(piq, updatedMessages);

  // Call LLM
  const response = await llmService.chat(systemPrompt, chatHistory);

  return response;
}

/**
 * Generates preparation advice after the interview ends.
 *
 * @param {object} piq - Candidate's PIQ data.
 * @param {Array<{role: string, content: string}>} conversation - Full conversation history.
 * @returns {string} Preparation advice from the AI.
 */
async function getFeedback(piq, conversation) {
  // Build prompt using feedback prompt template
  const { systemPrompt, conversationText } = buildFeedbackPrompt(piq, conversation);

  // Call LLM with the conversation as a single user message
  const chatHistory = [
    { role: 'user', parts: [{ text: conversationText }] },
  ];

  const response = await llmService.chat(systemPrompt, chatHistory);

  return response;
}

module.exports = { getNextQuestion, getFeedback };
