import { test, expect } from '@playwright/test';

// The local compose stack has no forward-auth in front, so we assert the
// gate contract directly: identity comes from X-Forwarded-User.
const asJay = { 'X-Forwarded-User': 'e2e-jay@example.com' };

test('account page requires identity', async ({ request }) => {
  const anon = await request.get('/account');
  expect(anon.status()).toBe(401);
});

test('account page shows the forwarded identity', async ({ request }) => {
  const res = await request.get('/account', { headers: asJay });
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('e2e-jay@example.com');
});

test('export returns the user data as JSON attachment', async ({ request }) => {
  const res = await request.get('/account/export', { headers: asJay });
  expect(res.status()).toBe(200);
  expect(res.headers()['content-disposition']).toContain('attachment');
  const body = await res.json();
  expect(body.user.email).toBe('e2e-jay@example.com');
});

test('delete removes the account and identity re-provisions', async ({ request }) => {
  const before = await (await request.get('/account/export', { headers: asJay })).json();
  const del = await request.post('/account?/delete', {
    headers: { ...asJay, Origin: 'http://localhost:3000' },
    form: {},
    maxRedirects: 0
  });
  // Browsers get a 303; API-style clients get SvelteKit's JSON-serialized
  // redirect with 200. Either way the outcome below is what matters.
  expect([200, 302, 303]).toContain(del.status());
  const after = await (await request.get('/account/export', { headers: asJay })).json();
  expect(after.user.id).not.toBe(before.user.id);
  expect(after.user.email).toBe('e2e-jay@example.com');
});
