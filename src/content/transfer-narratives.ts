/**
 * 转会谈判叙事库
 *
 * 让交易达成 / 拒绝 / 还价等场景具备故事感。
 * 与 events.ts 中的 transfer_arrival_* 互补：
 *   - events.ts 关注「新选手入队后的第一天」
 *   - 本文件关注「谈判桌上发生的事」——报价、还价、达成、破裂
 *
 * 7 大场景：
 *   1. 初始报价（你买 / 别人买你）
 *   2. 还价拉锯
 *   3. 交易达成（明星 / 新秀 / 老将 / 互换 / 捡漏）
 *   4. 交易破裂（价格 / 选手 / 队伍 / 截胡 / 老板）
 *   5. 选手本人反应（愿走 / 不愿 / 犹豫）
 *   6. 队内反应（卖队友 / 买新人）
 *   7. 谈判氛围（电话 / 线下 / 拖延 / 最后通牒）
 *
 * 设计原则：
 *   - 多变体（每场景至少 3-5 个），引擎按 seed 选取避免重复
 *   - 中文武侠/江湖意象 + 现代电竞话术的混合风格
 *   - 变量槽位：{player_name} {rival_team} {rival_coach} {your_team} {fee} {counter_fee} 等
 *   - 玩家身份中立（不假设年龄 / 性别 / 资历）
 *   - CS 机制合规（不写「趴下」等违规动作）
 *   - 与现有 transfer_arrival_* 事件配合：先谈判 → 达成 → 入队事件
 *
 * 对齐文档：
 *   - docs/product-specs/ROSTER.md    — 5 首发 + 1 替补
 *   - docs/product-specs/MECHANICS.md — 转会竞价事件化
 *   - src/content/events.ts           — transfer_arrival_* 入队后续
 */

import type { EventEffect } from "./events.js";

// ──────────────────────────────────────────────
// 类型定义
// ──────────────────────────────────────────────

/** 玩家在本次谈判中的角色 */
export type TransferRole = "buyer" | "seller";

/** 被谈判选手的级别 */
export type PlayerTier =
  | "star"          // 明星选手（firepower >= 85）
  | "veteran"       // 老将（年龄 >= 28）
  | "rookie"        // 新秀（年龄 <= 21）
  | "role_player"   // 即战力角色选手
  | "substitute";   // 替补

/** 谈判阶段——决定从哪个池取对话 */
export type NegotiationPhase =
  | "opening_bid"         // 初始报价
  | "counteroffer"        // 还价拉锯
  | "deal_closed"         // 交易达成
  | "deal_broken"         // 交易破裂
  | "player_willing"      // 选手愿走
  | "player_reluctant"    // 选手不愿走
  | "player_hesitant"     // 选手犹豫
  | "team_sell_reaction"  // 队内反应——卖掉队友
  | "team_buy_reaction"   // 队内反应——买来新人
  | "atmosphere";         // 氛围描写

/** 谈判上下文——填充变量槽位与剧情分支 */
export interface TransferContext {
  role: TransferRole;
  playerTier: PlayerTier;
  playerName: string;
  rivalTeam: string;
  rivalCoach: string;
  yourTeam: string;
  /** 报价金额（描述用，例如「80万美金」） */
  fee?: string;
  /** 还价金额 */
  counterFee?: string;
  /** 是否为最后通牒 */
  isFinalOffer?: boolean;
  /** 紧张程度——影响氛围描写选取 */
  tensionLevel?: "low" | "medium" | "high";
  /** 互换交易中的对方筹码选手 */
  swapPlayerName?: string;
}

/** 单条对话——说话人 + 文本 + 可选情感 */
export interface TransferLine {
  speaker: "you" | "rival_coach" | "player" | "team_member" | "narrator";
  text: string;
  emotion?: "calm" | "tense" | "warm" | "cold" | "triumph" | "defeat" | "amused";
}

/** 一组对话——对应一次谈判回合 */
export interface TransferDialogueSet {
  phase: NegotiationPhase;
  /** 此组对话适用的上下文条件（用于过滤） */
  context: Partial<TransferContext>;
  lines: TransferLine[];
  /** 可选：达成时的引擎效果（仅 deal_closed / deal_broken 阶段有意义） */
  effect?: EventEffect;
}

// ──────────────────────────────────────────────
// 1. 初始报价——买方视角（玩家想买对方选手）
// ──────────────────────────────────────────────

const buyerOpeningDialogues: TransferDialogueSet[] = [
  {
    phase: "opening_bid",
    context: { role: "buyer", playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "你拨通了 {rival_coach} 的电话。响了三声——他接了。" },
      { speaker: "you", text: `'{rival_coach}，开门见山——{player_name}，我要。开个价。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `电话那头沉默了两秒。'……你倒是直接。'`, emotion: "amused" },
      { speaker: "rival_coach", text: `'你知道这孩子的分量。我也知道。价不会低。'`, emotion: "cold" },
      { speaker: "narrator", text: "电话挂了。半小时后——一条短信：数字。比你想的高，但没高到离谱。" },
    ],
  },
  {
    phase: "opening_bid",
    context: { role: "buyer", playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "你在赛事酒会的走廊里拦住了 {rival_coach}。他手里端着一杯没动过的香槟。" },
      { speaker: "you", text: `'聊个事？'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'聊。'`, emotion: "calm" },
      { speaker: "you", text: `'{player_name}。我们出价。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `他笑了——那种「我就知道你会来」的笑。'走廊不是谈这个的地方。明天上午十点，我办公室。'`, emotion: "amused" },
      { speaker: "narrator", text: "他拍了拍你的肩，转身走了。香槟还端在手里，一口没喝。" },
    ],
  },
  {
    phase: "opening_bid",
    context: { role: "buyer", playerTier: "rookie" },
    lines: [
      { speaker: "narrator", text: "你看上了 {rival_team} 青训的那个小孩。{player_name}——还没满二十，二线联赛的数据已经吓人。" },
      { speaker: "you", text: `'{rival_coach}，你们青训的 {player_name}——一线队今年没他的位置吧？'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'……你消息挺灵。'`, emotion: "cold" },
      { speaker: "you", text: `'借一步说话？'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'借十步也行。但他还没打出来——我们要价不会按「潜力」算。按「未来」，你懂。'`, emotion: "tense" },
      { speaker: "narrator", text: "你懂。买新秀赌的就是未来。赌赢了血赚，赌输了——没人记得你曾经慧眼识珠。" },
    ],
  },
  {
    phase: "opening_bid",
    context: { role: "buyer", playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: "{rival_team} 那边动荡——老将 {player_name} 被传要被清理。你知道他的油箱里还有油。" },
      { speaker: "you", text: `'{rival_coach}，听说你们 {player_name} 的事了。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'……听谁说的？'`, emotion: "cold" },
      { speaker: "you", text: `'不重要。重要的是——他要是真要走，我接。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `对方沉默了好一会儿。'他这个年纪……你还敢接？'`, emotion: "tense" },
      { speaker: "you", text: `'他的脑子比他的枪更值钱。我接的就是脑子。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'……行。明天给你回话。'`, emotion: "amused" },
    ],
  },
  {
    phase: "opening_bid",
    context: { role: "buyer", playerTier: "role_player" },
    lines: [
      { speaker: "narrator", text: "你要补一个角色选手——能架枪、能听指挥、不要球权。{rival_team} 的 {player_name} 正合适。" },
      { speaker: "you", text: `'{rival_coach}，{player_name} 你们用得上吗？'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'用得上——但不是不可替代。'`, emotion: "amused" },
      { speaker: "you", text: `'那就好谈。开价吧。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'公道价。不坑你，也不便宜你。'`, emotion: "calm" },
      { speaker: "narrator", text: "公道价——这是转会市场里最体面的开局。" },
    ],
  },
];

// ──────────────────────────────────────────────
// 2. 初始报价——卖方视角（别人来买你选手）
// ──────────────────────────────────────────────

const sellerOpeningDialogues: TransferDialogueSet[] = [
  {
    phase: "opening_bid",
    context: { role: "seller", playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "杯赛结束第三天，一个陌生号码打进你的手机。{rival_coach}——{rival_team} 的主教练。" },
      { speaker: "rival_coach", text: `'{player_name}，我们想要。开个价。'`, emotion: "cold" },
      { speaker: "narrator", text: "你握着手机，看了一眼训练室——{player_name} 正戴着耳机练枪。屏幕里，他刚打出了一发干净利落的首杀。" },
      { speaker: "you", text: `'{player_name} 是非卖品。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'这世上没有非卖品——只有价码不够。'`, emotion: "amused" },
      { speaker: "you", text: `'那就证明给我看。'`, emotion: "cold" },
      { speaker: "narrator", text: "电话挂了。你知道这只是开始。消息一旦走漏——{player_name} 会知道，媒体会知道，整支队伍都会知道。" },
    ],
  },
  {
    phase: "opening_bid",
    context: { role: "seller", playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "你收到一封邮件——{rival_team} 官方询价函。措辞很客气，意思是「{player_name} 多少钱」。" },
      { speaker: "narrator", text: `你把这个邮件转给了老板。半小时后老板回：'你定。但钱这事，别让人占便宜。'` },
      { speaker: "you", text: `（自言自语）'{player_name} 知道这件事吗……'`, emotion: "tense" },
      { speaker: "narrator", text: "你不知道的是——{player_name} 已经知道了。这条消息在选手圈里比光速还快。" },
    ],
  },
  {
    phase: "opening_bid",
    context: { role: "seller", playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: `{rival_coach} 的电话来得突然。'{player_name}——你们还用他吗？'` },
      { speaker: "rival_coach", text: `'他这个年纪，该转个环境了。我们接。'`, emotion: "calm" },
      { speaker: "you", text: `'用。怎么不用。'`, emotion: "cold" },
      { speaker: "rival_coach", text: `'别撑着。他要是想走，你留不住。'`, emotion: "amused" },
      { speaker: "narrator", text: `你想说「留得住」——但话到嘴边又咽了回去。{player_name} 最近的状态，你自己也看在眼里。` },
    ],
  },
  {
    phase: "opening_bid",
    context: { role: "seller", playerTier: "rookie" },
    lines: [
      { speaker: "narrator", text: "{rival_team} 来问你的青训小将。{player_name}——一线队还没他的位置，但圈子里已经有人盯上了。" },
      { speaker: "rival_coach", text: `'{player_name} 在你们那儿打不上首发，是吧？给我们，半年他能上 Major。'`, emotion: "calm" },
      { speaker: "you", text: `'……你们倒挺会挑。'`, emotion: "cold" },
      { speaker: "rival_coach", text: `'各取所需。你们要即战力，我们要潜力。'`, emotion: "calm" },
      { speaker: "narrator", text: "你挂了电话。这个报价——对俱乐部是好事。对 {player_name} 也是好事。但你心里有点堵——他还没机会证明自己就要送走？" },
    ],
  },
];

// ──────────────────────────────────────────────
// 3. 还价拉锯
// ──────────────────────────────────────────────

const counterofferDialogues: TransferDialogueSet[] = [
  {
    phase: "counteroffer",
    context: { role: "buyer" },
    lines: [
      { speaker: "rival_coach", text: `'{counterFee}。一分不能少。'`, emotion: "cold" },
      { speaker: "you", text: `'太高。{fee}——这是我的诚意。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'诚意？你的诚意比行情低两成。'`, emotion: "amused" },
      { speaker: "you", text: `'行情是行情，{player_name} 是 {player_name}。他来我这儿能拿冠军——这不算附加值？'`, emotion: "tense" },
      { speaker: "rival_coach", text: `对方笑了。'画饼不算钱。'`, emotion: "amused" },
      { speaker: "narrator", text: "你揉了揉眉心。谈价从来不是数学——是博弈。" },
    ],
  },
  {
    phase: "counteroffer",
    context: { role: "seller" },
    lines: [
      { speaker: "rival_coach", text: `'{fee}。这是我们的底线。'`, emotion: "cold" },
      { speaker: "you", text: `'底线？{player_name} 的身价不止这个数。{counterFee}。'`, emotion: "tense" },
      { speaker: "rival_coach", text: `'你这价……是想把我送走？'`, emotion: "amused" },
      { speaker: "you", text: `'你这价……是想把我当傻子？'`, emotion: "cold" },
      { speaker: "narrator", text: "两边都笑了。但谁都没让步。这种时候——先眨眼的人输。" },
    ],
  },
  {
    phase: "counteroffer",
    context: { role: "buyer", isFinalOffer: true },
    lines: [
      { speaker: "you", text: `'{counterFee}。最后通牒。行就行，不行我挂了。'`, emotion: "cold" },
      { speaker: "rival_coach", text: "对方沉默了很久。久到你以为他要挂了。", emotion: "tense" },
      { speaker: "rival_coach", text: `'……加一个青训名额。'`, emotion: "tense" },
      { speaker: "you", text: `'不行。只谈现金。'`, emotion: "cold" },
      { speaker: "rival_coach", text: `'……成交。'`, emotion: "defeat" },
      { speaker: "narrator", text: "你长出一口气。最后通牒赌的是——他比你更想卖。你赌对了。" },
    ],
  },
  {
    phase: "counteroffer",
    context: { role: "seller", isFinalOffer: true },
    lines: [
      { speaker: "rival_coach", text: `'{counterFee}。最后。再高我们就退出。'`, emotion: "cold" },
      { speaker: "narrator", text: "你看着这个数字。比心理价位高一点点——但不至于让他们撤。" },
      { speaker: "you", text: `'……行。但有个条件——{player_name} 转会后的第一场对你们，不许上他。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'这……合同里可以写。'`, emotion: "tense" },
      { speaker: "narrator", text: "你点头——虽然对方看不见。条款比数字更值钱。{player_name} 第一场打 {rival_team} 不能上——这是你对旧主的最后一点体面。" },
    ],
  },
  {
    phase: "counteroffer",
    context: { role: "buyer" },
    lines: [
      { speaker: "rival_coach", text: `'再加 {counterFee}。否则免谈。'`, emotion: "cold" },
      { speaker: "you", text: `'你这是漫天要价。'`, emotion: "tense" },
      { speaker: "rival_coach", text: `'你这是坐地还钱。'`, emotion: "amused" },
      { speaker: "narrator", text: "两人都笑了。价码归价码，规矩归规矩——这种默契，转会市场里比合同更管用。" },
      { speaker: "you", text: `'折中。{fee}。最后一口。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'……行。'`, emotion: "calm" },
    ],
  },
];

// ──────────────────────────────────────────────
// 4. 交易达成——明星转会
// ──────────────────────────────────────────────

const dealClosedStarDialogues: TransferDialogueSet[] = [
  {
    phase: "deal_closed",
    context: { role: "buyer", playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "凌晨一点，合同签字版发到了你的邮箱。{player_name}——你的了。" },
      { speaker: "you", text: `（看着屏幕）'成了。'`, emotion: "triumph" },
      { speaker: "narrator", text: `你给 {player_name} 发了条消息：'欢迎。明天基地见。' 已读。没回。`, emotion: "tense" },
      { speaker: "narrator", text: `半小时后——一张照片：他的行李箱，一个黑色的硬壳箱，贴满历届赛事的标签。配文：'路上。'` },
      { speaker: "narrator", text: `你笑了。这就是他要说的全部——'我来了'。` },
      { speaker: "narrator", text: "{your_team} 有了新的王牌。但王牌从不便宜——你赌的是，他值这个价。" },
    ],
    effect: { firepower: 8, morale: 4, economy: -10, cohesion: -2, tactics: 1 },
  },
  {
    phase: "deal_closed",
    context: { role: "seller", playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "合同签了。{player_name} 走了。{rival_team} 给的钱很到位——你账上的预算一下子宽裕了。" },
      { speaker: "you", text: `（看着训练室里空出来的那张桌子）'……'`, emotion: "defeat" },
      { speaker: "narrator", text: `{player_name} 走的那天，跟你握了手。'谢谢你，教练。'`, emotion: "warm" },
      { speaker: "you", text: `'谢谢你。'`, emotion: "warm" },
      { speaker: "narrator", text: `你给了他一个拥抱——不长，但够重。'去吧。打出来。'`, emotion: "warm" },
      { speaker: "narrator", text: "他点头。行李箱推过基地门槛的时候，他回头看了一眼训练室。然后——走了。" },
      { speaker: "narrator", text: "钱到账了。但训练室空了一块。这一块，短时间内填不上。" },
    ],
    effect: { economy: 12, firepower: -8, morale: -5, cohesion: -4, tactics: -2 },
  },
  {
    phase: "deal_closed",
    context: { role: "buyer", playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "签约仪式办得很低调——你不喜欢张扬。{player_name} 穿着 {your_team} 的队服站到了镜头前。" },
      { speaker: "rival_coach", text: `（媒体区）'{player_name} 是我们放手的——但我们不后悔。'`, emotion: "calm" },
      { speaker: "you", text: `（接受采访）'{player_name} 来这里只有一个目标——冠军。我们的目标一致。'`, emotion: "calm" },
      { speaker: "player", text: `（{player_name}）'我谢谢 {rival_team} 的培养。但接下来的故事——在 {your_team} 写。'`, emotion: "tense" },
      { speaker: "narrator", text: `记者追问转会费。你笑着摇头——'商业机密。'` },
      { speaker: "narrator", text: "其实你心里清楚——这笔钱够你买三个角色选手。但你只买了一个 {player_name}。赌的就是这一把。" },
    ],
    effect: { firepower: 9, morale: 5, economy: -11, cohesion: -1, tactics: 2, momentum: 3 },
  },
];

// ──────────────────────────────────────────────
// 5. 交易达成——新秀转会
// ──────────────────────────────────────────────

const dealClosedRookieDialogues: TransferDialogueSet[] = [
  {
    phase: "deal_closed",
    context: { role: "buyer", playerTier: "rookie" },
    lines: [
      { speaker: "narrator", text: "{player_name} 的转会手续走完了。便宜——青训价。但你心里有数，这孩子的天花板不止这个数。" },
      { speaker: "you", text: `（给青训教练打电话）'谢谢您。这孩子我会好好用。'`, emotion: "warm" },
      { speaker: "rival_coach", text: `'用不用得好是你的事。别糟蹋他就行。'`, emotion: "calm" },
      { speaker: "you", text: `'不会。'`, emotion: "calm" },
      { speaker: "narrator", text: "挂了电话。你打开 {player_name} 的数据档案——十九岁，二线联赛 MVP，K/D 1.35。这一串数字背后，是一个等你伸手的年轻人。" },
      { speaker: "narrator", text: "明天他到基地。你给他准备的不是合同，是一张写着你对他战术设想的便签。让他知道——你来这里，不是来坐板凳的。" },
    ],
    effect: { firepower: 4, tactics: 2, morale: 3, economy: -4, condition: 2, cohesion: 1 },
  },
  {
    phase: "deal_closed",
    context: { role: "buyer", playerTier: "rookie" },
    lines: [
      { speaker: "narrator", text: "你飞了一趟 {rival_team} 所在的城市，亲自接 {player_name}。机场出口——他背着包，看到你愣了一下。" },
      { speaker: "player", text: `（{player_name}）'教……教练？您亲自来？'`, emotion: "tense" },
      { speaker: "you", text: `'你的第一份一线队合同，我亲自送。'`, emotion: "warm" },
      { speaker: "narrator", text: `他接过合同，手有点抖。然后——鞠了个九十度的躬。'谢谢。'` },
      { speaker: "you", text: `'谢什么。打出来再谢。'`, emotion: "amused" },
      { speaker: "narrator", text: "回程的飞机上，{player_name} 看着窗外的云。他没说话。但你能感觉到——他的世界里有什么东西刚刚被打开。" },
      { speaker: "narrator", text: "你给了他一个机会。接下来——是他自己的事。" },
    ],
    effect: { firepower: 5, morale: 6, economy: -4, cohesion: 3, condition: 3, tactics: 1 },
  },
  {
    phase: "deal_closed",
    context: { role: "seller", playerTier: "rookie" },
    lines: [
      { speaker: "narrator", text: "{player_name} 的合同转出了。{rival_team} 给的承诺很好——一线队首发，核心培养计划。" },
      { speaker: "narrator", text: "你把 {player_name} 叫到办公室。他坐下，眼神有点复杂——既期待，又有点怕。" },
      { speaker: "you", text: `'{rival_team} 要你。他们给你的承诺我都看了——是真心的。'`, emotion: "warm" },
      { speaker: "player", text: `（{player_name}）'教练……我是不是……'`, emotion: "tense" },
      { speaker: "you", text: `'你不是被卖掉。你是被送去证明自己。这里你打不上首发——他们那里你能。'`, emotion: "warm" },
      { speaker: "you", text: `'记住——不管你以后打多高，你是从我们这儿出去的。'`, emotion: "warm" },
      { speaker: "player", text: `（{player_name}）'……谢谢教练。'`, emotion: "warm" },
      { speaker: "narrator", text: "他走了。你看着窗外——又一个孩子，去远方了。祝他好运。" },
    ],
    effect: { economy: 6, morale: -1, cohesion: -2, tactics: 1, condition: 1 },
  },
];

// ──────────────────────────────────────────────
// 6. 交易达成——老将转会
// ──────────────────────────────────────────────

const dealClosedVeteranDialogues: TransferDialogueSet[] = [
  {
    phase: "deal_closed",
    context: { role: "buyer", playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: "{player_name} 的合同签了。便宜——老将价。你知道 {rival_team} 是放他走，不是卖他。" },
      { speaker: "narrator", text: "他到基地那天，比约定时间早了两个小时。一个人坐在训练室门口，背包放在脚边。" },
      { speaker: "you", text: `'早。'`, emotion: "calm" },
      { speaker: "player", text: `（{player_name}）'……我习惯早到。'`, emotion: "tense" },
      { speaker: "you", text: `'我知道。'`, emotion: "warm" },
      { speaker: "narrator", text: "你没问他为什么习惯早到——那是他的旧主留给他的印记。每一个老将身上都有上一支队伍的痕迹，擦不掉，也不必擦。" },
      { speaker: "you", text: `'训练室在那边。你的位置靠窗——光线好，看回放不晃眼。'`, emotion: "warm" },
      { speaker: "player", text: `（{player_name}）'……谢了，教练。'`, emotion: "warm" },
      { speaker: "narrator", text: `他点头，拎起背包往里走。走了两步，回头——'我不会让你失望。'`, emotion: "tense" },
      { speaker: "narrator", text: "你知道这句话的分量。这是老将的承诺——比合同更重。" },
    ],
    effect: { firepower: 2, tactics: 6, discipline: 5, morale: 4, economy: -3, cohesion: 3 },
  },
  {
    phase: "deal_closed",
    context: { role: "buyer", playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: "签约那天，你没办仪式。你跟 {player_name} 在基地旁的小馆子吃了顿饭。两个人，两碗面，一碟花生米。" },
      { speaker: "you", text: `'{player_name}，我接你不是要你扛枪。是要你教。'`, emotion: "calm" },
      { speaker: "player", text: `（{player_name}）'……教？'`, emotion: "tense" },
      { speaker: "you", text: `'你的脑子比你的枪值钱。我这儿有新人——缺个能教他们怎么打的人。'`, emotion: "warm" },
      { speaker: "player", text: `（{player_name}）'所以我是来当保姆的？'`, emotion: "amused" },
      { speaker: "you", text: `'当老师。保姆管饭，老师管命。'`, emotion: "amused" },
      { speaker: "narrator", text: `他笑了——笑里有点苦，但更多的是释然。'行。我教。'`, emotion: "warm" },
      { speaker: "narrator", text: "你给他夹了一筷子花生米。这一筷子比任何合同条款都重——你给了他新的身份。" },
    ],
    effect: { firepower: 1, tactics: 7, discipline: 6, morale: 5, economy: -3, cohesion: 4 },
  },
  {
    phase: "deal_closed",
    context: { role: "seller", playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: "{player_name} 的合同转出了。{rival_team} 接他去做助理教练兼选手——半退役。" },
      { speaker: "narrator", text: "你跟他坐在基地的天台上。两个易拉罐，一罐啤酒，一罐可乐——他喝可乐，你喝啤酒。" },
      { speaker: "you", text: `'后悔吗？'`, emotion: "calm" },
      { speaker: "player", text: `（{player_name}）'……不后悔。'`, emotion: "tense" },
      { speaker: "player", text: `'我在这里打了五年。该打的都打了。该赢的赢了，该输的……也输了。'`, emotion: "warm" },
      { speaker: "player", text: `'换支队伍，换个身份——也许我能再打两年。也许……我能教出下一个我。'`, emotion: "warm" },
      { speaker: "you", text: `'你能。'`, emotion: "warm" },
      { speaker: "narrator", text: "你没说更多。易拉罐碰了一下——干杯。" },
      { speaker: "narrator", text: "老将走了，留下一片空白。但那片空白里——以后会长出新的东西。" },
    ],
    effect: { economy: 4, firepower: -3, morale: -4, cohesion: -3, tactics: -3, discipline: -2 },
  },
];

// ──────────────────────────────────────────────
// 7. 交易达成——互换球员
// ──────────────────────────────────────────────

const dealClosedSwapDialogues: TransferDialogueSet[] = [
  {
    phase: "deal_closed",
    context: { role: "buyer" },
    lines: [
      { speaker: "narrator", text: "一换一。{player_name} 来 {your_team}，{swapPlayerName} 去 {rival_team}。加一笔现金找平。" },
      { speaker: "you", text: `（跟 {rival_coach} 握手）'成交。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'各取所需。'`, emotion: "calm" },
      { speaker: "narrator", text: `{swapPlayerName} 走的时候，没闹，没怨。他跟你握了手——'谢谢这两年的机会。'`, emotion: "warm" },
      { speaker: "you", text: `'去吧。打出来。'`, emotion: "warm" },
      { speaker: "narrator", text: "你看着他上车。车开走了，你转身——{player_name} 已经站在训练室门口了。", emotion: "tense" },
      { speaker: "player", text: `（{player_name}）'教练好。'`, emotion: "tense" },
      { speaker: "you", text: `'来。位置都给你腾好了。'`, emotion: "warm" },
      { speaker: "narrator", text: "一进一出。同一天。这就是转会市场的节奏——容不得你伤感。" },
    ],
    effect: { firepower: 3, tactics: 3, morale: 1, cohesion: -3, economy: -3, discipline: 2 },
  },
  {
    phase: "deal_closed",
    context: { role: "seller" },
    lines: [
      { speaker: "narrator", text: "一换一谈成了。{player_name} 去 {rival_team}，{swapPlayerName} 过来补他的位置。" },
      { speaker: "narrator", text: "你没告诉 {player_name} 是被换走的——但你也没瞒。圈子里没有不透风的墙。" },
      { speaker: "player", text: `（{player_name}，收拾行李时）'教练，我是被卖的还是被换的？'`, emotion: "tense" },
      { speaker: "you", text: `'换。{swapPlayerName} 来你这位置。'`, emotion: "calm" },
      { speaker: "player", text: `（{player_name}，停顿）'……行。换就换。'`, emotion: "cold" },
      { speaker: "narrator", text: `他没多说。拉链一拉，行李箱合上了。'走了。'`, emotion: "cold" },
      { speaker: "you", text: `'保重。'`, emotion: "warm" },
      { speaker: "narrator", text: "门关上的瞬间，你听到走廊里传来一声叹息——很轻，但你能听出来。那不是怨恨。是失落。", emotion: "defeat" },
    ],
    effect: { firepower: -2, tactics: 2, morale: -2, cohesion: -3, economy: 2, discipline: 1 },
  },
];

// ──────────────────────────────────────────────
// 8. 交易达成——捡漏（低价签入）
// ──────────────────────────────────────────────

const dealClosedBargainDialogues: TransferDialogueSet[] = [
  {
    phase: "deal_closed",
    context: { role: "buyer", playerTier: "role_player" },
    lines: [
      { speaker: "narrator", text: "{rival_team} 急着清理薪资空间——{player_name} 被挂牌了。你抓住了机会。" },
      { speaker: "you", text: `（接 {rival_coach} 电话）'{fee}？这价……'`, emotion: "amused" },
      { speaker: "rival_coach", text: `'别问了。要就要，不要我挂了。'`, emotion: "tense" },
      { speaker: "you", text: `'要。'`, emotion: "triumph" },
      { speaker: "narrator", text: "合同秒签。你看着屏幕上的数字，忍不住笑——这价签个角色选手，赚大了。" },
      { speaker: "narrator", text: "但你也知道——{rival_team} 急着出手，是因为他们看到了你看不到的东西。也许是状态下滑，也许是更衣室问题。便宜不等于白捡。" },
      { speaker: "narrator", text: "明天 {player_name} 到基地。第一件事——你让分析师把他过去半年的所有 demo 都调出来。捡漏可以，但不能捡瞎。" },
    ],
    effect: { firepower: 3, economy: -2, morale: 2, tactics: 1, cohesion: -1, discipline: 0 },
  },
  {
    phase: "deal_closed",
    context: { role: "buyer", playerTier: "substitute" },
    lines: [
      { speaker: "narrator", text: "自由市场上有个老将——{player_name}，合同到期没人接。你查了他的数据——还能打。" },
      { speaker: "you", text: `（给 {player_name} 打电话）'{player_name}，我是 {your_team} 的。有兴趣聊聊吗？'`, emotion: "calm" },
      { speaker: "player", text: `（{player_name}）'……你们要我这老骨头？'`, emotion: "tense" },
      { speaker: "you", text: `'要。替补席缺一个能稳住场子的。'`, emotion: "warm" },
      { speaker: "player", text: `（{player_name}，沉默良久）'……行。我签。'`, emotion: "warm" },
      { speaker: "narrator", text: "合同寄过去，他当天就签了。比市场价低三成——他不是冲着钱来的。他是冲着「还有队伍要我」来的。" },
      { speaker: "narrator", text: "你给他留了位置——替补席靠角落的那张桌。安静，但能看见全场。老将该待的地方。" },
    ],
    effect: { firepower: 1, tactics: 4, discipline: 4, morale: 3, economy: -1, cohesion: 2 },
  },
];

// ──────────────────────────────────────────────
// 9. 交易破裂——价格谈不拢
// ──────────────────────────────────────────────

const dealBrokenPriceDialogues: TransferDialogueSet[] = [
  {
    phase: "deal_broken",
    context: { role: "buyer" },
    lines: [
      { speaker: "rival_coach", text: `'{counterFee}。最后一口。'`, emotion: "cold" },
      { speaker: "you", text: `'不行。{fee} 是我的上限。'`, emotion: "calm" },
      { speaker: "rival_coach", text: `'那……我们没什么好谈的了。'`, emotion: "cold" },
      { speaker: "narrator", text: "电话挂了。嘟——嘟——嘟——" },
      { speaker: "you", text: `（看着手机）'……黄了。'`, emotion: "defeat" },
      { speaker: "narrator", text: "你打开 {player_name} 的数据档案看了一会儿。然后——关掉了。这孩子，跟你没缘分。" },
      { speaker: "narrator", text: "有些交易就是这样——差一口气。但差一口气，就是两个世界。" },
    ],
    effect: { morale: -2, economy: 0, tactics: 0, cohesion: 0, discipline: 0 },
  },
  {
    phase: "deal_broken",
    context: { role: "seller" },
    lines: [
      { speaker: "rival_coach", text: `'{fee}。再高我们不要了。'`, emotion: "cold" },
      { speaker: "you", text: `'那你们不要。'`, emotion: "cold" },
      { speaker: "rival_coach", text: `'{player_name} 不值 {counterFee}。'`, emotion: "tense" },
      { speaker: "you", text: `'那你们去找值 {fee} 的。'`, emotion: "cold" },
      { speaker: "narrator", text: "电话挂了。{player_name} 还在训练室——他不知道刚才发生了什么。", emotion: "tense" },
      { speaker: "narrator", text: `你走过去，拍拍他的肩。'继续练。'`, emotion: "warm" },
      { speaker: "player", text: `（{player_name}，抬头）'教练？'`, emotion: "tense" },
      { speaker: "you", text: `'没什么。继续练。'`, emotion: "warm" },
      { speaker: "narrator", text: "你不卖他了。至少——这个价不卖。" },
    ],
    effect: { morale: 3, cohesion: 2, discipline: 2, economy: 0, firepower: 0, tactics: 0 },
  },
  {
    phase: "deal_broken",
    context: { role: "buyer" },
    lines: [
      { speaker: "narrator", text: "谈判拖了一周。每天一个电话，每次差一点。然后——今天，{rival_coach} 不接电话了。" },
      { speaker: "you", text: `（重拨第三次）'……'`, emotion: "tense" },
      { speaker: "narrator", text: `短信回了：'抱歉。我们决定留着 {player_name}。'` },
      { speaker: "you", text: `（攥着手机）'……行。'`, emotion: "defeat" },
      { speaker: "narrator", text: "你靠在椅背上。一周的拉锯——白搭了。但你心里清楚——他没接电话的那一刻，就已经决定了。短信只是补一刀。" },
      { speaker: "narrator", text: "转会市场里——沉默就是答案。" },
    ],
    effect: { morale: -3, economy: 0, tactics: 0, cohesion: 0, discipline: 0, momentum: -2 },
  },
];

// ──────────────────────────────────────────────
// 10. 交易破裂——选手拒绝
// ──────────────────────────────────────────────

const dealBrokenPlayerDialogues: TransferDialogueSet[] = [
  {
    phase: "deal_broken",
    context: { role: "buyer", playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "钱谈妥了，合同草拟了。最后一关——{player_name} 本人同意。" },
      { speaker: "narrator", text: "你飞过去见他。咖啡厅里，他坐对面，咖啡没动。" },
      { speaker: "player", text: `（{player_name}）'教练，谢谢您看得起。'`, emotion: "tense" },
      { speaker: "you", text: `'但你不想来。'`, emotion: "calm" },
      { speaker: "player", text: `'……我在 {rival_team} 八年了。我从青训就在那儿。'`, emotion: "warm" },
      { speaker: "player", text: `'我知道 {your_team} 给的条件好。但……我走不了。'`, emotion: "warm" },
      { speaker: "you", text: `（点头）'我懂。'`, emotion: "warm" },
      { speaker: "narrator", text: "你没劝。劝也没用。一个选手对一个地方的感情，比合同更值钱。" },
      { speaker: "you", text: `'那祝你——下赛季别打我们太狠。'`, emotion: "amused" },
      { speaker: "player", text: `（{player_name}，笑）'……不好说。'`, emotion: "amused" },
      { speaker: "narrator", text: "你起身，结了咖啡的钱。出门的时候，回头看了一眼——他还坐在那儿，咖啡还是没动。" },
    ],
    effect: { morale: -2, economy: 0, tactics: 0, cohesion: 0, discipline: 0, momentum: -1 },
  },
  {
    phase: "deal_broken",
    context: { role: "seller", playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "钱谈妥了。{rival_team} 给的承诺很好。但 {player_name} 找到你了——" },
      { speaker: "player", text: `（{player_name}）'教练，我不走。'`, emotion: "tense" },
      { speaker: "you", text: `'？'`, emotion: "tense" },
      { speaker: "player", text: `'我知道 {rival_team} 给得多。但我不想走。'`, emotion: "warm" },
      { speaker: "player", text: `'我在这里……还有想拿的东西。'`, emotion: "warm" },
      { speaker: "you", text: `'什么东西？'`, emotion: "calm" },
      { speaker: "player", text: `（{player_name}，看着训练室）'冠军。跟你们一起拿的冠军。'`, emotion: "warm" },
      { speaker: "narrator", text: "你看着他——他的眼神没躲。这是他第一次这么直白地跟你说话。" },
      { speaker: "you", text: `'……行。我拒了他们。'`, emotion: "warm" },
      { speaker: "narrator", text: `你给 {rival_coach} 拨了电话。'抱歉——{player_name} 不卖了。'`, emotion: "cold" },
      { speaker: "narrator", text: "{player_name} 留下了。这次——是他自己选的。" },
    ],
    effect: { morale: 6, cohesion: 5, discipline: 3, economy: -8, firepower: 1, tactics: 1 },
  },
  {
    phase: "deal_broken",
    context: { role: "buyer", playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: `{player_name} 通过经纪人回话了——'谢谢好意，但我决定挂靴。'` },
      { speaker: "you", text: `（看着消息）'……退役？'`, emotion: "defeat" },
      { speaker: "narrator", text: "你想接他再打两年。但他自己——已经决定了。" },
      { speaker: "you", text: `（给 {player_name} 发消息）'保重。'`, emotion: "warm" },
      { speaker: "narrator", text: `已读。没回。半小时后——一张照片：他的鼠标和耳机，整齐地放在桌上。配文：'再见了，老伙计。'` },
      { speaker: "narrator", text: "你叹了口气。有些人——不是被转会市场送走的，是被时间送走的。" },
    ],
    effect: { morale: -1, economy: 0, tactics: 0, cohesion: 0, discipline: 0 },
  },
];

// ──────────────────────────────────────────────
// 11. 交易破裂——截胡
// ──────────────────────────────────────────────

const dealBrokenSnipedDialogues: TransferDialogueSet[] = [
  {
    phase: "deal_broken",
    context: { role: "buyer" },
    lines: [
      { speaker: "narrator", text: "合同签字版还没发过来。你等了一小时——{rival_coach} 没回邮件。" },
      { speaker: "narrator", text: "你拨电话。占线。再拨。占线。" },
      { speaker: "narrator", text: "半小时后——新闻弹窗：「{player_name} 加盟 {另一个队伍}。转会费 {天价}。」" },
      { speaker: "you", text: `（看着屏幕）'……截胡。'`, emotion: "defeat" },
      { speaker: "narrator", text: `{rival_coach} 的电话终于打进来了。'抱歉。他们出价太高——我们没法拒绝。'` },
      { speaker: "you", text: `'……行。理解。'`, emotion: "cold" },
      { speaker: "narrator", text: "你挂了电话。所谓理解——就是认了。转会市场——从来不讲先来后到。" },
    ],
    effect: { morale: -4, economy: 0, tactics: 0, cohesion: 0, discipline: 0, momentum: -3 },
  },
  {
    phase: "deal_broken",
    context: { role: "seller" },
    lines: [
      { speaker: "narrator", text: "你以为 {player_name} 会去 {rival_team}。所有条件都谈妥了。" },
      { speaker: "narrator", text: "然后——{player_name} 的经纪人来了电话。「我们改主意了。{另一个队伍} 出了更高的价。」" },
      { speaker: "you", text: `'……我们不是已经签了意向？'`, emotion: "tense" },
      { speaker: "rival_coach", text: `（经纪人）'意向不是合同。'`, emotion: "cold" },
      { speaker: "narrator", text: "你攥着手机。这是转会市场的潜规则——签字之前，一切都不算数。" },
      { speaker: "you", text: `'行。那祝你们好运。'`, emotion: "cold" },
      { speaker: "narrator", text: "电话挂了。{player_name} 还在训练室——他不知道刚才发生了什么。也许他知道。也许——他就是知道的。" },
      { speaker: "narrator", text: "明天，他会从经纪人那里听到这个消息。然后——他会装作没事。然后——他会在赛场上拼命。这就是职业选手。" },
    ],
    effect: { morale: -3, economy: -5, tactics: 0, cohesion: -2, discipline: -1, momentum: -2 },
  },
];

// ──────────────────────────────────────────────
// 12. 交易破裂——老板/管理层干预
// ──────────────────────────────────────────────

const dealBrokenBossDialogues: TransferDialogueSet[] = [
  {
    phase: "deal_broken",
    context: { role: "buyer" },
    lines: [
      { speaker: "narrator", text: "你谈妥了。{player_name}——{fee}，所有条款都签字了。你把合同发给老板审批。" },
      { speaker: "narrator", text: "第二天——老板的电话来了。" },
      { speaker: "narrator", text: `'这个价——超预算了。砍掉。'`, emotion: "cold" },
      { speaker: "you", text: `'老板，{player_name} 是这一批里最好的——砍了就没了。'`, emotion: "tense" },
      { speaker: "narrator", text: `'我说了算。砍。'`, emotion: "cold" },
      { speaker: "narrator", text: `电话挂了。你给 {rival_coach} 拨过去——'抱歉，预算没批。交易取消。'` },
      { speaker: "rival_coach", text: `'……行。理解。'`, emotion: "cold" },
      { speaker: "narrator", text: "理解——就是没缘分。但你心里清楚——这次不是没缘分，是被自家老板砍了一刀。" },
      { speaker: "you", text: `（自言自语）'下个窗口……再来。'`, emotion: "defeat" },
    ],
    effect: { morale: -5, economy: 5, tactics: 0, cohesion: -1, discipline: -2, momentum: -3 },
  },
  {
    phase: "deal_broken",
    context: { role: "seller" },
    lines: [
      { speaker: "narrator", text: "你拒绝卖 {player_name}——这是你的决定。但老板的电话来了。" },
      { speaker: "narrator", text: `'{player_name} 这个价不卖？你疯了？卖。'`, emotion: "cold" },
      { speaker: "you", text: `'老板，{player_name} 是核心——卖了没人补。'`, emotion: "tense" },
      { speaker: "narrator", text: `'这个钱够签两个。你的工作——就是让那两个打出来。卖。'`, emotion: "cold" },
      { speaker: "narrator", text: "电话挂了。你坐在办公室——很久。" },
      { speaker: "narrator", text: `你给 {rival_coach} 拨过去——'……{player_name}，卖了。'`, emotion: "defeat" },
      { speaker: "narrator", text: "你不知道怎么跟 {player_name} 说。你也不知道——卖了他之后，这支队伍还能不能打。" },
      { speaker: "narrator", text: "这就是经理——有时候，你不是在带队伍，是在替老板背锅。" },
    ],
    effect: { economy: 12, firepower: -7, morale: -6, cohesion: -5, tactics: -2, discipline: -2 },
  },
];

// ──────────────────────────────────────────────
// 13. 选手本人反应——愿走
// ──────────────────────────────────────────────

const playerWillingDialogues: TransferDialogueSet[] = [
  {
    phase: "player_willing",
    context: { playerTier: "star" },
    lines: [
      { speaker: "narrator", text: `你找 {player_name} 谈。'有队伍要你。你想走吗？'` },
      { speaker: "player", text: `（{player_name}，沉默良久）'……想。'`, emotion: "tense" },
      { speaker: "you", text: `'说说。'`, emotion: "calm" },
      { speaker: "player", text: `'我在这里……三年了。冠军拿过一次。但……'`, emotion: "tense" },
      { speaker: "player", text: `'我想知道，换个地方，我还能不能拿第二个。'`, emotion: "warm" },
      { speaker: "player", text: `'我想知道，是我离开 {your_team} 就不行了，还是我到哪里都行。'`, emotion: "warm" },
      { speaker: "you", text: `（点头）'我懂。'`, emotion: "warm" },
      { speaker: "you", text: `'那我去谈个好价钱。你——准备走。'`, emotion: "warm" },
      { speaker: "narrator", text: "他点头。眼里有一种——既是告别，也是出发的光。" },
    ],
    effect: { morale: 2, economy: 5, cohesion: -3, discipline: 1, tactics: 0 },
  },
  {
    phase: "player_willing",
    context: { playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: "你跟 {player_name} 谈转会的事。他听完，没犹豫。" },
      { speaker: "player", text: `（{player_name}）'走。'`, emotion: "calm" },
      { speaker: "you", text: `'这么干脆？'`, emotion: "amused" },
      { speaker: "player", text: `'教练，我三十一了。能打的年份——一只手数得过来。'`, emotion: "warm" },
      { speaker: "player", text: `'{rival_team} 给我两年合同，外加助理教练的位置。我下半辈子的着落。'`, emotion: "warm" },
      { speaker: "player", text: `'我不能为了「感情」——把「未来」赌掉。'`, emotion: "warm" },
      { speaker: "you", text: `'……我懂。'`, emotion: "warm" },
      { speaker: "narrator", text: "你没挽留。老将该有的体面——是让他自己走，不是你哭着求他留。" },
    ],
    effect: { economy: 4, morale: -2, cohesion: -2, tactics: -2, discipline: -1 },
  },
  {
    phase: "player_willing",
    context: { playerTier: "rookie" },
    lines: [
      { speaker: "narrator", text: "{player_name}——你的青训小将，听说有队伍要他。他来找你。" },
      { speaker: "player", text: `（{player_name}，紧张）'教练，听说……{rival_team} 想要我？'`, emotion: "tense" },
      { speaker: "you", text: `'想。你想去吗？'`, emotion: "calm" },
      { speaker: "player", text: `'我……'`, emotion: "tense" },
      { speaker: "player", text: `'我在这里……打不上首发。但您对我很好。'`, emotion: "warm" },
      { speaker: "you", text: `'别因为我对你好——就耽误你自己。'`, emotion: "warm" },
      { speaker: "player", text: `（{player_name}，眼里有光）'那……我想去。我想证明自己。'`, emotion: "warm" },
      { speaker: "you", text: `'那就去。'`, emotion: "warm" },
      { speaker: "narrator", text: `他鞠了个躬。'谢谢教练。'——这一躬，比任何签字都重。` },
    ],
    effect: { economy: 5, morale: -1, cohesion: -1, tactics: 0, discipline: 0 },
  },
];

// ──────────────────────────────────────────────
// 14. 选手本人反应——不愿走
// ──────────────────────────────────────────────

const playerReluctantDialogues: TransferDialogueSet[] = [
  {
    phase: "player_reluctant",
    context: { playerTier: "star" },
    lines: [
      { speaker: "narrator", text: `你跟 {player_name} 谈——'{rival_team} 想要你。你想走吗？'` },
      { speaker: "player", text: `（{player_name}，立刻）'不走。'`, emotion: "cold" },
      { speaker: "you", text: `'他们给的钱多。'`, emotion: "calm" },
      { speaker: "player", text: `'多就多。'`, emotion: "cold" },
      { speaker: "player", text: `'我在这里——从青训就在。{your_team} 是我的家。'`, emotion: "warm" },
      { speaker: "player", text: `'要走，除非您赶我。'`, emotion: "warm" },
      { speaker: "you", text: `'我不赶你。'`, emotion: "warm" },
      { speaker: "narrator", text: "他点头。眼神稳了——像一颗钉子钉在了 {your_team} 的训练室里。" },
      { speaker: "narrator", text: "你拒了 {rival_team}。但你知道——这种忠诚，是要用冠军来回报的。" },
    ],
    effect: { morale: 5, cohesion: 5, discipline: 3, economy: -8, firepower: 0, tactics: 0 },
  },
  {
    phase: "player_reluctant",
    context: { playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: `你跟 {player_name} 谈——'{rival_team} 给了 offer。你想去吗？'` },
      { speaker: "player", text: `（{player_name}，沉默良久）'……教练，我哪都不想去。'`, emotion: "warm" },
      { speaker: "you", text: `'你确定？他们给你两年合同加助理教练的位置。'`, emotion: "calm" },
      { speaker: "player", text: `'我知道。但……'`, emotion: "tense" },
      { speaker: "player", text: `'我跟这帮小孩打了三年。看着 {rookie_name} 从一个发抖的小子变成现在的样子。'`, emotion: "warm" },
      { speaker: "player", text: `'我走了——他们怎么办？'`, emotion: "warm" },
      { speaker: "you", text: `'他们会长大。'`, emotion: "warm" },
      { speaker: "player", text: `'我知道。但我想看着他们长大。'`, emotion: "warm" },
      { speaker: "narrator", text: "你没再劝。这种感情——不是合同能衡量的。" },
    ],
    effect: { morale: 4, cohesion: 6, discipline: 3, economy: -6, tactics: 1 },
  },
  {
    phase: "player_reluctant",
    context: { playerTier: "rookie" },
    lines: [
      { speaker: "narrator", text: "{player_name} 听说转会的事，冲进你的办公室——眼眶红着。" },
      { speaker: "player", text: `（{player_name}）'教练，我不走！'`, emotion: "tense" },
      { speaker: "you", text: `'？'`, emotion: "tense" },
      { speaker: "player", text: `'我知道 {rival_team} 能给我首发。但我……'`, emotion: "tense" },
      { speaker: "player", text: `'您是第一个相信我的人。我……我不能刚被相信就走。'`, emotion: "warm" },
      { speaker: "you", text: `'……'`, emotion: "warm" },
      { speaker: "you", text: `'行。你不走。'`, emotion: "warm" },
      { speaker: "player", text: `（{player_name}，咧嘴）'谢教练！'`, emotion: "warm" },
      { speaker: "narrator", text: "他冲出去了——像一阵风。你看着他的背影，心里有点软——这孩子，比你想的更懂事。" },
    ],
    effect: { morale: 6, cohesion: 5, discipline: 2, economy: -5, firepower: 1, tactics: 1 },
  },
];

// ──────────────────────────────────────────────
// 15. 选手本人反应——犹豫
// ──────────────────────────────────────────────

const playerHesitantDialogues: TransferDialogueSet[] = [
  {
    phase: "player_hesitant",
    context: { playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "你跟 {player_name} 谈。他听完后，没立刻回答。" },
      { speaker: "player", text: `（{player_name}，盯着地板）'……教练，我能想想吗？'`, emotion: "tense" },
      { speaker: "you", text: `'想。给你三天。'`, emotion: "calm" },
      { speaker: "narrator", text: "第三天——他来了。坐下，没说话。" },
      { speaker: "player", text: `'我……还是不知道。'`, emotion: "tense" },
      { speaker: "you", text: `'那我就替你决定——不卖。'`, emotion: "calm" },
      { speaker: "player", text: `（{player_name}，抬头）'……为什么？'`, emotion: "tense" },
      { speaker: "you", text: `'因为你不知道。知道要走的人——眼神是定的。你眼神不定——说明你心里还想留。'`, emotion: "warm" },
      { speaker: "player", text: `（{player_name}，沉默良久）'……谢教练。'`, emotion: "warm" },
      { speaker: "narrator", text: "他走了。你知道——这次他没走，不代表下次不走。但至少——这次他选择了留。" },
    ],
    effect: { morale: 3, cohesion: 4, discipline: 2, economy: -7, tactics: 0 },
  },
  {
    phase: "player_hesitant",
    context: { playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: "你跟 {player_name} 谈。他听完后——叹了口气。" },
      { speaker: "player", text: `（{player_name}）'教练，您说，我这个年纪……该走还是该留？'`, emotion: "tense" },
      { speaker: "you", text: `'这事儿，我不能替你定。'`, emotion: "calm" },
      { speaker: "player", text: `'我知道。但我想听您的看法。'`, emotion: "warm" },
      { speaker: "you", text: `'我的看法——{rival_team} 给的条件好。但你的根在这里。'`, emotion: "warm" },
      { speaker: "you", text: `'要走，趁还能打，去别的地方再写一段。要留，就好好陪这帮孩子长大。'`, emotion: "warm" },
      { speaker: "you", text: `'两条路都对。错的是——犹豫。'`, emotion: "calm" },
      { speaker: "player", text: `（{player_name}，苦笑）'……您说得轻巧。'`, emotion: "amused" },
      { speaker: "narrator", text: "他没立刻决定。但你知道——这次谈话，让他想清楚了一些事。" },
    ],
    effect: { morale: 2, cohesion: 2, discipline: 1, economy: 0, tactics: 0 },
  },
  {
    phase: "player_hesitant",
    context: { playerTier: "rookie" },
    lines: [
      { speaker: "narrator", text: "你跟 {player_name} 谈。他听着——眼神来回晃。" },
      { speaker: "player", text: `（{player_name}）'教练……{rival_team} 给我首发。但……'`, emotion: "tense" },
      { speaker: "you", text: `'但什么？'`, emotion: "calm" },
      { speaker: "player", text: `'但我想跟您练。'`, emotion: "warm" },
      { speaker: "you", text: `'你想跟谁练——是你自己的事。但你想打首发还是替补？'`, emotion: "calm" },
      { speaker: "player", text: `（{player_name}，咬嘴唇）'……首发。'`, emotion: "tense" },
      { speaker: "you", text: `'那答案不就出来了？'`, emotion: "amused" },
      { speaker: "player", text: `'可是……'`, emotion: "tense" },
      { speaker: "you", text: `'没可是。年轻人——要敢选。选错了，再来。'`, emotion: "warm" },
      { speaker: "narrator", text: "他点头。眼里有泪——但他忍住了。这是他第一次，自己为自己的职业生涯做决定。" },
    ],
    effect: { morale: 1, economy: 4, cohesion: -2, discipline: 2, tactics: 0 },
  },
];

// ──────────────────────────────────────────────
// 16. 队内反应——卖掉队友
// ──────────────────────────────────────────────

const teamSellReactionDialogues: TransferDialogueSet[] = [
  {
    phase: "team_sell_reaction",
    context: { playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "你宣布 {player_name} 走了。训练室——死一样的静。" },
      { speaker: "team_member", text: `（{veteran_name}）'……真卖了？'`, emotion: "tense" },
      { speaker: "you", text: `'卖了。'`, emotion: "calm" },
      { speaker: "team_member", text: `（{veteran_name}）'为什么？'`, emotion: "cold" },
      { speaker: "you", text: `'因为他想走。'`, emotion: "calm" },
      { speaker: "narrator", text: "{rookie_name} 没说话——但你能看出来，他的眼神变了。他在想：今天卖的是 {player_name}，明天会不会是我？" },
      { speaker: "you", text: `'都听好——{player_name} 走，是因为他想走。你们谁想走，跟我说。我绝不强留。'`, emotion: "cold" },
      { speaker: "you", text: `'但谁要留——就给我好好练。'`, emotion: "cold" },
      { speaker: "narrator", text: "训练室没人说话。但每个人——都听进去了。" },
    ],
    effect: { morale: -4, cohesion: -5, discipline: 3, economy: 10, firepower: -6, tactics: -2 },
  },
  {
    phase: "team_sell_reaction",
    context: { playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: "你宣布 {player_name} 走了。{rookie_name} 第一个站起来——" },
      { speaker: "team_member", text: `（{rookie_name}）'教练！{player_name} 教了我那么多——怎么……'`, emotion: "tense" },
      { speaker: "you", text: `'他要去 {rival_team} 当助理教练。这是他的选择。'`, emotion: "warm" },
      { speaker: "team_member", text: `（{rookie_name}）'可……'`, emotion: "warm" },
      { speaker: "you", text: `'他教你的东西还在你脑子里。他走了，他的东西没走。'`, emotion: "warm" },
      { speaker: "you", text: `'下个赛季——你把这些东西用出来。这才是对他最好的告别。'`, emotion: "warm" },
      { speaker: "narrator", text: "{rookie_name} 没说话。但他点头了——重重地，点了一下。" },
    ],
    effect: { morale: -3, cohesion: -3, discipline: 3, economy: 4, firepower: -2, tactics: -2 },
  },
  {
    phase: "team_sell_reaction",
    context: { playerTier: "rookie" },
    lines: [
      { speaker: "narrator", text: "你宣布 {player_name} 转出了。{veteran_name} 听完——笑了。" },
      { speaker: "team_member", text: `（{veteran_name}）'这小子，总算能上首发了。'`, emotion: "amused" },
      { speaker: "you", text: `'嗯。'`, emotion: "calm" },
      { speaker: "team_member", text: `（{veteran_name}）'{rival_team} 那边——会好好用他吧？'`, emotion: "tense" },
      { speaker: "you", text: `'会。我谈的条件——一线队首发，核心培养。'`, emotion: "warm" },
      { speaker: "team_member", text: `（{veteran_name}）'那就好。'`, emotion: "warm" },
      { speaker: "narrator", text: "{star_player_name} 一直没说话。他跟 {player_name} 同期——一起从青训上来的。现在——一个留，一个走。" },
      { speaker: "team_member", text: `（{star_player_name}，最后）'……让他打出成绩来。'`, emotion: "warm" },
      { speaker: "you", text: `'他会的。'`, emotion: "warm" },
    ],
    effect: { morale: -1, cohesion: -2, discipline: 2, economy: 6, firepower: 0, tactics: 0 },
  },
];

// ──────────────────────────────────────────────
// 17. 队内反应——买来新人
// ──────────────────────────────────────────────

const teamBuyReactionDialogues: TransferDialogueSet[] = [
  {
    phase: "team_buy_reaction",
    context: { playerTier: "star" },
    lines: [
      { speaker: "narrator", text: "你宣布 {player_name} 来了。训练室的气氛——微妙。" },
      { speaker: "team_member", text: `（{star_player_name}，低声）'又来一个明星？'`, emotion: "cold" },
      { speaker: "you", text: `'{star_player_name}，你说什么？'`, emotion: "calm" },
      { speaker: "team_member", text: `（{star_player_name}）'……没什么。'`, emotion: "cold" },
      { speaker: "narrator", text: "你知道他在想什么——一个队伍容不下两个王牌。但你不点破。让 {player_name} 自己来证明。" },
      { speaker: "you", text: `'都听好——{player_name} 来，不是抢谁的位置。是补我们的火力。'`, emotion: "calm" },
      { speaker: "you", text: `'谁有意见——跟我说。别在背后嘀咕。'`, emotion: "cold" },
      { speaker: "narrator", text: "没人说话。但训练室里——多了一道看不见的张力。" },
    ],
    effect: { firepower: 6, morale: -1, cohesion: -3, tactics: 1, economy: -8, discipline: -1 },
  },
  {
    phase: "team_buy_reaction",
    context: { playerTier: "rookie" },
    lines: [
      { speaker: "narrator", text: "你宣布 {player_name} 来了——青训小将。{rookie_name} 第一个反应——" },
      { speaker: "team_member", text: `（{rookie_name}）'跟我同年的？'`, emotion: "amused" },
      { speaker: "you", text: `'嗯。'`, emotion: "calm" },
      { speaker: "team_member", text: `（{rookie_name}）'那……我能带他？'`, emotion: "warm" },
      { speaker: "you", text: `'你去年也是新人，今年你带新人。'`, emotion: "warm" },
      { speaker: "narrator", text: "{rookie_name} 乐了——这是他第一次当「前辈」。去年他还是发抖的小子，今年他要带新人了。" },
      { speaker: "team_member", text: `（{rookie_name}）'行！我带他！'`, emotion: "warm" },
      { speaker: "narrator", text: "你笑了。传承——就是这样。一年接一年。" },
    ],
    effect: { morale: 4, cohesion: 4, discipline: 2, firepower: 3, economy: -4, tactics: 1 },
  },
  {
    phase: "team_buy_reaction",
    context: { playerTier: "veteran" },
    lines: [
      { speaker: "narrator", text: "你宣布 {player_name} 来了——一位老将。{rookie_name} 一脸兴奋，{star_player_name} 一脸期待。" },
      { speaker: "team_member", text: `（{star_player_name}）'{player_name}？！那个 {player_name}？！'`, emotion: "amused" },
      { speaker: "you", text: `'嗯。'`, emotion: "calm" },
      { speaker: "team_member", text: `（{star_player_name}）'我小时候看他打比赛长大的！'`, emotion: "warm" },
      { speaker: "team_member", text: `（{veteran_name}）'别露怯。'`, emotion: "amused" },
      { speaker: "team_member", text: `（{star_player_name}）'……我尽量。'`, emotion: "amused" },
      { speaker: "narrator", text: "训练室的气氛——活了。老将到来，带来的是经验，也是底气。" },
      { speaker: "you", text: `'{player_name} 明天到。该准备的——准备。'`, emotion: "calm" },
      { speaker: "narrator", text: "你看着训练室里这群人——他们的眼神里，有了新的东西。是期待，也是敬畏。" },
    ],
    effect: { firepower: 2, morale: 5, cohesion: 4, discipline: 4, tactics: 5, economy: -3 },
  },
];

// ──────────────────────────────────────────────
// 18. 谈判氛围描写
// ──────────────────────────────────────────────

const atmosphereLines: TransferLine[] = [
  // 电话氛围
  { speaker: "narrator", text: "电话那头传来键盘声——他在边打字边跟你谈。说明：你不在他优先级的最前面。", emotion: "cold" },
  { speaker: "narrator", text: "电话那头很吵——背景音是训练室的鼠标声。他没回基地，在走廊接的电话。", emotion: "tense" },
  { speaker: "narrator", text: "电话那头安静得诡异——他关了门。这意味着——他要谈正事。", emotion: "tense" },
  { speaker: "narrator", text: "电话接通之前响了八声——他在犹豫要不要接。", emotion: "tense" },
  { speaker: "narrator", text: "电话那头传来打火机的声音——他在抽烟。这意味着——这场谈判不好谈。", emotion: "cold" },

  // 线下氛围
  { speaker: "narrator", text: "酒会的灯光很暖。但谈转会的时候——光越暖，话越冷。", emotion: "cold" },
  { speaker: "narrator", text: "咖啡馆的角落。两杯美式——都没动。", emotion: "tense" },
  { speaker: "narrator", text: "他的办公室。墙上挂着队伍的合影——所有奖杯都在。这是他的领地。", emotion: "tense" },
  { speaker: "narrator", text: "球场外的吸烟区。他不抽烟——但他知道你想抽。", emotion: "amused" },
  { speaker: "narrator", text: "凌晨两点的酒店大堂。前台小妹打了个哈欠——这一单，要谈到天亮。", emotion: "tense" },

  // 拖延战术
  { speaker: "narrator", text: "他没立刻回——这本身就是一种回答。转会市场里，沉默比拒绝更可怕。", emotion: "cold" },
  { speaker: "narrator", text: "他拖延了三天。每天都说「再考虑」——其实他在等其他买家的价。", emotion: "cold" },
  { speaker: "narrator", text: "他突然问起你队里的青训——转移话题。这意味着他对你的报价不满意。", emotion: "tense" },
  { speaker: "narrator", text: "他把会议推了三次——他在拖。拖到你急，拖到你加价。", emotion: "cold" },

  // 最后通牒
  { speaker: "narrator", text: "他放下咖啡杯——杯底磕在桌上，响得像一声惊堂木。这是他要说正事的信号。", emotion: "tense" },
  { speaker: "narrator", text: "他把合同推到你面前——纸面上的字不动，但他眼神在动。", emotion: "tense" },
  { speaker: "narrator", text: `他站起来——椅子往后一推。'这是最后一口。' 他说完，没等你回答，往门口走了两步。`, emotion: "tense" },
  { speaker: "narrator", text: "他看了下表——这个动作不是看时间，是告诉你：我没多少时间给你想了。", emotion: "cold" },
  { speaker: "narrator", text: "他拿起外套——动作慢得故意。这是最后通牒的肢体版。", emotion: "cold" },

  // 紧张高潮
  { speaker: "narrator", text: "窗外的城市灯火一直亮着。办公室里——只有两个人，一份合同，一支笔。", emotion: "tense" },
  { speaker: "narrator", text: "空调嗡嗡地响。这是房间里唯一的声音——因为两个人都没说话。", emotion: "tense" },
  { speaker: "narrator", text: "他签了——笔尖在纸上划过，发出沙沙的轻响。这一响，比任何欢呼都重。", emotion: "triumph" },
  { speaker: "narrator", text: `笔停了。他抬起头——'成了。' 这两个字，让一周的拉锯，瞬间落地。`, emotion: "triumph" },

  // 江湖气 / 武侠意象
  { speaker: "narrator", text: "电竞圈就这么大。今天你买他的人，明天他买你的人。江湖——来回都是这几张脸。", emotion: "calm" },
  { speaker: "narrator", text: "一纸合同，几百万美金。但真正的交易——从来不在纸上。在两人对视的那一秒。", emotion: "calm" },
  { speaker: "narrator", text: "他递过烟——你接了。这一接，比合同更管用。江湖规矩——递烟即递话。", emotion: "calm" },
  { speaker: "narrator", text: "转会市场——一将功成万骨枯。今天谈成的那个人，明天可能就是你最大的对手。", emotion: "cold" },
];

// ──────────────────────────────────────────────
// 池子聚合
// ──────────────────────────────────────────────

const allDialoguePools: Record<NegotiationPhase, TransferDialogueSet[]> = {
  opening_bid: [...buyerOpeningDialogues, ...sellerOpeningDialogues],
  counteroffer: counterofferDialogues,
  deal_closed: [
    ...dealClosedStarDialogues,
    ...dealClosedRookieDialogues,
    ...dealClosedVeteranDialogues,
    ...dealClosedSwapDialogues,
    ...dealClosedBargainDialogues,
  ],
  deal_broken: [
    ...dealBrokenPriceDialogues,
    ...dealBrokenPlayerDialogues,
    ...dealBrokenSnipedDialogues,
    ...dealBrokenBossDialogues,
  ],
  player_willing: playerWillingDialogues,
  player_reluctant: playerReluctantDialogues,
  player_hesitant: playerHesitantDialogues,
  team_sell_reaction: teamSellReactionDialogues,
  team_buy_reaction: teamBuyReactionDialogues,
  atmosphere: [], // 氛围走单独 API
};

// ──────────────────────────────────────────────
// 工具函数
// ──────────────────────────────────────────────

/** 简单的可种子化伪随机（确定性，便于回放） */
function seededRandom(seed: number): () => number {
  // 用 seed 哈希得到更分散的初始状态——避免小 seed 输出高度相关
  let state = seed >>> 0;
  // warmup：4 次迭代打散初始状态
  for (let i = 0; i < 4; i++) {
    state = (state * 1664525 + 1013904223) >>> 0;
  }
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** 字符串哈希——把上下文变成稳定的种子 */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

/** 把上下文转成稳定的 seed */
function contextToSeed(ctx: Partial<TransferContext>, extra?: string): number {
  const key = [
    ctx.role ?? "",
    ctx.playerTier ?? "",
    ctx.playerName ?? "",
    ctx.rivalTeam ?? "",
    ctx.isFinalOffer ? "final" : "",
    extra ?? "",
  ].join("|");
  return hashString(key);
}

/**
 * 检查一组对话是否匹配上下文条件。
 * 只检查显式提供的字段。空字段视为「任意」。
 */
function matchesContext(
  set: TransferDialogueSet,
  ctx: Partial<TransferContext>,
): boolean {
  const required = set.context;
  for (const key of Object.keys(required) as (keyof TransferContext)[]) {
    const reqVal = required[key];
    const ctxVal = ctx[key];
    if (reqVal !== undefined && ctxVal !== undefined && reqVal !== ctxVal) {
      return false;
    }
  }
  return true;
}

/** 填充变量槽位 */
function fillSlots(text: string, ctx: TransferContext): string {
  return text
    .replaceAll("{player_name}", ctx.playerName)
    .replaceAll("{rival_team}", ctx.rivalTeam)
    .replaceAll("{rival_coach}", ctx.rivalCoach)
    .replaceAll("{your_team}", ctx.yourTeam)
    .replaceAll("{fee}", ctx.fee ?? "")
    // 同时支持 snake_case 与 camelCase 槽位名（防止模板笔误）
    .replaceAll("{counter_fee}", ctx.counterFee ?? "")
    .replaceAll("{counterFee}", ctx.counterFee ?? "")
    .replaceAll("{swap_player_name}", ctx.swapPlayerName ?? "")
    .replaceAll("{swapPlayerName}", ctx.swapPlayerName ?? "")
    .replaceAll("{rookie_name}", "新秀") // 引擎侧可覆盖默认
    .replaceAll("{veteran_name}", "老将")
    .replaceAll("{star_player_name}", "明星选手")
    .replaceAll("{另一个队伍}", "另一支队伍")
    .replaceAll("{天价}", "天价");
}

// ──────────────────────────────────────────────
// 公开 API
// ──────────────────────────────────────────────

/**
 * 获取一组谈判对话。
 *
 * @param phase     谈判阶段
 * @param ctx       上下文（用于过滤与槽位填充）
 * @param seed      可选种子——同 seed 同 ctx 必返回同结果
 * @returns         匹配的对话组；若池中无匹配则返回任意一组
 */
export function getTransferDialogue(
  phase: NegotiationPhase,
  ctx: Partial<TransferContext>,
  seed?: number,
): TransferDialogueSet {
  const pool = allDialoguePools[phase] ?? [];
  if (pool.length === 0) {
    return {
      phase,
      context: {},
      lines: [
        { speaker: "narrator", text: "（这个阶段暂无对话内容）" },
      ],
    };
  }

  const matched = pool.filter((s) => matchesContext(s, ctx));
  const candidates = matched.length > 0 ? matched : pool;
  const s = seed ?? contextToSeed(ctx, phase);
  const rng = seededRandom(s);
  const idx = Math.floor(rng() * candidates.length);
  const chosen = candidates[idx];

  // 填充槽位——返回新的对象，避免污染池子
  const fullCtx: TransferContext = {
    role: ctx.role ?? "buyer",
    playerTier: ctx.playerTier ?? "role_player",
    playerName: ctx.playerName ?? "该选手",
    rivalTeam: ctx.rivalTeam ?? "对手队伍",
    rivalCoach: ctx.rivalCoach ?? "对方教练",
    yourTeam: ctx.yourTeam ?? "枪神队伍",
    fee: ctx.fee,
    counterFee: ctx.counterFee,
    isFinalOffer: ctx.isFinalOffer,
    tensionLevel: ctx.tensionLevel,
    swapPlayerName: ctx.swapPlayerName,
  };

  return {
    phase,
    context: chosen.context,
    lines: chosen.lines.map((l) => ({
      ...l,
      text: fillSlots(l.text, fullCtx),
    })),
    effect: chosen.effect,
  };
}

/**
 * 获取一条谈判氛围描写。
 *
 * @param ctx     上下文（影响选取种子，tensionLevel 暂未做硬过滤）
 * @param seed    可选种子
 * @returns       已填充槽位的氛围文本
 */
export function getAtmosphereLine(
  ctx: Partial<TransferContext>,
  seed?: number,
): string {
  const s = seed ?? contextToSeed(ctx, "atmosphere");
  const rng = seededRandom(s);
  const idx = Math.floor(rng() * atmosphereLines.length);
  const line = atmosphereLines[idx];

  const fullCtx: TransferContext = {
    role: ctx.role ?? "buyer",
    playerTier: ctx.playerTier ?? "role_player",
    playerName: ctx.playerName ?? "该选手",
    rivalTeam: ctx.rivalTeam ?? "对手队伍",
    rivalCoach: ctx.rivalCoach ?? "对方教练",
    yourTeam: ctx.yourTeam ?? "枪神队伍",
    fee: ctx.fee,
    counterFee: ctx.counterFee,
    isFinalOffer: ctx.isFinalOffer,
    tensionLevel: ctx.tensionLevel,
    swapPlayerName: ctx.swapPlayerName,
  };
  return fillSlots(line.text, fullCtx);
}

/**
 * 把一组对话渲染成单段文本（用于事件卡正文）。
 * 说话人按格式标记，方便 UI 用颜色区分。
 */
export function renderDialogue(set: TransferDialogueSet): string {
  return set.lines
    .map((l) => {
      switch (l.speaker) {
        case "you":
          return `【你】${l.text}`;
        case "rival_coach":
          return `【对方教练】${l.text}`;
        case "player":
          return `【选手】${l.text}`;
        case "team_member":
          return `【队友】${l.text}`;
        case "narrator":
        default:
          return l.text;
      }
    })
    .join("\n\n");
}

/**
 * 一站式：取一组对话并直接渲染为文本。
 */
export function getRenderedTransferDialogue(
  phase: NegotiationPhase,
  ctx: Partial<TransferContext>,
  seed?: number,
): { text: string; effect?: EventEffect } {
  const set = getTransferDialogue(phase, ctx, seed);
  return {
    text: renderDialogue(set),
    effect: set.effect,
  };
}

// ──────────────────────────────────────────────
// 调试与枚举
// ──────────────────────────────────────────────

/** 列出所有可用阶段（调试用） */
export const ALL_NEGOTIATION_PHASES: NegotiationPhase[] = [
  "opening_bid",
  "counteroffer",
  "deal_closed",
  "deal_broken",
  "player_willing",
  "player_reluctant",
  "player_hesitant",
  "team_sell_reaction",
  "team_buy_reaction",
  "atmosphere",
];

/** 列出某阶段对话组数量（调试用） */
export function countDialoguesByPhase(phase: NegotiationPhase): number {
  if (phase === "atmosphere") return atmosphereLines.length;
  return (allDialoguePools[phase] ?? []).length;
}
