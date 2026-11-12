# NEXT — Live Hand-off

- **Iteration 4: complete and merged.** `playground-portal` `main` is at `3e56fac`: packages A (#4), B (#5), C+D (#6), the README (`b11f465`) and admin translation editing (#7, `/admin/translations`).
- **Iteration 4 verification:** lint, tests and build green; the E1 flow, header, 375 px and console checks are recorded in [`plans/iter-4/package-E.md`](plans/iter-4/package-E.md).
- **Known issue (course pages):** in production each course page logs one console error because the template registers a service worker (`/sw.js`) the portal does not serve. Fix in `playground-template` (`SiteShell`), then `npm run sync:core`. Waiting for the owner's go-ahead.
- **Not tested yet:** a real model run (the model account has no credit); test once it is topped up.

## Iteration 5 (in progress)

- Package P merged (PR #8). Service-worker fix merged (PR #9); the known issue above is fixed.
- **Packages A–D are built and pushed** on `iteration-5` (portal) and `iteration-5` (template, `30be21e`), in **PR #10**, waiting for the owner's merge.
- Built fast at the owner's request (2026-11-12): **no new tests for B–D and no hand checks**. Only an API smoke run of create → design → alternative → done passed. Sign-in, refine, append, restore and kept files are untested.
- **Next:** package E ([`plans/iter-5/package-E.md`](plans/iter-5/package-E.md)): evaluation set, whole-flow and security check, README. This is where the skipped tests and hand checks belong.
- **Owner actions:** Google OAuth client + `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `SESSION_SECRET` in Vercel, then redeploy. A real-model run when the model has credit.
- **Note:** the owner's opencode agent has temporary worktrees holding both `iteration-5` branches; they are behind the pushed branches. Remove them (`git worktree prune` after deleting the temp folders) before using that agent again.

## On-demand reference

- [`plans/iter-5/00-guidelines.md`](plans/iter-5/00-guidelines.md) — decisions, technical guidelines G1–G8, glossary, local run command
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — repo sync flow, storage model, CSP/styling boundaries, local dev command
- [`notes/2026-11-code-runtimes.md`](notes/2026-11-code-runtimes.md) — deferred `code-runner` browser sandbox findings
