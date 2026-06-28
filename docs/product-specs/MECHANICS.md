# Mechanics Spec

## Purpose

This document records the gameplay systems that turn CS Cup Manager from a pure rating comparison into a lightweight manager game with planning, memory, and story.

The v0.1 priority is the playable cup spine:

- draft a roster with meaningful chemistry tradeoffs.
- prepare for an opponent with scouting.
- resolve player matches through readable attack/defense tactic collisions.
- use one important timeout decision.
- award cup MVP through a defined impact rating.

Longer campaign systems can be specified here before they are fully implemented, but v0.1 must still let a player finish one cup quickly.

## v0.1 Priority

Implement first:

- lightweight team chemistry.
- attack/defense strategy matrix.
- player and team strategy memory.
- three-option timeout decisions.
- scouting as pre-match event cards.
- impact rating for cup MVP and later annual awards.

Specify now, implement after the first playable cup is stable:

- light bidding events after cups.
- season-end player growth and decline.
- full three-year chronicle integration.
- season-long economy balance simulations.

## Team Chemistry

Chemistry is a small set of readable roster-composition rules. It must not become a large auto-battler style synergy system in v0.1.

Inputs:

- each starter's traits.
- each starter's personality score.
- role balance, especially whether the active five include an IGL.
- small familiarity bonuses for real-world teammates.

Outputs:

- cohesion.
- discipline.
- tactical execution.
- event trigger weights.
- short UI explanations during draft and match feedback.

Initial chemistry rules:

| Rule | Trigger | Effect |
|---|---|---|
| Star and stabilizer | `streaky_star` or `hot_blooded` plus `calm_clutcher` | firepower moments stay high, tilt penalties soften slightly |
| Double volatility | two or more `hot_blooded` starters | firepower up in entry events, discipline and cohesion down |
| System core | `system_leader` plus at least two `disciplined` starters | tactical execution and discipline up |
| Cold structure | three or more `disciplined` or `calm_clutcher` starters | fewer mistake events, fewer explosive snowball events |
| Crowd battery | `crowd_favorite` plus high cohesion | finals and comeback events gain a morale boost |
| Pressure echo | two or more `crowd_favorite` starters with low cohesion | public pressure events hit harder after bad starts |
| Lone caller | exactly one `system_leader` and no second high-tactics player | tactics up, but coach absence events are more dangerous |
| Leadership room | `system_leader` plus another high-tactics non-IGL | tactics up, internal conflict chance slightly lower |
| Real core | at least two starters from the same source team | small familiarity bonus |
| Patchwork stars | three or more elite-price stars from different source teams and no system leader | firepower up, cohesion and discipline down |

The UI should show chemistry as concise labels, not formulas. Example:

```text
化学反应：明星 + 稳定器，现实队友默契
风险：双核心情绪波动
```

## Locked Direction

The current production direction is intentionally manager-forward rather than pure rating simulation.

Confirmed design locks:

- a strong decision chain should be able to cover roughly `10-15` points of raw team-strength gap;
- early cups should be harder and less forgiving than later cups;
- long-term stability should help, but the payoff must stay light enough that "never change anything" is not the only correct answer;
- most hidden long-term gains, especially chemistry growth from staying together, should not be fully formula-transparent to the player.

This means the player should feel "I coached this win" rather than "my roster auto-won it."

## Cohesion Extremes

Cohesion is both a stabilizer and a story trigger.

Rules:

- negative morale, poor form, anger, and internal conflict penalties scale down when cohesion is high.
- the chance of conflict events rises gradually as cohesion falls.
- the chance of trust events rises gradually as cohesion rises.
- below 30 cohesion unlocks exclusive negative chains.
- above 80 cohesion unlocks exclusive positive chains.

Low-cohesion event chains can include:

- two stars dispute the mid-round call.
- a player overextends to prove a point.
- post-loss media pressure turns into blame.

High-cohesion event chains can include:

- silent double peek.
- substitute slots into the system cleanly.
- timeout instructions are executed exactly.

## Strategy Memory

Both the player and AI teams maintain lightweight tactic memory.

Track per team:

- recent opening attack plans.
- recent defensive responses.
- repeated high-risk calls.
- opponent-specific history when the same teams meet again.

Player-facing use:

- pre-match scouting cards summarize opponent tendencies.
- timeout tactical reset can reuse the latest scouting read.
- match feedback can mention when a call exploited a known habit.

AI-facing use:

- AI opponents lightly counter the player's repeated tactics.
- AI countering must be explained through scouting or match text.
- hidden punishment without narrative explanation is forbidden.

Locked tuning:

- counter-strength is **medium**;
- repeating similar openings `2-3` times in a short span should make the AI meaningfully better at reading them;
- the counter must still be breakable through variation, fake pressure, scouting preparation, or timeout reset.

Example:

```text
情报组提醒：Falcons 过去两场在压力局偏向前压控图。
如果你选择慢控单摸，成功率提高；如果继续无脑 Rush，可能撞进交叉火力。
```

## Scouting Cards

Scouting is implemented as a pre-match event card.

It may reveal:

- opponent favorite tactic.
- opponent defensive habit.
- star player condition.
- weak role or cohesion issue.
- whether the opponent has started reading the player's habits.

Player choices can:

- drill a specific tactic.
- preserve confidence and cohesion.
- spread a mind-game cue at a discipline cost.
- prepare a timeout line for later.

Scouting should not guarantee victory. It gives a small, readable edge if the player chooses a matching plan.

## Attack/Defense Strategy Matrix

Player matches use separate attacking and defending tactic sets.

Attack tactics:

| Tactic | Meaning | Primary stats |
|---|---|---|
| Rush site | fast hit into a bombsite | firepower, discipline |
| Default contact | slow shared map pressure and trading | tactics, discipline, cohesion |
| Slow lurk | delayed information play and isolated pick attempt | tactics, clutch, discipline |
| Fake rotate | sell pressure on one site and finish elsewhere | tactics, cohesion, discipline |

Defense tactics:

| Tactic | Meaning | Primary stats |
|---|---|---|
| Stack site | gamble heavy bodies on a site | tactics read, firepower |
| Early aggression | contest space and hunt first contact | firepower, discipline |
| Conservative retake | avoid early losses and play late retake | discipline, clutch, tactics |
| Info control | gather information without overcommitting | tactics, cohesion |

Base collision table:

| Attack vs Defense | Stack site | Early aggression | Conservative retake | Info control |
|---|---:|---:|---:|---:|
| Rush site | hard loss if read, gain if wrong site | volatile mirror | slight gain | slight loss |
| Default contact | slight gain | gain | neutral | slight loss |
| Slow lurk | hard loss | gain | slight loss | neutral |
| Fake rotate | gain if stack moves wrong | slight loss | neutral | hard loss if read |

Resolution formula shape:

```text
strategyEdge
+ attacking primary stats
- defending primary stats
+ equipment modifier
+ chemistry modifier
+ scouting or memory modifier
+ relevant trait modifier
+ seeded randomness
```

The player sees summarized reasons, not the full formula.

Decision-card feedback should include concrete values when relevant:

```text
战术执行 84 vs 77，装备劣势 -5，侦察报告 +4。
你的假打骗出了提前回防，但对方信息控制没有完全失位。
结果：对方减员 1 人，团队配合 +3。
```

## Timeout Decisions

Each match has one timeout.

Timeout can trigger when:

- a volatile trait chain starts.
- the player's team loses tactical control.
- the opponent enters hot form.
- the opponent wins consecutive compressed rounds.
- low cohesion or public pressure causes a crisis.

When triggered, the player chooses one of three options:

| Option | Main use | Effect |
|---|---|---|
| Tactical reset | counter opponent habits and restore structure | next tactic check gains execution/read value |
| Emotional reset | calm tilt, slump, anger, or pressure | condition and morale penalties soften |
| Discipline reset | stop overpushes, lurks that take too long, and economy mistakes | discipline rises and volatile chains are interrupted |

Coach philosophy can modify timeout strength, but the three core options remain stable.

Locked presentation:

- timeout is a mid-weight scene, not a throwaway button;
- the UI should first explain why the timeout became necessary;
- then the player chooses one of the three reset types;
- the result should report only a few key outcome values, not the full internal formula.

## Coach Philosophy

At season start, the player chooses one coaching philosophy.

| Philosophy | Identity | Effects |
|---|---|---|
| Tactician | wins through preparation and reads | tactics bonuses, stronger tactical timeout |
| Player Whisperer | wins through trust and condition management | faster condition recovery, stronger emotional timeout |
| Gambler | wins through pressure calls and risk | high-risk choices hit harder both ways |
| Disciplinarian | wins through structure | discipline floor is more stable, volatile stars may lose comfort |

The philosophy changes event weights, timeout effects, small modifiers, and season-summary tone. It should not create a single correct choice.

## Condition Duration

Condition is layered.

| Layer | Duration | Examples |
|---|---|---|
| Match condition | clears after the match | tilt, single-map hot hand, pressure spike |
| Cup condition | lasts until the cup ends unless cleared by events | slump, hot form, travel fatigue, media pressure |
| Major condition | crosses cups or seasons | injury-like absence, serious conflict, breakout year, long-term confidence |

v0.1 can implement match and cup condition first, but content should already tag events by duration so major conditions can be added without rewriting event data.

## Long-Term Cohesion Growth

Long-term roster continuity should provide a real but light benefit.

Rules:

- chemistry growth comes primarily from **shared official matches**, not from a visible "grind XP" meter;
- keeping the same starting core across cups should gradually improve execution stability, trading confidence, and resistance to pressure;
- the gain should be **light**, not snowballing;
- switching players should reset part of that invisible continuity value;
- the player should understand the effect through story, stability, and feedback tone, not through a fully exposed formula sheet.

Confirmed direction:

- growth cadence follows accumulated match participation;
- growth size is light enough that a better roster move can still outweigh it;
- "stay together forever" must not become an automatic dominant strategy.

## High-Risk Drama

High-risk/high-reward events should be rare and memorable.

Rules:

- at most one high-risk drama event per player match.
- probability should usually be 5-10% when the player chooses risky lines.
- the effect should mainly change the current match in v0.1.

## Event Frequency and Magnitude

Cup-between-cup growth events, slumps, public-pressure events, and opponent disruption events are part of the anti-snowball layer.

Locked tuning:

- event frequency should be **medium**: most cup transitions can surface something, but not every transition needs a major swing;
- normal events should usually move relevant values by about `+/-3` to `+/-6`;
- major events can reach about `+/-7` to `+/-10`;
- opponent weakening should come from believable causes such as coaching absence, tactical disagreement, forced lineup changes, pressure, travel, or fatigue, not arbitrary hidden nerfs;
- player recovery and growth events should be just as important as opponent setbacks.

## Anti-Snowball Direction

The campaign should not collapse after one early success or one early failure.

Locked direction:

- use a combined **economy catch-up + event-based swing** model;
- avoid invisible "rubber-band buffs" that feel fake;
- underperforming teams should still be able to recover through disciplined finances, stable chemistry, good decisions, and timely events;
- overperforming teams should still face pressure, public expectation, scouting attention, and roster-management friction.

## Feedback Transparency

Player-facing feedback should be selective and readable.

Locked direction:

- decision cards expose only a few key values;
- the game should show the decisive factors, for example:
  - `战术执行 82 vs 75`
  - `装备劣势 -4`
  - `团队配合 +3`
- the game should not dump every hidden modifier in normal play;
- non-decision cards stay more narrative and less numerical.

## Awards Weighting

Award systems are locked to a balanced, mixed logic rather than single-axis ranking.

Rules:

- Cup MVP: individual impact first, team finish second; non-champions can still win if clearly exceptional.
- Annual Top 10: combined model using individual impact, consistency, MVP moments, and team results.
- Best Club of the Year: combined season performance across all three cups, not only championship count.

## Growth and Bench Usage

Player growth and decline should exist, but remain light across a three-year arc.

Locked direction:

- seasonal player growth/decline usually stays in the `+/-1` to `+/-3` range;
- substitutes should matter mainly through absence, slump, fatigue, and disruption events;
- the sixth player is not meant to become a heavy constant-rotation management system in this version.
- season-level disasters are reserved for later campaign work.

Examples:

- a bold fake wins a compressed round outright.
- repeated aggression causes a star to tilt for the match.
- a gamble stack creates a 0-kill defensive collapse.
- a fearless entry call creates a comeback headline.

## Impact Rating

Impact rating powers:

- cup MVP.
- annual top ten players.
- player of the year.
- final chronicle player stories.

Use a mixed formula: individual performance first, team result second.

Formula shape:

```text
impactRating =
  personalImpact
  + clutchImpact
  + decisionInfluence
  + consistency
  + roleAdjustment
  + teamPlacementBonus
  + awardBonus
  - collapsePenalty
```

Components:

| Component | Meaning |
|---|---|
| personalImpact | kills, opening impact, damage-like match contribution |
| clutchImpact | late-round wins, defuse/plant decisions, save value |
| decisionInfluence | player named in successful tactical cards |
| consistency | avoids very low event scores across matches |
| roleAdjustment | IGL/support can score through tactics and discipline |
| teamPlacementBonus | champion/final/semi points without overpowering personal play |
| awardBonus | cup MVP, match MVP, signature play |
| collapsePenalty | major throw, repeated discipline failure, negative trait chain |

Cup MVP can come from any team. A champion player has an advantage, but a non-champion carry can win if their personal impact is clearly higher.

## Transfer Bidding Events

The first market upgrade is not a full transfer market. It is an eventized bidding scene after a cup.

Trigger examples:

- multiple teams want the same star.
- a role player becomes available after poor team performance.
- a player wants a clearer role.
- a rival team tries to block the player's upgrade.

Player options can use:

- money.
- outgoing player value.
- recent prize success.
- promised role.
- roster fit.

This system should create scarcity and story without requiring full AI market simulation in v0.1.

## Season-End Growth

Growth and decline happen at season end, not after every cup.

Rules:

- young players can gain small firepower or tactics.
- older players can lose small firepower but may gain tactics or discipline.
- cup MVP or breakout records can grant small permanent growth.
- major injury-like or serious conflict records can cause permanent decline.
- changes should usually be 1-3 points so ratings remain recognizable.

This is for three-year campaign texture. It should not block the first playable cup.
