# NEXT — hand-off for the next agent

You are picking up the **Standardised Learning Playground** project. Read this file, then the
review, then the plan. Then execute the plan in order without waiting for the user, except at the
stop points it lists.

## Read in this order

| # | What | Path (inside `Data-intensive-systems/docs/superpowers/`) |
| --- | --- | --- |
| 1 | This file | `NEXT.md` |
| 2 | What is wrong with the current work and why | `reviews/2026-11-11-review.md` |
| 3 | **Your tasks** | `plans/2026-11-11-iteration-3.md` (iteration 2 is done apart from its review and PRs, which are task Z1 there) |
| 4 | The design, when a task refers to it (the "Amendments 2026-11-11" section wins) | `specs/2026-11-10-learning-playground-platform-design.md` |

## Where the code is

| Repo | Path | State |
| --- | --- | --- |
| `playground-template` | `/Users/Mutru001/Public/Study/Period 1 y2/DIS/playground-website/playground-template` | Branch `iteration-2`, pushed, clean (head `22fc96e`; history rewritten 2026-11-11, see below). Packages B and C done: `core/` (schema, widgets, validator, generator), 10 generic widgets, showcase, `npm run generate` / `npm run import` |
| `playground-portal` | `/Users/Mutru001/Public/Study/Period 1 y2/DIS/playground-website/playground-portal` | Live at `https://playground-portal-bay.vercel.app` (Vercel deploys `main`, untouched). Branch `iteration-2`: pushed, clean (head `9a990cf`). Packages A, D1–D5, E1, E2 scripts done; 46/46 tests pass, lint & build clean |
| `Data-intensive-systems` | this repo | The user's live course site. **Read-only**, except `docs/superpowers/` |

## Current position

- [x] Design written (2026-11-10)
- [x] Template foundation and agent guide (2026-11-10)
- [x] First portal deployed on Vercel (2026-11-10) — reviewed 2026-11-11, needs rework
- [x] Iteration 2 package A — portal guards and headers (2026-11-11)
- [x] Iteration 2 package B — template fixes, `core/`, theme/features, 10 generic widgets, showcase, reference docs (2026-11-11)
- [x] Iteration 2 package C — generator + `npm run generate` / `npm run import`; real run accepted (2026-11-11)
- [x] Iteration 2 D1 vendored core, D2 job store + step machine, D3 API routes (2026-11-11)
- [x] Iteration 2 D4 pages complete and committed (`6898cfd`, 2026-11-11)
- [x] **Iteration 2 D5 real model run complete & accepted** (2026-11-11; 17 blocks/8 kinds/1 widget/7 quiz/41% prose/0 errors, build ok, report `.model-output/portal-report.md`)
- [x] **Iteration 2 E1 publisher against mocked GitHub complete** (`dc02b55`, 2026-11-11)
- [x] **Iteration 2 E2 publish-spike and delete-site scripts written** (`a554a76`, 2026-11-11)
- [x] Iteration-3 plan written (2026-11-11): `plans/2026-11-11-iteration-3.md` — courses hosted by the portal at `/courses/<key>/`, shared template UI, sandboxed `custom` block, `code-runner` widget, model-composed home page, 3 more widgets. Spec: "Amendments 2026-11-11 (b)" in the design doc
- [ ] **Next: wait for the user's yes on the iteration-3 plan and their choice of execution method.** Then start at package Z (close iteration 2: review + PRs)

### D4 completed (2026-11-11)

The page flow was tested and is ready to commit in `playground-portal`:

| File | State |
| --- | --- |
| `lib/extract-pdf.client.ts` | Written. pdf.js in the browser (legacy build), worker at `/pdf.worker.min.mjs`; `.txt`/`.md` split with core `splitTextIntoPages` |
| `scripts/copy-pdf-worker.mjs` + `predev`/`prebuild` scripts in `package.json` | Written. Copies the worker into `public/` (gitignored) |
| `package.json` | `pdfjs-dist@5.7.284` added; `overrides.zod` changed to `"$zod"` (the old `^4.6.6` override blocked every install) |
| `app/page.tsx` | Rewritten: materials (read in browser, per-file scanned check) → shape it (title, 9 languages, level, depth, 6 swatches + custom, quizzes/widgets/exam, context ≤ 2,000, access code) → POST JSON → `/jobs/<id>` |
| `app/jobs/[id]/page.tsx` | Written: polls every 3 s, calls `advance` while `idle`, outline editor (rename/remove, "Build my site"), retry button, done view with bundle download and the three local-preview commands |

Completed D4 checks: `npm test` 35/35, `npm run lint`, and `npm run build` pass. The fake-model flow created, reviewed, built, and downloaded an 11,074-byte bundle; the 375px mobile smoke check had no horizontal overflow.
1. Add CSS to `app/globals.css` for the new classes: `text-input`, `field-set`, `option-grid.three`, `swatches`/`swatch`/`swatch.selected`/`swatch-custom`, `helper-error`, `file-error`, `review-label`, `job-page`, `job-hero`, `job-title`, `job-usage`, `job-grid`, `phase-list` (+ `.done`, `.current`, `phase-dot`), `job-main`, `outline`, `outline-list` (+ `.removed`), `outline-number`, `outline-body`, `secondary-button.small`, `working`, `spinner`, `retry`, `finished`, `commands`. Keep the existing visual style; must work at 375 px. Remove the now-unused course-runtime CSS (`.course-page`, `.progress-card`, `.course-figure`, …).
2. `npm test && npm run lint && npm run build` in the portal.
3. Hand check with the fake model. Do **not** read `.env.local`. Start the dev server with the values on the command line so nothing touches the real Blob store or the real model, e.g. `BLOB_READ_WRITE_TOKEN= PORTAL_FAKE_MODEL=true PORTAL_ENABLE_GENERATION=true PORTAL_ACCESS_CODE=<any 12+ chars you make up> npx next dev -p 3100` (run it in the background; `Data-intensive-systems/.claude/launch.json` is tracked and read-only, so open the page with `preview_start {url}`). Full flow at desktop and 375 px: upload the sample PDF (`playground-template/materials/Lecture_01-Introduction-2026-2.pdf`, gitignored) → outline → build → download bundle. Check the console for CSP errors from the pdf.js worker.
4. Rewrite `README.md` and `.env.example` (new vars: `PORTAL_FAKE_MODEL` dev only, `CRON_SECRET`, `GEMINI_MODEL`; later `GITHUB_PUBLISH_TOKEN`, `GITHUB_PUBLISH_OWNER`, `TEMPLATE_REPO`). The old `jobs/` folder in the portal is stale local data from the first portal (gitignored); local data now lives in `.data/`.
5. Commit, ledger line, push `iteration-2`.

Then D5 (one real run through the portal locally — this is real run 5 of 5 for a session; a new session starts at 0), E1 (publisher against mocked GitHub; wire it in `lib/jobs/runtime.ts` `publisherFromEnv`, which returns `undefined` today), E2 (needs S4). Finally: whole-branch review, open one pull request per repo (never merge), update this file.

### Things the next agent should know

- Vendored core: after any change to `playground-template/core`, commit and push the template, then `npm run sync:core` in the portal and commit `vendor/core` (it records `TEMPLATE_SHA`).
- Real model runs so far (template CLI, `gemini-3.1-flash-lite`, about $0.25 / $1.50 per million tokens in/out): 4 runs, about $0.05 in total. Accepted run: 19 blocks of 9 kinds, 1 widget, 6 quiz questions, 42% prose, 0 errors, $0.011. Report in `playground-template/.model-output/report.md` (gitignored).
- **Template history was rewritten on 2026-11-11** at the user's request to remove their local folder path (`/Users/<name>/Downloads/…`) from GitHub. `main` and `iteration-2` were force-pushed; every older commit ID in the ledger is stale (old `main` `b59e5cf` → `caae2c7`). The local `main` is 2 commits ahead of `origin/main` (the old local commits, also rewritten) — do not push `main`. Never write absolute local paths into either code repo again.
- The `advance` route has `maxDuration = 300`; whether the user's Vercel plan allows that is unknown (ledger ruling).

Update this section after every finished package: tick it, name the next task.

## Waiting on the user

| Id | What | Status |
| --- | --- | --- |
| U1 | Set `PORTAL_ENABLE_GENERATION=false` in Vercel now (generation is open to anyone on the live site) | Asked 2026-11-11, not confirmed |
| S1 | May the agent push branch `iteration-2` and open pull requests? (never `main`) | **Answered 2026-11-11: yes.** Push `iteration-2` in both code repos and open pull requests. Still never push or merge to `main` |
| S2 | Set `PORTAL_ACCESS_CODE` (12+ characters) and `CRON_SECRET` (16+ characters) in Vercel; keep `PORTAL_ENABLE_GENERATION=false` until the PR is merged | Package A done 2026-11-11 — not yet asked; ask in your first report |
| S4 | GitHub account or organisation for generated sites, and a token | No longer needed (hosting decision 2026-11-11) |
| S5 | Ask GitHub Support to purge the old, unreferenced commits of `Vlad-Andres/playground-template` (they still open by ID, e.g. `fbc1365`, `ddc8754`) | Told the user 2026-11-11; only they can file it |

If the user answers one of these in your session, record it here.

## Decisions

| Decision | Status |
| --- | --- |
| Generated sites are public on GitHub Pages | **Replaced 2026-11-11:** sites are rendered by the portal from the stored course JSON at `/courses/<name>-<id>` (option A). No repo per site; E2 real publish is dropped (E1 publisher code stays unused) |
| Agent-written custom components | **Decided 2026-11-11: yes**, as a `custom` block run only in a sandboxed iframe (opaque origin, no network, postMessage only), checked (size, static scan, headless smoke test, one repair, then drop) and previewed at review. Code runners (C, Pascal, Python…) are catalogue widgets on proven WASM runtimes, not model-written |
| Users need a GitHub account | Decided: no. Sites are published under the operator's account or organisation |
| Model budget about $10–20/month | Decided: yes |
| v1 domain packs: Core, Math, CS, Memorise-heavy, Humanities | Decided: yes |
| Template is open source (MIT) | Decided: yes |
| The M4 / 16 GB machine is the Mac mini | Decided: yes |
| Product name and domain | Open. Working names: `playground-template`, `playground-portal` |

## Rules

1. Work in order: packages A → B → C → D → E, tasks in order. Finish, run the checks, tick the boxes, commit, continue.
2. A task is finished only when its checks give the expected output. Put the output in your report.
3. If a check still fails after two different fixes, stop and tell the user what you tried.
4. Work on branch `iteration-2` in both code repos. Never push to `main`, never merge. The user has allowed pushing `iteration-2` and opening pull requests (S1): push after each package and open one pull request per repo.
5. Never change settings in Vercel, GitHub or any provider yourself. Ask the user.
6. Never write, print or log a secret. Never read out the contents of a `.env*` file.
7. Real model calls cost money: tests use the fake model; at most 5 real generation runs per session without asking.
8. Never edit `Data-intensive-systems` outside `docs/superpowers/`.
9. Anything the plan does not decide: take the simplest option, add a line under "Calls made" in the plan, continue.
10. When blocked on the user for one task, continue with the next task that is not blocked.
11. Reports to the user are short: what now works, what the checks printed, what waits on them.

## After iteration 2

The backlog is at the end of the plan. Do not start it. Write a new plan with
`superpowers:writing-plans`, show it to the user, and wait for a yes.
