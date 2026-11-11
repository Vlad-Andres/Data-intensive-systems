# Standardised Learning Playground — plan for review

Date: 2026-11-10 · Status: **draft, waiting for your review** · Nothing is built yet.

How to read this: section 1 is the short version. Section 9 lists the decisions only you can
make. Everything marked **(my call)** is a choice I made that you can overrule. Numbers marked
**(estimate)** are mine and get measured in Phase 0. Prices and free-tier limits come from
third-party comparison sites that disagree with each other, so treat them as indicative.

---

## 1. The short version

| | |
| --- | --- |
| **What** | Upload course material → get your own interactive study website, live on GitHub Pages, editable by chat. |
| **Position** | "Brilliant-style interactive lessons, built from *your* course, that you own and can share." |
| **Biggest change to your plan** | The AI writes **content as validated data**, not code. A fixed engine renders it. This is what makes cheap models, security and "any low-effort agent" all work. |
| **Biggest risk in your plan** | Free GitHub accounts can only publish Pages from **public** repos, so every generated site (built from someone's lecture slides) is public. Needs a decision (9.2). |
| **Free generation** | A cheap paid model costs roughly **$0.20–0.30 per course (estimate)**. Free tiers and the Mac mini work as a fallback lane, not as the main engine. |
| **Order of work** | 0 Spikes → 1 Template → 2 Generator (CLI) → 3 Portal → 4 Edit loop → 5 Launch → 6 Plans |

---

## 2. Competitors and where the gap is

| Product | What it does from an upload | Weak spot we can use |
| --- | --- | --- |
| NotebookLM (Google) | Flashcards, quizzes, study guide, audio overview; free | Reviewed as not scheduling cards (no spaced repetition); lives inside Google's app |
| YouLearn | Notes, flashcards, quizzes, practice tests, podcast, tutor chat | Free plan limited (3 uploads/day reported); generic output |
| Turbo AI, StudyFetch, Knowt | Notes, flashcards, quizzes, tutor from PDFs/recordings | Same generic formats for every subject |
| Quizlet | Flashcard sets from PDFs | AI features behind the paid plan |
| Oboe | Chapter-based course from a *prompt* ($16M from a16z, Dec 2025) | Starts from a topic, not from your course material |
| Brilliant | Hand-made interactive visual lessons | Fixed catalogue; cannot take your course |
| Khanmigo | Socratic tutor | Tied to Khan content |

None of the products found builds a standalone website, and none adapts the *way* it teaches to
the subject. That is the gap.

### Killer features to focus on

| # | Feature | Why it wins |
| --- | --- | --- |
| 1 | **Subject-aware interactive visuals** (domain packs, section 4) | Everyone else gives the same flashcards for geometry and for history |
| 2 | **You own it**: a real URL, works offline, readers need no account, no paywall | Others are walled apps |
| 3 | **Share with your class**: one student generates, thirty use it; footer "Make your own" | Free growth loop no competitor has |
| 4 | **Exam mode**: upload past exams → "expected at exam" board, mock exam, last-day prep, difficult-parts review | Already built in the DIS site; nobody else has it |
| 5 | **Built-in spaced repetition and gamification** (section 5) | NotebookLM's reported gap |
| 6 | **Source-grounded**: every block cites slide/page; nothing invented | Wrong answers are the top complaint about study apps |
| 7 | **Edit by chat** ("make lecture 3 shorter, add more practice") | Git history gives undo for free |

### Settings the upload wizard should offer

| Setting | Options |
| --- | --- |
| Output language | Detected from material; user can pick another |
| Level | School · University · Professional |
| Depth | Cram sheet · Standard · Deep |
| Exam date | Drives the study plan and review schedule |
| Exam format | Multiple choice · Open questions · Problem solving · Oral |
| Past exams | Optional upload → exam mode |
| Look | Site name, accent colour, light/dark default |
| Figures | Include original figures from the slides: yes/no |
| Visibility | Hidden from search engines by default **(my call)** |
| Outline review | User sees and edits the generated outline *before* full generation — saves tokens, raises quality **(my call)** |

---

## 3. Architecture

```
 Browser (portal)                Backend (holds all keys)                 Operator's GitHub
 ───────────────                 ────────────────────────                 ─────────────
 upload wizard  ──files──▶  store upload ─▶ job queue
 dashboard      ◀─status──  pipeline:                                     repo created from
 chat-to-edit               ingest → detect domain → outline              template (GitHub App)
                            → generate per lecture → validate/repair ──▶  commit content/*.json
                                                                          to a repo in the operator's account
                                      │                                   Actions builds (no
                            model adapters:                               secrets) → Pages URL
                            cheap API ▸ free tiers ▸ Mac mini (pull)  ◀── deploy status
                            notify user (email + dashboard)
```

### 3.1 Three repositories **(my call)**

| Repo | Visibility | Contents |
| --- | --- | --- |
| `playground-template` | Public, marked as GitHub template | Engine, widget library, domain packs, schemas, validator, agent guide, example courses |
| `playground-gen` | Public | The generation pipeline as a CLI + library. Reads prompts and schemas *from the template* so there is one source of truth |
| `playground-portal` | Private | Landing page, portal UI, backend, deployment config |

### 3.2 Content as data (the key refactor)

Today each DIS lecture is TypeScript plus hand-written React labs (about 12,000 lines across 12
lectures). A cheap model cannot write that reliably, and code written by an AI from untrusted
uploads is a security problem.

| Today (DIS) | Template |
| --- | --- |
| `sections.ts` with component imports | `content/lectures/<slug>.json`, no code |
| Bespoke lab per lecture (`BPlusTreeLab.tsx`) | Widget from a library, configured by JSON: `{ "kind": "widget", "type": "function-plot", "props": {…} }` |
| TypeScript types catch mistakes | Zod schemas → JSON Schema; `npm run validate` gives exact, fixable error messages |
| Manual registry edits | Engine discovers `content/` automatically |
| Course details hard-coded | `content/course.json` (name, language, domain packs, theme, exam date) |

Escape hatch: `custom/` holds hand-written or premium-model components, loaded in a sandboxed
iframe. Off in the free tier.

The existing block kinds (`prose`, `info`, `concepts`, `formula`, `code`, `table`, `figure`,
`steps`, `timeline`, `list`, `exercises`, `recall`, `practice`) carry over unchanged. The 25 DIS
labs become the first entries of the widget library where they generalise (quorum, hashing,
clustering) and stay in the DIS example course where they don't.

### 3.3 Two ways to use the template

| Mode | Who | How |
| --- | --- | --- |
| **Agent mode** | Anyone with Claude Code, Cursor, Codex, etc. | Clone template, drop files in `materials/`, tell the agent "follow AGENTS.md" |
| **Portal mode** | Non-technical users | Portal runs the same steps through `playground-gen`; generated repos and Pages sites are owned by the operator's GitHub account |

Agent guide layout (written so a weak model can follow it):

```
AGENTS.md                      ≤ 150 lines: the 8 steps, the rules, where to look
docs/agent/
  01-ingest.md                 turn materials into text + figures
  02-detect-domain.md          decision table → domain pack(s)
  03-outline.md                course.json + lecture outline
  04-write-lecture.md          section recipe, block-by-block
  05-validate.md               run validator, fix by error code
  blocks/<kind>.md             one page per block: when to use, schema, good + bad example
  widgets/<type>.md            one page per widget, same shape
  domains/<pack>.md            teaching recipe per domain
examples/<domain>/             one complete golden course per domain pack
```

Rules that make it low-effort: every step has a checklist and a "done when" line; every schema has
a copy-paste example; the validator's errors say what to change; the agent never edits `src/`.

### 3.4 Pipeline steps

| Step | Input → output | Model needed |
| --- | --- | --- |
| 1 Ingest | PDF/PPTX/DOCX/MD/images → text per page + extracted figures. Text extraction runs **in the browser** where possible (smaller uploads, more private) | None; vision model only for scans |
| 2 Detect domain | Text sample → domain pack(s), language, level. Per lecture, so a mixed course works | Cheapest |
| 3 Outline | All text → `course.json` + lecture list + section outline. **User reviews.** | Mid |
| 4 Generate | One lecture at a time → lecture JSON, with source page refs | Cheap, schema-constrained output |
| 5 Validate & repair | Schema check, source-ref check, answer-key check; send errors back, max 2 repairs, then drop the failing block | Cheap |
| 6 Publish | Commit to user repo → Actions build → Pages | None |
| 7 Notify | Email + dashboard + link | None |

Edits (step "chat-to-edit") reuse steps 4–7 on only the touched files and can change `content/`
only, never engine code or workflows.

### 3.5 Backend hosting **(my call)**

Cloudflare Workers free plan: Workers (API + OAuth), D1 (users, jobs), R2 (uploads, auto-deleted
after generation), a queue/workflow for long jobs. Exact free limits to confirm in Phase 0.
Fallback if the limits don't fit: a small VPS (~€5/month).

About "keys in git secrets": GitHub Actions secrets are right for **deploying** the backend. At
run time the key must live in the backend's secret store, because a job in a *user's* repo can
read any secret given to it. So the key never goes near user repos.

---

## 4. Domain packs

The detector picks one or more packs per lecture. Each pack = a teaching recipe + preferred
widgets + practice style.

| Pack | Detected by | Signature widgets | Practice style | v1? |
| --- | --- | --- | --- | --- |
| **Core** (always on) | — | Flashcards, cloze, match game, concept map, quiz, timeline, table | Recall + quiz | ✅ |
| **Math** | Formula density, theorem/proof words | Function plotter, geometry canvas (draggable points), step-by-step derivation, number line, matrix visualiser | Randomised problems with worked solutions | ✅ |
| **Computer science** | Code blocks, algorithm names | Code runner (SQL etc. already built), algorithm stepper, data-structure visualiser, state machine | Predict-the-output, trace tables | ✅ (from DIS) |
| **Memorise-heavy** (medicine, biology, anatomy) | Dense terminology, labelled diagrams | Label-the-diagram (image occlusion), clinical case stepper, classification tree, mnemonic cards | Heavy spaced repetition, case vignettes | ✅ |
| **Humanities** (history, literature) | Dates, people, quotations | Timeline, map, character/relationship graph, cause→effect chain, annotated passage | Who-said-it, order-the-events, essay plans | ✅ |
| **Chemistry** | Formulas, reaction arrows | Molecule viewer, periodic table, equation balancer, reaction pathway | Balance/predict-product drills | Phase 5+ |
| **Physics** | Units, laws | Parameter-slider simulations, vector diagrams, unit checker | Numeric problems with unit checking | Phase 5+ |
| **Languages** | Vocabulary lists, grammar tables | Conjugation drill, audio (browser speech), sentence builder | Spaced vocabulary, listening | Phase 5+ |
| **Law / business** | Cases, frameworks | Case brief card, framework canvas, decision tree | Apply-the-rule scenarios | Later |

Five packs in v1 **(my call)**: Core, Math, CS, Memorise-heavy, Humanities. They cover the widest
range of learning styles with the fewest widgets, and CS is nearly free because DIS already has it.

---

## 5. Learning methods built into every site

| Method | Evidence | How it shows up |
| --- | --- | --- |
| Retrieval practice | Rated highest utility (Dunlosky et al. 2013) | Question first, answer hidden; quiz after each section; recall cards |
| Spaced repetition | Rated highest utility; one of the most replicated findings | Review queue with scheduling, driven by exam date |
| Interleaving | Moderate→high | "Mixed review" pulls from several lectures |
| Dual coding (words + visuals) | Well supported (Weinstein et al. 2018) | Every concept needs a visual or a widget; the validator enforces a text-length cap per block |
| Worked examples → faded practice | Well supported | `steps` block, then the same problem with steps removed |
| Elaboration | Moderate | "Why?" prompts, explain-in-your-own-words with self-rating |
| Gamification | Small-to-moderate positive effects in meta-analysis (Sailer & Homner 2020, from memory — verify) | Streak, XP, mastery ring per lecture, daily goal, badges, "boss fight" mock exam |

Rules for "less text": max ~80 words per prose block, one idea per card, a visual every screen,
progress visible at all times. Enforced by the validator, not left to the model's taste.

All progress stays in the reader's browser (as now). Class leaderboards need a backend → Phase 6.

---

## 6. Models and the Mac mini

### 6.1 What one course costs (estimate)

A 12-lecture course ≈ 0.8M input tokens + 0.25M output tokens across outline, generation and repair.

| Option | Reported price (in / out per 1M) | Per course (estimate) | Notes |
| --- | --- | --- | --- |
| DeepSeek (off-peak) | ~$0.15 / $0.60 | ~$0.27 | Peak hours reported at double |
| Budget tier of OpenAI / Anthropic | ~$0.10 / $0.50 (sources disagree on names and prices) | ~$0.21 | Strong structured output |
| Gemini 3.8 Flash (paid) | ~$0.75 / $3.75 | ~$1.50 | Good for the outline step and paid plans |

So **$20 buys roughly 70–100 courses** on the cheap tier. That is the realistic "free for users" budget.

### 6.2 Free tiers (limits reported Oct–Nov 2026; they change often)

| Provider | Reported free limit | Courses/day (estimate) | Catch |
| --- | --- | --- | --- |
| Gemini Flash-Lite | ~500 requests/day | ~8 | Prompts may be used for training. Google's terms have required paid service for apps offered to EU/UK users — **verify before use** |
| Gemini Flash | ~20 requests/day | <1 | Too small |
| OpenRouter `:free` models | 50/day; 1,000/day after buying $10 credit once | ~15 | Model list churns; quality varies |
| Groq | 1K requests/day, 200K tokens/day per model | <1 per model | Token cap is below one course |
| Mistral | ~$10/month free credit | a few per month | Prompts may train unless opted out |
| GitHub Models | Retired July 2026 | — | — |

Free tiers are useful as a **fallback chain**, not a foundation: small limits, frequent changes,
and users' course material being used for training.

### 6.3 Local model on the Mac mini

The machine this session runs on is an **M4 Mac mini with 16 GB**. Use the $10 recommended option
for the local lane for now:

| Question | Answer |
| --- | --- |
| What fits? | Models up to roughly 14B parameters at 4-bit. A 20B model is listed at ~14 GB, which leaves nothing for the system |
| Can it do the job? | Schema-constrained JSON generation: probably yes, with lower quality. Agentic coding: no |
| How fast? | No benchmark found for 16 GB. At an assumed ~20 tokens/s, one course ≈ 3.5 hours → **5–7 courses/day, one at a time** (estimate) |
| How does it connect safely? | It **pulls** jobs from the cloud queue over an outbound connection. No open ports at home, and it never holds the cloud API key |
| Best use | Overnight overflow lane, and translation (small local models translate well) |

### 6.4 Recommendation **(my call)**

1. **Main lane:** one cheap paid model behind a provider adapter, with a hard monthly spend cap at the provider.
2. **Fallback lane:** OpenRouter free (after the one-off $10) → Mac mini queue ("ready in a few hours").
3. **Pick the actual model in Phase 0** by running the same four sample lectures through 4–5 candidates and scoring them against the hand-built DIS site.
4. Adapters make the later paid plans a config change: better model, same pipeline.

---

## 7. Languages

| Layer | Approach | Cost |
| --- | --- | --- |
| Site interface (buttons, labels) | Translation files shipped in the template for ~10 languages, translated once | None per site |
| Course content | Generated **directly in the chosen language** — better than translating afterwards | None extra |
| Extra languages for the same site | Translate the content JSON on the Mac mini lane or cheap model; one extra language ≈ the output cost again | Limited to 1 language in the free tier **(my call)** |
| Reader wants another language on the fly | Chrome/Edge built-in on-device Translator API where available (desktop only); otherwise the browser's own page translate | Free, progressive enhancement |
| Portal itself | Same translation files | None |

Public "free translator" web services were not chosen: they need keys or self-hosting and have
small quotas, while the three layers above cover the need without them.

---

## 8. Security

| Threat | Defence |
| --- | --- |
| API key leaks | Keys only in the backend secret store. Never in the browser, user repos, user-repo Actions, logs or generated sites. Separate keys per environment; rotation procedure written down |
| Someone drains the key (cost attack) | Hard spend cap at the provider · per-user quota (e.g. 1 course/day, 10 edits/day) · global daily budget switch that pauses the queue · upload size/page limits · bot check on submit · GitHub account-age check |
| Prompt injection inside uploaded files | The model has no tools, no network, no secrets — the worst it can do is write bad content. Output must pass the schema; Markdown renders with raw HTML off; links limited to http(s); strict Content Security Policy in the template (already in DIS) |
| Malicious edit requests | Edits can only produce changes under `content/`; anything touching `src/` or `.github/` is rejected by the backend before commit |
| Over-broad GitHub access | GitHub App (not a classic OAuth app) with the minimum permissions: Contents, Pages, Administration (needed to create the repo and enable Pages), Metadata. Short-lived tokens, never stored in the browser |
| Malicious uploads | Type and size checks, parse in an isolated worker, never execute anything, delete raw uploads after generation |
| Home machine exposure | Mac mini is outbound-only and holds only a revocable worker token |
| Private data | Store GitHub id + email only; raw uploads deleted after the job; privacy page; EU hosting region where offered |
| Reader-side AI chat in generated sites | Stays bring-your-own-key as in DIS; your key is never embedded |
| Supply chain | Lockfile, pinned Action versions, Dependabot, secret scanning on all three repos |

A security review of the portal is a required gate before Phase 5 (launch).

---

## 9. Decisions I need from you

| # | Decision | My recommendation | Why it matters |
| --- | --- | --- | --- |
| 9.1 | **Must users have a GitHub account?** | **Decided 2026-11-10: no.** The portal publishes generated sites into repositories owned by the operator's GitHub account. | Learners should not need to understand code or manage GitHub. Central ownership makes publishing simple, but creates operator responsibility for storage, takedowns, quotas and account continuity |
| 9.2 | ~~Public by default is unavoidable on free GitHub — acceptable?~~ **Decided 2026-11-10: yes, public is fine.** | Safeguards below are still my call, not yet confirmed: consent tick-box ("I may share this material"), hidden from search engines by default, raw uploads never committed, a takedown contact | Lecture slides are usually the lecturer's copyright. Private Pages needs a paid GitHub plan |
| 9.3 | **Is ~$10–20/month acceptable** instead of strictly $0? | Yes | Strictly $0 means free tiers + Mac mini only: ~10–20 courses/day, slower, lower quality, and users' material may train third-party models |
| 9.4 | **Which domain packs in v1?** | Core, Math, CS, Memorise-heavy, Humanities | Each extra pack is roughly a week of widget work |
| 9.5 | **Is the template open source?** | Yes (MIT) | It must be public to be a template for users' repos anyway; open source also helps trust and growth |
| 9.6 | **Product name and domain** | You choose | Needed before the landing page and the GitHub App are registered |
| 9.7 | **Is this machine (M4, 16 GB) the Mac mini?** | **Decided 2026-11-10: yes. Use the $10 recommended option for now.** | Sets what the local lane can do |

---

## 10. Phases

Durations assume one person plus AI agents, part-time **(estimate)**.

| Phase | Goal | Main deliverables | Done when | Est. |
| --- | --- | --- | --- | --- |
| **0 Spikes** | Remove the three biggest unknowns | (a) GitHub App: create repo from template in a test account, enable Pages, push, get URL — by script. (b) Model bake-off: 4 sample lectures (2 DIS, 1 math, 1 history) × 4–5 models incl. local; score quality, validity rate, cost, time. (c) Confirm backend free-tier limits and provider terms for EU users | Written results; model and hosting chosen; go/no-go | 1 wk |
| **1 Template** | A repo any agent can fill | Extract engine from DIS · JSON content model + schemas + validator · widget library v1 · 5 domain packs · spaced repetition + gamification · interface translations · agent guide · golden example per pack · DIS ported to JSON as regression test | A fresh agent session, given only the template and a new PDF, produces a valid deployed site without help | 3–4 wk |
| **2 Generator** | The pipeline, without a portal | `playground-gen` CLI: ingest → detect → outline → generate → validate/repair · provider adapters (API + Ollama) · quality test set with scores | `npx playground-gen ./materials` yields a site that passes validation and the quality bar for all 5 packs | 2–3 wk |
| **3 Portal MVP** | Non-technical users can do it | Portal authentication · upload wizard · outline review · job queue + progress · repo creation + deploy · email/dashboard notification · quotas + budget switch | A new user goes from upload to live URL with no help | 3–4 wk |
| **4 Edit loop** | Change it any time | Chat-to-edit · regenerate one lecture · add material later · version list with undo | An edit request is live in minutes and can be undone | 2 wk |
| **5 Launch** | Public and safe | Landing page + gallery of example sites · portal translations · security review · privacy/terms/takedown pages · monitoring and cost dashboard | Review findings fixed; first outside users | 2 wk |
| **6 Plans** | Sustainable | Paid plans (better models, more languages, custom widgets, private hosting) · payments · Mac mini lane · class features (shared progress, leaderboard) · more packs | — | later |

A waiting-list landing page can go up during Phase 1 if you want early interest **(my call: optional)**.

### Left to the builder

Widget implementation libraries, exact schema field names, backend table layout, queue technology,
email provider, test framework — to be settled in each phase's implementation plan.

### Not in scope

Native mobile apps · live video/audio lecture transcription (Phase 6 at earliest) · teacher
dashboards and grading · hosting users' sites ourselves (see 9.1) · any feature that needs the
generated site to call our backend.

---

## Sources

Competitors: [Engadget on NotebookLM flashcards/quizzes](https://www.engadget.com/apps/notebooklm-can-now-test-your-knowledge-with-flashcards-and-quizzes-183351007.html) ·
[NotebookLM flashcards explained](https://bibigpt.co/features/notebooklm-flashcards-quizzes-explained) ·
[TechCrunch on Oboe](https://techcrunch.com/2025/12/10/oboe-raises-16-million-from-a16z-for-its-ai-powered-course-generation-platform/) ·
[YouLearn 2026 comparison (vendor-written)](https://www.youlearn.ai/blogs/best-ai-study-tools-students-2026) ·
[Dupple: 9 best AI study tools](https://dupple.com/learn/best-ai-study-tools) ·
[1-star review analysis](https://unstar.app/blog/tag/quizlet)

Pricing and free tiers: [BenchLM pricing](https://benchlm.ai/llm-pricing) ·
[Hokai cheapest LLM API](https://hokai.io/guides/cheapest-llm-api-2026) ·
[Techiehub cheapest AI API](https://techiehub.blog/cheapest-ai-api/) ·
[Gemini free tier limits](https://imisofts.com/blog/gemini-api-free-tier-limits/) ·
[Gemini rate limits](https://www.scriptbyai.com/gemini-api-rate-limits/) ·
[OpenRouter pricing](https://openrouter.ai/pricing) ·
[OpenRouter free tier limits](https://klymentiev.com/blog/openrouter-free-tier) ·
[OpenRouter: free LLM APIs compared](https://openrouter.ai/blog/tutorials/free-llm-apis-compared/) ·
[Free LLM tiers, Oct 2026](https://dev.to/tariqnasser/free-llm-api-tiers-in-october-2026-whats-left-and-how-i-chain-them-227l)

Local models: [Best local LLMs for Mac mini](https://analyticsvidhya.com/blog/2026/09/best-local-llms-mac-mini-2026) ·
[MLX local LLMs on Apple Silicon](https://bestllmfor.com/guides/mlx-local-llm-apple-silicon/) ·
[Local LLMs on Mac mini M4](https://toolhalla.ai/blog/best-local-llms-mac-mini-m4-2026)

Learning science: [Weinstein et al., six strategies](https://cognitiveresearchjournal.springeropen.com/articles/10.1186/s41235-017-0087-y) ·
[Firth on Dunlosky's list](https://firth.substack.com/p/jonathan-firth-s-memory-metacognition-updates-15-dunlosky-et-al-s-list-of-strategies-1347143)

Platform: [Chrome Translator API](https://developer.chrome.com/docs/ai/translator-api?hl=en) ·
[GitHub: choosing permissions for a GitHub App](https://docs.github.com/es/github-ae@latest/apps/creating-github-apps/setting-up-a-github-app/choosing-permissions-for-a-github-app)

---

## Amendments 2026-11-11

These override earlier sections where they differ. Reasons are in
`docs/superpowers/reviews/2026-11-11-review.md`; tasks are in
`docs/superpowers/plans/2026-11-11-iteration-2.md`.

| Topic | Earlier | Now |
| --- | --- | --- |
| Repositories (§3.1) | Three repos, generator in its own `playground-gen` | Two repos. The generator, schema, widget catalogue and validator live in `playground-template/core/` (pure TypeScript). The portal keeps a committed copy in `vendor/core/` |
| Backend hosting (§3.5) | Cloudflare Workers | Vercel (already deployed), with a private Vercel Blob store for job files |
| Ingest (§3.4 step 1) | Text extraction in the browser "where possible" | Always in the browser. The server never receives a PDF. Scanned PDFs are refused for now |
| Long jobs (§3) | A job queue | Step-driven jobs: one step per request, driven by the open job page, each step claimed atomically |
| Model output (§3.4) | Schema-constrained output | JSON mode, then validation block by block, one repair attempt, then drop |
| Who owns generated sites (§9.1) | User's GitHub account | Decided by the user: the operator's GitHub account or organisation. Learners need no account |
| Access during beta (§8) | Per-user quotas with sign-in | An access code, a daily job limit and a per-job token budget. Sign-in comes later |
| Preview | Not specified | No second renderer. A finished job gives a published site, or a course bundle that the template imports |
| Source figures | In v1 | Moved to the backlog after iteration 2 |

## Amendments 2026-11-11 (b) — hosting and custom components

Decided by the user on 2026-11-11, after iteration 2. These override the table above where they differ.

| Topic | Before | Now |
| --- | --- | --- |
| Where generated sites live | One public GitHub repo per site, built by GitHub Pages | **The portal renders every course itself**, on Vercel, at `/courses/<course-key>/` where `<course-key>` = `<course-slug>-<first 8 hex of the job id>`. Published course data is stored in the portal's private Blob store and kept until taken down. No repo per site, no GitHub token needed |
| Renderer | The template app, built per site | The **same template components**, shared with the portal (one renderer, two hosts: the template's static export and the portal's `/courses/` routes). Content is passed in at runtime instead of imported at build time |
| What the model decides | Structure from a fixed menu (block kinds, widgets) | Unchanged and widened: lecture split, sections, block kinds, widgets and their settings, plus a model-composed course home page. When no catalogue widget fits, the model **may write a custom component** |
| Custom components | Not allowed (no model-written code) | Allowed as a `custom` block: one self-contained HTML document (HTML, CSS, inline JS). It runs **only** in an `<iframe sandbox="allow-scripts">` (opaque origin) served from a portal route whose CSP forbids all network access; it talks to the page only through `postMessage`. Checked at generation (size, static scan), self-reports errors at runtime, and is previewed by the user at review, who can remove it. At most 1 per lecture at standard depth, 2 at deep, none at cram |
| Code execution | SQL, Cypher, Gremlin runners in the DIS course only | A catalogue widget `code-runner` (not model-written) that runs learner code in the browser for a fixed list of languages, using existing open-source runtimes, inside the same sandbox. Languages are chosen by a spike; C and Python are the target, Pascal if a maintained runtime exists |
| Hosting costs and terms | GitHub Pages (free) | Vercel: course pages are cached; Hobby plan is non-commercial only, so paid plans need Vercel Pro |
| Takedown | Delete the repo | Delete `courses/<course-key>/` (admin script) |
