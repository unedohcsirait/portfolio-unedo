"use server";

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getProjects() {
  const data = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  return data;
}

export async function addProjectAction(title: string, tech: string, desc: string) {
  const data = await sql`
    INSERT INTO projects (title, tech, description) 
    VALUES (${title}, ${tech}, ${desc}) 
    RETURNING *
  `;
  return data[0];
}

export async function deleteProjectAction(id: number) {
  await sql`DELETE FROM projects WHERE id = ${id}`;
  return { success: true };
}

export async function getExperiences() {
  const data = await sql`SELECT * FROM experiences ORDER BY created_at DESC`;
  return data;
}

export async function addExperienceAction(role: string, company: string, year: string, desc: string = '') {
  const data = await sql`
    INSERT INTO experiences (role, company, year, description) 
    VALUES (${role}, ${company}, ${year}, ${desc}) 
    RETURNING *
  `;
  return data[0];
}

export async function deleteExperienceAction(id: number) {
  await sql`DELETE FROM experiences WHERE id = ${id}`;
  return { success: true };
}

export async function getProfile() {
  const data = await sql`SELECT * FROM profile WHERE id = 1`;
  return data[0];
}

export async function updateProfileAction(
  name: string, hero_subtitle: string, hero_desc: string, about_title: string, about_desc: string, cv_link: string, contact_link: string
) {
  const data = await sql`
    UPDATE profile SET 
      name = ${name},
      hero_subtitle = ${hero_subtitle},
      hero_desc = ${hero_desc},
      about_title = ${about_title},
      about_desc = ${about_desc},
      cv_link = ${cv_link},
      contact_link = ${contact_link}
    WHERE id = 1
    RETURNING *
  `;
  return data[0];
}

export async function incrementProfileViews() {
  try {
    await sql`ALTER TABLE profile ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;`;
    const data = await sql`
      UPDATE profile SET views = COALESCE(views, 0) + 1 WHERE id = 1 RETURNING views;
    `;
    return data[0]?.views;
  } catch (e) {
    console.error("Error incrementing views", e);
    return 0;
  }
}
