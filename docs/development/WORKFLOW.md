# Development Workflow

## Required Loop

1. Read `AGENTS.md`.
2. Read the relevant product spec.
3. Read `docs/architecture/LAYERS.md`.
4. Make the smallest change that completes the slice.
5. Add or update tests for domain and simulation behavior.
6. Run verification commands.
7. Update docs when behavior changes.

## Verification Commands

```sh
npm run check:docs
npm run test:architecture
npm run gc
```

After the app shell exists, add and run:

```sh
npm run test
npm run build
```

## Feature Slices

Prefer vertical slices that can be played:

- Roster draft screen plus budget validation.
- One cup bracket plus match resolver.
- One match prompt family plus narrative output.
- Season summary plus title counter.

Avoid large hidden rewrites that do not produce a playable step.

## Branch and Commit Rules

- Keep generated data separate from hand-authored rules.
- Keep docs and implementation in the same branch when behavior changes.
- Do not mix roster updates with engine changes unless the feature requires both.

## Handoff Checklist

- State what changed.
- State what was verified.
- State any known missing gameplay surface.
- Link the main files touched.

