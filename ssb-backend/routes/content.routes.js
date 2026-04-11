const express = require('express');
const router = express.Router();

const controller = require('../controllers/content.controller');
const { interviewLimiter } = require('../middleware/rateLimiter');

// Psychology test content
router.get('/wat', controller.wat);
router.post('/wat/feedback', interviewLimiter, controller.watFeedback);
router.get('/srt', controller.srt);
router.get('/tat', controller.tat);
router.get('/sdt', controller.sdt);
router.get('/lecturette', controller.lecturette);

module.exports = router;
