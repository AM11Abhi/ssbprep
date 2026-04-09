/**
 * LLM Service — Abstraction layer for LLM providers.
 *
 * Supports Gemini and Groq as providers.
 * Uses generateContent() / chat.completions.create() to keep the backend stateless.
 * All conversation context is passed in each request — no sessions.
 *
 * Switch providers via environment variable:
 *   LLM_PROVIDER=gemini  (default)
 *   LLM_PROVIDER=groq
 */

const LLM_PROVIDER = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();

// --- Gemini setup ---
let geminiAI;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

if (LLM_PROVIDER === 'gemini') {
  const { GoogleGenAI } = require('@google/genai');
  geminiAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// --- Groq setup ---
let groqClient;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

if (LLM_PROVIDER === 'groq') {
  const Groq = require('groq-sdk');
  groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

console.log(`LLM Provider: ${LLM_PROVIDER} | Model: ${LLM_PROVIDER === 'groq' ? GROQ_MODEL : GEMINI_MODEL}`);

/**
 * Converts Gemini-format contents to OpenAI-style messages (used by Groq).
 *
 * Gemini:  { role: "user"|"model", parts: [{ text: "..." }] }
 * OpenAI:  { role: "user"|"assistant", content: "..." }
 */
function geminiToOpenAIMessages(systemInstruction, contents) {
  const messages = [
    { role: 'system', content: systemInstruction },
  ];

  for (const msg of contents) {
    messages.push({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.parts.map((p) => p.text).join(''),
    });
  }

  return messages;
}

/**
 * Sends a stateless request to the configured LLM provider.
 *
 * @param {string} systemInstruction - System-level instructions for the model.
 * @param {Array<{role: string, parts: Array<{text: string}>}>} contents - Conversation in Gemini format.
 * @param {object} [options] - Optional config overrides.
 * @param {number} [options.maxOutputTokens=300] - Max tokens for the response.
 * @returns {Promise<string>} The model's response text.
 */
const MAX_OUTPUT_TOKENS = 1200; // Hard ceiling — prevents runaway cost

async function chat(systemInstruction, contents, options = {}) {
  // Clamp: default 300 for chat, 1024 for feedback, never above 1200
  const maxTokens = Math.min(options.maxOutputTokens || 300, MAX_OUTPUT_TOKENS);

  if (LLM_PROVIDER === 'groq') {
    return chatGroq(systemInstruction, contents, maxTokens);
  }

  return chatGemini(systemInstruction, contents, maxTokens);
}


// --- Gemini implementation ---
async function chatGemini(systemInstruction, contents, maxTokens) {
  const response = await geminiAI.models.generateContent({
    model: GEMINI_MODEL,
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
      maxOutputTokens: maxTokens,
      temperature: 0.7,
    },
  });

  return response.text || 'Could you please elaborate on that?';
}

// --- Groq implementation ---
async function chatGroq(systemInstruction, contents, maxTokens) {
  const messages = geminiToOpenAIMessages(systemInstruction, contents);

  const response = await groqClient.chat.completions.create({
    model: GROQ_MODEL,
    messages: messages,
    max_tokens: maxTokens,
    temperature: 0.7,
  });

  const text = response.choices?.[0]?.message?.content;
  return text || 'Could you please elaborate on that?';
}

module.exports = { chat };
