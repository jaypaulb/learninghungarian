import { test, expect } from '@playwright/test';

test.use({ extraHTTPHeaders: { 'X-Forwarded-User': `e2e-listen-${Date.now()}@example.com` } });

test('listening transcribe: audio present, accent-aware validation', async ({ page }) => {
  await page.goto('/learn/a1-alphabet');
  const ex = page.locator('[data-exercise-id="a1-alphabet-ex8"]');
  await expect(ex.locator('audio')).toHaveAttribute('src', /\/audio\/.+\.mp3/);
  // never shows the answer text before checking
  await expect(ex).not.toContainText('nyolc');

  await ex.getByLabel('what you heard').fill('nyolc');
  await ex.getByRole('button', { name: 'Check' }).click();
  await expect(ex.getByTestId('feedback')).toContainText('Correct');
});

test('listening meaning: options grade correctly', async ({ page }) => {
  await page.goto('/learn/a1-alphabet');
  const ex = page.locator('[data-exercise-id="a1-alphabet-ex9"]');
  await ex.getByRole('button', { name: 'hi (informal)' }).click();
  await expect(ex.getByTestId('feedback')).toContainText('Correct');
});

test('audio button on flashcards and examples', async ({ page }) => {
  await page.goto('/learn/a1-alphabet');
  await expect(page.locator('[data-exercise-id="a1-alphabet-ex4"]').getByLabel('Hear the word')).toBeVisible();
  await page.goto('/learn/a1-verb-to-be');
  await expect(page.getByLabel('Hear it spoken').first()).toBeVisible();
});

test('audio file is actually served', async ({ page, request }) => {
  await page.goto('/learn/a1-alphabet');
  const src = await page.locator('[data-exercise-id="a1-alphabet-ex8"] audio').getAttribute('src');
  const res = await request.get(src!);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('audio');
});
