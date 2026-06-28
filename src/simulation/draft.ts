import { PLAYER_TEAM_ID, PLAYER_TEAM_NAME, sourceTeams } from "../content/teams.ts";
import type { PlayerContent, TeamId } from "../content/players.ts";
import { getPlayersByTeam } from "../content/players.ts";
import { createRoster, type TeamRoster } from "../domain/roster.ts";
import { createRng, shuffleWithSeed } from "./rng.ts";

export interface AutoFillAiTeamsInput {
  sourceTeams: typeof sourceTeams;
  playerPool: PlayerContent[];
  draftedPlayerIds: string[];
  seed: number;
}

export interface DraftPlanInput {
  playerPool: PlayerContent[];
  budget: number;
  preferredCoreTeamId?: TeamId;
}

export interface DraftPlan {
  playerIds: string[];
  substituteId: string;
  totalPrice: number;
}

const fillerNames = [
  "Lantern", "North", "Zero", "Sparrow", "Vega", "Tempo", "Orbit",
  "Harbor", "Pulse", "Cipher", "Kite", "Metro", "Nova", "Atlas",
];

function makeFillerPlayer(teamId: TeamId, index: number): PlayerContent {
  const base = 61 + (index % 10);
  return {
    id: `filler-${teamId}-${index}`,
    name: `${fillerNames[index % fillerNames.length]}-${teamId}`,
    teamId,
    role: index % 5 === 0 ? "igl" : index % 5 === 1 ? "awp" : "rifler",
    firepower: base + 3,
    tactics: base,
    discipline: base + 2,
    clutch: base,
    salaryLevel: 1,
    price: 7,
    personality: base + 4,
    traits: ["disciplined"],
    sourceNote: "Generated filler to keep v0.1 tournament rosters complete.",
  };
}

export function autoFillAiTeams(input: AutoFillAiTeamsInput): TeamRoster[] {
  const drafted = new Set(input.draftedPlayerIds);
  const aiSourceTeams = input.sourceTeams.filter((team) => team.id !== "spirit" || !drafted.has("donk"));
  const selectedTeams = aiSourceTeams.slice(0, 7);

  if (selectedTeams.length < 7) {
    for (const team of input.sourceTeams) {
      if (!selectedTeams.includes(team)) selectedTeams.push(team);
      if (selectedTeams.length === 7) break;
    }
  }

  return selectedTeams.slice(0, 7).map((team, teamIndex) => {
    const naturalPlayers = getPlayersByTeam(team.id)
      .filter((player) => !drafted.has(player.id))
      .sort((left, right) => right.price - left.price);
    const players = [...naturalPlayers];
    let fillerIndex = teamIndex * 10;
    while (players.length < 6) {
      players.push(makeFillerPlayer(team.id, fillerIndex));
      fillerIndex += 1;
    }

    const six = shuffleWithSeed(players, input.seed + teamIndex)
      .sort((left, right) => right.price - left.price)
      .slice(0, 6);
    const substitute = six[six.length - 1];
    return createRoster({
      teamId: team.id,
      name: team.name,
      sourceTeamId: team.id,
      playerIds: six.map((player) => player.id),
      substituteId: substitute.id,
      availablePlayers: [...input.playerPool, ...six],
      budget: 999,
    });
  });
}

export function createDraftPlan(input: DraftPlanInput): DraftPlan {
  const rng = createRng(31);
  const preferred = input.preferredCoreTeamId
    ? getPlayersByTeam(input.preferredCoreTeamId).sort((left, right) => right.price - left.price)
    : [];
  const result: PlayerContent[] = [];

  for (const player of preferred) {
    const nextTotal = result.reduce((sum, entry) => sum + entry.price, 0) + player.price;
    if (nextTotal <= input.budget && result.length < 3) {
      result.push(player);
    }
  }

  const remaining = [...input.playerPool]
    .filter((player) => !result.some((entry) => entry.id === player.id))
    .sort((left, right) => (right.firepower + right.tactics) - (left.firepower + left.tactics));

  for (const player of remaining) {
    if (result.length === 6) break;
    const nextTotal = result.reduce((sum, entry) => sum + entry.price, 0) + player.price;
    const slotsAfter = 6 - result.length - 1;
    if (nextTotal + slotsAfter * 7 <= input.budget) {
      result.push(player);
    }
  }

  while (result.length < 6) {
    const currentTotal = result.reduce((sum, entry) => sum + entry.price, 0);
    const cheap = input.playerPool
      .filter((player) => !result.some((entry) => entry.id === player.id))
      .filter((player) => currentTotal + player.price <= input.budget)
      .sort((left, right) => left.price - right.price);
    if (cheap.length === 0) {
      const removable = [...result]
        .filter((player) => player.id !== "donk")
        .sort((left, right) => right.price - left.price)[0];
      if (!removable) {
        throw new Error("Could not create a legal draft plan within budget.");
      }
      result.splice(result.findIndex((player) => player.id === removable.id), 1);
      continue;
    }
    result.push(cheap[rng.int(0, Math.min(cheap.length - 1, 2))]);
  }

  const substitute = [...result].sort((left, right) => left.price - right.price)[0];
  return {
    playerIds: result.map((player) => player.id),
    substituteId: substitute.id,
    totalPrice: result.reduce((sum, player) => sum + player.price, 0),
  };
}

export function createPlayerTeamFromDraft(plan: DraftPlan, playerPool: PlayerContent[], budget: number): TeamRoster {
  return createRoster({
    teamId: PLAYER_TEAM_ID,
    name: PLAYER_TEAM_NAME,
    playerIds: plan.playerIds,
    substituteId: plan.substituteId,
    availablePlayers: playerPool,
    budget,
  });
}
