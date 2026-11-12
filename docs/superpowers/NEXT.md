# NEXT — Live Hand-off

- **Active iteration:** Iteration 4 (`playground-portal` only — do **not** touch `playground-template`)
- **Active branch:** `iteration-4` (Packages A & B are merged to `main` via PRs #4 and #5)
- **Active package:** [`plans/iter-4/package-C.md`](plans/iter-4/package-C.md)
  - Committed on `iteration-4`: C1 (`cbdcbef`), C2 (`4793bd5`)
  - Next / in progress in working tree: **C3 `admin overview and course takedown`** → finish C3, pass full gate, open Package C PR, and stop
- **Remaining in Iteration 4:** [`plans/iter-4/package-D.md`](plans/iter-4/package-D.md) → [`plans/iter-4/package-E.md`](plans/iter-4/package-E.md)
- **Pending owner action:** Set `ADMIN_TOKEN` (24+ chars) in Vercel Production and redeploy before `/admin` works

## Queued next (blocked)

- **Iteration 5:** [`plans/iter-5/00-guidelines.md`](plans/iter-5/00-guidelines.md) — approved, but **do not start** until Iteration 4 is merged and the owner says `start iteration 5` in chat.

## On-demand reference

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — repo sync flow, storage model, CSP/styling boundaries, local dev command
- [`notes/2026-11-code-runtimes.md`](notes/2026-11-code-runtimes.md) — deferred `code-runner` browser sandbox findings
