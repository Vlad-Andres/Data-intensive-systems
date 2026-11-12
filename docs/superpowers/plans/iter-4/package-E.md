# Iteration 4 — Package E: Final Verification & Hand-over

> **Scope:** `playground-portal` (`iteration-4`) and `Data-intensive-systems/docs/superpowers/NEXT.md`. Do **not** touch `playground-template`.

---

### Task E1: Whole-flow check, README, and final pull request

1. Run the full flow locally with the fake model (`ARCHITECTURE.md`) in both English and Romanian, at desktop and 375 px, plus a production build (`npm run build && npx next start -p 3100`) checking `/` for zero Content-Security-Policy console errors. Check the browser console on every page: zero errors.
2. Confirm each item 1–7 below by a test or by hand, and record one line per item under **Calls made / problems**:
   1. **Wrong or guessed owner link** (`/manage/<token>`) gives 404 without revealing whether a course exists; token is never logged or stored in clear text outside job state.
   2. **Admin page without session** shows only the login form; every admin server action checks the session itself.
   3. **Invalid course edit** (last lecture removed, lecture left empty) is refused with a clear message and leaves stored course unchanged.
   4. **Old data**: pre-iteration-4 jobs (`publish` / `publish-wait`) and `meta.json` with only `jobId` + `publishedAt` keep working.
   5. **Missing translation**: a key in English missing in Romanian fails `tests/messages.test.ts`.
   6. **Immediate settings**: pausing generation or disabling an invite code in `/admin` takes effect on the very next request without redeploy.
   7. **Animated background**: does not weaken CSP and does not animate under `prefers-reduced-motion: reduce`.
3. Update `playground-portal/README.md`: routes (`/`, `/create`, `/jobs/<id>`, `/manage/<token>`, `/admin`, `/courses/<key>/`), environment variables, how settings and invite codes work, where logs live.
4. Commit fixes/README on `iteration-4`, run `npm run lint && npm test && npm run build`, push, verify preview status, and open the final Iteration 4 PR (`iteration-4 → main`). Remind the owner in the PR body: *"Set `ADMIN_TOKEN` (24+ characters) in Vercel for Production, then redeploy, before `/admin` works."*
5. Update `docs/superpowers/NEXT.md` to mark Iteration 4 PR open / awaiting merge before Iteration 5 (which still requires the owner to say `start iteration 5`).

---

## Earlier Iteration 4 notes (Packages A & B, merged)

- A1/A2 (`4bfd1cf`): `publish`/`publish-wait` folded into `finish`; `writeSite` skips `owners/<hash>.json` when `ownerHash` is empty; `course.published` logged in `lib/sites/publish.ts`. `pdfjs-dist` upgraded to `6.5.438` + `katex` override (`441fc76`) so `npm audit --omit=dev --audit-level=high` passes.
- B1–B4 (`b3752a4`): cron 401 carries `code: "unauthorized"`; course language names use `Intl.DisplayNames`; production build CSP verified clean and shader skips animation under reduced motion; top-bar CTA hides below 560 px to avoid clipping `LanguageSwitch`.

## Calls made / problems
