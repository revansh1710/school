import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const scheduleData = [
  { day: 'MONDAY', startTime: '08:30:00', endTime: '09:30:00', subject: 'Mathematics' },
  { day: 'MONDAY', startTime: '09:45:00', endTime: '10:45:00', subject: 'English Language' },
  { day: 'MONDAY', startTime: '11:00:00', endTime: '12:00:00', subject: 'Science' },
  { day: 'MONDAY', startTime: '12:30:00', endTime: '13:30:00', subject: 'Music & Singing' },

  { day: 'TUESDAY', startTime: '08:30:00', endTime: '09:30:00', subject: 'History' },
  { day: 'TUESDAY', startTime: '09:45:00', endTime: '10:45:00', subject: 'English Language' },
  { day: 'TUESDAY', startTime: '11:00:00', endTime: '12:00:00', subject: 'Mathematics' },
  { day: 'TUESDAY', startTime: '12:30:00', endTime: '13:30:00', subject: 'Drawing & Art' },

  { day: 'WEDNESDAY', startTime: '08:30:00', endTime: '09:30:00', subject: 'Mathematics' },
  { day: 'WEDNESDAY', startTime: '09:45:00', endTime: '10:45:00', subject: 'Science' },
  { day: 'WEDNESDAY', startTime: '11:00:00', endTime: '12:00:00', subject: 'English Literature' },
  { day: 'WEDNESDAY', startTime: '12:30:00', endTime: '13:30:00', subject: 'Physical Education' },

  { day: 'THURSDAY', startTime: '08:30:00', endTime: '09:30:00', subject: 'Social Studies' },
  { day: 'THURSDAY', startTime: '09:45:00', endTime: '10:45:00', subject: 'English Literature' },
  { day: 'THURSDAY', startTime: '11:00:00', endTime: '12:00:00', subject: 'Mathematics' },
  { day: 'THURSDAY', startTime: '12:30:00', endTime: '13:30:00', subject: 'Library Hour' },

  { day: 'FRIDAY', startTime: '08:30:00', endTime: '09:30:00', subject: 'Environmental Studies' },
  { day: 'FRIDAY', startTime: '09:45:00', endTime: '10:45:00', subject: 'Computer Literacy' },
  { day: 'FRIDAY', startTime: '11:00:00', endTime: '12:00:00', subject: 'General Knowledge' },
  { day: 'FRIDAY', startTime: '12:30:00', endTime: '13:30:00', subject: 'Weekly Assessment' },
];

async function run() {
  const client = await pool.connect();
  try {
    // 1. Get the staff user
    const staffRes = await client.query('SELECT id FROM "User" WHERE username = $1', ['STF-015']);
    if (staffRes.rows.length === 0) {
      console.log("Staff user STF-015 not found. Please run create-staff.mjs first.");
      return;
    }
    const teacherId = staffRes.rows[0].id;

    // 2. Get LKG and UKG section A
    const sectionsRes = await client.query(`
      SELECT s.id, c.name as class_name, s.name as section_name 
      FROM "Section" s 
      JOIN "Class" c ON s."classId" = c.id 
      WHERE c.name IN ('LKG', 'UKG') AND s.name = 'A'
    `);

    if (sectionsRes.rows.length === 0) {
      console.log("LKG or UKG sections not found. Please ensure class/sections are seeded.");
      return;
    }

    // 3. Insert timetable records
    for (const section of sectionsRes.rows) {
      const room = section.class_name === 'LKG' ? 'Room 101' : 'Room 102';

      for (const slot of scheduleData) {
        await client.query(`
          INSERT INTO "TimetableEntry" ("sectionId", "dayOfWeek", "startTime", "endTime", "subject", "teacherId", "room")
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT ("sectionId", "dayOfWeek", "startTime") DO UPDATE SET
            "endTime" = $4,
            "subject" = $5,
            "teacherId" = $6,
            "room" = $7
        `, [
          section.id,
          slot.day,
          slot.startTime,
          slot.endTime,
          slot.subject,
          teacherId,
          room,
        ]);
      }
      console.log(`Seeded weekly timetable for ${section.class_name} Section ${section.section_name} (${room})`);
    }

    console.log("Timetable seeded successfully.");
  } catch (e) {
    console.error("Error seeding timetable:", e);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
