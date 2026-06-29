import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    const roles = ['ADMIN', 'STAFF'];
    
    for (const role of roles) {
      const username = role === 'ADMIN' ? 'ADM-001' : 'STF-015';
      const password = role === 'ADMIN' ? 'admin123' : 'staff123';
      const name = role === 'ADMIN' ? 'Super Admin' : 'Staff Member';
      
      const hash = await bcrypt.hash(password, 10);
      
      // We need a dummy email for the User table since email is NOT NULL and UNIQUE.
      // Alternatively, we could change email to be nullable, but it's simpler to provide a dummy email.
      const dummyEmail = `${username.toLowerCase()}@school.local`;

      const res = await client.query(`
        INSERT INTO "User" (email, "parentName", role, status, username, "passwordHash")
        VALUES ($1, $2, $3, 'ACTIVE', $4, $5)
        ON CONFLICT (email) DO UPDATE SET 
          "passwordHash" = $5,
          username = $4,
          role = $3
        RETURNING id, username, role;
      `, [dummyEmail, name, role, username, hash]);

      console.log(`Created ${role}: Username: ${username}, Password: ${password}`);
    }
  } catch (e) {
    console.error("Error creating staff:", e);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
