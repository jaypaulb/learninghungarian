import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, cpSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getDb } from '$lib/server/db';
import { sql } from 'drizzle-orm';

function runImport(contentDir: string) {
  return execFileSync('node', ['scripts/import-content.js'], {
    env: { ...process.env, CONTENT_DIR: contentDir },
    encoding: 'utf8'
  });
}

async function snapshot() {
  const db = getDb();
  const rows = await db.execute(sql`
    SELECT (SELECT count(*) FROM modules) AS modules,
           (SELECT count(*) FROM lessons) AS lessons,
           (SELECT count(*) FROM exercises) AS exercises,
           (SELECT count(*) FROM content_blocks) AS blocks,
           (SELECT count(*) FROM srs_items) AS srs,
           (SELECT provenance->>'contentHash' FROM lessons WHERE id='a1-smoke-test') AS hash`);
  return rows.rows[0];
}

// Requires DATABASE_URL pointing at a running, migrated Postgres.
describe.skipIf(!process.env.DATABASE_URL)('content import', () => {
  it('imports the repo content and is idempotent', async () => {
    const out1 = runImport('content');
    expect(out1).toContain('Content import OK');
    const s1 = await snapshot();
    expect(Number(s1.lessons)).toBeGreaterThanOrEqual(1);
    expect(Number(s1.exercises)).toBeGreaterThanOrEqual(3);

    const out2 = runImport('content');
    expect(out2).toContain('Content import OK');
    expect(await snapshot()).toEqual(s1);
  });

  it('rejects content changes without a version bump (drift guard)', async () => {
    runImport('content');
    const dir = mkdtempSync(join(tmpdir(), 'content-drift-'));
    cpSync('content', dir, { recursive: true });
    const lessonPath = join(dir, 'A1/foundation/smoke-test.yaml');
    writeFileSync(lessonPath, readFileSync(lessonPath, 'utf8').replace('Hogy vagy?', 'Mi újság?'));
    expect(() => runImport(dir)).toThrow(/drift guard|bump 'version:'/s);
  });

  it('rejects invalid exercise payloads with a useful error', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'content-invalid-'));
    cpSync('content', dir, { recursive: true });
    const lessonPath = join(dir, 'A1/foundation/smoke-test.yaml');
    writeFileSync(
      lessonPath,
      readFileSync(lessonPath, 'utf8').replace('correctIndex: 0', 'correctIndex: notanumber')
    );
    expect(() => runImport(dir)).toThrow(/mcq/);
  });
});
