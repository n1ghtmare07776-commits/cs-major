import type { CupDefinition } from "../content/teams.ts";
import { pickCupEncouragement, renderAnnualEncouragement, type Placement } from "../content/awardsText.ts";
import type { Player } from "../domain/roster.ts";
import type { TeamRoster } from "../domain/roster.ts";
import { createRng } from "./rng.ts";

export interface CupMatchResult {
  id: string;
  round: "quarterfinal" | "semifinal" | "final";
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  winnerId: string;
  eventCards: MatchEventCard[];
}

export interface MatchEventCard {
  title: string;
  text: string;
  delta: string;
  decision?: {
    prompt: string;
    choice: string;
  };
}

export interface CupMvp {
  playerId: string;
  playerName: string;
  teamId: string;
  rating: number;
  reason: string;
}

export interface CupResult {
  cupName: string;
  bracket: Array<{ round: string; matchIds: string[] }>;
  rounds: CupMatchResult[][];
  champion: TeamRoster;
  runnerUp: TeamRoster;
  semifinalists: TeamRoster[];
  cupMvp: CupMvp;
  playerPlacement: "champion" | "runner-up" | "semifinal" | "quarterfinal";
  headline: string;
  encouragement: string;
  annualPreview: string;
}

export interface RunCupInput {
  cup: CupDefinition;
  playerTeam: TeamRoster;
  aiTeams: TeamRoster[];
  seed: number;
}

function teamPower(team: TeamRoster): number {
  return (
    team.stats.firepower * 0.38 +
    team.stats.tacticalExecution * 0.28 +
    team.stats.cohesion * 0.18 +
    team.stats.discipline * 0.16
  );
}

function bestPlayer(team: TeamRoster): Player {
  return [...team.starters].sort((left, right) => {
    const leftScore = left.firepower + left.clutch + left.tactics * 0.35;
    const rightScore = right.firepower + right.clutch + right.tactics * 0.35;
    return rightScore - leftScore;
  })[0];
}

function resolveMatch(
  teamA: TeamRoster,
  teamB: TeamRoster,
  seed: number,
  round: CupMatchResult["round"],
  detailed: boolean,
): CupMatchResult {
  const rng = createRng(seed);
  let scoreA = 0;
  let scoreB = 0;
  const eventCards: MatchEventCard[] = [];
  let roundNumber = 1;

  eventCards.push({
    title: "开局部署",
    text: `${teamA.name} 选择全起默认架枪，${teamB.name} 用慢控试探。`,
    delta: `战术执行 ${teamA.stats.tacticalExecution} vs ${teamB.stats.tacticalExecution}`,
    decision: detailed ? { prompt: "经济与开局战术", choice: "全起 + 默认架枪" } : undefined,
  });

  while (scoreA < 3 && scoreB < 3 && roundNumber <= 5) {
    const aPower = teamPower(teamA) + (scoreA >= 2 ? 3 : 0) + rng.int(-9, 9);
    const bPower = teamPower(teamB) + (scoreB >= 2 ? 3 : 0) + rng.int(-9, 9);
    const aWins = aPower >= bPower;
    if (aWins) scoreA += 1;
    else scoreB += 1;

    if (detailed || roundNumber === 5 || scoreA === 3 || scoreB === 3) {
      const star = bestPlayer(aWins ? teamA : teamB);
      eventCards.push({
        title: `${roundNumber} 局转折`,
        text: `${star.name} 打出关键影响，${aWins ? teamA.name : teamB.name} 拿到这一局。`,
        delta: `火力 ${teamA.stats.firepower} vs ${teamB.stats.firepower}，比分 ${scoreA}-${scoreB}`,
      });
    }
    roundNumber += 1;
  }

  const winner = scoreA > scoreB ? teamA : teamB;
  return {
    id: `${round}-${teamA.id}-${teamB.id}`,
    round,
    teamA: teamA.id,
    teamB: teamB.id,
    scoreA,
    scoreB,
    winnerId: winner.id,
    eventCards,
  };
}

function mvpForTeams(teams: TeamRoster[], champion: TeamRoster): CupMvp {
  const candidates = teams.flatMap((team) =>
    team.starters.map((player) => ({
      player,
      team,
      rating:
        player.firepower * 0.45 +
        player.clutch * 0.28 +
        player.tactics * 0.17 +
        (team.id === champion.id ? 8 : 0) +
        team.stats.cohesion * 0.05,
    })),
  );
  const best = candidates.sort((left, right) => right.rating - left.rating)[0];
  return {
    playerId: best.player.id,
    playerName: best.player.name,
    teamId: best.team.id,
    rating: Math.round(best.rating),
    reason: `${best.player.name} 用高影响力回合带领 ${best.team.name} 走到最后。`,
  };
}

function placementForPlayer(playerTeam: TeamRoster, result: CupResult): Placement {
  if (result.champion.id === playerTeam.id) return "champion";
  if (result.runnerUp.id === playerTeam.id) return "runner-up";
  if (result.semifinalists.some((team) => team.id === playerTeam.id)) return "semifinal";
  return "quarterfinal";
}

export function runCup(input: RunCupInput): CupResult {
  const teams = [input.playerTeam, ...input.aiTeams].slice(0, 8);
  const quarterPairs: Array<[TeamRoster, TeamRoster]> = [
    [teams[0], teams[7]],
    [teams[3], teams[4]],
    [teams[1], teams[6]],
    [teams[2], teams[5]],
  ];

  const quarters = quarterPairs.map(([a, b], index) =>
    resolveMatch(a, b, input.seed + index * 13, "quarterfinal", a.id === input.playerTeam.id || b.id === input.playerTeam.id),
  );
  const quarterWinners = quarters.map((match) => teams.find((team) => team.id === match.winnerId)!);
  const semifinalPairs: Array<[TeamRoster, TeamRoster]> = [
    [quarterWinners[0], quarterWinners[1]],
    [quarterWinners[2], quarterWinners[3]],
  ];
  const semis = semifinalPairs.map(([a, b], index) =>
    resolveMatch(a, b, input.seed + 101 + index * 17, "semifinal", a.id === input.playerTeam.id || b.id === input.playerTeam.id),
  );
  const semiWinners = semis.map((match) => teams.find((team) => team.id === match.winnerId)!);
  const final = resolveMatch(
    semiWinners[0],
    semiWinners[1],
    input.seed + 301,
    "final",
    semiWinners[0].id === input.playerTeam.id || semiWinners[1].id === input.playerTeam.id,
  );
  const champion = teams.find((team) => team.id === final.winnerId)!;
  const runnerUp = final.winnerId === semiWinners[0].id ? semiWinners[1] : semiWinners[0];
  const semifinalists = quarterWinners.filter((team) => !semiWinners.some((winner) => winner.id === team.id));
  const partial: Omit<CupResult, "playerPlacement"> = {
    cupName: input.cup.name,
    bracket: [
      { round: "quarterfinal", matchIds: quarters.map((match) => match.id) },
      { round: "semifinal", matchIds: semis.map((match) => match.id) },
      { round: "final", matchIds: [final.id] },
    ],
    rounds: [quarters, semis, [final]],
    champion,
    runnerUp,
    semifinalists,
    cupMvp: mvpForTeams(teams, champion),
    headline: `${champion.name} wins ${input.cup.name}; ${bestPlayer(champion).name} lifts the arena.`,
    encouragement: "",
    annualPreview: "",
  };
  const result = partial as CupResult;
  result.playerPlacement = placementForPlayer(input.playerTeam, result);
  result.encouragement = pickCupEncouragement({
    cupName: input.cup.name,
    placement: result.playerPlacement,
    championName: champion.name,
    mvpName: result.cupMvp.playerName,
    seed: input.seed,
  });
  result.annualPreview = renderAnnualEncouragement({
    bestPlacement: result.playerPlacement === "champion" ? 1 : result.playerPlacement === "runner-up" ? 2 : result.playerPlacement === "semifinal" ? 4 : 8,
    bestClubName: champion.name,
    topPlayerName: result.cupMvp.playerName,
    seed: input.seed + 11,
  });
  return result;
}
