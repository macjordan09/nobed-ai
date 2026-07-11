# Executive Summary

**noBed.ai — real-time hospital bed availability, emergency referral, and health-system
coordination for Ghana.**

Live demo: **https://nobed-ai.vercel.app** · Created & developed by Mac-Jordan Degadjor.

---

## The problem, in one line

In Ghana, people die on the road between hospitals — not because no bed exists, but because
**no one knows where it is.** It has a name: **No Bed Syndrome.**

A critically ill patient is loaded into an ambulance or a family car and driven from
facility to facility. Each one says "no bed" — sometimes true, sometimes not, and no one
can check. The most-cited effect of this in the research isn't delay or discomfort. It's
**loss of the patient.**

The catalyst everyone remembers: in **2018, Anthony Opoku-Acheampong, 70, died after being
turned away from seven hospitals in Accra** — two private, five state, including Korle-Bu
and the Greater Accra Regional Hospital. *(Citi Newsroom, 11 June 2018.)*

## Why it happens

This isn't only a shortage of beds — it's a **shortage of coordination**. A 2024 study by
the **Reach Alliance** (University of Toronto's Munk School + Ashesi University) put it
exactly:

> *"There is no real-time bed-availability tracking across different institutions to enable
> an exchange of such information between the lower-level facilities and the tertiary
> institutions and even between the tertiary institutions themselves."*

Three failures stack on top of each other:
1. **No shared, real-time picture** of who has a free bed.
2. **"Full" is often false** — existing records list discharged and even deceased patients,
   so a hospital shows full when beds are actually open.
3. **A "bed" isn't just a mattress** — it only counts if the **oxygen, ventilator, or
   incubator and the staff** to use it are free too.

## What noBed.ai is

noBed.ai is the **coordination and visibility layer** that sits on top of the hospitals,
ambulances, and administrators Ghana already has. One live, colour-coded, national view of
where care is actually available — reachable on the **web and over SMS**, so it works on a
feature phone with no data.

It is deliberately **not** a promise to build beds or hire staff. It makes the beds and
teams that already exist **impossible to lose** when minutes matter.

## What's built and working today

A complete, deployed MVP demonstrating the full platform end-to-end:

- **Public bed finder + national map** — colour-coded, filterable, with an emergency guide.
- **SMS short-code simulator** — `BED ACCRA`, `ICU KUMASI`, hospital `UPDATE`, `HELP`.
- **Hospital portal** — live capacity dashboard, per-bed-type updates with automatic status.
- **Ambulance portal** — nearest-facility routing and end-to-end referral tracking.
- **Admin command centre** — national KPIs, regional pressure, audit trail, user management.
- **Functional capacity** — a bed only shows available if the equipment to use it is free.
- **Bed reservation on accept** — accepting a referral *holds* a bed at the destination.
- **Data-trust layer** — Verified / Self-reported / **Stale** states, and the hard rule:
  **never a false green.**
- **Role-based access** across 8 roles, with an audit log on every change.

Seeded with demonstration data across **17 real Ghanaian hospitals** and all 8 user roles.

## Why now

The gap is documented, the fix is named (independently, by academics), and the enabling
tech — cheap web, universal SMS, serverless cloud, maps without licence fees — is finally
all in one place. The same study found hospitals already run a manual **"Bed Bureau Unit"**
that counts beds by hand each day. noBed.ai is **the digital version of a role Ghana's
health system already trusts** — extended across institutions instead of trapped inside one.

## The ask

We're looking for the three things that turn a working prototype into saved lives:
1. **A pilot** — one region, a cluster of referring and receiving hospitals, plus NAS dispatch.
2. **Partners** — Ghana Health Service, the Ministry of Health, the National Ambulance
   Service, CHAG, and an SMS aggregator (Hubtel / Arkesel / Africa's Talking).
3. **Catalytic funding** — to harden the MVP (managed auth, live SMS, PostGIS, real-time)
   and staff a pilot.

---

## The number that matters

The research ranks the effects of No Bed Syndrome. Top of the list: **loss of the patient.**
Every other metric in this document is in service of moving that one down.

*Sourced statistics: see the [stat library](../marketing/MESSAGING-GUIDE.md#sourced-stat-library).
Full research analysis: [`research/NO-BED-SYNDROME-PAPER-ANALYSIS.md`](../../../research/NO-BED-SYNDROME-PAPER-ANALYSIS.md).*
