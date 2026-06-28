# Handoff Progress

> 给下一位接手本项目的 AI/开发者：先读本文件，再读 `AGENTS.md`、`docs/product-specs/MECHANICS.md`、`docs/exec-plans/active/v0-1-playable-cup-finalization.md`。

## 当前状态总览

| 模块 | 状态 | 已完成 | 未完成/风险 | 下一步建议 |
|---|---|---|---|---|
| v0.1 黄金路径 | 已验收 | 可从征召室一路玩到第一杯颁奖：推荐 6 人、确认阵容、杯赛支架、赛前情报、比赛事件、杯赛冠军/MVP | 仍是轻量原型，不是完整三年赛季 | 保持这条路径不回退，任何大改先跑 `tests/app/browser-flow.test.mjs` |
| 阵容系统 | 已完成第一版 | 6 人阵容，5 首发 + 1 替补；推荐阵容总价 98/100；替补会真实影响首发数值和比赛文本 | 选手池还不是完整八队全量首发/替补深度；价格曲线仍需平衡 | 扩充选手池并重调价格，避免双明星开局过强 |
| 选手数值/性格 | 部分完成 | 浏览器原型展示火力、战术、纪律、残局、性格、trait 描述；trait 按公开赛场风格设计 | 还没有完整化学反应引擎；明星强度仍偏高 | 实现 `docs/product-specs/MECHANICS.md` 中的轻量化学反应和更严格预算/价格曲线 |
| 杯赛支架 UI | 已改进 | `src/app/browser.js` 的支架已从平铺卡片改成树形对阵图；CSS 在 `src/ui/styles.css` | 当前树形图是固定对阵展示，还不是动态记录每轮胜负 | 后续三年模式中让 bracket 根据比赛结果更新四分之一、半决赛、决赛、冠军 |
| 比赛事件框 | 已完成第一版 | 一场比赛有事件卡和决策卡；当前黄金路径能推进到颁奖 | 还未达到完整版要求：每场 10-15 个框，玩家选择不超过 5 个；普通框需更多“某某几杀、击杀谁”的 CS 叙事 | 把 `makeMatchCards` 扩展为 10-15 张卡，并拆分普通击杀事件、残局事件、经济事件、暂停事件 |
| 战术文案 | 部分完成 | 已修正“默认夹枪”为“默认架枪”；赛前情报、暂停、假打、慢控等文案存在 | 部分选项仍偏泛，需要更贴近 CS 玩家术语，例如默认控图、爆弹、补枪、架点、反清、保枪、回防、假拆 | 做一次全局 UI 文案 pass，优先改 `src/app/browser.js` 和 `src/content/events.ts` |
| 三年完整赛季 | 未开始 | 规格已写：三年、每年 Katowice/Cologne/Major、年度奖项、编年史 | 没有完整 season state、三杯循环、转会窗、年度 TOP10、最终编年史 UI | 新建 `src/simulation/season.ts` 和对应测试，先跑通 3 年 9 杯闭环 |
| 杯赛之间 UI | 未开始 | 已确认杯赛之间应以对阵图为中心 | 没有转会窗口、年度/杯间事件、下一杯切换 | 以当前 `bracket-tree` 为基础做可复用组件/渲染函数 |
| 转会/竞标 | 未开始 | 机制规格存在，轻量竞标事件口径已确认 | 未实现球员归属、报价、AI 竞标、球员意愿 | 三年模式可先做杯赛后一次事件化竞标，不做复杂市场 |
| 成长/衰退 | 未开始 | 规格确认赛季末轻量成长 | 未实现年龄、赛季表现、永久属性变化 | 年度奖项后加 1-3 点成长/衰退，先用 deterministic seed |
| 奖项系统 | 部分完成 | 第一杯显示冠军和杯赛 MVP；鼓励/安慰文本已有 | 年度最佳俱乐部、年度 TOP10、三年编年史未落到 UI | 先定义 impact rating，再接年度榜单 |
| 美术/UI | 部分完成 | 深色电竞风格、导航进度点、树形支架、事件卡、颁奖屏 | 缺少更完整的赛事图形语言；移动端只是基本适配 | 后续重点打磨 bracket、match room 和 annual chronicle |
| 自动化测试 | 已有基础 | `npm run test` 覆盖阵容、杯赛、浏览器黄金路径、替补生效、树形支架、错字回归 | 没有真实浏览器 Playwright 测试；本机 Chromium 不可用 | 能装浏览器后补端到端点击测试 |
| 打包/Git 上传 | 未完成 | 项目源码已在 `/Users/didi/Desktop/major`；暂无 git 仓库 | 还没生成最终 zip；还没初始化 git | 下一步可创建 `.gitignore`、README 更新、生成源码压缩包 |

## 最近完成的关键改动

| 时间 | 文件 | 内容 |
|---|---|---|
| 2026-06-26 | `src/app/browser.js`, `src/ui/styles.css` | 子代理补做三年模式 UI polish：征召室增加选人进度/角色构成/预算反馈；比赛室改成更像赛事控制台的信息层；between-cups / annual-awards / chronicle 增加赛季轨迹、奖项摘要与更贴近 CS 术语的文案 |
| 2026-06-25 | `src/app/browser.js` | 将浏览器原型改为状态机：draft -> bracket -> prematch -> match -> awards |
| 2026-06-25 | `src/app/browser.js` | 推荐阵容改为预算内：`donk, ropz, apEX, b1t, chopper, s1ren` |
| 2026-06-25 | `src/app/browser.js` | 替补选择会影响 active roster、阵容数值、比赛事件文本 |
| 2026-06-25 | `src/app/browser.js` | 杯赛支架从平铺队伍卡改为树形对阵图 |
| 2026-06-25 | `src/ui/styles.css` | 新增深色电竞风格的 `bracket-tree`、连线、冠军位样式 |
| 2026-06-25 | `tests/app/browser-flow.test.mjs` | 增加黄金路径、替补生效、树形支架、错别字回归测试 |
| 2026-06-25 | `docs/product-specs/MECHANICS.md` | 写入化学反应、策略记忆、暂停、状态、impact rating 等机制口径 |
| 2026-06-25 | `docs/exec-plans/active/v0-1-playable-cup-finalization.md` | 写入 v0.1 收尾计划和验收标准 |

## 当前可运行方式

```sh
cd /Users/didi/Desktop/major
python3 -m http.server 5176 --bind 127.0.0.1
```

浏览器打开：

```text
http://127.0.0.1:5176
```

说明：`package.json` 的 `npm run dev` 默认使用 `5174`，该端口在本机曾被旧进程占用。若 5174 可用，也可以运行：

```sh
npm run dev
```

## 当前验证命令

交接前必须至少跑：

```sh
npm run build
npm run test
npm run check:docs
npm run test:architecture
npm run gc
```

当前预期：

- `npm run test` 应显示 11 个测试通过。
- `node --test tests/app/browser-flow.test.mjs` 应覆盖浏览器黄金路径。

## 下一阶段建议任务顺序

| 优先级 | 任务 | 验收标准 |
|---|---|---|
| P0 | 生成源码 zip 和 Git 上传说明 | 压缩包不含临时文件；解压后能运行测试 |
| P0 | 建立三年赛季状态机 | 可以完整跑完 3 年 9 个杯赛 |
| P0 | 每场比赛扩展到 10-15 张事件框 | 每场选择卡不超过 5 张，其余为普通战况叙事 |
| P0 | 平衡明星强度和价格曲线 | 开局买两个明星不应稳定夺冠；体系/纪律/替补/事件能影响结果 |
| P1 | 动态树形对阵图 | 每轮后更新晋级队伍、冠军、MVP |
| P1 | 杯赛之间事件和转会 | 每杯结束后能触发事件/交易/轻量竞标 |
| P1 | 年度奖项和三年编年史 | 年末显示最佳俱乐部、TOP10，三年后生成编年史 |
| P2 | 真实浏览器端到端测试 | Playwright 或等价工具能自动点击完成三年流程 |

## 已知限制

- 当前项目目录不是 git 仓库，`git status` 会失败。
- 没有 `node_modules`，也没有外部前端依赖；当前是静态 HTML + JS + CSS。
- Playwright 真实浏览器不可用，因为本机缺少可启动的浏览器依赖；目前依赖 Node 状态机测试和手动浏览器验收。
- 当前 v0.1 是“第一杯可玩原型”，不是最终三年完整版。
