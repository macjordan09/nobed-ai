# Deployment guide

This MVP is a single Next.js app. It runs locally with SQLite and no external services.
This guide covers (0) hosting the demo online now, (1) running it locally, and (2) the
path to a full production deployment.

---

## 0. Host online — Vercel + Postgres (current setup)

The app now runs on **PostgreSQL** (migrated from SQLite). Local dev uses a Docker Postgres;
production uses **Neon** (or Vercel Postgres) with the app on **Vercel**.

**Local dev database** (already provisioned):
```bash
docker start nobed-pg   # postgres:16 on localhost:5433 (user postgres / pw nobed / db nobed)
# .env → DATABASE_URL="postgresql://postgres:nobed@localhost:5433/nobed"
```

**Deploy to Vercel (one-time setup):**
1. **Create the production DB** — https://neon.tech (free tier) → New project (region: EU, e.g.
   Frankfurt — closest to Ghana) → copy the connection string (`postgresql://…?sslmode=require`).
2. **Login + link** (interactive, run in a terminal):
   ```bash
   cd nobed-ai
   npx vercel login
   npx vercel link          # create/link the project
   ```
3. **Set env vars:**
   ```bash
   npx vercel env add DATABASE_URL production    # paste the Neon URL
   npx vercel env add AUTH_SECRET production     # openssl rand -hex 32
   ```
4. **Push schema + seed Neon once** (from your machine):
   ```bash
   DATABASE_URL="<neon-url>" npx prisma db push
   DATABASE_URL="<neon-url>" node prisma/seed.mjs
   ```
5. **Deploy:**
   ```bash
   npx vercel deploy --prod
   ```

Build config is already in place: `build` runs `prisma generate && next build`, plus a
`postinstall` generate for Vercel's cached installs. All DB-backed pages/APIs are dynamic
(no build-time DB needed).

**Alternative: any Docker host** — the [`Dockerfile`](../Dockerfile) works on Railway/Fly/Render;
set `DATABASE_URL` (Postgres) + `AUTH_SECRET`. The entrypoint pushes the schema and seeds only
when the database is empty.

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
