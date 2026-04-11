const { query } = require('../utils/db');

async function getWAT() {
  const { rows } = await query(
    `SELECT id, word
     FROM content.wat_words
     WHERE is_active = true
     ORDER BY RANDOM()
     LIMIT 60`
  );
  return rows;
}

async function getSRT() {
  const { rows } = await query(
    `SELECT id, situation
     FROM content.srt_situations
     WHERE is_active = true
     ORDER BY RANDOM()
     LIMIT 60`
  );
  return rows;
}

async function getTAT() {
  const { rows } = await query(`
    (
      SELECT id, code, is_blank
      FROM content.tat_images
      WHERE is_blank = false
      ORDER BY RANDOM()
      LIMIT 11
    )
    UNION ALL
    (
      SELECT id, code, is_blank
      FROM content.tat_images
      WHERE is_blank = true
      LIMIT 1
    )
  `);

  return rows;
}

async function getLecturette() {
  const { rows } = await query(
    `SELECT id, topic
     FROM content.lecturette_topics
     WHERE is_active = true
     ORDER BY RANDOM()
     LIMIT 4`
  );
  return rows;
}

const llmService = require('./llm.service');
const { WAT_FEEDBACK_PROMPT } = require('../prompts/watFeedbackPrompt');

function getSDT() {
  return ["What do you think of yourself?", 
    "What do your parents think of you?", 
    "What do your friends think of you?", 
    "What do your teachers think of you?", 
    "What sort of a person do you want to become in life?"
  ];
}

async function generateWATFeedback(responses) {
  // Format responses nicely for the prompt
  const formattedResponses = responses.map((r, i) => `${i + 1}. Word: "${r.word}" | Sentence: "${r.response}"`).join('\n');
  const userMessage = {
    role: 'user',
    parts: [{ text: `Here are my WAT responses:\n\n${formattedResponses}` }]
  };
  
  // Ask for feedback
  const advice = await llmService.chat(
    WAT_FEEDBACK_PROMPT,
    [userMessage],
    { maxOutputTokens: 1200 } // give it enough room to reply with good feedback
  );
  
  return advice;
}

module.exports = {
  getWAT,
  getSRT,
  getTAT,
  getLecturette,
  getSDT,
  generateWATFeedback,
};
