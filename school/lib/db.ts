import { Pool } from 'pg';

// Cache the pool in development to avoid exhausting connections during hot reloads
const globalForPg = global as unknown as { pool: Pool };

export const pool =
  globalForPg.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('neon.tech') || process.env.DATABASE_URL?.includes('sslmode=require') 
      ? { rejectUnauthorized: false } 
      : undefined,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool;

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
