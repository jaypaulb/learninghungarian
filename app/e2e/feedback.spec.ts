import { test, expect } from '@playwright/test';

test.use({ extraHTTPHeaders: { 'X-Forwarded-User': `e2e-feedback-${Date.now()}@example.com` } });

test('suggest-a-correction flow on a lesson page', async ({ page }) => {
  await page.goto('/learn/a1-smoke-test');
  await page.getByRole('button', { name: /Suggest a correction/ }).click();
  await page.getByLabel(/What's wrong/).fill('The dialogue sounds unnatural to me.');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByTestId('feedback-sent')).toBeVisible();
});
