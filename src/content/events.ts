/**
 * 突发事件库
 *
 * 分为两大类：
 *   - in_match:     比赛中突发事件，以事件卡形式插入比赛日志
 *   - out_of_match: 比赛外突发事件，在杯赛间隙 / 赛季节点触发
 *
 * 设计原则（参见 docs/product-specs/EVENTS.md）：
 *   1. 事件不是纯文字风味，每个选择必须改变可量化的玩法状态。
 *   2. 选择之间"种类不同"——不是"帮 vs 稍后再帮"，而是不同的价值观赌注。
 *   3. 叙事文本以角色驱动，不写"你知道吗"式说明文。
 *   4. 效果用命名修饰符，可在比赛文本中报告（见 SIMULATION.md）。
 *   5. 真实选手名字仅用于正面或游戏内行为场景，不编造私生活丑闻（见 EVENTS.md 安全规则）。
 */

// ──────────────────────────────────────────────
// 类型定义
// ──────────────────────────────────────────────

export type EventCategory = "in_match" | "out_of_match";

export type EventTiming =
  | "campaign_start"
  | "before_cup"
  | "between_cup_stages"
  | "before_match"
  | "during_match"
  | "after_match"
  | "between_cups"
  | "season_end";

/**
 * 事件效果——键名必须是可报告的命名修饰符。
 * 正数 = 提升，负数 = 降低。
 * 特殊键：
 *   spend_timeout: 消耗本场唯一暂停
 *   remove_control: 移除玩家下一个决策节点的控制权
 *   trigger_chain: 触发性格连段（值为 chain id）
 *   gain_form:     选手状态提升（值为 player_role 标签）
 */
export interface EventEffect {
  firepower?: number;
  tactics?: number;
  cohesion?: number;
  discipline?: number;
  morale?: number;
  economy?: number;
  condition?: number;
  tactical_control?: number;
  momentum?: number;
  spend_timeout?: boolean;
  remove_control?: boolean;
  trigger_chain?: string;
  gain_form?: "surge" | "slump";
}

export interface EventChoice {
  /** 动作标签——不写解释，只写行动（见 UI_TEXT.md） */
  label: string;
  /** 选择后的叙事文本 */
  resultText: string;
  /** 效果 */
  effect: EventEffect;
}

export interface GameEvent {
  id: string;
  category: EventCategory;
  timing: EventTiming[];
  title: string;
  /** 事件卡正文 */
  narrative: string;
  /** 触发条件描述（供模拟引擎判定） */
  triggerRequirements: string[];
  choices: EventChoice[];
  /** 是否可能移除玩家控制权 */
  canRemoveControl: boolean;
  /** 是否记录到生涯编年史 */
  chronicleWorthy: boolean;
  /** 标签：用于事件池筛选和去重 */
  tags: string[];
}

// ──────────────────────────────────────────────
// 比赛中突发事件
// ──────────────────────────────────────────────

const inMatchEvents: GameEvent[] = [
  {
    id: "star_tilt",
    category: "in_match",
    timing: ["during_match"],
    title: "心态炸了",
    narrative:
      "连续三个回合，你的明星步枪手在中路对枪全输。他开始猛砸桌面，语音里全是脏话。下个回合的战术还没叫，他已经把麦克风推到一边了。",
    triggerRequirements: [
      "己方连续输掉 >= 2 个压缩回合",
      "队内存在 firepower >= 85 的选手",
    ],
    choices: [
      {
        label: "立刻叫暂停，让他冷静",
        resultText:
          "你拍了一下桌面，叫出暂停。他灌了口水，靠在椅背上闭眼十秒。回来之后眼神不一样了。",
        effect: { spend_timeout: true, morale: 8, condition: 10, tactical_control: 5 },
      },
      {
        label: "不叫暂停，让他自己扛过去",
        resultText:
          "你没动。他在语音里沉默了两个回合，第三个回合突然在 B 点单枪匹马撕开了防线。天赋这东西……有时候不讲道理。",
        effect: { morale: -5, discipline: -4, firepower: 6, trigger_chain: "hot_blooded_risk" },
      },
      {
        label: "简化战术，绕开他的位置打",
        resultText:
          "你把进攻重心挪到另一侧，让他打自由人。他没说话，但你在回合结束的截图里看到他点了一下头。",
        effect: { tactics: -3, cohesion: 4, morale: 2, tactical_control: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "condition", "personality", "star_player"],
  },
  {
    id: "hot_streak",
    category: "in_match",
    timing: ["during_match"],
    title: "手感来了",
    narrative:
      "他刚才那个 1v2 翻盘之后整个人变了。热身区那个沉默的影子消失了，取而代之的是在语音里报点越来越快、越来越自信的核心。你知道这种状态——它来的时候挡不住，走的时候也留不住。",
    triggerRequirements: [
      "己方刚赢下一个压缩回合",
      "队内存在 firepower >= 85 的选手",
      "概率触发，非必然",
    ],
    choices: [
      {
        label: "围绕他打，把资源倾斜过去",
        resultText:
          "你让队友给他让出最好的枪位和道具。他没辜负——接下来的回合里，对手开始两个人架他一个人。",
        effect: { firepower: 10, tactics: -3, cohesion: 3, momentum: 6 },
      },
      {
        label: "保持原有体系，别让他飘",
        resultText:
          "你按住了想改战术的冲动。体系照跑，他照杀。下个回合对手重点照顾他之后，你的另一侧反而空了。",
        effect: { firepower: 4, discipline: 5, tactics: 2, momentum: 2 },
      },
      {
        label: "让他去赌一把英雄枪",
        resultText:
          "你让他起把狙去中路赌首杀。他笑了——赌赢了，全场沸腾。赌输了？你知道的。",
        effect: { firepower: 8, morale: -4, discipline: -6, economy: -8, trigger_chain: "streaky_star_risk" },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["firepower", "momentum", "star_player", "economy"],
  },
  {
    id: "clutch_1v3",
    category: "in_match",
    timing: ["during_match"],
    title: "1v3 残局",
    narrative:
      "B 点入口的烟雾散了一半。三名对手还活着，你的最后一人蹲在包点死角里，C4 已经安放。二十秒。耳机里安静得能听到心跳。",
    triggerRequirements: [
      "当前压缩回合己方仅剩 1 人存活",
      "对手存活 >= 2 人",
      "C4 已安放",
    ],
    choices: [
      {
        label: "静步摸出去，找单挑机会",
        resultText:
          "他关了脚步，从香蕉道绕到对手侧身后。第一个人甚至没来得及转头。第二个被穿烟带走。第三个……时间不够了，C4 爆了。但全场已经站起来了。",
        effect: { firepower: 6, morale: 10, momentum: 8, cohesion: 4 },
      },
      {
        label: "保枪，别赌了",
        resultText:
          "他把 AW​P 塞进墙角，蹲下，缩进死角。回合输了，但下一回合他带着满甲满道具出现在 B 点。有时候活着就是最大的战术。",
        effect: { economy: 12, morale: -3, tactical_control: 3, discipline: 4 },
      },
      {
        label: "假拆，逼对手回防",
        resultText:
          "他对着 C4 按了一下拆除键又松开。脚步声从两个方向涌过来。他预判了路线，穿墙打了两个。第三个回身太快，他倒在包点前一步。",
        effect: { firepower: 4, tactics: 6, morale: 5, momentum: 4, discipline: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["firepower", "morale", "clutch", "economy"],
  },
  {
    id: "crowd_pressure_final",
    category: "in_match",
    timing: ["during_match"],
    title: "决赛的声浪",
    narrative:
      "这是决赛。体育馆里一万两千人的声浪在每一轮结束后像海啸一样拍过来。你的指挥在语音里喊了三遍战术，队友一句都没听清。你能看到他的表情——不是紧张，是那种被声音淹没后的茫然。",
    triggerRequirements: [
      "当前比赛为杯赛决赛",
      "第 3 回合或之后",
    ],
    choices: [
      {
        label: "叫暂停，让所有人重新聚焦",
        resultText:
          "你叫了暂停。五个人站起来走到你身边，你什么战术都没说，只说了一句：'听我口令。' 回去之后，语音安静了。",
        effect: { spend_timeout: true, tactical_control: 8, discipline: 6, morale: 4 },
      },
      {
        label: "简化指挥，只报关键信息",
        resultText:
          "你让指挥只报敌人位置，不报战术安排。每个人凭本能打。意外的是——这样反而快了。",
        effect: { tactics: -5, firepower: 4, tactical_control: -2, momentum: 3 },
      },
      {
        label: "把现场当燃料，越吵越凶",
        resultText:
          "你没让他们安静。你让他们喊回去。赢下一轮之后，你的狙击手站起来冲观众席挥拳。声浪转向了——这次是朝对手去的。",
        effect: { morale: 8, discipline: -5, momentum: 6, cohesion: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "discipline", "final", "tactical_control"],
  },
  {
    id: "taunt_after_round",
    category: "in_match",
    timing: ["during_match"],
    title: "垃圾话",
    narrative:
      "刚赢下一轮，你的火爆型选手站起来对着对手的隔音棚比了个手势。对手的指挥透过玻璃看到了，脸色不太好看。你的队长在语音里说了句'别搞'，但他显然觉得挺好玩的。",
    triggerRequirements: [
      "己方刚赢下一个压缩回合",
      "队内存在 hot_blooded 特征选手",
    ],
    choices: [
      {
        label: "随他去，给对手施压",
        resultText:
          "你没拦。下一轮对手果然打得急了，中路前压送了首杀。但再下一轮，对手针对性反制，你的火爆选手被三把狙架在路口。",
        effect: { morale: 5, momentum: 4, discipline: -4, trigger_chain: "taunt_backfire_risk" },
      },
      {
        label: "按住他，别给对手动力",
        resultText:
          "你拍了一下他的椅背。'够了。' 他撇了撇嘴但坐下了。下一轮你们打得很干净，对手没有额外的情绪燃料。",
        effect: { discipline: 5, cohesion: 3, morale: -1, tactical_control: 2 },
      },
      {
        label: "让他搞，但准备好下一轮打假情报",
        resultText:
          "你让他继续嚣张，但下一轮的战术安排故意暴露了假 B 点意图。对手以为你们心态飘了，全线压 B——你们打的是 A。",
        effect: { tactics: 8, discipline: -3, morale: 3, momentum: 5 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["morale", "discipline", "personality", "tactics"],
  },
  {
    id: "economy_crisis",
    category: "in_match",
    timing: ["during_match"],
    title: "经济见底",
    narrative:
      "连续输了三个回合，队伍经济已经见底。下一轮全队加起来只够买两把步枪和三个手雷。指挥在语音里问你：'这轮怎么搞？'",
    triggerRequirements: [
      "己方连续输掉 >= 3 个压缩回合",
      "队伍经济低于全装备门槛",
    ],
    choices: [
      {
        label: "全员 ECO，攒钱下一轮翻盘",
        resultText:
          "五把手枪出门。这轮基本放弃了，但下一轮你们带着满装备和满道具回来了。对手的进攻被一套烟闪火堵在路口动弹不得。",
        effect: { economy: 15, morale: -3, tactical_control: 5, momentum: -2 },
      },
      {
        label: "半买赌一把，拼首杀翻经济",
        resultText:
          "你让两个步枪手带甲，三个手枪手跟后面。赌的是首杀——如果赌赢了，捡把枪这轮就能打。赌输了，下一轮还得 ECO。",
        effect: { economy: -5, firepower: 3, morale: 4, discipline: -3, trigger_chain: "force_buy_risk" },
      },
      {
        label: "全甲强起，打对手一个措手不及",
        resultText:
          "你以为对手会以为你们 ECO，结果你们全员带甲冲 B。对手确实只留了一个人看 B——但那个人手里是把大狙。",
        effect: { economy: -12, firepower: 2, morale: 6, discipline: -4, momentum: 3 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["economy", "morale", "tactics"],
  },
  {
    id: "igl_disagreement",
    category: "in_match",
    timing: ["during_match"],
    title: "指挥分歧",
    narrative:
      "回合冻结时间快结束了，你的指挥叫了默认控图。但明星选手在语音里说：'直接冲 B，我看了他们的防守习惯。' 两个人僵了三秒。你听到了倒计时。",
    triggerRequirements: [
      "队内存在 system_leader 或 hot_blooded 特征选手",
      "队内存在 firepower >= 85 的选手",
    ],
    choices: [
      {
        label: "支持指挥，按体系打",
        resultText:
          "你说了句'听指挥的'。明星选手没再说话，但你在他的走位里看到了一丝犹豫。默认控图打得很稳，只是少了点锐度。",
        effect: { tactics: 4, discipline: 5, cohesion: -2, firepower: -2 },
      },
      {
        label: "支持明星选手，赌他的判断",
        resultText:
          "你说了句'听他的'。指挥沉默了一秒，然后把战术改了。B 点确实防得薄弱——但指挥的脸上，你看到了裂痕。",
        effect: { firepower: 5, tactics: -3, cohesion: -5, morale: 3, trigger_chain: "leadership_conflict_risk" },
      },
      {
        label: "折中：先默认，看情况转 B",
        resultText:
          "你让指挥先控图，如果 B 点没人就转。这需要更多的沟通和信任——但他们做到了。指挥在语音里报了句'转 B'，明星选手第一个冲了进去。",
        effect: { tactics: 2, cohesion: 5, discipline: 3, firepower: 2, tactical_control: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["cohesion", "tactics", "leadership", "personality"],
  },
  {
    id: "anti_strat_read",
    category: "in_match",
    timing: ["during_match"],
    title: "被读透了",
    narrative:
      "三个回合了。你的默认控图每次都在同一个时间点被对手的前压打断。不是巧合——他们的指挥显然研究过你们的录像。你看到你的指挥在语音里越来越焦躁。",
    triggerRequirements: [
      "己方连续输掉 >= 2 个压缩回合",
      "对手 tactics >= 80",
    ],
    choices: [
      {
        label: "彻底改变默认打法",
        resultText:
          "你让指挥放弃习惯的控图节奏，改打变速。对手的前压扑了个空，你们反而拿到了中路控制权。代价是——你们自己也不太适应新节奏。",
        effect: { tactics: -3, firepower: 4, tactical_control: -4, discipline: -2 },
      },
      {
        label: "保持打法，用执行力硬吃",
        resultText:
          "你没改战术。你让每个人把本职工作做到极致。对手的前压还在，但这次你的步枪手提前架好了角度。执行力胜过套路。",
        effect: { firepower: 3, discipline: 6, tactics: 2, cohesion: 3 },
      },
      {
        label: "反向利用，设个陷阱",
        resultText:
          "你让队伍故意暴露控图习惯，然后在对手前压的路线上放了个交叉火力。第一波前压撞上来的时候，你们收了两个人头。",
        effect: { tactics: 8, firepower: 2, morale: 5, momentum: 4, discipline: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["tactics", "discipline", "tactical_control"],
  },
  {
    id: "momentum_crash",
    category: "in_match",
    timing: ["during_match"],
    title: "连丢两轮，要崩",
    narrative:
      "上半场最后两个回合全丢了。中场休息的时候，你能感觉到空气是沉的。没人说话，只有一个队员在反复看刚才的死亡回放。指挥的手指在桌面上无意识地敲。",
    triggerRequirements: [
      "己方连续输掉 >= 2 个压缩回合",
      "当前处于半场切换节点",
    ],
    choices: [
      {
        label: "叫暂停，打断对手节奏",
        resultText:
          "你叫了半场前的暂停。不是为了战术——是为了让那股势头断一下。回来之后，对手的进攻节奏明显没那么顺了。",
        effect: { spend_timeout: true, morale: 6, momentum: 3, tactical_control: 4 },
      },
      {
        label: "中场让指挥重新部署",
        resultText:
          "你把指挥拉到一边，让他重新想防守站位。他没有安慰任何人，只是在白板上画了三个新方案。队员们盯着白板，眼神慢慢聚焦了。",
        effect: { tactics: 6, discipline: 4, morale: 2, cohesion: 3 },
      },
      {
        label: "什么都不说，让他们自己消化",
        resultText:
          "你站在后面没动。有时候最好的管理是不管。下半场第一轮，你的指挥自己叫了一个完全不同的防守体系。他在自我修复。",
        effect: { tactics: 3, cohesion: -2, discipline: -2, morale: -3, tactical_control: -3 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["morale", "momentum", "tactics", "timeout"],
  },
  {
    id: "communication_breakdown",
    category: "in_match",
    timing: ["during_match"],
    title: "沟通断裂",
    narrative:
      "刚才那个回合，两个人同时报了不同的敌人位置，指挥喊的战术被淹没在交叉报点里。结果是——B 点三个人架同一个角度，A 点空了。回合结束的时候，语音里有人在互相抱怨。",
    triggerRequirements: [
      "队内 cohesion < 70",
      "概率触发",
    ],
    choices: [
      {
        label: "简化报点规则：只报位置不报判断",
        resultText:
          "你让每个人只说看到的东西，不说自己的推测。语音干净了。下个回合，指挥的战术指令第一次没有被淹没。",
        effect: { tactics: 4, discipline: 5, cohesion: 2, tactical_control: 3 },
      },
      {
        label: "让指挥独占战术频道",
        resultText:
          "你规定只有指挥能喊战术，其他人只报'敌人在 X'。这牺牲了信息丰富度，但换来了清晰度。",
        effect: { tactics: 3, discipline: 4, firepower: -2, cohesion: -1, tactical_control: 4 },
      },
      {
        label: "不管，让他们自己磨合",
        resultText:
          "你没插手。下个回合又出了一次信息冲突——但这次他们自己解决了。成长需要代价。",
        effect: { cohesion: 3, discipline: -3, tactics: -2, morale: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["cohesion", "tactics", "discipline", "communication"],
  },
  {
    id: "sub_feels_unwell",
    category: "in_match",
    timing: ["during_match"],
    title: "选手不适",
    narrative:
      "回合间隙，你的一个主力选手脸色发白，一直在揉太阳穴。队医过来看了一眼，低声跟你说：'可能是昨晚的东西吃坏了。他能打，但状态肯定受影响。'",
    triggerRequirements: [
      "队内存在可用替补",
      "概率触发",
    ],
    choices: [
      {
        label: "让他继续打，简化他的角色",
        resultText:
          "你让他留在场上，但把他的位置从突破手换到架枪位。不用他冲，只要他守住一个角度。他点了点头。",
        effect: { firepower: -4, tactics: 2, discipline: 3, condition: -5 },
      },
      {
        label: "换替补上",
        resultText:
          "替补选手站起来活动了一下手腕。他的数据和主力差了一截，但至少他是清醒的。主力拍了拍他的肩膀，把耳机递了过去。",
        effect: { firepower: -6, cohesion: 3, morale: 2, condition: 5, tactical_control: -2 },
      },
      {
        label: "让他硬扛，关键局再换",
        resultText:
          "你让他继续正常打。到了第四回合——那个关键的经济局——你才把替补换上去。主力在场边看着，脸色还是白的，但至少没拖累关键回合。",
        effect: { firepower: -3, condition: -8, tactics: 1, morale: -2, discipline: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["condition", "firepower", "substitute", "economy"],
  },
  {
    id: "tactical_autonomy",
    category: "in_match",
    timing: ["during_match"],
    title: "队伍自作主张",
    narrative:
      "冻结时间结束，你正准备下达战术——但语音里传来指挥的声音：'这轮我改了，打快攻 B。' 他没等你确认就按了自己的判断走了。其他四个人已经跟着冲了。",
    triggerRequirements: [
      "队内存在 system_leader 特征选手",
      "上一回合战术执行失败",
      "概率触发，极稀有",
    ],
    choices: [
      {
        label: "接受，看看他的判断对不对",
        resultText:
          "你没说话。快攻 B 打得很果断——对手确实在 B 点放了重兵，但你们的速度太快，在他们回防之前就下了包。指挥的直觉是对的。这一次。",
        effect: { firepower: 4, tactics: 3, morale: 4, discipline: -3, cohesion: 2 },
      },
      {
        label: "下个回合明确夺回指挥权",
        resultText:
          "你没在当场发作，但下一轮冻结时间你第一个开口：'从现在开始，所有战术我来定。' 指挥看了你一眼，点了点头。气氛微妙。",
        effect: { tactics: 4, discipline: 5, cohesion: -4, tactical_control: 3 },
      },
      {
        label: "赛后处理，先不打断比赛节奏",
        resultText:
          "你把这件事记在心里。现在打断只会让场面更难看。比赛继续，但你知道——这件事不解决，以后还会发生。",
        effect: { tactics: 1, cohesion: -3, discipline: -2, trigger_chain: "leadership_conflict_risk" },
      },
    ],
    canRemoveControl: true,
    chronicleWorthy: true,
    tags: ["leadership", "discipline", "cohesion", "control_loss"],
  },
];

// ──────────────────────────────────────────────
// 比赛中突发事件 · 扩展
// ──────────────────────────────────────────────

const inMatchEventsExtended: GameEvent[] = [
  {
    id: "winning_streak_confidence",
    category: "in_match",
    timing: ["during_match"],
    title: "连胜势头",
    narrative:
      "已经是第六个回合了。你们一路碾压，对手的防守像是纸糊的。你的选手在语音里开始开玩笑了——'这把我要去中路耍个狙'，'让我单挑他们仨'。气氛很轻，轻得有点飘。",
    triggerRequirements: [
      "己方连续赢得 >= 5 个压缩回合",
    ],
    choices: [
      {
        label: "让他们放松打，乘势碾压",
        resultText:
          "你没说话。第七轮你的狙击手真的在中路耍了个狙——还赢了。观众席笑了。但你知道，这种势头就像潮水，退的时候没人通知你。",
        effect: { firepower: 5, morale: 6, discipline: -4, momentum: 4, tactics: -2 },
      },
      {
        label: "泼冷水：还没赢呢，收着点",
        resultText:
          "你在语音里说了句'别浪'。有人撇了撇嘴，但收敛了。下一轮你们打得很标准——没那么花哨，但也没给对手任何翻盘的口子。",
        effect: { discipline: 5, tactics: 3, morale: -1, cohesion: 2, momentum: 1 },
      },
      {
        label: "利用他们的自信，打一个大胆的战术",
        resultText:
          "既然状态这么好，你叫了一个平时不敢用的五人快攻 B。选手们笑着冲了进去——速度快到对手连烟都没来得及扔。下包、架枪、赢。但万一这波失误了呢？",
        effect: { firepower: 4, tactics: -3, morale: 4, momentum: 5, discipline: -3 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["morale", "discipline", "momentum", "firepower"],
  },
  {
    id: "losing_streak_demoralized",
    category: "in_match",
    timing: ["during_match"],
    title: "节节败退",
    narrative:
      "第几个回合了？你已经数不清了。对面每一个回合都在用不同的方式打穿你们——A 点、B 点、中路、假打。你的选手一个比一个沉默，有人开始频繁看死亡回放。指挥的报点越来越少，越来越小声。",
    triggerRequirements: [
      "己方连续输掉 >= 5 个压缩回合",
    ],
    choices: [
      {
        label: "叫暂停，什么都不说，让他们喘口气",
        resultText:
          "你叫了暂停。你没讲战术，没分析对手。你只是站在他们身后，等他们自己从屏幕前抬起头。两分钟后，指挥说了一句：'换个防守，我来叫。' 这就够了。",
        effect: { spend_timeout: true, morale: 5, cohesion: 4, discipline: 2, tactics: 2 },
      },
      {
        label: "找一个能赢的简单战术，先止血",
        resultText:
          "你让指挥放弃复杂战术，就叫最稳的默认控图加 B 点回防。不求赢漂亮，只求赢一个。这轮确实赢了——对手的快攻撞上了你们堆在 B 点的三个人。",
        effect: { tactics: 2, morale: 4, momentum: 3, firepower: 1, tactical_control: 2 },
      },
      {
        label: "跟他们说：输可以，但别这么输",
        resultText:
          "你在语音里说了一句：'你们可以输。但不能这么输。' 有人握紧了鼠标。下一轮他们拼得更凶了——虽然还是输了，但对手的脸上不再有那种轻松了。",
        effect: { firepower: 3, morale: 1, discipline: 3, cohesion: 2, condition: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "momentum", "tactics", "timeout"],
  },
  {
    id: "lead_blown_comms",
    category: "in_match",
    timing: ["during_match"],
    title: "大好局面要送了",
    narrative:
      "上半场 12-3。你以为是碾压局。但下半场开始，对手换了个防守体系，你们的进攻突然不灵了。一回合，两回合，三回合——差距在缩小。语音里开始出现急躁的声音：'他们怎么突然变强了？' '别慌别慌——' 已经有人在慌了。",
    triggerRequirements: [
      "己方上半场大幅领先（>= 8 回合差）",
      "下半场连续输掉 >= 3 个回合",
    ],
    choices: [
      {
        label: "叫暂停，把对手的变化讲清楚",
        resultText:
          "你叫了暂停，在白板上画了对手新防守的站位。'他们把重兵挪到中路了，B 点只有一个人。' 选手们的眼睛重新聚焦了。下一轮，你们打了 B。",
        effect: { spend_timeout: true, tactics: 6, discipline: 4, morale: 3, tactical_control: 3 },
      },
      {
        label: "别叫暂停，让他们自己想明白",
        resultText:
          "你没叫暂停。你相信他们能自己找到答案。第四轮又输了——13-10。第五轮，指挥终于换了个打法，赢了。但那三轮的代价，让你的胃在抽筋。",
        effect: { tactics: 3, cohesion: -2, morale: -3, discipline: -1, momentum: -2 },
      },
      {
        label: "简化到极致：只打一个点，用执行力碾",
        resultText:
          "你让指挥放弃所有变化，只叫五人冲 B。不骗，不假打，就是硬冲。对手知道你们要来——但你们的人数优势和道具量让他们架不住。暴力，但有效。",
        effect: { firepower: 5, tactics: -3, discipline: 3, morale: 2, momentum: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "tactics", "momentum", "timeout"],
  },
  {
    id: "technical_pause",
    category: "in_match",
    timing: ["during_match"],
    title: "设备故障",
    narrative:
      "回合刚开始，你的狙击手突然举手——'鼠标没反应了。' 裁判吹了技术暂停。技术人员跑过来检查，发现是 USB 接口松了。五分钟的暂停，所有人的节奏都被打断了。",
    triggerRequirements: [
      "概率触发，稀有",
    ],
    choices: [
      {
        label: "利用暂停时间调整心态",
        resultText:
          "你没让这五分钟浪费。你把选手叫到一起，快速回顾了对手的倾向。等鼠标修好，你们回到座位上的时候，比之前更清醒了。",
        effect: { tactics: 3, morale: 2, discipline: 2, tactical_control: 2 },
      },
      {
        label: "让狙击手检查所有设备，别再出问题",
        resultText:
          "你让技术人员把狙击手的整套设备都检查了一遍。又花了三分钟。回来之后他确实没再出问题——但节奏断了，第一轮输了。",
        effect: { discipline: 3, morale: -2, momentum: -3, firepower: -1 },
      },
      {
        label: "换个备用鼠标先打，别等了",
        resultText:
          "你让他用备用鼠标先上。不是他惯用的型号，手感差了一截。但至少没让节奏断掉。他咬着牙打完了这一轮——居然还赢了。",
        effect: { firepower: -3, morale: 3, discipline: 2, momentum: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["condition", "morale", "momentum", "equipment"],
  },
  {
    id: "away_crowd_hostility",
    category: "in_match",
    timing: ["during_match"],
    title: "客场作战",
    narrative:
      "这是对手的主场。他们的观众席坐满了人，每一次你们的失误都换来震耳欲聋的欢呼。你的选手在隔音棚里，但低频的震动还是穿过来了。你的队长在语音里说：'他们一赢回合就这么吵？'",
    triggerRequirements: [
      "当前比赛为客场作战",
      "对手为主场队伍",
    ],
    choices: [
      {
        label: "把嘘声当燃料，'让他们闭嘴'",
        resultText:
          "你在语音里说：'想让他们安静吗？赢。' 下一轮你们打了一个漂亮的翻盘，你的狙击手站起来对着观众席做了个'嘘'的手势。技术犯规警告——但值了。",
        effect: { firepower: 4, morale: 5, discipline: -3, momentum: 3, cohesion: 2 },
      },
      {
        label: "让选手屏蔽观众，只听指挥",
        resultText:
          "你让每个人把降噪耳机调到最大。'只听我的声音，别的都当不存在。' 观众的声浪变成了背景白噪音。专注度回来了，但那种客场作战的压迫感还在心里。",
        effect: { discipline: 4, tactics: 2, morale: -1, tactical_control: 3 },
      },
      {
        label: "慢节奏开局，消耗观众耐心",
        resultText:
          "你让队伍打得很慢——控图、拖延、到最后十秒才进攻。观众开始焦躁，嘘声变成了倒彩。节奏被打乱的不只是你们，还有对手。",
        effect: { tactics: 4, firepower: -2, discipline: 3, morale: 1, momentum: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["morale", "discipline", "momentum", "pressure"],
  },
  {
    id: "overtime_grind",
    category: "in_match",
    timing: ["during_match"],
    title: "加时鏖战",
    narrative:
      "15-15。常规赛打完了。加时赛。你的选手们已经坐了快一个小时，有人的衬衫湿透了，有人的水喝光了。加时赛的经济规则不一样——每一分都更贵，每一个失误都更致命。",
    triggerRequirements: [
      "比赛进入加时赛",
    ],
    choices: [
      {
        label: "赌一把：加时第一轮全起强打",
        resultText:
          "你让全队起满装备打加时第一轮。赢了——对手经济崩了，连丢两轮。输了——你们的经济也崩了。你选了赌。硬币还在空中。",
        effect: { firepower: 4, economy: -8, morale: 3, momentum: 4, discipline: -2 },
      },
      {
        label: "稳扎稳打，当新生局从头来",
        resultText:
          "你跟他们说：'忘了刚才的 15-15。这是新比赛，先到 4 分的赢。' 心态归零了，手没那么抖了。加时赛打得很慢，但很稳。",
        effect: { discipline: 4, tactics: 3, morale: 2, condition: -2, cohesion: 2 },
      },
      {
        label: "让最稳的选手扛关键位",
        resultText:
          "你把队伍里最稳的那个选手放到了最关键架枪位。不是火力最强的，是最不会失误的。'你守住这里，我们就赢了。' 他没说话，点了一下头。",
        effect: { firepower: -2, discipline: 5, tactics: 3, morale: 3, cohesion: 3 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["economy", "condition", "discipline", "firepower", "morale"],
  },
  {
    id: "admin_ruling_dispute",
    category: "in_match",
    timing: ["during_match"],
    title: "判罚争议",
    narrative:
      "刚才那个回合，你的选手明明先到的包点，但裁判判定对手拆包成功。回放显示——计时器有 0.3 秒的误差。你的指挥站起来跟裁判理论，声音越来越大。对手在隔音棚里看着这边，表情微妙。",
    triggerRequirements: [
      "概率触发，稀有",
      "当前比赛为关键回合（赛点或淘汰赛）",
    ],
    choices: [
      {
        label: "据理力争，要求重赛那个回合",
        resultText:
          "你支持指挥继续申诉。裁判看了回放，承认了计时器问题——但拒绝重赛。回合判给对手。你赢了道义，输了比分。选手们的脸色很难看。",
        effect: { morale: -4, discipline: -2, cohesion: 3, tactical_control: -2, momentum: -3 },
      },
      {
        label: "接受判罚，别让争议影响心态",
        resultText:
          "你拉住了指挥：'判了就判了。下一轮。' 他很不甘心，但坐下了。争议过去了，但你能看到他握鼠标的手在用力。",
        effect: { discipline: 4, morale: -2, cohesion: 2, tactics: 1, tactical_control: 2 },
      },
      {
        label: "把愤怒转化成进攻性",
        resultText:
          "你在语音里说：'他们想这么赢？行。那我们就用比分让他们闭嘴。' 下一轮你们打出了整个杯赛最凶猛的一波进攻。对手被打懵了。",
        effect: { firepower: 5, morale: 3, discipline: -3, momentum: 4, cohesion: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "discipline", "momentum", "pressure"],
  },
];

inMatchEvents.push(...inMatchEventsExtended);

// ──────────────────────────────────────────────
// 比赛外突发事件
// ──────────────────────────────────────────────

const outOfMatchEvents: GameEvent[] = [
  {
    id: "coach_visa",
    category: "out_of_match",
    timing: ["before_cup", "before_match"],
    title: "教练卡在海关",
    narrative:
      "比赛前四小时，你的教练发来消息：'签证出了问题，被卡在入境审查了。可能赶不上今天的比赛。' 他的战术板、他的临场判断、他对选手情绪的管理——全都悬在一条海关通道里。",
    triggerRequirements: [
      "杯赛开始前或首场比赛前",
      "概率触发",
    ],
    choices: [
      {
        label: "让指挥接管战术部署",
        resultText:
          "你把教练的职责交给指挥。他临场反应快，但缺少教练那种全局视角。今天的战术安排会更简单，但至少不会乱。",
        effect: { tactics: -6, discipline: 3, tactical_control: -4, cohesion: 2 },
      },
      {
        label: "远程连线教练，用耳机沟通",
        resultText:
          "你让教练在酒店用手机连语音。信号时好时坏，他的声音断断续续。但关键回合他还是在的——哪怕只是一个模糊的方向建议。",
        effect: { tactics: -3, discipline: -2, tactical_control: -2, morale: 3 },
      },
      {
        label: "你自己顶上教练的角色",
        resultText:
          "你站到了选手后面。你不是教练，但你是经理。你不懂每个细节，但你知道什么时候该喊暂停，什么时候该闭嘴。选手们看你的时候，眼神里有一丝意外。",
        effect: { tactics: -4, morale: 5, cohesion: 4, discipline: 2, tactical_control: -3 },
      },
    ],
    canRemoveControl: true,
    chronicleWorthy: true,
    tags: ["tactics", "control_loss", "leadership"],
  },
  {
    id: "internal_conflict",
    category: "out_of_match",
    timing: ["between_cups", "after_match"],
    title: "队内矛盾",
    narrative:
      "上一场输了之后，你的两个核心选手在训练室吵了起来。一个指责另一个不补枪，另一个反唇相讥说指挥太保守。现在两个人坐在训练室的两头，谁都不看谁。",
    triggerRequirements: [
      "上一场杯赛成绩低于预期",
      "队内 cohesion < 75",
    ],
    choices: [
      {
        label: "开队会，把话说开",
        resultText:
          "你把五个人叫到一起。前十分钟是沉默，后十分钟是爆发。但爆发之后，有人说了句'好吧，我那枪确实该补。' 空气松了一点。",
        effect: { cohesion: 6, discipline: 3, morale: -2, tactics: 2 },
      },
      {
        label: "单独谈话，各个击破",
        resultText:
          "你一个个找他们聊。每个人都觉得自己有道理。你听完之后没评判谁对谁错，只是让他们各退一步。表面上和了，但你知道裂缝还在。",
        effect: { cohesion: 3, discipline: 2, morale: 1, tactics: -1 },
      },
      {
        label: "不管，让他们自己解决",
        resultText:
          "你没插手。职业选手都是成年人，他们要么自己解决，要么……不解决。下一场训练赛，两个人的配合明显生疏了。",
        effect: { cohesion: -5, discipline: -3, firepower: -2, tactics: -3 },
      },
      {
        label: "把矛盾最严重的一个放上交易桌",
        resultText:
          "你给那个闹得最凶的选手的经纪人打了个电话。消息不知道怎么走漏了——他第二天训练的时候安静了很多。是怕了，还是寒了心，你不确定。",
        effect: { cohesion: -2, discipline: 5, morale: -4, tactics: 1, trigger_chain: "transfer_unrest_risk" },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["cohesion", "discipline", "leadership", "personality"],
  },
  {
    id: "transfer_rumor",
    category: "out_of_match",
    timing: ["between_cups"],
    title: "转会传闻",
    narrative:
      "社交媒体上出现了一条爆料：你的明星选手据称已经在和另一支队伍接触。消息真假难辨，但评论区已经炸了。选手本人在训练的时候一言不发，经纪人电话不接。",
    triggerRequirements: [
      "杯赛间隙",
      "队内存在 firepower >= 88 的选手",
      "概率触发",
    ],
    choices: [
      {
        label: "直接找选手谈，问清楚",
        resultText:
          "你把他叫到办公室。他否认了传闻，但你看到他的眼神飘了一下。你说：'如果是真的，告诉我。我会帮你。' 他沉默了很久，然后说：'还没定。'",
        effect: { cohesion: 2, morale: -3, discipline: 2, tactics: -2 },
      },
      {
        label: "公开力挺，堵住舆论",
        resultText:
          "你在社媒上发了一条声明，说选手是非卖品。粉丝安心了，但选手看到声明后的表情很复杂——他没问过你愿不愿意，你就替他做了决定。",
        effect: { morale: 3, cohesion: -3, discipline: 1, tactics: -1 },
      },
      {
        label: "趁势探价，看看市场反应",
        resultText:
          "你让助理不动声色地放出了'可谈'的信号。三天内收到了两个报价。你没告诉选手——这些报价里有一个，让你心动了。",
        effect: { cohesion: -4, morale: -2, discipline: -2, economy: 8 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["cohesion", "morale", "economy", "star_player"],
  },
  {
    id: "fan_pressure_china",
    category: "out_of_match",
    timing: ["before_cup", "after_match"],
    title: "舆论风暴",
    narrative:
      "上一场意外输给弱队之后，国内社交媒体炸了。'教练下课' 上了热搜，选手的个人账号下涌进了上千条评论，有支持的，有骂的，还有'你是不是该退役了'。你的队长把手机摔在了桌上。",
    triggerRequirements: [
      "上一场比赛成绩低于预期",
      "或杯赛为 Major",
    ],
    choices: [
      {
        label: "收走所有人的手机，屏蔽外界",
        resultText:
          "你让工作人员把训练室的 WiFi 改了密码。'这周谁也不许看手机。' 队长第一个把手机交了出来。安静了，但也意味着他们看不到支持的声音。",
        effect: { morale: -2, discipline: 5, cohesion: 4, condition: 3, tactical_control: 2 },
      },
      {
        label: "把压力变成动力，打出中国队伍的气势",
        resultText:
          "你在队会上放了那些骂人的评论截图。'他们说你们不行。证明给他们看。' 有人的拳头握紧了。是愤怒，也是燃料。",
        effect: { morale: 4, firepower: 3, discipline: -2, cohesion: -1, condition: -2 },
      },
      {
        label: "让队长公开回应",
        resultText:
          "你让队长在社媒上发了一条视频，不辩解，只说'下一场看我们的。' 粉丝的反应分了两极——有人觉得硬气，有人觉得嘴硬。但至少话题不再围着上一场输了。",
        effect: { morale: 2, discipline: 2, cohesion: 3, tactics: -1, condition: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "discipline", "pressure", "condition"],
  },
  {
    id: "player_form_surge",
    category: "out_of_match",
    timing: ["before_cup", "before_match"],
    title: "训练赛状态爆棚",
    narrative:
      "过去三天的训练赛里，你的一个角色选手突然像是换了个人。预瞄准了，反应快了，连平时不敢打的路线都敢推了。教练私底下跟你说：'他这几天状态好得吓人。'",
    triggerRequirements: [
      "杯赛或比赛开始前",
      "队内存在 firepower 70-84 的选手",
      "概率触发",
    ],
    choices: [
      {
        label: "围绕他设计几个战术",
        resultText:
          "你让教练多给他安排几个关键位。他没让大家失望——训练赛里连续三天 KD 正的。但你也注意到，原来的核心选手脸上有点微妙。",
        effect: { firepower: 6, tactics: 3, cohesion: -2, morale: 2, condition: 5 },
      },
      {
        label: "别给他额外压力，保持正常轮转",
        resultText:
          "你让教练别声张。状态这东西越捧越容易飞。他照常打自己的角色，但你能看到他在关键回合里越来越自信。",
        effect: { firepower: 3, discipline: 3, cohesion: 2, condition: 3 },
      },
      {
        label: "在队内会议上表扬他，提振士气",
        resultText:
          "你在复盘会上点名表扬了他。他脸红了，但笑得很真。旁边的队友拍了拍他的肩。这种认可比任何战术调整都管用。",
        effect: { morale: 5, cohesion: 4, firepower: 2, discipline: 1, condition: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["firepower", "condition", "morale", "cohesion"],
  },
  {
    id: "player_form_slump",
    category: "out_of_match",
    timing: ["before_cup", "between_cups"],
    title: "状态持续低迷",
    narrative:
      "已经两周了。你的一个主力选手在训练赛里怎么都打不出来——对枪输、残局输、连平时最稳的角度都在漏人。他自己也急，越急越打不出来，恶性循环。",
    triggerRequirements: [
      "杯赛或比赛开始前",
      "队内存在状态低迷标记的选手",
      "概率触发",
    ],
    choices: [
      {
        label: "给他减量训练，多休息",
        resultText:
          "你让他这周少打两场训练赛，多看看 demo。他有点不情愿——职业选手都怕'不练就废'。但三天后回来，他的预瞄确实清醒了一些。",
        effect: { condition: 5, firepower: 1, discipline: -1, morale: 2, tactics: 1 },
      },
      {
        label: "加练，用肌肉记忆找回来",
        resultText:
          "你让他加练。每天多两个小时的死斗模式。他的手确实热了，但眼圈也黑了。疲劳和状态之间，你在走钢丝。",
        effect: { firepower: 3, condition: -5, discipline: 2, morale: -2 },
      },
      {
        label: "找心理教练聊聊",
        resultText:
          "你安排了一次心理咨询。他一开始很抗拒——'我又没病。' 但聊完之后他跟你说：'原来我以为我在打比赛，其实我在跟自己较劲。'",
        effect: { condition: 4, morale: 4, cohesion: 2, firepower: 1, discipline: 1 },
      },
      {
        label: "让替补打几场，他先冷一下",
        resultText:
          "你告诉他这杯赛先坐板凳。他没说话，收拾东西的时候把耳机线拽得很用力。但你也知道——继续让他上场输，信心只会碎得更彻底。",
        effect: { firepower: -3, morale: -3, discipline: 3, cohesion: -2, condition: 3 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["condition", "firepower", "morale", "substitute"],
  },
  {
    id: "player_absence",
    category: "out_of_match",
    timing: ["before_cup", "before_match"],
    title: "主力缺席",
    narrative:
      "比赛前一天晚上，你的一个主力选手突发高烧。队医量了体温——39.2 度。他坚持说能打，但你看着他烧红的脸和发抖的手，知道这不是硬撑的事。",
    triggerRequirements: [
      "比赛开始前",
      "队内存在可用替补",
      "概率触发",
    ],
    choices: [
      {
        label: "让他休息，替补顶上",
        resultText:
          "你做了决定：'你回去睡觉。' 替补选手接到通知的时候手都在抖——这是他第一次打正赛首发。主力在走之前拍了拍他的背：'别怕，位置是你的。'",
        effect: { firepower: -5, morale: 2, cohesion: 4, condition: 3, discipline: 2 },
      },
      {
        label: "让他打完再说，关键局换替补",
        resultText:
          "你让主力先上，但跟替补说好了：随时准备。主力第一局打得还行——退烧药的效果。但第二局开始他的反应明显慢了。你把替补换了上去。",
        effect: { firepower: -2, condition: -4, morale: -1, tactical_control: -3, discipline: 1 },
      },
      {
        label: "打乱阵型，五个人分担他的角色",
        resultText:
          "你没换人。你让剩下的四个人每人多承担一点他缺失的功能。阵型变了，打法变了。不完美，但所有人都在拼命补那个空缺。",
        effect: { firepower: -3, tactics: -4, cohesion: 5, discipline: 4, morale: 3, condition: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["condition", "firepower", "substitute", "cohesion"],
  },
  {
    id: "public_opinion_swing",
    category: "out_of_match",
    timing: ["after_match", "between_cups"],
    title: "舆论转向",
    narrative:
      "上一场的精彩翻盘在社媒上疯传。一夜之间，你的队伍从'可能要崩'变成了'今年最大黑马'。赞助商的电话响了，媒体的采访请求塞满了邮箱，连选手们的粉丝数都涨了几万。",
    triggerRequirements: [
      "上一场比赛成绩高于预期",
      "概率触发",
    ],
    choices: [
      {
        label: "压住热度，让队伍专注下一场",
        resultText:
          "你拒掉了大部分采访，让工作人员挡住媒体。选手们有点失落——谁不喜欢被夸？但你跟他们说：'夸你的人下周就能骂你。专注比赛。'",
        effect: { discipline: 4, morale: 1, cohesion: 2, condition: 2, tactical_control: 2 },
      },
      {
        label: "乘势曝光，给赞助商看价值",
        resultText:
          "你安排了几场采访和一个赞助商活动。选手们穿着赞助商的衣服笑得很灿烂。但训练时间少了两个小时，有人回训练室的时候还在刷自己的评论区。",
        effect: { economy: 8, morale: 4, discipline: -3, condition: -2, tactics: -2 },
      },
      {
        label: "用热度给选手建立信心",
        resultText:
          "你把那些好评剪辑成了一段视频放给全队看。不是膨胀——是让他们知道'你们确实做到了'。有人看到自己的名字被提起时，笑了。",
        effect: { morale: 6, cohesion: 3, firepower: 2, discipline: -1, condition: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["morale", "economy", "discipline", "condition"],
  },
  {
    id: "rivalry_matchup",
    category: "out_of_match",
    timing: ["before_match"],
    title: "宿敌对决",
    narrative:
      "下一场的对手是你们的老对手。去年他们在半决赛淘汰了你们，赛后的握手仪式上，你的队长连看都没看对方一眼。现在，又见面了。训练室里的气氛和平时不一样——连最话少的选手都在反复看对手的 demo。",
    triggerRequirements: [
      "下一场对手为宿敌队伍",
      "或上赛季曾被该对手淘汰",
    ],
    choices: [
      {
        label: "当普通比赛打，别给自己加戏",
        resultText:
          "你在准备会上说：'这就是一场八进四。赢了进四强，输了回家。跟对手是谁没关系。' 有人点头，但你知道——他们心里都记着去年。",
        effect: { discipline: 4, morale: 1, tactics: 2, cohesion: 1, condition: 1 },
      },
      {
        label: "放大宿敌叙事，让每个人都燃起来",
        resultText:
          "你放了去年被淘汰的录像。全场安静了三十秒，然后队长站起来说：'今年不一样。' 训练强度直接拉满。每个人都像在打磨武器。",
        effect: { firepower: 4, morale: 5, discipline: -2, condition: -2, cohesion: 3 },
      },
      {
        label: "研究对手到极致，用准备碾压情绪",
        resultText:
          "你让分析师把对手最近二十场比赛的录像全部拆了。每个选手的习惯位、偏好路线、经济局倾向——全部标了出来。准备到了极致，情绪就不重要了。",
        effect: { tactics: 6, discipline: 3, firepower: 1, condition: -1, tactical_control: 3 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "tactics", "discipline", "condition"],
  },
  {
    id: "late_night_scrim",
    category: "out_of_match",
    timing: ["before_cup"],
    title: "深夜训练赛",
    narrative:
      "凌晨一点，训练室还亮着灯。你的指挥和两个核心选手在打最后一轮训练赛。他们已经打了六个小时，但都说还想再打一场——'手感正热，别断了。' 教练在旁边打瞌睡。",
    triggerRequirements: [
      "杯赛开始前一至两天",
      "概率触发",
    ],
    choices: [
      {
        label: "强制关灯，让他们去睡觉",
        resultText:
          "你走进去拔了路由器电源。'明天再打。' 指挥想抗议，但看到你的表情没说话。第二天他们确实精神了很多——虽然有人嘟囔了一句'手感被你断了'。",
        effect: { condition: 5, discipline: 3, morale: -1, firepower: -1, tactics: 1 },
      },
      {
        label: "让他们打完这场",
        resultText:
          "你坐下来陪他们看完了最后一场训练赛。他们赢了，指挥笑得很开心。但第二天早上的热身赛，有三个人在打哈欠。",
        effect: { tactics: 3, condition: -4, discipline: -2, morale: 2, cohesion: 2 },
      },
      {
        label: "加一条：最后一场专门练对手的弱点",
        resultText:
          "你没让他们睡觉，但改了最后一场的训练目标：专门模拟下一场对手的打法。他们打了两个小时，收获比前面六个小时还大。代价是——第二天的黑眼圈。",
        effect: { tactics: 5, condition: -3, discipline: 2, morale: 1, tactical_control: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["condition", "tactics", "discipline", "morale"],
  },
  {
    id: "meta_patch",
    category: "out_of_match",
    timing: ["between_cups"],
    title: "版本更新",
    narrative:
      "休赛期，游戏推了一个平衡性更新。烟雾弹机制改了，某把步枪的伤害调了，经济系统微调了。你的分析师花了两天整理了一份文档——结论是：你们之前的几套核心战术，有一半需要改。",
    triggerRequirements: [
      "杯赛间隙",
      "概率触发",
    ],
    choices: [
      {
        label: "全面适应新版本，重写战术本",
        resultText:
          "你让教练组推倒重来。三天的训练营全在磨合新战术。旧的习惯被打破，新的还没完全建立——但至少不会在赛场上被版本甩开。",
        effect: { tactics: 3, discipline: 3, cohesion: -2, condition: -2, tactical_control: 4 },
      },
      {
        label: "只改受影响最大的部分，其余保持不变",
        resultText:
          "你让分析师标出受影响最大的三套战术，只改这三套。其余照旧。效率高，但你也知道——那些没改的部分，可能在某个关键回合里出问题。",
        effect: { tactics: 1, discipline: 2, cohesion: 1, condition: 1, tactical_control: 1 },
      },
      {
        label: "研究对手怎么适应，反向利用",
        resultText:
          "你没急着改自己的战术。你让分析师去研究——其他队伍会怎么适应新版本。然后你针对他们的适应方向，准备了一套反制方案。",
        effect: { tactics: 5, discipline: 1, cohesion: 2, condition: -1, tactical_control: 3 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["tactics", "discipline", "tactical_control"],
  },
  {
    id: "team_meeting_request",
    category: "out_of_match",
    timing: ["between_cups", "after_match"],
    title: "队员请求开会",
    narrative:
      "你的队长找到你：'教练，大家想开个会。不是战术的事。' 他的表情很认真。你知道——当选手主动要求开会的时候，通常意味着有什么事情已经酝酿很久了。",
    triggerRequirements: [
      "杯赛间隙",
      "队内 cohesion < 80",
      "概率触发",
    ],
    choices: [
      {
        label: "开，你旁听但不主导",
        resultText:
          "你坐在角落里。前十分钟是客套，之后有人开始说真话了。一个角色选手说觉得自己被忽视了，指挥说了句'我以为你知道你的价值。' 气氛松了。",
        effect: { cohesion: 6, morale: 3, discipline: 2, tactics: 1 },
      },
      {
        label: "开，但由你来主持",
        resultText:
          "你站在白板前面。你问了三个问题：哪里好、哪里不好、想怎么改。有人说你太正式了，但每个人都发了言。会议结束后，队长跟你说：'比我想象的好。'",
        effect: { cohesion: 4, discipline: 4, morale: 2, tactics: 2, tactical_control: 2 },
      },
      {
        label: "先跟队长单独谈，了解情况",
        resultText:
          "你把队长拉到一边。他告诉了你真正的问题——不是战术，是某个选手对上场时间不满。你心里有了数，再开会的时候就知道该往哪个方向引导了。",
        effect: { cohesion: 3, discipline: 2, morale: 1, tactics: 1, condition: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["cohesion", "morale", "leadership", "discipline"],
  },
  {
    id: "sponsor_pressure",
    category: "out_of_match",
    timing: ["before_cup", "between_cups"],
    title: "赞助商施压",
    narrative:
      "赞助商代表约你喝咖啡。寒暄了五分钟之后，他说：'这季度成绩不太理想啊。我们投了不少钱，希望看到回报。' 他笑得很客气，但意思很清楚——再不出成绩，明年的合同可能要重新谈。",
    triggerRequirements: [
      "上一杯赛未进入决赛",
      "或赛季整体成绩低于预期",
    ],
    choices: [
      {
        label: "承诺成绩，把压力扛下来",
        resultText:
          "你说：'下一杯进决赛。' 赞助商满意地走了。你回到训练室，把这个承诺咽在了肚子里——选手们不需要知道这个。但这意味着你已经没有退路了。",
        effect: { economy: 5, morale: -2, discipline: 3, tactics: 1, condition: -1 },
      },
      {
        label: "用数据说服他们，成绩没那么差",
        resultText:
          "你拿出了一份报告：队伍在进步，数据在变好，只是还没转化为成绩。赞助商听完之后沉吟了一下：'再给你们一个杯赛。' 暂时过去了。",
        effect: { economy: 2, discipline: 1, morale: 1, tactics: 2 },
      },
      {
        label: "把压力转达给队伍，'为了赞助商也得赢'",
        resultText:
          "你在队会上说了赞助商的要求。有人翻了个白眼，有人拳头握紧了。你知道这么做有风险——但有时候，外部压力比内部动员更管用。",
        effect: { morale: -3, discipline: 2, firepower: 3, cohesion: -2, condition: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["economy", "morale", "discipline", "pressure"],
  },
];

// ──────────────────────────────────────────────
// 比赛外突发事件 · 扩展
// ──────────────────────────────────────────────

const outOfMatchEventsExtended: GameEvent[] = [
  {
    id: "winning_streak_complacency",
    category: "out_of_match",
    timing: ["after_match", "between_cups"],
    title: "连胜后的暗礁",
    narrative:
      "两连冠了。媒体说你们是'王朝崛起'，粉丝开始在论坛里讨论'三连冠有没有可能'。训练室里的气氛变了——不是松懈，是那种'我们天然就该赢'的微妙膨胀。你的教练私底下跟你说：'他们训练赛开始随意了。'",
    triggerRequirements: [
      "连续赢得 >= 2 个杯赛冠军",
    ],
    choices: [
      {
        label: "泼冷水：放他们输了之后的录像",
        resultText:
          "你在复盘会上放了上个赛季被暴揍的那场录像。没人说话。你的队长看到自己送掉的那个残局时，把脸别过去了。训练赛的强度回来了。",
        effect: { discipline: 5, morale: -2, tactics: 2, cohesion: 2, condition: 1 },
      },
      {
        label: "趁势加练新战术，扩大优势",
        resultText:
          "你没泼冷水。你让教练组趁热打铁，开发几套新战术。选手们学得很快——自信的人学东西确实快。但训练量加大了，有人开始揉手腕。",
        effect: { tactics: 5, condition: -3, discipline: 2, morale: 2, cohesion: 1 },
      },
      {
        label: "让他们享受一下，信心也是资产",
        resultText:
          "你没干涉。连胜带来的自信是真实的，也是有用的。你只是默默记下了谁开始飘了，谁还保持专注。这笔账，迟早用得上。",
        effect: { morale: 5, discipline: -3, cohesion: 1, firepower: 2, tactics: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "discipline", "condition", "tactics"],
  },
  {
    id: "losing_streak_crisis",
    category: "out_of_match",
    timing: ["between_cups", "after_match"],
    title: "至暗时刻",
    narrative:
      "两个杯赛都没出小组赛。社交媒体上'解散重组'的帖子刷了屏。你的队长训练赛完一个人坐在角落里发呆，明星选手的经纪人开始频繁打电话。训练室里的灯还亮着，但你觉得空气是灰的。",
    triggerRequirements: [
      "连续 >= 2 个杯赛未进入淘汰赛",
    ],
    choices: [
      {
        label: "全队闭门会议：要么一起扛，要么散",
        resultText:
          "你关上门，说了一句：'想走的现在说。' 沉默了很久。最后你的队长站起来：'我哪儿都不去。' 一个接一个，所有人都站了起来。那天晚上，训练室的灯亮到了凌晨三点。",
        effect: { cohesion: 7, morale: 4, discipline: 3, tactics: 2, condition: -2 },
      },
      {
        label: "换人：把表现最差的放上替补席",
        resultText:
          "你做了最难的决定。那个表现最差的选手——不是不努力，是真的打不出来——被放上了替补席。他收拾东西的时候，没人敢看他。但训练赛的氛围确实变了，每个人都知道：位置不是铁打的。",
        effect: { firepower: 2, discipline: 4, cohesion: -4, morale: -3, tactics: 1 },
      },
      {
        label: "请心理辅导介入，先治心再治技",
        resultText:
          "你请了一位运动心理辅导师。第一次 session，有个选手哭了——他说他觉得自己在拖累队伍。辅导师没说什么大道理，只是让他知道：这种感觉是正常的。之后几周，空气慢慢不那么灰了。",
        effect: { morale: 5, condition: 3, cohesion: 3, discipline: 2, tactics: -1 },
      },
      {
        label: "赌一把：下个杯赛全换打法，打对手措手不及",
        resultText:
          "你让教练组推倒重来，换一套完全不同的战术体系。风险很大——磨合时间不够。但你们已经没什么可输的了。'让他们以为还是那支队伍，然后用他们没见过的方式打。'",
        effect: { tactics: -3, firepower: 3, discipline: -2, morale: 3, tactical_control: 4 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "cohesion", "discipline", "condition", "tactics"],
  },
  {
    id: "off_season_vacation",
    category: "out_of_match",
    timing: ["season_end"],
    title: "休赛期",
    narrative:
      "赛季结束了。无论成绩如何，选手们已经连续比赛了三个月。你的队长问你：'假怎么放？' 训练室的空气里弥漫着一种疲惫和期待的混合物——每个人都想休息，但每个人都知道，休息太久手感会凉。",
    triggerRequirements: [
      "赛季结束",
    ],
    choices: [
      {
        label: "放两周假，彻底断电",
        resultText:
          "你给了两周。'手机可以关，demo 不用看。回来再说。' 有人当天就订了机票。两周后回来，所有人都晒黑了——也确实精神了。只是第一天的训练赛，有人连预瞄都歪了。",
        effect: { condition: 8, morale: 6, firepower: -4, tactics: -3, discipline: -2 },
      },
      {
        label: "放一周假，第二周回来轻度训练",
        resultText:
          "一周彻底休息，第二周回来打打死斗、看看 demo，不上强度。折中方案——手感没全凉，人也没全回血。你看到有人在第一天训练的时候打哈欠，但第三天就好多了。",
        effect: { condition: 4, morale: 4, firepower: -1, tactics: -1, discipline: 1 },
      },
      {
        label: "只放三天，趁休赛期加练补短板",
        resultText:
          "你只给了三天。'你们觉得够了？不够也得够。我们还有短板要补。' 没人敢反对，但你看到队长的眼神里有一丝疲惫——那种'永远不结束'的疲惫。",
        effect: { tactics: 4, discipline: 3, condition: -5, morale: -4, cohesion: -2 },
      },
      {
        label: "放假但每人带一份'假期作业'",
        resultText:
          "你给每个人留了作业：看三场指定对手的 demo，写一份分析。'假期可以放松脑子，但别让脑子生锈。' 有人认真做了，有人明显是假期最后一天赶的。回来一问就知道谁用了心。",
        effect: { tactics: 3, condition: 5, morale: 2, discipline: 2, cohesion: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["condition", "morale", "tactics", "discipline"],
  },
  {
    id: "coaching_staff_change",
    category: "out_of_match",
    timing: ["between_cups", "season_end"],
    title: "教练组变动",
    narrative:
      "你的主教练约你私下谈。寒暄了两句之后，他说：'有另一支队伍找我了。待遇翻倍。' 他没说一定要走，但意思很清楚——他在等你表态。你的助理教练和分析师生怕被牵连，已经开始偷偷更新简历了。",
    triggerRequirements: [
      "杯赛间隙或赛季结束",
      "概率触发",
    ],
    choices: [
      {
        label: "加薪留人，砸钱也要留住核心",
        resultText:
          "你匹配了对方的报价。主教练留下来了，但你知道——钱能留人，不一定能留心。他接下来几个月确实在努力，但你能感觉到他在看别的机会。",
        effect: { tactics: 2, economy: -8, morale: 2, discipline: 1, cohesion: 1 },
      },
      {
        label: "放他走，从内部提拔助理教练",
        resultText:
          "你让他走了。助理教练被扶正——他年轻、有想法，和选手关系好。第一天带队训练，他紧张得声音都在抖。但第三天，他叫了一个前任从来没试过的战术，效果出奇的好。",
        effect: { tactics: -3, morale: 3, cohesion: 4, discipline: -1, tactical_control: 2 },
      },
      {
        label: "放他走，外部挖一个有成绩的教练",
        resultText:
          "你从外面挖了一个有大赛冠军经验的教练。他第一天进训练室就立了规矩：'我说话的时候不许看手机。' 选手们不太适应这种强硬风格，但他的战术储备确实深。",
        effect: { tactics: 5, discipline: 4, morale: -2, cohesion: -3, tactical_control: 3 },
      },
      {
        label: "跟他谈：想走可以，但带完这个赛季",
        resultText:
          "你没加薪也没放人。你说：'这个赛季带完，我送你走。' 他愣了一下，然后点头。接下来几个月，他比之前更拼——也许是愧疚，也许是职业素养。但你知道，倒计时开始了。",
        effect: { tactics: 3, morale: 1, discipline: 3, cohesion: -1, economy: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["tactics", "economy", "cohesion", "leadership"],
  },
  {
    id: "tactical_overhaul",
    category: "out_of_match",
    timing: ["between_cups", "season_end"],
    title: "战术推倒重来",
    narrative:
      "你的教练在白板上画了两个小时。擦了写，写了擦。最后他转过来跟你说：'我们现在的体系已经被对手研究透了。不改，下个杯赛还是死路一条。' 白板上只剩三个字：全部重来。",
    triggerRequirements: [
      "杯赛间隙",
      "上一杯赛成绩低于预期",
      "或对手 anti-strat 触发过",
    ],
    choices: [
      {
        label: "全面革新，接受短期阵痛",
        resultText:
          "你点了头。接下来两周的训练赛惨不忍睹——新战术还没磨合好，选手们频繁犯错。但第三周开始，有些东西开始click了。下个杯赛，对手拿出的反制方案全部落空。",
        effect: { tactics: 4, discipline: 2, condition: -3, morale: -2, tactical_control: 5, cohesion: -1 },
      },
      {
        label: "保留核心框架，只改最容易被针对的部分",
        resultText:
          "你否决了全盘推翻。'骨头留着，换皮就行。' 教练有点失望，但照做了。改动小，磨合快，但你也知道——那些没改的部分，如果对手继续研究，迟早还是会被看穿。",
        effect: { tactics: 2, discipline: 2, morale: 1, cohesion: 2, tactical_control: 2 },
      },
      {
        label: "让选手投票决定改不改",
        resultText:
          "你把决定权交给了选手。投票结果 3-2，支持改。少数派没说什么，但训练的时候你能感觉到配合的不情愿。民主有时候是有代价的。",
        effect: { tactics: 3, cohesion: -2, discipline: -1, morale: 2, tactical_control: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["tactics", "discipline", "cohesion", "tactical_control"],
  },
  {
    id: "new_player_integration",
    category: "out_of_match",
    timing: ["between_cups", "campaign_start"],
    title: "新人入队",
    narrative:
      "新签的选手第一天到基地。他二十岁，之前在二线队伍打出来，数据漂亮，但这是他第一次进一线队。他站在训练室门口，背包带攥得发白。你的队长走过去拍了一下他的肩：'别紧张，坐哪儿都行。' 但你看得出来——老队员们在打量他，像在评估一块新零件能不能用。",
    triggerRequirements: [
      "阵容发生变动",
      "新选手加入队伍",
    ],
    choices: [
      {
        label: "给他时间，先融入再上强度",
        resultText:
          "你让教练第一周别给他安排关键位。他先打自由人，熟悉队伍的沟通节奏。一周后他开始主动报点了，两周后他在训练赛里打出了一次 1v3 翻盘——全场沉默了一秒，然后爆发出欢呼。",
        effect: { cohesion: 4, morale: 3, firepower: 2, tactics: -2, condition: 2 },
      },
      {
        label: "直接扔进深水区，让他打核心位",
        resultText:
          "你让他第一天就打突破手。老队员有些不适应——这个位置的沟通方式和他们习惯的不一样。训练赛输了三场。但第四场，他打出了一波个人秀。老队员看他的眼神变了。",
        effect: { firepower: 4, cohesion: -3, tactics: -3, morale: 1, discipline: -1 },
      },
      {
        label: "让队长一对一带着他",
        resultText:
          "你让队长做他的'导师'。两个人同吃同住同训练，队长把每一个决策的逻辑都讲给他听。磨合慢，但扎实。一个月后，他们的双排配合成了全队最默契的一组。",
        effect: { cohesion: 5, tactics: 3, firepower: 1, discipline: 2, condition: -1 },
      },
      {
        label: "冷处理：让他自己证明自己",
        resultText:
          "你没做任何特殊安排。'职业选手，用表现说话。' 他确实在拼命证明自己——训练量是全队最大的。但你能看到他独来独往的背影，和更衣室里其他人的笑声格格不入。",
        effect: { firepower: 3, discipline: 3, cohesion: -4, morale: -1, tactics: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["cohesion", "firepower", "tactics", "leadership"],
  },
  {
    id: "role_clash",
    category: "out_of_match",
    timing: ["between_cups", "campaign_start"],
    title: "角色冲突",
    narrative:
      "新来的选手和老队员打同一个位置。新来的更年轻、反应更快；老队员更有经验、更稳。训练赛里两个人都想抢突破手的位置，谁也不肯让。你的队长私下来找你：'这事儿你得管管，不然要出事。'",
    triggerRequirements: [
      "队内存在位置重叠的两名选手",
    ],
    choices: [
      {
        label: "让老队员让位，新人打首发",
        resultText:
          "你找老队员谈。他沉默了很久，说：'行。' 但你看到他收拾东西时手在抖。新人打首发的第一场训练赛，老队员坐在后面看，表情你读不懂。",
        effect: { firepower: 3, cohesion: -4, morale: -2, discipline: 1, tactics: 1 },
      },
      {
        label: "新人改位置，适应老队员的体系",
        resultText:
          "你让新人改打自由人。他不太情愿——他一直是突破手。但他适应得比你想象的快。两周后他在新位置上打出了一次让全场起立的残局。'也许这个位置更适合我。' 他嘴上没说，但眼神说了。",
        effect: { cohesion: 3, firepower: 1, tactics: 2, morale: 2, discipline: 2 },
      },
      {
        label: "轮换制：两人按状态竞争上岗",
        resultText:
          "你宣布：训练赛和正赛都按状态排首发。两个人都拼了——训练量翻倍。但你也注意到，他们开始互相防着，不愿意分享对手的研究心得。竞争变成了内耗。",
        effect: { firepower: 4, discipline: 3, cohesion: -3, morale: 1, tactics: -1 },
      },
      {
        label: "创造一个新战术角色，让两人都能发挥",
        resultText:
          "你让教练设计一套双突破手体系。两个人不再抢同一个位置，而是形成交叉火力。磨合期很痛苦——沟通量翻倍，失误也翻倍。但磨合好之后，对手第一次遇到了'两个突破手同时冲'的噩梦。",
        effect: { tactics: 4, firepower: 3, cohesion: 2, discipline: -2, condition: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["cohesion", "firepower", "tactics", "leadership"],
  },
  {
    id: "wrist_injury_rsi",
    category: "out_of_match",
    timing: ["before_cup", "between_cups"],
    title: "手腕警报",
    narrative:
      "你的主力步枪手今天训练迟到了。他来的时候手腕上缠着护具，脸色不太好。队医检查之后把你拉到一边：'腱鞘炎初期。继续高强度训练可能恶化，但休息两周的话——你知道这意味着什么。'",
    triggerRequirements: [
      "队内存在训练量过大的选手",
      "概率触发",
    ],
    choices: [
      {
        label: "强制休息两周，用替补顶上",
        resultText:
          "你让他停手两周。他急了——'两场比赛我就回来了。' 但你看到他拿水杯的时候手腕在抖。替补顶上了，表现差了一截。两场训练赛输了。但两周后他回来了，手腕不疼了。",
        effect: { firepower: -2, condition: 6, morale: -1, cohesion: 2, discipline: 2 },
      },
      {
        label: "减量训练，打封闭上场",
        resultText:
          "你让队医打了封闭，训练量减半，正赛照打。他咬牙打完了杯赛——数据还行，但每场比赛后他都在冰敷。你不知道这个选择会让他的职业生涯缩短多少。",
        effect: { firepower: 1, condition: -5, morale: 2, discipline: 2, economy: 1 },
      },
      {
        label: "调整他的鼠标握姿和外设",
        resultText:
          "你请了人体工学专家，调整了他的握姿、鼠标高度和椅子角度。前两天他打得很难受——像重新学走路。但一周后，他的手腕不怎么疼了，而且预瞄反而更稳了。",
        effect: { firepower: 2, condition: 4, discipline: 3, tactics: 1, morale: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["condition", "firepower", "substitute", "discipline"],
  },
  {
    id: "player_burnout",
    category: "out_of_match",
    timing: ["between_cups", "before_cup"],
    title: "倦怠期",
    narrative:
      "你的队长最近训练总迟到，来了也是心不在焉。demo 不看了，死斗不打了，训练赛打完就走。你没发火——你认出了这个状态。不是懒，是燃尽了。三个月的高强度比赛，加上场外的舆论压力，他的油灯快见底了。",
    triggerRequirements: [
      "赛季进行到中期或后期",
      "该选手连续参加 >= 2 个杯赛",
      "概率触发",
    ],
    choices: [
      {
        label: "给他一周假，强制断电",
        resultText:
          "你让他一周别来基地。'手机可以关。' 他走的时候回头看了一眼训练室，像是不放心。一周后回来，他的眼睛里有了点光。不是满血复活，但至少不是那个行尸走肉了。",
        effect: { condition: 6, morale: 4, discipline: -2, tactics: -2, cohesion: -1 },
      },
      {
        label: "减少他的战术负担，让他只管打",
        resultText:
          "你没让他休息，但把他的指挥权临时交给了副队长。'你只管杀人，别的不用想。' 他一开始不适应——他已经习惯了什么都管。但三天后，他的 KD 回升了。有时候减负比休息更管用。",
        effect: { firepower: 4, tactics: -3, morale: 3, condition: 2, cohesion: 1 },
      },
      {
        label: "跟他深谈一次，找到根源",
        resultText:
          "你把他拉到基地外面喝了杯咖啡。没聊比赛。聊了聊他的家人、他最初为什么打职业、他最近在焦虑什么。他说了一句：'我怕我巅峰过了。' 你没回答。但那次谈话之后，他训练的专注度不一样了。",
        effect: { morale: 5, condition: 3, discipline: 2, cohesion: 3, tactics: 1 },
      },
      {
        label: "不管，职业选手就得扛着",
        resultText:
          "你没说什么。职业赛场不相信倦怠，只相信成绩。他继续训练，继续比赛。数据没掉太多——但你在他的比赛回放里看到了一些以前没有的东西：犹豫。那是一种比失误更可怕的东西。",
        effect: { firepower: -2, discipline: 1, morale: -3, condition: -3, tactics: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["condition", "morale", "tactics", "firepower"],
  },
  {
    id: "streaming_distraction",
    category: "out_of_match",
    timing: ["between_cups", "before_cup"],
    title: "直播分心",
    narrative:
      "你的明星选手最近开始频繁直播。粉丝涨了，打赏多了，赞助商也高兴。但你的教练拿了份数据给你看：过去两周，他的训练赛 KD 从 1.3 掉到了 0.9。直播到凌晨两点，第二天训练赛打哈欠。",
    triggerRequirements: [
      "队内存在 firepower >= 85 的选手",
      "概率触发",
    ],
    choices: [
      {
        label: "限制直播时间，训练日禁播",
        resultText:
          "你下了规定：训练日不直播，休息日最多两小时。他有点不满——直播收入不低。但他没公开反对。两周后 KD 回来了。直播间的粉丝数掉了一些，但他说：'冠军比粉丝重要。'",
        effect: { discipline: 4, firepower: 2, economy: -3, morale: -1, condition: 2 },
      },
      {
        label: "不管，直播也是个人品牌建设",
        resultText:
          "你没干涉。他的直播间越来越火，个人品牌值涨了，赞助商也满意。但训练赛的数据继续下滑。你在赌——赌他的天赋能cover掉状态下滑。这赌注不小。",
        effect: { economy: 5, firepower: -3, discipline: -3, morale: 2, condition: -2 },
      },
      {
        label: "把直播变成训练的一部分",
        resultText:
          "你让他直播训练赛的复盘，边看边给观众讲战术逻辑。意外的是——讲的过程也帮他理清了思路。直播间的观众学到了东西，他的战术理解也深了。双赢。",
        effect: { tactics: 3, economy: 2, morale: 2, discipline: 2, firepower: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["discipline", "firepower", "economy", "condition"],
  },
  {
    id: "poaching_attempt",
    category: "out_of_match",
    timing: ["between_cups"],
    title: "挖角",
    narrative:
      "你的明星选手的经纪人约你见面。寒暄之后他说：'有一支队伍开出了两倍薪资加签字费。我们不是一定要走，但你也知道——选手的黄金期就那么几年。' 他没说最后通牒，但意思很清楚。",
    triggerRequirements: [
      "杯赛间隙",
      "队内存在 firepower >= 88 的选手",
      "概率触发",
    ],
    choices: [
      {
        label: "匹配报价，砸钱留人",
        resultText:
          "你匹配了薪资。选手留下来了。但俱乐部的预算被挤压了——其他位置的选手加薪无望，训练设施的升级也搁置了。你保住了王牌，但代价是全队的士气。",
        effect: { firepower: 2, economy: -10, morale: 1, cohesion: -1, discipline: 1 },
      },
      {
        label: "不匹配，但谈感情和未来",
        resultText:
          "你没谈钱。你跟他聊了俱乐部的三年规划、你对他职业生涯的设想、你相信他能成为历史最佳。他听完沉默了很久，说：'我再想想。' 三天后他留了——但你知道，感情这张牌打不了第二次。",
        effect: { morale: 3, cohesion: 3, economy: 2, discipline: 2, firepower: 1 },
      },
      {
        label: "趁高价卖人，用转会费重组",
        resultText:
          "你同意了转会。转会费很可观。你用这笔钱签了两个潜力新人，还升级了训练设施。明星选手走的那天，训练室安静了一下午。但一个月后，两个新人的表现让你觉得——也许这笔买卖不亏。",
        effect: { economy: 8, firepower: -4, morale: -3, cohesion: -2, tactics: -2 },
      },
      {
        label: "设置天价违约金，堵死转会",
        resultText:
          "你在合同里加了天价违约金条款。对方队伍看到数字后撤了。选手没说什么，但你知道他心里不舒服——你等于用合同锁住了他。短期内人留住了，但心呢？",
        effect: { firepower: 1, economy: -2, morale: -3, cohesion: -2, discipline: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["economy", "firepower", "morale", "cohesion"],
  },
  {
    id: "prize_money_dispute",
    category: "out_of_match",
    timing: ["after_match", "between_cups"],
    title: "奖金分配",
    narrative:
      "杯赛拿了一笔奖金。问题来了——怎么分？俱乐部管理层认为应该大头归俱乐部（场地、工资、运营都是俱乐部出的），选手认为应该按贡献分（没有他们打哪来的奖金）。你的队长代表选手来跟你谈：'哥，大家觉得至少六四。'",
    triggerRequirements: [
      "上一杯赛获得了奖金",
      "概率触发",
    ],
    choices: [
      {
        label: "同意六四，选手拿大头",
        resultText:
          "你同意了。选手们很高兴，训练积极性明显提高了。但俱乐部财务报表不好看——管理层对你的评价降了一档。你用管理层的信任换了选手的忠诚。",
        effect: { morale: 5, economy: -5, discipline: 2, cohesion: 3, condition: 1 },
      },
      {
        label: "坚持俱乐部拿大头，按合同来",
        resultText:
          "你拿出了合同。白纸黑字：奖金俱乐部拿 60%。选手们没再说什么——合同是签过的。但训练室的空气冷了。你的队长训练完没跟任何人说话就走了。",
        effect: { economy: 5, morale: -4, cohesion: -3, discipline: 1, tactics: -1 },
      },
      {
        label: "折中：五五分，但设绩效奖金池",
        resultText:
          "你提了个折中：基础奖金五五分，但拿出 10% 设绩效池——MVP、关键回合表现好的多拿。选手们接受了。有人开始更关注自己的数据——是好事还是坏事，你还拿不准。",
        effect: { economy: -1, morale: 3, discipline: 3, firepower: 2, cohesion: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["economy", "morale", "cohesion", "discipline"],
  },
  {
    id: "team_house_issue",
    category: "out_of_match",
    timing: ["between_cups", "campaign_start"],
    title: "基地风波",
    narrative:
      "起因很小——谁该打扫厨房。然后变成了网络谁用的多谁交钱。然后变成了作息冲突——有人凌晨两点还在打排位，有人十一点要睡觉。你的队长找你：'再不管，基地要炸了。'",
    triggerRequirements: [
      "队伍住在集体基地",
      "概率触发",
    ],
    choices: [
      {
        label: "立规矩：作息表、值日表、网费分摊",
        resultText:
          "你贴了一张表在客厅：训练时间、休息时间、值日轮换。有人觉得像回到了军训。但三天后，厨房干净了，半夜没人喊了。规矩这东西，不舒服但管用。",
        effect: { discipline: 5, condition: 3, morale: -1, cohesion: 2, tactics: 1 },
      },
      {
        label: "让选手自己搬出去住，只训练时集合",
        resultText:
          "你解散了集体住宿。选手们自己租房——有人住得好，有人住得差。训练时集合，其余时间自由。自由度高了，但团队凝聚力确实降了——他们不再一起吃夜宵、一起看比赛了。",
        effect: { morale: 3, condition: 2, cohesion: -4, discipline: -2, tactics: -1 },
      },
      {
        label: "换个大基地，每个人都有独立空间",
        resultText:
          "你花钱换了个大基地——五间独立卧室，共用训练区和厨房。成本高了，但摩擦小了。选手们终于有了自己的空间，公共区域的冲突也少了。",
        effect: { economy: -5, morale: 4, condition: 3, cohesion: 2, discipline: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["cohesion", "discipline", "condition", "economy"],
  },
  {
    id: "diet_fitness",
    category: "out_of_match",
    timing: ["between_cups", "before_cup"],
    title: "体能红灯",
    narrative:
      "你的队医拉你到一边，表情严肃：'全队的体能测试结果出来了。三个人超重，两个人的颈椎有早期问题，所有人的心肺功能都低于同龄人平均值。他们一天坐十二个小时，吃不健康的外卖，不运动。这样下去，别说打比赛，三十岁之后生活质量都是问题。'",
    triggerRequirements: [
      "赛季中期",
      "概率触发",
    ],
    choices: [
      {
        label: "强制每天一小时体能训练",
        resultText:
          "你请了健身教练，每天下午五点到六点是体能时间。选手们叫苦连天——'我又不是运动员。' 但你是认真的。一个月后，有人的颈椎不疼了，有人的反应速度居然快了。久坐是真的会变慢。",
        effect: { condition: 5, discipline: 3, morale: -2, firepower: 2, tactics: -1 },
      },
      {
        label: "只改饮食，请营养师配餐",
        resultText:
          "你没逼他们运动，但请了营养师换了基地的餐食。外卖没了，换成了高蛋白低油的定制餐。有人偷偷点外卖被抓到——罚了一笔钱。但大部分人的精神状态确实好了。",
        effect: { condition: 3, discipline: 2, morale: 1, economy: -2, tactics: 1 },
      },
      {
        label: "不强制，但设奖励机制",
        resultText:
          "你设了个规矩：每月体测达标的有奖金。有人为了钱开始跑步了，有人无动于衷。效果参差，但至少不是全员摆烂。那个为了奖金开始健身的选手，后来成了全队体能最好的。",
        effect: { condition: 2, economy: -3, discipline: 1, morale: 2, firepower: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["condition", "discipline", "firepower", "economy"],
  },
  {
    id: "fan_meet_obligation",
    category: "out_of_match",
    timing: ["before_cup", "between_cups"],
    title: "商业活动",
    narrative:
      "市场部安排了一个粉丝见面会，就在下个杯赛前三天。两小时的签名合影、互动游戏、赞助商致辞。选手们收到通知的时候脸色不太好——训练计划又要被打乱了。你的队长说：'能不能推了？'",
    triggerRequirements: [
      "杯赛开始前 1-3 天",
      "概率触发",
    ],
    choices: [
      {
        label: "推掉，训练优先",
        resultText:
          "你跟市场部说活动取消。市场部负责人脸色铁青——赞助商已经付了钱。你扛住了压力。选手们安心训练了，但俱乐部和赞助商的关系受损了。",
        effect: { tactics: 2, condition: 2, economy: -4, morale: 2, discipline: 1 },
      },
      {
        label: "去，但压缩到一小时",
        resultText:
          "你跟市场部谈：一小时，只签名合影，不做互动游戏。赞助商勉强同意了。选手们去了一个半小时——路上来回比活动本身还长。训练被切掉了一块，但至少没全断。",
        effect: { economy: 1, morale: -1, condition: -1, tactics: -1, discipline: 1 },
      },
      {
        label: "去，但只派两个代表",
        resultText:
          "你让队长和一个明星选手去，其他人照常训练。去的两个人不太高兴——凭什么是我？留下的人也不太高兴——凭什么他们可以逃避？但这种安排至少保全了大部分训练时间。",
        effect: { economy: 2, morale: -2, cohesion: -1, tactics: 1, condition: 1 },
      },
      {
        label: "去，把它当成团队建设",
        resultText:
          "你让全队都去，但换了思路：不是被动应付，而是让选手们一起设计互动环节。他们居然投入了——有人设计了跟粉丝的 1v1 挑战赛，玩得很开心。回来的路上，车里的气氛比去的时候松了。",
        effect: { morale: 4, cohesion: 3, economy: 1, condition: -1, tactics: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["economy", "morale", "condition", "tactics", "cohesion"],
  },
  {
    id: "analyst_power_struggle",
    category: "out_of_match",
    timing: ["between_cups"],
    title: "分析师越界",
    narrative:
      "你的数据分析师最近越来越频繁地在训练赛后发表意见——不只是数据报告，而是开始指挥战术。'这个默认控图效率太低，应该改成……' 你的教练终于忍不住了，把你拉到一边：'到底谁在带队？'",
    triggerRequirements: [
      "队伍配有数据分析师",
      "概率触发",
    ],
    choices: [
      {
        label: "明确分工：分析师只出报告，教练做决策",
        resultText:
          "你把两个人叫到一起，划清了界限：分析师出数据和趋势，教练做最终战术决策。分析师有点失落——他觉得自己比教练懂。但他服从了。流程清楚了，摩擦少了。",
        effect: { tactics: 2, discipline: 3, cohesion: 1, morale: 1, tactical_control: 2 },
      },
      {
        label: "让分析师参与战术讨论，但教练有否决权",
        resultText:
          "你没压制分析师，而是把他纳入了战术讨论会——但最终拍板权归教练。效果出乎意料：分析师的数据视角和教练的经验视角形成了互补。有些以前没想到的战术，在数据支撑下被验证了。",
        effect: { tactics: 4, discipline: 2, cohesion: 2, morale: 2, tactical_control: 1 },
      },
      {
        label: "换掉分析师，请一个只做数据不干涉战术的",
        resultText:
          "你觉得分析师已经越界了，影响到了教练的权威。你换了个新人——只出报告，不发表战术意见。教练满意了。但你偶尔会想起前任分析师提过的那几个后来被证明正确的建议。",
        effect: { tactics: -1, discipline: 3, cohesion: 2, morale: 1, tactical_control: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["tactics", "discipline", "cohesion", "leadership"],
  },
  {
    id: "veteran_rookie_dynamics",
    category: "out_of_match",
    timing: ["between_cups", "campaign_start"],
    title: "老带新",
    narrative:
      "你的老将最近找你：'新来的那小孩有天赋，但打法太独了。他不看队友位置，不补枪，自己杀完就完了。我教了他两次，他不听。' 老将的语气不像告状，更像担忧。'他再这样下去，天赋就废了。'",
    triggerRequirements: [
      "队内存在经验值高的老将和新人",
    ],
    choices: [
      {
        label: "让老将全权负责带新人",
        resultText:
          "你跟新人说：'训练之外的时间，听他的。' 老将把他当徒弟带——复盘时一对一讲，训练后加练补枪配合。一个月后，新人开始主动报点了。他后来跟人说：'老哥教我的不是技术，是思路。'",
        effect: { cohesion: 4, tactics: 3, discipline: 2, firepower: 1, morale: 2 },
      },
      {
        label: "让新人看老将的第一视角 demo",
        resultText:
          "你让新人每天看一场老将的 POV demo，写笔记。他一开始觉得无聊——'不就是架枪吗？' 但看到第三场，他发现了：老将每一次走位都在给队友创造空间。'原来补枪不是跟在后面杀，是让队友敢冲。'",
        effect: { tactics: 3, cohesion: 2, discipline: 2, firepower: 1, morale: 1 },
      },
      {
        label: "不给特殊安排，让他们自己磨合",
        resultText:
          "你没介入。老将继续教，新人继续偶尔听偶尔不听。摩擦在继续——但也在慢慢减少。两个月后，他们打出了一个配合默契的双人突破。磨合这东西，有时候急不来。",
        effect: { cohesion: 1, tactics: 1, firepower: 2, discipline: -1, morale: 0 },
      },
      {
        label: "跟新人单独谈：'你是想当一个杀手还是一个冠军'",
        resultText:
          "你把新人拉到一边：'你的数据很好。但你知道为什么队友不夸你吗？因为你赢了回合，他们没赢。' 他愣了。你继续：'老将能教你的是怎么让全队赢。你想学吗？' 他低下了头。",
        effect: { cohesion: 3, tactics: 2, discipline: 3, morale: 1, firepower: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["cohesion", "tactics", "firepower", "leadership"],
  },
  {
    id: "sleep_schedule_chaos",
    category: "out_of_match",
    timing: ["before_cup", "between_cups"],
    title: "作息崩了",
    narrative:
      "凌晨三点，你经过训练室——灯还亮着。两个人在打排位，一个人在看 YouTube，一个人在跟女朋友视频。第二天上午十点的训练赛，只有一个人准时到了。你的教练把训练赛推迟了半小时，脸色铁青。",
    triggerRequirements: [
      "概率触发",
    ],
    choices: [
      {
        label: "强制断网：午夜十二点关 WiFi",
        resultText:
          "你让工作人员每晚十二点关训练室的网。有人抗议——'我睡不着的时候打两把排位怎么了？' 你说：'睡不着可以看书。' 抗议没了。一周后，上午训练赛的准时率回到了 100%。",
        effect: { condition: 4, discipline: 4, morale: -2, tactics: 1, cohesion: 1 },
      },
      {
        label: "调整训练时间，适应他们的生物钟",
        resultText:
          "你没强迫他们早睡，而是把训练赛从上午改到了下午。'你们晚上精神，那就晚上多练。' 训练效率确实高了。但跟其他队伍约训练赛的时间冲突了——别人都是下午开始的。",
        effect: { condition: 2, morale: 3, tactics: 2, discipline: -1, cohesion: 1 },
      },
      {
        label: "设奖惩：准时到的有奖金，迟到的罚款",
        resultText:
          "你立了规矩：训练赛迟到一次罚款 500，准时一个月奖 2000。有人为了不罚款定了三个闹钟。有人不在乎钱照迟不误——你把罚款充进了团队活动基金，至少让迟到变成全队的损失。",
        effect: { discipline: 3, economy: -1, condition: 2, morale: 1, cohesion: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["condition", "discipline", "morale", "tactics"],
  },
  {
    id: "confidence_crisis_star",
    category: "out_of_match",
    timing: ["between_cups", "before_cup"],
    title: "信心崩塌",
    narrative:
      "他已经连续三场训练赛 KD 低于 1.0 了——对于他这种级别的选手，这相当于灾难。他开始在训练赛里犹豫了：该开的枪不开，该推的位不推，该接的残局躲了。教练说：'他的手没问题，脑子出了问题。'",
    triggerRequirements: [
      "队内存在 firepower >= 85 的选手",
      "该选手近期表现低于预期",
      "概率触发",
    ],
    choices: [
      {
        label: "让他看自己巅峰期的集锦",
        resultText:
          "你剪了一段他去年 MVP 那场的高光集锦，发给了他。没附任何话。第二天训练赛，他打出了近一个月最好的数据。后来他跟队友说：'我都忘了自己能那样打。'",
        effect: { morale: 4, firepower: 4, discipline: 1, condition: 1, cohesion: 1 },
      },
      {
        label: "给他减压：换角色，让他别背压力",
        resultText:
          "你让他从突破手换到架枪位。不用他冲了，不用他首杀了——只要他守住一个角度。他一开始不适应，但一周后，他的击杀数回来了。有时候退一步不是为了退，是为了找回节奏。",
        effect: { firepower: 2, tactics: -1, morale: 3, discipline: 2, condition: 2 },
      },
      {
        label: "让他休息一场正赛，从场外看比赛",
        resultText:
          "你让他下一场杯赛坐板凳。他炸了——'你觉得我不行了你直说。' 你说：'我觉得你需要换个角度看比赛。' 他没去替补席，而是站在你旁边看了一整场。回来之后，他的打法变了——更聪明了。",
        effect: { firepower: 1, tactics: 3, morale: -2, discipline: 2, cohesion: -1 },
      },
      {
        label: "请运动心理专家介入",
        resultText:
          "你请了一位专门服务运动员的心理专家。前两次 session 他很抗拒——'我又没病。' 第三次之后他开始认真了。专家没教他怎么打枪，教了他怎么跟自己的焦虑共处。一个月后，他在关键回合不再犹豫了。",
        effect: { morale: 4, condition: 3, firepower: 2, discipline: 2, tactics: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["firepower", "morale", "condition", "tactics"],
  },
  {
    id: "schedule_overload",
    category: "out_of_match",
    timing: ["between_cups", "before_cup"],
    title: "赛程过载",
    narrative:
      "你的队医拿着一份日程表来找你——上面密密麻麻全是训练赛、商业活动、媒体采访、赞助商拍摄。'他们连续三周没有完整休息日了。上周有两个人的睡眠数据低于六小时。再这样下去，不用对手打，我们自己就崩了。'",
    triggerRequirements: [
      "赛季密集期",
      "概率触发",
    ],
    choices: [
      {
        label: "砍掉所有非必要活动，只保留训练和比赛",
        resultText:
          "你大刀阔斧地砍掉了所有商业活动、媒体采访和赞助商拍摄。市场部负责人差点跟你翻脸。选手们终于有了喘息的空间——第一个完整的休息日，有三个人睡到了下午。",
        effect: { condition: 5, morale: 4, economy: -4, discipline: 2, tactics: 1 },
      },
      {
        label: "压缩训练赛数量，提高单场质量",
        resultText:
          "你没砍活动，但把训练赛从每天两场砍到一场。每场训练赛前增加了半小时的战术准备，训练后增加了半小时的复盘。数量减了，质量上去了——选手们反馈说这样反而吸收得更好。",
        effect: { tactics: 3, condition: 3, morale: 2, discipline: 2, economy: -1 },
      },
      {
        label: "咬牙撑过去，赛季结束再说",
        resultText:
          "你没调整。'这个阶段谁不累？撑过去就好了。' 选手们没说什么，但你看到训练室里的笑声越来越少了。有人开始在训练间隙打瞌睡。你赌的是他们的韧性——但韧性不是无限的。",
        effect: { tactics: 1, condition: -5, morale: -3, discipline: 1, cohesion: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["condition", "morale", "economy", "tactics"],
  },
  {
    id: "boot_camp_decision",
    category: "out_of_match",
    timing: ["before_cup", "between_cups"],
    title: "集训抉择",
    narrative:
      "下个杯赛在欧洲举行。你的教练提议：提前两周去欧洲集训，适应时差、跟欧洲队伍约训练赛。预算不少——机票、住宿、训练基地租金。财务那边在等你拍板。",
    triggerRequirements: [
      "下个杯赛在异地/海外举行",
    ],
    choices: [
      {
        label: "去，提前两周出国集训",
        resultText:
          "你批了预算。前三天时差没倒过来，训练赛全输。第四天开始赢回来了。更重要的是——他们跟欧洲顶级队伍的训练赛里学到了新的战术思路。下个杯赛的表现，值回票价。",
        effect: { tactics: 5, condition: -2, economy: -6, morale: 3, cohesion: 3, tactical_control: 3 },
      },
      {
        label: "不去，在国内按正常节奏备战",
        resultText:
          "你省下了这笔钱。在国内备战一切照旧——训练赛质量也不错，只是对手都是亚洲队伍。到了杯赛，面对欧洲队的打法风格，前两场明显不适应。",
        effect: { economy: 4, tactics: -2, condition: 2, morale: 1, tactical_control: -1 },
      },
      {
        label: "去一周，折中方案",
        resultText:
          "你折中了一下：去一周。够倒时差，够约几场训练赛，但不够深入磨合。选手们觉得刚刚好——不至于太累，也确实感受到了不同的比赛节奏。",
        effect: { tactics: 3, condition: 0, economy: -3, morale: 2, cohesion: 2, tactical_control: 1 },
      },
      {
        label: "去，但顺路安排跟当地粉丝的见面会",
        resultText:
          "你去了集训，还安排了一场当地粉丝见面会。赞助商很高兴——海外曝光是加分项。但见面会占了一个下午的训练时间。选手们嘴上说没关系，但你能看到他们的疲惫。",
        effect: { tactics: 3, economy: 2, morale: 2, condition: -3, cohesion: 1, tactical_control: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["tactics", "economy", "condition", "cohesion", "tactical_control"],
  },
  {
    id: "demo_leak_concern",
    category: "out_of_match",
    timing: ["before_cup", "between_cups"],
    title: "战术泄露",
    narrative:
      "你的分析师发现了一件令人不安的事：某个二线队伍最近在训练赛里用的战术，和你们上周刚练的新战术几乎一模一样。巧合？还是你们的训练内容泄露了？你的教练开始检查训练室的网络安全。",
    triggerRequirements: [
      "概率触发，稀有",
    ],
    choices: [
      {
        label: "全面更换战术本，假设已全部泄露",
        resultText:
          "你让教练组推倒重来。两周的心血白费了。新战术仓促上马，磨合不够。但至少——对手的反制全部落空了。你不知道泄露源在哪，但你知道：不能再用旧的了。",
        effect: { tactics: -2, discipline: 3, morale: -2, tactical_control: 2, condition: -1 },
      },
      {
        label: "保留核心战术，只改关键细节",
        resultText:
          "你没全换。骨架留着，但改了几个关键的时间点和道具搭配。对手如果真拿到了旧版战术，会发现'看着一样，打起来不一样'。这是信息战。",
        effect: { tactics: 2, discipline: 2, morale: 1, tactical_control: 3, cohesion: 1 },
      },
      {
        label: "反向操作：故意泄露假战术给对手",
        resultText:
          "你让助理通过'非官方渠道'放出几套假战术。对手如果信了，会在赛场上准备错方向。这是一场心理战——赌的是对手的情报收集够不够仔细。",
        effect: { tactics: 4, discipline: 1, morale: 2, tactical_control: 4, cohesion: 1 },
      },
      {
        label: "加强安保，但不改战术",
        resultText:
          "你升级了训练室的网络安全，限制了外人进入。战术没改——你赌这只是巧合。如果真是泄露，不改战术就是送死。如果是巧合，改了就是浪费。硬币还在空中。",
        effect: { tactics: 0, discipline: 3, morale: 0, tactical_control: 0, economy: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["tactics", "discipline", "tactical_control", "economy"],
  },
  {
    id: "org_financial_pressure",
    category: "out_of_match",
    timing: ["between_cups", "season_end"],
    title: "俱乐部缺钱了",
    narrative:
      "老板把你叫到办公室。他没绕弯子：'投资方撤资了。下个赛季预算砍三成。选手薪资、教练组、训练基地——你得想办法。' 他看着你的表情补了一句：'我不要求你卖人，但你也别指望我加钱。'",
    triggerRequirements: [
      "概率触发，稀有",
      "赛季中后期",
    ],
    choices: [
      {
        label: "卖一个高价值选手，套现救急",
        resultText:
          "你忍痛把一个主力挂了牌。转会费到账，预算缺口补上了。剩下的选手没说什么，但训练室里弥漫着一种不安——今天卖的是他，明天会不会是我？",
        effect: { economy: 10, firepower: -5, morale: -4, cohesion: -3, discipline: 1 },
      },
      {
        label: "全员降薪共渡难关，承诺赛季后补发",
        resultText:
          "你跟全队开了会，说明了情况。'降薪 15%，赛季结束如果成绩达标，我补发。' 队长第一个点头。其他人跟着了。但你知道——承诺是债，如果还不上，信任就碎了。",
        effect: { economy: 5, morale: -3, cohesion: 3, discipline: 2, tactics: 1 },
      },
      {
        label: "不降薪不卖人，砍训练和运营成本",
        resultText:
          "你砍了基地的额外开支——营养师没了，心理辅导取消了，外出集训不去了。选手薪资没变，但训练条件降了。有人开始私下看其他队伍的报价。你看在眼里，但手上没有牌。",
        effect: { economy: 3, condition: -3, morale: -2, tactics: -2, discipline: 1 },
      },
      {
        label: "找新赞助商填缺口",
        resultText:
          "你花了两周跑商务，谈下了两个新赞助商。预算缺口补上了一部分。代价是——选手要多参加两场商业活动。你用他们的时间换了钱。这笔账划不划算，还得看赛季成绩。",
        effect: { economy: 4, morale: -1, condition: -2, tactics: -1, discipline: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["economy", "morale", "firepower", "cohesion", "condition"],
  },
  {
    id: "chemistry_click",
    category: "out_of_match",
    timing: ["between_cups", "after_match"],
    title: "化学反应",
    narrative:
      "不知道从哪天开始的。也许是那次加练后的深夜夜宵，也许是那次翻盘后的集体拥抱。但你突然发现——训练室里的笑声多了，训练赛的配合顺了，有人在语音里开始开玩笑了。这种东西叫化学反应，你买不来，也催不熟。",
    triggerRequirements: [
      "队内 cohesion >= 80",
      "阵容稳定 >= 1 个杯赛周期",
      "概率触发，正面事件",
    ],
    choices: [
      {
        label: "趁热打铁，加大战术复杂度",
        resultText:
          "默契好了，你能上更复杂的战术了。双假打、多层烟雾、交叉回防——以前沟通量太大不敢用的东西，现在他们能执行了。训练赛赢得很漂亮。",
        effect: { tactics: 5, firepower: 2, morale: 2, discipline: 2, tactical_control: 3 },
      },
      {
        label: "别打扰，让化学反应自然生长",
        resultText:
          "你没做任何事。有些东西越干预越容易碎。你只是确保训练环境舒适、后勤到位，然后站在旁边看着。一个月后，他们的配合默契到了'不用报点都知道对方在哪'的程度。",
        effect: { cohesion: 5, morale: 3, tactics: 2, firepower: 2, discipline: 1 },
      },
      {
        label: "组织一次团建活动，巩固感情",
        resultText:
          "你带全队去了趟海边。不聊比赛，不聊战术。他们一起冲浪、一起烧烤、一起被浪打翻在水里笑成一团。回来之后，训练室的氛围又好了一层。有时候离开赛场才能建设赛场上的东西。",
        effect: { cohesion: 4, morale: 5, condition: 3, tactics: -1, economy: -2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["cohesion", "morale", "tactics", "firepower"],
  },
  {
    id: "equipment_sponsor_change",
    category: "out_of_match",
    timing: ["between_cups"],
    title: "赞助商换设备",
    narrative:
      "新赞助商来了，带着他们的外设——鼠标、键盘、耳机。跟选手们之前用了几年的完全不同。你的队长试了试新鼠标，皱了皱眉：'手感完全不一样。' 赞助商代表笑着说：'适应一下就好了。'",
    triggerRequirements: [
      "概率触发",
      "俱乐部签署新外设赞助",
    ],
    choices: [
      {
        label: "给一周适应期，期间不强求成绩",
        resultText:
          "你给了一周的缓冲期。训练赛不强求成绩，让每个人找手感。有人第三天就适应了，有人一周后还在调 DPI。但至少没有人在正赛里被新设备坑了。",
        effect: { firepower: -1, morale: 2, discipline: 2, condition: 1, economy: 3 },
      },
      {
        label: "选手可以继续用旧设备，赞助商logo贴在旧设备上",
        resultText:
          "你跟赞助商谈了：选手继续用惯用的设备，赞助商的 logo 贴在外壳上。赞助商不太满意——他们要的是选手用他们的产品。但选手们的手感保住了。你用商务谈判换来了竞技稳定。",
        effect: { firepower: 1, economy: 1, morale: 3, discipline: 2, cohesion: 1 },
      },
      {
        label: "强制换新设备，合同要求",
        resultText:
          "你按合同执行了。选手们被迫换设备。训练赛数据下滑了——有人换了鼠标后预瞄准了，有人换了耳机后听不清脚步。两周后大部分恢复了，但有一个人的状态再没回到之前。",
        effect: { economy: 5, firepower: -3, morale: -2, discipline: 1, condition: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["firepower", "economy", "morale", "condition"],
  },
  {
    id: "meta_read_divide",
    category: "out_of_match",
    timing: ["between_cups", "before_cup"],
    title: "版本理解分歧",
    narrative:
      "版本更新后，你的教练和分析师对版本的理解出现了分歧。教练认为这次更新利好慢节奏控图，分析师的数据模型显示快节奏 rush 更优。两个人在战术会上争论了半小时，谁也说服不了谁。选手们在下面面面相觑。",
    triggerRequirements: [
      "近期发生过版本更新",
      "概率触发",
    ],
    choices: [
      {
        label: "信教练的经验，走慢节奏",
        resultText:
          "你拍了板：听教练的。训练赛打了两周慢节奏，数据确实还行——但不突出。分析师不服气，把数据报告甩在了你桌上。你看了看，心里也有点动摇。",
        effect: { tactics: 2, discipline: 2, morale: 1, tactical_control: 2, firepower: -1 },
      },
      {
        label: "信分析师的数据，走快节奏",
        resultText:
          "你选了数据。快节奏训练赛赢了很多——对手还没适应新版本。但教练明显不高兴，训练时话少了。你赢了战术争论，但输了一点教练的信任。",
        effect: { tactics: 3, firepower: 3, morale: 1, discipline: 1, cohesion: -2 },
      },
      {
        label: "分成两组，各打两场训练赛，用结果说话",
        resultText:
          "你没拍板。你让队伍分别用两种打法各打两场训练赛。结果：快节奏赢了 3 场，慢节奏赢了 1 场。数据说话了。教练虽然嘴上不服，但接受了结果。'行，那就快节奏。'",
        effect: { tactics: 4, discipline: 3, morale: 2, cohesion: 2, tactical_control: 2 },
      },
      {
        label: "融合两种思路：快慢结合",
        resultText:
          "你没选边。你让教练和分析师一起设计一套快慢结合的体系——前半段慢节奏控图，后半段突然加速。磨合很难，但一旦练成，对手无法预判你们的节奏。",
        effect: { tactics: 5, discipline: 2, condition: -1, morale: 1, tactical_control: 4 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["tactics", "discipline", "cohesion", "tactical_control"],
  },
];

outOfMatchEvents.push(...outOfMatchEventsExtended);

// ──────────────────────────────────────────────
// 比赛外突发事件 · 老将与年龄相关
// ──────────────────────────────────────────────

const agingEvents: GameEvent[] = [
  {
    id: "reaction_decline",
    category: "out_of_match",
    timing: ["between_cups", "before_cup", "season_end"],
    title: "反应慢了",
    narrative:
      "你的老将今年二十七了。在 CS 里，这已经是“高龄”。他自己不会说，但数据不说谎——他的平均反应时间比上赛季慢了 30 毫秒。对步枪手来说，30 毫秒就是先开枪和后开枪的区别。你的教练拿着数据报告找你：'他还在打，但已经不是两年前那个他了。'",
    triggerRequirements: [
      "队内存在年龄 >= 27 的选手",
      "已过 >= 1 个赛季",
    ],
    choices: [
      {
        label: "让他改打更需要经验、更少拼反应的位置",
        resultText:
          "你让他从突破手换到了架枪位。不再需要他第一个冲进去拼首杀——只需要他守住一个角度，用经验读对手的路线。前两周他不适应，觉得自己被“发配”了。但第三周，他用一个预瞄穿墙拿了三杀。他看着你说：'也许这个位置才是我的。'",
        effect: { firepower: -2, tactics: 4, discipline: 3, morale: 2, cohesion: 2 },
      },
      {
        label: "给他配人体工学外设，延缓衰退",
        resultText:
          "你给他换了一套人体工学鼠标、定制键盘高度、更轻的耳机。还请了手部理疗师每周做两次护理。他的反应没快回来，但手腕不疼了，预瞄更稳了。'也许我打不了快枪了，但我还能打准枪。'",
        effect: { firepower: 1, condition: 4, economy: -3, discipline: 2, tactics: 1 },
      },
      {
        label: "不减他的负担，赌他的经验能cover",
        resultText:
          "你没动他的位置。他还是突破手，还是第一个冲。有时候他赢——那种经验带来的预判确实能弥补反应。但有时候他输——对面的十九岁小孩比他快了那 30 毫秒。你赌的是他的大脑还能赢他的身体。赌注是他的职业生涯。",
        effect: { firepower: -3, tactics: 3, morale: 1, discipline: 1, condition: -2 },
      },
      {
        label: "开始培养接班人，让他带新人打同一位置",
        resultText:
          "你签了个十九岁的新人，让他跟着老将学同一个位置。老将一开始有点警惕——这是要替代我？但当他看到新人犯了他五年前犯过的错时，他忍不住开口教了。'你这个走位，会被穿死的。' 他没意识到——他已经在传承了。",
        effect: { firepower: -1, tactics: 3, cohesion: 3, discipline: 2, morale: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["condition", "firepower", "tactics", "leadership", "aging"],
  },
  {
    id: "retirement_horizon",
    category: "out_of_match",
    timing: ["season_end", "between_cups"],
    title: "退役倒计时",
    narrative:
      "赛季结束了。你的老将在庆功宴之后拉你到阳台上抽烟。他没喝酒，只是看着远处说：'教练，我可能就剩一两年了。' 他没说退役，但'一两年'这个词本身就是一种退役宣告。风很大，他把烟掐灭了：'我想在还能打的时候，拿一个冠军。'",
    triggerRequirements: [
      "队内存在年龄 >= 28 的选手",
      "已过 >= 1 个赛季",
    ],
    choices: [
      {
        label: "'最后一年，我全力支持你冲冠'",
        resultText:
          "你拍了拍他的肩：'明年全队围绕你来打。' 他眼睛亮了一下。回到训练室，他比任何人都拼命——倒计时开始了，他知道。那一年的训练量是全队最大的，但也是最有目标的。",
        effect: { morale: 5, firepower: 3, discipline: 3, condition: -2, cohesion: 3, tactics: 2 },
      },
      {
        label: "'别想退役，你现在还能打'",
        resultText:
          "你否定了他的想法：'你现在的数据还在联盟前二十。别给自己设限。' 他笑了笑没反驳。但你知道——种子已经种下了。他训练还是那么拼，只是偶尔会在训练间隙盯着自己的手看很久。",
        effect: { firepower: 1, discipline: 2, morale: 1, condition: -1, tactics: 1 },
      },
      {
        label: "帮他规划退役后的路：留在俱乐部当教练",
        resultText:
          "你跟他聊了退役后的路：'退役不等于离开。你留下来当助理教练。' 他愣了很久。'真的？' 你点头。他第二天训练的时候状态不一样了——轻松了，像一块石头落了地。没有了后顾之忧的人，反而打得更放开了。",
        effect: { morale: 4, cohesion: 4, tactics: 2, firepower: 2, discipline: 2, condition: 1 },
      },
      {
        label: "建议他现在就退役，别拖到打不动",
        resultText:
          "你说了一句很残忍的话：'如果你觉得差不多了，不如现在就退。留个体面。' 他没说话，抽完那根烟就走了。三天后他来找你：'我再打一年。你说得对——一年。打完就退。' 他没恨你。但那一年的每一场比赛，都带着一种告别感。",
        effect: { firepower: 2, morale: -2, cohesion: -1, discipline: 3, tactics: 1, condition: 0 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "firepower", "condition", "cohesion", "aging"],
  },
  {
    id: "veteran_role_shift",
    category: "out_of_match",
    timing: ["between_cups", "season_end"],
    title: "老将转型",
    narrative:
      "他不再是最准的那个人了。训练赛里，年轻选手的对枪赢率超过了他。但他仍然是全队最会读比赛的人——他知道对手什么时候会前压，什么时候会 ECO，什么时候在假打。问题是：一个不能打的人，还能留在场上当指挥吗？",
    triggerRequirements: [
      "队内存在年龄 >= 28 的选手",
      "该选手 firepower 曾 >= 85 但已下降",
    ],
    choices: [
      {
        label: "让他专职指挥，火力交给年轻人",
        resultText:
          "你把他的角色从“指挥兼突破”变成了纯指挥。不用他开枪了——他站在最后面，看全图，叫战术。他的击杀数掉了，但胜率涨了。'我以前是用手打比赛，现在是用脑打。' 他笑着跟年轻选手说。",
        effect: { firepower: -4, tactics: 6, discipline: 3, morale: 2, cohesion: 3, tactical_control: 4 },
      },
      {
        label: "让他转型教练，从场上退下来",
        resultText:
          "你跟他谈了：'上场的事交给年轻人。你来当教练。' 他挣扎了一周——从选手到教练不只是换把椅子坐，是从'我来'变成'你们来'。第一场训练赛他坐在教练位上，手一直在抖。但叫出第一个暂停的时候，他找回了自己。",
        effect: { firepower: -2, tactics: 5, discipline: 4, morale: 3, cohesion: 4, tactical_control: 3 },
      },
      {
        label: "让他继续打，但减少他的训练量保状态",
        resultText:
          "你没让他转型。你减少了他的训练量——每天只打一场训练赛，其余时间看 demo 做分析。他正赛的数据保住了，但你知道这只是延缓。总有一天，减量也保不住了。",
        effect: { firepower: 0, tactics: 2, condition: 2, discipline: 1, morale: 1, cohesion: 1 },
      },
      {
        label: "让他自己选：继续打还是转型",
        resultText:
          "你把选择权交给了他。他考虑了三天。第三天晚上他来找你：'再打半年。如果半年后数据还往下走，我转教练。' 你同意了。这半年他比任何时候都拼——因为他知道这是他给自己设的最后期限。",
        effect: { firepower: 2, morale: 3, discipline: 3, tactics: 2, condition: -1, cohesion: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["firepower", "tactics", "morale", "leadership", "aging"],
  },
  {
    id: "young_challenger_threat",
    category: "out_of_match",
    timing: ["between_cups", "before_cup"],
    title: "后浪来了",
    narrative:
      "你的老将最近刷到了一条新闻——一个十七岁的新人在青训联赛里打出了 1.8 的 KD，舆论已经开始讨论'他是不是该进一线队了'。更让老将不安的是，那个新人打的就是他的位置。你的队长来找你：'他最近训练有点心事。'",
    triggerRequirements: [
      "队内存在年龄 >= 27 的选手",
      "青训/替补中存在潜力新人",
    ],
    choices: [
      {
        label: "明确告诉老将：你的位置这赛季不会动",
        resultText:
          "你找老将谈了：'这赛季你是首发。别看新闻。' 他松了口气，训练状态回来了。但你也知道——承诺只能给一个赛季。下个赛季呢？你把这个问题留给了未来的自己。",
        effect: { morale: 4, discipline: 2, firepower: 2, cohesion: 2, condition: 1 },
      },
      {
        label: "把新人提上来跟老将竞争，谁状态好谁上",
        resultText:
          "你把新人提到了一线队训练。老将没说什么，但训练量明显加大了——他在跟一个比自己小十岁的人拼体能。新人确实快，但老将的经验还在。竞争让两个人都变好了——只是代价是训练室的气氛有点紧。",
        effect: { firepower: 3, discipline: 3, condition: -2, morale: -1, cohesion: -2, tactics: 1 },
      },
      {
        label: "让老将带新人，把威胁变成传承",
        resultText:
          "你跟老将说：'那个新人，你来带。' 他一开始很抗拒——我教他，他替代我？但你补了一句：'你能教他的东西，他三年都学不完。你越不可替代，你越安全。' 他想了想，收了新人当徒弟。",
        effect: { cohesion: 4, tactics: 3, morale: 2, firepower: 1, discipline: 2 },
      },
      {
        label: "不干预，让竞争自然发生",
        resultText:
          "你没做任何事。老将看到了新闻，新人还在青训。压力自然会传导——老将训练更拼了，新人也在默默进步。但你也知道，不引导的竞争，迟早会变成内耗。",
        effect: { firepower: 2, discipline: 1, morale: -1, cohesion: -2, condition: -1, tactics: 0 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["morale", "cohesion", "firepower", "condition", "aging"],
  },
  {
    id: "veteran_family_pressure",
    category: "out_of_match",
    timing: ["between_cups", "season_end"],
    title: "家庭的重量",
    narrative:
      "你的老将最近训练经常走神。你找他聊，他犹豫了很久才说：'我老婆下个月预产期。' 他看着你的表情补了一句：'我不是要请假。我就是……你知道，第一次当爹，心里有点乱。' 他三十岁了，职业生涯的尾巴撞上了人生的另一道门。",
    triggerRequirements: [
      "队内存在年龄 >= 28 的选手",
      "概率触发",
    ],
    choices: [
      {
        label: "给他三天假，回去陪产",
        resultText:
          "你批了三天假。'比赛我安排替补。你回去当爹。' 他走的时候差点红了眼。三天后他回来了，眼睛里有以前没有的东西——一种沉稳。'教练，我当了爹之后突然觉得——输赢没那么重了。但我想赢，为了他。'",
        effect: { morale: 5, cohesion: 3, discipline: 2, condition: 3, firepower: 1, tactics: 1 },
      },
      {
        label: "不放假，但允许他每天早退两小时",
        resultText:
          "你让他每天下午六点就走。训练赛上午打完，复盘做完就走。他感激你的弹性——但他也知道自己少了两小时训练。他用剩下时间更拼了。'我不想因为当爹就拖累队伍。'",
        effect: { morale: 3, condition: 2, firepower: -1, discipline: 2, tactics: -1, cohesion: 2 },
      },
      {
        label: "'职业选手没有请假这回事'",
        resultText:
          "你说了句很冷的话：'别人老婆也生孩子。赛季不等人。' 他没反驳。但那天训练赛他打得很差——他的心不在屏幕上，在医院的产房外。你知道你赢了原则，但可能输了一个人。",
        effect: { discipline: 1, morale: -5, cohesion: -3, firepower: -2, condition: -1, tactics: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "condition", "cohesion", "aging"],
  },
  {
    id: "cumulative_injury",
    category: "out_of_match",
    timing: ["between_cups", "season_end"],
    title: "旧伤新痛",
    narrative:
      "你的老将今天训练迟到了。他来的时候走路有点不自然——右膝旧伤又犯了。五年职业生涯，他的身体像一张写满批注的病历：右膝半月板磨损、腰椎间盘轻度突出、右手腕腱鞘炎、颈椎曲度变直。队医跟你说：'他不是某个部位受伤了，是整个身体在抗议。'",
    triggerRequirements: [
      "队内存在年龄 >= 28 的选手",
      "已过 >= 2 个赛季",
      "概率触发",
    ],
    choices: [
      {
        label: "制定专门的康复训练计划",
        resultText:
          "你请了运动医学专家，给他量身定制了一套康复计划。每天训练前一小时做理疗和针对性训练。他的训练量少了，但身体的疼痛确实减轻了。'我以为这些东西会跟我一辈子。没想到还能好。'",
        effect: { condition: 6, discipline: 3, economy: -3, firepower: 1, morale: 3, tactics: -1 },
      },
      {
        label: "减少他的正赛场次，延长职业生涯",
        resultText:
          "你开始有选择地让他休息——不那么重要的杯赛让他轮休，关键比赛才上。他的出场次数少了，但关键场上的表现更稳了。'少打几场没关系，只要上场的时候能打好。' 他接受了这种角色。",
        effect: { condition: 4, firepower: -1, morale: 1, discipline: 2, economy: -1, cohesion: 1 },
      },
      {
        label: "打封闭继续上，赛季结束再治",
        resultText:
          "你让队医给他打了封闭。他不疼了——暂时。训练赛照打，正赛照上。但队医私下跟你说：'这样下去，他三十五岁的时候可能走路都费劲。' 你把这句话咽了下去。你选了现在。以后的事以后再说。",
        effect: { firepower: 2, condition: -6, discipline: 1, morale: -1, tactics: 1 },
      },
      {
        label: "建议他赛季结束后退役，别拿后半生换",
        resultText:
          "你跟他坐下来谈：'你的身体在告诉你该停了。再打下去，冠军可能没拿到，膝盖先废了。' 他沉默了很久。'再打一年。就一年。' 你点头——但你们都知道，'一年'这个词他已经说过一次了。",
        effect: { morale: 2, condition: 2, discipline: 2, firepower: -1, cohesion: 2, tactics: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["condition", "economy", "morale", "firepower", "aging"],
  },
  {
    id: "contract_year_pressure",
    category: "out_of_match",
    timing: ["before_cup", "between_cups"],
    title: "合同年",
    narrative:
      "你的老将进入合同年了。他的经纪人频繁来训练室，每次都拉着他说很久的话。你的教练注意到——他最近训练赛打得特别用力，但也特别急。他在追数据，不是追胜利。每个回合都想刷 KD，该补枪的时候在抢人头。",
    triggerRequirements: [
      "队内存在年龄 >= 28 的选手",
      "该选手处于合同最后一年",
    ],
    choices: [
      {
        label: "跟他谈：别追数据，追冠军，冠军自带合同",
        resultText:
          "你把他叫到办公室：'你知道为什么你上一个合同年打得好吗？因为你当时想赢，不是想刷数据。' 他愣了。你继续：'冠军自带合同。数据不会。' 他训练赛的风格变了——开始补枪了，开始让人头给位置更好的队友了。",
        effect: { tactics: 3, discipline: 3, morale: 2, firepower: -1, cohesion: 3 },
      },
      {
        label: "赛季前就把续约谈了，消除他的焦虑",
        resultText:
          "你在杯赛开始前就跟管理层推动续约。合同签了，他的焦虑消失了。训练赛不再抢人头了，开始做该做的事。'谢谢你，教练。不签的话我这整个赛季都会在想这事。'",
        effect: { morale: 4, economy: -3, discipline: 2, firepower: 1, cohesion: 2, condition: 1 },
      },
      {
        label: "不续约，让他在压力下打出巅峰",
        resultText:
          "你没推续约。你想让他在合同年拼命——不续约的压力有时候是催化剂。他确实拼了，数据也确实涨了。但你在训练赛里看到了代价：他不再为团队牺牲了。他在为自己打，不是为队伍。",
        effect: { firepower: 4, economy: 2, morale: -2, cohesion: -3, discipline: -1, tactics: -2 },
      },
      {
        label: "暗示他可能不续约，逼他考虑退役",
        resultText:
          "你在一次谈话中暗示：'管理层在考虑年轻化。' 你不是真的要赶他走——你想看他的反应。他沉默了一天，然后训练量翻倍了。'他们想换我？让他们看看谁才是最好的。' 你利用了他的恐惧。这招有效，但你不确定自己是否为此骄傲。",
        effect: { firepower: 3, discipline: 2, morale: -3, cohesion: -1, condition: -2, tactics: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "firepower", "economy", "cohesion", "aging"],
  },
  {
    id: "veteran_mentor_exit",
    category: "out_of_match",
    timing: ["season_end", "between_cups"],
    title: "告别战",
    narrative:
      "他已经决定了。赛季结束就退役。消息还没公开，但训练室里的每个人都知道了——他的行李箱在基地角落放了三个月，这次是真的要带走。最后一场比赛的前一天晚上，他把所有人叫到了训练室：'明天，帮我赢一个。'",
    triggerRequirements: [
      "队内存在已宣布退役的老将",
      "赛季最后一场比赛前",
    ],
    choices: [
      {
        label: "'全队为你而战'",
        resultText:
          "你没说战术。你说了一句：'明天，所有人，为他而战。' 第二天比赛你的队伍打出了整个赛季最好的一场。每个回合都像最后一口气。老将在最后一个回合拿了个三杀——全场站了起来。比赛赢了。他摘下耳机，眼眶红了。",
        effect: { firepower: 4, morale: 8, cohesion: 6, discipline: 3, momentum: 5, condition: 2 },
      },
      {
        label: "让老将打关键位，给他最后的舞台",
        resultText:
          "你把老将放回了突破手的位置——那个他十年前出道时的位置。他已经不是最快的了，但今天他不需要快。他只需要准。那一天的他像回到了二十岁。'教练，我感觉又年轻了。' 他笑着说，手里的奖杯在发抖。",
        effect: { firepower: 5, morale: 5, cohesion: 4, discipline: 2, tactics: -1, condition: -1 },
      },
      {
        label: "当普通比赛打，别给他额外压力",
        resultText:
          "你没做任何特殊安排。'当普通比赛打。别想太多。' 你怕情绪化反而影响发挥。比赛打得很焦灼——老将在关键时刻有点犹豫，大概是想太多了。最后赢了，但不是因为他。他赛后跟你说：'谢谢你没让我变成主角。这样赢的，是队伍，不是我。'",
        effect: { tactics: 3, discipline: 4, morale: 3, cohesion: 3, firepower: 1, condition: 1 },
      },
      {
        label: "赛前让他跟全队讲几句话",
        resultText:
          "你在赛前让老将站在全队面前讲话。他站在那里沉默了十秒，然后说了一句：'跟你们打球的这十年，是我人生最好的十年。谢谢你们。' 他说完就坐下了。没人接话——但每个人都把拳头攥紧了。那天的比赛，没人敢松懈。",
        effect: { morale: 7, cohesion: 7, discipline: 4, firepower: 3, tactics: 2, condition: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "cohesion", "firepower", "discipline", "aging"],
  },
  {
    id: "mid_career_crisis",
    category: "out_of_match",
    timing: ["between_cups", "season_end"],
    title: "中年的迷茫",
    narrative:
      "他二十五了。不是老将，也不是新人——卡在中间。他拿了两个杯赛冠军，进过一次全明星，数据一直稳定在联盟前三十。但他最近在训练后总是一个人坐在阳台上发呆。你找他聊，他说了一句让你意外的话：'教练，我是不是就这样了？'",
    triggerRequirements: [
      "队内存在年龄 25-27 的选手",
      "已过 >= 1 个赛季",
      "概率触发",
    ],
    choices: [
      {
        label: "'你还没到巅峰，别急'",
        resultText:
          "你跟他说：'二十五不是终点，是起点。很多选手的巅峰在二十六到二十八。' 他听了，半信半疑。但你拿出数据给他看——他的关键数据每年都在涨，只是涨幅小到他自己没注意。'你不是停滞了，你在蓄力。'",
        effect: { morale: 4, discipline: 2, firepower: 2, condition: 1, tactics: 1, cohesion: 1 },
      },
      {
        label: "给他一个新的战术角色，打破瓶颈",
        resultText:
          "你让教练给他设计了一个新角色——从纯突破手变成半个指挥。他需要学的不再是'怎么杀人'，而是'怎么带人去杀人'。一开始他手忙脚乱，但两周后他找到了感觉。'原来比赛还能这样看。' 他的迷茫变成了新鲜感。",
        effect: { tactics: 5, firepower: -1, morale: 3, discipline: 2, cohesion: 2, tactical_control: 3 },
      },
      {
        label: "给他设一个具体目标：这赛季进全明星",
        resultText:
          "你给他设了个目标：'这赛季你的目标不是赢，是进全明星。联盟前五步枪手。' 他有了具体的靶子。训练的每一枪都有了方向——不是为了赢比赛，是为了证明自己。目标这东西，有时候比激情更管用。",
        effect: { firepower: 4, discipline: 3, morale: 2, condition: -1, tactics: 1, cohesion: -1 },
      },
      {
        label: "认真问他：你想要什么",
        resultText:
          "你没给鸡汤。你问他：'你想要什么？冠军？个人荣誉？钱？还是只是不想打了？' 他被问住了。想了很久说：'我想要一个属于我的时刻。不是团队的，是我的。' 你点头：'那下个杯赛，我给你设计一个属于你的回合。'",
        effect: { morale: 3, firepower: 3, cohesion: 2, discipline: 2, tactics: 2, condition: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["morale", "firepower", "tactics", "condition", "aging"],
  },
  {
    id: "post_retirement_void",
    category: "out_of_match",
    timing: ["between_cups", "season_end"],
    title: "退役之后",
    narrative:
      "他退役三个月了。你本来以为他会顺利转型教练——毕竟你在退役前就给他铺好了路。但最近助理跟你说，他经常一个人坐在空训练室里，对着黑屏的电脑发呆。昨天你看到他的朋友圈：一张空荡荡的赛场照片，配文只有一个句号。",
    triggerRequirements: [
      "队内曾有选手在上一赛季退役",
      "该选手已转为教练/分析师角色",
    ],
    choices: [
      {
        label: "给他真正的工作：让他负责新秀培养",
        resultText:
          "你没让他闲着。你把青训队的新人交给他带。'你是从那个年纪过来的，你知道他们需要什么。' 他一开始不太情愿——但他第一次给新人复盘的时候，眼睛亮了。'这孩子的问题跟我当年一模一样。' 他找到了新的价值。",
        effect: { tactics: 3, morale: 4, cohesion: 3, discipline: 2, firepower: 1 },
      },
      {
        label: "让他回到赛场当解说嘉宾",
        resultText:
          "你帮他接了一个解说嘉宾的工作。第一次上解说台他紧张得手心出汗——但麦克风一开，他就找到了感觉。'这个回合的默认控图是有问题的，B 点的烟雾给早了……' 他用选手的视角解说，观众爱听。他退役后第一次笑了。",
        effect: { morale: 4, economy: 2, cohesion: 1, tactics: 2, discipline: 1, condition: 2 },
      },
      {
        label: "给他时间，别催他",
        resultText:
          "你没给他安排任何事。'你想要多久就多久。基地的门永远开着。' 他每天来基地坐一会儿，不看比赛，不碰电脑。两周后他开始帮分析师整理数据了——不是被安排的，是自己找的事。人需要自己走出来。",
        effect: { morale: 3, condition: 3, cohesion: 2, discipline: 1, tactics: 1, economy: -1 },
      },
      {
        label: "建议他去看看心理医生",
        resultText:
          "你直接建议他找心理医生。他有点抵触——'我又没病。' 你说：'退役不是失业，但有时候感觉一样。这不是病，但需要有人帮你理清楚。' 他去了。一个月后他跟你说：'原来我失去的不只是比赛，是那种'被需要'的感觉。'",
        effect: { morale: 4, condition: 4, discipline: 2, cohesion: 2, tactics: 1, economy: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "condition", "cohesion", "aging"],
  },
  {
    id: "young_star_early_peak",
    category: "out_of_match",
    timing: ["between_cups", "before_cup"],
    title: "太早的巅峰",
    narrative:
      "你的新人十八岁就打出了全明星级别的数据。媒体说他是'十年一遇的天才'。但你的教练没那么乐观——他见过太多'陨落的天才'了。教练拿着一份报告找你：'他的进步曲线太陡了。这种曲线，要么持续上升成为历史最佳，要么在二十一岁之前就到顶然后一路下滑。'",
    triggerRequirements: [
      "队内存在年龄 <= 20 且 firepower >= 85 的选手",
      "概率触发",
    ],
    choices: [
      {
        label: "控制他的曝光量，别让他被吹捧毁了",
        resultText:
          "你拒绝了所有对他的个人采访。'队伍赢，不是他赢。' 他有点不高兴——谁不想被夸？但你也看到了：那些十八岁就被封神的选手，有一半在二十二岁之前就消失了。你保护他，用的是克制。",
        effect: { discipline: 3, morale: -1, condition: 2, firepower: 1, cohesion: 2, tactics: 1 },
      },
      {
        label: "趁巅峰加练，把天赋变成技术",
        resultText:
          "你让教练给他加了一倍的个人技术训练。'你的天赋能让你十八岁打出来。但只有技术能让你二十八岁还在打。' 他练得很苦——天赋选手不喜欢练基本功。但他听话。两年后当反应开始慢的时候，他的基本功接住了。",
        effect: { firepower: 3, discipline: 4, condition: -2, tactics: 2, morale: 1, cohesion: 1 },
      },
      {
        label: "让老将带他，教他怎么面对名声",
        resultText:
          "你让队里的老将跟他住同一间宿舍。老将经历过类似的巅峰和低谷——他二十岁的时候也被叫过天才。'听哥一句，别看评论区。那些夸你的人，三年后会在同一个评论区骂你。' 新人听了。也许现在不懂，但迟早会懂。",
        effect: { morale: 3, cohesion: 4, discipline: 2, firepower: 1, condition: 1, tactics: 1 },
      },
      {
        label: "什么都不做，让他自然发展",
        resultText:
          "你没干预。他十八岁打出了巅峰数据，自然有十九岁、二十岁的挑战在等着。也许是继续涨，也许是遇到瓶颈。你赌的是他的自我调节能力——有些天才不需要保护，需要的是自由。你等着看。",
        effect: { firepower: 4, morale: 2, discipline: -2, condition: 0, cohesion: -1, tactics: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["firepower", "discipline", "morale", "condition", "aging"],
  },
  {
    id: "captain_burden_age",
    category: "out_of_match",
    timing: ["between_cups", "season_end"],
    title: "队长的担子",
    narrative:
      "你的队长今年二十九了。他是队长，是指挥，是精神领袖。但他最近跟你说了一句话：'教练，我累了。不是身体累，是心累。管五个人的情绪、叫每一轮的战术、背每一场输的责任……我不想当队长了。但我又不能不当——没人能接。'",
    triggerRequirements: [
      "队内存在年龄 >= 28 的队长",
      "已过 >= 1 个赛季",
    ],
    choices: [
      {
        label: "把队长袖标交给别人，让他只管打",
        resultText:
          "你把队长交给了副队长——一个二十五岁的稳当人。老队长如释重负。他训练的时候笑变多了——不用再操心全队的事，只需要管好自己。'当队长四年，我差点忘了打枪是什么感觉。'",
        effect: { morale: 4, firepower: 3, cohesion: -2, discipline: 2, condition: 2, tactics: -2 },
      },
      {
        label: "保留队长身份，但分配副指挥帮他分担",
        resultText:
          "你没摘他的袖标。但你安排了一个副指挥——经济局由副指挥叫，只有关键回合才需要他决策。担子轻了一半。'这样还能多打两年。' 他跟你说。有时候不是卸担子，是分出去一些。",
        effect: { tactics: 2, morale: 2, discipline: 2, condition: 2, firepower: 1, cohesion: 2 },
      },
      {
        label: "'再坚持一年，我培养接班人'",
        resultText:
          "你跟他谈：'再当一年队长。这一年我帮你培养接班人。一年后你卸任。' 他点头了。那一年他比任何时候都认真地教副队长怎么指挥——因为他知道，教得越好，自己越早自由。",
        effect: { tactics: 4, morale: 3, discipline: 3, firepower: 1, condition: -1, cohesion: 3 },
      },
      {
        label: "'队长不是担子，是你的遗产'",
        resultText:
          "你没让他卸任。你跟他说：'你当队长的这些年，是这支队伍的灵魂。你卸任了，灵魂就散了。' 他沉默了。第二天训练他还是队长——但你看到他的肩膀没那么塌了。有时候人需要的不是减负，是知道这个负担有意义。",
        effect: { morale: 4, discipline: 3, cohesion: 4, firepower: 1, condition: -1, tactics: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "tactics", "cohesion", "condition", "leadership", "aging"],
  },
];

outOfMatchEvents.push(...agingEvents);

// ──────────────────────────────────────────────
// 情感深度事件——更长台词、4 个选择、聚焦人物内心
// ──────────────────────────────────────────────

const emotionalDepthEvents: GameEvent[] = [
  {
    id: "night_before_final",
    category: "out_of_match",
    timing: ["before_match"],
    title: "决赛前夜",
    narrative:
      "决赛前夜。基地里所有人都睡了——除了你的队长。\n\n" +
      "凌晨两点，你经过训练室，灯还亮着。他一个人坐在屏幕前，没开游戏，只是盯着那张赛程表——明天，决赛，对手是{rival_team}。\n\n" +
      "他听到你的脚步声没回头。'教练。' 他的声音很轻，像是怕吵醒谁，又像是怕吵醒自己。'我打了八年职业。进过三次决赛。一次没赢。'\n\n" +
      "他终于转过来。灯光打在他脸上，你第一次发现他眼角有了细纹。'明天……是第四次。'\n\n" +
      "他没说完。但你能看到他握鼠标的手在微微发抖——不是紧张，是那种把八年都压在一夜上的重量。",
    triggerRequirements: [
      "明日为杯赛决赛",
      "队内队长年龄 >= 26",
    ],
    choices: [
      {
        label: "什么都不说，在他旁边坐下",
        resultText:
          "你没说话。你拉了把椅子，在他旁边坐下。\n\n" +
          "两个人就那样坐着，看那张赛程表。五分钟。十分钟。然后他开口了：'谢谢你。'\n\n" +
          "你问：'谢什么？'\n\n" +
          "他笑了——一种很疲惫但很释然的笑。'谢你陪我坐这儿。有时候人不需要听道理。需要的是——有人也在。'\n\n" +
          "第二天决赛，他打出了八年最好的一场。",
        effect: { morale: 6, cohesion: 5, discipline: 3, condition: 2, tactics: 2, momentum: 3 },
      },
      {
        label: "'八年了。该赢了。'",
        resultText:
          "你看着他的眼睛，说了四个字：'八年了。该赢了。'\n\n" +
          "他愣了一下。然后嘴角动了动——不是笑，是那种'被说中了'的释然。'是。该赢了。'\n\n" +
          "他关了屏幕。'我去睡了。明天——明天我给他们看点东西。'\n\n" +
          "他走到门口停了一下，没回头：'教练，谢谢你没说“输了也没关系”。我受够了那种话。'",
        effect: { firepower: 5, morale: 4, discipline: 4, condition: 2, momentum: 4, tactics: 1 },
      },
      {
        label: "'你怕的不是输。你怕的是赢了之后不知道怎么办。'",
        resultText:
          "你说了一句很重的话：'你怕的不是输。你怕的是赢了之后不知道怎么办。'\n\n" +
          "他的肩膀僵了一下。很久没说话。然后他笑了一声——那种被看穿的、无处可逃的笑。\n\n" +
          "'……你怎么知道的。'\n\n" +
          "'因为我也怕过。' 你说。'但后来我发现——赢了之后的事，赢了再想。现在只想明天的回合。'\n\n" +
          "他站起来。'行。明天的回合。' 他伸了个懒腰，'我去睡了。教练，你也是——别熬了。'",
        effect: { morale: 5, discipline: 3, cohesion: 4, tactics: 2, condition: 2, tactical_control: 2 },
      },
      {
        label: "'输赢不重要。你已经是最好的队长了。'",
        resultText:
          "你说了句很软的话：'输赢不重要。你已经是最好的队长了。'\n\n" +
          "他没动。但你能看到他喉结动了一下——他在咽什么东西。\n\n" +
          "很久之后他说：'……谢谢。但明天——明天我还是想赢。不是为了证明什么。是为了这帮兄弟。他们信我。我不能让他们白信。'\n\n" +
          "他站起来，拍了拍你的肩。'去睡吧教练。明天，我们赢。'",
        effect: { cohesion: 7, morale: 5, discipline: 2, condition: 2, tactics: 1, firepower: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "cohesion", "leadership", "final", "condition"],
  },
  {
    id: "locker_room_after_loss",
    category: "out_of_match",
    timing: ["after_match"],
    title: "更衣室",
    narrative:
      "比赛结束了。{closest_loss}。\n\n" +
      "更衣室的门关上了。隔音——但你知道里面是什么样的。\n\n" +
      "你推开门。五个人。没人看屏幕，没人看手机。{star_player_name}把头埋在毛巾里，肩膀在抖——你分不清是哭还是在忍。{rookie_name}坐在角落，眼睛红红的，嘴唇咬出了血。{veteran_name}靠在墙上，闭着眼，脖子上青筋没消。\n\n" +
      "你的队长第一个看到你。他的眼神很复杂——不是求助，不是自责，是那种'教练，你现在说什么我都听'的眼神。",
    triggerRequirements: [
      "刚输掉一场关键比赛（淘汰赛/决赛/赛点局）",
    ],
    choices: [
      {
        label: "关门。'哭吧。今天允许。'",
        resultText:
          "你关上门，反锁了。\n\n" +
          "'哭吧。今天允许。明天再说战术。'\n\n" +
          "沉默了三秒。然后{rookie_name}第一个哭出了声——那种二十岁小孩特有的、压不住的哭。{star_player_name}从毛巾里抬起头，眼眶是红的。{veteran_name}还是闭着眼，但你看到他喉结动了一下。\n\n" +
          "你的队长走过来，跟你点了下头。'谢谢你，教练。'\n\n" +
          "那天更衣室的灯亮到了凌晨。没人说战术。但第二天，他们走进训练室的时候，眼神不一样了。",
        effect: { morale: 5, cohesion: 6, discipline: 1, condition: 3, tactics: 1 },
      },
      {
        label: "打开回放。'我们看输在哪。现在就看。'",
        resultText:
          "你走到屏幕前，打开了回放。'现在就看。趁痛还在。'\n\n" +
          "有人想抗议——'教练，现在……' 但你的眼神让他闭了嘴。\n\n" +
          "你们一起看了那场输。一个回合一个回合。你指出了三个失误，两个运气球，一个本该赢的回合输了。\n\n" +
          "{veteran_name}看完后说：'不是实力问题。是心态。我们太想赢了。'\n\n" +
          "你点头。'记住这个感觉。下别再用这种感觉打。' 关了屏幕。'去睡。明天重新来。'",
        effect: { tactics: 5, discipline: 4, morale: -1, cohesion: 2, condition: 1, tactical_control: 3 },
      },
      {
        label: "什么都不说。逐个拍肩，然后离开。",
        resultText:
          "你没说话。\n\n" +
          "你走到{rookie_name}面前，拍了拍他的肩。他抬头看你，眼睛红得像兔子。\n\n" +
          "走到{star_player_name}面前，拍了拍他的肩。他没抬头，但肩膀松了一点。\n\n" +
          "走到{veteran_name}面前，拍了拍他的肩。他睁开眼，点了下头。\n\n" +
          "走到队长面前。他看着你，嘴唇动了动没说话。你拍了拍他的肩，比其他人重一点。\n\n" +
          "你走了。关门的时候，听到里面有人开始抽泣。\n\n" +
          "有些时刻不需要教练。需要的是人。",
        effect: { cohesion: 8, morale: 3, discipline: 2, condition: 2, tactics: 0 },
      },
      {
        label: "'记住今天。记住这个感觉。明年用它打。'",
        resultText:
          "你站在更衣室中央。没人看你。但都知道你在说话。\n\n" +
          "'记住今天。记住这个感觉——更衣室、灯、毛巾、血、输。'\n\n" +
          "你停了一下。'明年这个时候，我们还会回来。但下一次——下一次我不要你们坐在这里。我要你们站在领奖台上，回忆今天。'\n\n" +
          "{veteran_name}睁开眼。'教练，你认真的？'\n\n" +
          "'我认真的。' 你说。'但前提是——你们明天还愿意走进训练室。'\n\n" +
          "队长站起来。'我会。' 一个一个，所有人都站了起来。",
        effect: { morale: 6, discipline: 4, cohesion: 5, firepower: 2, tactics: 1, condition: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "cohesion", "discipline", "leadership"],
  },
  {
    id: "player_birthday_during_cup",
    category: "out_of_match",
    timing: ["before_match", "during_match"],
    title: "生日",
    narrative:
      "今天是{rookie_name}的二十岁生日。\n\n" +
      "他自己没提。是助理告诉你的——'今天小孩生日，他早上发了条朋友圈，三秒后删了。'\n\n" +
      "你看了那条被删的朋友圈截图：一块便利店的小蛋糕，一根蜡烛，配文'二十岁。还是要加油。'\n\n" +
      "下个月就是{best_cup_name}。他第一次打正赛首发就赶上这种节点。你看到他在训练室里比平时更安静了——不是紧张，是那种'今天有点特殊但我不想麻烦任何人'的安静。",
    triggerRequirements: [
      "队内选手生日当天",
      "正值杯赛周期",
    ],
    choices: [
      {
        label: "全队给他过——订蛋糕，唱生日歌",
        resultText:
          "你让助理订了个蛋糕。训练结束后，灯关了，蛋糕端出来。\n\n" +
          "{rookie_name}愣在原地。他没哭——二十岁的男孩不轻易哭。但你看到他喉结动了好几下。\n\n" +
          "{veteran_name}带头唱生日歌，跑调得离谱。所有人笑成一团。\n\n" +
          "吹蜡烛的时候，他闭眼了很久。你问他许了什么愿。他笑了：'不能说。说了不灵。'\n\n" +
          "第二天训练，他比任何时候都拼。",
        effect: { morale: 7, cohesion: 6, condition: 3, discipline: 2, firepower: 2, tactics: 1 },
      },
      {
        label: "不声张，但给他一天假，让他给家里打电话",
        resultText:
          "你没声张。你走到他面前：'今天休息。给家里打个电话。'\n\n" +
          "他愣了一下。'教练，训练——'\n\n" +
          "'训练明天再说。今天你二十岁。给你妈打电话。'\n\n" +
          "他低着头走了。半小时后你经过走廊，听到他在电话里说：'妈，我在这边挺好的。队友都很好。教练……教练也很好。'\n\n" +
          "他没看到你。你也没停。但那天晚上，他在训练室多留了两个小时。",
        effect: { morale: 5, condition: 4, cohesion: 3, discipline: 2, tactics: 1 },
      },
      {
        label: "什么都不做，但训练后跟他说一句'生日快乐'",
        resultText:
          "你没做任何特殊安排。训练照常，强度照常。\n\n" +
          "训练结束，人都走光了。他在收拾东西，你走到门口停了一下。\n\n" +
          "'生日快乐。'\n\n" +
          "他抬头，眼睛亮了一下。'教练，你……你怎么知道？'\n\n" +
          "'我是教练。' 你说。'二十岁。第一年打正赛。下个月{best_cup_name}。'\n\n" +
          "他点头。你转身要走，他在背后说了一句：'教练。我不会让你失望的。'",
        effect: { morale: 4, discipline: 3, condition: 2, cohesion: 2, firepower: 2, tactics: 1 },
      },
      {
        label: "'二十岁生日礼物——明天的决赛你首发。'",
        resultText:
          "你走到他面前，说了一句让他愣住的话：'明天的比赛，你首发。'\n\n" +
          "他张了张嘴。'教练……我？可是{veteran_name}……'\n\n" +
          "'{veteran_name}同意了。' 你说。'他说这是他送你的生日礼物。'\n\n" +
          "你看到他的手开始抖——不是紧张，是那种被信任砸中的颤抖。'教练，我——我行吗？'\n\n" +
          "'你行。' 你说。'你二十岁了。该行了。'\n\n" +
          "第二天，他打出了职业生涯最好的一场。赛后他抱着{veteran_name}哭了。",
        effect: { firepower: 4, morale: 6, cohesion: 5, discipline: 2, condition: 1, tactics: -1, momentum: 3 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "cohesion", "condition", "rookie", "firepower"],
  },
  {
    id: "match_fixing_offer",
    category: "out_of_match",
    timing: ["before_match", "between_cups"],
    title: "那通电话",
    narrative:
      "凌晨一点，你的手机响了。陌生号码。\n\n" +
      "接起来，对面是个很客气的男声：'教练您好。不方便透露身份。有个生意想跟您谈谈——明天的比赛，您这边……能不能配合一下？价格好商量。七位数。'\n\n" +
      "你的手攥紧了手机。你听见过这种事——电竞圈地下盘口，假赛，操盘。但你从没想过——这种电话会打到你的手机上。\n\n" +
      "对面还在说：'教练，您听我说完。您队伍里的小孩们，年薪加起来还没这个数。您——'",
    triggerRequirements: [
      "概率触发，极稀有",
      "队伍处于低谷期或资金紧张",
    ],
    choices: [
      {
        label: "挂断。明天上报联盟。",
        resultText:
          "你挂断了电话。手在抖——不是害怕，是愤怒。\n\n" +
          "第二天你上报了联盟。联盟启动调查——但调查需要时间，而且……你不知道这通电话是谁打的，从哪来的消息。\n\n" +
          "你跟队伍里谁都没说。但你开始留意——比赛时观众的欢呼，解说的措辞，盘口的波动。你第一次知道，原来这个圈子的水，比你想象的深。\n\n" +
          "{star_player_name}注意到你心神不宁。'教练，怎么了？' 你摇摇头。'没事。打好比赛。'",
        effect: { discipline: 5, morale: 2, cohesion: 2, tactics: 1, economy: 0, condition: -1 },
      },
      {
        label: "挂断。不上报，但记录下来。",
        resultText:
          "你挂断了。但你没上报——你不确定联盟那边有没有人跟这事有关。\n\n" +
          "你把通话记录、时间、对方的话，都记在了一个加密文档里。如果有一天你需要它——它会是一张牌。\n\n" +
          "你继续带队伍。但心里多了一根刺。每次比赛赢了，你都会想——这赢得是真的，还是盘口想要的？\n\n" +
          "那根刺跟了你很久。直到有一天你把它拔出来——但那是另一个故事了。",
        effect: { discipline: 3, morale: -1, cohesion: -1, tactics: 1, condition: -1 },
      },
      {
        label: "听完对方说的，然后冷冷拒绝",
        resultText:
          "你没挂。你听完了。\n\n" +
          "对方说完后，你开口了——声音很平：'你说完了？'\n\n" +
          "'……说完了。'\n\n" +
          "'好。我记住了你的声音。下一次这个号码打过来，我直接报警。'\n\n" +
          "你挂了。然后你把那个号码拉黑了。\n\n" +
          "第二天训练，你看着{rookie_name}在练枪——他什么都不知道。你心里想：这帮小孩信我。我不能让他们的职业生涯，被一通电话毁了。",
        effect: { discipline: 4, morale: 3, cohesion: 3, tactics: 1, condition: 1 },
      },
      {
        label: "告诉队长，让他知道这圈子是什么样的",
        resultText:
          "第二天，你把队长拉到一边，把这通电话告诉了他。\n\n" +
          "他听完脸色铁青。'教练……这种事，多吗？'\n\n" +
          "'比你想象的多。' 你说。'我告诉你，是因为——你以后要当教练的。你得知道这个圈子是什么样。'\n\n" +
          "他沉默了很久。'教练，谢谢你告诉我。' 然后他说：'我不会跟队员说。但我自己会盯着。如果有人——哪怕是队友——我第一个告诉你。'\n\n" +
          "你拍了拍他的肩。'好队长。'",
        effect: { discipline: 4, cohesion: 4, morale: 2, tactics: 1, condition: 0 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["discipline", "morale", "cohesion", "leadership", "integrity"],
  },
  {
    id: "star_player_doubts",
    category: "out_of_match",
    timing: ["between_cups", "after_match"],
    title: "凌晨三点的消息",
    narrative:
      "凌晨三点，你收到{star_player_name}的消息：'教练，你睡了吗？'\n\n" +
      "你回：'没。怎么了？'\n\n" +
      "过了很久，他才发来下一条：'教练，我是不是……没有大家说的那么强？'\n\n" +
      "然后是第二条：'今天的训练赛，我明明能赢的枪，我犹豫了。我不敢开。我怕输。'\n\n" +
      "第三条：'我以前不是这样的。我以前……什么都不怕。'\n\n" +
      "你盯着屏幕。三条消息，凌晨三点。一个被所有人叫'天才'的选手，在问你是不是真的强。",
    triggerRequirements: [
      "队内存在 firepower >= 88 的选手",
      "近期表现低于预期",
      "概率触发",
    ],
    choices: [
      {
        label: "'你不是变弱了。你是开始怕了。怕是好事——说明你在乎。'",
        resultText:
          "你打字：'你不是变弱了。你是开始怕了。'\n\n" +
          "他秒回：'？'\n\n" +
          "'怕是好事。说明你在乎。以前你什么都不怕——因为你没什么可输的。现在你怕了——因为你已经有了该守住的东西。'\n\n" +
          "很久没回。然后一个语音：'教练……那我怎么办？'\n\n" +
          "你回：'明天训练室见。我陪你打两个小时死斗。找回那个什么都不怕的你——但这次，让他带着在乎去打。'\n\n" +
          "第二天他比谁都早到。练完之后他跟你说：'教练，我不怕了。'",
        effect: { firepower: 5, morale: 4, discipline: 3, condition: 2, cohesion: 3, tactics: 1 },
      },
      {
        label: "'你现在还弱。但你会变强。这跟天才不天才没关系。'",
        resultText:
          "你没安慰他。你打字：'你现在还弱。'\n\n" +
          "他愣了很久才回：'……'\n\n" +
          "'但你会变强。这跟天才不天才没关系。天赋让你十八岁打出来。但只有磨砺能让你二十八岁还在打。你现在犹豫——是因为你只用天赋打了太久。该学磨砺了。'\n\n" +
          "他没回。你以为他睡了。\n\n" +
          "第二天早上，他在训练室等你。'教练，从今天开始，我加练基本功。'\n\n" +
          "你没说话。但你知道——这通凌晨三点的消息，救了他的职业生涯。",
        effect: { firepower: 3, discipline: 5, tactics: 3, morale: 2, condition: -1, cohesion: 2 },
      },
      {
        label: "'别想了。睡觉。明天训练室聊。'",
        resultText:
          "你打字：'别想了。睡觉。明天训练室聊。'\n\n" +
          "他回了个'好'。\n\n" +
          "第二天训练室，你把他叫到一边。'昨晚的消息——你发的，是因为压力大。我理解。但凌晨三点想这种事，只会越想越糟。'\n\n" +
          "他点头。'我知道……但我忍不住。'\n\n" +
          "'以后忍不住的时候，' 你说，'给我打电话。别发消息。声音比文字暖。'\n\n" +
          "他愣了一下，然后笑了。'教练……谢谢你。'\n\n" +
          "从那以后，他偶尔会在凌晨给你打电话。有时候聊比赛，有时候什么都不聊。但电话挂了之后，他总能睡着。",
        effect: { morale: 5, cohesion: 5, condition: 3, discipline: 2, firepower: 2, tactics: 1 },
      },
      {
        label: "'你强。但强不是不怕。强是怕了还敢开枪。'",
        resultText:
          "你打字：'你强。'\n\n" +
          "他：'可是我怕了……'\n\n" +
          "'强不是不怕。强是怕了还敢开枪。' 你说。'你今天犹豫了——但你明天还会站在那个位置上。这就是强。'\n\n" +
          "他很久没回。然后一个语音，声音有点哑：'教练，我记住了。'\n\n" +
          "第二天的训练赛，他在关键回合主动要了突破位。赢了。赛后他找到你：'我今天怕了。但我开了枪。'\n\n" +
          "你拍他的肩：'这就够了。'",
        effect: { firepower: 4, morale: 4, discipline: 3, cohesion: 3, condition: 1, momentum: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["firepower", "morale", "cohesion", "star_player", "condition"],
  },
  {
    id: "team_dinner_invitation",
    category: "out_of_match",
    timing: ["between_cups", "after_match"],
    title: "吃饭吗",
    narrative:
      "训练结束。你的队长走过来：'教练，今晚全队一起吃个饭？很久没一起吃了。'\n\n" +
      "你看了看日程表。明天有训练赛，后天有商业活动，大后天出发去{best_cup_name}。时间确实紧。\n\n" +
      "但你也注意到了——最近训练室里的笑声少了很多。{rookie_name}总是一个人吃饭，{veteran_name}训练完就走，{star_player_name}最近话也少了。\n\n" +
      "队长看着你：'教练，就一顿饭。不会太晚。'",
    triggerRequirements: [
      "队内 cohesion < 75",
      "概率触发",
    ],
    choices: [
      {
        label: "去。而且你请客。",
        resultText:
          "'去。我请。'\n\n" +
          "队长笑了——你很少见他笑得那么松。\n\n" +
          "饭桌上没人聊比赛。{rookie_name}讲了他老家的糗事，{veteran_name}讲了他刚出道时的笑话——那时候他还不是老将，还是个手抖的新人。{star_player_name}喝了两杯酒后开始话多——你第一次知道他原来这么有趣。\n\n" +
          "结账的时候，{veteran_name}抢着付了。'教练，下次我请。' \n\n" +
          "第二天训练室，笑声回来了。",
        effect: { cohesion: 7, morale: 6, condition: 3, discipline: 1, economy: -2, tactics: 1 },
      },
      {
        label: "去，但AA——别让任何人有负担",
        resultText:
          "'去。AA。别让谁请——一顿饭搞成商务宴请就没意思了。'\n\n" +
          "饭桌上气氛很好。{rookie_name}一开始拘谨，怕点贵了。{veteran_name}拍他：'点。AA又不会破产。'\n\n" +
          "他们聊了很多——但奇怪的是，没人聊比赛。聊的是电影、游戏、家里的猫、{star_player_name}最近在追的剧。\n\n" +
          "你看着他们，突然意识到：这帮人在一起的时间，比跟家人还长。但他们在饭桌上聊的，是家人聊的话题。这就是队伍。",
        effect: { cohesion: 6, morale: 5, condition: 3, discipline: 1, economy: -1 },
      },
      {
        label: "不去，让他们自己去——'年轻人聚聚，我别扫兴'",
        resultText:
          "'你们去。我别扫兴了。'\n\n" +
          "队长有点失望。'教练……'\n\n" +
          "'去吧。' 你说。'吃好玩好。明天训练别迟到就行。'\n\n" +
          "他们走了。你一个人在基地，看了会儿比赛录像。\n\n" +
          "晚上十一点，{rookie_name}给你发了张照片——饭桌上五个人，对着镜头比耶。配文：'教练，下次一起来！'\n\n" +
          "你回了个'好'。然后存了那张照片。有些距离，是为了让他们更近。",
        effect: { cohesion: 5, morale: 4, condition: 2, discipline: 2, tactics: 1 },
      },
      {
        label: "不去，明天有训练赛——'吃饭可以，等杯赛打完'",
        resultText:
          "'明天有训练赛。等{best_cup_name}打完再说。'\n\n" +
          "队长没说话。但你看到他眼神暗了一下。\n\n" +
          "{rookie_name}小声说了句'哦'。{veteran_name}拍了拍队长的肩，没说话。\n\n" +
          "他们各自回房了。训练室安静下来。\n\n" +
          "你坐在那里，突然觉得——也许你做错了。训练赛重要，但……有些东西比训练赛重要。你给队长发了条消息：'杯赛打完，我请全队吃饭。哪都行。' \n\n" +
          "他秒回：'好。'\n\n" +
          "但你知道——这次没去成的饭，已经在他们心里留了个小缺口。",
        effect: { discipline: 4, tactics: 2, cohesion: -2, morale: -1, condition: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["cohesion", "morale", "condition", "discipline"],
  },
  {
    id: "veteran_teaches_rookie",
    category: "out_of_match",
    timing: ["between_cups", "after_match"],
    title: "传承",
    narrative:
      "训练结束了。所有人都走了——除了{veteran_name}和{rookie_name}。\n\n" +
      "你路过训练室，听到里面有声音。{veteran_name}在说话，声音很轻——那种只有在教东西的时候才会有的轻。\n\n" +
      "'你看这个回合。' 他在给{rookie_name}看回放。'你冲B点的时候，预瞄在这里。但你有没有想过——为什么对面的人会架这个角度？'\n\n" +
      "{rookie_name}：'因为……这是常规位？'\n\n" +
      "'对。但他为什么知道你会从这边来？因为你前三个回合都从这边来。' {veteran_name}停了一下。'记住——同一个位置，用两次就够。第三次，就要变了。因为对面也在看你的回放。'\n\n" +
      "你没进去。站在门口听。这是一种你教不了的东西——经验。",
    triggerRequirements: [
      "队内存在年龄差 >= 6 岁的老将和新人",
      "已过 >= 1 个赛季",
    ],
    choices: [
      {
        label: "不打扰，让他们自己聊",
        resultText:
          "你没进去。你站在门口听了十分钟，然后悄悄走了。\n\n" +
          "第二天训练，{rookie_name}的走位变了——不再是千篇一律的常规路线。他在第三回合突然变向，对手的前压扑了个空。\n\n" +
          "赛后{veteran_name}看了你一眼，笑了。你知道他看到了你昨晚站在门口。他没说。你也没说。\n\n" +
          "有些传承不需要教练介入。需要的是——时间和空间。",
        effect: { tactics: 4, cohesion: 5, firepower: 2, discipline: 2, morale: 3, condition: 1 },
      },
      {
        label: "走进去，加入他们——'我也听听'",
        resultText:
          "你推门进去。两个人都愣了。\n\n" +
          "{veteran_name}有点不好意思：'教练，我就是随便教教……'\n\n" +
          "'别停。' 你拉了把椅子坐下。'我也听听。你打比赛的时候我没机会听你讲思路——现在补上。'\n\n" +
          "那天晚上，三个人在训练室聊了两个小时。{veteran_name}讲的不是战术——是十年比赛积累的直觉。什么时候该慢，什么时候该赌，什么时候该认。\n\n" +
          "你听完之后说：'{veteran_name}，你退役之后——当教练，比我强。'\n\n" +
          "他笑了。'那得等我能放下鼠标再说。'",
        effect: { tactics: 5, cohesion: 6, morale: 4, discipline: 2, firepower: 2, condition: -1 },
      },
      {
        label: "第二天给全队加一节'{veteran_name}的课'",
        resultText:
          "第二天训练前，你宣布：'今天第一节，{veteran_name}讲。所有人听。'\n\n" +
          "{veteran_name}愣了。'教练，我……'\n\n" +
          "'你昨晚教{rookie_name}的那套，' 你说，'该让所有人都听听。'\n\n" +
          "他站在白板前，一开始紧张——他习惯用枪说话，不习惯用嘴。但讲到第三个回合的时候，他放开了。十年积累的东西，像水一样流出来。\n\n" +
          "讲完之后，{star_player_name}带头鼓掌。{veteran_name}红了脸——但笑得很真。",
        effect: { tactics: 6, cohesion: 6, morale: 5, discipline: 3, firepower: 1, condition: -1 },
      },
      {
        label: "私底下跟{rookie_name}说：'好好学。这是别人花钱都买不到的'",
        resultText:
          "第二天，你把{rookie_name}拉到一边。\n\n" +
          "'昨晚{veteran_name}教你的——好好学。'\n\n" +
          "{rookie_name}点头。'我记了笔记。'\n\n" +
          "'不是记笔记的事。' 你说。'是脑子。他教你的是思路——这个别人花钱都买不到。他打十年比赛攒的东西，白白给你。你知道这意味着什么吗？'\n\n" +
          "{rookie_name}想了想：'意味着……我得对得起？'\n\n" +
          "'意味着你得传下去。' 你说。'等你成了老将，也得教新人。这是这行人的规矩。'\n\n" +
          "他认真地点头。'我记住了，教练。'",
        effect: { cohesion: 5, tactics: 3, discipline: 3, morale: 3, firepower: 1, condition: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["cohesion", "tactics", "leadership", "veteran", "rookie"],
  },
  {
    id: "fan_letter",
    category: "out_of_match",
    timing: ["between_cups", "after_match"],
    title: "一封信",
    narrative:
      "助理递给你一封信——纸质的那种，手写。从外省寄来的。\n\n" +
      "信封上写着'转交{star_player_name}'。字迹很稚嫩——像是个小孩写的。\n\n" +
      "你转交给了{star_player_name}。他拆开，看了一会儿，突然不动了。\n\n" +
      "你问怎么了。他把信递给你。\n\n" +
      "信上写：'哥哥你好，我十二岁。我也打CS。我妈妈说我打游戏没出息。但是看到你在{best_cup_name}的那个翻盘，我跟妈妈说，你看，{star_player_name}哥哥也是打游戏的人。妈妈没说话。我想问你——你是怎么坚持下来的？我也想坚持。但我不知道能不能。'",
    triggerRequirements: [
      "队内存在 firepower >= 85 的选手",
      "近期有过高光表现",
      "概率触发",
    ],
    choices: [
      {
        label: "让他自己回信——这是他的事",
        resultText:
          "你把信还给他。'回吧。这是你的事。'\n\n" +
          "他点头。那天晚上他在训练室写回信写了两个小时——比写战术报告还认真。\n\n" +
          "第二天他给你看回信的草稿。最后一句是：'坚持很难。但有人信你的时候，就不那么难了。我也在学。一起学。'\n\n" +
          "你拍了拍他的肩。'寄吧。'\n\n" +
          "从那天起，{star_player_name}训练的时候多了一种东西——不是为赢，是为'有人在看'。",
        effect: { morale: 6, discipline: 3, condition: 2, cohesion: 2, firepower: 2, tactics: 1 },
      },
      {
        label: "'让他来基地看看——亲眼看看职业选手怎么训练'",
        resultText:
          "你说：'邀请那小孩来基地。亲眼看看你怎么训练。'\n\n" +
          "{star_player_name}愣了。'教练，这……'\n\n" +
          "'你回信。告诉他周末来。路费我们出。'\n\n" +
          "那个十二岁的小孩真的来了。他站在训练室门口，眼睛亮得像星星。{star_player_name}让他坐自己旁边，看他打了一下午训练赛。\n\n" +
          "走的时候小孩说：'哥哥，我跟我妈说，我要当职业选手。我妈说——如果你能像{star_player_name}哥哥那样认真，她就支持我。'\n\n" +
          "{star_player_name}蹲下来跟他平视：'那就认真。我等你。'",
        effect: { morale: 7, cohesion: 4, discipline: 3, condition: 2, economy: -1, firepower: 1 },
      },
      {
        label: "'这封信别回。别让粉丝影响你。'",
        resultText:
          "你说了一句很冷的话：'别回。粉丝的信，回了就会有第二封、第三封。你没那个时间。'\n\n" +
          "{star_player_name}看着你，眼神复杂。他把信折好，放进了抽屉。\n\n" +
          "但你注意到——那天训练他心不在焉。第二天也是。\n\n" +
          "第三天，你把那封信从抽屉里拿出来，放回了他的桌上。'回吧。' 你说。'我错了。有些事比时间重要。'\n\n" +
          "他看了你很久。然后点头。'谢谢，教练。'",
        effect: { discipline: 2, morale: 3, cohesion: 3, condition: 1, tactics: 1, firepower: 1 },
      },
      {
        label: "把这封信读给全队听",
        resultText:
          "你说：'今天的队会，第一件事——我念封信。'\n\n" +
          "你把那封信念了出来。念到'我也想坚持，但我不知道能不能'的时候，训练室安静得能听到空调声。\n\n" +
          "念完，你说：'有人信你们。一个十二岁的小孩。他不知道你们的战绩，不知道你们的合同，不知道你们的压力。他只知道——他看了你们的比赛，他想坚持。'\n\n" +
          "{veteran_name}第一个开口：'教练，我们——我们会让他看到好比赛的。'\n\n" +
          "所有人都点头。那天训练，没人偷懒。",
        effect: { morale: 7, cohesion: 6, discipline: 4, firepower: 2, condition: 1, tactics: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["morale", "cohesion", "discipline", "star_player", "pressure"],
  },
  {
    id: "igl_last_straw",
    category: "in_match",
    timing: ["during_match"],
    title: "指挥不下去了",
    narrative:
      "第三个回合了。你的队长——你们的指挥——在语音里沉默了。\n\n" +
      "前两个回合他叫的战术，全输了。不是战术的问题，是执行的问题——但作为指挥，他把责任扛在了自己身上。\n\n" +
      "冻结时间快结束了。他在语音里说了句：'你们……自己打吧。我……我不知道叫什么了。'\n\n" +
      "他的声音在抖。你见过这种状态——指挥的'失语'。当一个人叫了太多失败的战术，他会突然——什么都说不出。",
    triggerRequirements: [
      "己方连续输掉 >= 2 个压缩回合",
      "队长为 system_leader 特征",
      "概率触发",
    ],
    choices: [
      {
        label: "在语音里喊：'听我的。默认控图，B点回防。'",
        resultText:
          "你抢过指挥权。'听我的。默认控图，B点回防。'\n\n" +
          "语音里安静了一秒。然后{star_player_name}说：'收到。' 其他人跟着'收到'。你的队长——你听到他长出了一口气。\n\n" +
          "那回合赢了。不是战术多神——是对手没想到你们会临时换指挥。\n\n" +
          "回合结束，队长在语音里说：'教练……谢谢你。' 你说：'歇一会儿。下个回合你来。'",
        effect: { tactics: 4, discipline: 3, morale: 4, cohesion: 3, tactical_control: 5, momentum: 2 },
      },
      {
        label: "'队长，深呼吸。叫最简单的——你不用神，你只要叫。'",
        resultText:
          "你在语音里说：'队长。深呼吸。'\n\n" +
          "他没回。你继续：'你不用叫神战术。叫最简单的——默认控图，等机会。你只要叫。声音在，队伍就在。'\n\n" +
          "沉默了三秒。然后他的声音回来了——还是抖，但在了：'……默认控图。等机会。'\n\n" +
          "那回合没赢。但队伍没崩。因为指挥的声音回来了。\n\n" +
          "下个回合，他叫了个大胆的快攻。赢了。他在语音里说：'谢了教练。我回来了。'",
        effect: { tactics: 2, morale: 5, cohesion: 5, discipline: 3, tactical_control: 3, condition: 1 },
      },
      {
        label: "让副队长接管——'副队，你来叫。队长歇会儿。'",
        resultText:
          "你在语音里说：'副队，你来叫。队长歇一会儿。'\n\n" +
          "副队长愣了一下。'我？'\n\n" +
          "'你。' 你说。'队长，听副队的。歇两个回合。'\n\n" +
          "你的队长没抗议。他知道你给了他台阶。'……好。听副队的。'\n\n" +
          "副队长叫了两个回合——中规中矩，但稳。一胜一负。第三回合，队长在语音里说：'我回来了。副队，谢了。'\n\n" +
          "副队长笑了：'哥，你歇够了？'\n\n" +"'歇够了。' 队长说。'该我来了。'",
        effect: { tactics: 3, cohesion: 5, morale: 4, discipline: 3, tactical_control: 2, condition: 1 },
      },
      {
        label: "什么都不说——让他自己走出来",
        resultText:
          "你没说话。\n\n" +
          "冻结时间结束。语音里没人叫战术。五个人凭本能打。\n\n" +
          "输了。又是0-3。\n\n" +
          "第四个回合。冻结时间。语音里又是沉默。\n\n" +
          "然后你的队长开口了——声音不大，但稳了：'……默认控图。B点回防。这次听我的。'\n\n" +
          "他自己走出来了。你不需要扶他。有些坎，必须自己跨。跨过去了，就是真正的指挥。",
        effect: { tactics: 3, morale: 3, discipline: 4, cohesion: 4, tactical_control: 2, condition: -1, momentum: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["leadership", "tactics", "morale", "cohesion", "tactical_control"],
  },
];

outOfMatchEvents.push(...emotionalDepthEvents.filter(e => e.category === "out_of_match"));
inMatchEvents.push(...emotionalDepthEvents.filter(e => e.category === "in_match"));

// ──────────────────────────────────────────────
// 选手情绪爆发模板——砸桌/摊手/自责/踢椅
// 按性格分化，可在心态崩/残局输/连败时插入
// ──────────────────────────────────────────────

export type EmotionBurstTrigger =
  | "tilt_chain"          // 心态炸了
  | "clutch_loss"         // 残局输了
  | "consecutive_loss"    // 连败
  | "mistake_self_blame"  // 自己失误
  | "bad_call_exposed";   // 战术被针对

export type EmotionBurstStyle =
  | "desk_slam"        // 砸桌子（NiKo 型）
  | "mouse_throw"      // 摔鼠标
  | "hands_spread"     // 摊手大骂
  | "self_blame_mute"  // 沉默自责
  | "kick_chair"       // 踢椅子
  | "headphones_off"   // 摘耳机靠墙
  | "water_bottle"     // 摔水瓶
  | "screen_stare";    // 盯着灰屏不动

export interface EmotionBurstTemplate {
  /** 触发情境 */
  trigger: EmotionBurstTrigger;
  /** 爆发风格 */
  style: EmotionBurstStyle;
  /** 适配的性格（空=任意） */
  traits: string[];
  /** 模板 */
  template: string;
}

export const emotionBursts: EmotionBurstTemplate[] = [
  // ── 砸桌子（火爆型/明星型）──
  {
    trigger: "tilt_chain",
    style: "desk_slam",
    traits: ["hot_blooded", "streaky_star"],
    template:
      "{player} 一拳砸在桌上。鼠标跳了起来，水杯翻了，键盘歪了半米。隔音棚里所有人都听到了——包括对手。\n\n" +
      "他没说话。只是盯着屏幕，胸口剧烈起伏。第二拳没砸下来——他的手悬在半空，攥着，发抖。",
  },
  {
    trigger: "clutch_loss",
    style: "desk_slam",
    traits: ["hot_blooded"],
    template:
      "{player} 双拳砸桌。一下。两下。第三下的时候，桌上的水瓶弹起来摔在了地上。\n\n" +
      "'操！' 只有一个字。但那个字里装着整个残局的遗憾。",
  },

  // ── 摔鼠标 ──
  {
    trigger: "tilt_chain",
    style: "mouse_throw",
    traits: ["hot_blooded", "streaky_star"],
    template:
      "{player} 把鼠标往桌上一摔。鼠标线从桌上飞了起来，在空中甩了个弧。耳机歪了，歪到了耳朵下面。\n\n" +
      "他没去扶。他只是——盯着灰色的屏幕。'阵亡'两个字像钉子一样钉在画面中央。",
  },
  {
    trigger: "consecutive_loss",
    style: "mouse_throw",
    traits: ["streaky_star"],
    template:
      "第三局输了。{player} 的鼠标离开桌面——不是放的，是扔的。鼠标撞在隔音棚的墙上，弹回来，滚到了地上。\n\n" +
      "队长看了他一眼。没说话。弯腰捡起鼠标，放回他桌上。{player} 没道谢。但他把耳机戴正了。",
  },

  // ── 摊手大骂 ──
  {
    trigger: "mistake_self_blame",
    style: "hands_spread",
    traits: ["hot_blooded"],
    template:
      "{player} 在椅子上往后一靠，双手摊开，对着天花板骂了一句。不是骂谁——是骂自己。\n\n" +
      "'我在干什么？啊？那个枪我怎么打的？' 他的声音很大，大到对手的隔音棚里都能听到。\n\n" +
      "队长在语音里说：'闭嘴。下局。' 他没闭嘴。但他坐直了。",
  },
  {
    trigger: "bad_call_exposed",
    style: "hands_spread",
    traits: ["hot_blooded", "streaky_star"],
    template:
      "{player} 摊开双手，对着语音里喊：'谁报的点？谁说 B 有两个？B 一个都没有！'\n\n" +
      "没人接话。因为报点的就是他自己。\n\n" +
      "三秒后他意识到——闭上嘴，把耳机往下拽了拽，遮住了半张脸。",
  },

  // ── 沉默自责 ──
  {
    trigger: "clutch_loss",
    style: "self_blame_mute",
    traits: ["calm_clutcher", "disciplined"],
    template:
      "{player} 没动。\n\n" +
      "没砸桌。没摔鼠标。没骂人。他只是——坐在椅子上，盯着灰屏。一动不动。\n\n" +
      "三十秒。队长走过来拍他的肩。他没反应。一分钟。他才慢慢摘下耳机，放在桌上。轻轻放的。比摔更让人心疼。\n\n" +
      "'我的。' 两个字。声音轻得像怕吵醒谁。",
  },
  {
    trigger: "mistake_self_blame",
    style: "self_blame_mute",
    traits: ["calm_clutcher"],
    template:
      "{player} 没说话。他把手从鼠标上拿开——像突然不认识这个东西了。放在膝盖上。十指交叉。攥着。\n\n" +
      "他在算。算那个回合如果自己不冲，会怎样。如果补枪快 0.3 秒，会怎样。如果——\n\n" +
      "但 CS 没有'如果'。他闭上眼。再睁开的时候，眼神——空了。",
  },

  // ── 踢椅子 ──
  {
    trigger: "tilt_chain",
    style: "kick_chair",
    traits: ["hot_blooded"],
    template:
      "{player} 站起来——不是正常站，是弹起来的。他的椅子被踢飞了半米，撞在后面的墙上。\n\n" +
      "他没捡。他站在那里，背对着屏幕，双手撑着隔音棚的墙。头低着。肩膀在抖。\n\n" +
      "十秒后他自己走回去，把椅子扶正，坐下。没说话。但椅子——被他踢出了一个凹痕。",
  },

  // ── 摘耳机靠墙 ──
  {
    trigger: "consecutive_loss",
    style: "headphones_off",
    traits: ["calm_clutcher", "system_leader"],
    template:
      "{player} 摘下耳机——不是放桌上，是直接挂在脖子上。然后他站起来，走到隔音棚的角落，背靠着墙，滑坐下去。\n\n" +
      "他坐在地上。耳机还挂在脖子上。手指无意识地在耳机线上缠——缠了三圈，松开，再缠。\n\n" +
      "队长走过去，蹲下来：'还行吗？'\n\n" +
      "{player} 抬头看他。没点头，没摇头。只是——慢慢站了起来。",
  },

  // ── 摔水瓶 ──
  {
    trigger: "clutch_loss",
    style: "water_bottle",
    traits: ["streaky_star"],
    template:
      "{player} 抓起桌上的水瓶——不是喝。是扔。水瓶砸在隔音棚的玻璃上，'砰'的一声，水洒了一桌。\n\n" +
      "水瓶弹回来，滚到他脚边。他没捡。\n\n" +
      "助理跑进来擦桌子。{player} 看着助理擦了五秒，然后说了一句：'……对不起。' 声音比水瓶砸墙的时候还轻。",
  },

  // ── 盯着灰屏不动 ──
  {
    trigger: "clutch_loss",
    style: "screen_stare",
    traits: ["any"],
    template:
      "{player} 没动。\n\n" +
      "屏幕上的'阵亡'已经淡了——变成了观战视角。但他没在看观战。他在看自己死的那一帧。\n\n" +
      "那个角度。那个时机。那颗偏了的子弹。\n\n" +
      "一分钟。两分钟。队友都站起来了，他还坐着。直到队长走过来挡住了他的屏幕——他才回过神。",
  },
];

/** 按触发情境和性格获取情绪爆发模板 */
export function getEmotionBurst(
  trigger: EmotionBurstTrigger,
  traits: string[],
  seed: number
): EmotionBurstTemplate | undefined {
  const pool = emotionBursts.filter(
    (b) =>
      b.trigger === trigger &&
      (b.traits.length === 0 || b.traits.some((t) => traits.includes(t)))
  );
  if (pool.length === 0) {
    // 兜底：取同 trigger 的任意性格模板
    const fallback = emotionBursts.filter((b) => b.trigger === trigger);
    if (fallback.length === 0) return undefined;
    return fallback[seed % fallback.length];
  }
  return pool[seed % pool.length];
}

// ──────────────────────────────────────────────
// 队伍成长事件——通过非训练活动获得代价性成长
// ──────────────────────────────────────────────

const teamGrowthEvents: GameEvent[] = [
  {
    id: "team_vacation_chemistry",
    category: "out_of_match",
    timing: ["between_cups", "season_end"],
    title: "出去走走",
    narrative:
      "连续两个杯赛打完，训练室里的空气是黏的——不是坏，是闷。{veteran_name} 训练完就走，{rookie_name} 一个人吃饭，{star_player_name} 最近话少了。\n\n" +
      "你的队长找你：'教练，能不能带大家出去走走？不是休息——就是……换个地方。再在训练室待下去，要闷出病了。'\n\n" +
      "换地方有代价——几天不练枪，手感会凉。但也许——人近了，枪也会跟着近。",
    triggerRequirements: ["杯赛间隙", "队内 cohesion < 75", "概率触发"],
    choices: [
      {
        label: "去海边三天——彻底放松",
        resultText:
          "你带全队去了海边。没带电脑。没带战术本。\n\n" +
          "第一天所有人都不太说话——习惯了训练室的节奏，突然闲下来反而不知道干嘛。第二天，{rookie_name} 在海里被浪打翻，{star_player_name} 笑得前仰后合——那是他这个月第一次笑。\n\n" +
          "第三天晚上，五个人围着篝火喝啤酒。{veteran_name} 讲了他刚出道时的糗事——那时候他还不是老将，是个手抖的新人。\n\n" +
          "回来之后，训练室里的笑声回来了。但——三天没练枪，{star_player_name} 的预瞄准了。默契涨了，手感凉了。",
        effect: { cohesion: 8, morale: 6, condition: 4, firepower: -3, tactics: -2, discipline: -1 },
      },
      {
        label: "去山里两天——轻度训练+团建",
        resultText:
          "你选了山里的一个民宿。上午爬山，下午打两场训练赛，晚上烧烤。\n\n" +
          "爬山的时候，{veteran_name} 走在最前面——十年的体能训练不是白练的。{rookie_name} 在后面喘成狗，{star_player_name} 拉了他一把。\n\n" +
          "下午的训练赛打得不好——手感确实凉了。但晚上烧烤的时候，{rookie_name} 跟 {star_player_name} 聊了很久。你不知道聊了什么——但第二天训练赛的配合明显好了。",
        effect: { cohesion: 6, morale: 5, condition: 3, firepower: -2, tactics: -1, discipline: 1 },
      },
      {
        label: "去隔壁城市看一场其他队伍的比赛",
        resultText:
          "你没带他们去度假——你带他们去看了 {rival_team} 的一场比赛。现场观众席。\n\n" +
          "五个人坐在观众席里，看 {rival_team} 打比赛。{veteran_name} 一直在小声分析：'他们的默认变了。' {star_player_name} 盯着 {opponent} 的预瞄角度——'他这个站位可以学。'\n\n" +
          "回来之后，{rookie_name} 说了一句：'坐在观众席看比赛，跟自己打完全不一样。我突然看懂了很多东西。'\n\n" +
          "默契没怎么涨——但战术理解涨了。有时候换个视角，比训练十场管用。",
        effect: { tactics: 5, cohesion: 3, morale: 3, firepower: -1, discipline: 2, tactical_control: 3 },
      },
      {
        label: "不去——训练不能断",
        resultText:
          "'不去。' 你说。'下个杯赛还有两周。两天不练，手感就凉。'\n\n" +
          "队长没反对。但你看到他的眼神暗了一下。\n\n" +
          "训练照常。手感没掉。但训练室里的空气——还是黏的。{rookie_name} 还是一个人吃饭。{star_player_name} 还是话少。\n\n" +
          "有些东西，训练解决不了。",
        effect: { firepower: 1, tactics: 2, discipline: 2, cohesion: -3, morale: -2, condition: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["cohesion", "morale", "condition", "firepower", "growth"],
  },
  {
    id: "team_cooking_night",
    category: "out_of_match",
    timing: ["between_cups"],
    title: "做饭",
    narrative:
      "起因很小——{rookie_name} 说想吃家常菜了。{veteran_name} 接了一句：'那自己做。'\n\n" +
      "你本来以为只是随口一说。但晚上八点，训练室里飘出了炒菜的香味——{veteran_name} 系着围裙在灶台前翻炒，{star_player_name} 在切菜（切得乱七八糟），{rookie_name} 在洗碗。\n\n" +
      "你没拦。因为这种东西——比任何团建都管用。",
    triggerRequirements: ["杯赛间隙", "概率触发", "正面事件"],
    choices: [
      {
        label: "加入他们——你也动手做一道菜",
        resultText:
          "你卷起袖子，做了一道你的拿手菜。{rookie_name} 吃了一口：'教练，这比食堂好吃一百倍。'\n\n" +
          "五个人围着一张小桌子吃了一顿家常饭。没聊比赛。聊的是 {veteran_name} 老家的菜、{star_player_name} 小时候挑食的故事、{rookie_name} 妈妈做的红烧肉。\n\n" +
          "吃完饭，{veteran_name} 说了句：'好久没这么放松了。'\n\n" +
          "默契不是在训练室涨的——是在厨房涨的。",
        effect: { cohesion: 6, morale: 5, condition: 3, discipline: 1, tactics: 1 },
      },
      {
        label: "让他们做——你在旁边看着",
        resultText:
          "你没动手。你坐在旁边，看着四个人在厨房里手忙脚乱。\n\n" +
          "{star_player_name} 把盐当成了糖。{rookie_name} 打翻了酱油。{veteran_name} 一边骂一边救场。队长在旁边笑——笑得蹲在了地上。\n\n" +
          "菜做出来——难吃。但五个人吃完了。因为是自己做的。\n\n" +
          "你看着他们——这比任何战术复盘都更像'队伍'。",
        effect: { cohesion: 7, morale: 5, condition: 2, discipline: 1 },
      },
      {
        label: "点外卖——别折腾了",
        resultText:
          "'别做了。点外卖。' 你说。'厨房弄得一团糟。'\n\n" +
          "{veteran_name} 摘了围裙，有点失望。{rookie_name} 小声说：'我还想学做菜来着……'\n\n" +
          "外卖到了。大家吃了。但——各吃各的，各看各的手机。\n\n" +
          "你省了一顿饭的功夫。但也错过了一次让队伍更近的机会。",
        effect: { cohesion: -1, morale: 1, condition: 1, discipline: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["cohesion", "morale", "condition", "growth"],
  },
  {
    id: "team_movie_night",
    category: "out_of_match",
    timing: ["between_cups"],
    title: "电影夜",
    narrative:
      "训练结束。{rookie_name} 问：'今晚看电影吗？'\n\n" +
      "你看了看日程——明天没训练赛。可以。\n\n" +
      "问题是看什么。五个人五个口味。",
    triggerRequirements: ["杯赛间隙", "概率触发", "正面事件"],
    choices: [
      {
        label: "看体育纪录片——'顺便学习'",
        resultText:
          "你选了一部篮球纪录片。{star_player_name} 看了半小时就开始走神——但 {veteran_name} 看得入迷。\n\n" +
          "看完之后，{veteran_name} 说了一句：'他们也是从低谷爬上来的。跟我们一样。'\n\n" +
          "{rookie_name} 没说话。但第二天训练——他的眼神不一样了。",
        effect: { morale: 3, cohesion: 3, discipline: 2, tactics: 2, condition: 1 },
      },
      {
        label: "看喜剧——纯粹放松",
        resultText:
          "你选了喜剧。{star_player_name} 笑得最大声——这是他这个月笑得最开心的一次。\n\n" +
          "{veteran_name} 一开始端着架子不笑。但半小时后他也绷不住了——笑得眼泪都出来了。\n\n" +
          "电影看完，训练室里的空气——终于不黏了。",
        effect: { morale: 6, cohesion: 4, condition: 4, discipline: -1 },
      },
      {
        label: "让大家投票选",
        resultText:
          "你没决定。让五个人自己投票。\n\n" +
          "结果：两票恐怖片，两票动作片，一票动画片。僵了。\n\n" +
          "最后他们猜拳——{rookie_name} 赢了。选了动画片。\n\n" +
          "五个人看了一晚上动画片。{veteran_name} 一开始不情愿——后来看到一半比谁都投入。\n\n" +
          "民主有时候比效率更管用。",
        effect: { cohesion: 5, morale: 4, condition: 3, discipline: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["cohesion", "morale", "condition", "growth"],
  },
];

outOfMatchEvents.push(...teamGrowthEvents);

// ──────────────────────────────────────────────
// 对手突发事件——影响对手状态，间接利好/利空玩家
// ──────────────────────────────────────────────

const opponentEvents: GameEvent[] = [
  {
    id: "opponent_roster_change",
    category: "out_of_match",
    timing: ["before_cup", "before_match", "between_cups"],
    title: "对手换人了",
    narrative:
      "情报组报告：{rival_team} 在杯赛前突然换了首发——他们的主力步枪手因“个人原因”被放上了替补席，换上了一个青训上来的新人。\n\n" +
      "新人的数据你查过——二线联赛打出来的，火力不差，但——没跟这套阵容配合过。\n\n" +
      "换人有两种可能：一是新人确实强，给你惊喜；二是配合生疏，自乱阵脚。你赌哪个？",
    triggerRequirements: ["对手队伍近期发生阵容变动", "概率触发"],
    choices: [
      {
        label: "针对新人打——他肯定紧张",
        resultText:
          "你让队伍针对新人所在的位置进攻。第一回合——新人果然紧张，补枪慢了半秒，{player} 收了他。\n\n" +
          "但 {rival_team} 的指挥立刻调整——把新人挪到了更安全的位置。第二回合新人就不那么好打了。\n\n" +
          "针对有效——但只有效一局。",
        effect: { tactics: 4, firepower: 2, momentum: 3, tactical_control: 2 },
      },
      {
        label: "不针对——正常打，别给他们调整的机会",
        resultText:
          "你没针对新人。正常打。\n\n" +
          "结果——{rival_team} 的新人表现不错，火力在线。但他跟队友的配合确实生疏了——有两个回合的补枪没到位，交叉火力有空档。\n\n" +
          "你没针对新人——但你利用了他们整体的配合失误。",
        effect: { tactics: 3, cohesion: 2, tactical_control: 3, firepower: 1 },
      },
      {
        label: "假情报：让对手以为我们会针对新人",
        resultText:
          "你让助理'不小心'透露——你们会重点针对新人。\n\n" +
          "{rival_team} 的指挥信了。他把新人藏在了最安全的位置，重兵保护——结果他们的进攻火力分散了。\n\n" +
          "你没针对新人——但你让对手自己乱了阵型。",
        effect: { tactics: 5, tactical_control: 4, discipline: 2, momentum: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["opponent", "tactics", "tactical_control"],
  },
  {
    id: "opponent_coach_absent",
    category: "out_of_match",
    timing: ["before_match"],
    title: "对方教练来不了",
    narrative:
      "赛前两小时，消息传来：{rival_team} 的主教练签证出了问题，赶不上今天的比赛。\n\n" +
      "他们的选手得自己叫战术。没有教练的暂停调整。没有教练的赛前准备。\n\n" +
      "这是好消息——但也不能小看。{rival_team} 的指挥是有名的聪明——也许没有教练，他反而更自由。",
    triggerRequirements: ["对手教练无法到场", "概率触发"],
    choices: [
      {
        label: "打快节奏——让他们没时间自己商量",
        resultText:
          "你让队伍打快节奏。快攻、变速、不给对手喘息的时间。\n\n" +
          "没有教练的 {rival_team} 在快节奏里乱了——他们的指挥来不及叫战术，选手各自为战。\n\n" +
          "前三个回合——你赢了两个。没有教练的队伍，在快节奏里就是一盘散沙。",
        effect: { tactics: 4, momentum: 4, firepower: 2, tactical_control: 3 },
      },
      {
        label: "打复杂战术——考验他们的执行力",
        resultText:
          "你让队伍打复杂的假打战术。没有教练的 {rival_team}——他们的指挥读不懂你的假打。\n\n" +
          "第一局——假 B 真 A。{rival_team} 全队转 B，A 点空了。下包。赢。\n\n" +
          "没有教练的队伍，最怕的就是复杂战术——因为没人帮他们分析。",
        effect: { tactics: 6, tactical_control: 4, cohesion: 2, momentum: 3 },
      },
      {
        label: "别大意——他们的指挥可能更强了",
        resultText:
          "你没改变战术。'别大意。' 你跟队伍说。'他们的指挥没了教练约束——可能反而更自由。'\n\n" +
          "你说对了。{rival_team} 的指挥开始叫一些教练在时不会同意的大胆战术——前压、赌点、快攻。前两个回合确实打了你们一个措手不及。\n\n" +
          "但——大胆也意味着风险。第三个回合，他们的前压撞进了你们的交叉火力。\n\n" +
          "没有教练的自由——是双刃剑。",
        effect: { tactics: 2, discipline: 3, firepower: 1, tactical_control: 2, momentum: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["opponent", "tactics", "tactical_control", "momentum"],
  },
  {
    id: "opponent_internal_conflict",
    category: "out_of_match",
    timing: ["before_match", "between_cups"],
    title: "对手内讧了",
    narrative:
      "社交媒体上流出一段视频——{rival_team} 的两个核心选手在训练室里吵架。视频只有十五秒，但你能看到——一个人拍了桌子，另一个人摔门走了。\n\n" +
      "{rival_team} 官方很快删了视频，说'内部讨论'。但——所有人都看到了。\n\n" +
      "你的队长问你：'教练，这对我们来说是好事吗？'",
    triggerRequirements: ["对手队伍 cohesion < 60", "概率触发"],
    choices: [
      {
        label: "'别管他们。专注我们自己的比赛。'",
        resultText:
          "'别管。' 你说。'他们内讧不内讧——跟我们没关系。我们打我们的。'\n\n" +
          "你没针对 {rival_team} 的内讧做任何调整。因为——如果你们开始算计对手的内乱，自己也会分心。\n\n" +
          "比赛里——{rival_team} 确实配合生疏了。但你没占到太大便宜——因为你的队伍也没超常发挥。只是——正常打。",
        effect: { discipline: 4, tactics: 2, morale: 2, cohesion: 2 },
      },
      {
        label: "针对他们配合生疏的位置打",
        resultText:
          "你分析了视频——吵架的是他们的指挥和明星选手。这意味着——他们的指挥和明星之间，补枪和走位会出问题。\n\n" +
          "你让队伍重点打他们两人之间的连接区域。\n\n" +
          "比赛里——果然。{rival_team} 的指挥叫了战术，但明星选手没跟。补枪慢了。你利用了这个裂痕。",
        effect: { tactics: 5, firepower: 3, tactical_control: 4, momentum: 3 },
      },
      {
        label: "心理战：赛前放话'我们已经准备好对付他们了'",
        resultText:
          "你让队长在赛前采访里说了一句：'我们对 {rival_team} 做了充分准备。不管他们状态如何，我们都有应对方案。'\n\n" +
          "这句话——{rival_team} 的人听到了。他们本来就在内讧——现在更慌了。'他们是不是知道我们吵架了？他们是不是有针对性战术？'\n\n" +
          "心理战。有时候一句话比十个战术管用。",
        effect: { morale: 3, momentum: 3, tactical_control: 3, discipline: -1, tactics: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["opponent", "tactics", "morale", "tactical_control"],
  },
  {
    id: "opponent_travel_fatigue",
    category: "out_of_match",
    timing: ["before_match"],
    title: "对手旅途劳顿",
    narrative:
      "{rival_team} 的航班延误了八个小时。他们凌晨三点才到酒店，今天上午就要打比赛。\n\n" +
      "旅途劳顿会影响反应速度、判断力、和心态。但——职业选手都经历过这种事。也许他们能扛住。也许不能。",
    triggerRequirements: ["对手近期经历长途旅行/航班延误", "概率触发"],
    choices: [
      {
        label: "打快节奏——趁他们没醒",
        resultText:
          "你让队伍打快节奏。{rival_team} 的选手确实——眼神还没完全清醒。\n\n" +
          "前两个回合——{rival_team} 的反应明显慢了。{player} 的首杀来得比平时快。\n\n" +
          "但第三个回合——{rival_team} 开始醒了。快节奏的优势在缩小。你赢在了前两局。",
        effect: { firepower: 4, momentum: 4, tactics: 2, tactical_control: 2 },
      },
      {
        label: "打消耗战——拖到加时，他们体力撑不住",
        resultText:
          "你让队伍打慢节奏——控图、拖延、不打快。把每个回合拖到最后十秒。\n\n" +
          "{rival_team} 的体力本来就不够——慢节奏让他们更累。到了第三局——{rival_team} 的选手开始频繁揉眼睛、打哈欠。\n\n" +
          "消耗战。赢在体力。",
        effect: { discipline: 4, tactics: 3, condition: 2, momentum: 2, firepower: -1 },
      },
      {
        label: "正常打——别因为对手疲劳就改自己的节奏",
        resultText:
          "'别改。正常打。' 你说。'因为对手疲劳就改节奏——万一他们没你想的那么累，你反而自乱阵脚。'\n\n" +
          "正常打。{rival_team} 确实有些疲劳——但职业选手的底线在那里。他们没崩。\n\n" +
          "你赢了——但赢得不轻松。因为没利用对手的弱点。",
        effect: { tactics: 2, discipline: 3, cohesion: 2, morale: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: false,
    tags: ["opponent", "firepower", "tactics", "momentum"],
  },
  {
    id: "opponent_star_in_form",
    category: "out_of_match",
    timing: ["before_match"],
    title: "对手明星爆发",
    narrative:
      "情报组报告：{rival_team} 的 {opponent} 最近三场训练赛 KD 是 1.8。他状态爆棚——预瞄准了，反应快了，残局也赢了三个。\n\n" +
      "他的手感来了。这种状态——挡不住。你只能想办法——绕开他，或者打断他。",
    triggerRequirements: ["对手存在 firepower >= 88 的选手", "该选手近期状态极佳", "概率触发"],
    choices: [
      {
        label: "绕开他——打他不在的位置",
        resultText:
          "你让队伍避开 {opponent} 所在的区域。他在 B——你们打 A。他在中路——你们走侧路。\n\n" +
          "前两个回合有效——{opponent} 拿不到首杀，{rival_team} 的进攻火力分散了。\n\n" +
          "但第三个回合——{opponent} 开始游走，主动来找你们。绕不开了。",
        effect: { tactics: 4, tactical_control: 3, firepower: 1, discipline: 2, momentum: 2 },
      },
      {
        label: "针对他——五个人集火他一个",
        resultText:
          "你让队伍每次进攻都优先找 {opponent}。五个人集火——就算他状态爆棚，也扛不住五把枪。\n\n" +
          "第一回合——{opponent} 被集火收了。但 {rival_team} 的其他人趁机包了你们的后路。\n\n" +
          "针对有效——但代价是其他人没人管了。",
        effect: { firepower: 3, tactics: -2, discipline: -1, momentum: 1, cohesion: -1 },
      },
      {
        label: "派你的明星去跟他单挑——以毒攻毒",
        resultText:
          "你让 {star_player_name} 去跟 {opponent} 对位。明星对明星。\n\n" +
          "{star_player_name} 的眼睛亮了——'教练，你是说让我去杀他？'\n\n" +
          "'对。' 你说。'他状态好——你也不差。去。'\n\n" +
          "第一回合——{star_player_name} 赢了。{opponent} 倒地的时候，{star_player_name} 站起来对着隔音棚比了个手势。气势翻转了。",
        effect: { firepower: 5, morale: 4, momentum: 5, discipline: -2, cohesion: 2, tactical_control: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["opponent", "tactics", "firepower", "momentum"],
  },
];

outOfMatchEvents.push(...opponentEvents);

// ──────────────────────────────────────────────
// 转会新成员入队事件——新选手加入队伍时触发
// ──────────────────────────────────────────────

const transferArrivalEvents: GameEvent[] = [
  {
    id: "transfer_arrival_star",
    category: "out_of_match",
    timing: ["between_cups", "campaign_start"],
    title: "新成员到位",
    narrative:
      "转会窗口关闭前最后一小时，你完成了那笔签约。\n\n" +
      "{new_player_name}——{new_player_team}的前主力，{new_player_trait}的代名词。他的行李箱今天下午到了基地——一个黑色的硬壳箱，贴满了历届赛事的行李标签。他站在训练室门口，背包带攥得发白。\n\n" +
      "你的五个人——不，现在是六个——在训练室里。老队员在打量他，像在评估一块新零件能不能用。{new_player_name} 看到了那些眼神。\n\n" +
      "他深吸一口气，走了进来。'大家好。' 他的声音有点紧——不是怯，是那种'我知道你们在评估我'的自觉。'我叫 {new_player_name}。请多关照。'",
    triggerRequirements: ["转会窗口签入新选手", "新选手 firepower >= 85"],
    choices: [
      {
        label: "'欢迎。这是你的位置。'——直接让他融入训练",
        resultText:
          "你指了指训练室里空着的那张桌子。'这是你的位置。桌上的显示器调过了，DPI 按你的习惯。'\n\n" +
          "{new_player_name} 愣了一下——你没问他 DPI 是多少。但你提前问了分析师。\n\n" +
          "他坐下。戴上耳机。打开游戏。鼠标在垫子上滑了两下——'谢谢教练。手感对了。'\n\n" +
          "第一天的训练赛，他没打核心位——你让他打自由人，先熟悉队伍的沟通节奏。他打得拘谨，但你看到——他在听。每一个报点，每一个走位，他都在记。\n\n" +
          "融入需要时间。但第一步——迈出去了。",
        effect: { cohesion: 3, morale: 3, tactics: 2, discipline: 2, firepower: 1, condition: 1 },
      },
      {
        label: "开个简短的欢迎会——让所有人自我介绍",
        resultText:
          "你没直接让他训练。你让六个人围坐在一起。\n\n" +
          "'自我介绍。从队长开始。'\n\n" +
          "队长说了名字、位置、打了几年。{veteran_name} 说了他的角色——'我负责架枪和骂人'，全场笑了。{star_player_name} 说了他的位置，然后补了一句：'别抢我的首杀。'\n\n" +
          "轮到 {new_player_name}。他站起来——'我叫 {new_player_name}。之前在 {new_player_team}。我打 {new_player_role}。我……' 他停了一下，'我想赢。这是我来这里的原因。'\n\n" +
          "气氛松了。{veteran_name} 拍了拍他的肩：'想赢就行。其他的我们教你。'",
        effect: { cohesion: 5, morale: 4, condition: 2, discipline: 1, tactics: 1 },
      },
      {
        label: "'先别训练。跟 {veteran_name} 聊聊，了解我们的体系'",
        resultText:
          "你没让 {new_player_name} 直接上场。你把他交给了 {veteran_name}。\n\n" +
          "'带他看我们过去十场的录像。讲我们的体系——为什么这么叫，为什么这么走。'\n\n" +
          "{veteran_name} 带 {new_player_name} 去了小会议室。两个小时。你在训练室里听到了 {veteran_name} 的声音——'这个回合我们打默认是因为……' '这个走位是为了给 {star_player_name} 创造空间……'\n\n" +
          "两个小时后，{new_player_name} 回来。他的眼神不一样了——不是紧张了，是'我知道你们怎么回事了'的清晰。\n\n" +
          "'教练，我准备好了。'\n\n" +
          "体系理解比枪法更重要。他先懂了脑子——手会跟上。",
        effect: { tactics: 5, cohesion: 4, discipline: 3, morale: 2, firepower: -1, tactical_control: 2 },
      },
      {
        label: "'今天不练。休息。明天再说。'",
        resultText:
          "你没让任何人训练。\n\n" +
          "'今天休息。{new_player_name} 刚到——让他安顿下来。明天开始。'\n\n" +
          "{new_player_name} 有点意外——他以为第一天就要证明自己。但你看到了他眼圈的黑——转会谈判拖了一周，他没睡好。\n\n" +
          "'去收拾你的房间。' 你说。'基地的 WiFi 密码在桌上。食堂六点开饭。'\n\n" +
          "他走了。你看着他的背影——有点愣，有点感激。\n\n" +
          "第二天——他比所有人都早到了训练室。精神好了。眼神清了。'教练，我准备好了。'\n\n" +
          "有时候最好的融入——是先让人喘口气。",
        effect: { condition: 5, morale: 4, cohesion: 2, discipline: 1, tactics: -1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["transfer", "new_player", "cohesion", "tactics", "morale"],
  },
  {
    id: "transfer_arrival_rookie",
    category: "out_of_match",
    timing: ["between_cups", "campaign_start"],
    title: "青训小将来了",
    narrative:
      "他从青训队上来了。\n\n" +
      "{new_player_name}——十九岁，二线联赛打出来的数据漂亮，但这是他第一次进一线队。他站在基地门口，背包带攥得发白，连门铃都不敢按。\n\n" +
      "你开门的时候，他差点敬了个礼——然后改成鞠躬——然后改成握手。最后三个动作做了一半，僵在那里。\n\n" +
      "'教……教练好。我是 {new_player_name}。'\n\n" +
      "他的声音在抖。不是冷——是那种'我等这一天等了三年'的抖。",
    triggerRequirements: ["签入年龄 <= 21 的新选手", "新选手来自青训/二线"],
    choices: [
      {
        label: "'别紧张。进来。你的房间在二楼。'",
        resultText:
          "你没给他压力。你只是——让他进来。\n\n" +
          "'房间在二楼。室友是 {rookie_name}——他也是去年来的，知道新人的感受。'\n\n" +
          "{new_player_name} 搬着行李上楼的时候，{rookie_name} 从房间里探出头：'新来的？我 {rookie_name}。WiFi 密码是训练室白板上那个。食堂六点开饭，别迟到——{veteran_name} 会骂人。'\n\n" +
          "两个新人很快聊了起来——他们有共同语言：都是第一次进一线队，都紧张，都不知道该干嘛。\n\n" +
          "你让两个新人住一起——是有意的。{rookie_name} 去年经历的，{new_player_name} 今年在经历。传承不需要老将——同龄人之间也在传。",
        effect: { cohesion: 5, morale: 4, condition: 3, discipline: 1, tactics: 1 },
      },
      {
        label: "'第一天就训练。别让他多想。'",
        resultText:
          "你没给他喘息的时间。\n\n" +
          "'放下行李，训练室，十分钟后。'\n\n" +
          "{new_player_name} 愣了一下——'现在？'\n\n" +
          "'现在。' 你说。'你想多了会更紧张。动起来就不紧张了。'\n\n" +
          "十分钟后他坐在了训练室里。手在抖——但鼠标一握上，抖就停了。这是他的领域。不管换了几支队伍——鼠标一握上，他就是 {new_player_name}。\n\n" +
          "第一场训练赛他打得拘谨。但有一个回合——他打出了他的标志性操作。{star_player_name} 看了回放，点了下头。\n\n" +
          "那个点头比任何欢迎辞都管用。",
        effect: { firepower: 3, discipline: 3, tactics: 2, morale: 2, condition: -1, cohesion: 2 },
      },
      {
        label: "让队长带他——'你是他的导师'",
        resultText:
          "你把 {new_player_name} 交给了队长。\n\n" +
          "'他是你的。未来一个月——你带他。吃饭、训练、复盘、睡觉——你管。'\n\n" +
          "队长有点意外：'我？我不是教练——'\n\n" +
          "'你比教练管用。' 你说。'他是新人，他需要的不是战术课——是一个能告诉他“这里该怎么走”“那个报点是什么意思”的人。你是队长。这是你的活。'\n\n" +
          "队长点头。然后走到 {new_player_name} 面前：'走吧。我先带你认认基地。'\n\n" +
          "一个月后——他们的配合成了全队最默契的一组。因为那一个月，他们形影不离。",
        effect: { cohesion: 6, tactics: 3, morale: 3, discipline: 2, firepower: 1, condition: 1 },
      },
      {
        label: "'先看我们最近五场比赛的录像。了解我们在干什么。'",
        resultText:
          "你没让他碰鼠标。\n\n" +
          "'先看录像。五场。看完了跟我说——你看到了什么。'\n\n" +
          "{new_player_name} 在小会议室看了四个小时。出来的时候，手里拿着三页笔记。\n\n" +
          "'教练，你们的默认控图跟我之前在 {new_player_team} 不一样——你们的第二回合转点更早。还有，{star_player_name} 的突破习惯是——'\n\n" +
          "你点头。他看到的比你预期的多。这孩子——有脑子。\n\n" +
          "'好。' 你说。'明天训练赛，你打 {new_player_role}。把你看到的用上。'",
        effect: { tactics: 5, discipline: 4, cohesion: 2, morale: 2, firepower: 1, tactical_control: 2 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["transfer", "new_player", "rookie", "cohesion", "tactics"],
  },
  {
    id: "transfer_arrival_veteran",
    category: "out_of_match",
    timing: ["between_cups", "campaign_start"],
    title: "老将加盟",
    narrative:
      "他来了。\n\n" +
      "{new_player_name}——打了十年职业，拿过两个 Major 亚军，进过四次全明星。他三十一岁了。在这个圈子里——三十一岁是化石。\n\n" +
      "他没带多少行李——一个背包，一台笔记本电脑，一个已经磨得发亮的鼠标。他站在训练室门口，背挺得很直。但你看得到——他的右膝有旧伤，站久了会微微偏重心。\n\n" +
      "'教练。' 他点头。不卑不亢。'我来这里不是为了养老。我来——是想拿一个冠军。'",
    triggerRequirements: ["签入年龄 >= 29 的老将", "该选手有过大赛经验"],
    choices: [
      {
        label: "'你的经验比你的枪更值钱。当助理教练兼选手。'",
        resultText:
          "你没把他当普通选手用。\n\n" +
          "'你的活有两个。第一——训练赛上场，打你的位置。第二——帮我看 demo，分析对手。你打了十年——你的眼睛比任何分析师都准。'\n\n" +
          "{new_player_name} 笑了——这是他来之后第一次笑。'教练，你是第一个不让我证明自己还能打的人。'\n\n" +
          "'你能不能打——我知道。' 你说。'但你的脑子比你的枪更值钱。我不想浪费。'\n\n" +
          "他成了队伍的半个教练。训练赛上场——数据不差。复盘会主讲——比你还细。{rookie_name} 说：'{new_player_name} 哥说的一个细节，我练了三天才明白。'",
        effect: { tactics: 6, discipline: 4, cohesion: 3, morale: 3, firepower: -1, tactical_control: 4 },
      },
      {
        label: "'你还是选手。打首发。别把自己当老的。'",
        resultText:
          "你没给他特殊待遇。\n\n" +
          "'首发。打你的位置。跟所有人一样——训练、比赛、复盘。别把自己当老的，也别把年轻队员当小孩。'\n\n" +
          "{new_player_name} 点头——但他眼里闪过一丝意外。他以为你会让他带新人、当顾问。你让他当选手。\n\n" +
          "第一场训练赛——他打了首发。数据不算亮眼——但零失误。十年经验带来的稳定性，不是天赋能替代的。\n\n" +
          "{star_player_name} 赛后说：'跟他打配合很舒服。他知道我什么时候要补枪——不用我报。'",
        effect: { firepower: 2, tactics: 3, discipline: 4, cohesion: 4, morale: 3, condition: -1 },
      },
      {
        label: "'你的第一个任务——带 {rookie_name}。你是他的导师。'",
        resultText:
          "你没先让他训练。你先给了他一个任务。\n\n" +
          "'{rookie_name}——我们的新人。十九岁。有天赋但没经验。你的活——带他一个月。'\n\n" +
          "{new_player_name} 看了看正在角落里揉手腕的 {rookie_name}。'我？我都不知道自己还能打多久——'\n\n" +
          "'正因为如此。' 你说。'你的经验不传下去——就浪费了。带他。把你十年学到的东西——给他。'\n\n" +
          "他看着 {rookie_name}——像是看到了十年前的自己。'……好。'\n\n" +
          "一个月后——{rookie_name} 的走位变了。不是 {new_player_name} 教了什么新东西——是 {new_player_name} 告诉了他'什么情况下该怎么选'。经验。这不是训练能练出来的。",
        effect: { cohesion: 5, tactics: 4, morale: 4, discipline: 2, firepower: 1, condition: 1 },
      },
      {
        label: "'先休息。你的膝盖——先治好。'",
        resultText:
          "你没让他上场。\n\n" +
          "'你的右膝。' 你说。'我看过你的比赛录像——你站久了会偏重心。'\n\n" +
          "{new_player_name} 愣了——他没告诉任何人他的膝伤。\n\n" +
          "'先治。' 你说。'队医已经安排了康复计划。两周。两周后你回来——不是当选手，是当能打满一场比赛的选手。'\n\n" +
          "他沉默了很久。然后说：'教练……谢谢你。'\n\n" +
          "两周后他回来了。膝不疼了。但更重要的是——他知道你在乎他这个人，不只是他的数据。",
        effect: { condition: 6, morale: 5, cohesion: 4, discipline: 2, firepower: -1, tactics: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["transfer", "new_player", "veteran", "aging", "tactics", "cohesion"],
  },
  {
    id: "transfer_arrival_replacement",
    category: "out_of_match",
    timing: ["between_cups"],
    title: "替代者",
    narrative:
      "{old_player_name} 走了——转会或者被换。不管原因——他不在了。\n\n" +
      "{new_player_name} 是来替代他的。新面孔，新风格，新口头禅。训练室里那张桌子换了主人——{old_player_name} 的水杯还在，{new_player_name} 的背包已经放在了椅子上。\n\n" +
      "老队员没说什么。但你看得到——他们在比较。每一个 {new_player_name} 的走位，他们都会想：'{old_player_name} 会怎么做？'",
    triggerRequirements: ["队内有选手离队", "新选手作为替代者加入"],
    choices: [
      {
        label: "'别跟他比。{new_player_name} 不是 {old_player_name}。'",
        resultText:
          "你在队会上说了一句：'{new_player_name} 不是来替代 {old_player_name} 的。他是来打他自己的位置。别比较。'\n\n" +
          "{veteran_name} 点头——但他知道这不容易。习惯了一个人的报点、一个人的走位、一个人的补枪 timing——换了人，就是不一样。\n\n" +
          "'给时间。' 你说。'一个月。一个月后——你们会忘记 {old_player_name} 的走位习惯。因为 {new_player_name} 的习惯会变成新的习惯。'\n\n" +
          "一个月后——你没说错。磨合来了。{new_player_name} 不再是'{old_player_name} 的替代者'——他是 {new_player_name}。",
        effect: { cohesion: 4, morale: 3, tactics: 2, discipline: 2, condition: 1 },
      },
      {
        label: "'你打你的。别学 {old_player_name} 的套路。'",
        resultText:
          "你私下跟 {new_player_name} 说：'别学 {old_player_name} 的走位。你有你的风格。打你自己。'\n\n" +
          "{new_player_name} 有点犹豫：'但如果我跟他们配合不上——'\n\n" +
          "'配合是他们的事。你的事是——打出你的水平。他们适应你——比你适应他们快。因为你是五个人里的一个，他们是四个。'\n\n" +
          "他打了。打的是他自己的风格——不是 {old_player_name} 的复制品。前两周配合确实生疏。但第三周——他的风格开始跟队伍融合了。不是模仿——是融合。",
        effect: { firepower: 3, cohesion: 2, morale: 3, tactics: 1, discipline: 1, condition: 1 },
      },
      {
        label: "让老队员跟 {new_player_name} 一起复盘 {old_player_name} 的录像",
        resultText:
          "你让 {veteran_name} 和 {new_player_name} 一起看了 {old_player_name} 过去十场的录像。\n\n" +
          "不是为了模仿——是为了理解。'{old_player_name} 为什么这个回合走这里？因为他知道 {star_player_name} 需要这个空间。你不需要走一样的路——但你需要知道为什么。'\n\n" +
          "{new_player_name} 看了两个小时。出来之后他说：'我懂了。不是学他的走位——是学他怎么读队友。'\n\n" +
          "理解比模仿更值钱。",
        effect: { tactics: 5, cohesion: 4, discipline: 3, morale: 2, firepower: 1 },
      },
      {
        label: "什么都不说——让他们自己磨合",
        resultText:
          "你没干预。\n\n" +
          "{new_player_name} 在训练赛里跟队伍配合生疏——报点 timing 不对，补枪慢了，走位重叠。老队员有点不耐烦——但没说出来。\n\n" +
          "你站在后面。看。\n\n" +
          "有些磨合——需要自己撞。你叫了暂停、说了话——他们听你的。但真正的默契——是在没人的角落里，两个人对了一个眼神就知道对方要干嘛的那种。\n\n" +
          "两周后——{new_player_name} 和 {star_player_name} 在训练赛里完成了一个无报点的双人配合。{star_player_name} 走了一步，{new_player_name} 就知道该补哪里。没说话。就是知道了。\n\n" +
          "你站在后面。笑了。",
        effect: { cohesion: 5, tactics: 1, morale: 2, discipline: -1, firepower: 1 },
      },
    ],
    canRemoveControl: false,
    chronicleWorthy: true,
    tags: ["transfer", "new_player", "replacement", "cohesion", "tactics"],
  },
];

outOfMatchEvents.push(...transferArrivalEvents);

// ──────────────────────────────────────────────
// 导出
// ──────────────────────────────────────────────

export const inMatchEventLibrary: GameEvent[] = inMatchEvents;
export const outOfMatchEventLibrary: GameEvent[] = outOfMatchEvents;

export const allEvents: GameEvent[] = [...inMatchEvents, ...outOfMatchEvents];

/** 按时机筛选可用事件 */
export function getEventsByTiming(timing: EventTiming): GameEvent[] {
  return allEvents.filter((e) => e.timing.includes(timing));
}

/** 按类别筛选 */
export function getEventsByCategory(category: EventCategory): GameEvent[] {
  return allEvents.filter((e) => e.category === category);
}

/** 按标签筛选 */
export function getEventsByTag(tag: string): GameEvent[] {
  return allEvents.filter((e) => e.tags.includes(tag));
}

/** 根据 id 获取 */
export function getEventById(id: string): GameEvent | undefined {
  return allEvents.find((e) => e.id === id);
}
