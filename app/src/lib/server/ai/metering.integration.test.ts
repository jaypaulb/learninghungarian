import { describe, it, expect, beforeAll } from 'vitest';
import { checkQuota, recordUsage, QuotaError } from './metering';
import { getOrCreateUserByEmail } from '$lib/server/auth/user-repo';
import { getDb } from '$lib/server/db';
import { sql } from 'drizzle-orm';

describe.skipIf(!process.env.DATABASE_URL)('ai metering', () => {
  let userId: string;
  beforeAll(async () => {
    userId = (await getOrCreateUserByEmail(`ai-${Date.now()}@example.com`)).id;
  });

  it('accumulates usage per day', async () => {
    await recordUsage(userId, 100, 50);
    await recordUsage(userId, 10, 5);
    const row = (
      await getDb().execute(sql`SELECT requests, input_tokens, output_tokens FROM ai_usage WHERE user_id=${userId}`)
    ).rows[0];
    expect(Number(row.requests)).toBe(2);
    expect(Number(row.input_tokens)).toBe(110);
    expect(Number(row.output_tokens)).toBe(55);
  });

  it('enforces the daily cap', async () => {
    const capped = (await getOrCreateUserByEmail(`ai-cap-${Date.now()}@example.com`)).id;
    process.env.AI_DAILY_LIMIT_TEST_BYPASS = ''; // documentation only
    // simulate reaching the limit directly
    await getDb().execute(
      sql`INSERT INTO ai_usage (user_id, day, requests) VALUES (${capped}, to_char(now() AT TIME ZONE 'utc','YYYY-MM-DD'), 100)`
    );
    await expect(checkQuota(capped)).rejects.toThrow(QuotaError);
  });
});
