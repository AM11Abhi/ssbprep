const express = require('express');
const router = express.Router();

const controller = require('../controllers/interview.controller');
const { interviewLimiter } = require('../middleware/rateLimiter');

// Rate-limited interview endpoints
router.post('/chat',     interviewLimiter, controller.chat);
router.post('/feedback', interviewLimiter, controller.feedback);

module.exports = router;

