import { getDb } from '$lib/server/db';
import { users, type User } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Fetch-or-provision a user by email (the identity the forward-auth gate
 * asserts). Concurrent-safe via ON CONFLICT DO NOTHING + re-select.
 */
export async function getOrCreateUserByEmail(email: string): Promise<User> {
  const db = getDb();
  const inserted = await db
    .insert(users)
    .values({ email })
    .onConflictDoNothing({ target: users.email })
    .returning();
  if (inserted.length > 0) return inserted[0];
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length === 0) throw new Error(`user upsert failed for ${email}`);
  return existing[0];
}

export async function deleteUserById(id: string): Promise<void> {
  await getDb().delete(users).where(eq(users.id, id));
}
