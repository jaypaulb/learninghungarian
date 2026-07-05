import { getDb } from '$lib/server/db';
import { aiUsage } from '$lib/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';

const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT ?? 100);

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Throws QuotaError when the user's free daily allowance is exhausted. */
export class QuotaError extends Error {}

export async function checkQuota(userId: string): Promise<{ used: number; limit: number }> {
  const db = getDb();
  const row = (
    await db.select().from(aiUsage).where(and(eq(aiUsage.userId, userId), eq(aiUsage.day, today())))
  )[0];
  const used = row?.requests ?? 0;
  if (used >= DAILY_LIMIT) throw new QuotaError(`daily AI limit reached (${DAILY_LIMIT})`);
  return { used, limit: DAILY_LIMIT };
}

export async function recordUsage(userId: string, inputTokens: number, outputTokens: number) {
  const db = getDb();
  await db
    .insert(aiUsage)
    .values({ userId, day: today(), requests: 1, inputTokens, outputTokens })
    .onConflictDoUpdate({
      target: [aiUsage.userId, aiUsage.day],
      set: {
        requests: sql`${aiUsage.requests} + 1`,
        inputTokens: sql`${aiUsage.inputTokens} + ${inputTokens}`,
        outputTokens: sql`${aiUsage.outputTokens} + ${outputTokens}`
      }
    });
}
