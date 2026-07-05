import { test, expect } from '@playwright/test';

test.use({ extraHTTPHeaders: { 'X-Forwarded-User': `e2e-nav-${Date.now()}@example.com` } });

test('lessons chain forward without returning to the curriculum', async ({ page }) => {
  // smoke-test (position 0) -> alphabet (1) -> vowel-harmony (2) ...
  await page.goto('/learn/a1-smoke-test');
  await expect(page.getByTestId('next-lesson')).toContainText('alphabet');
  await page.getByTestId('next-lesson').click();
  await page.waitForURL('**/learn/a1-alphabet');
  await expect(page.locator('h1')).toContainText('alphabet');
  await expect(page.getByTestId('prev-lesson')).toBeVisible();
  await page.getByTestId('next-lesson').click();
  await page.waitForURL('**/learn/a1-vowel-harmony');
  await expect(page.locator('h1')).toContainText('Vowel harmony');
});

test('last lesson points back to the curriculum', async ({ page }) => {
  await page.goto('/learn/a1-numbers'); // currently the last lesson
  await expect(page.getByTestId('next-lesson')).toContainText('Back to curriculum');
});
