import type { Handle } from '@sveltejs/kit';
import { resolveUser } from '$lib/server/auth/resolve-user';

export const handle: Handle = async ({ event, resolve }) => {
  // /health must stay dependency-free (no user lookup, no DB write).
  if (event.url.pathname !== '/health') {
    event.locals.user = await resolveUser(event);
  } else {
    event.locals.user = null;
  }
  return resolve(event);
};
