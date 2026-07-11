# Frequently Asked Questions

---

### What is noBed.ai, in plain terms?
A live, colour-coded map of where hospital beds and emergency care are actually available
across Ghana — reachable on the web and by SMS. It's built to end **No Bed Syndrome**:
patients dying while being driven from hospital to hospital because no one knows where a
free bed is.

### Is this live in hospitals right now?
No. Today it's a **working, deployed MVP** — a full demonstration of the platform, seeded
with sample data across 17 real Ghanaian hospitals. You can use every feature at
**https://nobed-ai.vercel.app**. Live hospital data comes in the pilot phase, with partners.

### So the bed numbers on the map are real?
The **hospitals** are real; the **capacity numbers are demonstration data.** Every *health
statistic* we quote (beds per 1,000, ICU scarcity, etc.) is sourced and cited. We're careful
to separate "this is illustrative" from "this is a fact," because the whole product is about
never showing a number you can't trust.

### Does it build beds or hire staff?
No — and we say so on purpose. noBed.ai is the **coordination and visibility layer.**
Infrastructure and workforce are capital-and-policy problems. Our job is to make the beds and
teams Ghana **already has** impossible to lose when minutes matter. Our data can also *reveal*
where capacity is missing, which helps planners — but we don't claim to fix it ourselves.

### How is this different from a hospital directory?
Two things. **Functional capacity:** we only show a bed as available if the oxygen,
ventilator, or incubator to use it is also free — a bed with no equipment isn't a bed. And
**data trust:** every number is labelled Verified, Self-reported, or **Stale**, and we never
show a "false green." A directory lists hospitals; noBed.ai helps you make a decision.

### What happens when a referral is accepted?
The destination hospital **holds a bed** for that patient — occupied goes up, and the
referral shows "🛏 Bed held." Decline or redirect, and the hold is released. This fixes the
real-world problem that referrals normally *carry no guarantee of a bed.*

### Why SMS? Isn't everyone on smartphones?
No — and the people closest to an emergency often have the least connectivity. A text message
works on any phone with no data. noBed.ai works over SMS so a nurse in a district facility or
a family in a rural area is never locked out.

### Is patient data safe?
noBed.ai stores **anonymised patient references only** — never identifiable patient data
(aligned with the Ghana Data Protection Act, 2012). Every change is audit-logged, and a live
deployment adds managed auth with MFA for admins and OTP for SMS users. See
[`docs/SECURITY.md`](../../SECURITY.md).

### Who's behind it?
**Mac-Jordan Degadjor** — a Ghanaian digital and technology writer based in Canada — designed
and built the platform. 

### Is there research behind this?
Yes. A 2024 study by the **Reach Alliance** (University of Toronto's Munk School + Ashesi
University) independently named the exact gap noBed.ai fills, recommending *"an integrated
referral system… to connect the various healthcare system referral levels."* Full analysis:
[`research/NO-BED-SYNDROME-PAPER-ANALYSIS.md`](../../../research/NO-BED-SYNDROME-PAPER-ANALYSIS.md).

### How would a hospital or region get involved?
We're looking for a pilot region, institutional partners (GHS, MoH, NAS, CHAG), an SMS
aggregator, and catalytic funding. Reach out: **info.nobedai@gmail.com**.

### What does it cost?
The **public side is free, always.** Institutions pay a subscription for the efficiency they
gain; governments and donors fund the system-level and analytics layers. SMS is run at cost.
See the [Business Model](BUSINESS-MODEL.md).

### What's the technology?
Next.js + TypeScript, PostgreSQL, and OpenStreetMap (no map licence fees), deployed on Vercel
and Neon. Built to run cheaply so it can run everywhere. Details in
[`docs/ARCHITECTURE.md`](../../ARCHITECTURE.md).

---

*Still have a question? Email info.nobedai@gmail.com.*
