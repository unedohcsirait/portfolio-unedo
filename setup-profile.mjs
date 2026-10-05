import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_b9TZPSBqR7YC@ep-still-silence-azi8crok-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function setupProfile() {
  console.log("Setting up profile table...");

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        hero_subtitle VARCHAR(255) NOT NULL,
        hero_desc TEXT NOT NULL,
        about_title VARCHAR(255) NOT NULL,
        about_desc TEXT NOT NULL,
        cv_link VARCHAR(255),
        contact_link VARCHAR(255)
      )
    `;
    
    const existing = await sql`SELECT * FROM profile WHERE id = 1`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO profile (id, name, hero_subtitle, hero_desc, about_title, about_desc, cv_link, contact_link) VALUES (
          1,
          'Unedo Sirait',
          'Informatics Student | Web Developer',
          'I’m an Informatics student who enjoys building web applications, information systems, and AI/ML projects. Currently learning and exploring modern technologies to turn ideas into useful digital products.',
          'Informatics Student & Web Developer',
          'I’m an Informatics student who enjoys building web applications, information systems, and AI/ML projects. Currently learning and exploring modern technologies to turn ideas into useful digital products.',
          '#',
          'https://wa.me/6281373028553'
        )
      `;
      console.log("Profile seeded.");
    } else {
      console.log("Profile already exists.");
    }

    console.log("Done!");
  } catch (err) {
    console.error(err);
  }
}

setupProfile();
