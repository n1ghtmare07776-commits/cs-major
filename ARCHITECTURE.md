# Architecture

CS Cup Manager is organized around a small deterministic game core with a thin browser UI.

## Domain Map

```text
Content Data
  -> Domain Rules
  -> Simulation Engines
  -> UI Screens
  -> App Shell
```

## Core Modules

| Module | Responsibility |
|---|---|
| `src/content/` | Static teams, players, traits, tournament templates, text fragments |
| `src/domain/` | Immutable types and rule helpers for players, teams, economy, seasons |
| `src/simulation/` | Drafting, bracket generation, match rounds, tactical choices, narrative |
| `src/ui/` | Visual screens and user interaction |
| `src/app/` | App boot, route composition, save/load adapters |

## Runtime Model

The simulation owns match outcomes. UI sends a player decision, simulation resolves it using the current match state, and UI renders the returned text and state update.

## Data Policy

Real-world rosters are a dated content snapshot, not live data. Update roster content deliberately and note the source/date in `docs/product-specs/ROSTER.md`.

## Boundary Rules

The definitive import rules live in `docs/architecture/LAYERS.md`. Boundary tests must reject upward imports once source files exist.

