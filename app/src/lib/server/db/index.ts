import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import pg from 'pg';

// Lazy init: SvelteKit's post-build analysis imports server modules with no
// env present, so the pool must not be created (nor DATABASE_URL read) at
// module load. First real use throws loudly if the env is missing.
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is not set');
    _db = drizzle(new pg.Pool({ connectionString }));
  }
  return _db;
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    await getDb().execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}
