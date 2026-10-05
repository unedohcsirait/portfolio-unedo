"use server";

import { cookies } from "next/headers";
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function loginAction(username: string, pass: string) {
  // Ensure the table exists and initialize default if not
  await sql`CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )`;
  
  const existing = await sql`SELECT * FROM admin_users WHERE id = 1`;
  if (existing.length === 0) {
    await sql`INSERT INTO admin_users (username, password) VALUES ('unedo', 'unedo123')`;
  }

  // Validate credentials
  const users = await sql`SELECT * FROM admin_users WHERE username = ${username} AND password = ${pass} AND id = 1`;
  
  if (users.length > 0) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true, // Mencegah serangan XSS (Cross-Site Scripting)
      secure: process.env.NODE_ENV === "production", // Wajib HTTPS di production
      sameSite: "strict", // Mencegah serangan CSRF (Cross-Site Request Forgery)
      path: "/",
      maxAge: 60 * 60 * 24 // 1 hari kedaluwarsa
    });
    return { success: true };
  }
  
  return { success: false, error: "Username atau password salah!" };
}

export async function updateCredentialsAction(newUsername: string, newPass: string) {
  // Ensure the table exists and initialize default if not
  await sql`CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )`;
  
  const existing = await sql`SELECT * FROM admin_users WHERE id = 1`;
  if (existing.length === 0) {
    await sql`INSERT INTO admin_users (username, password) VALUES ('unedo', 'unedo123')`;
  }

  await sql`UPDATE admin_users SET username = ${newUsername}, password = ${newPass} WHERE id = 1`;
  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
