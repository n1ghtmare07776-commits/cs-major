# Gameplay Spec

## Fantasy

The player is a Counter-Strike tournament manager building a five-player roster from modern elite teams. The game should feel like a fast esports season diary: draft, prepare, make a few tense tactical calls, and see whether the team wins cups.

## Campaign

- Maximum length: three seasons.
- Each season has exactly three cups.
- Cup order: IEM Katowice, IEM Cologne, Major.
- Final score: total cup championships, plus notable story awards.
- The player can stop after any season summary.

## Cup Format

- Eight teams enter each cup.
- Single-elimination bracket.
- Quarterfinal, semifinal, final.
- v0.1 match format may be one map per round for speed.
- Later versions may support best-of-three finals if it stays lightweight.
- If 枪神队伍 is eliminated, the player does not watch remaining matches. The game quickly resolves the bracket, announces the current cup champion, cup MVP, awards placement results, and proceeds to the next cup phase.

Cup and season awards are part of the core loop. See `docs/product-specs/AWARDS.md`.

For tactical collision rules, strategy memory, timeout sub-decisions, condition duration, coach philosophy, and impact rating, use `docs/product-specs/MECHANICS.md` as the source of truth.

## Team Building

- Player drafts five starters under a fixed budget.
- Each player has:
  - firepower: individual frag impact.
  - tactics: team structure and decision value.
  - price: draft cost.
  - traits: personality and playstyle modifiers.
- Remaining players are auto-assigned to seven AI teams.
- AI assignment should be reality-biased: original teammates stay together when possible, but not at the expense of filling all teams.

## Match Flow

A match is a best-of-five compressed CS story, not a full round-by-round CS simulation. First team to three compressed rounds wins.

Each match can have up to five compressed rounds. The match still stays light: a round is a story beat with one or two meaningful state changes, not a full CS round.

The match log is displayed as a vertical sequence of event cards. Each card represents a random, scripted, or decision-driven match event. Some cards include player choices. After a choice is made, the same card continues with the resulting battle description and ends with a compact stat delta line.

Player-facing matches should usually contain about 10 event cards, with an acceptable final range of 10-15 event cards. Of those, the normal target is about 3 player decision cards, with a hard cap of 5. This is the default rhythm; unusually short stomps or dramatic finals may vary if the story benefits.

Round responsibilities:

1. Opening round: mandatory economy and opening tactic choice. The player chooses whether to buy good equipment or save if money is weak. Tactical choices can include rushing a bombsite, default/contact play, or slower map control.
2. Pressure round: the previous result changes money, equipment, and confidence.
3. Swing round: losing two rounds can create a buy opportunity; winning two rounds can preserve money even if this round is lost.
4. Adjustment round: timeout, morale boost, tactical discipline, or counter-strat decisions can matter.
5. Closing round: clutch, defuse, save, or final push decision.

Each round can resolve into resource gain/loss, casualties, morale effects, momentum swing, tactical control changes, or final score pressure.

Player interaction cadence:

- Every match must include an opening tactical choice.
- Later prompts appear through events, clutches, timeouts, economy crises, or turning points.
- The game should not ask for a choice every compressed round by default.
- Prompt frequency should create participation without dragging the tournament pace.

The game is single-player only for the current scope. The player chooses their team's decisions and the AI chooses the opponent response.

Non-player bracket matches should be resolved quickly. They can use weighted randomness or simplified team strength checks to decide who advances without rendering full match prompts.

The campaign should not let early success trivialize the remaining three-year run. Early cups should feel tougher, roster flaws should matter, and strong long-term stability should help later without turning the game into a solved snowball.

## Tactical Prompts

Prompt examples:

- Attack A site, attack B site, default slowly, fake and rotate.
- Plant the C4, hunt exits, save weapons, delay for utility.
- Fast retake, fake defuse, hold crossfire, save for next round.
- Let star player take opening duel, trade as a pack, slow contact.

The opponent also chooses a strategy. Strategy collision changes the win chance for the next event.

Opening choice is split into two player-facing steps:

1. Economy: full buy, partial buy, or eco/save when the economy allows it.
2. Tactic: rush a bombsite, default/contact play, slow lurk, fake/rotate, or another available plan.

Economy and tactics must remain separate levers in the UI so the player can feel the difference between "we have good equipment" and "we chose the right plan."

The live game should use a simplified hidden-value economy model with visible player-facing tiers such as:

- full buy
- half buy
- force buy
- eco
- bonus gun / reward round

The player does not need to see exact money numbers, but the simulation should really track enough state to support comeback money, force-buy pressure, and later-round punishment or recovery.

## Strategy Matrix

The match engine uses the attack/defense matrix defined in `docs/product-specs/MECHANICS.md`.

Strategy effects must be readable:

- Fast hit beats greedy map control.
- Stack defense beats obvious site rush.
- Fake punishes early rotation.
- Slow default punishes over-aggression.
- Save protects economy but concedes the round.

Each decision returns text that explains why it helped or failed.

If both sides choose the same tactic or a close mirror, the result should compare execution quality rather than treating the plans as neutral. Execution quality can come from:

- combined player tactics.
- team cohesion/chemistry.
- discipline/tactical control.
- relevant individual firepower or clutch stats.

Example: two teams both default slowly, but the more disciplined team trades better and avoids the first mistake. A superstar may still break the pattern with raw firepower.

Teams also remember repeated strategic habits. A player who keeps using the same opening can be lightly countered by AI opponents, but the game must explain that counter through scouting, match text, or timeout feedback. Hidden strategy punishment is forbidden.

The confirmed tuning is medium rather than extreme: repeated similar openings over roughly 2-3 uses should become easier to read, but the player must still be able to break the pattern through variation, fake pressure, and timeout resets.

## Attributes

Firepower primarily affects duels and highlight events.

Tactics primarily affects:

- decision prompt success.
- clutch preparation.
- anti-strat reads.
- team floor in close matches.

Traits apply small modifiers and story flavor. They should never make a player unusable by themselves.

## Match Resources

The match engine tracks four resource families:

- Economy: local match money and equipment quality.
- Morale effects: temporary boosts or penalties from timeout, crowd pressure, collapses, and leadership. Morale does not need to be shown as a raw number.
- Player condition: individual form, fatigue, injury, tilt, absence, and temporary status.
- Tactical control: how much the manager/team can execute chosen plans, affected by coach absence, team harmony, leadership, and disruptive events.

Condition duration is layered: match condition clears after the match, cup condition lasts through the current cup, and major condition can cross cups or seasons when a story event explicitly marks it as major.

Team-level stats are 1-100 values:

- total firepower.
- tactical execution.
- cohesion or chemistry.
- discipline.

Players should be able to see relevant team values after decisions resolve. The UI does not need to expose every calculation, but it should show enough feedback for the player to understand why a tactic worked, failed, or partially succeeded.

High cohesion should reduce the impact of morale crashes, poor individual form, anger, and internal conflict events. A cohesive team may still suffer these events, but the penalty should be softened or the recovery should be easier.

Long-term roster continuity should also matter across the campaign. If the same starting core plays together for many official matches, hidden familiarity should gradually improve execution quality and stability. This gain should remain light and partially hidden from the player so that transfer choices still feel uncertain and manager-like.

Decision feedback format:

```text
残局里，你让队伍假拆后继续架枪。对手的最后一名步枪手被迫露头，ZywOo 稳稳收下这一分。

团队配合 +4，士气提升，战术执行 +2
```

Feedback transparency rules:

- Non-decision event cards use semi-transparent feedback: story text plus labels and a few key values.
- Player decision cards use more transparent quantified feedback after resolution.
- Decision cards should show relevant comparisons when useful, such as tactical execution, equipment quality, cohesion, discipline, or casualties.
- Decision cards should include key player influence when relevant, so stars and personality traits visibly matter.
- Full formulas are not shown in the normal player experience.

Example decision-card ending:

```text
战术执行 82 vs 74，装备劣势 -6，纪律差距 +4。
ZywOo 残局判断 +8，apEX 的急躁指挥让纪律 -3。
这次默认架枪小胜：对方减员 1 人，团队配合 +3。
```

When a team has no money, it may be forced into an eco/save choice. Poor equipment should reduce firepower or related combat checks.

## End Summary

After three seasons, show:

- total championships.
- cup-by-cup results.
- cup champions and cup MVPs.
- annual best club awards.
- best player.
- annual top ten player rankings across all eight teams.
- worst collapse.
- signature tactical call.
- short manager rating.
- a career chronicle that records the defining events of the full three-year run.

## Cup and Match Events

Before each cup or individual match, the game may trigger reality-inspired events. These events are part of the story engine and should change gameplay, not only text.

Events can also trigger between cups and at different tournament stages. See `docs/product-specs/EVENTS.md` for the full event system rules.

Confirmed event direction:

- between-cup event frequency should be medium;
- not every transition needs a dramatic crisis, but most transitions may surface a small or medium-impact situation;
- normal event swings usually sit around `+/-3` to `+/-6`;
- major event swings can reach `+/-7` to `+/-10`;
- opponent setbacks should come from believable competitive or external-pressure causes, such as tactical disagreement, coach absence, lineup disruption, travel, or public scrutiny.

Examples:

- Coach visa problem: players must call tactics themselves, reducing player control or team tactics.
- Chinese fan pressure: social media expectations around 枪神队伍 affect player condition or cohesion.
- Public opinion swing: a bad loss increases pressure before the next match, while a heroic win can improve confidence.
- Great form: one player gains a temporary firepower or clutch bonus.
- Bad form: one player loses confidence until a timeout or win restores morale.
- Absence: one player misses a match and a substitute must play.
- Tactical autonomy: the team ignores the manager for one node and randomly chooses a strategy.
- Momentum crisis: calling a timeout can break enemy rhythm and restore morale.
- Personality chain: a trait causes a sequence such as forced aggression, overlong lurk, early casualty, lost bombsite, or emergency retreat.
- Internal conflict: low cohesion or clashing personalities create anger or disagreement; high cohesion softens the penalty or shortens the chain.
- Taunt/trash-talk: a public or in-server taunt can lower enemy morale or backfire if the round is lost.

## Timeout

Each match has one timeout opportunity.

The game should offer the timeout prompt when one of these situations appears:

- a volatile personality trait triggers a negative chain.
- the player's team enters poor form or loses tactical control.
- the opponent triggers hot form.
- the opponent builds a win streak or strong momentum.

Timeout effects can include:

- tactical reset: counter opponent habits and restore structure.
- emotional reset: calm tilt, slump, anger, or pressure.
- discipline reset: stop overpushes, overlong lurks, and economy mistakes.

The player should not be able to spam timeout. Once used, the match should clearly show that no timeout remains.

## Loss of Control

Some events may remove player control for one decision node, but this must be rare and narratively justified.

Rules:

- The game must explain why the player cannot act.
- The event must name the affected node or match segment.
- The player should understand whether control returns later.
- Silent random lockouts are forbidden.

Example:

```text
Your coach is still stuck at airport security. The players argue through the opening call themselves. You can only watch the first node unfold, then regain control during the timeout window.
```
