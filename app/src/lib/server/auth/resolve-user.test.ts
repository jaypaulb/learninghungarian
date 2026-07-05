import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('./user-repo', () => ({
  getOrCreateUserByEmail: vi.fn(async (email: string) => ({
    id: 'uuid-1',
    email,
    displayName: null,
    createdAt: new Date()
  }))
}));

import { getOrCreateUserByEmail } from './user-repo';
import { resolveUser } from './resolve-user';
import type { RequestEvent } from '@sveltejs/kit';

function eventWithHeaders(headers: Record<string, string>): RequestEvent {
  return {
    request: new Request('https://magyarul.nyolc.cc/', { headers })
  } as unknown as RequestEvent;
}

const originalEnv = { ...process.env };
afterEach(() => {
  process.env.NODE_ENV = originalEnv.NODE_ENV;
  delete process.env.DEV_USER_EMAIL;
  vi.clearAllMocks();
});

describe('resolveUser', () => {
  it('provisions from X-Forwarded-User, lowercased', async () => {
    const user = await resolveUser(eventWithHeaders({ 'X-Forwarded-User': 'Jay@Example.COM' }));
    expect(user?.email).toBe('jay@example.com');
    expect(getOrCreateUserByEmail).toHaveBeenCalledWith('jay@example.com');
  });

  it('returns null without header in production', async () => {
    process.env.NODE_ENV = 'production';
    process.env.DEV_USER_EMAIL = 'dev@localhost';
    const user = await resolveUser(eventWithHeaders({}));
    expect(user).toBeNull();
    expect(getOrCreateUserByEmail).not.toHaveBeenCalled();
  });

  it('falls back to DEV_USER_EMAIL outside production', async () => {
    process.env.NODE_ENV = 'development';
    process.env.DEV_USER_EMAIL = 'dev@localhost';
    const user = await resolveUser(eventWithHeaders({}));
    expect(user?.email).toBe('dev@localhost');
  });

  it('returns null with neither header nor fallback', async () => {
    process.env.NODE_ENV = 'development';
    const user = await resolveUser(eventWithHeaders({}));
    expect(user).toBeNull();
  });
});
