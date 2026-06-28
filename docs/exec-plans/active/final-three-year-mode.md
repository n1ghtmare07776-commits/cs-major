# Final Three-Year Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current one-cup playable prototype into a complete three-season, nine-cup CS manager run that can be finished end to end with clear bracket UI, fuller match storytelling, tuned balance, packaged app delivery, and a final chronicle-style handoff.

**Architecture:** Preserve the existing layered shape `app -> ui -> simulation -> domain -> content`. The three-year loop must be driven by deterministic simulation state, while UI only renders season/cup/match state and player choices. Content owns teams, players, event text, terminology, and tuning tables.

**Tech Stack:** Browser-first TypeScript/JS app, static/local app shell, Node test runner, zero-network local save/package flow.

---

## Plan Intent

This plan supersedes the prototype-only horizon of [v0-1-playable-cup-finalization.md](/Users/didi/Desktop/major/docs/exec-plans/active/v0-1-playable-cup-finalization.md) for the "final three-year mode" milestone, but it does not erase that file's first-cup quality bar.

The work should be staged so the existing golden path never regresses:

1. keep the current first-cup flow playable,
2. add the full three-year campaign spine,
3. deepen match presentation and balance,
4. polish text, packaging, and final acceptance.

## Source Alignment

- `AGENTS.md`: keep cups at 8 teams, single elimination, under-20-minute campaign, deterministic seeded simulation, single-player scope.
- `docs/HANDOFF_PROGRESS.md`: treat current state as "first cup prototype complete, three-year mode not started."
- `docs/product-specs/GAMEPLAY.md`: three seasons, three cups per season, annual awards, final chronicle.
- `docs/product-specs/MECHANICS.md`: chemistry, strategy memory, timeout options, impact rating, coach philosophy hooks.
- `docs/product-specs/ROSTER.md`: 6-player roster shape for the current product direction: 5 starters + 1 substitute.
- `docs/product-specs/EVENTS.md`: events must change gameplay state, not just flavor.
- `docs/product-specs/AWARDS.md`: cup MVP, annual best club, annual top 10, three-year chronicle.
- `UI_ART_REQUIREMENTS.md`: bracket-first tournament UI, esports broadcast tone, S03/S03b/S07/S08/S09 visual targets.

## Scope Resolution

- **Resolved:** final mode uses **three seasons, nine cups total**.
- **Resolved:** team size remains **5 starters + 1 substitute**; this is compatible with `AGENTS.md` because v0.1 still fields five starters.
- **Resolved:** cups remain **8-team single elimination** in all three years.
- **Resolved:** player-facing match flow expands to **10-15 event cards per match** for final mode, even though older spec text still says 7-10 as the default rhythm. Update the gameplay spec during implementation so product docs and shipped behavior match.
- **Resolved:** between-cup navigation must center on the **bracket/tournament timeline UI**, not a spreadsheet-like management hub.

## P0 / P1 Definition

### P0 Must Ship

- Three-year season state machine that can complete all 3 seasons and 9 cups.
- Cup-to-cup bracket/timeline UI that always shows where the player is in the current season.
- Player-facing matches expanded to 10-15 event cards with no more than 5 decision cards.
- Readable numeric rebalance so double-star openings are strong but not dominant.
- CS-native Chinese terminology pass across all player-facing match and tournament text.
- Local app packaging flow that another user can run without source edits.
- Final acceptance pass covering win path, loss path, yearly summary, and career-end chronicle.

### P1 Can Follow After P0

- Richer transfer-window negotiation depth beyond one lightweight post-cup action.
- More varied annual awards presentation and extra chronicle flavor scenes.
- Additional event-library breadth once the first stable 10-15 card structure lands.
- Extra presentation polish such as transitional animations, advanced toast systems, and save-slot UX expansion.
- Deeper coach philosophy differentiation if it risks delaying the full three-year loop.

## File Structure Map

Expected primary implementation surface:

- `src/app/`
  - campaign bootstrapping, routing/state persistence, packaging entry wiring
- `src/ui/`
  - bracket/timeline screens, cup-between-cup flow, match-room rendering, annual/career summaries
- `src/simulation/`
  - season state machine, cup progression, event-card sequencing, balance tables, impact/awards calculation
- `src/domain/`
  - campaign state types, season/cup enums, result records, progression invariants
- `src/content/`
  - terminology strings, event library, tuning constants, awards copy, timeline labels
- `docs/product-specs/`
  - spec alignment updates where shipped behavior intentionally changes older wording
- `tests/`
  - deterministic simulation, architecture boundaries, browser-flow or UI-state acceptance coverage

## Phase 1: Three-Year Campaign Spine

**Priority:** P0

**Outcome:** the game can progress from Season 1 Katowice through Season 3 Major and terminate cleanly with persistent records.

### Required work

- [ ] Define a single campaign state machine for:
  - season index `1..3`
  - cup order `Katowice -> Cologne -> Major`
  - cup phases `bracket -> match -> cup_awards -> between_cups`
  - season phases `season_start -> cup_loop -> annual_awards -> season_summary -> next_season`
  - terminal phase `career_chronicle`
- [ ] Add deterministic progression records for:
  - each cup bracket result
  - cup MVP
  - player team placement
  - annual standings inputs
  - chronicle-worthy events
- [ ] Decide exactly when roster management is allowed:
  - season start
  - between cups
  - offseason
- [ ] Keep campaign runtime under 20 minutes by fast-resolving offscreen matches and minimizing nonessential blocking prompts.

### Acceptance bar

- [ ] A seeded run can finish 9 cups without state dead-ends.
- [ ] Elimination in any cup still advances correctly to cup awards, between-cup flow, and next cup.
- [ ] End of Season 1 and Season 2 both branch into annual awards and then resume the next season.
- [ ] End of Season 3 lands in a final career chronicle instead of recycling back to season start.

## Phase 2: Cup-to-Cup Bracket and Timeline UI

**Priority:** P0

**Outcome:** the player always understands current season, current cup, bracket status, next opponent, past results, and next action.

### Required work

- [ ] Turn the current bracket tree into a reusable tournament view model and UI surface.
- [ ] Add a between-cup screen that still feels bracket-centric:
  - previous cup champion/MVP recap
  - next cup card
  - yearly progress strip showing all 3 cups
  - current season marker
  - one clear action to proceed into event/transfer/prep
- [ ] Support dynamic bracket updates:
  - quarterfinal winners
  - semifinal winners
  - champion slot
  - player-team highlight state
- [ ] Add yearly context without breaking scanability:
  - Season 1/2/3 label
  - cup index within season
  - trophy count to date

### P1 add-ons

- [ ] Richer historical bracket recall for previously completed cups.
- [ ] Expanded transitions and motion treatment from the UI art doc.

### Acceptance bar

- [ ] At any point in the campaign, the player can tell which cup they are in within 3 seconds.
- [ ] After a cup ends, the next screen shows both the completed cup result and the next cup destination.
- [ ] Bracket display updates from actual results rather than static placeholders.

## Phase 3: 10-15 Event Card Match Flow

**Priority:** P0

**Outcome:** player-facing matches feel like compressed CS stories rather than 3-5 isolated prompts.

### Required work

- [ ] Expand each player-facing match to **10-15 cards** total.
- [ ] Cap player choice density at **5 decision cards max**.
- [ ] Split card types into at least:
  - opening/economy card
  - opening tactic card
  - standard combat narration card
  - pressure/swing card
  - timeout or crisis card
  - clutch/closing card
- [ ] Ensure most cards are narrative-state beats, not choices.
- [ ] Add more concrete CS event phrasing:
  - multi-kill moments
  - trade kills
  - site hit success/failure
  - retake/save/force-buy pressure
  - fake rotate / default control / anti-eco / bonus gun style beats
- [ ] Make each card resolve with compact feedback tied to actual simulation levers.

### Design guardrails

- Ordinary cards should do most of the storytelling work.
- Decision cards should matter more than ordinary cards.
- One timeout only.
- One high-risk drama chain max per player-facing match.
- Loss of control remains rare and explicitly explained.

### Acceptance bar

- [ ] A normal match presents 10-15 cards.
- [ ] No match asks the player for more than 5 decisions.
- [ ] At least half the non-decision cards mention concrete CS actions rather than generic "the round swings" language.
- [ ] A stomp can be shorter in feel, but the rendered card count still fits the 10-15 target through concise narration and fast resolution.

## Phase 4: Balance and Tuning Pass

**Priority:** P0

**Outcome:** roster construction, chemistry, discipline, economy, substitute value, and events all materially affect outcomes.

### Required work

- [ ] Re-tune player prices and ratings so two ultra-stars do not become the obvious best opening every run.
- [ ] Increase the payoff of:
  - system leader + disciplined core
  - real-core familiarity
  - strong substitute coverage
  - scouting and timeout adaptation
- [ ] Reduce pure firepower dominance by making discipline, tactics, and cohesion more visible in close checks.
- [ ] Validate impact rating outputs so cup MVP and annual top 10 feel plausible.
- [ ] Run multiple seeded simulations for:
  - budget stress
  - champion distribution
  - upset frequency
  - chronicle variety

### P1 add-ons

- [ ] More differentiated role weighting by entry / closer / caller / AWP archetype.
- [ ] Longer-horizon market value movement tied to annual awards.

### Acceptance bar

- [ ] A roster with perfect stars but poor chemistry does not dominate most seeds.
- [ ] A disciplined mid-priced roster can produce viable cup runs.
- [ ] Substitute-related events create real upside for carrying a useful sixth player.
- [ ] MVP and annual top-10 outputs are not trivially identical to raw firepower rankings.

## Phase 5: CS Terminology and Text Pass

**Priority:** P0

**Outcome:** the game reads like a CS-themed management game written for players who know the scene.

### Required work

- [ ] Standardize player-facing Chinese terminology for:
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
- [ ] Remove generic or mistranslated wording in:
  - match event cards
  - scouting cards
  - timeout choices
  - cup/annual awards lines
  - between-cup summaries
- [ ] Keep all real-player event writing within the safety rules in `EVENTS.md`.
- [ ] Ensure every important decision result names at least one concrete reason it worked or failed.

### P1 add-ons

- [ ] More team/personality-specific voice differentiation.
- [ ] Extra bilingual flavor where it improves esports-broadcast tone.

### Acceptance bar

- [ ] A CS-aware reader should not trip over obvious fake terminology on the golden path.
- [ ] Choice results consistently explain why the play won or failed.
- [ ] No player-facing text reads like debug copy or placeholder copy.

## Phase 6: Lightweight App Packaging

**Priority:** P0

**Outcome:** the project can be handed off as a runnable packaged app, not only as a dev workspace.

### Required work

- [ ] Define the shipping target:
  - static browser bundle plus instructions, or
  - desktop wrapper if already justified by existing setup
- [ ] Add/verify the minimum commands:
  - `npm run dev`
  - `npm run build`
  - package/export command for handoff
- [ ] Produce a packaging checklist:
  - fresh clone/install
  - build succeeds
  - packaged artifact launches
  - packaged artifact can start a new run and finish at least one cup
- [ ] Document exactly what is bundled and what is not.

### P1 add-ons

- [ ] Better save-file location UX.
- [ ] Optional icon/splash/installer polish.

### Acceptance bar

- [ ] A clean environment can produce a runnable artifact from the documented command flow.
- [ ] The packaged build preserves local save behavior and core campaign flow.

## Phase 7: Final Acceptance

**Priority:** P0

**Outcome:** the team has one concrete release gate for "final three-year mode" instead of scattered prototype checks.

### Required automated checks

- [ ] `npm run check:docs`
- [ ] `npm run test:architecture`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] any added packaging verification command

### Required manual QA

- [ ] New run: draft legal roster, complete first cup, proceed into second cup.
- [ ] Mid-campaign run: finish an entire season and view annual awards.
- [ ] Long run: finish all three seasons and view the career chronicle.
- [ ] Loss path: get eliminated early and confirm flow still progresses correctly.
- [ ] Win path: win a cup and confirm champion, MVP, placement, and next-cup transition.
- [ ] Text pass: spot-check match room, bracket, annual awards, and chronicle for terminology quality.
- [ ] UI pass: verify bracket/timeline readability at 1280x720 and 1920x1080.

### Release checklist

- [ ] P0 items all complete.
- [ ] Known P1 gaps explicitly documented.
- [ ] No dead buttons on the three-year golden path.
- [ ] No campaign-softlock bug in seeded regression tests.
- [ ] Chronicle includes all 9 cups, annual best clubs, annual top 10 lists, and final trophy count.

## Recommended Delivery Order

1. **P0:** campaign spine
2. **P0:** dynamic bracket/timeline UI
3. **P0:** 10-15 card match flow
4. **P0:** balance pass
5. **P0:** CS terminology/text pass
6. **P0:** packaging
7. **P0:** final acceptance
8. **P1:** extra transfer depth, presentation polish, extended content breadth

## Highest Scope Risks

1. **Campaign-spine risk:** if season progression is bolted on top of the current cup prototype instead of becoming the source of truth, the project will accumulate state dead-ends and duplicate result logic.
2. **Match-volume risk:** expanding to 10-15 cards can easily become verbose or repetitive if card taxonomy and decision density are not controlled.
3. **Balance risk:** more events and more cups increase variance; without simulation sweeps, star-heavy drafts may still trivialize the mode.
4. **UI-density risk:** trying to show bracket, season progress, transfers, awards, and chronicle on the same surfaces can produce clutter and weaken the esports-broadcast feel.
5. **Packaging risk:** if packaging is left to the very end, the project may "work in dev only" and miss file-path/save-path issues.

## Notes For The Next Implementer

- Do not start with transfer-market ambition. The core promise is a complete three-year run.
- Protect the existing first-cup golden path while broadening the campaign.
- Update product specs when final shipped behavior intentionally diverges from prototype wording, especially the 7-10 vs 10-15 event-card count.
- Treat this document as the milestone plan and keep [v0-1-playable-cup-finalization.md](/Users/didi/Desktop/major/docs/exec-plans/active/v0-1-playable-cup-finalization.md) as the prototype stabilization reference.
