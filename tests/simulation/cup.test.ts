import test from "node:test";
import assert from "node:assert/strict";

import { playerPool } from "../../src/content/players.ts";
import { cups, sourceTeams } from "../../src/content/teams.ts";
import { createRoster } from "../../src/domain/roster.ts";
import { autoFillAiTeams, createDraftPlan } from "../../src/simulation/draft.ts";
import { runCup } from "../../src/simulation/cup.ts";

test("autoFillAiTeams builds seven AI teams with six-player rosters and no drafted players", () => {
  const playerRoster = createRoster({
    teamId: "player-team",
    name: "枪神队伍",
    playerIds: ["donk", "frozen", "b1t", "910", "chopper", "s1ren"],
    substituteId: "910",
    availablePlayers: playerPool,
    budget: 120,
  });

  const aiTeams = autoFillAiTeams({
    sourceTeams,
    playerPool,
    draftedPlayerIds: playerRoster.players.map((player) => player.id),
    seed: 17,
  });

  assert.equal(aiTeams.length, 7);
  const allAiPlayers = aiTeams.flatMap((team) => team.players.map((player) => player.id));
  assert.equal(new Set(allAiPlayers).size, allAiPlayers.length);
  for (const team of aiTeams) {
    assert.equal(team.players.length, 6);
    assert.equal(team.starters.length, 5);
  }
  for (const draftedId of playerRoster.players.map((player) => player.id)) {
    assert.equal(allAiPlayers.includes(draftedId), false);
  }
});

test("runCup is deterministic for the same seed and produces a champion plus cup MVP", () => {
  const playerRoster = createRoster({
    teamId: "player-team",
    name: "枪神队伍",
    playerIds: ["donk", "ropz", "chopper", "b1t", "magixx", "jimpphat"],
    substituteId: "jimpphat",
    availablePlayers: playerPool,
    budget: 120,
  });

  const aiTeams = autoFillAiTeams({
    sourceTeams,
    playerPool,
    draftedPlayerIds: playerRoster.players.map((player) => player.id),
    seed: 221,
  });

  const firstRun = runCup({
    cup: cups[0],
    playerTeam: playerRoster,
    aiTeams,
    seed: 221,
  });
  const secondRun = runCup({
    cup: cups[0],
    playerTeam: playerRoster,
    aiTeams,
    seed: 221,
  });

  assert.deepEqual(firstRun.bracket, secondRun.bracket);
  assert.deepEqual(firstRun.rounds, secondRun.rounds);
  assert.deepEqual(firstRun.champion, secondRun.champion);
  assert.deepEqual(firstRun.cupMvp, secondRun.cupMvp);
  assert.ok(firstRun.cupMvp);
  assert.equal(typeof firstRun.cupMvp.playerId, "string");
  assert.equal(firstRun.champion.name.length > 0, true);
});

test("createDraftPlan suggests a legal six-player core for 枪神队伍", () => {
  const draftPlan = createDraftPlan({
    playerPool,
    budget: 100,
    preferredCoreTeamId: "spirit",
  });

  assert.equal(draftPlan.playerIds.length, 6);
  assert.equal(new Set(draftPlan.playerIds).size, 6);
  assert.ok(draftPlan.totalPrice <= 100);
  assert.ok(draftPlan.playerIds.includes("donk"));
});
