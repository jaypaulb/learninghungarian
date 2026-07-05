# SP1 Plan 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a Dockerized SvelteKit + PostgreSQL + Drizzle skeleton with a database-backed health check, deployable on HAL via Docker Compose.

**Architecture:** A single SvelteKit app (TypeScript, `adapter-node`, Tailwind via the build pipeline) lives in `app/` alongside the retired Jekyll site. PostgreSQL runs as a sibling container; Drizzle owns the schema via generated migrations that run on deploy. A `/health` route proves the app is up and the DB is reachable. This is the substrate every later SP1 plan extends.

**Tech Stack:** SvelteKit 2 (Svelte 5), TypeScript, Vite, Tailwind CSS, Drizzle ORM, PostgreSQL 16, Docker Compose, Vitest (unit/integration), Playwright (smoke).

## Global Constraints

- App code lives under `app/`; the existing Jekyll site at repo root stays untouched until superseded.
- Node: **22 LTS** (pin in Dockerfile and `package.json` `engines`).
- SvelteKit adapter: **`@sveltejs/adapter-node`** (self-hosted container, not static).
- ORM: **Drizzle**; the schema is changed only via **generated migrations**, and migrations are the deploy path — never ad-hoc `CREATE TABLE` in app or seed code.
- Styling: **Tailwind via the build pipeline** (no CDN).
- PostgreSQL: **16**.
- All secrets come from environment variables; `app/.env.example` is the committed template, `.env` is git-ignored.
- Database URL env var name is exactly **`DATABASE_URL`** everywhere.
- Product domain is `nyolc.cc`; page copy must not hardcode any other domain.
- **Deploy model (HAL deployrr stack, per `hal:~/docker/CLAUDE.md` and the `olitrack-saas.yml` precedent):** CI in this repo builds the image and pushes to **GHCR** (`ghcr.io/jaypaulb/learninghungarian`); HAL pulls it via a per-service file `compose/hal2020/nyolc.yml`. The app uses HAL's **shared `postgresql` service** (dedicated `nyolc` database + role), joins `default` + `t3_proxy`, has **no `ports:` block**, and is routed by a file-based Traefik rule `app-nyolc.yml` using `chain-no-auth` (public site). The root `docker-compose.yml` in this repo is the **local dev/smoke stack only**.

---

### Task 1: SvelteKit + TypeScript + Tailwind scaffold with a static health route

**Files:**
- Create: `app/package.json`
- Create: `app/svelte.config.js`
- Create: `app/vite.config.ts`
- Create: `app/tsconfig.json`
- Create: `app/.gitignore`
- Create: `app/postcss.config.js`
- Create: `app/tailwind.config.js`
- Create: `app/src/app.css`
- Create: `app/src/app.html`
- Create: `app/src/app.d.ts`
- Create: `app/src/routes/+layout.svelte`
- Create: `app/src/routes/+page.svelte`
- Create: `app/src/routes/health/+server.ts`
- Test: `app/src/routes/health/health.test.ts`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a GET handler at `/health` — `GET(): Response` returning JSON `{ status: 'ok', db: 'skipped' }` with HTTP 200. Task 2 replaces `db: 'skipped'` with a real DB probe.

- [ ] **Step 1: Create `app/package.json`**

```json
{
  "name": "learninghungarian-app",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "engines": { "node": ">=22 <23" },
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@sveltejs/adapter-node": "^5.2.0",
    "@sveltejs/kit": "^2.5.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "vitest": "^2.1.0",
    "@playwright/test": "^1.47.0"
  }
}
```

- [ ] **Step 2: Create the config files**

`app/svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: { adapter: adapter() }
};

export default config;
```

`app/vite.config.ts`:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
```

`app/tsconfig.json`:

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

`app/.gitignore`:

```
node_modules
/build
/.svelte-kit
/package
.env
.env.*
!.env.example
vite.config.ts.timestamp-*
/test-results
/playwright-report
```

`app/postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

`app/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] }
    }
  },
  plugins: []
};
```

- [ ] **Step 3: Create the app shell files**

`app/src/app.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`app/src/app.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover" class="bg-slate-100 text-slate-700">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

`app/src/app.d.ts`:

```ts
// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
```

`app/src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

{@render children()}
```

`app/src/routes/+page.svelte`:

```svelte
<main class="mx-auto max-w-3xl p-8">
  <h1 class="text-2xl font-bold text-teal-700">Learning Hungarian</h1>
  <p class="mt-2 text-slate-600">Platform foundation is running.</p>
</main>
```

- [ ] **Step 4: Write the failing test for the health route**

`app/src/routes/health/health.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { GET } from './+server';

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.db).toBe('skipped');
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `cd app && npm install && npm run test:unit -- health`
Expected: FAIL — cannot resolve `./+server` (module does not exist yet).

- [ ] **Step 6: Implement the minimal health route**

`app/src/routes/health/+server.ts`:

```ts
import { json } from '@sveltejs/kit';

export function GET() {
  return json({ status: 'ok', db: 'skipped' });
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `cd app && npm run test:unit -- health`
Expected: PASS (1 test).

- [ ] **Step 8: Verify the dev server boots and the route renders**

Run: `cd app && npm run dev` then in another shell `curl -s localhost:5173/health`
Expected: `{"status":"ok","db":"skipped"}`. Stop the dev server.

- [ ] **Step 9: Commit**

```bash
git add app/package.json app/svelte.config.js app/vite.config.ts app/tsconfig.json \
  app/.gitignore app/postcss.config.js app/tailwind.config.js app/src/app.css \
  app/src/app.html app/src/app.d.ts app/src/routes app/package-lock.json
git commit -m "feat(app): scaffold SvelteKit + Tailwind with static /health route"
```

---

### Task 2: Postgres + Drizzle with a database-backed health check

**Files:**
- Create: `app/drizzle.config.ts`
- Create: `app/src/lib/server/db/schema.ts`
- Create: `app/src/lib/server/db/index.ts`
- Create: `app/.env.example`
- Modify: `app/src/routes/health/+server.ts`
- Modify: `app/src/routes/health/health.test.ts`
- Create: `app/src/lib/server/db/db.integration.test.ts`
- Modify: `app/package.json` (add drizzle deps + scripts)

**Interfaces:**
- Consumes: the `/health` GET handler from Task 1.
- Produces:
  - `db` — a Drizzle client (`drizzle-orm/node-postgres` `NodePgDatabase`) exported from `app/src/lib/server/db/index.ts`.
  - `appMeta` — a Drizzle table (`app/src/lib/server/db/schema.ts`) with columns `key: text (pk)`, `value: text`.
  - `checkDbConnection(): Promise<boolean>` from `app/src/lib/server/db/index.ts` — runs `SELECT 1`, returns `true` on success, `false` on failure.
  - `/health` now returns `{ status, db: 'ok' | 'down' }` and HTTP 200 when db ok, 503 when db down.

- [ ] **Step 1: Add Drizzle + pg dependencies and scripts to `app/package.json`**

Add to `dependencies` (create the block):

```json
  "dependencies": {
    "drizzle-orm": "^0.36.0",
    "pg": "^8.13.0"
  },
```

Add to `devDependencies`: `"drizzle-kit": "^0.28.0"`, `"@types/pg": "^8.11.0"`.
Add to `scripts`:

```json
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push"
```

Run: `cd app && npm install`
Expected: dependencies install cleanly.

- [ ] **Step 2: Create the Drizzle config and initial schema**

`app/drizzle.config.ts`:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' }
});
```

`app/src/lib/server/db/schema.ts`:

```ts
import { pgTable, text } from 'drizzle-orm/pg-core';

// Minimal table proving migrations run end-to-end.
// Real domain tables arrive in later plans.
export const appMeta = pgTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull()
});
```

- [ ] **Step 3: Create the DB client with a connection check**

`app/src/lib/server/db/index.ts`:

```ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const pool = new pg.Pool({ connectionString });

export const db = drizzle(pool);

export async function checkDbConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Create the env template**

`app/.env.example`:

```
# PostgreSQL connection string used by the app and drizzle-kit
DATABASE_URL=postgres://hungarian:hungarian@localhost:5433/hungarian
```

- [ ] **Step 5: Generate the first migration and apply it to a local database**

Run a local Postgres for development (Task 3 Dockerizes this; for now a throwaway container is fine):

```bash
# Host port 5433: local 5432 is commonly taken (e.g. another project's DB container).
docker run --rm -d --name pg-dev -e POSTGRES_USER=hungarian \
  -e POSTGRES_PASSWORD=hungarian -e POSTGRES_DB=hungarian -p 5433:5432 postgres:16
cd app && cp .env.example .env
export DATABASE_URL=postgres://hungarian:hungarian@localhost:5433/hungarian
npm run db:generate
npm run db:migrate
```

Expected: a migration file appears under `app/drizzle/`, and `db:migrate` reports the `app_meta` table created.

- [ ] **Step 6: Write the failing integration test for the DB connection**

`app/src/lib/server/db/db.integration.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { checkDbConnection } from './index';

// Requires DATABASE_URL pointing at a running Postgres (see plan Step 5).
describe('checkDbConnection', () => {
  it('returns true against a reachable database', async () => {
    const ok = await checkDbConnection();
    expect(ok).toBe(true);
  });
});
```

- [ ] **Step 7: Run the integration test to verify it passes against the running DB**

Run: `cd app && DATABASE_URL=postgres://hungarian:hungarian@localhost:5433/hungarian npm run test:unit -- db.integration`
Expected: PASS (1 test). (If DATABASE_URL is unset it throws at import — that is intended.)

- [ ] **Step 8: Update the failing test and wire the DB into `/health`**

Replace `app/src/routes/health/health.test.ts`:

```ts
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
```

- [ ] **Step 9: Run the test to verify it fails**

Run: `cd app && npm run test:unit -- health`
Expected: FAIL — `/health` still returns the static `db: 'skipped'` body.

- [ ] **Step 10: Implement the DB-backed health route**

Replace `app/src/routes/health/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { checkDbConnection } from '$lib/server/db';

export async function GET() {
  const dbOk = await checkDbConnection();
  return json(
    { status: dbOk ? 'ok' : 'degraded', db: dbOk ? 'ok' : 'down' },
    { status: dbOk ? 200 : 503 }
  );
}
```

- [ ] **Step 11: Run the health tests to verify they pass**

Run: `cd app && npm run test:unit -- health`
Expected: PASS (2 tests).

- [ ] **Step 12: Tear down the dev DB and commit**

```bash
docker stop pg-dev
git add app/drizzle.config.ts app/src/lib/server/db app/.env.example \
  app/src/routes/health app/package.json app/package-lock.json app/drizzle
git commit -m "feat(app): add Postgres + Drizzle with DB-backed /health"
```

---

### Task 3: Dockerize the local dev stack and run migrations on start

**Files:**
- Create: `app/Dockerfile`
- Create: `app/.dockerignore`
- Create: `app/docker-entrypoint.sh`
- Create: `docker-compose.yml` (repo root)
- Create: `app/e2e/health.spec.ts`
- Create: `app/playwright.config.ts`
- Create: `docs/runbooks/hal-deploy.md`

**Interfaces:**
- Consumes: the built app + migrations from Tasks 1–2.
- Produces: a runnable Compose stack (`app` + `db`) where the app container applies Drizzle migrations on start, then serves; `/health` returns 200 once up.

- [ ] **Step 1: Create the app Dockerfile (multi-stage build)**

`app/Dockerfile`:

```dockerfile
# ---- build ----
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/build ./build
COPY --from=build /app/drizzle ./drizzle
COPY drizzle.config.ts ./
COPY docker-entrypoint.sh ./
# drizzle-kit is a dev dep; install it standalone for migrate-on-start
RUN npm install --no-save drizzle-kit@^0.28.0 && chmod +x docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
```

- [ ] **Step 2: Create the entrypoint that migrates then serves**

`app/docker-entrypoint.sh`:

```sh
#!/bin/sh
set -e
echo "Applying database migrations..."
npx drizzle-kit migrate
echo "Starting server..."
exec node build
```

`app/.dockerignore`:

```
node_modules
.svelte-kit
build
.env
.env.*
test-results
playwright-report
```

- [ ] **Step 3: Create the Compose stack**

`docker-compose.yml` (repo root):

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-hungarian}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-hungarian}
      POSTGRES_DB: ${POSTGRES_DB:-hungarian}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER:-hungarian}']
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: ./app
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER:-hungarian}:${POSTGRES_PASSWORD:-hungarian}@db:5432/${POSTGRES_DB:-hungarian}
      PORT: 3000
    depends_on:
      db:
        condition: service_healthy
    ports:
      - '3000:3000'

volumes:
  pgdata:
```

- [ ] **Step 4: Build and start the stack**

Run: `docker compose up --build -d`
Expected: `db` becomes healthy, `app` builds, runs migrations, and starts.

- [ ] **Step 5: Write the Playwright smoke config and test**

`app/playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: process.env.SMOKE_BASE_URL ?? 'http://localhost:3000' }
});
```

`app/e2e/health.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('health endpoint reports ok against the running stack', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.db).toBe('ok');
});
```

- [ ] **Step 6: Run the smoke test against the running stack**

Run: `cd app && npx playwright install --with-deps chromium && npm run test:e2e -- health`
Expected: PASS (1 test) — `/health` returns 200 with `db: ok`, proving migrate-on-start and DB connectivity inside Compose.

- [ ] **Step 7: Tear down and commit**

```bash
docker compose down
git add app/Dockerfile app/.dockerignore app/docker-entrypoint.sh docker-compose.yml \
  app/playwright.config.ts app/e2e
git commit -m "feat(app): dockerize local dev stack with migrate-on-start and health smoke test"
```

---

### Task 4: CI image publish (GHCR) + HAL stack entry + deploy runbook

**Files:**
- Create: `.github/workflows/build-image.yml`
- Create: `deploy/hal/nyolc.yml` (copy target: `hal:~/docker/compose/hal2020/nyolc.yml`)
- Create: `deploy/hal/app-nyolc.yml` (copy target: `hal:~/docker/appdata/traefik3/rules/hal2020/app-nyolc.yml`)
- Create: `deploy/hal/bootstrap-db.sql`
- Create: `docs/runbooks/hal-deploy.md`

**Interfaces:**
- Consumes: the Dockerfile from Task 3.
- Produces: `ghcr.io/jaypaulb/learninghungarian:<tag>` images on push to `main`/tags; HAL service + routing files; a runbook a fresh operator can follow end-to-end.

- [ ] **Step 1: Create the GH Actions workflow**

`.github/workflows/build-image.yml`:

```yaml
name: build-image

on:
  push:
    branches: [main]
    tags: ['v*']
    paths: ['app/**', '.github/workflows/build-image.yml']
  workflow_dispatch:

permissions:
  contents: read
  packages: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: ghcr.io/jaypaulb/learninghungarian
          tags: |
            type=ref,event=tag
            type=raw,value=latest,enable={{is_default_branch}}
            type=sha

      - uses: docker/build-push-action@v6
        with:
          context: ./app
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

- [ ] **Step 2: Create the HAL service file (olitrack-saas pattern)**

`deploy/hal/nyolc.yml`:

```yaml
# nyolc — Learning Hungarian (nyolc.cc)
#
# Copy target on hal: ~/docker/compose/hal2020/nyolc.yml
# Include in ~/docker/docker-compose-hal2020.yml ABOVE the
# SERVICE-PLACEHOLDER-DO-NOT-DELETE marker:
#
#   include:
#     - compose/$HOSTNAME/nyolc.yml
#
# Database: hal's existing shared `postgresql` service (a `nyolc`
# database + role provisioned inside it; see bootstrap-db.sql).
#
# Required env in ~/docker/.env:
#   NYOLC_TAG=latest            (or a v* tag from CI)
#   NYOLC_PG_PASSWORD=<random>
#   NYOLC_BASE_URL=https://nyolc.cc
#
# Deliberately no `ports:` block — Traefik-only access via t3_proxy.

services:
  nyolc:
    image: ghcr.io/jaypaulb/learninghungarian:${NYOLC_TAG:-latest}
    container_name: nyolc
    security_opt: ["no-new-privileges:true"]
    restart: unless-stopped
    profiles: ["apps", "all"]
    networks: [default, t3_proxy]
    environment:
      TZ: $TZ
      PORT: 3000
      DATABASE_URL: "postgres://nyolc:${NYOLC_PG_PASSWORD}@postgresql:5432/nyolc?sslmode=disable"
      ORIGIN: ${NYOLC_BASE_URL}
    labels:
      - "diun.enable=true"
      - "dashboard.enabled=true"
      - "dashboard.port=3000"
      - "dashboard.icon=sh-duolingo"
      - "dashboard.category=Apps"
      - "dashboard.description=Learning Hungarian — nyolc.cc"
      - "dashboard.url_external=${NYOLC_BASE_URL}"
    # DOCKER-LABELS-PLACEHOLDER
```

- [ ] **Step 3: Create the Traefik rules file**

`deploy/hal/app-nyolc.yml`:

```yaml
# Copy target on hal: ~/docker/appdata/traefik3/rules/hal2020/app-nyolc.yml
# Public learning site — no OAuth gate; rate-limit + secure headers only.
http:
  routers:
    nyolc-rtr:
      rule: "Host(`nyolc.cc`)"
      entryPoints:
        - websecure-external
        - websecure-internal
      middlewares:
        - chain-no-auth
      service: nyolc-svc
      tls:
        certResolver: dns-cloudflare

  services:
    nyolc-svc:
      loadBalancer:
        servers:
          - url: "http://nyolc:3000"
```

- [ ] **Step 4: Create the DB bootstrap SQL**

`deploy/hal/bootstrap-db.sql`:

```sql
-- Run once inside hal's shared postgresql container:
--   DOCKER_HOST= docker exec -i postgresql psql -U "$POSTGRES_USER" -d postgres < bootstrap-db.sql
-- Replace the password with the value of NYOLC_PG_PASSWORD from ~/docker/.env.
CREATE ROLE nyolc LOGIN PASSWORD 'CHANGE_ME_TO_NYOLC_PG_PASSWORD';
CREATE DATABASE nyolc OWNER nyolc;
GRANT ALL PRIVILEGES ON DATABASE nyolc TO nyolc;
```

- [ ] **Step 5: Write the HAL deploy runbook**

`docs/runbooks/hal-deploy.md` — concrete commands, in order:
0. **Port discipline:** HAL's host-port registry is the `*_PORT` vars in `hal:~/docker/.env` (template: `env.template`). `nyolc` deliberately exposes **no host port** (Traefik-only via `t3_proxy`); if one is ever needed, check the registry for a free port and register `NYOLC_PORT` there first.
1. **DNS:** `nyolc.cc` A/CNAME → HAL's external endpoint in Cloudflare (Traefik's `dns-cloudflare` resolver issues the cert).
2. **DB bootstrap:** generate `NYOLC_PG_PASSWORD` (`openssl rand -hex 24`), add to `hal:~/docker/.env` with `NYOLC_TAG` and `NYOLC_BASE_URL`, then run `deploy/hal/bootstrap-db.sql` per its header comment.
3. **Files:** `scp deploy/hal/nyolc.yml hal:~/docker/compose/hal2020/nyolc.yml`; `scp deploy/hal/app-nyolc.yml hal:~/docker/appdata/traefik3/rules/hal2020/app-nyolc.yml`; add the include line to `docker-compose-hal2020.yml` above `# SERVICE-PLACEHOLDER-DO-NOT-DELETE`.
4. **Start:** `ssh hal 'cd ~/docker && DOCKER_HOST= docker-compose -f docker-compose-hal2020.yml up -d nyolc'` (migrations run on container start via the entrypoint).
5. **Verify:** `curl -f https://nyolc.cc/health` → 200 `{"status":"ok","db":"ok"}`.
6. **Upgrade:** bump `NYOLC_TAG` in `~/docker/.env`, `DOCKER_HOST= docker-compose -f docker-compose-hal2020.yml pull nyolc && ... up -d nyolc`.
7. **Backup:** `DOCKER_HOST= docker exec postgresql pg_dump -U nyolc nyolc > nyolc-$(date +%F).sql` (note: HAL's existing postgres backup regime also covers the volume).
8. **Restore drill (test once, record result in the runbook):** create scratch DB `nyolc_restore`, `psql -d nyolc_restore < nyolc-<date>.sql`, confirm `app_meta` exists, drop scratch DB.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/build-image.yml deploy/hal docs/runbooks/hal-deploy.md
git commit -m "feat(deploy): CI image publish to GHCR + HAL stack entry and runbook"
```

---

## Self-Review

**Spec coverage (Plan 1 slice of SP1 §3, §8):**
- Dockerized SvelteKit + Postgres, one deployable → Tasks 1–3. ✅
- Drizzle, migrations as deploy path → Task 2 (generate/migrate), Task 3 (migrate-on-start). ✅
- Health check → Tasks 1–2 (`/health`), Task 3 (smoke). ✅
- Backup/restore drill + TLS/proxy contract → Task 4 runbook (HAL Traefik file-based routing, shared postgresql). ✅
- Tailwind via build pipeline → Task 1. ✅
- CI image-publishing → Task 4 (spec's deferral was invalidated by HAL's actual deploy model: GHCR pull is how the stack consumes apps — olitrack-saas precedent). ✅
- Auth, content model, engine, SRS, assessment, feedback → **later plans (2–7), not this one.** ✅

**Placeholder scan:** No TBDs; every code step shows real code; the runbook step enumerates exact commands rather than "document deployment". ✅

**Type consistency:** `checkDbConnection(): Promise<boolean>` defined in Task 2 Step 3 and consumed identically in Task 2 Steps 6/8/10. `appMeta` columns (`key`, `value`) consistent. `DATABASE_URL` used verbatim throughout. `/health` response shape (`{ status, db }`) consistent across Tasks 1–3. ✅

---

## Next plans in the SP1 sequence

Plan 2 (Auth & accounts) begins from this foundation: add `user` and `session`
tables via a new Drizzle migration, Google OAuth via Arctic, session cookies,
and GDPR export/delete — with `/health` and the Compose stack unchanged.
