import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { tutorReply } from '$lib/server/ai/tutor';
import { checkQuota, recordUsage, QuotaError } from '$lib/server/ai/metering';

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.user) throw error(401, 'Not signed in');
  const body = await request.json().catch(() => null);
  const history = body?.history;
  if (
    !Array.isArray(history) ||
    history.length === 0 ||
    !history.every(
      (m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.length <= 4000
    )
  ) {
    throw error(400, 'expected { history: [{role: user|assistant, content}] }');
  }

  try {
    await checkQuota(locals.user.id);
    const result = await tutorReply(locals.user.id, history);
    await recordUsage(locals.user.id, result.inputTokens, result.outputTokens);
    return json({ reply: result.text, provider: result.provider });
  } catch (e) {
    if (e instanceof QuotaError) throw error(429, e.message);
    console.error('tutor error:', e);
    throw error(502, 'The tutor is unavailable right now — try again in a minute.');
  }
};
