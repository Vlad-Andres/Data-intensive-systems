# Hand-off prompt for iteration 4

A `CLAUDE.md` in the folder that contains the three repositories (outside git, so it is not in any
repository) is loaded automatically by Claude Code and tells a new agent to read `NEXT.md` and this
plan. With it, a first message of "start" or "continue" is enough. Use the long prompt below for an
agent that does not read `CLAUDE.md`, or when that file is missing.

Paste the text below as the first message to the implementing agent. Start the agent in the folder
that contains `playground-portal`, `playground-template` and `Data-intensive-systems`.

```text
You are implementing an approved plan. Do not redesign it and do not add anything it does not ask for.

1. Read Data-intensive-systems/docs/superpowers/plans/2026-11-12-iteration-4.md from top to bottom.
   It is the only source of truth. Follow its "Start here", "How to work on one task" and "Rules"
   sections exactly.
2. Work in playground-portal on the branch iteration-4. Do one task at a time, in the order of the
   "Progress" list, starting with the first unticked box.
3. For every task: write the listed tests first and see them fail, write the code, run
   `npm run lint && npm test && npm run build`, commit with the given message, tick the box.
4. After the last task of a package, follow "Releases: one pull request per package": push, wait for
   the Vercel preview build, open a pull request, give me the link, and STOP until I answer.

Hard limits: never push or merge main; never merge a pull request unless I tell you to for that pull
request; never read or print .env files; never create or change Vercel settings or environment
variables; never run the real AI model; never edit files under vendor/; never touch
playground-template; in Data-intensive-systems write only under docs/superpowers/.

If a check still fails after two honest attempts, or the plan and the code disagree, stop and tell me
what you found. Do not work around it and do not change the plan.

When you report, say only what you ran and saw in this session: which task, which checks passed,
what is not done.
```
