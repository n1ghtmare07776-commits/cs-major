# Data Canon

## Rule

Roster, trait, tournament, and narrative content belongs in content data, not scattered through UI or simulation code.

## DO

```ts
// Good: static data is loaded from content.
import { players } from "@/content/players";

const zywoo = players.find((player) => player.id === "zywoo");
```

```ts
// Good: source date is explicit in the content module.
export const rosterSnapshotDate = "2026-06-25";
```

## DON'T

```ts
// Bad: UI hard-codes balance data.
if (name === "ZywOo") firepower = 99;
```

```ts
// Bad: simulation fetches live roster data at runtime.
const players = await fetch("https://example.com/current-rosters");
```

## Exceptions

One-off tutorial copy may live near its screen while the tutorial is experimental. Move reusable match text into content before adding variants.

