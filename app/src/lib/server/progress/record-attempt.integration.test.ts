import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { recordAttempt } from './record-attempt';
import { getOrCreateUserByEmail, deleteUserById } from '$lib/server/auth/user-repo';
import { getDb } from '$lib/server/db';
import { sql } from 'drizzle-orm';

// Requires DATABASE_URL pointing at a running, migrated Postgres.
describe.skipIf(!process.env.DATABASE_URL)('recordAttempt', () => {
  let userId: string;

  beforeAll(async () => {
    execFileSync('node', ['scripts/import-content.js'], { env: { ...process.env, CONTENT_DIR: 'content' } });
    const user = await getOrCreateUserByEmail(`progress-${Date.now()}@example.com`);
    userId = user.id;
  });

  it('records first attempt immutably and aggregates best/attempts', async () => {
    await recordAttempt(userId, 'a1-smoke-test-ex1', 'wrong');
    await recordAttempt(userId, 'a1-smoke-test-ex1', 'correct');
    const row = (
      await getDb().execute(
        sql`SELECT first_result, best_result, attempts FROM exercise_progress
            WHERE user_id=${userId} AND exercise_id='a1-smoke-test-ex1'`
      )
    ).rows[0];
    expect(row.first_result).toBe('wrong'); // immutable
    expect(row.best_result).toBe('correct');
    expect(Number(row.attempts)).toBe(2);
  });

  it('marks the lesson completed once every exercise is attempted', async () => {
    for (const ex of ['ex2', 'ex3', 'ex4', 'ex5', 'ex6', 'ex7']) {
      await recordAttempt(userId, `a1-smoke-test-${ex}`, 'correct');
    }
    const row = (
      await getDb().execute(
        sql`SELECT status, first_accuracy FROM lesson_progress
            WHERE user_id=${userId} AND lesson_id='a1-smoke-test'`
      )
    ).rows[0];
    expect(row.status).toBe('completed');
    // 6 of 7 first attempts correct (ex1 was wrong first)
    expect(Number(row.first_accuracy)).toBeCloseTo(6 / 7, 5);
  });

  it('advances SRS state for linked items (production direction)', async () => {
    const rows = (
      await getDb().execute(
        sql`SELECT direction, reps, interval_days FROM user_srs_state
            WHERE user_id=${userId} AND srs_item_id='vocab:szia'`
      )
    ).rows;
    expect(rows.length).toBeGreaterThanOrEqual(2); // production (ex1) + recognition (ex3 card)
    const production = rows.find((r) => r.direction === 'production');
    expect(Number(production!.reps)).toBeGreaterThanOrEqual(1);
  });

  it('GDPR cascade: deleting the user removes all progress', async () => {
    await deleteUserById(userId);
    const counts = (
      await getDb().execute(
        sql`SELECT (SELECT count(*) FROM exercise_progress WHERE user_id=${userId})
              + (SELECT count(*) FROM lesson_progress WHERE user_id=${userId})
              + (SELECT count(*) FROM user_srs_state WHERE user_id=${userId}) AS total`
      )
    ).rows[0];
    expect(Number(counts.total)).toBe(0);
  });
});
