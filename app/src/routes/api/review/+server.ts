import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { userSrsState } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { sm2, qualityFor, nextDue, type SrsState } from '$lib/engine/sm2';

/** Grade a due SRS item from the review session (self-graded card). */
export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.user) throw error(401, 'Not signed in');
  const body = await request.json().catch(() => null);
  if (!body?.srsItemId || !['correct', 'wrong'].includes(body.result)) {
    throw error(400, 'expected { srsItemId, skill, direction, result }');
  }
  const db = getDb();
  const key = and(
    eq(userSrsState.userId, locals.user.id),
    eq(userSrsState.srsItemId, body.srsItemId),
    eq(userSrsState.skill, body.skill ?? 'reading'),
    eq(userSrsState.modality, 'text'),
    eq(userSrsState.direction, body.direction ?? 'recognition')
  );
  const row = (await db.select().from(userSrsState).where(key))[0];
  if (!row) throw error(404, 'no such SRS state');
  const prev: SrsState = { ease: row.ease, intervalDays: row.intervalDays, reps: row.reps, lapses: row.lapses };
  const next = sm2(prev, qualityFor(body.result, true));
  await db
    .update(userSrsState)
    .set({
      ease: next.ease,
      intervalDays: next.intervalDays,
      reps: next.reps,
      lapses: next.lapses,
      dueAt: nextDue(new Date(), next.intervalDays)
    })
    .where(key);
  return json({ ok: true });
};
