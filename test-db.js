require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
async function run() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const res = await sql`SELECT 1 as val`;
    console.log('Success:', res);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
run();
