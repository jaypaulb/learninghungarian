import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { submitFeedback, FeedbackError } from '$lib/server/feedback/submit';

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.user) throw error(401, 'Not signed in');
  const body = await request.json().catch(() => null);
  if (!body || typeof body.message !== 'string') throw error(400, 'expected { message, lessonId?, exerciseId?, consentContact? }');
  try {
    const result = await submitFeedback({
      userId: locals.user.id,
      lessonId: typeof body.lessonId === 'string' ? body.lessonId : undefined,
      exerciseId: typeof body.exerciseId === 'string' ? body.exerciseId : undefined,
      message: body.message,
      consentContact: body.consentContact === true
    });
    return json({ ok: true, id: result.id });
  } catch (e) {
    if (e instanceof FeedbackError) {
      throw error(e.code === 'rate_limited' ? 429 : 400, e.message);
    }
    throw e;
  }
};
