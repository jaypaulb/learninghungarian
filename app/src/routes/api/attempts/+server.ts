import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { recordAttempt } from '$lib/server/progress/record-attempt';

const VALID = new Set(['correct', 'accent', 'wrong']);

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.user) throw error(401, 'Not signed in');
  const body = await request.json().catch(() => null);
  if (!body || typeof body.exerciseId !== 'string' || !VALID.has(body.result)) {
    throw error(400, 'expected { exerciseId: string, result: correct|accent|wrong }');
  }
  await recordAttempt(locals.user.id, body.exerciseId, body.result);
  return json({ ok: true });
};
