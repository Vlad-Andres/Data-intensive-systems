# Agent Guide and PDF-to-Playground Proof

## Goal

Make the template usable by a general coding agent: given course material in `materials/`, the
agent can extract a source-grounded course, choose an appropriate structure, write validated JSON,
and build the site without adding executable course code. Prove the workflow with the supplied
`Lecture_01-Introduction-2026-2.pdf`.

## Scope

Work only in `playground-template`, except for updating `docs/superpowers/NEXT.md` and this plan
in the DIS documentation hand-off. Do not create a GitHub repository, remote, portal, API key,
or deployment.

## Deliverables

- `AGENTS.md`: a short, ordered workflow with completion checks and pointers to detailed docs.
- `docs/agent/01-ingest.md`: PDF/text/figure intake and provenance rules.
- `docs/agent/02-detect-domain.md`: domain-pack decision table and the rule that course content
  determines which sections, widgets, quizzes, exercises, and optional pages exist.
- `docs/agent/03-outline.md`: course metadata and lecture/section planning.
- `docs/agent/04-write-lecture.md`: source-grounded JSON writing recipe with block selection rules.
- `docs/agent/05-validate.md`: validation, repair loop, and exact commands.
- `docs/agent/blocks/`: concise references for each supported block family, including schemas,
  when to use them, and valid examples.
- `docs/agent/proof/`: the reproducible input/output record for the supplied PDF, without
  committing the original PDF or any credentials.
- Tests or fixtures only where they protect the guide's documented contract.

## Execution order

1. Inspect the PDF and the existing schema, validator, widget manifest, and build commands.
   Record the PDF's page count, extracted text availability, figures/formulas, and a compact
   source map. Done when the proof can identify where every generated section came from.
2. Write `AGENTS.md` as the always-loaded recipe. Keep it below 150 lines. Every step ends with
   a checkable completion criterion; branch-specific detail belongs behind a pointer.
3. Write the detailed agent docs and block references. They must describe the actual repository
   interface, not hypothetical generator features. Done when every supported block kind has one
   authoritative reference and the recipe has no undocumented required decision.
4. Run the workflow manually against the supplied PDF: place only a copy or extracted working
   files in an ignored proof workspace, create a fresh course under a proof content directory,
   and preserve source references in generated content where the schema supports them.
5. Run `npm run validate <proof-content-dir>`, `npm test`, `npm run lint`, and
   `CONTENT_DIR=<proof-content-dir> npm run build`. Fix all errors. Warnings require an explicit
   decision recorded in the proof.
6. Verify the proof output is generic: no DIS-specific assumptions, no TypeScript/React course
   code, no executable content, and optional exam/expected files are absent unless the source
   supports them.
7. Update `NEXT.md`: mark queue item 2 complete only after the proof passes, and identify model
   bake-off as the next queue item. Commit locally in `playground-template`; never push.

## Acceptance criteria

- A fresh agent can follow `AGENTS.md` and reach a valid build from the supplied PDF without
  needing undocumented repository knowledge.
- The proof content passes validation with zero errors and builds successfully.
- The generated site contains only source-grounded content and uses only registered widgets.
- The guide explicitly tells the agent when to omit a feature rather than inventing one.
- Full tests and lint pass, and the DIS build/snapshot regression remains unchanged.

## Calls made

- The supplied DIS PDF is a proof input, not a new DIS-specific template assumption.
- The proof uses a small representative lecture output rather than converting the entire course;
  the purpose is to test the agent interface and validation loop before building the generator CLI.
- Original PDFs remain outside Git; only compact derived proof metadata and generated JSON are
  committed if they are useful for regression.
