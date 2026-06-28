# QA Final Three-Year Mode Acceptance

Date: 2026-06-26
Role: Acceptance/QA Subagent
Scope: Final acceptance standard for the three-year playable mode of CS Cup Manager.

## Purpose

This document is the final QA gate for the target playable build, not a report on the current implementation state.

It consolidates the intended acceptance bar across:

- `spec/v0.1-vertical-slice.md`
- `docs/HANDOFF_PROGRESS.md`
- `docs/product-specs/GAMEPLAY.md`
- `docs/product-specs/MECHANICS.md`
- `docs/product-specs/AWARDS.md`
- `tests/app/browser-flow.test.mjs`

When these sources differ, this document defines the release acceptance standard for the final three-year mode.

## Final Acceptance Baseline

The build is acceptable only if all of the following are true:

1. The player manages a six-player roster: five starters plus one substitute.
2. A full three-season campaign can be completed end to end: 3 seasons x 3 cups = 9 cups.
3. Every cup stays eight-team single elimination: quarterfinal, semifinal, final.
4. Player-facing matches use 10-15 event cards total.
5. Player choice cards are capped at 5 per match; the rest are non-choice narrative cards.
6. Ordinary narrative cards include explicit CS-style kill narration such as who killed whom, multi-kill counts, clutch conversion, or trade outcomes.
7. Balance does not allow a brainless "buy two superstars and cruise" strategy to reliably win the whole campaign.
8. The game can be packaged into a runnable app build, not only served in dev mode.

Any failure above is a release blocker.

## Resolved Product Interpretation

- Roster size: accept `6` total players, with `5` active starters per match and `1` substitute available between or before matches as designed by the current browser flow and handoff record.
- Campaign size: accept only the full three-year mode, not the earlier one-cup vertical slice.
- Awards scope: accept cup awards after each cup and annual/final awards after each season and at campaign end.
- Match pacing: accept lightweight compressed-CS storytelling, but not at the cost of missing the 10-15 card and `<=5` choices requirement.

## Automated Acceptance

These checks should run in CI or in a deterministic local acceptance pass.

### A. Required Command Pass

| Check | Pass condition |
|---|---|
| `npm run check:docs` | Passes with no documentation integrity errors. |
| `npm run test:architecture` | Passes with no layer-boundary violations. |
| `npm run test` | Passes the full automated suite for simulation, UI state flow, awards, and packaging smoke coverage. |
| `npm run build` | Produces a distributable app/web build with no fatal warnings or runtime import failures. |

### B. Deterministic Campaign Coverage

Automated tests must prove:

- The campaign always initializes with exactly 6 selectable/managed players for the user roster.
- The active lineup used in matches is exactly 5 players.
- A seeded run can progress from season 1 cup 1 through season 3 cup 3 without dead-end states.
- The same seed reproduces the same bracket progression, match outcomes, cup champions, and award outputs.
- Offscreen AI matches resolve without opening the full player match UI.

### C. Match Card Structure Coverage

Automated tests must assert for every player-facing match fixture:

- total event-card count is between 10 and 15 inclusive;
- total player decision cards are 5 or fewer;
- opening flow still separates economy choice from tactic choice;
- at least one non-decision card contains explicit kill narration, such as:
  - `X 击杀了 Y`
  - `X 完成双杀/三杀`
  - `X 在残局收下这一分`

This is a structure/content assertion, not only a screenshot assertion.

### D. Awards and Full-Run Coverage

Automated tests must verify:

- every cup outputs champion, runner-up, semifinalists, cup MVP, 枪神队伍 placement, and one cup headline;
- every season outputs best club, top ten players, player of the year, biggest collapse, best tactical story/signature call, and 枪神队伍 season summary;
- the final chronicle after year three outputs all cup champions, all cup MVPs, annual best clubs, annual top tens, final trophy count, biggest upset, most painful loss, best transfer, defining player story, and manager rating.

### E. Balance Guardrail Coverage

Automated balance acceptance must include repeated seeded simulation, not only one golden path.

Minimum bar:

- run a statistically meaningful batch of seeded simulations for at least:
  - one "double superstar, weak structure" roster;
  - one "balanced system/core" roster;
  - one "cheap depth/high discipline" roster.
- reject the build if the double-superstar roster shows clear dominant stability across the campaign with weak variance and little punishment from cohesion, discipline, economy, substitute, scouting, or event systems.

Recommended release gate:

- the double-superstar roster must not produce the best championship rate by a runaway margin across the sampled seeds;
- at least one structured/balanced roster archetype must remain competitively viable in campaign win rate and cup conversion.

### F. Packaging Acceptance

Automated packaging acceptance must prove:

- a production build artifact is generated successfully;
- the packaged build launches to a playable first screen;
- the packaged build can start a new campaign, finish at least one cup, and persist no fatal runtime errors in the console during the smoke pass.

## Manual Acceptance

Manual QA is required because tone, pacing, and narrative readability matter here.

### 1. Roster and Entry Flow

Tester should confirm:

- the roster screen clearly supports 6 total selected players;
- the player cannot lock a roster with fewer or more than 6;
- the game clearly indicates who the 5 starters are and who the substitute is;
- substitute usage changes active-match participation and related text/output when applicable.

### 2. Three-Year Full Campaign Walkthrough

Tester should complete one full save from season 1 through season 3 and confirm:

- cup order is always Katowice -> Cologne -> Major;
- each season has exactly 3 cups;
- the campaign ends cleanly after the third season;
- there is no soft lock between cups, years, awards, transfers, or chronicle screens.

### 3. Match Pacing and Choice Density

For at least 5 player-facing matches across the campaign, tester should count cards manually and confirm:

- each match displays 10-15 cards;
- no match exceeds 5 player choices;
- non-choice cards still feel informative rather than filler;
- the match does not drag past the intended lightweight pace.

### 4. CS Narrative Authenticity

Tester should verify ordinary event cards regularly include readable CS action details:

- named player kills another named player;
- multi-kill moments are called out;
- trade, clutch, retake, save, defuse, or collapse language is concrete;
- text sounds like match commentary, not generic RPG combat text.

Passing here means the kill narration appears as a normal part of match flow, not as a one-off scripted showcase.

### 5. Balance Reality Check

Manual QA should perform at least these comparison runs:

- one roster built around two expensive stars and weak structure;
- one roster with an IGL/system core and better discipline/cohesion;
- one roster with stronger depth or substitute value.

Tester should confirm:

- the double-star roster can win, but not autopilot the whole game;
- weak structure gets punished by discipline loss, pressure events, scouting reads, economy trouble, or low cohesion;
- good structure and tactical choices can overcome raw star power in a believable number of runs.

### 6. Awards and Chronicle Readability

Tester should inspect the end of each cup, each year, and the final chronicle for:

- complete award fields;
- understandable headlines and summaries;
- no placeholder text, missing names, or broken ranking lists;
- a final summary that feels like a career wrap-up rather than a debug dump.

### 7. Packaged App Smoke Test

Tester should install/open the packaged app artifact and confirm:

- the app launches without requiring the local dev server;
- a new run can be started from the packaged build;
- one cup can be completed in the packaged build;
- save/load or session continuation behavior does not break the packaged flow if such functionality is included in release scope.

## Release Decision Rule

Release is accepted only when:

- all automated checks pass;
- all manual sections pass;
- no blocker remains in roster count, full three-year progression, match-card structure, kill narration, balance, awards, or packaging.

If only the old one-cup path works, the build is not accepted for final three-year mode.

## Known High-Risk Acceptance Areas

These are the areas most likely to appear "mostly done" while still failing real acceptance:

1. Match-card compliance may drift: teams often add more drama cards and accidentally exceed 5 choices or fall short of 10 total cards.
2. Balance may look fine in one golden-path run while still collapsing under repeated seeded simulations.
3. Packaging may pass `build` but still fail as a real app because the packaged runtime, asset paths, or save initialization differ from local dev behavior.
