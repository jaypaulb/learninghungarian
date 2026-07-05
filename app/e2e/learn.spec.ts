import { test, expect } from '@playwright/test';

test('curriculum page lists imported content with status badge', async ({ request }) => {
  const res = await request.get('/learn', {
    headers: { 'X-Forwarded-User': 'e2e-learn@example.com' }
  });
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).toContain('Foundation'); // module title
  expect(html).toContain('Pipeline smoke test'); // lesson title
  expect(html).toContain('draft'); // honest status badge
});
