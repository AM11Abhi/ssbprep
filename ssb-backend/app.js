require('dotenv').config();

const express = require('express');
const cors = require('cors');

const contentRoutes = require('./routes/content.routes');
const interviewRoutes = require('./routes/interview.routes');

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, health checks)
    if (!origin) return callback(null, true);

    if (origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    return callback(null, false);
  },
}));
// 10kb limit prevents large-payload abuse on all routes
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/content', contentRoutes);
app.use('/interview', interviewRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'unknown'
  });
});

// 404 handler (for unknown routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler (MUST be last)
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  // Log payload-too-large rejections explicitly
  if (status === 413) {
    console.warn(`[PAYLOAD REJECTED] ${req.method} ${req.path} — body too large from IP ${req.ip}`);
    return res.status(413).json({ error: 'Request too large. Maximum payload size is 10kb.' });
  }

  console.error(`[ERROR] ${status} — ${err.message}`);

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(status).json({ error: message });
});

module.exports = app;
