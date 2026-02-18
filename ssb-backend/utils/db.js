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

// 🔵 Add retry logic
async function testConnection(retries = 5, delay = 4000) {
  while (retries) {
    try {
      await pool.query('SELECT NOW()');
      console.log('PostgreSQL connected successfully');
      return;
    } catch (err) {
      console.error(`DB connection failed. Retries left: ${retries - 1}`);
      retries--;
      if (!retries) {
        console.error('PostgreSQL could not connect after retries.');
        return;
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
};