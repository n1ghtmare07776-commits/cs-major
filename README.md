# CS Cup Manager

CS Cup Manager is a lightweight text-first esports manager prototype inspired by Counter-Strike tournaments.

The first milestone is a browser game where the player drafts a five-player roster under a budget, plays three yearly cups, makes tactical choices during simplified text matches, and sees a title summary after up to three seasons.

## Current State

This repository currently contains the agent-ready harness, product spec, architecture boundaries, and development workflow. The app implementation has not been started yet.

## Repository Layout

```text
AGENTS.md
ARCHITECTURE.md
docs/
  architecture/
  development/
  design-docs/
  exec-plans/
  golden-principles/
  product-specs/
scripts/
  gc/
src/
  app/
  content/
  domain/
  simulation/
  ui/
tests/
  architecture/
  domain/
  simulation/
```

## Useful Commands

```sh
npm run check:docs
npm run test:architecture
npm run gc
```

## First Implementation Target

Build a vertical slice:

1. Load eight curated teams and their players.
2. Let the player draft five players under budget.
3. Auto-fill seven opposing teams with reality-biased rosters.
4. Run one eight-team cup.
5. Show text match events and three tactical decision prompts.
6. Persist the cup result in a season summary.

