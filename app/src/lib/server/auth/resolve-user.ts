import type { RequestEvent } from '@sveltejs/kit';
import type { User } from '$lib/server/db/schema';
import { getOrCreateUserByEmail } from './user-repo';

/**
 * Identity seam (SP1 Plan 2). Gated-testing implementation: trust the
 * X-Forwarded-User email asserted by HAL's traefik-forward-auth gate
 * (chain-oauth, whitelisted). Swapped for an in-app Google OAuth flow +
 * session table at public launch — callers only ever see locals.user.
 *
 * Dev fallback: with no gate in front (local dev), DEV_USER_EMAIL
 * provides an identity; it is ignored when NODE_ENV=production.
 */
export async function resolveUser(event: RequestEvent): Promise<User | null> {
  let email = event.request.headers.get('x-forwarded-user');
  if (!email && process.env.NODE_ENV !== 'production') {
    email = process.env.DEV_USER_EMAIL ?? null;
  }
  if (!email) return null;
  return getOrCreateUserByEmail(email.toLowerCase());
}
