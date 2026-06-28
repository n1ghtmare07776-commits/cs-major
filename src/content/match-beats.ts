/**
 * 局内战斗节拍库
 *
 * 每场比赛 BO5（最多 5 个压缩回合），先到 3 胜。
 * 每场比赛约 10 张事件卡，其中玩家决策卡不超过 3 张。
 *
 * 设计目标：
 *   1. 每张卡的文本对照玩家选择——ECO 局全员格洛克，强起局出现 AK/AWP
 *   2. 非玩家参与的击杀用文学化描述：扫射转移、甩狙、混烟、绕后偷背身
 *   3. 道具有具体效果：拖延 N 秒、造成大残、封锁视线
 *   4. 激进型选手获胜后可嘲讽对手，影响士气
 *
 * 武器对照（参考真实 CS 术语，注意：无 prone，只有走/跑/蹲走/跳）：
 *   eco:         Glock-18 / Tec-9 / P250 / USP-S / 五七 / 双持贝瑞塔
 *   half_buy:    MP9 / MAC-10 / UMP-45 / Galil / FAMAS / P250+甲
 *   full_buy:    AK-47 / M4A4 / M4A1-S / AWP / AUG / SG553 + 满甲满道具
 *   force_buy:   上述混合，缺甲或少道具
 *
 * 变量槽位（引擎填充）：
 *   {player}          — 选手名（如 donk、ZywOo、NiKo、m0NESY）
 *   {opponent}        — 对手选手名
 *   {weapon}          — 武器名
 *   {site}            — A 点 / B 点 / 中路 / 香蕉道 / A 小 / B 小 / 二楼
 *   {count}           — 击杀数
 *   {hp}              — 剩余血量
 *   {time}            — 拖延秒数
 *   {team}            — 队伍名
 *   {rival_team}      — 对手队伍名
 */

// ──────────────────────────────────────────────
// 类型定义
// ──────────────────────────────────────────────

export type EconomyTier = "full_buy" | "half_buy" | "eco" | "force_buy";

export type RoundPhase =
  | "opening"      // 第 1 回合：经济+战术开场
  | "pressure"     // 第 2 回合：上回合结果传导
  | "swing"        // 第 3 回合：转折
  | "adjustment"   // 第 4 回合：调整（如有）
  | "closing";     // 第 5 回合：赛点（如有）

export type BeatRole =
  | "economy_setup"     // 经济/装备描述
  | "tactic_choice"     // 玩家决策：战术
  | "opening_kill"       // 首杀
  | "mid_firefight"      // 中段交火
  | "utility_use"        // 道具博弈
  | "highlight_kill"     // 高光击杀（连杀/甩狙/混烟）
  | "lurk_flank"         // 单摸绕后
  | "clutch_setup"       // 残局前情
  | "clutch_resolution"  // 残局结算（玩家决策）
  | "round_result"       // 回合结算
  | "morale_feedback"    // 士气反馈
  | "taunt"              // 嘲讽/垃圾话（玩家决策）
  | "narrative_beat";    // 纯叙事节拍

export interface MatchBeat {
  /** 节拍 id */
  id: string;
  /** 节拍角色 */
  role: BeatRole;
  /** 适用的回合阶段 */
  phase: RoundPhase[];
  /** 适用的经济状态（空数组=任意） */
  economyRequired: EconomyTier[];
  /** 标题——卡片顶部 */
  title: string;
  /** 正文——含变量槽位 */
  text: string;
  /** 末尾的紧凑数值变化（参考 UI_TEXT.md） */
  delta?: string;
  /** 是否为玩家决策卡 */
  playerDecision: boolean;
  /** 玩家决策选项（仅 playerDecision=true 时） */
  choices?: BeatChoice[];
  /** 触发条件描述（引擎判定） */
  trigger?: string[];
}

export interface BeatChoice {
  /** 动作标签 */
  label: string;
  /** 结果文本 */
  resultText: string;
  /** 数值变化 */
  delta?: string;
}

// ──────────────────────────────────────────────
// 经济-武器对照表
// ──────────────────────────────────────────────

export const economyWeaponTable: Record<EconomyTier, {
  label: string;
  primary: string[];   // 主武器池
  secondary: string[]; // 手枪池
  armor: string;
  utility: string;
  narrativeHint: string;
}> = {
  full_buy: {
    label: "全买",
    primary: ["AK-47", "M4A4", "M4A1-S", "AWP", "AUG", "SG553"],
    secondary: ["USP-S", "P2000", "Glock-18"],
    armor: "满甲满头盔",
    utility: "烟雾弹 ×2、闪光弹 ×3、燃烧弹 ×1、高爆手雷 ×2",
    narrativeHint: "满装备，道具充足",
  },
  half_buy: {
    label: "半买",
    primary: ["MP9", "MAC-10", "UMP-45", "Galil", "FAMAS"],
    secondary: ["P250", "Tec-9", "五七"],
    armor: "半甲或无甲",
    utility: "烟雾弹 ×1、闪光弹 ×1",
    narrativeHint: "装备不齐，赌首杀翻经济",
  },
  eco: {
    label: "ECO 经济局",
    primary: ["Glock-18", "Tec-9", "P250", "双持贝瑞塔"],
    secondary: ["USP-S", "P2000"],
    armor: "无甲",
    utility: "无道具或仅烟雾弹 ×1",
    narrativeHint: "全员手枪，攒钱下局翻盘",
  },
  force_buy: {
    label: "强起",
    primary: ["AK-47", "M4A4", "MP9", "Galil"],
    secondary: ["P250", "Tec-9", "五七"],
    armor: "半甲或无甲",
    utility: "道具严重不足",
    narrativeHint: "孤注一掷，强起硬拼",
  },
};

// ──────────────────────────────────────────────
// 击杀高光模板（按选手特征）
// ──────────────────────────────────────────────

export interface KillHighlightTemplate {
  /** 触发该模板的选手特征 */
  trait: "aggressive_opener" | "awp_star" | "lurker" | "rifle_master" | "clutch_master" | "any";
  /** 击杀描述模板 */
  template: string;
  /** 配套动作描写 */
  action?: string;
}

export const killHighlights: KillHighlightTemplate[] = [
  // 火力型突破手（donk、NiKo 型）
  {
    trait: "aggressive_opener",
    template: "{player} 扛着 {weapon} 闯进 {site}，枪口横扫——{count} 个人影从烟雾里依次栽倒。",
    action: "扫射转移，三连杀",
  },
  {
    trait: "aggressive_opener",
    template: "{player} 在 {site} 第一时间 prefire 了角落。{opponent} 刚露头就被 AK 点穿头盔——首杀来得毫无悬念。",
    action: "prefire 首杀",
  },
  {
    trait: "aggressive_opener",
    template: "{player} 一个滑步出 {site}，{weapon} 的枪口火焰在烟雾边缘绽开。{opponent} 倒地的时候，手里还攥着没扔出去的闪光弹。",
    action: "出烟首杀",
  },

  // AWP 狙击手（m0NESY、ZywOo 型）
  {
    trait: "awp_star",
    template: "{player} 在 {site} 架了 {time} 秒。{opponent} 在烟雾散开的 0.3 秒间隙里露了半个身位——甩狙，命中。没有第二枪。",
    action: "烟雾散隙甩狙",
  },
  {
    trait: "awp_star",
    template: "{player} 的 AWP 在中路长廊架了一条线。{opponent} 想闪身试枪——开镜、击发、收镜，全程不到一秒。尸体顺着墙滑了下去。",
    action: "中路闪身狙",
  },
  {
    trait: "awp_star",
    template: "{player} 盲狙。是的，盲狙。{opponent} 贴脸冲进来的时候，{player} 没开镜——凭耳朵听脚步，凭手感扣扳机。一枪，{hp} 血带走。",
    action: "贴脸盲狙",
  },

  // 单摸绕后者（ropz、KSCERATO 型）
  {
    trait: "lurker",
    template: "{player} 不见了。从开局到现在，他没有出现在任何报点里。直到——{opponent} 在 {site} 蹲下架枪的时候，背后传来一声 Glock 的脆响。",
    action: "绕后偷背身",
  },
  {
    trait: "lurker",
    template: "{player} 从 {site} 的烟里钻出来，蹲走，没声音。{opponent} 还在架前方——{player} 的 USP 在他后脑勺上点了三下。三发，三中。",
    action: "出烟偷背身",
  },
  {
    trait: "lurker",
    template: "{player} 一直蹲在二楼没动。二十秒。三十秒。等所有人忘了这个位置的时候——他从背后摸下来，连收两人。{opponent} 的指挥在语音里吼：'他在哪？！他在哪？！'",
    action: "二楼伏击",
  },

  // 步枪大师（KSCERATO、ropz 型）
  {
    trait: "rifle_master",
    template: "{player} 在 {site} 的烟雾边缘架枪。{opponent} 穿烟的时候露了 0.5 秒——{weapon} 三发点射，第一发破甲，第二发爆头。烟雾散开的时候，地上多了一个人。",
    action: "穿烟点射",
  },
  {
    trait: "rifle_master",
    template: "{player} 的 {weapon} 在 {site} 完成了一次完美的 spray transfer——{count} 个人从同一个角度依次冲进来，他一个弹匣全部收下。弹匣空了。{count} 个人也空了。",
    action: "扫射转移连杀",
  },

  // 残局大师（ZywOo、sh1ro 型）
  {
    trait: "clutch_master",
    template: "1v{count}。{player} 蹲在 {site} 的死角里，C4 已经安放。{time} 秒。他没有动——等。等对手的脚步声从两侧汇过来。然后他从两个角度的交叉点里找到了一个 0.4 秒的空档——{weapon}，两枪，两人。还剩一个。还有一个。",
    action: "残局 1vN",
  },
];

// ──────────────────────────────────────────────
// 击杀高光模板 · 扩展（更多场景、更多武器细节）
// ──────────────────────────────────────────────

export const killHighlightsExtended: KillHighlightTemplate[] = [
  // ── 火力型突破手 · 扩展 ──
  {
    trait: "aggressive_opener",
    template: "{player} 的 {weapon} 在 {site} 出口急停开火——两发点射打在 {opponent} 的胸口，第三发修正到头部。{opponent} 倒地的时候，子弹壳还在地上弹。",
    action: "急停三连点",
  },
  {
    trait: "aggressive_opener",
    template: "{player} 跳出 {site} 的平台，空中开枪——AK 的第一发在空中打中了 {opponent} 的肩膀，落地的瞬间补了两发点射。跳枪。{opponent} 没反应过来就倒了。",
    action: "跳射首杀",
  },
  {
    trait: "aggressive_opener",
    template: "{player} 扛着 {weapon} 硬闯 {site}——三把枪架着他。他没退。一个弹匣三十发，扫完两个人，换弹，再扫第三个人。换弹的时候 {opponent} 还在愣——他没见过有人敢这么打。",
    action: "一打三硬冲",
  },
  {
    trait: "aggressive_opener",
    template: "{player} 在 {site} 的转角 prefire——枪口提前瞄在 {opponent} 会出现的位置。{opponent} 露头的瞬间，子弹已经在那里了。这不是反应，是预判。",
    action: "转角 prefire",
  },

  // ── AWP 狙击手 · 扩展 ──
  {
    trait: "awp_star",
    template: "{player} 的 AWP 在 {site} 架了一条穿烟线。烟雾里看不见人——但 {opponent} 的脚步声暴露了位置。{player} 对着声音开了一枪。穿烟。命中。{opponent} 倒地的时候，队友在语音里问：'他在哪？' 答：'不知道。他打的是声音。'",
    action: "穿烟听声狙",
  },
  {
    trait: "awp_star",
    template: "{player} 的 AWP 在 {site} 快速 peek——开镜、击发、回身，0.4 秒。{opponent} 的 AK 还没扣下扳机，{player} 已经回到掩体后了。每 0.4 秒一次。第三次 peek 的时候——{opponent} 的预瞄偏了一厘米。那一厘米就是一条命。",
    action: "快速 peek 狙",
  },
  {
    trait: "awp_star",
    template: "{player} noscope——没开镜。{opponent} 贴脸冲过来，距离不到两米。{player} 没按右键，直接扣了左键。AWP 的子弹在近距离不用瞄——只要方向对。方向对了。{opponent} 倒地的时候，{player} 才慢慢开了镜，看了一眼尸体。",
    action: "贴脸 noscope",
  },
  {
    trait: "awp_star",
    template: "{player} 的 AWP 在 {site} 架了六十秒。一分钟没动。{opponent} 以为他转点了——开始推进。推到 {site} 入口的时候，{player} 开镜了。一枪。{opponent} 倒地的时候才意识到——他一直都在。",
    action: "六十秒架枪",
  },
  {
    trait: "awp_star",
    template: "双杀。{player} 的 AWP 一枪穿过了 {opponent} 的身体——子弹没停，打中了后面的 {opponent_b}。两个人，一枪。{player} 看着击杀提示愣了一秒——他自己都没想到。",
    action: "一枪双杀",
  },

  // ── 单摸绕后者 · 扩展 ──
  {
    trait: "lurker",
    template: "{player} 蹲在 {site} 的暗角里没动。三十秒。四十秒。{opponent} 的队伍推进的时候，没人检查这个角落——太暗了，太偏了。{player} 等 {opponent} 全部走过去之后，从背后一个一个收。三杀。{opponent} 的指挥在语音里吼：'有人在后面！' 太晚了。",
    action: "暗角伏击三杀",
  },
  {
    trait: "lurker",
    template: "{player} 蹲走穿过 {site} 的烟雾——没声音。{opponent} 在烟雾另一侧架枪，以为安全。{player} 从烟里出来的时候，{opponent} 的背对着他。{weapon} 的两发点射——后脑勺，背身。",
    action: "穿烟偷背身",
  },
  {
    trait: "lurker",
    template: "{player} 从 {site} 的窗户翻进去——翻窗的时候没发出声音。{opponent} 在窗下架枪，盯着门口。{player} 从他头顶上翻过去，落地，转身——{weapon}。{opponent} 甚至没来得及转身。",
    action: "翻窗绕后",
  },
  {
    trait: "lurker",
    template: "{player} 在 {site} 的二楼蹲了整整一个回合。没人上来检查。回合结束前三十秒——他从二楼跳下来，落在 {opponent} 的指挥身后。{weapon} 一发。{opponent} 的指挥倒地的时候，语音里还在叫战术。他叫的战术，{player} 全听到了。",
    action: "二楼跳杀",
  },

  // ── 步枪大师 · 扩展 ──
  {
    trait: "rifle_master",
    template: "{player} 的 {weapon} 在 {site} 完成了一次 burst transfer——三连发，第一个人倒。枪口微调，三连发，第二个人倒。再微调，三连发，第三个人倒。九发子弹，三条命。精确得像在训练场。",
    action: "三连发转移",
  },
  {
    trait: "rifle_master",
    template: "{player} 在 {site} 的烟雾边缘架枪——{opponent} 想穿烟过去。{player} 没看烟——他看的是烟雾边缘的像素变化。{opponent} 的模型在烟边缘闪了 0.2 秒。{weapon} 三发点射。穿烟爆头。",
    action: "烟雾边缘点射",
  },
  {
    trait: "rifle_master",
    template: "{player} 在 {site} 完成了一次完美的 spray down——{opponent} 从三个角度冲进来，{player} 的 {weapon} 一个长 spray 扫过去，第一个人吃满了七发，第二个人吃满了五发，弹匣还剩三发——第三个人冲到面前的时候，{player} 切了手枪。一发。{opponent} 倒。",
    action: "长 spray + 手枪补刀",
  },
  {
    trait: "rifle_master",
    template: "{player} 的 {weapon} 在 {site} 架了一条火线——{opponent} 的队伍想从这条路回防。第一个人露头，倒。第二个人想救，倒。第三个人犹豫了——但 {player} 没犹豫。三连发，倒。一条火线，三条命。",
    action: "火线封锁三连杀",
  },

  // ── 残局大师 · 扩展 ──
  {
    trait: "clutch_master",
    template: "1v{count}。{player} 把 {weapon} 换了弹——满弹匣。他闭上眼听了三秒，确定了两个对手的位置。睁眼。第一个从左侧来——两发点射，倒。第二个从右侧来——他已经预瞄好了。两发点射，倒。残局。赢了。",
    action: "残局双杀",
  },
  {
    trait: "clutch_master",
    template: "1v3。{player} 蹲在 C4 旁边，{weapon} 架着 {site} 的两个入口。他没动——等。第一个对手冲进来，倒。第二个对手从另一侧绕来，倒。第三个对手想拆包——{player} 从暗处出来，{weapon} 一发。三杀。全场起立。",
    action: "守包 1v3",
  },
  {
    trait: "clutch_master",
    template: "1v{count}。{player} 没有枪——他只有一把捡来的 P250 和半甲。但他有信息——他听到了 {opponent} 的脚步声从 {site} 两个方向来。P250 的两发点射——穿头盔，倒。换角度，两发——倒。手枪翻盘。",
    action: "手枪残局翻盘",
  },
  {
    trait: "clutch_master",
    template: "1v2。C4 还有 {time} 秒。{player} 假拆——按了一下拆除键，松开。{opponent} 听到拆包声冲了过来——{player} 已经架在回防路线上。一发。还剩一个。再假拆。第二个也冲了。{player} 又是一发。两个都倒在回防路上。",
    action: "假拆诱杀",
  },

  // ── 通用高光 · 任何选手 ──
  {
    trait: "any",
    template: "{player} 的 {weapon} 在 {site} 打出了一个 no-scope + quick-switch 组合——没开镜开了一枪，切刀，切回枪，再开一枪。两枪，两个人。这种操作只在集锦里见过。",
    action: "盲狙+快切双杀",
  },
  {
    trait: "any",
    template: "{player} 在 {site} 完成了 ACE——五杀。第一个人从正面来，倒。第二个从侧面来，倒。第三个想跑，背身，倒。第四个回来救，倒。第五个——他蹲在角落里不敢动。{player} 找到了他。{weapon} 一发。五杀。全场疯了。",
    action: "ACE 五杀",
  },
  {
    trait: "any",
    template: "{player} 在 {site} 用 {weapon} 打出了 wallbang——穿墙。{opponent} 躲在墙后以为安全，{player} 凭脚步声判断了位置，对着墙开了一梭子。{opponent} 倒地的时候，墙上有五个弹孔。",
    action: "穿墙击杀",
  },
  {
    trait: "any",
    template: "{player} 在 {site} 用 {weapon} 打出了一个 jump-shot——跳起来的同时开枪。子弹在空中命中了 {opponent} 的头部。跳射爆头。这种操作有运气成分——但运气也是实力的一种。",
    action: "跳射爆头",
  },
  {
    trait: "any",
    template: "{player} 在 {site} 打出了一个三杀撤退——{count} 个人冲进来，{player} 边退边打。第一个在门口倒，第二个在走廊倒，第三个追到转角的时候——{player} 已经架好了。三杀。退得漂亮。",
    action: "撤退三杀",
  },
];

// 合并所有击杀高光
export const allKillHighlights: KillHighlightTemplate[] = [
  ...killHighlights,
  ...killHighlightsExtended,
];

// ──────────────────────────────────────────────
// 普通对枪击杀模板（非高光，日常交火描述）
//
// 与高光的区别：
//   - 高光：单兵多杀、残局翻盘、特殊操作（盲狙/跳射/穿墙）
//   - 普通：一换一、补枪、常规交火、经济局击杀
// ──────────────────────────────────────────────

export type KillQuality = "highlight" | "normal" | "trade" | "eco_kill";

export interface NormalKillTemplate {
  /** 击杀质量等级 */
  quality: KillQuality;
  /** 武器类型限制（空=任意） */
  weaponClass?: "rifle" | "awp" | "smg" | "pistol" | "any";
  /** 模板 */
  template: string;
  /** 配套动作 */
  action?: string;
}

export const normalKillTemplates: NormalKillTemplate[] = [
  // ── 步枪对枪 ──
  {
    quality: "normal",
    weaponClass: "rifle",
    template: "{player} 和 {opponent} 在 {site} 正面对枪。{player} 的 {weapon} 先开了两发——{opponent} 的甲吃了第一发，第二发打在腿上。{opponent} 还击，但子弹偏了。{player} 补了第三发——倒。",
    action: "正面对枪",
  },
  {
    quality: "normal",
    weaponClass: "rifle",
    template: "{player} 在 {site} 架枪，{opponent} 露头。两发点射，一发命中胸口，一发偏了。{opponent} 缩回去——但 {player} 的第三发跟上了，打在 {opponent} 缩回去的瞬间露出的手臂上。{opponent} 带着半血退了。",
    action: "架枪压制",
  },
  {
    quality: "normal",
    weaponClass: "rifle",
    template: "{player} 在 {site} 跟 {opponent} 互扫——两个人的 {weapon} 同时开火。{player} 的子弹更准——五发命中，{opponent} 的子弹只命中了三发。{opponent} 倒了，{player} 还剩 {hp} 血。",
    action: "互扫描杀",
  },
  {
    quality: "normal",
    weaponClass: "rifle",
    template: "{player} 在 {site} 的烟雾边缘 peek 了三次。前两次没开枪——只是看 {opponent} 的位置。第三次 peek 的时候，{opponent} 的预瞄偏了。{weapon} 两发——倒。",
    action: "多次 peek 击杀",
  },
  {
    quality: "normal",
    weaponClass: "rifle",
    template: "{player} 在 {site} 蹲下架枪——{opponent} 推进的时候没检查这个角度。{weapon} 三发点射，{opponent} 倒地。一个常规的架枪 kill，但角度选得好。",
    action: "非主流角度架枪",
  },

  // ── AWP 对枪 ──
  {
    quality: "normal",
    weaponClass: "awp",
    template: "{player} 的 AWP 在 {site} 架枪。{opponent} peek 了两次没开枪——第三次 peek 的时候露多了。{player} 开镜——一发。{opponent} 倒。",
    action: "架枪狙杀",
  },
  {
    quality: "normal",
    weaponClass: "awp",
    template: "{player} 的 AWP 在 {site} peek——{opponent} 的步枪在架着。{player} 开镜快了 0.1 秒——那 0.1 秒就是一条命。{opponent} 倒地的时候，{player} 已经缩回了掩体。",
    action: "peek 狙",
  },
  {
    quality: "normal",
    weaponClass: "awp",
    template: "{player} 的 AWP 没能先把前期压力打出来，{opponent} 还活着。{player} 切刀跑了，绕了半张图回来，再次架住回防路线。{opponent} 倒地的时候，{player} 的 AWP 还冒着烟。",
    action: "补枪狙杀",
  },

  // ── 冲锋枪/近距离 ──
  {
    quality: "normal",
    weaponClass: "smg",
    template: "{player} 的 {weapon} 在 {site} 近距离跟 {opponent} 对枪——冲锋枪的射速极快，三米内的对决几乎不靠瞄准。{player} 的子弹比 {opponent} 多命中了两发。{opponent} 倒了。",
    action: "近战冲锋枪",
  },
  {
    quality: "normal",
    weaponClass: "smg",
    template: "{player} 扛着 {weapon} 从 {site} 冲出来——{opponent} 还没来得及开镜。冲锋枪的弹匣在两秒内清空，{opponent} 吃了四发。倒。",
    action: "冲锋枪突脸",
  },

  // ── 手枪（ECO 局）──
  {
    quality: "eco_kill",
    weaponClass: "pistol",
    template: "{player} 的 {weapon} 在 {site} 近距离打中了 {opponent} 的头盔——手枪爆头。{opponent} 有甲，但手枪贴脸的爆头伤害够了。一枪。{opponent} 倒地的时候不敢相信——他手里是 AK。",
    action: "手枪爆头",
  },
  {
    quality: "eco_kill",
    weaponClass: "pistol",
    template: "{player} 的 Glock-18 在 {site} 切了三连发模式——三发全打在 {opponent} 的背上。{opponent} 转身的时候已经倒了。背身三连。",
    action: "Glock 三连背身",
  },
  {
    quality: "eco_kill",
    weaponClass: "pistol",
    template: "{player} 的 P250 在 {site} 蹲角落——{opponent} 走过的时候没检查。P250 两发点射——穿头盔，倒。$300 的手枪打穿了 $1000 的甲。",
    action: "P250 穿甲",
  },
  {
    quality: "eco_kill",
    weaponClass: "pistol",
    template: "{player} 的 Tec-9 在 {site} 跟 {opponent} 的步枪对枪——手枪不该赢这种对决。但 {player} 先开了枪，三发全中。{opponent} 的 AK 还没扣下扳机。手枪胜步枪——ECO 局的奇迹。",
    action: "手枪胜步枪",
  },
  {
    quality: "eco_kill",
    weaponClass: "pistol",
    template: "{player} 的双持贝瑞塔在 {site} 近距离扫了 {opponent} 一脸——双持的射速是手枪里最快的。{opponent} 的脸吃了八发。倒。",
    action: "双持近战",
  },

  // ── 补枪 / 交换击杀 ──
  {
    quality: "trade",
    weaponClass: "any",
    template: "{player_a} 倒了——{opponent} 杀了他。但 {player_b} 紧跟着补了枪。{weapon} 两发——{opponent} 倒地。一换一。{player_b} 没救回 {player_a}，但至少没让 {opponent} 活着走。",
    action: "补枪交换",
  },
  {
    quality: "trade",
    weaponClass: "any",
    template: "{player} 在 {site} 跟 {opponent} 对枪——{player} 先中了两发，{opponent} 也中了两发。两个人同时倒。一换一。观众席发出'哦——'的声音，然后是掌声。",
    action: "同时倒地",
  },
  {
    quality: "trade",
    weaponClass: "any",
    template: "{player} 杀了 {opponent_a}——但 {opponent_b} 立刻补了枪。{player} 倒地。一换一。{rival_team} 的补枪比 {team} 快了一秒——那一秒就是回合的走向。",
    action: "被补枪",
  },
  {
    quality: "trade",
    weaponClass: "any",
    template: "{player} 在 {site} 打中了 {opponent}——{opponent} 没死，缩回了掩体。{player} 没追——他知道后面还有人架着。两秒后，{opponent} 的队友补掉了 {player}。信息交换。{team} 知道了 {site} 有两个人。",
    action: "信息交换",
  },

  // ── 残血击杀 ──
  {
    quality: "normal",
    weaponClass: "any",
    template: "{player} 带着 {hp} 血在 {site} 跟 {opponent} 对枪——他知道自己一发就死。但他先开了枪。{weapon} 一发——{opponent} 倒。{player} 活了下来，带着 {hp} 血。这种击杀靠的不是枪法，是胆子。",
    action: "残血反杀",
  },
  {
    quality: "normal",
    weaponClass: "any",
    template: "{player} 在 {site} 打掉了 {opponent}——但 {opponent} 的队友紧跟着补了枪。{player} 倒了。但他死之前把 {opponent} 打到了 {hp} 血——下一波交火，{opponent} 带着这点血就是活靶子。",
    action: "残血标记",
  },

  // ── 防守击杀 ──
  {
    quality: "normal",
    weaponClass: "rifle",
    template: "{player} 在 {site} 的交叉火力位架枪——{opponent} 从另一个方向推进。{player} 和队友同时开火。{opponent} 吃了两把枪的子弹，倒了。交叉火力的意义就在于——你架的角度，对手没法同时对付两个方向。",
    action: "交叉火力",
  },
  {
    quality: "normal",
    weaponClass: "rifle",
    template: "{player} 在 {site} 回防——{opponent} 已经下了包，以为安全。{player} 从回防路线摸过来，{weapon} 两发——{opponent} 倒地。回防 timing 刚好。",
    action: "回防击杀",
  },
  {
    quality: "normal",
    weaponClass: "rifle",
    template: "{player} 在 {site} retake——三个人同时冲进包点。{opponent} 架着枪，打掉了第一个。第二个——{player}——从另一个角度露头。{weapon} 三发。{opponent} 倒。retake 成功。",
    action: "retake 击杀",
  },
];

/** 所有击杀模板（高光+普通）合并 */
export const allKillTemplates = {
  highlights: allKillHighlights,
  normal: normalKillTemplates,
};

// ──────────────────────────────────────────────
// 道具使用模板 · 扩展
// ──────────────────────────────────────────────

export interface UtilityTemplate {
  type: "smoke" | "flash" | "molotov" | "he_grenade" | "decoy";
  template: string;
  effect: string;
}

export const utilityTemplates: UtilityTemplate[] = [
  {
    type: "smoke",
    template: "{player} 在 {site} 丢出一颗封门烟，整条枪线被切断。{rival_team} 想强穿，但烟后只剩盲猜。",
    effect: "封锁视线",
  },
  {
    type: "flash",
    template: "{player} 的反清闪在 {site} 头顶炸开，白得 {opponent} 根本抬不起准星。{team} 借这颗闪硬把入口抢了下来。",
    effect: "白到失位",
  },
  {
    type: "molotov",
    template: "{player} 把燃烧瓶灌进 {site} 死角，火焰逼着 {opponent} 走位，原本稳的架点一下就散了。",
    effect: "烧出身位",
  },
  {
    type: "he_grenade",
    template: "{player} 的高爆在 {site} 反弹进包点，炸得 {opponent} 只剩 {hp} 血，后续一碰就碎。",
    effect: "高爆压残",
  },
  {
    type: "decoy",
    template: "{player} 在 {site} 外场丢了诱饵弹，枪声一响，{rival_team} 的回防先被调走了一拍。",
    effect: "诱饵拉扯",
  },
];

export const utilityTemplatesExtended: UtilityTemplate[] = [
  // ── 烟雾弹 · 扩展 ──
  {
    type: "smoke",
    template: "{player} 在 {site} 的入口扔了一颗 one-way smoke——他看得到外面，外面看不到他。{opponent} 推进的时候，只看到一团灰。{player} 的 {weapon} 从烟雾里喷出火光——{opponent} 倒地的时候还没找到子弹从哪来。",
    effect: "单向烟击杀",
  },
  {
    type: "smoke",
    template: "{player} 的烟雾弹精准落在 {site} 的连接处——这个烟封住了对手的回防路线。{time} 秒内，{rival_team} 的支援没法过来。{team} 有足够的时间下包、架枪、布置防守。",
    effect: "封回防 {time} 秒",
  },
  {
    type: "smoke",
    template: "{player} 扔了一颗假烟——烟雾弹落在了 {site} 的入口，但 {team} 打的是另一侧。{rival_team} 的指挥看到烟，立刻调人防守这个方向——结果 {team} 从另一个点冲了进去。一颗烟骗了两个人。",
    effect: "假烟骗防",
  },
  {
    type: "smoke",
    template: "{player} 在 {site} 门口的烟雾刚散一半——{rival_team} 以为可以推了。但 {player} 紧跟着补了第二颗烟。{time} 秒的视野真空。{rival_team} 的进攻节奏彻底乱了。",
    effect: "补烟续封",
  },

  // ── 闪光弹 · 扩展 ──
  {
    type: "flashbang",
    template: "{player} 的闪光弹从 {site} 的墙上弹了一个角度——pop-flash。{opponent} 躲在掩体后以为安全，但闪光从墙角反弹过来。视角全白。等他恢复——{player} 已经站在他面前了。",
    effect: "反弹闪致盲",
  },
  {
    type: "flashbang",
    template: "{player} 从 {site} 高处扔下闪光——{opponent} 抬头看的瞬间，全白。{player} 从高处跳下来，{weapon} 在落地的瞬间开火——{opponent} 倒地的时候还在眨眼。",
    effect: "高抛闪+跳杀",
  },
  {
    type: "flashbang",
    template: "{player} 扔了双闪——两颗闪光弹先后落进 {site}。{opponent} 躲了第一颗，转头就被第二颗闪了。双闪的 timing 几乎没法躲——{opponent} 的视角白了两秒。两秒在 CS 里就是一条命。",
    effect: "双闪连致盲",
  },
  {
    type: "flashbang",
    template: "{player} 的闪光弹没扔好——撞墙弹回来了，闪到了自己。{player} 的视角全白。'操。' 他在语音里说。{opponent} 趁机冲了进来。一颗闪光弹，闪了两个人——包括自己。",
    effect: "自闪失误",
  },

  // ── 燃烧瓶 · 扩展 ──
  {
    type: "molotov",
    template: "{player} 的燃烧瓶砸在 {site} 的包点上——C4 旁边。火焰吞没了拆包区域。{opponent} 没法拆包——只能等火灭。{time} 秒的拖延，C4 的倒计时走到了零。赢了。",
    effect: "封包拖延 {time} 秒",
  },
  {
    type: "molotov",
    template: "{player} 把燃烧瓶扔在 {site} 的暗角——那里可能蹲着人。火焰照亮了角落——{opponent} 的身影在火光里暴露了。他被迫移动，{player} 的 {weapon} 已经架在他的走位路线上。",
    effect: "照亮+逼出",
  },
  {
    type: "molotov",
    template: "{player} 的燃烧瓶在 {site} 入口烧了 {time} 秒——{rival_team} 的进攻被迫绕路。绕路多花了八秒。八秒在 CS 里足够 {team} 完成回防和重新布防。",
    effect: "逼迫绕路",
  },
  {
    type: "molotov",
    template: "{player} 把燃烧瓶扔在了 {site} 的楼梯上——楼梯是 {rival_team} 唯一的进攻路线。火焰封住了整条楼梯。{rival_team} 的五个人挤在楼梯口进退不得，被 {team} 的交叉火力收了两个。",
    effect: "封楼梯 {time} 秒",
  },

  // ── 高爆手雷 · 扩展 ──
  {
    type: "he_grenade",
    template: "{player} 的手雷从 {site} 的墙上弹了一个角度，落进了 {opponent} 蹲的角落。爆炸——{opponent} 的血条从 100 跳到 17。大残。他没死，但下一发子弹就够收他了。",
    effect: "反弹雷大残 83 血",
  },
  {
    type: "he_grenade",
    template: "{player} 的手雷精准落在 {site} 的包点——三个 {rival_team} 的选手挤在一起。爆炸的瞬间——一个满血变半血，一个半血变残血，一个直接倒地。一颗雷，三个人受影响。",
    effect: "群伤：1 杀 + 2 残",
  },
  {
    type: "he_grenade",
    template: "{player} 的手雷配合 {player_b} 的燃烧瓶——燃烧瓶先逼出了 {opponent}，手雷在 {opponent} 走位路线上等着。{opponent} 刚跑出火，手雷就炸了。{hp} 血。道具连招。",
    effect: "火+雷连招",
  },
  {
    type: "he_grenade",
    template: "{player} 的手雷没扔准——落在了空地上。没炸到人。但爆炸的声音掩盖了 {team} 的脚步声。{rival_team} 没听到 {team} 从另一侧推进的声音。声东击西。",
    effect: "声东击西",
  },

  // ── 诱饵弹 ──
  {
    type: "decoy",
    template: "{player} 在 {site} 的另一侧扔了一颗诱饵弹。诱饵开始模拟开枪声——'啪啪啪'。{rival_team} 的指挥立刻调人防守那个方向。而 {team} 的真正进攻，在另一侧。",
    effect: "诱饵骗防",
  },
  {
    type: "decoy",
    template: "{player} 的诱饵弹扔在 {site} 的角落——它模拟的枪声让 {opponent} 以为那里有人。{opponent} 犹豫了五秒才推进。五秒——足够 {team} 完成回防。",
    effect: "拖延 5 秒",
  },
];

/** 所有道具模板合并 */
export const allUtilityTemplates: UtilityTemplate[] = [
  ...utilityTemplates,
  ...utilityTemplatesExtended,
];

// ──────────────────────────────────────────────
// 残局氛围模板——烘托 1vN 的紧张感
// ──────────────────────────────────────────────

export interface ClutchAtmosphereTemplate {
  /** 触发时机：残局开始 / 残局中段 / 残局结束 */
  stage: "clutch_start" | "clutch_mid" | "clutch_end";
  /** 人数劣势 */
  disadvantage: "1v2" | "1v3" | "1v4" | "1v5" | "any";
  /** 模板 */
  template: string;
  /** 氛围效果描述 */
  mood: string;
}

export const clutchAtmosphereTemplates: ClutchAtmosphereTemplate[] = [
  // ── 残局开始：建立紧张感 ──
  {
    stage: "clutch_start",
    disadvantage: "1v2",
    template:
      "还剩 {player} 一个人。\n\n" +
      "场馆里一万两千人——刚才还在喊——突然安静了。那种安静不是没声音，是所有人同时屏住呼吸的安静。你能听到空调的嗡嗡声，能听到 {player} 鼠标的点击声，能听到他椅子的吱呀声。\n\n" +
      "1v2。C4 已经安放。{time} 秒。",
    mood: "寂静中的紧张",
  },
  {
    stage: "clutch_start",
    disadvantage: "1v3",
    template:
      "1v3。\n\n" +
      "{player} 蹲在 {site} 的死角里，没动。耳机里传来队友的声音——'你能赢'——但他知道队友说这话的时候，自己都不信。\n\n" +
      "三个脚步声，从两个方向逼近。{time} 秒。C4 在滴答。观众席的灯光打在屏幕上，{player} 的脸被映成蓝色。他的瞳孔在收缩。\n\n" +
      "他开始数脚步声。一个。两个。第三个在哪？",
    mood: "数脚步的窒息",
  },
  {
    stage: "clutch_start",
    disadvantage: "1v4",
    template:
      "1v4。\n\n" +
      "解说员的声音低了下去：'……还剩 {player}。1v4。这个残局……' 他没说完。因为他知道——这种残局，说了也是白说。\n\n" +
      "{player} 把鼠标线拽了一下，调整了握姿。他的手是稳的——但屏幕回放里，你能看到他的喉结动了一下。吞咽。这是紧张的唯一证据。\n\n" +
      "四个对手。一把 {weapon}。{time} 秒。",
    mood: "不可能的数学",
  },
  {
    stage: "clutch_start",
    disadvantage: "1v5",
    template:
      "1v5。\n\n" +
      "全场站了起来。不是为了欢呼——是因为坐着看不下去了。一万两千人同时站起来，椅子的翻折声响成一片。\n\n" +
      "{player} 一个人，蹲在 {site} 的角落里。对面五个人。C4 还没安放——他得先下包，再打五个。\n\n" +
      "解说员说了一句：'这不是残局。这是传说。如果他能赢——'\n\n" +
      "他没说完。因为如果 {player} 真的赢了，不需要解说。",
    mood: "传说的前奏",
  },

  // ── 残局中段：过程拉锯 ──
  {
    stage: "clutch_mid",
    disadvantage: "any",
    template:
      "{player} 关了脚步。整个世界只剩声音——C4 的滴答声，对手的鞋底踩在地板上的沙沙声，自己心脏的砰砰声。\n\n" +
      "第一个对手从 {site} 的左侧露头——{weapon} 两发，倒。一换零。还剩 {count} 个。\n\n" +
      "观众席发出一声短促的'啊——'，然后又安静了。因为还没结束。",
    mood: "第一杀后的短暂释放",
  },
  {
    stage: "clutch_mid",
    disadvantage: "any",
    template:
      "{player} 换了弹——满弹匣。但他没动。他在等。\n\n" +
      "等什么？等对手犯错误。等对手急。等对手以为他会动的时候，他不动；等对手以为他不动的时候，他动。\n\n" +
      "三秒。五秒。八秒。{time} 秒。C4 的倒计时在走。对手的脚步声越来越近。\n\n" +
      "{player} 的手指在扳机上——没扣。还没扣。还没。",
    mood: "等待的折磨",
  },
  {
    stage: "clutch_mid",
    disadvantage: "any",
    template:
      "第二个对手冲进来了——{weapon} 三发，倒。2v{count} 变成了 1v{count_b}。\n\n" +
      "但 {player} 的位置暴露了。第三个对手正在从另一侧包抄。{player} 知道——他知道因为他在小地图上看到了队友的死亡视角。他知道第三个在哪。\n\n" +
      "但他没时间转点。他只能赌——赌第三个会从哪个角度来。",
    mood: "暴露后的赌博",
  },
  {
    stage: "clutch_mid",
    disadvantage: "any",
    template:
      "C4 的倒计时：{time} 秒。\n\n" +
      "{player} 的手在抖——不是紧张，是肾上腺素。他的鼠标在垫子上滑了一下，微调了预瞄角度。0.3 度。这 0.3 度可能是生与死的距离。\n\n" +
      "对手的脚步声停了。他也停了。两个人都在等——等谁先动。先动的人死。",
    mood: "对峙的静止",
  },

  // ── 残局结束：胜负落定 ──
  {
    stage: "clutch_end",
    disadvantage: "any",
    template:
      "最后一发。\n\n" +
      "{player} 的弹匣里只剩一颗子弹。{weapon} 的枪口对着 {site} 的入口。{opponent} 的脚步声——近了。更近了。\n\n" +
      "露头。\n\n" +
      "开枪。\n\n" +
      "倒。\n\n" +
      "全场——炸了。一万两千人同时发出声音，那种声音不是欢呼，是某种从胸腔里涌出来的东西。{player} 站起来的时候，手还在抖。他赢了。他真的赢了。",
    mood: "最后一发的释放",
  },
  {
    stage: "clutch_end",
    disadvantage: "any",
    template:
      "C4 爆了。\n\n" +
      "不是拆掉的——是时间到了。{player} 蹲在包旁边，{weapon} 的弹匣空了，手枪也没子弹了。他做了他能做的一切。但时间——时间不等任何人。\n\n" +
      "他输了。但观众席的掌声——比赢了一些回合还响。因为所有人都知道，他差一点。差那么一点。",
    mood: "时间耗尽的遗憾",
  },
];

// ──────────────────────────────────────────────
// 拆包失败/炸弹爆炸的遗憾模板
// ──────────────────────────────────────────────

export interface BombFailureTemplate {
  /** 失败类型 */
  type: "defuse_failed" | "time_ran_out" | "killed_on_defuse" | "fake_defuse_caught";
  /** 模板 */
  template: string;
  /** 情感基调 */
  tone: string;
}

export const bombFailureTemplates: BombFailureTemplate[] = [
  {
    type: "defuse_failed",
    template:
      "{player} 蹲在 C4 旁边，按下了拆除键。拆除进度条开始走——10%、20%、30%……\n\n" +
      "但进度条停了。他的拆包器——没电了？不，是时间不够了。C4 的倒计时走到了零。\n\n" +
      "爆炸。{player} 的屏幕变成了灰白色。'阵亡'两个字浮在画面中央。\n\n" +
      "他蹲在椅子上，双手捂住脸。差 0.5 秒。0.5 秒。",
    tone: "差之毫厘的痛",
  },
  {
    type: "defuse_failed",
    template:
      "{player} 开始拆包。进度条走了 40%——但他听到了脚步声。对手回来了。\n\n" +
      "他有两个选择：继续拆，赌能在被打死之前拆完；或者松手，先杀对手再拆。\n\n" +
      "他选了继续。进度条走 60%、70%——枪声响了。{player} 倒在 C4 旁边，拆除进度条停在了 73%。\n\n" +
      "73%。差 27%。一颗子弹的距离。",
    tone: "73% 的遗憾",
  },
  {
    type: "time_ran_out",
    template:
      "C4 的倒计时：3……2……1……\n\n" +
      "{player} 还在 {site} 的另一侧。他没来得及赶到包点。他跑了——他拼了命跑了——但 CS 里有些距离，跑就是跑不到。\n\n" +
      "爆炸。屏幕震了一下。'回合失败'。\n\n" +
      "{player} 把鼠标往桌上一放。没摔——是那种没力气握的放。他盯着屏幕看了五秒。然后慢慢摘下了耳机。",
    tone: "跑不到的距离",
  },
  {
    type: "time_ran_out",
    template:
      "C4 爆了。\n\n" +
      "不是没人拆——是没人能拆。{team} 的最后一个人在三十秒前就倒了。剩下的二十秒，是 C4 独自倒计时的时间。\n\n" +
      "二十秒。观众席里有人开始叹气。有人开始离场。有人举起手机拍了张屏幕——记录这个失败的瞬间。\n\n" +
      "爆炸的时候，场馆里没有声音。沉默比嘘声更重。",
    tone: "无能为力的二十秒",
  },
  {
    type: "killed_on_defuse",
    template:
      "{player} 在拆包。进度条走了 50%——\n\n" +
      "枪声。从背后传来。{opponent} 从 {site} 的暗角摸出来，{weapon} 一发——{player} 倒在 C4 旁边。拆除进度条消失。\n\n" +
      "他不知道 {opponent} 在那里。没人知道。{opponent} 蹲了一整回合，就等这一刻——等 {player} 开始拆包，露出破绽的那一刻。\n\n" +
      "{player} 的屏幕变灰。他闭上眼。'操。' 只说了一个字。",
    tone: "背后的枪声",
  },
  {
    type: "fake_defuse_caught",
    template:
      "{player} 假拆——按了一下拆除键，松开，想骗 {opponent} 回防。但 {opponent} 没回防。\n\n" +
      "{opponent} 知道这是假的。因为 {player} 上一回合也假拆过。同一个套路用两次——第二次就是陷阱的反面。\n\n" +
      "{opponent} 从暗角出来，{weapon} 两发。{player} 倒地。假拆变成了真死。\n\n" +
      "聪明反被聪明误。{player} 应该知道——对手也会学习。",
    tone: "聪明反被聪明误",
  },
];

// ──────────────────────────────────────────────
// 拖时间战术模板
// ──────────────────────────────────────────────

export interface TimeWasteTemplate {
  /** 拖时间方式 */
  method: "save_weapons" | "hide_and_wait" | "utility_stall" | "rotate_fake" | "bait_defuse";
  /** 模板 */
  template: string;
  /** 战术效果 */
  effect: string;
}

export const timeWasteTemplates: TimeWasteTemplate[] = [
  {
    method: "save_weapons",
    template:
      "{player} 把 {weapon} 塞进 {site} 的墙角，蹲下，缩进死角。\n\n" +
      "这回合不打了。保枪。{team} 的经济已经见底——如果这把枪也丢了，下把还是 ECO。保住这把 AK，下把就能少花 $2700。\n\n" +
      "C4 没安放。回合时间在走。{rival_team} 搜了一整张图，最后在 {site} 的角落找到了蹲着的 {player}——但那时候回合时间已经到了。\n\n" +
      "回合输了。但枪保住了。这是 CS 里最孤独的战术——一个人蹲在角落里，听着对手的脚步声越来越近，祈祷时间走得快一点。",
    effect: "保枪成功 · 下回合经济 +$2700",
  },
  {
    method: "hide_and_wait",
    template:
      "{player} 蹲在 {site} 的二楼。没动。没开枪。没扔道具。\n\n" +
      "一分钟。{rival_team} 的进攻推进到了 {site} 门口——但他们不知道二楼有人。他们开始扔道具、架枪、准备进攻。\n\n" +
      "{player} 在等。等他们把注意力全放在门口的时候——从背后跳下去。\n\n" +
      "这是拖时间战术的核心：不是不打，是等最好的时机打。等的越久，对手越焦躁，越容易犯错。",
    effect: "隐藏位置 · 等待最佳出击时机",
  },
  {
    method: "utility_stall",
    template:
      "{team} 在 {site} 门口扔了三颗烟雾弹、两颗燃烧瓶、一颗闪光。\n\n" +
      "不是为了进攻——是为了拖延。每颗烟雾弹封 18 秒，每颗燃烧瓶烧 7 秒。三颗烟加两颗火——{time} 秒的视野真空。\n\n" +
      "{rival_team} 的进攻被堵在路口 {time} 秒。等烟雾散了、火焰灭了——回合时间只剩 15 秒了。他们被迫rush——撞进了 {team} 架好的交叉火力。\n\n" +
      "道具拖时间。这是 CS 里最优雅的防守——不用开一枪，让时间替你赢。",
    effect: "道具拖延 {time} 秒 · 逼迫对手 rush",
  },
  {
    method: "rotate_fake",
    template:
      "{team} 在 A 点扔了四颗道具，制造出五人强攻的假象。{rival_team} 的指挥立刻叫全队回防 A 点。\n\n" +
      "但 {team} 没打 A。他们在 B 点——慢悠悠地控图、架枪、扔道具。{rival_team} 的五个人挤在 A 点等了三十秒，才意识到被骗了。\n\n" +
      "等他们转点到 B——回合时间只剩十秒了。来不及了。\n\n" +
      "假转点拖时间。让对手在错误的位置浪费时间。",
    effect: "假转点 · 对手浪费 30 秒",
  },
  {
    method: "bait_defuse",
    template:
      "C4 已经安放。{team} 还剩两个人，{rival_team} 还剩三个。\n\n" +
      "{player_a} 蹲在 C4 旁边，按了一下拆除键——滴答声停了。{rival_team} 的三个人立刻从三个方向冲过来回防。\n\n" +
      "但 {player_a} 松手了。他没真拆。他蹲回掩体——而 {player_b} 已经架在了回防路线上。\n\n" +
      "第一个回防的对手冲进 {player_b} 的枪口——倒。第二个——倒。第三个犹豫了，但 C4 的时间不够了。\n\n" +
      "假拆诱杀。用拆包声当诱饵，让对手主动送上门。",
    effect: "假拆诱杀 · 击杀 2 · C4 爆炸获胜",
  },
];

// ──────────────────────────────────────────────
// 强起局专属描述模板
// ──────────────────────────────────────────────

export interface ForceBuyNarrativeTemplate {
  /** 强起局的情绪基调 */
  mood: "desperate" | "gamble" | "nothing_to_lose" | "last_stand";
  /** 模板 */
  template: string;
  /** 配套数值提示 */
  effect?: string;
}

export const forceBuyNarratives: ForceBuyNarrativeTemplate[] = [
  {
    mood: "desperate",
    template:
      "0-2 落后。经济见底。如果再 ECO——下把还是没钱。下下把还是 ECO。这是一个死亡螺旋。\n\n" +
      "{team} 的队长在语音里问：'强起吗？' 他的声音里有一种东西——不是恐惧，是那种'我们没退路了'的决绝。\n\n" +
      "你说：'强起。'\n\n" +
      "{player_a} 扛了 AK——但没甲。{player_b} 拿了 M4——半甲。{player_c} 起了鸟狙——SSG08，$1700，便宜，但爆头就是爆头。{player_d} 和 {player_e} 是 P250 加 Tec-9，连步枪都没有。\n\n" +
      "道具？一颗烟雾弹。没了。\n\n" +
      "这是孤注一掷。赢了——经济翻转，气势翻转，比赛翻转。输了——0-3，gg。",
    effect: "强起 · 经济 -80% · 道具 1/5",
  },
  {
    mood: "gamble",
    template:
      "强起局。{team} 的五个人站在出生点，手里的装备乱七八糟——两把步枪没甲，一把鸟狙，两把手枪。\n\n" +
      "{player_c} 看了看自己的 SSG08，笑了：'鸟狙。$1700。如果爆头了，跟 AWP 一个效果。'\n\n" +
      "{player_a} 没笑。他扛着没甲的 AK，知道一发就死。但他说：'那就别被打中。'\n\n" +
      "强起局的哲学很简单——要么你先杀他们，要么他们先杀你。没有中间地带。",
    effect: "强起 · 火力 +2 · 装备 -3 · 容错 0",
  },
  {
    mood: "nothing_to_lose",
    template:
      "已经 0-2 了。再输一局——0-3，比赛基本结束。\n\n" +
      "{team} 的五个人反而松了。不是放弃——是那种'已经没什么可失去的了'的轻松。{player_e} 在语音里说：'怕什么？大不了 0-3 回家。'\n\n" +
      "这种轻松反而让他们的枪法更准了。没有压力的枪——打得最准。\n\n" +
      "强起局。没甲。没道具。没退路。但有一样东西——豁出去了的胆子。",
    effect: "强起 · 士气 +3（破釜沉舟）· 纪律 -2",
  },
  {
    mood: "last_stand",
    template:
      "2-2。赛点。最后一局。\n\n" +
      "{team} 的经济——刚好够强起。不够全买。如果这局输了，比赛输了，经济也没了——什么都不用买了。\n\n" +
      "{player_a} 扛着 AK，没甲。他知道——这把 AK 可能是他今天最后一把枪。他握紧了鼠标。\n\n" +
      "{player_c} 的鸟狙在手里发沉。$1700 的枪，$10000 的压力。他深吸一口气。\n\n" +
      "{team} 的五个人在出生点对视了一眼。没说话。不需要说话。\n\n" +
      "这局——赢了继续，输了回家。",
    effect: "赛点强起 · momentum +4 · 压力 +5",
  },
];

// ──────────────────────────────────────────────
// 选手状态转折模板——先低迷后奋起
// ──────────────────────────────────────────────

export interface FormShiftTemplate {
  /** 转折类型 */
  type: "slump_to_surge" | "tilt_to_calm" | "invisible_to_hero" | "questioned_to_proven";
  /** 转折前描述 */
  before: string;
  /** 转折瞬间 */
  turningPoint: string;
  /** 转折后描述 */
  after: string;
  /** 数值变化 */
  effect?: string;
}

export const formShiftTemplates: FormShiftTemplate[] = [
  {
    type: "slump_to_surge",
    before:
      "前三局，{player} 的 KD 是 0.3。对枪输了四次，残局输了一次，甚至有一个 ECO 局被手枪爆头。\n\n" +
      "解说员在说：'{player} 今天状态不在。' 论坛里开始刷：'{player} 过气了。' 他的队友在语音里没提——但沉默比话语更重。\n\n" +
      "第四局开始前，{player} 把鼠标线拔了重插。调整了 DPI。喝了口水。然后把水杯放到了够不到的地方——'等打完再喝。'",
    turningPoint:
      "第四局。{player} 扛着 {weapon} 闯进了 {site}。\n\n" +
      "他没犹豫。前三局他犹豫了——该开的枪没开，该推的位没推。这一次，他没想。他只是——开枪。\n\n" +
      "{weapon} 的三连发在 {site} 出口炸开。{opponent_a} 倒。{opponent_b} 倒。{opponent_c} 想跑——{player} 已经追到了他背后。\n\n" +
      "三杀。前三局加起来才两杀的 {player}——这一局三杀。",
    after:
      "场馆里有人喊他的名字。一开始是零星的，然后变成了一个声浪。\n\n" +
      "{player} 没有站起来，没有咆哮，没有摔鼠标。他只是——把水杯拿回来了。喝了一口。\n\n" +
      "然后他戴上耳机，说了两个字：'继续。'\n\n" +
      "低迷结束了。不是因为天赋回来了——是因为他不再怀疑天赋还在不在。",
    effect: "状态翻转 · 火力 +6 · 士气 +4 · momentum +3",
  },
  {
    type: "tilt_to_calm",
    before:
      "{player} 在摔鼠标。不是比喻——是真摔。第三局的残局他输了，1v2 变成了 1v3 的失败。他把手里的鼠标往桌上一砸，耳机歪了，水杯翻了。\n\n" +
      "队长看了他一眼，没说话。教练在语音里说：'{player}，深呼吸。' 他没回应。\n\n" +
      "他 tilt 了。CS 里最可怕的三个字母——tilt。心态崩了。枪法再好，心态一崩，什么都没了。",
    turningPoint:
      "第四局开始前，{player} 站起来了。他走到训练室——不，赛场——的角落，背对所有人，站了三十秒。\n\n" +
      "没有人去打扰他。三十秒后他回来，把鼠标摆正，把水杯扶起来，把耳机戴好。\n\n" +
      "他跟队长说了一句：'叫战术吧。我听你的。'\n\n" +
      "这句话比任何道歉都管用。他不是不生气了——他是把气放下了。",
    after:
      "第四局。{player} 没有强行突破，没有赌英雄枪，没有单摸送死。他打的是最标准的默认控图——补枪、架位、跟队伍走。\n\n" +
      "他的 KD 不高——但这局他没死一次。零死亡。不是因为没机会死——是因为他选择了不送。\n\n" +
      "tilt 结束了。不是因为他赢了——是因为他不再追着赢。",
    effect: "心态平复 · 纪律 +5 · 凝聚力 +3 · 火力 +2",
  },
  {
    type: "invisible_to_hero",
    before:
      "前三局，{player} 像隐形人一样。不是没打——是打了没效果。补枪慢了半秒，架枪角度差了一步，道具扔歪了两米。\n\n" +
      "解说员甚至没提到他的名字。集锦里没有他。数据栏里他的击杀数是个位数。\n\n" +
      "{player} 在语音里报点——但没人在听。不是不尊重——是他的信息最近都没用。他变成了那个'在场上但等于不在'的人。",
    turningPoint:
      "第四局。1v3 的残局。\n\n" +
      "队友全倒了。{player} 是最后一个人——所有人以为这局结束了。解说员已经开始分析上一局的失误。\n\n" +
      "然后——{player} 蹲在 {site} 的死角里，{weapon} 架着入口。第一个对手冲进来——倒。第二个从侧面来——倒。第三个想拆包——{player} 假拆诱杀，倒。\n\n" +
      "1v3。翻盘。\n\n" +
      "解说员愣了两秒才反应过来：'……{player}！{player} 赢了 1v3！这个前三局隐形的人——'",
    after:
      "场馆里炸了。队友从隔音棚里冲出来抱住他——{player} 没动。他还在看着屏幕。\n\n" +
      "然后他笑了。不是那种'我做到了'的笑——是那种'原来我还能做到'的笑。\n\n" +
      "隐形人不是消失了。他只是在等一个属于他的回合。",
    effect: "状态爆发 · 火力 +5 · 士气 +6 · momentum +4",
  },
  {
    type: "questioned_to_proven",
    before:
      "休赛期签下 {player} 的时候，论坛里骂声一片。'过气了'、'不值这个价'、'还不如留青训的小孩'。\n\n" +
      "前三局，{player} 的数据似乎在证明那些骂声是对的。KD 0.5，对枪输多赢少，有一个回合甚至被新人 {rookie_name} 替补了。\n\n" +
      "他自己没看论坛——但他知道。每次失误，他都能感觉到背后有人摇头。",
    turningPoint:
      "第四局。赛点。2-2。\n\n" +
      "{player} 扛着 {weapon} 站在 {site} 的入口。队长在语音里说：'{player}，这把你来。'\n\n" +
      "所有人愣了——前三局状态最差的人，赛点局让他打核心位？\n\n" +
      "但 {player} 没问为什么。他说：'收到。'\n\n" +
      "他冲进 {site}。{weapon} 的弹匣清空——两个倒。换弹，再清——一个倒。三杀。对手的进攻被打断。{team} 赢了这局。\n\n" +
      "3-2。{team} 赢了比赛。",
    after:
      "{player} 站在领奖台上。他没有哭——但他的手在抖。\n\n" +
      "记者问他：'前三局状态不好，赛点局为什么突然爆发？'\n\n" +
      "他说：'没有突然。我一直在等。等一个机会证明那些骂我的人——错了。'\n\n" +
      "他顿了一下：'今天我等到了。'",
    effect: "正名之战 · 火力 +4 · 士气 +5 · 凝聚力 +3",
  },
];

// ──────────────────────────────────────────────
// 聚合导出 · 扩展
// ──────────────────────────────────────────────

/** 所有残局氛围模板 */
export const allClutchAtmosphereTemplates: ClutchAtmosphereTemplate[] = clutchAtmosphereTemplates;

/** 所有炸弹失败模板 */
export const allBombFailureTemplates: BombFailureTemplate[] = bombFailureTemplates;

/** 所有拖时间战术模板 */
export const allTimeWasteTemplates: TimeWasteTemplate[] = timeWasteTemplates;

/** 所有强起局叙事模板 */
export const allForceBuyNarratives: ForceBuyNarrativeTemplate[] = forceBuyNarratives;

/** 所有状态转折模板 */
export const allFormShiftTemplates: FormShiftTemplate[] = formShiftTemplates;

/** 按残局阶段筛选氛围模板 */
export function getClutchAtmosphereByStage(stage: ClutchAtmosphereTemplate["stage"]): ClutchAtmosphereTemplate[] {
  return clutchAtmosphereTemplates.filter((t) => t.stage === stage);
}

/** 按人数劣势筛选氛围模板 */
export function getClutchAtmosphereByDisadvantage(disadvantage: string): ClutchAtmosphereTemplate[] {
  return clutchAtmosphereTemplates.filter(
    (t) => t.disadvantage === disadvantage || t.disadvantage === "any"
  );
}

/** 按失败类型筛选炸弹模板 */
export function getBombFailureByType(type: BombFailureTemplate["type"]): BombFailureTemplate[] {
  return bombFailureTemplates.filter((t) => t.type === type);
}

/** 按拖时间方式筛选 */
export function getTimeWasteByMethod(method: TimeWasteTemplate["method"]): TimeWasteTemplate[] {
  return timeWasteTemplates.filter((t) => t.method === method);
}

/** 按情绪基调筛选强起局模板 */
export function getForceBuyByMood(mood: ForceBuyNarrativeTemplate["mood"]): ForceBuyNarrativeTemplate[] {
  return forceBuyNarratives.filter((t) => t.mood === mood);
}

/** 按转折类型筛选状态转折模板 */
export function getFormShiftByType(type: FormShiftTemplate["type"]): FormShiftTemplate[] {
  return formShiftTemplates.filter((t) => t.type === type);
}

// ──────────────────────────────────────────────
// 嘲讽/垃圾话模板（按性格）
// ──────────────────────────────────────────────

export interface TauntTemplate {
  trait: "hot_blooded" | "streaky_star" | "crowd_favorite" | "calm_clutcher" | "any";
  /** 触发时机 */
  trigger: "after_round_win" | "after_clutch" | "after_multi_kill";
  template: string;
  /** 士气效果 */
  moraleEffect: number;
}

export const tauntTemplates: TauntTemplate[] = [
  // 火爆型
  {
    trait: "hot_blooded",
    trigger: "after_round_win",
    template: "{player} 赢了回合后站起来，对着 {rival_team} 的隔音棚比了个倒拇指：'就这？就这水平？'",
    moraleEffect: 4,
  },
  {
    trait: "hot_blooded",
    trigger: "after_multi_kill",
    template: "{player} 三杀之后在语音里吼：'妈的，太爽了！再来三个！' 他的声音大到对手都能听见。",
    moraleEffect: 5,
  },
  {
    trait: "hot_blooded",
    trigger: "after_clutch",
    template: "{player} 1v3 翻盘后把鼠标往桌上一摔，对着镜头比中指。技术犯规警告——但全场炸了。",
    moraleEffect: 6,
  },

  // 起伏型明星
  {
    trait: "streaky_star",
    trigger: "after_multi_kill",
    template: "{player} 五杀后绕着 {site} 跑了一圈，对着观众席挥手。'这个舞台是我的。你们是来看我的。'",
    moraleEffect: 5,
  },
  {
    trait: "streaky_star",
    trigger: "after_clutch",
    template: "{player} 残局赢了之后摘下耳机，扔给空气。'下一个。还有谁？' 他的眼神扫过 {rival_team} 五个人。",
    moraleEffect: 4,
  },

  // 人气王
  {
    trait: "crowd_favorite",
    trigger: "after_round_win",
    template: "{player} 赢了回合后冲到镜头前，做了个标志性的庆祝动作。观众席的尖叫声震耳欲聋——{rival_team} 的选手都转过头看。",
    moraleEffect: 5,
  },
  {
    trait: "crowd_favorite",
    trigger: "after_clutch",
    template: "{player} 1vN 之后单膝跪地，做出'嘘'的手势——让全场安静。安静了三秒。然后他站起来，观众席炸了。",
    moraleEffect: 7,
  },

  // 冷静型（罕见的冷嘲讽）
  {
    trait: "calm_clutcher",
    trigger: "after_clutch",
    template: "{player} 1v3 翻盘后没有任何表情。他只是回到位置，戴上耳机，说了两个字：'继续。' 这种沉默比任何嘲讽都狠。",
    moraleEffect: 3,
  },
];

// ──────────────────────────────────────────────
// 完整回合节拍示例
//
// 以下展示一个"ECO 局"的 10 框完整 flow。
// 玩家决策卡 2 张（开场战术 + 残局处理），其余 8 张为叙事/击杀/道具/结算。
// ──────────────────────────────────────────────

export const ecoRoundBeats: MatchBeat[] = [
  // 框 1：经济描述
  {
    id: "eco_setup",
    role: "economy_setup",
    phase: ["opening", "swing"],
    economyRequired: ["eco"],
    title: "ECO 局",
    text:
      "经济系统显示：全员 {money}。不够买步枪，不够买甲。\n\n" +
      "{team} 的五个人在出生点掏出了手枪——{player_a} 是 Glock-18，{player_b} 选了 Tec-9，{player_c} 攥着 P250，{player_d} 和 {player_e} 拿了双持贝瑞塔。\n\n" +
      "没道具。没甲。这把基本是送的——但如果能在 ECO 局拿到一两个击杀，经济会好很多。",
    delta: "经济状态：全员 ECO · 装备：手枪无甲",
    playerDecision: false,
  },

  // 框 2：玩家决策——战术
  {
    id: "eco_tactic_choice",
    role: "tactic_choice",
    phase: ["opening"],
    economyRequired: ["eco"],
    title: "ECO 局怎么打",
    text:
      "队长在语音里问：'教练，这把怎么搞？'\n\n" +
      "ECO 局不是不能赢——但赢的概率很低。重点在于：你想赌什么？",
    playerDecision: true,
    choices: [
      {
        label: "五人快攻 B 点——赌他们没想到",
        resultText:
          "'五个人冲 B。拿 Glock 贴脸。' 你说。'赌他们 B 点防守薄弱。'\n\n" +
          "五个人在出生点对视了一眼。然后——冲了。\n\n" +
          "{player_a} 第一个冲进 B 点。Glock 的三连发在烟雾里爆开——一个对手被贴脸打中，但他还有甲。{player_a} 倒下了。\n\n" +
          "补枪跟上。{player_b} 的 Tec-9 在近战里威力惊人——两枪，对手倒地。但 {rival_team} 的回防已经到了。",
        delta: "首杀失败 · 补枪成功 · 减员 1 · 击杀 1",
      },
      {
        label: "默认控图，找机会偷人",
        resultText:
          "'默认。别硬冲。找机会偷一个。' 你说。\n\n" +
          "五把手枪散开了。{player_c} 蹲在 {site} 的角落里，P250 架着一个非主流角度。等了二十秒——{opponent} 走过。\n\n" +
          "P250 的两发点射击穿了 {opponent} 的头盔。首杀！\n\n" +
          "但 {rival_team} 立刻回防。{player_c} 被三把步枪的交叉火力收掉了。ECO 局拿到首杀——已经算成功了。",
        delta: "首杀成功 · 减员 1 · 击杀 1 · 经济 +$300",
      },
      {
        label: "全员蹲点——保枪保经济",
        resultText:
          "'别打。藏起来。保枪。' 你说。'这把送了，下把全买。'\n\n" +
          "五个人蹲在 {site} 的死角里。{rival_team} 搜了一整张图都没找到人——C4 安放了，但回防来不及。\n\n" +
          "回合输了。但五把手枪保了下来。下一回合——全员满装备。",
        delta: "回合失败 · 装备保全 · 下回合经济 +$2300",
      },
    ],
  },

  // 框 3：首杀描述
  {
    id: "eco_opening_kill",
    role: "opening_kill",
    phase: ["opening", "pressure"],
    economyRequired: [],
    title: "首杀",
    text:
      "{player_a} 扛着 Glock-18 闯进了 {site}。\n\n" +
      "Glock 的三连发在 10 米外的距离几乎没用——但 {player_a} 贴脸了。他蹲在一个非主流的角落，等 {opponent} 走过的时候，从背后扣下了扳机。\n\n" +
      "三连发，三发全中。{opponent} 倒地的时候，{rival_team} 的语音里炸了：'首杀！B 点首杀！回防！'",
    delta: "首杀 · 击杀 1 · 敌方减员 1",
    playerDecision: false,
  },

  // 框 4：中段交火
  {
    id: "eco_mid_firefight",
    role: "mid_firefight",
    phase: ["pressure", "swing"],
    economyRequired: [],
    title: "中段交火",
    text:
      "{rival_team} 的回防到了。三把 AK 同时压向 {site}。\n\n" +
      "{player_b} 的 Tec-9 在近距离打中了 {opponent_b} 的腿——但 {opponent_b} 有甲。AK 的反击瞬间把 {player_b} 收掉。\n\n" +
      "{player_c} 想补枪，但他的 P250 在中距离打不穿 {opponent_c} 的头盔。两秒内——{team} 倒了三个人。\n\n" +
      "还剩两个。手枪。对面还剩三个。步枪。",
    delta: "减员 3 · 击杀 1 · 人数劣势 2v3",
    playerDecision: false,
  },

  // 框 5：道具博弈
  {
    id: "eco_utility_use",
    role: "utility_use",
    phase: ["pressure", "swing", "adjustment"],
    economyRequired: [],
    title: "一颗烟雾弹",
    text:
      "{player_d} 没有步枪，没有甲——但他还藏着一颗烟雾弹。\n\n" +
      "他把烟扔在了 {site} 的入口。灰色的烟幕吞没了整个通道——{rival_team} 的三把 AK 突然失去了目标。\n\n" +
      "{time} 秒。这 {time} 秒里，{player_d} 和 {player_e} 蹲在死角里，听着对手的脚步声在烟雾两侧来回。\n\n" +
      "'别动。' {player_d} 在语音里说。'等他们犯错误。'",
    delta: "烟雾封路 {time} 秒 · 视野切断",
    playerDecision: false,
  },

  // 框 6：高光击杀
  {
    id: "eco_highlight_kill",
    role: "highlight_kill",
    phase: ["swing", "closing"],
    economyRequired: [],
    title: "出烟偷背身",
    text:
      "{opponent_c} 等不及了。他从烟雾侧面绕过来，AK 架着前方——\n\n" +
      "但他没看后面。\n\n" +
      "{player_e} 从烟雾里钻出来，蹲走，没声音。双持贝瑞塔在他后脑勺上点了三下。三发，三中。{opponent_c} 倒地的时候，{rival_team} 的语音里一片死寂。\n\n" +
      "2v2 了。手枪对步枪。但他们偷到了一把 AK。",
    delta: "击杀 1 · 拾取 AK-47 · 人数 2v2",
    playerDecision: false,
  },

  // 框 7：残局前情
  {
    id: "eco_clutch_setup",
    role: "clutch_setup",
    phase: ["closing"],
    economyRequired: [],
    title: "1v2",
    text:
      "{player_d} 在捡枪的时候被 {opponent_d} 从远点击杀。还剩 {player_e}。\n\n" +
      "1v2。手里是把捡来的 AK，半甲，没道具。{rival_team} 还剩两个——一个满血满甲在 A 点架枪，一个在 B 点拆包。\n\n" +
      "C4 已经安放。{time} 秒。{player_e} 蹲在 {site} 的死角里，听着两个方向的脚步声。",
    playerDecision: false,
  },

  // 框 8：玩家决策——残局处理
  {
    id: "eco_clutch_choice",
    role: "clutch_resolution",
    phase: ["closing"],
    economyRequired: [],
    title: "残局——你怎么办？",
    text:
      "{player_e} 在语音里问：'教练？'\n\n" +
      "{time} 秒。C4 在滴答。两个对手。一把 AK。没有道具。",
    playerDecision: true,
    choices: [
      {
        label: "静步摸过去，找单挑",
        resultText:
          "'静步。找单挑。' 你说。\n\n" +
          "{player_e} 关了脚步，从 {site} 绕到对手侧身后。第一个人甚至没来得及转头——AK 的三发点射穿了他的头盔。1v1 了。\n\n" +
          "第二个对手听到枪声从 B 点冲过来。{player_e} 架在转角——等他露头的那一刻，AK 的弹匣倾泻而出。1v2 翻盘。全场炸了。",
        delta: "残局翻盘 · 击杀 2 · 士气 +8 · momentum +6",
      },
      {
        label: "保枪——这把送了",
        resultText:
          "'保枪。别赌。' 你说。'下把全买打回来。'\n\n" +
          "{player_e} 把 AK 塞进墙角，蹲下。C4 爆了。回合输了。\n\n" +
          "但他带着一把 AK 和半甲进了下一局。下一局——全员满装备。这把 AK 省了 $2700。",
        delta: "回合失败 · AK 保全 · 下回合经济 +$2700",
      },
      {
        label: "假拆——逼对手回防",
        resultText:
          "'按一下拆包键再松开。逼他来。' 你说。\n\n" +
          "{player_e} 对着 C4 按了一下拆除键——滴答声停了。{rival_team} 的最后一个选手立刻从中路冲过来回防。\n\n" +
          "他冲过转角的时候，{player_e} 的 AK 已经架在那里了。1v2 翻盘。战术读心成功。",
        delta: "残局翻盘 · 击杀 2 · 战术执行 +5 · 士气 +6",
      },
    ],
  },

  // 框 9：回合结算
  {
    id: "eco_round_result",
    role: "round_result",
    phase: ["opening", "pressure", "swing", "adjustment", "closing"],
    economyRequired: [],
    title: "回合结束",
    text:
      "{team} 赢了 ECO 局。\n\n" +
      "全场炸了——观众席的尖叫声震耳欲聋。{rival_team} 的五个人坐在隔音棚里，脸色铁青。他们输给了五把手枪。\n\n" +
      "{player_e} 站起来的时候，手还在抖。不是紧张——是肾上腺素。",
    delta: "回合胜利 · 比分 +1 · 士气 +6 · momentum +4 · 对手士气 -4",
    playerDecision: false,
  },

  // 框 10：嘲讽（玩家决策）
  {
    id: "eco_taunt_choice",
    role: "taunt",
    phase: ["closing"],
    economyRequired: [],
    title: "赢了一把——要不要搞点事？",
    text:
      "{player_a} 赢了 ECO 局之后特别兴奋。他凑到你耳边：'教练，能不能搞一下他们？'\n\n" +
      "你知道他说的是什么——嘲讽。赢了 ECO 局嘲讽对手，是 CS 里最狠的心理战。但也是双刃剑。",
    playerDecision: true,
    choices: [
      {
        label: "让他搞——给对手施压",
        resultText:
          "'搞。' 你说。\n\n" +
          "{player_a} 站起来，对着 {rival_team} 的隔音棚比了个倒拇指：'就这？五把手枪都打不过？'\n\n" +
          "{rival_team} 的指挥透过玻璃看到了。他的脸色——你想用'难看'形容，但难看都算好听的。",
        delta: "士气 +4 · momentum +3 · 对手纪律 -3 · 风险：对手复仇动力 +5",
      },
      {
        label: "按住他——别给对手动力",
        resultText:
          "'别。' 你拍了 {player_a} 的椅背。'赢了就坐下。别给他们燃料。'\n\n" +
          "{player_a} 撇了撇嘴——但他坐下了。下一回合，{rival_team} 不会带着额外的怒气打。",
        delta: "纪律 +3 · 士气 +1 · momentum +1",
      },
      {
        label: "让他搞，但下回合打假情报配合",
        resultText:
          "'搞。但下回合我们配合一下——他们以为我们会飘，我们反而打最稳的默认。'\n\n" +
          "{player_a} 嘲讽完，{rival_team} 确实急了。下一回合他们前压——撞进了你们最稳的防守体系里。",
        delta: "士气 +3 · momentum +2 · 下回合战术执行 +4",
      },
    ],
  },
];

// ──────────────────────────────────────────────
// 全买局节拍示例
// ──────────────────────────────────────────────

export const fullBuyRoundBeats: MatchBeat[] = [
  // 框 1：全买经济
  {
    id: "fullbuy_setup",
    role: "economy_setup",
    phase: ["opening", "swing", "closing"],
    economyRequired: ["full_buy"],
    title: "全买",
    text:
      "经济够了。全员满钱。\n\n" +
      "{player_a} 扛起了 AK-47，{player_b} 选了 M4A1-S，{player_c} 起了 AWP，{player_d} 和 {player_e} 都是满甲满道具的步枪手。\n\n" +
      "烟雾弹、闪光弹、燃烧弹、高爆手雷——五个人加起来十四颗道具。这是 CS 里最舒服的回合——满装备，满信心，满火力。",
    delta: "经济状态：全买 · 装备：满甲满道具",
    playerDecision: false,
  },

  // 框 2：玩家决策——战术
  {
    id: "fullbuy_tactic_choice",
    role: "tactic_choice",
    phase: ["opening"],
    economyRequired: ["full_buy"],
    title: "怎么打",
    text:
      "满装备。满道具。满信心。\n\n" +
      "队长的眼神在等你：'教练，怎么打？'",
    playerDecision: true,
    choices: [
      {
        label: "默认控图——慢慢挤压",
        resultText:
          "'默认。控图。' 你说。'把他们逼出来。'\n\n" +
          "五个人散开，开始在中路和两个 bombsite 之间建立控制。{player_c} 的 AWP 在中路架了一条线——{rival_team} 的人不敢露头。",
        delta: "战术执行 +3 · 凝聚力 +2",
      },
      {
        label: "五人快攻 A——速度碾压",
        resultText:
          "'五个人冲 A。' 你说。'道具全交，速度要快。'\n\n" +
          "烟雾封路口，闪光越墙，燃烧瓶清角落——五个人像潮水一样涌进 A 点。{rival_team} 的防守还没反应过来。",
        delta: "火力 +4 · 战术 -2 · momentum +3",
      },
      {
        label: "假打 B，真打 A——骗他们",
        resultText:
          "'三人假 B，两人真 A。' 你说。'骗他们回防。'\n\n" +
          "{player_a} 带着两个人在 B 点扔了四颗道具，制造出五人强攻的假象。{rival_team} 的指挥立刻叫回防——\n\n" +
          "而 {player_d} 和 {player_e} 已经在 A 点下包了。",
        delta: "战术执行 +5 · 凝聚力 +3 · momentum +2",
      },
    ],
  },

  // 框 3：道具博弈
  {
    id: "fullbuy_utility_war",
    role: "utility_use",
    phase: ["pressure", "swing"],
    economyRequired: ["full_buy"],
    title: "道具战",
    text:
      "双方开始扔道具。\n\n" +
      "{player_a} 的烟雾弹封住了 {site} 的入口。{rival_team} 的 {opponent_a} 立刻回了一颗燃烧瓶——逼 {player_a} 后撤。\n\n" +
      "{player_b} pop-flash 了一颗闪光——{opponent_b} 的视角瞬间全白。但 {opponent_c} 紧跟着也扔了一颗烟雾，把 {site} 重新封死。\n\n" +
      "三十秒。双方扔了十一颗道具。地图上到处都是烟、火、和闪光弹的余晖。",
    delta: "道具消耗 11/14 · 视野混乱",
    playerDecision: false,
  },

  // 框 4：高光击杀——AWP
  {
    id: "fullbuy_awp_kill",
    role: "highlight_kill",
    phase: ["pressure", "swing", "closing"],
    economyRequired: ["full_buy"],
    title: "甩狙",
    text:
      "{player_c} 的 AWP 在 {site} 架了四十秒。\n\n" +
      "四十秒。没动。没开镜。只是听。\n\n" +
      "然后——{opponent_a} 在烟雾散开的 0.3 秒间隙里露了半个身位。开镜、击发、收镜，全程不到一秒。\n\n" +
      "{opponent_a} 倒地的时候，手里还攥着没扔出去的闪光弹。他甚至没意识到自己是怎么死的。",
    delta: "击杀 1 · AWP 首杀 · momentum +3",
    playerDecision: false,
  },

  // 框 5：高光击杀——扫射转移
  {
    id: "fullbuy_spray_transfer",
    role: "highlight_kill",
    phase: ["swing", "closing"],
    economyRequired: ["full_buy"],
    title: "扫射转移",
    text:
      "{rival_team} 三个人从 {site} 的两个角度同时冲进来。\n\n" +
      "{player_a} 扛着 AK-47——一个弹匣，三十发。第一个人从左侧露头，三发点射，倒。第二个人从右侧冲来，枪口横扫，七发，倒。第三个人想补枪——弹匣还剩二十发，全部倾泻。\n\n" +
      "一个弹匣，三个人。spray transfer 完美执行。{player_a} 站起来的时候，手在抖——不是紧张，是那种'我刚才做到了'的兴奋。",
    delta: "击杀 3 · ACE · 士气 +8 · momentum +6",
    playerDecision: false,
  },

  // 框 6：单摸绕后
  {
    id: "fullbuy_lurk_flank",
    role: "lurk_flank",
    phase: ["pressure", "swing"],
    economyRequired: [],
    title: "他不见了",
    text:
      "{player_d} 不见了。\n\n" +
      "从开局到现在，他没有出现在任何报点里。{rival_team} 的指挥在语音里问：'{player_d} 在哪？' 没人知道。\n\n" +
      "直到——{opponent_b} 在 {site} 蹲下架枪的时候，背后传来一声 AK 的脆响。三发点射，穿头盔，倒。\n\n" +
      "{player_d} 从二楼摸下来，绕到了整个 {rival_team} 的背后。'我在他们后面。' 他在语音里说。声音很平，像在说今天天气不错。",
    delta: "绕后击杀 1 · 敌方减员 1 · 战术执行 +4",
    playerDecision: false,
  },

  // 框 7：道具伤害
  {
    id: "fullbuy_he_damage",
    role: "utility_use",
    phase: ["pressure", "swing"],
    economyRequired: [],
    title: "一颗手雷",
    text:
      "{player_b} 的高爆手雷精准落进 {site} 的角落——那里蹲着两个 {rival_team} 的选手。\n\n" +
      "爆炸的瞬间——{opponent_c} 的血条从满血跳到 23 血。{opponent_d} 从满血跳到 11 血。两个大残。\n\n" +
      "他们没死。但下一个回合——不，这一回合的下一个交火——他们带着这点血打。AK 一发就能收。",
    delta: "敌人大残 ×2 · 下次交火击杀概率 +40%",
    playerDecision: false,
  },

  // 框 8：燃烧瓶拖延
  {
    id: "fullbuy_molotov_delay",
    role: "utility_use",
    phase: ["adjustment", "closing"],
    economyRequired: [],
    title: "燃烧瓶",
    text:
      "{rival_team} 的回防到了。三个人从 {site} 的两个角度同时压过来。\n\n" +
      "{player_e} 把燃烧瓶砸在入口。火焰从地面腾起——{rival_team} 的三个人被迫停在火墙后面。\n\n" +
      "十五秒。这十五秒里，C4 的倒计时还在走。{rival_team} 的指挥在语音里吼：'绕路！绕路！' 但绕路要多花八秒。\n\n" +
      "来不及了。",
    delta: "拖延回防 15 秒 · C4 倒计时优势",
    playerDecision: false,
  },

  // 框 9：回合结算
  {
    id: "fullbuy_round_result",
    role: "round_result",
    phase: ["opening", "pressure", "swing", "adjustment", "closing"],
    economyRequired: [],
    title: "回合结束",
    text:
      "C4 爆了。{team} 赢了。\n\n" +
      "不是靠个人英雄主义——是靠道具、走位、和十五秒的火焰。整个回合像一台机器，每个零件都在对的时间转到了对的位置。\n\n" +
      "{player_a} 在语音里说：'教练，这把我们没犯一个错。' 你点头。'记住这个感觉。'",
    delta: "回合胜利 · 比分 +1 · 凝聚力 +4 · 战术执行 +3",
    playerDecision: false,
  },

  // 框 10：士气反馈
  {
    id: "fullbuy_morale_feedback",
    role: "morale_feedback",
    phase: ["closing"],
    economyRequired: [],
    title: "空气变了",
    text:
      "2-0。\n\n" +
      "{team} 的训练室——不，是赛场——空气变了。{rival_team} 的选手在隔音棚里互相看了一眼。那种眼神不是慌——是开始怀疑。\n\n" +
      "而 {team} 这边，五个人的呼吸都稳了。{player_c} 在转鼠标线——这是他放松的小动作。{player_a} 喝了口水，把瓶子放回桌上的位置和上次一模一样。\n\n" +
      "这是节奏。这是势头。",
    delta: "士气 +5 · momentum +4 · 对手士气 -3",
    playerDecision: false,
  },
];

// ──────────────────────────────────────────────
// 半买/强起局节拍片段
// ──────────────────────────────────────────────

export const halfBuyForceBeats: MatchBeat[] = [
  {
    id: "halfbuy_setup",
    role: "economy_setup",
    phase: ["pressure", "swing"],
    economyRequired: ["half_buy"],
    title: "半买",
    text:
      "钱不够全买，但也不愿意 ECO。\n\n" +
      "{player_a} 起了 MP9，{player_b} 拿了 Galil，{player_c} 是 UMP-45，{player_d} 和 {player_e} 选了 P250 加半甲。\n\n" +
      "道具只有两颗烟雾一颗闪光。装备不齐——但近战火力够。赌的是首杀。",
    delta: "经济状态：半买 · 装备：冲锋枪+半甲",
    playerDecision: false,
  },
  {
    id: "forcebuy_setup",
    role: "economy_setup",
    phase: ["swing", "closing"],
    economyRequired: ["force_buy"],
    title: "强起",
    text:
      "0-2 落后。如果再 ECO，下把还是没钱。指挥在语音里问：'强起吗？'\n\n" +
      "你说：'强起。'\n\n" +
      "{player_a} 扛了 AK 但没甲。{player_b} 拿了 M4 但只有半甲。{player_c} 起了 AWP——鸟狙，SSG08，便宜。{player_d} 和 {player_e} 是 P250 加 Tec-9。\n\n" +
      "道具几乎为零。这是孤注一掷。赢了翻盘，输了 0-3。",
    delta: "经济状态：强起 · 装备：步枪无甲/鸟狙",
    playerDecision: false,
  },
  {
    id: "forcebuy_desperate_kill",
    role: "highlight_kill",
    phase: ["swing", "closing"],
    economyRequired: ["force_buy"],
    title: "鸟狙立功",
    text:
      "{player_c} 的 SSG08 鸟狙在 {site} 架枪。鸟狙便宜——$1700，比 AWP 便宜四倍。但爆头就是爆头。\n\n" +
      "{opponent_a} 露头的瞬间——鸟狙一发，命中头盔。$1700 的枪，打出了 $4750 的效果。\n\n" +
      "{player_c} 捡起了 {opponent_a} 掉落的 AK。'我有步枪了。' 他在语音里说。声音稳得不像 0-2 落后。",
    delta: "击杀 1 · 拾取 AK-47 · 经济翻转",
    playerDecision: false,
  },
];

// ──────────────────────────────────────────────
// 跨回合叙事节拍
// ──────────────────────────────────────────────

export const narrativeBeats: MatchBeat[] = [
  {
    id: "narrative_first_blood_match",
    role: "narrative_beat",
    phase: ["opening"],
    economyRequired: [],
    title: "比赛开始",
    text:
      "裁判吹响了开始信号。五对五。鼠标的点击声在隔音棚里像下雨。\n\n" +
      "{team} vs {rival_team}。这是 {cup_name} 的 {stage}。场馆里一万两千人——一半在喊 {team}，一半在喊 {rival_team}。\n\n" +
      "你的队长在语音里说：'第一回合定调。别送。'",
    playerDecision: false,
  },
  {
    id: "narrative_match_point",
    role: "narrative_beat",
    phase: ["closing"],
    economyRequired: [],
    title: "赛点",
    text:
      "2-2。\n\n" +
      "最后一回合。赛点。整个场馆的空气都凝固了——一万两千人同时屏住呼吸。\n\n" +
      "{team} 和 {rival_team} 的五个人各自坐在隔音棚里。没有人说话。没有人动。等裁判的开局信号。\n\n" +
      "你的队长看向你。等你最后一句话。",
    playerDecision: false,
  },
  {
    id: "narrative_match_end_win",
    role: "narrative_beat",
    phase: ["closing"],
    economyRequired: [],
    title: "赢了",
    text:
      "最后一颗子弹落地。\n\n" +
      "{team} 赢了。3-2。\n\n" +
      "你的五个人从隔音棚里冲出来——{player_a} 第一个冲上来抱你，{player_c} 站在原地不动，眼眶是红的。{player_e} 把鼠标举过头顶，对着观众席咆哮。\n\n" +
      "一万两千人喊你们的名字。声音震得耳膜疼。",
    delta: "比赛胜利 · 士气 +8 · momentum +6",
    playerDecision: false,
  },
  {
    id: "narrative_match_end_loss",
    role: "narrative_beat",
    phase: ["closing"],
    economyRequired: [],
    title: "输了",
    text:
      "最后一颗子弹落地。\n\n" +
      "{team} 输了。2-3。\n\n" +
      "你的五个人坐在隔音棚里没动。{player_a} 把头埋在手臂里。{player_c} 盯着屏幕，屏幕上是对手的庆祝画面。{player_e} 慢慢摘下耳机，像摘下一个时代。\n\n" +
      "观众席还在为 {rival_team} 欢呼。那些声音穿过隔音棚——刺耳。",
    delta: "比赛失败 · 士气 -6 · momentum -4",
    playerDecision: false,
  },
];

// ──────────────────────────────────────────────
// 聚合导出
// ──────────────────────────────────────────────

export const allMatchBeats: MatchBeat[] = [
  ...ecoRoundBeats,
  ...fullBuyRoundBeats,
  ...halfBuyForceBeats,
  ...narrativeBeats,
];

/** 按回合阶段筛选节拍 */
export function getBeatsByPhase(phase: RoundPhase): MatchBeat[] {
  return allMatchBeats.filter((b) => b.phase.includes(phase));
}

/** 按经济状态筛选 */
export function getBeatsByEconomy(economy: EconomyTier): MatchBeat[] {
  return allMatchBeats.filter(
    (b) => b.economyRequired.length === 0 || b.economyRequired.includes(economy)
  );
}

/** 按节拍角色筛选 */
export function getBeatsByRole(role: BeatRole): MatchBeat[] {
  return allMatchBeats.filter((b) => b.role === role);
}

/** 获取玩家决策卡 */
export function getPlayerDecisionBeats(): MatchBeat[] {
  return allMatchBeats.filter((b) => b.playerDecision);
}

/** 根据选手特征获取击杀高光模板 */
export function getKillHighlightByTrait(trait: KillHighlightTemplate["trait"]): KillHighlightTemplate[] {
  return killHighlights.filter((t) => t.trait === trait || t.trait === "any");
}

/** 根据性格获取嘲讽模板 */
export function getTauntByTrait(trait: TauntTemplate["trait"]): TauntTemplate[] {
  return tauntTemplates.filter((t) => t.trait === trait || t.trait === "any");
}

/**
 * 填充模板变量。
 *
 * @param template 含 {var} 的模板
 * @param vars     变量映射
 * @returns        替换后的文本
 */
export function fillBeatTemplate(
  template: string,
  vars: Record<string, string | number>
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
}

/**
 * 获取经济状态对应的武器描述。
 */
export function getEconomyDescription(economy: EconomyTier): string {
  return economyWeaponTable[economy].narrativeHint;
}

/**
 * 获取经济状态对应的主武器池（用于模拟击杀时选武器）。
 */
export function getEconomyWeapons(economy: EconomyTier): string[] {
  return economyWeaponTable[economy].primary;
}
