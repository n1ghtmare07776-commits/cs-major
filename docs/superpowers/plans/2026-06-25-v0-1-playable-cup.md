# v0.1 Playable Cup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the smallest playable CS Cup Manager slice where the player drafts five starters for 枪神队伍, starts one eight-team cup, plays detailed player matches, offscreen matches resolve quickly, and the cup champion plus cup MVP are announced.

**Architecture:** Implement from lower layers upward: content -> domain -> simulation -> ui -> app. Content owns static roster/events/tournament text, domain owns pure types and validation, simulation owns deterministic bracket/match/award resolution, UI owns screens and interaction state, and app only wires the browser entry and save/load shell.

**Tech Stack:** TypeScript, browser-first Vite app shell, Node test runner for deterministic domain/simulation tests, existing zero-dependency hygiene scripts.

---

## Coordination Notes

- Implementation agents may run in parallel. Do not edit this plan after creation unless the user explicitly asks for a plan revision.
- Source-code agents should coordinate by workstream and layer. Core implementation/data agents should avoid UI files; UI art agents should avoid simulation/domain rules.
- There may be no Git repository in this workspace. Do not make mandatory git commit steps. If a repo exists, commits are optional and should be small.
- v0.1 uses five starters only. The six-player/substitute notes in roster and economy specs are future scope for a season-mode milestone.
- Keep the first slice offline and deterministic. Do not add live roster scraping, accounts, multiplayer, betting, skins, or gambling loops.

## Required Context

Read these before implementation:

- `AGENTS.md`
- `spec/v0.1-vertical-slice.md`
- `docs/product-specs/GAMEPLAY.md`
- `docs/product-specs/ROSTER.md`
- `docs/product-specs/ECONOMY.md`
- `docs/product-specs/EVENTS.md`
- `docs/product-specs/AWARDS.md`
- `docs/architecture/LAYERS.md`
- `docs/design-docs/office-hours-game-mechanics.md`
- For UI work only: `docs/golden-principles/UI_TEXT.md`, `docs/design-docs/art-direction/UI_ART_REQUIREMENTS.md`, and root `UI_ART_REQUIREMENTS.md` if still present.
- For simulation work only: `docs/golden-principles/SIMULATION.md` and `docs/golden-principles/DATA_CANON.md`.

## File Map

### Project Shell

- Modify: `package.json`
  - Add `dev`, `build`, `test`, and type-check scripts after installing the app shell.
- Create: `index.html`
  - Vite browser entry host.
- Create: `tsconfig.json`
  - TypeScript config with path alias support if used.
- Create: `vite.config.ts`
  - Lightweight Vite config.
- Create: `tests/domain/*.test.ts`, `tests/simulation/*.test.ts`
  - Deterministic test coverage for pure rules and seeded simulation.

### Content Layer: `src/content/`

- Keep/modify: `src/content/events.ts`
  - Convert or preserve existing event content as typed content.
- Create: `src/content/players.ts`
  - Curated eight-team player pool using local game-owned stats and dated source notes from roster spec.
- Create: `src/content/teams.ts`
  - Eight source teams: Spirit, Vitality, Falcons, MOUZ, FaZe, FURIA, NAVI, The MongolZ.
- Create: `src/content/tournaments.ts`
  - One v0.1 cup template with eight-team single-elimination bracket metadata.
- Create: `src/content/text.ts`
  - Reusable narrative snippets for match cards, decisions, award headlines, and Chinese fan pressure flavor.
- Create: `src/content/index.ts`
  - Content exports only; no imports from domain/simulation/ui/app.

### Domain Layer: `src/domain/`

- Create: `src/domain/player.ts`
  - Player, trait, role, price, and rating types.
- Create: `src/domain/team.ts`
  - Team roster shape, five-starter validation, aggregate firepower/tactics/cohesion/discipline calculations.
- Create: `src/domain/draft.ts`
  - Draft budget validation and selected-player ownership rules.
- Create: `src/domain/economy.ts`
  - In-match buy labels, equipment quality, and simple streak-based money state.
- Create: `src/domain/tournament.ts`
  - Cup, bracket round, match pairing, placement, and result types.
- Create: `src/domain/awards.ts`
  - Cup MVP score input/output types and result-summary types.
- Create: `src/domain/index.ts`
  - Domain exports.

### Simulation Layer: `src/simulation/`

- Create: `src/simulation/rng.ts`
  - Seeded pseudo-random generator with deterministic helpers.
- Create: `src/simulation/draftAi.ts`
  - Auto-fill seven AI teams from remaining players, preserving source team cores where possible.
- Create: `src/simulation/bracket.ts`
  - Seeded bracket creation and advancement for an eight-team single-elimination cup.
- Create: `src/simulation/strategy.ts`
  - Readable strategy matrix for rush/default/slow/fake/save/retake-style choices.
- Create: `src/simulation/match.ts`
  - Detailed player match resolver with opening economy and tactic prompts, event cards, score, stat deltas, and player impact.
- Create: `src/simulation/offscreen.ts`
  - Fast weighted resolver for non-player matches.
- Create: `src/simulation/awards.ts`
  - Cup champion summary, placements, player-team result, and cup MVP selection.
- Create: `src/simulation/cup.ts`
  - One-cup state machine that routes player matches to detailed resolution and AI-only matches to offscreen resolution.
- Create: `src/simulation/index.ts`
  - Simulation exports.

### UI Layer: `src/ui/`

- Create: `src/ui/state.ts`
  - UI-facing app state and reducer/actions. UI calls simulation functions but never decides match outcomes.
- Create: `src/ui/components/DraftScreen.ts`
  - Player selection under budget with five starters for 枪神队伍.
- Create: `src/ui/components/BracketScreen.ts`
  - Main tournament hub with eight-team bracket and current round state.
- Create: `src/ui/components/MatchScreen.ts`
  - Vertical event-card match log, opening economy step, opening tactic step, later decision prompts, and timeout prompt when offered.
- Create: `src/ui/components/SummaryScreen.ts`
  - Cup champion, cup MVP, runner-up/semifinalists, and 枪神队伍 placement/result.
- Create: `src/ui/components/TeamPanel.ts`
  - Roster, budget, and aggregate team stats.
- Create: `src/ui/styles.css`
  - One cohesive art direction for the playable slice, using actual UI states rather than a landing page.

### App Layer: `src/app/`

- Create: `src/app/main.ts`
  - Browser bootstrap and render loop/mount.
- Create: `src/app/save.ts`
  - Local-storage adapter for seed and completed cup state, optional for v0.1 if time is tight.

## Workstream 1: Plan

### Task 1: Keep Plan as Source of Truth

**Files:**
- Read: `docs/superpowers/plans/2026-06-25-v0-1-playable-cup.md`
- Optional tracker: `docs/exec-plans/active/v0-1-playable-cup.md`

- [ ] Confirm the plan starts with the required Superpowers header.
- [ ] Confirm implementation agents know this file should not be edited during execution.
- [ ] Confirm work is split by layer and workstream: core implementation/data, UI art implementation, acceptance.
- [ ] Confirm no mandatory Git commit steps are present.
- [ ] Run: `npm run check:docs`
  - Expected: command exits 0 and does not report broken docs references.

## Workstream 2: Core Implementation and Data

### Task 2: App Shell and Test Harness

**Files:**
- Modify: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `tests/domain/team.test.ts`
- Create: `tests/simulation/rng.test.ts`

- [ ] Install minimal dependencies:

```sh
npm install --save-dev vite typescript vitest
```

- [ ] Update `package.json` scripts:

```json
{
  "scripts": {
    "check:docs": "node scripts/check-docs.mjs",
    "test:architecture": "node tests/architecture/boundary.test.mjs",
    "gc": "node scripts/gc/scan-docs.mjs",
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "test": "vitest run"
  }
}
```

- [ ] Create `tsconfig.json` with `strict: true`, browser DOM libs, and include `src` plus `tests`.
- [ ] Create `vite.config.ts` with the project root defaults and `@` alias to `src`.
- [ ] Create `index.html` with `<div id="app"></div>` and module script `/src/app/main.ts`.
- [ ] Add a placeholder failing test for a team aggregate function in `tests/domain/team.test.ts`.
- [ ] Add a placeholder failing test for deterministic seeded RNG in `tests/simulation/rng.test.ts`.
- [ ] Run: `npm run test`
  - Expected before implementation: fails because domain and simulation modules do not exist yet.
- [ ] Run: `npm run build`
  - Expected before implementation: fails because `src/app/main.ts` does not exist yet.

### Task 3: Static Content Data

**Files:**
- Create: `src/content/players.ts`
- Create: `src/content/teams.ts`
- Create: `src/content/tournaments.ts`
- Create: `src/content/text.ts`
- Modify: `src/content/events.ts`
- Create: `src/content/index.ts`

- [ ] Define content-only player records with fields:

```ts
export type PlayerContent = {
  id: string;
  displayName: string;
  sourceTeamId: string;
  role: "entry" | "rifler" | "awp" | "igl" | "support" | "closer";
  firepower: number;
  tactics: number;
  personality: number;
  discipline: number;
  traits: Array<
    | "hot_blooded"
    | "calm_clutcher"
    | "system_leader"
    | "streaky_star"
    | "disciplined"
    | "crowd_favorite"
  >;
  sourceNote: string;
};
```

- [ ] Include at least five players for each source team so AI teams can be filled after the player's five-player draft.
- [ ] Include anchors from the roster spec: `donk`, `ZywOo`, `NiKo`, `m0NESY`, `ropz`, `apEX`, `karrigan`, `KSCERATO`.
- [ ] Derive prices later in domain from ratings; do not hard-code a live market feed.
- [ ] Define eight source teams with ids: `spirit`, `vitality`, `falcons`, `mouz`, `faze`, `furia`, `navi`, `mongolz`.
- [ ] Define cup template `iem-katowice-v0` with quarterfinal, semifinal, and final labels.
- [ ] Define at least three tactical prompt types in content text:
  - opening tactic
  - clutch/defuse or post-plant
  - timeout/momentum crisis
- [ ] Preserve real-name safety in event text: generic form, travel, pressure, tactics, or public expectation only.
- [ ] Run: `npm run test:architecture`
  - Expected: passes because content imports no higher layers.

### Task 4: Domain Types, Roster Rules, and Economy Rules

**Files:**
- Create: `src/domain/player.ts`
- Create: `src/domain/team.ts`
- Create: `src/domain/draft.ts`
- Create: `src/domain/economy.ts`
- Create: `src/domain/tournament.ts`
- Create: `src/domain/awards.ts`
- Create: `src/domain/index.ts`
- Modify: `tests/domain/team.test.ts`

- [ ] Write tests for roster validation:
  - exactly five starters is valid.
  - four or six starters is invalid for v0.1.
  - duplicate player ids are invalid.
  - total draft price must fit the starting budget.
- [ ] Write tests for team aggregate values:
  - total firepower is average player firepower plus gentle trait modifiers.
  - tactical execution values leadership and tactics.
  - cohesion reflects personality average and same-source-team familiarity.
  - discipline reflects discipline average and relevant traits.
- [ ] Write tests for economy state:
  - losing first round usually forces weak second-round economy.
  - losing two rounds restores a buy opportunity in round three.
  - winning two then losing one preserves enough economy for round four.
  - no-money state only allows eco/save.
- [ ] Implement `derivePlayerPrice(player)` from ratings and role value so all-star rosters exceed budget.
- [ ] Implement `validateDraftSelection(players, budget)` returning `{ ok: true }` or `{ ok: false; reasons: string[] }`.
- [ ] Implement `calculateTeamProfile(team)` returning `{ firepower, tacticalExecution, cohesion, discipline }` clamped to 1-100.
- [ ] Implement `availableBuyChoices(economyState)` returning `full_buy`, `partial_buy`, or `eco_save` as allowed choices.
- [ ] Run: `npm run test -- tests/domain/team.test.ts`
  - Expected after implementation: passes.
- [ ] Run: `npm run test:architecture`
  - Expected: passes; domain imports only content or domain.

### Task 5: Seeded RNG, Draft AI, and Bracket

**Files:**
- Create: `src/simulation/rng.ts`
- Create: `src/simulation/draftAi.ts`
- Create: `src/simulation/bracket.ts`
- Create: `src/simulation/index.ts`
- Modify: `tests/simulation/rng.test.ts`
- Create: `tests/simulation/draftAi.test.ts`
- Create: `tests/simulation/bracket.test.ts`

- [ ] Write deterministic RNG tests:
  - same seed produces same number sequence.
  - different seeds usually produce different sequences.
  - `pickWeighted` is deterministic with a given seed.
- [ ] Write draft AI tests:
  - selected player-team players become 枪神队伍.
  - seven AI teams fill to five starters.
  - original teammates are preserved when still available.
  - no player appears on two teams.
- [ ] Write bracket tests:
  - exactly eight teams enter.
  - bracket has four quarterfinals, two semifinals, one final.
  - same seed creates same bracket order.
  - non-eight team count returns a clear validation error.
- [ ] Implement deterministic RNG.
- [ ] Implement AI roster fill from remaining content players.
- [ ] Implement bracket creation and advancement types.
- [ ] Run: `npm run test -- tests/simulation/rng.test.ts tests/simulation/draftAi.test.ts tests/simulation/bracket.test.ts`
  - Expected after implementation: passes.
- [ ] Run: `npm run test:architecture`
  - Expected: passes; simulation imports only content/domain/simulation.

### Task 6: Match Strategy and Detailed Player-Match Resolver

**Files:**
- Create: `src/simulation/strategy.ts`
- Create: `src/simulation/match.ts`
- Create: `tests/simulation/strategy.test.ts`
- Create: `tests/simulation/match.test.ts`

- [ ] Write strategy matrix tests:
  - fast hit has a readable advantage against greedy map control.
  - stack defense has a readable advantage against obvious rush.
  - fake punishes early rotation.
  - slow default punishes over-aggression.
  - mirror tactics compare execution quality rather than returning neutral.
- [ ] Write match tests:
  - every player-facing match starts with separate economy and tactic prompt states.
  - at least three prompt types can appear across deterministic seeds.
  - first to three compressed rounds wins.
  - match has no more than five compressed rounds.
  - match log includes narrative event cards and stat delta lines.
  - same seed and same decisions produce same winner and log.
- [ ] Implement `resolveStrategyCollision(playerPlan, opponentPlan, context)` returning score modifier plus explanation text.
- [ ] Implement `startPlayerMatch(input)` returning the first pending economy prompt.
- [ ] Implement `applyEconomyChoice(state, choice)` returning a pending tactic prompt.
- [ ] Implement `applyTacticChoice(state, choice)` resolving opening card and continuing match state.
- [ ] Implement later prompts for at least clutch/post-plant and timeout/momentum crisis.
- [ ] Track per-player impact stats for MVP scoring.
- [ ] Run: `npm run test -- tests/simulation/strategy.test.ts tests/simulation/match.test.ts`
  - Expected after implementation: passes.

### Task 7: Offscreen Match Resolver, Cup Flow, and Awards

**Files:**
- Create: `src/simulation/offscreen.ts`
- Create: `src/simulation/awards.ts`
- Create: `src/simulation/cup.ts`
- Create: `tests/simulation/offscreen.test.ts`
- Create: `tests/simulation/cup.test.ts`
- Create: `tests/simulation/awards.test.ts`

- [ ] Write offscreen tests:
  - AI-only matches resolve without prompt states.
  - stronger team is favored but not guaranteed.
  - same seed returns same result.
- [ ] Write cup-flow tests:
  - player can advance through quarterfinal, semifinal, final if winning.
  - if 枪神队伍 is eliminated, remaining matches resolve without detailed UI prompts.
  - completed cup always has champion, runner-up, semifinalists, cup MVP, and player-team placement.
  - same seed and same decisions reproduce bracket and match results.
- [ ] Write awards tests:
  - cup MVP can come from champion or non-champion based on impact.
  - champion bonus helps but does not automatically override much higher impact.
  - final summary includes champion, MVP, and 枪神队伍 result.
- [ ] Implement `resolveOffscreenMatch`.
- [ ] Implement `createCupRun(seed, playerRoster)`.
- [ ] Implement `advanceCupWithPlayerDecision`.
- [ ] Implement `fastForwardAfterElimination`.
- [ ] Implement `summarizeCup`.
- [ ] Run: `npm run test -- tests/simulation/offscreen.test.ts tests/simulation/cup.test.ts tests/simulation/awards.test.ts`
  - Expected after implementation: passes.
- [ ] Run: `npm run test`
  - Expected after implementation: all unit tests pass.

## Workstream 3: UI Art Implementation

### Task 8: UI State and Draft Screen

**Files:**
- Create: `src/ui/state.ts`
- Create: `src/ui/components/DraftScreen.ts`
- Create: `src/ui/components/TeamPanel.ts`
- Create: `src/ui/styles.css`
- Create: `src/app/main.ts`

- [ ] Implement a small UI state reducer with states:
  - `draft`
  - `bracket`
  - `player-match`
  - `cup-summary`
- [ ] Implement draft screen showing the player pool, source team, role, price, firepower, tactics, traits, and selected roster.
- [ ] Enforce five selected starters and budget in the UI by calling domain validation.
- [ ] Name the player team `枪神队伍`.
- [ ] Use restrained esports-manager styling: functional bracket and roster interface first, not a landing page.
- [ ] Run: `npm run build`
  - Expected after app entry exists: passes or fails only on known unimplemented later UI modules before Task 9.

### Task 9: Bracket and Match Screens

**Files:**
- Create: `src/ui/components/BracketScreen.ts`
- Create: `src/ui/components/MatchScreen.ts`
- Modify: `src/ui/state.ts`
- Modify: `src/ui/styles.css`

- [ ] Implement bracket as the central non-match screen with eight teams, quarterfinals, semifinals, and final.
- [ ] Add "start next match" action only when the next player-team match is ready.
- [ ] Ensure AI-only matches resolve through simulation calls without rendering full match UI.
- [ ] Implement match event cards as a vertical log.
- [ ] Implement separate opening economy prompt and opening tactic prompt.
- [ ] Implement later decision card rendering for clutch/post-plant and timeout/momentum crisis prompts.
- [ ] After each decision, append narrative result text and compact stat delta text to the same card.
- [ ] Show relevant team values after decisions: tactical execution, equipment quality, cohesion, discipline, or key player influence.
- [ ] Run: `npm run build`
  - Expected: passes once Task 9 modules compile.

### Task 10: Cup Summary Screen and Basic Browser Polish

**Files:**
- Create: `src/ui/components/SummaryScreen.ts`
- Modify: `src/ui/state.ts`
- Modify: `src/ui/styles.css`
- Modify: `src/app/main.ts`

- [ ] Implement summary screen with:
  - cup champion.
  - cup MVP immediately after champion.
  - runner-up.
  - semifinalists.
  - 枪神队伍 placement/result.
  - one short headline.
- [ ] If player is eliminated, display "remaining matches resolved quickly" behavior through immediate summary progression, not through full AI match screens.
- [ ] Make sure long player names and Chinese text fit in buttons/cards at mobile and desktop widths.
- [ ] Use icon-like controls only when clear; otherwise use concise text buttons for major commands.
- [ ] Avoid nested cards, oversized hero sections, and decorative-only backgrounds.
- [ ] Run: `npm run build`
  - Expected: passes.

## Workstream 4: Acceptance

### Task 11: Automated Acceptance Tests

**Files:**
- Create: `tests/simulation/acceptance-v0-1.test.ts`
- Optional create: `tests/ui/ui-state.test.ts`

- [ ] Add acceptance test: a player can draft five players under budget and complete one cup without editing data files.
- [ ] Add acceptance test: if player decisions lose the quarterfinal, remaining cup resolves and announces champion plus MVP.
- [ ] Add acceptance test: every completed cup announces champion and cup MVP.
- [ ] Add acceptance test: same seed and same decisions reproduce bracket and match results.
- [ ] Add acceptance test: player match opening asks for economy and tactic separately.
- [ ] Add acceptance test: non-player matches resolve without full match prompt state.
- [ ] Add acceptance test: final screen model includes champion, cup MVP, and player-team result.
- [ ] Run: `npm run test -- tests/simulation/acceptance-v0-1.test.ts`
  - Expected: passes.
- [ ] Run: `npm run test`
  - Expected: all tests pass.

### Task 12: Manual Browser Acceptance

**Files:**
- No code files unless fixing issues found by acceptance.

- [ ] Start the app:

```sh
npm run dev
```

- [ ] Open the local Vite URL shown in the terminal.
- [ ] Draft five players for 枪神队伍 under budget.
- [ ] Start the cup and confirm the bracket contains eight teams.
- [ ] Confirm the first player match asks for economy first.
- [ ] Confirm the first player match asks for tactic second.
- [ ] Play until the player team wins or is eliminated.
- [ ] If eliminated, confirm the cup fast-forwards to champion and MVP.
- [ ] If champion, confirm the final summary shows champion, MVP, and player-team result.
- [ ] Re-run with the same seed and same choices; confirm bracket and match winners match.
- [ ] Check a narrow mobile viewport and a desktop viewport for text overlap.

### Task 13: Final Verification Commands

**Files:**
- No code files unless fixing verification failures.

- [ ] Run:

```sh
npm run check:docs
```

Expected: passes.

- [ ] Run:

```sh
npm run test:architecture
```

Expected: passes.

- [ ] Run:

```sh
npm run test
```

Expected: passes.

- [ ] Run:

```sh
npm run build
```

Expected: passes.

- [ ] Run:

```sh
npm run gc
```

Expected: passes or reports only accepted documentation findings that are unrelated to the implementation.

## Acceptance Checklist

- [ ] Player can complete one cup without editing data files.
- [ ] Player drafts exactly five starters for 枪神队伍 under budget.
- [ ] Active cup has eight teams in a single-elimination bracket.
- [ ] Detailed match UI is only used for 枪神队伍 matches.
- [ ] Non-player bracket matches resolve quickly with simplified AI advancement.
- [ ] If 枪神队伍 is eliminated, the remaining cup resolves quickly.
- [ ] Every completed cup announces champion and cup MVP.
- [ ] Final screen shows champion, cup MVP, and player-team result.
- [ ] Same seed and same choices reproduce bracket and match results.
- [ ] At least three tactical prompt types exist.
- [ ] Player match opening asks economy and tactic separately.
- [ ] UI does not decide match outcomes.
- [ ] Content imports no higher layer; domain imports no UI/app/simulation; simulation imports no UI/app; UI imports no app.
