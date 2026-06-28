# Three-Year Mode UI Execution Memo

## Purpose

This memo translates the current browser prototype and UI art requirements into an execution-ready visual and interaction direction for the full three-year mode. It is intentionally grounded in the current prototype so future work can extend the existing UI instead of replacing it.

Primary references reviewed for this memo:

- `UI_ART_REQUIREMENTS.md`
- `docs/design-docs/art-direction/UI_ART_REQUIREMENTS.md`
- `src/app/browser.js`
- `src/ui/styles.css`
- `docs/HANDOFF_PROGRESS.md`

## Current UI Audit

### Reusable Now

1. `flowbar` and step dots:
   the top progress bar already establishes a strong "tournament control room" frame and should remain the persistent navigation language.
2. Shared panel system:
   `.panel`, `.primary`, `.ghost`, the dark palette, and the typography hierarchy already match the art-direction docs well enough to serve as the base shell for all future screens.
3. Tree bracket foundation:
   `.bracket-tree`, `.bracket-column`, `.connector`, `.champion-podium`, and the `player-team` highlight already prove the right composition for cup-centered progression.
4. Match reading pattern:
   the current two-column match layout already separates "resolved history" from "current decision", which is the correct mental model for a text-first manager game.
5. Awards tone:
   the current trophy and MVP panels already lean ceremonial rather than utilitarian, so they are a good base for cup awards and annual reveals.

### Not Enough Yet

1. The prototype is still a single-cup state machine:
   `draft -> bracket -> prematch -> match -> awards` is clean, but it does not yet express three seasons, three cups per season, or between-cup recovery and transfer beats.
2. The bracket is static:
   the bracket tree looks right, but it does not yet show played scores, eliminated teams, advancing paths, or "next match" focus states.
3. Match density is too thin:
   the current match flow only supports a handful of cards. The full mode needs 10-15 event boxes per featured match with no more than 4-5 player decisions inside them.
4. Match UI lacks state instrumentation:
   no round dots, no economy tier badges, no distinct timeout layer, and no richer event-type styling beyond a generic resolved card.
5. Annual and endgame surfaces are missing:
   there is no annual club-of-the-year reveal, top-10 ladder, season wrap, or three-year chronicle view yet.
6. Desktop packaging context is undefined:
   the current browser prototype works in a tab, but the shipped app needs desktop-specific windowing, save feedback, and session continuity expectations.

## Direction Summary

The game should feel like a quiet esports operations desk with occasional ceremonial spikes. Most of the time the player is reading, comparing, and deciding. The big visual moments are:

- entering a new cup
- making 1-2 pivotal decisions during a featured match
- seeing cup awards
- seeing annual awards
- reaching the final three-year chronicle

The design should therefore stay compact and information-forward during active play, then widen, brighten, and slow down during reveal screens.

## 1. Cup-Centered Bracket Direction

### Role of the Bracket Screen

The bracket screen should become the central hub between cup phases, not just a pre-match splash. For each cup it should handle:

- full eight-team tree
- completed results
- current player path
- next opponent callout
- sidecar context for cup stakes

### Desktop Layout

Use a three-zone composition on wide screens:

1. Left rail:
   compact cup meta panel with season/cup label, cup prestige, prize pool, and a one-line status such as `Quarterfinal ready` or `Eliminated in semifinal`.
2. Center:
   the bracket tree remains the dominant visual surface.
3. Right rail:
   next-match panel, recent result panel, and a compact roster-status snapshot.

The current `bracket-tree` CSS and `champion-podium` block are reusable as the center zone. The new work is mostly in adding rails and state variants, not replacing the tree.

### Required Bracket States

- Unplayed match: both rows neutral, score shown as `--`
- Played match: winner bright, loser at 50-60% opacity with strikethrough
- Player path: blue left stripe plus faint blue glow
- Cup champion path: connector lines brighten along the winning route
- Current focus match: slightly heavier border and darker local background

### Cup Identity

Keep the existing dark base, but swap accent treatments by cup:

- Katowice: cold blue highlights
- Cologne: restrained amber highlights
- Major: blue + gold with the heaviest ceremonial treatment

Do this through token swaps, not new layouts.

## 2. Match Room for 10-15 Event Boxes

### Content Rhythm

Each featured match should contain 10-15 boxes total:

- 6-9 passive event boxes
- 3-5 decision boxes
- maximum 1 timeout overlay

That keeps the match readable while making it feel fuller than the current prototype.

### Recommended Desktop Layout

Keep the current two-column structure but make it more explicitly staged:

1. Top scoreboard band:
   team names, score, round dots, economy badges, timeout status.
2. Left main log:
   scrollable event timeline containing all resolved boxes.
3. Right active stack:
   current box, compact team stats, and a small legend for event colors.
4. Conditional bottom drawer:
   only appears for choice-heavy moments that need 3-4 horizontally comparable options.

The current `match-layout`, `match-log`, `current-card`, and `scoreboard` are reusable. The missing piece is card taxonomy and richer state display.

### Event Box Taxonomy

- Neutral intel: blue stripe
- Positive swing: green stripe
- Negative swing: red stripe
- Player decision: gold stripe
- Clutch moment: gold stripe plus `[1v2]` or `[1v3]` mono badge
- Economy swing: grey or amber secondary badge inside header

### Recommended Match Sequence

1. Opening economy call
2. Early map-control beat
3. Opponent response beat
4. First positive or negative momentum swing
5. Tactical decision
6. Economy consequence beat
7. Mid-match pressure beat
8. Timeout trigger or morale beat
9. High-risk execute or anti-force scenario
10. Clutch or late-round trade sequence
11. Match-point setup
12. Final resolution

Cards 13-15 are optional inserts for very close matches or Major finals.

### What Current UI Lacks Most Here

- the event feed needs stronger distinction between resolved cards and active decision cards
- the score area needs progress dots and economy state so the player can read momentum at a glance
- decision density should stay low even when total card count grows; the game is strongest when most boxes are narrative payoffs to a few meaningful calls

## 3. Three-Year Season Flow

### Structural Rule

The full campaign should read as nine cups arranged inside three annual arcs, with each season carrying its own summary and each cup carrying its own bracket identity.

### Full Loop

1. New game
2. Initial draft
3. Season 1:
   Katowice -> Cup Awards -> Transfer/Recovery Hub -> Cologne -> Cup Awards -> Transfer/Recovery Hub -> Major -> Cup Awards -> Annual Awards -> Season Summary
4. Season 2:
   same loop, but no full redraft; player starts from retained roster plus transfer changes
5. Season 3:
   same loop -> Career Chronicle

### Between-Cup Hub

This is the missing interaction layer between cups. It should be a lightweight hub, not a management spreadsheet. Recommended composition:

- center: mini bracket recap or cup poster tile for the completed event
- left: inbox/event stack with 1-2 narrative beats
- right: transfer options, roster condition tags, current budget, next cup teaser
- footer actions: `Proceed to Next Cup`, `Open Transfer Window`, `Review Season`

This hub should share panel styling with the bracket screen so the campaign feels continuous.

### Progress Language

Replace the current single-cup step dots with a nested progression model:

- global strip: `S1 / S2 / S3`
- local strip: `Katowice / Cologne / Major`
- screen step dots: current local flow such as bracket -> prematch -> match -> awards

The idea is to preserve the clarity of the current `flowbar` while letting it scale.

## 4. Annual Awards Direction

### Screen Job

Annual awards should be the emotional midpoint between cup play and offseason decisions. It is not a dashboard. It is a reveal sequence.

### Composition

1. Hero panel:
   `Club of the Year` with cup-result icons for all three annual cups.
2. Top 10 list:
   ranks 10 to 1 with podium escalation on the top three rows.
3. Transparency strip:
   impact formula and ranking factors in small text.
4. Continue action:
   pushes into season summary, not back into tournament UI.

### Reuse and Gap

Reusable from current UI:

- trophy panel tone
- gold highlight language
- dark panel system

Not enough yet:

- no reveal hierarchy between club winner and player ranking
- no row system for 10 ranked players
- no player's-team identification ring inside ranking rows

### Execution Note

The annual screen should be vertically scrollable even on desktop. That gives room for ceremony without forcing every reveal into one cramped viewport.

## 5. Career Chronicle Direction

### Screen Job

This is the capstone screen after Season 3. It should answer one question quickly: what kind of three-year career did the player build?

### Composition

1. Championship tally at the top:
   largest number on screen.
2. Three-row season matrix:
   each season shows Katowice, Cologne, Major outcomes in one glance.
3. Horizontal timeline:
   championship, collapse, MVP, and transfer milestones.
4. Four achievement cards:
   best player, best call, worst collapse, manager grade.
5. Closing quote block and replay CTA.

### Current Reuse

The current CSS palette, trophy treatment, mono numbers, and panel rhythm are all reusable. Nothing in the current prototype yet covers the timeline or three-row season matrix, so those need new visual primitives.

### Chronicle Rule

Do not turn the chronicle into a lore page. It must stay legible in under two minutes. The player should be able to scan:

- titles won
- most important highs and lows
- who defined the run
- final grade

## 6. Packaged Desktop Experience

### Target Feel

The shipped app should feel like a compact offline management game, not a web page trapped in a desktop shell.

### Windowing and Layout

- Default window should open at a comfortable landscape size around laptop-friendly 16:10 or 16:9 proportions.
- Minimum window width should still preserve the two-column match and bracket reading modes before collapsing.
- The initial desktop target should be mouse-first; touch is secondary.

### Desktop-Specific UX Requirements

1. Persistent session clarity:
   show last save timestamp and current season/cup context on title or continue surfaces.
2. Save feedback:
   use toast confirmation for save/load, never silent state changes.
3. Pause/menu behavior:
   `Esc` should consistently open a compact command menu with save/load/settings/quit.
4. Offline trust:
   the app should clearly read as local-first and deterministic; no empty network placeholders.
5. Resume comfort:
   on reopen, the player should land back on the exact campaign node they left, not at title by default.

### Visual Adjustments for Packaging

- reduce "browser page" feeling by keeping the main shell height locked to the window with internal panel scrolling
- keep top navigation fixed during long award and chronicle screens
- ensure modal overlays darken the window edge-to-edge rather than feeling like floating website popups

## Execution Priorities

### P0

1. Expand the navigation model from single-cup flow to three-year flow.
2. Turn the bracket screen into a reusable cup hub with dynamic states.
3. Expand match presentation to 10-15 boxes with 3-5 decisions max.

### P1

1. Add annual awards and season summary as distinct reveal surfaces.
2. Add the between-cup transfer/recovery hub.
3. Add cup-specific accent token sets.

### P2

1. Add final career chronicle.
2. Add desktop-shell specific save/resume/menu polish.
3. Add lower-priority visual micro-animations.

## Practical Reuse Map

### Keep and Extend

- `renderNav` structure
- `bracket-tree` composition
- `match-layout` split
- `scoreboard` mono score treatment
- `.panel` / `.primary` / `.ghost` component language
- player-team blue highlight rule

### Replace or Deepen

- fixed `S1 · KATOWICE` nav text -> multi-layer campaign progress
- static bracket data -> dynamic result-aware states
- 5-card match flow -> 10-15 box pacing model
- simple awards grid -> cup awards, annual awards, and chronicle as separate hierarchy-specific surfaces

## Final Design Stance

The full three-year mode should not chase spectacle everywhere. It should be dense during play, ceremonial during reveals, and always readable before it is flashy. The current prototype already has the right bones; the next phase is to add campaign-scale structure and state-rich presentation without abandoning that restraint.
