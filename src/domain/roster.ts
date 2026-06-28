import { traitDefinitions } from "../content/traits.ts";
import type { PlayerContent, TeamId } from "../content/players.ts";

export interface Player extends PlayerContent {}

export interface TeamStats {
  firepower: number;
  tacticalExecution: number;
  cohesion: number;
  discipline: number;
}

export interface TeamRosterValidation {
  valid: boolean;
  errors: string[];
}

export interface TeamRoster {
  id: string;
  name: string;
  sourceTeamId?: TeamId;
  players: Player[];
  starters: Player[];
  substitute: Player;
  totalPrice: number;
  validation: TeamRosterValidation;
  stats: TeamStats;
}

export interface CreateRosterInput {
  teamId: string;
  name: string;
  playerIds: string[];
  substituteId: string;
  availablePlayers: Player[];
  budget: number;
  sourceTeamId?: TeamId;
}

interface ValidationInput {
  players: Player[];
  substituteId: string;
  budget: number;
}

function clampStat(value: number): number {
  return Math.max(1, Math.min(100, Math.round(value)));
}

export function getPlayerById(players: Player[], id: string): Player {
  const player = players.find((entry) => entry.id === id);
  if (!player) {
    throw new Error(`Unknown player: ${id}`);
  }
  return player;
}

export function buildRosterValidation({ players, substituteId, budget }: ValidationInput): TeamRosterValidation {
  const errors: string[] = [];
  const ids = players.map((player) => player.id);
  const uniqueCount = new Set(ids).size;

  if (players.length !== 6) {
    errors.push("Roster must contain exactly six players.");
  }
  if (uniqueCount !== ids.length) {
    errors.push("Roster contains duplicate players.");
  }
  if (!ids.includes(substituteId)) {
    errors.push("Substitute must be a player on the roster.");
  }
  const totalPrice = players.reduce((sum, player) => sum + player.price, 0);
  if (totalPrice > budget) {
    errors.push(`Roster exceeds budget ${budget}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getFamiliarityBonus(starters: Player[]): number {
  const counts = new Map<TeamId, number>();
  for (const player of starters) {
    counts.set(player.teamId, (counts.get(player.teamId) ?? 0) + 1);
  }

  let bonus = 0;
  for (const count of counts.values()) {
    if (count >= 2) {
      bonus += count * 2;
    }
  }
  return bonus;
}

export function deriveTeamStats(rosterLike: Pick<TeamRoster, "starters">): TeamStats {
  const starters = rosterLike.starters;
  const firepower = average(starters.map((player) => player.firepower));
  const tacticsBase =
    average(starters.map((player) => player.tactics)) +
    starters.filter((player) => player.role === "igl").length * 4;
  const disciplineBase = average(starters.map((player) => player.discipline));
  const personalityBalance = average(starters.map((player) => player.personality));
  const familiarityBonus = getFamiliarityBonus(starters);

  let traitCohesionDelta = 0;
  let traitTacticsDelta = 0;
  let traitDisciplineDelta = 0;

  for (const player of starters) {
    for (const trait of player.traits) {
      const definition = traitDefinitions[trait];
      traitCohesionDelta += definition.modifiers.cohesion ?? 0;
      traitTacticsDelta += definition.modifiers.tactics ?? 0;
      traitDisciplineDelta += definition.modifiers.discipline ?? 0;
    }
  }

  return {
    firepower: clampStat(firepower),
    tacticalExecution: clampStat(tacticsBase + traitTacticsDelta / starters.length),
    cohesion: clampStat(personalityBalance + familiarityBonus + traitCohesionDelta / starters.length),
    discipline: clampStat(disciplineBase + traitDisciplineDelta / starters.length),
  };
}

export function createRoster(input: CreateRosterInput): TeamRoster {
  const players = input.playerIds.map((id) => getPlayerById(input.availablePlayers, id));
  const validation = buildRosterValidation({
    players,
    substituteId: input.substituteId,
    budget: input.budget,
  });

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const substitute = getPlayerById(players, input.substituteId);
  const starters = players.filter((player) => player.id !== input.substituteId);

  const team: TeamRoster = {
    id: input.teamId,
    name: input.name,
    sourceTeamId: input.sourceTeamId,
    players,
    starters,
    substitute,
    totalPrice: players.reduce((sum, player) => sum + player.price, 0),
    validation,
    stats: { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0 },
  };

  team.stats = deriveTeamStats(team);
  return team;
}
