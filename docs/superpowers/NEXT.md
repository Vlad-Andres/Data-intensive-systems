# NEXT — Live Hand-off

- **Iteration 4: complete and merged.** `playground-portal` `main` is at `3e56fac`: packages A (#4), B (#5), C+D (#6), the README (`b11f465`) and admin translation editing (#7, `/admin/translations`).
- **Iteration 4 verification:** lint, tests and build green; the E1 flow, header, 375 px and console checks are recorded in [`plans/iter-4/package-E.md`](plans/iter-4/package-E.md).
- **Known issue (course pages):** in production each course page logs one console error because the template registers a service worker (`/sw.js`) the portal does not serve. Fix in `playground-template` (`SiteShell`), then `npm run sync:core`. Waiting for the owner's go-ahead.
- **Not tested yet:** a real model run (the model account has no credit); test once it is topped up.

## Iteration 5 (started)

- Portal branch `iteration-5` is pushed; **Package P** is in **PR #8** (`Vlad-Andres/playground-portal`), awaiting the owner's merge.
- Committed on `iteration-5`: P1 `c356629`, P2 `0153fa9`, P3 `df3f2b5`. Local gate green: `npm run lint`, `npm test` (151/151), `npm run build`.
- **Next:** [`plans/iter-5/package-A.md`](plans/iter-5/package-A.md) — the generator infers, designs and adapts (`playground-template` then `npm run sync:core`). Start after the owner gives the go-ahead.
- **Branch notes:** template `iteration-5` exists locally (cut from `origin/iteration-3`) but is **not** pushed yet — Package A pushes it.
- **Owner actions:** set `ADMIN_TOKEN` (24+ chars) in Vercel Production and redeploy; confirm the P3 `after()` chaining on the first real job after release.

## On-demand reference

- [`plans/iter-5/00-guidelines.md`](plans/iter-5/00-guidelines.md) — decisions, technical guidelines G1–G8, glossary, local run command
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — repo sync flow, storage model, CSP/styling boundaries, local dev command
- [`notes/2026-11-code-runtimes.md`](notes/2026-11-code-runtimes.md) — deferred `code-runner` browser sandbox findings
