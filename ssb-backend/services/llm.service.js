/**
 * LLM Service — Abstraction layer for the Gemini API.
 *
 * Uses generateContent() directly to keep the backend fully stateless.
 * All conversation context is passed in each request — no chat sessions.
 *
 * This abstraction lets us switch LLM providers later without
 * changing the interview service.
 */

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/**
 * Sends a stateless request to the Gemini API.
 *
 * @param {string} systemInstruction - System-level instructions for the model.
 * @param {Array<{role: string, parts: Array<{text: string}>}>} contents - Full conversation in Gemini format.
 * @param {object} [options] - Optional config overrides.
 * @param {number} [options.maxOutputTokens=300] - Max tokens for the response.
 * @returns {Promise<string>} The model's response text.
 */
async function chat(systemInstruction, contents, options = {}) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
      maxOutputTokens: options.maxOutputTokens || 300,
      temperature: 0.7,
    },
  });

  return response.text || 'Could you please elaborate on that?';
}

module.exports = { chat };
