require('dotenv').config();
const { Pool } = require('pg');

// Neon requires SSL connection, the connection string already includes ?sslmode=require
// The pg library should handle this automatically based on the connection string.
// If issues arise, we might need to explicitly set ssl: { rejectUnauthorized: false }
// depending on the environment and pg version, but let's start with the default handling.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Basic SSL handling for Neon, adjust if needed
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Export the pool itself if needed for transactions etc.
};

