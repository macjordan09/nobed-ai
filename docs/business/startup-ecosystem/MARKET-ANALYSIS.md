# Market Analysis

The size and shape of the problem noBed.ai addresses. Every health statistic here is sourced;
market-sizing figures are clearly labelled as **framing estimates**, not audited numbers.

---

## The problem is documented, ranked, and named

A 2024 **Reach Alliance** study (University of Toronto's Munk School of Global Affairs & Public
Policy + Ashesi University) studied No Bed Syndrome in Ghanaian tertiary hospitals using 16
key-informant interviews and a survey scored with a Relative Importance Index. It ranked the
causes:

1. Inadequate infrastructure
2. **Overcrowding by referrals**
3. Scarcity of equipment
4. Limited teaching hospitals
5. **High patient volume**
6. **Lack of communication for referrals**
7. Insufficient workforce
8. Patients' financial constraints

noBed.ai directly attacks **#2, #5, and #6** — the coordination causes — and *reveals* #1 and
#3 for planners. We're precise about that scope on purpose.

## The underlying scarcity (sourced)

| Indicator | Figure | Source |
|-----------|--------|--------|
| Hospital beds, Africa | **1.3 / 1,000** (lowest region globally) | WHO GHO, 2018 |
| Hospital beds, Ghana | **0.9 / 1,000** (2021) | Reach Alliance, p.1 |
| Regions with **no ICU beds** | **10 of 16** | Siaw-Frimpong et al., 2021 |
| ICU beds | **0.5 / 100,000** (113 adult + 36 paediatric, ~30M people) | Siaw-Frimpong et al., 2021 |
| Teaching hospitals | **5** for 16 regions | Reach Alliance, p.10 |
| Bed turnover / avg length of stay | **99.7%** / **3.3 days** (2014) | Ghana Health Service, 2015 |

**Read-through:** when beds are this scarce and turnover this high, the marginal value of
*coordinating* existing capacity is enormous. You can't quickly build ICUs; you can
immediately stop wasting the ones you have.

---

## Who's in the market (the buyers)

- **Hospitals & hospital groups** — public, private, and mission/CHAG facilities. Ghana has a
  tiered system: teaching → regional → municipal/district → polyclinics/health centres → CHPS.
- **Ghana Health Service & Ministry of Health** — the system stewards and the analytics buyer.
- **National Ambulance Service** — the coordination user in the field.
- **Development funders** — global-health and digital-development grant-makers.

## Market framing (illustrative, not audited)

We frame this as **public-health infrastructure**, so "market size" is best read as *reachable
institutions × value of coordination*, not a consumer TAM.

- **SOM (beachhead):** one pilot region — a cluster of referring/receiving hospitals + NAS
  dispatch. A few dozen facilities. This is where we prove time-to-placement.
- **SAM (national):** Ghana's referral hospitals and administrators — the ~5 teaching + regional
  + district facilities plus GHS/MoH and NAS. Priced via institutional SaaS + a government
  licence.
- **TAM (regional):** the same coordination gap exists across much of Sub-Saharan Africa, which
  shares the lowest-beds-per-capita profile globally. The platform is built cheap (serverless +
  SMS + free maps) specifically to travel across similar low-resource systems.

> We deliberately don't publish a single big TAM number — it would fail the room test. The
> honest sizing is: a documented, ranked, named problem across a region with the world's
> thinnest bed supply, addressable by the cheapest class of intervention (coordination).

---

## Timing — why this is buildable now

1. **The gap is documented and ranked** (Reach Alliance, 2024) — de-risked problem.
2. **The fix is named** by the same researchers — de-risked solution direction.
3. **Universal SMS** reaches the low-connectivity users who need it most.
4. **Serverless cloud + licence-free maps** make national scale affordable for a small team.
5. **An existing, trusted role** (the Bed Bureau Unit) gives a low-friction adoption wedge.

## Precedents worth citing

- **Chengdu, China** — colour-coding + a 3-stage occupancy/allocation model (validates our
  colour tiers and Phase-3 AI roadmap).
- **UK step-down units; China fangcang overflow** — system-level coordination playbooks.
- **Rwanda / Access Project** — "research actual needs before deploying," which is exactly the
  research-first posture noBed.ai takes.

---

*See also: [Competitive Landscape](COMPETITIVE-LANDSCAPE.md) · [Go-To-Market](GO-TO-MARKET.md)*
