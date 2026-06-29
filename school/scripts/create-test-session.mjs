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
    const email = 'testmanualparent@school.local';
    const parentName = 'Test Parent Manual';

    // 1. Ensure user exists
    let userRes = await client.query('SELECT id FROM "User" WHERE email = $1', [email]);
    let userId;
    if (userRes.rows.length === 0) {
      const insertRes = await client.query(
        'INSERT INTO "User" (email, "parentName", role, status) VALUES ($1, $2, \'PARENT\', \'ACTIVE\') RETURNING id',
        [email, parentName]
      );
      userId = insertRes.rows[0].id;
      console.log('Created parent user in Postgres:', email);
    } else {
      userId = userRes.rows[0].id;
      console.log('Found existing parent user in Postgres:', email);
    }

    // 2. Create session
    const sessionId = '11111111-2222-3333-4444-555555555555';
    // Clean old sessions
    await client.query('DELETE FROM "Session" WHERE "userId" = $1 OR id = $2', [userId, sessionId]);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await client.query(
      'INSERT INTO "Session" (id, "userId", "expiresAt") VALUES ($1, $2, $3)',
      [sessionId, userId, expiresAt]
    );
    console.log('Created session successfully. Session ID:', sessionId);
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
}
run();
