import { describe, it, expect, beforeAll } from 'vitest';
import { submitFeedback, FeedbackError } from './submit';
import { getOrCreateUserByEmail } from '$lib/server/auth/user-repo';
import { getDb } from '$lib/server/db';
import { sql } from 'drizzle-orm';

// Requires DATABASE_URL pointing at a running, migrated Postgres with content imported.
describe.skipIf(!process.env.DATABASE_URL)('submitFeedback', () => {
  let userId: string;

  beforeAll(async () => {
    const user = await getOrCreateUserByEmail(`feedback-${Date.now()}@example.com`);
    userId = user.id;
  });

  it('stores a private row with content refs and consent', async () => {
    const { id } = await submitFeedback({
      userId,
      lessonId: 'a1-smoke-test',
      message: 'The example could be more natural.',
      consentContact: true
    });
    const row = (
      await getDb().execute(sql`SELECT lesson_id, content_version, consent_contact, status FROM feedback WHERE id=${id}`)
    ).rows[0];
    expect(row.lesson_id).toBe('a1-smoke-test');
    expect(Number(row.content_version)).toBeGreaterThanOrEqual(1);
    expect(Number(row.consent_contact)).toBe(1);
    expect(row.status).toBe('new');
  });

  it('rejects empty and oversized messages', async () => {
    await expect(submitFeedback({ userId, message: '   ', consentContact: false })).rejects.toThrow(FeedbackError);
    await expect(
      submitFeedback({ userId, message: 'x'.repeat(2001), consentContact: false })
    ).rejects.toThrow(/2000/);
  });

  it('rate-limits after 5 submissions in an hour', async () => {
    const fresh = await getOrCreateUserByEmail(`feedback-rl-${Date.now()}@example.com`);
    for (let i = 0; i < 5; i++) {
      await submitFeedback({ userId: fresh.id, message: `note ${i}`, consentContact: false });
    }
    await expect(
      submitFeedback({ userId: fresh.id, message: 'one too many', consentContact: false })
    ).rejects.toThrow(/rate|too many/i);
  });

  it('strips control characters from the message', async () => {
    const { id } = await submitFeedback({
      userId,
      message: 'clean\x00\x1b[31m text',
      consentContact: false
    });
    const row = (await getDb().execute(sql`SELECT message FROM feedback WHERE id=${id}`)).rows[0];
    expect(row.message).toBe('clean[31m text');
  });
});
