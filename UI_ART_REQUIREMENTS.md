# CS Cup Manager — UI 美术需求文档
# Visual Art Requirements for AI-Assisted Design

> 本文档面向AI图像生成工具（Midjourney / DALL-E / Stable Diffusion 等）。  
> 每个界面原型均以完整的英文视觉描述（AI Prompt）+ 中文说明双语呈现。  
> 验收标准在每个界面末尾单独列出。

---

## 一、全局美术风格定义
## Global Art Style Definition

### 1.1 视觉情绪定位

这是一款 **电竞经理管理游戏**，玩家扮演 CS（反恐精英）职业战队经理。  
视觉风格应该传递以下情绪：

- **压迫感与专注感**：深色调、高对比度，如赛场控制室灯光
- **数据驱动的冷静感**：界面元素偏向信息密度，不花哨
- **电竞赛事感**：融入真实 CS 大赛（IEM、Major）的视觉语言
- **策略而非动作**：不是 FPS 游戏风格，是指挥官视角的棋局感

### 1.2 全局配色方案（强制）

```
背景主色   Background Base:   #0D0E14  (极深蓝黑，如赛事幕布)
背景副色   Background Panel:  #13151F  (深藏青，面板底色)
边框/分割  Border:            #252A3D  (低饱和蓝灰，用于分割线)
文字主色   Text Primary:      #E8EBF5  (冷白，高可读性)
文字副色   Text Secondary:    #7A849E  (低亮蓝灰，次级信息)
强调色     Accent:            #3E6FFF  (电竞蓝，交互元素/高亮)
危险/警告  Danger:            #E84545  (赤红，淘汰/负面事件)
成功/正向  Success:           #28D99E  (翠绿，胜利/正向反馈)
金色荣耀   Gold:              #F4B942  (冠军高亮/MVP)
```

### 1.3 团队专属颜色芯片（Team Accent Colors）

每支队伍拥有自己的视觉强调色，用于表格行高亮、名称标记：

```
Team Vitality (大黄蜂)    : #F5D800 — 黄色
Team Spirit (绿龙)        : #00B37A — 绿色
Team Falcons (猎鹰)       : #00BFFF — 天蓝
FaZe Clan                 : #FF4500 — 橙红
FURIA Esports (豹)        : #FF6B00 — 橙色
Natus Vincere (NAVI)      : #FFD700 — 金黄
MOUZ                      : #FF2244 — 深红
The MongolZ               : #4682B4 — 钢青
枪神队伍 (玩家战队)        : #3E6FFF — 电竞蓝（与主界面强调色呼应）
```

### 1.4 字体规范

```
标题字体  Display Font:   粗体无衬线 + 电竞风格 / 推荐 Rajdhani Bold 或 Barlow Condensed ExtraBold
正文字体  Body Font:      干净易读无衬线 / 推荐 Inter Regular / Noto Sans
等宽数字  Mono Font:      Roboto Mono 或 JetBrains Mono（用于数据、比分等）
中文字体  Chinese Font:   思源黑体 Bold（标题）/ 思源黑体 Regular（正文）
字体大小  Scale:          标题 32px → 副标题 20px → 正文 14px → 小标注 11px
字重      Weight:         标题 800 / 副标题 700 / 正文 400 / 数值强调 600
```

### 1.5 UI 元素通用规则

- **圆角**：所有卡片/面板使用 `border-radius: 6px`，按钮使用 `4px`，极小组件使用 `2px`
- **阴影**：内容层使用 `box-shadow: 0 4px 16px rgba(0,0,0,0.5)`
- **玻璃态**：重要模态窗口可使用 `backdrop-filter: blur(12px)` + 半透明背景
- **线条风格**：细线（1px）为主，强调边框 2px，避免粗边框装饰
- **图标风格**：线性图标（outline style），统一尺寸 16×16 或 20×20
- **动效**：整体偏向沉稳，过渡 150-250ms ease-out，无弹性/无夸张动效

### 1.6 玩家「枪神队伍」高亮规则（全局强制）

玩家战队「枪神队伍」在所有界面中必须有统一的高亮方式，确保玩家能在一瞥之间定位到自己：

```
常规状态：
  - 队伍名称左侧：3px 电竞蓝 (#3E6FFF) 竖条
  - 队伍颜色圆点：外加 2px 蓝色外环 (#3E6FFF)  
  - 名称文字：白色粗体（不加额外颜色）

玩家夺冠 / 第一名场景：
  - 队伍名称文字颜色：金色 (#F4B942)
  - 竖条保持蓝色
  - 背景可有微弱金色渐变（仅限卡片/行内）

玩家被淘汰 / 不利状态：
  - 竖条保持蓝色但降低至 60% 不透明度
  - 名称文字降低至 70% 不透明度
```

### 1.7 导航与面包屑系统

所有界面顶部需有统一的导航条，让玩家知道自己处于游戏流程的哪个位置：

```
导航条规格：
  - 高度：48px
  - 背景：#13151F，底部 1px 分割线 #252A3D
  - 左侧：杯赛/赛季进度标签，如 "S1 · KATOWICE"
  - 中间：当前界面名称，白色粗体 16px
  - 右侧：步骤指示器（小圆点序列），如 "○ ○ ● ○ ○"，当前步骤高亮蓝色
  - 进度圆点规格：8px 直径，间距 4px，已完成=白色，当前=蓝色 (#3E6FFF)，未完成=暗灰 (#252A3D)
```

### 1.8 加载与过渡画面

游戏在以下时机需要过渡动画或加载画面：

| 时机 | 过渡类型 | 持续时间 |
|------|---------|---------|
| 游戏启动 → S01 | 黑底 → 渐变显示（fade-in） | 800ms |
| S01 → S02 开始新游戏 | 深色遮罩滑入（dissolve wipe） | 500ms |
| 杯赛之间切换 | 短黑屏 + 杯赛名称大字浮现 | 1000ms |
| 进入比赛 | "MATCH STARTING" 文字 + 双方队名浮现 | 1200ms |
| 比赛结束 → S06 | 全屏暗化 + 结果文字放大显示 | 600ms |
| 赛季结束 | 暗幕 + "赛季终章"文字渐出 | 1500ms |

**加载画面统一设计：**
- 纯黑底色 (#0D0E14)
- 中央大字（32px 粗体）：加载标题如 "准备比赛 · PREPARING MATCH"
- 下方细进度条：2px 高 × 200px 宽，蓝色填充 (#3E6FFF)，无百分比数字
- 进度条下方可选一行副文字，12px，次级色
- 禁止：旋转图标、百分比计数器、花哨动画

### 1.9 通知与 Toast 系统

游戏中出现的临时浮动通知：

```
规格：
  - 位置：右上角，距顶部 16px，距右侧 16px
  - 宽度：320px
  - 高度：自适应，最小 48px
  - 背景：#1A1E2E，左边缘 3px 颜色条（绿色/红色/蓝色/金色）
  - 圆角：4px
  - 进入动画：从右侧滑入 250ms ease-out
  - 停留：3000ms
  - 退出动画：向右滑出 200ms ease-in
  - 最多同时显示：2 条（新通知顶掉旧通知）

颜色变体：
  - 成就/里程碑 → 金色左边框 (#F4B942)
  - 正面状态变化 → 绿色左边框 (#28D99E)，如 "凝聚力达到 80！"
  - 负面状态变化 → 红色左边框 (#E84545)，如 "donk 心态炸裂"
  - 中性信息 → 蓝色左边框 (#3E6FFF)，如 "转会窗口已开启"
```

### 1.10 条件/状态指示器系统（Player Condition Tags）

选手状态标签在整个游戏中多处使用。统一设计：

```
条件标签规格：
  - 形状：圆角矩形 pill，高 20px，padding 4px 8px
  - 字号：10px，粗体 600
  - 圆角：10px（全圆角 pill）

颜色变体：
  🔥 热手 / ON FIRE      — 填充橙色 (#FF6B00)，白色文字
  📈 状态上佳 / IN FORM    — 填充深绿 (#1A4A3A)，绿色边框 (#28D99E)，白色文字
  📉 低迷 / SLUMP         — 填充深红 (#3A1A1A)，红色边框 (#E84545)，浅红文字
  😤 心态炸裂 / TILTED    — 填充深紫红 (#4A1A2E)，紫色边框，浅红文字
  ❌ 缺席 / ABSENT        — 填充深灰，中灰边框，灰色文字 + 删除线
  🏥 伤病 / INJURED       — 填充深红，红色边框，带 ⚕ 图标
  🔄 替补上场 / SUB        — 填充暗蓝，浅蓝边框，带 ⇄ 图标
```

### 1.11 提示框 / Tooltip 规范

悬浮在数据元素上的信息提示框：

```
规格：
  - 背景：#1A1E2E，1px 边框 #252A3D（非纯黑以区分）
  - 最大宽度：260px
  - 内边距：8px 12px
  - 字号：12px
  - 文字颜色：次级白 #C0C8DB
  - 箭头：指向触发元素的 6px 小三角
  - 出现延迟：300ms hover 后显示
  - 消失：鼠标移出即消失，无延迟
  - 字体：等宽数字用 JetBrains Mono，其余用 Inter
```

---

## 二、界面清单总览
## Screen Inventory

| # | 界面名称 | 触发时机 | 主要功能 |
|---|---|---|---|
| S01 | 开始画面 / Title Screen | 游戏启动 | 进入游戏、继续存档 |
| S01b | 教练风格选择 / Coach Style | S01→S02之间 | 选择执教哲学风格 |
| S02 | 征召室 / Draft Room | 赛季开始 | 预算选人，组建战队 |
| S03 | 杯赛支架 / Cup Bracket | 每个杯赛期间 | 查看对阵树、下一场对手、各队名次 |
| S03b | 杯赛颁奖 / Cup Awards | 每个杯赛决赛结束后 | 冠军加冕、杯赛MVP公布、奖金发布 |
| S04 | 赛前事件卡 / Pre-Match Event | 比赛前触发 | 展示突发事件与选择 |
| S05 | 比赛室 / Match Room | 每场比赛进行中 | 主战术决策界面（含暂停子界面） |
| S06 | 赛后小结 / Post-Match Summary | 单场比赛结束 | 本场MVP、关键数据、下一步 |
| S07 | 转会窗口 / Transfer Window | 杯赛之间 | 球员交易、阵容调整 |
| S08a | 年度颁奖 / Annual Awards | 赛季三杯全部结束后 | 年度最佳俱乐部、年度TOP10选手 |
| S08b | 赛季总结 / Season Summary | 年度颁奖后 | 三杯回顾+高光片段+赛季决策 |
| S09 | 生涯总结 / Career Chronicle | 三赛季结束 | 职业生涯完整故事回顾 |
| S10 | 存档管理 / Save Manager | 任意时刻（暂停菜单） | 保存/加载/删除存档 |

---

## 三、各界面详细设计规范

---

### S01 — 开始画面 / Title Screen

#### 3.1.1 界面功能描述

游戏的第一印象画面。玩家看到游戏标题、进入游戏按钮、继续游戏按钮（如有存档）。  
这个界面需要传达「CS 电竞职业赛事」的宏大感，同时保持简洁不堆砌。

#### 3.1.2 AI 绘图提示词（英文）

```
A dark cinematic esports title screen for a Counter-Strike tournament manager game.
The background is a deep space-like darkness (#0D0E14), with a faint large arena crowd silhouette
visible as a barely-lit panoramic background layer — stadium lights glow from the sides,
creating a god-rays effect in cool blue and white tones. The composition is vertical-center.

At the top-center of the screen: the game logo "CS CUP MANAGER" in bold condensed sans-serif
lettering (Rajdhani or Barlow Condensed style), the main title glows in cold white (#E8EBF5)
with a subtle electric-blue halo (#3E6FFF). Below the main title, a small subtitle reads
"Counter-Strike Tournament Experience" in lighter weight font, in muted blue-grey (#7A849E).

In the center of the screen, two stacked button elements:
- Primary button: "开始新赛季 / NEW SEASON" — filled rectangle with accent blue (#3E6FFF),
  white text, subtle inner glow.
- Secondary button: "继续游戏 / CONTINUE" — outlined rectangle, blue border, lighter text.

At the very bottom, small fine print: version number and a line of small player name credits in
very faint text (#252A3D contrast style).

The overall atmosphere is cinematic, cool-toned (desaturated blue-black), professional esports
broadcast energy. No photorealistic characters. No bright warm colors. Pure data-command-center mood.
```

#### 3.1.3 中文补充说明

- 背景层次：最底层是极暗的纯黑，第二层是模糊的赛场人群轮廓（剪影效果，非写实），第三层是光线氛围（冷蓝白聚光），第四层是UI文字
- 标题字体应该有轻微发光效果，但不是霓虹灯风格，是「被聚光灯照到」的感觉
- 按钮位置居中偏下，不堆满屏幕
- 整体无任何装饰图案、无枪械贴图、无人物插画

#### 3.1.4 验收标准

- [ ] 背景为深色系（接近 #0D0E14），无亮色大面积色块
- [ ] 游戏标题清晰可读，使用粗体压缩无衬线字体
- [ ] 「进入游戏」按钮为主强调蓝色（#3E6FFF），与背景对比度 ≥ 4.5:1
- [ ] 界面无多余装饰元素，无枪支/人物插图占据主视觉区
- [ ] 整体宽高比适配 16:9 宽屏显示器

---

### S01b — 教练风格选择 / Coach Style Selection

#### 3.1b.1 界面功能描述

玩家点击「开始新赛季」后、进入征召室之前，选择自己的执教风格。四种风格不是简单的 +/-1 数字差异，而是改变游戏体验偏向。

| 风格 | 中文标签 | 核心效果 | 符号 |
|------|---------|---------|------|
| Tactician | 战术大师 | 战术执行+15%，暂停多一个选项 | ♜ |
| Man Manager | 更衣室大哥 | 士气恢复2x，tilt触发-50% | ♥ |
| Gambler | 赌徒 | 高风险选项成功+15%，失败惩罚+50% | ♦ |
| Disciplinarian | 纪律严师 | 纪律不低于50，明星球员偶尔降士气 | ♚ |

#### 3.1b.2 AI 绘图提示词（英文）

```
A dark coach style selection screen for a Counter-Strike esports manager game —
the "Choose Your Philosophy" screen after clicking "New Season".

The screen has a centered layout on deep dark background (#0D0E14).
A narrow top navigation bar shows step indicator "季前 · PRESEASON".

MAIN CARD (centered, width ~640px, dark panel #13151F, border-radius 8px):

HEADER: "你的执教哲学 / COACHING PHILOSOPHY" in bold white display font (28px),
centered at top. Subtitle: "这将影响你整个执教生涯的决策风格" in secondary text (#7A849E), 13px.

FOUR STYLE CARDS in a 2x2 grid, each card is a rounded rectangle (#1A1E2E, border #252A3D):
  Each card contains:
  - Top-left: large symbol (32px):
    ♜ Tactician → blue (#3E6FFF)
    ♥ Man Manager → warm rose (#E87878)
    ♦ Gambler → gold (#F4B942)
    ♚ Disciplinarian → teal (#28D99E)
  - Title: bold white 18px, e.g. "战术大师 / TACTICIAN"
  - Description: 2-3 lines small text (12px), e.g.:
    "你相信体系高于个人。战术板上的每一根箭头都有意义。暂停是你最强的武器。"
  - Bottom: small effect badges (10px outlined pills).
    Example: "[战术执行 +15%]" blue outline, "[暂停 +1选项]" grey outline.
  - SELECTED card: 2px blue (#3E6FFF) full border + subtle inner blue glow.
    Deselected cards: faint border, no glow.

BOTTOM: "确认风格 / CONFIRM" primary button in accent blue (#3E6FFF).
Below: small hint "可在每个赛季结束后重新选择" in #7A849E.

The four cards must be visually balanced — equal size, equal weight, no card looks
"recommended" or pre-selected. Clean, professional, slightly ceremonial.
```

#### 3.1b.3 中文补充说明

- 四张卡必须视觉权重完全等同——任何一张都不能看起来是"推荐"或"默认"选项
- 这个界面应该让玩家感觉到「我在定义自己的身份」，而非玩教程
- 风格符号用大号 Unicode 字符即可，不需要图标库

#### 3.1b.4 验收标准

- [ ] 四张风格卡片等大排列，视觉权重一致
- [ ] 每张卡包含风格符号（彩色）、标题、说明文字、效果标签
- [ ] 选中态有蓝色边框+内发光，未选中为暗边框
- [ ] 「确认」按钮在所有风格都未选时保持灰色不可点击

---

### S02 — 征召室 / Draft Room

#### 3.2.1 界面功能描述

玩家在固定预算内从球员池中挑选 6 名球员（5名首发 + 1名替补）组成「枪神队伍」。  
界面需要同时展示：
- **可选球员列表**（左侧大区域）：姓名、归属战队、能力属性（火力/战术）、价格、特质标签
- **已选球员区域**（右侧/下方小区域）：当前 6 个选手槽位
- **预算仪表**：当前剩余预算，实时更新
- **确认按钮**：确认阵容并开始赛季

#### 3.2.2 AI 绘图提示词（英文）

```
A dark split-panel UI screen for a Counter-Strike esports manager game — the "Draft Room" screen.

Left panel (approximately 65% width, tall scrollable list):
A player roster table with dark panel background (#13151F). Each row represents one pro player.
Row contents from left to right: a small circular team logo (color-coded — e.g., yellow for Vitality,
green for Spirit), player display name in bold white text, two horizontal mini stat bars
("Firepower" and "Tactics" — bars filled in accent blue #3E6FFF on dark track),
a price tag badge (white number on semi-transparent dark chip),
and one or two small rectangular trait tags with colored outlines
(e.g., "hot_blooded" in orange-outline, "clutch_stabilizer" in green-outline).

Selected rows have a subtle left-edge color stripe matching their team color.
Unselected rows are dark with a faint hover state.
The table has a sticky header row in slightly lighter dark panel.

Right panel (approximately 35% width, fixed):
Top section: a budget meter — labeled "预算 / BUDGET" with a remaining number in large bold mono
font (white), and a thin horizontal progress bar below it that drains from full green (#28D99E)
toward red (#E84545) as budget is spent.

Below budget: 6 player slot cards arranged vertically. Each slot is a small dark rounded rectangle.
Empty slots show a faint dotted border and a "+" icon center. Filled slots show
player name, team color chip, and a small "✕" remove button.

At the bottom of the right panel: a large "确认阵容 / CONFIRM ROSTER" primary button
in accent blue (#3E6FFF). It is greyed out (opacity 0.4) until all 5 starter slots are filled.

The entire screen has very subtle horizontal scan-line texture on the background for depth.
Top bar navigation shows: "征召室" as current page in bright text, and a step indicator "01 / DRAFT".
```

#### 3.2.3 中文补充说明

- 左侧球员列表是本界面的核心，要能容纳大量行，需要可滚动
- 球员的队伍颜色芯片（左侧色条）要与全局队伍颜色对应（见 1.3 节）
- 属性条不显示数字，只显示视觉比例，数字显示在悬浮 tooltip 中
- 特质标签（trait tags）用小型边框标签形式，不同特质用不同颜色轮廓区分
- 预算条颜色随剩余量变化：充裕时绿色，紧张时橙色，超支时红色（不可超支）
- 球员槽位6个，但标注：前5个是「首发」，第6个标注「替补」

#### 3.2.4 验收标准

- [ ] 左侧玩家列表每行包含：队徽颜色标记、姓名、2条属性条、价格数字、至少1个特质标签
- [ ] 右侧预算仪表数字用等宽字体，大而清晰
- [ ] 6个球员槽位清晰可数，首发5个与替补1个有视觉区分
- [ ] 「确认」按钮在阵容未满时呈灰色不可点击状态
- [ ] 整体背景延续深色系 (#13151F)，无亮背景

---

### S03 — 杯赛支架 / Cup Bracket

#### 3.3.1 界面功能描述

每个杯赛（IEM Katowice / IEM Cologne / Major）的比赛对阵树界面。  
这是玩家在非比赛期间的主要信息枢纽。  
界面展示：
- 8支队伍的单败淘汰制对阵树（3轮：8→4→2→1）
- 每支队伍的名称 + 队伍颜色标识
- 已产生的比赛结果（胜方高亮/败方灰暗淡出）
- 玩家战队「枪神队伍」的当前所在位置（高亮强调）
- 下一场对手预览（如「下一场 vs Team Vitality」）
- 当前杯赛名称（顶部标题区）

#### 3.3.2 AI 绘图提示词（英文）

```
A dark esports tournament bracket screen for a Counter-Strike manager game — the "Cup Bracket" view.

The screen is organized as a centered horizontal bracket tree, displayed on a deep dark background
(#0D0E14). The bracket spans from left (Quarterfinals) to right (Champion) with connecting
lines between match slots.

Each match slot is a small dark rounded rectangle panel (#13151F border #252A3D).
Inside each slot: two team name rows. Each name row shows:
— a tiny colored circle (team accent color) on the far left,
— the team short name in white bold text,
— a score number on the right (e.g., "2" or "—" if not played).

Eliminated/losing teams: their row fades to 50% opacity with a strikethrough on the name.
Winning/advancing teams: full opacity, small accent glow on left color circle.

The player's team "枪神队伍" has a special visual treatment: the slot row containing their name
has a persistent subtle left accent stripe in electric blue (#3E6FFF), and the team name text
has a very faint electric glow.

Connecting bracket lines: thin 1px lines (#252A3D) in a classic bracket tree structure,
transitioning to brighter lines for the advancing path.

At the top of the screen: the tournament title "IEM KATOWICE 2027" (or current cup name)
in large, slightly condensed header font, with a small stylized icon beside it.
A navigation row below shows: "八强赛 QUARTERFINAL" / "四强赛 SEMIFINAL" / "决赛 FINAL"
as small tab indicators, with the current stage active.

Bottom-center: a highlighted info box — "下一场对手 / NEXT MATCH vs [Opponent Name]"
with the opponent's team color on the background of the box. A "准备开始 / START MATCH" button
in accent blue at the bottom right.
```

#### 3.3.3 中文补充说明

- 对阵树是水平布局（从左向右：八强→四强→决赛→冠军），符合传统锦标赛对阵图习惯
- 八强赛4组对阵在左侧，中间是四强2组，右侧是决赛1组，最右侧是冠军奖杯图标/文字
- 玩家队伍所在的那一行必须有视觉强调，让玩家能快速找到自己
- 非玩家队伍之间的比赛结果是快速计算后直接显示的，不需要单独动效
- 杯赛名称每轮不同（IEM Katowice、IEM Cologne、Major），背景色调可以随杯赛做轻微变化：Katowice 偏冷（冰蓝），Cologne 偏暖（橙黄点缀），Major 偏紫金（最隆重）

#### 3.3.4 验收标准

- [ ] 8支队伍全部在支架图上可见，对阵关系清晰
- [ ] 玩家「枪神队伍」与其他队伍有明显视觉区分（蓝色强调）
- [ ] 已结束比赛的败者明显淡化
- [ ] 「下一场对手」预览区域存在，并显示对手名称
- [ ] 杯赛名称（Katowice/Cologne/Major）显示在顶部标题区

---

### S03b — 杯赛颁奖 / Cup Awards Ceremony

#### 3.3b.1 界面功能描述

每个杯赛（IEM Katowice / IEM Cologne / Major）的决赛结束后，系统自动跳出杯赛颁奖界面。  
这是玩家最关心的「荣誉时刻」之一——无论玩家队伍是否夺冠，这个界面都会全览展示：

**必有内容：**
- **冠军加冕栏**：哪支队伍夺冠，全大写标题宣告
- **杯赛 MVP 公布**：本届杯赛表现最优的 1 名球员（跨全部8支战队），不是只看夺冠队
- **最终名次/奖金表**：冠军、亚军、四强（2队）、八强（4队）各获得多少奖金/积分
- **枪神队伍特别标记**：玩家队伍无论名次，都需要在奖金表中有视觉强调

**叙事节奏**：
1. 先展示冠军（停顿感、仪式感）
2. 再揭示 MVP（可能与冠军队不同，制造悬念）
3. 最后公布完整排名和奖金分配
4. 如果玩家夺冠 → 金色为主调；如果未夺冠 → 保持深色基调但尊重冠军

**后续流程**：
- 三个杯赛之间的颁奖（Katowice/Cologne 后）→ 点击「继续」进入转会窗口（S07）
- Major 的颁奖 → 点击「继续」进入年度颁奖（S08a）

#### 3.3b.2 AI 绘图提示词（英文）

```
A dark esports tournament awards ceremony screen for a Counter-Strike manager game — the "Cup Awards" screen.
This screen appears after the final match of any cup (IEM Katowice / IEM Cologne / Major).

The screen uses a ceremonial scroll-down layout on dark background (#0D0E14), divided into
three sequential visual "reveal" zones, but all visible at once on a 16:9 screen.

ZONE 1 — CHAMPION CROWNING (top, most prominent):
A wide horizontal banner spanning ~80% screen width, centered.
The banner has a dark gradient background: if the player's "枪神队伍" won,
the background is a subtle warm gold-tinted dark (#1A1620 with gold edge glow).
If another team won, the background is the champion team's color-tinted dark.
Inside the banner:
— Top line: small text "CHAMPION · 冠军" in muted gold (#F4B942), all caps.
— Middle line: the champion team name in LARGE bold display font (40-48px),
  with the team's color marker circle (16px) beside the name.
  Player's team name has electric-blue glow (#3E6FFF) if they won, or standard treatment if not.
— Bottom line: trophy icon + "IEM KATOWICE 2027" (or current cup name) in secondary white.
— Optional: a very subtle win count added if player wins: small label "第 1 冠 / FIRST TITLE"
  in gold for the player's first-ever cup win.

ZONE 2 — CUP MVP ANNOUNCEMENT (middle):
A centered horizontal card panel (#13151F, gold left-border 3px #F4B942).
The card has a subtle gold gradient accent on its top edge.
Card contents:
— Header: "★ 杯赛 MVP · TOURNAMENT MVP ★" in gold text (#F4B942), centered.
— Player row: large text showing MVP player name in white bold (28px),
  preceded by their team color dot (16px), followed by team name in secondary text.
— Impact summary line: 2-4 key stats specific to this cup, e.g.:
  "4 MVP Events · avg impact rating 94 · 3 clutch rounds won"
— If the MVP is from the player's team: a subtle confetti/particle shimmer effect
  (in code: small gold sparkle CSS animation). If MVP is from an AI team:
  a respectful but understated presentation — no sparkle, but the name is gold.
— Small note below: "跨全部 8 支战队评选 / Voted across all 8 teams" in tiny secondary text.

ZONE 3 — FINAL STANDINGS & PRIZES (bottom):
A compact dark table (#13151F layered panel) with 8 rows, one per team, sorted by placement.
Table header row: "名次 / PLACE · 队伍 / TEAM · 奖金 / PRIZE"
Table rows:
— Row 1 (Champion): left rank "1st" in gold text, team name + color dot, prize amount
  in bright white bold (e.g., "$250,000"). Row has subtle gold left-edge stripe.
— Row 2 (Runner-up): "2nd" in silver-grey, prize smaller.
— Rows 3-4 (Semifinalists): "3rd" in bronze, prize smaller still.
— Rows 5-8 (Quarterfinalists): "5th" in standard grey, lowest prize.
— Player's "枪神队伍" row: a subtle blue (#3E6FFF) left-stripe indicator regardless of placement,
  so the player always finds their team easily.
— If the player is champion: their row uses gold text for the name, and the row
  has a slightly elevated brightness.

Below the table, a horizontal "奖金汇总 / PRIZE POOL" summary bar:
"总奖金池: $1,250,000 | 枪神队伍获得: $X" where X is the player's actual prize.
Player's prize in bold white, rest in secondary.

BOTTOM ACTION:
A single large "继续 / CONTINUE" button in accent blue (#3E6FFF), centered.
If this is the Major cup: small label hint below "→ 进入年度评选",
if it's a regular cup: "→ 进入转会窗口".
```

#### 3.3b.3 中文补充说明

- 杯赛颁奖是游戏内第一个「仪式性」界面，节奏感很重要。三个区域自上而下展示，但都在一屏内
- 冠军栏的视觉重量应该是全屏最重的元素，让结果一目了然
- MVP 公布是独立于冠军的叙事时刻：如果冠军队没有 MVP，会制造一种「最强个人不在最强团队」的反差感，这种反差本身就是故事
- 玩家夺冠时可以用金色粒子/微光效果（Coding 时注意：不对性能造成影响），未夺冠时保持尊重，不刻意渲染失落
- 名次表中 1/2/3 名的颜色编码必须是金/银/铜，不得混淆
- 每个杯赛的奖金额度可以不同：Major > Cologne > Katowice（体现赛事重要性梯度）

#### 3.3b.4 杯赛叙事引导文本（给叙事设计师）

以下是为每个杯赛的冠军公布设计的叙事文案框架，供实现时使用：

```
// IEM Katowice 颁奖
冠军宣告: "铁幕升起，冰原加冕。IEM Katowice 的冠军属于——"
MVP 揭示: "在零下十度的卡托维兹，XXXX 用滚烫的手感融化了一切对手。"

// IEM Cologne 颁奖  
冠军宣告: "莱茵河畔的圣殿见证了新的传奇。IEM Cologne 冠军——"
MVP 揭示: "科隆大教堂的钟声为 XXXX 而鸣。他的表现定义了整个赛事。"

// Major 颁奖
冠军宣告: "这是CS的最高殿堂。Major 冠军加冕——"
MVP 揭示: "当所有人屏住呼吸，XXXX 在最大的舞台上打出了职业生涯的决定性表现。"
```

#### 3.3b.5 验收标准

- [ ] 冠军队伍名称以大号字体在顶部醒目展示
- [ ] 冠军栏颜色区分：玩家夺冠=金边暖色底，他队夺冠=该队颜色底
- [ ] MVP 球员名称用金色文字展示，附所属队伍颜色标记
- [ ] MVP 来自玩家队伍时有金色微光效果（可选粒子动画），来自他队时为尊重感的静态展示
- [ ] 8支战队名次表完整展示，1/2/3名颜色编码金/银/铜
- [ ] 玩家「枪神队伍」在任何名次位置都有蓝色强调标记
- [ ] 奖金分配表清晰展示各名次奖金金额
- [ ] 「继续」按钮为蓝色，位置明显
- [ ] Major 杯赛后按钮提示「进入年度评选」，其他杯赛后提示「进入转会窗口」

---

### S04 — 赛前事件卡 / Pre-Match Event Card

#### 3.4.1 界面功能描述

在进入比赛前（或两杯之间），系统弹出一个事件通知。  
这是叙事驱动的突发事件界面，例如：「教练护照被扣押」「球员状态火热」「中国球迷压力」。  
界面为模态弹窗形式，展示：
- 事件标题（短促有力）
- 事件叙述文字（2-4句话，描述情境）
- 1-3个选择按钮（不同决策方向）
- 可能展示受影响的球员头像/名字

#### 3.4.2 AI 绘图提示词（英文）

```
A dark modal event notification card for an esports manager game — the "Pre-Match Event" overlay.

The card appears centered on the screen with a dark semi-transparent backdrop overlay
(rgba(0,0,0,0.75) + backdrop blur 12px) dimming the background bracket screen.

The event card itself is a dark rounded rectangle (#13151F, border #252A3D, border-radius 8px,
width approximately 480px). It has a subtle drop shadow for depth.

Card structure from top to bottom:

1. TOP BADGE STRIP: a narrow colored strip at the top of the card indicates event type.
   — "⚠ 突发事件 / CRISIS" strip in red-orange (#E84545) for negative events
   — "★ 赛前情报 / INTEL" strip in blue (#3E6FFF) for neutral events
   — "↑ 绝佳状态 / FORM UP" strip in green (#28D99E) for positive events
   The strip is just the top-edge color accent (height 4px) + small icon-label in top-left.

2. TITLE ROW: large bold heading text in white (#E8EBF5), e.g., "教练签证延误",
   font size equivalent to 22-24px, left-aligned with a small relevant icon on the left.

3. NARRATIVE TEXT: 3-4 lines of body text in secondary white (#C0C8DB), 14px,
   describing the event situation in concise dramatic tone.
   Example: "Your head coach is stuck at Cologne airport security — again. The team will
   enter the arena without him for the opening. The players must call their own tactics."

4. AFFECTED PLAYER TAG (optional): if a specific player is affected, a small inline player
   chip appears — circular colored team dot + player name + small icon (e.g., ⚡ for form boost,
   ↓ for form drop, ✗ for absence). Displayed as a horizontal pill/chip below the narrative.

5. CHOICE BUTTONS: 2-3 large buttons at the bottom of the card.
   Button style: full-width rounded rectangles, left-aligned text label (action description),
   right-aligned small effect preview (e.g., "战术执行 -8" in red, "团队凝聚 +5" in green).
   Buttons are dark (#252A3D background) with a subtle left border stripe indicating direction
   (positive = green stripe, neutral = blue stripe, risky = red stripe).
```

#### 3.4.3 中文补充说明

- 事件卡是最重要的叙事界面之一，文字质量比视觉更重要，但视觉框架需要支持快速阅读
- 顶部颜色条用于让玩家在 0.5 秒内判断事件是「好事/坏事/中性」
- 选项按钮右侧的效果预览（如「战术执行 -8」）用红绿色提示，帮助玩家做决策
- 模态背景模糊不遮挡太多，玩家知道自己还在杯赛支架界面
- 不需要任何球员插图/人像，仅用颜色芯片 + 文字标记玩家

#### 3.4.4 验收标准

- [ ] 事件卡为模态弹窗，背景可见但模糊
- [ ] 顶部有颜色条区分事件类型（红/蓝/绿）
- [ ] 事件标题大而清晰（22px+，粗体）
- [ ] 叙事文字为次级白色，不与标题抢视觉权重
- [ ] 选项按钮右侧有效果预览数值（颜色编码红绿）
- [ ] 无球员写实人像/照片

#### 3.4.5 情报事件卡变体 / Scouting Intel Event Card

在普通事件卡的基础上，有一种特殊变体：「侦察报告」——模拟教练赛前研究对手的行为。视觉上与普通事件卡有区别但不过度。

```
A scouting intel variant of the pre-match event card for a CS esports manager game.
This is a subtype of the S04 event card with distinct visual treatment.

DIFFERENCES from normal S04 event card:
  - TOP BADGE STRIP: uses the OPPONENT'S team accent color (not the standard red/blue/green)
    + a magnifying glass or crosshair icon (🔍) with label "侦察报告 / SCOUTING REPORT"
  - BACKGROUND: the card has a very subtle crosshair-grid pattern overlay
    (faint diagonal lines at 2% opacity white) — like a tactical overlay
  - The narrative text describes opponent patterns, e.g.:
    "Vitality 在本次杯赛前五局的默认战术成功率高达 78%，
     但他们的 B 点内场在压力局下暴露了沟通问题。"
  - One of the choice options may have a "教练风格专属" marker if it's a coach-style-exclusive option:
    a small pill badge in the right side of the button labeled e.g.
    "[战术大师专属 / TACTICIAN ONLY]" in the coach style's accent color
  - Effect previews on choice buttons use specific tactic/site names:
    e.g. "[B点进攻成功 +15%]" in green, "[不改变战术 凝聚 +3]" in blue

Everything else (modal backdrop, button styles, card structure) matches S04 exactly.
```

#### 3.4.6 中文补充说明（情报事件）

- 情报事件是 S04 中唯一使用对手队伍颜色的变体——让玩家立刻感知「这是关于他们的情报」
- 「教练风格专属」标记是游戏内唯一标明风格限制的地方——用于强化玩家对自己风格的意识
- 情报事件的按钮效果预览应该以具体战术地点命名（如 "B点"、"A大门"），增加真实感

---

### S05 — 比赛室 / Match Room

#### 3.5.1 界面功能描述

这是游戏最核心、最频繁使用的界面。  
比赛室展示一场 CS 比赛的「压缩文字叙事」，布局如下：

**顶部状态栏**
- 双方战队名称 + 当前比分（如 枪神队伍 1 – 2 Team Vitality）
- 比赛进程指示（第几局/Round，共5局）
- 超时按钮（如仍有超时机会）

**中央事件日志（核心区域）**
- 垂直滚动的「事件卡」序列（7-10张）
- 每张事件卡是一个圆角方块，包含叙事文字 + 末行数值变化
- 决策卡（玩家需要做选择的卡）与普通叙事卡有明显视觉区分

**底部决策区**
- 当触发决策时，底部出现选项按钮区
- 分两阶段：① 选经济（全买/半买/省钱）② 选战术（进攻方式）
- 决策区未触发时底部为空白（干净不干扰）

**右侧状态面板（可选/可折叠）**
- 显示当前队伍四维属性：火力总值、战术执行、凝聚力、纪律
- 数值在决策后实时小幅跳动更新

#### 3.5.2 AI 绘图提示词（英文）

```
A dark esports match simulation UI for a text-based Counter-Strike manager game — the "Match Room" screen.

Screen layout: full width, three vertical zones.

TOP BAR (height ~60px, dark panel #13151F, bottom border #252A3D):
Left side: "枪神队伍" team name with a small electric-blue (#3E6FFF) left-stripe indicator.
Center: large score display "1 – 2" with each digit in heavy mono font (40px), separated
by an em-dash. The team with more rounds has their score in brighter white; losing score
in lower opacity. Below scores: round progress dots — 5 small circles (filled = played,
empty = upcoming). Current round active dot pulses subtly.
Right side: "VS Team Vitality" with their yellow (#F5D800) color marker.
Far right: if timeout available, a small rectangular "暂停 / TIMEOUT" button with a timer icon.
If timeout is spent, button is grey with strikethrough styling.

MAIN EVENT LOG (central area, ~70% height, scrollable vertical list):
Background: deep dark (#0D0E14).
Event cards appear as rounded rectangle blocks (#13151F, border-left 3px solid depending on type)
stacked vertically with 8px gap. Each card:
— left border stripe color: blue for neutral events, green for positive, red for negative,
  gold (#F4B942) for player decision cards.
— card header: small UPPERCASE type label (e.g., "ROUND 2 · OPENING"), grey secondary text.
— card body: 2-4 lines of narrative text in white (#E8EBF5), 14px.
— card footer: compact delta line in small mono font, green for positive values, red for negative.
  e.g., "↑ 团队配合 +4   战术执行 +2"

DECISION CARD (gold border-left, slightly larger card):
Shows the same structure but with an added choice area:
— situation description text.
— 2-4 choice buttons stacked, full width, dark fill, left text label, right faint effect hint.
— After choosing: the card expands downward to show the battle resolution text + stat delta line.

BOTTOM DECISION PANEL (appears only during player turn, ~90px tall, dark panel #13151F):
Hosts economy step OR tactic step buttons.
Economy step: three buttons: "全买 / FULL BUY", "半买 / PARTIAL BUY", "省钱 / ECO"
each with a small icon and one-line description beneath.
Tactic step: 4-5 buttons with short CS-style tactic labels.
Inactive state: empty panel, no elements, fully dark.

RIGHT SIDE PANEL (narrow ~180px, fixed):
Four team stat readouts stacked:
— FIREPOWER 火力: number + small horizontal bar
— TACTICS 战术执行: number + small horizontal bar
— COHESION 凝聚力: number + small horizontal bar
— DISCIPLINE 纪律: number + small horizontal bar
Each bar fills accent blue; numbers update with small animation on change (brief flash).

Overall atmosphere: focused, information-dense, dark cockpit aesthetic.
Like a competitive intelligence terminal, not a sports broadcast.
```

#### 3.5.3 中文补充说明

- 比赛室是「文字游戏」，文字本身就是核心内容，界面设计应该服务于阅读体验
- 事件卡的左边框颜色区分是识别信息类型的关键视觉语言，必须一致
- 决策卡（金色边框）要在视觉上「比普通卡片更重」，让玩家立刻知道「这里要做决定了」
- 底部决策区在没有待决策内容时要完全空白干净，不占用空间，不分散注意力
- 比分区域的字体要大而清晰，玩家的第一眼应该知道当前比分
- 右侧面板的数值变化要有小动画（轻微闪烁），让玩家感受到状态在变化
- 超时按钮：使用过后变灰，视觉上要很明显「已消耗，不可再用」

#### 3.5.4 验收标准

- [ ] 顶部比分栏清晰显示双方队名 + 比分，双方分数有颜色/亮度区分
- [ ] 5个局数进度圆点可见，已结束局与未来局有视觉区分
- [ ] 事件卡按类型有不同左边框颜色（蓝/绿/红/金）
- [ ] 决策卡（金色边框）比普通叙事卡更醒目（可通过边框粗细、背景色深浅实现）
- [ ] 底部决策区在无决策时为空白，不显示任何元素
- [ ] 右侧4个团队属性数值可见，带进度条
- [ ] 超时按钮「已使用」状态为明显禁用样式

#### 3.5.5 暂停子界面 / Timeout Sub-Screen

暂停不是简单的按钮——它是一场比赛中唯一的紧急干预手段，应有一个独立的子界面。

**触发时机**：系统检测到以下危机/转折点时弹出暂停提示：
- 选手 trait 触发危机（如 hot_blooded 导致内讧）
- 队伍 morale 骤降
- 对手进入 hot form
- 对手连胜两局

**子界面设计**：模态弹窗（背景暗化 + 12px 模糊）。暂停弹窗规格：宽 520px，居中。

```
A dark timeout sub-screen modal for a CS esports manager game — the "Timeout" overlay.

The background is the current match room with 75% dark overlay + 12px blur.
A centered modal card (#13151F, border 2px gold #F4B942, border-radius 8px):

TOP STRIP: "⏱ 暂停 / TIMEOUT" in gold (#F4B942) header, bold 22px, centered.
Below: a one-line context label explaining WHY the timeout was triggered:
  "donk 的情绪正在影响团队沟通" in italic secondary text.
Below context: "你只有一次暂停机会" in small red warning text, centered.

TIMEOUT OPTIONS (2-4 choice cards, stacked vertically):
Each option is a rounded card (#1A1E2E) with:
  - Left edge: colored stripe (blue=战术调整, green=心理安抚, orange=激进激励)
  - Title: bold 16px white text, e.g. "战术调整 / TACTICAL RESET"
  - Description: 2 lines of 13px secondary text explaining effect
  - Right side: small effect preview badge, e.g. "[战术执行 +12]" green
  - Hover: card elevates slightly (shadow increase)

BOTTOM: an additional small card option — "不使用暂停 / SKIP TIMEOUT"
  in darker, smaller style. This is always available.

After choosing: the card expands with resolution text ("暂停效果：战术执行恢复至...")
and a small "关闭 / CLOSE" button appears.

The overall feeling: a high-stakes emergency meeting. The gold border tells the player
this is special — you don't get this again. Make it count.
```

**教练风格影响暂停选项**：
- Tactician：多一个战术专属选项，选项值为蓝色边框
- Man Manager：心理安抚选项效果翻倍
- Gambler：多一个高风险选项（50% 概率大成功/大失败）
- Disciplinarian：多一个纪律强化选项

#### 3.5.6 经济指示器 / Economy Indicator

比赛中队伍经济状态需要在右上角视觉呈现，帮助玩家理解当前可用的购买选项。

```
Economy indicator specs:
  - Position: right side of the top bar, beside score display
  - Design: a small pill-shaped badge with team icon and money tier label
  - Tier labels and colors:
    💰 FULL BUY / 全买     → green (#28D99E) background pill, white text
    🔧 HALF BUY / 半买     → yellow (#F4B942) background pill, dark text
    💸 ECO / 经济局        → grey (#555) background pill, white text
    🆘 FORCE BUY / 强起    → orange (#FF6B00) background pill, white text
  - Font: 11px condensed, bold
  - Both teams show their economy tier individually
  - When economy changes mid-match: brief flash animation (200ms opacity pulse)
```

#### 3.5.7 局数进展与残局状态 / Round Progress & Clutch State

**局数进展圆点**（已在顶部比分栏中定义，补充动效细节）：
```
Round dots refinement:
  - 5 dots total, representing best-of-5 (first to 3 wins)
  - Played rounds: filled white dots
  - Current round: blue (#3E6FFF) dot with subtle pulse (opacity 0.8 ↔ 1.0, 1.2s cycle)
  - Upcoming rounds: dark hollow circles (#252A3D)
  - Match point (2-0 or 2-1 scenarios): the dot for the potential winning round
    gets a faint gold ring (#F4B942) outside the dot
  - When a round ends: the completed dot fills with a brief 150ms glow animation
```

**残局状态指示器**（当事件卡描述残局时）：
```
Clutch state indicator:
  - Appears as a small badge INSIDE the event card header row
  - Format: "[1v3]" or "[1v2]" etc., enclosed in brackets
  - Color: gold (#F4B942) for player team clutch attempts, grey for opponent
  - Font: 12px bold mono (JetBrains Mono)
  - Position: right side of the event card header row
  - Only appears on event cards that describe clutch scenarios
```

---

### S06 — 赛后小结 / Post-Match Summary

#### 3.6.1 界面功能描述

一场比赛结束后的简短总结界面。  
展示：
- 最终比分（大字显示）
- 本场 MVP（最佳球员，姓名 + 高亮）
- 关键决策回顾（2-3行，说明哪个战术选择起了决定性作用）
- 资源变化小结（如「获得奖金 +15」「团队凝聚 +3」）
- 继续按钮（→ 返回杯赛支架）

#### 3.6.2 AI 绘图提示词（英文）

```
A dark post-match summary screen for a Counter-Strike esports manager game.

The screen uses a clean centered card layout on dark background (#0D0E14).
A large result banner at the top:

VICTORY STATE: a subtle wide horizontal strip in dark green-tinted (#1A3528) behind the score,
with "VICTORY · 胜利" text in a large all-caps bold header, color #28D99E.
DEFEAT STATE: the same banner in dark red-tinted (#2E1A1A), text "ELIMINATED · 出局" in #E84545.

Below the banner: the final match score in extra-large bold mono font — e.g., "3 — 1"
where each number is approximately 64px, centered. The player's team score is on the left,
bright; opponent's score on right, dimmer.

Then a section labeled "MVP · 最有价值球员" with a horizontal card:
— a colored team badge circle (player's team color)
— player name in large bold white
— a single line describing their contribution: e.g., "4 clutch moments · 战术执行最高 +22"
The MVP name has a subtle gold shimmer/glow (#F4B942).

Below MVP: "关键决策 / KEY CALLS" section — 2-3 rows, each row a short sentence
with a colored indicator:
— green check (✓) for a tactic that worked
— red cross (✗) for a mistake or counter-struck plan
Example rows:
  "✓ A点假动作成功骗到旋转 — 战术执行 +12"
  "✗ 第三局买枪过于保守 — 装备质量 -8"

Below key calls: "资源变化 / RESOURCES" — small horizontal chips with +/- values
(cohesion, discipline, prize money) in colored monospaced text.

Bottom: a full-width primary button "继续 / CONTINUE" in accent blue (#3E6FFF),
large and clearly tappable, right-anchored with an arrow icon →.
```

#### 3.6.3 中文补充说明

- 胜利状态用深绿色调，失败状态用深红色调，颜色区分是第一视觉信号
- 比分字体要是全屏幕最大的文字元素（64px+），让玩家第一眼就看到结果
- MVP 区域的金色发光效果是本界面唯一允许的「华丽」元素
- 关键决策回顾是让玩家「学习」的地方，每一行都要有可见的数值影响
- 界面应当简洁，玩家 10 秒内可以读完所有信息

#### 3.6.4 验收标准

- [ ] 胜利/失败状态有明显颜色区分（绿调 vs 红调）
- [ ] 最终比分为全界面最大文字，位置醒目
- [ ] MVP 球员有金色高亮效果
- [ ] 关键决策列表每行有颜色编码指示符（✓绿 / ✗红）
- [ ] 资源变化数值清晰可读
- [ ] 「继续」按钮为蓝色，位置明显，无需滚动即可看到

---

### S07 — 转会窗口 / Transfer Window

#### 3.7.1 界面功能描述

杯赛与杯赛之间，玩家可以进行球员交易。  
界面展示：
- 左侧：当前战队6名球员（可选择要交出的球员）
- 右侧：其他7支AI战队的球员池（可选择目标球员）
- 中央/底部：交易构建区（我方出：X球员 + Y金额；对方给：Z球员）
- 交易价值评估器（显示双方价值是否平衡）
- 球员意愿指示器（目标球员是否愿意转会）

#### 3.7.2 AI 绘图提示词（英文）

```
A dark transfer negotiation screen for a Counter-Strike esports manager game — the "Transfer Window".

Three-panel horizontal layout on dark base (#0D0E14):

LEFT PANEL "我方战队 / MY SQUAD" (~30% width):
Dark panel (#13151F) with header "枪神队伍" in electric blue above.
Six player rows (5 starters + 1 sub), each row: team color dot, name, firepower/tactics mini-stats,
and a small "提出 / OFFER" button on the right.
Selected/offered player row is highlighted with a blue left-stripe and slightly elevated brightness.

CENTER PANEL "交易台 / TRADE DESK" (~40% width):
At the top: a visual trade builder — two sides separated by a large "⇄" exchange icon.
Left side "我方给出 / OFFERING": shows selected player chip + money input field.
Right side "我方要求 / REQUESTING": shows the target player chip.
Money input: dark rounded rectangle, white number in center, +/- buttons on sides.

Below the trade builder: a "交易价值 / TRADE VALUE" balance meter —
a horizontal bar with a center point; left side extends green when the offer is fair or generous,
right side extends red when the offer undervalues the target.
Below the balance meter: "意愿指数 / WILLINGNESS" — a small circular gauge filled
from 0-100%, with color: green above 60%, yellow 30-60%, red below 30%.
Text label explains why: e.g., "对方不满足于降级项目" or "对对顶级舞台感兴趣".

At the bottom of the center panel: "发送报价 / SEND OFFER" button in accent blue,
and "重置 / RESET" text link below.

RIGHT PANEL "目标球员 / AVAILABLE PLAYERS" (~30% width):
A scrollable list of players from other teams, with team name subheaders.
Each row: team color dot, player name, stats bars, price, and a "选择 / SELECT" button.
Selecting adds them to the center panel's REQUESTING side.
```

#### 3.7.3 中文补充说明

- 转会界面要让玩家感受到「谈判」的张力，价值平衡条和意愿指数是关键情绪反馈
- 价值平衡条偏向「我给太多」是绿色，偏向「我给太少」是红色，让玩家自己感知
- 意愿指数是这个界面最有趣的元素，要用易理解的视觉（圆形进度或数字条）
- 不需要任何球员人像，仅用颜色芯片+文字

#### 3.7.4 验收标准

- [ ] 三栏布局清晰：我方战队 / 交易台 / 目标球员
- [ ] 交易台中「我方给出」与「我方要求」两侧视觉对称
- [ ] 价值平衡条可见，有颜色编码（绿色/红色偏移）
- [ ] 意愿指数可见，有颜色变化
- [ ] 「发送报价」按钮清晰可操作
- [ ] 右侧球员列表按队伍分组显示

#### 3.7.5 竞标事件 / Bidding War Overlay

当多个 AI 队伍同时对同一球员出价时，触发竞标弹窗。这是一个特殊事件，复用 S04 的模态弹窗框架但内容不同。

```
A bidding war modal overlay for a CS esports manager game — the "Bidding War" screen.

BACKGROUND: dark semi-transparent overlay (75% + 12px blur) over the transfer window.

CENTERED MODAL (#13151F, border 2px gold #F4B942, border-radius 8px, width ~560px):

TOP STRIP: "⚔ 竞标争夺 / BIDDING WAR" in gold (#F4B942), bold 22px.
Below: the target player's name in large white bold (24px), with team color dot.
Below name: a small row showing the player's key stats (firepower bar + tactics bar, compact).

COMPETING BIDS SECTION:
A stacked list of bid cards. Each bid card represents one bidding team:
  - Left: team color dot + team name in bold
  - Right: their bid amount in mono font (e.g., "$85,000")
  - The player's OWN team bid card is highlighted with blue (#3E6FFF) left-stripe
  - Current highest bid: the card has a subtle gold glow border
  - Each card height: 40px, dark fill #1A1E2E

PLAYER'S RESPONSE SECTION (below the bid list):
Three choice buttons:
  - "加价 / RAISE BID" (+$5,000 increments): blue button, shows new total
  - "维持报价 / HOLD": white outlined button, with risk text "对方可能加价"
  - "放弃竞标 / WITHDRAW": small dark text link, red on hover

CURRENT STATE INFO (thin strip below bids):
  "当前最高出价: [Team Name] — $X | 你的出价: $Y | 差距: -$Z" in mono font

RESOLUTION (after all rounds):
Winner announcement: centered text + player name in gold.
If player wins: "竞标成功！[Player] 加入枪神队伍" + player card + cost deduction.
If player loses: "[Team] 以 $X 拿下 [Player]" + a note about the player being unavailable.

The modal should feel tense — multiple rounds of back-and-forth. Each round should
show bids being updated in real time (brief number flash animation).
```

#### 3.7.6 中文补充说明（竞标）

- 竞标界面的张力在于「对手也在加价」——每次加价后等待对手反应的间隙是最紧张的时刻
- 竞标最多 3 轮，每轮所有 AI 队伍同时更新出价
- 如果玩家放弃或失败，该球员在本次转会窗口中不可再报价（红锁标记）
- 竞标弹窗的视觉语言偏向金融/拍卖感——用数字和对比驱动情绪，不用花哨特效

---

### S08a — 年度颁奖典礼 / Annual Awards Ceremony

#### 3.8a.1 界面功能描述

每个完整赛季（三个杯赛全部结束后），在最终杯赛颁奖（S03b Major）之后、赛季总结（S08b）之前，进行年度颁奖典礼。这是整个游戏最具 HLTV 年度 TOP 20 仪式感的界面。

**必有内容：**

**板块一：年度最佳俱乐部 / CLUB OF THE YEAR**
- 基于三杯赛综合战绩（冠军数量→胜率→决赛出场率）评选
- 全区 8 支战队中选出 1 支
- 展示：最佳俱乐部名称 + 巨大队徽颜色标识 + 赛季成绩摘要（三杯名次）
- 如果玩家「枪神队伍」获奖 → 金色庆祝氛围；未获奖 → 尊重展示获奖者

**板块二：年度 TOP 10 选手 / ANNUAL TOP 10 PLAYERS**
- 模仿 HLTV 年度 TOP 20 的揭榜节奏
- 从第10名开始逐行揭示到第1名
- 每行包含：排名数字、选手姓名、所属战队颜色标记、年度综合评分、代表杯赛高光关键词
- 排名 1/2/3 用金/银/铜色区分

**叙事节奏设计（与普通排行榜不同）：**
- 整个界面是一场「揭榜仪式」
- 玩家队伍如果有选手上榜，玩家会期待看到自己队员的名字在第几位
- 如果没有选手上榜，也是一种叙事暗示：「你的阵容还不够强」
- TOP 1 揭示是界面高潮，名字用最大字号 + 最亮金色

**数据来源：** 年度影响力评分，综合三个杯赛中的 match impact、MVP events、clutch events、cup placement、consistency 加权计算。

#### 3.8a.2 AI 绘图提示词（英文）

```
A grand annual awards ceremony screen for a Counter-Strike esports manager game —
the "Annual Awards" screen. This screen is the midpoint emotional peak between
cup gameplay and season summary. It should feel like an HLTV-style award reveal.

The screen uses a ceremonial full-width vertical layout on dark background (#0D0E14),
scrolling naturally. Two major sections stack vertically.

SECTION 1 — CLUB OF THE YEAR (top, ~35% screen height):
A wide dark panel (#13151F) with a subtle gold gradient border-top.
At the panel top: a small gold label "★ 年度最佳俱乐部 · CLUB OF THE YEAR ★"
in centered gold (#F4B942) all-caps text, 12px.

Below the label: the winning team displayed prominently.
— A large team color circle (48px) in the center, filled with the winning team's accent color,
  with a subtle gold outer ring/glow.
— Below the circle: team name in LARGE bold display font (36-40px), centered.
  If the player's "枪神队伍" wins: the name has gold text + electric-blue underline accent.
  If another team wins: the name is in white bold, team color accent line below.
— Below the name: a compact three-column result summary showing:
  [IEM Katowice result icon]  [IEM Cologne result icon]  [Major result icon]
  Each icon is a small trophy/medal with color: gold for champion, silver for runner-up,
  bronze for semifinal, plain for quarterfinal.
— Below results: a one-line narrative text in italic secondary white, e.g.:
  "一个赛季，三座奖杯，无可争议的统治力。" / "以稳定和深度征服了全年赛程。"
— If the player's team DID NOT win: the panel still shows the winner prominently,
  but the player's team name appears in a smaller "枪神队伍 — 年度第X名" tag
  at the bottom-right of the card, as an honorable mention.

SECTION 2 — ANNUAL TOP 10 PLAYERS (bottom, ~65% screen height):
A large dark panel (#13151F) with header row:
"年度 TOP 10 选手 · ANNUAL TOP 10 PLAYERS" in gold (#F4B942) centered header,
with subtitle "基于全年赛事影响力综合评定" in small secondary text.

Below the header: 10 player rows in a descending reveal order (10 → 1),
designed to create an "award reveal" rhythm.
Each row is a horizontal dark card (#13151F with slight bottom border #252A3D), height 56px:

ROW DESIGN (for ranks 10 down to 4):
— Left: rank number (e.g., "10") in bold white mono font, 24px, in a small dark square cell.
— Center: player's team color dot (12px), player NAME in white bold, team name in secondary text,
  and a single-line highlight keyword in gold, e.g., "IEM Cologne 决赛 MVP" or "年度最多残局".
— Right: a circular impact score badge — a small ring gauge filled to the player's score/100,
  with the number inside. Gauge color: green > 85, blue 70-85, grey < 70.

ROWS 3, 2, 1 (podium ranks) — progressively larger visual treatment:
— RANK 3 (Bronze): rank number "3" in bronze (#CD7F32) tinted text, slightly larger font.
  Player name + team dot. Row has subtle bronze left-stripe.
— RANK 2 (Silver): rank number "2" in silver (#C0C0C0) tinted text, slightly larger than #3.
  Player name in slightly larger bold. Row has subtle silver left-stripe.
— RANK 1 (Gold / TOP PLAYER OF THE YEAR):
  This row spans full width of the panel and has extra height (72px).
  Background of the row has a very subtle gold radial gradient glow behind it.
  Left: rank number "1" in LARGE gold text (32px), with a gold star icon (★) beside it.
  Center: player team color dot (16px larger), player NAME in LARGE bold gold text (28px),
  team name in secondary below.
  Right: a gold-rimmed impact badge with the highest score, and a small "年度最佳 / PLAYER OF THE YEAR"
  label beneath in gold. A faint gold shimmer effect (CSS animation) traces along the row edges.

If a player from the user's "枪神队伍" appears in the TOP 10:
their team dot has an additional electric-blue outer ring for instant player recognition.
Any number of player's team members can appear — from zero to multiple.

BOTTOM NAVIGATION:
A wide info strip: "榜单数据基于三杯赛综合影响力加权计算 · 影响因子: 杯赛成绩 30% / MVP事件 25% / 残局 20% / 稳定性 15% / 位置调整 10%"
in very small secondary text — this gives players transparency into the ranking logic.

Below: a "继续 / CONTINUE" button in accent blue (#3E6FFF), centered.
Small text hint below: "→ 查看赛季详细总结"
```

#### 3.8a.3 中文补充说明

- 这是游戏中最「仪式化」的界面。排名揭示的节奏要像颁奖典礼
- TOP 10 逐行展示时（如果有动画），应该从第10名开始依次出现，每人间隔 600-800ms，营造悬念
- 如果玩家选了一个选手，结果他排在了第2，那种「差一点就第一」的感觉，比没上榜更有叙事价值
- 如果玩家队伍有1个球员上榜而其他战队占了9个，也是一种好故事——「你的队伍有一块宝石，但还不够」
- 如果玩家队伍有3个以上球员上榜——说明你的阵容很强，这为下赛季决策提供了信心
- 最佳俱乐部可以独立于 TOP 10 选手——一支俱乐部可能没有年度第一选手，但靠团队拿到了最佳俱乐部

#### 3.8a.4 年度颁奖叙事引导文本

```
// 最佳俱乐部揭晓
面板开场白（始终显示）:
  "经过 Katowice、Cologne 和 Major 三站赛事的完整赛季，年度最佳俱乐部揭晓——"

玩家获奖时:
  "枪神队伍。三个杯赛，X个冠军，Y次决赛。这支队伍定义了这一年的CS格局。"
  
玩家未获奖时:
  "恭喜 [冠军俱乐部]。一个现象级的赛季。枪神队伍以第X名的成绩结束了全年征程。"

// TOP 10 排名叙事
排名10-4（标准揭示）:
  "第N名：[选手名]。[高光关键词]。他在 [某杯赛] 的表现令人难忘。"

排名3（铜牌）:
  "第三名：[选手名]。他是 [战队长] 的基石，全年稳定输出，在关键局从不手软。"

排名2（银牌）:
  "第二名：[选手名]。离最高荣耀只差一步。他的 [某场表现] 是全年最精彩的个人表演之一。"

排名1（金牌/年度最佳）:
  "年度最佳选手：[选手名]。从 Katowice 到 Major，他是这个星球上最好的CS选手。没有之一。"
```

#### 3.8a.5 验收标准

- [ ] 「年度最佳俱乐部」板块清晰可见，包含队伍名称 + 颜色标记 + 三杯成绩摘要
- [ ] TOP 10 选手列表完整展示，1/2/3名有金/银/铜色编码
- [ ] 第1名选手行有金色视觉强化（最大字号、最大行高、金色辉光效果）
- [ ] 玩家「枪神队伍」的选手上榜时有蓝色额外圆环标记
- [ ] 排名揭示顺序正确：从第10名到第1名（如实现动画）
- [ ] 底部有排名算法说明（影响因子权重），小字展示
- [ ] 「继续」按钮为蓝色，提示「→ 查看赛季详细总结」

---

### S08b — 赛季总结 / Season Summary

#### 3.8b.1 界面功能描述

一个完整赛季（三个杯赛 + 年度颁奖已展示后）的最终回顾界面。  
年度颁奖（S08a）已经揭晓了最佳俱乐部和 TOP 10，本界面聚焦于 **杯赛成绩回顾 + 赛季高光 + 赛季决策**。
包含：
- 三个杯赛的结果摘要（冠军/亚军/四强/八强），视觉上与杯赛颁奖呼应但不重复
- 赛季最佳时刻（2-3个最具代表性的比赛事件摘录）
- 赛季奖金汇总 + 当前团队状态快照
- 「进入下一赛季」或「结束本次旅程」按钮

#### 3.8b.2 AI 绘图提示词（英文）

```
A dark season summary report screen for a Counter-Strike esports manager game — the "Season Summary".
This screen appears AFTER the annual awards ceremony, so it does not repeat the TOP 10 ranking.

Full-screen layout with a slight top-center title header and three content zones below.

TOP HEADER: "赛季 1 总结 / SEASON 1 WRAP" in large condensed header font,
subtitle: "三个杯赛 · 你的执教战绩" in smaller secondary color text.

ZONE A — CUP RESULTS (top row, three equal-width panels):
Three card panels side by side representing IEM Katowice, IEM Cologne, and Major.
Each panel: tournament name at top with a small stylized trophy/emblem icon.
Result label: "冠军 CHAMPION", "亚军 RUNNER-UP", "四强 SEMIFINAL", or "八强 QUARTERFINALIST",
with corresponding achievement color (gold for champion, silver for runner-up,
bronze for semi, grey for quarter).
Below result: the finalist/winner team names in small text.
If the player won a cup: the panel has a subtle gold accent border glow.

ZONE B — SEASON HIGHLIGHTS (center, 3 horizontal cards side by side):
Three highlight cards. Card format: bold title + 1-2 sentence event text + small delta numbers.
Example cards:
— "赛季最佳战术 / BEST TACTICAL CALL": green-tinted card, 1-line summary of the player's
  best tactical decision across all cups.
— "最惨烈崩盘 / WORST COLLAPSE": red-tinted card, 1-line summary of the most painful loss.
— "最具价值选手 / YOUR MVP": neutral blue-tinted card, the player's team member with the
  highest overall season impact, with gold name text.

ZONE C — SEASON FINANCES & ROSTER SNAPSHOT (bottom):
A compact summary panel (#13151F):
— Left: "赛季收入 / SEASON EARNINGS": total prize money from all 3 cups, displayed as a
  large number + label. Below it: a mini breakdown per cup.
— Middle: "团队状态 / SQUAD STATUS": four mini stat bars (Firepower / Tactics / Cohesion / Discipline)
  in compact horizontal format, showing final state after all cup effects.
— Right: "转入 / 转出": transfer summary for the season — players in / out indicators.

BOTTOM ACTIONS: two buttons.
"下一赛季 / NEXT SEASON" in accent blue (#3E6FFF) primary button (right)
"结束旅程 / END CAREER" in outlined secondary style (left)
```

#### 3.8b.3 中文补充说明

- 本界面不再展示年度 TOP 10（已在 S08a 完成），专注于玩家自身的赛季回顾
- 三个杯赛卡片的金色冠军标识与杯赛颁奖（S03b）呼应，但不重复 MVP 信息
- 赛季高光卡片是叙事内容，要有正面/负面区分，让玩家情绪有起伏
- 赛季收入是玩家核心关心的数值（能用来买人），要大而且清晰
- 团队状态快照是一个「参考面板」——让玩家在决定是否进入下一赛季前，评估自己队伍的实力

#### 3.8b.4 验收标准

- [ ] 三个杯赛卡片展示对应结果，冠军卡有金色视觉处理
- [ ] 赛季高光卡片 3 张，有正面/负面色调区分
- [ ] 赛季总收入大数字 + 奖金明细清晰可读
- [ ] 团队状态四维快照可见
- [ ] 「下一赛季」按钮为主蓝色，「结束旅程」为次要样式
- [ ] 整体排版比赛中界面更宽松，留白适当
- [ ] 不再展示 TOP 10 选手排行（已移至 S08a）

---

### S09 — 生涯总结 / Career Chronicle

#### 3.9.1 界面功能描述

三个赛季全部结束后的终局界面，是整个游戏体验的情感高潮。  
展示：
- 总冠军数量（0-9个）
- 生涯年表（一条时间轴，记录每个赛季每个杯赛的关键时刻）
- 最佳球员 / 最佳战术决策 / 最惨崩盘 / 特殊奖项
- 执教评级（S/A/B/C/D）+ 一段个性化评语
- 分享/重玩按钮

#### 3.9.2 AI 绘图提示词（英文）

```
A grand cinematic career summary screen for a Counter-Strike esports manager game — the "Career Chronicle".

The screen should feel like an end-game award ceremony — still dark, but with more gravitas and
slightly warmer gold accent compared to the rest of the game.

BACKGROUND: same deep dark (#0D0E14) base, but with faint subtle diagonal grid lines
(very low opacity, 3-4% white) giving a slight data-visualization texture.
Optional: a very faint large "枪神队伍" watermark text diagonally across the center background.

TOP SECTION — CHAMPIONSHIP TALLY:
Three rows, one per season. Each row shows three small trophy icons (or grayed circles for losses).
Filled trophies in gold (#F4B942). Total championship count in huge display font center-top.
e.g., "5" in 96px bold, with label "CUPS WON · 总冠军" below it.

MIDDLE SECTION — CAREER TIMELINE:
A horizontal or slight-diagonal timeline graphic. Key events appear as dots on the line,
with short labels above/below alternating:
— gold dot + bold text for championship wins
— red dot + italic text for major collapses
— blue dot for key player events (MVP, hot form)
— grey dot for early exits
Timeline is drawn as a thin glowing line with dots, from left (Season 1) to right (Season 3).

ACHIEVEMENT CARDS (2×2 grid below timeline):
Four small dark cards, each with an icon and label:
— "最佳球员 / BEST PLAYER": player name in gold
— "最佳战术 / BEST CALL": 1-line summary
— "最惨崩盘 / WORST COLLAPSE": 1-line summary in red tint
— "执教评级 / RATING": large letter grade (S/A/B/C/D) in corresponding color

MANAGER COMMENT (full-width text block):
A 2-3 sentence manager's personal rating quote in italic serif-style text,
in soft white on a very slightly elevated panel.
e.g., "你在压力下展现出战略眼光，但顶级球员的培育仍需时间。职业生涯继续书写中..."

BOTTOM ACTIONS:
Center: "再来一局 / PLAY AGAIN" in large accent blue primary button.
Small text below: "你的生涯已自动保存。"
```

#### 3.9.3 中文补充说明

- 这是游戏的情感高潮，可以比其他界面稍微「华丽」一点，但依然不堆砌特效
- 冠军总数字是这个界面的主视觉，要做到最大、最突出
- 时间轴是本界面最有创意的元素，让三年历程一眼可见
- 执教评级的字母（S/A/B/C/D）颜色：S=金色、A=绿色、B=蓝色、C=橙色、D=红色
- 管理者评语段落是纯文字内容，字体可以用斜体，营造「结案陈词」的仪式感

#### 3.9.4 验收标准

- [ ] 冠军总数为最大视觉元素，使用 96px+ 字体
- [ ] 生涯时间轴可见，有颜色编码节点（金/红/蓝）
- [ ] 四项成就卡片全部可见（最佳球员/最佳战术/最惨崩盘/执教评级）
- [ ] 执教评级字母（S/A/B/C/D）有对应颜色区分
- [ ] 管理者评语段落存在，样式与正文不同（斜体/轻微区别）
- [ ] 「再来一局」按钮为主蓝色，位置明显

---

### S10 — 存档管理 / Save Manager

#### 3.10.1 界面功能描述

游戏在任意时刻可通过暂停菜单（ESC）打开存档管理界面。支持 3 个存档槽位，不自动存档（玩家需要手动保存）。

**核心功能：**
- 保存当前游戏到某个槽位
- 从已有存档加载游戏
- 删除存档（带确认）
- 查看每个存档的基本信息（赛季、杯赛进度、游戏内时间）

#### 3.10.2 AI 绘图提示词（英文）

```
A dark save/load management screen for a Counter-Strike esports manager game —
the "Save Manager" accessible from the pause menu at any time.

LAYOUT: centered card on dark background (#0D0E14), width ~520px.
Top navigation area shows "存档管理 / SAVE MANAGER" in white bold.

THREE SAVE SLOT CARDS (stacked vertically, each 72px height):
Each slot is a rounded rectangle (#13151F, border #252A3D, border-radius 6px):

EMPTY SLOT:
  - Center: large empty slot number "存档槽 1 / SLOT 1" in secondary text (#7A849E)
  - Right: a "保存 / SAVE" button in outlined blue style
  - Dotted border interior

FILLED SLOT (left-to-right layout):
  - Far left: slot number badge "1" in small dark circle
  - Info column:
    * Top line: save timestamp "2027-06-25 15:30" in white, bold 14px
    * Second line: game progress summary compact text, e.g.
      "赛季 1 · IEM Katowice 赛前 · 枪神队伍" in secondary text, 12px
    * Third line (optional): small stat pills showing key numbers:
      "[预算: 45] [凝聚: 72] [纪律: 83]" in tiny mono text, 10px
  - Far right: two small action buttons stacked:
    * "加载 / LOAD" — blue (#3E6FFF) small button
    * "删除 / DELETE" — red (#E84545) small text link

SAVE CONFIRMATION DIALOG (when saving, a sub-modal):
  Small centered card (#1A1E2E) asking:
  "覆盖此存档？/ OVERWRITE THIS SAVE?"
  With "确认 / CONFIRM" in blue and "取消 / CANCEL" in grey.

DELETE CONFIRMATION DIALOG:
  Small centered card with red left-border:
  "删除此存档？此操作不可撤销。"
  With "删除 / DELETE" in red and "取消 / CANCEL" in grey.

LOADING INDICATOR (brief, appears after clicking LOAD):
  Centered "正在加载... / LOADING..." text + thin blue progress bar (as defined in 1.8).

The overall feel: utilitarian, clean, reliable. This is a functional tool, not a
cinematic moment. But it should still match the dark esports aesthetic.
```

#### 3.10.3 中文补充说明

- 存档界面是功能性界面，不需要仪式感
- 三个槽位足够——不要让玩家在槽位管理中浪费时间
- 删除确认弹窗必须用红色强调，避免误删
- 存档信息摘要（赛季/杯赛/进度）要足够具体，让玩家在几个月后打开也能回忆起这是哪个存档
- 不显示存档缩略图或截图预览（v0.1 无此需求）

#### 3.10.4 验收标准

- [ ] 三个存档槽位清晰可区分
- [ ] 空槽位显示虚线边框+「保存」按钮
- [ ] 已用槽位显示时间戳+进度摘要+操作按钮（加载/删除）
- [ ] 保存时有确认弹窗「覆盖此存档？」
- [ ] 删除时有确认弹窗（红色警告样式）
- [ ] 界面可在任意时刻通过暂停菜单呼出

---

## 四、通用组件规范
## Shared Component Specs

### 4.1 球员行 / Player Row Component

```
用于：征召室、转会窗口、赛季排行
规格：高度 48px，水平布局
内容：[队伍颜色圆点 12px] [姓名 bold 14px] [属性条组] [价格 badge] [特质标签]
属性条：宽 60px × 高 6px，蓝色填充 #3E6FFF on 深灰轨道
特质标签：高 18px，8px 圆角，字号 10px，仅显示边框颜色（不填充），最多2个标签
```

### 4.2 事件卡 / Event Card Component

```
用于：比赛室
规格：圆角 6px，内边距 12px 16px，左边框 3px
边框颜色系统：
  - 蓝色 #3E6FFF：中性叙事事件
  - 绿色 #28D99E：正向事件（加成、优势）
  - 红色 #E84545：负向事件（失误、危机）
  - 金色 #F4B942：玩家决策卡（需要做选择）
底部数值行：等宽字体 11px，正值绿色，负值红色，用 ↑↓ 前缀
```

### 4.3 数值变化动效规范

```
属性值发生变化时：
  - 持续时间：200ms
  - 效果：数字短暂变为对应颜色（正值绿色闪，负值红色闪），然后回到白色
  - 进度条：平滑宽度过渡 200ms ease-out
  - 禁止：弹性动效、震动动效、放大缩小
```

### 4.4 队徽颜色芯片规范

```
所有展示队伍的地方使用统一的视觉标记：
  - 形状：12px × 12px 正圆形
  - 颜色：见 1.3 节团队颜色表
  - 不需要文字 logo，不需要队伍图形 logo（v0.1 无版权需求）
```

---

## 五、技术实现备注（给开发者）
## Implementation Notes

### 5.1 CSS 变量建议

```css
:root {
  --bg-base:        #0D0E14;
  --bg-panel:       #13151F;
  --bg-border:      #252A3D;
  --text-primary:   #E8EBF5;
  --text-secondary: #7A849E;
  --accent-blue:    #3E6FFF;
  --danger:         #E84545;
  --success:        #28D99E;
  --gold:           #F4B942;

  --radius-card:    6px;
  --radius-btn:     4px;
  --shadow-panel:   0 4px 16px rgba(0,0,0,0.5);
  --transition-ui:  150ms ease-out;
}
```

### 5.2 字体加载建议

```html
<!-- 优先加载 Inter（西文正文）和 Barlow Condensed（标题）-->
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<!-- 中文字体使用系统字体回退：'PingFang SC', 'Microsoft YaHei', sans-serif -->
```

### 5.3 图标库建议

使用 `Phosphor Icons` 或 `Lucide Icons`（线性风格，开源）  
所有图标使用 outline 样式，尺寸 16×16 或 20×20。

### 5.4 响应式目标

主要目标分辨率：1920×1080（16:9 标准）  
最低支持：1280×720  
不需要移动端适配（v0.1 桌面浏览器优先）

---

## 六、美术验收总清单
## Master Acceptance Checklist

### 全局
- [ ] 全部界面背景使用深色系（#0D0E14 / #13151F），无白色/浅色背景
- [ ] 强调色统一为电竞蓝 #3E6FFF
- [ ] 正向数值统一为绿色 #28D99E，负向数值统一为红色 #E84545
- [ ] 金色 #F4B942 仅用于冠军/MVP/最高荣耀场合
- [ ] 所有队伍颜色标记与 1.3 节队伍颜色表一致
- [ ] 字体层级清晰：标题粗大、副标题中等、正文轻细
- [ ] 无任何球员照片/写实人像（v0.1 无版权需求）

### 各界面
- [ ] S01 开始画面：赛场氛围，深色，标题清晰
- [ ] S01b 教练风格选择：四张等大风格卡，选中态蓝色边框，确认按钮
- [ ] S02 征召室：球员列表 + 预算仪表 + 6个选人槽位
- [ ] S03 杯赛支架：8支队伍对阵树，玩家队高亮
- [ ] S03b 杯赛颁奖：冠军加冕 + MVP公布 + 名次奖金表，玩家夺冠有金色氛围
- [ ] S04 赛前事件卡：模态弹窗，颜色条区分事件类型，情报事件用对手颜色
- [ ] S05 比赛室：事件卡日志 + 决策区 + 状态面板 + 暂停子界面 + 经济指示器 + 残局标记
- [ ] S06 赛后小结：比分大字 + MVP金色 + 决策回顾
- [ ] S07 转会窗口：三栏布局，价值平衡条，意愿指数，竞标弹窗
- [ ] S08a 年度颁奖：最佳俱乐部 + TOP10选手揭榜仪式（金/银/铜色区分前三）
- [ ] S08b 赛季总结：三杯结果卡 + 3张高光卡片 + 赛季收入 + 团队快照
- [ ] S09 生涯总结：冠军数字最大 + 时间轴 + 四成就卡 + 评级
- [ ] S10 存档管理：三槽位 + 时间戳 + 进度摘要 + 保存/加载/删除

### 全局系统
- [ ] 导航条：顶部 48px，进度圆点，步骤指示器
- [ ] 加载/过渡画面：统一黑底+进度条设计
- [ ] 通知/Toast：右上角滑入，4种颜色变体
- [ ] 条件指示器：7种选手状态标签，统一 pill 样式
- [ ] Tooltip：悬浮延迟 300ms，暗底亮字
- [ ] 玩家队伍高亮：蓝色竖条+蓝色外环，全局一致

---

*文档版本：v1.1 · 2026-06-25 · 由技术美术主导撰写*  
*本文档面向 AI 图像生成工具及 UI 开发者，所有视觉描述均为 AI 可执行的精确英文 Prompt 形式*
