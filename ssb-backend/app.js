require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const contentRoutes = require('./routes/content.routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/content', contentRoutes);

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
  console.error('Error:', err.message);

  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(status).json({ error: message });
});

module.exports = app;
