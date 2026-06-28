# v0.1 Playable Cup Finalization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish CS Cup Manager v0.1 so a player can select 6 players for 枪神队伍, complete the first cup, and see the cup champion plus cup MVP without dead buttons, obvious typos, or page-load failures.

**Architecture:** Preserve the existing no-dependency browser/Node shape unless the implementation owner explicitly decides to install a frontend toolchain. Keep dependencies flowing `app -> ui -> simulation -> domain -> content`, with UI rendering state and simulation/domain deciding outcomes.

**Tech Stack:** TypeScript-flavored source files executed by Node's strip-types support, static browser page served by `python3 -m http.server`, Node test runner, existing hygiene scripts.

---

## Scope Decisions

- v0.1 ships one complete cup first: draft -> bracket -> player match decisions -> offscreen AI matches -> cup awards.
- v0.1 uses 6-player rosters: 5 starters plus 1 substitute. This follows `docs/product-specs/ROSTER.md`, `UI_ART_REQUIREMENTS.md`, and the user acceptance target. Older five-player wording in `AGENTS.md` and `docs/superpowers/plans/2026-06-25-v0-1-playable-cup.md` should be treated as superseded for this finalization pass.
- The substitute must be selectable and visibly marked, but absence/injury substitution events can remain a data/spec hook until after the first cup is stable.
- Do not implement transfer windows, bidding wars, annual TOP 10, season-long growth/decline, full three-season chronicle, save-slot management, or live roster scraping in this pass. Keep their specs intact.
- Do not add online, multiplayer, betting, skins, gambling, accounts, or network-dependent gameplay.

## Current Baseline

Existing files already provide a partial implementation:

- `src/content/players.ts`, `src/content/teams.ts`, `src/content/traits.ts`, `src/content/events.ts`, `src/content/mechanic-events.ts`
- `src/domain/roster.ts`
- `src/simulation/rng.ts`, `src/simulation/draft.ts`, `src/simulation/cup.ts`
- `src/app/main.ts`, `src/app/game.ts`, `src/app/browser.js`
- `src/ui/styles.css`, `src/styles/cs-cup-manager.css`, `src/ui/csCupManagerUi.ts`
- `tests/domain/roster.test.ts`, `tests/simulation/cup.test.ts`, `tests/architecture/boundary.test.mjs`

Known gaps to close:

- The browser path currently jumps from bracket to final cup result. It does not expose a real playable first match with separate economy/tactic choices.
- Cup awards exist, but standings/prize placement and MVP presentation need to match the art/spec requirements more closely.
- There are two UI implementations (`src/app/main.ts` and `src/ui/csCupManagerUi.ts`/`src/app/browser.js`). Choose one active path for v0.1 and prevent stale demo code from confusing tests or manual QA.
- The existing Superpowers playable-cup plan still says five selected starters. Final implementation must use six selected players with one substitute.
- Current `npm run build` is blocked because `package.json` checks `src/app/browser.js`, but that file is not present in the current workspace. Fix the build script to check the active entry files, or restore the file only if it is still the intended browser entry.

## Phase 1: Current-State Repair

**Purpose:** Make the current app path explicit and remove the biggest sources of "button clicked, nothing meaningful happened."

**Files:**

- Modify: `src/app/main.ts`
- Modify: `src/app/game.ts`
- Modify: `src/simulation/cup.ts`
- Modify: `src/domain/roster.ts`
- Modify: `tests/domain/roster.test.ts`
- Modify: `tests/simulation/cup.test.ts`
- Optional modify or delete only if verified unused: `src/app/browser.js`, `src/ui/csCupManagerUi.ts`, `src/styles/cs-cup-manager.css`
- Read before changing imports: `docs/architecture/LAYERS.md`

**Implementation steps:**

- [ ] Confirm which browser entry is loaded by `index.html`. Expected active path: `src/app/main.ts`.
- [ ] Fix the build path mismatch: either update `package.json` so `npm run build` checks the active files (`src/app/main.ts`, `src/app/game.ts`, simulation files), or restore/replace `src/app/browser.js` if the team intentionally keeps it as a checked legacy bundle.
- [ ] Ensure every visible button in `src/app/main.ts` has a handled `data-action`: draft toggle, substitute selection, autofill/recommended roster, confirm roster, start/continue match, choose economy, choose tactic, timeout/skip timeout if shown, continue after match, continue to awards, restart.
- [ ] Keep draft validation at exactly 6 selected players, one selected substitute, total price <= `STARTING_BUDGET`.
- [ ] Ensure `createRoster` keeps 5 starters by excluding the substitute from `starters`.
- [ ] Ensure `autoFillAiTeams` creates seven AI teams, each with six players and five starters, with no drafted-player duplication.
- [ ] Decide whether `src/app/browser.js` and `src/ui/csCupManagerUi.ts` are legacy demos. If not used by `index.html`, either leave untouched but document as demo-only, or align their labels with six-player v0.1 if build scripts still check them.
- [ ] Keep all source imports within the layer rules.

**Automated acceptance:**

```sh
npm run test -- tests/domain/roster.test.ts tests/simulation/cup.test.ts
npm run test:architecture
npm run build
```

Expected: all commands exit 0.

**Manual acceptance:**

- Open the app through `npm run dev`.
- Click "推荐阵容"; exactly 6 slots fill and one is marked 替补.
- Click one filled slot to change substitute; visible substitute state changes.
- Click "确认阵容"; the app advances to the bracket.
- Click every visible button in the active path once; none should silently do nothing.

## Phase 2: Art and UI Finish

**Purpose:** Apply the art direction enough for the playable slice to feel like the intended esports manager, not a plain prototype.

**Files:**

- Modify: `src/ui/styles.css`
- Modify: `src/app/main.ts`
- Optional modify: `src/content/teams.ts` for team accent colors if missing
- Reference: `UI_ART_REQUIREMENTS.md`
- Reference: `docs/design-docs/art-direction/UI_ART_REQUIREMENTS.md` (same content as root copy)

**Required screens for v0.1:**

- S02 Draft Room
- S03 Cup Bracket
- S04 Scouting/pre-match event card, if implemented before match
- S05 Match Room
- S06 Post-Match Summary, if match summary is separate from cup awards
- S03b Cup Awards

**Implementation steps:**

- [ ] Add global CSS variables from UI art requirements: `#0D0E14`, `#13151F`, `#252A3D`, `#E8EBF5`, `#7A849E`, `#3E6FFF`, `#E84545`, `#28D99E`, `#F4B942`.
- [ ] Use consistent player-team highlighting: blue left stripe, blue ring/dot treatment, gold text only when 枪神队伍 wins.
- [ ] Draft screen must show a scrollable player list, budget meter, 6 roster slots, first 5 as 首发 and 6th/selected substitute as 替补.
- [ ] Bracket screen must show all 8 teams, current stage, player-team highlight, next opponent, and a clear next action.
- [ ] Match room must show score, round progress dots, economy indicator, vertical event cards, decision cards with gold accent, and a right-side or compact team-stat panel.
- [ ] Cup awards must show champion first, cup MVP immediately after, then final standings/prize placement. The MVP line must say it is selected across all eight teams if space allows.
- [ ] Avoid player photos, realistic portraits, guns as primary decoration, large marketing hero sections, nested cards, and decorative-only backgrounds.
- [ ] Keep desktop-first support at 1280x720 and 1920x1080. Mobile polish is not required for v0.1, but text still must not overlap at narrow browser widths.

**Automated acceptance:**

```sh
npm run build
npm run test:architecture
```

Expected: both pass.

**Manual acceptance:**

- At 1280x720, confirm draft slots, confirm button, and budget are visible without text overlap.
- At 1920x1080, confirm bracket and match room do not look sparse or like a landing page.
- Confirm event-card left borders use blue/green/red/gold consistently.
- Confirm all team color dots match the art requirements team color table.
- Confirm no visible UI text describes implementation details, keyboard shortcuts, or "demo shell" language.

## Phase 3: Gameplay Code

**Purpose:** Replace the current instant-cup jump with the smallest real playable cup flow.

**Files:**

- Modify: `src/app/game.ts`
- Modify: `src/app/main.ts`
- Modify: `src/simulation/cup.ts`
- Modify: `src/simulation/draft.ts`
- Modify: `src/simulation/rng.ts`
- Create or modify: `src/simulation/match.ts`
- Create or modify: `src/simulation/strategy.ts` or `src/simulation/tactics.ts`
- Create or modify: `src/simulation/impact.ts` or keep impact in `src/simulation/cup.ts` if small
- Modify: `tests/simulation/cup.test.ts`
- Create: `tests/simulation/match.test.ts`
- Create: `tests/simulation/acceptance-v0-1.test.ts`

**v0.1 gameplay to implement first:**

- [ ] Draft 6 players under budget, with 5 active starters and 1 substitute.
- [ ] Build an 8-team single-elimination IEM Katowice cup.
- [ ] Show the player's first cup match instead of resolving it invisibly.
- [ ] Opening match decision is split into economy first and tactic second.
- [ ] Match resolves as first to 3 compressed rounds, maximum 5 compressed rounds.
- [ ] Player-facing matches display 7-10 event cards where practical; for v0.1 acceptance, the first match must have at least one opening decision card, one mid-match/pressure event, and one closing result card.
- [ ] Add at least these tactic choices: rush site, default contact, slow lurk, fake rotate.
- [ ] Add defense/opponent responses through deterministic seeded AI, using readable matrix results from `docs/product-specs/MECHANICS.md`.
- [ ] Add one timeout opportunity when the player is behind, a volatile chain triggers, or opponent momentum appears. If full timeout UI is too large, implement one clear decision card with tactical reset / emotional reset / discipline reset / skip.
- [ ] Resolve non-player matches quickly without match prompts.
- [ ] If 枪神队伍 is eliminated, fast-forward the remaining bracket and still show champion and cup MVP.
- [ ] If 枪神队伍 wins, continue through semifinal/final or at minimum support repeated "next player match" until cup completion. No dead end after the first win.
- [ ] Track simple player impact per match so cup MVP can come from any team, not only the champion.

**Mechanics to specify but not force into v0.1 implementation:**

- Transfer window trading and bidding war.
- Season-end growth/decline.
- Annual TOP 10 and player of the year.
- Full three-season chronicle.
- Major condition crossing cups/seasons.
- Detailed coach philosophy modifiers beyond small timeout/event hooks.
- Full strategy memory across multiple cups. For v0.1, one scouting card or one repeated-tactic warning is enough if it is already cheap.
- Absence/injury substitute event chains. Keep substitute support in roster data, but do not block first-cup completion on these events.

**Automated acceptance:**

```sh
npm run test -- tests/simulation/match.test.ts tests/simulation/cup.test.ts tests/simulation/acceptance-v0-1.test.ts
npm run test
npm run build
npm run test:architecture
```

Expected: all commands exit 0.

**Manual acceptance path:**

1. Start from a clean page load.
2. Select or autofill 6 players.
3. Confirm roster.
4. Start IEM Katowice.
5. Enter the first 枪神队伍 match.
6. Choose economy.
7. Choose tactic.
8. Continue through all visible decisions until match ends.
9. If the team wins, continue next bracket step until the cup ends.
10. If the team loses, confirm the remaining cup resolves quickly.
11. Confirm final cup screen shows champion, cup MVP, runner-up/semifinalists or equivalent standings, and 枪神队伍 placement.

## Phase 4: Text and Typo Pass

**Purpose:** Remove obvious copy errors and make tactical feedback readable in Chinese.

**Files:**

- Modify: `src/content/events.ts`
- Modify: `src/content/mechanic-events.ts`
- Modify: `src/content/awardsText.ts`
- Modify: `src/content/season-quotes.ts`
- Modify: `src/content/personality-voice.ts`
- Modify: `src/app/main.ts` only for UI labels still embedded there
- Modify: `src/simulation/cup.ts` only for generated match/award text still embedded there
- Reference: `docs/golden-principles/UI_TEXT.md`
- Reference: `docs/product-specs/EVENTS.md`
- Reference: `docs/product-specs/AWARDS.md`

**Implementation steps:**

- [ ] Replace stale words like "demo", "UI shell", "placeholder", and English-only debug text from player-facing screens.
- [ ] Standardize team name as `枪神队伍`.
- [ ] Standardize cup names for v0.1 as IEM Katowice first; leave IEM Cologne/Major copy available but not required in first-cup acceptance.
- [ ] Ensure every decision result explains why it helped or failed with at least one visible factor: tactics, equipment, cohesion, discipline, star influence, scouting, or economy.
- [ ] Avoid defamatory or private-life claims about real players. Use only form, pressure, travel, tactical conflict, public expectation, or in-server personality flavor.
- [ ] Check common labels: 火力, 战术执行, 凝聚力, 纪律, 预算, 首发, 替补, 冠军, 杯赛 MVP, 名次, 奖金.
- [ ] Keep stat delta lines compact and consistent, for example `战术执行 +4 · 凝聚力 -2`.
- [ ] Ensure button labels are commands, not explanations: `确认阵容`, `开始比赛`, `继续`, `使用暂停`, `跳过暂停`.

**Automated acceptance:**

```sh
npm run check:docs
npm run build
```

Expected: both pass.

**Manual acceptance:**

- Read every screen on the golden path aloud once: draft, bracket, match, post-match/awards.
- Confirm there are no obvious typos, mixed stale labels, or debug/prototype wording.
- Confirm Chinese and English labels, where paired, do not overflow buttons.
- Confirm no event text invents real-world misconduct or private allegations.

## Phase 5: Acceptance and Release Gate

**Purpose:** Prove the first cup can be completed by a player, not just by unit tests.

**Files:**

- Create or modify: `docs/QA-v0-1-playable-cup.md`
- Create or modify: `tests/simulation/acceptance-v0-1.test.ts`
- Modify code files only to fix acceptance failures found during this phase.

**Required automated commands:**

```sh
npm run check:docs
npm run test:architecture
npm run test
npm run build
npm run gc
```

Expected: all commands exit 0. If `npm run gc` reports unrelated documentation findings, record them in the QA note and do not block v0.1 unless they break this playable-cup flow.

**Required browser QA:**

```sh
npm run dev
```

Open the printed local URL, expected from current scripts: `http://127.0.0.1:5174`.

Manual checklist:

- [ ] Page opens without a console-blocking runtime error.
- [ ] Player can select 6 players manually.
- [ ] Recommended roster fills 6 legal players and remains under budget.
- [ ] Player can mark/alter the substitute.
- [ ] Confirm roster button is disabled before 6 legal players and works after 6 legal players.
- [ ] Bracket shows 8 teams in a single-elimination cup.
- [ ] Start/continue match button opens the first player match.
- [ ] Economy choice changes the match state and cannot be clicked twice for the same pending choice.
- [ ] Tactic choice changes the match state and appends/resolves a decision card.
- [ ] Timeout, if shown, can be used or skipped; spent timeout is visibly unavailable.
- [ ] Match ends with a clear win/loss score.
- [ ] Cup can finish after win path or loss path.
- [ ] If player loses early, AI matches fast-forward and the cup still has champion and MVP.
- [ ] Cup awards show champion and cup MVP prominently.
- [ ] 枪神队伍 placement is visible.
- [ ] No visible button on the golden path does nothing.
- [ ] No obvious typo appears on the golden path.
- [ ] 1280x720 and 1920x1080 layouts have no severe overlap.

**Final handoff note must include:**

- Commands run and results.
- Browser QA path taken, including whether it was win path, loss path, or both.
- Any accepted limitations, especially deferred mechanics.

## Highest Risks

- **State-machine risk:** The current app already renders draft/bracket/awards, but the match step is not yet truly interactive. The largest risk is ending with a prettier instant resolver instead of a playable first match.
- **Scope risk:** Mechanics specs are broad. The implementation must not block v0.1 on transfers, annual awards, three-season chronicles, or deep strategy memory.
- **Dual-entry risk:** `src/app/main.ts`, `src/app/browser.js`, and `src/ui/csCupManagerUi.ts` can drift. Pick one active browser path and make build/QA agree with it.
- **Roster-rule risk:** Older docs say five starters; current target says six players. Tests, UI, and text must consistently say six selected players, five starters, one substitute.
- **Text-quality risk:** The game is text-first. Awkward or contradictory match feedback will make correct mechanics feel broken.
