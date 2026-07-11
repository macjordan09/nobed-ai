# NoBed.ai — Project Rules (Codex)

Ghana's real-time hospital bed capacity platform (product details: README.md).
Phase: public launch/awareness + portfolio piece. Material serves the Ghanaian
public and press first, tech readers second.

## Writing for NoBed
- Lead with the human story of No Bed Syndrome — patients driven hospital to
  hospital, preventable deaths — never with features or tech stack.
- Every statistic (deaths, hospital counts, wait times) must trace to
  `research/` or a cited source. A wrong health claim at launch kills trust.

## Where things live
- New marketing assets → `marketing-v2/` only. `marketing/` is legacy:
  read it, never write to it.
- Business and press documents → `docs/business/`.

## Code rules
- The MVP must run with zero paid accounts (Dockerized Postgres, OSM tiles,
  mock auth, SMS simulator). Reject changes needing a paid service; document
  production paths in `docs/` as migration notes instead.
- Ask before adding any npm dependency or touching `prisma/` schema or seed
  data — the seeds drive the demo (17 hospitals, 9 users).
- A code task is done only when `npm run build` passes.
- `../nobed-mobile` is the Expo companion — flag any API or schema change
  that would break it.
