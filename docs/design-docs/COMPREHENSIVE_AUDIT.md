# CS Cup Manager — 全面审计报告 v2.0

> **审计人**: GameDesigner（游戏设计师）
> **审计日期**: 2026-06-26
> **审计范围**: 全部源代码（`src/` 下 23 个文件）、全部设计文档（`docs/` 下 31 个文件）、全部内容文件、UI 实现状态
> **语气警告**: 尖酸刻薄，不留情面。如果你想要温和的建议，看 `DESIGN_DIAGNOSIS.md`。如果你想知道你的游戏到底烂在哪里——往下读。

---

## 零、开场暴击

**你的游戏有一个三体问题。**

设计文档活在宇宙 A：精致的策略矩阵、动态化学反应、阵营不对称决策、回合经济状态机、教练哲学树、赛前侦察系统——527 行 `mechanic-events.ts`、827 行 `scout-briefings.ts`、两份规范文档加起来 1400+ 行。

UI 活在宇宙 B：四屏硬编码 demo，包含一个 183 行的 `createDemoState()` 函数，里面的 `match.events` 是手写的 4 条假数据。比赛底部三个按钮 `全买/半买/省钱` 是 HTML 字符串写死在 `renderMatchRoom()` 里。

比赛引擎活在宇宙 C：`resolveMatch()` 是一个 48 行的加权掷骰子函数，永远输出 `"${teamA.name} 选择全起默认架枪"` 这行文本，无论队伍叫 Navi 还是 MongolZ，无论经济是 $800 还是 $16,000，无论阵营是 T 还是 CT。

**三个宇宙之间没有任何通信协议。**

---

## 一、致命问题（P0）—— 游戏不可玩

### P0-1: 比赛引擎是一个纸板立牌

**文件**: `src/simulation/cup.ts` 第 74-123 行

```typescript
function resolveMatch(teamA, teamB, seed, round, detailed) {
  // 第一行永远是:
  eventCards.push({
    title: "开局部署",
    text: `${teamA.name} 选择全起默认架枪，${teamB.name} 用慢控试探。`,
    //             ^^^^ 不管经济，不管阵营，永远是这行
  });

  while (scoreA < 3 && scoreB < 3 && roundNumber <= 5) {
    const aPower = teamPower(teamA) + (scoreA >= 2 ? 3 : 0) + rng.int(-9, 9);
    const bPower = teamPower(teamB) + (scoreB >= 2 ? 3 : 0) + rng.int(-9, 9);
    //                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //                            这就是全部逻辑。没有策略碰撞。没有特质。
    //                            没有经济。没有阵营。
  }
}
```

**刻薄总结**: 你可以在 `resolveMatch` 的 `eventCards.push` 前面写一万行事件定义、一万行侦察逻辑、一万行道具系统——它不在乎。它只在乎三件事：`teamPower`、`rng.int(-9, 9)`、以及那行永远不变的硬编码文本。你写的 1000 行 `mechanic-events.ts` 在这个函数眼里，和 1000 行空白行没有区别。

### P0-2: `createDemoState()` 是游戏的"引擎"——引擎输出是人工写的

**文件**: `src/ui/csCupManagerUi.ts` 第 82-183 行

```typescript
export function createDemoState(): DemoState {
  return {
    match: {
      score: [1, 2],        // 人工写的比分
      round: 4,              // 人工写的回合数
      events: [
        event("e1", "ROUND 1 · OPENING", "neutral", "你选择半买后慢控中路..."),
        event("e2", "ROUND 2 · PRESSURE", "negative", "donk 连续抢下首杀..."),
        // ↑ 四条假数据
      ],
    },
  };
}
```

**刻薄总结**: 你的 UI 显示的比赛结果和 `src/simulation/` 目录下那 5 个文件没有半毛钱关系。`runCup()` 跑出的 `CupResult` 包含真实的比分和事件——但 UI 根本不读它。UI 读的是设计师凌晨三点手敲的 demo JSON。这就是为什么截屏里永远显示 `1-2 枪神 vs Spirit`——因为那是写死在 `createDemoState()` 里的，和引擎无关。

### P0-3: 比赛底部的三个按钮与 `DECISION_OPTIONS_SPEC.md` 的 25+ 选项没有任何联系

**文件**: `src/ui/csCupManagerUi.ts` 第 325-328 行

```html
<button>全买 / FULL BUY<span>装备质量 +8</span></button>
<button>半买 / PARTIAL BUY<span>保留经济</span></button>
<button>省钱 / ECO<span>下局资金 +10</span></button>
```

**刻薄总结**: 你花了整个下午让我写了 `DECISION_OPTIONS_SPEC.md`——一份 456 行的文档，定义了 7 种 T 方战术、6 种 CT 方战术、5 种手枪局选项、4 种下包后选项、3 种残局分支、经济锁矩阵、属性指示器。然后你的 UI 代码里还是三个硬编码 HTML 按钮，上面写着 `全买/半买/省钱`。这三个按钮对 T 方和 CT 方显示一模一样。第一局手枪局？也是这三个。ECO 局？也是这三个。残局？也是这三个。

你知道这叫什么吗？**文档驱动开发的反面——文档欺骗开发。** 文档写了一份精美的规范，代码活在另一个宇宙。

### P0-4: 不存在模板变量替换系统

**证据**:

`mechanic-events.ts` 第 98 行:
```
"{rookie_name}说怕让队友失望。{star_player_name}说怕手感突然消失。{veteran_name}说怕身体撑不住。"
```

`scout-briefings.ts` 第 172 行:
```
"{rival_team} 的指挥在采访里说过一句话：'我不需要告诉 {key_player_name} 怎么打。'"
```

**刻薄总结**: 整个事件文本系统中散落着 `{star_player_name}`, `{rookie_name}`, `{veteran_name}`, `{rival_team}`, `{key_player_name}`, `{opponent}`, `{player}`, `{rival_igl}` 等至少 12 种模板变量。代码里没有任何 `resolveTemplateVars()` 函数。没有任何 `fillNarrativeSlots()`。没有任何 `${}` 以外的替换逻辑。

这意味着——当这些事件被真正显示给玩家时，玩家会看到**字面量** `{star_player_name}`。不是 donk。不是 ZywOo。是 `{star_player_name}` 这 17 个字符。

这相当于你开了一家餐厅，菜单上写着 `{signature_dish}`，然后端上来的盘子里真的放着 15 个 ASCII 字符。

---

## 二、严重问题（P1）—— 核心系统缺失或虚假

### P1-1: 特质效果被稀释到毫无感知

**文件**: `src/domain/roster.ts` 第 116-123 行

```typescript
for (const player of starters) {
  for (const trait of player.traits) {
    const definition = traitDefinitions[trait];
    traitCohesionDelta += definition.modifiers.cohesion ?? 0;
    traitTacticsDelta += definition.modifiers.tactics ?? 0;
    traitDisciplineDelta += definition.modifiers.discipline ?? 0;
  }
}

// 然后:
cohesion: clampStat(personalityBalance + familiarityBonus + traitCohesionDelta / starters.length),
//                                                                     ^^^^^^^^^^^^^^^^
//                                                                     除以 5
```

**刻薄总结**: donk 的 `hot_blooded` 特质让全队 discipline -4。除以 5 = -0.8。而 `discipline` 的范围是 1-100。这意味着 donk 的"火爆脾气"对全队纪律的影响是 **0.8%**。GDD 说特质应该产生 ±3-8 的显著影响。代码把它变成了统计学噪声。

更致命的是——`deriveTeamStats()` 只在 `createRoster()` 时调用一次。比赛进行了 5 局，donk 连续 3 局上头，全队的 discipline 应该是动态下降的。但在当前代码中，discipline 是一个建队时就定死的静态数字，比 donk 的脾气还稳定。

### P1-2: 三年生涯是跑同一个模拟 9 次

**文件**: `src/simulation/season.ts` 第 208-248 行

```typescript
export function runCareer(input: RunCareerInput): CareerRun {
  for (let seasonIndex = 1; seasonIndex <= 3; seasonIndex += 1) {
    const seasonCupRuns = cups.map((cup, cupIndex) => ({
      result: runCup({
        cup,
        playerTeam: input.playerTeam,   // ← 同一个 playerTeam
        aiTeams: input.aiTeams,          // ← 同一个 aiTeams（没有转会！）
        seed: input.seed + seasonIndex * 100 + cupIndex * 17,
      }),
    }));
  }
}
```

**刻薄总结**: 你的"三个赛季"之间的区别只有一个东西——随机种子。第一赛季的 Navi 和第二赛季的 Navi 是完全一样的人、一样的数据、一样的阵容。没有任何转会（尽管 `mechanic-events.ts` 写了 47 行转会竞价事件），没有任何球员成长（尽管写了 84 行赛季末成长事件），没有任何队伍重建。

三年生涯 ≈ 把 `runCup` 跑了 9 次，然后包装成"三个赛季"。这就像你租了三部《变形金刚》DVD，跟我说你举办了一个电影节。

### P1-3: 替补是纯粹的装饰品

**文件**: `src/domain/roster.ts` 第 146 行

```typescript
const starters = players.filter((player) => player.id !== input.substituteId);
```

然后 `deriveTeamStats()` 只读 `starters`（5 人）。替补的 `firepower`, `tactics`, `clutch` 等属性**从未进入任何计算**。

`mechanic-events.ts` 第 731-737 行有一个"换替补——他今天不行"的选项。但这个事件**从未被 `cup.ts` 调用**。就算被调用了——换了替补之后 `TeamStats` 不会重新计算。队伍的四维数值还是原来 5 个先发的。

**刻薄总结**: 替补占了你 6 个 roster slot 中的一个，花了你预算，占用了你宝贵的 `selectedIds` 数组空间——然后他跟 `TeamStats` 半毛钱关系都没有。你花了 $7-15M 买了一个 UI 装饰品。

### P1-4: 赛前侦察系统有三套独立的代码——没有入口函数

`scout-briefings.ts` 定义了 6 个类型（`OpponentStyle`, `ScoutBriefing`, `FullScoutCard` 等）和完整的生成上下文。
`mechanic-events.ts` 定义了 `scoutingEvents` 数组（2 个硬编码事件）。`events.ts` 没有定义赛前事件。

**三个文件之间没有 `generateScoutCard()` 这样的入口函数。**

**刻薄总结**: 你想做赛前侦察？太好了。首先你得从三大候选文件里挑一个——就像《电锯惊魂》的受害者挑刑具。挑完之后你会发现——哪个都没有 `generate()` 函数。827 行类型定义，0 行实际生成逻辑。

### P1-5: 队伍四维不分 T/CT

**文件**: `src/domain/roster.ts` 第 27 行

```typescript
export interface TeamStats {
  firepower: number;
  tacticalExecution: number;
  cohesion: number;
  discipline: number;
}
```

**刻薄总结**: 你的项目里有两份文档（`CS_MECHANICS_REFERENCE.md` 和 `MECHANICS.md`）详细描述了 T 方和 CT 方在战术、节奏、经济压力上的不对称性。然后你给每支队伍一个四维数值——不管打 T 还是 CT 都一样。

Spirit 是一支以 donk 的疯狂 entry 闻名的队伍。他们在 T 方可能 firepower 95+，但在 CT 方（需要架枪纪律）可能只有 80+。这种不对称性在真实 CS 中是核心。在你当前的代码里——不存在。

---

## 三、中度问题（P2）—— 积累后崩溃

### P2-1: 三个评分函数三个公式

| 函数 | 文件 | 公式 |
|------|------|------|
| `bestPlayer()` | `cup.ts:66` | `firepower + clutch + tactics * 0.35` |
| `mvpForTeams()` | `cup.ts:130` | `firepower * 0.45 + clutch * 0.28 + tactics * 0.17 + championBonus + cohesion * 0.05` |
| `scorePlayer()` | `season.ts:68` | `firepower * 0.43 + clutch * 0.23 + tactics * 0.18 + discipline * 0.08 + cohesion * 0.04 + placement * 0.8 + mvp * 6` |

**刻薄总结**: 同一位选手在这三个函数里可能得到三个不同排名。`bestPlayer()` 认为 `discipline` 不重要（权重 0），`mvpForTeams()` 也认为不重要（权重 0），`scorePlayer()` 终于想起来纪律也是人的一部分（权重 0.08）。你们的选手评分系统不是一套标准——是三国演义，各自为政。

### P2-2: UI 事件系统与引擎事件系统使用不同的数据结构

**UI**: `MatchEvent` (csCupManagerUi.ts:29) — `{ id, label, tone, body, delta, choices?, result? }`
**引擎**: `MatchEventCard` (cup.ts:18) — `{ title, text, delta, decision? }`
**机制事件**: `GameEvent` (events.ts:66) — `{ id, category, timing, title, narrative, triggerRequirements, choices, canRemoveControl, chronicleWorthy, tags }`
**扩展事件**: `MechanicGameEvent` (mechanic-events.ts:47) — 在 GameEvent 上加了 `roundType?, philosophy?, cupId?, chemistryRule?, highRisk?`

**刻薄总结**: 四个文件，四个不同的"事件"类型定义。你给一个还没有事件系统的游戏设计了四个互不兼容的事件数据结构。这不是软件工程——这是数据结构博物馆。

### P2-3: 回合类型（roundType）只存在于数据标签上

`mechanic-events.ts` 定义了 5 种 `RoundType`（`opening | pressure | swing | adjustment | closing`），每个事件标注了自己属于哪种。但 `resolveMatch()` 没有判断当前是哪种回合。第 1 局？手枪局？还是 opening round？引擎不在乎。引擎只知道 `while (scoreA < 3 && scoreB < 3)`。

**刻薄总结**: 你花时间设计了 opening → pressure → swing → adjustment → closing 的五阶段回合模型，然后写了一个 while 循环说"管他什么阶段，掷骰子就完了"。这是你整个项目中设计最精美、实现最彻底的浪费。

### P2-4: 没有地图系统但叙事中频繁提到具体位置

`match-beats.ts` 和 `events.ts` 中充满了 "A 点"、"B 点"、"中路"、"香蕉道"、"二楼窗口"、"跳台"、"警家"——但没有一张地图的 ID，没有一个 `MapProfile`，没有任何 map 选择。CS 比赛地图是赛前就知道的——但游戏里没说在哪张图上打。

**刻薄总结**: 你在给玩家讲故事说"donk 从香蕉道摸到了 B 点后院"，但玩家根本不知道这张图是 Inferno 还是 Mirage。是 Dust2 吗？不知道。"香蕉道"这个词出现在没有地图系统的游戏里，就像你在法餐厅的菜单上看到了"老干妈"——突兀、不合时宜、暴露了底层的混乱。

---

## 四、细节问题（P3）—— 恶心人的东西

### P3-1: `opening_economy_choice` 的 narrative 文案说"第一回合全队满钱"

```
"比赛开始。冻结时间。你的队长在语音里问：'教练，这把怎么买？'\n\n
经济系统是 CS 的命脉。第一回合全队满钱——但这不代表一定要全买。"
```

**问题**: $800 叫"满钱"？$16,000 的上限被无视了。第一局 $800 是 CS 里最穷的时刻——不是"满钱"。

### P3-2: 教练哲学事件里 `{rookie_name}` 出现在还没选阵容的语境中

`philosophyChoiceEvents[0]`（`mechanic-events.ts` 第 70 行）是"赛季开始"事件——此时玩家还没选阵容。但叙事中出现了 `{rookie_name}`、`{star_player_name}`、`{veteran_name}`。

**问题**: 你怎么知道谁是新人谁是明星？你还没组队呢。你想用模板变量替换——但上下文还没建立。

### P3-3: `highRiskDramaEvents` 的"心态崩了"事件说"换替补"

`mechanic-events.ts` 第 731-737 行:

```typescript
{
  label: "换替补——他今天不行",
  resultText: "你把{star_player_name}换下来了。'你今天休息。替补上。'\n\n...",
  effect: { firepower: -3, morale: -2, discipline: 4, cohesion: -2, condition: 2, tactical_control: 1 },
}
```

**问题**: 你把 `firepower` -3——但替补的 `firepower` 根本没参与计算。减了谁？减的是空气。`TeamStats.firepower` 是 5 个先发的平均值——换上一个数据未知的替补，firepower 应该重新计算，不是盲目 -3。

### P3-4: 选秀系统允许 ZywOo + donk + m0NESY + NiKo + 最便宜 filler

**验证**: ZywOo(24) + donk(24) + m0NESY(23) + NiKo(23) = 94。剩下 $6 预算给 2 个位置 → 需要 2 个 $7 filler。但总预算 100，94 + 7 + 7 = 108。超了。所以需要换成：ZywOo(24) + donk(24) + m0NESY(23) + ropz(21) = 92。剩下 8，买两个 $7 filler = 14。92 + 14 = 106 → 超了。

实际上全明星组合的覆盖情况：ropz(21) + ZywOo(24) + donk(24) + KSCERATO(19) = 88。剩 12 → 一个 bLitz(12) + 一个 filler(7) = 107 → 超。所以最极端的全明星组合是：ZywOo(24) + donk(24) + ropz(21) + NiKo(23) = 92 → 剩 8 给 2 个位置，每个位置只能花 $4... filler 最低 $7。不行。

所以实际能买的最强阵容是：ZywOo(24) + donk(24) + m0NESY(23) + KSCERATO(19) = 90。剩 10 → 一个 $7 filler + 需要 $3 的选手 → 不存在。所以只能 4 星 + 2 filler。四星阵容理论可行。

**刻薄总结**: 算了，$100 预算下你确实买不到 5 个全明星——恭喜，你的预算系统在这个维度上居然工作了。但 4 个超级明星 + 2 个 filler 足够碾压任何 AI 队了。毕竟 AI 的 Team Power 来自 5 个先发的平均值，而你的 filler（firepower 61-71）会拉低平均值——等等，不对。如果你选了 4 个超级明星 + 2 filler，其中一个是替补。替补不进 teamStats。所以 filler 只有一个进了先发。ZywOo(98) + donk(99) + m0NESY(96) + KSCERATO(90) + filler(~64) 的平均 firepower = 89.4。嗯，确实很强但不是无敌。行吧，预算系统勉强及格。

### P3-5: `teamPower()` 使用浮点数但最终比较是整数 `rng.int()` 之间的比较

```typescript
const aPower = teamPower(teamA) + (scoreA >= 2 ? 3 : 0) + rng.int(-9, 9);
```

`teamPower()` 返回浮点数（如 73.84），`rng.int(-9, 9)` 返回整数。最终 `aPower` 是浮点数。但问题是——`teamPower()` 精度到小数点后两位，而随机部分是 ±9 的整数。随机项的振幅（18）可能超过两支实力相当的队伍的 `teamPower` 差值（通常 <10）。这意味着在实力相近的比赛中，随机因素完全淹没了数据差异。

**刻薄总结**: 你的策略碰撞表准备做 ±3~8 的修正，你的经济系统准备做 ±2~5 的修正——然后你把随机范围设为 ±9，振幅 18。这意味着你精心设计的所有修正加起来，可能还没有一次随机骰子的波动大。这就好比你花三小时搭配了一身衣服，然后出门下了一场随机暴雨。

---

## 五、文档与代码的一致性审计

| 文档承诺 | 代码文件 | 实际状态 |
|---------|---------|---------|
| 策略矩阵 5×4 碰撞 | `cup.ts:resolveMatch` | ❌ 硬编码单策略文本 |
| 手枪局强制 $800 | `cup.ts:resolveMatch` | ❌ 不追踪经济 |
| T/CT 阵营区分 | `cup.ts:resolveMatch` | ❌ 无阵营概念 |
| 回合经济状态机 | `cup.ts:resolveMatch` | ❌ while 循环 |
| 特质动态效果 | `cup.ts:resolveMatch` | ❌ 只在建队时静态计算 |
| 化学反应规则 | `cup.ts` / `roster.ts` | ❌ 仅平均化特质 |
| 暂停三选一 | `cup.ts` | ❌ 有事件定义但无调用 |
| 赛前侦察卡 | `scout-briefings.ts` | ❌ 有类型无生成函数 |
| 教练哲学 | `cup.ts` / `season.ts` | ❌ 有事件定义但未接入 |
| 士气状态机 | `cup.ts` | ❌ 无状态追踪 |
| DECISION_OPTIONS_SPEC | `csCupManagerUi.ts` | ❌ UI 写死 3 个按钮 |
| 模板变量替换 | — | ❌ 不存在替换函数 |
| 地图系统 | — | ❌ 不存在但叙事引用了 |
| 转会系统 | — | ❌ 有事件定义但三年跑同样队伍 |
| 球员成长/衰退 | — | ❌ 有事件定义但三年不变化 |
| 替补价值化 | `roster.ts` | ❌ 替补不进 TeamStats |
| UI 与引擎连接 | `csCupManagerUi.ts` | ❌ UI 读 DemoState 不读引擎 |

**新增通过率: 0/17。加上上次审计的 0/15 = 累计 0/32。**

---

## 六、修复优先级（如果不想让游戏成为文件夹里的尸体）

### 立即修复（P0 — 没有这些，游戏 = 不可玩状态）

1. **桥接 UI 与引擎**: 让 `renderMatchRoom()` 读取 `CupResult` 而不是 `DemoState`。DemoState 改为由引擎输出填充。
2. **桥接决策系统与 UI**: 底部三个按钮必须来自决策引擎（按阵营过滤、按经济过滤），不能是硬编码 HTML。
3. **实现模板变量替换**: 写一个 `fillTemplate(template, context)` 函数，匹配所有 `{variable_name}` 模式。
4. **修正 `resolveMatch()`**: 加入阵营概念、经济状态、至少接入策略碰撞表。
5. **强制手枪局**: 第 1 局永远是 $800。在 `resolveMatch` 中追踪双方累计金钱。

### 尽快修复（P1 — 有了 P0 才有意义修）

6. **特质效果实时化**: 不要在 `createRoster` 时一次性静态计算。比赛过程中动态追踪。
7. **赛前侦察系统的入口函数**: 写 `generateScoutCard(context)`。
8. **赛季间增加变动**: 转会、成长、阵容变化——哪怕是最小化版本。
9. **替补进入 TeamStats**: 当替补上场时重新计算。
10. **统一事件数据结构**: 四个事件类型太荒唐了，选一个。

### 计划修复（P2-P3）

11. 统一评分公式（选一套最好的）
12. 加入地图系统（哪怕只支持 3 张地图）
13. 实现五阶段回合模型
14. 实现暂停和教练哲学
15. 踢掉所有越界叙事

---

## 七、最后的话

这个游戏的 GDD 质量不低。策略矩阵是自洽的，化学反应规则是合理的，经济系统是对的。事件文本的文笔不错——虽然视角有问题。

问题在于：**设计和实现之间没有任何通信协议。**

你的 `mechanic-events.ts` 里有 1000 行精心设计的事件，你的 `scout-briefings.ts` 里有 827 行类型和叙事模板，你的 `DECISION_OPTIONS_SPEC.md` 里有 456 行决策规范——但 `cup.ts` 只有 218 行，其中比赛核心逻辑只有 48 行，这 48 行不读任何你设计的东西。

这不是"功能还没做"——这是**做了的功能跑的是另一个游戏**。你的 demo UI 是手工 JSON，你的比赛引擎是加权骰子，你的事件系统是未被调用的函数签名集合。

修这个不需要推翻重来。需要的是：**选一条端到端的数据流，让它从头跑到尾。** 从选阵容 → 生成比赛 → 引擎计算 → UI 渲染。把这一条线跑通，然后把所有设计好的系统一个一个接入这条线。

否则——你只是在给一个不存在的游戏写设计文档。而那些文档写得越好，就越像一份精美的墓志铭。

---

> **审计人附言**: 我对这个项目没有恶意——事实上我认为很多设计思路是正确的。但当一个游戏的三大子系统各自运行在不同宇宙里时，温和的建议没有用。你需要被踢一脚。这就是那一脚。
