import { test, expect } from '@playwright/test';

test.use({ extraHTTPHeaders: { 'X-Forwarded-User': `e2e-assess-${Date.now()}@example.com` } });

test('A1 checkpoint runs end-to-end and passes at 8/8', async ({ page }) => {
  await page.goto('/assess/a1-assessment');
  await expect(page.locator('h1')).toContainText('A1 checkpoint');

  // q1 mcq
  await page.locator('[data-exercise-id="a1-assessment-q1"]').getByRole('button', { name: "English 's' in 'sun'" }).click();
  // q2/q3 dropdowns
  await page.locator('[data-exercise-id="a1-assessment-q2"]').getByLabel('choose').selectOption('-ban');
  await page.locator('[data-exercise-id="a1-assessment-q3"]').getByLabel('choose').selectOption('-ben');
  // q4 fill
  const q4 = page.locator('[data-exercise-id="a1-assessment-q4"]');
  await q4.getByLabel('answer').fill('vagyok');
  await q4.getByRole('button', { name: 'Check' }).click();
  // q5 mcq
  await page.locator('[data-exercise-id="a1-assessment-q5"]').getByRole('button', { name: 'Ő tanár.', exact: true }).click();
  // q6 transform
  const q6 = page.locator('[data-exercise-id="a1-assessment-q6"]');
  await q6.getByLabel('transformed sentence').fill('negyvenöt');
  await q6.getByRole('button', { name: 'Check' }).click();
  // q7 dropdown
  await page.locator('[data-exercise-id="a1-assessment-q7"]').getByLabel('choose').selectOption('Két');
  // q8 sentence build
  const q8 = page.locator('[data-exercise-id="a1-assessment-q8"]');
  await q8.getByRole('button', { name: 'Huszonnyolc', exact: true }).click();
  await q8.getByRole('button', { name: 'éves', exact: true }).click();
  await q8.getByRole('button', { name: 'vagyok', exact: true }).click();
  await q8.getByRole('button', { name: 'Check' }).click();

  const result = page.getByTestId('assessment-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Passed');
  await expect(result).toContainText('8/8');
});

test('curriculum page links to the tier checkpoint', async ({ page }) => {
  await page.goto('/learn');
  await expect(page.getByRole('link', { name: 'A1 checkpoint' })).toBeVisible();
});
