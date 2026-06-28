# Final Three-Year Mode Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the locked MVP for CS Cup Manager: a complete three-season, nine-cup run with 8-team single-elimination cups, BO5 player matches, bracket-centered flow, roughly 10 match boxes with 3 player decisions max 5, rebalanced roster value, and a packaged app build.

**Architecture:** Keep `app -> ui -> simulation -> domain -> content` strict. Campaign progression, match outcomes, awards, and balance must live in deterministic simulation/domain code. UI renders state, choices, summaries, and bracket progression only. Content owns players, teams, event libraries, text, and tuning tables.

**Tech Stack:** Browser-first TypeScript/JS app, current static shell plus Node tests/tooling, local save flow, final desktop app packaging target.

---

## Confirmed MVP Lock

- [ ] Campaign scope is fixed at **3 seasons x 3 cups = 9 cups**.
- [ ] Cup order is fixed at **IEM Katowice -> IEM Cologne -> Major** for every season.
- [ ] Every cup is fixed at **8 teams, single elimination, quarterfinal -> semifinal -> final**.
- [ ] User roster remains **6 players total: 5 starters + 1 substitute**.
- [ ] Player-facing matches are fixed at **BO5**, first to 3 map wins.
- [ ] Each player-facing match targets **about 10 event boxes**, acceptable range **10-15**.
- [ ] Player decision boxes target **about 3**, hard cap **5**.
- [ ] Non-decision boxes must carry most of the CS-style narration: kills, trades, retakes, saves, clutches, anti-eco, map-control swings.
- [ ] Cup-to-cup flow stays **light management**, with bracket/timeline as the main spine.
- [ ] Balance must explicitly prevent a low-thought **`donk + ZywOo` star pile** from becoming the dominant campaign solution.
- [ ] Final delivery target is a **packaged app**, not only `python3 -m http.server`.

## Source-of-Truth Alignment

- [ ] `AGENTS.md`: enforce under-20-minute campaign pace, seeded randomness, 8-team single elimination, no scope creep into multiplayer or betting loops.
- [ ] `docs/HANDOFF_PROGRESS.md`: treat the current build as a first-cup prototype with tree bracket groundwork already present.
- [ ] `docs/product-specs/GAMEPLAY.md`: preserve three-season structure, cup summaries, annual awards, final chronicle.
- [ ] `docs/product-specs/MECHANICS.md`: keep chemistry, strategy memory, timeout, scouting, and impact rating readable.
- [ ] `docs/QA-final-three-year-mode.md`: use it as the release gate, especially for 10-15 cards, `<=5` choices, balance sweeps, and app packaging.
- [ ] `docs/design-docs/three-year-mode-ui-execution-memo.md`: keep bracket-first layout, dense play surfaces, ceremonial reveal screens.

## Critical Dependency Order

1. **Season/domain model first**: define campaign state, cup records, annual records, chronicle records before deepening UI.
2. **Match data model second**: lock the 10-15 box schema and BO5 progression before writing lots of text.
3. **Balance tables third**: tune player value, chemistry, and event weights before final awards validation.
4. **UI wiring fourth**: build screens only after state shape and match box schema stop moving.
5. **Text pass fifth**: polish terminology after the final card taxonomy and screen structure are stable.
6. **Packaging sixth**: add desktop wrapper only after the browser build and save flow are stable.
7. **Acceptance last**: do not call the feature done before seeded full-run tests, loss-path checks, and packaged-app smoke pass.

If this order breaks, the likely failure mode is rework in `src/app/browser.js`, duplicated state logic, and text content tied to unstable event schemas.

## File Map For Execution

### Create

- [ ] `src/domain/campaign.ts` - campaign, season, cup, phase, and record types
- [ ] `src/domain/awards.ts` - annual ranking inputs and result record shapes
- [ ] `src/simulation/season.ts` - three-year campaign state machine
- [ ] `src/simulation/match.ts` - BO5 player-match resolver and event-box pipeline
- [ ] `src/content/cups.ts` - season/cup templates and per-cup metadata
- [ ] `src/content/balance.ts` - player/team tuning constants, chemistry weights, award weights
- [ ] `tests/simulation/season.test.ts` - 3-year progression coverage
- [ ] `tests/simulation/match.test.ts` - 10-15 box and `<=5` choice coverage
- [ ] `tests/simulation/balance.test.ts` - seeded archetype comparison coverage
- [ ] `tests/app/three-year-flow.test.mjs` - browser/app golden path from S1 to final chronicle

### Modify

- [ ] `src/simulation/cup.ts` - lift one-cup logic into reusable cup runner, offscreen AI resolution, award outputs
- [ ] `src/app/browser.js` - shrink prototype-only state, delegate campaign and match logic to simulation/domain
- [ ] `src/app/game.ts` - save/load and screen routing around the new campaign phases
- [ ] `src/app/main.ts` - app boot and packaged build entry
- [ ] `src/ui/csCupManagerUi.ts` - bracket hub, between-cup hub, match room, annual awards, chronicle screens
- [ ] `src/ui/styles.css` - three-year navigation, bracket states, box taxonomy, awards, chronicle, desktop-shell polish
- [ ] `src/content/events.ts` - event library growth and between-cup event content
- [ ] `src/content/match-beats.ts` - ordinary CS narration boxes
- [ ] `src/content/mechanic-events.ts` - scouting, timeout, conflict, hot-form, control-loss events
- [ ] `src/content/awardsText.ts` - cup/annual/final award copy
- [ ] `src/content/epilogue.ts` - three-year chronicle summaries
- [ ] `src/content/players.ts` - price and stat rebalance
- [ ] `src/content/teams.ts` - team templates and cup seeding helpers if needed
- [ ] `docs/product-specs/GAMEPLAY.md` - update old 7-10 match-card wording to the final 10-15 shipped range
- [ ] `package.json` - package/build/dev scripts for final app target

## Phase 1: 赛季状态机

**Goal:** Make the game finish 3 full seasons and 9 cups with no dead-end state.

**Files:**
- [ ] Create: `src/domain/campaign.ts`
- [ ] Create: `src/domain/awards.ts`
- [ ] Create: `src/simulation/season.ts`
- [ ] Create: `src/content/cups.ts`
- [ ] Modify: `src/simulation/cup.ts`
- [ ] Modify: `src/app/browser.js`
- [ ] Modify: `src/app/game.ts`
- [ ] Test: `tests/simulation/season.test.ts`
- [ ] Test: `tests/app/three-year-flow.test.mjs`

- [ ] Lock campaign enums and records:
  - `seasonIndex: 1..3`
  - `cupId: katowice | cologne | major`
  - `phase: draft | cup_bracket | prematch | player_match | cup_awards | between_cups | annual_awards | season_summary | chronicle`
  - per-cup result record
  - per-season standings record
  - career chronicle record
- [ ] Extract current one-cup progression out of `src/app/browser.js` into `src/simulation/season.ts`.
- [ ] Make offscreen AI cups resolve without opening the match-room UI.
- [ ] Record, after every cup:
  - champion
  - runner-up
  - semifinalists
  - cup MVP
  - player-team placement
  - one headline
- [ ] Record, after every season:
  - best club
  - top 10 players
  - player of the year
  - biggest collapse
  - signature call
  - player-team season summary
- [ ] Record, after Season 3:
  - all 9 cup champions
  - all 9 cup MVPs
  - all annual best clubs
  - all annual top 10s
  - final trophy count
  - key highs/lows for chronicle
- [ ] Keep first-cup regression coverage green while season logic is extracted.

**Acceptance:**
- [ ] Same seed reproduces the same 9-cup path and awards.
- [ ] Early elimination still advances to cup awards, between-cup phase, next cup, and year-end summary.
- [ ] Season 3 ends in chronicle, never loops back into Season 4.

## Phase 2: 比赛引擎扩展

**Goal:** Replace the thin prototype match flow with a deterministic BO5 event-box engine.

**Files:**
- [ ] Create: `src/simulation/match.ts`
- [ ] Modify: `src/simulation/cup.ts`
- [ ] Modify: `src/content/match-beats.ts`
- [ ] Modify: `src/content/mechanic-events.ts`
- [ ] Modify: `src/content/events.ts`
- [ ] Modify: `src/app/browser.js`
- [ ] Test: `tests/simulation/match.test.ts`
- [ ] Test: `tests/app/three-year-flow.test.mjs`

- [ ] Define a match schema that separates:
  - event-box metadata
  - choice payload
  - result payload
  - score delta
  - stat delta
  - chronicle-worthy tags
- [ ] Upgrade player-facing matches to **BO5**, first to 3 map wins.
- [ ] Make every featured match render **10-15 boxes** total.
- [ ] Keep player choices to **3 target, 5 max**:
  - opening economy
  - opening tactic
  - 1 timeout or swing decision
  - optional clutch/closing choice in close matches
- [ ] Fill the remaining boxes with ordinary CS narration:
  - `X 击杀了 Y`
  - double/triple kills
  - 补枪成功/失败
  - 默认控图、前压、反清、回防、保枪
  - 假打转点、反清失误、anti-eco、force-buy swing
- [ ] Keep one timeout maximum and one high-risk drama chain maximum per match.
- [ ] Thread scouting and strategy memory into the box results so counters are explained in text, never hidden.
- [ ] Make non-player matches resolve with lightweight logic and no box UI.

**Acceptance:**
- [ ] Every featured match fixture asserts `10 <= cardCount <= 15`.
- [ ] Every featured match fixture asserts `decisionCount <= 5`.
- [ ] Ordinary boxes outnumber decision boxes.
- [ ] At least one ordinary box per featured match contains explicit kill narration.

## Phase 3: 数值平衡

**Goal:** Make roster construction, chemistry, substitute use, tactics, and events matter as much as star names.

**Files:**
- [ ] Create: `src/content/balance.ts`
- [ ] Modify: `src/content/players.ts`
- [ ] Modify: `src/content/traits.ts`
- [ ] Modify: `src/content/teams.ts`
- [ ] Modify: `src/simulation/match.ts`
- [ ] Modify: `src/simulation/cup.ts`
- [ ] Modify: `src/simulation/season.ts`
- [ ] Test: `tests/simulation/balance.test.ts`

- [ ] Pull tuning constants out of ad hoc formulas and centralize them in content-owned balance tables.
- [ ] Reprice top-end stars so raw firepower no longer dominates draft logic.
- [ ] Increase the practical upside of:
  - `system_leader + disciplined core`
  - same-team familiarity
  - calm/stable closers
  - sixth-man coverage
  - scouting and timeout adaptation
- [ ] Increase the practical downside of:
  - three-star patchwork rosters with no IGL
  - double-volatility cores
  - repeated one-note tactics that get read
  - poor substitute coverage when absence/slump events hit
- [ ] Validate cup MVP and annual top-10 formulas against impact-driven outputs, not raw firepower sort.
- [ ] Run seeded archetype sweeps for at least:
  - double-superstar weak-structure roster
  - balanced system/core roster
  - cheap depth/high-discipline roster

**Acceptance:**
- [ ] `donk + ZywOo` style rosters can win, but do not dominate seed sweeps by a runaway margin.
- [ ] A disciplined mid-budget roster can produce real championship runs.
- [ ] Substitute value shows up in both simulation and narrative outcomes.
- [ ] Awards do not collapse into a simple star-price ranking.

## Phase 4: UI

**Goal:** Turn the current single-cup prototype shell into a bracket-first three-year control room.

**Files:**
- [ ] Modify: `src/ui/csCupManagerUi.ts`
- [ ] Modify: `src/ui/styles.css`
- [ ] Modify: `src/app/browser.js`
- [ ] Modify: `src/app/game.ts`
- [ ] Test: `tests/app/three-year-flow.test.mjs`

- [ ] Replace the current single-cup nav model with three layers of progress:
  - global `S1 / S2 / S3`
  - local `Katowice / Cologne / Major`
  - screen-level `bracket -> prematch -> match -> awards`
- [ ] Turn the current bracket tree into the reusable cup hub:
  - dynamic winners/losers
  - current player path highlight
  - next opponent card
  - completed cup recap
  - trophy count to date
- [ ] Add a lightweight between-cup hub instead of a spreadsheet manager screen:
  - one or two event cards
  - roster condition snapshot
  - transfer/recovery decision surface
  - clear proceed action
- [ ] Upgrade the match room for 10-15 boxes:
  - score band
  - economy badge
  - timeout state
  - resolved log column
  - active decision column
  - box taxonomy styles
- [ ] Add dedicated annual awards and final chronicle screens, not just enlarged cup-awards cards.
- [ ] Preserve the existing dark broadcast tone and cup-specific accent tokens from the UI memo.

**Acceptance:**
- [ ] At any campaign point, the player can identify current season, cup, and phase immediately.
- [ ] Bracket updates come from simulation results, not static placeholders.
- [ ] Match-room UI still reads cleanly at 1280x720 and 1920x1080.

## Phase 5: 文本

**Goal:** Make the shipped build read like a CS manager game, not a prototype with generic combat prose.

**Files:**
- [ ] Modify: `src/content/events.ts`
- [ ] Modify: `src/content/match-beats.ts`
- [ ] Modify: `src/content/mechanic-events.ts`
- [ ] Modify: `src/content/awardsText.ts`
- [ ] Modify: `src/content/epilogue.ts`
- [ ] Modify: `docs/product-specs/GAMEPLAY.md`

- [ ] Normalize CS-facing Chinese terminology across draft, scouting, match, awards, and chronicle screens.
- [ ] Prefer concrete match language:
  - 默认控图
  - 爆弹
  - 补枪
  - 架点
  - 反清
  - 保枪
  - 回防
  - 假打 / 假转
  - 强起 / 半起 / 纯ECO
  - 暂停调整
- [ ] Remove generic lines that do not explain why a tactic worked or failed.
- [ ] Keep all real-name events inside the safety rules of `docs/product-specs/EVENTS.md`.
- [ ] Update `docs/product-specs/GAMEPLAY.md` so shipped match pacing says **10-15** boxes, not the old **7-10** default.

**Acceptance:**
- [ ] No golden-path screen contains placeholder text or obvious fake-CS wording.
- [ ] Decision results consistently name the winning and losing reasons.
- [ ] Final docs match shipped behavior.

## Phase 6: 打包

**Goal:** Ship a runnable app artifact.

**Files:**
- [ ] Modify: `package.json`
- [ ] Modify: `src/app/main.ts`
- [ ] Modify: `src/app/game.ts`
- [ ] Add the chosen desktop wrapper files for the final target
- [ ] Add packaging smoke coverage if the wrapper supports it

- [ ] Lock the final app target once:
  - default recommendation: **Electron wrapper**, because it matches the current JS/Node stack and avoids adding a second systems toolchain late
  - if the main agent finds an already-started wrapper in the repo, extend it instead of creating a parallel shell
- [ ] Add scripts for:
  - local dev
  - browser build
  - packaged app build
  - packaged app smoke test if feasible
- [ ] Verify save/load path behavior in packaged mode.
- [ ] Make app boot directly into the playable shell without requiring a local web server.

**Acceptance:**
- [ ] A clean environment can run the documented build flow and produce a runnable app.
- [ ] The packaged app can start a new run and complete at least one cup.
- [ ] No dev-only asset path or save-path bug appears in packaged mode.

## Phase 7: 验收

**Goal:** Close the MVP with one release bar instead of scattered prototype checks.

**Files:**
- [ ] Modify: `tests/app/three-year-flow.test.mjs`
- [ ] Modify: `tests/simulation/season.test.ts`
- [ ] Modify: `tests/simulation/match.test.ts`
- [ ] Modify: `tests/simulation/balance.test.ts`
- [ ] Update docs only if acceptance clarifications are needed

- [ ] Required automated commands:
  - `npm run check:docs`
  - `npm run test:architecture`
  - `npm run test`
  - `npm run build`
  - packaged app build command
- [ ] Required deterministic coverage:
  - seeded 9-cup full run
  - early-loss progression
  - annual awards generation
  - final chronicle generation
  - match-card structure checks
  - balance sweep checks
- [ ] Required manual coverage:
  - one first-cup win path
  - one first-cup early-exit path
  - one full Season 1 path
  - one complete 3-season path
  - one packaged-app smoke path

**Release gate:**
- [ ] No soft lock in the three-year golden path
- [ ] No match exceeds 5 choices
- [ ] No featured match falls outside 10-15 boxes
- [ ] No balance sweep shows star-stack dominance as the obvious best solution
- [ ] Packaged app launches and reaches gameplay

## Suggested Execution Order For The Main Agent

1. [ ] Phase 1 first pass: season/domain model and seeded 9-cup progression
2. [ ] Phase 2 first pass: BO5 match schema and 10-15 box structure
3. [ ] Phase 3 first pass: centralize balance tables and run archetype sweeps
4. [ ] Phase 4 first pass: bracket hub, between-cup hub, annual/chronicle screens
5. [ ] Phase 5 pass: terminology, narration, spec sync
6. [ ] Phase 6 pass: packaged app target and smoke flow
7. [ ] Phase 7 pass: automated + manual acceptance, fix blockers only

## Main Risks To Watch

- [ ] **State duplication risk:** leaving campaign truth in both `src/app/browser.js` and `src/simulation/*`.
- [ ] **Verbosity risk:** adding 10-15 boxes but filling them with generic filler instead of concrete CS action.
- [ ] **Balance illusion risk:** one golden-path run looks fine while seeded sweeps still show star-stack dominance.
- [ ] **UI density risk:** overloading one screen with bracket, transfers, awards, and chronicle details at once.
- [ ] **Packaging-late risk:** discovering save-path or asset-path bugs only after all gameplay work is done.

## Definition Of Done

- [ ] The game completes a three-season run end to end.
- [ ] All 9 cups use 8-team single-elimination brackets.
- [ ] Featured matches are BO5 with 10-15 event boxes and at most 5 choices.
- [ ] Bracket/timeline UI is the campaign spine.
- [ ] Balance no longer rewards brainless double-superstar stacking as the dominant strategy.
- [ ] Annual awards and final chronicle are present and readable.
- [ ] The build ships as a runnable packaged app.
