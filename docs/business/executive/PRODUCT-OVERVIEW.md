# Product Overview

What noBed.ai actually does — feature by feature, portal by portal.

Live demo: **https://nobed-ai.vercel.app**

---

## The one-sentence version

A single, real-time, colour-coded view of where emergency care is actually available across
Ghana — on the web **and** over SMS — with a data-trust layer that refuses to show a free
bed it can't stand behind.

## The core idea: three moving parts

1. **Capacity in** — hospitals update their free beds (web dashboard or an SMS command).
2. **Coordination in the middle** — referrals are submitted, accepted, and a bed is *held*;
   ambulances are routed to where care exists.
3. **Visibility out** — the public, dispatchers, and administrators all see the same live
   picture, colour-coded and honest about how fresh it is.

---

## Who it's for (and what they see)

### The public
- **Find Beds + national map.** An interactive map of Ghana, pins colour-coded by capacity,
  filterable by region, district, facility type, ownership, bed type, and whether the
  facility is accepting ambulances.
- **Emergency guide.** What to do right now, and the right level of care to head for.
- **SMS access.** No smartphone, no data, no problem — text a short code (see below).

### Hospital staff & administrators
- **Live capacity dashboard** with the KPIs that matter to a ward.
- **Update beds per type** (total / occupied); the **colour status sets itself**.
- **Toggle** ambulance acceptance, theatre availability, and referral notes.
- **Incoming referrals** — accept / decline / redirect / progress — and outgoing history.

### Ambulance dispatchers (NAS)
- **Find the nearest facility** with real, functional capacity on the map.
- **Submit an emergency referral** with destination suggestions.
- **Track active referrals** end-to-end, from dispatch to arrival.

### Health administrators (regional / national / super / auditor)
- **National dashboard** — KPIs, status breakdown, regional pressure, referral funnel,
  emergency-category mix.
- **Regional pressure table**, update-compliance scorecard, and **stale-hospital alerts**.
- **Hospital & user management**, SMS logs, and a full **audit trail**.

---

## The three ideas that make it more than a map

### 1. Functional capacity — a bed is only real if it works
Straight from the research: *"Beyond the number of beds that you count, there are other
things that make a bed 'functional'… gadgets and the number of healthcare workers."*

noBed.ai tracks **oxygen, ventilators, and incubators** alongside bed counts. For each bed
type it shows the **functional** number — `min(free beds, the equipment that gates them)`.
An ICU with 3 free beds but 0 ventilators shows as **functionally full**, because it is.
That's the difference between a directory and a decision tool.

### 2. Bed reservation on accept — a referral means something
In the field, *"referrals carry no guarantee of a bed."* So when a destination **accepts**
a referral, noBed.ai **holds the bed** — occupied goes up, and the referral shows a
"🛏 Bed held" badge. Decline or redirect, and the hold is released. The patient in the
ambulance is now arriving to a bed that's actually waiting.

### 3. Data trust — never a false green
The research found existing digital records list discharged and even deceased patients as
occupying beds — so the system shows **full when beds are free**, and, worse, sometimes the
reverse. noBed.ai treats every number as a claim with a provenance:
- **Verified** — a trusted user confirmed this snapshot.
- **Self-reported** — a hospital said so, unconfirmed.
- **Stale** — nobody's touched it recently; shown in grey with a **"?"**, never green.

Plus a **community reports** channel (with optional OTP phone verification) so a family
turned away despite a green light can flag it — closing the loop between the map and reality.

---

## Access & safety

- **8 roles, 10 permissions** — public, hospital staff, hospital admin, ambulance dispatcher,
  regional admin, national admin, super admin, auditor.
- **Audit logging on every write** — capacity changes, referrals, logins, SMS updates.
- **Anonymised patient references only** — no identifiable patient data (Ghana Data
  Protection Act, 2012).
- A **verification queue** gates capacity-editing access to approved staff.

---

## SMS — the feature-phone frontline

The people closest to an emergency often have the least connectivity. So the whole thing
works over a text message:

| Text this | You get |
|-----------|---------|
| `BED ACCRA` | Nearest facilities in Accra with emergency capacity |
| `ICU KUMASI` | ICU availability around Kumasi |
| `UPDATE KORLEBU EMERGENCY 0 ICU 1` | (staff) push a capacity update from a phone |
| `HELP` | Command list |

---

## What's real vs. what's mocked (said plainly)

This is an **MVP demo**. It runs with **no paid accounts** and demonstrates the full
experience. The parts that need real infrastructure before a live deployment are documented
with a migration path:

| Layer | Today (MVP) | Production target |
|-------|-------------|-------------------|
| Database | PostgreSQL (Neon) | + PostGIS geospatial |
| Auth | Signed-cookie mock | Managed auth (Supabase/Clerk) + MFA + OTP |
| SMS | In-app simulator | Live aggregator (Hubtel / Arkesel / Africa's Talking) |
| Realtime | Server-render + refresh | WebSockets + Redis pub/sub |
| Data source | Seeded demo data | Live hospital input + EMR sync |

Tech: Next.js 14 + TypeScript, Prisma + PostgreSQL, Leaflet + OpenStreetMap (no map fees),
deployed on Vercel + Neon. Full detail in [`docs/ARCHITECTURE.md`](../../ARCHITECTURE.md).

---

*Next: [Vision & Roadmap](VISION-ROADMAP.md) · [User Guide](USER-GUIDE.md)*
