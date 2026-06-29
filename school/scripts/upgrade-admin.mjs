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
    await client.query(`
      UPDATE "User" 
      SET role = 'SUPER_ADMIN' 
      WHERE username = 'ADM-001'
    `);
    console.log("Upgraded ADM-001 to SUPER_ADMIN successfully.");
  } catch (e) {
    console.error("Error upgrading user:", e);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
