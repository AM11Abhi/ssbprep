const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for interview endpoints.
 *
 * Allows 20 requests per 10 minutes per IP.
 * Applied only to POST /interview/chat and POST /interview/feedback.
 */
const interviewLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 20,
  standardHeaders: true,      // Return RateLimit-* headers
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] IP ${req.ip} blocked on ${req.method} ${req.path}`);
    res.status(429).json(options.message);
  },
});

module.exports = { interviewLimiter };
