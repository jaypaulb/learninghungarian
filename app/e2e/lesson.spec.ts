import { test, expect } from '@playwright/test';

// Real browser interactions against the containerized stack.
test.use({ extraHTTPHeaders: { 'X-Forwarded-User': 'e2e-lesson@example.com' } });

test.beforeEach(async ({ page }) => {
  await page.goto('/learn/a1-smoke-test');
});

test('lesson renders blocks, badge, and sources', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Pipeline smoke test');
  await expect(page.getByText('draft').first()).toBeVisible();
  await expect(page.getByText('Szia!')).toBeVisible(); // example block
  await expect(page.getByText('pipeline test content')).toBeVisible(); // source
});

test('fill-in-blank: correct, accent, and wrong feedback', async ({ page }) => {
  const ex = page.locator('[data-exercise-id="a1-smoke-test-ex1"]');
  const input = ex.getByLabel('answer');

  await input.fill('szia');
  await ex.getByRole('button', { name: 'Check' }).click();
  await expect(ex.getByTestId('feedback')).toContainText('Correct');

  await input.fill('kutya');
  await ex.getByRole('button', { name: 'Check' }).click();
  await expect(ex.getByTestId('feedback')).toContainText('Not quite');
});

test('mcq: picking right and wrong options', async ({ page }) => {
  const ex = page.locator('[data-exercise-id="a1-smoke-test-ex2"]');
  await ex.getByRole('button', { name: 'hello (informal)' }).click();
  await expect(ex.getByTestId('feedback')).toContainText('Correct');
});

test('card flip: flip and self-grade', async ({ page }) => {
  const ex = page.locator('[data-exercise-id="a1-smoke-test-ex3"]');
  await ex.getByLabel('flip card').click();
  await expect(ex.getByLabel('flip card')).toContainText('hi / bye');
  await ex.getByRole('button', { name: 'Knew it' }).click();
  await expect(ex.getByTestId('feedback')).toContainText('Recorded');
});
