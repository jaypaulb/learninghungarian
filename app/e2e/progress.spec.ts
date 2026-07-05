import { test, expect } from '@playwright/test';

// One user across the whole file; steps build on each other. Unique per run:
// the dev stack's pgdata volume persists, so a fixed email would arrive with
// history from previous runs.
test.describe.configure({ mode: 'serial' });
test.use({ extraHTTPHeaders: { 'X-Forwarded-User': `e2e-progress-${Date.now()}@example.com` } });

test('attempt in the browser records progress on /learn', async ({ page }) => {
  await page.goto('/learn/a1-smoke-test');
  const ex = page.locator('[data-exercise-id="a1-smoke-test-ex1"]');
  const post = page.waitForResponse((r) => r.url().includes('/api/attempts') && r.ok());
  await ex.getByLabel('answer').fill('szia');
  await ex.getByRole('button', { name: 'Check' }).click();
  await post;

  await page.goto('/learn');
  await expect(page.getByTitle('in progress')).toBeVisible();
});

test('completing every exercise marks the lesson completed', async ({ request, page }) => {
  for (const ex of ['ex2', 'ex3', 'ex4', 'ex5', 'ex6', 'ex7']) {
    const res = await request.post('/api/attempts', {
      data: { exerciseId: `a1-smoke-test-${ex}`, result: 'correct' }
    });
    expect(res.ok()).toBeTruthy();
  }
  await page.goto('/learn');
  await expect(page.getByTitle('completed')).toBeVisible();
});

test('review shows due items and grades them', async ({ request, page }) => {
  // A wrong answer makes its SRS item due immediately.
  await request.post('/api/attempts', {
    data: { exerciseId: 'a1-smoke-test-ex1', result: 'wrong' }
  });
  await page.goto('/review');
  await page.getByLabel('flip review card').click();
  await page.getByRole('button', { name: 'Knew it' }).click();
  await expect(page.getByTestId('review-done')).toBeVisible();
});

test('export includes progress and srs sections', async ({ request }) => {
  const body = await (await request.get('/account/export')).json();
  expect(body.lessonProgress.length).toBeGreaterThanOrEqual(1);
  expect(body.exerciseProgress.length).toBeGreaterThanOrEqual(7);
  expect(body.srs.length).toBeGreaterThanOrEqual(1);
});
