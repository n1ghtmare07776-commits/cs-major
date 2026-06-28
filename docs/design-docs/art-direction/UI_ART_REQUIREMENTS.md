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

### 1.12 球员头像美术规范 / Player Portrait Art Spec

本游戏不直接使用真实选手照片。所有选手使用**风格化半身头像**。

**绘制风格：**
```
类型：美式漫画 / 半写实风格线稿（comic book style, semi-realistic）
画幅：正方形裁切 (1:1)，推荐 512×512px 源文件
裁切范围：肩部以上（chest-up portrait），眼睛在画面垂直中心线位置
线条：清晰黑色描边（2px），有板绘感但不过度粗糙
上色：纯色块填充 + 简单 2 层阴影（base + shadow），无复杂渐变
光照方向：正面微侧光（蝴蝶光），脸部有自然阴影但不戏剧化
表情：中性偏严肃（neutral-serious），不笑不大吼，微皱眉有竞技感
```

**队伍辨识：**
- 头像背景使用该选手所属队伍的**颜色芯片**（见 1.3），作为圆形背后光晕
- 光晕半径约为头像宽度的 60%，模糊度 20px，不透明度 30%
- 玩家战队的选手：光晕使用电竞蓝 (#3E6FFF)

**选手特征建议：**
```
donk (Spirit)       — 少年面孔，短深色头发，锐利眼神，绿色光晕
ZywOo (Vitality)    — 圆脸，浅色短发，沉稳表情，黄色光晕
s1mple (NAVI)       — 瘦脸，浅色头发，标志性锐利凝视，金色光晕
ropz (FaZe)         — 清瘦面容，深色短发，冷静表情，橙红光晕
karrigan (FaZe)     — 年长些的面孔，深色头发，战术大师眼神，橙红光晕
其他选手            — 均按漫画风格重新演绎，可以有夸张特征但不失辨认度
```

**与写实照片的区别：**
- 不受肖像权限制（经漫画转换后属二次创作）
- 统一视觉风格，不会出现不同照片质量参差不齐的问题
- 允许未来人为调整选手外观以匹配叙事
- 在 UI 中小尺寸显示时依然辨识度高（强对比线条比照片像素更清晰）

#### 1.12.1 头像在 UI 中的显示规则

```
尺寸变体：
  - 卡片/列表：48×48px，圆角 6px，带 2px 外层队伍颜色边框
  - 详情弹窗：96×96px，圆角 8px，带 3px 外层队伍颜色边框
  - 颁奖/MVP 展示：128×128px，圆角 8px，带金色 (#F4B942) 外边框 3px + 发光

槽位空态（未选人时）：
  - 灰色圆形底板（#1A1E2E），中央一个白色虚线人形剪影图标 (24px)
  - 边框 2px 虚线 #252A3D
```

### 1.13 球员卡片阶梯边框系统 / Card Frame Tier System

不同价位/实力的选手卡片使用不同级别的边框装饰，让玩家在一瞥之间判断价值：

```
┌─────────────────────────────────────────────────────────┐
│ TIER 边框规格                                              │
├──────────┬──────────────┬────────────────────────────────┤
│ 级别     │ 价格区间      │ 边框设计                         │
├──────────┼──────────────┼────────────────────────────────┤
│ 普通     │ 0–15         │ 1px 灰边框 (#252A3D)，无特殊装饰  │
│ BRONZE   │              │                                  │
├──────────┼──────────────┼────────────────────────────────┤
│ 优秀     │ 16–30        │ 1.5px 银色边框，带微弱金属光泽     │
│ SILVER   │              │ (#8A93A8 → #C0C8DB 渐变)         │
│          │              │ 卡片左上角有小颗银色四角星 ✦       │
├──────────┼──────────────┼────────────────────────────────┤
│ 精英     │ 31–50        │ 2px 金色边框，带金属光泽           │
│ GOLD     │              │ (#C8A84E → #F4B942 渐变)         │
│          │              │ 卡片左上角有小颗金色五角星 ★       │
│          │              │ 卡片右下角有微弱金色光晕            │
├──────────┼──────────────┼────────────────────────────────┤
│ 传奇     │ 51–100       │ 2.5px 炫彩边框                    │
│ LEGENDARY│              │ (#3E6FFF → #A855F7 → #F4B942     │
│          │              │  三色渐变)，持续微光动画            │
│          │              │ 卡片左上角：七彩钻石标记 ◆         │
│          │              │ 卡片背景有极微弱星芒纹理 overlay   │
└──────────┴──────────────┴────────────────────────────────┘
```

**边框动效规则：**
- 普通/银/金边框：静止无动画
- 传奇边框：3 秒循环的边框颜色流动动画（shimmer effect），流畅但不闪烁
- 已选中的卡片：阶梯边框保留，但额外叠加 2px 电竞蓝 (#3E6FFF) 外框

### 1.14 选手星级评定系统 / Star Rating System

每个选手有 1–5 星的综合评级，以五行小星表示：

```
星级显示规格：
  - 位置：选手卡片名称下方或右侧
  - 尺寸：每颗星 12×12px，间距 2px
  - 已填充星：金色 (#F4B942)，实心五角星 ★
  - 未填充星：灰色 (#3A3F55)，空心五角星 ☆
  - 半星（如 3.5）：右半填充（clip-path 实现）

星级对应综合实力：
  1 星 ★☆☆☆☆   — 综合 0-20   (替补水平)
  2 星 ★★☆☆☆   — 综合 21-40  (轮换选手)
  3 星 ★★★☆☆   — 综合 41-60  (可靠先发)
  4 星 ★★★★☆   — 综合 61-80  (全明星级别)
  5 星 ★★★★★   — 综合 81-100 (超级巨星)
```

### 1.15 鼓励寄语弹窗插图系统 / Stage Transition Illustration System

#### 1.15.1 设计目的

游戏在关键节点会以模态弹窗形式向玩家展示鼓励寄语或安慰文字（已存在于 `src/app/browser.js`）。
纯文字弹窗在视觉上过于单调，需要为每个情绪场景配备**氛围插图**。插图不是装饰画——它要放大文字的情绪冲击力。

#### 1.15.2 弹窗通用视觉框架

```
┌──────────────────────────────────────────────┐
│  （背景：全屏暗化 overlay，rgba(0,0,0,0.75)）  │
│                                              │
│   ┌────────────────────────────────────┐     │
│   │  氛围插图区 (280px 高，满宽)         │     │
│   │  · 无人物肖像，纯概念/氛围视觉       │     │
│   │  · 顶部渐变融入卡片背景              │     │
│   └────────────────────────────────────┘     │
│   ┌────────────────────────────────────┐     │
│   │  情绪图标 (48×48px，居中)            │     │
│   └────────────────────────────────────┘     │
│   ┌────────────────────────────────────┐     │
│   │  大标题 (24px bold，居中)            │     │
│   │  副标题行 (13px secondary，居中)     │     │
│   └────────────────────────────────────┘     │
│   ┌────────────────────────────────────┐     │
│   │  寄语正文 (4-8行，15px，居中，      │     │
│   │            行高 1.8，留白充足)        │     │
│   └────────────────────────────────────┘     │
│   ┌────────────────────────────────────┐     │
│   │  [主要操作按钮] (居中，accent blue)   │     │
│   │  次要文字提示 (底部居中，12px grey)   │     │
│   └────────────────────────────────────┘     │
│                                              │
└──────────────────────────────────────────────┘
```

**通用规格：**
- 弹窗卡片：宽 540px，圆角 12px，背景 #13151F，外描边 1px #252A3D
- 插图区：280px 高，卡片顶边圆角 12px（与卡片圆角衔接），插图底部做 40px 渐变融入卡片底色
- 插图与卡片底色之间不能有硬切边
- 图标：48×48px 居中 SVG 图标，放置在插图区下方，图标底部与插图区有 12px 重叠（制造层次感）
- 动效：弹窗以 fade + scale(0.95→1.0) 进入，250ms ease-out
- 过渡：玩家点击按钮后，弹窗 fade + scale(1.0→1.02) 退出，200ms ease-in

#### 1.15.3 情绪分类与配色基调

9 种情绪场景，分为 5 个配色基调：

| # | 情绪 | 场景触发 | 主色调 | 图标 |
|---|------|---------|-------|------|
| E1 | 启程 / BEGINNING | 赛季开始、进入新杯赛 | 电竞蓝 #3E6FFF | 启程旗标 🚩 |
| E2 | 决战 / SHOWDOWN | 杯赛决赛前、Major 终局前 | 金色 #F4B942 | 双剑交叉 ⚔ |
| E3 | 荣耀 / GLORY | 夺冠后、明星选手爆发、年度最佳俱乐部 | 金+白 #F4B942 → #FFFFFF | 桂冠 🏆 |
| E4 | 坚韧 / RESILIENCE | 被淘汰后、关键选手受伤、转会失败 | 暖铜 #C87D4F | 重燃火种 🔥 |
| E5 | 沉思 / REFLECTION | 赛季结束后、生涯结束时 | 紫灰 #8B7EAA | 星轨 ✦ |

#### 1.15.4 各场景详细设计与 AI 绘图 Prompt

---

**E1 — 启程 / BEGINNING**

触发场景：
- 赛季 1 开始进入征召室前
- 新杯赛开始（Katowice → Cologne → Major）
- 新赛季开始（S2 / S3）

视觉概念：空旷的竞技场/舞台从黑暗中逐渐亮起，象征未知征程的起点。

```
A dark atmospheric illustration for an esports manager game encouragement screen — "The Journey Begins".

Wide composition, 540×280px, dark theme.

The scene: a massive empty esports arena viewed from the entrance tunnel perspective.
Dark concrete walls on either side frame the view. At the far end, a single bright stage
glows with cool blue light. The stage is empty — no players, no crowd — just the arena
waiting to be filled. Thin beams of blue stage light cut through faint atmospheric haze.

Color palette:
- Deep shadows: near-black blue (#0A0F1E)
- Mid-ground: dark blue-grey concrete (#1A1F2E)
- Light source: electric blue (#3E6FFF) at the distant stage
- Atmospheric haze: subtle blue-white gradient

Style: cinematic game poster style. Semi-realistic but stylized — not photorealistic.
No human figures. No text. Mood: anticipation, quiet before the storm.
The image should feel like standing at the tunnel entrance before walking out onto the stage.
```

---

**E2 — 决战 / SHOWDOWN**

触发场景：
- 玩家队伍进入杯赛决赛前
- Major 决赛前
- 残局决胜局前的比赛室关键时刻

视觉概念：两道光束在舞台中央对撞，象征巅峰对决。

```
A dark atmospheric illustration for an esports manager game — "The Final Showdown".

Wide composition, 540×280px, dark theme.

The scene: a top-down or slightly elevated view of a central stage platform.
Two opposing beams of light crash into each other at center — one electric blue (#3E6FFF)
from the left, one warm orange-gold (#E8873A) from the right.
Where they collide, a bright white-gold explosion of light particles scatters outward.
The rest of the image fades to deep shadow (#0A0F1E).

Color palette:
- Left beam: electric blue (#3E6FFF) with cyan core (#5EE4FF)
- Right beam: warm orange (#E8873A) with gold core (#F4B942)
- Collision center: pure white → gold particle scatter
- Background: near-black (#0A0F1E) fading out from center
- Subtle floor reflection: dark mirror surface catching faint light traces

Style: cinematic, abstract but grounded — the light beams should feel physical,
like searchlights or arena spotlights crossing. No human figures. No text.
Mood: tension, epic confrontation, the moment before impact.
```

---

**E3 — 荣耀 / GLORY**

触发场景：
- 杯赛夺冠后
- 赛季年度最佳俱乐部宣布后（如果是玩家队伍）
- 生涯总结中玩家获得高评级

视觉概念：奖杯/桂冠在聚光灯下闪耀，金色粒子环绕。

```
A dark atmospheric illustration for an esports manager game — "Moment of Glory".

Wide composition, 540×280px, dark theme.

The scene: a championship trophy or laurel wreath silhouette illuminated by a single
overhead spotlight in a dark ceremonial hall. The trophy is not a specific real trophy —
it's a stylized CS-appropriate cup with angular geometric forms.
Golden light particles spiral upward around it. The spotlight beam is visible as a
soft cone of light from above. The background is deep dark with subtle gold specular
highlights on an implied dark marble or glass surface below.

Color palette:
- Spotlight core: warm white (#FFF8E7)
- Spotlight edge: gold (#F4B942) fading to dark
- Trophy/laurel: bright gold (#F4B942) with white highlight edges
- Particles: gold (#F4B942), amber (#E8873A), white micro-sparkles
- Background: deep navy-black (#0A0D18)
- Floor reflection: subtle gold gradient on dark surface

Style: ceremonial, iconic. The trophy should feel earned. No human figures.
No text. Mood: triumph, achievement, the weight of victory.
```

---

**E4 — 坚韧 / RESILIENCE**

触发场景：
- 玩家队伍被淘汰出局后
- 关键选手赛季报销后
- 转会竞标失败后
- 赛季成果不佳时

视觉概念：余烬中仍有火星在燃烧。用火种的意象而非灰烬的意象——强调「还没结束」。

```
A dark atmospheric illustration for an esports manager game — "Rise from the Ashes".

Wide composition, 540×280px, dark theme.

The scene: a close-up view of dark scattered embers on a black surface. Among the cooling
grey ash and charcoal, 2-3 bright orange embers still glow intensely. From the brightest
ember, a single thin wisp of warm smoke rises and catches a hint of orange light.
The focus is on the surviving embers — not the dead ash around them. The composition
should feel intimate and defiant.

Color palette:
- Background: deep charcoal black (#0D0E14)
- Ash and debris: dark grey (#1F222E) with subtle texture
- Active embers: bright orange (#E8783C) core, amber (#F4B942) glow
- Smoke wisp: translucent warm grey rising upward
- Subtle ember reflections: faint orange bloom on nearby surfaces

Style: macro/detail photography style, stylized. No human figures. No text.
Mood: resilience, quiet defiance, "the fire isn't out yet."
Not depressing — it should feel like resolve, not despair.
```

---

**E5 — 沉思 / REFLECTION**

触发场景：
- 赛季结束后（不论成绩好坏）
- 生涯结束后（S09 之前或期间）
- 三年编年史的导入页

视觉概念：夜空下的星轨/时间流逝，象征回顾与沉淀。

```
A dark atmospheric illustration for an esports manager game — "A Moment of Reflection".

Wide composition, 540×280px, dark theme.

The scene: a vast night sky viewed from a high vantage point, perhaps an arena rooftop
or a mountain overlook. Faint long-exposure star trails arc across the upper portion,
forming subtle circular paths. Below, a dark horizon line with the faintest silhouette
of a distant city or stadium. The overall feeling is stillness and perspective — not
sadness, but the calm after everything has happened.

Color palette:
- Sky: deep indigo (#0D1025) fading to near-black at top
- Star trails: subtle cool white (#8899CC) with faint blue (#3E6FFF) tint on longest trails
- Horizon: barely visible warm urban glow (#2A2A3A)
- Foreground: silhouetted dark structure edge (arena roof corner, out of focus)

Style: astrophotography-inspired, painterly. No human figures. No text.
Mood: peace, perspective, "look how far you've come."
```

---

#### 1.15.5 插图在弹窗中的完整组合示例

以下是一个完整的**杯赛夺冠弹窗**（E3 荣耀类型），展示插图如何与文字组合：

```
┌──────────────────────────────────────────────────┐
│  （全屏暗化 background, rgba(0,0,0,0.75)）        │
│                                                  │
│  ┌────────────────────────────────────────┐      │
│  │  [E3 荣耀插图 — 聚光灯下的奖杯剪影]      │      │
│  │   280px 高，底部渐变融入卡片底色          │      │
│  ├────────────────────────────────────────┤      │
│  │              🏆 (48px 金色图标)          │      │
│  │                                        │      │
│  │        IEM Katowice 2027               │      │
│  │            冠军 / CHAMPION              │      │
│  │                                        │      │
│  │  枪神队伍在波兰的冰原上写下了第一笔传奇。 │      │
│  │  donk 的火力撕碎了每一道防线，            │      │
│  │  ZywOo 的残局判断让对手窒息。            │      │
│  │  这只是一个开始——Cologne 还在前方等你。   │      │
│  │                                        │      │
│  │       ┌──────────────────────┐         │      │
│  │       │  继续 / CONTINUE      │         │      │
│  │       └──────────────────────┘         │      │
│  │        奖金 +50 已入账                  │      │
│  └────────────────────────────────────────┘      │
│                                                  │
└──────────────────────────────────────────────────┘
```

同样的框架，换一个 E4 坚韧插图 + 暖铜色调图标 + 对应的文字，就是被淘汰后的安慰弹窗。

#### 1.15.6 全部 9 个弹窗的 AI 绘图 Prompt 汇总

| # | 情绪类别 | 触发场景 | 插图 Prompt 关键短语 |
|---|---------|---------|-------------------|
| 1 | E1 启程 | 赛季开始/新杯赛开始 | "empty esports arena from entrance tunnel, distant blue-lit stage, anticipation" |
| 2 | E1 启程 | 新赛季 S2/S3 | 同上，可微调舞台灯光更亮（经验积累） |
| 3 | E2 决战 | 杯赛决赛前 | "two opposing light beams collide at center, blue vs orange-gold, epic confrontation" |
| 4 | E2 决战 | Major 决赛前 | 同上，碰撞火花更密集、金色占比更高 |
| 5 | E3 荣耀 | 杯赛夺冠 | "championship trophy in spotlight, golden particles spiral, ceremonial hall" |
| 6 | E3 荣耀 | 年度最佳俱乐部 | 同上 + 更广阔的空间感（暗示全年成就） |
| 7 | E4 坚韧 | 被淘汰/转会失败/赛季不佳 | "close-up embers still glowing among grey ash, defiant orange light, resilience" |
| 8 | E5 沉思 | 赛季结束后 | "vast night sky with star trails, distant city horizon, stillness and peace" |
| 9 | E5 沉思 | 生涯结束后 | 同上 + 更长的星轨、稍暖的色调（三年回顾的厚重感） |

#### 1.15.7 插图技术规格（给开发/生成）

```
插图交付规格：
  - 尺寸：540×280px（@2x: 1080×560px）
  - 格式：WebP（主）+ PNG（fallback）
  - 文件命名：stage-[category]-[variant].webp
    例：stage-glory-cup-win.webp, stage-resilience-eliminated.webp
  - 插图底部必须自带 40px 渐变透明区域，渐变从插图主色调过渡到 rgba(19,21,31,0)
    开发侧实现时叠加 CSS mask 或直接让插图包含渐变
  - 每个插图有对应的 48×48px SVG 图标（独立文件）

色彩管理：
  - 插图主色调必须与对应情绪类别的配色基调一致（见 1.15.3）
  - 插图暗部最低亮度不低于 #080A12，保证在深色背景下可辨识
  - 不出现过饱和霓虹色（与整体电竞暗色风格冲突）

性能预算：
  - 单张 WebP < 80KB（@2x < 200KB）
  - 9 张 × 2 尺寸 = 18 张，总计 < 2.5MB
```

#### 1.15.8 验收标准

- [ ] 9 个弹窗场景全部有对应插图，无纯文字弹窗
- [ ] 插图主色调与情绪分类匹配（蓝/金/金白/暖铜/紫灰）
- [ ] 所有插图无人物肖像，纯概念/氛围视觉
- [ ] 插图底部有渐变融入卡片底色，无硬切边
- [ ] 每个弹窗有对应的 48px 情绪图标
- [ ] 弹窗进入动效：fade + scale，250ms ease-out
- [ ] 弹窗退出动效：fade + scale，200ms ease-in
- [ ] 插图文件尺寸符合预算（WebP < 80KB per @1x）
- [ ] 配合文字后，整体情绪冲击力明显强于纯文字弹窗

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

本界面是玩家第一个重大决策场景——选秀体验必须充满**策略紧张感**和**收集满足感**。不再使用简陋的表格行，改用**球员卡片网格**，每张卡片承载丰富信息。

**核心设计原则：**
- 球员卡片是信息载体，不是表格行——一张卡片看完就能决定买不买
- 预算仪表是实时博弈工具——每花一笔钱都能看到剩余预算的视觉反馈
- 卡片边框随选手级别而变化——普通/银/金/传奇各有不同的视觉权重
- 已选槽位必须展示完整信息，不能只是名字

#### 3.2.2 界面区域划分

```
┌─────────────────────────────────────────────────────────────┐
│ 顶部导航栏：征召室 · 季前 · 01 / DRAFT                        │
├───────────────────────────────────────┬─────────────────────┤
│                                       │  预算仪表            │
│   可选球员池（卡片网格）                │  ┌───────────────┐  │
│   ┌──────────┐ ┌──────────┐           │  │ 💰 预算      │  │
│   │ 球员卡片  │ │ 球员卡片  │           │  │              │  │
│   │ ╔══════╗ │ │ ╔══════╗ │           │  │ ┌─────────┐  │  │
│   │ ║头像  ║ │ │ ║头像  ║ │           │  │ │进度条    │  │  │
│   │ ╚══════╝ │ │ ╚══════╝ │           │  │ └─────────┘  │  │
│   │ 姓名     │ │ 姓名     │           │  │              │  │
│   │ ★★★★☆  │ │ ★★★☆☆  │           │  │ 剩余: 42     │  │
│   │ ━━━━━━━ │ │ ━━━━━━━ │           │  │ /100         │  │
│   │ 火力 92  │ │ 火力 75  │           │  └───────────────┘  │
│   │ ━━━━━━━ │ │ ━━━━━━━ │           │                     │
│   │ 战术 68  │ │ 战术 82  │           │  我的阵容 (6槽位)    │
│   │ 💰 55   │ │ 💰 32   │           │  ┌─────────────────┐│
│   │ [hot]   │ │ [clutch]│           │  │ 头像 │首发槽位 1  ││
│   └──────────┘ └──────────┘           │  │      │姓名 ★★★★ ││
│   ┌──────────┐ ┌──────────┐           │  │      │火力 ████ ││
│   │ 球员卡片  │ │ 球员卡片  │           │  ├─────────────────┤│
│   │   ...     │ │   ...     │           │  │ ... 槽位 2-5     ││
│   └──────────┘ └──────────┘           │  ├─────────────────┤│
│   (可滚动，3-4 列网格)                  │  │ 头像 │替补槽位 6  ││
│                                       │  │      │(虚线边框)   ││
│                                       │  └─────────────────┘│
│                                       │                     │
│                                       │  [确认阵容]          │
├───────────────────────────────────────┴─────────────────────┤
│  底部状态栏：阵容总战力 XXX / 平均星级 X.X / 凝聚力预估 XX    │
└─────────────────────────────────────────────────────────────┘
```

#### 3.2.3 球员卡片设计规范（核心组件）

每张选手卡片是一个独立的展示单元，尺寸约 200×260px（2列时）或 180×240px（3列时）。

**卡片结构（从上到下）：**

```
┌──────────────────────────────────┐
│  ◆ 传奇边框（级别决定，见 1.13）   │ ← 边框动效
│                                  │
│  ┌────────────────────────────┐  │
│  │       漫画头像 (100×100)     │  │ ← 选手漫画半身像
│  │   背后队伍颜色光晕 (见1.12)  │  │
│  │   右下角小数字 背号(如 #17)  │  │
│  └────────────────────────────┘  │
│                                  │
│  DONK                  ⬡ 绿色   │ ← 姓名 + 队伍颜色小圆点
│  ⬡ Team Spirit                  │ ← 队伍名（小字）
│                                  │
│  ★★★★☆          3.5 星        │ ← 星级评定
│                                  │
│  💥 火力                         │
│  ████████████████░░  92         │ ← 属性条 + 数值
│  🧠 战术                         │
│  ████████████░░░░░░  68         │ ← 属性条 + 数值
│                                  │
│  ┌─────────────────────────┐    │
│  │ 💰 55    [hot_blooded]  │    │ ← 价格 + 特质标签
│  └─────────────────────────┘    │
│                                  │
│  [选入阵容] / [已选 ✓]           │ ← 操作按钮
└──────────────────────────────────┘
```

**卡片各级别边框展示：**

```
普通 BRONZE (价格 0-15):    优秀 SILVER (价格 16-30):
┌────────────────┐          ┌────────────────┐
│ 1px 灰边框      │          │ 1.5px 银边框    │
│ #252A3D        │          │ 金属光泽渐变     │
│ 无装饰          │          │ 左上角 ✦ 银星   │
└────────────────┘          └────────────────┘

精英 GOLD (价格 31-50):      传奇 LEGENDARY (价格 51-100):
┌────────────────┐          ╔════════════════╗
│ 2px 金边框      │          ║ 2.5px 炫彩边框  ║
│ 金属光泽渐变     │          ║ 蓝→紫→金 流动   ║
│ 左上角 ★ 金星   │          ║ 左上角 ◆ 钻石   ║
│ 右下角金晕       │          ║ 背景星芒纹理     ║
└────────────────┘          ╚════════════════╝
```

**已选中的卡片视觉表示：**
- 卡片整体叠加 2px 电竞蓝 (#3E6FFF) 外框
- 原阶梯边框保留（金色卡选中有金色+蓝色双边框，视觉更丰富）
- 按钮变为 "已选 ✓"，绿色文字，不可再点击
- 不可移除首发（需在右侧槽位操作移除）

#### 3.2.4 预算仪表设计（右侧顶部）

告别简陋的数字跳动。预算仪表是一个多层视觉组件：

```
┌────────────────────────────────────────┐
│  💰  预算 / BUDGET                     │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ ████████████████████░░░░░░░░░░░  │  │ ← 主预算条（彩色）
│  │ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░  │  │ ← 已锁定预算（暗色）
│  └──────────────────────────────────┘  │
│                                        │
│     5 8        /        1 0 0          │ ← 大号等宽数字 (28px)
│    已花费              总预算           │
│                                        │
│  剩余：42                              │ ← 中等数字 (18px)
│  可再签 0–2 名选手                     │ ← 小字提示
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ ○ 充裕 (>50)  ● 紧张 (20-50)    │  │ ← 预算状态指示灯
│  │ ● 危险 (<20)                      │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

**预算条颜色规则：**
```
剩余 > 60：绿色 (#28D99E) 填充，安心感
剩余 30-60：橙色 (#F4B942) 填充，注意感
剩余 < 30：红色 (#E84545) 填充，紧迫感
剩余 < 10：红色 + 脉冲动画（微呼吸效果），警告
```

**数字动效：**
- 花费预算时：数字从旧值滚动到新值（250ms ease-out 的计数动画，不是瞬间跳变）
- 预算条同步收缩（300ms ease-out）
- 数字变化方向：- 时短暂闪红（200ms），+ 时短暂闪绿

**「已锁定预算」副条：**
- 当你已经选了一些球员后，他们的价格总和作为「已锁定」显示
- 用暗色半透明条 (#252A3D, opacity 0.5) 表示已花费部分
- 剩余可支配部分用彩条表示
- 这让玩家清楚看到 "已经锁了多少钱 vs 还有多少钱能花"

#### 3.2.5 我的阵容区域（右侧下方）

6 个槽位卡片，展示已选球员的完整信息（不只是名字）：

```
┌──────────────────┐
│ 首发 #1          │ ← 槽位标签（小字 10px，蓝色）
│ ┌──┐             │
│ │  │ 头像 48px   │ ← 漫画头像缩略版
│ └──┘             │
│ s1mple           │ ← 选手名（bold 16px）
│ ⬡ NAVI          │ ← 队伍名 + 颜色点
│ ★★★★★           │ ← 星级
│ 火力 94 战术 87  │ ← 紧凑属性数字
│ ✕                │ ← 右上角移除按钮
└──────────────────┘

┌──────────────────┐
│ 替补 #6          │ ← 槽位标签（小字 10px，灰色）
│ ┌──────────┐     │
│ │  虚线人形  │     │ ← 空态：灰色底板 + 虚线人形
│ │  剪影图标  │     │
│ └──────────┘     │
│ + 添加替补       │ ← 空态提示文字
└──────────────────┘
```

**槽位视觉区分：**
- 首发槽位 (#1–#5)：实色背景卡片，蓝色左上角编号标签
- 替补槽位 (#6)：边框虚线，灰色编号标签，填充态同首发格式但标签为灰色
- 空槽位：虚线边框 + 中央加号图标 + 提示文字

#### 3.2.6 AI 绘图提示词（英文）

```
A dark, premium draft room screen for a Counter-Strike esports manager game, full of visual
depth — no flat table rows.

LAYOUT: Two-column split, 65% left / 35% right, on deep background #0D0E14.

=== LEFT SIDE: PLAYER CARD GRID (scrollable, 3 columns) ===

Each player card is a vertical dark card (180×240px, panel #13151F, border-radius 8px)
with a tiered border system:

TOP AREA — Player portrait:
- A 100×100px square comic-style character portrait (chest-up, semi-realistic comic art,
  clean black outlines, solid color shading, neutral-serious expression)
- Behind the portrait: a soft circular glow (60px radius, 20px blur, 30% opacity)
  using that player's TEAM ACCENT COLOR (defined in §1.3)
- Bottom-right of portrait: a small number (# jersey number) in white, 10px

CARD TIER BORDERS (defined in §1.13):
- BRONZE (price 0-15): 1px grey border #252A3D, no corner decoration
- SILVER (price 16-30): 1.5px silver gradient border (#8A93A8→#C0C8DB),
  small silver 4-point star ✦ in top-left corner
- GOLD (price 31-50): 2px gold gradient border (#C8A84E→#F4B942),
  small gold 5-point star ★ in top-left, faint gold glow at bottom-right
- LEGENDARY (price 51-100): 2.5px iridescent flowing border
  (#3E6FFF→#A855F7→#F4B942 gradient, slow 3s shimmer animation),
  diamond symbol ◆ in top-left, subtle starfield texture overlay on card bg

MIDDLE AREA — Info:
- Player name in bold white 16px (e.g. "DONK")
- Team name in small secondary text 11px with team color dot (e.g. "⬡ Team Spirit")
- STAR RATING: row of 5 stars (12px each, gold #F4B942 filled ★, grey #3A3F55 empty ☆)
  with numeric label "3.5 星" on the right

STAT BARS (two rows):
- "💥 火力" label (11px grey), then a horizontal bar 160px wide with light blue fill
  (#3E6FFF), black track, and a large white number (16px mono) at the right end
- "🧠 战术" label, same bar style but with teal fill (#28D99E)

BOTTOM AREA:
- Price badge: a rounded pill (dark bg #1A1E2E, gold #F4B942 number, 16px bold mono)
  with a coin icon 💰
- 1-2 trait tags: small outlined pills (10px), orange outline for hot_blooded,
  green outline for clutch_stabilizer, cyan for igl_caller, etc.
- Action button: "选入阵容" small button (accent blue #3E6FFF outline),
  changes to "已选 ✓" in green (#28D99E) when selected

SELECTED CARDS: overlay a 2px electric blue (#3E6FFF) outer frame on top of tier border.
Cards can be selected from either panel.

GRID LAYOUT: cards in 3 columns, scrollable vertically. Cards are spaced 12px apart.
Header row at top: "选手池 / PLAYER POOL" with a small filter dropdown.

=== RIGHT PANEL: BUDGET METER + ROSTER SLOTS ===

TOP — BUDGET METER (a premium visual gauge, NOT a plain progress bar):

A dark rounded panel (#13151F, border-radius 8px, padding 16px):
- "💰 预算 / BUDGET" header label, bold white 14px
- TWO-LAYER progress bar: a dark grey background track, with:
  - Bottom layer (locked/spent budget): dark semi-transparent bar (#252A3D, 50% opacity)
  - Top layer (remaining budget): colored bar — green #28D99E (>60), orange #F4B942 (30-60),
    red #E84545 (<30), red+pulse animation (<10)
- LARGE MONO NUMBERS below the bar:
  "58 / 100" in white bold 28px JetBrains Mono font
  "已花费" and "总预算" labels in small grey above
- "剩余: 42" in medium 18px white, with "可再签 0–2 名选手" hint in small grey
- Budget status indicator: three small circles (green/orange/red) with labels

BOTTOM — MY ROSTER (6 slot cards, vertical stack):

6 player slot cards, each 56px tall, border-radius 6px, bg #1A1E2E:

FILLED SLOTS (#1–#5 STARTERS):
- Left: 48×48px comic portrait thumbnail, team-color border 2px, team glow behind
- Center: player name (bold 15px), team name (small 11px with color dot),
  star rating row (small 10px stars), compact stat numbers "92🔥 68🧠"
- Right-top: small "✕" remove button (grey, red on hover)
- Left edge: "首发 #N" label tag (tiny blue pill, 10px)

SLOT #6 (SUBSTITUTE):
- Same format but label is "替补 #6" in grey pill
- EMPTY state: dashed border (#252A3D), centered grey "+" icon (24px),
  text "添加替补" in 12px grey

At the bottom: "确认阵容 / CONFIRM ROSTER" primary button (accent blue #3E6FFF, 48px tall).
Greyed out (opacity 0.4) until 5 starter slots are filled.
A small subtitle: "首发 3/5 · 替补 0/1 · 预算充足"

Bottom status bar (full width): "阵容总战力: 427 · 平均星级: 3.8 · 凝聚力预估: 62"
```

#### 3.2.7 中文补充说明

- **卡片网格 vs 表格行**：用 3 列卡片网格替代传统表格。卡片让每个选手都是一个可"收集"的物件，增加心理满足感
- **漫画头像**是本次迭代的核心新增——见 §1.12 的详细规范。没有照片不需要担心版权，所有选手用统一漫画风格演绎
- **卡片阶梯边框**是玩家快速扫视判断选手档次的关键：金边卡和灰边卡一眼就能区分，不需要读数字
- **星级**是综合水平的直观表达，5 星全满的 s1mple 和 1 星的不知名选手形成强烈视觉对比
- **属性条上显示数字**，不再只显示比例。数字是 CS 玩家熟悉的语言（ADWS、HLTV rating），明确数字比模糊比例更有决策价值
- **预算仪表**加入了"已锁定"概念、数字滚动动效、状态指示灯——让花每一笔钱都有仪式感
- **阵容槽位**展示完整选手信息（头像+星级+属性），不只是名字；空槽位用虚线+加号引导
- 底部状态栏实时计算"阵容总战力"和"凝聚力预估"，帮助玩家在选人过程中做全局判断

#### 3.2.8 验收标准

- [ ] 选手以卡片形式呈现，每张卡片包含：漫画头像（队伍颜色光晕）、姓名+队伍、星级（★1-5）、火力数值条、战术数值条、价格标签、特质标签
- [ ] 卡片边框按价格分为 4 级：普通灰边 → 银边+✦ → 金边+★+光晕 → 炫彩边框+◆+星芒（传奇）
- [ ] 已选中卡片叠加 2px 电竞蓝外框
- [ ] 预算仪表包含：双层进度条（已锁定+剩余）、大号等宽数字（已花费/总预算）、剩余金额、颜色状态指示灯
- [ ] 预算变化时有数字滚动动效和颜色脉动反馈
- [ ] 右侧 6 个阵容槽位展示完整选手信息（头像缩略图+星级+紧凑属性），首发与替补有颜色标签区分
- [ ] 空槽位显示虚线边框+加号图标
- [ ] 「确认」按钮在阵容未满时灰色不可点击，底部状态栏显示实时阵容统计
- [ ] 所有选手头像为漫画风格，无写实照片
- [ ] 预算紧张/危险时（<30）有红色视觉警告

---

### S03 — 杯赛支架 / Cup Bracket

#### 3.3.1 界面功能描述

每个杯赛（IEM Katowice / IEM Cologne / Major）的比赛对阵树界面。
这是玩家在非比赛期间的主要信息枢纽，也是"赛事金字塔"的视觉核心。

**核心设计原则：**
- 对阵图应该像赛事直播的画面一样有氛围——不只是功能性的线框
- 队伍展示要有辨识度，不能只靠颜色圆点
- 玩家的晋级路径要有视觉叙事（从左侧一路向右推进到冠军）
- 已发生的比赛留下痕迹，未发生的比赛有期待感

#### 3.3.2 界面区域划分

```
┌──────────────────────────────────────────────────────────────────┐
│ 顶部标题栏                                                        │
│ 🏆 IEM KATOWICE 2027 · 八强赛                                    │
│ 杯赛专属图标 + 大号标题，背景有杯赛主题色光晕                        │
├──────────────────────────────────────────────────────────────────┤
│                         对阵树主体                                  │
│                                                                  │
│  八强 (QF)         四强 (SF)        决赛 (FINAL)     冠军          │
│                                                                  │
│  ┌──────────┐                                                      │
│  │ 队伍A  [2]│──┐                                                   │
│  │ 队伍B  [0]│  │    ┌──────────┐                                   │
│  └──────────┘  ├───→│ 队伍A  [2]│──┐                               │
│                    │ 队伍C  [1]│  │                                │
│  ┌──────────┐      └──────────┘  │    ┌──────────┐                │
│  │ 队伍C  [2]│──┘                 ├───→│ 队伍A    │──┐   ╔══════╗  │
│  │ 队伍D  [1]│                    │    │ 队伍G    │  │   ║  🏆  ║  │
│  └──────────┘                    │    └──────────┘  │   ║ 奖杯 ║  │
│                                  │                   ├──→║      ║  │
│  ┌──────────┐                    │    ┌──────────┐  │   ╚══════╝  │
│  │ 队伍E  [0]│──┐                 │    │ 队伍G  [2]│──┘              │
│  │🔵枪神[2]│  │    ┌──────────┐  │    │ 队伍K  [0]│                 │
│  └──────────┘  ├───→│🔵枪神[2]│──┘                                │
│                    │ 队伍H  [0]│                                     │
│  ┌──────────┐      └──────────┘                                     │
│  │ 队伍G  [2]│──┘                                                   │
│  │ 队伍H  [0]│                                                      │
│  └──────────┘                                                      │
│                                                                  │
│  连接线：晋级路径用金色加粗线，普通路径用暗灰线                        │
│  已淘汰：50%透明度，名称加删除线                                     │
│  🔵 蓝色竖条 = 玩家"枪神队伍"                                       │
├──────────────────────────────────────────────────────────────────┤
│  底部信息栏                                                        │
│  ┌────────────────────────────┐  ┌─────────────────────────────┐ │
│  │ 下一场对手                  │  │ 杯赛进程                     │ │
│  │ VS Team Vitality           │  │ 已进行 4/7 场比赛            │ │
│  │ ⬡ 🟡 Vitality              │  │ ●●●●○○○                      │ │
│  │                            │  │                              │ │
│  │ [准备比赛]                 │  │ 当前阶段：四强赛              │ │
│  └────────────────────────────┘  └─────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.3.3 对阵槽位卡片设计

每个对阵槽位不再是一个简陋的暗色方块，而是精心设计的比赛卡片：

```
┌──────────────────────────────┐
│ 八强赛 · 第 1 场              │ ← 轮次标签 (8px grey)
│                              │
│ ┌──┐                        │
│ │队│  Team Spirit    [ 2 ]  │ ← 队徽(40×40) + 队名 + 比分
│ │徽│  ⬡ 绿色               │   胜方：白色粗体，队徽全彩
│ └──┘                        │
│                              │
│ ┌──┐                        │
│ │队│  FURIA          [ 0 ]  │ ← 败方：半透明 + 删除线
│ │徽│  ⬡ 橙色（50%不透明）   │
│ └──┘                        │
│                              │
│          ─ VS ─              │ ← 对战分割线
│                              │
│ 已结束 · 2:0                 │ ← 比赛状态标签
└──────────────────────────────┘
```

**队徽（Team Emblem）设计：**
- 每个队伍有一个简洁的几何队徽，约 40×40px
- 设计语言：队伍的动物/符号 + 队伍颜色，极简几何风格
  - Team Spirit：绿色龙首轮廓（三角形组合）
  - Team Vitality：黄色蜂巢六边形 + V 字
  - FaZe Clan：橙红火焰三角
  - NAVI：金黄 N 字母盾形
  - FURIA：橙色豹爪三线
  - MOUZ：深红 M 字圆章
  - The MongolZ：钢青蒙古文字风格符号
  - 枪神队伍：电竞蓝准星 + 枪形剪影

**比赛卡片尺寸：**
- 宽度：220px（八强/四强），240px（决赛）
- 高度：自适应，约 120-140px
- 背景：#13151F，边框 #252A3D，圆角 8px
- 轮次标签在卡片顶部居中小字

#### 3.3.4 对阵连接线设计

```
连接线系统：
  - 基础线：1px 实线 #252A3D
  - 水平线从卡片右侧出发 → 向下/上折弯 → 连接到下一轮卡片左侧
  - 折弯处有 6px 圆角过渡（border-radius 效果）
  - 晋级路径（胜方）：线条颜色提亮至 #4A5580
  - 冠军路径（跌宕晋级到决赛的队伍）：线条升级为金色 (#F4B942) 1.5px
  - 玩家晋级路径：线条颜色为电竞蓝 (#3E6FFF) 1.5px，带微弱发光

视觉示例：
  八强卡片 ──────┬────── 四强卡片
                 │ (6px 倒角)
                 │
  八强卡片 ──────┘
```

#### 3.3.5 杯赛专属氛围

三个杯赛有不同的视觉氛围，通过顶部标题区和背景色调体现：

```
IEM Katowice（冰原堡垒）:
  - 顶部标题区背景：深蓝到冰蓝微弱渐变
  - 标题旁图标：冰晶/雪花几何符号 ❄
  - 背景极微弱蓝色氛围光（#1A3A6E, opacity 10%, 顶部渐变）
  - 对阵树左侧暗藏微弱的冰蓝光

IEM Cologne（圣殿钟声）:
  - 顶部标题区背景：深灰到暖橙微弱渐变
  - 标题旁图标：哥特式教堂尖顶轮廓
  - 背景极微弱暖橙氛围光（#3A2A1A, opacity 10%）
  - 氛围偏厚重沉稳

Major（最高殿堂）:
  - 顶部标题区背景：深紫到暗金渐变
  - 标题旁图标：王冠/星星 ✦
  - 背景极微弱紫金氛围光（#2A1A4A, opacity 10%）
  - 奖金数字用金色，奖杯图标更大
  - 整体氛围最隆重，是三个杯赛中视觉权重最高的
```

#### 3.3.6 玩家队伍「枪神队伍」的视觉追踪

```
玩家队伍的视觉标记贯穿整个对阵树：

1. 队伍所在卡片：
   - 左侧 3px 电竞蓝 (#3E6FFF) 竖条（贯穿整张卡片高度）
   - 队名文字有微弱蓝色辉光（text-shadow, 8px blur, #3E6FFF, 40% opacity）
   - 队徽外加 2px 蓝色外环

2. 晋级路径线：
   - 从玩家卡片出发的连接线变为电竞蓝 (#3E6FFF)，1.5px
   - 带动画的蓝色虚线脉冲（沿着线流动的小光点，周期 3s）

3. 顶部标题区：
   - 如果玩家仍在比赛中：右侧小标签 "🔵 枪神仍在战斗" (蓝色 pill)
   - 如果玩家已夺冠：右侧小标签 "🏆 冠军" (金色 pill)
   - 如果玩家被淘汰：右侧小标签 "已淘汰" (灰色 pill)
```

#### 3.3.7 底部信息栏设计

```
┌────────────────────────────┐  ┌─────────────────────────────┐
│ 下一场对手                   │  │ 杯赛进程                     │
│                            │  │                             │
│ ┌────┐                     │  │ 已进行                      │
│ │队徽│  Team Vitality       │  │ ●●●●○○○  4/7 场比赛        │
│ │ 48 │  ⬡ 黄色             │  │                             │
│ └────┘                     │  │ 当前阶段：四强赛              │
│                            │  │ 下一轮：决赛                  │
│ 历史交锋：2胜1负            │  │                             │
│                            │  │ 冠军奖金                      │
│ ┌──────────────────────┐   │  │ 💰 50 → 枪神队伍（预期）     │
│ │  准备比赛 / START     │   │  │                              │
│ └──────────────────────┘   │  └─────────────────────────────┘
└────────────────────────────┘
```

#### 3.3.8 AI 绘图提示词（英文）

```
A premium, esports-broadcast-quality tournament bracket screen for a Counter-Strike
manager game — the "Cup Bracket" view. Dark theme, horizontal bracket layout flowing
from left (quarterfinals) to right (champion).

BACKGROUND: Deep dark background #0D0E14 with a subtle ambient glow at the top
(cup-themed: icy blue for Katowice, warm amber for Cologne, royal purple-gold for Major).

TOP HEADER BAR (full width, 64px tall):
- Cup-specific icon on the far left (❄ for Katowice, cathedral spire for Cologne, ✦ crown for Major)
- Cup name in large condensed header font: "IEM KATOWICE 2027" — white bold 28px
- Stage indicator: "八强赛 · QUARTERFINALS" in secondary text (#7A849E) below the cup name
- Right side status tag: a small pill reading "🔵 枪神仍在战斗" in electric blue,
  or "🏆 冠军" in gold for champion victory, or "已淘汰" in grey

BRACKET TREE (centered, horizontal flow: QF → SF → FINAL → TROPHY):

QUARTERFINALS (left, 4 vertical match cards):
Each match card is 220×130px, dark panel #13151F, border #252A3D, border-radius 8px.

Inside each match card:
- Top label: "八强赛 · 第N场" in tiny 8px grey
- Two team rows, each 44px tall:
  LEFT: a 40×40px team emblem — a minimal geometric symbol in the team's accent color
    (see team emblem design guide). For the winning team: emblem is full-color.
    For the losing team: emblem is semi-transparent with a strikethrough line.
  CENTER: team name in bold white 14px (winning team full opacity, losing team 50% opacity
    + strikethrough)
  RIGHT: match score in bold mono 18px (e.g., "2" or "0"), white for winner, grey for loser
- Divider between teams: thin horizontal line "─── VS ───" in #252A3D
- Status badge at bottom: "已结束 · 2:0" in small success green, or "即将开始" in amber,
  or "进行中" in blue with small pulsing dot

PLAYER TEAM MARKER (枪神队伍):
The match card containing the player's team has:
- A 3px electric blue (#3E6FFF) vertical stripe running the full card height on the left edge
- The team name text has a subtle blue glow (text-shadow, 8px blur, #3E6FFF, 40% opacity)
- The team emblem has an additional 2px blue outer ring

CONNECTING LINES:
- Standard paths: 1px solid #252A3D with 6px rounded corners at bends
- Advancing paths (winner → next round): 1.5px lighter line #4A5580
- Champion path (team that reached the final): 1.5px gold line #F4B942
- PLAYER TEAM path: 1.5px electric blue #3E6FFF with a slow-flowing dot animation
  (a small glowing blue dot traveling along the line, 3s cycle)
- Lines connect from the right edge of each match card, bend toward the next round card

SEMIFINALS (center, 2 vertical match cards, slightly wider at 230px)
FINAL (right-center, 1 match card at 240px, thicker 2px border in gold #F4B942)

TROPHY ZONE (far right):
A large stylized trophy icon (64px, gold #F4B942 with subtle glow) — hollow/outline style
before champion is determined, filled style after champion is crowned.
Below the trophy: the champion team name appears in gold text (or "待决出" before determined).
A small gold "CHAMPION" label above the trophy.

BOTTOM INFO BAR (full width, two panels):

LEFT PANEL — "下一场对手 / NEXT MATCH":
Dark rounded panel (#13151F, border-radius 8px, padding 16px):
- Header: "下一场对手" in bold white 14px
- Large opponent team emblem (48×48px) with team name and colored dot
- "VS Team Vitality ⬡ 黄色" in bold white 18px
- "历史交锋: 2胜1负" in small secondary text
- Blue "准备比赛 / START MATCH" button, 44px tall, fully rounded

RIGHT PANEL — "杯赛进程 / PROGRESS":
Dark rounded panel (#13151F, border-radius 8px):
- Progress dots: 7 small circles (● filled in gold, ○ empty in grey)
  showing "●●●●○○○ 4/7 场比赛"
- "当前阶段：四强赛 · SEMIFINALS" label
- "下一轮：决赛 · FINAL" label
- "冠军奖金：💰 50" in gold text, with "→ 枪神队伍（预期）" if player is still in
```

#### 3.3.9 中文补充说明

- **队徽是新的核心元素**——告别简陋颜色圆点。每个队伍有一个极简几何队徽（40×40px），用队伍的象征符号+队伍颜色设计。队徽不需要复杂，越简洁越有力
- **三杯不同氛围**：Katowice 冰蓝、Cologne 暖橙、Major 紫金——视觉上应该在打开界面的一瞬间就知道"这是一个重要的杯赛"
- **玩家晋级路径线**的脉冲光点动画是本界面的情绪高潮——一路推进到决赛时，蓝色路径线从左侧延伸到右侧，视觉上就是"我在冲冠"
- **决赛卡片**比八强卡片更大更重，有金边，让决赛的重要性在视觉权重上突出
- **奖杯区**（最右侧）在冠军未出时是空心轮廓，有了冠军后填满——这是对阵图的最右边终点
- **底部信息栏**比原来的简陋盒子丰富很多：对手队徽、历史交锋记录、杯赛进度圆点、冠军奖金预览
- 对阵树中间留白要充足，不要让卡片挤在一起。整个画布需要呼吸感

#### 3.3.10 验收标准

- [ ] 8 支队伍全部在支架图上可见，每支队伍有队徽（几何符号）+ 队伍颜色
- [ ] 对阵树为水平布局（左→右）：八强 4 卡 → 四强 2 卡 → 决赛 1 卡 → 奖杯
- [ ] 玩家「枪神队伍」所在的卡片有左侧电竞蓝竖条 + 蓝色辉光 + 队徽蓝环
- [ ] 已结束比赛的败者行半透明 + 删除线，胜者行完整显示
- [ ] 比分用等宽加粗数字显示在每行右侧
- [ ] 连接线区分：普通线（灰）、晋级线（亮灰）、冠军线（金）、玩家线（蓝+脉冲动画）
- [ ] 顶部杯赛名称带专属图标，三个杯赛氛围不同（Katowice 冰蓝 / Cologne 暖橙 / Major 紫金）
- [ ] 决赛卡片尺寸更大，有金色 2px 边框
- [ ] 最右侧奖杯图标：未出冠军时空心，已出冠军时填充+冠军队名
- [ ] 底部左面板显示下一场对手（队徽+队名+历史交锋），右面板显示杯赛进度圆点
- [ ] 杯赛名称显示在顶部标题区，带当前阶段标签

---

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

#### 3.5.0 布局总览 — 三栏对阵结构

```
┌─────────────────────────────────────────────────────────────┐
│                    顶部比分栏 (60px)                          │
│   枪神队伍 🏠  1  –  2  VS Team Vitality     ⏱暂停  💰FULL  │
│                ●●●○○   Round 4/5                           │
├──────────┬───────────────────────────────────┬──────────────┤
│  左栏    │        中央事件日志区               │   右栏       │
│ 180px    │       (scrollable)                │  180px      │
│          │                                   │              │
│ ┌──────┐ │  ┌─ 事件卡 ROUND 4 ───────┐      │ ┌──────┐    │
│ │donk  │ │  │ donk 用AWP在中路……     │      │ │ZywOo │    │
│ │K:12  │ │  │ ↑ 火力 +3 残局翻盘     │      │ │K:18  │    │
│ │D:5 A:3│ │  └──────────────────────┘      │ │D:3 A:2│   │
│ │▮▮▮▮▮▯│ │                                   │ │▮▮▮▮▮▮│   │
│ │⚡hot │ │  ┌─ 🔶 决策卡 ─────────────┐      │ ┌──────┐    │
│ └──────┘ │  │ 敌方集中防守A点……       │      │ │ropz  │    │
│          │  │ [全买] [半买] [ECO]    │      │ │K:14  │    │
│ ┌──────┐ │  └──────────────────────┘      │ │D:4 A:1│   │
│ │sh1ro │ │                                   │ │▮▮▮▮▮▯│   │
│ │K:9   │ │                                   │ └──────┘    │
│ │D:7 A:4│ │                                   │              │
│ └──────┘ │                                   │ ┌──────┐    │
│          │                                   │ │flameZ│    │
│ ┌──────┐ │                                   │ │K:8   │    │
│ │……    │ │                                   │ └──────┘    │
│ └──────┘ │                                   │              │
├──────────┴───────────────────────────────────┴──────────────┤
│              底部决策面板 (仅在玩家回合显示, 80px)             │
│   [全买/FULL BUY]  [半买/PARTIAL]  [省钱/ECO]               │
└─────────────────────────────────────────────────────────────┘
```

界面采用三栏对阵布局，模拟 CS 比赛转播 HUD 的信息密度，同时保持文字游戏的阅读流畅性。

#### 3.5.1 界面功能描述

**顶部比分栏**（全宽，60px，固定）：
- 玩家战队名（左）+ 大号比分（中）+ 对手战队名（右）
- 局数进度圆点（5局制）
- 暂停按钮 + 双方经济指示器

**左栏（180px，固定）—— 枪神队伍 5 名选手**
- 5 张垂直排列的选手状态卡
- 每张卡实时显示：头像缩略图 + 姓名 + KDA（击杀/死亡/助攻）+ 状态条 + 影响力指数

**中央事件日志（flex，滚动）—— 比赛叙事核心**
- 事件卡序列（10-15张）
- 决策卡（金色边框）
- 残局标记、经济 swing 标记

**右栏（180px，固定）—— 对手队伍 5 名选手**
- 与左栏对称布局，显示对手 5 名选手的 KDA 和状态
- 对手数据为「已知情报」——KDA 随比赛进行逐渐揭露

**底部决策面板**（全宽，80px，仅在玩家回合显示）

#### 3.5.2 选手状态卡详细设计 / Player Stat Card Design

这是本次设计的核心——每张选手卡片不仅展示信息，还要在比赛中「活起来」。

```
┌──────────────────────────────┐
│ ┌────┐                       │  ← 卡片背景：#1A1E2E
│ │头像│ donk            ★★★★★ │  ← 姓名+星级
│ │32px│ ⚡ hot form           │  ← 状态标签（可选）
│ └────┘                       │
│                              │
│  K     D     A               │  ← KDA 三列等宽
│ 12    5     3                │  ← 数字 22px 粗体等宽
│ 杀    死    助                │  ← 标签 9px 灰色
│                              │
│ 影响力 ▮▮▮▮▮▮▮▮▯▯ 78       │  ← 影响力条 + 数值
│                              │
│ 🔫 AWP  💚 Alive             │  ← 武器图标 + 存活状态
└──────────────────────────────┘
```

**卡片详细规格：**

| 元素 | 规格 |
|------|------|
| 卡片尺寸 | 宽 172px，高 136px，圆角 6px |
| 卡片背景 | #1A1E2E |
| 头像 | 32×32px 圆形，漫画风格，队伍色外环 2px |
| 姓名 | 13px bold，白色 #E8EBF5，在头像右侧 |
| 星级 | 10px 金色 ★，在姓名下方 |
| 状态标签 | 11px pill 标签：hot form (橙)、tilt (红)、stable (绿)、injured (灰) |
| KDA 数字 | 22px bold，等宽字体 (JetBrains Mono)，白 #FFFFFF |
| KDA 标签 | 9px，灰色 #7A849E，"杀/死/助" |
| 影响力条 | 高 6px，填充蓝色 #3E6FFF，轨道 #252A3D，右端数值 11px bold |
| 武器图标 | 14px emoji/text icon + 12px 文字 |
| 存活状态 | 11px pill：💚 Alive (绿) / 💀 Dead (灰+暗) / 🔄 Respawning (蓝闪烁) |

**KDA 实时更新动效：**
- 击杀 +1：K 数字 200ms 金色闪烁 → 渐隐回白色，同时影响力条向右增长
- 死亡 +1：D 数字 200ms 红色闪烁 → 随后卡片启动完整去饱和序列（300ms）：
  → 头像灰度化(grayscale 100%)、队伍圆环褪灰、影响力条从蓝变灰、边框褪色、
  💀 DEAD 标签替换 Alive、斜线纹理淡入。整个过程 500ms 内完成。
- 助攻 +1：A 数字 150ms 浅蓝闪烁
- 影响力条变动：300ms ease-out 过渡动画
- 多杀事件（double/triple kill）：K 数字带金色粒子微效，持续 400ms

**卡片层级状态（三种）：**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
状态一：正常存活 — 全彩全亮
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  - 卡片背景 #1A1E2E，边框 1px #252A3D（队伍色弱光环）
  - KDA 数字纯白 #FFFFFF
  - 头像：彩色漫画风格，队伍色圆环鲜艳
  - 影响力条：蓝色 #3E6FFF
  - 武器图标：彩色 emoji
  - 存活标签 💚 Alive 绿色 #28D99E

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
状态二：阵亡状态 — 去饱和 × 墓碑化  ← 本次新增
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
触发时机：选手在该回合被击杀时，发生以下视觉变化（300ms ease-out 过渡）：

① 头像：从彩色完全去饱和为黑白色调（grayscale 100%）
  - 队伍色圆环同步褪为暗灰色 #3A3A3A
  - 头像上叠加一层极淡的暗色 veil（rgba(0,0,0,0.3)）

② 卡片背景：从 #1A1E2E 过渡到 #121318
  - 边框从 #252A3D 变为 #1A1A22
  - 边框 1px 不变，但颜色几乎融入背景

③ KDA 数字：从白色过渡到暗灰 #4A4E5A
  - K（击杀）数字定格不闪（已死不能再杀）
  - D（死亡）数字红色闪烁 200ms 后定格为灰色
  - A（助攻）数字同步暗化

④ 影响力条：填充色从蓝色变为灰色 #3A3A3A
  - 该选手影响力不再增长（已死）
  - 条末端数值也变灰

⑤ 存活标签：从 💚 Alive 绿色 → 切换为 💀 DEAD
  - 文字色 #55555A（暗灰），无彩色
  - 标签背景透明，仅文字

⑥ 整体不透明度：无变化（保持在 100%，不用 opacity 降低）
  - 关键：是靠去饱和/灰度化来区分，不是靠透明
  - 透明会显得卡片“消失了”，灰度化则是“他还在场上，但已经死了”

⑦ 卡片上叠加一条极淡的对角线斜线纹理（opacity 0.08）
  - 从左上到右下的细斜线，类似「已剔出/已阵亡」的视觉暗示
  - 只在死亡态出现。正常态和高光态无此纹理。

⑧ 阵亡动效时序（300ms）：
  0ms   → 头像瞬间去饱和（150ms grayscale 0→100% 过渡）
  50ms  → KDA 数字开始褪色
  100ms → 影响力条从蓝色融为灰色
  200ms → 存活标签切换为 💀 DEAD，边框褪色完成
  300ms → 斜线纹理淡入完成

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
状态三：本回合高光选手 — 金色微光
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  - 如果该选手在本事件卡中有关键表现（多杀/残局/翻盘）：
  - 边框短暂变为金色 #F4B942（2px，持续 2秒）
  - 卡片背景微亮（#1A1E2E → #1F2435）
  - 右上角出现小火花图标 ✦（金色，12px）
  - 注意：死亡选手不触发高光态（已死不可能有高光）
```

**阵亡状态的 AI 绘图关键词：**

```
Dead player card visual treatment:
- Portrait: fully desaturated to black and white (grayscale 100%).
  Team-color ring fades to dark grey #3A3A3A.
  A subtle dark veil overlay on the portrait (rgba(0,0,0,0.3)).
- Card background: darkened from #1A1E2E to #121318.
  Border: still 1px but faded from #252A3D to #1A1A22 (nearly invisible).
- KDA numbers: dim grey #4A4E5A instead of white. No color burst.
- Impact bar: fill changes from blue #3E6FFF to dead grey #3A3A3A.
  Bar stops growing (frozen at death value).
- Status pill: "💀 DEAD" in dark grey #55555A, no color.
- Entire card remains at 100% opacity (not transparent).
  Instead, a faint diagonal cross-hatch texture (opacity 0.08)
  overlays the card from top-left to bottom-right, like a "knocked out" mark.
- Contrast with alive cards: alive cards burst with color (team ring, blue bar,
  green Alive badge); dead cards are completely monochrome — the difference
  is immediately obvious at a glance.
```

#### 3.5.3 左右栏完整 AI 绘图 Prompt

```
A dark esports match HUD-style side panel for a text-based Counter-Strike manager game —
player stat cards displayed vertically on both sides of the match screen.

LEFT PANEL (180px wide, fixed): "枪神队伍" — the player's team, 5 cards stacked vertically.

Each player card (172×136px, #1A1E2E background, 1px #252A3D border, 6px border-radius, 6px gap):
— TOP ROW: 32×32px circular comic-style player portrait on the left, with a 2px team-color
  ring (#3E6FFF for player team). Right of portrait: player name (bold 13px white #E8EBF5)
  and below it, star rating in gold ★ (10px).
  If the player has an active condition, a small pill tag appears below the name:
  ⚡ hot form (orange #E8783C bg), 😤 tilt (red #E84545 bg), ✓ stable (green #28D99E bg).

— MIDDLE SECTION: Three equal-width columns for KDA stats.
  Each column: large mono number (22px, JetBrains Mono, bold white) centered above
  a tiny grey label (9px, #7A849E) — "杀" / "死" / "助".
  Example: K=12 centered over "杀", D=5 over "死", A=3 over "助".
  When player is dead, KDA numbers dim to 40% opacity grey.

— IMPACT BAR: Below KDA, a thin horizontal progress bar (6px tall, full width minus 16px padding).
  Track: #252A3D. Fill: electric blue (#3E6FFF), width proportional to impact score.
  Right end of bar: small impact number (11px bold, white), e.g. "78".

— BOTTOM ROW: two small indicators side by side:
  Left: weapon emoji/text (e.g., "🔫 AWP", "🔧 AK-47", "💣 M4A4") in 11px grey text.
  Right: alive/dead status.
  ALIVE: "💚 Alive" pill in green (#28D99E), card is full color.
  DEAD: "💀 DEAD" label in dark grey (#55555A). The ENTIRE card turns monochrome:
  - Portrait: fully desaturated to black and white (grayscale 100%).
    Team-color ring fades to dark grey #3A3A3A.
  - Card background: darkens from #1A1E2E to #121318.
  - Border: fades to near-invisible #1A1A22.
  - KDA numbers: dim grey #4A4E5A (not white).
  - Impact bar: fill turns grey #3A3A3A from blue, frozen at death value.
  - Faint diagonal cross-hatch texture (opacity 0.08) overlays entire card.
  - Card remains at 100% opacity — the monochrome vs color contrast makes
    dead players instantly identifiable, not transparency.
  - Transition: 300ms ease-out from full color to full grayscale.

— HIGHLIGHT STATE: When a player makes a clutch play or multi-kill, the card border
  briefly transitions to gold (#F4B942), 2px wide for 2 seconds, with a tiny "✦" sparkle
  icon appearing at the top-right corner. Card background micro-brightens to #1F2435.
  Dead players never enter highlight state.

Cards are sorted by jersey/role, NOT by KDA — positions are fixed so players are always
in the same spot. Top to bottom: Entry Fragger, Support, IGL, AWPer, Lurker.

RIGHT PANEL (180px wide, fixed): Opponent team. Identical card structure but:
— Team color ring uses opponent's team color (e.g., yellow #F5D800 for Vitality)
— Player names use opponent roster
— KDA data for opponents is partially hidden at match start (shows "--") and
  gradually revealed as the match progresses. By the end of the match, all opponent
  KDA is visible.
— DEATH STATE applies identically: opponent cards also turn full grayscale when killed.
  This gives the player instant visual feedback on how many enemies are still alive.

The two side panels frame the center event log, creating the feeling of a CS match HUD.
The overall impression: information-dense, competitive, like watching a pro match overlay
but adapted for a text-based manager game.
```

#### 3.5.4 中央区域设计 / Center Zone Design

**顶部比分栏**（三栏上方全宽横跨，60px）：

```
A dark esports match scoreboard bar spanning the full width of the screen (60px tall).

BACKGROUND: dark panel #13151F, bottom border 2px #252A3D.

LEFT SECTION: Player team identity.
— "枪神队伍" in bold white 16px.
— Small home icon 🏠 before team name.
— Below team name on same line: a tiny team color stripe 3px × 16px in #3E6FFF.

CENTER SECTION: Match score, dominant element.
— Large score display: "1  –  2" in heavy mono font (JetBrains Mono, 36px bold).
— The team with more rounds has their score digit in bright white.
— The trailing team's digit: 70% opacity white.
— Between scores: an em-dash in secondary grey.
— Below score: 5 round progress dots (8px each, 4px gap).
  · Played rounds: filled white dots.
  · Current round: blue (#3E6FFF) dot with subtle breathing animation (opacity 0.8↔1.0, 1.2s).
  · Upcoming rounds: dark hollow circles (#252A3D).
  · Match point: the potential winning dot gets a thin gold ring (#F4B942) around it.

RIGHT SECTION: Opponent identity + controls.
— "VS Team Vitality" in white 16px.
— Opponent team color dot (e.g., yellow #F5D800) before name.
— Economy indicator pills for both teams (small, right-aligned):
  💰 FULL BUY (green #28D99E bg) / 🔧 HALF (gold #F4B942 bg) / 💸 ECO (grey #555 bg)
— Far right: "⏱ 暂停" button if timeout available (blue outlined, 28px tall).
  If used: grey strikethrough, unclickable.

MATCH POINT / OVERTIME indicators: When either team is at match point (2-1),
a small "赛点 / MATCH POINT" label appears below the score in gold (#F4B942), 10px.
If overtime: "加时 / OT" label in orange (#FF6B00).
```

**中央事件日志**（可滚动，占据剩余高度）：

```
Center event log — scrollable vertical list between the two side panels.

BACKGROUND: deep dark #0D0E14 with subtle horizontal noise texture.

EVENT CARDS (stacked with 8px gap, each card full width of center zone):
Each card: rounded rectangle (#13151F, 3px left border stripe by event type, 6px border-radius).

Left border stripe colors:
— Blue (#3E6FFF): Neutral events, intel gathering, map control
— Green (#28D99E): Positive momentum, won rounds, successful executes
— Red (#E84545): Negative events, lost rounds, opponent momentum
— Gold (#F4B942): Player decision cards

Card structure:
— HEADER ROW (24px tall): Small type label in UPPERCASE (11px, #7A849E)
  e.g., "ROUND 4 · MID-ROUND" or "ROUND 2 · OPENING"
  Right side: clutch badge [1v3] if applicable (gold #F4B942, 11px bold mono)
  or economy badge (💰/💸) if describing an economy phase.
— BODY: 2-4 lines of narrative text in white (#E8EBF5), 14px, line-height 1.6.
— FOOTER: Compact delta line (11px mono).
  Green (#28D99E) for positive deltas: "↑ donk 火力 +3  团队战术 +2"
  Red (#E84545) for negative deltas: "↓ sh1ro 士气 -2  纪律 -1"
  Grey for neutral notes.

DECISION CARDS (gold left border, 4px instead of 3px, slightly taller):
— Same structure but with an "ACTIVE DECISION" section below the body:
— Situation text in italic (13px, #B0B8D0)
— 2-4 choice buttons stacked horizontally or vertically within the card.
  Each button: dark fill (#1A1E2E), hover to #252B3D, left label, faint effect hint on right.
— After choosing: the card expands downward to show resolution text + stat delta.

When new cards are added (match progresses): cards slide in from the top with
a 200ms ease-out downward push animation. The log auto-scrolls to keep the newest
card visible.

When the match ends: the final card ("MATCH END") has a thicker gold border (4px)
and the result summary text in slightly larger size (16px).
```

**底部决策面板**（全宽，80px，仅在玩家回合显示）：

```
Bottom decision panel — appears ONLY during the player's tactical turn.

Full-width dark panel (#13151F, border-top 2px #252A3D, 80px tall).
Centered horizontal button group:

ECONOMY PHASE: three buttons in a row (each 160×48px, 8px gap, centered):
— "💰 全买 / FULL BUY"     → green tinted bg, small description below
— "🔧 半买 / PARTIAL BUY"  → gold tinted bg, small description below
— "💸 省钱 / ECO"           → grey tinted bg, small description below

TACTICAL PHASE: 4-5 buttons (each ~110×48px, 6px gap, centered):
— Each with a short CS tactic label + tiny icon
— e.g., "⚡ Rush A", "🛡 Default", "🎭 Fake B", "🐢 Slow Lurk", "🗺 Map Control"

INACTIVE STATE: empty panel, fully dark background, no elements visible.
Panel slides up with 200ms ease-out when activated, slides down when deactivated.
```

#### 3.5.5 三栏比例与响应式

```
Desktop (1366×768 target):
  Left panel:  180px (fixed)
  Center:      flex (fills remaining, min ~700px)
  Right panel: 180px (fixed)
  Top bar:     full width, 60px (fixed)
  Bottom bar:  full width, 80px (only when active)

Minimum supported width: 1100px
  Below 1100px: side panels collapse to 140px
  Below 900px:  side panels collapse to 100px (KDA numbers reduce to 16px)
```

#### 3.5.6 双方选手数据对比视觉

比赛结束后（S06 之前），三栏布局中的 KDA 数据保留作为「赛后数据面板」，供玩家在进入 S06 小结前快速扫描双方选手表现。此时：
- 双方 KDA 全部揭露
- 本场 MVP 的卡片获得金色辉光边框
- 影响力条填充到头，MVP 的影响力条额外带金色渐变
- 底部决策面板消失

#### 3.5.7 AI 绘图 Prompt（完整比赛室）

```
A dark esports match simulation screen for a text-based Counter-Strike manager game —
the "Match Room" with a three-column esports HUD layout.

FULL SCREEN LAYOUT (dark background #0D0E14):

TOP SCOREBOARD BAR (full width, 60px, #13151F, bottom border #252A3D):
— Left: "枪神队伍" in bold white 16px with 🏠 icon and blue #3E6FFF stripe.
— Center: large score "1  –  2" in heavy 36px mono font (JetBrains Mono).
  Leading team digit in pure white, trailing in 70% white.
  Below: 5 round progress dots (● filled white, ◉ current blue pulsing, ○ hollow dark).
— Right: "VS Team Vitality" with yellow #F5D800 dot.
  Economy pills: 💰 FULL BUY (green) for player team, 💰 FULL BUY (green) for opponent.
  "⏱ 暂停" outlined button at far right.

LEFT COLUMN (180px fixed width):
5 vertically stacked player stat cards, 6px gap between them.
Each card (172×136px, #1A1E2E, 1px #252A3D border, 6px radius):
— Top: 32px circular comic avatar with blue team ring + player name "donk" bold 13px white
  + gold stars ★★★★★ (10px) + "⚡ hot form" orange pill tag (11px).
— Middle: KDA display. Three equal columns. Large bold mono numbers (22px white):
  K=12 centered over "杀" label (9px grey), D=5 over "死", A=3 over "助".
— Horizontal impact bar (6px, blue #3E6FFF fill on dark track #252A3D, ~80% filled)
  with "78" number at right end.
— Bottom: "🔫 AWP" weapon label + "💚 Alive" green status pill.
Second card shows sh1ro K=9 D=7 A=4, alive.
Third card (dead): FULL GRAYSCALE treatment. Portrait desaturated to B&W (grayscale 100%),
team ring dark grey. Card background shifted to #121318. Border faint #1A1A22.
KDA numbers in dim grey #4A4E5A. Impact bar fill grey #3A3A3A instead of blue.
"💀 DEAD" label in dark grey #55555A. Faint diagonal cross-hatch overlay on card.
Card at 100% opacity — the monochrome look instantly signals "eliminated" against
the vivid color of alive cards.
Cards are sorted top to bottom: donk, sh1ro, chopper, magixx, zont1x.

CENTER ZONE (flexible width, scrollable):
Stacked event cards with 8px gap, each full center width:
— Card 1: Blue left border (#3E6FFF). Header "ROUND 4 · OPENING" (11px grey).
  Body: "donk 开局在中路用AWP拿下首杀，枪神队伍获得人数优势。" (14px white).
  Footer: "↑ donk 火力 +3" in green (#28D99E).
— Card 2: Gold left border (#F4B942, 4px). Header "🔶 ROUND 4 · DECISION" (11px gold).
  Body: "对手选择全买防守。Vitality 的 ZywOo 在B点内场架枪。你的下一步？" (14px).
  Below: two choice buttons: "⚡ Rush B点" and "🎭 假打A点转B".
— Card 3 (lower, partial scroll): Red left border. Header "ROUND 4 · CLUTCH [1v3]" (gold badge).
  Body: "donk 在1v3残局中不可思议地连杀三人！全场沸腾。" (14px).
  Footer: "↑ donk 火力 +8  士气 +5" in green.

RIGHT COLUMN (180px fixed width):
Mirror layout of left column. Opponent player cards for Team Vitality:
— ZywOo K=18 D=3 A=2, impact 92, alive.
— ropz K=14 D=4 A=1, impact 74, alive.
— flameZ K=8 D=6 A=3, dead (60% opacity).
— apEX K=5 D=9 A=4, dead.
— Spinx K=10 D=5 A=2, alive.
Team color ring: yellow #F5D800 on all opponent cards.

BOTTOM DECISION PANEL (full width, 80px, #13151F, only when active):
Three centered economy buttons: "💰 全买/FULL BUY" (green tint), "🔧 半买/PARTIAL" (gold tint),
"💸 省钱/ECO" (grey tint). Each 160×48px, 8px gap.

OVERALL MOOD: dense competitive intelligence display. Like a CS match HUD merged with
a text narrative game. The side player cards give instant read on who's performing;
the center tells the story. Dark cockpit aesthetic. No bright colors except accent highlights.
```

#### 3.5.8 中文补充说明

- **三栏布局是比赛室最重要的视觉特征**。玩家一眼能看到自己五个选手的当前状态，也能对比对手——这种信息密度让玩家有「在教练席指挥」的沉浸感
- **KDA 数字要大而清晰**。K（击杀）是最重要的数字，因为每个击杀都直接对应一条事件日志。玩家扫一眼左栏就知道「donk 拿了 12 杀」= 这场比赛他打疯了
- **选手排序固定**。不要让 KDA 高的选手自动跳到上面——固定位置让玩家养成「扫一眼就知道谁怎么样」的习惯
- **死亡状态要非常明显**。暗化到 60% 不透明度 + 💀 标记，让玩家立刻知道场上还有几个人活着
- **高光闪烁是情绪出口**。donk 残局 1v3 后他的卡片边框闪金 2 秒——这就是比赛中的「视觉掌声」
- **对手 KDA 揭露节奏**。开局时对手 KDA 显示 "--"，随比赛进行逐步揭露。这不是隐藏信息（比赛结束后会全部显示），而是模拟「你在比赛中只能看到大概」
- **底部决策面板与中央事件日志联动**。当中央出现金色决策卡时，底部面板同步激活；当玩家做出选择后，决策卡展开结果，底部面板消失
- **影响力条不是实时竞技数据**，而是综合本场比赛选手贡献的视觉化指标，让玩家能快速比较选手表现

#### 3.5.9 暂停子界面 / Timeout Sub-Screen

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

#### 3.5.10 经济指示器 / Economy Indicator

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

#### 3.5.11 局数进展与残局状态 / Round Progress & Clutch State

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
  - When a clutch succeeds, the relevant player's side card flashes gold for 2 seconds
```

#### 3.5.12 验收标准

- [ ] 三栏布局清晰：左栏 5 张玩家选手卡，中央事件日志，右栏 5 张对手选手卡
- [ ] 每张选手卡包含：头像(32px圆形)+姓名+星级+KDA三列(大号等宽数字)+影响力条+武器+存活状态
- [ ] KDA 数字在事件触发后有更新动效（金闪=击杀，红闪=死亡，蓝闪=助攻）
- [ ] 死亡选手卡片：完整灰度化（头像去饱和 100% + 队伍圆环褪灰 + 影响力条变灰 + 边框褪色 + 💀 DEAD + 斜线纹理），300ms ease-out 过渡，与存活卡片的彩色形成强烈对比
- [ ] 高光选手（多杀/残局成功）卡片边框短暂闪金 2 秒 + ✦ 图标
- [ ] 顶部比分栏清晰显示双方队名 + 大号比分 + 5局进度圆点
- [ ] 事件卡按类型有不同左边框颜色（蓝/绿/红/金），决策卡边框更粗(4px)
- [ ] 对手选手数据随比赛进行逐步揭露（开局显示 "--"）
- [ ] 底部决策面板仅在玩家回合显示，非决策时完全空白隐藏
- [ ] 暂停子界面为金色边框模态弹窗，含 2-4 个选项 + 跳过按钮
- [ ] 经济指示器 pill 样式在顶部栏双方显示
- [ ] 残局标记 [1vX] 出现在事件卡头部，成功时关联选手卡片闪金
- [ ] 整体深色驾驶舱风格，信息密集但可读

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

#### 3.7.7 转会成功 —— 新成员报到弹窗 / New Signing Announcement Popup

转会交易成功或竞标获胜后，触发新成员报到弹窗。这不是一个普通的确认提示——这是队伍壮大的瞬间，应该有仪式感。

**触发时机：**
- S07 中完成一笔成功的转会交易（发送报价+对方接受）
- S07 竞标事件中玩家获胜
- 每赛季转会窗可能触发 1-3 次

**弹窗设计核心：** 一次成功的转会 = 「欢迎加入」的温暖 + 「战力提升」的兴奋。弹窗需要瞬间传达：你得到了一个怎样的选手。

```
┌──────────────────────────────────────────────────┐
│                  暗色遮罩（75%+模糊）               │
│                                                    │
│   ┌──────────────────────────────────────┐        │
│   │  ✦ 转会成功 / TRANSFER COMPLETE ✦     │ ← 金标签│
│   │                                      │        │
│   │       ┌──────────────┐              │        │
│   │       │   选手漫画头像  │              │ ← 128px │
│   │       │  128×128px   │              │  大尺寸 │
│   │       │  队伍色圆环    │              │  头像   │
│   │       └──────────────┘              │        │
│   │                                      │        │
│   │       欢迎加入 枪神队伍               │ ← 欢迎语│
│   │       WELCOME TO THE SQUAD           │        │
│   │                                      │        │
│   │    ┌──────────────────────────┐      │        │
│   │    │  donk                    │      │ ← 选手  │
│   │    │  ★★★★★  ⚡ 火力 92       │      │   信息卡│
│   │    │  原属: Team Spirit       │      │        │
│   │    │  转会费: $45,000         │      │        │
│   │    │  特质: hot_blooded       │      │        │
│   │    └──────────────────────────┘      │        │
│   │                                      │        │
│   │  你的阵容:   5/6  →  6/6 满员！      │ ← 阵容  │
│   │  阵容总战力: 342  →  418  (+76 ✦)   │   变化  │
│   │                                      │        │
│   │         [ 确认加入 / CONFIRM ]        │ ← 按钮  │
│   │         [     交易详情 >>    ]        │ ← 次要  │
│   └──────────────────────────────────────┘        │
│                                                    │
└──────────────────────────────────────────────────┘
```

**弹窗详细规格：**

| 元素 | 规格 |
|------|------|
| 弹窗尺寸 | 480×520px，居中，圆角 10px，暗底 #13151F |
| 顶部标签 | 金色 ✦ 图标 + "转会成功 / TRANSFER COMPLETE"，12px bold 金色 #F4B942，居中 |
| 头像 | 128×128px 圆形漫画头像，队伍色圆环 3px，居中。背景有微弱金色径向光晕 |
| 欢迎语 | "欢迎加入 枪神队伍" 22px bold 居中，下方英文副标题 11px 灰色 |
| 选手信息卡 | 暗色卡片 #1A1E2E，边框 1px #252A3D，圆角 6px，内含：姓名 20px bold + ★星级 + 关键属性(火力/战术数字) + 原属战队颜色标记 + 转会费金额 + 特质标签 |
| 阵容变化 | 两行对比数据："你的阵容 X/6 → Y/6"，"阵容总战力 AAA → BBB (+CC ✦)"，战力增长用绿色 #28D99E 突出 |
| 主按钮 | "确认加入 / CONFIRM" 电竞蓝 #3E6FFF，居中 |
| 次按钮 | "交易详情 >>" 灰色文字链接，按钮下方居中 |

**不同选手级别的弹窗变体：**

```
传奇级选手（价格 > 50, 边框炫彩）：
  - 弹窗顶部条从金色变为炫彩蓝紫金渐变（流动纹理 3px border-top）
  - 头像外围有两圈光环：内圈队伍色 + 外圈金色旋转粒子
  - 战力增长数字后缀 "✦ 传奇加盟" 标签
  - 背景有微弱金色粒子飘落动效（8-12 粒，缓速向下）

明星级选手（价格 31-50，金边框）：
  - 顶部条金色 #F4B942 静态，1px border-top
  - 头像有金色外环（静止，不旋转）
  - 战力增长数字后缀 "✦" 金色小星
  - 无粒子特效

普通级选手（价格 16-30，银边框）：
  - 顶部条银色 #C0C0C0
  - 标准头像，队伍色圆环
  - 战力增长绿色数字

替补级选手（价格 0-15，灰边框）：
  - 顶部条灰色 #7A849E
  - 标准头像
  - 战力增长较小，"阵容补充"语气
```

**入场动效时序（600ms 总长）：**

```
0ms    → 背景遮罩 fade in（200ms ease-out）
50ms   → 弹窗卡片 scale 0.92→1.0 + fade in（250ms ease-out，轻弹性）
150ms  → 顶部金色标签 fade in + 微光闪烁
200ms  → 头像从下方 20px 上浮到位（300ms ease-out）+ 金色光晕短暂闪烁
350ms  → 欢迎文字 fade in
400ms  → 选手信息卡 fade in + 从右侧 15px 滑入（200ms）
500ms  → 阵容变化数字逐位跳动到位（从 000 跳到实际数字，150ms）
600ms  → 按钮 fade in
```

**AI 绘图 Prompt：**

```
A "New Signing Announcement" popup/modal for a Counter-Strike esports manager game —
shown when the player successfully acquires a new player through the transfer window.

BACKGROUND: 75% dark overlay with 12px blur over the transfer window screen.

CENTERED MODAL CARD (#13151F, 480×520px, 10px border-radius, 1px border #252A3D):

TOP: a small gold "✦ 转会成功 / TRANSFER COMPLETE ✦" label in gold (#F4B942) centered text,
12px bold, all-caps, with tiny decorative dots on both sides.

HERO IMAGE AREA (centered, 128×128px):
A large circular comic-style player portrait. The portrait is a chest-up shot
in American-comic semi-realistic style. The border of the circle has a 3px team-color
ring (e.g., Spirit's green #00D664 if the player came from Team Spirit).
Behind the portrait: a subtle gold (#F4B942) radial glow, soft, blurred, radius ~80px.

BELOW THE PORTRAIT: "欢迎加入 枪神队伍" in bold 22px white centered text.
Below it: "WELCOME TO THE SQUAD" in 11px grey (#7A849E) uppercase centered.

PLAYER INFO CARD (below welcome, centered, 380×90px, #1A1E2E, 1px #252A3D border, 6px radius):
— Left side, large: player display name (20px bold white), e.g. "donk".
— Below name: gold stars ★★★★★ (10px) showing player rating.
— Below stars: key stats in a single compact row: "⚡ 火力 92    🎯 战术 78" in 12px white.
— Right side: "原属 / FROM" label in grey 9px, followed by the previous team name
  with team color dot (e.g., green dot + "Team Spirit" in 13px white).
  Below: "转会费 / FEE" label and "$45,000" in 14px white mono font.
  Below: small trait tag pill (e.g., "hot_blooded" in orange outline pill, 11px).

ROSTER CHANGE SECTION (below player info, two rows of centered text, 12px):
Row 1: "你的阵容   5/6  →  6/6   满员！" (the "→" and "满员" in green #28D99E)
Row 2: "阵容总战力   342  →  418   (+76 ✦)" (the "+76 ✦" in bright green #28D99E, bold)

BUTTON AREA (bottom, centered):
"确认加入 / CONFIRM" — a large primary button in accent blue (#3E6FFF), white text.
Below button: "交易详情 >>" text link in grey, small 11px.

For a LEGENDARY player (price > 50): the top label uses a gradient rainbow border (blue-purple-gold
flowing horizontally) instead of solid gold. The portrait has TWO rings: inner team color +
outer gold rotating particle ring. Soft gold particles (8-12 small dots) drift slowly downward
in the background of the card. A small "✦ 传奇加盟" gold badge appears next to the power gain number.

The overall feeling: a moment of squad growth and excitement. The large portrait and the
green "+76" power jump make the player feel the impact of their acquisition immediately.
```

**验收标准：**
- [ ] 交易成功后自动弹出，不可跳过（必须点确认）
- [ ] 头像大图 128×128px，队伍色圆环正确
- [ ] 选手信息卡包含姓名+星级+属性+原属队+转会费+特质
- [ ] 阵容变化数字有绿色增量高亮（"+76 ✦"醒目）
- [ ] 传奇/明星/普通/替补四级弹窗有对应的视觉差异化（边框/粒子/光晕）
- [ ] 入场动效不卡顿（600ms 内完成），头像上浮+数字跳动有反馈感
- [ ] 弹窗整体配色为金色+蓝（枪神队伍色），区别于其他弹窗的情绪类型
- [ ] 没有真人照片，头像为漫画风格

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
- [ ] S02 征召室：选手卡片网格（漫画头像+星级+能力值数字+阶梯边框），预算双层仪表（已锁定+剩余+数字滚动），6个阵容槽位（完整头像缩略图+属性）
- [ ] S03 杯赛支架：水平对阵树（队徽+比分+连接线），三级氛围（Katowice冰蓝/Cologne暖橙/Major紫金），玩家路径蓝色脉冲动画，决赛金边卡片，右侧奖杯区，底部对手预览+进度圆点
- [ ] S03b 杯赛颁奖：冠军加冕 + MVP公布 + 名次奖金表，玩家夺冠有金色氛围
- [ ] S04 赛前事件卡：模态弹窗，颜色条区分事件类型，情报事件用对手颜色
- [ ] S05 比赛室：三栏对阵布局（左栏5张选手卡+中央事件日志+右栏5张对手卡），选手卡含头像+姓名+星级+KDA大号等宽数字+影响力条+武器+存活状态，KDA实时更新动效，死亡灰度化（头像去饱和100%+影响力条变灰+💀DEAD+斜线纹理），高光闪金
- [ ] S06 赛后小结：比分大字 + MVP金色 + 决策回顾
- [ ] S07 转会窗口：三栏布局，价值平衡条，意愿指数，竞标弹窗，新成员报到弹窗（四级差异化：传奇炫彩/明星金/普通银/替补灰）
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
- [ ] 鼓励弹窗：9 个场景全部有氛围插图（启程/决战/荣耀/坚韧/沉思），插图底部渐变融入卡片，弹窗动效 fade+scale

---

*文档版本：v1.6 · 2026-06-26 · 由技术美术主导撰写。v1.6：S07 新增转会成功新成员报到弹窗（§3.7.7）——128px大号头像+选手信息卡+阵容战力变化对比+四级差异化边框（传奇炫彩/明星金/普通银/替补灰）+600ms入场动效序列*  
*本文档面向 AI 图像生成工具及 UI 开发者，所有视觉描述均为 AI 可执行的精确英文 Prompt 形式*
