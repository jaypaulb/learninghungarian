import { test, expect } from '@playwright/test';

test.use({ extraHTTPHeaders: { 'X-Forwarded-User': 'e2e-lesson2@example.com' } });

test.beforeEach(async ({ page }) => {
  await page.goto('/learn/a1-smoke-test');
});

test('dropdown: selecting the right option', async ({ page }) => {
  const ex = page.locator('[data-exercise-id="a1-smoke-test-ex4"]');
  await ex.getByLabel('choose').selectOption('reggelt');
  await expect(ex.getByTestId('feedback')).toContainText('Correct');
});

test('sentence build: correct order via word tiles', async ({ page }) => {
  const ex = page.locator('[data-exercise-id="a1-smoke-test-ex5"]');
  await ex.getByRole('button', { name: 'Én', exact: true }).click();
  await ex.getByRole('button', { name: 'tanár', exact: true }).click();
  await ex.getByRole('button', { name: 'vagyok', exact: true }).click();
  await ex.getByRole('button', { name: 'Check' }).click();
  await expect(ex.getByTestId('feedback')).toContainText('Correct');
});

test('transform: accent-aware feedback on missing diacritics', async ({ page }) => {
  const ex = page.locator('[data-exercise-id="a1-smoke-test-ex6"]');
  await ex.getByLabel('transformed sentence').fill('szia');
  await ex.getByRole('button', { name: 'Check' }).click();
  await expect(ex.getByTestId('feedback')).toContainText('Correct');
});

test('dialogue: gap-by-gap validation incl. accent class', async ({ page }) => {
  const ex = page.locator('[data-exercise-id="a1-smoke-test-ex7"]');
  await ex.getByLabel('gap 1').fill('szia');
  await ex.locator('li').first().getByRole('button', { name: 'Check' }).click();
  await expect(ex.getByTestId('feedback-0')).toContainText('Correct');
  await ex.getByLabel('gap 2').fill('vagyok');
  await ex.locator('li').nth(1).getByRole('button', { name: 'Check' }).click();
  await expect(ex.getByTestId('feedback-1')).toContainText('Correct');
});
