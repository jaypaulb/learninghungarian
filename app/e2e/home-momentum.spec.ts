import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.use({ extraHTTPHeaders: { 'X-Forwarded-User': `e2e-momentum-${Date.now()}@example.com` } });

test('fresh learner gets the Kezdjük start hero', async ({ page }) => {
  await page.goto('/');
  const hero = page.getByTestId('momentum');
  await expect(hero).toContainText('Kezdjük');
  await expect(hero).toContainText('lessons done');
  await expect(page.getByTestId('continue')).toBeVisible();
});

test('after an attempt the hero flips to Continue', async ({ page, request }) => {
  await request.post('/api/attempts', {
    headers: { Origin: 'http://localhost:3000' },
    data: { exerciseId: 'a1-smoke-test-ex1', result: 'wrong' }
  });
  await page.goto('/');
  await expect(page.getByTestId('momentum')).toContainText('Continue where you left off');
  // wrong answer scheduled an SRS item due now
  await expect(page.getByTestId('momentum')).toContainText('due for review');
});
