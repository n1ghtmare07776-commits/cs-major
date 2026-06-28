// Smoke test for transfer-narratives.ts
// Runs with: node --experimental-strip-types tests/content/transfer-narratives.smoke.mts

import {
  getTransferDialogue,
  getAtmosphereLine,
  renderDialogue,
  getRenderedTransferDialogue,
  ALL_NEGOTIATION_PHASES,
  countDialoguesByPhase,
} from "../../src/content/transfer-narratives.ts";

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

console.log("Transfer Narratives Smoke Test");
console.log("==============================");

// 1. 所有阶段都有对话池
console.log("\n[1] 阶段池计数");
for (const phase of ALL_NEGOTIATION_PHASES) {
  const n = countDialoguesByPhase(phase);
  console.log(`    ${phase}: ${n}`);
  assert(n > 0, `${phase} 池非空 (${n})`);
}

// 2. 买方开场——明星选手
console.log("\n[2] 买方开场——明星选手");
const buyerOpen = getTransferDialogue("opening_bid", {
  role: "buyer",
  playerTier: "star",
  playerName: "donk",
  rivalTeam: "Spirit",
  rivalCoach: "Chopper",
  yourTeam: "枪神队伍",
});
assert(buyerOpen.lines.length > 0, "返回了对话行");
assert(buyerOpen.lines.some((l) => l.text.includes("donk")), "{player_name} 槽位已填充");
assert(buyerOpen.lines.some((l) => l.text.includes("Chopper")), "{rival_coach} 槽位已填充");

// 3. 卖方开场——明星选手
console.log("\n[3] 卖方开场——明星选手");
const sellerOpen = getTransferDialogue("opening_bid", {
  role: "seller",
  playerTier: "star",
  playerName: "ZywOo",
  rivalTeam: "Vitality",
  rivalCoach: "apex",
  yourTeam: "枪神队伍",
});
assert(sellerOpen.lines.length > 0, "返回了对话行");
assert(sellerOpen.lines.some((l) => l.text.includes("ZywOo")), "{player_name} 槽位已填充");

// 4. 还价拉锯
console.log("\n[4] 还价拉锯");
const counter = getTransferDialogue("counteroffer", {
  role: "buyer",
  playerName: "m0NESY",
  rivalTeam: "G2",
  rivalCoach: "Snax",
  yourTeam: "枪神队伍",
  fee: "80万美金",
  counterFee: "120万美金",
});
assert(counter.lines.length > 0, "返回了对话行");
assert(counter.lines.some((l) => l.text.includes("80万美金") || l.text.includes("120万美金")), "{fee}/{counter_fee} 槽位已填充");

// 5. 交易达成——明星
console.log("\n[5] 交易达成——明星");
const closed = getTransferDialogue("deal_closed", {
  role: "buyer",
  playerTier: "star",
  playerName: "NiKo",
  rivalTeam: "G2",
  rivalCoach: "Snax",
  yourTeam: "枪神队伍",
});
assert(closed.lines.length > 0, "返回了对话行");
assert(closed.effect !== undefined, "deal_closed 阶段附带引擎效果");
assert(typeof closed.effect.firepower === "number", "effect.firepower 是数字");

// 6. 交易破裂——价格
console.log("\n[6] 交易破裂——价格");
const broken = getTransferDialogue("deal_broken", {
  role: "buyer",
  playerName: "s1mple",
  rivalTeam: "NAVI",
  rivalCoach: "B1ad3",
  yourTeam: "枪神队伍",
  fee: "50万美金",
  counterFee: "100万美金",
});
assert(broken.lines.length > 0, "返回了对话行");

// 7. 选手愿走
console.log("\n[7] 选手愿走——明星");
const willing = getTransferDialogue("player_willing", {
  playerTier: "star",
  playerName: "device",
  rivalTeam: "Astralis",
  rivalCoach: "gla1ve",
  yourTeam: "枪神队伍",
});
assert(willing.lines.length > 0, "返回了对话行");
assert(willing.lines.some((l) => l.speaker === "player"), "包含选手发言");

// 8. 选手不愿走——新秀
console.log("\n[8] 选手不愿走——新秀");
const reluctant = getTransferDialogue("player_reluctant", {
  playerTier: "rookie",
  playerName: "jl",
  rivalTeam: "NIP",
  rivalCoach: "ksharp",
  yourTeam: "枪神队伍",
});
assert(reluctant.lines.length > 0, "返回了对话行");

// 9. 选手犹豫——老将
console.log("\n[9] 选手犹豫——老将");
const hesitant = getTransferDialogue("player_hesitant", {
  playerTier: "veteran",
  playerName: "f0rest",
  rivalTeam: "Dignitas",
  rivalCoach: "xizt",
  yourTeam: "枪神队伍",
});
assert(hesitant.lines.length > 0, "返回了对话行");

// 10. 队内反应——卖队友
console.log("\n[10] 队内反应——卖掉明星");
const sellReact = getTransferDialogue("team_sell_reaction", {
  playerTier: "star",
  playerName: "b1t",
  rivalTeam: "NAVI",
  rivalCoach: "B1ad3",
  yourTeam: "枪神队伍",
});
assert(sellReact.lines.length > 0, "返回了对话行");
assert(sellReact.lines.some((l) => l.speaker === "team_member"), "包含队友发言");

// 11. 队内反应——买来新人
console.log("\n[11] 队内反应——买来老将");
const buyReact = getTransferDialogue("team_buy_reaction", {
  playerTier: "veteran",
  playerName: "kennyS",
  rivalTeam: "G2",
  rivalCoach: "Snax",
  yourTeam: "枪神队伍",
});
assert(buyReact.lines.length > 0, "返回了对话行");

// 12. 氛围描写
console.log("\n[12] 氛围描写");
const atmos = getAtmosphereLine({
  playerName: "broky",
  rivalTeam: "FaZe",
  rivalCoach: "karrigan",
  yourTeam: "枪神队伍",
});
assert(typeof atmos === "string" && atmos.length > 10, "返回非空字符串");
console.log("    示例氛围: " + atmos);

// 13. 渲染对话
console.log("\n[13] 渲染对话为文本");
const rendered = renderDialogue(closed);
assert(typeof rendered === "string", "渲染返回字符串");
assert(rendered.includes("【你】") || rendered.includes("【选手】") || rendered.includes("【队友】"), "包含说话人标记");
console.log("    渲染片段（前 200 字）:\n" + rendered.slice(0, 200) + "...");

// 14. 一站式 API
console.log("\n[14] 一站式 API getRenderedTransferDialogue");
const oneShot = getRenderedTransferDialogue("deal_closed", {
  role: "buyer",
  playerTier: "rookie",
  playerName: "torzsi",
  rivalTeam: "MOUZ",
  rivalCoach: "sycrone",
  yourTeam: "枪神队伍",
});
assert(typeof oneShot.text === "string", "返回 text");
assert(oneShot.effect !== undefined, "附带 effect");
console.log("    effect: " + JSON.stringify(oneShot.effect));

// 15. 同 seed 同 ctx 必返回同结果（确定性）
console.log("\n[15] 确定性——同 seed 同 ctx 返回同结果");
const ctxA = {
  role: "buyer",
  playerTier: "star",
  playerName: "donk",
  rivalTeam: "Spirit",
  rivalCoach: "Chopper",
  yourTeam: "枪神队伍",
};
const a1 = getTransferDialogue("opening_bid", ctxA, 42);
const a2 = getTransferDialogue("opening_bid", ctxA, 42);
const a3 = getTransferDialogue("opening_bid", ctxA, 999);
assert(a1.lines[0].text === a2.lines[0].text, "同 seed → 同结果");
// 不同 seed 不一定不同，但同 ctx 的池只有几个组，多次试可以验证至少 API 不崩
assert(typeof a3.lines[0].text === "string", "不同 seed → 仍正常返回");

// 16. CS 机制合规性检查——禁止"趴下"
console.log("\n[16] CS 机制合规性——禁止 趴下");
let violationCount = 0;
for (const phase of ALL_NEGOTIATION_PHASES) {
  if (phase === "atmosphere") continue;
  const n = countDialoguesByPhase(phase);
  for (let i = 0; i < n; i++) {
    const set = getTransferDialogue(phase, {}, i + 1);
    for (const line of set.lines) {
      if (line.text.includes("趴下") || line.text.includes("俯卧") || line.text.includes("匍匐")) {
        violationCount++;
        console.error("    ✗ 违规: " + line.text);
      }
    }
  }
}
assert(violationCount === 0, "全池未出现违规动作词");

// 16b. camelCase 槽位也能被填充
console.log("\n[16b] camelCase 槽位填充（counterFee / swapPlayerName）");
const camelCounter = getTransferDialogue("counteroffer", {
  role: "buyer",
  playerName: "broky",
  rivalTeam: "FaZe",
  rivalCoach: "karrigan",
  yourTeam: "枪神队伍",
  fee: "50万美金",
  counterFee: "150万美金",
});
assert(
  camelCounter.lines.some((l) => l.text.includes("150万美金")),
  "{counterFee} camelCase 槽位已填充",
);
assert(
  !camelCounter.lines.some((l) => l.text.includes("{counterFee}")),
  "无残留 {counterFee} 占位符",
);

const camelSwap = getTransferDialogue("deal_closed", {
  role: "buyer",
  playerName: "ropz",
  rivalTeam: "MOUZ",
  rivalCoach: "tabseN",
  yourTeam: "枪神队伍",
  swapPlayerName: "frozen",
});
// deal_closed 池有 13 组，只有 2 组含 {swapPlayerName}——遍历 seed 直到取到
let foundSwapFill = false;
for (let i = 0; i < 100; i++) {
  const set = getTransferDialogue("deal_closed", {
    role: "buyer",
    playerName: "ropz",
    rivalTeam: "MOUZ",
    rivalCoach: "tabseN",
    yourTeam: "枪神队伍",
    swapPlayerName: "frozen",
  }, i + 1);
  if (set.lines.some((l) => l.text.includes("frozen"))) {
    foundSwapFill = true;
    break;
  }
}
assert(foundSwapFill, "{swapPlayerName} camelCase 槽位在合适的对话组里已填充");
// 全池扫描：所有渲染后的对话都不应残留 {swapPlayerName}
let anyResidual = false;
for (let i = 0; i < 100; i++) {
  const set = getTransferDialogue("deal_closed", {
    role: "buyer",
    playerName: "ropz",
    rivalTeam: "MOUZ",
    rivalCoach: "tabseN",
    yourTeam: "枪神队伍",
    swapPlayerName: "frozen",
  }, i + 1);
  if (set.lines.some((l) => l.text.includes("{swapPlayerName}"))) {
    anyResidual = true;
    break;
  }
}
assert(!anyResidual, "无残留 {swapPlayerName} 占位符");

// 17. 玩家身份中立性——禁止"老头子""当了X年教练"
console.log("\n[17] 玩家身份中立性");
let identityViolation = 0;
const bannedPhrases = ["我老头子", "当了八年", "当教练几十年", "我这把年纪"];
for (const phase of ALL_NEGOTIATION_PHASES) {
  if (phase === "atmosphere") continue;
  const n = countDialoguesByPhase(phase);
  for (let i = 0; i < n; i++) {
    const set = getTransferDialogue(phase, {}, i + 1);
    for (const line of set.lines) {
      for (const p of bannedPhrases) {
        if (line.text.includes(p)) {
          identityViolation++;
          console.error("    ✗ 违规: " + line.text);
        }
      }
    }
  }
}
assert(identityViolation === 0, "未出现玩家身份预设词");

console.log("\n==============================");
console.log(`结果: ${passed} passed, ${failed} failed`);
console.log("==============================");
process.exit(failed > 0 ? 1 : 0);
