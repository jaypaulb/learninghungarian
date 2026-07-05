import { describe, it, expect } from 'vitest';
import { checkDbConnection } from './index';

// Requires DATABASE_URL pointing at a running Postgres (see plan Step 5).
// Skips (visibly) when no DATABASE_URL is set, so the unit suite stays
// runnable without local infra.
describe.skipIf(!process.env.DATABASE_URL)('checkDbConnection', () => {
  it('returns true against a reachable database', async () => {
    const ok = await checkDbConnection();
    expect(ok).toBe(true);
  });
});
