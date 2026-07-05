import { describe, it, expect } from 'vitest';
import { getOrCreateUserByEmail, deleteUserById } from './user-repo';

// Requires DATABASE_URL pointing at a running, migrated Postgres.
describe.skipIf(!process.env.DATABASE_URL)('user repo', () => {
  const email = `test-${Date.now()}@example.com`;

  it('provisions a new user on first sight', async () => {
    const user = await getOrCreateUserByEmail(email);
    expect(user.email).toBe(email);
    expect(user.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('returns the same user on repeat calls (idempotent)', async () => {
    const first = await getOrCreateUserByEmail(email);
    const second = await getOrCreateUserByEmail(email);
    expect(second.id).toBe(first.id);
  });

  it('deletes a user by id', async () => {
    const user = await getOrCreateUserByEmail(email);
    await deleteUserById(user.id);
    const fresh = await getOrCreateUserByEmail(email);
    expect(fresh.id).not.toBe(user.id);
    await deleteUserById(fresh.id);
  });
});
