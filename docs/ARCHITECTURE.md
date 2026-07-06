# Architecture

NoBed.ai is built as a single **Next.js (App Router)** full-stack app for the MVP. The
domain logic is factored into `src/lib/*` so it maps onto discrete backend services later.

## Layers

```
Pages (server components)  ──┐
Client components (map,      │   read/write via
charts, forms)           ────┤── REST API routes (src/app/api/*)
                             │        │
                             │        ▼
                          src/lib/*  (domain logic)
                             │  status · rbac · auth · hospitals
                             │  referrals · sms · analytics
                             ▼
                          Prisma ──► SQLite (→ PostgreSQL+PostGIS)
```

## Domain modules (`src/lib`)

| Module | Responsibility | Maps to service |
|--------|----------------|-----------------|
| `status.ts` | Colour calculation from bed counts + thresholds | Bed capacity service |
| `hospitals.ts` | Fetch + compute hospital views | Hospital + Map service |
| `referrals.ts` | Referral queries & serialization | Referral service |
| `sms.ts` | Short-code parsing, sender verification, updates | SMS service |
| `analytics.ts` | National/regional aggregation, compliance, funnels | Analytics service |
| `rbac.ts` | Roles & permissions | Auth service |
| `auth.ts` | Session encode/decode (mock) | Auth service |

These line up with the spec's backend services (auth, hospital, bed capacity, referral, SMS,
notification, map/geo, analytics, audit, admin). To extract a true microservice backend
(NestJS/FastAPI), each module becomes a service behind an API gateway.

## Colour status logic

Overall hospital status is driven by **emergency** bed availability, with a hard override to
**red** when the facility is not accepting ambulances (emergency unit effectively closed).

| Available emergency beds | Status |
|--------------------------|--------|
| 0 (or not accepting ambulances) | 🔴 red |
| 1–2 (or ≥90% occupancy) | 🟠 amber |
| 3–5 (or 70–89% occupancy) | 🟡 yellow |
| > 5 (and < 70% occupancy) | 🟢 green |

Thresholds live in `status.ts` and are intended to become per-hospital config
(`configure_thresholds` permission).

## What's mocked vs real in the MVP

| Capability | MVP | Production |
|------------|-----|------------|
| Map | Leaflet + OpenStreetMap (no key) | Mapbox GL or Leaflet |
| Auth | Signed-cookie mock, sha256 | Supabase/Clerk + MFA + OTP |
| SMS | In-app simulator (`/sms`, `/api/sms`) | Africa's Talking / Hubtel / Arkesel webhooks |
| Realtime | Server render + `router.refresh()` | WebSockets + Redis pub/sub |
| DB | SQLite | PostgreSQL + PostGIS |
| Queues/notifications | Synchronous | BullMQ on Redis; SMS/email/WhatsApp |
| Geo "nearest" | Text match on region/district | PostGIS `<->` distance ordering |

## AI layer (practical & explainable)

The MVP includes a transparent, rules-based slice of the planned AI layer; the rest is
specced for Phase 3:

- **Referral destination recommendation** *(implemented)* — the ambulance referral form
  suggests the top facilities that actually have the required bed type, best availability
  first. It recommends; it never auto-routes.
- **Anomaly / staleness detection** *(implemented)* — the admin dashboard flags hospitals
  that haven't updated in 2h and computes an update-compliance score.
- **Regional crisis detection** *(implemented)* — a weighted regional "pressure" score
  highlights districts under strain.
- **Bed prediction / demand forecasting / risk scoring** *(Phase 3)* — time-series models on
  historical capacity + referral data. Outputs are advisory and must be human-verified;
  **AI never overrides clinical judgment.**

## Notifications & alerts (spec'd, Phase 2)

Alert triggers are derivable from current data: capacity turns red, ICU below threshold,
emergency unit unavailable, referral pending too long, hospital stale > 2h, regional crisis,
SMS update failed, suspicious login. Production routes these via SMS/email/in-app (WhatsApp
and push later) using a Redis-backed job queue.
