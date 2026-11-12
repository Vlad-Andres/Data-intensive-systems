# NEXT — Live Hand-off

- **Iteration 4: complete and merged.** `playground-portal` `main` is at `b11f465`: packages A (#4), B (#5), C+D (#6) and the E1 README (`b11f465`) are all on `main`.
- **Verification:** `npm run lint`, `npm test` (140/140) and `npm run build` are green on `main`. The E1 whole-flow and header checks are recorded in [`plans/iter-4/package-E.md`](plans/iter-4/package-E.md) under "Calls made / problems".
- **Not verified yet:** the visual pass at desktop and 375 px in both languages, and the browser console. The flows were exercised over HTTP only.
- **Owner action still open:** set `ADMIN_TOKEN` (24+ characters) in Vercel for Production and redeploy, otherwise `/admin` answers 404.

## Next: Iteration 5 (blocked on the owner)

1. Read [`plans/iter-5/00-guidelines.md`](plans/iter-5/00-guidelines.md) in full, then the package file it names.
2. Start only after the owner says `start iteration 5` in chat; the guidelines open with the start gate and the branch commands.

## On-demand reference

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — repo sync flow, storage model, CSP/styling boundaries, local dev command
- [`notes/2026-11-code-runtimes.md`](notes/2026-11-code-runtimes.md) — deferred `code-runner` browser sandbox findings
