import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function clean() {
  const client = await pool.connect();
  try {
    const res = await client.query('DELETE FROM "Student" WHERE "firstName" = $1 RETURNING *', ['Unknown']);
    console.log(`Deleted ${res.rowCount} Unknown students.`);
    console.log(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
}

clean();
