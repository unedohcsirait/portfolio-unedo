import { neon } from '@neondatabase/serverless';

// Load connection from env directly or fallback to string
const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_b9TZPSBqR7YC@ep-still-silence-azi8crok-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function seed() {
  console.log("Seeding database...");

  try {
    // Clear existing data (optional, but good for a fresh seed)
    await sql`TRUNCATE TABLE projects RESTART IDENTITY`;
    await sql`TRUNCATE TABLE experiences RESTART IDENTITY`;

    console.log("Seeding Projects...");
    await sql`
      INSERT INTO projects (title, tech, description) VALUES 
      ('Sistem Informasi Indeks Desa', 'React, Node.js, PostgreSQL', 'Sistem informasi berbasis web untuk perhitungan dan manajemen data Indeks Membangun Desa (IDM) secara komprehensif.'),
      ('Prediksi Saham dengan LSTM', 'Python, TensorFlow, LSTM', 'Proyek Machine Learning tingkat lanjut untuk memprediksi pergerakan harga saham perusahaan di Indonesia menggunakan data historis.'),
      ('Ekstensi Analisis Catur', 'JavaScript, Chrome Ext, Stockfish', 'Ekstensi peramban eksperimental untuk mengkalkulasi dan menganalisis posisi catur daring secara real-time dengan engine Stockfish 16.')
    `;

    console.log("Seeding Experiences...");
    await sql`
      INSERT INTO experiences (role, company, year, description) VALUES 
      ('Mahasiswa Informatika', 'Universitas', 'Sekarang', 'Aktif mempelajari rekayasa perangkat lunak (Software Engineering), ilmu data, dan algoritma kecerdasan buatan (AI).'),
      ('Web Developer (Freelance)', 'Independen', '2023 - Sekarang', 'Membangun aplikasi web full-stack kelas produksi untuk berbagai klien menggunakan framework modern seperti Next.js dan Node.js.'),
      ('AI & ML Enthusiast', 'Otodidak', '2023', 'Mengeksplorasi model deep learning, melatih arsitektur neural networks, dan memanipulasi big data menggunakan ekosistem Python.')
    `;

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

seed();
