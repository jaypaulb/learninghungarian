// Idempotent content importer: YAML in content/ -> Postgres.
// Runs in the entrypoint after migrations (content ships inside the image),
// and locally via `npm run content:import`. Single transaction: any
// validation or drift error aborts the whole import.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';
import pg from 'pg';
import { lessonSchema, moduleSchema, PAYLOAD_SCHEMA_VERSION } from './content-schema.mjs';

const CONTENT_DIR = process.env.CONTENT_DIR ?? 'content';
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

function contentHash(obj) {
  return createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 16);
}

function loadYaml(path) {
  try {
    return parse(readFileSync(path, 'utf8'));
  } catch (e) {
    throw new Error(`${path}: ${e.message}`);
  }
}

// ---- discover + validate everything before touching the DB ----
const modules = [];
const lessons = [];
for (const tierDir of readdirSync(CONTENT_DIR).sort()) {
  const tierPath = join(CONTENT_DIR, tierDir);
  if (!statSync(tierPath).isDirectory()) continue;
  for (const modDir of readdirSync(tierPath).sort()) {
    const modPath = join(tierPath, modDir);
    if (!statSync(modPath).isDirectory()) continue;
    const modFile = join(modPath, '_module.yaml');
    const mod = moduleSchema.parse(loadYaml(modFile));
    if (mod.tier !== tierDir) throw new Error(`${modFile}: tier ${mod.tier} != directory ${tierDir}`);
    modules.push(mod);
    for (const f of readdirSync(modPath).sort()) {
      if (!f.endsWith('.yaml') || f === '_module.yaml') continue;
      const lessonFile = join(modPath, f);
      const parsed = lessonSchema.safeParse(loadYaml(lessonFile));
      if (!parsed.success) {
        throw new Error(`${lessonFile}:\n${parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n')}`);
      }
      lessons.push({ ...parsed.data, moduleId: mod.id, file: lessonFile });
    }
  }
}

const exerciseIds = new Set();
for (const l of lessons)
  for (const ex of l.exercises) {
    const globalId = `${l.id}-${ex.id}`;
    if (exerciseIds.has(globalId)) throw new Error(`duplicate exercise id ${globalId}`);
    exerciseIds.add(globalId);
  }

// ---- import in one transaction ----
const pool = new pg.Pool({ connectionString });
const client = await pool.connect();
try {
  await client.query('BEGIN');

  for (const m of modules) {
    await client.query(
      `INSERT INTO modules (id, tier, title, description, position)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET tier=$2, title=$3, description=$4, position=$5`,
      [m.id, m.tier, m.title, m.description ?? null, m.position]
    );
  }

  for (const l of lessons) {
    const hash = contentHash({ blocks: l.blocks, exercises: l.exercises, srsItems: l.srsItems });
    const existing = await client.query(
      'SELECT content_version, provenance FROM lessons WHERE id=$1',
      [l.id]
    );
    if (existing.rows.length > 0) {
      const row = existing.rows[0];
      const oldHash = row.provenance?.contentHash;
      if (row.content_version === l.version && oldHash && oldHash !== hash) {
        throw new Error(
          `${l.file}: content changed but version still ${l.version} — bump 'version:' (drift guard)`
        );
      }
    }
    const provenance = { ...l.provenance, contentHash: hash };
    await client.query(
      `INSERT INTO lessons (id, module_id, position, title, objectives, prerequisites, skill_tags,
                            status, content_version, sources, provenance, estimated_minutes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO UPDATE SET module_id=$2, position=$3, title=$4, objectives=$5,
         prerequisites=$6, skill_tags=$7, status=$8, content_version=$9, sources=$10,
         provenance=$11, estimated_minutes=$12`,
      [
        l.id, l.moduleId, l.position, l.title,
        JSON.stringify(l.objectives), JSON.stringify(l.prerequisites), JSON.stringify(l.skills),
        l.status, l.version, JSON.stringify(l.sources), JSON.stringify(provenance),
        l.minutes ?? null
      ]
    );

    // Blocks are positional: replace wholesale for this lesson.
    await client.query('DELETE FROM content_blocks WHERE lesson_id=$1', [l.id]);
    for (let i = 0; i < l.blocks.length; i++) {
      await client.query(
        'INSERT INTO content_blocks (lesson_id, position, type, payload) VALUES ($1,$2,$3,$4)',
        [l.id, i, l.blocks[i].type, JSON.stringify(l.blocks[i].payload)]
      );
    }

    for (const s of l.srsItems) {
      await client.query(
        `INSERT INTO srs_items (id, kind, payload) VALUES ($1,$2,$3)
         ON CONFLICT (id) DO UPDATE SET kind=$2, payload=$3`,
        [s.id, s.id.split(':')[0], JSON.stringify(s.payload)]
      );
    }

    for (let i = 0; i < l.exercises.length; i++) {
      const ex = l.exercises[i];
      const globalId = `${l.id}-${ex.id}`;
      await client.query(
        `INSERT INTO exercises (id, lesson_id, assessment_id, position, type,
                                payload_schema_version, payload, content_version)
         VALUES ($1,$2,NULL,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO UPDATE SET lesson_id=$2, position=$3, type=$4,
           payload_schema_version=$5, payload=$6, content_version=$7`,
        [globalId, l.id, i, ex.type, PAYLOAD_SCHEMA_VERSION, JSON.stringify(ex.payload), l.version]
      );
      await client.query('DELETE FROM exercise_srs_items WHERE exercise_id=$1', [globalId]);
      for (const srsId of ex.srs) {
        await client.query(
          'INSERT INTO exercise_srs_items (exercise_id, srs_item_id) VALUES ($1,$2)',
          [globalId, srsId]
        );
      }
    }
  }

  // Orphan check: DB rows whose IDs vanished from the repo (warn, never delete).
  const repoLessonIds = lessons.map((l) => l.id);
  const orphans = await client.query(
    repoLessonIds.length > 0
      ? { text: 'SELECT id FROM lessons WHERE NOT (id = ANY($1))', values: [repoLessonIds] }
      : { text: 'SELECT id FROM lessons', values: [] }
  );
  for (const row of orphans.rows) console.warn(`WARN orphan lesson in DB not in repo: ${row.id}`);

  await client.query('COMMIT');
  console.log(`Content import OK: ${modules.length} modules, ${lessons.length} lessons, ${exerciseIds.size} exercises.`);
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
  await pool.end();
}
