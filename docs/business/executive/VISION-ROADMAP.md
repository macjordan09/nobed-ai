# Vision & Roadmap

---

## Mission

Make sure no one in Ghana dies looking for a bed that already exists.

## Vision

A connected health system where every hospital, ambulance, and administrator — and every
family in an emergency — sees the same honest, real-time picture of where care is available.
The "digital Bed Bureau," connected across every institution instead of trapped inside one.

## North-star metric

**Time-to-placement** — minutes from "we need a bed" to "a bed is confirmed and held."
Everything we build is judged by whether it moves that number down. The research names the
worst outcome of the current system as *loss of the patient*; time-to-placement is the lever
closest to it.

## What we are — and what we're not

noBed.ai is the **coordination, visibility, and data-trust layer.** We do **not** build beds,
buy ventilators, or train nurses — those are capital and policy problems. Our lane is making
the capacity that already exists **impossible to lose.** We hold ourselves to that scope
honestly, because overclaiming fails the test with the clinicians we need to trust us.

---

## The roadmap — four phases

### Phase 1 — Visibility *(the MVP, built)*
The foundation, live today at **nobed.ai**:
- Hospital registration, capacity dashboards, colour-coded status.
- Public bed finder + national map + emergency guide.
- SMS access for low-connectivity users.
- Admin dashboards, RBAC, audit logging.
- Functional capacity, bed reservation on accept, and the data-trust layer.

**Status: complete and deployed as a demonstration.**

### Phase 2 — Live coordination *(next)*
Turn the demo into a running service in one region:
- **Live SMS** via a Ghanaian aggregator (Hubtel / Arkesel / Africa's Talking) with a real
  short code and verified sender IDs.
- **Managed auth** with MFA for admins and OTP for SMS users.
- **Real referral notifications** and stale-data alerting.
- **Data-accuracy hooks** — a lightweight EMR/admin sync or an SMS `DISCHARGE` command so a
  freed bed shows free immediately, attacking the "false full" problem.

### Phase 3 — Intelligence *(validated by precedent)*
Borrowing the Chengdu, China model the research highlights: predict length-of-stay →
forecast occupancy → flag anomalies.
- Regional trend dashboards and outdated-data detection.
- Predictive availability and risk scoring.
- An **MoH/GHS resource-allocation view** — our data reveals where functional/ICU capacity
  is missing, turning the platform into a planning tool at the policy layer.

### Phase 4 — Scale
- Pilot across **Greater Accra, Ashanti, Central, and Northern** regions.
- Teaching, regional, municipal, district, and selected private/mission (CHAG) hospitals.
- Integration with **NAS** dispatch centres.
- Right-level-of-care routing to relieve tertiary overcrowding (the #2 documented cause).

---

## What each phase attacks

The research ranks the causes of No Bed Syndrome. We're precise about which ones we touch:

| Cause (ranked) | noBed.ai |
|----------------|----------|
| Overcrowding by referrals (#2) | ✅ Directly — right-level routing + reservation |
| Lack of communication for referrals (#6) | ✅ Directly — the core of the platform |
| High patient volume (#5) | ✅ Eased — visibility distributes load |
| Scarcity of equipment (#3) | 🔎 Revealed — functional capacity exposes it |
| Inadequate infrastructure (#1) | 🔎 Revealed — data informs planning |
| Hospitals / workforce (#4, #7) | ❌ Out of scope — capex & policy |

✅ = we solve it · 🔎 = we make it visible for planners · ❌ = honestly, not us.

---

*Next: [Business & Sustainability Model](BUSINESS-MODEL.md)*
