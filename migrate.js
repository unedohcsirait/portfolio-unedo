require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);
async function run() {
  await sql`CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )`;
  const existing = await sql`SELECT * FROM admin_users WHERE id = 1`;
  if (existing.length === 0) {
    await sql`INSERT INTO admin_users (username, password) VALUES ('unedo', 'unedo123')`;
    console.log('Inserted default admin');
  } else {
    console.log('Admin already exists');
  }
}
run().catch(console.error);
