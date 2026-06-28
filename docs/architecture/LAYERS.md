# Architecture Layers

Dependency direction is strict:

```text
app -> ui -> simulation -> domain -> content
```

Lower layers never import higher layers. A layer may import itself and any layer to its right in the diagram above.

## Layer Responsibilities

| Layer | Directory | May import | Owns |
|---|---|---|---|
| Content | `src/content/` | none | Static roster, traits, tournament templates, text fragments |
| Domain | `src/domain/` | content | Types, invariants, economy rules, team validation |
| Simulation | `src/simulation/` | content, domain | Draft AI, bracket, match resolver, strategy matrix, narrative events |
| UI | `src/ui/` | content, domain, simulation | Screens, view models, interaction state |
| App | `src/app/` | content, domain, simulation, ui | Bootstrapping, routes, save/load adapters |

## Allowed Examples

```ts
// Good: simulation consumes domain rules.
import { calculateTeamRating } from "@/domain/team";

// Good: UI asks simulation to resolve a prompt.
import { resolveDecision } from "@/simulation/match";
```

## Forbidden Examples

```ts
// Bad: domain cannot know about UI.
import { MatchLog } from "@/ui/MatchLog";

// Bad: content cannot import generated rules.
import { createBracket } from "@/simulation/bracket";
```

## Remediation

When the architecture test reports a violation:

1. Move shared types down into `src/domain/`.
2. Move pure static data down into `src/content/`.
3. Pass behavior through function parameters instead of importing upward.
4. Keep browser APIs in `src/app/` or UI adapters.

## Boundary Test

Run:

```sh
npm run test:architecture
```

The test scans source imports and prints:

```text
VIOLATION: {file} imports {target} - {layer} cannot import {target_layer}. See docs/architecture/LAYERS.md
```

