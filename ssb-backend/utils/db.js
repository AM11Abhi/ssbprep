const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Log once when pool is created, not on every connection
console.log('PostgreSQL pool initialized');

// Optional: Test the connection once on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection failed:', err);
  } else {
    console.log('PostgreSQL connected successfully');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};