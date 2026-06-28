/**
 * 赛季结束激励语
 *
 * 每个赛季结束时显示一句激励语，根据该赛季成绩分档：
 *   - champion:  该赛季拿到至少一个杯赛冠军
 *   - finalist:  进过决赛但未夺冠
 *   - contender: 进过四强但未进决赛
 *   - struggle:  小组赛或更早出局
 *
 * 设计原则：
 *   1. 不标注作者——让诗句本身说话，气质比出处重要。
 *   2. 选用有气势的诗句——剑、战、英雄、征途意象，符合电竞战场氛围。
 *   3. 每个档位多句候选，引擎按种子随机选取，
 *      或根据队伍特征（中国队伍偏好中国诗句）加权选择。
 */

// ──────────────────────────────────────────────
// 类型定义
// ──────────────────────────────────────────────

export type SeasonQuoteTier = "champion" | "finalist" | "contender" | "struggle";

export interface SeasonQuote {
  /** 激励语正文 */
  text: string;
  /** 文化背景标签，用于按队伍特征加权 */
  origin: "chinese_classic" | "western_classic" | "modern_esports" | "original";
}

export interface SeasonQuoteSet {
  tier: SeasonQuoteTier;
  /** 档位描述 */
  description: string;
  quotes: SeasonQuote[];
}

// ──────────────────────────────────────────────
// 赛季激励语库
// ──────────────────────────────────────────────

export const seasonEndQuotes: SeasonQuoteSet[] = [
  // ════════════════════════════════════════════
  // 冠军赛季——霸气式
  // ════════════════════════════════════════════
  {
    tier: "champion",
    description: "本赛季至少获得一个杯赛冠军",
    quotes: [
      {
        text: "满堂花醉三千客，一剑霜寒十四州。",
        origin: "chinese_classic",
      },
      {
        text: "一身转战三千里，一剑曾当百万师。",
        origin: "chinese_classic",
      },
      {
        text: "会当凌绝顶，一览众山小。",
        origin: "chinese_classic",
      },
      {
        text: "十步杀一人，千里不留行。",
        origin: "chinese_classic",
      },
      {
        text: "大鹏一日同风起，扶摇直上九万里。",
        origin: "chinese_classic",
      },
      {
        text: "阵前再亮旧时剑，寒光凛凛似当年。",
        origin: "chinese_classic",
      },
      {
        text: "黄沙百战穿金甲，不破楼兰终不还。",
        origin: "chinese_classic",
      },
      {
        text: "待到秋来九月八，我花开后百花杀。",
        origin: "chinese_classic",
      },
      {
        text: "冲天香阵透长安，满城尽带黄金甲。",
        origin: "chinese_classic",
      },
      {
        text: "I came, I saw, I conquered.",
        origin: "western_classic",
      },
      {
        text: "The harder the battle, the sweeter the victory.",
        origin: "western_classic",
      },
      {
        text: "奖杯举起来的那一刻，所有的凌晨三点都有了意义。",
        origin: "original",
      },
      {
        text: "冠军不是终点，是下一段征途的起点。",
        origin: "original",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 亚军/决赛赛季——卷土重来式
  // ════════════════════════════════════════════
  {
    tier: "finalist",
    description: "本赛季进入过决赛但未夺冠",
    quotes: [
      {
        text: "阵前再亮旧时剑，寒光凛凛似当年。",
        origin: "chinese_classic",
      },
      {
        text: "江东子弟多才俊，卷土重来未可知。",
        origin: "chinese_classic",
      },
      {
        text: "但使龙城飞将在，不教胡马度阴山。",
        origin: "chinese_classic",
      },
      {
        text: "男儿何不带吴钩，收取关山五十州。",
        origin: "chinese_classic",
      },
      {
        text: "会挽雕弓如满月，西北望，射天狼。",
        origin: "chinese_classic",
      },
      {
        text: "了却君王天下事，赢得生前身后名。",
        origin: "chinese_classic",
      },
      {
        text: "雄关漫道真如铁，而今迈步从头越。",
        origin: "chinese_classic",
      },
      {
        text: "莫愁前路无知己，天下谁人不识君。",
        origin: "chinese_classic",
      },
      {
        text: "长风破浪会有时，直挂云帆济沧海。",
        origin: "chinese_classic",
      },
      {
        text: "It always seems impossible until it's done.",
        origin: "western_classic",
      },
      {
        text: "I never lose. I either win or learn.",
        origin: "western_classic",
      },
      {
        text: "亚军不是失败——是离山顶最近的那一步。下一步，就是上去。",
        origin: "original",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 四强赛季——磨砺式
  // ════════════════════════════════════════════
  {
    tier: "contender",
    description: "本赛季进入过四强但未进决赛",
    quotes: [
      {
        text: "想当年，金戈铁马，气吞万里如虎。",
        origin: "chinese_classic",
      },
      {
        text: "黑云压城城欲摧，甲光向日金鳞开。",
        origin: "chinese_classic",
      },
      {
        text: "醉里挑灯看剑，梦回吹角连营。",
        origin: "chinese_classic",
      },
      {
        text: "报君黄金台上意，提携玉龙为君死。",
        origin: "chinese_classic",
      },
      {
        text: "老骥伏枥，志在千里；烈士暮年，壮心不已。",
        origin: "chinese_classic",
      },
      {
        text: "千磨万击还坚劲，任尔东西南北风。",
        origin: "chinese_classic",
      },
      {
        text: "宝剑锋从磨砺出，梅花香自苦寒来。",
        origin: "chinese_classic",
      },
      {
        text: "路漫漫其修远兮，吾将上下而求索。",
        origin: "chinese_classic",
      },
      {
        text: "锲而不舍，金石可镂。",
        origin: "chinese_classic",
      },
      {
        text: "What does not kill me makes me stronger.",
        origin: "western_classic",
      },
      {
        text: "I've failed over and over again in my life. And that is why I succeed.",
        origin: "western_classic",
      },
      {
        text: "四强不是上限——是地板。明年从这里往上盖。",
        origin: "original",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 小组出局——不屈式
  // ════════════════════════════════════════════
  {
    tier: "struggle",
    description: "本赛季小组赛或更早出局",
    quotes: [
      {
        text: "楚虽三户能亡秦，岂有堂堂中国空无人。",
        origin: "chinese_classic",
      },
      {
        text: "沧海横流，方显英雄本色。",
        origin: "chinese_classic",
      },
      {
        text: "天生我材必有用，千金散尽还复来。",
        origin: "chinese_classic",
      },
      {
        text: "沉舟侧畔千帆过，病树前头万木春。",
        origin: "chinese_classic",
      },
      {
        text: "山重水复疑无路，柳暗花明又一村。",
        origin: "chinese_classic",
      },
      {
        text: "夜阑卧听风吹雨，铁马冰河入梦来。",
        origin: "chinese_classic",
      },
      {
        text: "不畏浮云遮望眼，自缘身在最高层。",
        origin: "chinese_classic",
      },
      {
        text: "位卑未敢忘忧国，事定犹须待阖棺。",
        origin: "chinese_classic",
      },
      {
        text: "A man can be destroyed but not defeated.",
        origin: "western_classic",
      },
      {
        text: "It's not whether you get knocked down, it's whether you get up.",
        origin: "western_classic",
      },
      {
        text: "小组赛出局不是结局——是下一次出发的起点。明年见。",
        origin: "original",
      },
      {
        text: "输不可怕。可怕的是输了之后不再走进训练室。明天，还来。",
        origin: "original",
      },
    ],
  },
];

// ──────────────────────────────────────────────
// 辅助函数
// ──────────────────────────────────────────────

/** 按档位获取激励语集合 */
export function getQuotesByTier(tier: SeasonQuoteTier): SeasonQuote[] {
  const set = seasonEndQuotes.find((s) => s.tier === tier);
  return set ? set.quotes : [];
}

/**
 * 根据该赛季成绩判定激励语档位。
 *
 * @param bestPlacement 该赛季所有杯赛中最好的名次（1=冠军, 2=亚军, 4=四强, 8=八强）
 * @returns 激励语档位
 */
export function resolveSeasonQuoteTier(bestPlacement: number): SeasonQuoteTier {
  if (bestPlacement === 1) return "champion";
  if (bestPlacement === 2) return "finalist";
  if (bestPlacement <= 4) return "contender";
  return "struggle";
}

/**
 * 用种子从候选激励语中确定性选取一句。
 *
 * @param tier     档位
 * @param seed     随机种子（保证同一存档同一赛季结果一致）
 * @param prefer   可选：文化偏好（如中国队伍可偏好 chinese_classic）
 * @returns        选中的激励语
 */
export function pickSeasonQuote(
  tier: SeasonQuoteTier,
  seed: number,
  prefer?: SeasonQuote["origin"]
): SeasonQuote | undefined {
  let pool = getQuotesByTier(tier);
  if (pool.length === 0) return undefined;

  // 若指定偏好且偏好版本存在，则 70% 概率从偏好中选，30% 从全部中选
  if (prefer) {
    const preferred = pool.filter((q) => q.origin === prefer);
    if (preferred.length > 0) {
      const usePreferred = (seed % 10) < 7;
      pool = usePreferred ? preferred : pool;
    }
  }

  const idx = seed % pool.length;
  return pool[idx];
}

/**
 * 渲染赛季激励语为显示文本。
 * 不标注作者——让诗句本身说话。
 *
 * @param quote 激励语对象
 * @returns     纯文本
 */
export function renderSeasonQuote(quote: SeasonQuote): string {
  return quote.text;
}
