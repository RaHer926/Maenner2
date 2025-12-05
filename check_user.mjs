import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.RAILWAY_DATABASE_URL,
});

async function checkUser() {
  try {
    const result = await pool.query('SELECT id, email, name FROM users LIMIT 5');
    console.log('Users in database:');
    console.log(result.rows);
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

checkUser();
