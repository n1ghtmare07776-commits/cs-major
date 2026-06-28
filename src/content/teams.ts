import type { TeamId } from "./players.ts";

export const PLAYER_TEAM_ID = "player-team";
export const PLAYER_TEAM_NAME = "枪神队伍";
export const STARTING_BUDGET = 100;

export interface SourceTeamDefinition {
  id: TeamId;
  name: string;
  shortName: string;
  seedBias: number;
}

export interface CupDefinition {
  id: string;
  name: string;
  prizeMoney: {
    champion: number;
    runnerUp: number;
    semifinal: number;
    quarterfinal: number;
  };
}

export const sourceTeams: SourceTeamDefinition[] = [
  { id: "spirit", name: "Team Spirit", shortName: "Spirit", seedBias: 96 },
  { id: "vitality", name: "Team Vitality", shortName: "Vitality", seedBias: 98 },
  { id: "falcons", name: "Team Falcons", shortName: "Falcons", seedBias: 95 },
  { id: "mouz", name: "MOUZ", shortName: "MOUZ", seedBias: 90 },
  { id: "faze", name: "FaZe Clan", shortName: "FaZe", seedBias: 88 },
  { id: "furia", name: "FURIA Esports", shortName: "FURIA", seedBias: 89 },
  { id: "navi", name: "Natus Vincere", shortName: "NAVI", seedBias: 92 },
  { id: "mongolz", name: "The MongolZ", shortName: "MongolZ", seedBias: 87 },
];

export const cups: CupDefinition[] = [
  {
    id: "iem-katowice",
    name: "IEM Katowice",
    prizeMoney: { champion: 20, runnerUp: 12, semifinal: 7, quarterfinal: 3 },
  },
  {
    id: "iem-cologne",
    name: "IEM Cologne",
    prizeMoney: { champion: 20, runnerUp: 12, semifinal: 7, quarterfinal: 3 },
  },
  {
    id: "major",
    name: "Major",
    prizeMoney: { champion: 24, runnerUp: 14, semifinal: 8, quarterfinal: 4 },
  },
];
