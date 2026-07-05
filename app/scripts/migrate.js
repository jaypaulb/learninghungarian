// Production migrate-on-start: applies ./drizzle migrations using the
// programmatic migrator in drizzle-orm (a prod dependency) — no drizzle-kit
// or runtime npm downloads needed.
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const pool = new pg.Pool({ connectionString });
await migrate(drizzle(pool), { migrationsFolder: './drizzle' });
await pool.end();
console.log('Migrations applied.');
