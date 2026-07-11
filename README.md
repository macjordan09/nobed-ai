# NoBed.ai

**Ghana's real-time emergency hospital capacity intelligence platform.**

NoBed.ai tackles Ghana's *No Bed Syndrome* — preventable deaths caused when critically
ill patients are driven from hospital to hospital because no one knows where a free bed
is. It gives hospitals, ambulance teams, health administrators and the public a live,
colour-coded view of bed capacity, referral options and emergency care availability
across the country — on the web **and** over SMS for low-connectivity users.

This repository is a **runnable MVP demo**. It runs locally with **no paid accounts**
(PostgreSQL via Docker, OpenStreetMap tiles, mock auth, SMS simulator) and deploys to
Vercel + Neon (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)). The parts
that need real infrastructure in production (live SMS providers, managed auth with MFA,
PostGIS, Redis, WebSockets) are documented in [`docs/`](docs/) with a clear migration path.

---

## Quick start

```bash
# one-time: local Postgres (Docker)
docker run -d --name nobed-pg -p 5433:5432 -e POSTGRES_PASSWORD=nobed \
  -e POSTGRES_DB=nobed -v nobed-pg-data:/var/lib/postgresql/data postgres:16-alpine

npm install
npm run setup     # prisma generate + db push + seed (17 GH hospitals, 9 demo users)
npm run dev       # http://localhost:3000
```

That's it. Open <http://localhost:3000>. (Thereafter: `docker start nobed-pg` before dev.)

> Requires Node 18+ and Docker (for Postgres). No API keys needed.

### Useful scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run setup` | Generate client + create DB + seed (first run) |
| `npm run db:reset` | Wipe and re-seed the database |
| `npm run db:seed` | Re-seed without wiping schema |

---

## Demo credentials

Every role from the spec has a demo account. On the **Sign in** page you can click any
role to log in instantly, or use the credentials below.

| Role | Email | Password | Lands on |
|------|-------|----------|----------|
| Public User | `public@nobed.ai` | `public123` | Find Beds |
| Hospital Staff (Korle Bu) | `staff@korlebu.gov.gh` | `staff123` | Hospital portal |
| Hospital Admin (Ridge) | `admin@ridge.gov.gh` | `admin123` | Hospital portal |
| Ambulance Dispatcher | `dispatch@ambulance.gov.gh` | `dispatch123` | Ambulance portal |
| Regional Health Admin | `regional@ghs.gov.gh` | `regional123` | Admin portal |
| National Health Admin | `national@moh.gov.gh` | `national123` | Admin portal |
| Super Admin | `super@nobed.ai` | `super123` | Admin portal |
| System Auditor | `auditor@nobed.ai` | `auditor123` | Admin portal |

---

## What's in the MVP

**Public site**
- Home with live national snapshot
- **Find Beds** + **Ghana hospital map** — interactive Leaflet map, colour-coded pins
  (red / amber / yellow / green), filter by region, district, facility type, ownership,
  bed type and ambulance acceptance
- **SMS short-code simulator** — try `BED ACCRA`, `ICU KUMASI`, hospital `UPDATE`, `HELP`
- Emergency guide & About

**Hospital portal** (staff / admin)
- Live capacity dashboard with KPIs
- Update beds per type (total / occupied) with **automatic colour status**
- Toggle ambulance acceptance, theatre availability, referral notes
- Incoming referrals (accept / decline / redirect / progress) + outgoing history

**Ambulance portal** (dispatcher)
- Find nearest facility on the map
- Submit emergency referral (with AI destination suggestions)
- Track active referrals end-to-end

**Admin command center** (regional / national / super / auditor)
- National dashboard: KPIs, status pie, regional pressure, referral funnel, emergency
  category breakdown (Recharts)
- Regional pressure table, update-compliance scorecard, stale-hospital alerts
- Hospital management, user management, SMS logs, **audit trail** (auditor/super only)

**Cross-cutting**
- Role-based access control (8 roles, 10 permissions)
- Audit logging on every write (capacity, referrals, logins, SMS updates)
- Anonymized patient references only (Ghana Data Protection Act, 2012)
- REST API (see [docs/API.md](docs/API.md))

---

## Tech stack

| Layer | MVP (this repo) | Production target |
|-------|-----------------|-------------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind | same |
| Map | Leaflet + OpenStreetMap | Mapbox GL or Leaflet |
| Charts | Recharts | same |
| Database | PostgreSQL + Prisma (Docker local / Neon prod) | + PostGIS geospatial |
| Auth | Signed-cookie mock auth | Supabase Auth / Clerk + MFA + OTP |
| SMS | In-app simulator | Africa's Talking / Hubtel / Arkesel |
| Realtime | Server-rendered + refresh | WebSockets + Redis pub/sub |

---

## Documentation

**Technical**
- [docs/DATABASE.md](docs/DATABASE.md) — schema, ER overview, PostGIS migration
- [docs/API.md](docs/API.md) — REST endpoint reference
- [docs/SECURITY.md](docs/SECURITY.md) — security controls, privacy & compliance
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — production deployment guide
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — services, build phases, what's mocked

**Business & communications** — [docs/business/](docs/business/README.md)
- Executive/Top-level (summary, product overview, roadmap, business model, user guide, FAQ)
- Startup ecosystem (pitch deck, investor one-pager, market analysis, GTM, competition)

---

## Project layout

```
prisma/
  schema.prisma        # data model
  seed.mjs             # 16 Ghana hospitals + 8 demo users + sample data
src/
  app/                 # pages (public, dashboard, ambulance, admin) + API routes
  components/          # map, charts, capacity editor, referral UI
  lib/                 # status logic, RBAC, auth, SMS engine, analytics
docs/                  # database, API, security, deployment, architecture
```

> **MVP disclaimer:** all data is seeded demo data. The mock auth and SMS simulator are
> for demonstration only and must be replaced before any real deployment — see
> [docs/SECURITY.md](docs/SECURITY.md).

---

## Author

**Created & developed by [Mac-Jordan Degadjor](mailto:info.nobedai@gmail.com).**

© 2026 Mac-Jordan Degadjor. All rights reserved. See [LICENSE](LICENSE).
