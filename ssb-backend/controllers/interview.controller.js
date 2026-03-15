const interviewService = require('../services/interview.service');

async function chat(req, res, next) {
  try {
    const { piq, messages, userMessage } = req.body;

    if (!piq || !messages || !userMessage) {
      return res.status(400).json({ error: 'Missing required fields: piq, messages, userMessage' });
    }

    const reply = await interviewService.getNextQuestion(piq, messages, userMessage);
    res.json({ reply });
  } catch (err) { next(err); }
}

async function feedback(req, res, next) {
  try {
    const { piq, conversation } = req.body;

    if (!piq || !conversation) {
      return res.status(400).json({ error: 'Missing required fields: piq, conversation' });
    }

    const advice = await interviewService.getFeedback(piq, conversation);
    res.json({ advice });
  } catch (err) { next(err); }
}

module.exports = { chat, feedback };
