const express = require('express');
const router = express.Router();

const controller = require('../controllers/interview.controller');

// Interview endpoints
router.post('/chat', controller.chat);
router.post('/feedback', controller.feedback);

module.exports = router;
