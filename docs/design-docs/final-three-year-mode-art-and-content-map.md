# Final Three-Year Mode Art And Content Map

## Purpose

This document turns the current UI prototype, event libraries, and art requirements into a single execution map for the full three-year mode. It is written for the main implementation agent so UI work, text wiring, and event pacing can be extended from the current browser prototype instead of replaced.

Primary references reviewed:

- `UI_ART_REQUIREMENTS.md`
- `docs/design-docs/three-year-mode-ui-execution-memo.md`
- `docs/design-docs/index.md`
- `src/app/browser.js`
- `src/ui/styles.css`
- `src/content/events.ts`
- `src/content/mechanic-events.ts`
- `docs/HANDOFF_PROGRESS.md`

## 1. What Existing UI Can Be Reused

The current prototype already contains the correct visual grammar for a text-first esports manager. The right move for three-year mode is extension, not replacement.

### Reuse as-is or with only token/state expansion

1. `flowbar` + `step-dots`
   - Keep as the persistent top navigation language.
   - Extend from one local cup flow to a nested model:
     - global: `S1 / S2 / S3`
     - cup: `Katowice / Cologne / Major`
     - local screen flow: `bracket -> prematch -> match -> awards`

2. `screen`, `topbar`, `panel`, `panel-title`, `primary`, `ghost`
   - These already match the dark control-room direction in `UI_ART_REQUIREMENTS.md`.
   - Reuse for transfer hubs, annual awards, chronicle, inbox/event stacks, and save feedback.

3. `bracket-tree`, `bracket-column`, `bracket-match`, `bracket-team`, `champion-podium`
   - Keep as the base cup hub.
   - Add state variants instead of redesigning:
     - played / unplayed
     - winner / loser
     - player path
     - current next match focus
     - champion route glow

4. `match-layout`, `scoreboard`, `match-log`, `current-card`, `choice-list`
   - This is already the right reading pattern for featured matches.
   - The full mode should widen it into a richer match room, not invent a new structure.

5. `awards-grid`, trophy tone, MVP panel language
   - Reuse for cup awards directly.
   - Annual awards can inherit the same ceremonial tone with a taller, scrollable composition.

6. Player-highlight language
   - The existing player-team emphasis plus the global “枪神队伍” rules from `UI_ART_REQUIREMENTS.md` should stay unified across bracket, rankings, awards, and chronicle.

### Reuse with expansion, not replacement

1. Draft room shell
   - The roster list, right-side summary, and budget language are reusable for a between-cups transfer hub.
   - The transfer hub should feel like “draft room after the season started,” not a separate product.

2. Prematch single-panel focus screen
   - The current prematch event panel is a valid template for:
     - scouting choice
     - cup-flavor intro
     - rare emotional scenes before finals
   - Only the copy source and metadata need to expand.

3. Awards replay column
   - The “first match replay” block can become the reusable cup recap log and annual highlight reel pattern.

## 2. How To Wire Existing Text Packages Into Three-Year Mode

The project already has enough authored text to cover the backbone of a three-year campaign. The main missing piece is not “more writing everywhere”; it is routing each content pool to the correct screen and deciding which ones are decision cards versus passive battle boxes.

### A. Directly reusable in featured-match decision cards

These should stay as interactive choice moments, not be flattened into passive narration:

- `src/content/mechanic-events.ts`
  - `philosophyChoiceEvents`
  - `scoutingEvents`
  - `roundSpecificEvents`
  - `chemistryEvents`
  - `timeoutDecisionEvents`
  - `highRiskDramaEvents`
- `src/content/events.ts`
  - high-pressure in-match branches such as:
    - `star_tilt`
    - `hot_streak`
    - `clutch_1v3`
    - `crowd_pressure_final`
    - `economy_crisis`
    - `igl_disagreement`
    - `anti_strat_read`
    - `momentum_crash`
    - `communication_breakdown`
    - `sub_feels_unwell`
    - `指挥不下去了`

Recommended rule:

- One featured match uses `10-15` total event boxes.
- Only `3-5` of them should be decision cards.
- The rest should be passive “战况框”.

### B. Directly reusable in normal battle boxes

These existing packs already read cleanly as resolved match timeline moments after light formatting:

1. `events.ts` in-match scenes
   - Use:
     - `title` as event-box header
     - first 1-2 sentences of `narrative` as setup line
     - chosen `resultText` or resolved result as body
     - `effect` keys converted into footer modifiers
   - Best fit for passive battle-box categories:
     - momentum swing
     - economy stress
     - morale spike
     - tactical read / anti-read
     - clutch recovery
     - internal comms stress

2. `mechanic-events.ts` round-specific and chemistry scenes
   - `roundSpecificEvents` are especially strong for passive battle boxes because they already map cleanly to match rhythm:
     - `opening`
     - `pressure`
     - `swing`
     - `adjustment`
     - `closing`
   - `chemistryEvents` can be dropped into the log as “team identity showing through” moments without needing a full-screen interruption.

3. High-risk scenes
   - `highRiskDramaEvents` should appear rarely, but when resolved they can sit in the normal timeline as gold-accent “headline” boxes.

### C. Directly reusable outside matches

These pools already cover the three-year loop and should be routed by timing:

- `campaign_start`
  - `philosophyChoiceEvents`
- `before_cup`
  - `cupFlavorEvents`
  - selected `out_of_match` scenes from `events.ts`
- `before_match`
  - `scoutingEvents`
  - `night_before_final`
  - `birthday`
- `between_cups`
  - `transferBiddingEvents`
  - `poaching_attempt`
  - `prize_money_dispute`
  - `team_dinner_invitation`
  - `streaming_distraction`
  - `player_burnout`
  - `wrist_injury_rsi`
  - `版本理解分歧` / `集训抉择` / `商业活动` / `作息崩了` and similar hub events
- `after_match`
  - `awardReactionEvents`
  - `locker_room_after_loss`
  - `更衣室`
  - `MVP`
- `season_end`
  - `seasonGrowthEvents`
  - annual club / top-10 award reactions
  - aging and late-career events from `events.ts`

### D. What still needs writing

The current libraries are rich in decision scenes and emotional beats, but the full featured-match log still lacks enough short, ordinary CS texture boxes. These should be added as a separate passive pack, not by stretching every existing event into a choice.

Needed writing buckets:

1. Short passive round-result boxes
   - examples:
     - 首杀拿到
     - 补枪跟上
     - 默认控图成功
     - 道具交换后转点
     - B 点爆弹进点
     - 回防失败
     - 经济局偷到两把枪
     - 保枪成功

2. Named player micro-highlights
   - format should be shorter than current dramatic events:
     - `{player} 在中路双杀`
     - `{player} 的补枪救回残局`
     - `{player} 保住 AWP`

3. Opponent action boxes
   - the current packs are still player-team centric.
   - add more neutral opponent pressure text so the log feels like a two-sided match.

4. Lightweight cup-transition snippets
   - one or two lines that bridge:
     - cup end -> transfer hub
     - transfer hub -> next cup arrival
     - season end -> annual ceremony

5. Chronicle summary blurbs
   - one-line summaries for:
     - cup champion path
     - season identity
     - defining roster move
     - best collapse / best rally / best call

## 3. Three-Year Mode Wiring By Screen

The full campaign should be treated as nine cups inside three seasonal arcs, with the same screen language repeating in a readable loop.

### Campaign spine

1. New game
2. Initial draft
3. Season 1
   - Katowice
   - Cologne
   - Major
   - Annual Awards
4. Season 2
   - Katowice
   - Cologne
   - Major
   - Annual Awards
5. Season 3
   - Katowice
   - Cologne
   - Major
   - Annual Awards
   - Career Chronicle

### Event routing by node

| Node | Main UI Surface | Primary content pool | Notes |
|---|---|---|---|
| Campaign start | Draft room + intro panel | `philosophyChoiceEvents` | Philosophy choice should happen before first full season loop begins |
| Before each cup | Prematch focus panel or cup intro panel | `cupFlavorEvents`, selected `before_cup` events | Cup identity changes accent color and tone, not layout |
| Bracket hub | `bracket-tree` with side rails | cup metadata + fast-resolved offscreen results | This becomes the persistent cup control center |
| Before featured match | Prematch panel | `scoutingEvents`, rare emotional scenes | Max one long scene before a match |
| Featured match | `match-layout` expanded | in-match decision + passive battle boxes | `10-15` boxes total, `3-5` choices max |
| Cup awards | `awards-grid` expansion | cup result, MVP, cup quote, recap | Direct extension of current awards screen |
| Between-cups hub | reused panel system | `between_cups` event pool, transfer bidding, condition status | This is the missing seasonal glue |
| After Major / season end | annual awards surface | `awardReactionEvents`, `seasonGrowthEvents`, annual ranking text | More ceremonial than utilitarian |
| End of year 3 | chronicle screen | `chronicleWorthy` event selections + season summaries | Keep readable within two minutes |

### Recommended cup rhythm

For each cup:

1. Cup arrival / atmosphere
2. Bracket overview
3. Prematch scouting
4. Featured match
5. Fast-resolve remaining bracket beats
6. Cup awards
7. Cup aftermath / between-cups hub

### Recommended season rhythm

For each season:

1. Three cups
2. One annual awards screen
3. One short season summary
4. One season-change state update:
   - condition cleanup
   - growth/decline
   - morale carryover
   - transfer consequences

## 4. Match Screen Layout: KDA, Player Names, Event Boxes

The current match room already has the correct reading direction. The full version should keep the same structure and increase information density in a controlled way.

### Desktop layout

Use a three-zone desktop composition inside the current `match-layout` idea:

1. Top fixed scoreboard band
2. Left scrollable event timeline
3. Right fixed live panel stack

### A. Top scoreboard band

Keep it pinned while the timeline scrolls.

Recommended contents from left to right:

1. Season and cup tag
   - example: `S2 · COLOGNE · SEMIFINAL`
2. Left team block
   - team color chip
   - team name
   - optional morale/condition indicator
3. Center score block
   - main score in mono
   - compact round dots under it
4. Right team block
   - team name
   - opponent color chip
5. Match status utilities
   - economy badge
   - timeout used / available
   - current round-type badge: `OPENING`, `SWING`, `CLOSING`

### B. Player names and KDA placement

KDA should not be pushed into every event card. It belongs in the right-side live panel where the player can read team state at a glance.

Recommended right-panel roster stack:

1. Five player rows, fixed height
2. Each row contains:
   - 40-48px portrait
   - player name
   - role label
   - condition tag if relevant
   - right-aligned mono K/D/A
3. Bench player row appears below starters only when substitution status matters

Per-row visual order:

- portrait
- name + role
- condition pill or chemistry hint
- `K 14 / D 10 / A 6`

Important rule:

- use player names in the event box body
- use KDA in the roster stack
- do not repeat full KDA inside the event timeline unless the event itself is a stat milestone

### C. Event box placement

The event timeline should stay on the left and be the dominant reading surface.

Recommended event-box anatomy:

1. Header
   - event title
   - event-type badge
   - optional involved-player short tag
2. Body
   - 2-4 lines max
   - first line: what happened in CS language
   - second line: consequence or emotional read
3. Footer
   - visible named modifiers only
   - examples:
     - `火力 +4`
     - `纪律 -2`
     - `暂停已消耗`

### D. Event-box taxonomy for visuals

Use stripes and badges, not whole new layouts:

- Neutral info box: blue accent
- Positive momentum: green accent
- Negative swing: red accent
- Decision box: gold accent
- Clutch / headline moment: gold accent + mono badge such as `[1v3]`
- Economy beat: grey or amber secondary badge

### E. Active card placement

The active card stays in the upper part of the right column.

Stack order:

1. Current active event card
2. Choice buttons or continue button
3. Timeout status hint
4. Starter roster KDA panel
5. Compact legend if needed

This preserves the current “resolved left, current right” mental model from `browser.js`.

## 5. Which Existing Text Packs Should Feed Ordinary Battle Boxes

The following packs can be fed directly into ordinary battle boxes with only UI formatting changes:

### Best direct-fit sources

1. `roundSpecificEvents`
   - strongest source for backbone match pacing
   - ideal for opening / swing / closing log beats

2. `chemistryEvents`
   - best source for “this roster’s identity is showing” boxes

3. Selected `events.ts` in-match scenes
   - best source for:
     - star pressure
     - economy pain
     - anti-strat adaptation
     - communication errors
     - clutch tension

4. Resolved versions of `timeoutDecisionEvents`
   - after the player chooses, the chosen branch can become a normal resolved box in the log

### Do not overuse as ordinary battle boxes

These are better treated as rare set-piece moments:

- `night_before_final`
- `locker_room_after_loss`
- `match_fixing_offer`
- `star_player_doubts`
- `fan_letter`
- `veteran_teaches_rookie`

They are too emotionally heavy for frequent insertion into routine match flow and work better as hub, prematch, aftermath, or season scenes.

## 6. App Desktop Experience Notes

The current prototype reads fine in a browser tab, but the shipped desktop experience should protect focus and continuity.

### Must-haves for desktop feel

1. One dominant scroll region per screen
   - in match view, only the event timeline should scroll
   - scoreboard and active card should stay anchored

2. Stable window assumptions
   - optimize first for `1280px+` desktop widths
   - do not collapse into stacked mobile-like layout too early
   - preserve left-right reading flow on laptop screens

3. Session continuity
   - autosave after each major choice
   - small toast feedback is enough: `已保存至 S2 · Cologne · Quarterfinal`

4. Long-session readability
   - no large flashing transitions between every box
   - use quiet motion and strong text contrast
   - avoid visually noisy backgrounds in the match room

5. Keyboard-first convenience
   - Enter / Space to continue passive event boxes
   - `1 / 2 / 3 / 4` for choice selection when decision cards appear

6. Chronicle and awards should respect desktop reading
   - vertical scroll is fine
   - do not force all annual content above the fold

### Desktop pitfalls to avoid

1. Multiple nested scroll panes in match view
2. Over-wide line lengths in emotional scenes
3. Putting KDA inside every event card
4. Rebuilding the whole layout per cup instead of using accent swaps
5. Letting save/load feedback become modal and disruptive

## 7. Art And Content Priorities For The Main Agent

### Highest-value art/UI work

1. Extend `bracket-tree` into a true cup hub with played states and side rails
2. Expand `match-layout` into a richer desktop match room with KDA roster stack
3. Add a between-cups hub using existing panel language
4. Build annual awards and chronicle with current trophy/panel tone
5. Keep all cups in one shared shell and swap only identity accents

### Highest-value content work

1. Add a passive “ordinary battle box” library for common CS round texture
2. Route existing event pools by timing instead of writing new scenes blindly
3. Reserve long emotional scenes for finals, aftermath, and seasonal transitions
4. Convert `effect` keys into visible modifier footers everywhere
5. Use `chronicleWorthy` tags to curate the year-end and career-end recap

## 8. Five Directly Executable Art/Content Suggestions

1. Write a new passive match-text pack of at least `24` short battle boxes split evenly across `opening / pressure / swing / adjustment / closing`, with each box capped at one header plus two body lines.

2. Keep `src/app/browser.js` match composition logic conceptually intact and extend it into a three-column desktop match room: left timeline, right active card, lower-right five-row KDA roster stack.

3. Reuse `cupFlavorEvents` as the visual tone setter for each cup and bind accent colors by cup only: Katowice cold blue, Cologne restrained amber, Major blue-gold ceremonial.

4. Treat `between_cups` events as a dedicated hub feed, not modal interruptions inside bracket or awards screens; each hub visit should surface `1-2` authored scenes plus roster condition and transfer actions.

5. Use `chronicleWorthy` as the content filter for annual awards and the final three-year chronicle, so the endgame recap is built from authored highlights instead of raw stat dumps.
