import { pickSeasonQuote, renderSeasonQuote } from "./season-quotes.ts";
import { renderEpilogue, resolveEpilogueTier } from "./epilogue.ts";

export type Placement = "champion" | "runner-up" | "semifinal" | "quarterfinal";

export interface CupEncouragementInput {
  cupName: string;
  placement: Placement;
  championName: string;
  mvpName: string;
  seed: number;
}

const cupLines: Record<Placement, string[]> = {
  champion: [
    "奖杯到手，但这不是终点。Team gun 现在背上了新的重量：下一次，所有人都会研究你们。",
    "中国队伍的名字被刻上冠军榜。今晚可以庆祝，明天开始，所有对手都会把你们当成标尺。",
    "这一冠不是奇迹，是你每一次选人、暂停和冒险叠出来的结果。继续保持饥饿。",
  ],
  "runner-up": [
    "离冠军只差最后一步，这种疼最真实。但能走到决赛，说明这套阵容已经有了争冠骨架。",
    "亚军不是失败，而是坐到了冠军旁边。下一次，把那一步跨过去。",
    "这场失利会难受很久。保留它，别急着忘，下一场大赛的答案往往从这种夜晚开始。",
  ],
  semifinal: [
    "四强不是终点，但它证明 Team gun 已经能和强队坐在同一张桌上。",
    "你们还没举杯，但没人能再把这支队伍当成陪跑。休整、交易、再来一次。",
    "半决赛的门槛很硬，你们撞上去了。下一步不是怀疑自己，是补上最后那块短板。",
  ],
  quarterfinal: [
    "八强出局很刺耳，但第一届杯赛不会定义这三年。预算、交易、磨合，还有翻身机会。",
    "今天的 Team gun 没能走远，但至少问题已经摊在桌面上：火力、纪律、配合，选一个先修。",
    "输掉杯赛不等于输掉项目。真正的经理从淘汰之后才开始工作。",
  ],
};

export function pickCupEncouragement(input: CupEncouragementInput): string {
  const pool = cupLines[input.placement];
  const line = pool[input.seed % pool.length];
  return `${input.cupName} 结束：${input.championName} 夺冠，${input.mvpName} 获得杯赛 MVP。\n${line}`;
}

export interface AnnualSummaryTextInput {
  bestPlacement: number;
  bestClubName: string;
  topPlayerName: string;
  seed: number;
}

export function renderAnnualEncouragement(input: AnnualSummaryTextInput): string {
  const tier = input.bestPlacement === 1
    ? "champion"
    : input.bestPlacement === 2
      ? "finalist"
      : input.bestPlacement <= 4
        ? "contender"
        : "struggle";
  const quote = pickSeasonQuote(tier, input.seed, "chinese_classic");
  const quoteText = quote ? renderSeasonQuote(quote) : "明年再来。";
  return [
    `年度最佳俱乐部：${input.bestClubName}`,
    `年度第一选手：${input.topPlayerName}`,
    quoteText,
  ].join("\n");
}

export interface CareerTextInput {
  cupsWon: number;
  majorWon: boolean;
  bestPlacement: number;
  finalsCount: number;
  vars: Record<string, string>;
}

export function renderCareerEncouragement(input: CareerTextInput): string {
  const tier = resolveEpilogueTier({
    cupsWon: input.cupsWon,
    majorWon: input.majorWon,
    bestPlacement: input.bestPlacement,
    finalsCount: input.finalsCount,
  });
  return renderEpilogue(tier, input.vars).fullText;
}
