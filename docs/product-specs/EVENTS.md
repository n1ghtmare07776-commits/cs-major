# Event System Spec

## Purpose

Events are the main source of story variation. They should appear inside matches, between cups, and at different tournament stages.

Events are not only flavor text. Event choices should raise or lower concrete effects such as team cohesion, discipline, tactical execution, player condition, transfer value, or match momentum.

Mechanic-specific event rules for scouting, strategy memory, timeout decisions, condition duration, high-risk drama, cohesion extremes, and bidding events live in `docs/product-specs/MECHANICS.md`.

## Event Timing

Events can trigger at:

- campaign start.
- before a cup.
- between cup stages.
- before a player match.
- during a player match.
- after a match.
- between cups during transfer windows.
- season end.

## Real-Name Safety

The prototype can use real player names, but event writing must not invent defamatory private-life allegations or present fictional misconduct as fact.

Allowed:

- generic public pressure.
- form slumps.
- social media noise.
- travel fatigue.
- tactical conflict.
- personality-inspired in-game behavior such as taunting, over-aggression, or leadership style.

Avoid:

- specific private-life scandals attached to real named players.
- criminal, medical, or personal allegations.
- claims that read like real-world reporting.

## Event Library Size

The event library should be large enough that repeated three-year runs do not feel identical.

Early implementation can start small, but the content model should support many events with tags and requirements.

## Event Shape

Each event should define:

- id.
- timing.
- title.
- narrative text.
- trigger requirements.
- choices.
- effects.
- condition duration when the event changes player condition: match, cup, or major.
- whether it can remove control.
- whether it can be recorded in the final chronicle.

## Choice Effects

Choices can:

- increase or decrease team cohesion.
- change tactical execution or discipline.
- improve or worsen player condition.
- trigger or prevent personality chains.
- spend the one match timeout.
- change player willingness in trades.
- affect prize expectations or pressure.

## Examples

Coach visa issue:

- Timing: before match or before cup.
- Effect: lowers tactical execution or removes control for one decision card.
- Choice: let IGL lead, simplify tactics, or risk remote coaching.

Star in hot form:

- Timing: before match.
- Effect: selected player gains firepower or clutch bonus.
- Choice: play through the star or keep the team structure.

Internal conflict:

- Timing: between cups or during poor form.
- Effect: cohesion loss, discipline loss, potential personality chain.
- Choice: hold meeting, bench player, ignore it, or spend resources to resolve.

Transfer rumor:

- Timing: between cups.
- Effect: player willingness and market value change.
- Choice: reassure player, offer trade, or use as leverage.

Scouting report:

- Timing: before a player match.
- Effect: reveals opponent tactic memory, star form, or a weak tactical habit.
- Choice: drill a counter, preserve confidence, create a mind-game cue, or prepare a timeout line.

Chinese fan pressure:

- Timing: before cup, after upset loss, before Major.
- Effect: condition pressure, cohesion test, discipline test.
- Choice: shield players from media, lean into national pride, or let the captain speak publicly.

Taunt momentum:

- Timing: during match after a won round or rivalry event.
- Effect: lower enemy morale, raise crowd pressure, or backfire into discipline loss.
- Choice: allow the taunt, calm the player down, or use it as a tactical distraction.

High-risk drama:

- Timing: during a player match after the player chooses a risky line.
- Effect: creates a rare match-changing swing such as a full round steal, star tilt, or collapsed gamble.
- Choice: usually tied to aggressive, fake, or gamble decisions.
- Limit: at most one high-risk drama event per player match.
