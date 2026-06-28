# Economy Spec

## Purpose

CS Cup Manager has two economies:

- In-match economy: short-term buy/save decisions inside a five-round match.
- Out-of-match economy: manager budget, transfers, prize money, and roster freedom across cups and seasons.

## In-Match Economy

A match uses a best-of-five compressed-round structure. First team to three rounds wins, so a match may end before all five rounds are played.

Economy should feel CS-inspired without simulating full CS money rules:

- If a team wins two rounds, then loses the third, it should still have enough money for the fourth.
- If a team loses the first round, it should usually lack money in the second.
- If a team loses two rounds in a row, it should usually have money again in the third.
- If a team has no money, it can only choose an eco/save approach.
- Eco/save rounds reduce equipment quality and lower firepower or related combat checks.

The exact numbers can be tuned later. The important player-facing rule is simple: buy now for immediate strength, or save to improve future rounds.

Locked direction:

- the implementation should use a **semi-numeric hidden economy**, not a purely cosmetic label system and not a full raw-CS accounting simulator;
- the simulation may track internal economy values, but the player-facing UI should mostly present economy as readable buy tiers;
- the player should be able to feel comeback money, force-buy desperation, and post-loss recovery without needing to read an exact wallet number.

Opening decisions must split economy from tactics:

1. Choose buy level, such as full buy, partial buy, or eco/save.
2. Choose tactical plan, such as rush, default/contact play, slow lurk, or fake/rotate.

This split is mandatory because equipment quality and tactical plan should affect different parts of the simulation.

## In-Match Resources

The match engine tracks:

| Resource | Meaning | Player-facing display |
|---|---|---|
| Economy | Buy strength and equipment quality | Text labels such as "full buy", "weak buy", "eco" |
| Morale effects | Temporary confidence, tilt, timeout recovery, crowd pressure | Text states, not necessarily raw numbers |
| Player condition | Form, fatigue, absence, tilt, injury-like story effects | Player tags and event text |
| Tactical control | Ability to execute chosen plans | Text states such as "disciplined", "chaotic", "coach absent" |

## Out-of-Match Economy

The manager uses money to buy players, trade players, and configure the team.

Rules to define:

- At game start, the player uses starting money to choose six players from the player pool.
- Starting budget may use an abstract value such as 100.
- Player ratings are designed from real-world-inspired strength first, then converted into price.
- Each team has six players: five active starters and one substitute.
- After the initial roster selection, roster changes require trades with other teams.
- Trades can use money, player exchange, or money-plus-player packages.
- Trade acceptance starts with simple value matching and also checks player willingness.
- Between cups, a transfer window allows roster changes.
- Cup placement awards prize money.
- More prize money means more freedom to buy star players.
- Poor results should make superstar rosters harder to afford.

Locked direction:

- the starting budget should be **medium**;
- the player may be able to force a double-star opening, but only by sacrificing structure, bench quality, and later flexibility;
- frequent transfers must cost real money and be constrained by prize earnings;
- a single early win must not create a trivial unstoppable rich-get-richer loop.

Roster changes should not feel like a free market where any player can be bought at any time. Other teams own players, and the player must offer enough value to make a trade plausible.

Trade acceptance should consider:

- money offered.
- outgoing player value.
- target player value.
- target player's willingness to join.

Locked direction:

- each cup interval should allow at most **one** active trade attempt from the player;
- acceptance should use a mixed model:
  - value matching
  - team situation
  - player willingness
  - large money offers as a meaningful but capped influence
- player willingness should matter at a medium level rather than being negligible or absolute;
- failed negotiations should surface only `1-2` main reasons instead of a full formula dump.

Player willingness can be affected by:

- the player's expected role.
- the player's personality.
- the player's fit with the team's cohesion.
- recent team success and prize performance.
- whether the player would be joining a stronger or more prestigious project.

## Prize Money

Prize values are not finalized.

The prize table must reward:

- champion.
- runner-up.
- semifinal exit.
- quarterfinal exit.

The gap should matter enough that winning a cup changes transfer options, but not so much that one early win makes the campaign trivial.

Confirmed anti-snowball rule:

- prize money should create real roster freedom,
- but the economy curve must still leave room for recovery through later results, disciplined management, and event swings.

## Open Questions

- Exact starting budget value, with 100 as the likely baseline.
- Exact player price curve from rating to price.
- Whether salary/upkeep exists or only transfer price exists.
- Whether substitutes have lower salary pressure.
- Whether player exchange value depends on form and contract.
- Exact willingness formula.
