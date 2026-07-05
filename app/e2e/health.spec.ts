import { test, expect } from '@playwright/test';

test('health endpoint reports ok against the running stack', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.db).toBe('ok');
});
