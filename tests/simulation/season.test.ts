import test from "node:test";
import assert from "node:assert/strict";

import { playerPool } from "../../src/content/players.ts";
import { sourceTeams } from "../../src/content/teams.ts";
import { createRoster } from "../../src/domain/roster.ts";
import { autoFillAiTeams } from "../../src/simulation/draft.ts";
import { runCareer } from "../../src/simulation/season.ts";

function buildPlayerRoster() {
  return createRoster({
    teamId: "player-team",
    name: "枪神队伍",
    playerIds: ["donk", "ropz", "chopper", "magixx", "zont1x", "s1ren"],
    substituteId: "s1ren",
    availablePlayers: playerPool,
    budget: 100,
  });
}

test("runCareer completes three seasons and nine cups deterministically", () => {
  const playerTeam = buildPlayerRoster();
  const aiTeams = autoFillAiTeams({
    sourceTeams,
    playerPool,
    draftedPlayerIds: playerTeam.players.map((player) => player.id),
    seed: 20270626,
  });

  const firstRun = runCareer({
    playerTeam,
    aiTeams,
    seed: 20270626,
  });
  const secondRun = runCareer({
    playerTeam,
    aiTeams,
    seed: 20270626,
  });

  assert.equal(firstRun.seasons.length, 3);
  assert.equal(firstRun.seasons.flatMap((season) => season.cups).length, 9);
  assert.deepEqual(firstRun, secondRun);
});

test("runCareer produces annual awards and final chronicle summary", () => {
  const playerTeam = buildPlayerRoster();
  const aiTeams = autoFillAiTeams({
    sourceTeams,
    playerPool,
    draftedPlayerIds: playerTeam.players.map((player) => player.id),
    seed: 77,
  });

  const career = runCareer({
    playerTeam,
    aiTeams,
    seed: 77,
  });

  for (const season of career.seasons) {
    assert.equal(season.cups.length, 3);
    assert.ok(season.annualAwards.bestClub.name.length > 0);
    assert.equal(season.annualAwards.topTenPlayers.length, 10);
    assert.ok(season.annualAwards.playerOfTheYear.playerName.length > 0);
    assert.ok(season.annualAwards.signatureCall.length > 0);
    assert.ok(season.seasonSummary.length > 0);
  }

  assert.equal(career.chronicle.cupChampions.length, 9);
  assert.equal(career.chronicle.cupMvps.length, 9);
  assert.equal(career.chronicle.annualBestClubs.length, 3);
  assert.equal(career.chronicle.annualTopTens.length, 3);
  assert.ok(typeof career.chronicle.finalTrophyCount === "number");
  assert.ok(career.chronicle.managerReview.length > 0);
});
