# SDD ledger — plan: docs/superpowers/plans/2026-11-11-iteration-2.md

Ruling: ledger lives in docs/superpowers/ (not <repo>/.superpowers/sdd) — the plan spans two code repos and Data-intensive-systems is read-only outside docs/superpowers — cost if wrong: none.
Pre-flight: B2 core → C (generator uses validateBlock/formatProblem/blockExamples/widgetCatalogue) → D1 vendors core → D2/D3 consume Brief/Material/LIMITS/DEFAULT_BUDGET/finishCourse. Package A guard.ts is reused by D3 (LANGUAGES/LEVELS must match core Brief). No conflicts found.
Task A1: complete (commits 35840b7..e6f62a5, tests: npm test && npm run lint && npm run build → 12/12 pass, lint ok, build ok)
Task A2: Ruling: CSP stays on in dev with 'unsafe-eval' added to script-src (prod has none) instead of prod-only CSP — keeps dev close to prod so CSP problems (e.g. pdf.js worker) show early — cost if wrong: one line.
Task A2: Ruling: next.config.mjs → next.config.ts so the header list is one typed module shared with the test — cost if wrong: none.
Ruling: dev servers are started with Bash in the background and opened with preview_start {url}; Data-intensive-systems/.claude/launch.json is tracked and that repo is read-only — cost if wrong: none.
Task A2: complete (commits e6f62a5..2c8f51c, tests: npm test && lint && build → 15/15 pass; live: 4 headers present, POST /api/jobs → 503 while disabled)
Task B1: complete (commits 513f9b6..a4826ad, tests: lint+test+build+build:dis+compare → 39/39 pass, route /lectures/introduction-and-indexes present, 0 pages differ (18 compared))
Task B2: complete (commits a4826ad..c7a565e, tests: test+lint+build+build:dis+compare → 52/52 pass, 0 pages differ (18 compared))
Task B3: Ruling: exam countdown is computed in the browser (useEffect), not at build time — a static site would otherwise freeze the number — cost if wrong: none.
Task B3: Ruling: features.difficult=false also hides the per-block/section flags and makes /difficult a 404 (notFound) — flags without a review page would be dead UI — cost if wrong: small.
Task B3: complete (commits c7a565e..a444bd8, tests: test+lint+build+build:dis+compare → 69/69 pass, 0 pages differ; all-off build: no Difficult/Search, /difficult 404, accent+sharp CSS present)
Task B4: Ruling: widgets committed as two commits (catalogue, components) instead of one per widget — every widget shares core/widgets.ts and the test files — cost if wrong: history granularity only.
Task B4: Ruling: prop-rule tests were written after the catalogue (negative cases, so each fails if its rule is missing) — cost if wrong: none.
Task B4: Ruling: added uniqueness rules not in the plan (order-items items, match-pairs sides, categorize items/categories, node ids) and edges ≤24 / links ≤30 — components key on these values — cost if wrong: a model output rejected that could have rendered.
Task B4: complete (commits 26da797..539e4f8, tests: test+lint+build+build:dis+compare → 165/165 pass, 0 pages differ)
Task B5: Ruling: hand check done on the static showcase build (python http.server on out/) instead of next dev — same pages, no launch.json edit needed — cost if wrong: none. Screenshots were viewed in the browser pane (desktop light, 375px dark); they cannot be attached as files to the report.
Task B5: complete (commits 539e4f8..e52fe3e, tests: npm test → 211/211, lint ok, build:showcase ok, DIS 0 pages differ; browser: all 10 widgets render and respond, no console errors, no horizontal overflow at 375px dark)
Task C1: complete (commits e52fe3e..c9aa082, tests: vitest generate-ingest → 9/9 pass, lint ok)
Task C2: complete (commits c9aa082..4efcb6b, tests: generate-model + generate-clients → 11/11 pass, lint + tsc ok)
Task C3: Ruling: plan normalises brief-owned fields (indexable, language, level, title, accent, id slug) before validation, so the model cannot override them — cost if wrong: none.
Task C3: Ruling: lint tests were written together with lintLecture (not run red first); each asserts a warning that only the matching rule produces — cost if wrong: low.
Task C3: Ruling: invalid meta after repair is replaced by meta built from the plan (reported in dropped) instead of failing the lecture — cost if wrong: thinner meta on that lecture.
Task C3: Ruling: widgets when brief.widgets=false are removed before validation; DIS labs and mock-exam inside lectures are treated as invalid (repair or drop) — cost if wrong: none.
Task C3: Ruling: validateBlock now also checks select answers (E108) so finishCourse cannot hit E108 — cost if wrong: none.
Task C3: Ruling: exam.json is written only when the plan has an exam AND brief.examMode; its section kind is playground with a prose intro and a mock-exam widget — cost if wrong: none.
Task C3: complete (commits 43956e7^..7e00508, tests: npm test → 267/267 pass incl. plan 7, lecture 9, lint 7, finish 4; lint + tsc ok)
Task C4: Ruling: added W307/W308 lint and block-count guidance after real runs 1–3 came back thin (12–14 blocks for 67 pages) — they trigger the existing improvement call — cost if wrong: one extra model call per thin lecture.
Task C4: Ruling: added --trace (local JSONL of prompts/replies), --bundle, --report, --price-in/out to the CLI — needed to debug prompts and to measure cost — cost if wrong: none.
Task C4: Real runs this session: 4 of 5 (run1 12 blocks/6 kinds/$0.013; run2 10/5, 6 dropped; run3 14/5; run4 19 blocks/9 kinds/1 widget/6 quiz/42% prose/0 errors/$0.011 at $0.25/$1.50 per M tokens).
Task C4: complete (commits 7e00508..ebba4ca, tests: npm test → 288/288, lint ok, build ok; real run 4 meets acceptance, CONTENT_DIR=.model-output/course build ok)
Task D1: complete (commits 2c8f51c..499e671, tests: npm test → 18/18, lint ok, build ok; TEMPLATE_SHA ebba4ca)
Task D2: Ruling: advance() takes the Store in its deps (advance(id, {store, model, now, publish})) — testable with memoryStore, no global — cost if wrong: none.
Task D2: Ruling: a thrown error counts as a failed attempt (3 → failed); a step that stays in place (publish-wait while building) deletes its claim so the next poll can run — cost if wrong: none.
Task D2: Ruling: canned model moved from template scripts/ to core/generate/fake.ts so the portal's PORTAL_FAKE_MODEL uses the same one — cost if wrong: none.
Task D2: complete (commits 499e671..156384c, tests: npm test → 26/26, tsc ok)
Task D3: Ruling: maxDuration stays 300 s — I cannot see the Vercel plan; on Hobby without fluid compute the limit is lower and a long lecture step could be cut (the claim then expires and the step is retried) — cost if wrong: lecture steps time out on a low-limit plan.
Task D3: Ruling: the lecture writer forces meta.title from the reviewed plan so outline renames reach the site — cost if wrong: none.
Task D3: Ruling: POST /api/jobs checks the 4 MB size right after the enabled check (the body must be read before the access code) — cost if wrong: none.
Task D3: complete (commits c724dc4, tests: npm test → 35/35, build + lint ok)
Task D4: complete (tests: npm test → 35/35, lint and build ok; fake-model flow created, reviewed, built, and downloaded 11,074-byte bundle; mobile smoke check passed at 375px)
Task D5: Ruling: real portal run uses local store and advanceHandler pipeline; Turbopack CSS issue under macOS sandbox avoided via webpack build in template — cost if wrong: none.
Task D5: complete (real run 5 of 5: job c2b5b5d7, 17 blocks/8 kinds/1 widget (match-pairs)/7 quiz/41% prose/0 errors, build ok, cost ~$0.014; report in .model-output/portal-report.md)
Task E1: Ruling: git tree deletions use `sha: null` entries on the Git Data API; paths in bundle verified via isBundlePath before any GitHub API call — cost if wrong: none.
Task E1: complete (commits 6898cfd..dc02b55, tests: npm test → 46/46 pass incl. publish 11; lint and build ok)
Task E2: Ruling: added scripts/publish-spike.ts and scripts/admin/delete-site.ts using native fetch / readline / process.loadEnvFile — cost if wrong: none.
Task E2: spike & admin scripts created (commit a554a76, lint/test/build ok); real publish run pending S4 (GitHub credentials) and network access.
History rewrite 2026-11-11 (user asked to remove their local folder path from GitHub): playground-template main and iteration-2 rewritten with git filter-branch (`/Users/Mutru001/Downloads/` → `materials/` in docs/agent/proof/README.md and the deleted scripts/model/gemini-proof.ts) and force-pushed with lease. All template commit IDs in this ledger changed: old origin/main b59e5cf → caae2c7, old iteration-2 head 69b0edd → 22fc96e. Use `git log --oneline` to find tasks by message. Backup bundle of the old history: scratchpad of session 77ba6d7d (temporary). Old commits remain fetchable by ID on GitHub until GitHub Support purges them (user action).
Task Z1: whole-branch review of iteration-2 (template + portal). Critical/Important findings fixed with failing tests first:
- Important (template): `Markdown.tsx` did not override `img`, so model Markdown could trigger automatic third-party image requests; `safeHref` treated protocol-relative `//host` (and `/\host`) as a local URL. Fix: `img` now renders only same-site relative paths and shows alt text otherwise; `safeHref` rejects protocol-relative URLs. Tests: 3 new cases in tests/markdown-safety.test.tsx.
- Important (portal): `lib/publish/github.ts` emitted both a delete (`sha: null`) and an add for the same path when a bundle replaced an existing `exam.json`/`expected.json`, leaving the tree result undefined. Fix: `treeEntries` skips delete paths that the bundle replaces. Test: replacement case in tests/publish.test.ts asserts one entry per path.
Task Z1: findings ledgered, not fixed (none Critical):
- Medium (portal): `app/jobs/[id]/page.tsx` `build()` has no try/catch around `fetch`; a network failure leaves `saving=true` and no message. Retry by reloading the page.
- Medium (portal): `lib/publish/github.ts` does not check the branch-ref PATCH response; if it fails, the job stays in publish-wait with no timeout.
- Low (portal): `README.md` still says the portal does not create a GitHub repository per course; publishing is implemented (one `pg-*` repo per course) and optional.
- Low (portal): `.md` uploads are labelled "TXT" in the file list (`app/page.tsx`).
- Low (template): `core/generate/plan.ts` accepts page ranges with `from > to`, unknown `file`, or no upper bound; `renderMaterials` then silently includes nothing for that range.
Task Z1: checks after fixes — template: `npm run lint && npm test && npm run build && npm run build:dis && npx tsx scripts/snapshot-text.ts out --compare tests/baseline/pages.json` → 292/292 tests, lint ok, both builds ok, 0 pages differ (18 compared); portal: `npm run lint && npm test && npm run build` → 47/47 tests, lint ok, build ok.
Task Z1: E2 "real publish" marked dropped in `plans/2026-11-11-iteration-2.md` with user approval: the 2026-11-11 (b) amendment replaces GitHub Pages publishing with portal-hosted courses. Spike/admin scripts remain operator tools.

## Iteration 3 (2026-11-11)

- G3 code runner deferred by the user; sandbox findings in `notes/2026-11-code-runtimes.md`.
- Portal synced to template `99769d4` (`a9676c5`).
- H1 `72f0c74`, H2 `7a09c91`, H3 `5a699d4`: courses publish to `courses/<key>/site.json` and render at `/courses/<key>/`.
- H4 by hand passed (see NEXT.md); fix `461f05c` (trailing-slash links were redirected).
