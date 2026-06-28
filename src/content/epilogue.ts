/**
 * 三年结束终末语
 *
 * 三季征途结束后的叙事收尾。根据玩家三年综合成就判定档位，
 * 以编年史 / 体育散文的口吻重述这一路的故事，
 * 歌颂实力，或给予安慰。
 *
 * 设计原则：
 *   1. 每个档位的文字必须独立成立——不依赖玩家"恰好"经历了某个事件。
 *   2. 变量槽位用 {slot_name} 标记，由模拟引擎在运行时填充。
 *   3. 叙事视角为"后来的记述者"——不是教练本人，而是回头看这段历史的人。
 *      这样可以用追忆的语调，而不需要假装"你正在经历"。
 *   4. 语气从传奇到遗憾递减，但即使是最低档位也给予尊严，不嘲讽玩家。
 *   5. 每个档位包含：标题、开场（定调）、旅程（重述）、尾声（歌颂或安慰）。
 *   6. 诗句引用不标注作者——让诗句本身的气势说话。
 *      选用有剑、战、英雄意象的诗句，符合电竞战场氛围。
 */

// ──────────────────────────────────────────────
// 类型定义
// ──────────────────────────────────────────────

export type EpilogueTierId =
  | "legendary"
  | "crowned"
  | "contender"
  | "grinder"
  | "heartbreak";

export interface EpilogueTier {
  id: EpilogueTierId;
  /** 档位名称（中文） */
  name: string;
  /** 触发条件描述（供引擎判定） */
  condition: string;
  /** 标题——出现在终末语最上方 */
  title: string;
  /** 开场段——定调，交代三年已过 */
  opening: string;
  /** 旅程段——重述这一路的故事，含变量槽位 */
  journey: string;
  /** 尾声段——歌颂或安慰，最后的情感落点 */
  closing: string;
  /** 编年史注脚——冷静的、档案式的最后一行 */
  chronicle: string;
}

// ──────────────────────────────────────────────
// 变量槽位说明
// ──────────────────────────────────────────────
//
// 引擎在渲染终末语时，应填充以下变量槽位：
//
//   {season_count}        — 实际完成的赛季数（1-3）
//   {first_cup_name}      — 第一个参加的杯赛名（如 "IEM 卡托维兹"）
//   {first_cup_result}    — 第一个杯赛的成绩（如 "八强"/"冠军"）
//   {best_cup_name}       — 三年中成绩最好的杯赛
//   {best_cup_result}     — 该杯赛的成绩
//   {total_cups_won}      — 三年共获得的杯赛冠军数
//   {star_player_name}    — 队内表现最突出的选手名
//   {star_player_trait}   — 该选手的标志性特征（如 "冷静"/"凶猛"/"老辣"）
//   {defining_moment}     — 引擎选出的"定义性瞬间"（如 "S2 Major 决赛 1v3 翻盘"）
//   {rival_team}          — 三年中交手最多的宿敌队伍
//   {final_team_name}     — 玩家队伍的最终名称
//   {veteran_name}        — 队中年龄最大的选手（如有）
//   {rookie_name}         — 队中年龄最小的选手（如有）
//   {closest_loss}        — 最遗憾的一场失利（如 "S1 科隆半决赛 14-16"）
//   {upset_win}           — 最大爆冷胜（如 "S2 卡托维兹八强赛击败世界排名第一"）
//

// ──────────────────────────────────────────────
// 终末语档位
// ──────────────────────────────────────────────

export const epilogueTiers: EpilogueTier[] = [
  // ════════════════════════════════════════════
  // 传奇——三赛季统治级表现，多冠加身
  // ════════════════════════════════════════════
  {
    id: "legendary",
    name: "传奇",
    condition: "三年获得 >= 2 个杯赛冠军，且至少含一个 Major",
    title: "王朝",

    opening:
      "后来的人们谈论起那段日子的时候，总会提起一个名字——{final_team_name}。\n\n" +
      "不是因为他们赢了，而是因为他们一直在赢。三年，{season_count} 个赛季，从第一场{first_cup_name}的比赛到最后一次捧杯，他们让所有人知道了一件事：有些队伍赢一次是运气，赢两次是实力，一直赢——那是统治。\n\n" +
      "满堂花醉三千客，一剑霜寒十四州。\n\n" +
      "这个故事要从头说起。",

    journey:
      "第一年的{first_cup_name}，没人看好他们。选秀台上捡来的五个人，预算精打细算，连教练的战术本都是手写的。{first_cup_result}——不算惊艳，但已经有人开始注意了。注意那个{star_player_trait}的{star_player_name}，注意那支队伍在关键回合里不慌不乱的眼神。\n\n" +
      "然后是{defining_moment}。那一夜之后，一切都不同了。\n\n" +
      "{best_cup_name}的决赛，全场一万两千人，一半在喊他们的名字，另一半在沉默。{best_cup_result}——当最后一颗子弹落地的时候，解说员的声音破了音。这不是爆冷，这是宣判。{rival_team}的教练在赛后握手时说了一句话：'我们不是输给了你们，是输给了你们准备的这三年。'\n\n" +
      "{total_cups_won} 个冠军。这不是一个数字，这是一条从无人问津到万人仰望的路。",

    closing:
      "有人说，伟大的队伍不需要被记住——因为他们永远在那里。但{final_team_name}不一样。他们终将散场——{veteran_name}会退役，{rookie_name}会老去，这套阵容不会永远存在。\n\n" +
      "正因为终将散场，这三年的故事才值得被写下来。\n\n" +
      "不是因为他们是最强的——强者年年都有。是因为他们让所有人相信：一支队伍可以不只是五个人加上一套战术。一支队伍可以是一个时代。\n\n" +
      "一身转战三千里，一剑曾当百万师。\n\n" +
      "{final_team_name}。记住这个名字。在未来很多年里，当人们讨论'最伟大的 CS 队伍'时，这个名字会第一个被提起。",

    chronicle:
      "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
      "三年战绩：{total_cups_won} 冠 · 标志性瞬间：{defining_moment}",
  },

  // ════════════════════════════════════════════
  // 加冕——至少拿到一个冠军，站上过巅峰
  // ════════════════════════════════════════════
  {
    id: "crowned",
    name: "加冕",
    condition: "三年获得 >= 1 个杯赛冠军",
    title: "加冕",

    opening:
      "每一个冠军都有一个故事。{final_team_name}的故事，始于{first_cup_name}的{first_cup_result}，终于{best_cup_name}的领奖台。\n\n" +
      "三年。{season_count} 个赛季。不是每一个赛季都属于他们——但有一个夜晚，那座奖杯确确实实地被举了起来，灯光打在金属表面上，映出五个人的脸。\n\n" +
      "黄沙百战穿金甲，不破楼兰终不还。\n\n" +
      "这就够了。在这个圈子里，举过一次杯的人，永远不算失败者。",

    journey:
      "他们不是一开始就强的。第一年的{first_cup_name}只是{first_cup_result}，不痛不痒，不上不下。但你知道——{star_player_name}的眼神里有一种东西。那种{star_player_trait}的东西。那是一种'我知道我会赢，只是不知道什么时候'的耐心。\n\n" +
      "然后{defining_moment}来了。\n\n" +
      "也许是{upset_win}，也许是某个关键回合的翻盘，也许是{rival_team}在决赛里倒下的那一刻。你记得那个瞬间——不是因为比分，而是因为空气。整个场馆的空气在那一秒凝固了，然后爆开。你的选手们站起来，有人笑了，有人哭了，有人只是站在原地不敢相信。\n\n" +
      "{best_cup_result}。{best_cup_name}。冠军。\n\n" +
      "这一路不完美。有过{closest_loss}的心碎，有过磨合期的阵痛，有过老将{veteran_name}险些退役的挣扎。但冠军不需要完美——冠军只需要你在最关键的那几场比赛里，比对手多活一个回合。",

    closing:
      "{star_player_name}后来在一次采访里说：'人们只看到了我们举起奖杯的那一刻。他们没看到的是，为了那一刻，我们输了多少次。'\n\n" +
      "这大概就是冠军的真相。不是最强的队伍拿冠军，是扛住了所有失败之后还站在那里的队伍拿冠军。\n\n" +
      "阵前再亮旧时剑，寒光凛凛似当年。\n\n" +
      "{final_team_name}。一个冠军的名字。也许不是王朝，不是传奇——但在这个圈子里，举过杯的人，说话声音都不一样。\n\n" +
      "这三年，值了。",

    chronicle:
      "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
      "三年战绩：{total_cups_won} 冠 · 巅峰时刻：{best_cup_name} {best_cup_result}",
  },

  // ════════════════════════════════════════════
  // 征途——没有拿冠军，但深入淘汰赛，有竞争力
  // ════════════════════════════════════════════
  {
    id: "contender",
    name: "征途",
    condition: "三年未获冠军，但至少进入过一次决赛或两次半决赛",
    title: "征途",

    opening:
      "差一点。\n\n" +
      "这个词会跟{final_team_name}很久。差一点就进了决赛。差一点就赢了那个回合。差一点就举起了那座奖杯。'差一点'是竞技体育里最残忍的词——它意味着你足够好，好到能看到山顶，但没能踏上去。\n\n" +
      "但'差一点'也是另一种证明。它证明你站在了那里。三年，{season_count} 个赛季，{final_team_name}始终在最高的那层台阶边缘。\n\n" +
      "男儿何不带吴钩，收取关山五十州。",

    journey:
      "第一年的{first_cup_name}，{first_cup_result}。那时候他们还带着新队伍的生涩——{rookie_name}在更衣室里紧张到手抖，{veteran_name}在战术本上写了太多方案反而拿不定主意。但他们打出来了。那种'虽然输了但对手赛后主动来握手'的打出来了。\n\n" +
      "{defining_moment}——也许那不是一场胜利，但那是一个所有人都记住的瞬间。{star_player_name}用他的{star_player_trait}让全场起立，即使最后的比分不属于他们。\n\n" +
      "最痛的是{closest_loss}。那场比赛之后，{veteran_name}一个人在更衣室坐了四十分钟。没人去打扰他。有些距离——14 比 16 的距离——比冠军和亚军的距离更远。因为它不是实力的差距，是命运的选择。\n\n" +
      "{best_cup_name}的{best_cup_result}是他们走得最远的一次。{rival_team}在决赛里赢了——赛后他们的队长说：'打{final_team_name}比打决赛还累。' 这大概是最好的安慰，也是最差的安慰。",

    closing:
      "三年过去了。没有冠军，但有尊重。\n\n" +
      "在这个圈子里，尊重比冠军更难获得。冠军需要一周的好状态，尊重需要三年的稳定。{final_team_name}做到了后者。每个对手在赛程表上看到他们的名字时，都知道这将是一场硬仗——不是因为他们会赢，是因为他们会让你付出代价。\n\n" +
      "{star_player_name}在一次赛后采访里说：'我宁愿当永远的挑战者，也不愿当一次冠军然后消失。'\n\n" +
      "雄关漫道真如铁，而今迈步从头越。\n\n" +
      "也许他说得对。也许冠军不是唯一的终点。也许征途本身就是答案。\n\n" +
      "三年。没有加冕，但始终在征途上。这条路没有尽头——但沿途的风景，值得。",

    chronicle:
      "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
      "三年战绩：{total_cups_won} 冠 · 最佳成绩：{best_cup_name} {best_cup_result} · " +
      "标签：常胜挑战者",
  },

  // ════════════════════════════════════════════
  // 磨砺——成绩平平，有亮点但不够稳定
  // ════════════════════════════════════════════
  {
    id: "grinder",
    name: "磨砺",
    condition: "三年未进决赛，但有至少一次四强及以上成绩",
    title: "磨砺",

    opening:
      "没有聚光灯。没有香槟。没有一万两千人喊你的名字。\n\n" +
      "三年，{season_count} 个赛季。{final_team_name}的故事不会出现在集锦回放里，不会被解说员反复提起，不会成为论坛里的传说。但这个故事有人记得——记得的人是他们自己。\n\n" +
      "醉里挑灯看剑，梦回吹角连营。\n\n" +
      "这就够了。",

    journey:
      "第一年{first_cup_name}的{first_cup_result}是一个信号——不是'你们不行'的信号，是'你们还需要时间'的信号。{rookie_name}太年轻，{veteran_name}太疲惫，{star_player_name}的{star_player_trait}像一把没有磨好的刀——材质是好材质，只是还没开刃。\n\n" +
      "中间有过{defining_moment}。也许只是{best_cup_name}的一次{best_cup_result}——但对{final_team_name}来说，那一次四强就像冠军一样珍贵。那天晚上更衣室里的笑声，比任何一次失败后的沉默都响亮。\n\n" +
      "也有过{closest_loss}。那一夜{veteran_name}坐在基地阳台上抽了半包烟。他跟教练说：'我不怕输。我怕的是不知道为什么输。' 教练没回答。因为他也不知道。\n\n" +
      "三年里他们跟{rival_team}交手了无数次。输多赢少。但每一次交手，比分都更接近了。最后一次，差了两个回合。两个回合——也许明年就够了。也许明年没有明年了。",

    closing:
      "竞技体育里有一个词叫'磨砺'。它不是失败，也不是成功。它是两者之间的那片灰色地带——你在那里流汗、流血、流泪，但没有奖杯，没有掌声，只有你自己知道你比三年前强了多少。\n\n" +
      "{star_player_name}在最后一个赛季结束后发了一条朋友圈：'三年。没能成为最好的，但比三年前的自己好了。这大概就够了。'\n\n" +
      "没有人转发，没有人点赞。但你知道他说的是真的。\n\n" +
      "千磨万击还坚劲，任尔东西南北风。\n\n" +
      "{final_team_name}的三年不是一部电影——电影需要高潮，需要结局，需要英雄。这三年更像是一本训练日记：枯燥、重复、充满自我怀疑。但翻到最后一页的时候，你会发现——笔迹比第一页稳了。\n\n" +
      "这就是磨砺的意义。不是为了加冕，是为了成为更好的自己。",

    chronicle:
      "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
      "三年战绩：{total_cups_won} 冠 · 最佳成绩：{best_cup_name} {best_cup_result} · " +
      "标签：稳步成长",
  },

  // ════════════════════════════════════════════
  // 遗憾——成绩不佳，多次早期出局
  // ════════════════════════════════════════════
  {
    id: "heartbreak",
    name: "遗憾",
    condition: "三年未进四强，或多次小组赛出局",
    title: "遗憾",

    opening:
      "有些故事没有圆满的结局。\n\n" +
      "三年。{final_team_name}的三年不是一个关于胜利的故事。它是一个关于'为什么还没赢'的故事。关于每一次小组赛出局后更衣室里的沉默，关于{veteran_name}看着自己的手问'还能打多久'，关于{rookie_name}第一次体会到'天赋不够用'的绝望。\n\n" +
      "但这也是一个故事。一个值得被讲出来的故事。\n\n" +
      "楚虽三户能亡秦，岂有堂堂中国空无人。",

    journey:
      "第一年的{first_cup_name}——{first_cup_result}。没什么好说的。新队伍，新体系，输得不算难看但也没什么亮点。{star_player_name}的{star_player_trait}偶尔闪光，但闪光照不亮整支队伍。\n\n" +
      "第二年开始变得不一样了——不是变好了，是变得更痛了。因为你知道自己可以更好。{closest_loss}那场比赛，{final_team_name}离出线只差一个回合。一个回合。赛后{veteran_name}在走廊里站了很久，什么都没说。\n\n" +
      "{defining_moment}也许不是什么高光时刻——也许是{upset_win}，那一场意外的胜利。那一夜他们笑了，笑得像赢了冠军。因为对他们来说，赢一场就足够珍贵了。\n\n" +
      "{best_cup_name}的{best_cup_result}是三年里走得最远的一次。{rival_team}在赛后说：'他们比排名显示的要强。' 这句话被贴在了训练室的墙上。是安慰，也是鞭策。\n\n" +
      "但鞭策没能转化为成绩。第三年还是小组赛。更衣室里的沉默比第一年更重了——因为第一年的沉默里还有希望，第三年的沉默里只剩下疲惫。",

    closing:
      "如果你问{star_player_name}这三年值不值得，他大概会沉默很久。\n\n" +
      "不是因为不值得。是因为这个问题太重了。三年的青春、汗水、眼泪——换来了什么？一张小组赛出局的成绩单？一个'差点就赢了'的回忆？\n\n" +
      "但也许——也许——这三年不是关于结果的。也许这三年是关于过程的。关于{rookie_name}从紧张到手抖到能在关键回合不退缩的成长。关于{veteran_name}在最后一季拖着伤腿坚持上场的样子。关于{star_player_name}在所有人都放弃的时候还在训练到凌晨三点的背影。\n\n" +
      "竞技体育不会安慰失败者。但我们不是竞技体育——我们是讲故事的人。这个故事不值得歌颂，但它值得被听到。因为不是每个故事都需要冠军才算完整。有些故事的力量，恰恰在于它的不完整。\n\n" +
      "沧海横流，方显英雄本色。\n\n" +
      "{final_team_name}。三年。没有加冕，没有掌声。但他们来过，打过，输过，哭过，然后第二天又坐在了训练室里。\n\n" +
      "这本身就是一种胜利。一种没有奖杯的胜利。",

    chronicle:
      "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
      "三年战绩：{total_cups_won} 冠 · 最佳成绩：{best_cup_name} {best_cup_result} · " +
      "标签：坚韧",
  },
];

// ──────────────────────────────────────────────
// 辅助函数
// ──────────────────────────────────────────────

/** 根据 id 获取终末语档位 */
export function getEpilogueById(id: EpilogueTierId): EpilogueTier | undefined {
  return epilogueTiers.find((t) => t.id === id);
}

/**
 * 根据三年综合战绩判定终末语档位。
 *
 * 判定逻辑（从高到低，取第一个满足的）：
 *   legendary:  cups_won >= 2 且 major_won == true
 *   crowned:    cups_won >= 1
 *   contender:  best_placement <= 2 (决赛) 或 finals_count >= 2 (两次半决赛)
 *   grinder:    best_placement <= 4 (四强)
 *   heartbreak: 其余
 */
export function resolveEpilogueTier(params: {
  cupsWon: number;
  majorWon: boolean;
  bestPlacement: number; // 1=冠军, 2=亚军, 4=四强, 8=八强
  finalsCount: number; // 进入决赛的次数
}): EpilogueTierId {
  if (params.cupsWon >= 2 && params.majorWon) return "legendary";
  if (params.cupsWon >= 1) return "crowned";
  if (params.bestPlacement <= 2 || params.finalsCount >= 2) return "contender";
  if (params.bestPlacement <= 4) return "grinder";
  return "heartbreak";
}

/**
 * 将终末语中的变量槽位替换为实际值。
 */
export function fillEpilogueVariables(
  text: string,
  vars: Record<string, string>
): string {
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, value);
  }
  return result;
}

/**
 * 获取完整终末语（替换变量后的纯文本）。
 */
export function renderEpilogue(
  tierId: EpilogueTierId,
  vars: Record<string, string>
): { title: string; fullText: string; chronicle: string } {
  const tier = getEpilogueById(tierId);
  if (!tier) {
    return {
      title: "终",
      fullText: "三年已过。",
      chronicle: "",
    };
  }

  const title = fillEpilogueVariables(tier.title, vars);
  const opening = fillEpilogueVariables(tier.opening, vars);
  const journey = fillEpilogueVariables(tier.journey, vars);
  const closing = fillEpilogueVariables(tier.closing, vars);
  const chronicle = fillEpilogueVariables(tier.chronicle, vars);

  return {
    title,
    fullText: `${opening}\n\n${journey}\n\n${closing}`,
    chronicle,
  };
}

// ═══════════════════════════════════════════════════════════════
// 终末语变体系统
// ═══════════════════════════════════════════════════════════════
//
// 每个档位可挂载多个变体版本，引擎根据：
//   1. 冠军数（0/1/2/3+）—— 决定可用变体集
//   2. 文化偏好（中国队伍偏好 chinese_classic）—— 加权选取
//   3. 随机种子 —— 同一存档结果一致
// 选取一个变体渲染。
//
// 诗句引用不标注作者——让诗句本身的气势说话。
// 选用有剑、战、英雄意象的诗句，符合电竞战场氛围。

export type EpilogueOrigin =
  | "chinese_classic"
  | "western_classic"
  | "modern_esports"
  | "original";

export interface EpilogueVariant {
  /** 变体 id，档位内唯一 */
  id: string;
  /** 适用的冠军数范围："0" | "1" | "2" | "3+" | "any" */
  cupsWonRange: "0" | "1" | "2" | "3+" | "any";
  /** 文化来源标签，用于加权 */
  origin: EpilogueOrigin;
  /** 标题——覆盖档位默认标题 */
  title: string;
  /** 开场段 */
  opening: string;
  /** 旅程段 */
  journey: string;
  /** 尾声段 */
  closing: string;
  /** 编年史注脚 */
  chronicle: string;
}

export interface EpilogueTierVariants {
  tierId: EpilogueTierId;
  variants: EpilogueVariant[];
}

// ──────────────────────────────────────────────
// 变体库
// ──────────────────────────────────────────────

export const epilogueVariants: EpilogueTierVariants[] = [
  // ════════════════════════════════════════════
  // 传奇档位变体
  // ════════════════════════════════════════════
  {
    tierId: "legendary",
    variants: [
      {
        id: "legendary_three_crowns",
        cupsWonRange: "3+",
        origin: "chinese_classic",
        title: "三冠王",
        opening:
          "满堂花醉三千客，一剑霜寒十四州。\n\n" +
          "后来的人们谈论起那段日子的时候，总会提起一个名字——{final_team_name}。\n\n" +
          "三季，三冠，{season_count} 个赛季的征途——他们站在了所有人仰望的地方，回头看，群山皆小。这不是一个关于运气的故事，是一个关于统治的故事。",
        journey:
          "第一年的{first_cup_name}还是{first_cup_result}，那时候没人把他们当成未来的王朝。{rookie_name}还紧张到手抖，{veteran_name}还在跟自己的年龄较劲。但{star_player_name}的{star_player_trait}像一把刀——材质是好材质，只等开刃。\n\n" +
          "然后{defining_moment}来了。那一夜之后，空气都变了。\n\n" +
          "{best_cup_name}的{best_cup_result}是加冕。{rival_team}在决赛后握手时说：「打你们，比打决赛还累。」三冠不是运气——是用三年时间，把每一个对手都打服了。",
        closing:
          "三冠王。这个词在 CS 历史上出现过的次数，一只手数得过来。\n\n" +
          "{final_team_name}做到了。{veteran_name}退役那天把奖杯摆在基地门口，跟新人说：「这是标杆。下次有人来，让他看看什么叫王朝。」\n\n" +
          "也许未来会有新的三冠王。但第一个永远是第一个。\n\n" +
          "大鹏一日同风起，扶摇直上九万里。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 三冠王 · 标志性瞬间：{defining_moment}",
      },
      {
        id: "legendary_two_crowns_sword",
        cupsWonRange: "2",
        origin: "chinese_classic",
        title: "双冠",
        opening:
          "一身转战三千里，一剑曾当百万师。\n\n" +
          "{final_team_name}的这三年，就是这句话的注脚。{total_cups_won} 个冠军，{season_count} 个赛季——不是天赋的恩赐，是三千里路、百万敌军里杀出来的。",
        journey:
          "第一年{first_cup_name}的{first_cup_result}是一个信号，不是一个终点。{star_player_name}带着他{star_player_trait}的杀气，{veteran_name}带着他十年的经验，{rookie_name}带着他没被磨掉的锐气——三个人，三个时代，挤在同一支队伍里。\n\n" +
          "{defining_moment}是转折点。之后的一切都顺了——但「顺」不是天上掉下来的。{best_cup_name}的{best_cup_result}背后，是无数个凌晨三点的训练室。\n\n" +
          "{rival_team}输给他们两次。第二次之后，{rival_team}的队长退役了。他说：「我不是输给了年龄，是输给了他们准备得比我深。」",
        closing:
          "两冠不是终点——但对{final_team_name}来说，两冠已经足够让他们被写进历史。\n\n" +
          "{star_player_name}在最后一次采访里说：「我们不是最强的队伍。我们是最不愿意输的队伍。」\n\n" +
          "这大概就是冠军的真相。不是最强的人赢，是最不愿意输的人赢。\n\n" +
          "阵前再亮旧时剑，寒光凛凛似当年。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 双冠 · 巅峰时刻：{best_cup_name} {best_cup_result}",
      },
      {
        id: "legendary_two_crowns_conquer",
        cupsWonRange: "2",
        origin: "western_classic",
        title: "双冠",
        opening:
          "I came, I saw, I conquered.\n\n" +
          "{final_team_name}的这三年，浓缩成这一句话就够了。{total_cups_won} 个冠军，{season_count} 个赛季——他们来了，他们看见了，他们征服了。",
        journey:
          "第一年{first_cup_name}的{first_cup_result}是起点。{star_player_name}的{star_player_trait}是引擎，{veteran_name}的经验是底盘，{rookie_name}的锐气是燃料。\n\n" +
          "{defining_moment}是宣判的时刻。{best_cup_name}的{best_cup_result}——冠军。{rival_team}在决赛里倒下，他们的教练赛后说：「他们比我们准备得更深。」\n\n" +
          "这不是运气。这是三年磨一剑。",
        closing:
          "两冠。在三年的时间里，这意味着什么？\n\n" +
          "意味着{final_team_name}的名字会被写进所有 CS 历史的索引里。意味着{star_player_name}在退役那天可以对自己说一句：I conquered.\n\n" +
          "The harder the battle, the sweeter the victory.\n\n" +
          "{final_team_name}打过的硬仗，比任何人都多。所以他们尝到的甜，也比任何人都浓。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 双冠 · 巅峰时刻：{best_cup_name} {best_cup_result}",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 加冕档位变体
  // ════════════════════════════════════════════
  {
    tierId: "crowned",
    variants: [
      {
        id: "crowned_golden_armor",
        cupsWonRange: "1",
        origin: "chinese_classic",
        title: "加冕",
        opening:
          "黄沙百战穿金甲，不破楼兰终不还。\n\n" +
          "{final_team_name}的这三年，就是这句话的写照。{total_cups_won} 个冠军——不多，但够了。够让所有人知道——这支队伍，是穿过金甲的。",
        journey:
          "第一年的{first_cup_name}，{first_cup_result}。那时候的{final_team_name}还带着生涩，{rookie_name}第一次上场手都在抖。但{star_player_name}的眼神是稳的——那种{star_player_trait}的稳。\n\n" +
          "{defining_moment}不是冠军的瞬间，是冠军的种子。{best_cup_name}的{best_cup_result}是种子开花的时候。{rival_team}在决赛里倒下，他们的队长赛后说：「输给他们不丢人——他们等这一天等了三年。」\n\n" +
          "三年。一个冠军。{veteran_name}在领奖台上把奖杯举了很久，久到摄影师都换了一个胶卷。",
        closing:
          "金甲不是天生就穿在身上的。是用一百场败仗，一千个凌晨，一万个回合磨出来的。\n\n" +
          "{final_team_name}穿上了。\n\n" +
          "天生我材必有用，千金散尽还复来。\n\n" +
          "{star_player_name}在更衣室里笑着说：「值。」\n\n" +
          "这就够了。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 巅峰时刻：{best_cup_name} {best_cup_result}",
      },
      {
        id: "crowned_sword_drawn",
        cupsWonRange: "1",
        origin: "chinese_classic",
        title: "加冕",
        opening:
          "阵前再亮旧时剑，寒光凛凛似当年。\n\n" +
          "{final_team_name}举起奖杯那一夜，所有见过他们低谷的人都愣住了——不是因为他们赢了，是因为他们赢的样子，像极了当年那支没人看好的队伍。\n\n" +
          "只是这一次，剑已经磨了三年。",
        journey:
          "{first_cup_name}的{first_cup_result}是起点。{rookie_name}的成长曲线像一条上扬的弧线，{veteran_name}的经验像一根定海神针。{star_player_name}的{star_player_trait}是这支队伍的引擎——他跑得快，所有人就跟着跑得快。\n\n" +
          "{defining_moment}是那个让人相信「也许真的可能」的瞬间。然后{best_cup_name}的{best_cup_result}——冠军。\n\n" +
          "{rival_team}在决赛里输了。赛后他们的教练说：「他们比我们更想赢。仅此而已。」",
        closing:
          "一个冠军。在三年的时间里，这只是很短的一瞬。\n\n" +
          "但这一瞬，足够了。足够让{final_team_name}的名字出现在所有 CS 历史的索引里。足够让{star_player_name}在十年后跟孩子说：「你爸爸也曾经是最好的。」\n\n" +
          "十步杀一人，千里不留行。\n\n" +
          "{final_team_name}做到了。从无名之辈，到一剑霜寒。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 巅峰时刻：{best_cup_name} {best_cup_result}",
      },
      {
        id: "crowned_modern",
        cupsWonRange: "1",
        origin: "modern_esports",
        title: "加冕",
        opening:
          "奖杯举起来的那一刻，所有的凌晨三点都有了意义。\n\n" +
          "{final_team_name}。三年，{total_cups_won} 冠。不是最多的，但是他们的。",
        journey:
          "第一年{first_cup_name}的{first_cup_result}没人记住。第二年{closest_loss}的心碎只有他们自己记得。但第三年——第三年{best_cup_name}的{best_cup_result}，所有人都会记住。\n\n" +
          "{star_player_name}用他的{star_player_trait}打服了{rival_team}，{veteran_name}用他最后一年的职业生涯换了这座奖杯，{rookie_name}用他从手抖到不退缩的成长证明了一件事——天赋可以被磨成刀。\n\n" +
          "{defining_moment}。这是属于他们的瞬间。",
        closing:
          "电竞圈有一句话：举过杯的人，说话声音都不一样。\n\n" +
          "{final_team_name}举过了。从今往后，他们走进任何赛场，所有人都会多看他们一眼。不是因为他们最强——是因为他们做到了。\n\n" +
          "这就是冠军的遗产。不是奖杯，不是奖金，是「做到了」这三个字。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 巅峰时刻：{best_cup_name} {best_cup_result}",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 征途档位变体（0 冠但进过决赛）
  // ════════════════════════════════════════════
  {
    tierId: "contender",
    variants: [
      {
        id: "contender_wugou",
        cupsWonRange: "0",
        origin: "chinese_classic",
        title: "征途",
        opening:
          "男儿何不带吴钩，收取关山五十州。\n\n" +
          "带吴钩的人不一定能收完五十州。但他出征这件事本身，就值得被记住。\n\n" +
          "{final_team_name}的三年，没有收完五十州——但他们带着吴钩，出征了三次。",
        journey:
          "{first_cup_name}的{first_cup_result}是开始。{star_player_name}的{star_player_trait}让所有人看到了希望，{rookie_name}的成长让所有人看到了未来。但「希望」和「未来」都不是冠军。\n\n" +
          "{closest_loss}那一夜，{veteran_name}在更衣室坐了很久。他不是哭——他是那种「明明可以」的眼神。\n\n" +
          "{defining_moment}——也许是{upset_win}，也许是某个让全场起立的回合。但那不是冠军的瞬间，是「他们可以」的瞬间。\n\n" +
          "{rival_team}在{best_cup_name}的{best_cup_result}里赢了他们。赛后{rival_team}的队长说：「打他们比打决赛还累。」",
        closing:
          "吴钩没收回五十州。但{star_player_name}说：「我们没赢。但我们让所有人知道——我们是可以赢的那种队伍。」\n\n" +
          "这大概就是征途的意义。不是到达终点，是让所有人记住你走过的路。\n\n" +
          "雄关漫道真如铁，而今迈步从头越。\n\n" +
          "三年结束了，但他们的故事没有结束。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 最佳成绩：{best_cup_name} {best_cup_result} · 标签：常胜挑战者",
      },
      {
        id: "contender_old_sword",
        cupsWonRange: "0",
        origin: "chinese_classic",
        title: "征途",
        opening:
          "阵前再亮旧时剑，寒光凛凛似当年。\n\n" +
          "这三年，{final_team_name}亮过很多次剑。剑光寒过，也暗过。但每一次亮剑，他们都还在阵前。\n\n" +
          "没有冠军。但有寒光。",
        journey:
          "{first_cup_name}的{first_cup_result}。{star_player_name}用他的{star_player_trait}告诉所有人——这支队伍是可以敬畏的。{rookie_name}从青涩到成熟，{veteran_name}从老辣到更老辣。\n\n" +
          "{closest_loss}是这三年最痛的回忆。差一个回合，差一颗子弹，差一秒。{veteran_name}那天没说话，只是反复看回放。\n\n" +
          "{defining_moment}是这三年最亮的瞬间——即使没有奖杯，那一刻也让所有人起立。\n\n" +
          "{best_cup_name}的{best_cup_result}，{rival_team}在最后赢了。但赢得不容易。",
        closing:
          "旧时剑还会再亮。{final_team_name}带回来的，是一张没有冠军名字的成绩单。但每一次他们走进赛场，对手都知道——这将是一场硬仗。\n\n" +
          "楚虽三户能亡秦，岂有堂堂中国空无人。\n\n" +
          "{star_player_name}说：「我们没赢。但我们还在。」\n\n" +
          "还在，就是寒光。还在，就是征途。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 最佳成绩：{best_cup_name} {best_cup_result} · 标签：常胜挑战者",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 磨砺档位变体（0 冠但进过四强）
  // ════════════════════════════════════════════
  {
    tierId: "grinder",
    variants: [
      {
        id: "grinder_bamboo",
        cupsWonRange: "0",
        origin: "chinese_classic",
        title: "磨砺",
        opening:
          "千磨万击还坚劲，任尔东西南北风。\n\n" +
          "{final_team_name}的三年，就是这棵竹子。风从{rival_team}那边吹，从{closest_loss}那边吹，从外界的质疑那边吹——他们弯过，但没断。",
        journey:
          "{first_cup_name}的{first_cup_result}没什么好说的。{rookie_name}还年轻，{veteran_name}还在跟年龄较劲，{star_player_name}的{star_player_trait}像没开刃的刀。\n\n" +
          "{best_cup_name}的{best_cup_result}是走得最远的一次。四强。不是冠军，但对{final_team_name}来说，那一夜的笑声比任何奖杯都珍贵。\n\n" +
          "{defining_moment}也许是{upset_win}——一场让所有人意外的胜利。短暂，但真实。\n\n" +
          "三年里跟{rival_team}交手无数次。输多赢少。但每一次，比分都更接近了。",
        closing:
          "竹子的故事不是关于长高——是关于不被风吹断。\n\n" +
          "{final_team_name}这三年没有长成参天大树，但他们没断。{star_player_name}说：「三年前我会因为输一场崩溃三天。现在输完第二天就回训练室了。」\n\n" +
          "这就是磨砺。不是为了加冕，是为了——风再来的时候，弯得更轻一点，直得更快一点。\n\n" +
          "宝剑锋从磨砺出，梅花香自苦寒来。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 最佳成绩：{best_cup_name} {best_cup_result} · 标签：稳步成长",
      },
      {
        id: "grinder_drunk_sword",
        cupsWonRange: "0",
        origin: "chinese_classic",
        title: "磨砺",
        opening:
          "醉里挑灯看剑，梦回吹角连营。\n\n" +
          "{final_team_name}的三年，像一场没打完的仗。白天输了的，晚上梦里还在打。{star_player_name}说过——他梦见过{closest_loss}那场比赛一百遍，每一遍都赢了一点点。\n\n" +
          "醒过来还是在输。但梦里赢过的，迟早会醒着赢。",
        journey:
          "{first_cup_name}的{first_cup_result}。{rookie_name}的紧张，{veteran_name}的疲惫，{star_player_name}的{star_player_trait}像萤火——亮，但不够照亮全场。\n\n" +
          "{closest_loss}那一夜，更衣室的灯关了很久。{veteran_name}说：「我不怕输。我怕的是不知道为什么输。」\n\n" +
          "{defining_moment}——也许是一场{upset_win}，也许是一次{best_cup_name}的{best_cup_result}。短暂的高光，但真实。\n\n" +
          "{rival_team}赢得了每一次交手。但每一次，差距都在缩小。",
        closing:
          "辛弃疾写「醉里挑灯看剑」，写的是一个老兵在和平年代怀念战场。\n\n" +
          "{final_team_name}不需要怀念——他们还在战场上。三年没赢够，但还没输够。\n\n" +
          "{star_player_name}在最后一个赛季结束发了一条朋友圈：「三年。没能成为最好的，但比三年前好了。这大概就够了。」\n\n" +
          "没人转发。但他说的是真的。\n\n" +
          "想当年，金戈铁马，气吞万里如虎。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 最佳成绩：{best_cup_name} {best_cup_result} · 标签：稳步成长",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 遗憾档位变体（0 冠，多次早期出局）
  // ════════════════════════════════════════════
  {
    tierId: "heartbreak",
    variants: [
      {
        id: "heartbreak_hero_color",
        cupsWonRange: "0",
        origin: "chinese_classic",
        title: "遗憾",
        opening:
          "沧海横流，方显英雄本色。\n\n" +
          "英雄本色这四个字，不是给赢了的人的。是给在沧海横流里，还站着的人的。\n\n" +
          "{final_team_name}的三年，没有奖杯。但他们站着。一直站着。",
        journey:
          "{first_cup_name}的{first_cup_result}。{rookie_name}第一次进赛场，连耳机都戴反了。{veteran_name}最后一次出征，膝盖打着封闭。\n\n" +
          "{star_player_name}的{star_player_trait}偶尔让人惊叹，但惊叹不能换胜利。{closest_loss}那一夜，更衣室的灯亮到了凌晨。\n\n" +
          "{defining_moment}是{upset_win}——那一场让所有人意外的胜利。短暂的高光，但真实。\n\n" +
          "{rival_team}赢得了所有交手。但{rival_team}的队长在最后一次握手时说：「打你们从来都不轻松。」",
        closing:
          "竞技体育不会安慰失败者。但讲故事的人会。\n\n" +
          "这个故事不值得歌颂——它没有冠军。但它值得被听到。因为{rookie_name}从手抖到不退缩，{veteran_name}从老辣到更老辣，{star_player_name}从天赋到磨砺。\n\n" +
          "三年。没有加冕。但他们来过，打过，输过，哭过，然后第二天又坐回了训练室。\n\n" +
          "楚虽三户能亡秦，岂有堂堂中国空无人。\n\n" +
          "这本身就是一种胜利。一种没有奖杯的胜利。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 最佳成绩：{best_cup_name} {best_cup_result} · 标签：坚韧",
      },
      {
        id: "heartbreak_iron_horse",
        cupsWonRange: "0",
        origin: "chinese_classic",
        title: "遗憾",
        opening:
          "夜阑卧听风吹雨，铁马冰河入梦来。\n\n" +
          "{final_team_name}的三年结束了。但{veteran_name}说，他梦里还在打——打那些输过的比赛，打那些差一点的回合。\n\n" +
          "铁马冰河。这是老兵的梦。",
        journey:
          "{first_cup_name}的{first_cup_result}。{rookie_name}第一次上场手抖，{veteran_name}拖着伤腿。{star_player_name}的{star_player_trait}像萤火——亮过，但没照亮整个赛场。\n\n" +
          "{closest_loss}。{defining_moment}。{best_cup_name}的{best_cup_result}。\n\n" +
          "三年里，他们跟{rival_team}交手了无数次。一次都没赢。但{rival_team}的队长赛后说：「他们比排名显示的要强。」这句话被贴在训练室的墙上。\n\n" +
          "是安慰。也是鞭策。但鞭策没能转化为成绩。",
        closing:
          "陆游写「铁马冰河入梦来」，写的是一个老将的执念——梦里还在打仗。\n\n" +
          "{final_team_name}的三年不是梦。但他们留下的东西，像梦一样——会被记住，会被提起，会在某个深夜让人辗转。\n\n" +
          "{star_player_name}在最后一场比赛后说：「我来过。我打过。我输过。但我第二天又坐回了训练室。」\n\n" +
          "沉舟侧畔千帆过，病树前头万木春。\n\n" +
          "沉舟不是终点。沉舟是别人的航标——告诉后来的人，这里曾经有过一条船。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 最佳成绩：{best_cup_name} {best_cup_result} · 标签：坚韧",
      },
      {
        id: "heartbreak_modern",
        cupsWonRange: "0",
        origin: "modern_esports",
        title: "遗憾",
        opening:
          "不是每个故事都需要冠军才算完整。\n\n" +
          "{final_team_name}的三年，没有奖杯。但有故事。",
        journey:
          "{first_cup_name}的{first_cup_result}。{rookie_name}第一次进赛场，连耳机都戴反了。{veteran_name}最后一次出征，膝盖打着封闭。\n\n" +
          "{star_player_name}的{star_player_trait}偶尔让人惊叹，但惊叹不能换胜利。{closest_loss}那一夜，更衣室的灯亮到了凌晨。\n\n" +
          "{defining_moment}是{upset_win}——那一场让所有人意外的胜利。短暂的高光，但真实。\n\n" +
          "{rival_team}赢得了所有交手。但{rival_team}的队长在最后一次握手时说：「打你们从来都不轻松。」",
        closing:
          "竞技体育不会安慰失败者。但讲故事的人会。\n\n" +
          "这个故事不值得歌颂——它没有冠军。但它值得被听到。因为{rookie_name}从手抖到不退缩，{veteran_name}从老辣到更老辣，{star_player_name}从天赋到磨砺。\n\n" +
          "三年。没有加冕。但他们来过，打过，输过，哭过，然后第二天又坐回了训练室。\n\n" +
          "这本身就是一种胜利。一种没有奖杯的胜利。",
        chronicle:
          "—— 摘自《CS 杯赛编年史》· {final_team_name} 条目 · " +
          "三年战绩：{total_cups_won} 冠 · 最佳成绩：{best_cup_name} {best_cup_result} · 标签：坚韧",
      },
    ],
  },
];

// ──────────────────────────────────────────────
// 变体选取与渲染
// ──────────────────────────────────────────────

/**
 * 根据档位、冠军数、文化偏好和种子，选取一个终末语变体。
 *
 * @param tierId    档位 id
 * @param cupsWon   三年冠军总数
 * @param seed      随机种子（同一存档结果一致）
 * @param prefer    可选：文化偏好
 * @returns         选中的变体；若无匹配则返回 undefined
 */
export function pickEpilogueVariant(
  tierId: EpilogueTierId,
  cupsWon: number,
  seed: number,
  prefer?: EpilogueOrigin
): EpilogueVariant | undefined {
  const tierVariants = epilogueVariants.find((v) => v.tierId === tierId);
  if (!tierVariants) return undefined;

  // 按冠军数筛选
  const cupsKey: EpilogueVariant["cupsWonRange"] =
    cupsWon >= 3 ? "3+" : cupsWon === 2 ? "2" : cupsWon === 1 ? "1" : "0";

  let pool = tierVariants.variants.filter(
    (v) => v.cupsWonRange === cupsKey || v.cupsWonRange === "any"
  );

  // 兜底：若严格匹配无结果，用所有变体
  if (pool.length === 0) {
    pool = tierVariants.variants;
  }

  // 文化偏好加权：70% 取偏好版本，30% 取全部
  if (prefer) {
    const preferred = pool.filter((v) => v.origin === prefer);
    if (preferred.length > 0) {
      const usePreferred = (seed % 10) < 7;
      pool = usePreferred ? preferred : pool;
    }
  }

  const idx = seed % pool.length;
  return pool[idx];
}

/**
 * 渲染变体终末语（替换变量后的纯文本）。
 */
export function renderEpilogueVariant(
  variant: EpilogueVariant,
  vars: Record<string, string>
): {
  title: string;
  fullText: string;
  chronicle: string;
} {
  const title = fillEpilogueVariables(variant.title, vars);
  const opening = fillEpilogueVariables(variant.opening, vars);
  const journey = fillEpilogueVariables(variant.journey, vars);
  const closing = fillEpilogueVariables(variant.closing, vars);
  const chronicle = fillEpilogueVariables(variant.chronicle, vars);

  return {
    title,
    fullText: `${opening}\n\n${journey}\n\n${closing}`,
    chronicle,
  };
}

/**
 * 一站式接口：根据战绩判定档位 → 选取变体 → 渲染最终文本。
 *
 * @param params         战绩参数
 * @param vars           变量槽位
 * @param seed           随机种子
 * @param prefer         文化偏好
 * @returns              渲染结果；若变体不存在则回退到默认档位文本
 */
export function renderFullEpilogue(
  params: {
    cupsWon: number;
    majorWon: boolean;
    bestPlacement: number;
    finalsCount: number;
  },
  vars: Record<string, string>,
  seed: number,
  prefer?: EpilogueOrigin
): {
  title: string;
  fullText: string;
  chronicle: string;
} {
  const tierId = resolveEpilogueTier(params);
  const variant = pickEpilogueVariant(tierId, params.cupsWon, seed, prefer);

  if (variant) {
    return renderEpilogueVariant(variant, vars);
  }

  // 回退：使用默认档位文本
  return renderEpilogue(tierId, vars);
}
