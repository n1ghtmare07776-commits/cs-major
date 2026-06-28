# UI Text

## Rule

The UI should feel like an esports match diary: compact, tense, and readable.

Match text should be organized into event cards. A decision card starts with the situation, presents choices, then continues with the consequence after the player chooses. The final line should show compact numeric or tag changes.

Non-decision event cards can stay semi-transparent. Player decision cards should be more explicit about the relevant numeric comparison and final stat deltas.

## DO

```ts
// Good: short event text with a visible consequence.
appendLog("donk bursts through mid for the opener. Spirit's defense bends early.");
```

```ts
// Good: event card ends with compact state feedback.
eventCard.delta = "Team cohesion +4, tactical execution +2";
```

```ts
// Good: choice labels are actions, not explanations.
choices = ["Explode onto A", "Fake B then rotate", "Slow default"];
```

## DON'T

```ts
// Bad: the UI explains implementation details.
appendLog("Your strategy gained +6 from the matrix and +3 from tactics.");
```

```ts
// Bad: walls of text slow the cup loop.
appendLog(longParagraphWithEveryRoundDetail);
```

## Exceptions

Post-match summaries may show more detail, especially MVP, turning point, and tactical decision history.
