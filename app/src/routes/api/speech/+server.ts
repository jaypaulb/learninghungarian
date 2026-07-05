import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { exercises } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { transcribe, resolveSttProvider } from '$lib/server/speech/stt';
import { classifyAnswer } from '$lib/engine/validate';
import { recordAttempt } from '$lib/server/progress/record-attempt';

const MAX_AUDIO_BYTES = 2 * 1024 * 1024; // ~15s of opus is plenty for a phrase

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.user) throw error(401, 'Not signed in');
  const form = await request.formData().catch(() => null);
  const audio = form?.get('audio');
  const exerciseId = form?.get('exerciseId');
  if (!(audio instanceof Blob) || typeof exerciseId !== 'string') {
    throw error(400, 'expected multipart { audio, exerciseId }');
  }
  if (audio.size === 0 || audio.size > MAX_AUDIO_BYTES) throw error(400, 'audio must be 1 byte - 2MB');

  const ex = (await getDb().select().from(exercises).where(eq(exercises.id, exerciseId)))[0];
  if (!ex || ex.type !== 'speaking') throw error(404, 'unknown speaking exercise');
  const expected = (ex.payload as { expected: string }).expected;

  // Mock provider (tests) gets the expected text only when the client asks
  // for a "pass" simulation; otherwise a fixed wrong transcript.
  const mockWanted = form?.get('mockTranscript');
  const result = await transcribe(audio, typeof mockWanted === 'string' ? mockWanted : undefined);

  const grade = classifyAnswer(result.transcript, expected);
  await recordAttempt(locals.user.id, exerciseId, grade);
  return json({ transcript: result.transcript, result: grade, provider: resolveSttProvider() });
};
