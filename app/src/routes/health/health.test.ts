import { describe, it, expect, vi } from 'vitest';

vi.mock('$lib/server/db', () => ({
  checkDbConnection: vi.fn()
}));

import { checkDbConnection } from '$lib/server/db';
import { GET } from './+server';

describe('GET /health', () => {
  it('returns 200 and db ok when the database is reachable', async () => {
    vi.mocked(checkDbConnection).mockResolvedValue(true);
    const response = await GET();
    expect(response.status).toBe(200);
    expect((await response.json()).db).toBe('ok');
  });

  it('returns 503 and db down when the database is unreachable', async () => {
    vi.mocked(checkDbConnection).mockResolvedValue(false);
    const response = await GET();
    expect(response.status).toBe(503);
    expect((await response.json()).db).toBe('down');
  });
});
