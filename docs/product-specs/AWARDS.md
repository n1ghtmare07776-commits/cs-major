# Awards and Results Spec

## Purpose

Awards turn simulated results into story memory. Every cup and season should create clear headline moments for the player to remember.

## Cup Results

At the end of every cup, announce:

- cup champion.
- runner-up.
- semifinalists.
- cup MVP.
- 枪神队伍 placement.
- prize money earned by 枪神队伍.
- one short headline about the cup.

If 枪神队伍 is eliminated early, remaining matches resolve quickly and the cup still announces the champion and MVP.

## Cup MVP

Cup MVP can come from any of the eight teams, not only the champion.

The MVP calculation uses the mixed impact rating defined in `docs/product-specs/MECHANICS.md`: individual performance first, team result second. The calculation should consider:

- match impact.
- MVP or star event cards.
- clutch event success.
- elimination-stage performance.
- whether the player carried an underdog run.
- champion bonus, unless another player was clearly better.

Cup MVP should be shown immediately after cup champion.

## Annual Awards

At the end of each season/year, announce:

- best club of the year.
- top ten players of the year.
- player of the year.
- best rookie or breakout player if data supports it.
- biggest collapse.
- best tactical story or signature call.
- 枪神队伍 year summary.

## Best Club

Best club is chosen across all eight active teams.

The calculation should consider:

- cup championships.
- final appearances.
- total placement points.
- head-to-head results against 枪神队伍 when relevant.
- consistency across the three yearly cups.

Suggested placement points:

- Champion: 10.
- Runner-up: 6.
- Semifinal exit: 3.
- Quarterfinal exit: 1.

Ties can be broken by championships, then finals, then head-to-head, then total player rating.

## Annual Top Ten Players

The top ten player list is global across all eight active teams.

The ranking should feel HLTV-inspired without copying exact formulas. It can use:

- event impact rating.
- clutch success.
- consistency.
- team placement.
- MVP awards.
- role-adjusted performance.
- strength of opponents.

The list should be visible in the yearly summary and recorded into the final chronicle.

Impact rating is not only a display label. It is the shared scoring basis for cup MVP, annual top ten, player of the year, and final chronicle player stories.

## Three-Year Chronicle

After three seasons, generate a chronicle with:

- all cup champions.
- all cup MVPs.
- annual best clubs.
- annual top ten lists.
- 枪神队伍 final trophy count.
- biggest upset.
- most painful loss.
- best transfer.
- defining player story.
- manager rating.
