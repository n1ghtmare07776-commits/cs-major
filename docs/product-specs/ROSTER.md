# Roster Spec

## Snapshot Policy

Roster data is a dated game content snapshot. Do not fetch live roster data during gameplay.

Before implementing or updating `src/content/players`, verify the current scene from trusted sources and record the date here. As of 2026-06-25, the v0.1 pool is based on the user's requested teams plus recent elite CS2 visibility.

Useful public reference points:

- HLTV team ranking and player pages.
- Valve Regional Standings invitations.
- Official tournament roster lock announcements.
- Liquipedia roster pages.

## v0.1 Player Pool

Use players from the requested fan-service pool by default:

| Display name | Short id | Notes |
|---|---|---|
| Team Spirit | spirit | "Green dragon" user-requested anchor; include donk |
| Team Vitality | vitality | "Bees" user-requested anchor; include ZywOo |
| Team Falcons | falcons | User-requested anchor; include NiKo |
| MOUZ | mouz | User-requested anchor |
| FaZe Clan | faze | User-requested anchor |
| FURIA Esports | furia | "Panthers" user-requested anchor |
| Natus Vincere | navi | Modern elite brand and recurring Major contender |
| The MongolZ | mongolz | Recent international relevance and distinct regional flavor |

## Strict Ranking Preset

HLTV's world ranking page for 2026-06-22 listed the top eight as Vitality, Falcons, Spirit, FURIA, Natus Vincere, Aurora, G2, and 9z. In the same snapshot, MOUZ was #9, The MongolZ #11, and FaZe #18.

If the game mode needs strict current ranking fidelity instead of the requested fan-service pool, use:

| Display name | Short id |
|---|---|
| Team Vitality | vitality |
| Team Falcons | falcons |
| Team Spirit | spirit |
| FURIA Esports | furia |
| Natus Vincere | navi |
| Aurora | aurora |
| G2 Esports | g2 |
| 9z Team | 9z |

The default prototype should still favor recognizable requested teams unless a product spec says "strict ranking mode."

## Active Tournament Teams

The active tournament should contain the player's custom team plus seven AI teams.

- Player team name: 枪神队伍.
- Player team identity: Chinese organization/team.
- The player drafts six players from the eight-team source player pool.
- After the player draft, remaining players are assigned back to their source teams when possible.
- Missing AI team slots are filled randomly from available filler players.
- The game should preserve reality-biased rosters where possible without blocking the player's fantasy draft.

The prototype uses real player names directly. If the project later targets commercial release, revisit naming, licensing, and likeness risk before shipping publicly.

## Initial Star Anchors

The first playable roster pool should include at least:

| Player | Team anchor | Gameplay role |
|---|---|---|
| donk | Team Spirit | elite firepower, aggressive opener |
| ZywOo | Team Vitality | elite firepower, clutch stabilizer |
| NiKo | Team Falcons | elite rifle firepower, emotional swing |
| m0NESY | Team Falcons | elite AWP firepower |
| ropz | Team Vitality or current team snapshot | closer, high discipline |
| apEX | Team Vitality | high tactics, volatile leader |
| karrigan | FaZe or current team snapshot | high tactics, low firepower value |
| KSCERATO | FURIA | reliable rifler |

This list is a design seed, not a complete roster file.

## Player Attribute Ranges

Use a 1-100 scale:

- 90-100: world-class, should be expensive and rare.
- 75-89: strong elite tournament player.
- 60-74: stable role player.
- below 60: avoid in v0.1 unless the economy needs cheap filler.

Prices should force tradeoffs. A roster of five top-10 stars must be impossible.

Pricing should be derived from player ratings rather than assigned first. Start from real-world-inspired firepower, tactics, role value, and trait profile; then calculate price so stronger players naturally become more expensive.

## Traits

Traits describe public, in-game style and manager-relevant behavior. They should be realistic and gameable, not copied from event-library wording.

Initial trait vocabulary:

| Trait | Positive effect | Negative effect |
|---|---|---|
| hot_blooded | firepower bonus in entry events | small team tactics penalty |
| calm_clutcher | clutch and late-round bonus | lower early aggression |
| system_leader | team tactics bonus | personal firepower tax |
| streaky_star | high ceiling in highlight events | higher upset risk |
| disciplined | fewer economy mistakes | fewer explosive multi-kill events |
| crowd_favorite | morale boost in finals | pressure penalty after bad starts |

Traits should stack gently. A single trait should usually move a check by 3-8 points.

Traits do not operate only as isolated modifiers. Roster building also checks lightweight chemistry rules from `docs/product-specs/MECHANICS.md`, such as star-and-stabilizer, system core, double volatility, real core, and patchwork stars. This prevents drafts from becoming a pure firepower comparison.

Traits can also trigger occasional event chains. These events should be tied clearly to the trait and should affect the match state, not only text.

Example:

```text
Trait: hot_blooded
Stable effect: personal firepower up, team cohesion or discipline down.
Possible event chain: forces an early push -> gets isolated -> team loses first contact -> bombsite is lost and the team must retreat.
```

Trait events should not fire so often that a player becomes a liability every match. They should create memorable moments and tradeoffs.

When a negative trait chain triggers, the match engine may offer a timeout prompt if the team still has its one timeout available. A timeout can interrupt or soften the chain, but spending it should be a meaningful cost because it cannot be used again in the same match.

High team cohesion should soften negative personality and condition events, including low morale, poor form, anger, and internal conflict. This gives the player a reason to build a compatible roster instead of only buying raw firepower.

## Cohesion Calculation

Team cohesion should combine:

- each player's individual personality score.
- personality and playstyle tag compatibility.
- small familiarity bonuses for real-world teammates.

This means a dream roster can still be unstable if personalities clash, while former teammates can provide a stability bonus. Reality familiarity should help but should not force the player to recreate real teams.

Cohesion has both gradual and threshold effects:

- lower cohesion gradually raises internal conflict and communication failure risk.
- higher cohesion gradually softens pressure, slump, anger, and volatile trait penalties.
- cohesion below 30 unlocks exclusive negative event chains.
- cohesion above 80 unlocks exclusive positive trust event chains.

## Team Size

Each team should support six players:

- five active starters.
- one substitute.

The active five play by default. The substitute matters for absence events, poor form, injuries or fatigue-like story events, and transfer strategy.

At game start, the player selects six players from the player pool using starting money. After the initial selection, the player cannot freely buy unowned players; roster changes require trades with other teams using players and money as exchange pieces.

## Annual Top Ten

At the end of each year, the game announces the season's top ten players across all eight teams, not only the player's team.

The ranking should feel inspired by HLTV-style performance logic, but it is game-owned and can use simplified simulated stats such as:

- match impact.
- MVP events.
- cup MVP awards.
- clutch events.
- cup placement.
- consistency.
- role-adjusted rating.

This ranking should influence story, prestige, and potentially future market value.

See `docs/product-specs/AWARDS.md` for the full annual awards rules.

## Auto-Assignment

After the player drafts five players:

1. Preserve original team cores where possible.
2. Fill each AI team to five starters and one substitute when the six-player roster milestone is active.
3. Prefer one tactical leader per AI team.
4. Avoid putting all elite stars on one AI team unless they belong to the same source team.
5. If two teams have similar need, choose by seeded randomness.
