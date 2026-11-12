# NEXT — Live Hand-off

- **Active iteration:** Iteration 4 (`playground-portal` only — do **not** touch `playground-template`)
- **Active branch:** `iteration-4` (clean working tree, 4 local commits ahead of `origin/main`, not pushed yet; Packages A & B merged via PRs #4 and #5)
  - Package C committed locally: C1 (`cbdcbef`), C2 (`4793bd5`), C3 (`eb00caf`)
  - Package D committed locally: D1 (`19e3ec4` — `lib/sites/edit.ts` + `tests/site-edit.test.ts`)
- **Active package:** [`plans/iter-4/package-D.md`](plans/iter-4/package-D.md)
  - **Next task:** **D2 `The manage page`** → complete D2, run full gate (`npm run lint && npm test && npm run build`), push `iteration-4`, open PR `iteration-4 → main` (covering Packages C & D, reminding the owner about `ADMIN_TOKEN`), and stop
- **Remaining in Iteration 4:** [`plans/iter-4/package-E.md`](plans/iter-4/package-E.md) (`E1` whole-flow check, `README.md`, final PR)
- **Pending owner action:** Set `ADMIN_TOKEN` (24+ chars) in Vercel Production and redeploy before `/admin` works

## Queued next (blocked)

- **Iteration 5:** [`plans/iter-5/00-guidelines.md`](plans/iter-5/00-guidelines.md) — approved, but **do not start** until Iteration 4 is merged and the owner says `start iteration 5` in chat.

## On-demand reference

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — repo sync flow, storage model, CSP/styling boundaries, local dev command
- [`notes/2026-11-code-runtimes.md`](notes/2026-11-code-runtimes.md) — deferred `code-runner` browser sandbox findings
