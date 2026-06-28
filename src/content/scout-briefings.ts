/**
 * 赛前情报叙事库
 *
 * 让赛前侦察/情报卡具备故事感、情报深度和战术价值。
 *
 * 截图对照：UI 显示「标题 + 情报正文 + 数据条 + 三个选择按钮」。
 * 本文件负责生成「标题模板」+「情报正文」+「选择反馈」三部分文本。
 *
 * 7 大维度：
 *   1. 对手风格画像（6 种战术流派 × 多变体）
 *   2. 关键选手聚焦（5 种角色类型 × 杯赛阶段差异化）
 *   3. 历史交锋记忆（首次交手 / 宿敌 / 复仇 / 碾压 / 势均力敌）
 *   4. 教练博弈层面（对方 IGL 习惯 / 战术偏好 / 针对信号）
 *   5. 杯赛阶段氛围（小组赛→决赛的紧张度递增）
 *   6. 近期状态观察（状态火热 / 低迷 / 稳定 / 波动）
 *   7. 选择反馈丰富化（备战 / 保心态 / 搞心理战 —— 玩家自然口吻按钮）
 *
 * 设计原则：
 *   - 情报像真人在说话——分析师口吻、教练视角、选手圈八卦
 *   - 信息有层次：宏观（队伍风格）→ 中观（关键选手）→ 微观（具体战术细节）
 *   - 不只是数据罗列，要有判断、有态度、有不确定性
 *   - 变量槽位：{opponent} {star_player} {rival_igl} 等
 *   - CS 机制合规（不写"趴下"等违规动作）
 *   - 玩家身份中立
 */

import type { EventEffect } from "./events.js";

// ──────────────────────────────────────────────
// 类型定义
// ──────────────────────────────────────────────

/** 对手战术风格 */
export type OpponentStyle =
  | "disciplined"     // 纪律型：默认控图、反清强、节奏慢
  | "aggressive"      // 激进型：快攻多、首杀依赖、高风险高回报
  | "star_carry"      // 明星carry：围绕核心选手设计战术、自由人体系
  | "team_gun"        // 团队枪：无绝对核心、多点开花、配合默契
  | "veteran_system"  // 老将体系：经验驱动、节奏控制、残局强
  | "rookie_surge";   // 新秀冲击：不知者无畏、打法奔放、波动大

/** 杯赛阶段 */
export type CupStage = "group_stage" | "quarter_final" | "semi_final" | "final" | "major_final";

/** 双方关系 */
export type MatchRelation =
  | "first_meet"      // 首次交手
  | "rival"           // 宿敌/老对手
  | "revenge"         // 上次输给对方，复仇战
  | "underdog"        // 被看好的一方 vs 弱势方
  | "grudge_match";    // 有恩怨/争议的比赛

/** 对手近期状态 */
export type OpponentForm = "on_fire" | "slumping" | "stable" | "volatile";

/** 关键选手角色 */
export type KeyPlayerRole = "sniper" | "entry_fragger" | "support" | "igl" | "clutch_player";

/** 情报来源（影响叙述口吻） */
export const IntelSource = {
  ANALYST: "analyst" as const,       // 分析师报告风
  COACH: "coach" as const,           // 教练视角风
  PLAYER_RUMOR: "rumor" as const,    // 选手圈八卦风
  DATA_DRIVEN: "data" as const,      // 数据分析风
  SCOUT_REPORT: "scout" as const,    // 专业侦察风
} as const;
export type IntelSource = (typeof IntelSource)[keyof typeof IntelSource];

/** 单条赛前情报——对应截图中的正文段落 + 可选副线 */
export interface ScoutBriefing {
  /** 标题（如"四分之一决赛赛前：Team Vitality"） */
  title: string;
  /** 主情报正文（2-4 句话，分段显示） */
  body: string[];
  /** 可选：附加情报条目（用于 UI 的"更多信息"折叠区） */
  intelBullets?: string[];
  /** 情绪基调——影响 UI 配色/动效建议 */
  tone: "neutral" | "tense" | "confident" | "cautious" | "dramatic";
}

/** 选择反馈——玩家点按钮后的结果文本 */
export interface ScoutChoiceFeedback {
  choiceLabel: string;       // 按钮上的文字
  resultNarrative: string;   // 反馈正文
  effect: EventEffect;       // 引擎效果
}

/** 完整情报卡——标题 + 正文 + 三个选择的反馈 */
export interface FullScoutCard {
  briefing: ScoutBriefing;
  choices: ScoutChoiceFeedback[];
  /** 此卡的适用上下文（用于过滤） */
  context: Partial<ScoutContext>;
}

/** 情报生成的完整上下文 */
export interface ScoutContext {
  opponent: string;            // 对手队伍名
  opponentStyle: OpponentStyle;
  cupStage: CupStage;
  cupId?: string;              // "iem_katowice" | "iem_cologne" | "major"
  matchRelation: MatchRelation;
  opponentForm: OpponentForm;
  keyPlayerName: string;
  keyPlayerRole: KeyPlayerRole;
  rivalIGL?: string;           // 对方指挥名字
  /** 对手的明星/核心选手列表（逗号分隔） */
  opponentStars?: string;
  /** 我方的明星选手 */
  myStarPlayer?: string;
  /** 我方的老将 */
  myVeteran?: string;
  /** 我方的新秀 */
  myRookie?: string;
  /** 上次交手结果描述（如"2-1 险胜"） */
  lastMatchResult?: string;
  /** 对手的近期战绩描述（如"三连胜"） */
  recentRecord?: string;
  /** 情报来源偏好 */
  source?: IntelSource;
  /** 是否主场（影响氛围描写） */
  isHomeMatch?: boolean;
}

// ──────────────────────────────────────────────
// 1. 对手风格画像 —— 主情报正文的核心
// ──────────────────────────────────────────────

const styleBodyDisciplined: string[] = [
  `{opponent} 是一支纪律严明的队伍。他们的默认控图节奏很稳——前三十秒几乎不会贸然前压。如果你在开局阶段想用快攻打他们措手不及，大概率会撞到一堵铁墙上。\n\n` +
  `但他们的弱点也很明显：一旦你熬过前两个回合的试探期，逼他们进入非常规局面——残局、经济局、必须进攻的局面——他们的反应速度会明显下降。这支队伍擅长按剧本打，不擅长即兴发挥。`,

  `看过 {opponent} 过去十场的 demo 吗？他们的站位间距永远保持在模型级精度。不是巧合——这是练出来的。\n\n` +
  `他们的指挥 {rival_igl} 是个完美主义者。每一个道具落点都经过计算，每一次转点都有预案。跟他们打，你不是在跟五个人对抗，是在跟一套运行了三年的系统对抗。\n\n` +
  `好消息是——系统也有 bug。找到那个 bug，你就找到了突破口。`,

  `{opponent} 的比赛像在下围棋。每一步都在为后面三步做铺垫。你看到的"保守"，其实是他们在织网。\n\n` +
  `他们最擅长的就是让你觉得"这局稳了"——然后在第 12 个回合，用一个你完全没预料到的道具组合撕开你的防线。\n\n` +
  `跟这种队伍打，耐心比枪法更重要。急的人先死。`,
];

const styleBodyAggressive: string[] = [
  `{opponent} 不跟你磨叽。他们的字典里没有"慢慢来"这三个字。\n\n` +
  `开场第一回合——八成概率是 rush B 或者 A 点快攻。{key_player_name} 会第一个冲出去找首杀。他不在乎能不能活下来，他在乎的是：能不能在前十五秒决定这回合的走向。\n\n` +
  `这种打法有两种结果：要么他们把你冲垮，前三回合 3-0；要么你扛住了第一波冲击，他们的心态就开始崩——因为他们的整个战术体系都建立在"开局优势"这个假设上。`,

  `如果 CS 有一个"场均首杀时间"排行榜，{opponent} 大概率排第一。平均首杀时间不到 25 秒。\n\n` +
  `{key_player_name} 是他们的开路先锋——AUG 冲脸，从不犹豫。{rival_igl} 在后面喊："打了就撤！打了就撤！"——因为这套战术的核心不是"打赢"，是"制造混乱然后捡漏"。\n\n` +
  `应对方案很简单，执行起来很难：别跟他们拼速度。让他们冲，你架枪。等他们的节奏乱了——那就是你的回合。`,

  `跟 {opponent} 打比赛就像站在瀑布底下——水一直往你脸上泼，停不下来的那种。\n\n` +
  `他们的经济分配很有意思：宁可 ECO 两把攒一把 full buy，也不愿意半买半不打。要么不打，要打就往死里打。这种极端风格意味着——他们的经济崩盘期会来得特别猛。如果你能撑过他们的 full buy 浪潮，接下来的 ECO 局就是你的提款机。`,
];

const styleBodyStarCarry: string[] = [
  `{opponent} 的所有战术都可以概括为一句话：让 {key_player_name} 舒服。\n\n` +
  `他是这支队伍的心脏。其他四个人的任务只有一个——给 {key_player_name} 创造输出环境。道具给他拉、信息给他报、位置给他让、经济优先保他的枪。\n\n` +
  `听起来像是弱点对吧？一支队伍过度依赖一个人——只要掐住那个人，整支队伍就废了。\n\n` +
  `问题是：过去三年，没人真正掐住过他。`,

  `你看过 {key_player_name} 的 heat map 吗？他的活跃区域覆盖了全图 70% 的面积。这不是自由人——这是一个人扛着一支队伍在走。\n\n` +
  `{opponent} 的战术板很简单：A 点放两个人牵制，B 点放两个人骚扰，{key_player_name} 去他觉得能出事的地方。\n\n` +
  `对手的指挥 {rival_igl} 在采访里说过一句话：「我不需要告诉 {key_player_name} 怎么打。我只需要确保他不缺子弹。」\n\n` +
  `这句话既是骄傲，也是无奈。`,

  `有一件事你可能不知道——{opponent} 的训练赛录像里，{key_player_name} 的击杀占比超过 45%。\n\n` +
  `正常队伍的这个数字应该在 20%-25%。超过 40%，说明这不是"明星表现"，这是"战术倾斜"。整支队伍的资源都在往一个人身上堆。\n\n` +
  `所以今天的策略很清晰：要么你让 {key_player_name} 打不出手感——那他们就没了主心骨；要么你接受他要杀穿的事实，然后把其他四个人当突破口。\n\n` +
  `两条路都不好走。但你得选一条。`,
];

const styleBodyTeamGun: string[] = [
  `{opponent} 没有绝对的明星选手。或者说——他们每个人都是明星，也每个人都不是。\n\n` +
  `你看他们的击杀分布图：五个人的 K/D 差距不超过 0.15。这意味着你无法通过针对某一个人来削弱他们。杀了 A 还有 B，杀了 B 还有 C。\n\n` +
  `这种队伍最难打。因为你找不到"命门"。`,

  `{opponent} 的配合默契度是联赛顶级。不是因为他们天赋多高——是因为他们在一起打了太久了。\n\n` +
  `他们的交叉火力、补枪 timing、道具衔接——全部精确到毫秒级。你甚至能感觉到他们在比赛里有自己的"暗号"：一个特定的报点方式，一个只有他们听得懂的指令缩写。\n\n` +
  `跟这种队伍打，拼个人能力很难赢。你得在团队协作上压过他们——或者在他们配合出现裂痕的时候，一刀捅进去。`,

  `数据分析组给了我们一个有意思的数字：{opponent} 的回合平均存活时间是 42 秒——联盟最长。\n\n` +
  `什么意思？意思是他们很少在开局阶段就死人。即使丢了一个点位，剩下四个人也能迅速重组防线，不会慌乱。这种"容错率"是他们最大的武器。\n\n` +
  `你想赢他们？不能靠单点突破。你得把他们逼到一个"所有人都必须同时发挥作用"的局面——比如残局，比如经济局。那种时候，五个人之间的配合默契反而会成为负担——因为每个人的决策都会影响其他四个人。`,
];

const styleBodyVeteranSystem: string[] = [
  `这支 {opponent}——平均年龄二十九点三。联盟最老的阵容之一。\n\n` +
  `你别以为老就意味着慢。他们的枪法可能不如年轻人亮眼，但他们对地图的理解、对经济的把控、对时机的判断——那是几千个小时堆出来的直觉。\n\n` +
  `尤其是残局。你跟他们打 5v5 可能还有机会，但一旦打到 3v3 以下——他们的经验优势会被放大十倍。`,

  `{opponent} 的比赛有一种特殊的质感——不急不躁，每一发子弹都像经过计算。\n\n` +
  `他们的指挥 {rival_igl} 打职业已经七年了。七年意味着什么？意味着他见过的局面比你吃过的饭还多。你想用一种他没见过的战术去 surprise 他？难。\n\n` +
  `但老将也有软肋：体能。BO5 的后半程，他们的反应速度会下降。如果你能把比赛拖进第五张图——天平就会开始向你倾斜。`,

  `有一个数据可能会改变你对这场比赛的看法：{opponent} 的 Major 殘局胜率是 68%。\n\n` +
  `联盟平均是多少？41%。他们几乎是平均水平的 1.7 倍。\n\n` +
  `这就是老将的价值——到了关键时刻，年轻人的手会抖，老将的手不会。他们经历过太多生死关面，压力对他们来说只是另一种常态。\n\n` +
  `所以今天你的目标很明确：不要拖入残局。在满员阶段解决战斗。越早越好。`,
];

const styleBodyRookieSurge: string[] = [
  `{opponent} 是今年最大的黑马。半年前还没人看好他们——现在他们站在了你面前。\n\n` +
  `他们的打法可以用一个字形容：莽。不知者无畏的那种莽。\n\n` +
  `{key_player_name}——十九岁，二线联赛上来的。他的 AWP 操作你看了吗？预瞄点完全不讲道理，但他就是能打到。有时候连他自己都不知道下一发子弹会飞向哪里。\n\n` +
  `跟这种队伍打，你没法用常规战术准备。因为他们自己都不知道自己下一回合要干什么。`,

  `新秀队伍有个特点——上限极高，下限极低。\n\n` +
  `{opponent} 上周刚 2-0 碾了一支 top10 的队伍。再往前一周，他们 0-2 输给了一支 nobody 认识的队伍。\n\n` +
  `你永远不知道今天遇到的是哪个版本的他们。可能是打出神级操作的版本，也可能是五个人各自为战的版本。\n\n` +
  `应对策略：开场别轻敌。不管他们上周打成什么样——今天的一切都是未知数。`,

  `分析师给了我们一份关于 {opponent} 的特别报告，标题是《不可预测性量化》。\n\n` +
  `结论是：这支队伍的"非标准操作频率"是联盟平均的三倍。换句话说——他们每场比赛至少会有五六个回合做出完全不符合教科书的选择。\n\n` +
  `这种不可预测性既是武器也是隐患。对他们来说，偶尔的疯狂操作能打乱对手的节奏；但如果连续疯狂——那就只是送了。\n\n` +
  `你的任务是：分辨哪些回合是"天才操作"，哪些回合是"失误"。然后在前者发生之前阻止它，在后者的基础上惩罚它。`,
];

/** 对手风格 → 正文池 */
const styleBodies: Record<OpponentStyle, string[]> = {
  disciplined: styleBodyDisciplined,
  aggressive: styleBodyAggressive,
  star_carry: styleBodyStarCarry,
  team_gun: styleBodyTeamGun,
  veteran_system: styleBodyVeteranSystem,
  rookie_surge: styleBodyRookieSurge,
};

// ──────────────────────────────────────────────
// 2. 关键选手聚焦 —— 附带在主情报后的细节段落
// ──────────────────────────────────────────────

const keyPlayerSniper: string[] = [
  `【狙击手焦点】{key_player_name}\n` +
  `AWP 是这支队伍的定海神针。{key_player_name} 的架点习惯：喜欢在开局 15 秒后从中路远点架狙，覆盖 A 点入口和 B 点通道的交叉口。他不开多余的一枪——每一发都是为了杀人。\n\n` +
  `应对思路：别让他舒服地架枪。在他到达架点位之前制造噪音——让他不知道你是要从正面突破还是从侧面绕后。狙击手最怕的就是不确定的目标。`,

  `【狙击手焦点】{key_player_name}\n` +
  `过去五场，{key_player_name} 的首杀率 34%，其中 AWP 首杀占 28%。他不是那种"等机会"的狙击手——他会主动创造机会。开局 10 秒内就能完成一次远距离定位。\n\n` +
  `但他的近战能力相对薄弱。如果你能把他从架点位挤出来——逼他拿步枪或手枪作战——他的威胁等级直接降一个档次。`,
];

const keyPlayerEntryFragger: string[] = [
  `【突破手焦点】{key_player_name}\n` +
  `他是 {opponent} 的开路先锋。每次快攻，第一个冲进去的就是他。AK/M4 的扫射转移极其凶狠——他能在 0.8 秒内完成两次定位射击。\n\n` +
  `他的突破路线偏好 A 点长箱区域。如果你在那个位置提前预瞄，有很大概率在他探头之前拿到首杀。但风险也很大——他的队友通常会在他身后两秒钟跟进支援。你杀了他，可能立刻被补枪。`,

  `【突破手焦点】{key_player_name}\n` +
  `突破手的工作不只是"冲进去杀人"。{key_player_name} 的真正价值在于：他能用自己的身体测试对方的防守密度。\n\n` +
  `他死了不要紧——他死的时候，队友已经从他获取的信息里知道了你们的站位分布、道具使用情况和防守重点。所以杀掉 {key_player_name} 只是第一步。更重要的是：在他死后立刻调整你的站位，因为他传回的信息马上就会被利用。`,
];

const keyPlayerSupport: string[] = [
  `【辅助焦点】{key_player_name}\n` +
  `你可能不会在记分板上经常看到 {key_player_name} 的名字——但如果你看 demo，你会发现他是这支队伍真正的幕后功臣。\n\n` +
  `闪光弹的时机、烟雾的落点、燃烧瓶的封锁角度——全部由他主导。一场比赛他可能只拿 8 个击杀，但他的道具直接或间接导致了队友的 20+ 击杀。\n\n` +
  `对付辅助选手的策略不是"杀掉他"——而是"绕过他的道具控制"。注意他的道具轨迹，学会预测他会在什么时候扔什么。`,

  `【辅助焦点】{key_player_name}\n` +
  `{key_player_name} 是 {opponent} 的道具发动机。他的闪光配合队友的突破时机，误差不超过 0.5 秒。\n\n` +
  `有一个细节值得注意：他在 B 点区域的烟雾习惯性落在包点前方三米处——这是一个固定套路。如果你知道这个位置，你可以提前预瞄烟雾散开后他队友可能出现的位置。\n\n` +
  `"杀辅助"在 CS 里不是一个光荣的说法。但在某些关键时刻——干掉 {key_player_name} 可能比干掉对方的狙击手更有战略价值。`,
];

const keyPlayerIGL: string[] = [
  `【指挥焦点】{rival_igl}\n` +
  `{rival_igl} 是 {opponent} 的大脑。他的暂停叫得很准——通常在连丢两回合之后，而且每次暂停之后的回合胜率提升 35%。\n\n` +
  `他的战术风格偏稳健，不喜欢冒险。但如果比赛进入 BO5 的后期（第四、五张图），他开始变得激进——因为那时候"稳健"等于"慢性死亡"。\n\n` +
  `对付指挥最好的办法不是针对他个人（他基本不参与正面枪战），而是破坏他的信息源——杀掉他的报点人，让他只能靠猜来做决策。`,

  `【指挥焦点】{rival_igl}\n` +
  `研究 {rival_igl} 的战术笔记是一件有趣的事。他有记录比赛的习惯，而且他的笔记本上写满了密密麻麻的战术变体——针对不同对手、不同经济状况、不同回合数的 Plan A/B/C/D。\n\n` +
  `好消息是他不可能在比赛中翻完所有笔记。坏消息是他的"Plan A"成功率极高——因为那是他花了最多时间准备的。\n\n` +
  `你需要做的：逼迫他放弃 Plan A，跳到 Plan C 或 D——那些他准备不够充分的部分。怎么逼？打破他对比赛走向的预期。`,
];

const keyPlayerClutch: string[] = [
  `【残局焦点】{key_player_name}\n` +
  `如果比赛进入残局阶段——请记住这个名字：{key_player_name}。\n\n` +
  `他的 1v1 胜率 72%，1v2 胜率 51%（联盟前十），1v3 胜率 23%（仍然高于平均）。更可怕的是他的心理素质——落后时不慌，领时不飘。\n\n` +
  `对付 clutch 选手的唯一方法：不给他创造 clutch 的机会。在回合人数优势的时候结束战斗。一旦让他进入 1vX 局面——什么都可能发生。`,

  `【残局焦点】{key_player_name}\n` +
  `{key_player_name} 有个外号——"时间管理大师"。不是说他打得慢，而是他知道什么时候该快、什么时候该慢。\n\n` +
  `1v1 的时候他敢拖到炸弹倒计时最后 5 秒才拆包——不是为了秀，是为了压缩对手的反应窗口。1v2 的时候他会主动制造声音误导对手的位置判断。\n\n` +
  `跟这种人打残局，你不能跟他比意识——你要跟他比执行力。你的枪要比他快，你的预瞄要比他准。因为一旦进入心理博弈的领域——他比你多打了五年。`,
];

/** 关键选手角色 → 聚焦段池 */
const keyPlayerFocus: Record<KeyPlayerRole, string[]> = {
  sniper: keyPlayerSniper,
  entry_frager: keyPlayerEntryFragger,
  support: keyPlayerSupport,
  igl: keyPlayerIGL,
  clutch_player: keyPlayerClutch,
};

// ──────────────────────────────────────────────
// 3. 历史交锋记忆 —— 标题下方的情感锚点
// ──────────────────────────────────────────────

const relationFirstMeet: string[] = [
  `这是你们第一次跟 {opponent} 正式交手。没有历史包袱，没有复仇叙事，没有心理阴影。\n\n` +
  `一张白纸。画什么取决于你们。`,

  `新面孔。{opponent}——你对他们了解多少？大概就是数据面板上那些冷冰冰的数字。\n\n` +
  `没有交手记录意味着没有参考系。但也意味着——没有思维定势。你们可以打出任何东西。`,
];

const relationRival: string[] = [
  `又是 {opponent}。\n\n` +
  `不用多说。你们之间那些恩怨——赛场上的，赛场外的——每个人都清楚。\n\n` +
  `今天不需要动员。每个人都知道该做什么。`,


  `宿敌之战。你和 {opponent} 之间的故事，够写一本小册子了。\n\n` +
  `上次碰面是谁赢了？不重要。重要的是——今天谁站到最后。`,
];

const relationRevenge: string[] = [
  `上次你们输给了 {opponent}{last_matchResult ? '（' + lastMatchResult + '）' : ''}。\n\n` +
  `那天之后训练室的气氛压抑了整整三天。没有人提起那场比赛，但每个人心里都记得。\n\n` +
  `今天——是时候翻篇了。`,

  `还记得上次面对 {opponent} 的感觉吗？\n\n` +
  `最后一回合，比分落后，时间只剩 30 秒——你看着屏幕上的倒计时，听着对面拆包的声音，手指僵在鼠标上。\n\n` +
  `那种感觉。你不想要第二次。`,
];

const relationUnderdog: string[] = [
  `所有人都在说：{opponent} 是热门。你们——是挑战者。\n\n` +
  `挺好的。"挑战者"这个身份意味着一件事：你没有包袱。输了正常，赢了——那就是传奇。\n\n` +
  `放手去打吧。`,


  `赔率出来了。{opponent} 被看好。你们不被看好。\n\n` +
  `你知道赔率不代表一切。但你也能感受到——今天的空气里有一种"弱者逆袭"的味道。\n\n` +
  `有些人天生适合扮演黑马。也许你们就是。`,
];

const relationGrudgeMatch: string[] = [
  `这场比赛……有点不一样。\n\n` +
  `去年这个时候，{opponent} 的某个选手在赛后采访里说了一些不太中听的话。原话就不复述了——总之，你们的选手都记着呢。\n\n` +
  `用成绩回应。别的什么都不用说。`,

  `恩怨局。\n\n` +
  `不是什么大仇大恨——就是那种"上次见面不太愉快，这次见面想把场子找回来"的感觉。\n\n` +
  `电竞圈不大，低头不见抬头见。但今天在这个舞台上——谁也不想低头。`,
];

/** 双方关系 → 记忆段池 */
const relationMemory: Record<MatchRelation, string[]> = {
  first_meet: relationFirstMeet,
  rival: relationRival,
  revenge: relationRevenge,
  underdog: relationUnderdog,
  grudge_match: relationGrudgeMatch,
};

// ──────────────────────────────────────────────
// 4. 杯赛阶段氛围 —— 标题与正文的情绪包装
// ──────────────────────────────────────────────

const stageAtmosphereGroup: Record<CupStage, { titlePrefix: string; atmosphereLine: string }> = {
  group_stage: {
    titlePrefix: "小组赛",
    atmosphereLine: `小组赛。胜负关系出线，但不致命。打好每一场，但别给自己太大压力。`,
  },
  quarter_final: {
    titlePrefix: "四分之一决赛",
    atmosphereLine: `淘汰赛开始了。输了就回家。没有复活的机会。\n\n从现在起——每一场都是决赛。`,
  },
  semi_final: {
    titlePrefix: "半决赛",
    atmosphereLine: `离冠军一步之遥。\n\n你已经打败了四个对手来到这里。{opponent} 也是。\n\n今天之后——只有一支队伍能继续往前走。`,
  },
  final: {
    titlePrefix: "决赛",
    atmosphereLine: `决赛。\n\n你一路走到这里——小组赛、四分之一决赛、 semifinal。每一场都不容易。\n\n现在，最后一步。`,
  },
  major_final: {
    titlePrefix: "Major 决赛",
    atmosphereLine: `Major 决赛。\n\n全世界都在看。直播间的人数会破百万。奖杯就在那里——触手可及。\n\n你准备了多久？从第一天拿起鼠标到现在——所有的训练、所有的失败、所有的重来——都是为了这一刻。\n\n别让自己后悔。`,
  },
};

// ──────────────────────────────────────────────
// 5. 近期状态观察 —— 补充情报维度
// ──────────────────────────────────────────────

const formOnFire: string[] = [
  `近期状态：{opponent}{recentRecord ? '（' + recentRecord + '）' : ''} 正处在巅峰期。他们的选手状态、团队配合、战术执行——全部在线。\n\n` +
  `跟一支状态火热的队伍打，任何小错误都会被放大惩罚。你必须拿出 120% 的表现才有机会。`,
];

const formSlumping: string[] = [
  `近期状态：{opponent}{recentRecord ? '（' + recentRecord + '）' : ''} 陷入低迷。内部消息——更衣室气氛不太好，选手之间有摩擦。\n\n` +
  `一支低落的队伍有两个可能的表现：要么彻底崩盘，要么触底反弹。前者对你有利，后者——小心。绝境中的队伍有时会爆发出可怕的力量。`,
];

const formStable: string[] = [
  `近期状态：{opponent}{recentRecord ? '（' + recentRecord + '）' : ''} 表现稳定。不好不坏——但稳定本身就很可怕。\n\n` +
  `稳定的队伍不会给你太多可乘之机。他们不犯大错，不掉链子。你要赢他们——不能等他们犯错。你得主动创造机会。`,
];

const formVolatile: string[] = [
  `近期状态：{opponent}{recentRecord ? '（' + recentRecord + '）' : ''} 波动极大。上一场还是神，这一场就鬼。\n\n` +
  `这种队伍最难准备。因为你不知道今天会遇到哪个版本。唯一能做的就是：准备好应对所有版本。`,
];

/** 近期状态 → 观察段池 */
const formObservation: Record<OpponentForm, string[]> = {
  on_fire: formOnFire,
  slumping: formSlumping,
  stable: formStable,
  volatile: formVolatile,
};

// ──────────────────────────────────────────────
// 6. 教练博弈层面 —— 深度情报条目
// ──────────────────────────────────────────────

const coachIntelLines: string[] = [
  `{rival_igl} 的暂停习惯：连丢两个回合必叫，叫完之后大概率换战术体系（从快攻转控图 或反之）。`,
  `根据我们的分析，{rival_igl} 在经济局的 default 位置偏好 B 区——过去十场有七场的 ECO 回合都在 B 点做了文章。`,
  `情报组注意到：{opponent} 最近三场比赛的第一回合战术各不相同。这说明 {rival_igl} 在刻意避免被读透。`,
  `{rival_igl} 是个"回合中期调整型"指挥——他的大部分战术微调发生在第 30-50 秒之间，而不是开局前的部署阶段。`,
  `一个有趣的发现：{opponent} 在落后三分以上的比赛中，{rival_igl} 的 call 风格会变得异常激进——赌徒式的激进。`,
  `据可靠消息，{rival_igl} 最近在研究你们的开局战术。具体研究了多少——不清楚。但可以确定：今天的开场不会轻松。`,
  `{rival_igl} 的 timeout 使用率是联盟最低之一。他倾向于让选手自己在逆境中调整——这可能是一个可以利用的点。`,
  `过去的交锋录像显示：{rival_igl} 在面对你们的特定战术时有一个固定的 counter 模式——但那个模式在上个月的一次 patch 之后是否还有效，存疑。`,
];

// ──────────────────────────────────────────────
// 7. 选择反馈丰富化
// ──────────────────────────────────────────────

/** 选择按钮的语义分类 —— 三类战略意图 */
type ChoiceCategory = "prepare" | "protect" | "bluff";

/**
 * 自然语言按钮文案池 —— 玩家口吻，不是设计文档腔。
 * 现实里玩家说"看 demo""热身就行""搞点心理战"，
 * 而不是"演练慢控""保护自信语音""放出假情报"。
 * 生成时从对应类别池里随机取一条，让按钮文字更接地气、更多变。
 */
const choiceLabelPool: Record<ChoiceCategory, string[]> = {
  prepare: [
    "看 demo，拆他们的节奏",
    "做功课——研究下录像",
    "针对性练一波",
    "模拟对手开局",
    "把他们的战术板吃透",
    "拆一下他们的 demo",
  ],
  protect: [
    "别想太多，正常热身",
    "打自己的，别管他们",
    "相信手感就行",
    "放松打，心态放平",
    "按我们自己的节奏来",
    "不给他们加戏",
    "热身完事就上场",
  ],
  bluff: [
    "放个烟雾弹",
    "搞点心理战",
    "演戏给他们看",
    "让他们猜不到",
    "虚实结合一把",
    "搞点小动作",
    "装作没准备好",
  ],
};

/** 通用反馈池 —— 按语义分类（prepare/protect/bluff） */
const allChoiceVariants: Record<ChoiceCategory, ScoutChoiceFeedback[]> = {
  prepare: [
    {
      choiceLabel: "看 demo，拆他们的节奏",
      resultNarrative:
        `你把 {opponent} 的 demo 投到大屏幕上。四十分钟——只看他们的慢控节奏。\n\n` +
        `{myStarPlayer ?? '明星选手'} 找到了一个规律：他们在第三十秒到第四十五秒之间，A 点的防守重心会向中路偏移。这个空档大概只有两秒——但两秒够了。\n\n` +
        `'记住这个窗口。' 你说。'比赛里只有一次机会。'\n\n` +
        `训练结束后，{myRookie ?? '新人'} 小声问：'教练，如果我们没抓到那个窗口怎么办？'\n\n` +
        `'那就打我们自己的。情报是拐杖，不是腿。'`,
      effect: { tactics: 5, tactical_control: 4, firepower: -2, condition: -1, discipline: 2 },
    },
    {
      choiceLabel: "做功课——研究下录像",
      resultNarrative:
        `你花了一小时模拟 {opponent} 的慢控体系。不急——慢慢来，把每个道具落点、每个转点时机、每个站位间距都拆碎了看。\n\n` +
        `收获不小。你们发现了他们慢控的一个结构性弱点：过于依赖 {rival_igl ?? '指挥'} 的 mid-round call。如果他来不及做判断——整支队伍会陷入 3-5 秒的真空期。\n\n` +
        `'真空期就是我们动手的时候。' {myVeteran ?? '老将'} 说。\n\n` +
        `但代价也很明确：高强度脑力消耗让大家的体力下降了。开场的手感可能不会那么顺。`,
      effect: { tactics: 6, tactical_control: 5, condition: -2, firepower: -1, morale: -1 },
    },
    {
      choiceLabel: "针对性练一波",
      resultNarrative:
        `你没让全队一起看 demo。你只叫了队长和 {myVeteran ?? '老将'} 到小会议室——三个人，一台电脑，一杯咖啡。\n\n` +
        `'我们不需要全队都知道这些。我们需要有几个人知道——在关键时刻做正确的 call。'\n\n` +
        `四十分钟后，三人出来。队长拍了拍你的肩：'懂了。'\n\n` +
        `精简情报传递——有时候少即是多。不是每个人都需要知道完整的战术计划。有些人只需要知道：'到时候听我的。'`,
      effect: { tactics: 4, tactical_control: 3, cohesion: 3, discipline: 2, morale: 1 },
    },
  ],
  protect: [
    {
      choiceLabel: "别想太多，正常热身",
      resultNarrative:
        `你把分析师的报告收了起来。\n\n` +
        `'{opponent} 的数据很好看。但数据不会打比赛——人会。'\n\n` +
        `你走到每个选手身后，拍了一下椅背：'打好你们自己的。别管他们。'\n\n` +
        `{myStarPlayer ?? '明星选手'} 摘下一只耳机，回头看了你一眼。眼神里有一种东西——不是轻松，是信任。\n\n` +
        `有时候最好的备战就是不备战。让选手保持他们最舒适的状态，比塞给他们一百条情报更有用。`,
      effect: { morale: 5, cohesion: 4, firepower: 3, condition: 2, tactical_control: -2 },
    },
    {
      choiceLabel: "打自己的，别管他们",
      resultNarrative:
        `分析师还在滔滔不绝地讲 {opponent} 的战术细节。你抬手打断了他。\n\n` +
        `'够了。'\n\n` +
        `全场安静。分析师愣住了。\n\n` +
        `'这些信息——我自己消化。选手不需要知道这么多。知道多了会乱想。'\n\n` +
        `你转向队伍：'今天的战术跟以前一样。相信自己的枪法，相信自己的配合。其他的——我来操心。'\n\n` +
        `训练室里的肩膀松弛了下来。有人笑了。有人深吸了一口气。\n\n` +
        `信心这个东西——有时候比战术更重要。`,
      effect: { morale: 6, cohesion: 5, firepower: 2, condition: 3, tactics: -2, discipline: 1 },
    },
    {
      choiceLabel: "相信手感就行",
      resultNarrative:
        `你做了一个反常的决定：不看 {opponent} 的任何资料。\n\n` +
        `'我们看了太多别人的东西了。今天——只看我们自己。'\n\n` +
        `你让每个人回顾自己过去打得最好的三场 demo。不是分析——是回忆。回忆那种"状态来了"的感觉。\n\n` +
        `{myRookie ?? '新人'} 看着自己的回放，嘴角开始上扬。{myVeteran ?? '老将'} 闭着眼，手指在桌面上无声地敲击——那是肌肉记忆在唤醒。\n\n` +
        `你不知道 {opponent} 今天会打成什么样。但你知道——你的队伍正在找回最好的自己。\n\n` +
        `这就够了。`,
      effect: { morale: 7, firepower: 4, condition: 4, cohesion: 3, tactical_control: -3, tactics: -1 },
    },
  ],
  bluff: [
    {
      choiceLabel: "放个烟雾弹",
      resultNarrative:
        `你让助理在社交媒体上"不小心"泄露了一张战术板截图——上面画的全是慢控阵型。\n\n` +
        `如果 {opponent} 的情报组看到了——他们会以为你们今天要打慢。\n\n` +
        `而实际上——你们的开场战术是快攻 A。\n\n` +
        `这是一步险棋。如果他们信了——你们的前三回合会非常顺利。如果他们没看到，或者看了不信——那这张截图就是个笑话，仅此而已。\n\n` +
        `'赌一把？' 助理问。\n\n` +
        `'赌。'`,
      effect: { tactics: 4, momentum: 3, discipline: -2, morale: 2, tactical_control: 2 },
    },
    {
      choiceLabel: "搞点心理战",
      resultNarrative:
        `假情报不一定非要通过社交媒体。你用了更传统的方式——让一个"恰好"路过 {opponent} 休息区的后勤人员"无意中"听到了你们的战术讨论。\n\n` +
        `讨论的内容？当然是假的。你们今天要打的战术——跟讨论的内容完全相反。\n\n` +
        `{myStarPlayer ?? '明星选手'} 听说了你的计划之后笑了：'教练，您这招够阴的。'\n\n` +
        `'这不叫阴。这叫信息战。' \n\n` +
        `电竞不只是枪法的比拼——也是心理的博弈。`,
      effect: { tactics: 3, momentum: 4, discipline: -1, morale: 3, tactical_control: 1 },
    },
    {
      choiceLabel: "让他们猜不到",
      resultNarrative:
        `你放出了不止一条假线索——而是三条，指向三种完全不同的战术方向。\n\n` +
        `第一条：你们要打快攻。第二条：你们要打极致慢控。第三条：你们要打非常规中路突破。\n\n` +
        `{opponent} 的情报组会疯掉的。三条矛盾的信息意味着——他们无法确定哪条是真的。而当他们无法确定的时候，他们只能做最通用的准备——也就是没有针对性的准备。\n\n` +
        `'这招会不会太复杂了？' 分析师问。\n\n` +
        `'复杂的不是战术——是人。让人混乱比让战术混乱更容易。'`,
      effect: { tactics: 5, momentum: 2, discipline: -3, morale: 1, tactical_control: 3 },
    },
  ],
};

// ──────────────────────────────────────────────
// 池子聚合
// ──────────────────────────────────────────────

// ──────────────────────────────────────────────
// 工具函数
// ──────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  for (let i = 0; i < 4; i++) {
    state = (state * 1664525 + 1013904223) >>> 0;
  }
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function contextToSeed(ctx: Partial<ScoutContext>, extra?: string): number {
  const key = [
    ctx.opponent ?? "",
    ctx.opponentStyle ?? "",
    ctx.cupStage ?? "",
    ctx.matchRelation ?? "",
    ctx.opponentForm ?? "",
    ctx.keyPlayerName ?? "",
    extra ?? "",
  ].join("|");
  return hashString(key);
}

function pickOne<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function fillSlots(text: string, ctx: RequiredScoutContext): string {
  return text
    .replaceAll("{opponent}", ctx.opponent)
    .replaceAll("{key_player_name}", ctx.keyPlayerName)
    .replaceAll("{rival_igl}", ctx.rivalIGL)
    .replaceAll("{last_match_result}", ctx.lastMatchResult ?? "")
    .replaceAll("{recent_record}", ctx.recentRecord ?? "")
    .replaceAll("{my_star_player}", ctx.myStarPlayer ?? "明星选手")
    .replaceAll("{my_veteran}", ctx.myVeteran ?? "老将")
    .replaceAll("{my_rookie}", ctx.myRookie ?? "新人")
    .replaceAll("{cup_id}", ctx.cupId ?? "");
}

type RequiredScoutContext = Omit<Required<ScoutContext>, "cupId">;

/** 构建完整上下文（填充默认值） */
function buildFullCtx(ctx: Partial<ScoutContext>): RequiredScoutContext {
  return {
    opponent: ctx.opponent ?? "对手队伍",
    opponentStyle: ctx.opponentStyle ?? "disciplined",
    cupStage: ctx.cupStage ?? "group_stage",
    cupId: ctx.cupId,
    matchRelation: ctx.matchRelation ?? "first_meet",
    opponentForm: ctx.opponentForm ?? "stable",
    keyPlayerName: ctx.keyPlayerName ?? "对方核心",
    keyPlayerRole: ctx.keyPlayerRole ?? "star_carry",
    rivalIGL: ctx.rivalIGL ?? "对方指挥",
    opponentStars: ctx.opponentStars,
    myStarPlayer: ctx.myStarPlayer,
    myVeteran: ctx.myVeteran,
    myRookie: ctx.myRookie,
    lastMatchResult: ctx.lastMatchResult,
    recentRecord: ctx.recentRecord,
    source: ctx.source,
    isHomeMatch: ctx.isHomeMatch ?? false,
  };
}

// ──────────────────────────────────────────────
// 公开 API
// ──────────────────────────────────────────────

/**
 * 生成一张完整的赛前情报卡。
 *
 * @param ctx   情报上下文
 * @param seed  可选种子——同 seed 同 ctx 必返回同结果
 * @returns     标题 + 正文 + 三个选择反馈
 */
export function generateScoutCard(
  ctx: Partial<ScoutContext>,
  seed?: number,
): { briefing: ScoutBriefing; choices: ScoutChoiceFeedback[] } {
  const fullCtx = buildFullCtx(ctx);
  const s = seed ?? contextToSeed(ctx, "scout_card");
  const rng = seededRandom(s);

  // 1. 标题
  const stageInfo = stageAtmosphereGroup[fullCtx.cupStage];
  const title = `${stageInfo.titlePrefix}赛前：${fullCtx.opponent}`;

  // 2. 正文组装（多层叠加）
  const bodyParts: string[] = [];

  // 2a. 杯赛阶段氛围（决赛以上才加）
  if (fullCtx.cupStage === "final" || fullCtx.cupStage === "major_final") {
    bodyParts.push(fillSlots(stageInfo.atmosphereLine + "\n\n", fullCtx));
  }

  // 2b. 历史交锋记忆（非首次交手才加）
  if (fullCtx.matchRelation !== "first_meet") {
    const memoryPool = relationMemory[fullCtx.matchRelation] ?? [];
    if (memoryPool.length > 0) {
      bodyParts.push(fillSlots(pickOne(memoryPool, rng), fullCtx));
      bodyParts.push(""); // 分隔
    }
  }

  // 2c. 对手风格画像（核心段落）
  const stylePool = styleBodies[fullCtx.opponentStyle] ?? [];
  if (stylePool.length > 0) {
    bodyParts.push(fillSlots(pickOne(stylePool, rng), fullCtx));
    bodyParts.push("");
  }

  // 2d. 关键选手聚焦（可选附加段落，60% 概率添加）
  if (rng() < 0.6) {
    const focusPool = keyPlayerFocus[fullCtx.keyPlayerRole] ?? [];
    if (focusPool.length > 0) {
      bodyParts.push(fillSlots(pickOne(focusPool, rng), fullCtx));
      bodyParts.push("");
    }
  }

  // 2e. 近期状态观察（可选，50% 概率）
  if (rng() < 0.5) {
    const formPool = formObservation[fullCtx.opponentForm] ?? [];
    if (formPool.length > 0) {
      bodyParts.push(fillSlots(pickOne(formPool, rng), fullCtx));
      bodyParts.push("");
    }
  }

  // 2f. 清理尾部空字符串
  while (bodyParts.length > 0 && bodyParts[bodyParts.length - 1] === "") {
    bodyParts.pop();
  }

  // 3. 语气判定
  let tone: ScoutBriefing["tone"] = "neutral";
  if (fullCtx.matchRelation === "revenge" || fullCtx.cupStage === "major_final") {
    tone = "dramatic";
  } else if (fullCtx.matchRelation === "underdog" || fullCtx.opponentForm === "on_fire") {
    tone = "cautious";
  } else if (fullCtx.opponentForm === "slumping" || fullCtx.matchRelation === "rival") {
    tone = "confident";
  } else if (fullCtx.cupStage === "quarter_final" || fullCtx.cupStage === "semi_final") {
    tone = "tense";
  }

  // 4. 情报要点（可选附加 bullet list）
  const bullets: string[] = [];
  if (rng() < 0.4 && coachIntelLines.length > 0) {
    const nBullets = 1 + Math.floor(rng() * 2); // 1-2 条
    const shuffled = [...coachIntelLines].sort(() => rng() - 0.5);
    for (let i = 0; i < nBullets && i < shuffled.length; i++) {
      bullets.push(fillSlots(shuffled[i], fullCtx));
    }
  }

  const briefing: ScoutBriefing = {
    title,
    body: bodyParts.filter((p) => p !== ""),
    intelBullets: bullets.length > 0 ? bullets : undefined,
    tone,
  };

  // 5. 选择反馈（每个语义类别取一个叙事变体，按钮文案从该类别自然语言池随机取）
  const choices: ScoutChoiceFeedback[] = [];
  const choiceKeys: ChoiceCategory[] = ["prepare", "protect", "bluff"];
  for (const key of choiceKeys) {
    const pool = allChoiceVariants[key] ?? [];
    const labelPool = choiceLabelPool[key] ?? [];
    if (pool.length > 0) {
      const chosen = pickOne(pool, seededRandom(rng() * 99999));
      // 按钮文案从该语义类别的自然语言池里随机取一条，
      // 让按钮文字像玩家说话而不是设计文档。
      const finalLabel = labelPool.length > 0
        ? pickOne(labelPool, seededRandom(rng() * 99999 + 7))
        : chosen.choiceLabel;
      choices.push({
        ...chosen,
        choiceLabel: finalLabel,
        resultNarrative: fillSlots(chosen.resultNarrative, fullCtx),
      });
    }
  }

  return { briefing, choices };
}

/**
 * 只生成情报正文（不含选择反馈）。
 * 用于只想更新情报文字而不涉及选择的场景。
 */
export function generateBriefingText(
  ctx: Partial<ScoutContext>,
  seed?: number,
): ScoutBriefing {
  return generateScoutCard(ctx, seed).briefing;
}

/**
 * 只生成选择反馈。
 * 用于情报已定、只需补充选择场景。
 */
export function generateChoiceFeedbacks(
  ctx: Partial<ScoutContext>,
  seed?: number,
): ScoutChoiceFeedback[] {
  return generateScoutCard(ctx, seed).choices;
}

/**
 * 枚举调试
 */
export const SCOUT_STYLES: OpponentStyle[] = [
  "disciplined",
  "aggressive",
  "star_carry",
  "team_gun",
  "veteran_system",
  "rookie_surge",
];

export const SCOUT_STAGES: CupStage[] = [
  "group_stage",
  "quarter_final",
  "semi_final",
  "final",
  "major_final",
];

export const SCOUT_RELATIONS: MatchRelation[] = [
  "first_meet",
  "rival",
  "revenge",
  "underdog",
  "grudge_match",
];

export const SCOUT_FORMS: OpponentForm[] = [
  "on_fire",
  "slumping",
  "stable",
  "volatile",
];

export const KEY_PLAYER_ROLES: KeyPlayerRole[] = [
  "sniper",
  "entry_fragger",
  "support",
  "igl",
  "clutch_player",
];
