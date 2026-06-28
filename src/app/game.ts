import { playerPool, sourceTeams, cups, STARTING_BUDGET, PLAYER_TEAM_NAME } from "../content/index.ts";
import { createRoster, type TeamRoster } from "../domain/index.ts";
import { autoFillAiTeams, runCup, type CupResult } from "../simulation/index.ts";

export interface GameState {
  selectedIds: string[];
  substituteId?: string;
  playerTeam?: TeamRoster;
  aiTeams: TeamRoster[];
  cupResult?: CupResult;
  error?: string;
}

export const initialState: GameState = {
  selectedIds: [],
  aiTeams: [],
};

export function togglePlayer(state: GameState, playerId: string): GameState {
  const selectedIds = state.selectedIds.includes(playerId)
    ? state.selectedIds.filter((id) => id !== playerId)
    : state.selectedIds.length < 6
      ? [...state.selectedIds, playerId]
      : state.selectedIds;
  const substituteId = selectedIds.includes(state.substituteId ?? "") ? state.substituteId : selectedIds[5];
  return { ...state, selectedIds, substituteId, error: undefined };
}

export function setSubstitute(state: GameState, playerId: string): GameState {
  if (!state.selectedIds.includes(playerId)) return state;
  return { ...state, substituteId: playerId };
}

export function confirmRoster(state: GameState): GameState {
  try {
    const substituteId = state.substituteId ?? state.selectedIds[5];
    const playerTeam = createRoster({
      teamId: "player-team",
      name: PLAYER_TEAM_NAME,
      playerIds: state.selectedIds,
      substituteId,
      availablePlayers: playerPool,
      budget: STARTING_BUDGET,
    });
    const aiTeams = autoFillAiTeams({
      sourceTeams,
      playerPool,
      draftedPlayerIds: playerTeam.players.map((player) => player.id),
      seed: 20270625,
    });
    return { ...state, playerTeam, aiTeams, error: undefined };
  } catch (error) {
    return { ...state, error: error instanceof Error ? error.message : "阵容无效" };
  }
}

export function playCup(state: GameState): GameState {
  if (!state.playerTeam) return { ...state, error: "请先确认阵容。" };
  const cupResult = runCup({
    cup: cups[0],
    playerTeam: state.playerTeam,
    aiTeams: state.aiTeams,
    seed: 777,
  });
  return { ...state, cupResult, error: undefined };
}

export function getSelectedPrice(state: GameState): number {
  return state.selectedIds
    .map((id) => playerPool.find((player) => player.id === id))
    .filter(Boolean)
    .reduce((sum, player) => sum + player!.price, 0);
}

