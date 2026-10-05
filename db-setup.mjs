import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_b9TZPSBqR7YC@ep-still-silence-azi8crok-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function setup() {
  console.log("Setting up database tables...");

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        tech VARCHAR(255) NOT NULL,
        link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Projects table created.");

    await sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        role VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        year VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Experiences table created.");

    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        msg TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Messages table created.");

    console.log("Database setup complete!");
  } catch (err) {
    console.error("Error setting up database:", err);
  }
}

setup();
