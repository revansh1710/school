import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    // 1. Get the admin and staff users
    const adminRes = await client.query('SELECT id FROM "User" WHERE username = $1', ['ADM-001']);
    const staffRes = await client.query('SELECT id FROM "User" WHERE username = $1', ['STF-015']);
    
    if (adminRes.rows.length === 0 || staffRes.rows.length === 0) {
      console.log("Admin or Staff user not found. Please run create-staff.mjs first.");
      return;
    }
    
    const adminId = adminRes.rows[0].id;
    const staffId = staffRes.rows[0].id;

    // 2. Get LKG and UKG classes (Admin manages LKG and UKG)
    const classesRes = await client.query('SELECT id, name FROM "Class" WHERE name IN ($1, $2)', ['LKG', 'UKG']);
    
    for (const cls of classesRes.rows) {
      // Assign Admin to Class
      await client.query(`
        INSERT INTO "AdminClass" ("adminId", "classId") 
        VALUES ($1, $2)
        ON CONFLICT ("adminId", "classId") DO NOTHING
      `, [adminId, cls.id]);
      console.log(`Assigned Admin to Class: ${cls.name}`);

      // 3. Assign Staff to LKG Section A
      if (cls.name === 'LKG') {
        const sectionRes = await client.query('SELECT id, name FROM "Section" WHERE "classId" = $1 AND name = $2', [cls.id, 'A']);
        if (sectionRes.rows.length > 0) {
          const sectionId = sectionRes.rows[0].id;
          await client.query(`
            INSERT INTO "TeacherSection" ("teacherId", "sectionId", "isClassTeacher", subject) 
            VALUES ($1, $2, true, 'General')
            ON CONFLICT ("teacherId", "sectionId") DO NOTHING
          `, [staffId, sectionId]);
          console.log(`Assigned Staff to LKG Section A as Class Teacher`);
        }
      }
    }
    
    console.log("Assignments seeded successfully.");
  } catch (e) {
    console.error("Error seeding assignments:", e);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
