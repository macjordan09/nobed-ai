# Research → Product: "No Bed Syndrome" paper analysis

**Paper:** Agbatsi, E.A., Basil, J.A., Fiergbor, C.N., Reindorf, S., Agbodjah, S., & Asante-Darko, D.
(2024). *The "No Bed Syndrome" in Ghanaian Tertiary Hospitals.* Reach Alliance — Munk School of
Global Affairs & Public Policy (University of Toronto) & Ashesi University. February 2024.
Local copy: [`source/reach-alliance-no-bed-syndrome-2024.pdf`](source/reach-alliance-no-bed-syndrome-2024.pdf)

**Method:** sequential mixed-method — 16 key-informant interviews (doctors, nurses, admin across
tertiary hospitals) + a 67–100-respondent survey ranked with a Relative Importance Index (RII).

---

## TL;DR — the paper validates noBed.ai, almost line for line

> *"There is no real-time bed-availability tracking across different institutions to enable an exchange
> of such information between the lower-level facilities and the tertiary institutions and even between
> the tertiary institutions themselves."* (System-related causes, p.10)

> Recommendation: *"Establish an integrated referral system that makes use of the Bed Bureau Unit's
> role to connect the various healthcare system referral levels, ensuring optimized patient flow,
> admission, and discharge."* (Recommendations, p.18)

**That recommendation is, essentially, noBed.ai.** An independent academic study names the exact gap
we built for. Use this as the credibility anchor for stakeholders (GHS, MoH, NAS, donors).

---

## Key findings (and what each means for us)

### 1. "Bed capacity" ≠ physical beds — it's *functional* beds
A bed only counts if it has the **equipment** (oxygen, ventilators, incubators) **and staff** to make
it work. *"Beyond the number of beds that you count, there are other things that make a bed
'functional'… gadgets and the number of healthcare workers."* (R2, p.9). Patients are told "no bed"
when the *equipment* (e.g. oxygen) is the real constraint, not the mattress.
→ **Tweak:** model **functional capacity**, not just bed counts (see Product tweaks #1).

### 2. The core gap is coordination, not just supply
The tiered referral system is a strength, but it breaks because there's no shared, real-time picture.
Referrals carry **no guarantee of a bed**; receiving units even *"hijack the stretcher in the ambulance
to prevent further referrals"* (R1, p.10). Tertiary hospitals also refer **to each other** (Greater
Accra ← Northern teaching hospital, R7).
→ **Tweak:** referral **acceptance should reserve/hold a bed**; support **tertiary↔tertiary** and
**lower→tertiary** referrals explicitly (Product tweaks #3).

### 3. Existing digital records are *inaccurate* — false "full"
A government patient-tracking system shows discrepancies: discharged-but-unpaid patients still listed,
**deceased still listed**, *"physical bed available but… no virtual bed."* These inaccuracies make the
system show **full when beds are actually free** — *"contributing significantly to the No Bed Syndrome."*
(p.10–11)
→ **This is exactly what our verification / data-trust layer fixes.** The Verified / Self-reported /
**Stale** states and the "never a false green" rule are directly validated. Lead with data trust.

### 4. The "Bed Bureau Unit" already exists — it's the human version of noBed.ai
Some hospitals run a **Bed Bureau Office**: a unit that *"maintains a roster of all hospital
departments, scheduling them to count available beds throughout the day… shared across the emergency
department, aiding decision making for decongesting the ED."* It was the **2nd most efficient** existing
solution (chosen 36×; only "increase beds" scored higher at 48×). (p.12, Table 5)
→ **Positioning gold:** noBed.ai is **the digital backbone of the Bed Bureau Unit**, extended across
institutions. Sell *into* this existing role, don't invent a new one (GTM tweaks).

### 5. The "floor system" — intra-hospital sharing
Departments/floors **share available beds with each other** to place patients internally. (p.12)
→ **Tweak:** support **intra-hospital / inter-departmental** visibility, not only hospital-to-hospital.

### 6. Patients bypass the structure and crowd tertiary hospitals
**Overcrowding by referral patients** ranked the **#2 cause**; high volume of self-directed patients
who *"go directly to tertiary hospitals… even though the care they need can be provided in lower-level
facilities."* Patients also request specific hospitals by reputation. (p.11, p.14)
→ **Tweak:** guide the public to the **right level of care** (CHPS / health centres / district →
tertiary), surfacing lower-level facilities — a decongestion lever, not just a tertiary bed-finder.

### 7. ICU scarcity is severe (our ICU emphasis is correct)
**10 of 16 regions had no ICU beds**; **0.5 ICU beds per 100,000** (113 adult + 36 paediatric for ~30M).
Only **5 teaching hospitals** (Korle-Bu, Komfo Anokye, Ho, Cape Coast, Tamale), each serving 2+ regions.
(p.5, p.10) → Keep ICU front-and-centre; these are powerful, citable marketing stats.

### 8. Ranked causes (RII, Fig. 4) — be precise about what we solve
1 Inadequate infrastructure · 2 Overcrowding by referrals · 3 Scarcity of equipment · 4 Limited
teaching hospitals · 5 High patient volume · 6 **Lack of communication for referrals** · 7 Insufficient
workforce · 8 Patients' financial constraints.
Top effects: **loss of patient**, denied admission, inadequate treatment, delayed admission.
→ noBed.ai directly attacks **#2, #5, #6** (and surfaces #1/#3 by showing which beds are *functional*).
We do **not** fix #1/#3/#4/#7 (infrastructure, equipment, hospitals, workforce) — but our data can
**reveal** them. Message honestly (Scope note).

### 9. Other systems worth borrowing
China (Chengdu) uses **colour-coding + a 3-stage model** (predict length-of-stay → occupancy →
optimal allocation). UK **step-down units**; China **fangcang** overflow shelters. Rwanda/Access
Project: **research actual needs before deploying.** (p.7)
→ Validates our **colour tiers** *and* the **Phase-3 AI prediction** roadmap.

### 10. The catalyst case — now citable
Anthony **Opoku-Acheampong, 70**, died in **2018** after being turned away from **seven hospitals** in
Accra (two private + five state, incl. Korle-Bu and Greater Accra Regional). Source: Citi Newsroom, 11
June 2018 (paper ref. 3). → We can now cite this **accurately** (with source) instead of a composite.

---

## Recommended tweaks

### A. Product / data model
1. ✅ **DONE — Functional capacity, not bed counts.** Hospital now tracks `oxygenAvailable`,
   `ventilatorsAvailable`, `incubatorsAvailable`; per bed type we compute `functional = min(beds free,
   gating equipment free)` (ICU↔ventilators, emergency/isolation↔oxygen, maternity/paediatric↔incubators).
   Colour/status are driven by **functional emergency capacity**; the map popup and dashboard surface it,
   and staff edit equipment in the capacity editor. (`lib/functional.ts`, `lib/hospitals.ts`, `api/beds`.)
2. ✅ **DONE — Bed reservation on referral accept.** Accepting a referral **holds a bed** at the
   destination (occupied +1, `bedReserved` flag); declining/redirecting **releases** it. Shown as a
   "🛏 Bed held" badge in referral lists. (`api/referrals/[id]`, schema `Referral.bedReserved`.)
3. **Referral topology:** explicitly support **lower→tertiary**, **tertiary↔tertiary**, and
   **intra-hospital (floor system)** transfers.
4. **Right-level-of-care guidance + lower-level facilities** in the public finder (CHPS, health
   centres, polyclinics, district hospitals) to relieve tertiary overcrowding — the #2 cause.
5. **Data-accuracy hooks:** lightweight EMR/admin sync (or an SMS "discharge" command) so a discharge
   frees the bed immediately — attacking the "false full" problem the paper documents.

### B. Verification / trust  *(already built — now evidence-backed)*
Highlight the Verified / Self-reported / **Stale** model and "never a false green" as the direct fix
for finding #3. Consider a "last physically counted" timestamp to mirror the Bed Bureau's daily counts.

### C. Positioning / go-to-market
- Frame noBed.ai as **"the digital Bed Bureau — connected across hospitals,"** selling into the
  existing, respected Bed Bureau Unit role rather than as a new system.
- Offer an **MoH/GHS analytics view**: our data reveals where ICU/functional capacity is missing →
  a **resource-allocation planning tool** (addresses causes #1/#3/#4 at the policy layer).
- Lead stakeholder decks with the paper's own recommendation (the quote above) as third-party validation.

### D. Messaging / marketing
- Replace vague stats with the **sourced figures** below.
- Optionally cite the **Opoku-Acheampong** case (with source) in the About page / documentary, kept
  respectful — it's the publicly documented catalyst.
- Keep scope honest: *"noBed.ai is the coordination and visibility layer. It doesn't build beds or
  train staff — it makes sure the beds and teams we already have are never invisible when minutes
  matter."*

### E. AI roadmap (Phase 3, validated)
Pursue the **Chengdu-style** approach: predict length-of-stay & occupancy → forecast availability →
flag anomalies. Anchor it to the paper + the China precedent.

---

## Honest scope note
The paper's #1, #3, #4, #7 causes (infrastructure, equipment, # of hospitals, workforce) are **capex
and policy** — noBed.ai can't solve them. Our lane is **coordination, visibility and data trust**,
which directly addresses the avoidable deaths from poor referral coordination (#2, #6) and exposes the
others for planners. Claiming more would fail the "room test" with clinicians.

## Sourced stat library (for marketing — cite the source)
| Stat | Source (via paper) |
|------|--------------------|
| Africa: **1.3 hospital beds / 1,000** (vs 2.7 global), lowest globally, 2019 | WHO Global Health Observatory, 2018 |
| Ghana: **0.9 beds / 1,000** (2021) | paper, p.1 |
| **10 of 16** Ghanaian regions had **no ICU beds**; **0.5 ICU beds / 100,000** | Siaw-Frimpong et al., *J. Critical Care* 61 (2021) |
| Bed turnover **99.7%**, avg length of stay **3.3 days** (2014) | Ghana Health Service, 2015 |
| Only **5 teaching hospitals** for 16 regions | paper, p.10 |
| Catalyst: man (70) died after **7 hospitals** refused him, 2018 | Citi Newsroom, 11 Jun 2018 |
| "Bed Bureau Office" = 2nd most-cited effective fix | paper, Table 5 |

---
*Prepared from the Reach Alliance (2024) case report for noBed.ai product & marketing planning.*
