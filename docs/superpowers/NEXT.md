# NEXT — Live Hand-off

- **Iteration 4: complete and merged.** `playground-portal` `main` is at `3e56fac`: packages A (#4), B (#5), C+D (#6), the README (`b11f465`) and admin translation editing (#7, `/admin/translations`).
- **Verification:** lint, tests (149) and build green; the E1 flow, header, 375 px and console checks are recorded in [`plans/iter-4/package-E.md`](plans/iter-4/package-E.md).
- **Known issue:** course pages log one console error in production because the template registers a service worker (`/sw.js`) the portal does not serve. Fix in `playground-template` (`SiteShell`), then `npm run sync:core`; waiting for the owner's go-ahead.
- **Not tested yet:** a real model run (the model account has no credit); test it once it is topped up.

## Next: Iteration 5 (blocked on the owner)

1. Read [`plans/iter-5/00-guidelines.md`](plans/iter-5/00-guidelines.md) in full, then the package file it names.
2. Start only after the owner says `start iteration 5` in chat; the guidelines open with the start gate and the branch commands.

## On-demand reference

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — repo sync flow, storage model, CSP/styling boundaries, local dev command
- [`notes/2026-11-code-runtimes.md`](notes/2026-11-code-runtimes.md) — deferred `code-runner` browser sandbox findings
