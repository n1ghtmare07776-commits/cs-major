# v0.1 Playable Cup Tracker

Source plan: `docs/superpowers/plans/2026-06-25-v0-1-playable-cup.md`

Implementation agents may run in parallel. Do not edit the source plan or this tracker unless the user explicitly asks for tracking updates.

## Workstreams

- [ ] Plan: source plan created and docs hygiene verified.
- [ ] Core implementation/data: app shell, content, domain, deterministic simulation, cup awards.
- [ ] UI art implementation: draft, bracket hub, match event cards, summary screen.
- [ ] Acceptance: automated acceptance tests, manual browser pass, final verification commands.

## Required Final Commands

```sh
npm run check:docs
npm run test:architecture
npm run test
npm run build
npm run gc
```

Note: `npm run test`, `npm run build`, and `npm run dev` must be added when the Vite/TypeScript shell is implemented.
