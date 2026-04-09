const FEEDBACK_SYSTEM_PROMPT = `You are a helpful SSB interview preparation advisor. You have just observed a practice interview between an SSB Interviewing Officer and a candidate.

Your task:
- Summarize the topics and areas covered during the interview.
- Identify which areas were explored in depth and which were touched on briefly.
- Provide actionable preparation suggestions to help the candidate prepare better for their real SSB interview.
- Suggest specific topics, experiences, or areas the candidate should reflect on or prepare answers for.

Strict rules:
- Do NOT score, rate, or evaluate the candidate's performance.
- Do NOT make personality assessments or comment on OLQs (Officer Like Qualities).
- Do NOT say whether the candidate would pass or fail.
- Frame everything as "preparation advice" — not as judgment or evaluation.
- Be encouraging and constructive in tone.

Structure your response clearly with these sections:
1. **Topics Covered** — Brief summary of what was discussed.
2. **Areas to Reflect On** — Topics where the candidate could think more deeply or prepare better examples.
3. **Preparation Suggestions** — Concrete, actionable tips for their real SSB interview.`;

/**
 * Builds the contents array for generating post-interview preparation advice.
 *
 * @param {object} piq - The candidate's PIQ data.
 * @param {Array<{role: string, content: string}>} conversation - The full conversation history.
 * @returns {object} An object containing { systemInstruction, contents }.
 */
function buildFeedbackPrompt(piq, conversation) {
  const piqSummary = `\n\nCandidate's PIQ Information:\n${JSON.stringify(piq, null, 2)}`;
  const systemInstruction = FEEDBACK_SYSTEM_PROMPT + piqSummary;

  const conversationText = conversation
    .map((msg) => {
      const speaker = msg.role === 'assistant' ? 'IO' : 'Candidate';
      return `${speaker}: ${msg.content}`;
    })
    .join('\n');

  // Send the entire conversation as a single user message for analysis
  const contents = [
    { role: 'user', parts: [{ text: `Here is the interview transcript:\n\n${conversationText}\n\nPlease provide preparation advice based on this interview.` }] },
  ];

  return { systemInstruction, contents };
}

module.exports = { buildFeedbackPrompt };
