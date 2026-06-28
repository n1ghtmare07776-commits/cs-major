import { cups } from "../content/teams.ts";
import { renderCareerEncouragement, renderAnnualEncouragement } from "../content/awardsText.ts";
import type { TeamRoster } from "../domain/roster.ts";
import type { CupResult } from "./cup.ts";
import { runCup } from "./cup.ts";

export interface AnnualTopPlayer {
  playerId: string;
  playerName: string;
  teamId: string;
  score: number;
}

export interface AnnualAwards {
  bestClub: TeamRoster;
  topTenPlayers: AnnualTopPlayer[];
  playerOfTheYear: AnnualTopPlayer;
  biggestCollapse: string;
  signatureCall: string;
  playerSummary: string;
}

export interface SeasonCupRun {
  cupIndex: number;
  cupId: string;
  cupName: string;
  result: CupResult;
}

export interface SeasonRun {
  seasonIndex: number;
  cups: SeasonCupRun[];
  annualAwards: AnnualAwards;
  seasonSummary: string;
}

export interface CareerChronicle {
  cupChampions: string[];
  cupMvps: string[];
  annualBestClubs: string[];
  annualTopTens: string[][];
  finalTrophyCount: number;
  biggestUpset: string;
  mostPainfulLoss: string;
  bestTransfer: string;
  definingPlayerStory: string;
  managerReview: string;
}

export interface CareerRun {
  seasons: SeasonRun[];
  chronicle: CareerChronicle;
}

export interface RunCareerInput {
  playerTeam: TeamRoster;
  aiTeams: TeamRoster[];
  seed: number;
}

const placementPoints = {
  champion: 10,
  "runner-up": 6,
  semifinal: 3,
  quarterfinal: 1,
};

function scorePlayer(player, team: TeamRoster, seasonCupRuns: SeasonCupRun[]) {
  const teamRuns = seasonCupRuns.filter((entry) => entry.result.champion.id === team.id
    || entry.result.runnerUp.id === team.id
    || entry.result.semifinalists.some((semi) => semi.id === team.id)
    || team.id === "player-team");
  const cupMvpCount = seasonCupRuns.filter((entry) => entry.result.cupMvp.playerId === player.id).length;
  const teamPlacementScore = teamRuns.reduce((sum, entry) => {
    const placement = entry.result.champion.id === team.id
      ? "champion"
      : entry.result.runnerUp.id === team.id
        ? "runner-up"
        : entry.result.semifinalists.some((semi) => semi.id === team.id)
          ? "semifinal"
          : "quarterfinal";
    return sum + placementPoints[placement];
  }, 0);

  return Math.round(
    player.firepower * 0.43 +
    player.clutch * 0.23 +
    player.tactics * 0.18 +
    player.discipline * 0.08 +
    team.stats.cohesion * 0.04 +
    teamPlacementScore * 0.8 +
    cupMvpCount * 6,
  );
}

function summarizePlacement(result: CupResult, playerTeamId: string) {
  if (result.champion.id === playerTeamId) return "champion";
  if (result.runnerUp.id === playerTeamId) return "runner-up";
  if (result.semifinalists.some((team) => team.id === playerTeamId)) return "semifinal";
  return "quarterfinal";
}

function computeAnnualAwards(playerTeam: TeamRoster, aiTeams: TeamRoster[], seasonCupRuns: SeasonCupRun[], seed: number): AnnualAwards {
  const allTeams = [playerTeam, ...aiTeams];
  const clubScores = allTeams.map((team) => {
    const placements = seasonCupRuns.map((entry) => {
      if (entry.result.champion.id === team.id) return placementPoints.champion;
      if (entry.result.runnerUp.id === team.id) return placementPoints["runner-up"];
      if (entry.result.semifinalists.some((semi) => semi.id === team.id)) return placementPoints.semifinal;
      return placementPoints.quarterfinal;
    });
    return {
      team,
      score: placements.reduce((sum, value) => sum + value, 0),
    };
  }).sort((left, right) => right.score - left.score || right.team.stats.firepower - left.team.stats.firepower);

  const bestClub = clubScores[0].team;
  const allPlayers = allTeams.flatMap((team) =>
    team.starters.map((player) => ({
      playerId: player.id,
      playerName: player.name,
      teamId: team.id,
      score: scorePlayer(player, team, seasonCupRuns),
    })),
  ).sort((left, right) => right.score - left.score);

  const topTenPlayers = allPlayers.slice(0, 10);
  const playerOfTheYear = topTenPlayers[0];

  const playerPlacements = seasonCupRuns.map((entry) => summarizePlacement(entry.result, playerTeam.id));
  const reachedFinal = playerPlacements.includes("champion") || playerPlacements.includes("runner-up");
  const reachedSemi = playerPlacements.includes("semifinal") || reachedFinal;
  const bestPlacement = reachedFinal
    ? 2
    : reachedSemi
      ? 4
      : 8;

  const annualLine = renderAnnualEncouragement({
    bestPlacement,
    bestClubName: bestClub.name,
    topPlayerName: playerOfTheYear.playerName,
    seed,
  });

  return {
    bestClub,
    topTenPlayers,
    playerOfTheYear,
    biggestCollapse: `${clubScores.at(-1)?.team.name ?? aiTeams[0].name} 在本赛季三站杯赛都没能打出预期。`,
    signatureCall: `Season ${Math.floor(seed % 10) + 1}: 枪神队伍在关键局更偏向默认架枪后的补枪节奏。`,
    playerSummary: annualLine,
  };
}

function buildChronicle(playerTeam: TeamRoster, seasons: SeasonRun[]): CareerChronicle {
  const allCups = seasons.flatMap((season) => season.cups);
  const finalTrophyCount = allCups.filter((entry) => entry.result.champion.id === playerTeam.id).length;
  const bestPlacement = allCups.some((entry) => entry.result.champion.id === playerTeam.id)
    ? 1
    : allCups.some((entry) => entry.result.runnerUp.id === playerTeam.id)
      ? 2
      : allCups.some((entry) => entry.result.semifinalists.some((team) => team.id === playerTeam.id))
        ? 4
        : 8;
  const finalsCount = allCups.filter((entry) =>
    entry.result.champion.id === playerTeam.id || entry.result.runnerUp.id === playerTeam.id,
  ).length;
  const majorWon = allCups.some((entry) => entry.cupId === "major" && entry.result.champion.id === playerTeam.id);

  return {
    cupChampions: allCups.map((entry) => `${entry.cupName}: ${entry.result.champion.name}`),
    cupMvps: allCups.map((entry) => `${entry.cupName}: ${entry.result.cupMvp.playerName}`),
    annualBestClubs: seasons.map((season) => `S${season.seasonIndex}: ${season.annualAwards.bestClub.name}`),
    annualTopTens: seasons.map((season) => season.annualAwards.topTenPlayers.map((player) => player.playerName)),
    finalTrophyCount,
    biggestUpset: allCups.find((entry) => entry.result.champion.id === playerTeam.id)?.headline ?? "枪神队伍在某站杯赛打出过最硬的一次爆冷。",
    mostPainfulLoss: allCups.find((entry) => entry.result.runnerUp.id === playerTeam.id)?.headline ?? "最痛的一次失利发生在离领奖台很近的时候。",
    bestTransfer: "这一版三年模式尚未接入真实交易结算，因此最佳交易先记为阵容初始核心构建。",
    definingPlayerStory: `${playerTeam.starters[0]?.name ?? "核心选手"} 是这三年的代表性面孔。`,
    managerReview: renderCareerEncouragement({
      cupsWon: finalTrophyCount,
      majorWon,
      bestPlacement,
      finalsCount,
      vars: {
        season_count: String(seasons.length),
        first_cup_name: allCups[0]?.cupName ?? "IEM Katowice",
        first_cup_result: allCups[0]?.result.playerPlacement ?? "八强",
        best_cup_name: allCups.find((entry) => entry.result.champion.id === playerTeam.id)?.cupName ?? allCups[0]?.cupName ?? "IEM Katowice",
        best_cup_result: finalTrophyCount > 0 ? "冠军" : bestPlacement === 2 ? "亚军" : bestPlacement === 4 ? "四强" : "八强",
        total_cups_won: String(finalTrophyCount),
        star_player_name: playerTeam.starters[0]?.name ?? "核心选手",
        star_player_trait: playerTeam.starters[0]?.traits?.[0] ?? "稳定",
        defining_moment: allCups.find((entry) => entry.result.champion.id === playerTeam.id)?.headline ?? allCups[0]?.headline ?? "第一杯的关键战役",
        rival_team: allCups[0]?.result.champion.name ?? "Team Vitality",
        final_team_name: playerTeam.name,
        veteran_name: playerTeam.players.at(-1)?.name ?? playerTeam.name,
        rookie_name: playerTeam.players[0]?.name ?? playerTeam.name,
        closest_loss: allCups.find((entry) => entry.result.runnerUp.id === playerTeam.id)?.headline ?? "某次半决赛惜败",
        upset_win: allCups.find((entry) => entry.result.champion.id === playerTeam.id)?.headline ?? "某次四分之一决赛爆冷",
      },
    }),
  };
}

export function runCareer(input: RunCareerInput): CareerRun {
  const seasons: SeasonRun[] = [];

  for (let seasonIndex = 1; seasonIndex <= 3; seasonIndex += 1) {
    const seasonCupRuns: SeasonCupRun[] = cups.map((cup, cupIndex) => ({
      cupIndex: cupIndex + 1,
      cupId: cup.id,
      cupName: cup.name,
      result: runCup({
        cup,
        playerTeam: input.playerTeam,
        aiTeams: input.aiTeams,
        seed: input.seed + seasonIndex * 100 + cupIndex * 17,
      }),
    }));

    const annualAwards = computeAnnualAwards(
      input.playerTeam,
      input.aiTeams,
      seasonCupRuns,
      input.seed + seasonIndex * 1000,
    );

    seasons.push({
      seasonIndex,
      cups: seasonCupRuns,
      annualAwards,
      seasonSummary: [
        `Season ${seasonIndex} 结束。`,
        `年度最佳俱乐部：${annualAwards.bestClub.name}`,
        `年度第一选手：${annualAwards.playerOfTheYear.playerName}`,
        annualAwards.playerSummary,
      ].join("\n"),
    });
  }

  return {
    seasons,
    chronicle: buildChronicle(input.playerTeam, seasons),
  };
}

