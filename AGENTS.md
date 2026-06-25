# CS Cup Manager — Agent Orientation Map

> A lightweight Counter-Strike esports manager prototype: draft a five-player roster, play three annual cup tournaments, make tactical text decisions, and chase titles across up to three seasons.

## Product Shape

This is a small game, not a simulator that tries to mirror every real CS rule.

- The player acts as a CS tournament manager.
- Each season has three cups: IEM Katowice, IEM Cologne, and Major.
- Each cup has eight teams in a single-elimination bracket.
- The campaign lasts at most three seasons.
- Match presentation is text-first, with short tactical decision prompts.
- Real teams and players are used as inspiration, but balance data is local and game-owned.

## Stack

| Layer | Choice |
|---|---|
| Language | TypeScript |
| Runtime | Browser-first, Node for tests and tooling |
| App shell | Vite or equivalent lightweight frontend |
| Storage | Local save data first |
| Network | None required in core gameplay |

No framework has been installed yet. Keep the first implementation boring: TypeScript domain logic, deterministic tests, and a simple browser UI.

## Architecture Layers

Dependencies flow downward only:

```text
app -> ui -> simulation -> domain -> content
tests -> any layer under test
```

- `src/content/`: static teams, players, traits, tournament templates, text snippets.
- `src/domain/`: pure types and rules: players, teams, economy, seasons, tournaments.
- `src/simulation/`: deterministic match, draft, bracket, strategy, and narrative engines.
- `src/ui/`: screen components and interaction state.
- `src/app/`: composition, routing, save/load wiring, browser entry.

See `docs/architecture/LAYERS.md` before adding imports.

## Key Conventions

- Data drives the game. Add teams, players, prices, traits, and text through content files.
- Simulation code must be deterministic when given a seed.
- The match engine resolves decisions through simple readable modifiers, not opaque magic.
- UI may display narrative, but must not decide match outcomes.
- Real-world names are allowed only as curated roster data with source/date notes.

## Commands

```sh
npm run check:docs
npm run test:architecture
npm run gc
```

These commands are zero-dependency project hygiene scripts. Add `npm run dev`, `npm run test`, and `npm run build` when the app shell is created.

## Documentation Map

```text
ARCHITECTURE.md                         Top-level domain map
docs/architecture/LAYERS.md             Import and layer boundaries
docs/index.md                           Documentation index
docs/product-specs/GAMEPLAY.md          Core game loop and rules
docs/product-specs/ROSTER.md            Team/player pool and roster policy
docs/product-specs/ECONOMY.md           Match economy and transfer economy
docs/product-specs/EVENTS.md            Event system and event library rules
docs/product-specs/AWARDS.md            Cup/season awards and result summaries
docs/development/WORKFLOW.md            Required development flow
docs/golden-principles/                 DO/DON'T implementation rules
docs/design-docs/                       Product and architecture decisions
spec/                                   Lightweight feature specs
src/                                    Future implementation
tests/                                  Boundary and domain tests
```

## Where to Look First

| Task | Start here |
|---|---|
| Understand gameplay | `docs/product-specs/GAMEPLAY.md` |
| Change team or player pool | `docs/product-specs/ROSTER.md` |
| Add simulation rules | `docs/golden-principles/SIMULATION.md` |
| Add UI | `docs/golden-principles/UI_TEXT.md` |
| Add imports or directories | `docs/architecture/LAYERS.md` |
| Plan larger work | `docs/exec-plans/active/` |

## Constraints

- MUST: Keep the campaign loop playable in under 20 minutes.
- MUST: Keep cups to eight-team single-elimination brackets unless a spec changes this.
- MUST: Keep player roster size to five starters for v0.1.
- MUST: Use seeded randomness for match simulation.
- MUST: Treat the current game scope as single-player only; AI controls opponents, and offscreen AI matches resolve quickly.
- MUST NOT: Add online multiplayer, local two-player, live roster scraping, betting, skins, or gambling loops in v0.1.
- MUST NOT: Let UI import from `src/app/` or mutate content data.
- PREFER: Small pure functions over global game managers.
- VERIFY: Run `npm run check:docs` and `npm run test:architecture` before handing off.
