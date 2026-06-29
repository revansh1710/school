import { Pool } from 'pg';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CLASSES = [
  { name: 'Nursery', order: 0 },
  { name: 'LKG', order: 1 },
  { name: 'UKG', order: 2 },
  { name: 'Grade 1', order: 3 },
  { name: 'Grade 2', order: 4 },
  { name: 'Grade 3', order: 5 },
  { name: 'Grade 4', order: 6 },
  { name: 'Grade 5', order: 7 },
  { name: 'Grade 6', order: 8 },
  { name: 'Grade 7', order: 9 },
  { name: 'Grade 8', order: 10 },
  { name: 'Grade 9', order: 11 },
  { name: 'Grade 10', order: 12 }
];

const SECTIONS = ['A', 'B', 'C'];
const MAX_CAPACITY = 40;
const TOTAL_STUDENTS = 1000;

async function seed() {
  const client = await pool.connect();

  try {
    console.log('Starting database seed...');
    await client.query('BEGIN');

    // 1. Wipe existing data
    console.log('Wiping existing data...');
    await client.query('TRUNCATE TABLE "User", "Student", "ParentStudent", "Class", "Section", "Session", "MagicToken" CASCADE');

    // 2. Create Classes
    console.log('Creating Classes...');
    const classMap = new Map(); // id -> Class Name
    const classIdToName = {};

    for (const cls of CLASSES) {
      const res = await client.query(
        'INSERT INTO "Class" (name, "order") VALUES ($1, $2) RETURNING id, name',
        [cls.name, cls.order]
      );
      classMap.set(cls.name, res.rows[0].id);
      classIdToName[res.rows[0].id] = cls.name;
    }

    // 3. Create Sections
    console.log('Creating Sections...');
    const sectionMap = new Map(); // classId -> [ {id, name, currentCount } ]
    
    for (const [className, classId] of classMap.entries()) {
      sectionMap.set(classId, []);
      for (const sec of SECTIONS) {
        const res = await client.query(
          'INSERT INTO "Section" ("classId", name, "maxCapacity") VALUES ($1, $2, $3) RETURNING id, name',
          [classId, sec, MAX_CAPACITY]
        );
        sectionMap.get(classId).push({ id: res.rows[0].id, name: sec, currentCount: 0 });
      }
    }

    // 4. Create Students and Parents
    console.log(`Creating ${TOTAL_STUDENTS} Students...`);
    const parents = [];
    // Pre-create some parents (e.g., 600 parents for 1000 students to allow siblings)
    for (let i = 0; i < 600; i++) {
        const email = faker.internet.email().toLowerCase();
        const parentName = faker.person.fullName();
        const res = await client.query(
            'INSERT INTO "User" (email, "parentName", role, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [email, parentName, 'PARENT', 'ACTIVE']
        );
        parents.push(res.rows[0].id);
    }

    let successCount = 0;
    
    for (let i = 0; i < TOTAL_STUDENTS; i++) {
      // Pick random class
      const classIds = Array.from(sectionMap.keys());
      const randomClassId = classIds[Math.floor(Math.random() * classIds.length)];
      
      // Pick a section in that class that has capacity
      const sectionsInClass = sectionMap.get(randomClassId);
      const availableSections = sectionsInClass.filter(s => s.currentCount < MAX_CAPACITY);
      
      if (availableSections.length === 0) {
        // Class is full, skip
        continue;
      }

      const selectedSection = availableSections[Math.floor(Math.random() * availableSections.length)];
      selectedSection.currentCount++;
      const rollNumber = selectedSection.currentCount;

      // Pick a parent
      const parentId = parents[Math.floor(Math.random() * parents.length)];
      
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const dateOfBirth = faker.date.birthdate({ min: 3, max: 16, mode: 'age' });
      const gender = faker.person.sex();

      // Insert Student
      const studentRes = await client.query(
        'INSERT INTO "Student" ("firstName", "lastName", "admissionStatus", "classId", "sectionId", "rollNumber", "dateOfBirth", "gender") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [firstName, lastName, 'ENROLLED', randomClassId, selectedSection.id, rollNumber, dateOfBirth, gender]
      );
      
      // Insert ParentStudent relationship
      await client.query(
        'INSERT INTO "ParentStudent" ("parentId", "studentId") VALUES ($1, $2)',
        [parentId, studentRes.rows[0].id]
      );
      
      successCount++;
    }

    await client.query('COMMIT');
    console.log(`Successfully seeded ${successCount} students across ${CLASSES.length} classes and ${CLASSES.length * 3} sections.`);

  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error seeding data:', e);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
