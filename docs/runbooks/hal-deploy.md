# HAL deploy runbook — nyolc (Learning Hungarian)

Deploys `ghcr.io/jaypaulb/learninghungarian` into HAL's deployrr stack
(`hal:~/docker/`, docs in `~/docker/docs/`). The app is Traefik-only (no host
port) and uses HAL's shared `postgresql` service.

## 0. Port discipline

HAL's host-port registry is the `*_PORT` vars in `hal:~/docker/.env`
(template: `env.template`). `nyolc` deliberately exposes **no host port** —
Traefik reaches it by container name on `t3_proxy`. If a host port is ever
needed, check the registry for a free port and register `NYOLC_PORT` there
first.

## 1. DNS

In Cloudflare, point `nyolc.cc` (A/CNAME) at HAL's external endpoint.
Traefik's `dns-cloudflare` resolver issues the certificate automatically.

## 2. Database bootstrap (once)

```bash
openssl rand -hex 24        # -> NYOLC_PG_PASSWORD
```

Add to `hal:~/docker/.env`:

```
NYOLC_TAG=latest
NYOLC_PG_PASSWORD=<generated>
NYOLC_BASE_URL=https://nyolc.cc
```

Then run `deploy/hal/bootstrap-db.sql` (substitute the real password first):

```bash
scp deploy/hal/bootstrap-db.sql hal:/tmp/
ssh hal 'DOCKER_HOST= docker exec -i postgresql psql -U "$POSTGRES_USER" -d postgres < /tmp/bootstrap-db.sql && rm /tmp/bootstrap-db.sql'
```

## 3. Stack files

```bash
scp deploy/hal/nyolc.yml hal:~/docker/compose/hal2020/nyolc.yml
scp deploy/hal/app-nyolc.yml hal:~/docker/appdata/traefik3/rules/hal2020/app-nyolc.yml
```

Add the include line to `hal:~/docker/docker-compose-hal2020.yml` ABOVE the
`# SERVICE-PLACEHOLDER-DO-NOT-DELETE` marker:

```yaml
  - compose/$HOSTNAME/nyolc.yml
```

Traefik watches the rules directory and reloads automatically.

## 4. Start

```bash
ssh hal 'cd ~/docker && DOCKER_HOST= docker-compose -f docker-compose-hal2020.yml up -d nyolc'
```

Migrations run automatically on container start (entrypoint runs
`node scripts/migrate.js` before serving).

## 5. Verify

```bash
curl -f https://nyolc.cc/health
# -> 200 {"status":"ok","db":"ok"}
```

## 6. Upgrade

Bump `NYOLC_TAG` in `hal:~/docker/.env` (CI publishes `latest`, `sha-*`, and
`v*` tags), then:

```bash
ssh hal 'cd ~/docker && DOCKER_HOST= docker-compose -f docker-compose-hal2020.yml pull nyolc && DOCKER_HOST= docker-compose -f docker-compose-hal2020.yml up -d nyolc'
```

## 7. Backup

```bash
ssh hal 'DOCKER_HOST= docker exec postgresql pg_dump -U nyolc nyolc' > nyolc-$(date +%F).sql
```

HAL's existing postgres backup regime also covers the shared volume.

## 8. Restore drill

Run once and record the result here.

```bash
ssh hal 'DOCKER_HOST= docker exec postgresql psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE nyolc_restore OWNER nyolc"'
ssh hal 'DOCKER_HOST= docker exec -i postgresql psql -U nyolc -d nyolc_restore' < nyolc-<date>.sql
ssh hal 'DOCKER_HOST= docker exec postgresql psql -U nyolc -d nyolc_restore -c "\dt"'   # expect app_meta
ssh hal 'DOCKER_HOST= docker exec postgresql psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE nyolc_restore"'
```

- [ ] Restore drill performed on: ____ (result: ____)
