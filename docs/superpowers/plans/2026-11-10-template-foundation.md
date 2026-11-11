# Template Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task, in order, in one session. Steps use checkbox (`- [ ]`) syntax for tracking. Tick each box in this file as you finish it.

**Goal:** A new local repo `playground-template` in which the DIS course site is built entirely from validated JSON content, with no visible change to any page.

**Architecture:** Course content moves out of TypeScript into `<contentDir>/*.json`. A build script validates it against Zod schemas, writes generated JSON into `src/content/generated/`, and the existing engine reads that instead of hand-written modules. Interactive labs become `widget` blocks that name a component from a fixed registry, so content never contains code.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, Tailwind 4 (all unchanged). New dev-only tools: Zod 4, Vitest, tsx.

**Spec:** `docs/superpowers/specs/2026-11-10-learning-playground-platform-design.md` (sections 3.2 and 8). Hand-off rules: `docs/superpowers/NEXT.md`.

## Paths

| Name | Absolute path |
| --- | --- |
| `DIS` (read-only source) | `/Users/Mutru001/Public/Study/Period 1 y2/DIS/playground-website/Data-intensive-systems` |
| `NEW` (all work happens here) | `/Users/Mutru001/Public/Study/Period 1 y2/DIS/playground-website/playground-template` |

All file paths in the tasks are relative to `NEW`. This plan file and `NEXT.md` stay in `DIS/docs/superpowers/`; edit them there.

## Global Constraints

- Node 22 or newer, npm. Static export (`output: "export"`) stays.
- `zod`, `vitest`, `tsx` are **devDependencies**. No file under `src/app`, `src/components`, `src/hooks`, `src/lib` or `src/widgets/*.tsx` may import `zod` at run time (`import type` is fine).
- At the end of every task: `npm run lint`, `npm test`, and the build command named in the task all pass.
- Never change the wording of DIS content. If DIS content fails a schema rule, loosen the rule and record it under "Calls made".
- No push, no remote, no GitHub repo creation. Local commits in `NEW` only.
- Content JSON is untrusted input: unknown keys are errors (`.strict()` on every object schema), Markdown never renders raw HTML.
- The 80-word limit on prose is a **warning** (`W201`) in this plan, not an error.

## Review Focus

1. A lecture file with a JSON syntax error → `E001` naming the file; no stack trace. (Task 4)
2. A content folder with no lectures or no `course.json` → `E002`. (Task 4)
3. A `widget` block naming a widget that does not exist → build stops with `E104` naming file and path. (Tasks 4, 6)
4. Two courses published under one `username.github.io` share browser storage and cache → each course's saved progress and offline cache are namespaced. (Task 7)
5. Markdown containing `<script>` or a `javascript:` link (content will later come from an AI reading untrusted uploads) → rendered as inert text / no clickable script link. (Task 9)

## Calls made

- Generated sites are public GitHub Pages sites, but learners do not need GitHub accounts; the later portal will publish repositories under the operator's GitHub account.
- Use the $10 recommended Mac mini option for the local model lane.
- `meta.number` accepts zero because the existing exam uses a lecture-shaped file with number `0`; numbered course lectures remain two-digit positive filenames.

---

### Task 1: Create the repo, the test setup and the baseline

**Files:**
- Create: `vitest.config.ts`, `scripts/snapshot-text.ts`, `tests/snapshot-text.test.ts`, `tests/baseline/pages.json`
- Modify: `package.json`, `.gitignore`

**Interfaces:**
- Produces: `snapshotText(outDir: string): Record<string, string>` — key = path of each `index.html` relative to `outDir` (forward slashes), value = visible text. CLI: `tsx scripts/snapshot-text.ts <outDir> --write <file>` and `tsx scripts/snapshot-text.ts <outDir> --compare <file>`.

- [x] **Step 1: Copy the source**

```bash
rsync -a --exclude .git --exclude node_modules --exclude .next --exclude out --exclude docs --exclude tsconfig.tsbuildinfo "/Users/Mutru001/Public/Study/Period 1 y2/DIS/playground-website/Data-intensive-systems/" "/Users/Mutru001/Public/Study/Period 1 y2/DIS/playground-website/playground-template/"
```

Then in `NEW`: `git init -b main`, `npm ci`, and set `"name": "playground-template"` in `package.json`. Ask the user to add the `NEW` folder to the session if file tools refuse to write there.

- [x] **Step 2: Add dev tools and scripts**

Run `npm i -D vitest tsx zod`. Add to `package.json` scripts: `"test": "vitest run"`. Create `vitest.config.ts` with: alias `@` → `./src`, automatic JSX runtime, test files `tests/**/*.test.{ts,tsx}`.

- [x] **Step 3: Write the failing test** in `tests/snapshot-text.test.ts`

```ts
// writes <tmp>/a/index.html = '<html><head><style>x{}</style><script>var s=1</script></head><body><h1>Hi</h1>\n  <p>two   words</p></body></html>'
it("keeps visible text only", () => {
  expect(snapshotText(tmp)).toEqual({ "a/index.html": "Hi two words" });
});
```

- [x] **Step 4: Run it** — `npm test` → FAIL (module not found).

- [x] **Step 5: Implement `snapshotText` and the CLI in `scripts/snapshot-text.ts`**

Remove `<script>…</script>` and `<style>…</style>` blocks, then all tags, then collapse whitespace and trim. `--compare` prints each differing key and ends with the line `N pages differ (M compared)`; exit code 1 when N > 0 or the key sets differ.

- [x] **Step 6: Run it** — `npm test` → PASS.

- [x] **Step 7: Record the baseline**

```bash
npm run build && npx tsx scripts/snapshot-text.ts out --write tests/baseline/pages.json
```

Expected: the file lists at least the home page, 12 lecture pages, `/exam`, `/expected` and `/difficult`.

- [x] **Step 8: Commit** — `git add -A && git commit -m "chore: start template from DIS playground, add test setup and text baseline"`

---

### Task 2: Content schemas

**Files:**
- Create: `src/content/schema.ts`, `scripts/content/schema-export.ts`, `schema/course.schema.json`, `schema/lecture.schema.json`, `schema/expected.schema.json`, `tests/schema.test.ts`, `tests/fixtures/minimal.ts`
- Modify: `package.json` (script `"schema": "tsx scripts/content/schema-export.ts"`)

**Interfaces:**
- Produces (all Zod schemas, every object `.strict()`): `courseSchema`, `lectureFileSchema`, `blockSchema`, `expectedFileSchema`; and types `Course`, `LectureFile`, `ExpectedTopic` via `z.infer`.
- Produces: `minimalCourse: Course`, `minimalLecture: LectureFile` in `tests/fixtures/minimal.ts` (used by Tasks 4 and 6).

Rules the schemas must encode (everything else mirrors today's `src/content/types.ts` field for field):

| Thing | Rule |
| --- | --- |
| Any `id`, `slug`, widget `type` | `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `course` | `{ id, title, shortTitle, description, language, indexable, overviewMd? }`; `id` is `^[a-z0-9][a-z0-9-]*$`; `language` is `^[a-z]{2,3}(-[A-Za-z0-9]+)*$`; `indexable` boolean, required |
| `lectureFile` | `{ meta, concepts, quiz, sections }`; `meta` is today's `LectureMeta` **without** `outline`; `sections` is `{ id, title, kind, blocks }[]`, at least one |
| `meta.number`, `meta.estimatedMinutes`, `figure.width`, `figure.height` | positive integers |
| quiz `options` | 2 to 6 |
| `blockSchema` | discriminated union on `kind` with today's kinds **except `interactive`**, plus `{ kind: "widget", type, title, description?, props? }` where `props` is a record of unknown values |
| `expectedFile` | array of today's `ExpectedTopic` (see `src/content/expected/index.ts`) |

- [x] **Step 1: Write the fixtures and failing tests**

`minimalCourse` = `{ id: "demo", title: "Demo", shortTitle: "Demo", description: "A demo course.", language: "en", indexable: false }`. `minimalLecture` = one lecture, `number: 1`, `slug: "intro"`, one concept `c1`, one quiz question `q1` with options `a`,`b` and `answerId: "a"`, one section `s1` holding a `prose` block and a `concepts` block with `ids: ["c1"]`.

```ts
it("accepts the minimal course and lecture", () => { expect(courseSchema.safeParse(minimalCourse).success).toBe(true); expect(lectureFileSchema.safeParse(minimalLecture).success).toBe(true); });
it("rejects an unknown block kind", () => { /* blocks: [{ kind: "video", url: "x" }] → success false */ });
it("rejects an extra key", () => { /* { kind: "prose", md: "x", html: "<b>" } → false */ });
it("rejects the old interactive kind", () => { /* { kind: "interactive", title: "x" } → false */ });
it("accepts a widget block without props", () => { /* { kind: "widget", type: "quorum-lab", title: "Quorum" } → true */ });
it("rejects a quiz question with one option", () => { /* → false */ });
it("rejects language 'English'", () => { /* → false */ });
```

- [x] **Step 2: Run** — `npm test` → FAIL.
- [x] **Step 3: Implement `src/content/schema.ts`.**
- [x] **Step 4: Run** — `npm test` → PASS.
- [x] **Step 5: Implement `scripts/content/schema-export.ts`** — writes the three files with `z.toJSONSchema(...)`, 2-space indent. Add a test `schema files are up to date` that regenerates in memory and compares with the files on disk.
- [x] **Step 6: Run** — `npm run schema && npm test && npm run lint` → PASS.
- [x] **Step 7: Commit** — `feat: content schemas and JSON Schema export`

---

### Task 3: Widget block and registry

**Files:**
- Create: `src/widgets/naming.ts`, `src/widgets/types.ts`, `src/widgets/manifest.ts`, `src/widgets/WidgetHost.tsx`, `tests/widgets.test.ts`
- Move: every `src/content/lectures/*/interactive/*.tsx` (25 files) and `src/content/exam/interactive/MockExam.tsx` → `src/widgets/dis/`
- Modify: `src/content/types.ts`, `src/components/content/BlockRenderer.tsx`, `src/lib/reviewData.ts`, `src/lib/assistant/lectureContext.ts`, the `sections.ts` files (import paths only)

**Interfaces:**
- Produces: `toWidgetType(componentName: string): string`
- Produces: `WIDGET_TYPES` (readonly tuple of the 26 type strings) and `type WidgetType = (typeof WIDGET_TYPES)[number]` in `src/widgets/types.ts`
- Produces: `widgetManifest: Record<WidgetType, { title: string; props: z.ZodType }>` in `manifest.ts` (imported by scripts only). Every widget's `props` is `z.object({}).strict()` for now.
- Produces: `WidgetHost({ type, props }: { type: string; props?: Record<string, unknown> })`, a client component. Its internal map is typed `Record<WidgetType, ComponentType>` so a missing entry is a compile error. Unknown `type` renders `<p role="alert">Unknown widget "…"</p>`.

- [x] **Step 1: Write the failing test**

```ts
it.each([["BPlusTreeLab", "b-plus-tree-lab"], ["TwoPhaseCommitSimulator", "two-phase-commit-simulator"], ["ErPipeline", "er-pipeline"], ["MockExam", "mock-exam"]])("%s → %s", (a, b) => expect(toWidgetType(a)).toBe(b));
it("lists one type per file in src/widgets/dis", () => { /* readdirSync names without .tsx, mapped through toWidgetType, sorted, equal [...WIDGET_TYPES].sort() */ });
it("manifest covers every type", () => expect(Object.keys(widgetManifest).sort()).toEqual([...WIDGET_TYPES].sort()));
```

- [x] **Step 2: Run** — FAIL.
- [x] **Step 3: Move the files with `git mv`, fix the `./interactive/X` imports in each `sections.ts` to `@/widgets/dis/X`, implement the four new files.** `WidgetHost` loads each component with `next/dynamic` so a page only downloads the widgets it shows.
- [x] **Step 4: Add the `widget` variant** to `Block` in `types.ts` (keep `interactive` for now), render it in `BlockRenderer` as `<InteractivePanel title description><WidgetHost type props /></InteractivePanel>`, and treat `widget` exactly like `interactive` in `reviewData.ts` and `lectureContext.ts`.
- [x] **Step 5: Run** — `npm test && npm run lint && npm run build` → PASS; then `npx tsx scripts/snapshot-text.ts out --compare tests/baseline/pages.json` → `0 pages differ`.
- [x] **Step 6: Commit** — `feat: widget block, registry and host`

---

### Task 4: Validator

**Files:**
- Create: `scripts/content/load.ts`, `scripts/content/validate.ts`, `tests/validate.test.ts`, `tests/fixtures/write-course.ts`
- Modify: `package.json` (script `"validate": "tsx scripts/content/validate.ts"`)

**Interfaces:**
- Consumes: schemas (Task 2), `widgetManifest` (Task 3), `minimalCourse`, `minimalLecture`.
- Produces:

```ts
export interface Problem { code: string; severity: "error" | "warning"; file: string; path: string; message: string; fix: string }
export interface LoadedCourse { course: Course | null; lectures: { file: string; data: LectureFile }[]; exam: LectureFile | null; expected: ExpectedTopic[]; problems: Problem[] }
export function loadCourse(contentDir: string): LoadedCourse          // load.ts: reads + parses + schema-checks
export function validateCourse(contentDir: string): Problem[]         // validate.ts: loadCourse problems + cross-checks
export function formatProblem(p: Problem): string                     // `${code} ${file} ${path}: ${message} Fix: ${fix}`
```

- Produces: `writeCourse(dir: string, parts?: { course?: unknown; lectures?: Record<string, unknown>; exam?: unknown; expected?: unknown; raw?: Record<string, string> }): void` in `tests/fixtures/write-course.ts`; defaults to the minimal course with `lectures/01-intro.json`.
- CLI: `tsx scripts/content/validate.ts [dir] [--strict]`; `dir` defaults to `process.env.CONTENT_DIR ?? "content"`. Prints one `formatProblem` line per problem, then `OK: N lectures, 0 errors, W warnings` or `FAILED: E errors, W warnings`. Exit 1 on any error, or on any warning with `--strict`.

Content folder layout: `course.json`, `lectures/<NN>-<slug>.json`, optional `exam.json` (lecture-file shape), optional `expected.json`, optional `figures/**`.

| Code | Condition | `file` / `path` |
| --- | --- | --- |
| E001 | file is not valid JSON | the file / `""` |
| E002 | `course.json` missing, or no file in `lectures/` | `course.json` or `lectures/` |
| E003 | schema violation, one problem per Zod issue | the file / issue path as `a.b[0].c` |
| E101 | duplicate: lecture slug, lecture number, section id, concept id, quiz question id (last three within one lecture) | second occurrence |
| E102 | `concepts` block names an unknown concept id | `sections[i].blocks[j].ids[k]` |
| E103 | quiz `answerId` is not one of its option ids | `quiz[i].answerId` |
| E104 | `widget.type` not in `widgetManifest` | `sections[i].blocks[j].type` |
| E105 | `widget.props` fails that widget's props schema | `sections[i].blocks[j].props` |
| E106 | `figure.src` file missing under `<contentDir>/figures/` | `sections[i].blocks[j].src` |
| E107 | lecture file name is not `<NN>-<slug>.json` for its `meta.number` (2 digits) and `meta.slug` | the file |
| E108 | a `select` check has an answer that is not among its options | path to `check.answer` |
| E109 | `expected.json` links to an unknown lecture slug | `[i].links[j].slug` |
| W201 | `md` of a `prose` or `info` block has more than 80 words | path to `md` |

Every `fix` is one imperative sentence telling an AI author what to change, e.g. E102: `Add a concept with id "x" to "concepts", or remove "x" from this block.`

- [x] **Step 1: Write the failing tests** — one test per code. Each builds a temp folder with `writeCourse`, breaks exactly one thing, and asserts `validateCourse(dir)` contains a problem with that `code` and the `file`/`path` from the table. Plus:

```ts
it("returns no problems for the minimal course", () => expect(validateCourse(dir)).toEqual([]));
it("E001 reports the file, not a crash", () => { /* raw: { "lectures/01-intro.json": "{ \"meta\": , }" } → [{ code: "E001", file: "lectures/01-intro.json", … }] */ });
it("W201 is a warning", () => { /* 81-word prose → severity "warning" */ });
```

- [x] **Step 2: Run** — FAIL.
- [x] **Step 3: Implement `load.ts`, `validate.ts` and the CLI.**
- [x] **Step 4: Run** — `npm test && npm run lint` → PASS.
- [x] **Step 5: Commit** — `feat: content validator with fixable error codes`

---

### Task 5: Convert the DIS course to JSON

**Files:**
- Create: `scripts/convert-dis.ts` (temporary), `examples/dis/course.json`, `examples/dis/lectures/*.json` (12), `examples/dis/exam.json`, `examples/dis/expected.json`
- Move: `public/figures/` → `examples/dis/figures/`

**Interfaces:**
- Consumes: `allLectures()` from `src/content/lectures.ts`, `examTraining` from `src/content/exam`, `expectedTopics` from `src/content/expected`, `toWidgetType`.
- Produces: the `examples/dis` content folder, valid under Task 4.

- [x] **Step 1: Write `scripts/convert-dis.ts`**

For each lecture write `examples/dis/lectures/<NN>-<slug>.json` (`NN` = `meta.number`, 2 digits) as `{ meta (without outline), concepts, quiz, sections }`, 2-space indent. Replace every `{ kind: "interactive", component, title, description }` by `{ kind: "widget", type: toWidgetType(component.name), title, description }`. Same shape for `exam.json`. Write `expectedTopics` to `expected.json`.

Run with `npx tsx scripts/convert-dis.ts`. If an import fails because a component touches `window` when loaded, run the same code as a Vitest test with the `jsdom` environment instead.

- [x] **Step 2: Write `examples/dis/course.json` by hand** — `id: "dis"`, `language: "en"`, `indexable: true`; `title` = the site title string in `src/app/layout.tsx`; `shortTitle` = `short_name` in `src/app/manifest.ts`; `description` = the metadata description in `layout.tsx`. Copy the strings exactly.

- [x] **Step 3: Move the figures** — `git mv public/figures examples/dis/figures`, add `/public/figures/` to `.gitignore`, then `cp -R examples/dis/figures public/figures` so the old build still works until Task 6.

- [x] **Step 4: Verify**

```bash
npx tsx scripts/content/validate.ts examples/dis
```

Expected last line: `OK: 12 lectures, 0 errors, W warnings` (any W). If there are errors, the schema is too strict for real content: loosen it, re-run `npm run schema`, record it under "Calls made". Do not edit content text.

- [x] **Step 5: Run** — `npm test && npm run lint` → PASS.
- [x] **Step 6: Commit** — `feat: DIS course as JSON example content`

---

### Task 6: Build content and switch the engine to it

**Files:**
- Create: `src/content/assemble.ts`, `scripts/content/build.ts`, `tests/assemble.test.ts`, `tests/build.test.ts`, `src/content/exam.ts`, `src/content/expected.ts`
- Rewrite: `src/content/types.ts`, `src/content/lectures.ts`, `src/content/registry.ts`
- Delete: `src/content/lectures/`, `src/content/exam/`, `src/content/expected/`, `scripts/convert-dis.ts`
- Modify: `package.json`, `.gitignore`, `src/widgets/dis/MockExam.tsx`, `src/lib/reviewData.ts`, `src/lib/assistant/lectureContext.ts`, `src/components/content/BlockRenderer.tsx`

**Interfaces:**
- Produces:

```ts
// src/content/assemble.ts (pure, no fs)
export function toLecture(file: LectureFile): Lecture            // adds meta.outline = sections.map(({ id, title, kind }) => ({ id, title, kind }))
export function toIndexEntry(lecture: Lecture): LectureIndexEntry // meta, concepts, quiz, exercises = sheets of all `exercises` blocks, in order
// scripts/content/build.ts
export function buildContent(contentDir: string, generatedDir: string, publicDir: string): Problem[]
```

- `buildContent` runs `validateCourse`. With any error it writes nothing and returns the problems. Otherwise it writes into `generatedDir`: `course.json`, `lectures.json` (`Lecture[]` sorted by number), `index.json` (`LectureIndexEntry[]`), `exam.json` (`Lecture` or `null`), `expected.json` (array, `[]` when absent); replaces `publicDir/figures` with a copy of `contentDir/figures`; returns the warnings.
- CLI `tsx scripts/content/build.ts`: uses `process.env.CONTENT_DIR ?? "content"`, `src/content/generated`, `public`; prints problems like the validator; exit 1 on errors.
- `package.json`: `"content": "tsx scripts/content/build.ts"`; `predev` and `prebuild` become `node scripts/copy-pglite.mjs && npm run content`. `.gitignore`: add `/src/content/generated/`.

- [x] **Step 1: Write the failing tests**

```ts
it("derives the outline from sections", () => expect(toLecture(minimalLecture).meta.outline).toEqual([{ id: "s1", title: minimalLecture.sections[0].title, kind: minimalLecture.sections[0].kind }]));
it("collects exercise sheets into the index entry", () => { /* lecture with one `exercises` block → toIndexEntry(...).exercises has that sheet */ });
it("writes the five generated files", () => { /* buildContent(minimal dir, gen, pub) → [] and the five files exist; exam.json is "null"; expected.json is "[]" */ });
it("writes nothing when content is invalid", () => { /* unknown widget type → returns a problem with code "E104"; gen dir has no lectures.json */ });
it("copies figures", () => { /* figures/a/x.png in content → pub/figures/a/x.png exists */ });
```

- [x] **Step 2: Run** — FAIL.
- [x] **Step 3: Implement `assemble.ts` and `build.ts`.**
- [x] **Step 4: Run** — `npm test` → PASS.
- [x] **Step 5: List what the old modules export** — run `grep -n "^export" src/content/registry.ts src/content/lectures.ts src/content/exam/index.ts src/content/expected/index.ts` and keep the output; every name must still exist after the next step.
- [x] **Step 6: Switch the engine**

- `types.ts`: every content type becomes `z.infer` of its schema using `import type` only; `Lecture` = `LectureFile` whose `meta` also has `outline`. Remove the `interactive` variant, `SectionBlocks` and the `ComponentType` import.
- `lectures.ts`, `registry.ts`, `exam.ts`, `expected.ts`: thin modules that import the generated JSON and export the same names as before (`exam.ts` exports `examTraining: Lecture | null`; `expected.ts` exports `expectedTopics`).
- `MockExam.tsx`: replace the `examQuiz` import with `examTraining?.quiz ?? []`.
- Remove the `interactive` cases from `BlockRenderer.tsx`, `reviewData.ts`, `lectureContext.ts`.
- Delete the old content folders and `scripts/convert-dis.ts`.

- [x] **Step 7: Verify no visible change**

```bash
CONTENT_DIR=examples/dis npm run build && npx tsx scripts/snapshot-text.ts out --compare tests/baseline/pages.json
```

Expected: `0 pages differ`. If only widget text is missing from pages, replace `next/dynamic` in `WidgetHost` with direct imports and record it under "Calls made".

- [x] **Step 8: Run** — `npm test && npm run lint` → PASS.
- [x] **Step 9: Commit** — `feat: engine reads generated JSON content`

---

### Task 7: Course settings from `course.json`, optional pages, storage namespacing

**Files:**
- Create: `src/content/course.ts`, `src/lib/storageKey.ts`, `tests/storage-key.test.ts`
- Modify: `src/app/layout.tsx`, `src/app/manifest.ts`, `src/app/exam/page.tsx`, `src/app/expected/page.tsx`, `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteFooter.tsx`, `src/components/home/CourseOverview.tsx`, `src/lib/assistant/prompt.ts`, `src/lib/theme.ts`, `src/lib/assistant/modelPreference.ts`, `src/lib/assistant/credentials.ts`, `src/hooks/useProgress.ts`, `src/hooks/useDifficult.ts`, `src/hooks/useExpected.ts`, `src/hooks/useExerciseState.ts`, `public/sw.js`

**Interfaces:**
- Produces: `course: Course` from `src/content/course.ts` (generated `course.json`).
- Produces: `makeStorageKey(courseId: string): (name: string) => string` returning `` `${courseId}:${name}` ``, and `storageKey = makeStorageKey(course.id)`.

Why: every site of one user is served from the same origin (`username.github.io/<repo>/`), and browser storage and caches are shared per origin.

- [ ] **Step 1: Write the failing test**

```ts
it("namespaces by course", () => { expect(makeStorageKey("dis")("progress")).toBe("dis:progress"); expect(makeStorageKey("bio")("progress")).not.toBe(makeStorageKey("dis")("progress")); });
```

- [ ] **Step 2: Run** — FAIL. **Step 3: Implement `storageKey.ts` and `course.ts`.** **Step 4: Run** — PASS.

- [ ] **Step 5: Replace hard-coded course details**

- Every `localStorage`/`sessionStorage` key in the hooks and libs listed above goes through `storageKey(...)`.
- `layout.tsx`: title and description from `course`; `<html lang={course.language}>`; when `course.indexable` is false add `robots: { index: false, follow: false }` to the metadata.
- `manifest.ts`: `name` and `short_name` from `course`.
- `SiteFooter`, `CourseOverview`, `prompt.ts`: no course-specific words in the code. A DIS-specific sentence moves, unchanged, into `examples/dis/course.json` (`description`, or `overviewMd` rendered with the `Markdown` component).
- `public/sw.js`: every cache name becomes `"playground:" + new URL(self.registration.scope).pathname + ":" + <old suffix>`.
- `/exam`: call `notFound()` when `examTraining` is null. `/expected`: `notFound()` when `expectedTopics` is empty. `SiteHeader` (and any home-page link) hides the link to a page that is absent.

- [ ] **Step 6: Verify**

```bash
grep -rniE "data intensive|\bDIS\b" src public/sw.js | grep -v "src/widgets/dis/" | grep -v "src/content/generated/"
```

Expected: no output.

```bash
CONTENT_DIR=examples/dis npm run build && npx tsx scripts/snapshot-text.ts out --compare tests/baseline/pages.json
```

Expected: `0 pages differ`.

- [ ] **Step 7: Run** — `npm test && npm run lint` → PASS.
- [ ] **Step 8: Commit** — `feat: course settings from course.json, optional exam pages, namespaced storage`

---

### Task 8: Starter content and the default content folder

**Files:**
- Create: `content/course.json`, `content/lectures/01-how-this-site-works.json`, `materials/.gitkeep`, `tests/content.test.ts`
- Modify: `package.json`, `.gitignore`, `README.md`

**Interfaces:**
- Produces: `npm run dev` / `npm run build` use `content/`; `npm run dev:dis` / `npm run build:dis` use `examples/dis` (`CONTENT_DIR=examples/dis npm run dev|build`).

- [ ] **Step 1: Write the failing test**

```ts
it("starter content is valid with no warnings", () => expect(validateCourse("content")).toEqual([]));
it("DIS example has no errors", () => expect(validateCourse("examples/dis").filter((p) => p.severity === "error")).toEqual([]));
```

- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Write the starter content**

`course.json`: `{ "id": "my-course", "title": "My course", "shortTitle": "My course", "description": "Replace this with your own course.", "language": "en", "indexable": false }`. The lecture: `number: 1`, `slug: "how-this-site-works"`, three sections, and between them one each of `prose`, `info`, `concepts`, `steps`, `table`, `recall`, `list`; two concepts; two quiz questions. It explains to a new author how lectures, sections and blocks fit together. Every prose block is 80 words or fewer. No `exam.json`, no `expected.json`, no figures.

- [ ] **Step 4: Add the scripts, ignore `/materials/*` except `.gitkeep`, rewrite `README.md`** — sections: what this template is; folder map (`content/`, `examples/`, `materials/`, `schema/`, `src/`); commands (`dev`, `build`, `validate`, `test`, `schema`, `dev:dis`); the rule "to make a course you only edit `content/`; never `src/`".
- [ ] **Step 5: Run** — `npm test && npm run lint && npm run build` → PASS, and `out/exam/index.html` shows the not-found text.
- [ ] **Step 6: Commit** — `feat: starter content and default content folder`

---

### Task 9: Markdown safety and final check

**Files:**
- Create: `tests/markdown-safety.test.tsx`
- Modify (only if a test fails): `src/components/content/Markdown.tsx`

- [ ] **Step 1: Write the tests**

```tsx
// html = renderToStaticMarkup(<Markdown>{src}</Markdown>)
it("does not render raw HTML", () => { /* src: 'Hello <script>alert(1)</script> <img src=x onerror=alert(1)>' → html has no "<script" and no "<img" */ });
it("drops javascript: links", () => { /* src: '[x](javascript:alert(1))' → html does not contain "javascript:" */ });
it("keeps normal links", () => { /* src: '[x](https://example.org)' → html contains 'href="https://example.org"' */ });
```

- [ ] **Step 2: Run** — expected PASS already (react-markdown's defaults). If one fails, fix `Markdown.tsx` without adding `rehype-raw`, and re-run.

- [ ] **Step 3: Full check**

```bash
npm run lint && npm test && npm run build && npm run build:dis && npx tsx scripts/snapshot-text.ts out --compare tests/baseline/pages.json
```

Expected: all pass, last line `0 pages differ`.

- [ ] **Step 4: Commit** — `test: markdown safety`
- [ ] **Step 5: Update `DIS/docs/superpowers/NEXT.md`** — tick queue item 1 under "Current position", name item 2 as next. Report to the user: what exists in `NEW`, the output of Step 3, and the "Calls made" list.
