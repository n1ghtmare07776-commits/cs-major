# QA v0.1 Playable Cup Acceptance Report

Date: 2026-06-25
Role: Subagent 4, Acceptance/QA Agent
Scope: Verify v0.1 acceptance standard for completing first cup with 枪神队伍 and seeing cup champion + cup MVP.

## Status

BLOCKED

The v0.1 playable cup cannot be accepted yet. The repository currently contains documentation, hygiene scripts, and one content file (`src/content/events.ts`), but no implemented draft flow, roster pool, bracket engine, match resolver, awards resolver, app shell, browser UI, or runtime scripts.

## Evidence Summary

- `package.json` exposes only `check:docs`, `test:architecture`, and `gc`.
- `npm run dev`, `npm run build`, and `npm run test` are missing.
- `src/` directories exist for the intended architecture, but the only source file found is `src/content/events.ts`.
- There is event-card content, but no code path that lets a player draft, start a cup, resolve matches, complete a bracket, or calculate/display awards.
- No dev server could be started because no app shell script exists.

## Commands Run

| Command | Result | Notes |
|---|---:|---|
| `npm run check:docs` | PASS | `Documentation check passed (10 files).` |
| `npm run test:architecture` | PASS | `Architecture boundary test passed.` |
| `npm run gc` | PASS | `Documentation entropy scan passed.` |
| `npm run` | PASS | Listed only `check:docs`, `test:architecture`, `gc`. |
| `npm run dev` | FAIL | Missing script: `dev`. No local app server available. |
| `npm run build` | FAIL | Missing script: `build`. |
| `npm run test` | FAIL | Missing script: `test`. |
| `find src -type f -maxdepth 5 -print` | PASS | Only `src/content/events.ts` found. |

Note: failed npm commands also reported that log files were not written because npm could not write under `/Users/didi/.npm/_logs`; the command output itself was captured.

## Acceptance Matrix

| # | Check | Status | Finding |
|---:|---|---|---|
| 1 | Can select six players under budget, with invalid roster blocked. | FAIL | No player pool, draft validation, budget logic, or UI exists. `spec/v0.1-vertical-slice.md` says five players, while `docs/product-specs/ROSTER.md` now describes six players. The user acceptance asks for six. |
| 2 | Seven AI teams are filled after player draft. | FAIL | No draft AI, team assignment, roster content, or team model exists. |
| 3 | Player matches can resolve; non-player matches resolve quickly. | FAIL | No match resolver, quick AI match resolver, bracket progression, or callable simulation code exists. |
| 4 | Cup completes deterministically with seed. | FAIL | No seeded RNG, bracket creation, cup runner, or determinism test exists. |
| 5 | Cup champion and cup MVP are announced. | FAIL | `docs/product-specs/AWARDS.md` defines this requirement, but no awards calculation or UI surface exists. |
| 6 | UI has Draft, Bracket, Match event cards, Awards surfaces or equivalent. | FAIL | No app shell or UI implementation exists. Design docs describe desired screens, but there are no rendered components. |
| 7 | Verification commands pass or gaps are documented. | DONE_WITH_CONCERNS | Existing hygiene commands pass. Runtime verification is blocked by missing `dev`, `build`, and `test` scripts and missing implementation. |

## Spec Cross-Check

### `docs/product-specs/AWARDS.md`

Not satisfied in implementation. The spec requires every completed cup to announce champion, runner-up, semifinalists, cup MVP, 枪神队伍 placement, prize money, and a short headline. None of these outputs are implemented.

### `spec/v0.1-vertical-slice.md`

Not satisfied in implementation:

- One-cup completion without editing data files: not available.
- Elimination fast-forward and champion announcement: not available.
- Champion and cup MVP for every completed cup: not available.
- Same seed produces same bracket and results: not available.
- At least three tactical prompt types: event content exists, but no match prompt engine exists.
- Opening economy and tactic prompts are separate: not available.
- Non-player bracket matches resolve without full match UI: not available.
- Final screen shows champion, cup MVP, and player team result: not available.

## Exact Gaps To Close

1. Add runtime app shell and scripts: `npm run dev`, `npm run build`, and `npm run test`.
2. Add roster/team content for the eight teams and enough players to draft six for 枪神队伍 while filling seven AI teams.
3. Add domain validation for budget, roster size, and invalid draft states.
4. Add deterministic seeded simulation for bracket generation, player matches, and quick non-player matches.
5. Add cup results and cup MVP calculation per `docs/product-specs/AWARDS.md`.
6. Add UI surfaces for draft, bracket, match event cards, and cup awards/final result.
7. Add tests or a deterministic smoke fixture that proves the same seed completes the same first cup.

## Final QA Decision

BLOCKED: The current repository passes documentation hygiene, but the playable v0.1 cup standard cannot be exercised or accepted because the implementation has not landed yet.
