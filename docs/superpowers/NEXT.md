# NEXT — Live Hand-off

- **Active iteration:** Iteration 4 (`playground-portal` only — do **not** touch `playground-template`)
- **Active branch:** `iteration-4`. Packages A and B are merged (PRs #4, #5). **Packages C and D are done and pushed; their combined PR is open and waits for the owner's merge** (see the PR list on `Vlad-Andres/playground-portal`).
- **Active package:** [`plans/iter-4/package-E.md`](plans/iter-4/package-E.md) — start only after the owner merges the C+D PR
  - **Next task:** `E1` whole-flow check, `README.md`, final PR
- **Pending owner actions:** merge the C+D PR; set `ADMIN_TOKEN` (24+ chars) in Vercel Production and redeploy before `/admin` works

## Queued next (blocked)

- **Iteration 5:** [`plans/iter-5/00-guidelines.md`](plans/iter-5/00-guidelines.md) — approved, but **do not start** until Iteration 4 is merged and the owner says `start iteration 5` in chat.

## On-demand reference

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — repo sync flow, storage model, CSP/styling boundaries, local dev command
- [`notes/2026-11-code-runtimes.md`](notes/2026-11-code-runtimes.md) — deferred `code-runner` browser sandbox findings
