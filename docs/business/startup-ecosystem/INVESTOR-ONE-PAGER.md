# noBed.ai — Investor One-Pager

*Because in an emergency, "no bed" should be a fact, not a guess.*
**Live demo:** https://nobed-ai.vercel.app · **Contact:** info.nobedai@gmail.com

---

**The problem.** In Ghana, critically ill patients die being driven hospital to hospital
because no one can see where a free bed is. It's called **No Bed Syndrome**. It's often not a
supply problem — it's a **coordination and visibility** problem: no shared real-time picture,
records that show "full" when beds are free, and beds that lack the equipment to work.

**The market's shape.** Ghana has **0.9 hospital beds / 1,000** (2021); **10 of 16 regions had
no ICU beds**; only **5 teaching hospitals** serve 16 regions. When capacity is this scarce,
coordinating the beds that exist is the highest-leverage intervention available.
*(WHO 2018; Siaw-Frimpong 2021; Reach Alliance 2024.)*

**The product.** noBed.ai is a real-time hospital-capacity and referral platform — web + SMS.
One honest, colour-coded national map. Three things make it more than a directory:
- **Never a false green** — every number labelled Verified / Self-reported / Stale.
- **Functional capacity** — equipment-gated beds; the number you can act on.
- **Bed reservation on accept** — a referral that actually holds a bed.
Plus SMS access so a feature phone counts, RBAC across 8 roles, and full audit logging.

**Validation.** A 2024 University of Toronto (Munk School) + Ashesi study independently
recommended exactly this — *"an integrated referral system… to connect the various healthcare
system referral levels"* — and documented that hospitals already run a manual "Bed Bureau"
role we digitise. Problem: independently confirmed. Solution: named by the researchers.

**Status.** **Working MVP, deployed and demonstrable**, seeded across 17 real Ghanaian
hospitals with all 8 roles. Built on Next.js + PostgreSQL + OpenStreetMap; runs cheaply
(serverless + SMS). *No live users, partners, or revenue yet — we're raising to change that.*

**Business model.** Public side free forever. Institutional SaaS (hospitals, tiered by size)
+ government/analytics licence (GHS/MoH) + catalytic grants. SMS at cost. Low marginal cost
per lookup; value measured in avoided futile transfers and time-to-placement.

**Why now.** The gap is documented, the fix is named, and the enabling tech — cheap web,
universal SMS, serverless cloud, licence-free maps — is finally all in one place.

**Moat.** Network effects (each hospital added makes the map more valuable), a compounding
data-trust layer, and a wedge through a trusted existing role.

**The ask.** A **regional pilot**, **partners** (GHS, MoH, NAS, CHAG, SMS aggregator), and
**catalytic funding** to harden the MVP and staff the pilot.

**North-star metric.** Time-to-placement — minutes from "we need a bed" to "a bed is held."

---

*Team: Mac-Jordan Degadjor, founder/builder — Ghanaian digital & technology writer (Canada),
working at the intersection of AI/ML, startups, and digital media. Seeking clinical,
government-relations, and ops co-leads for the pilot.*
