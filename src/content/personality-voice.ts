/**
 * 选手性格化台词库
 *
 * 六种核心性格（trait）的选手，在同一情境下会说不同的话。
 * 模拟引擎根据选手 traits 选取对应台词，让每个角色声音独特。
 *
 * 性格依据 docs/product-specs/ROSTER.md 的 trait 词汇表：
 *   hot_blooded    — 火爆型：直、爆、敢冲
 *   calm_clutcher  — 冷静残局手：少、准、稳
 *   system_leader  — 体系指挥：战术化、有条理
 *   streaky_star   — 起伏型明星：自信、张扬、脆弱
 *   disciplined    — 纪律型：规范、保守、稳
 *   crowd_favorite — 人气王：戏剧化、有感染力
 *
 * 台词原则（参见 UI_TEXT.md 和 EVENTS.md）：
 *   1. 每句必须通过"真人会说这个吗"测试
 *   2. 不写说明文，不写"你知道吗"
 *   3. 性格之间是"种类不同"，不是"程度不同"
 *   4. 同一情境下六种性格的台词，玩家应该能凭声音辨认是谁
 */

// ──────────────────────────────────────────────
// 类型定义
// ──────────────────────────────────────────────

export type PersonalityTrait =
  | "hot_blooded"
  | "calm_clutcher"
  | "system_leader"
  | "streaky_star"
  | "disciplined"
  | "crowd_favorite";

export type VoiceSituation =
  | "match_start"
  | "round_won"
  | "round_lost"
  | "clutch_approach"
  | "timeout_called"
  | "taunted"
  | "teammate_mistake"
  | "after_scrim"
  | "match_lost"
  | "match_won"
  | "benched"
  | "criticized"
  | "praised";

export interface PersonalityLine {
  /** 台词正文 */
  text: string;
  /** 可选：附加的动作/表情描写，括号包裹 */
  action?: string;
}

export interface VoicePillar {
  trait: PersonalityTrait;
  /** 性格名称 */
  name: string;
  /** 词汇特征 */
  vocabulary: string;
  /** 句式节奏 */
  rhythm: string;
  /** 避免的话题 */
  avoids: string;
  /** 口头禅 */
  tics: string[];
  /** 潜台词默认 */
  subtext: string;
}

// ──────────────────────────────────────────────
// 六种性格的声音支柱
// ──────────────────────────────────────────────

export const voicePillars: VoicePillar[] = [
  {
    trait: "hot_blooded",
    name: "火爆型",
    vocabulary: "粗、直、不修边幅，会带脏字",
    rhythm: "短句、爆裂、感叹号多，像连发枪",
    avoids: "长篇分析、承认恐惧、示弱",
    tics: ["干他", "冲", "怂什么", "我看他能怎样"],
    subtext: "说一不二，从不绕弯子。愤怒是默认情绪。",
  },
  {
    trait: "calm_clutcher",
    name: "冷静残局手",
    vocabulary: "少、准、克制，像手术刀",
    rhythm: "短促稳定，无废话，每句话都有信息量",
    avoids: "情绪化、抱怨、为自己辩解",
    tics: ["等等", "我来", "稳住", "别急"],
    subtext: "话少但每句都重。沉默比言语更有力。",
  },
  {
    trait: "system_leader",
    name: "体系指挥",
    vocabulary: "战术化、结构化、专业术语",
    rhythm: "中长句，有条理，像在下棋",
    avoids: "情绪化表达、个人英雄主义、即兴发挥",
    tics: ["按计划", "默认", "听我的", "转点"],
    subtext: "永远在思考下一手。情绪是奢侈品。",
  },
  {
    trait: "streaky_star",
    name: "起伏型明星",
    vocabulary: "自信、张扬、有时夸张",
    rhythm: "起伏大，状态好时滔滔不绝，状态差时沉默",
    avoids: "承认自己不行、示弱、把功劳让给别人",
    tics: ["看我的", "这把我的", "随我", "让他们看看"],
    subtext: "自信是面具。面具下面是不敢看的脆弱。",
  },
  {
    trait: "disciplined",
    name: "纪律型",
    vocabulary: "规范、保守、不越界",
    rhythm: "平稳，无波澜，像节拍器",
    avoids: "冒险言论、挑衅、即兴发挥",
    tics: ["按规矩来", "别浪", "稳", "执行"],
    subtext: "永远在做'正确的事'。正确比精彩重要。",
  },
  {
    trait: "crowd_favorite",
    name: "人气王",
    vocabulary: "有感染力、戏剧化、照顾观众情绪",
    rhythm: "起伏大，有戏剧性，像在演戏",
    avoids: "冷漠、敷衍、忘了有人在看",
    tics: ["给他们看", "听见了吗", "这一刻", "记住今天"],
    subtext: "在乎被看到，不只是赢。没有观众的胜利是空的。",
  },
];

// ──────────────────────────────────────────────
// 情境化台词库
// ──────────────────────────────────────────────

export const personalityLines: Record<
  PersonalityTrait,
  Partial<Record<VoiceSituation, PersonalityLine[]>>
> = {
  // ════════════════════════════════════════════
  // 火爆型
  // ════════════════════════════════════════════
  hot_blooded: {
    match_start: [
      { text: "干就完了。废什么话。", action: "（把耳机往桌上一摔）" },
      { text: "对面那个？上次他被我打哭过。今天再让他哭一次。" },
      { text: "开局我要首杀。谁也别跟我抢。" },
    ],
    round_won: [
      { text: "看到没？！就这？就这？！", action: "（站起来对着对手隔音棚比手势）" },
      { text: "舒服！再来！我还不够！" },
      { text: "他架那个位置？做梦。" },
    ],
    round_lost: [
      { text: "妈的。我的。我的锅。下把赢回来。" },
      { text: "别跟我说什么战术！那把就是我送了！我自己知道！" },
      { text: "……" , action: "（把鼠标往桌上一放，深呼吸）" },
    ],
    clutch_approach: [
      { text: "都别说话。这把我的。谁报点我跟谁急。" },
      { text: "一个？两个？三个都行。来多少杀多少。" },
      { text: "稳什么稳？冲进去杀完就完了。" },
    ],
    timeout_called: [
      { text: "叫暂停干嘛？让我冲啊！", action: "（很不情愿地放下鼠标）" },
      { text: "行行行，你说。但我下把还要冲。" },
      { text: "我手正热呢，真不想停。" },
    ],
    taunted: [
      { text: "他敢跟我比这个？等着。下把让他闭嘴。" },
      { text: "（直接站起来回敬手势）你说什么？再说一遍？" },
      { text: "好。好。他完了。这把我就盯他一个人。" },
    ],
    teammate_mistake: [
      { text: "你他妈在干什么？！那个补枪呢？！" , action: "（说完立刻后悔，但嘴硬不道歉）" },
      { text: "……算了。我的。我没第一时间报点。" },
      { text: "下把听我的。我说冲你就冲。别自己想。" },
    ],
    after_scrim: [
      { text: "今天手感不行。再打两场。", action: "（已经打了六个小时）" },
      { text: "刚才那个 1v3 算什么？我应该 1v4 的。" },
      { text: "走什么走？再来一场。" },
    ],
    match_lost: [
      { text: "……", action: "（把毛巾盖在头上，谁也不看）" },
      { text: "我送的。怪我。别怪他们。", action: "（声音闷闷的，从毛巾底下传出来）" },
      { text: "下个杯赛。下个杯赛我一定赢。谁也别拦我。" },
    ],
    match_won: [
      { text: "我说的吧？！我他妈说的吧？！", action: "（冲到舞台中间对着观众咆哮）" },
      { text: "谁还不服？啊？还有谁？！" },
      { text: "这奖杯——这奖杯是我的。我的。" , action: "（抱着奖杯不撒手）" },
    ],
    benched: [
      { text: "凭什么？", action: "（盯着教练，眼神像刀子）" },
      { text: "行。你说了算。但你记住——下次让我上的时候，别求我。" },
      { text: "……我知道了。", action: "（收拾东西的时候把椅子踹歪了）" },
    ],
    criticized: [
      { text: "我知道。你别说了。我自己知道。", action: "（喉咙发紧，但就是不认错）" },
      { text: "那把是冲动了。但我不冲谁冲？" },
      { text: "……行。下次我听你的。但只这一次。" },
    ],
    praised: [
      { text: "废话。我当然是最好的。", action: "（嘴上这么说，但耳朵红了）" },
      { text: "这才哪到哪。我还能更好。" },
      { text: "别夸了。夸多了我飘。", action: "（明显已经飘了）" },
    ],
  },

  // ════════════════════════════════════════════
  // 冷静残局手
  // ════════════════════════════════════════════
  calm_clutcher: {
    match_start: [
      { text: "准备好了。", action: "（闭眼三秒，再睁开）" },
      { text: "按计划打。少说话。" },
      { text: "……", action: "（已经在脑子里预演前三个回合了）" },
    ],
    round_won: [
      { text: "嗯。", action: "（没有任何表情变化，立刻看下个回合的经济）" },
      { text: "下个。别松。" },
      { text: "赢了就赢了。别回味。" },
    ],
    round_lost: [
      { text: "我的。下把补回来。", action: "（声音平得像没输过）" },
      { text: "别急。我们还在。" },
      { text: "……", action: "（已经开始看回放，找问题）" },
    ],
    clutch_approach: [
      { text: "都别说话。我数三个节奏点。", action: "（声音突然变得更低更稳）" },
      { text: "一个一个来。不急。" },
      { text: "时间够。我能赢。" },
    ],
    timeout_called: [
      { text: "嗯。该叫了。", action: "（第一个站起来走向教练）" },
      { text: "我说一下我看到的问题。" },
      { text: "喝口水。然后听教练的。" },
    ],
    taunted: [
      { text: "……", action: "（看都不看对手一眼）" },
      { text: "没用。让他喊。下把见真章。" },
      { text: "情绪是他的事。我只管回合。" },
    ],
    teammate_mistake: [
      { text: "没事。下把补回来。", action: "（拍了下队友的椅背）" },
      { text: "你那个位置，下次等我报点再动。" },
      { text: "别自责。我们都犯过。" },
    ],
    after_scrim: [
      { text: "今天够了。再多打手会僵。", action: "（第一个站起来，但其实是最后一个关电脑的）" },
      { text: "刚才那个残局，我应该先打 B 点那个。记一下。" },
      { text: "走了。明天见。" },
    ],
    match_lost: [
      { text: "……", action: "（坐在原地不动，盯着屏幕看了五分钟）" },
      { text: "明年。", action: "（只说了两个字，但所有人都听见了）" },
      { text: "回去看回放。我需要知道输在哪。" },
    ],
    match_won: [
      { text: "嗯。", action: "（嘴角动了一下，但立刻压了下去）" },
      { text: "赢了。下个杯赛。" },
      { text: "……谢谢。", action: "（对教练说的，声音轻得像怕被人听见）" },
    ],
    benched: [
      { text: "好。", action: "（没有追问，把耳机递给替补的时候手很稳）" },
      { text: "我看着。有问题我喊。" },
      { text: "……保重。", action: "（对替补说的，像在交代后事）" },
    ],
    criticized: [
      { text: "嗯。记住了。", action: "（点了下头，没有辩解）" },
      { text: "你说得对。下把改。" },
      { text: "我知道。那个判断慢了。" },
    ],
    praised: [
      { text: "运气。", action: "（不接受夸奖，但耳朵微微动了一下）" },
      { text: "该做的。别夸。" },
      { text: "……谢谢。", action: "（过了两秒才说出来，像不习惯这两个字）" },
    ],
  },

  // ════════════════════════════════════════════
  // 体系指挥
  // ════════════════════════════════════════════
  system_leader: {
    match_start: [
      { text: "默认控图开局。第二回合看他们经济。如果 ECO，我们反 ECO 站位。", action: "（在白板上画了三个方案）" },
      { text: "听我叫。别自己改。我报点你们才动。" },
      { text: "前三个回合定调。别送。" },
    ],
    round_won: [
      { text: "好。但他们下把会变。准备好两种应对。", action: "（已经在想下一回合了）" },
      { text: "经济记一下。他们这把 ECO，下把可能 force buy。" },
      { text: "别飘。一个回合不代表什么。" },
    ],
    round_lost: [
      { text: "他们用了新站位。我记下来了。下把针对。", action: "（在脑子里建了个表格）" },
      { text: "我的判断失误。下把改回默认。" },
      { text: "别慌。按计划。我们还在节奏里。" },
    ],
    clutch_approach: [
      { text: "我先报点。你听我的节奏。我让你动你才动。", action: "（对残局选手说的）" },
      { text: "他在 B。另一个可能在中路。时间够。" },
      { text: "稳住。一个一个来。不急。" },
    ],
    timeout_called: [
      { text: "我来。", action: "（第一个走到白板前）" },
      { text: "他们中路前压了两次。下把假打中路，真打 B。" },
      { text: "所有人听清楚——下个回合的站位是这样的……" },
    ],
    taunted: [
      { text: "不管他。打我们的。", action: "（连头都没抬）" },
      { text: "情绪是他们的战术。别上当。" },
      { text: "赢回合比赢嘴仗重要。" },
    ],
    teammate_mistake: [
      { text: "你那个走位不对。下次等烟雾散一半再动。", action: "（语气平，但很坚定）" },
      { text: "不怪你。是我没叫清楚。" },
      { text: "下把听我节奏。我说'转'你才转。" },
    ],
    after_scrim: [
      { text: "今天的训练赛我录了。回去每个人看自己的 POV。", action: "（已经在整理录像了）" },
      { text: "第二场的中路控图有问题。明天专门练这个。" },
      { text: "八点走。明天九点准时到。" },
    ],
    match_lost: [
      { text: "我的责任。战术是我叫的。", action: "（第一个站起来，但没看任何人）" },
      { text: "回去复盘。每个回合。我要知道每个失误的根源。" },
      { text: "……明年。明年我们准备好了再来。" },
    ],
    match_won: [
      { text: "执行到位。该赢的。", action: "（点了下头，像在确认一件事）" },
      { text: "别庆祝太久。下个杯赛下周就开始了。" },
      { text: "……", action: "（偷偷笑了一下，但立刻收住）" },
    ],
    benched: [
      { text: "我理解。战术安排是教练的事。", action: "（点了下头，没多问）" },
      { text: "我帮你盯着。他们的站位我比谁都熟。" },
      { text: "……保重。", action: "（对替补说的，语气像在交接工作）" },
    ],
    criticized: [
      { text: "你说得对。那个判断是冲动了。", action: "（立刻接受，没有辩解）" },
      { text: "我的问题。下次按计划来。" },
      { text: "……记住了。下不为例。" },
    ],
    praised: [
      { text: "是大家执行得好。我只是叫了该叫的。", action: "（把功劳推给队友）" },
      { text: "战术到位而已。别夸我。" },
      { text: "……谢谢。", action: "（过了三秒才说，像不习惯被单独夸）" },
    ],
  },

  // ════════════════════════════════════════════
  // 起伏型明星
  // ════════════════════════════════════════════
  streaky_star: {
    match_start: [
      { text: "今天我感觉来了。看我的。", action: "（甩了下手腕，像在试手感）" },
      { text: "对面那个狙？我专门练过他的预瞄。今天让他知道什么叫差距。" },
      { text: "前三个回合我要拿首杀。你们补就行。" },
    ],
    round_won: [
      { text: "看到没？看到没？！我就说今天手感来了！", action: "（兴奋得差点站起来）" },
      { text: "那个 1v2 算什么？我应该 1v3 的。" },
      { text: "再来！我感觉能五杀！" },
    ],
    round_lost: [
      { text: "……", action: "（突然沉默，跟刚才判若两人）" },
      { text: "那个枪我不该开的……是我的……", action: "（声音变小了）" },
      { text: "下把……下把我一定赢回来。" , action: "（握鼠标的手在抖）" },
    ],
    clutch_approach: [
      { text: "都让开。这把我的。", action: "（声音突然变得很冷，跟刚才完全不同）" },
      { text: "我知道他在哪。我闻得到。" },
      { text: "三个？三个正好。" },
    ],
    timeout_called: [
      { text: "别叫我停！我手正热！", action: "（很不情愿）" },
      { text: "……行。你说。但我感觉还在。" },
      { text: "下把还让我冲。我知道我能赢。" },
    ],
    taunted: [
      { text: "他跟我嚣张？他配吗？", action: "（冷笑）" },
      { text: "等着。下把我让他知道什么叫天赋。" },
      { text: "（也站起来回敬，但比对方更夸张）" },
    ],
    teammate_mistake: [
      { text: "那个补枪呢？我都开枪了你在干嘛？", action: "（语气有点冲，但立刻压住）" },
      { text: "……算了。下把我自己来。" },
      { text: "你别管我。我自己能赢。" },
    ],
    after_scrim: [
      { text: "再来一场。我感觉快找到那个点了。", action: "（已经打了五个小时，但眼睛还亮着）" },
      { text: "刚才那个翻盘……再来一次我还能赢。" },
      { text: "今天不打到爽我不走。" },
    ],
    match_lost: [
      { text: "是我的……都怪我……", action: "（声音在抖，眼眶红了）" },
      { text: "我应该赢那个 1v2 的……如果赢了就……" },
      { text: "……对不起。对不起大家。" , action: "（把头埋在毛巾里）" },
    ],
    match_won: [
      { text: "我说了！我说了今天是我的！", action: "（冲上舞台，把奖杯举过头顶）" },
      { text: "那个 MVP 是我的。谁也别想抢。" , action: "（笑着，但眼眶是红的）" },
      { text: "……我做到了。我真的做到了。" , action: "（声音突然变轻，像在跟自己说）" },
    ],
    benched: [
      { text: "……为什么？", action: "（没生气，但眼神空了）" },
      { text: "我以为……我以为我今天手感来了。" },
      { text: "行。我知道了。", action: "（收拾东西的时候手在抖）" },
    ],
    criticized: [
      { text: "我知道……我知道那把冲动了……", action: "（声音变小，像被戳破的气球）" },
      { text: "但我感觉……我感觉我能赢……" },
      { text: "……行。下次听你的。" , action: "（嘴上答应，但眼神不服）" },
    ],
    praised: [
      { text: "当然。我本来就是最好的。", action: "（嘴上这么说，但笑得合不拢）" },
      { text: "这才哪到哪。我还能更好。你们看着。" },
      { text: "……谢谢教练。", action: "（突然认真起来，像被戳中了什么）" },
    ],
  },

  // ════════════════════════════════════════════
  // 纪律型
  // ════════════════════════════════════════════
  disciplined: {
    match_start: [
      { text: "按计划来。不浪，不冲，不送。", action: "（把战术本翻开，放在键盘旁边）" },
      { text: "经济局就 ECO。别强起。" },
      { text: "听指挥。执行。别自己加戏。" },
    ],
    round_won: [
      { text: "嗯。执行到位。下把继续。", action: "（没有表情变化）" },
      { text: "别飘。一个回合不代表什么。" },
      { text: "记一下他们的经济。下把他们可能 ECO。" },
    ],
    round_lost: [
      { text: "我们没按计划打。下把回到默认。", action: "（语气平，但很坚定）" },
      { text: "那个走位不该出现。下次按规矩来。" },
      { text: "别慌。按计划。我们还在节奏里。" },
    ],
    clutch_approach: [
      { text: "稳住。别急。时间够。", action: "（声音比平时更稳）" },
      { text: "按训练的来。先找位置，再开枪。" },
      { text: "一个一个打。不赌。" },
    ],
    timeout_called: [
      { text: "应该叫。节奏乱了。", action: "（第一个点头）" },
      { text: "我说一下我看到的问题。第二回合的走位不对。" },
      { text: "回到默认就行。别加新东西。" },
    ],
    taunted: [
      { text: "不管他。打我们的。", action: "（连看都没看对手）" },
      { text: "情绪是浪费时间。专注回合。" },
      { text: "让他喊。我们赢我们的。" },
    ],
    teammate_mistake: [
      { text: "下把按规矩来。那个位置不该你站。", action: "（语气不重，但很明确）" },
      { text: "没事。回到默认就行。" },
      { text: "记住这个教训。下次别犯。" },
    ],
    after_scrim: [
      { text: "八点走。明天九点到。", action: "（第一个看表）" },
      { text: "今天的训练赛我记了三个问题。回去看一下。" },
      { text: "够了。再多打效率会降。" },
    ],
    match_lost: [
      { text: "我们没执行好。回去复盘。", action: "（语气跟平时一样平）" },
      { text: "每个失误都记下来。下个杯赛不能再犯。" },
      { text: "……明年。明年我们准备好了再来。" },
    ],
    match_won: [
      { text: "执行到位。该赢的。", action: "（点了下头）" },
      { text: "别庆祝太久。下个杯赛还有一周。" },
      { text: "……", action: "（嘴角动了一下，但立刻收住）" },
    ],
    benched: [
      { text: "我理解。教练的决定我服从。", action: "（点了下头，没多问）" },
      { text: "我看着。有问题我记下来。" },
      { text: "……保重。", action: "（对替补说的，语气像在交接工作）" },
    ],
    criticized: [
      { text: "你说得对。那个判断不合规矩。", action: "（立刻接受）" },
      { text: "我的问题。下次按计划来。" },
      { text: "……记住了。" },
    ],
    praised: [
      { text: "该做的。别夸。", action: "（不接受额外赞美）" },
      { text: "执行到位而已。是大家配合的好。" },
      { text: "……谢谢。", action: "（点了下头，没多说）" },
    ],
  },

  // ════════════════════════════════════════════
  // 人气王
  // ════════════════════════════════════════════
  crowd_favorite: {
    match_start: [
      { text: "你们听到了吗？他们在喊我们的名字。", action: "（指了指观众席，笑了）" },
      { text: "今天给他们看点好看的。不能让远道而来的人失望。" },
      { text: "这一刻——记住这一刻。一万两千人。" },
    ],
    round_won: [
      { text: "听到了吗？！这就是我们的主场！", action: "（站起来冲观众席挥拳）" },
      { text: "给他们看！让他们记住这一回合！" },
      { text: "再来！让他们喊得再响一点！" },
    ],
    round_lost: [
      { text: "没事。下一个回合，我们让他们再喊一次。", action: "（拍了拍队友的肩）" },
      { text: "别低头。他们都在看。抬起头来。" },
      { text: "故事还没结束。好戏在后头。" },
    ],
    clutch_approach: [
      { text: "这一刻是属于我们的。", action: "（声音突然变得很沉）" },
      { text: "让他们记住这个残局。记住今天。" },
      { text: "一万两千人在看。我不会让他们失望。" },
    ],
    timeout_called: [
      { text: "该叫了。他们需要喘口气——我们也是。", action: "（看了看观众席）" },
      { text: "回去打。让他们看到我们怎么翻盘。" },
      { text: "这一刻会出现在集锦里。让我们把它做好。" },
    ],
    taunted: [
      { text: "他想要观众？观众是我的。", action: "（冷笑）" },
      { text: "让他喊。下把观众会喊我的名字盖过他。" },
      { text: "（站起来，对着观众席张开双臂——观众席炸了）" },
    ],
    teammate_mistake: [
      { text: "没事。下把我们给他们看一个好的。", action: "（拍了拍队友的头）" },
      { text: "别在意。他们看的是我们，不是比分。" },
      { text: "抬起头。故事还没完。" },
    ],
    after_scrim: [
      { text: "今天的训练赛有几个回合能进集锦。", action: "（笑着回放自己的高光）" },
      { text: "走之前发个微博——粉丝们等着呢。" },
      { text: "明天见。记住今天的节奏。" },
    ],
    match_lost: [
      { text: "……", action: "（看着观众席，挥手——即使输了，他也要让粉丝看到他在笑）" },
      { text: "对不起。让你们白来了。", action: "（对着观众席说的，声音很轻）" },
      { text: "明年。明年我们一定让你们喊出来。" },
    ],
    match_won: [
      { text: "这一刻——这一刻我等了三年！", action: "（冲上舞台，张开双臂接受欢呼）" },
      { text: "这奖杯不只是我们的。是所有喊我们名字的人的。" , action: "（把奖杯举向观众席）" },
      { text: "记住今天！记住这一刻！这是我们的一天！" },
    ],
    benched: [
      { text: "……行。我理解。", action: "（点了下头，但你看得出他不甘心）" },
      { text: "粉丝们会问的。我去解释。" },
      { text: "……别让我失望。", action: "（对替补说的，语气有点复杂）" },
    ],
    criticized: [
      { text: "我知道。我不该在意那些声音。", action: "（声音有点闷）" },
      { text: "但你得理解——那些人在看着我。我不能让他们失望。" },
      { text: "……行。下次专注比赛。不管观众。" },
    ],
    praised: [
      { text: "不不不，这是大家的功劳。我只是……我只是被看到了而已。", action: "（笑着，但很真诚）" },
      { text: "粉丝们也该被夸。他们远道而来。" },
      { text: "……谢谢教练。真的。" },
    ],
  },
};

// ──────────────────────────────────────────────
// 辅助函数
// ──────────────────────────────────────────────

/** 获取某性格在某情境下的所有候选台词 */
export function getPersonalityLines(
  trait: PersonalityTrait,
  situation: VoiceSituation
): PersonalityLine[] {
  return personalityLines[trait]?.[situation] ?? [];
}

/**
 * 用种子从候选台词中确定性选取一句。
 *
 * @param trait      选手性格
 * @param situation  情境
 * @param seed       随机种子（保证同一存档同一情境结果一致）
 * @returns          选中的台词；若无候选则返回 undefined
 */
export function pickPersonalityLine(
  trait: PersonalityTrait,
  situation: VoiceSituation,
  seed: number
): PersonalityLine | undefined {
  const pool = getPersonalityLines(trait, situation);
  if (pool.length === 0) return undefined;
  return pool[seed % pool.length];
}

/**
 * 渲染性格台词为显示文本（含动作描写）。
 *
 * @param line 台词对象
 * @returns    纯文本（台词 + 动作，用空格分隔）
 */
export function renderPersonalityLine(line: PersonalityLine): string {
  return line.action ? `${line.text} ${line.action}` : line.text;
}

/**
 * 根据选手的 traits 数组选取主性格。
 * 一个选手可能有多个 trait，取第一个有台词库的作为主性格。
 *
 * @param traits 选手的 trait 数组
 * @returns      主性格；若都无台词库则返回 undefined
 */
export function resolvePrimaryPersonality(
  traits: string[]
): PersonalityTrait | undefined {
  for (const t of traits) {
    if (t in personalityLines) {
      return t as PersonalityTrait;
    }
  }
  return undefined;
}

/**
 * 一站式接口：根据选手 traits + 情境 + 种子，输出一句台词。
 *
 * @param traits    选手的 trait 数组
 * @param situation 情境
 * @param seed      随机种子
 * @returns         渲染后的台词文本；若选手无匹配性格则返回空字符串
 */
export function getCharacterLine(
  traits: string[],
  situation: VoiceSituation,
  seed: number
): string {
  const trait = resolvePrimaryPersonality(traits);
  if (!trait) return "";
  const line = pickPersonalityLine(trait, situation, seed);
  return line ? renderPersonalityLine(line) : "";
}
