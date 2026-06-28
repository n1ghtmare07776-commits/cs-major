/**
 * 机制对齐事件库
 *
 * 填补 events.ts 与游戏机制设定之间的缺口。
 * 对齐文档：
 *   - docs/product-specs/GAMEPLAY.md  — 5 个回合类型、3 杯赛、开场双选择
 *   - docs/product-specs/MECHANICS.md — 教练哲学、侦察卡、策略记忆、timeout 三选项、
 *                                       化学反应、条件时长、高风险戏剧、转会竞价、赛季成长
 *   - docs/product-specs/ROSTER.md    — 6 人名单（5 首发 + 1 替补）、特质
 *   - docs/product-specs/AWARDS.md    — 杯赛 MVP、年度奖项、三年编年史
 *   - docs/product-specs/EVENTS.md    — 事件时机、效果、真实姓名安全
 *
 * 本文件覆盖的缺口：
 *   1. 教练哲学选择（赛季开始）
 *   2. 侦察卡事件（赛前）
 *   3. 三大杯赛专属氛围事件（卡托维兹/科隆/Major）
 *   4. 回合类型标记的比赛中事件（开场/压力/转折/调整/收尾）
 *   5. 化学反应触发事件（明星+稳定器/双火爆/体系核心等）
 *   6. Timeout 三选项决策卡
 *   7. 高风险戏剧事件（5-10% 概率）
 *   8. 转会竞价事件（杯赛后）
 *   9. 赛季末成长事件
 *  10. 奖项反应事件（杯赛 MVP / 年度颁奖）
 */

import type { GameEvent, EventEffect, EventTiming } from "./events.js";

// ──────────────────────────────────────────────
// 扩展类型：条件时长标记
// ──────────────────────────────────────────────

export type ConditionDuration = "match" | "cup" | "major";

export interface MechanicEventEffect extends EventEffect {
  /** 条件效果持续时长（match=本场结束清除，cup=本杯赛，major=跨杯赛/赛季） */
  conditionDuration?: ConditionDuration;
}

// 回合类型标记（对齐 GAMEPLAY.md 的 5 个回合职责）
export type RoundType =
  | "opening"      // 开场回合：经济 + 开局战术
  | "pressure"     // 压力回合：上回合结果改变经济/装备/信心
  | "swing"        // 转折回合：两连败后的 buy 机会 / 两连胜后的保钱
  | "adjustment"   // 调整回合：timeout / 士气 / 纪律 / 反 strat
  | "closing";     // 收尾回合：clutch / defuse / save / 最终推进

export interface MechanicGameEvent extends GameEvent {
  /** 适用的回合类型（仅比赛中事件需要） */
  roundType?: RoundType[];
  /** 关联的教练哲学（仅哲学事件需要） */
  philosophy?: CoachPhilosophy;
  /** 关联的杯赛 id（仅杯赛专属事件需要） */
  cupId?: "iem_katowice" | "iem_cologne" | "major";
  /** 关联的化学反应规则（仅化学反应事件需要） */
  chemistryRule?: string;
  /** 是否为高风险戏剧事件 */
  highRisk?: boolean;
}

export type CoachPhilosophy =
  | "tactician"          // 战术家：靠准备和读对手赢
  | "player_whisperer"   // 心理大师：靠信任和状态管理赢
  | "gambler"            // 赌徒：靠压力决策赢
  | "disciplinarian";    // 纪律官：靠结构赢

// ──────────────────────────────────────────────
// 1. 教练哲学选择事件（赛季开始）
// ──────────────────────────────────────────────

export const philosophyChoiceEvents: MechanicGameEvent[] = [
  {
    id: "philosophy_choice_s1",
    category: "out_of_match",
    timing: ["campaign_start"],
    philosophy: undefined, // 玩家在此选择
    title: "你的路",
    narrative:
      "新赛季第一天。基地刚装修完，五个人坐在训练室等你讲话。\n\n" +
      "你站在白板前。还没写战术——因为你得先决定一件事：你是什么样的教练？\n\n" +
      "这支队伍能走多远，不只是看他们五个人的天赋。看你。看你怎么用他们。",
    triggerRequirements: ["赛季开始，首次进入基地"],
    choices: [
      {
        label: "战术家：靠准备和读对手赢",
        resultText:
          "你在白板上写了三个字：'读、备、破。'\n\n" +
          "'从今天开始，每一场比赛前，我们看至少三场对手的录像。每一个回合，我都要知道他们叫什么战术、为什么叫。' 你转向队长。'你的活是执行。我的活是让你执行对的东西。'\n\n" +
          "队长点头。'收到。'\n\n" +
          "战术家路线：战术执行加成更强，战术型 timeout 效果更好。但高风险决策的容错更低。",
        effect: { tactics: 4, tactical_control: 3, discipline: 2 },
      },
      {
        label: "心理大师：靠信任和状态管理赢",
        resultText:
          "你没写战术。你走到每个人面前，问了一个问题：'你最怕什么？'\n\n" +
          "{rookie_name}说怕让队友失望。{star_player_name}说怕手感突然消失。{veteran_name}说怕身体撑不住。队长说怕自己叫错战术连累全队。\n\n" +
          "你回到白板前，写了一个字：'人。'\n\n" +
          "'战术你们自己叫。我管你们的心。' 你说。'状态崩了找我，信心没了找我，压力大了找我。我负责让你们五个能站在场上。'\n\n" +
          "心理大师路线：状态恢复更快，情绪型 timeout 效果更好。但纯战术对抗时上限略低。",
        effect: { morale: 4, condition: 3, cohesion: 3 },
      },
      {
        label: "赌徒：靠压力决策赢",
        resultText:
          "你在白板上画了一个巨大的问号。\n\n" +
          "'我不会告诉你们怎么稳。' 你说。'我会告诉你们什么时候该赌。'\n\n" +
          "队长皱眉：'赌？'\n\n" +
          "'CS 不是稳赢的游戏。是敢赢的游戏。' 你说。'关键回合，我会叫一些别人不敢叫的东西。赢了，我们封神。输了，我背。但我会让你们——敢。'\n\n" +
          "赌徒路线：高风险决策命中时收益翻倍，但失误时代价也更大。适合敢拼的队伍。",
        effect: { firepower: 3, momentum: 3, discipline: -2, morale: 2 },
      },
      {
        label: "纪律官：靠结构赢",
        resultText:
          "你在白板上写了一份作息表。精确到分钟。\n\n" +
          "'九点训练，十二点吃饭，一点复盘，五点体能，六点自由，十点熄灯。' 你说。'战术本每人一本，背下来。走位、报点、补枪——全部标准化。'\n\n" +
          "{star_player_name}有点不自在。'教练，这……会不会太死板？'\n\n" +
          "'死板是地板。' 你说。'地板稳了，你才能往上跳。自由是给已经有结构的人的。'\n\n" +
          "纪律官路线：纪律下限更高，波动型选手的负面连锁更难触发。但火爆型选手可能不舒服。",
        effect: { discipline: 5, tactics: 2, cohesion: 2, morale: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["philosophy", "season_start", "leadership"],
  },
];

// ──────────────────────────────────────────────
// 2. 侦察卡事件（赛前）
// ──────────────────────────────────────────────

export const scoutingEvents: MechanicGameEvent[] = [
  {
    id: "scouting_opponent_habit",
    category: "out_of_match",
    timing: ["before_match"],
    title: "情报组报告",
    narrative:
      "比赛前两小时。你的分析师递来一份报告：'{rival_team}过去三场在压力局都偏向前压控图。他们的指挥习惯在第二回合叫快攻 B，第三回合转默认。'\n\n" +
      "分析师推了推眼镜：'如果我们针对性准备，能在前三个回合拿到优势。但准备需要时间——会挤掉热身。'",
    triggerRequirements: ["赛前 1-2 小时", "对手有可分析的近期比赛记录"],
    choices: [
      {
        label: "针对性训练：模拟对手的前压习惯",
        resultText:
          "你让队伍花了四十分钟模拟{rival_team}的前压节奏。{star_player_name}找到了应对的预瞄点。\n\n" +
          "比赛开始后，第二个回合——{rival_team}果然快攻 B。你的队伍准备好了。\n\n" +
          "情报加成生效。但热身时间少了，开场手感可能没那么热。",
        effect: { tactics: 5, tactical_control: 4, firepower: -2, condition: -1 },
      },
      {
        label: "保留体力，正常热身",
        resultText:
          "你没让队伍分心。'情报是参考，不是圣经。打好我们自己的。'\n\n" +
          "热身照常。{star_player_name}的手感很好。但比赛里——{rival_team}的前压确实打了个措手不及。",
        effect: { firepower: 3, condition: 2, tactics: -1, tactical_control: -1 },
      },
      {
        label: "放烟雾弹：故意暴露假情报",
        resultText:
          "你让助理在社交媒体上'不小心'透露你们在练慢控图。\n\n" +
          "如果{rival_team}看到了，他们会以为你们要慢打——结果你们开场就是快攻。\n\n" +
          "这招有风险。如果他们没看，或者看了不信，就是白费功夫。",
        effect: { tactics: 3, tactical_control: 2, discipline: -2, morale: 1 },
      },
      {
        label: "让选手自己决定要不要看报告",
        resultText:
          "你把报告放在桌上：'想看的看，不想看的别看。自己决定。'\n\n" +
          "队长和{veteran_name}翻了。{star_player_name}和{rookie_name}没碰——'看了会乱想。'\n\n" +
          "信任选手的判断。有时候信息是负担。",
        effect: { cohesion: 3, morale: 2, tactics: 1, tactical_control: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["scouting", "tactics", "tactical_control"],
  },
  {
    id: "scouting_your_habit_read",
    category: "out_of_match",
    timing: ["before_match"],
    title: "我们被研究了",
    narrative:
      "分析师脸色不太好看：'{rival_team}的教练组最近看了我们过去五场的录像。他们大概率已经摸清了——我们第二回合爱打默认控图转 B。'\n\n" +
      "你的习惯被对手读了。这是个危险信号——GAMEPLAY 说'隐藏的惩罚是被禁止的'，所以你必须知道。",
    triggerRequirements: ["对手 tactics >= 80", "我方近期使用了重复的开局战术"],
    choices: [
      {
        label: "改开局：第二回合不打默认了",
        resultText:
          "你跟队长说：'第二回合改快攻 A。他们等着你打默认，你偏不。'\n\n" +
          "比赛里——{rival_team}果然在 B 点堆了三个人。你们打了 A，他们扑了个空。\n\n" +
          "打破习惯是有代价的——新战术没那么熟。但至少没被针对。",
        effect: { tactics: 3, firepower: 2, discipline: -2, tactical_control: 2, momentum: 2 },
      },
      {
        label: "保持习惯，但加变奏",
        resultText:
          "'还是打默认转 B。但第三个回合——突然快攻中路。让他们以为我们要慢一整场。'\n\n" +
          "变奏的代价是沟通量增加。但如果成功，对手会彻底懵。",
        effect: { tactics: 4, cohesion: -1, discipline: -1, tactical_control: 3, momentum: 1 },
      },
      {
        label: "将计就计：让他们以为我们打默认",
        resultText:
          "'他们以为我们打默认？好。开场就打快攻 B——直接撞他们堆人的位置。他们以为读了我们，其实是中了我们的圈。'\n\n" +
          "高风险高回报。如果他们真的堆 B——你们撞墙。如果他们没那么确定——你们撕开防线。",
        effect: { firepower: 4, tactics: -2, discipline: -3, momentum: 4, highRisk: true } as MechanicEventEffect,
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["scouting", "tactics", "tactical_control"],
  },
];

// ──────────────────────────────────────────────
// 3. 三大杯赛专属氛围事件
// ──────────────────────────────────────────────

export const cupFlavorEvents: MechanicGameEvent[] = [
  {
    id: "cup_katowice_atmosphere",
    category: "out_of_match",
    timing: ["before_cup"],
    cupId: "iem_katowice",
    title: "卡托维兹的冷",
    narrative:
      "飞机落地华沙，转大巴到卡托维兹。二月。零下八度。\n\n" +
      "Spodek 体育馆在雪里亮着灯——那个圆顶你只在电视上见过。现在你站在它面前。{rookie_name}掏出手机拍了张照，手在抖——不是冷，是那种'我真的来了'的抖。\n\n" +
      "这里是 CS 的圣殿。每年二月，全世界最好的八支队伍聚在这里。空气里有股说不清的东西——历史的重量。",
    triggerRequirements: ["杯赛为 IEM 卡托维兹"],
    choices: [
      {
        label: "'感受它。但别被它压住。'",
        resultText:
          "你让全队在体育馆门口站了一分钟。'看够了？走，训练。'\n\n" +
          "{rookie_name}最后看了一眼 Spodek 的灯，转身跟上了队伍。他的眼神里多了一点东西——不是紧张，是敬畏。敬畏是燃料，也是负担。",
        effect: { morale: 4, condition: 2, discipline: 2, cohesion: 2, tactics: 1 },
      },
      {
        label: "'别看它。它是场馆，不是神坛。'",
        resultText:
          "'低头。走。' 你说。'那是建筑，不是神。我们来这不是为了朝圣，是为了赢。'\n\n" +
          "有人愣了一下——然后笑了。气氛松了。你用冷淡卸掉了历史的重量。",
        effect: { discipline: 4, morale: 2, condition: 1, firepower: 2, tactics: 1 },
      },
      {
        label: "讲个故事：'两年前，一支没人看好的队伍在这里夺冠'",
        resultText:
          "你在更衣室讲了个故事——两年前，一支排名第八的队伍在卡托维兹一路爆冷夺冠。\n\n" +
          "'他们赛前也没人看好。' 你说。'但他们在 Spodek 的灯下，打出了这辈子最好的一场。'\n\n" +
          "{star_player_name}握紧了鼠标。故事这东西，有时候比战术管用。",
        effect: { morale: 6, firepower: 3, discipline: -1, cohesion: 3, momentum: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["cup_flavor", "katowice", "morale"],
  },
  {
    id: "cup_cologne_atmosphere",
    category: "out_of_match",
    timing: ["before_cup"],
    cupId: "iem_cologne",
    title: "科隆的夏天",
    narrative:
      "七月。科隆。LANXESS 体育馆外的广场上，粉丝举着各国国旗等了四个小时。\n\n" +
      "你们的巴士开过的时候，{star_player_name}的名字被喊了起来——声音隔着车窗都能听到。他看向你：'教练，这……'\n\n" +
      "你没说话。科隆的夏天，是 CS 最大的户外派对。在这里打比赛不只是打比赛——是在一万五千人面前证明你配得上这个舞台。",
    triggerRequirements: ["杯赛为 IEM 科隆"],
    choices: [
      {
        label: "打开车窗，让选手跟粉丝挥手",
        resultText:
          "你让司机减速。'摇下窗户。'\n\n" +
          "{star_player_name}和{rookie_name}探出去挥手。尖叫声震耳欲聋。{veteran_name}笑了——他打了十年职业，这种场面还是让他激动。\n\n" +
          "情绪是会传染的。下了车，所有人的脚步都轻了。",
        effect: { morale: 7, condition: 3, firepower: 2, discipline: -1, cohesion: 3 },
      },
      {
        label: "'别管窗外。专注比赛。'",
        resultText:
          "'窗帘拉上。' 你说。'他们喊的是名字，不是胜利。赢了他们才真的会记住你。'\n\n" +
          "有人不太情愿。但他照做了。专注比兴奋更值钱。",
        effect: { discipline: 5, tactics: 3, morale: -1, condition: 1, tactical_control: 2 },
      },
      {
        label: "让{star_player_name}下车签名——他是人气王",
        resultText:
          "你让{star_player_name}下车签了十分钟名。粉丝疯了。\n\n" +
          "回来的时候他眼睛亮得像星星。'教练，他们真的认识我。'\n\n" +
          "'那就在场上让他们继续喊你的名字。' 你说。'别让他们失望。'",
        effect: { morale: 5, momentum: 3, firepower: 3, condition: -1, discipline: -1, cohesion: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["cup_flavor", "cologne", "morale"],
  },
  {
    id: "cup_major_atmosphere",
    category: "out_of_match",
    timing: ["before_cup"],
    cupId: "major",
    title: "Major 的重量",
    narrative:
      "Major。这个词在 CS 里的分量，比任何其他赛事都重。\n\n" +
      "冠军会获得游戏内的贴纸——永久刻在 CS 历史上。亚军的贴纸？没人记得。\n\n" +
      "更衣室里，你的五个人都在沉默。不是紧张——是那种'知道这一刻有多重'的沉默。{veteran_name}打了十年，从没进过 Major 决赛。这可能是他最后一次机会。",
    triggerRequirements: ["杯赛为 Major"],
    choices: [
      {
        label: "'这不是终点。这是起点。'",
        resultText:
          "你站在更衣室中央。'这不是你们职业生涯的终点——是起点。不管今天结果如何，明天太阳照常升起。'\n\n" +
          "{veteran_name}看了你一眼。他知道你在说给他听。\n\n" +
          "'但今天——' 你停顿。'今天，让我们让所有人记住。'",
        effect: { morale: 6, condition: 3, discipline: 3, cohesion: 4, firepower: 2, tactics: 1 },
      },
      {
        label: "'十年。{veteran_name}等了十年。为他赢。'",
        resultText:
          "你指向{veteran_name}。'他打了十年职业。十年。从没摸过 Major 奖杯。'\n\n" +
          "{veteran_name}喉结动了一下。其他人看向他。\n\n" +
          "'今天，' 你说，'让他摸到。'\n\n" +
          "更衣室安静了三秒。然后队长站起来：'收到。' 一个一个，所有人都站了起来。",
        effect: { cohesion: 7, morale: 5, firepower: 4, discipline: 2, condition: 2, momentum: 3 },
      },
      {
        label: "'别想奖杯。想下一个回合。'",
        resultText:
          "'别想 Major。别想贴纸。别想奖杯。' 你说。'想下一个回合。下一个压缩回合。下一个首杀。下一个补枪。'\n\n" +
          "'奖杯是结果。结果是回合累出来的。' 你在白板上画了一个回合。'只想这个。'\n\n" +
          "有人点头。专注卸掉了重量。",
        effect: { discipline: 5, tactics: 4, tactical_control: 3, morale: 1, condition: 1 },
      },
      {
        label: "什么都不说。让他们自己感受这一刻",
        resultText:
          "你没说话。你站在门口，看着他们。\n\n" +
          "五个人，各自沉浸在自己的世界里。{rookie_name}在闭眼。{star_player_name}在转鼠标线。{veteran_name}在看自己的手。队长在看天花板。\n\n" +
          "有些时刻不需要教练。需要的是——人。需要他们自己跟这一刻相处。\n\n" +
          "两分钟后，队长站起来：'走吧。' 你点了下头。",
        effect: { morale: 5, cohesion: 5, condition: 2, discipline: 2, tactics: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["cup_flavor", "major", "morale", "cohesion"],
  },
];

// ──────────────────────────────────────────────
// 4. 回合类型标记的比赛中事件
// ──────────────────────────────────────────────

export const roundSpecificEvents: MechanicGameEvent[] = [
  {
    id: "opening_economy_choice",
    category: "in_match",
    timing: ["during_match"],
    roundType: ["opening"],
    title: "开场经济",
    narrative:
      "比赛开始。冻结时间。你的队长在语音里问：'教练，这把怎么买？'\n\n" +
      "经济系统是 CS 的命脉。第一回合全队满钱——但这不代表一定要全买。强起还是 ECO，会影响后面三个回合的经济曲线。",
    triggerRequirements: ["比赛第一个压缩回合"],
    choices: [
      {
        label: "全买：满甲满道具，全力以赴",
        resultText:
          "'全买。让他们看看我们开场是什么水平。'\n\n" +
          "五个人满甲满道具。开局气势如虹——{star_player_name}的首杀点燃了全场。\n\n" +
          "但如果这把输了，下把经济会很紧。",
        effect: { firepower: 4, economy: -3, morale: 3, momentum: 2, tactical_control: 1 },
      },
      {
        label: "半买：步枪+甲，省点道具",
        resultText:
          "'半买。步枪和甲要有，道具省一半。'\n\n" +
          "经济平衡了，但道具少了意味着烟雾和闪光的覆盖不够。进攻可能没那么顺畅。",
        effect: { economy: 2, firepower: 1, tactics: -1, discipline: 2, tactical_control: 1 },
      },
      {
        label: "ECO：手枪局，攒钱下把翻盘",
        resultText:
          "'ECO。这把不要了。下把全买打他们。'\n\n" +
          "五把手枪出门。这回合基本是送的——但如果能在 ECO 局拿到一两个击杀，经济会更好。\n\n" +
          "{rookie_name}紧张地问：'真不买？' '不买。' 你说。'相信我。'",
        effect: { economy: 6, firepower: -5, morale: -2, discipline: 3, tactical_control: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["economy", "opening", "tactics"],
  },
  {
    id: "swing_round_buy_opportunity",
    category: "in_match",
    timing: ["during_match"],
    roundType: ["swing"],
    title: "转折回合",
    narrative:
      "0-2 落后。但这时候出现了一个机会——你们的经济刚好够全买。如果这把赢了，气势就回来了。如果输了……0-3，基本告别这场比赛。\n\n" +
      "队长在语音里：'教练，这把怎么搞？全买还是继续 ECO？'",
    triggerRequirements: ["己方 0-2 落后", "经济刚好够全买"],
    choices: [
      {
        label: "全买赌一把——这把必须赢",
        resultText:
          "'全买。这把不赢就没下一把了。'\n\n" +
          "五个人满装备冲了出去。{star_player_name}的眼神不一样了——背水一战的眼神。\n\n" +
          "赢了——气势回来了。输了——0-3，gg。",
        effect: { firepower: 5, economy: -4, morale: 4, momentum: 5, discipline: -1, highRisk: true } as MechanicEventEffect,
      },
      {
        label: "ECO 一把，下把全买翻盘",
        resultText:
          "'ECO。这把送了。下把全买。'\n\n" +
          "有人想抗议——'教练，都 0-2 了还 ECO？' 但你坚持。\n\n" +
          "0-3。但下一把——全买，满道具，满甲。你们带着赌命的气势冲了出去。",
        effect: { economy: 5, firepower: -4, morale: -3, discipline: 3, tactical_control: 2 },
      },
      {
        label: "半买——步枪+手枪混搭",
        resultText:
          "'半买。两个步枪带甲，三个手枪跟后面。赌首杀。'\n\n" +
          "折中方案。如果步枪手拿到首杀，这把能打。如果没拿到——就是送。\n\n" +
          "{star_player_name}拿到了首杀。这把赢了。",
        effect: { economy: 0, firepower: 2, morale: 3, discipline: -1, momentum: 3, highRisk: true } as MechanicEventEffect,
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["economy", "swing", "firepower", "momentum"],
  },
  {
    id: "closing_round_clutch",
    category: "in_match",
    timing: ["during_match"],
    roundType: ["closing"],
    title: "赛点",
    narrative:
      "2-2。最后一回合。赛点。\n\n" +
      "整个场馆的空气都凝固了。你的五个人在语音里沉默——不是没话说，是所有话都说完了。现在只剩这一个回合。\n\n" +
      "队长看向你。等你最后一句话。",
    triggerRequirements: ["比赛 2-2 平局", "最后一回合"],
    choices: [
      {
        label: "'打我们最熟悉的。默认控图转 B。'",
        resultText:
          "'打最熟的。默认转 B。别加新东西。'\n\n" +
          "稳。这是你们练了一百次的战术。{star_player_name}的预瞄，{veteran_name}的道具，{rookie_name}的补枪——全部到位。\n\n" +
          "稳赢稳输，看执行力。",
        effect: { tactics: 4, discipline: 4, cohesion: 3, firepower: 1, tactical_control: 2 },
      },
      {
        label: "'赌一把。五人快攻 A。'",
        resultText:
          "'快攻 A。全员冲。不给机会。'\n\n" +
          "高风险高回报。如果 A 点防守薄弱——赢了。如果他们堆了人——撞墙。\n\n" +
          "{star_player_name}第一个冲进去。他信任你的赌注。",
        effect: { firepower: 5, tactics: -2, discipline: -2, momentum: 4, highRisk: true } as MechanicEventEffect,
      },
      {
        label: "'假打 B，真打 A。骗他们。'",
        resultText:
          "'假 B。三人扔道具制造噪音，两人悄悄摸 A。'\n\n" +
          "心理战。如果他们信了——A 点空了。如果没信——你们五打五，但 A 点防守严阵以待。\n\n" +
          "队长点头：'收到。' 他信任这个读心。",
        effect: { tactics: 5, cohesion: 3, discipline: 2, firepower: -1, tactical_control: 3 },
      },
      {
        label: "'让{star_player_name}自由发挥。其他人保他。'",
        resultText:
          "'所有人都保{star_player_name}。让他打。'\n\n" +
          "你把赌注压在天赋上。{star_player_name}愣了一下——然后笑了。\n\n" +
          "'收到。看我的。' 他第一个冲进了烟雾。其他人架枪保护他。\n\n" +
          "天才这东西，有时候不讲道理。",
        effect: { firepower: 6, tactics: -3, discipline: -2, morale: 4, momentum: 3, highRisk: true } as MechanicEventEffect,
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["closing", "clutch", "firepower", "tactics", "momentum"],
  },
];

// ──────────────────────────────────────────────
// 5. 化学反应触发事件
// ──────────────────────────────────────────────

export const chemistryEvents: MechanicGameEvent[] = [
  {
    id: "chem_star_stabilizer",
    category: "in_match",
    timing: ["during_match"],
    chemistryRule: "star_and_stabilizer",
    title: "明星与稳定器",
    narrative:
      "{star_player_name}又开始浪了——他想单摸，想赌英雄枪。但这次不一样。{veteran_name}——那个冷静的稳定器——在语音里说了句：'别。等我们。'\n\n" +
      "奇怪的是——{star_player_name}停了。他听了。\n\n" +
      "这就是化学反应。明星+稳定器的组合，让天赋有了刹车。",
    triggerRequirements: ["队伍触发 star_and_stabilizer 化学反应", "概率触发"],
    choices: [
      {
        label: "让稳定器继续当刹车",
        resultText:
          "你没插手。{veteran_name}的存在本身就是{star_player_name}的锚。\n\n" +
          "这回合——{star_player_name}没浪，跟队伍一起打。赢了。不是靠他一个人，是靠五个人。",
        effect: { firepower: 2, discipline: 4, cohesion: 4, tactics: 2, morale: 2 },
      },
      {
        label: "'{star_player_name}，这把信你的直觉。'",
        resultText:
          "你让明星自由发挥。稳定器皱了皱眉——但没反对。\n\n" +
          "{star_player_name}单摸拿了首杀。但后面——他太深入了，被反杀。回合输了。\n\n" +
          "天赋需要刹车是有原因的。",
        effect: { firepower: 4, discipline: -3, cohesion: -2, morale: -1, momentum: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["chemistry", "cohesion", "discipline"],
  },
  {
    id: "chem_double_volatility",
    category: "in_match",
    timing: ["during_match"],
    chemistryRule: "double_volatility",
    title: "两个火药桶",
    narrative:
      "队伍里有两个火爆型选手。平时——火力惊人。现在——0-2 落后，两个人都开始急了。\n\n" +
      "语音里，他们在抢着报点，抢着叫战术，声音越来越大。{veteran_name}想插话——插不进去。\n\n" +
      "双火爆的代价：火力高，但失控的时候，谁也拉不住。",
    triggerRequirements: ["队伍触发 double_volatility 化学反应", "己方连续输 >= 2 回合"],
    choices: [
      {
        label: "叫暂停，让两个人都闭嘴",
        resultText:
          "你叫了暂停。'都别说话。听我说。'\n\n" +
          "两个人都愣了——他们习惯了抢话。但暂停的权威让他们闭了嘴。\n\n" +
          "你重新明确了报点规则：'只有队长能叫战术。其他人只报位置。' 节奏回来了。",
        effect: { spend_timeout: true, discipline: 5, tactics: 3, cohesion: 2, morale: 1, tactical_control: 3 },
      },
      {
        label: "让他们吵——有时候火药桶炸完更清醒",
        resultText:
          "你没插手。两个人在语音里争了三十秒。\n\n" +
          "然后——突然安静了。其中一个说：'行，听你的。' 另一个说：'不，听你的。'\n\n" +
          "他们自己吵出了顺序。有时候火药桶炸完，反而平静了。",
        effect: { firepower: 3, discipline: -3, cohesion: 1, tactics: 1, morale: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["chemistry", "discipline", "cohesion", "timeout"],
  },
  {
    id: "chem_system_core",
    category: "in_match",
    timing: ["during_match"],
    chemistryRule: "system_core",
    title: "体系运转",
    narrative:
      "三个纪律型选手 + 一个体系指挥。这套阵容的化学反应叫'体系核心'——战术执行和纪律都更高。\n\n" +
      "这个回合，你叫了一个复杂的假打战术。需要五个人精确执行——烟雾、闪光、假跑、转点。\n\n" +
      "冻结时间结束。你听到语音里，队长一个一个确认：'收到。' '收到。' '收到。' '收到。'——像机器。",
    triggerRequirements: ["队伍触发 system_core 化学反应"],
    choices: [
      {
        label: "执行复杂战术——他们做得到",
        resultText:
          "你叫了假 B 真 A。五个人精确执行——烟雾封 B，三人假跑，两人转 A。\n\n" +
          "对手被骗了——B 点堆了三个人。A 点？空了。\n\n" +
          "下包。架枪。赢。体系核心的价值，在这一刻体现得淋漓尽致。",
        effect: { tactics: 6, discipline: 4, cohesion: 3, firepower: 1, tactical_control: 4, momentum: 3 },
      },
      {
        label: "打简单战术——别过度复杂化",
        resultText:
          "你叫了最简单的默认控图。'别加戏。执行到位就行。'\n\n" +
          "体系核心的队伍打简单战术，执行力碾压。每个走位、每个补枪——精确到秒。\n\n" +
          "对手不是输给战术，是输给了执行。",
        effect: { tactics: 3, discipline: 5, cohesion: 3, firepower: 2, tactical_control: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["chemistry", "tactics", "discipline"],
  },
];

// ──────────────────────────────────────────────
// 6. Timeout 三选项决策卡
// ──────────────────────────────────────────────

export const timeoutDecisionEvents: MechanicGameEvent[] = [
  {
    id: "timeout_crisis",
    category: "in_match",
    timing: ["during_match"],
    roundType: ["adjustment"],
    title: "叫暂停吗",
    narrative:
      "对手连赢两个回合，气势起来了。你的队伍开始乱——{star_player_name}在抢战术，{rookie_name}的报点越来越小声。\n\n" +
      "你还有一次暂停机会。全场只有一次。\n\n" +
      "MECHANICS 说：timeout 有三种——战术重置、情绪重置、纪律重置。你得选一个。选错了，这次暂停就白叫了。",
    triggerRequirements: ["对手连赢 >= 2 回合", "本场比赛尚未使用 timeout"],
    choices: [
      {
        label: "战术重置：针对对手习惯调整",
        resultText:
          "你叫了暂停。走到白板前，画了对手最近三个回合的防守站位。\n\n" +
          "'他们 B 点堆人。下个回合——假 B 真 A。' 你说。'听我的，别自己改。'\n\n" +
          "战术重置生效。下个回合——对手扑了个空，你们打了 A。",
        effect: { spend_timeout: true, tactics: 6, tactical_control: 5, discipline: 2, morale: 2, momentum: 3 },
      },
      {
        label: "情绪重置：让他们冷静下来",
        resultText:
          "你叫了暂停。没讲战术。你让五个人站起来，远离屏幕。\n\n" +
          "'深呼吸。' 你说。'你们在急。急了就输。'\n\n" +
          "{star_player_name}闭眼。{rookie_name}喝水。三十秒后——眼神回来了。\n\n" +
          "情绪重置生效。状态和士气的惩罚被软化。",
        effect: { spend_timeout: true, morale: 5, condition: 4, discipline: 1, cohesion: 3, tactical_control: 1 },
      },
      {
        label: "纪律重置：停止浪和送",
        resultText:
          "你叫了暂停。语气很重：'你们在送。{star_player_name}，别单摸。{rookie_name}，别提前压。回到默认。'\n\n" +
          "纪律重置——打断波动型连锁，纪律值回升。\n\n" +
          "有人不太服气。但他知道你是对的。",
        effect: { spend_timeout: true, discipline: 6, tactics: 2, morale: -1, cohesion: 1, tactical_control: 3 },
      },
      {
        label: "不叫——留着以后用",
        resultText:
          "你没叫。'还能打。别急。'\n\n" +
          "下个回合——又输了。0-3。\n\n" +
          "现在你还剩一次暂停。但势头已经完全在对手那边了。赌的是——后面有没有更需要的时刻。",
        effect: { morale: -2, momentum: -2, discipline: -1, tactics: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["timeout", "tactics", "discipline", "morale"],
  },
];

// ──────────────────────────────────────────────
// 7. 高风险戏剧事件
// ──────────────────────────────────────────────

export const highRiskDramaEvents: MechanicGameEvent[] = [
  {
    id: "drama_gamble_stack",
    category: "in_match",
    timing: ["during_match"],
    highRisk: true,
    title: "豪赌",
    narrative:
      "对手进攻 B 点已经第三次了。你有一种直觉——这把他们还会打 B。\n\n" +
      "赌一把？把五个人全堆在 B 点？如果对了——对手撞墙，0 杀团灭。如果错了——A 点空了，白送一局。\n\n" +
      "这是 MECHANICS 说的'高风险戏剧'——5-10% 的概率触发，但一旦触发就是名场面。",
    triggerRequirements: ["对手连续 >= 2 回合打同一位置", "概率触发 5-10%"],
    choices: [
      {
        label: "豪赌：五人堆 B",
        resultText:
          "'所有人 B。' 你说。'信我。'\n\n" +
          "五个人堆在 B 点。冻结时间结束——\n\n" +
          "对手的脚步声……从 B 点传来。\n\n" +
          "他们撞进了五把枪的交叉火力。0 杀团灭。全场炸了。{star_player_name}站起来咆哮。这是会被写进集锦的回合。",
        effect: { firepower: 5, morale: 8, momentum: 6, discipline: -2, cohesion: 4, tactical_control: 3, highRisk: true } as MechanicEventEffect,
      },
      {
        label: "稳一点：三人 B，两人 A",
        resultText:
          "你想赌，但没全赌。三人 B，两人 A。\n\n" +
          "对手打了——B 点。三人防守顶住了第一波。但第四个人从侧面包了过来。\n\n" +
          "赢了，但赢得不干净。豪赌的爽感没了，换来的是稳。",
        effect: { firepower: 2, tactics: 2, discipline: 3, morale: 2, momentum: 1 },
      },
      {
        label: "不赌：正常防守",
        resultText:
          "'别赌。正常站。' 你说。\n\n" +
          "对手这把——打了 A。你赌的话就输了。\n\n" +
          "稳是对的。但有时候你会想——如果赌了呢？",
        effect: { discipline: 3, tactics: 2, morale: 1, cohesion: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["high_risk", "firepower", "morale", "momentum"],
  },
  {
    id: "drama_star_tilt_chain",
    category: "in_match",
    timing: ["during_match"],
    highRisk: true,
    title: "心态崩了",
    narrative:
      "{star_player_name}连续三个回合对枪全输。他开始摔鼠标。\n\n" +
      "这是 MECHANICS 说的'性格连锁'——hot_blooded 或 streaky_star 特质在压力下触发负面连锁：强制前压 → 被孤立 → 首接触失败 → 包点失守 → 紧急撤退。\n\n" +
      "连锁已经开始了。你必须决定——打断它，还是让他自己燃烧？",
    triggerRequirements: ["队内存在 hot_blooded 或 streaky_star 特质", "该选手连续 >= 3 回合表现低迷", "概率触发 5-10%"],
    choices: [
      {
        label: "叫暂停——打断连锁",
        resultText:
          "你叫了暂停。'{star_player_name}，过来。'\n\n" +
          "他走过来，脸是黑的。你没讲战术。你说：'你今天手感不好。这没关系。但你不能因为手感不好就送。'\n\n" +
          "他没说话。但连锁被打断了——下个回合，他不再单摸了。",
        effect: { spend_timeout: true, discipline: 4, morale: 3, firepower: -2, cohesion: 2, tactical_control: 2 },
      },
      {
        label: "让他打——天才总要自己走出来",
        resultText:
          "你没叫暂停。你让他继续。\n\n" +
          "第四个回合——他又单摸了。又输了。0-4。\n\n" +
          "但第五个回合——他突然在 B 点打了个 1v3 翻盘。天才这东西，崩到极点有时候会反弹。\n\n" +
          "高风险。但回报也是天才级的。",
        effect: { firepower: 4, discipline: -4, morale: -2, momentum: 3, highRisk: true } as MechanicEventEffect,
      },
      {
        label: "换替补——他今天不行",
        resultText:
          "你把{star_player_name}换下来了。'你今天休息。替补上。'\n\n" +
          "他瞪着你——愤怒、不解、受伤。但他没说话，把耳机递给了替补。\n\n" +
          "连锁断了。但{star_player_name}的心——可能也断了。",
        effect: { firepower: -3, morale: -2, discipline: 4, cohesion: -2, condition: 2, tactical_control: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["high_risk", "personality_chain", "timeout", "discipline"],
  },
];

// ──────────────────────────────────────────────
// 8. 转会竞价事件（杯赛后）
// ──────────────────────────────────────────────

export const transferBiddingEvents: MechanicGameEvent[] = [
  {
    id: "transfer_bid_star",
    category: "out_of_match",
    timing: ["between_cups"],
    title: "竞价",
    narrative:
      "杯赛结束后第三天，你的电话响了。另一支队伍的经理：'{star_player_name}，我们想要。开个价。'\n\n" +
      "这不是传闻——这是实打实的竞价。MECHANICS 说：v0.1 的转会不是完整市场，是事件化的竞价场景。\n\n" +
      "你手里有{star_player_name}的合同。但合同是死的，人心是活的。",
    triggerRequirements: ["杯赛结束后", "队内存在 firepower >= 88 的选手", "概率触发"],
    choices: [
      {
        label: "不卖——他是非卖品",
        resultText:
          "'不卖。' 你说。'{star_player_name}不卖。'\n\n" +
          "对方加价。你还是不卖。\n\n" +
          "消息走漏了——{star_player_name}知道有队伍想要他。他的眼神有点复杂。是得意？还是心动？你拿不准。",
        effect: { cohesion: -1, morale: 1, discipline: 1, economy: 0 },
      },
      {
        label: "卖——趁高价套现",
        resultText:
          "你报了一个天价。对方居然答应了。\n\n" +
          "转会费到账。{star_player_name}走了——走的时候跟你握了手。'谢谢你，教练。'\n\n" +
          "你用这笔钱能签两个潜力新人。但明星的空缺——短期内填不上。",
        effect: { economy: 10, firepower: -5, morale: -3, cohesion: -3, tactics: -2 },
      },
      {
        label: "用他换两个即战力",
        resultText:
          "你不卖人——你换人。'{star_player_name}换你们的{rival_team}两个主力。加一笔钱。'\n\n" +
          "对方考虑了一天。同意了。\n\n" +
          "一换二。火力分散了，但阵容深度增加了。赌的是——两个即战力能不能补上明星的空缺。",
        effect: { firepower: -2, tactics: 2, cohesion: -2, discipline: 2, economy: 3 },
      },
      {
        label: "跟{star_player_name}谈——你想走吗？",
        resultText:
          "你没直接拒绝。你找{star_player_name}谈：'有队伍要你。你想走吗？'\n\n" +
          "他沉默了很久。'……我不知道。'\n\n" +
          "'那你想想。' 你说。'你想走，我帮你谈个好价钱。你想留，我拒绝他们。但你要告诉我。'\n\n" +
          "他点了点头。信任，比合同更值钱。",
        effect: { cohesion: 4, morale: 2, discipline: 1, economy: 0, tactics: 0 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["transfer", "economy", "firepower", "cohesion"],
  },
];

// ──────────────────────────────────────────────
// 9. 赛季末成长事件
// ──────────────────────────────────────────────

export const seasonGrowthEvents: MechanicGameEvent[] = [
  {
    id: "growth_young_star",
    category: "out_of_match",
    timing: ["season_end"],
    title: "成长",
    narrative:
      "赛季结束了。你翻看{rookie_name}的数据——这一年他的火力值从 72 涨到了 78。\n\n" +
      "MECHANICS 说：赛季末成长，年轻选手小幅增长，老选手可能小幅衰退。\n\n" +
      "{rookie_name}找到了你：'教练，下赛季我能打首发吗？'",
    triggerRequirements: ["赛季结束", "队内存在年龄 <= 22 的选手", "概率触发"],
    choices: [
      {
        label: "'能。下赛季你是首发。'",
        resultText:
          "'能。' 你说。'下赛季首发是你的。'\n\n" +
          "他笑了——那种二十岁特有的、毫无保留的笑。\n\n" +
          "{rookie_name}火力 +3，战术 +2。成长的代价是——{veteran_name}可能要坐板凳了。",
        effect: { firepower: 3, tactics: 2, morale: 3, cohesion: -1, discipline: 1 },
      },
      {
        label: "'再等一年。你还需要练。'",
        resultText:
          "'再等一年。你的基本功还不够稳。'\n\n" +
          "他有点失望。但他点头了。'我知道。我会练。'\n\n" +
          "下赛季——他还会涨。但不是现在。",
        effect: { tactics: 2, discipline: 3, morale: -1, condition: 1, firepower: 1 },
      },
      {
        label: "'看你的训练态度决定。'",
        resultText:
          "'看你自己。休赛期练得够狠，下赛季首发。练不够——继续等。'\n\n" +
          "他走了。第二天——训练室的灯亮到了凌晨。\n\n" +
          "你给了他目标。目标比承诺更管用。",
        effect: { firepower: 2, discipline: 4, tactics: 1, morale: 1, condition: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["growth", "season_end", "rookie", "firepower"],
  },
  {
    id: "growth_veteran_decline",
    category: "out_of_match",
    timing: ["season_end"],
    title: "衰退",
    narrative:
      "赛季结束。{veteran_name}的数据——火力值从 82 掉到了 79。\n\n" +
      "不大。但你看到了。他自己也看到了。\n\n" +
      "他找你：'教练，我是不是该退了？'",
    triggerRequirements: ["赛季结束", "队内存在年龄 >= 28 的选手", "概率触发"],
    choices: [
      {
        label: "'再打一年。你的经验比火力重要。'",
        resultText:
          "'再打一年。' 你说。'你的火力掉了，但你的脑子没掉。下赛季你转指挥位，少冲，多看。'\n\n" +
          "他点头。'谢了教练。'\n\n" +
          "{veteran_name}火力 -2，战术 +3，纪律 +2。衰退换来了智慧。",
        effect: { firepower: -2, tactics: 3, discipline: 2, morale: 2, cohesion: 2 },
      },
      {
        label: "'是时候了。退役吧。'",
        resultText:
          "'是时候了。' 你说。'你的身体在告诉你。'\n\n" +
          "他沉默了很久。'……好。'\n\n" +
          "他退役了。留在俱乐部当助理教练。{veteran_name}火力归零，但他的经验留在了训练室里。",
        effect: { morale: -2, cohesion: -3, tactics: 2, discipline: 2, economy: 3 },
      },
      {
        label: "'你自己决定。我不替你做这个主。'",
        resultText:
          "'你自己决定。' 你说。'这是你的职业生涯。'\n\n" +
          "他考虑了一周。最后——'再打一年。最后一年。'\n\n" +
          "你点头。这可能是他的告别季。让他打。",
        effect: { firepower: -1, morale: 3, discipline: 1, cohesion: 2, tactics: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["growth", "season_end", "veteran", "aging"],
  },
];

// ──────────────────────────────────────────────
// 10. 奖项反应事件
// ──────────────────────────────────────────────

export const awardReactionEvents: MechanicGameEvent[] = [
  {
    id: "cup_mvp_won",
    category: "out_of_match",
    timing: ["after_match"],
    title: "MVP",
    narrative:
      "杯赛结束。颁奖环节——主持人念出了 MVP 的名字：{star_player_name}。\n\n" +
      "全场欢呼。{star_player_name}愣了两秒——然后笑了。那种'我真的做到了'的笑。\n\n" +
      "他走向领奖台。奖杯在灯光下闪光。AWARDS 说——杯赛 MVP 可以来自任何队伍，不只是冠军。但今天，他既是 MVP，也是冠军。",
    triggerRequirements: ["杯赛结束", "队内选手获得杯赛 MVP"],
    choices: [
      {
        label: "让他享受这一刻",
        resultText:
          "你没说话。你站在台下，看着他举奖杯。\n\n" +
          "这一刻属于他。不是你。你只是——把他送到这里的人。\n\n" +
          "{star_player_name}下台后第一个找你：'教练，这个奖也有你一半。'",
        effect: { morale: 6, firepower: 2, condition: 2, cohesion: 3, economy: 2 },
      },
      {
        label: "'别飘。下个杯赛才是真正的考验。'",
        resultText:
          "他下台的时候，你说了一句：'别飘。下个杯赛才是真正的考验。'\n\n" +
          "他愣了一下——然后点头。'收到。'\n\n" +
          "严厉的爱。但 MVP 之后最容易松懈。你用冷水保住了他的专注。",
        effect: { discipline: 4, tactics: 2, morale: 1, condition: 1, cohesion: 1 },
      },
      {
        label: "全队合影——这是团队的胜利",
        resultText:
          "你让全队上台合影。MVP 是{star_player_name}的，但奖杯是五个人的。\n\n" +
          "{veteran_name}站在边上笑——他没拿 MVP，但他知道没有他{star_player_name}拿不到。\n\n" +
          "这就是队伍。",
        effect: { cohesion: 6, morale: 4, discipline: 2, condition: 1, economy: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["award", "mvp", "morale", "cohesion"],
  },
  {
    id: "annual_top_ten_player",
    category: "out_of_match",
    timing: ["season_end"],
    title: "年度 TOP 10",
    narrative:
      "赛季颁奖。AWARDS 说——每年会公布年度 TOP 10 选手，跨所有八支队伍。\n\n" +
      "主持人开始念名字。第十名……第八名……第五名——{star_player_name}！\n\n" +
      "全场欢呼。你的选手进了年度前五。",
    triggerRequirements: ["赛季结束", "队内选手入选年度 TOP 10"],
    choices: [
      {
        label: "'前五。明年冲第一。'",
        resultText:
          "你跟{star_player_name}说：'前五。不错。但明年——冲第一。'\n\n" +
          "他笑了：'收到，教练。'\n\n" +
          "目标比成就更管用。",
        effect: { morale: 4, firepower: 2, discipline: 2, condition: 1, tactics: 1 },
      },
      {
        label: "让他享受——这是他应得的",
        resultText:
          "你没加要求。'享受。这是你应得的。'\n\n" +
          "{star_player_name}笑了。{rookie_name}在旁边羡慕地看着——'我什么时候能进 TOP 10？'\n\n" +
          "你听到了。'练。三年后你也进。'",
        effect: { morale: 5, cohesion: 3, condition: 2, discipline: 1, firepower: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["award", "annual", "morale"],
  },
  {
    id: "annual_best_club",
    category: "out_of_match",
    timing: ["season_end"],
    title: "年度最佳俱乐部",
    narrative:
      "赛季颁奖最后一个奖项——年度最佳俱乐部。\n\n" +
      "AWARDS 说：这个奖项跨所有八支队伍，按杯赛冠军数、决赛次数、总积分、稳定性计算。\n\n" +
      "主持人拆开信封。念出的名字——{final_team_name}。\n\n" +
      "你的队伍。年度最佳俱乐部。",
    triggerRequirements: ["赛季结束", "玩家队伍获得年度最佳俱乐部"],
    choices: [
      {
        label: "上台领奖——这是全队的荣誉",
        resultText:
          "你带着五个选手上台。奖杯很重——不是物理上的，是意义里的。\n\n" +
          "你发言的时候只说了一句：'这个奖属于这五个人。和所有相信我们的人。'\n\n" +
          "下台后，{veteran_name}跟你说：'教练，这是我职业生涯最高的一刻。'",
        effect: { morale: 7, cohesion: 6, discipline: 3, condition: 2, economy: 3, firepower: 1 },
      },
      {
        label: "'别满足。明年还要拿。'",
        resultText:
          "领奖后，你在更衣室说：'别满足。明年还要拿。'\n\n" +
          "有人笑——'教练，刚拿奖就加压？'\n\n" +
          "'对。' 你说。'因为满足是衰退的开始。'",
        effect: { discipline: 4, tactics: 2, morale: 2, condition: 1, cohesion: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["award", "annual", "best_club", "morale", "cohesion"],
  },
];

// ──────────────────────────────────────────────
// 聚合导出
// ──────────────────────────────────────────────

export const allMechanicEvents: MechanicGameEvent[] = [
  ...philosophyChoiceEvents,
  ...scoutingEvents,
  ...cupFlavorEvents,
  ...roundSpecificEvents,
  ...chemistryEvents,
  ...timeoutDecisionEvents,
  ...highRiskDramaEvents,
  ...transferBiddingEvents,
  ...seasonGrowthEvents,
  ...awardReactionEvents,
];

/** 按机制类型筛选 */
export function getMechanicEventsByType(type: string): MechanicGameEvent[] {
  const map: Record<string, MechanicGameEvent[]> = {
    philosophy: philosophyChoiceEvents,
    scouting: scoutingEvents,
    cup_flavor: cupFlavorEvents,
    round_specific: roundSpecificEvents,
    chemistry: chemistryEvents,
    timeout: timeoutDecisionEvents,
    high_risk: highRiskDramaEvents,
    transfer: transferBiddingEvents,
    growth: seasonGrowthEvents,
    award: awardReactionEvents,
  };
  return map[type] ?? [];
}

/** 按杯赛筛选专属事件 */
export function getCupFlavorEvents(cupId: "iem_katowice" | "iem_cologne" | "major"): MechanicGameEvent[] {
  return cupFlavorEvents.filter((e) => e.cupId === cupId);
}

/** 按回合类型筛选 */
export function getEventsByRoundType(roundType: RoundType): MechanicGameEvent[] {
  return roundSpecificEvents.filter((e) => e.roundType?.includes(roundType));
}

/** 按教练哲学筛选 */
export function getEventsByPhilosophy(philosophy: CoachPhilosophy): MechanicGameEvent[] {
  return allMechanicEvents.filter((e) => e.philosophy === philosophy);
}

/** 获取所有高风险事件 */
export function getHighRiskEvents(): MechanicGameEvent[] {
  return allMechanicEvents.filter((e) => e.highRisk === true);
}
