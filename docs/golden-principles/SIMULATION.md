# Simulation

## Rule

Simulation must be deterministic, explainable, and small enough for players to understand through match text.

## DO

```ts
// Good: the same seed and same decision produce the same event.
const result = resolveMatchEvent({
  seed,
  playerDecision: "fake_b",
  opponentDecision: "early_rotate",
  teamA,
  teamB
});
```

```ts
// Good: modifiers are named and reportable.
const modifier = strategyMatrix.fake_b.vs_early_rotate;
log.push("The fake pulled two defenders away from A.");
```

## DON'T

```ts
// Bad: hidden randomness makes tests and replays impossible.
const roll = Math.random();
```

```ts
// Bad: unexplained constants make balance impossible to discuss.
score += 37;
```

## Exceptions

Prototype spikes may use rough constants, but must move them into named balance tables before merging into the main playable path.

