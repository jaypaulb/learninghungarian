import { test, expect } from '@playwright/test';

const learner = `e2e-fb-${Date.now()}@example.com`;

test('non-admin cannot open the triage page', async ({ request }) => {
  const res = await request.get('/admin/feedback', {
    headers: { 'X-Forwarded-User': learner }
  });
  expect(res.status()).toBe(403);
});

test('admin triages a submission end-to-end', async ({ browser }) => {
  // learner submits
  const learnerCtx = await browser.newContext({ extraHTTPHeaders: { 'X-Forwarded-User': learner } });
  const lp = await learnerCtx.newPage();
  await lp.goto('/learn/a1-greetings');
  await lp.getByRole('button', { name: /Suggest a correction/ }).click();
  await lp.getByLabel(/What's wrong/).fill('E2E triage test suggestion.');
  await lp.getByRole('button', { name: 'Send' }).click();
  await expect(lp.getByTestId('feedback-sent')).toBeVisible();
  await learnerCtx.close();

  // admin resolves
  const adminCtx = await browser.newContext({
    extraHTTPHeaders: { 'X-Forwarded-User': 'jaypaulb@gmail.com' }
  });
  const ap = await adminCtx.newPage();
  await ap.goto('/admin/feedback');
  const row = ap.getByTestId('feedback-row').filter({ hasText: 'E2E triage test suggestion.' }).first();
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Accept' }).click();
  await expect(
    ap.getByTestId('feedback-row').filter({ hasText: 'E2E triage test suggestion.' }).first()
  ).toContainText('accepted');
  await adminCtx.close();
});
