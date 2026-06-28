import test from "node:test";
import assert from "node:assert/strict";

import { playerPool } from "../../src/content/players.ts";
import { PLAYER_TEAM_NAME, STARTING_BUDGET } from "../../src/content/teams.ts";
import {
  buildRosterValidation,
  createRoster,
  deriveTeamStats,
  getPlayerById,
} from "../../src/domain/roster.ts";

test("createRoster accepts six-player roster under budget with one substitute", () => {
  const selectedIds = [
    "zont1x",
    "flamez",
    "xertion",
    "frozen",
    "broky",
    "yuurih",
  ];

  const roster = createRoster({
    teamId: "player-team",
    name: PLAYER_TEAM_NAME,
    playerIds: selectedIds,
    substituteId: "yuurih",
    availablePlayers: playerPool,
    budget: STARTING_BUDGET,
  });

  assert.equal(roster.players.length, 6);
  assert.equal(roster.starters.length, 5);
  assert.equal(roster.substitute.id, "yuurih");
  assert.equal(roster.validation.valid, true);
  assert.ok(roster.totalPrice <= STARTING_BUDGET);
});

test("buildRosterValidation rejects duplicate players and overspending", () => {
  const expensiveStarIds = [
    "donk",
    "zywoo",
    "niko",
    "monesy",
    "ropz",
    "apex",
  ];

  const expensivePlayers = expensiveStarIds.map((id) => {
    const player = getPlayerById(playerPool, id);
    assert.ok(player);
    return player;
  });

  const duplicateValidation = buildRosterValidation({
    players: [
      expensivePlayers[0],
      expensivePlayers[0],
      expensivePlayers[2],
      expensivePlayers[3],
      expensivePlayers[4],
      expensivePlayers[5],
    ],
    substituteId: expensivePlayers[5].id,
    budget: STARTING_BUDGET,
  });

  assert.equal(duplicateValidation.valid, false);
  assert.match(duplicateValidation.errors.join(" "), /duplicate/i);

  const overspendValidation = buildRosterValidation({
    players: expensivePlayers,
    substituteId: expensivePlayers[5].id,
    budget: STARTING_BUDGET,
  });

  assert.equal(overspendValidation.valid, false);
  assert.match(overspendValidation.errors.join(" "), /budget|price|overspend/i);
});

test("deriveTeamStats returns readable bounded team values", () => {
  const roster = createRoster({
    teamId: "player-team",
    name: PLAYER_TEAM_NAME,
    playerIds: ["donk", "sh1ro", "zont1x", "chopper", "magixx", "s1ren"],
    substituteId: "s1ren",
    availablePlayers: playerPool,
    budget: STARTING_BUDGET + 10,
  });

  const stats = deriveTeamStats(roster);

  assert.ok(stats.firepower >= 1 && stats.firepower <= 100);
  assert.ok(stats.tacticalExecution >= 1 && stats.tacticalExecution <= 100);
  assert.ok(stats.cohesion >= 1 && stats.cohesion <= 100);
  assert.ok(stats.discipline >= 1 && stats.discipline <= 100);
});
