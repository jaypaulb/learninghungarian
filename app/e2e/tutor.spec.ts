import { test, expect } from '@playwright/test';

// Local stack runs AI_PROVIDER=mock — deterministic replies.
test.use({ extraHTTPHeaders: { 'X-Forwarded-User': `e2e-tutor-${Date.now()}@example.com` } });

test('tutor chat round-trip with mock provider', async ({ page }) => {
  await page.goto('/tutor');
  await page.getByLabel('message').fill('Correct: Én vagyok tanár.');
  await page.getByRole('button', { name: 'Send' }).click();
  const log = page.getByTestId('chat-log');
  await expect(log).toContainText('Correct: Én vagyok tanár.');
  await expect(log).toContainText('MOCK_TUTOR_REPLY');
});

test('suggestion chips send a message', async ({ page }) => {
  await page.goto('/tutor');
  await page.getByRole('button', { name: /vowel harmony/ }).click();
  await expect(page.getByTestId('chat-log')).toContainText('MOCK_TUTOR_REPLY');
});

test('api requires auth and valid body', async ({ request }) => {
  const bad = await request.post('/api/tutor', { data: { history: 'nope' } });
  expect(bad.status()).toBe(400);
});
