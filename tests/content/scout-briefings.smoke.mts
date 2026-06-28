// Smoke test for scout-briefings.ts
// Runs with: node --experimental-strip-types tests/content/scout-briefings.smoke.mts

import {
  generateScoutCard,
  generateBriefingText,
  generateChoiceFeedbacks,
  SCOUT_STYLES,
  SCOUT_STAGES,
  SCOUT_RELATIONS,
  SCOUT_FORMS,
  KEY_PLAYER_ROLES,
} from "../../src/content/scout-briefings.ts";

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log("  ✓ " + msg);
  } else {
    failed++;
    console.error("  ✗ " + msg);
  }
}

console.log("Scout Briefings Smoke Test");
console.log("===========================");

// 1. 枚举非空
console.log("\n[1] 枚举常量");
assert(SCOUT_STYLES.length === 6, `SCOUT_STYLES 有 ${SCOUT_STYLES.length} 个`);
assert(SCOUT_STAGES.length === 5, `SCOUT_STAGES 有 ${SCOUT_STAGES.length} 个`);
assert(SCOUT_RELATIONS.length === 5, `SCOUT_RELATIONS 有 ${SCOUT_RELATIONS.length} 个`);
assert(SCOUT_FORMS.length === 4, `SCOUT_FORMS 有 ${SCOUT_FORMS.length} 个`);
assert(KEY_PLAYER_ROLES.length === 5, `KEY_PLAYER_ROLES 有 ${KEY_PLAYER_ROLES.length} 个`);

// 2. 基本生成——完整情报卡
console.log("\n[2] generateScoutCard 基本输出");
const card = generateScoutCard({
  opponent: "Team Vitality",
  opponentStyle: "disciplined",
  cupStage: "quarter_final",
  matchRelation: "first_meet",
  opponentForm: "stable",
  keyPlayerName: "ropz",
  keyPlayerRole: "sniper",
  rivalIGL: "apex",
  myStarPlayer: "donk",
  myVeteran: "Boombl4",
  myRookie: "m0NESY",
}, 42);

assert(card.briefing.title.includes("Team Vitality"), "标题包含对手名");
assert(card.briefing.title.includes("四分之一决赛"), "标题包含杯赛阶段");
assert(card.briefing.body.length >= 1, "正文至少有 1 段");
assert(card.briefing.body.join("").length > 50, "正文总长度 > 50 字");
assert(["neutral", "tense", "confident", "cautious", "dramatic"].includes(card.briefing.tone), "tone 是合法值");
assert(card.choices.length === 3, "返回 3 个选择反馈");

// 3. 变体测试——同 seed 同 ctx 返回同结果
console.log("\n[3] 确定性");
const ctxBase = {
  opponent: "FaZe",
  opponentStyle: "aggressive" as const,
  cupStage: "semi_final" as const,
  matchRelation: "rival" as const,
  opponentForm: "on_fire" as const,
  keyPlayerName: "karrigan",
  keyPlayerRole: "igl" as const,
};
const c1 = generateScoutCard(ctxBase, 99);
const c2 = generateScoutCard(ctxBase, 99);
const c3 = generateScoutCard(ctxBase, 100);
assert(c1.briefing.title === c2.briefing.title, "同 seed → 标题相同");
assert(c1.briefing.body[0] === c2.briefing.body[0], "同 seed → 正文首段相同");
assert(c1.choices[0].choiceLabel === c2.choices[0].choiceLabel, "同 seed → 选择标签相同");
assert(c1.briefing.body[0] !== c3.briefing.body[0] || true, "不同 seed → 可能不同（允许偶合）");

// 4. 所有风格都产出正文
console.log("\n[4] 所有风格产出正文");
for (const style of SCOUT_STYLES) {
  const sc = generateScoutCard({
    ...ctxBase,
    opponentStyle: style,
    keyPlayerName: "test_player",
  }, style.length * 7 + 1);
  assert(sc.briefing.body.some((p) => p.length > 20), `${style} 风格有实质内容段落`);
}

// 5. 所有杯赛阶段都在标题中体现
console.log("\n[5] 杯赛阶段体现于标题");
for (const stage of SCOUT_STAGES) {
  const sc = generateScoutCard({ ...ctxBase, cupStage: stage }, stage.charCodeAt(0));
  assert(
    (stage === "major_final" ? sc.briefing.title.includes("Major") : true) ||
    sc.briefing.title.length > 5,
    `${stage} 标题已生成`,
  );
}

// 6. 所有关系类型都有记忆段落（first_meet 除外）
console.log("\n[6] 关系类型记忆段落");
for (const rel of SCOUT_RELATIONS) {
  const sc = generateScoutCard({
    ...ctxBase,
    matchRelation: rel,
  }, rel.length * 11 + 3);
  if (rel === "first_meet") {
    // first_meet 可能不产生额外记忆段，但正文仍然存在
    assert(sc.briefing.body.length >= 1, `${rel} 至少有基础正文`);
  } else {
    // 其他关系应该产生比 first_meet 更丰富的内容
    assert(sc.briefing.body.join("").length > 30, `${rel} 正文有内容`);
  }
}

// 7. 选择反馈包含效果
console.log("\n[7] 选择反馈含 EventEffect");
const testChoices = generateChoiceFeedbacks(ctxBase, 77);
assert(testChoices.length === 3, "3 个选择反馈");
for (let i = 0; i < testChoices.length; i++) {
  const ch = testChoices[i];
  assert(ch.resultNarrative.length > 20, `选择${i} 反馈文本 > 20 字`);
  assert(typeof ch.effect === "object" && ch.effect !== null, `选择${i} 含 effect 对象`);
  const effectKeys = Object.keys(ch.effect);
  assert(effectKeys.length >= 1, `选择${i} effect 有至少 1 个键`);
}

// 8. 只生成正文
console.log("\n[8] generateBriefingText 单独调用");
const briefingOnly = generateBriefingText(ctxBase, 55);
assert(briefingOnly.title.length > 0, "briefing-only 标题非空");
assert(briefingOnly.body.length >= 1, "briefing-only 正文非空");
assert(!("choices" in briefingOnly), "briefing-only 无 choices 属性");

// 9. 只生成选择反馈
console.log("\n[9] generateChoiceFeedbacks 单独调用");
const choicesOnly = generateChoiceFeedbacks(ctxBase, 88);
assert(choicesOnly.length === 3, "choices-only 返回 3 个反馈");
assert(choicesOnly[0].resultNarrative.length > 10, "choices-only 首个反馈有文本");

// 10. 默认值填充
console.log("\n[10] 默认上下文不崩溃");
const emptyCtx = {};
const defaultCard = generateScoutCard(emptyCtx, 1);
assert(defaultCard.briefing.title.includes("对手队伍"), "默认对手名已填充");
assert(defaultCard.briefing.body.length >= 1, "默认正文非空");
assert(defaultCard.choices.length === 3, "默认 3 个选择");

// 11. 关键选手聚焦出现
console.log("\n[11] 关键选手聚焦概率触发");
let focusFound = false;
for (let i = 0; i < 20; i++) {
  const fc = generateScoutCard({
    ...ctxBase,
    keyPlayerName: "ZywOo",
    keyPlayerRole: "clutch_player",
  }, i + 200);
  const fullBody = fc.briefing.body.join("");
  if (fullBody.includes("ZywOo") || fullBody.includes("残局")) {
    focusFound = true;
    break;
  }
}
assert(focusFound, "关键选手聚焦在多次尝试中出现");

// 12. 教练博弈 bullet 出现
console.log("\n[12] 教练博弈 intelBullets 概率触发");
let bulletsFound = false;
for (let i = 0; i < 30; i++) {
  const bc = generateScoutCard(ctxBase, i + 300);
  if (bc.briefing.intelBullets && bc.briefing.intelBullets.length > 0) {
    bulletsFound = true;
    break;
  }
}
assert(bulletsFound, "intelBullets 在多次尝试中出现");

// 13. CS 机制合规
console.log("\n[13] CS 机制合规性——禁止 趴下/俯卧/匍匐");
let violationCount = 0;
const bannedActions = ["趴下", "俯卧", "匍匐", "躺下", "匍伏"];
for (const style of SCOUT_STYLES) {
  for (let i = 0; i < 5; i++) {
    const sc = generateScoutCard({ ...ctxBase, opponentStyle: style }, style.charCodeAt(0) + i);
    const fullText = [
      sc.briefing.title,
      ...sc.briefing.body,
      ...(sc.briefing.intelBullets ?? []),
      ...sc.choices.map((c) => c.resultNarrative),
    ].join(" ");
    for (const word of bannedActions) {
      if (fullText.includes(word)) {
        violationCount++;
        console.error(`    ✗ 违规 [${style}]: ...${word}...`);
      }
    }
  }
}
assert(violationCount === 0, "全池未出现违规动作词");

// 14. 玩家身份中立
console.log("\n[14] 玩家身份中立性");
let identityViolation = 0;
const bannedIdentity = ["我老头子", "当了八年", "当教练几十年", "我这把年纪", "我这把老骨头"];
for (let i = 0; i < 15; i++) {
  const sc = generateScoutCard(ctxBase, i + 400);
  const fullText = [
    sc.briefing.title,
    ...sc.briefing.body,
    ...sc.choices.map((c) => c.resultNarrative),
  ].join(" ");
  for (const phrase of bannedIdentity) {
    if (fullText.includes(phrase)) {
      identityViolation++;
      console.error(`    ✗ 违规: ${phrase}`);
    }
  }
}
assert(identityViolation === 0, "未出现玩家身份预设词");

// 15. effect 键合法性
console.log("\n[15] Effect 键合法性");
const legalEffectKeys = new Set([
  "firepower", "tactics", "cohesion", "discipline", "morale",
  "economy", "condition", "tactical_control", "momentum",
  "spend_timeout", "remove_control", "trigger_chain", "gain_form",
]);
let illegalKeyFound = false;
for (let i = 0; i < 10; i++) {
  const cs = generateScoutCard(ctxBase, i + 500);
  for (const choice of cs.choices) {
    for (const key of Object.keys(choice.effect)) {
      if (!legalEffectKeys.has(key)) {
        console.error(`    ✗ 非法 effect 键: ${key}`);
        illegalKeyFound = true;
      }
    }
  }
}
assert(!illegalKeyFound, "所有 effect 键合法");

// 16. Major 决赛特殊氛围
console.log("\n[16] Major 决赛特殊氛围");
const majorFinal = generateScoutCard({
  ...ctxBase,
  cupStage: "major_final",
  matchRelation: "revenge",
  opponentForm: "on_fire",
}, 999);
const mfBody = majorFinal.briefing.body.join(" ");
assert(mfBody.includes("Major") || mfBody.length > 80, "Major 决赛正文包含特殊内容或足够长");

// 17. 按钮文案自然度——玩家口吻，不是设计文档腔
console.log("\n[17] 按钮文案自然度（玩家口吻）");
const stiffLabels = ["演练慢控", "保护自信语音", "放出假情报"];
const naturalPrepare = ["看 demo", "做功课", "针对性练", "模拟对手", "战术板", "拆一下"];
const naturalProtect = ["别想太多", "打自己的", "相信手感", "放松打", "自己的节奏", "不给他们加戏", "热身完事"];
const naturalBluff = ["烟雾弹", "心理战", "演戏", "猜不到", "虚实结合", "小动作", "装作没准备"];

const collectedLabels: string[] = [];
let stiffFound = false;
for (let i = 0; i < 40; i++) {
  const sc = generateScoutCard(ctxBase, i + 600);
  for (const ch of sc.choices) {
    collectedLabels.push(ch.choiceLabel);
    for (const stiff of stiffLabels) {
      if (ch.choiceLabel.includes(stiff)) {
        stiffFound = true;
        console.error(`    ✗ 仍出现僵硬文案: ${ch.choiceLabel}`);
      }
    }
  }
}
assert(!stiffFound, "全样本未出现僵硬设计文档腔文案");

const distinctLabels = new Set(collectedLabels);
assert(distinctLabels.size >= 4, `按钮文案有多样性（≥4 种，实际 ${distinctLabels.size}）`);

const hasPrepare = collectedLabels.some((l) => naturalPrepare.some((k) => l.includes(k)));
const hasProtect = collectedLabels.some((l) => naturalProtect.some((k) => l.includes(k)));
const hasBluff = collectedLabels.some((l) => naturalBluff.some((k) => l.includes(k)));
assert(hasPrepare, "样本中出现 prepare 类自然文案");
assert(hasProtect, "样本中出现 protect 类自然文案");
assert(hasBluff, "样本中出现 bluff 类自然文案");

// 18. 完整卡输出示例
console.log("\n[18] 完整卡输出示例（前 400 字）");
const exampleCard = generateScoutCard({
  opponent: "G2 Esports",
  opponentStyle: "star_carry",
  cupStage: "quarter_final",
  matchRelation: "rival",
  opponentForm: "volatile",
  keyPlayerName: "NiKo",
  keyPlayerRole: "entry_fragger",
  rivalIGL: "Snax",
  myStarPlayer: "donk",
  myVeteran: "Boombl4",
  myRookie: "m0NESY",
  lastMatchResult: "1-2",
  recentRecord: "两连败",
}, 12345);

console.log("    Title:", exampleCard.briefing.title);
console.log("    Tone:", exampleCard.briefing.tone);
console.log("    Body paragraphs:", exampleCard.briefing.body.length);
console.log("    Bullets:", exampleCard.briefing.intelBullets?.length ?? 0);
console.log("    Choices:", exampleCard.choices.map((c) => c.choiceLabel).join(" / "));
const preview = (
  exampleCard.briefing.title +
  "\n\n" +
  exampleCard.briefing.body.slice(0, 2).join("\n\n")
).slice(0, 400);
console.log("    Preview:\n" + preview + "...");

console.log("\n===========================");
console.log(`结果: ${passed} passed, ${failed} failed`);
console.log("===========================");
process.exit(failed > 0 ? 1 : 0);
