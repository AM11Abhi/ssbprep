const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
  console.error('Unexpected PG pool error:', err.message);
  // Do NOT crash the server
});

// Log once when pool is created, not on every connection
console.log('PostgreSQL pool initialized');

// Optional: Test the connection once on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection failed:', err.message);
  } else {
    console.log('PostgreSQL connected successfully');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};