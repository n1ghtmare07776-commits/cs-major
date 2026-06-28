# 三年模式锁定机制执行计划

> 目标：基于当前已存在的浏览器三年主流程与测试基线，把“锁定机制”从 `src/app/browser.js` 内的原型实现，收敛为可验证、可维护、可继续扩展的完整版三年模式执行顺序。  
> 本计划只描述主线程接下来应如何实施，不要求一次性重写整个项目。

## 当前代码基线

### 已经存在，必须保住

- `src/app/browser.js`
  - 已有 `3 seasons x 3 cups = 9 cups` 的完整状态机。
  - 已有 `draft -> bracket -> prematch -> match -> awards -> between-cups -> annual-awards -> chronicle` 主流程。
  - 已有单场玩家比赛的 `10-15` 张事件卡、约 `3-5` 张决策卡、KDA、阵亡灰化、暂停事件卡、年度总结、编年史。
  - 已有半数值经济 helper、开局重复读套路 helper、轻度 continuity helper，但这些逻辑仍主要留在 `browser.js`。
- `src/simulation/cup.ts`
  - 已有独立杯赛模拟入口 `runCup()`，但仍是轻量 power check，不包含锁定机制所需的经济/暂停/记忆/事件链。
- `src/simulation/season.ts`
  - 已有 `runCareer()`，能稳定跑完三年九杯、年度奖项、最终 chronicle。
  - 已明确写出“真实交易尚未接入”。
- 自动化测试已经覆盖：
  - `tests/app/browser-flow.test.mjs`：完整三年浏览器黄金路径。
  - `tests/app/mechanics-locks.test.mjs`：经济恢复、读套路压力、continuity bonus。
  - `tests/simulation/season.test.ts`：三年九杯、年度奖项、chronicle 的 deterministic 输出。

### 当前真正的缺口

- 锁定机制的“基础状态”已经在 `browser.js` 出现，但尚未下沉为 `src/simulation/*` 的主规则来源。
- `src/simulation/cup.ts` 与 `src/simulation/season.ts` 仍未承接经理决策链，因此浏览器模式和 simulation 层存在规则分叉风险。
- 每杯间最多一次交易尚未进入真实主路径，这是目前最明确的功能缺口。
- 年度/三年奖项虽已能产出，但仍偏展示层聚合，缺少与锁定机制一致的统一评分来源。

### 计划原则

- 不推倒当前 `browser.js` 主流程，先保住已通过的三年黄金路径。
- 先抽“规则来源”，再迁“UI 表现”；不要先做纯 UI 重排。
- P0 先补齐会影响胜负和三年闭环可信度的机制。
- P1 再做扩展、平衡和内容密度。

---

## P0-1：冻结现状并建立“锁定机制真实来源”清单

**目标**

- 主线程开始改动前，先把“现在到底有哪些机制已存在于代码里”写清楚，避免继续被过时文档误导。
- 给后续迁移建立唯一对照表：哪些逻辑保留、哪些迁到 simulation、哪些要删除旧实现。

**涉及文件**

- 修改：`docs/QA-locked-mechanics-acceptance.md`
- 修改：`docs/HANDOFF_PROGRESS.md`
- 参考：`src/app/browser.js`
- 参考：`tests/app/mechanics-locks.test.mjs`
- 参考：`tests/app/browser-flow.test.mjs`

**必须对齐的现状**

- 半数值经济：`describeEconomyPath()`、`createEconomyState()`、`settleEconomyRound()` 已存在。
- 中等战术反制：`summarizeReadPressure()`、`strategyMemory.recentOpenings` 已存在基础状态。
- 轻度长期默契成长：`continuityBonusForMatches()`、`lineupMatches` 已存在基础状态。
- 三年闭环、年度奖项、chronicle：浏览器态和 simulation 层都已有。
- 每杯间最多一次交易：仍未接入主路径。

**完成标准**

- `docs/QA-locked-mechanics-acceptance.md` 不再把已存在的 helper 误写为“完全未满足”。
- `docs/HANDOFF_PROGRESS.md` 的“下一阶段建议任务顺序”与本计划的 P0/P1 保持一致。
- 主线程能用这两份文档快速分辨“已有半成品”与“真正没做”。

**验证命令**

```sh
npm run check:docs
npm run gc
```

**验收标准**

- 文档中明确写出 7 条锁定机制分别属于：
  - 已有基础 helper / 状态
  - 已有 UI 壳但未下沉
  - 尚未接入主路径
- 不新增代码行为，仅更新事实描述与后续顺序。

---

## P0-2：把浏览器里的机制 helper 下沉到 simulation 层

**目标**

- 把现在散在 `src/app/browser.js` 里的经济、读套路、continuity 等规则抽到 `src/simulation/`。
- 让 UI 继续使用这些规则，但不再自己成为规则唯一来源。

**涉及文件**

- 新增：`src/simulation/match.ts`
- 修改：`src/simulation/index.ts`
- 修改：`src/app/browser.js`
- 修改：`tests/app/mechanics-locks.test.mjs`
- 新增或修改：`tests/simulation/match.test.ts`

**实施顺序**

1. 把以下纯规则函数迁到 `src/simulation/match.ts`：
   - `continuityBonusForMatches`
   - `describeEconomyPath`
   - `summarizeReadPressure`
   - 与其直接依赖的 economy tier / settle helper
2. 保持浏览器行为不变，由 `browser.js` 改为 import simulation helper。
3. 把测试重心从“浏览器文件导出工具函数”切到“simulation 层导出规则函数”。
4. 保留浏览器测试作为回归保护，避免迁移后主流程断掉。

**完成标准**

- 规则 helper 的唯一实现位于 `src/simulation/match.ts`。
- `browser.js` 只消费规则结果，不再保存重复实现。
- `tests/app/mechanics-locks.test.mjs` 可以部分迁移或改为 thin integration test。

**验证命令**

```sh
npm run test
npm run build
npm run test:architecture
```

**验收标准**

- 迁移后，以下测试仍通过：
  - 浏览器三年黄金路径
  - 经济恢复路径
  - 读套路压力
  - continuity bonus
- 新增的 simulation 测试能直接验证纯函数，不依赖浏览器状态机。
- 没有产生新的 layer violation，尤其是 `simulation` 不能反向依赖 `app`。

---

## P0-3：建立真正的 featured match 规则入口，接管玩家比赛胜负

**目标**

- 让玩家比赛的胜负、分差、反馈主要由 simulation 规则决定，而不是继续主要靠 `browser.js` 中的拼装 edge。
- 保留现有事件卡数量和 UI 节奏，但把结果计算切到 simulation。

**涉及文件**

- 新增或扩展：`src/simulation/match.ts`
- 修改：`src/app/browser.js`
- 修改：`tests/app/browser-flow.test.mjs`
- 新增或修改：`tests/simulation/match.test.ts`

**当前要替换的原型点**

- `resolveFeaturedMatch()` 目前仍主要使用：
  - `teamStrength` 差
  - 当前比分 momentum
  - KDA impact 累积
  - `timeoutUsed` 的极轻微修正
- 这不足以承接 `MECHANICS.md` 中的：
  - 攻防策略碰撞
  - 经济档位差
  - scouting / read pressure
  - timeout reset
  - chemistry / discipline / continuity

**实施顺序**

1. 在 `src/simulation/match.ts` 增加 featured match resolver，输入至少包括：
   - player team stats
   - opponent stats
   - opening buy tier
   - opening tactic
   - scout choice
   - read pressure
   - timeout outcome
   - continuity / chemistry / discipline
2. 输出至少包括：
   - playerWin
   - normalized series score
   - quantified reason lines
   - next-round-facing modifiers or summary
3. `browser.js` 的事件卡继续存在，但胜负结算改用 simulation resolver。
4. 把“正确决策链可覆盖约 `10-15` 点实力差”写成 deterministic test，而不是只留在文档。

**验证命令**

```sh
npm run test
npm run build
```

**验收标准**

- 固定 seed 下，featured match resolver 输出 deterministic。
- 玩家比赛仍保持：
  - `10-15` 张事件卡
  - `3-5` 张决策卡
  - 一场最多一次暂停
- 测试能证明：
  - 纯实力弱 `10-15` 点时，合理决策链可追回；
  - 纯乱选时，不能稳定逆天翻盘；
  - 早期杯赛仍比后期更苛刻，不会“一把通关”。

---

## P0-4：把半数值经济、暂停、读套路接成同一个比赛状态

**目标**

- 不只是保留 helper，而是让这些 helper 真正驱动 featured match 的局内演进。
- 让“装备”“暂停”“重复开局被读”成为三个不同的胜负杠杆。

**涉及文件**

- 修改：`src/simulation/match.ts`
- 修改：`src/app/browser.js`
- 修改：`src/content/match-beats.ts`
- 修改：`src/content/timeout-beats.ts`
- 新增或修改：`tests/simulation/match.test.ts`
- 新增或修改：`tests/app/mechanics-locks.test.mjs`

**实施顺序**

1. 经济
   - 让 opening buy 与后续压缩回合的购买力连续演进。
   - 用后台 bank/tier，前台继续显示 `全起 / 半起 / 强起 / ECO / 奖励局`。
2. 暂停
   - 将 `战术重置 / 情绪重置 / 纪律重置` 从一次性卡牌结果，改为对后续 resolver 生效的状态。
3. 读套路
   - 将 `strategyMemory.recentOpenings` 真实参与下一场或下一轮的 tactic edge。
   - 保持“有解释的中等惩罚”，避免黑箱。

**验证命令**

```sh
npm run test
npm run build
```

**验收标准**

- 自动化测试能证明：
  - 开局 full buy 输掉后，下一压缩回合不会仍然无成本满配；
  - 连续 `2-3` 次同类 opening 时，read pressure 从 `fresh -> warming -> read`；
  - timeout 三选一会改变后续结果，而不是只改变当前卡片文本。
- 浏览器渲染中仍保留可读术语与结果解释。

---

## P0-5：接入每杯间最多一次交易，补齐三年模式最明显缺口

**目标**

- 在不做复杂市场模拟的前提下，把“每杯间最多一次交易尝试”接入真实主路径。
- 这是当前三年模式从“可跑完”到“机制闭环”的最低缺口修补。

**涉及文件**

- 修改：`src/app/browser.js`
- 修改：`src/simulation/season.ts`
- 修改：`src/content/transfer-narratives.ts`
- 可能新增：`src/simulation/transfer.ts`
- 新增或修改：`tests/app/browser-flow.test.mjs`
- 新增或修改：`tests/simulation/season.test.ts`

**实施顺序**

1. 在 between-cups hub 中加入“本杯间仅一次交易尝试”入口。
2. 交易结算至少考虑：
   - 预算 / 报价
   - 队伍是否愿放人
   - 球员意愿
   - 当前阵容结构
3. 失败反馈只给 `1-2` 条主因，不暴露完整公式。
4. `runCareer()` 和 chronicle 文案不再写“尚未接入真实交易结算”。

**验证命令**

```sh
npm run test
npm run build
```

**验收标准**

- 浏览器三年流程中，每个杯间最多只能主动尝试一次交易。
- 成功交易会真实改变后续 roster / stats / continuity 走向。
- 失败交易有原因反馈，但不会泄露全部权重。
- `tests/simulation/season.test.ts` 或等价测试能证明三年模式在启用交易后仍 deterministic。

---

## P1-1：统一 chemistry、continuity、event 反雪球到赛季层

**目标**

- 把“长期一起打更稳”和“落后方仍可追回”的赛季体验做实。
- 避免三年模式只剩下每杯独立小循环。

**涉及文件**

- 修改：`src/simulation/season.ts`
- 修改：`src/simulation/match.ts`
- 修改：`src/content/events.ts`
- 修改：`src/content/mechanic-events.ts`
- 修改：`src/content/traits.ts`
- 新增或修改：`tests/simulation/season.test.ts`

**实施重点**

- continuity 增长继续保持轻量且 capped。
- chemistry / discipline / personality chain 真正进入赛季事件与 match resolver。
- 反雪球事件同时覆盖：
  - 玩家自我修复
  - 对手事故
  - 舆论/教练/状态问题
  - 不同强度档位 `±3~±6`、`±7~±10`

**验证命令**

```sh
npm run test
```

**验收标准**

- 不换核心阵容时，后续杯赛能获得轻度稳定收益，但不至于成为唯一正确答案。
- 高 cohesion 与低 cohesion 的事件链有可感知差异。
- 落后方存在可验证的追赶路径，而不是单纯靠随机爆种。

---

## P1-2：统一年度奖项与三年 chronicle 的评分来源

**目标**

- 让杯赛 MVP、年度 Top 10、年度最佳俱乐部、最终 chronicle 都来自更一致的评分口径。
- 减少 `browser.js` 与 `simulation/season.ts` 各算各的风险。

**涉及文件**

- 修改：`src/simulation/season.ts`
- 修改：`src/simulation/cup.ts`
- 修改：`src/app/browser.js`
- 修改：`src/content/awardsText.ts`
- 新增或修改：`tests/simulation/season.test.ts`

**实施重点**

- 杯赛 MVP 继续看 impact + team run，但统一到 simulation scoring。
- 年度榜单综合：
  - cup placements
  - impact / kills / consistency
  - MVP 权重
- chronicle 读取 season/cup 记录，不再依赖浏览器端独立拼装口径。

**验证命令**

```sh
npm run test
```

**验收标准**

- 同一赛季下，浏览器展示与 simulation 产出的年度奖项不互相打架。
- Top 10、best club、player of the year、chronicle summary 全部可重复生成且 deterministic。

---

## P1-3：平衡性收口与完整回归

**目标**

- 在功能闭环完成后，最后处理“双明星开局过强”和三年节奏过顺的问题。
- 只在机制接线完成后做平衡，避免在原型规则上反复调参。

**涉及文件**

- 修改：`src/content/players.ts`
- 修改：`src/content/teams.ts`
- 可能新增：`src/content/balance.ts`
- 修改：`tests/simulation/season.test.ts`
- 新增或修改：`tests/simulation/balance.test.ts`

**实施重点**

- 压低“donk + ZywOo 无脑通关”的稳定性。
- 保留体系型、纪律型、深度型阵容的争冠路径。
- 早期杯赛更难，后期因 continuity / chemistry / event management 变得更稳。

**验证命令**

```sh
npm run test
npm run build
npm run check:docs
npm run test:architecture
npm run gc
```

**验收标准**

- 多 seed 下，双明星弱结构阵容不应长期呈现统治级胜率。
- 至少存在一条非双巨星构筑的可持续争冠路径。
- 完整三年流程仍能在可接受时间内跑完，没有软锁或状态断裂。

---

## 主线程执行顺序

### P0

1. `P0-1` 文档对齐当前真实现状
2. `P0-2` 规则 helper 下沉到 `src/simulation/match.ts`
3. `P0-3` featured match resolver 接管玩家比赛胜负
4. `P0-4` 经济 / 暂停 / 读套路接成统一比赛状态
5. `P0-5` 每杯间最多一次交易接入主路径

### P1

1. `P1-1` chemistry / continuity / 反雪球事件赛季化
2. `P1-2` 奖项与 chronicle 评分统一
3. `P1-3` 平衡性收口与完整回归

---

## 最低回归命令

主线程每完成一个 P0 项后至少运行：

```sh
npm run test
npm run build
```

完成每个阶段收口时运行：

```sh
npm run check:docs
npm run test:architecture
npm run gc
```

最终交付前必须运行：

```sh
npm run test
npm run build
npm run check:docs
npm run test:architecture
npm run gc
```

---

## 完整版三年模式最终验收口径

以下条件同时成立，才算“主线程可以宣布完整版三年模式完成”：

- 玩家可从征召室完整跑完三年九杯，到达最终 chronicle。
- featured match 的胜负主要由 simulation 层规则决定，而不是 `browser.js` 内部拼接 edge。
- 半数值经济、中暂停、中等战术反制、轻度长期默契成长、事件反雪球、每杯间最多一次交易、综合型奖项，全部都有：
  - 真实状态
  - 主路径入口
  - 自动化测试覆盖
  - 玩家可感知反馈
- 文档、测试、实现三者不再互相矛盾。
