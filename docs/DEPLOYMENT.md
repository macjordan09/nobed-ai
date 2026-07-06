# Deployment guide

This MVP is a single Next.js app. It runs locally with SQLite and no external services.
This guide covers (0) hosting the demo online now, (1) running it locally, and (2) the
path to a full production deployment.

---

## 0. Host the demo online (fastest path — container + volume)

The app writes to SQLite, so host it as a **container with a persistent volume** (Railway,
Fly.io, or Render). A production [`Dockerfile`](../Dockerfile) + [`docker-entrypoint.sh`](../docker-entrypoint.sh)
are included: on first boot the container pushes the schema and seeds the 17 demo hospitals
into `/data/nobed.db`, then serves on `$PORT`.

> ⚠️ Vercel/Netlify (serverless) won't work as-is — their filesystems can't persist SQLite
> writes. Use them only after the Postgres migration (section 2).

**Railway (recommended — simplest)**
```bash
# once: npm i -g @railway/cli && railway login
cd nobed-ai
railway init                       # create project
railway volume add --mount-path /data
railway variables --set AUTH_SECRET=$(openssl rand -hex 32)
railway up                        # builds the Dockerfile and deploys
railway domain                     # get your public URL
```

**Fly.io**
```bash
# once: brew install flyctl && fly auth login
cd nobed-ai
fly launch --no-deploy             # detects Dockerfile; pick a region (cdg/ams nearest Ghana)
fly volumes create nobed_data --size 1
# fly.toml: add  [mounts]  source="nobed_data"  destination="/data"
fly secrets set AUTH_SECRET=$(openssl rand -hex 32)
fly deploy
```

**Render**: New → Web Service → connect the GitHub repo → environment: Docker → add a
Disk mounted at `/data` (1 GB) → env var `AUTH_SECRET` → deploy. (Disks require a paid tier.)

**Verify locally first** (identical to production):
```bash
docker build -t nobed-ai .
docker run --rm -p 3000:3000 -v nobed-data:/data -e AUTH_SECRET=demo nobed-ai
```

Demo notes for a public URL: data is seeded demo data; the mock auth + demo passwords are
fine for a pilot demo but see [SECURITY.md](SECURITY.md) before any real rollout.

---

## 1. Run the demo locally

```bash
npm install
npm run setup      # prisma generate + db push + seed
npm run dev        # http://localhost:3000
```

Production build of the demo:

```bash
npm run build
npm start
```

Environment (`.env`, already provided for the demo):

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="change-me"
```

---

## 2. Production deployment

Recommended topology (per the spec):

```
            Cloudflare (DNS, CDN, WAF, bot protection)
                         │
                 ┌───────┴────────┐
                 │  Next.js app   │   Vercel (or Fly.io / Render / Railway)
                 └───────┬────────┘
        ┌────────────────┼─────────────────┐
   Postgres+PostGIS    Redis           SMS provider
   (Supabase/Neon/RDS) (cache/queues)  (Africa's Talking / Hubtel / Arkesel)
                 │
            Managed Auth (Supabase Auth / Clerk) with MFA + OTP
```

### Steps

1. **Database** — provision PostgreSQL (Supabase/Neon/RDS), enable the PostGIS extension.
   Update `schema.prisma` provider to `postgresql` (see [DATABASE.md](DATABASE.md)), then:
   ```bash
   npx prisma migrate deploy
   node prisma/seed.mjs   # seed reference hospitals only; not demo users
   ```
2. **Auth** — wire up Supabase Auth / Clerk. Replace [`src/lib/auth.ts`](../src/lib/auth.ts)
   `getSession()` with the provider's session, keep the `Session`/RBAC shape so routes are
   unchanged. Enforce MFA for admin roles, OTP for SMS users.
3. **SMS** — implement a provider webhook that calls `handleSms(phone, command)` from
   [`src/lib/sms.ts`](../src/lib/sms.ts). Register a shortcode/longcode and verified sender IDs.
   Map provider delivery callbacks to `SmsLog.status`.
4. **Realtime** — add WebSockets (or Server-Sent Events) backed by Redis pub/sub so map and
   dashboards update live instead of on refresh. Use BullMQ on Redis for notification jobs.
5. **Env vars** (production):
   ```
   DATABASE_URL=postgresql://...
   AUTH_SECRET=<strong-random>            # or provider keys
   SMS_PROVIDER_API_KEY=...
   SMS_SHORTCODE=...
   REDIS_URL=...
   SENTRY_DSN=...
   ```
6. **Frontend host** — deploy to Vercel (`vercel --prod`) or containerize:
   ```bash
   npm run build && npm start   # behind the platform's process manager
   ```
7. **Edge & security** — put Cloudflare in front for TLS, WAF, rate limiting and DDoS
   protection. See [SECURITY.md](SECURITY.md) for the full checklist.
8. **Monitoring** — Sentry (errors), OpenTelemetry → Grafana/Prometheus (metrics),
   UptimeRobot (availability), and alerting on the audit log and stale-hospital metric.

### Build phases (from the spec)

- **Phase 1** *(this MVP covers it)*: auth, hospital registration, map, bed dashboard,
  colour status, admin dashboard.
- **Phase 2**: live SMS provider, real referral notifications, alerting.
- **Phase 3**: AI prediction/risk scoring, regional trend dashboards, outdated-data alerts.
- **Phase 4**: pilot in Greater Accra, Ashanti, Central and Northern regions with teaching,
  regional, municipal and selected private hospitals + NAS dispatch centers.

### CI/CD

- Run `npm run build` (type-check + lint) on every PR.
- `prisma migrate deploy` as a release step.
- Seed only reference data (hospitals/regions) in production — never demo users.
