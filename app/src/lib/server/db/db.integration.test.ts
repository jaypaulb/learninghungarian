import { describe, it, expect } from 'vitest';
import { checkDbConnection } from './index';

// Requires DATABASE_URL pointing at a running Postgres (see plan Step 5).
describe('checkDbConnection', () => {
  it('returns true against a reachable database', async () => {
    const ok = await checkDbConnection();
    expect(ok).toBe(true);
  });
});
