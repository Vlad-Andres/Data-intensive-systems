# NEXT — Live Hand-off

- **Iteration 4: merged.** `main` has packages A–D (PRs #4–#6), the README (`b11f465`), and the out-of-scope admin-translations work (PR #7).
- **Iteration 5: started.**
  - Portal branch `iteration-5` is pushed; **Package P** is in **PR #8** (`Vlad-Andres/playground-portal`), awaiting the owner's merge.
  - Committed on `iteration-5`: P1 `c356629`, P2 `0153fa9`, P3 `df3f2b5`. Local gate green: `npm run lint`, `npm test` (151/151), `npm run build`.
- **Next:** [`plans/iter-5/package-A.md`](plans/iter-5/package-A.md) (generator infers, designs and adapts — `playground-template` then sync). Start after the owner gives the go-ahead.
- **Branch notes:** template `iteration-5` exists locally (cut from `origin/iteration-3`) but is **not** pushed yet — Package A pushes it.
- **Owner actions:** set `ADMIN_TOKEN` (24+ chars) in Vercel Production and redeploy (unchanged); confirm the P3 `after()` chaining on the first real job after release.

## On-demand reference

- [`plans/iter-5/00-guidelines.md`](plans/iter-5/00-guidelines.md) — decisions, technical guidelines G1–G8, glossary, local run command
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — repo sync flow, storage model, CSP/styling boundaries, local dev command
- [`notes/2026-11-code-runtimes.md`](notes/2026-11-code-runtimes.md) — deferred `code-runner` browser sandbox findings
