# 选手羁绊系统设计文档

> **版本**: v1.0  
> **日期**: 2026-06-26  
> **定位**: 作为 `src/content/players.ts` 和 `src/simulation/` 的扩展设计  
> **目标读者**: 实现工程师、内容策划、叙事写手

---

## 目录

1. [设计动机](#1-设计动机)
2. [羁绊类型定义](#2-羁绊类型定义)
3. [具体羁绊列表](#3-具体羁绊列表)
4. [机械设计规范](#4-机械设计规范)
5. [羁绊触发与计算模型](#5-羁绊触发与计算模型)
6. [叙事钩子](#6-叙事钩子)
7. [边缘情况与约束](#7-边缘情况与约束)
8. [实现建议](#8-实现建议)
9. [附录：选手 ID 速查表](#9-附录选手-id-速查表)

---

## 1. 设计动机

### 玩家体验目标

> **"我不只是选了五个数值最高的选手——我在组建一支有灵魂的队伍。"**

羁绊系统的核心目标是：让玩家的**选人决策产生情感重量**。当玩家必须在"数值更高的选手 A"和"和现有选手有羁绊的选手 B"之间做选择时，这个系统才能发挥价值。

### 设计原则

| 原则 | 说明 |
|---|---|
| **羁绊不能是纯 buff** | 必须有代价、有条件、有风险——否则最优策略永远是堆叠羁绊 |
| **羁绊是叙事引擎** | 每个羁绊都附带了故事钩子，会在比赛中以文字事件的形式触发 |
| **羁绊不是灵丹妙药** | 羁绊不会让弱队变成强队，它是在已有数值上的风味层 |
| **尊重现实，但服务游戏** | 羁绊关系基于真实 CS 电竞圈，但数值幅度为游戏平衡服务 |

---

## 2. 羁绊类型定义

系统支持 **9 种羁绊类型**，每种有不同的触发条件和效果。

### 2.1 师徒羁绊 (Mentor-Protege)

**关系**: 老将带新人，一方在另一方的低谷期给予过关键帮助  
**触发条件**: 两人同时首发  
**效果**: 降低新人的 `discipline` 方差（发挥更稳定），小幅提升新人的 `clutch`  
**代价**: 老将需要消耗额外精力——当新人发挥差时，老将的 `firepower` 有轻微负面影响（分心/心理负担）  
**叙事色调**: 温暖、传承

**现实原型**:
- NiKo → m0NESY（m0NESY 公开表示低谷期 NiKo 的帮助最大）
- apEX → ZyWoo（法国 CS 的旗帜交接）
- karrigan → frozen/ropz（MOUZ 时期的培养）

---

### 2.2 兄弟羁绊 (Sworn Brothers)

**关系**: 长期并肩作战的好友，私下关系深厚，场上默契极高  
**触发条件**: 两人同时首发  
**效果**: 小幅度提升团队的 `tactics`（默契不需语言），两人在同一个攻防区域时（如两人同时守 B）额外加成  
**代价**: 如果其中一人被交易/下放，另一人会有 **离散惩罚** (`discipline` -2，持续整个杯赛)  
**叙事色调**: 兄弟、信任

**现实原型**:
- donk & magixx（donk 的好友，magixx 被描述为"donk 好友回归"）
- ropz & frozen（MOUZ 时期多项数据如出一辙，默契天成）
- electroNic & Perfecto（NAVI 时期多年搭档，后一起转会 Cloud9）

---

### 2.3 血缘羁绊 (Blood Bond)

**关系**: 真正的家庭关系（表兄弟等）  
**触发条件**: 两人同时首发  
**效果**: 全队 `tactics` 稳定提升（家族纽带传导到全队氛围），两人 `discipline` 均有提升  
**代价**: 如果其中一人长时间表现低迷（连续两场比赛 rating 低于队伍平均），另一人的 `firepower` 会受到情绪拖累  
**叙事色调**: 家族、守护

**现实原型**:
- NiKo & huNter-（表兄弟，出生就住在一起，huNter 说没有 NiKo 在队里"很不习惯"）

---

### 2.4 老将领袖 (Elder Statesman)

**关系**: 单人羁绊——非双人配对，而是某位选手自带"老将光环"  
**触发条件**: 该选手在队中（首发或替补均可，但首发时效果更强）  
**效果**: 全队 `discipline` +2（首发）/ +1（替补）；全队在淘汰赛关键局（半决赛/决赛）的 `clutch` 额外 +3  
**代价**: 该选手的 `firepower` 已经反映在基础数值中，这是一个"辐射型" buff——不增加老将自己数值，增加队友数值。  
**叙事色调**: 定海神针

**现实原型**:
- karrigan（34 岁征战 CS2 Major，比最年轻选手大 18 岁）
- dupreeh（五届 Major 冠军，大赛基因）
- FalleN（巴西 CS 教父，无数巴西选手的引路人）
- rain（FaZe 近十年队魂）

---

### 2.5 双核驱动 (Dual Core)

**关系**: 两个超级巨星在同一支队伍，不是师徒也不是好友，但互相知道对方是世界级  
**触发条件**: 两人同时首发，且 **双方最近一场比赛的 rating 都高于队伍平均**  
**效果**: 全队 `firepower` +3，但 `discipline` -1（双核吸引过多资源）  
**代价**: 当 **只有一人发挥好、另一人低迷** 时，低迷一方受到额外 `clutch` -3（"他在拖累我"的心态）  
**叙事色调**: 光芒、竞争、互相成就

**现实原型**:
- ZyWoo & ropz（Vitality 双核，2025 年 HLTV Top 3 中的两位）
- sh1ro & donk（Spirit 的双重威胁，"当两人都在线时，Spirit 可以击败任何人"）
- NiKo & m0NESY（在 G2/Falcons 时期的双核，除了师徒关系还有双核效应）

---

### 2.6 故交重逢 (Reunion)

**关系**: 曾经是队友，分开后再次在同一队伍相聚  
**触发条件**: 两人同时首发  
**效果**: 首场杯赛该羁绊**不生效**（需要时间重新磨合），从第二场杯赛开始，`tactics` +1，配合时间越长效果越显著  
**代价**: 如果再次分开，离散惩罚是普通兄弟羁绊的 **2 倍**（"又来了"心理创伤）  
**叙事色调**: 重逢、岁月

**现实原型**:
- karrigan & NiKo（在 Falcons 重逢，距离上次同队七年）
- karrigan & ropz（MOUZ → FaZe，再在 Vitality 碰面？不，这里 karrigan 去了 Falcons，ropz 在 Vitality——但 reunion 类型仍然成立）
- Twistzz & FaZe（离开 Liquid 后回归 FaZe）
- dev1ce & Astralis（离开 NiP 回归，但因为 Astralis 不在当前队伍池中，暂无直接应用）

---

### 2.7 宿敌转队友 (Former Rivals → Teammates)

**关系**: 曾经在两个敌对队伍中针锋相对，现在成为队友  
**触发条件**: 两人同时首发  
**效果**: 前两场比赛 `discipline` -1（磨合摩擦），第三场开始 `firepower` +1（把对抗转化为竞争动力）  
**特别机制**: 如果队伍在**淘汰赛**击败了两人曾经共同的宿敌队，触发"宿敌清算"事件，全队 `clutch` +3 持续一场  
**叙事色调**: 骄傲、和解

**现实原型**:
- cadiaN & Astralis 队友（cadiaN 加入曾经最大的宿敌 Astralis，"矛盾重重却携手并肩"）

---

### 2.8 背叛烙印 (Betrayal Scar)

**关系**: **负面羁绊**——一方曾背叛另一方，现在被迫同队或成为对手  
**触发条件**: 两人同时首发  
**效果**: 所有正面羁绊效果**减半**，且 `discipline` -3  
**叙事色调**: 冰冷、仇恨  
**是否可治愈**: 如果团队连赢两场淘汰赛，烙印可转化为"和解"——效果变为中性（无 buff/debuff），并触发特殊叙事事件

**⚠️ 重要**: 这是一个高风险羁绊。玩家必须权衡：是接受 debuff 换取高数值选手，还是避开这种组合。

**现实原型**:
- cadiaN & stavn/jabbi（stavn 和 jabbi 曾是 cadiaN 亲自带入 Heroic 的选手，后来"背叛"了他——stavn/jabbi 在 cadiaN 不知情的情况下推动把他踢出队伍，随后自己转投 Astralis）
  - **注意**: stavn 和 jabbi 目前**不在当前选手池中**。只有当选手池扩展时才需要添加此羁绊。这是一个设计占位。

---

### 2.9 文化兄弟 (Culture Bond)

**关系**: 来自同一国家/地区的选手在同一国际队伍中  
**触发条件**: 两人同时首发  
**效果**: 队伍 `cohesion` +1（共同语言和背景减少沟通摩擦）  
**代价**: 无——这是一个纯正面但幅度很小的 buff，代表"老乡之间的天然亲近感"  
**叙事色调**: 家乡、温暖

**现实原型**:
- FURIA 全队（巴西队全员同文化——如果玩家从 FURIA 选人进枪神队伍）
- Spirit 独联体选手群（donk, sh1ro, magixx, zont1x 等都来自独联体地区）
- NAVI 国际阵容中的同语言选手（如 jL & w0nderful 都是东欧/波罗的海选手）

---

## 3. 具体羁绊列表

以下是根据当前选手池（`src/content/players.ts`，共 48 名选手、8 支队伍）定义的**可实施羁绊**。每条羁绊都包含完整数据字段。

### 数据模型

```typescript
// 羁绊定义
interface BondDefinition {
  /** 唯一标识符，形如 "bond_niko_monesy" */
  id: string;
  /** 羁绊类型 */
  type: BondType;
  /** 羁绊名称（显示用） */
  name: string;
  /** 涉及的选手 ID 列表（通常为 2 人，ElderStateman 为 1 人） */
  players: string[];
  /** 效果描述（显示给玩家） */
  description: string;
  /** 数值效果 */
  effects: BondEffects;
  /** 触发条件（null = 只要同首发就触发） */
  condition: BondCondition | null;
  /** 叙事钩子 ID 列表（用于比赛文字事件） */
  narrativeHooks: string[];
  /** 来源注释 */
  sourceNote: string;
}

// 羁绊类型
type BondType =
  | "mentor_protege"
  | "sworn_brothers"
  | "blood_bond"
  | "elder_statesman"
  | "dual_core"
  | "reunion"
  | "former_rivals"
  | "betrayal_scar"
  | "culture_bond";

// 羁绊效果
interface BondEffects {
  firepower?: number;
  tactics?: number;
  discipline?: number;
  clutch?: number;
  cohesion?: number;
  /** 触发时机 ("passive" = 持续生效, "conditional" = 满足条件时) */
  timing: "passive" | "conditional";
}

// 羁绊触发条件
interface BondCondition {
  type: "both_starting" | "both_above_average" | "after_match_count" | "elimination_round";
  params?: Record<string, number>;
}
```

---

### 羁绊详表

#### BOND-001: 尼孩连线 — NiKo × m0NESY

| 字段 | 值 |
|---|---|
| **id** | `bond_niko_monesy` |
| **type** | `mentor_protege` + `dual_core`（**复合羁绊**） |
| **players** | `["niko", "monesy"]` |
| **name** | 尼孩连线 |
| **description** | NiKo 是 m0NESY 的导师和最信任的队友。m0NESY 曾公开说："当我陷入挣扎时，NiKo 帮我最多。"两人从 G2 到 Falcons 一直并肩作战。 |
| **effects** | ① m0NESY 的 `discipline` 波动范围减半（下限提升 3） ② m0NESY 的 `clutch` +3 ③ 当两人上一场比赛 rating 都 > 队伍平均时，全队 `firepower` +2 |
| **condition** | `both_starting`：两人都首发；双核效果额外需要 `both_above_average` |
| **timing** | passive（师徒部分始终有效），conditional（双核部分） |
| **narrativeHooks** | `["niko_calming_monesy", "monesy_learning_from_niko", "dual_firing"]` |
| **sourceNote** | m0NESY 2024 年采访、Buff 163 "尼孩回忆录" |

**设计注释**: 这是游戏中**唯一**的复合羁绊。NiKo & m0NESY 的关系在 CS 社区中有着独一无二的地位——它同时是师徒和双核。不要拆成两个独立羁绊，复合才能体现这种关系的深度。

---

#### BOND-002: 绿龙兄弟 — donk × magixx

| 字段 | 值 |
|---|---|
| **id** | `bond_donk_magixx` |
| **type** | `sworn_brothers` |
| **players** | `["donk", "magixx"]` |
| **name** | 绿龙兄弟 |
| **description** | donk 和 magixx 在 Team Spirit 建立了深厚的兄弟情谊。当 magixx 回归绿龙时，被报道为"donk 好友回归"。两人在场上的配合如呼吸般自然。 |
| **effects** | ① 全队 `tactics` +1 ② 两人在同一攻防区域时，该区域的 `firepower` +2 |
| **condition** | `both_starting` |
| **timing** | passive |
| **narrativeHooks** | `["donk_magixx_telepathy", "green_dragon_duo", "magixx_sets_up_donk"]` |
| **sourceNote** | 2025 年 Spirit 阵容变动报道、magixx 回归声明 |

**离散惩罚**: 如其中一人被交易/下放，另一人 `discipline` -2，持续整个杯赛。

---

#### BOND-003: 科瓦奇表亲 — NiKo × huNter

| 字段 | 值 |
|---|---|
| **id** | `bond_niko_hunter` |
| **type** | `blood_bond` |
| **players** | `["niko", "huNter"]` |
| **name** | 科瓦奇表亲 |
| **description** | NiKo 和 huNter- 是表兄弟，自出生就住在一起。huNter 曾说"四年来我们一起经历了一切，突然看不到他很不习惯。"这种血缘纽带让他们的配合超越普通队友。 |
| **effects** | ① 全队 `tactics` +1 ② 两人 `discipline` +2 |
| **condition** | `both_starting` |
| **timing** | passive |
| **narrativeHooks** | `["kovac_family_double", "blood_is_thicker", "cousin_trust"]` |
| **sourceNote** | huNter- 2025 年采访（"我和 NiKo 分开后很不习惯"） |

**情绪拖累**: 如果其中一人连续两场比赛 rating 低于队伍平均，另一人 `firepower` -2，直到状态恢复。

> **⚠️ 实现注意**: `huNter` 在当前选手池中不存在于 Falcons 阵容中。如果 huNter 未被加入选手池，此羁绊处于**休眠状态**。如果 huNter 作为转会目标加入，此羁绊变为**可激活**。

---

#### BOND-004: 大表哥的权杖 — karrigan

| 字段 | 值 |
|---|---|
| **id** | `bond_karrigan_elder` |
| **type** | `elder_statesman` |
| **players** | `["karrigan"]` |
| **name** | 大表哥的权杖 |
| **description** | Finn "karrigan" Andersen，34 岁的老将 IGL，比 Major 最年轻选手大 18 岁。他经历过 CS 的所有时代，是 FaZe 最辉煌岁月的缔造者。只要他在场上，整支队伍就多了一份沉稳。 |
| **effects** | ① 全队 `discipline` +3（首发）/+1（替补）② 淘汰赛（半决赛/决赛）全队 `clutch` +3 |
| **condition** | 首发时效果完整（+3 discipline +3 clutch），替补时减半 |
| **timing** | passive（discipline），conditional（clutch 仅淘汰赛触发） |
| **narrativeHooks** | `["karrigan_speech", "veteran_calm", "never_too_old"]` |
| **sourceNote** | karrigan 1990 年出生，2025 Major 与 17 岁选手同场竞技 |

---

#### BOND-005: 法国火炬 — apEX × ZyWoo

| 字段 | 值 |
|---|---|
| **id** | `bond_apex_zywoo` |
| **type** | `mentor_protege` |
| **players** | `["apex", "zywoo"]` |
| **name** | 法国火炬 |
| **description** | apEX 是 ZyWoo 进入顶级赛场后的队长和引路人。作为法国 CS 最具代表性的两代人，他们完成了法国电竞的旗帜交接。apEX 的火爆性格恰好被 ZyWoo 的沉稳中和。 |
| **effects** | ① ZyWoo 的 `discipline` +2 ② 当队伍比分落后时（2 分差距），ZyWoo 的 `clutch` +4 |
| **condition** | `both_starting`；clutch 加成额外需要队伍落后条件 |
| **timing** | passive + conditional |
| **narrativeHooks** | `["apex_rallies_zywoo", "french_torch_passed", "zywoo_calm_despite_storm"]` |
| **sourceNote** | apEX & ZyWoo 自 2020 年起同在 Vitality，共同赢得两届 Major |

---

#### BOND-006: MOUZ 双子星 — ropz × frozen

| 字段 | 值 |
|---|---|
| **id** | `bond_ropz_frozen` |
| **type** | `sworn_brothers` |
| **players** | `["ropz", "frozen"]` |
| **name** | MOUZ 双子星 |
| **description** | ropz 和 frozen 在 MOUZ 时期的数据如出一辙——HLTV 曾感叹"命运的安排"。他们在 MOUZ 并肩作战多年，建立了深厚的默契。即使后来各奔东西（ropz → Vitality，frozen → FaZe），如果重聚仍能回忆起那段巅峰默契。 |
| **effects** | ① 全队 `tactics` +1 ② ropz 的 `clutch` +2，frozen 的 `discipline` +2 |
| **condition** | `both_starting` |
| **timing** | passive |
| **narrativeHooks** | `["mouz_twins_reunite", "old_synergy_kicks_in", "twin_data"]` |
| **sourceNote** | HLTV 2023 年数据图对比 |

> **⚠️ 实现注意**: ropz (Vitality) 和 frozen (FaZe) 属于不同队伍。此羁绊只在玩家**通过转会市场将两人买进同一队伍**时才能激活。这是转会系统的核心驱动力之一。

---

#### BOND-007: FaZe 铁三角 — rain × broky × karrigan

| 字段 | 值 |
|---|---|
| **id** | `bond_faze_trio` |
| **type** | `sworn_brothers`（三人版） |
| **players** | `["rain", "broky", "karrigan"]` |
| **name** | FaZe 铁三角 |
| **description** | rain（近十年 FaZe 队魂）、broky（FaZe 主力狙击手）、karrigan（FaZe 大脑）——这三人是 FaZe 多年辉煌的核心。他们的配合不需要话语。当三人都在场上时，FaZe 的比赛经验无人能及。 |
| **effects** | ① 全队 `tactics` +2 ② 经济局（ECO/半买）时全队 `firepower` +1（知道怎样用劣势装备创造机会） |
| **condition** | 三人同时首发（缺一人则降级为双人效果减半） |
| **timing** | passive |
| **narrativeHooks** | `["faze_core_rally", "ten_years_together", "eco_warriors"]` |
| **sourceNote** | rain 2016 年加入 FaZe，为 CS 电竞史上最长的选手-组织合作之一 |

**三人机制**: 三人全部首发 → 全效果。只有两人首发 → 全队 `tactics` +1（减半）。只有一人首发 → 无效果（不激活）。

---

#### BOND-008: 巴西教父 — FalleN

| 字段 | 值 |
|---|---|
| **id** | `bond_fallen_elder` |
| **type** | `elder_statesman` |
| **players** | `["fallen"]` |
| **name** | 巴西教父 |
| **description** | Gabriel "FalleN" Toledo，两届 Major 冠军，巴西 CS 无可争议的教父级人物。他不仅是 IGL，更是无数巴西年轻选手的引路人。 |
| **effects** | ① 全队 `discipline` +3（首发）② 队伍中所有巴西/拉丁美洲选手额外 `firepower` +1 |
| **condition** | 首发；国籍加成需要队伍中有其他巴西选手 |
| **timing** | passive |
| **narrativeHooks** | `["fallen_guidance", "brazilian_soul", "professor_teaches"]` |
| **sourceNote** | FalleN 自 2011 年起征战职业赛场 |

---

#### BOND-009: Spirit 双核 — donk × sh1ro

| 字段 | 值 |
|---|---|
| **id** | `bond_donk_sh1ro` |
| **type** | `dual_core` |
| **players** | `["donk", "sh1ro"]` |
| **name** | Spirit 双核 |
| **description** | donk 和 sh1ro——一个是最具爆发力的步枪手，一个是最稳定的狙击手。CS 社区评价"当两人都在线时，Spirit 可以击败任何人。" |
| **effects** | ① 两人 rating 同时 > 队伍平均 → 全队 `firepower` +3，全队 `discipline` -1 ② 只有一人发挥 → 低迷方 `clutch` -3 |
| **condition** | `both_starting` + `both_above_average`（正面），或一方 `below_average`（负面） |
| **timing** | conditional |
| **narrativeHooks** | `["dual_core_ignition", "sh1ro_covers_donk", "only_one_firing"]` |
| **sourceNote** | CS2 Settings 网站分析 sh1ro & donk 双核效应 |

---

#### BOND-010: 七年之约 — karrigan × NiKo

| 字段 | 值 |
|---|---|
| **id** | `bond_karrigan_niko` |
| **type** | `reunion` |
| **players** | `["karrigan", "niko"]` |
| **name** | 七年之约 |
| **description** | karrigan 和 NiKo 曾在 2017-2018 年 FaZe 时期并肩作战，那是 FaZe 第一个"银河战舰"时代。七年后的 2025-2026 年，两人在 Falcons 重聚——karrigan 带着多届 Major 冠军的经验，NiKo 带着累积多年的个人实力。 |
| **effects** | ① 首场杯赛不触发 ② 第二场杯赛起，全队 `tactics` +2，两人 `clutch` +2 |
| **condition** | `both_starting` + `after_match_count>=1`（至少一起打过一场杯赛） |
| **timing** | conditional（需要时间磨合） |
| **narrativeHooks** | `["seven_years_later", "old_faze_reborn", "karrigan_niko_reunion"]` |
| **sourceNote** | karrigan 2026 年加入 Falcons，与 NiKo 时隔七年重逢 |

> **⚠️ 实现注意**: karrigan 和 NiKo 都已在选手池中，但分属不同队伍（karrigan → FaZe, NiKo → Falcons）。此羁绊激活需要玩家通过转会市场操作。这也是转会系统的重要驱动力。

---

#### BOND-011: 丹麦宿敌的和解 — cadiaN × 前 Heroic 背叛者

| 字段 | 值 |
|---|---|
| **id** | `bond_cadian_heroic_scar` |
| **type** | `betrayal_scar` |
| **players** | `["cadian"]` + `["stavn", "jabbi"]` 中的任意一人 |
| **name** | 丹麦宿敌的和解 |
| **description** | cadiaN 亲手将 stavn 和 jabbi 带入 Heroic 并培养他们，但这两人后来背着 cadiaN 推动将他踢出队伍，并转投宿敌 Astralis。这是 CS 电竞史上最著名的 drama 之一。如果被迫同队，气氛将降至冰点。 |
| **effects** | ① `discipline` -3 ② 所有其他正面羁绊效果减半 ③ 连续赢两场淘汰赛后转化为"和解"（debuff 清零但不产生 buff） |
| **condition** | `both_starting` |
| **timing** | passive（负面效果始终存在） |
| **narrativeHooks** | `["cadian_cold_stare", "betrayal_memory", "forced_to_work", "redemption_arc"]` |
| **sourceNote** | 2023 年 Heroic 内部 drama，2024 年 cadiaN 加入 Astralis 报道 |

> **⚠️ 实现注意**: cadiaN、stavn、jabbi **目前都不在选手池中**。这是一个设计占位，只有当选手池扩展到包含这些选手时才需要实现。

---

#### BOND-012: 千里之外的亚洲之光 — MongolZ 全员

| 字段 | 值 |
|---|---|
| **id** | `bond_mongolz` |
| **type** | `culture_bond`（全队版） |
| **players** | `["910", "senzu", "bLitz", "mzinho", "techno"]` |
| **name** | 草原铁骑 |
| **description** | The MongolZ 是蒙古 CS 的代表，全员蒙古籍。他们从亚洲预选赛一路打到顶级赛场，是真正意义上的"草根崛起"故事。全员同国籍意味着极低的沟通成本和天然的团队凝聚力。 |
| **effects** | ① 每两名蒙古选手同首发 → `cohesion` +1 ② 五名蒙古选手全部首发 → 额外全队 `firepower` +1 和 `clutch` +2（"为蒙古而战"的信念） |
| **condition** | `both_starting`（两人生效），全员五人为特殊强效 |
| **timing** | passive |
| **narrativeHooks** | `["mongolz_pride", "asian_underdog", "five_horsemen"]` |
| **sourceNote** | MongolZ 2024-2025 年崛起，成为亚洲 CS 旗帜 |

> **⚠️ 实现注意**: 这是一个**全队羁绊**，不用作"转会目标"。MongolZ 选手本来就同队，羁绊效果在他们原队中就已生效。只有在玩家从 MongolZ 买人进枪神队伍时，需要重新计算部分效果。

---

### 羁绊总览表

| ID | 名称 | 类型 | 涉及选手 | 效果 | 状态 |
|---|---|---|---|---|---|
| BOND-001 | 尼孩连线 | mentor_protege + dual_core | niko, monesy | monesy稳定+3, 双核全队+2火力 | ✅ 可激活 |
| BOND-002 | 绿龙兄弟 | sworn_brothers | donk, magixx | tactic+1, 同区域火+2 | ✅ 可激活 |
| BOND-003 | 科瓦奇表亲 | blood_bond | niko, huNter | tactic+1, 两人discipline+2 | ⚠️ huNter 不在池 |
| BOND-004 | 大表哥的权杖 | elder_statesman | karrigan | 全队discipline+3, 淘汰赛clutch+3 | ✅ 可激活 |
| BOND-005 | 法国火炬 | mentor_protege | apex, zywoo | zywoo稳+2, 落后时clutch+4 | ✅ 可激活 |
| BOND-006 | MOUZ 双子星 | sworn_brothers | ropz, frozen | tactic+1, ropz clutch+2, frozen dis+2 | ✅ 跨队可激活 |
| BOND-007 | FaZe 铁三角 | sworn_brothers(3人) | rain, broky, karrigan | tactic+2, ECO局火+1 | ✅ 可激活 |
| BOND-008 | 巴西教父 | elder_statesman | fallen | dis+3, 巴西选手火+1 | ✅ 可激活 |
| BOND-009 | Spirit 双核 | dual_core | donk, sh1ro | 双核全队火+3 dis-1, 单核低迷clutch-3 | ✅ 可激活 |
| BOND-010 | 七年之约 | reunion | karrigan, niko | 第二场杯赛起tactic+2, clutch+2 | ✅ 跨队可激活 |
| BOND-011 | 丹麦宿敌 | betrayal_scar | cadiaN + stavn/jabbi | dis-3, 正面羁绊减半 | ⚠️ 选手不在池 |
| BOND-012 | 草原铁骑 | culture_bond | MongolZ全员 | 每人pair+1 cohesion, 五人额外buff | ✅ 可激活 |

> **状态说明**:
> - ✅ 可激活 = 涉及选手都在当前选手池中
> - ⚠️ 待扩展 = 至少一名选手不在当前池中，需要选手池扩展或转会系统支持跨队转会后才可激活
> - BOND-006 和 BOND-010 标记为"跨队可激活"——涉及的选手分属不同队伍，需要玩家通过转会系统拉人

---

## 4. 机械设计规范

### 4.1 羁绊计算时机

```
选秀完成 → 计算基础 TeamStats → 检查羁绊 → 应用羁绊效果 → 得到最终 TeamStats
    │
    每场比赛前 → 检查羁绊条件（如 both_above_average）→ 判定条件羁绊是否触发
    │
    比赛后 → 更新选手状态 → 检查"情绪拖累"等负面条件 → 更新羁绊状态
```

### 4.2 羁绊效果叠加规则

| 规则 | 说明 |
|---|---|
| **同类型叠加** | 多个同类型羁绊（如两个 `sworn_brothers`）**效果叠加**，数值各自独立 |
| **冲突规则** | 如果一个选手同时被多个羁绊 buff，效果**全部生效**——不设置上限，因为数值幅度本身很小 |
| **负面优先** | 如果 `betrayal_scar` 触发，所有正面羁绊效果**减半**（取整向下）。这是唯一覆盖规则。 |
| **最小值** | 羁绊效果不能将任何属性降至 0 以下 |

### 4.3 离散惩罚

当有以下操作时触发离散惩罚:

1. **交易**: 将一位有 `sworn_brothers` 羁绊的选手卖掉
2. **下放替补**: 将有羁绊的选手从首发移到替补

惩罚效果:
- `sworn_brothers`: 留下的选手 `discipline` -2，持续整个当前杯赛
- `blood_bond`: 留下的选手 `firepower` -2，直到被移除的选手回归或杯赛结束
- `reunion`: `discipline` -4，持续整个赛季（"再次被分开"的创伤）

---

## 5. 羁绊触发与计算模型

### 5.1 伪代码

```typescript
function calculateBondEffects(
  activeRoster: string[],        // 当前首发 5 人 ID 列表
  bonds: BondDefinition[],       // 所有已定义的羁绊
  lastMatchStats: PlayerStats,   // 上一场比赛各选手数据
  cupIndex: number,              // 当前是第几场杯赛（从 0 开始）
  matchContext: MatchContext     // 当前比赛上下文（落后/领先/淘汰赛等）
): TeamStatModifiers {
  const modifiers = { firepower: 0, tactics: 0, discipline: 0, clutch: 0, cohesion: 0 };
  let hasBetrayalScar = false;

  for (const bond of bonds) {
    // 1. 检查所有涉及选手是否在首发中
    const bondedPlayers = bond.players.filter(id => activeRoster.includes(id));
    if (bondedPlayers.length < bond.players.length) continue; // 羁绊不完整

    // 2. 检查 betrayal_scar（影响所有其他羁绊的最优先级）
    if (bond.type === "betrayal_scar") {
      hasBetrayalScar = true;
    }

    // 3. 检查条件触发
    if (bond.condition) {
      if (!checkCondition(bond.condition, lastMatchStats, matchContext, cupIndex)) {
        continue; // 条件不满足，跳过
      }
    }

    // 4. 应用效果
    applyBondEffects(modifiers, bond.effects);
  }

  // 5. 背叛烙印惩罚：所有正面羁绊效果减半
  if (hasBetrayalScar) {
    for (const key of Object.keys(modifiers)) {
      if (modifiers[key] > 0) modifiers[key] = Math.floor(modifiers[key] / 2);
    }
  }

  return modifiers;
}
```

### 5.2 条件检查函数

```typescript
function checkCondition(
  condition: BondCondition,
  lastMatchStats: PlayerStats,
  matchContext: MatchContext,
  cupIndex: number
): boolean {
  switch (condition.type) {
    case "both_starting":
      return true; // 已在外部检查

    case "both_above_average":
      return condition.params!.playerIds.every(
        id => lastMatchStats[id].rating > lastMatchStats.teamAverageRating
      );

    case "after_match_count":
      return cupIndex >= condition.params!.minCups;

    case "elimination_round":
      return matchContext.isEliminationRound;

    default:
      return true;
  }
}
```

---

## 6. 叙事钩子

每个羁绊的 `narrativeHooks` 字段引用了叙事事件 ID。这些事件会在**比赛进行中**以文字弹出形式触发。

### 6.1 钩子触发时机

| 触发时机 | 条件 | 示例钩子 |
|---|---|---|
| **领先时** | 比分领先 2+ 分 | `niko_calming_monesy`（"当 NiKo 拍拍 m0NESY 的肩膀，小孩的手稳了很多。"） |
| **落后时** | 比分落后 2+ 分 | `apex_rallies_zywoo`（"apEX 用他特有的法式怒吼让全队重新振作..."） |
| **关键局** | 淘汰赛第 3 局（决胜局） | `karrigan_speech`（"karrigan 站起来，用他 15 年职业生涯的声音说了一句话。"） |
| **残局** | 1vX 或 2vX 残局 | `sh1ro_covers_donk`（"sh1ro 架住另一条路，他知道 donk 会冲。"） |
| **经济局** | ECO 局 | `eco_warriors`（"FaZe 核心相视一笑，他们经历过太多次这样的局面。"） |
| **日常轮** | 随机概率，无特殊条件 | `mongolz_pride`（"bLitz 用蒙语喊了一句，全队都笑了。"） |

### 6.2 钩子内容模板

所有钩子使用模板变量系统（与 `{star_player_name}` 相同格式）:

```
{niko_calming_monesy}
> 比分落后，m0NESY 的手指在键盘上微微颤抖。NiKo 侧过头，压低声音对小孩说了什么。下一秒，m0NESY 深吸一口气，重新握紧了鼠标。
> 【尼孩连线】m0NESY 的下一轮 clutch 判定 +3
```

**规则**:
- 钩子必须明确告知玩家**是什么羁绊触发了什么效果**（例如 `【尼孩连线】m0NESY clutch +3`）
- 钩子文字不超过 3 行
- 同一场比赛最多触发 3 个羁绊钩子，避免信息过载

---

## 7. 边缘情况与约束

### 7.1 跨队羁绊

BOND-006（ropz × frozen）和 BOND-010（karrigan × NiKo）涉及**不同队伍的选手**。

**处理方式**:
- 在原队中：羁绊**不激活**（不在同一队伍）
- 在转会市场：当玩家试图买入有跨队羁绊的另一位选手时，UI 提示"如果你同时拥有 X 和 Y，将激活羁绊【羁绊名】"
- 枪神队伍中：如果玩家通过转会操作将两人都买进队伍，羁绊激活
- AI 队伍中：AI 队伍**永远不会主动**进行跨队转会来激活羁绊

### 7.2 羁绊断裂

当一位选手被交易/下放时:
1. 检查该选手参与的所有羁绊
2. 标记这些羁绊为 `broken`
3. 对受影响的留守选手施加离散惩罚
4. 离散惩罚的持续时间从当前杯赛计起

如果该选手在**同一转会窗口**内被重新买回（"我只是卖掉又立刻买回来，钻空子"）：
- **不允许**。同一选手在同一转会窗口不能被交易两次。转会窗口每个杯赛之间只开一次。

### 7.3 选手退役/淘汰

当一位选手在赛季总结中退役/被淘汰:
1. 涉及该选手的所有羁绊永久断裂
2. 不施加离散惩罚（"他有尊严地离开"）

### 7.4 选手重复定义

如果同一位选手的两个 ID 版本同时存在（例如"niko"和"niko_legacy"），羁绊系统**只识别** `players.ts` 中定义的正式 ID。不会出现重复羁绊。

### 7.5 AI 队伍的羁绊

AI 队伍中的羁绊**正常生效**——AI 队伍的 TeamStats 同样会受羁绊影响。这确保了比赛公平性。但 AI 队伍:
- 不会基于羁绊做转会决策
- 不会触发离散惩罚叙事

---

## 8. 实现建议

### 8.1 文件结构

```
src/content/
  bonds.ts           # BondDefinition[] 数据，纯内容，无逻辑
  bond-types.ts      # BondType, BondEffects, BondCondition 类型定义

src/simulation/
  bond-resolver.ts   # calculateBondEffects(), checkCondition()
  bond-hooks.ts      # 从叙事钩子 ID 查找对应文本

tests/
  bond-resolver.test.ts  # 羁绊计算单测
```

### 8.2 分阶段实施

| 阶段 | 内容 | 工作量 |
|---|---|---|
| **P0** | 核心类型定义 + `calculateBondEffects` 函数 + 单测 | 小 |
| **P1** | 全部 12 条羁绊数据录入 + `bond-resolver` 接入 `resolveMatch()` | 中 |
| **P2** | 叙事钩子系统 + 钩子文本撰写 | 大 |
| **P3** | 离散惩罚系统 + 转会窗口 UI 提示 + AI 队伍羁绊生效 | 中 |

### 8.3 平衡性测试清单

- [ ] 全羁绊阵容（堆叠所有可激活性羁绊）不会产生碾压性的数值优势（总效果不超过 firepower +8）
- [ ] `betrayal_scar` 的 debuff 足够严重，让玩家认真考虑是否接受这种组合
- [ ] 离散惩罚的持续时间合理（不会让整个赛季废掉）
- [ ] 双核的负面效果（单核低迷 penalize）在 30% 的场次中触发（符合真实比赛波动）

---

## 9. 附录：选手 ID 速查表

### 按队伍列出所有选手

| 队伍 | ID | 姓名 | 位置 |
|---|---|---|---|
| **Spirit** | donk | donk | entry |
| | sh1ro | sh1ro | awp |
| | zont1x | zont1x | rifler |
| | chopper | chopper | igl |
| | magixx | magixx | support |
| | s1ren | s1ren | support |
| **Vitality** | zywoo | ZywOo | awp |
| | ropz | ropz | lurker |
| | apex | apEX | igl |
| | flamez | flameZ | entry |
| | mezii | mezii | support |
| | cypher-v | Cypher | rifler |
| **Falcons** | niko | NiKo | rifler |
| | monesy | m0NESY | awp |
| | magisk | Magisk | support |
| | kyxsan | kyxsan | igl |
| | teSeS | TeSeS | entry |
| | dupreeh-f | dupreeh | rifler |
| **MOUZ** | xertion | xertioN | entry |
| | torzsi | torzsi | awp |
| | jimpphat | Jimpphat | lurker |
| | brollan | Brollan | rifler |
| | siuhy | siuhy | igl |
| | spinx-m | Spinx | support |
| **FaZe** | frozen | frozen | rifler |
| | broky | broky | awp |
| | rain | rain | entry |
| | karrigan | karrigan | igl |
| | elio | EliGE | rifler |
| | skullz-fz | skullz | support |
| **FURIA** | kscerato | KSCERATO | lurker |
| | yuurih | yuurih | rifler |
| | fallen | FalleN | igl |
| | molodoy | molodoy | awp |
| | yekindar | YEKINDAR | entry |
| | chelo | chelo | support |
| **NAVI** | b1t | b1t | rifler |
| | w0nderful | w0nderful | awp |
| | jl | jL | entry |
| | im | iM | rifler |
| | aleksib | Aleksib | igl |
| | makazze | makazze | support |
| **MongolZ** | 910 | 910 | awp |
| | senzu | Senzu | entry |
| | bLitz | bLitz | igl |
| | mzinho | mzinho | rifler |
| | techno | Techno | support |
| | annihilation | Annihilation | awp |

---

## 变更记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-06-26 | 初版。9 种羁绊类型，12 条具体羁绊，机械设计规范，实现建议。 |
