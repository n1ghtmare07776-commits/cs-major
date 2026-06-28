/**
 * 暂停（Timeout）文本库
 *
 * 每场比赛有一次暂停机会。MECHANICS.md 定义了三个选项：
 *   - 战术重置（Tactical reset）：针对对手习惯调整，恢复结构
 *   - 情绪重置（Emotional reset）：平复 tilt/压力/怒气，软化状态惩罚
 *   - 纪律重置（Discipline reset）：停止浪/送/单摸，打断波动连锁
 *
 * 本文件覆盖：
 *   1. 暂停触发情境——"为什么值得叫暂停"的 12 种场景
 *   2. 暂停氛围描写——教练走到选手中间的那一刻
 *   3. 三选项的反馈文本——选了之后发生了什么
 *   4. 不叫暂停的后果文本——留着的赌注
 *
 * 变量槽位：
 *   {player}        — 选手名
 *   {opponent}      — 对手选手名
 *   {team}          — 队伍名
 *   {rival_team}    — 对手队伍名
 *   {site}          — 点位
 *   {weapon}        — 武器
 *   {count}         — 数量
 *   {time}          — 时间
 *   {score}         — 当前比分
 *   {coach_name}    — 教练名（可选）
 */

// ──────────────────────────────────────────────
// 类型定义
// ──────────────────────────────────────────────

export type TimeoutTrigger =
  | "losing_streak"        // 己方连败，势头崩了
  | "opponent_streak"      // 对手连胜，势头起来了
  | "tilt_chain"           // 选手 tilt / 性格连锁触发
  | "economy_crash"        // 经济崩盘，面临强起抉择
  | "being_read"           // 战术被读透，重复战术被针对
  | "key_round_pressure"   // 关键回合前（赛点/淘汰赛点）
  | "communication_break"  // 沟通断裂，报点混乱
  | "star_cold"            // 明星选手状态冰凉
  | "momentum_swing_lost"  // 大好局面被翻，势头逆转
  | "clutch_failure"       // 残局失败后士气低落
  | "crowd_hostility"      // 客场观众压力
  | "final_approach";      // 决赛前的最后调整

export type TimeoutChoice =
  | "tactical_reset"     // 战术重置
  | "emotional_reset"    // 情绪重置
  | "discipline_reset"   // 纪律重置
  | "skip";              // 不叫，留着

export interface TimeoutScenario {
  /** 触发情境 id */
  trigger: TimeoutTrigger;
  /** 标题 */
  title: string;
  /** 情境描述——为什么现在值得叫暂停 */
  situation: string;
  /** 暂停氛围——叫了暂停之后的那一刻 */
  atmosphere?: string;
  /** 四个选择的反馈 */
  choices: TimeoutChoiceFeedback[];
}

export interface TimeoutChoiceFeedback {
  /** 选择类型 */
  choice: TimeoutChoice;
  /** 选择标签 */
  label: string;
  /** 选择后的反馈文本 */
  feedback: string;
  /** 数值效果 */
  effect: {
    tactics?: number;
    discipline?: number;
    morale?: number;
    condition?: number;
    cohesion?: number;
    momentum?: number;
    tactical_control?: number;
    firepower?: number;
    economy?: number;
  };
  /** 末尾的紧凑数值行 */
  delta: string;
}

// ──────────────────────────────────────────────
// 暂停氛围通用描写
// ──────────────────────────────────────────────

export const timeoutAtmosphereLines: string[] = [
  "你站了起来。椅子往后滑了半米。五双眼睛同时看向了你。",
  "你走到选手身后，把手放在了队长椅背上。没说话——只是站在那里。五秒后，语音里的噪音停了。",
  "你叫了暂停。裁判吹了哨。五个人摘下耳机，转过身来——像溺水的人看到了岸。",
  "你走到白板前，拿起笔。笔帽咬在嘴里——这是你思考时的习惯。五个人围过来。",
  "你把水瓶放在桌上，发出'咚'的一声。不大，但训练室——不，赛场——突然安静了。",
  "你没叫暂停。你只是站起来，走到选手身后，拍了拍队长的肩。他回头看你——你点了下头。他懂了。",
];

// ──────────────────────────────────────────────
// 12 种暂停触发情境 + 四选项反馈
// ──────────────────────────────────────────────

export const timeoutScenarios: TimeoutScenario[] = [
  // ════════════════════════════════════════════
  // 1. 连败——势头崩了
  // ════════════════════════════════════════════
  {
    trigger: "losing_streak",
    title: "连丢两局",
    situation:
      "0-2。\n\n" +
      "第一局输在经济没跟上。第二局输在对枪——{player} 的 AK 对 {opponent} 的 AK，{player} 先开了枪但子弹偏了。\n\n" +
      "语音里没人说话。{player} 在看死亡回放，反复看。{rookie_name} 在揉手腕——不是受伤，是紧张。\n\n" +
      "势头崩了。不是比分崩——是心气崩了。你再不叫暂停，0-3 就定了。",
    atmosphere:
      "你叫了暂停。走到白板前，没写字——先看了五个人一眼。\n\n" +
      "他们回来了。不是身体回来了——是眼神回来了。等你说话。",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：改开局战术，别再打被针对的默认",
        feedback:
          "你在白板上画了三个字：'改开局。'\n\n" +
          "'前两局你们打默认控图——{rival_team} 已经读了。下局改快攻 {site}。别给他们时间布防。'\n\n" +
          "队长皱眉：'快攻？我们这赛季没练过几次——'\n\n" +
          "'没练过才要打。' 你说。'他们以为你们会打默认。让他们错。'\n\n" +
          "下局——快攻 {site}。{rival_team} 的防守还没站好位。{player} 第一个冲进去，{weapon} 扫了两个人。赢了。\n\n" +
          "势头断了。不是断了对手的——是断了你们自己的连败。",
        effect: { tactics: 6, tactical_control: 5, discipline: 2, morale: 3, momentum: 4 },
        delta: "战术执行 +6 · 战术控制 +5 · 士气 +3 · momentum +4",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：让他们冷静下来，别追着输",
        feedback:
          "你没讲战术。你让五个人站起来，远离屏幕。\n\n" +
          "'深呼吸。' 你说。'你们在追。追上一局的输。追到这一局也输了。'\n\n" +
          "{player} 闭眼。{rookie_name} 喝水。{veteran_name} 揉了揉脖子。\n\n" +
          "三十秒后——{player} 睁开眼。眼神不一样了。不是愤怒了——是冷静了。\n\n" +
          "'下局怎么打？' 队长问。\n\n" +
          "'打你们最熟的。别加新东西。' 你说。'稳住就行。'\n\n" +
          "下局——他们打得很稳。没赢——但没崩。0-3 变成了 1-2。还有机会。",
        effect: { morale: 5, condition: 4, discipline: 2, cohesion: 3, tactical_control: 1 },
        delta: "士气 +5 · 状态 +4 · 凝聚力 +3 · 纪律 +2",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：停止浪，回到默认，别自己加戏",
        feedback:
          "你语气很重：'{player}，别单摸。{rookie_name}，别提前压。所有人——回到默认。'\n\n" +
          "{player} 想辩解：'我那是找机会——'\n\n" +
          "'你那是送。' 你说。'找机会是我的活。你的活是执行。下局——别自己加戏。'\n\n" +
          "有人不太服气。但他知道你是对的——前两局输在各自为战。\n\n" +
          "下局——五个人打了一个教科书式的默认控图。补枪到位，走位标准，零失误。赢了。\n\n" +
          "纪律这东西——不舒服，但管用。",
        effect: { discipline: 6, tactics: 3, cohesion: 2, morale: -1, tactical_control: 3 },
        delta: "纪律 +6 · 战术执行 +3 · 凝聚力 +2 · 士气 -1",
      },
      {
        choice: "skip",
        label: "不叫——留着，也许后面更需要",
        feedback:
          "你没叫暂停。\n\n" +
          "0-2 了。语音里安静得能听到心跳。你的队长看了你一眼——你在摇头。\n\n" +
          "'还能打。' 你说。'别急。'\n\n" +
          "你没叫——因为你赌的是：如果 0-2 之后能自己赢回来，那 momentum 会比叫了暂停更大。但如果 0-3——\n\n" +
          "你把暂停留着。它像口袋里的一颗子弹。还没打出去。但你知道——如果后面有更需要的时刻，你还有它。\n\n" +
          "代价是：现在没有缓冲。",
        effect: { morale: -2, momentum: -2, discipline: -1, tactics: -1 },
        delta: "士气 -2 · momentum -2 · 暂停保留",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 2. 对手连胜——势头起来了
  // ════════════════════════════════════════════
  {
    trigger: "opponent_streak",
    title: "对手起势了",
    situation:
      "{rival_team} 连赢两局。不是你们打得多差——是他们打得太好。\n\n" +
      "第一局他们的 {opponent} 用 AWP 在中路拿了首杀。第二局他们的指挥叫了一个你们没见过的假打——你们被钓了。\n\n" +
      "现在他们的气势起来了。你能看到 {rival_team} 的选手在隔音棚里互相击掌——他们的身体语言在说：'我们找到节奏了。'\n\n" +
      "你得断他们的节奏。现在。",
    atmosphere:
      "你叫了暂停。不是为了讲战术——是为了让 {rival_team} 的势头断一下。\n\n" +
      "暂停这东西，有时候打乱的不是自己——是对手。",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：针对他们的新假打调整预判",
        feedback:
          "你在白板上画了 {rival_team} 刚才那个假打的路线。\n\n" +
          "'他们假 B 真 A。下局——如果他们再扔 B 的道具，别全转。留两个人架 A。'\n\n" +
          "队长点头：'收到。下局我留 {player} 和 {rookie_name} 架 A。'\n\n" +
          "下局——{rival_team} 果然又假 B。但这次 A 点有两个人等着。{opponent} 冲进 A 的时候——两把枪同时开火。\n\n" +
          "他们的节奏断了。你能看到 {rival_team} 的指挥在隔音棚里皱眉——'他们读了？'",
        effect: { tactics: 5, tactical_control: 4, discipline: 3, morale: 3, momentum: 3 },
        delta: "战术执行 +5 · 战术控制 +4 · momentum +3",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：别被他们的气势压住",
        feedback:
          "你没讲战术。你讲了别的东西。\n\n" +
          "'他们赢了两局——不是二十局。' 你说。'你们在怕什么？怕他们的 AWP？怕他们的假打？'\n\n" +
          "{player} 没说话。但他的手松了——刚才握鼠标握得太紧了。\n\n" +
          "'他们找到节奏了——好。那我们打断它。不是用战术打断——是用枪打断。下局——对枪。谁先开枪谁赢。'\n\n" +
          "下局——{player} 第一个开枪。{opponent} 倒地。势头——回来了。",
        effect: { morale: 5, firepower: 3, condition: 2, cohesion: 2, momentum: 4 },
        delta: "士气 +5 · 火力 +3 · momentum +4",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：别急躁，别追着打，让他们急",
        feedback:
          "'他们在急什么？' 你问。\n\n" +
          "队长愣了：'他们……没急。他们在赢。'\n\n" +
          "'对。他们在赢。赢的人会开始急——急着想保住优势。下局——我们打慢。让他们以为我们在 ECO。让他们前压。让他们送。'\n\n" +
          "纪律重置——不是修你们的纪律，是利用对手的急躁。\n\n" +
          "下局——你们打得很慢。{rival_team} 以为你们要 ECO，开始前压。{player} 架在 {site}——{opponent} 自己撞了上来。",
        effect: { discipline: 5, tactics: 3, morale: 2, momentum: 3, tactical_control: 2 },
        delta: "纪律 +5 · 战术执行 +3 · momentum +3",
      },
      {
        choice: "skip",
        label: "不叫——让他们的势头自己冷却",
        feedback:
          "你没叫。\n\n" +
          "有时候——对手的势头不需要你打断。它自己会断。\n\n" +
          "连胜之后的第三局——{rival_team} 可能会松。会以为赢了。会开始浪。\n\n" +
          "你赌的就是这个。如果他们松了——你不需要暂停。如果他们没松——你还有暂停留着。\n\n" +
          "代价是：如果他们没松，0-3 的压力全压在你这。",
        effect: { morale: -1, momentum: -1, tactical_control: -1 },
        delta: "士气 -1 · momentum -1 · 暂停保留",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 3. 选手 tilt / 性格连锁
  // ════════════════════════════════════════════
  {
    trigger: "tilt_chain",
    title: "心态炸了",
    situation:
      "{player} 连续三个回合对枪全输。他开始摔鼠标——不是比喻，是真摔。鼠标线从桌上飞了起来。\n\n" +
      "这是 MECHANICS 说的'性格连锁'——hot_blooded 或 streaky_star 特质在压力下触发：强制前压 → 被孤立 → 首接触失败 → 包点失守。\n\n" +
      "连锁已经开始了。他上一局单摸送了，这局又强行突破被收了。下一局——如果不停下来——他会更急，更送，更崩。\n\n" +
      "你必须打断这个链条。",
    atmosphere:
      "你没去白板前。你直接走到 {player} 身后。\n\n" +
      "他没回头。但你知道他感觉到了你在。他的肩膀——松了一点。",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：改他的位置，别让他打突破",
        feedback:
          "'{player}。' 你说。'下局你不打突破了。'\n\n" +
          "他转过头来——脸是黑的。'为什么？'\n\n" +
          "'因为你今天突破对枪输了四次。不是你不行——是今天这个对手的 prefire 太准。下局你打架枪位。让 {rookie_name} 突破。'\n\n" +
          "{player} 想抗议。但数据不说谎。他咬了咬牙：'……行。'\n\n" +
          "下局——他打架枪位。不用冲了，不用首杀了。只需要守住一个角度。他守住了。还收了两个回防的。连锁断了。",
        effect: { tactics: 4, discipline: 4, morale: 2, firepower: -1, cohesion: 2, tactical_control: 3 },
        delta: "战术执行 +4 · 纪律 +4 · 火力 -1 · 连锁打断",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：让他冷静，别追着输",
        feedback:
          "你蹲下来，跟 {player} 平视。\n\n" +
          "'你今天手感不好。这没关系。' 你说。'但你不能因为手感不好就送。'\n\n" +
          "他没说话。但喉结动了一下。\n\n" +
          "'你上一局单摸——是想证明什么？证明你能赢？你不需要证明。你只需要——别送。下局——跟队伍走。别自己加戏。'\n\n" +
          "他点了点头。慢慢把鼠标摆正。\n\n" +
          "下局——他没单摸。没浪。跟队伍打了一个标准的默认。没拿到击杀——但也没死。连锁断了。",
        effect: { morale: 4, condition: 3, discipline: 3, cohesion: 3, firepower: -1, tactical_control: 2 },
        delta: "士气 +4 · 状态 +3 · 纪律 +3 · 连锁打断",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：直接禁止单摸，强制执行",
        feedback:
          "你没安慰他。你下了命令。\n\n" +
          "'{player}。下局禁止单摸。禁止前压。禁止英雄枪。你只做一件事——跟在 {veteran_name} 后面补枪。他打谁你打谁。他走你走。'\n\n" +
          "{player} 瞪着你——愤怒、受伤、不服。但他没说话。\n\n" +
          "{veteran_name} 拍了拍他的肩：'跟着我。别想太多。'\n\n" +
          "下局——{player} 像 {veteran_name} 的影子一样跟着。不冲、不浪、不送。补了两个枪。纪律回来了。连锁——断了。但他的心——也许也裂了一点。",
        effect: { discipline: 7, tactics: 2, morale: -2, cohesion: -1, firepower: -1, tactical_control: 3 },
        delta: "纪律 +7 · 士气 -2 · 凝聚力 -1 · 连锁打断",
      },
      {
        choice: "skip",
        label: "不叫——让他自己走出来",
        feedback:
          "你没叫暂停。\n\n" +
          "你看着 {player} 摔鼠标、看回放、骂自己。你没动。\n\n" +
          "有些坎——必须自己跨。你叫了暂停，他听你的话，但心里不服。你不叫——他自己撞墙，撞够了，自己会回头。\n\n" +
          "代价是：他可能在下一局继续送。0-3 的风险——你在赌他的自我修复能力。\n\n" +
          "如果他下一局自己走出来了——这个暂停留着，值。如果没走出来——你后悔也来不及了。",
        effect: { morale: -3, discipline: -2, firepower: -2, momentum: -2, cohesion: -1 },
        delta: "士气 -3 · 纪律 -2 · 火力 -2 · 暂停保留",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 4. 经济崩盘
  // ════════════════════════════════════════════
  {
    trigger: "economy_crash",
    title: "经济见底",
    situation:
      "连续输了三个回合。队伍经济见底——全员加起来只够买两把步枪和三个手雷。\n\n" +
      "下一局如果全买——经济归零，下下局还是 ECO。如果 ECO——这局基本送了，0-4。\n\n" +
      "你的队长在语音里问：'教练，这把怎么搞？强起吗？'\n\n" +
      "强起。这个词在 CS 里意味着——孤注一掷。赢了翻盘，输了死亡螺旋。",
    atmosphere:
      "你叫了暂停。不是讲战术——是做决定。\n\n" +
      "经济这东西，不是战术能解决的。是赌。",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：如果强起，打他们没想到的战术",
        feedback:
          "'如果强起——不能打默认。默认他们能读。' 你说。'打快攻 {site}。五个人一起冲。赌他们没想到我们穷成这样还敢冲。'\n\n" +
          "队长点头：'收到。全员 {site}。'\n\n" +
          "下局——五个人强起。两把 AK 没甲，三把手枪。冲了 {site}。\n\n" +
          "{rival_team} 的防守在 {site} 只有一个人——他没想到你们会冲。被 {player} 的 AK 收了。捡枪——{rookie_name} 有了步枪。\n\n" +
          "赢了。经济翻转了。",
        effect: { tactics: 5, firepower: 2, morale: 4, momentum: 5, economy: 3, tactical_control: 3 },
        delta: "战术执行 +5 · 士气 +4 · momentum +5 · 经济 +3",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：ECO 就 ECO，别慌，下局翻盘",
        feedback:
          "'ECO。' 你说。'这把送了。别慌。'\n\n" +
          "{player} 有点不甘：'教练，都 0-3 了还 ECO？'\n\n" +
          "'0-4 和 0-3 有区别吗？' 你说。'但如果这把 ECO 了，下把全买——我们能翻。如果这把强起输了——下把还是 ECO。下下把还是。'\n\n" +
          "你看着他们：'相信我。ECO 不是放弃——是攒大招。'\n\n" +
          "下局——五把手枪出门。输了。但下一局——全员满装备。{player} 的 AK 打穿了 {rival_team} 的防线。1-4。翻盘开始了。",
        effect: { economy: 6, discipline: 4, morale: -1, condition: 2, tactical_control: 2 },
        delta: "经济 +6 · 纪律 +4 · 士气 -1 · 战术控制 +2",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：强起但按规矩打，别各打各的",
        feedback:
          "'强起。但——按规矩打。' 你说。'不许单摸。不许前压。不许赌英雄枪。五个人一起走，一起打。'\n\n" +
          "强起局最容易出的问题——不是装备差，是心态乱。没钱了就慌，慌了就各打各的。\n\n" +
          "你用纪律锁住了慌。下局——五个人强起，但打得像全买一样稳。补枪到位，走位标准。\n\n" +
          "赢了。不是靠装备——是靠纪律。",
        effect: { discipline: 6, tactics: 3, morale: 3, economy: 1, momentum: 3, cohesion: 2 },
        delta: "纪律 +6 · 战术执行 +3 · momentum +3 · 凝聚力 +2",
      },
      {
        choice: "skip",
        label: "不叫——让他们自己决定",
        feedback:
          "你没叫暂停。你没替他们做这个决定。\n\n" +
          "'你们自己决定。' 你在语音里说。'强起还是 ECO——你们商量。'\n\n" +
          "语音里沉默了五秒。然后队长开口：'ECO。下把全买。'\n\n" +
          "你没插手。但你知道——他们自己做的决定，执行起来比你的命令更坚决。\n\n" +
          "代价是：如果他们选错了——强起输了——你没有暂停可以救。",
        effect: { cohesion: 3, morale: 1, economy: 2, tactical_control: -1 },
        delta: "凝聚力 +3 · 经济 +2 · 暂停保留",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 5. 战术被读透
  // ════════════════════════════════════════════
  {
    trigger: "being_read",
    title: "被读透了",
    situation:
      "三个回合了。你的默认控图每次都在同一个时间点被对手的前压打断。不是巧合——{rival_team} 的指挥显然研究过你们的录像。\n\n" +
      "GAMEPLAY 说：'隐藏的策略惩罚是被禁止的。' 所以你知道了——你的习惯被读了。\n\n" +
      "你的队长在语音里越来越焦躁：'他们怎么知道我们要打 B？每次都在 B 等着！'",
    atmosphere:
      "你叫了暂停。走到白板前，画了你们过去三局的开局路线。\n\n" +
      "三条线——全是同一条。你自己都看出来了。何况对手？",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：彻底改变默认打法",
        feedback:
          "'从现在开始——默认控图作废。' 你在白板上画了一条新路线。'下局——变速。快慢结合。让他们不知道你们什么时候会冲。'\n\n" +
          "队长皱眉：'变速我们没练过几次——'\n\n" +
          "'没练过才要打。他们读的是你们的旧习惯。新习惯——他们没数据读。'\n\n" +
          "下局——变速。前三十秒慢控图，后三十秒突然快攻。{rival_team} 的前压扑了个空。{player} 在 {site} 收了两个回防的。赢了。",
        effect: { tactics: 6, tactical_control: 5, discipline: 2, morale: 3, momentum: 3, firepower: 1 },
        delta: "战术执行 +6 · 战术控制 +5 · momentum +3",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：别因为被读了就慌",
        feedback:
          "'他们读了你们的习惯——不是读了你们的心。' 你说。'别慌。被读不等于输。'\n\n" +
          "{player} 的手松了一点。\n\n" +
          "'下局——还是打你们的。但加一个变奏。不需要全改——只需要一个细节不一样。让他们以为变了，其实没变。让他们猜。'\n\n" +
          "下局——你们打了默认，但第二个回合突然转点。{rival_team} 以为还是老套路——扑了个空。",
        effect: { morale: 4, tactics: 3, condition: 2, tactical_control: 3, cohesion: 2, momentum: 2 },
        delta: "士气 +4 · 战术执行 +3 · 战术控制 +3",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：用执行力硬吃，不靠套路",
        feedback:
          "'别想战术了。' 你说。'他们读了你们的战术——那就别用战术。用执行力。'\n\n" +
          "'什么叫用执行力？' 队长问。\n\n" +
          "'就是——每个走位做到极致。每个补枪做到最快。每个预瞄做到最准。不靠套路赢——靠基本功赢。他们读了你们的套路——但读不了你们的枪法。'\n\n" +
          "下局——没战术。就是五个人凭基本功打。{player} 的对枪赢了，{veteran_name} 的补枪到了。赢了。不是赢在战术——是赢在枪。",
        effect: { discipline: 5, firepower: 4, tactics: -1, morale: 3, momentum: 2, cohesion: 2 },
        delta: "纪律 +5 · 火力 +4 · 士气 +3 · 战术执行 -1",
      },
      {
        choice: "skip",
        label: "不叫——让对手以为我们没发现",
        feedback:
          "你没叫暂停。\n\n" +
          "你知道被读了。但——如果你现在改，对手知道你发现了。下次他们就更小心。\n\n" +
          "你赌的是：再让他们读一局。让他们以为你们没发现。然后——在关键回合突然变。那时候他们的反制全部落空。\n\n" +
          "代价是：这一局大概率输。你在用一局的代价换一个更大的陷阱。",
        effect: { morale: -2, momentum: -2, tactics: -1, tactical_control: -2 },
        delta: "士气 -2 · momentum -2 · 暂停保留 · 陷阱布置中",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 6. 关键回合前——赛点压力
  // ════════════════════════════════════════════
  {
    trigger: "key_round_pressure",
    title: "赛点",
    situation:
      "2-2。最后一局。赛点。\n\n" +
      "整个场馆的空气都凝固了——一万两千人同时屏住呼吸。你的五个人在语音里沉默——不是没话说，是所有话都说完了。现在只剩这一个回合。\n\n" +
      "你的队长看向你。等你最后一句话。\n\n" +
      "你还剩一次暂停。现在用——还是留到... 没有'留到'了。这是最后一局。",
    atmosphere:
      "你叫了暂停。最后一次。\n\n" +
      "五个人围过来。没有人说话。等你。",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：打他们最怕的战术",
        feedback:
          "你在白板上画了一个战术——你们这赛季只用过一次的战术。\n\n" +
          "'还记得这个吗？' 你问。\n\n" +
          "队长点头：'S1 科隆用过。赢了。'\n\n" +
          "'{rival_team} 不会想到我们在赛点用这个。他们以为我们会稳。' 你说。'让他们错。'\n\n" +
          "下局——那个战术。{player} 突破，{veteran_name} 道具，{rookie_name} 补枪。每个人都知道自己的位置。\n\n" +
          "执行——完美。{rival_team} 没反应过来。C4 安放。架枪。赢。\n\n" +
          "3-2。比赛赢了。",
        effect: { tactics: 7, discipline: 4, morale: 5, momentum: 6, firepower: 2, cohesion: 3, tactical_control: 4 },
        delta: "战术执行 +7 · 士气 +5 · momentum +6 · 凝聚力 +3",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：'忘了 2-2。这是新比赛。'",
        feedback:
          "'忘了 2-2。' 你说。'忘了前四局。忘了比分。'\n\n" +
          "五个人看着你。\n\n" +
          "'这是新比赛。先到 1 分的赢。只有一个回合。一个。'\n\n" +
          "你看着他们的眼睛——一个一个看。\n\n" +
          "'你们害怕。我知道。我也怕。但害怕不是坏事——害怕说明你在乎。把在乎变成枪。下局——打你们最熟的。别加新东西。用你们最自信的方式打。'\n\n" +
          "{player} 深吸一口气。{veteran_name} 点头。\n\n" +
          "下局——他们打了最标准的默认。没有花哨。没有赌。就是基本功。赢了。",
        effect: { morale: 6, condition: 4, discipline: 4, cohesion: 4, tactics: 2, momentum: 4 },
        delta: "士气 +6 · 状态 +4 · 纪律 +4 · 凝聚力 +4",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：'不许浪。不许赌。标准执行。'",
        feedback:
          "'下局——不许浪。不许赌英雄枪。不许单摸。不许前压。'\n\n" +
          "你的语气比任何时候都重。\n\n" +
          "'这是最后一个回合。一个失误就是整场比赛。所以——标准执行。走位、补枪、报点——全部按训练来。别自己加戏。'\n\n" +
          "队长点头：'收到。所有人——按规矩来。'\n\n" +
          "下局——五个人打了一个教科书式的回合。零失误。{rival_team} 在你们的纪律面前找不到任何破绽。赢了。\n\n" +
          "不是赢在天赋——是赢在不犯错。",
        effect: { discipline: 7, tactics: 4, morale: 3, cohesion: 3, momentum: 3, tactical_control: 3 },
        delta: "纪律 +7 · 战术执行 +4 · 凝聚力 +3 · momentum +3",
      },
      {
        choice: "skip",
        label: "不叫——这一局靠他们自己",
        feedback:
          "你没叫暂停。\n\n" +
          "你走到队长面前。拍了拍他的肩。\n\n" +
          "'你的。' 你说。'这一局——你叫。'\n\n" +
          "他愣了。然后——嘴角动了一下。不是笑，是那种'被信任了'的微表情。\n\n" +
          "'收到。' 他说。然后转向队友：'下局——默认控图转 B。我打突破。{player} 补枪。{veteran_name} 道具。{rookie_name} 回防。'\n\n" +
          "他把暂停留给了自己。把指挥权——握得更紧了。\n\n" +
          "下局——他们自己叫的战术。自己打的。赢了。\n\n" +
          "你站在后面。没说话。但你的眼眶——有点热。",
        effect: { cohesion: 7, morale: 5, discipline: 3, firepower: 2, momentum: 4, tactics: 2 },
        delta: "凝聚力 +7 · 士气 +5 · momentum +4 · 暂停未使用",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 7. 沟通断裂
  // ════════════════════════════════════════════
  {
    trigger: "communication_break",
    title: "沟通断裂",
    situation:
      "刚才那个回合，两个人同时报了不同的敌人位置，指挥喊的战术被淹没在交叉报点里。结果是——B 点三个人架同一个角度，A 点空了。\n\n" +
      "回合结束的时候，语音里有人在互相抱怨：'你报的点不对！' '你为什么不补枪？'\n\n" +
      "沟通断了。不是技术问题——是情绪问题。他们在互相指责。",
    atmosphere:
      "你叫了暂停。走到他们中间。\n\n" +
      "'都闭嘴。' 你说。'现在——听我说。'",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：简化报点规则",
        feedback:
          "'从现在开始——报点只报位置，不报判断。' 你说。'别再说“他在 B，我觉得他要转 A”。只说“B 有两个”。判断是我的活。'\n\n" +
          "队长点头：'收到。所有人——只报位置。'\n\n" +
          "下局——语音干净了。'A 小一个。' 'B 两个。' '中路没人。' 清晰、简短、有效。\n\n" +
          "指挥的战术指令第一次没有被淹没。赢了。",
        effect: { tactics: 5, discipline: 4, cohesion: 3, tactical_control: 4, morale: 2 },
        delta: "战术执行 +5 · 纪律 +4 · 凝聚力 +3 · 战术控制 +4",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：别互相指责，一起扛",
        feedback:
          "'刚才那个回合——不是谁的错。是所有人的错。' 你说。'报点混乱是所有人的事。补枪不到位是所有人的事。别互相指——一起扛。'\n\n" +
          "{player} 和 {rookie_name} 对视了一眼——刚才在吵架的两个人。\n\n" +
          "{player} 先开口：'……我的。我报点太啰嗦了。'\n\n" +
          "{rookie_name} 摇头：'我的。我没听清。'\n\n" +
          "你点头。'好。过去了。下局——一起打。'\n\n" +
          "下局——他们配合得像换了一支队伍。",
        effect: { cohesion: 6, morale: 4, discipline: 3, tactics: 2, condition: 2, tactical_control: 2 },
        delta: "凝聚力 +6 · 士气 +4 · 纪律 +3",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：指挥独占战术频道",
        feedback:
          "'从现在开始——只有队长能叫战术。其他人只报“敌人在 X”。'\n\n" +
          "有人想抗议——'那我们看到的判断——'\n\n" +
          "'报位置就够了。判断由队长做。' 你说。'这不是不信任你们——是减少噪音。五个人的判断加在一起——就是混乱。一个人的判断——是秩序。'\n\n" +
          "下局——语音里只有队长的声音和简洁的位置报点。清晰。有效。赢了。",
        effect: { discipline: 5, tactics: 4, tactical_control: 4, cohesion: -1, morale: 1, firepower: 1 },
        delta: "纪律 +5 · 战术执行 +4 · 战术控制 +4 · 凝聚力 -1",
      },
      {
        choice: "skip",
        label: "不叫——让他们自己吵清楚",
        feedback:
          "你没叫暂停。\n\n" +
          "语音里的争吵还在继续。你站在后面，没插手。\n\n" +
          "职业选手都是成年人。他们要么自己解决——要么不解决。你叫了暂停，他们听你的话——但心里的刺还在。你不叫——他们自己吵，吵完了反而更团结。\n\n" +
          "代价是：如果吵不出来——下一局更崩。",
        effect: { cohesion: -3, discipline: -2, morale: -2, tactics: -1 },
        delta: "凝聚力 -3 · 纪律 -2 · 士气 -2 · 暂停保留",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 8. 明星选手状态冰凉
  // ════════════════════════════════════════════
  {
    trigger: "star_cold",
    title: "明星冰凉",
    situation:
      "{star_player_name} 今天 KD 是 0.4。对枪输了三次，有一个 ECO 局被手枪爆头。\n\n" +
      "解说员在说：'{star_player_name} 今天状态不在。' 他的队友在语音里没提——但沉默比话语更重。\n\n" +
      "他是你们的核心火力。他冰了——整支队伍的火力就缺了一半。你现在必须决定：是帮他找回状态，还是绕开他打。",
    atmosphere:
      "你走到 {star_player_name} 身后。他没回头——但你知道他感觉到了你在。\n\n" +
      "他的鼠标在垫子上无意识地滑着。这是他紧张的小动作。",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：换他的位置，让他打舒服的角度",
        feedback:
          "'{star_player_name}。' 你说。'下局你不打突破了。打架枪位。'\n\n" +
          "他转过头——眼神复杂。'教练，我——'\n\n" +
          "'你今天对枪输了四次。不是你不行——是今天这个对手的 prefire 太准。别跟他拼反应。打你舒服的角度——架枪位。让他来找你。'\n\n" +
          "他咬了咬牙。'……行。'\n\n" +
          "下局——他打架枪位。{opponent} 来找他的时候——{star_player_name} 的 {weapon} 已经架在那里了。两发，倒。他的眼神——亮了一点。",
        effect: { tactics: 4, firepower: 2, morale: 3, condition: 2, tactical_control: 3, cohesion: 2 },
        delta: "战术执行 +4 · 火力 +2 · 士气 +3 · 状态 +2",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：'你不是变弱了。你是开始怕了。'",
        feedback:
          "你蹲下来，跟 {star_player_name} 平视。\n\n" +
          "'你不是变弱了。' 你说。'你是开始怕了。'\n\n" +
          "他愣了。\n\n" +
          "'怕是好事。说明你在乎。以前你什么都不怕——因为你没什么可输的。现在你怕了——因为你已经有了该守住的东西。'\n\n" +
          "他吞咽了一下。\n\n" +
          "'下局——别想状态。别想 KD。就想下一个回合。下一个开枪。' 你拍了他的肩。'我信你。'\n\n" +
          "下局——他打出了一个三杀。不是天赋——是放下了恐惧之后的专注。",
        effect: { morale: 5, firepower: 4, condition: 3, cohesion: 3, momentum: 3, tactics: 1 },
        delta: "士气 +5 · 火力 +4 · 状态 +3 · momentum +3",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：别追 KD，做该做的事",
        feedback:
          "'{star_player_name}。' 你的语气很平。'下局——你的任务不是杀人。是补枪。'\n\n" +
          "他皱眉：'补枪？我——'\n\n" +
          "'你今天追了三次对枪，输了三次。每次都是你想首杀——但今天你的首杀不在线。下局——别追首杀。跟在 {veteran_name} 后面。他打谁你打谁。零压力。'\n\n" +
          "他不太情愿。但他点头了。\n\n" +
          "下局——他没拿到首杀。但他补了两个枪。零死亡。KD 不是靠追来的——是靠活着来的。",
        effect: { discipline: 5, tactics: 3, morale: 1, firepower: 1, cohesion: 2, condition: 1 },
        delta: "纪律 +5 · 战术执行 +3 · 凝聚力 +2",
      },
      {
        choice: "skip",
        label: "不叫——让其他人站出来",
        feedback:
          "你没叫暂停。你没去安慰 {star_player_name}。\n\n" +
          "你走到队长面前：'{star_player_name} 今天冰了。下局——不围绕他打。让 {player} 打核心。'\n\n" +
          "队长点头：'收到。'\n\n" +
          "你没帮 {star_player_name} 找状态——你绕开了他。让其他人站出来。\n\n" +
          "代价是：{star_player_name} 的信心可能进一步崩塌。但如果有其他人能赢这局——他就有时间自己恢复。",
        effect: { firepower: -2, morale: -1, cohesion: -1, tactics: 2, momentum: 1 },
        delta: "火力 -2 · 士气 -1 · 凝聚力 -1 · 暂停保留",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 9. 大好局面被翻——势头逆转
  // ════════════════════════════════════════════
  {
    trigger: "momentum_swing_lost",
    title: "被翻盘了",
    situation:
      "上半场 12-3。你以为是碾压局。但下半场开始，{rival_team} 换了个防守体系，你们的进攻突然不灵了。\n\n" +
      "一回合，两回合，三回合——差距在缩小。语音里开始出现急躁的声音：'他们怎么突然变强了？' '别慌别慌——' 已经有人在慌了。\n\n" +
      "12-10 了。再丢一局——12-11。再丢——加时。再丢——被翻盘。",
    atmosphere:
      "你叫了暂停。不是因为对手变强了——是因为你们在崩。\n\n" +
      "12-3 的队伍和 12-10 的队伍——是两支队伍。心态变了。",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：针对他们的新防守调整",
        feedback:
          "你在白板上画了 {rival_team} 新防守的站位。\n\n" +
          "'他们把重兵挪到中路了。B 点只有一个人。下局——打 B。别犹豫。'\n\n" +
          "队长皱眉：'他们会不会又在 B 堆人？'\n\n" +
          "'不会。他们刚调人到中路。来不及调回来。这是窗口期。'\n\n" +
          "下局——快攻 B。{rival_team} 的中路防守来不及回防。{player} 在 B 点下包。赢了。13-10。势头——回来了。",
        effect: { tactics: 6, tactical_control: 5, discipline: 3, morale: 4, momentum: 4, firepower: 1 },
        delta: "战术执行 +6 · 战术控制 +5 · 士气 +4 · momentum +4",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：'忘了 12-3。现在是从零开始。'",
        feedback:
          "'忘了 12-3。' 你说。'忘了上半场。'\n\n" +
          "五个人看着你。\n\n" +
          "'你们在怕。怕被翻盘。怕成为那个被翻盘的笑话。' 你说。'但怕没用。怕不会帮你赢——只会帮你输得更快。'\n\n" +
          "'现在比分是 0-0。每一局都是新局。别想总比分——想下一个回合。'\n\n" +
          "{veteran_name} 点头：'收到。从零开始。'\n\n" +
          "下局——他们打得像 0-0 一样。没有包袱。赢了。",
        effect: { morale: 5, condition: 3, discipline: 3, cohesion: 3, momentum: 3, tactics: 2 },
        delta: "士气 +5 · 状态 +3 · 纪律 +3 · momentum +3",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：别急，打最稳的战术",
        feedback:
          "'你们在急。急了就犯错。' 你说。'下局——打最稳的默认。别加新东西。别赌。别浪。'\n\n" +
          "'可是他们读了我们的默认——'\n\n" +
          "'他们读的是你们急的时候的默认。你们不急——默认就是最强的。'\n\n" +
          "下局——五个人打了一个教科书式的默认控图。零失误。{rival_team} 在你们的纪律面前找不到破绽。赢了。\n\n" +
          "12-3 的优势不是靠浪保住的——是靠不犯错保住的。",
        effect: { discipline: 6, tactics: 3, morale: 2, cohesion: 2, momentum: 2, tactical_control: 2 },
        delta: "纪律 +6 · 战术执行 +3 · momentum +2",
      },
      {
        choice: "skip",
        label: "不叫——让他们自己扛住压力",
        feedback:
          "你没叫。\n\n" +
          "12-10。你没叫暂停。你站在后面，看着他们在语音里互相喊。\n\n" +
          "你在赌——赌他们能在压力下自己稳住。如果他们能自己扛住 12-10 的压力——那之后的 momentum 比叫了暂停更大。\n\n" +
          "代价是：如果他们没扛住——12-11，12-12，加时，甚至被翻盘。你口袋里的暂停——救不了已经崩的心态。",
        effect: { morale: -3, momentum: -3, discipline: -2, cohesion: -1, tactics: -1 },
        delta: "士气 -3 · momentum -3 · 纪律 -2 · 暂停保留",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 10. 残局失败后
  // ════════════════════════════════════════════
  {
    trigger: "clutch_failure",
    title: "残局输了",
    situation:
      "1v2。{player} 差一点就赢了。第一杀了。第二个人——他的子弹打偏了。0.3 秒。0.3 秒的偏差就是一条命。\n\n" +
      "他现在坐在椅子上，盯着灰色的屏幕。'阵亡'两个字浮在画面中央。没动。\n\n" +
      "队友在语音里说'没事''下一把'——但那些安慰像石头扔进棉花里。没声音。\n\n" +
      "残局输了的痛——不是比分的痛。是'我差一点'的痛。",
    atmosphere:
      "你叫了暂停。走到 {player} 身后。\n\n" +
      "他没回头。但你知道他在等——等你说点什么。",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：'不是你的错。是战术没给你足够的信息。'",
        feedback:
          "'不是你的错。' 你说。'你拿到的信息不够。你不知道第二个人在哪——是我们的战术没给你足够的支撑。'\n\n" +
          "{player} 抬头看你。\n\n" +
          "'下局——我们改侦察流程。你打残局的时候，会有更多声音告诉你对手在哪。你不需要猜。'\n\n" +
          "他的肩膀——松了一点。不是自己的错了。这个认知比任何安慰都管用。\n\n" +
          "下局——他打了又一个残局。这次——赢了。因为信息够了。",
        effect: { tactics: 5, morale: 4, condition: 3, cohesion: 3, tactical_control: 3, firepower: 1 },
        delta: "战术执行 +5 · 士气 +4 · 状态 +3 · 凝聚力 +3",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：'你差一点。差一点不是差很多。'",
        feedback:
          "你蹲下来。\n\n" +
          "'你差一点。' 你说。'0.3 秒。一颗子弹的偏差。'\n\n" +
          "{player} 闭眼。\n\n" +
          "'差一点不是差很多。差一点说明——你能赢。你只是差一点。下局——你会差得更少。再下局——你就赢了。'\n\n" +
          "他睁开眼。眼眶是红的——但不是绝望的红。是那种'我不甘心'的红。\n\n" +
          "'下局——再来一个残局。' 他说。\n\n" +
          "你点头。'来。'",
        effect: { morale: 5, firepower: 3, condition: 3, cohesion: 2, momentum: 2, tactics: 1 },
        delta: "士气 +5 · 火力 +3 · 状态 +3 · momentum +2",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：'别追残局。下局跟队伍走。'",
        feedback:
          "'下局——别追残局。' 你说。\n\n" +
          "{player} 皱眉：'什么意思？'\n\n" +
          "'你的残局能力没问题。但你现在的状态——在追。你想证明上一局不是你的错。这个心态——会让你在下一个残局里更急。更急——更输。'\n\n" +
          "'下局——跟队伍走。别让自己进残局。如果进了——别想赢，想活。活着就有机会。'\n\n" +
          "他不太情愿。但他知道你是对的——他在追。\n\n" +
          "下局——他没进残局。因为跟队伍走，赢了。没需要残局。",
        effect: { discipline: 5, tactics: 3, morale: 2, cohesion: 3, firepower: 1, condition: 1 },
        delta: "纪律 +5 · 战术执行 +3 · 凝聚力 +3",
      },
      {
        choice: "skip",
        label: "不叫——让他自己消化",
        feedback:
          "你没叫暂停。\n\n" +
          "{player} 坐在椅子上，盯着灰色屏幕。你没走过去。\n\n" +
          "有些痛——需要时间。你叫了暂停，说了安慰的话，他可能好一点。但那种'我自己扛过来了'的韧性——只有在没人安慰的时候才会长出来。\n\n" +
          "你站在后面。等他自己抬起头。\n\n" +
          "三十秒后——他动了。把鼠标摆正。戴好耳机。'下局。' 他说。\n\n" +
          "他自己走出来了。",
        effect: { morale: -2, condition: -1, discipline: 1, cohesion: -1, firepower: -1 },
        delta: "士气 -2 · 状态 -1 · 暂停保留 · 自我修复中",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 11. 客场观众压力
  // ════════════════════════════════════════════
  {
    trigger: "crowd_hostility",
    title: "客场",
    situation:
      "这是 {rival_team} 的主场。他们的观众席坐满了人——每一次你们的失误都换来震耳欲聋的欢呼。\n\n" +
      "你的选手在隔音棚里，但低频的震动还是穿过来了。{rookie_name} 的手在抖——他第一次打客场。{player} 开始频繁看观众席——分心了。\n\n" +
      "他们的声音——不是加油。是嘘。是倒彩。是'你们不行'的声浪。",
    atmosphere:
      "你叫了暂停。走到隔音棚门口——那里的噪音最大。\n\n" +
      "你站在那里，背对着观众席。让噪音打在你的背上——而不是选手的背上。",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：'让他们闭嘴的唯一方式是赢'",
        feedback:
          "'想让他们安静吗？' 你问。'赢。'\n\n" +
          "你没安慰他们被嘘的感受。你用最直接的方式——赢就是答案。\n\n" +
          "'下局——快攻 {site}。打得凶。让他们没时间喊。' 你说。'赢一局——他们安静一局。赢两局——他们开始慌。赢三局——他们闭嘴。'\n\n" +
          "下局——快攻。{player} 冲进 {site}，{weapon} 扫了两个。观众席——安静了一秒。\n\n" +
          "那一秒的安静——比任何欢呼都爽。",
        effect: { firepower: 4, morale: 5, momentum: 4, discipline: -1, cohesion: 2, tactics: 2 },
        delta: "火力 +4 · 士气 +5 · momentum +4",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：'屏蔽他们。只听我的声音。'",
        feedback:
          "'降噪耳机调到最大。' 你说。'只听我的声音。别的——当不存在。'\n\n" +
          "你让每个人把耳机调到最大降噪。观众的声音变成了低沉的白噪音。\n\n" +
          "'他们喊的是名字——不是胜利。' 你说。'赢了他们才真的会记住你。现在——他们只是噪音。'\n\n" +
          "{rookie_name} 的手不抖了。{player} 不再看观众席。\n\n" +
          "下局——专注度回来了。赢了。",
        effect: { discipline: 4, morale: 3, condition: 3, tactics: 2, tactical_control: 3, cohesion: 2 },
        delta: "纪律 +4 · 状态 +3 · 士气 +3 · 战术控制 +3",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：慢节奏消耗观众耐心",
        feedback:
          "'下局——打慢。' 你说。'控图、拖延、到最后十秒才进攻。'\n\n" +
          "队长皱眉：'慢？他们主场——慢不是更被动？'\n\n" +
          "'慢会让观众焦躁。焦躁的观众会嘘——但嘘久了会累。累了的观众——声音小了。'\n\n" +
          "你用节奏打乱的不仅是对手——还有观众。\n\n" +
          "下局——慢节奏。观众开始倒彩。但到了第二十分钟——倒彩声小了。他们累了。\n\n" +
          "而你们的选手——在慢节奏里找到了专注。",
        effect: { tactics: 4, discipline: 4, morale: 1, firepower: -1, momentum: 1, tactical_control: 2 },
        delta: "战术执行 +4 · 纪律 +4 · momentum +1",
      },
      {
        choice: "skip",
        label: "不叫——让他们学会在噪音里打",
        feedback:
          "你没叫暂停。\n\n" +
          "噪音还在。{rookie_name} 还在抖。你没走过去。\n\n" +
          "客场比赛——是每个职业选手都要学的课。你帮不了他一辈子。他得自己学会在嘘声里开枪。\n\n" +
          "代价是：这一局可能输。但如果你不帮——他要么自己学会，要么永远学不会。\n\n" +
          "你赌的是他的成长速度。",
        effect: { morale: -3, condition: -2, discipline: -1, cohesion: -1, firepower: -1 },
        delta: "士气 -3 · 状态 -2 · 暂停保留",
      },
    ],
  },

  // ════════════════════════════════════════════
  // 12. 决赛前最后调整
  // ════════════════════════════════════════════
  {
    trigger: "final_approach",
    title: "决赛前",
    situation:
      "这是决赛。{cup_name} 的决赛。\n\n" +
      "场馆里一万两千人——一半在喊 {team}，一半在喊 {rival_team}。灯光打在舞台上，你能看到空气中漂浮的灰尘。\n\n" +
      "你的五个人坐在隔音棚里。还没开始——但空气已经在压了。{veteran_name} 在看自己的手。{rookie_name} 的耳机戴反了——没人告诉他。\n\n" +
      "这是你最后的机会。暂停——用还是不用？",
    atmosphere:
      "你叫了暂停。不是为了讲战术——战术讲完了。是为了——让他们看你一眼。\n\n" +
      "你站在五个人面前。没说话。只是——看着他们。",
    choices: [
      {
        choice: "tactical_reset",
        label: "战术重置：'打我们最熟的。别加新东西。'",
        feedback:
          "'决赛——别加新东西。' 你说。'打你们最熟的。打了一百次的默认。练了一千次的补枪。'\n\n" +
          "队长点头：'收到。标准执行。'\n\n" +
          "'他们会有新东西。' 你说。'但我们用基本功吃。他们新——我们稳。稳赢新。'\n\n" +
          "决赛的第一局——你们打了最标准的默认。{rival_team} 试了一个新战术——但你们的执行力碾压了他们的新意。赢了。\n\n" +
          "基调定下了。",
        effect: { tactics: 5, discipline: 5, morale: 4, cohesion: 4, momentum: 3, tactical_control: 3 },
        delta: "战术执行 +5 · 纪律 +5 · 士气 +4 · 凝聚力 +4",
      },
      {
        choice: "emotional_reset",
        label: "情绪重置：'这是你们的舞台。享受它。'",
        feedback:
          "'看那些人。' 你指了指观众席。'一万两千人。他们来看你们。'\n\n" +
          "五个人转头看。\n\n" +
          "'这是你们的舞台。不是考场——是舞台。享受它。' 你说。'不管输赢——这一刻属于你们。别让紧张偷走这一刻。'\n\n" +
          "{rookie_name} 把耳机戴正了。{veteran_name} 不再看自己的手——他在看观众。\n\n" +
          "{star_player_name} 笑了——那种'我等这一刻等了很久'的笑。\n\n" +
          "决赛开始——他们打得像在享受。不像在扛。",
        effect: { morale: 7, condition: 4, cohesion: 4, firepower: 3, momentum: 4, discipline: 2 },
        delta: "士气 +7 · 状态 +4 · 凝聚力 +4 · 火力 +3 · momentum +4",
      },
      {
        choice: "discipline_reset",
        label: "纪律重置：'决赛不许犯低级错误。'",
        feedback:
          "'决赛——不许犯低级错误。' 你的语气比任何时候都重。\n\n" +
          "'不许 ECO 局强起。不许单摸送。不许补枪慢。不许报点乱。每一个走位、每一个开枪——全部按训练来。'\n\n" +
          "有人觉得你太严了——这是决赛，不是训练。\n\n" +
          "但你说：'决赛就是训练。训练了一千次的东西——在决赛里做到第一千零一次。这就是冠军。'\n\n" +
          "决赛——他们零低级失误。赢了。不是赢在天才——是赢在不犯错。",
        effect: { discipline: 7, tactics: 4, morale: 2, cohesion: 3, momentum: 3, tactical_control: 3 },
        delta: "纪律 +7 · 战术执行 +4 · 凝聚力 +3 · momentum +3",
      },
      {
        choice: "skip",
        label: "不叫——'你们准备好了。去吧。'",
        feedback:
          "你没叫暂停。\n\n" +
          "你走到五个人面前。没讲战术。没讲情绪。没讲纪律。\n\n" +
          "你只说了一句：'你们准备好了。去吧。'\n\n" +
          "然后你退到了教练席。\n\n" +
          "这是最大的信任——你把比赛交给了他们。不插手。不指挥。不暂停。\n\n" +
          "他们是你带出来的队伍。现在——让他们自己飞。\n\n" +
          "{veteran_name} 看了你一眼。你点了下头。他转向队友：'走。'\n\n" +
          "决赛——他们自己打的。赢了。",
        effect: { cohesion: 8, morale: 6, discipline: 3, firepower: 2, momentum: 5, tactics: 2 },
        delta: "凝聚力 +8 · 士气 +6 · momentum +5 · 暂停未使用",
      },
    ],
  },
];

// ──────────────────────────────────────────────
// 辅助函数
// ──────────────────────────────────────────────

/** 按触发情境筛选暂停场景 */
export function getTimeoutScenariosByTrigger(trigger: TimeoutTrigger): TimeoutScenario | undefined {
  return timeoutScenarios.find((s) => s.trigger === trigger);
}

/** 获取所有暂停场景 */
export function getAllTimeoutScenarios(): TimeoutScenario[] {
  return timeoutScenarios;
}

/** 获取某个选择类型的所有反馈（跨场景） */
export function getTimeoutFeedbackByChoice(choice: TimeoutChoice): TimeoutChoiceFeedback[] {
  return timeoutScenarios.flatMap((s) => s.choices.filter((c) => c.choice === choice));
}

/** 随机获取暂停氛围描写 */
export function getRandomTimeoutAtmosphere(seed: number): string {
  return timeoutAtmosphereLines[seed % timeoutAtmosphereLines.length];
}

/**
 * 获取某个场景下某个选择的完整反馈文本。
 *
 * @param trigger  触发情境
 * @param choice   选择类型
 * @returns        反馈对象（含文本和效果）；若不存在返回 undefined
 */
export function getTimeoutResult(
  trigger: TimeoutTrigger,
  choice: TimeoutChoice
): TimeoutChoiceFeedback | undefined {
  const scenario = getTimeoutScenariosByTrigger(trigger);
  if (!scenario) return undefined;
  return scenario.choices.find((c) => c.choice === choice);
}
