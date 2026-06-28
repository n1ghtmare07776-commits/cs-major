# Mechanics Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the confirmed v0.1 mechanics foundation without delaying the first playable cup.

**Architecture:** Keep data in `src/content`, pure rules in `src/domain`, deterministic resolution in `src/simulation`, and display-only behavior in `src/ui` or `src/app`. The first implementation should prioritize readable effects and tests over simulation depth.

**Tech Stack:** TypeScript domain/simulation code, Node test runner, static browser UI.

---

## File Structure

- `src/content/traits.ts`: trait definitions, stable modifiers, event hooks, and chemistry tags.
- `src/content/tactics.ts`: attack tactics, defense tactics, base collision table, and text labels.
- `src/content/coach-philosophies.ts`: four coach philosophies and their modifiers.
- `src/domain/chemistry.ts`: team chemistry rule evaluation.
- `src/domain/condition.ts`: match, cup, and major condition duration types.
- `src/domain/impact.ts`: impact rating component types and formula.
- `src/simulation/strategyMemory.ts`: tactic memory updates and scouting summaries.
- `src/simulation/match.ts`: tactic collision, timeout decisions, condition updates, and high-risk drama hooks.
- `tests/domain/chemistry.test.ts`: chemistry and cohesion threshold tests.
- `tests/domain/impact.test.ts`: impact rating tests.
- `tests/simulation/tactics.test.ts`: attack/defense matrix and memory tests.

## Task 1: Chemistry Rules

**Files:**
- Modify: `src/content/traits.ts`
- Create: `src/domain/chemistry.ts`
- Test: `tests/domain/chemistry.test.ts`

- [ ] **Step 1: Write failing tests for three chemistry rules**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { evaluateChemistry } from "../../src/domain/chemistry.ts";

test("star and stabilizer softens volatility", () => {
  const result = evaluateChemistry([
    { traits: ["hot_blooded", "streaky_star"], personality: 58, teamId: "spirit", role: "entry", tactics: 78 },
    { traits: ["calm_clutcher"], personality: 80, teamId: "vitality", role: "awp", tactics: 84 },
    { traits: ["system_leader"], personality: 76, teamId: "faze", role: "igl", tactics: 92 },
    { traits: ["disciplined"], personality: 77, teamId: "navi", role: "rifler", tactics: 78 },
    { traits: ["disciplined"], personality: 79, teamId: "furia", role: "lurker", tactics: 80 },
  ]);

  assert.ok(result.labels.includes("明星 + 稳定器"));
  assert.ok(result.modifiers.cohesion >= 0);
});

test("double volatility increases firepower but lowers discipline", () => {
  const result = evaluateChemistry([
    { traits: ["hot_blooded"], personality: 58, teamId: "spirit", role: "entry", tactics: 78 },
    { traits: ["hot_blooded"], personality: 54, teamId: "vitality", role: "igl", tactics: 90 },
    { traits: ["disciplined"], personality: 77, teamId: "navi", role: "rifler", tactics: 78 },
    { traits: ["disciplined"], personality: 79, teamId: "furia", role: "lurker", tactics: 80 },
    { traits: ["calm_clutcher"], personality: 80, teamId: "vitality", role: "awp", tactics: 84 },
  ]);

  assert.ok(result.labels.includes("双重火药桶"));
  assert.ok(result.modifiers.firepower > 0);
  assert.ok(result.modifiers.discipline < 0);
});

test("real core grants a small familiarity bonus", () => {
  const result = evaluateChemistry([
    { traits: ["calm_clutcher"], personality: 80, teamId: "vitality", role: "awp", tactics: 84 },
    { traits: ["system_leader"], personality: 54, teamId: "vitality", role: "igl", tactics: 90 },
    { traits: ["disciplined"], personality: 77, teamId: "navi", role: "rifler", tactics: 78 },
    { traits: ["disciplined"], personality: 79, teamId: "furia", role: "lurker", tactics: 80 },
    { traits: ["calm_clutcher"], personality: 74, teamId: "faze", role: "awp", tactics: 77 },
  ]);

  assert.ok(result.labels.includes("现实队友默契"));
  assert.ok(result.modifiers.cohesion > 0);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/domain/chemistry.test.ts`

Expected: fail because `src/domain/chemistry.ts` does not exist yet.

- [ ] **Step 3: Implement `evaluateChemistry` with the documented lightweight rules**

Implement only the rules in `docs/product-specs/MECHANICS.md`: star and stabilizer, double volatility, system core, cold structure, crowd battery, pressure echo, lone caller, leadership room, real core, and patchwork stars.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- tests/domain/chemistry.test.ts`

Expected: all chemistry tests pass.

## Task 2: Attack/Defense Strategy Matrix

**Files:**
- Create: `src/content/tactics.ts`
- Create: `src/simulation/tactics.ts`
- Test: `tests/simulation/tactics.test.ts`

- [ ] **Step 1: Write failing tests for matrix edges**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { getBaseTacticEdge } from "../../src/simulation/tactics.ts";

test("fake rotate gains against wrong stack", () => {
  assert.equal(getBaseTacticEdge("fake_rotate", "stack_site"), 8);
});

test("rush site loses hard into a correct stack", () => {
  assert.equal(getBaseTacticEdge("rush_site", "stack_site"), -10);
});

test("default contact gains against early aggression", () => {
  assert.equal(getBaseTacticEdge("default_contact", "early_aggression"), 6);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/simulation/tactics.test.ts`

Expected: fail because tactic modules do not exist yet.

- [ ] **Step 3: Implement tactic ids, labels, and collision values**

Use the attack and defense tactics from `docs/product-specs/MECHANICS.md`. Keep the table small and deterministic.

- [ ] **Step 4: Run the tactic tests**

Run: `npm run test -- tests/simulation/tactics.test.ts`

Expected: all tactic tests pass.

## Task 3: Timeout Options and Coach Philosophy

**Files:**
- Create: `src/content/coach-philosophies.ts`
- Modify: `src/simulation/match.ts`
- Test: `tests/simulation/timeout.test.ts`

- [ ] **Step 1: Write failing tests for timeout effects**

Test that tactical reset improves the next tactic check, emotional reset softens condition penalties, and discipline reset interrupts a volatile chain.

- [ ] **Step 2: Implement the four coach philosophies**

Add `tactician`, `player_whisperer`, `gambler`, and `disciplinarian` with small modifiers that affect events and timeout outcomes.

- [ ] **Step 3: Wire timeout choices into player match resolution**

Each player match still has exactly one timeout. The UI should display no timeout option after it is spent.

- [ ] **Step 4: Run timeout tests**

Run: `npm run test -- tests/simulation/timeout.test.ts`

Expected: timeout tests pass.

## Task 4: Impact Rating

**Files:**
- Create: `src/domain/impact.ts`
- Modify: `src/simulation/cup.ts`
- Test: `tests/domain/impact.test.ts`

- [ ] **Step 1: Write failing tests for mixed rating**

Test that a champion player with solid performance beats an average finalist, and that an exceptional non-champion can still beat a weak champion player.

- [ ] **Step 2: Implement the mixed impact formula**

Use the component names from `docs/product-specs/MECHANICS.md`: personal impact, clutch impact, decision influence, consistency, role adjustment, team placement bonus, award bonus, and collapse penalty.

- [ ] **Step 3: Replace ad hoc MVP selection with impact rating**

Cup MVP should use the shared impact rating, not a separate one-off score.

- [ ] **Step 4: Run cup and impact tests**

Run: `npm run test -- tests/domain/impact.test.ts tests/simulation/cup.test.ts`

Expected: all tests pass.

## Task 5: Scouting and Strategy Memory

**Files:**
- Create: `src/simulation/strategyMemory.ts`
- Modify: `src/content/events.ts`
- Modify: `src/simulation/match.ts`
- Test: `tests/simulation/strategyMemory.test.ts`

- [ ] **Step 1: Write failing tests for memory summaries**

Test that repeated player tactics produce a readable AI counter warning, and repeated AI tactics produce a scouting report.

- [ ] **Step 2: Implement tactic memory updates after each player match**

Track recent attack and defense tactics by team id. Keep the memory short enough that old habits decay.

- [ ] **Step 3: Add scouting cards before player matches**

Scouting cards should expose likely opponent tendencies or warn that the opponent has read the player's repeated tactic.

- [ ] **Step 4: Run memory tests**

Run: `npm run test -- tests/simulation/strategyMemory.test.ts`

Expected: all strategy-memory tests pass.

## Task 6: Deferred Campaign Systems

**Files:**
- Modify when campaign mode is active: `src/simulation/season.ts`
- Modify when transfer windows are active: `src/simulation/transfers.ts`

- [ ] **Step 1: Add eventized bidding only after the transfer window exists**

Do not build a full market first. Add one cup-end bidding scene with money, player value, recent success, promised role, and roster fit.

- [ ] **Step 2: Add season-end growth only after annual awards exist**

Apply small permanent changes after each season, using age, performance, MVP records, slump records, and major condition records.

- [ ] **Step 3: Add economy simulations before tuning prize money**

Run all-champion, mixed-result, and all-loss campaign paths before finalizing long-term budget values.

## Verification

Run these before handoff:

```sh
npm run test
npm run build
npm run test:architecture
npm run check:docs
npm run gc
```

Expected: every command exits with code 0.
