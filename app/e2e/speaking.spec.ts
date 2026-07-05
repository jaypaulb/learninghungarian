import { test, expect } from '@playwright/test';

// Fake mic (silence) + mock STT on the local stack. The mock provider
// returns MOCK_TRANSCRIPT unless the request carries mockTranscript — the
// component doesn't send one, so this exercises the WRONG path end-to-end;
// the API contract test covers the correct path.
test.use({
  extraHTTPHeaders: { 'X-Forwarded-User': `e2e-speak-${Date.now()}@example.com` },
  launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] }
});

test('speaking exercise records, uploads, and grades', async ({ page }) => {
  await page.goto('/learn/a1-alphabet');
  const ex = page.locator('[data-exercise-id="a1-alphabet-ex10"]');
  await expect(ex).toContainText('Say it out loud');
  await ex.getByTestId('record').click();
  await page.waitForTimeout(700); // capture some fake-mic audio
  await ex.getByTestId('stop').click();
  await expect(ex.getByTestId('feedback')).toBeVisible({ timeout: 15000 });
  await expect(ex).toContainText('I heard:');
  await expect(ex).toContainText('MOCK_TRANSCRIPT'); // wrong-path transcript shown honestly
});

test('speech api grades correct pronunciation via mock pass-through', async ({ request }) => {
  const res = await request.post('/api/speech', {
    headers: { Origin: 'http://localhost:3000' },
    multipart: {
      audio: { name: 'speech.webm', mimeType: 'audio/webm', buffer: Buffer.from([1, 2, 3]) },
      exerciseId: 'a1-alphabet-ex10',
      mockTranscript: 'nyolc'
    }
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe('correct');
  expect(body.provider).toBe('mock');
});

test('speech api accent-classifies near misses', async ({ request }) => {
  const res = await request.post('/api/speech', {
    headers: { Origin: 'http://localhost:3000' },
    multipart: {
      audio: { name: 'speech.webm', mimeType: 'audio/webm', buffer: Buffer.from([1, 2, 3]) },
      exerciseId: 'a1-numbers-ex10',
      mockTranscript: 'harom'
    }
  });
  const body = await res.json();
  expect(body.result).toBe('accent'); // harom vs három
});
