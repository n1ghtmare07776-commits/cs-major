import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STARTING_BUDGET,
  applyAction,
  createInitialState,
  rosterPrice,
} from "../../src/app/browser.js";

const TEST_ROSTER_IDS = ["donk", "ropz", "chopper", "magixx", "zont1x", "s1ren"];

function draftTestRoster(state) {
  for (const playerId of TEST_ROSTER_IDS) {
    state = applyAction(state, { type: "toggle", player: playerId });
  }
  return state;
}

function draftRoster(state, playerIds) {
  for (const playerId of playerIds) {
    state = applyAction(state, { type: "toggle", player: playerId });
  }
  return state;
}

test("browser draft roster can be confirmed into the first cup", () => {
  let state = createInitialState();
  state = draftTestRoster(state);

  assert.equal(TEST_ROSTER_IDS.length, 6);
  assert.equal(new Set(TEST_ROSTER_IDS).size, 6);
  assert.ok(rosterPrice(state.selected) <= STARTING_BUDGET);
  assert.equal(state.selected.length, 6);

  state = applyAction(state, { type: "confirm" });

  assert.equal(state.screen, "bracket");
  assert.equal(state.error, "");
  assert.equal(state.campaign.seasonIndex, 1);
  assert.equal(state.campaign.cupIndex, 0);
});

test("draft selected slots can remove players directly and still expose substitute controls", () => {
  let state = draftTestRoster(createInitialState());
  const draftHtml = globalThis.__renderBrowserForTest(state);

  assert.match(draftHtml, /class="slot filled/);
  assert.match(draftHtml, /data-action="toggle" data-player="donk"/);
  assert.match(draftHtml, /slot-substitute-action/);
  assert.match(draftHtml, /点击取消/);

  state = applyAction(state, { type: "toggle", player: "donk" });

  assert.equal(state.selected.includes("donk"), false);
  assert.equal(state.selected.length, 5);
});

test("draft room can filter the player pool by role tabs", () => {
  let state = createInitialState();
  const fullHtml = globalThis.__renderBrowserForTest(state);

  assert.match(fullHtml, /data-action="draft-role-filter" data-role="all"/);
  assert.match(fullHtml, /data-action="draft-role-filter" data-role="igl"/);
  assert.match(fullHtml, /全部/);
  assert.match(fullHtml, /指挥/);
  assert.match(fullHtml, /突破手/);
  assert.match(fullHtml, /补枪手/);
  assert.match(fullHtml, /防守者/);
  assert.doesNotMatch(fullHtml, />突破</);
  assert.doesNotMatch(fullHtml, /步枪</);
  assert.doesNotMatch(fullHtml, /辅助</);

  state = applyAction(state, { type: "draftRoleFilter", role: "igl" });
  const iglHtml = globalThis.__renderBrowserForTest(state);
  const playerRows = iglHtml.match(/class="player-row/g) ?? [];
  const iglCount = globalThis.__browserGameTestHooks.players.filter((player) => player.role === "igl").length;

  assert.equal(state.draftRoleFilter, "igl");
  assert.equal(playerRows.length, iglCount);
  assert.match(iglHtml, /选手池 · 指挥/);
  assert.doesNotMatch(iglHtml, /ZywOo|donk|m0NESY/);
  assert.match(iglHtml, /karrigan|apEX|Aleksib/);

  state = applyAction(state, { type: "draftRoleFilter", role: "rifler" });
  const riflerHtml = globalThis.__renderBrowserForTest(state);
  assert.match(riflerHtml, /选手池 · 补枪手/);

  state = applyAction(state, { type: "draftRoleFilter", role: "support" });
  const supportHtml = globalThis.__renderBrowserForTest(state);
  assert.match(supportHtml, /选手池 · 防守者/);
});

test("IGL prices are spread across budget, mid, and premium tiers", () => {
  const iglPrices = globalThis.__browserGameTestHooks.players
    .filter((player) => player.role === "igl")
    .map((player) => player.price)
    .sort((left, right) => left - right);
  const uniquePrices = new Set(iglPrices);

  assert.ok(uniquePrices.size >= 5, `指挥价格过于集中：${iglPrices.join(", ")}`);
  assert.ok(Math.min(...iglPrices) <= 9, "应该有预算型指挥");
  assert.ok(Math.max(...iglPrices) >= 17, "顶级体系指挥应该明显更贵");
});

test("chemistry only flags dual-core volatility for real star cores", () => {
  let state = createInitialState();
  for (const playerId of ["xertion", "senzu", "brollan", "jimpphat", "torzsi", "s1ren"]) {
    state = applyAction(state, { type: "toggle", player: playerId });
  }
  const nonCoreHtml = globalThis.__renderBrowserForTest(state);

  assert.doesNotMatch(nonCoreHtml, /双核心/);
  assert.match(nonCoreHtml, /风险：/);

  let starState = createInitialState();
  for (const playerId of ["donk", "niko", "xertion", "senzu", "brollan", "s1ren"]) {
    starState = applyAction(starState, { type: "toggle", player: playerId });
  }
  const volatileCoreHtml = globalThis.__renderBrowserForTest(starState);

  assert.match(volatileCoreHtml, /双核心需要指挥压节奏/);
});

test("top player ratings use the full scale instead of clustering near 100", () => {
  const players = globalThis.__browserGameTestHooks.players;
  const byId = Object.fromEntries(players.map((player) => [player.id, player]));

  assert.equal(byId.donk.firepower, 89);
  assert.equal(byId.zywoo.firepower, 85);
  assert.ok(byId.donk.firepower - byId.zywoo.firepower >= 3, "donk 的纯火力应该明显高于 ZywOo");
  assert.ok(Math.max(...players.map((player) => player.firepower)) <= 89, "不应该再出现接近满分的火力");
  assert.ok(byId.donk.discipline <= 66, "donk 需要明确纪律短板，不能只强不亏");
  assert.ok(byId.zywoo.clutch > byId.donk.clutch, "ZywOo 的残局价值应该和 donk 的突破价值区分开");
});

test("opening budget cannot immediately buy a finished superteam", () => {
  const screenshotSuperteam = ["zywoo", "niko", "apex", "zero-tyloo", "kscerato", "dupreeh-f"];
  const expensiveCore = ["zywoo", "niko", "monesy", "ropz", "apex", "s1ren"];

  assert.ok(rosterPrice(screenshotSuperteam) > STARTING_BUDGET, "开局不应能直接买出 ZywOo + NiKo + KSCERATO 这种成型豪阵");
  assert.ok(rosterPrice(expensiveCore) > STARTING_BUDGET, "多个明星位加指挥不应在第一年开局预算内成型");
});

test("trait effects can outweigh a small raw-stat gap at the same price", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const byId = Object.fromEntries(hooks.players.map((player) => [player.id, player]));
  const disciplined = byId.twistzz;
  const volatile = byId.electronic;

  assert.equal(disciplined.price, volatile.price);
  assert.ok(volatile.firepower >= disciplined.firepower, "对照组应有更高或相同裸火力");
  assert.ok(hooks.traitUtilityScore(disciplined) - hooks.traitUtilityScore(volatile) >= 6, "纪律/人气/稳定词条必须能抵消小额裸数值差");

  const stableShell = ["twistzz", "naf", "karrigan", "rain", "broky", "jcobbb"].map(hooks.findPlayer);
  const volatileShell = ["electronic", "elio", "yekindar", "xertion", "senzu", "s1ren"].map(hooks.findPlayer);
  const stableStats = hooks.teamStats(stableShell, "jcobbb");
  const volatileStats = hooks.teamStats(volatileShell, "s1ren");

  assert.ok(stableStats.cohesion - volatileStats.cohesion >= 18, "优秀词条组合应该显著影响团队属性");
  assert.ok(stableStats.discipline - volatileStats.discipline >= 18, "性格词条不能只是 UI 标签");
});

test("bonded balanced rosters can outperform raw patchwork star stacks in team fit", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const starPile = ["donk", "zywoo", "niko", "monesy", "simple-fz", "s1ren"].map(hooks.findPlayer);
  const spiritCore = ["donk", "sh1ro", "chopper", "magixx", "zont1x", "s1ren"].map(hooks.findPlayer);
  const fazeCore = ["frozen", "broky", "rain", "karrigan", "twistzz", "jcobbb"].map(hooks.findPlayer);

  const starStats = hooks.teamStats(starPile, "s1ren");
  const spiritStats = hooks.teamStats(spiritCore, "s1ren");
  const fazeStats = hooks.teamStats(fazeCore, "jcobbb");
  const starNotes = hooks.chemistryNotes(starPile, "s1ren");
  const spiritNotes = hooks.chemistryNotes(spiritCore, "s1ren");
  const fazeNotes = hooks.chemistryNotes(fazeCore, "jcobbb");

  assert.ok(starStats.firepower > spiritStats.firepower, "纯明星阵容仍然应该有纸面火力");
  assert.ok(spiritStats.cohesion - starStats.cohesion >= 18, "现实羁绊阵容的团队配合必须显著更高");
  assert.ok(fazeStats.discipline - starStats.discipline >= 12, "带老指挥和体系壳的阵容应该更守纪律");
  assert.match([...starNotes.risks, ...starNotes.notes].join(" "), /针锋相对|内讧风险|拼装明星阵容/);
  assert.match(spiritNotes.notes.join(" "), /Spirit 核心羁绊|donk \+ magixx 好友羁绊|指挥托底/);
  assert.match(fazeNotes.notes.join(" "), /FaZe 老将体系|karrigan 经验托底/);
});

test("only on-field IGLs suppress multi-star resource conflict", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const withStarterIgl = ["donk", "zywoo", "niko", "monesy", "karrigan", "s1ren"].map(hooks.findPlayer);
  const withBenchIgl = ["donk", "zywoo", "niko", "monesy", "s1ren", "karrigan"].map(hooks.findPlayer);

  const starterStats = hooks.teamStats(withStarterIgl, "s1ren");
  const benchStats = hooks.teamStats(withBenchIgl, "karrigan");
  const starterNotes = hooks.chemistryNotes(withStarterIgl, "s1ren");
  const benchNotes = hooks.chemistryNotes(withBenchIgl, "karrigan");

  assert.ok(starterStats.cohesion - benchStats.cohesion >= 10, "强指挥首发必须明显压住多核心互斥");
  assert.ok(starterStats.discipline - benchStats.discipline >= 8, "强指挥坐替补不应提供场上纪律加成");
  assert.match(starterNotes.notes.join(" "), /karrigan 经验托底|多核心冲突被压住|指挥托底/);
  assert.match(benchNotes.risks.join(" "), /指挥在替补席|抢资源|针锋相对/);
});

test("veteran-youngster chemistry and too-young lineups affect team fit", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const mentoredCore = ["donk", "monesy", "karrigan", "rain", "magixx", "s1ren"].map(hooks.findPlayer);
  const tooYoungCore = ["donk", "monesy", "jimpphat", "jcobbb", "makazze", "s1ren"].map(hooks.findPlayer);

  const mentoredStats = hooks.teamStats(mentoredCore, "s1ren");
  const youngStats = hooks.teamStats(tooYoungCore, "s1ren");
  const mentoredNotes = hooks.chemistryNotes(mentoredCore, "s1ren");
  const youngNotes = hooks.chemistryNotes(tooYoungCore, "s1ren");

  assert.ok(mentoredStats.cohesion > youngStats.cohesion, "老将带新人应该提升队伍稳定度");
  assert.ok(mentoredStats.discipline > youngStats.discipline, "年轻人过多且缺少强托底时纪律应更差");
  assert.match(mentoredNotes.notes.join(" "), /老将带新人|更稳|经验托底/);
  assert.match(youngNotes.risks.join(" "), /年轻人过多|逆风局容易各打各的/);
});

test("role gaps create visible chemistry risks and phase-specific match penalties", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const fullRoles = ["donk", "zywoo", "karrigan", "magixx", "ropz", "s1ren"].map(hooks.findPlayer);
  const noEntry = ["w0nderful", "sh1ro", "karrigan", "magixx", "ropz", "s1ren"].map(hooks.findPlayer);
  const noSupport = ["donk", "zywoo", "karrigan", "ropz", "b1t", "s1ren"].map(hooks.findPlayer);
  const noRifler = ["donk", "zywoo", "karrigan", "magixx", "ropz", "zont1x"].map(hooks.findPlayer);
  const noAwp = ["donk", "karrigan", "ropz", "b1t", "magixx", "s1ren"].map(hooks.findPlayer);
  const withLurker = ["donk", "zywoo", "karrigan", "magixx", "ropz", "s1ren"].map(hooks.findPlayer);
  const noLurker = ["donk", "zywoo", "karrigan", "magixx", "b1t", "s1ren"].map(hooks.findPlayer);

  assert.match(hooks.chemistryNotes(noEntry, "s1ren").risks.join(" "), /缺少突破者|进攻回合/);
  assert.match(hooks.chemistryNotes(noSupport, "s1ren").risks.join(" "), /缺少防守者|防守回合/);
  assert.match(hooks.chemistryNotes(noRifler, "s1ren").risks.join(" "), /缺少补枪手|进攻和防守/);
  assert.match(hooks.chemistryNotes(noAwp, "s1ren").risks.join(" "), /缺少狙击手|残局/);
  assert.match(hooks.chemistryNotes(withLurker, "s1ren").notes.join(" "), /自由人|单摸|绕后/);
  assert.match(hooks.chemistryNotes(noLurker, "s1ren").risks.join(" "), /缺少自由人|单摸|绕后/);

  assert.ok(hooks.teamStats(fullRoles, "s1ren").firepower > hooks.teamStats(noEntry, "s1ren").firepower, "缺突破者要削弱进攻火力");
  assert.ok(hooks.teamStats(fullRoles, "s1ren").discipline > hooks.teamStats(noSupport, "s1ren").discipline, "缺防守者要削弱防守纪律");
  const noEntryEdge = hooks.rolePhaseEdgeForRoster(noEntry, "s1ren");
  const noSupportEdge = hooks.rolePhaseEdgeForRoster(noSupport, "s1ren");
  const noRiflerEdge = hooks.rolePhaseEdgeForRoster(noRifler, "zont1x");
  assert.ok(noRiflerEdge.attack < 0 && noRiflerEdge.defense < 0, "缺补枪手应同时影响进攻和防守");
  assert.ok(Math.abs(noRiflerEdge.attack) < Math.abs(noEntryEdge.attack), "缺补枪手的进攻惩罚不能高于缺突破者");
  assert.ok(Math.abs(noRiflerEdge.defense) < Math.abs(noSupportEdge.defense), "缺补枪手的防守惩罚不能高于缺防守者");

  let state = createInitialState();
  for (const id of ["sh1ro", "chopper", "magixx", "b1t", "w0nderful", "s1ren"]) {
    state = applyAction(state, { type: "toggle", player: id });
  }
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  assert.ok(state.match.hidden.rolePhaseEdge.attack < 0, "缺突破者必须影响进攻回合隐藏判定");

  let noAwpState = createInitialState();
  for (const id of ["donk", "chopper", "zont1x", "magixx", "s1ren", "makazze"]) {
    noAwpState = applyAction(noAwpState, { type: "toggle", player: id });
  }
  noAwpState = applyAction(noAwpState, { type: "confirm" });
  noAwpState = applyAction(noAwpState, { type: "play" });
  noAwpState = applyAction(noAwpState, { type: "prematchChoice", choice: "drill" });

  assert.ok(noAwpState.match.hidden.rolePhaseEdge.clutch < 0, "缺少狙击手必须影响残局隐藏判定");

  let lurkerState = createInitialState();
  for (const id of ["niko", "siuhy", "magixx", "jimpphat", "jcobbb", "s1ren"]) {
    lurkerState = applyAction(lurkerState, { type: "toggle", player: id });
  }
  lurkerState = applyAction(lurkerState, { type: "confirm" });
  lurkerState = applyAction(lurkerState, { type: "play" });
  lurkerState = applyAction(lurkerState, { type: "prematchChoice", choice: "drill" });

  const lurkerText = JSON.stringify(lurkerState.match.cards);
  assert.ok(lurkerState.match.hidden.rolePhaseEdge.lurk > 0, "自由人应该提高单摸/反绕后的隐藏判定");
  assert.match(lurkerText, /单摸|绕后|反摸|断后/);
});

test("low-chemistry star piles surface internal conflict timeout risks", () => {
  let state = createInitialState();
  for (const playerId of ["donk", "xertion", "senzu", "brollan", "s1ren", "makazze"]) {
    state = applyAction(state, { type: "toggle", player: playerId });
  }
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const matchText = state.match.cards.map((card) => JSON.stringify(card)).join("\n");

  assert.match(matchText, /针锋相对|内讧|各打各的|谁来拿第一波对枪|主攻位资源/);
  assert.match(matchText, /围绕 IGL|重新分工|安慰队员|大骂一通|更换战术/);
});

test("bracket page uses Team gun naming and a compact match entry action", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });

  const bracketHtml = globalThis.__renderBrowserForTest(state);

  assert.match(bracketHtml, /Team gun/);
  assert.match(bracketHtml, /class="primary compact match-entry"/);
  assert.doesNotMatch(bracketHtml, /枪神战队|枪神队伍|team gun/);
});

function playCurrentMatch(state) {
  state = applyAction(state, { type: "play" });
  assert.equal(state.screen, "prematch");

  state = applyAction(state, { type: "prematchChoice", choice: "drill" });
  assert.equal(state.screen, "match");

  for (let guard = 0; guard < 30 && state.screen === "match"; guard += 1) {
    const card = state.match.cards[state.match.eventIndex];
    state = applyAction(state, card.options ? { type: "decision", choice: card.options[0].id } : { type: "nextEvent" });
  }

  return state;
}

function playCurrentMatchWithChoices(state, choices) {
  state = applyAction(state, { type: "play" });
  assert.equal(state.screen, "prematch");

  state = applyAction(state, { type: "prematchChoice", choice: "drill" });
  assert.equal(state.screen, "match");

  let choiceIndex = 0;
  for (let guard = 0; guard < 30 && state.screen === "match"; guard += 1) {
    const card = state.match.cards[state.match.eventIndex];
    if (card.options) {
      state = applyAction(state, { type: "decision", choice: choices[choiceIndex] ?? card.options[0].id });
      choiceIndex += 1;
    } else {
      state = applyAction(state, { type: "nextEvent" });
    }
  }

  return state;
}

function resolveMatchMapScores(choices) {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  assert.equal(state.screen, "prematch");
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });
  assert.equal(state.screen, "match");

  const mapScores = [];
  let choiceIndex = 0;
  for (let guard = 0; guard < 30 && state.screen === "match"; guard += 1) {
    const card = state.match.cards[state.match.eventIndex];
    const action = card.options
      ? { type: "decision", choice: choices[choiceIndex++] ?? card.options[0].id }
      : { type: "nextEvent" };
    state = applyAction(state, action);
    const resolved = state.match.resolved?.at(-1);
    if (resolved?.score?.[0] || resolved?.score?.[1]) mapScores.push([...state.match.score]);
  }
  if (state.screen !== "match") {
    const finalScore = state.result?.bracket?.rounds?.quarterfinal?.[0]?.score
      ?? state.campaign.currentBracket.rounds.quarterfinal[0]?.score
      ?? state.campaign.currentBracket.rounds.semifinal[0]?.score
      ?? state.campaign.currentBracket.rounds.final[0]?.score;
    if (finalScore && (mapScores.at(-1)?.[0] !== finalScore[0] || mapScores.at(-1)?.[1] !== finalScore[1])) {
      mapScores.push([...finalScore]);
    }
  }
  return mapScores;
}

function playCupToAwards(state) {
  for (let guard = 0; guard < 20 && state.screen !== "awards"; guard += 1) {
    if (state.screen === "bracket") state = playCurrentMatch(state);
    else if (state.screen === "prematch" || state.screen === "match") state = playCurrentMatch(state);
  }
  return state;
}

function autoplayFullCampaign() {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });

  for (let guard = 0; guard < 240 && state.screen !== "chronicle"; guard += 1) {
    if (state.screen === "bracket") state = playCurrentMatch(state);
    else if (state.screen === "awards") state = applyAction(state, { type: "advance" });
    else if (state.screen === "between-cups") {
      if (!state.hub.allEventsResolved) state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });
      else state = applyAction(state, { type: "advance" });
    } else if (state.screen === "annual-awards") {
      const event = state.annualSummary.offseasonEvents?.[state.annualSummary.offseasonEventIndex ?? 0];
      if (event && !state.annualSummary.allOffseasonResolved) {
        state = applyAction(state, { type: "offseasonChoice", choice: event.options[0].id });
      } else {
        state = applyAction(state, { type: "advance" });
      }
    }
  }
  return state;
}

test("browser cup flow now advances through a full cup before awards", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });

  state = playCupToAwards(state);

  assert.equal(state.screen, "awards");
  assert.ok(state.result.champion.length > 0);
  assert.ok(state.result.mvp.name);
  assert.equal(state.result.bracket.completed, true);
  assert.match(state.result.encouragement, /team gun|经理|杯赛|冠军|亚军|四强|八强/);
});

test("finished BO5 score is authoritative for cup awards and replay labels", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  let campaign = {
    ...state.campaign,
    currentBracket: hooks.createCupBracket(state, state.campaign),
  };
  campaign.currentBracket.rounds.quarterfinal = campaign.currentBracket.rounds.quarterfinal.map((match, index) =>
    index === 0 ? { ...match, winnerId: "player-team", score: [3, 2] } : match.winnerId ? match : match,
  );
  const q = campaign.currentBracket.rounds.quarterfinal;
  const playerTeam = q[0].teamA;
  const otherFinalist = q[1].teamB;
  campaign.currentBracket.rounds.semifinal = [
    {
      id: "semi-0",
      round: "semifinal",
      teamA: playerTeam,
      teamB: q[1].teamA,
      winnerId: "player-team",
      score: [3, 1],
      headline: "",
    },
    {
      id: "semi-1",
      round: "semifinal",
      teamA: q[1].teamB,
      teamB: q[2].teamA,
      winnerId: otherFinalist.id,
      score: [3, 1],
      headline: "",
    },
  ];
  campaign.currentBracket.rounds.final = [
    {
      id: "final-0",
      round: "final",
      teamA: playerTeam,
      teamB: otherFinalist,
      headline: "",
    },
  ];
  campaign.currentBracket.currentRound = "final";
  campaign.currentBracket.currentMatchId = "final-0";
  state = {
    ...state,
    campaign,
    match: {
      ...state.match,
      opponent: campaign.currentBracket.rounds.final[0].teamB.name,
      score: [3, 2],
      resolved: [
        {
          title: "第 5 局 · BO5 终局",
          text: "第 5 局已经没有回头路。",
          result: "决胜图被 Team gun 拿下，整轮 BO5 到此为止。当前比分 3-2。",
          delta: "第 5 局赢下整轮 BO5 · 当前比分 3-2",
          score: [1, 0],
        },
      ],
      playerStats: {
        donk: { id: "donk", name: "donk", kills: 1, deaths: 1, assists: 0, impact: 5 },
      },
      hidden: { baseEdge: -80, eventSwing: -20, difficultyAdjustment: -18 },
    },
  };

  const afterRound = hooks.updateBracketAfterRound(state);
  const result = hooks.createCupResult(state, afterRound.campaign);
  const awardsHtml = globalThis.__renderBrowserForTest({ ...state, screen: "awards", result, campaign: afterRound.campaign });

  assert.equal(result.champion, "Team gun");
  assert.equal(result.placement, "冠军");
  assert.equal(result.bracket.rounds.final[0].score.join("-"), "3-2");
  assert.match(awardsHtml, /本场比赛回顾/);
  assert.doesNotMatch(awardsHtml, /本场文本回放|还有下一场/);
});

test("cup and annual award pages show tactical style instead of representative call", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = playCurrentMatchWithChoices(state, ["pistol_utility", "rush", "full_setup", "tactical-reset"]);
  state = playCupToAwards(state);

  const awardHtml = globalThis.__renderBrowserForTest(state);
  assert.match(awardHtml, /战术风格/);
  assert.match(awardHtml, /激进|保守|稳定/);
  assert.doesNotMatch(awardHtml, /代表呼叫/);

  const annualState = {
    ...state,
    screen: "annual-awards",
    annualSummary: globalThis.__browserGameTestHooks.createAnnualSummary({
      ...state.campaign,
      seasonIndex: 1,
      cupRecords: [
        { ...state.result, seasonIndex: 1, cupIndex: 0 },
        { ...state.result, seasonIndex: 1, cupIndex: 1, tacticalStyle: "稳定" },
        { ...state.result, seasonIndex: 1, cupIndex: 2, tacticalStyle: "保守" },
      ],
    }),
  };
  const annualHtml = globalThis.__renderBrowserForTest(annualState);

  assert.match(annualHtml, /战术风格/);
  assert.match(annualHtml, /激进|保守|稳定/);
  assert.doesNotMatch(annualHtml, /代表呼叫/);
});

test("player match flow expands to about ten cards with limited decisions", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const decisionCards = state.match.cards.filter((card) => card.options);
  const storyCards = state.match.cards.filter((card) => !card.options);

  assert.ok(state.match.cards.length >= 10);
  assert.ok(state.match.cards.length <= 15);
  assert.ok(decisionCards.length >= 3);
  assert.ok(decisionCards.length <= 5);
  assert.ok(storyCards.length >= 5);
});

test("match opens with a pistol-round decision instead of full-buy economy choice", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const openingCard = state.match.cards[0];
  const optionLabels = openingCard.options.map((option) => option.label).join(" | ");

  assert.match(openingCard.title, /第 1 局|手枪局/);
  assert.match(openingCard.text, /手枪局|第 1 局|\$800|半甲/);
  assert.match(openingCard.prompt, /手枪局怎么配/);
  assert.doesNotMatch(`${openingCard.text} ${optionLabels}`, /全起|半起|ECO|全甲|沙鹰豪赌|沙鹰赌一发|Kevlar|P250/);
  assert.match(optionLabels, /半甲手枪|道具手枪|沙鹰抽奖|这把不买，留钱/);
});

test("pistol follow-up narration respects the pistol buy choice", () => {
  let saveState = draftTestRoster(createInitialState());
  saveState = applyAction(saveState, { type: "confirm" });
  saveState = applyAction(saveState, { type: "play" });
  saveState = applyAction(saveState, { type: "prematchChoice", choice: "drill" });
  saveState = applyAction(saveState, { type: "decision", choice: "pistol_save" });

  const saveFollowupText = JSON.stringify(saveState.match.cards.slice(1, 4));
  assert.match(saveFollowupText, /没有烟闪|只靠站位|初始手枪|不能靠道具/);
  assert.doesNotMatch(saveFollowupText, /补闪|第一颗闪|最后一颗烟|烟雾和闪光|烟做满/);

  let utilityState = draftTestRoster(createInitialState());
  utilityState = applyAction(utilityState, { type: "confirm" });
  utilityState = applyAction(utilityState, { type: "play" });
  utilityState = applyAction(utilityState, { type: "prematchChoice", choice: "drill" });
  utilityState = applyAction(utilityState, { type: "decision", choice: "pistol_utility" });

  const utilityFollowupText = JSON.stringify(utilityState.match.cards.slice(1, 4));
  assert.match(utilityFollowupText, /烟|闪|道具/);
});

test("bo5 stops immediately once either side reaches three maps", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  while (state.screen === "match") {
    const card = state.match.cards[state.match.eventIndex];
    const forceLoss = card?.type === "choice" ? card.options.at(-1)?.id : undefined;
    state = applyAction(state, card.options ? { type: "decision", choice: forceLoss ?? card.options[0].id } : { type: "nextEvent" });
    if (state.screen === "match" && (state.match.score[0] === 3 || state.match.score[1] === 3)) {
      assert.fail("系列赛一方已到 3 分，比赛仍未结束");
    }
  }

  assert.ok(state.screen === "bracket" || state.screen === "awards");
});

test("featured BO5 outcomes follow player choices without forcing close scores", () => {
  const choicePaths = [
    ["pistol_armor", "rush", "full_setup", "tactical-reset"],
    ["pistol_save", "lurk", "force_setup", "emotional-reset"],
    ["pistol_deagle", "fake", "lean_setup", "discipline-reset"],
    ["pistol_utility", "default", "full_setup", "tactical-reset"],
  ];
  const scores = choicePaths.map((choices) => {
    let state = draftTestRoster(createInitialState());
    state = applyAction(state, { type: "confirm" });
    state = playCurrentMatchWithChoices(state, choices);
    const score = state.result?.bracket?.rounds?.quarterfinal?.[0]?.score
      ?? state.campaign.currentBracket.rounds.quarterfinal[0].score;
    return score.join("-");
  });

  assert.ok(new Set(scores).size >= 2, `亲自参与的 BO5 分数过于固定：${scores.join(", ")}`);
  assert.ok(scores.every((score) => /^[0-3]-[0-3]$/.test(score)), `比分格式异常：${scores.join(", ")}`);
  assert.ok(scores.some((score) => /3-1|1-3|3-2|2-3|3-0|0-3/.test(score)), `没有自然分差，疑似仍在强行固定比分：${scores.join(", ")}`);
});

test("first-year progression includes close losses and close wins instead of only blowouts", () => {
  const routes = [
    ["pistol_save", "default", "lean_setup", "emotional-reset"],
    ["pistol_armor", "default", "lean_setup", "discipline-reset"],
    ["pistol_utility", "fake", "force_setup", "tactical-reset"],
    ["pistol_deagle", "lurk", "full_setup", "emotional-reset"],
    ["pistol_utility", "default", "full_setup", "discipline-reset"],
    ["pistol_armor", "fake", "lean_setup", "tactical-reset"],
  ];
  const finalScores = routes.map((choices) => resolveMatchMapScores(choices).at(-1).join("-"));
  const closeScores = finalScores.filter((score) => score === "3-2" || score === "2-3");

  assert.ok(closeScores.length >= 1, `第一年路径缺少 3-2/2-3 的中间结果：${finalScores.join(", ")}`);
  assert.ok(finalScores.some((score) => score === "0-3" || score === "1-3"), `弱势路径仍需要有真实出局压力：${finalScores.join(", ")}`);
});

test("map outcomes include comeback risk instead of mirroring the previous map", () => {
  const paths = [
    ["pistol_armor", "rush", "full_setup", "tactical-reset"],
    ["pistol_utility", "default", "full_setup", "tactical-reset"],
    ["pistol_deagle", "fake", "full_setup", "discipline-reset"],
    ["pistol_save", "lurk", "lean_setup", "emotional-reset"],
    ["pistol_armor", "default", "force_setup", "emotional-reset"],
    ["pistol_utility", "fake", "lean_setup", "tactical-reset"],
  ];
  const scoresByPath = paths.map(resolveMatchMapScores);
  const secondMapDirections = scoresByPath
    .filter((scores) => scores.length >= 2)
    .map((scores) => `${scores[0][0] > scores[0][1] ? "W" : "L"}${scores[1][0] > scores[1][1] ? "W" : "L"}`);

  assert.ok(secondMapDirections.includes("WL") || secondMapDirections.includes("LW"), `第二局仍然过度跟随第一局：${secondMapDirections.join(", ")}`);
});

test("early campaign pressure can put the player into a 0-2 hole", () => {
  const paths = [
    ["pistol_save", "default", "lean_setup", "emotional-reset"],
    ["pistol_armor", "rush", "full_setup", "tactical-reset"],
    ["pistol_utility", "default", "lean_setup", "discipline-reset"],
    ["pistol_deagle", "fake", "lean_setup", "tactical-reset"],
  ];
  const firstTwoDirections = paths
    .map(resolveMatchMapScores)
    .filter((scores) => scores.length >= 2)
    .map((scores) => `${scores[0][0] > scores[0][1] ? "W" : "L"}${scores[1][0] > scores[1][1] ? "W" : "L"}`);

  assert.ok(firstTwoDirections.includes("LL"), `第一年前两局过度保护玩家，缺少 0-2 压力：${firstTwoDirections.join(", ")}`);
});

test("weak early routes can be swept instead of always finding a comeback map", () => {
  const pressureRoutes = [
    ["pistol_save", "default", "lean_setup", "emotional-reset"],
    ["pistol_armor", "rush", "full_setup", "tactical-reset"],
    ["pistol_utility", "fake", "force_setup", "tactical-reset"],
    ["pistol_deagle", "fake", "lean_setup", "tactical-reset"],
  ];
  const finalScores = pressureRoutes.map((choices) => resolveMatchMapScores(choices).at(-1).join("-"));

  assert.ok(finalScores.includes("0-3"), `第一年前期不理想路线仍被强行送回一张图：${finalScores.join(", ")}`);
});

test("all-in buys and aggressive paths increase odds but do not become guaranteed wins", () => {
  const aggressivePaths = [
    ["pistol_deagle", "rush", "full_setup", "discipline-reset"],
    ["pistol_deagle", "fake", "full_setup", "tactical-reset"],
    ["pistol_armor", "rush", "full_setup", "tactical-reset"],
    ["pistol_utility", "rush", "full_setup", "discipline-reset"],
    ["pistol_deagle", "lurk", "full_setup", "emotional-reset"],
    ["pistol_armor", "fake", "full_setup", "discipline-reset"],
  ];
  const scoreLines = aggressivePaths.map((choices) => resolveMatchMapScores(choices).at(-1).join("-"));
  const playerWins = scoreLines.filter((score) => score.startsWith("3-")).length;

  assert.ok(playerWins > 0, `激进/全起路线应该仍有高上限：${scoreLines.join(", ")}`);
  assert.ok(playerWins < scoreLines.length, `激进/全起路线不应该稳定必赢：${scoreLines.join(", ")}`);
});

test("resolving match events updates player KDA summary", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state = applyAction(state, { type: "decision", choice: state.match.cards[0].options[0].id });
  state = applyAction(state, { type: "decision", choice: state.match.cards[1].options[0].id });
  state = applyAction(state, { type: "nextEvent" });

  const kdaRows = Object.values(state.match.playerStats);
  const opponentRows = Object.values(state.match.opponentStats);
  const totalKills = kdaRows.reduce((sum, row) => sum + row.kills, 0);
  const totalDeaths = kdaRows.reduce((sum, row) => sum + row.deaths, 0);
  const totalImpact = kdaRows.reduce((sum, row) => sum + row.impact, 0);
  const opponentKills = opponentRows.reduce((sum, row) => sum + row.kills, 0);
  const opponentDeaths = opponentRows.reduce((sum, row) => sum + row.deaths, 0);

  assert.equal(kdaRows.length, 5);
  assert.equal(opponentRows.length, 5);
  assert.ok(totalKills > 0);
  assert.ok(totalDeaths > 0);
  assert.ok(totalImpact > 0);
  assert.ok(opponentKills > 0);
  assert.ok(opponentDeaths > 0);
});

test("resolved match cards explain the map number and current series score", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state = applyAction(state, { type: "decision", choice: state.match.cards[0].options[0].id });
  state = applyAction(state, { type: "decision", choice: state.match.cards[1].options[0].id });

  const matchHtml = globalThis.__renderBrowserForTest(state);

  assert.match(matchHtml, /第 1 局/);
  assert.match(matchHtml, /当前比分|系列赛比分|大比分/);
  assert.match(matchHtml, /1-0|0-1|0-0/);
});

test("resolved match cards keep richer narrative context instead of only one short result line", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state = applyAction(state, { type: "decision", choice: state.match.cards[0].options[0].id });
  state = applyAction(state, { type: "decision", choice: state.match.cards[1].options[0].id });

  const matchHtml = globalThis.__renderBrowserForTest(state);

  assert.match(matchHtml, /event-card resolved/);
  assert.match(matchHtml, /<p>[^<]{35,}<\/p>/);
  assert.match(matchHtml, /手枪局|默认架枪|快攻包点|经济线|回防/);
});

test("match card library surfaces varied CS combat beats from the prepared text bank", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const cardText = state.match.cards.map((card) => JSON.stringify(card)).join("\n");

  assert.match(cardText, /甩狙|扫射转移|混烟|穿烟|绕后|补闪|燃烧瓶|保枪|假拆/);
  assert.match(cardText, /被白|大残|补枪|回防|拆包|C4/);
});

test("match narrative never exposes template placeholders or awkward gunline copy", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const cardText = state.match.cards.map((card) => JSON.stringify(card)).join("\n");
  const renderHtml = globalThis.__renderBrowserForTest(state);
  const surprisePoolText = globalThis.__browserGameTestHooks.inMatchSurprisePool
    .map((event) => `${event.title} ${event.text} ${event.result} ${event.delta}`)
    .join("\n");

  assert.doesNotMatch(`${cardText}\n${renderHtml}\n${surprisePoolText}`, /\{[a-zA-Z0-9_]+\}/);
  assert.doesNotMatch(`${cardText}\n${renderHtml}\n${surprisePoolText}`, /再多语音也救不了枪线|语音救不了枪线/);
  assert.doesNotMatch(`${cardText}\n${renderHtml}\n${surprisePoolText}`, /第一枪/);
  assert.match(`${cardText}\n${renderHtml}`, /关键一枪|细节处理|回合思路/);
});

test("player-facing narrative source avoids first-shot wording", () => {
  const sourceFiles = [
    "src/app/browser.js",
    "src/content/match-beats.ts",
    "docs/design-docs/narrative/杯间事件文本库.md",
    "docs/design-docs/narrative/局内描述文本库.md",
  ];
  const combined = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");

  assert.doesNotMatch(combined, /第一枪/);
  assert.match(combined, /前期压力|中期压力|残局压力|进攻压力|防守压力/);
});

test("all combat templates can fill anchor and role placeholders", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const variables = {
    team: "Team gun",
    rival_team: "Team Vitality",
    player: "ZywOo",
    player_a: "donk",
    player_b: "chopper",
    player_c: "sh1ro",
    player_d: "magixx",
    player_e: "s1ren",
    opponent: "ZywOo",
    opponent_a: "ZywOo",
    opponent_b: "ropz",
    opponent_c: "flameZ",
    opponent_d: "mezii",
    site: "A 点",
    weapon: "AK-47",
    hp: "23",
    count: "2",
    time: "18",
    score: "四分之一决赛",
    rookie_name: "s1ren",
    veteran_name: "chopper",
    star_player_name: "donk",
    caller_name: "chopper",
    entry_name: "donk",
    support_name: "magixx",
    lurker_name: "s1ren",
    awper_name: "sh1ro",
    anchor_name: "magixx",
  };
  const rendered = Object.values(hooks.combatBeatLibrary)
    .flat()
    .map((template) => hooks.fillTemplate(template, variables))
    .join("\n");

  assert.match(rendered, /magixx 站在后点|magixx 没乱动/);
  assert.doesNotMatch(rendered, /\{[a-zA-Z0-9_]+\}/);
});

test("rare star highlight cards surface signature player moments", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const poolText = hooks.combatBeatLibrary.starHighlight.join("\n");

  assert.match(poolText, /donk.*扫射转移|m0NESY.*甩狙|防守者.*接三个|全白|道具配合/);

  let state = createInitialState();
  for (const playerId of ["donk", "danking", "apex", "jamyoung", "jee", "zero-tyloo"]) {
    state = applyAction(state, { type: "toggle", player: playerId });
  }
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const highlightCard = state.match.cards.find((card) => card.kind === "star-highlight");
  assert.ok(highlightCard, "match should include a low-frequency star highlight card when stars are present");
  assert.match(`${highlightCard.text} ${highlightCard.result ?? ""}`, /扫射转移|甩狙|全白|左键按死|道具配合|名场面/);
});

test("opponent advantage highlight cards can beat the player with concrete rival moments", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const roster = ["donk", "danking", "apex", "jamyoung", "jee", "zero-tyloo"].map(hooks.findPlayer);
  const opponentTeam = hooks.aiTeamProfiles.find((team) => team.id === "vitality");
  const cards = hooks.makeMatchCards(roster, hooks.teamStats(roster, "zero-tyloo"), opponentTeam, "drill", "八强", "IEM Katowice", 9, hooks.createTextHistory()).cards;
  const opponentCard = cards.find((card) => card.kind === "opponent-highlight");

  assert.ok(opponentCard, "strong opponents should sometimes generate their own highlight event");
  assert.match(`${opponentCard.text} ${opponentCard.result} ${opponentCard.delta}`, /ZywOo|ropz|flameZ|apEX|mezii/);
  assert.match(`${opponentCard.text} ${opponentCard.result}`, /混烟|绕后|反清|残局|回防|打穿|击败|失守|对手/);
  assert.equal(opponentCard.score[1], 0, "opponent highlight is a story beat, not an automatic map point");
});

test("star highlight focus is weighted by ability without letting ZywOo monopolize moments", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const roster = ["zywoo", "donk", "monesy", "ropz", "magisk", "apex"].map(hooks.findPlayer);
  const picked = Array.from({ length: 48 }, (_, seed) => hooks.pickStarHighlightFocus(roster, seed).player.id);
  const counts = picked.reduce((map, id) => map.set(id, (map.get(id) ?? 0) + 1), new Map());

  assert.ok((counts.get("zywoo") ?? 0) < 24, `ZywOo 高光过于垄断：${JSON.stringify(Object.fromEntries(counts))}`);
  assert.ok((counts.get("donk") ?? 0) > 0, "donk 这种顶级突破手应该有扫射转移/正面高光机会");
  assert.ok((counts.get("monesy") ?? 0) > 0, "m0NESY 这种年轻狙击手应该有狙击高光机会");
  assert.ok((counts.get("ropz") ?? 0) > 0 || (counts.get("magisk") ?? 0) > 0, "稳定角色位也应该能靠残局、架枪或道具触发高光");
});

test("in-match surprise pool processes narrative docs into varied CS events", () => {
  const pool = globalThis.__browserGameTestHooks.inMatchSurprisePool;
  const fullText = pool.map((event) => `${event.title} ${event.text} ${event.result} ${event.delta}`).join("\n");

  assert.ok(pool.length >= 40, `局内突发事件池太小：${pool.length}`);
  assert.match(fullText, /耳机|鼠标|屏幕|键盘|网络|技术暂停/);
  assert.match(fullText, /道具反弹|白了自己人|烟砸|燃烧弹|关键道具/);
  assert.match(fullText, /语音|红温|沉默|互相指责|心态/);
  assert.match(fullText, /对手挑衅|明星对位|观众|粉丝|规则争议/);
  assert.match(fullText, /假打|强起|混起|穿烟|极限拆包|点位|0\.1秒|假冒ECO/);
  assert.doesNotMatch(fullText, /\{(?:entry|star|caller|support|enemy_star|rival_team)\}/);
});

test("prematch intel can surface narrative-doc story events with hidden match effects", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  const match = globalThis.__browserGameTestHooks.getPlayerCurrentMatch(state.campaign);
  const stats = globalThis.__browserGameTestHooks.teamStats(
    state.selected.map(globalThis.__browserGameTestHooks.findPlayer),
    state.substitute,
  );

  const samples = Array.from({ length: 16 }, (_, index) => globalThis.__browserGameTestHooks.buildPrematchIntel({
    state,
    campaign: state.campaign,
    opponentTeam: match.teamB,
    stats,
    seed: 1200 + index,
  }));
  const fullText = samples.map((intel) => `${intel.title} ${intel.body.join(" ")} ${intel.footer}`).join("\n");

  assert.match(fullText, /场馆设置不习惯|当地天气|临时翻译|赛程密集|心理教练|启用替补|对方主教练|对手两名核心/);
  assert.ok(
    samples.some((intel) => intel.effect?.baseEdge || intel.effect?.form || intel.forcedBenchId || intel.controlLocked),
    "赛前故事事件应该在后台改变本场状态或胜负边际",
  );
  assert.doesNotMatch(fullText, /当前基调|乱回合|不会带来冠军的讨论/);
});

test("in-match surprise cards can carry hidden rhythm effects from narrative events", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const roster = ["donk", "ropz", "apex", "b1t", "chopper"].map(hooks.findPlayer);
  const variables = {
    team: "Team gun",
    rival_team: "Team Vitality",
    player_a: "donk",
    player_b: "ropz",
    player_c: "b1t",
    player_d: "apEX",
    player_e: "chopper",
    opponent: "ZywOo",
    opponent_b: "flameZ",
    star_player_name: "donk",
    caller_name: "apEX",
    star_id: "donk",
    caller_id: "apex",
    site: "B 点",
  };

  const poolSize = hooks.inMatchSurprisePool.length;
  const cards = Array.from({ length: poolSize + 6 }, (_, seed) => hooks.buildInMatchSurpriseCard(2000 + seed, variables, roster));
  const text = cards.map((card) => `${card.title} ${card.text} ${card.result} ${card.delta}`).join("\n");

  assert.match(text, /键盘断触|网络波动|关键道具耗尽|误判假打|刀人|教练暂停|假冒ECO|0\.1秒/);
  assert.ok(
    cards.some((card) => card.hiddenSwing || Object.keys(card.opponentDelta ?? {}).length > 0 || Object.keys(card.playerDelta ?? {}).length > 2),
    "局内突发事件应该能通过隐藏节奏、KDA 或对手变化影响比赛",
  );
});

test("in-match surprise selection can target star and puzzle-player status stories", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const starRoster = ["donk", "zywoo", "niko", "monesy", "chopper"].map(hooks.findPlayer);
  const puzzleRoster = ["mezii", "magixx", "s1ren", "makazze", "kyxsan"].map(hooks.findPlayer);
  const starEvents = hooks.eligibleInMatchSurprises(starRoster, { seasonIndex: 1, cupIndex: 0 });
  const puzzleEvents = hooks.eligibleInMatchSurprises(puzzleRoster, { seasonIndex: 1, cupIndex: 0 });

  assert.match(starEvents.map((event) => event.title).join(" "), /舆论|私生活|明星|对位/);
  assert.match(puzzleEvents.map((event) => event.title).join(" "), /首发位置|拼图|轮换|位置/);
  assert.ok(starEvents.some((event) => event.playerType === "star"));
  assert.ok(puzzleEvents.some((event) => event.playerType === "puzzle"));
});

test("match narration uses concrete CS map-control details from mechanics references", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const cardText = state.match.cards.map((card) => JSON.stringify(card)).join("\n");
  const mechanicBuckets = [
    /警家|警家烟|警家回防/,
    /单摸|静步|断后|绕后/,
    /混烟|穿烟|穿点|盲狙烟雾/,
    /小道|连接|链接|二楼|香蕉道/,
    /架包|下包后|难拆的包|假拆/,
  ].filter((pattern) => pattern.test(cardText)).length;

  assert.ok(mechanicBuckets >= 5, "局内文本应该纳入警家、单摸、混烟、穿点、架包等具体 CS 机制细节");
});

test("opening tactic choice rewrites the next combat card with success or failure follow-up", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state = applyAction(state, { type: "decision", choice: "pistol_armor" });
  state = applyAction(state, { type: "decision", choice: "fake" });

  const nextCard = state.match.cards[state.match.eventIndex];
  const followupText = [nextCard.text, nextCard.result, nextCard.delta].join("\n");

  assert.match(followupText, /假打|转点|骗回防|没骗动/);
  assert.match(followupText, /成功|失败|纪律|战术执行|火力|回防/);
});

test("player-facing copy avoids stiff 首接触 wording", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const visibleText = [
    globalThis.__renderBrowserForTest(state),
    state.match.cards.map((card) => JSON.stringify(card)).join("\n"),
  ].join("\n");

  assert.doesNotMatch(visibleText, /首接触/);
  assert.match(visibleText, /第一波对枪|开局对位|主攻位资源|枪位资源|主动权/);
});

test("match generation avoids repeating the same clutch setup text inside one match", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const matchText = state.match.cards.map((card) => [card.text, card.winText, card.loseText, card.result].filter(Boolean).join("\n")).join("\n");
  const overusedClutchLineCount = (matchText.match(/C4 的声音越来越急|这种残局不能靠喊/g) ?? []).length;
  const distinctClutchScenes = new Set((matchText.match(/(?:1v2|最后二十秒|决胜图|包已经下了|烟边|拆包声|回防枪线)[^。]{8,80}。/g) ?? []));

  assert.ok(overusedClutchLineCount <= 1, "同一场比赛不应该反复出现同一段 C4 残局模板");
  assert.ok(distinctClutchScenes.size >= 5, "一场 BO5 需要更多不同的残局/关键局描写");
});

test("match text history reduces repeated combat beats across a season", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  const seenHistorySizes = [];

  for (let cup = 0; cup < 3; cup += 1) {
    state.campaign = {
      ...state.campaign,
      seasonIndex: 1,
      cupIndex: cup,
      currentBracket: globalThis.__browserGameTestHooks.createCupBracket(state, { ...state.campaign, seasonIndex: 1, cupIndex: cup }),
    };
    state = { ...state, screen: "bracket", match: { ...state.match, cards: [] } };
    state = applyAction(state, { type: "play" });
    state = applyAction(state, { type: "prematchChoice", choice: "drill" });
    seenHistorySizes.push(new Set(state.campaign.textHistory.match).size);
  }

  assert.ok(seenHistorySizes[0] >= 20, "单场比赛应该登记足够多的局内文本模板");
  assert.ok(seenHistorySizes[1] > seenHistorySizes[0], "第二杯赛应优先使用新局内文本");
  assert.ok(seenHistorySizes[2] > seenHistorySizes[1], "第三杯赛仍应继续扩展文本，不该立刻复读");
});

test("lost maps surface concrete failure details instead of only positive momentum text", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state = applyAction(state, { type: "decision", choice: "pistol_save" });
  state = applyAction(state, { type: "decision", choice: "rush" });
  state = applyAction(state, { type: "nextEvent" });
  state.match.hidden.baseEdge = -60;
  state.match.hidden.mapBonuses = { ...state.match.hidden.mapBonuses, 0: -60 };
  state = applyAction(state, { type: "nextEvent" });
  state = applyAction(state, { type: "nextEvent" });

  const matchHtml = globalThis.__renderBrowserForTest(state);

  assert.match(matchHtml, /手枪局失守|残局没打成|回防踩死|被拖到|被白|补枪没到|经济先吃亏/);
});

test("loss narration rotates across distinct failure causes instead of repeating one sentence", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const lossText = state.match.cards
    .map((card) => [card.text, card.loseText, card.result, card.delta].filter(Boolean).join(" "))
    .join("\n");
  const repeatedStiffLineCount = (lossText.match(/这一回合处理得很干净|每一枪都被对手提前安排好了位置/g) ?? []).length;
  const failureBuckets = [
    /手枪|半甲|拆包|假拆/,
    /道具|烟|火|闪|高爆/,
    /补枪|交叉火力|夹击/,
    /经济|强起|eco|半起/,
    /默认|被读|转点|时间/,
  ].filter((pattern) => pattern.test(lossText)).length;

  assert.ok(repeatedStiffLineCount <= 1, "失败文案不应该在同一场里反复复读同一句");
  assert.ok(failureBuckets >= 4, "失败原因应该覆盖手枪、道具、补枪、经济、默认等多种场景");
});

test("players who die in the latest event are dimmed in the KDA panel", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state = applyAction(state, { type: "decision", choice: "pistol_armor" });
  state = applyAction(state, { type: "decision", choice: "rush" });

  const matchHtml = globalThis.__renderBrowserForTest(state);

  assert.match(matchHtml, /kda-row is-dead/);
  assert.match(matchHtml, /阵亡/);
});

test("players revive on the next round after a scored round ends", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state = applyAction(state, { type: "decision", choice: "pistol_armor" });

  const matchHtml = globalThis.__renderBrowserForTest(state);

  assert.doesNotMatch(matchHtml, /kda-row is-dead/);
});

test("a player can only die once within the same map", () => {
  let state = draftRoster(createInitialState(), ["twistzz", "bLitz", "b1t", "ropz", "s1ren", "makazze"]);
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state = applyAction(state, { type: "decision", choice: "pistol_utility" });
  state = applyAction(state, { type: "decision", choice: "fake" });
  state = applyAction(state, { type: "nextEvent" });
  const mapOneDeaths = Object.fromEntries(Object.values(state.match.playerStats).map((row) => [row.name, row.deaths]));

  assert.ok(Object.values(mapOneDeaths).every((deaths) => deaths <= 1), `第 1 局单人死亡数异常：${JSON.stringify(mapOneDeaths)}`);

  state = applyAction(state, { type: "nextEvent" });
  state = applyAction(state, { type: "nextEvent" });
  const mapTwoDeaths = Object.fromEntries(Object.values(state.match.playerStats).map((row) => [row.name, row.deaths]));

  assert.ok(Object.values(mapTwoDeaths).every((deaths) => deaths <= 2), `第 2 局单人死亡数异常：${JSON.stringify(mapTwoDeaths)}`);
});

test("match render preserves manual timeline scroll unless advancing to next event", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state = applyAction(state, { type: "decision", choice: state.match.cards[0].options[0].id });
  state = applyAction(state, { type: "decision", choice: state.match.cards[1].options[0].id });
  state = applyAction(state, { type: "nextEvent" });

  const matchHtml = globalThis.__renderBrowserForTest(state);
  assert.match(matchHtml, /match-center-scroll/);
  assert.match(matchHtml, /live-event/);
});

test("bracket screen renders a tree bracket and avoids typo text", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });

  const bracketHtml = globalThis.__renderBrowserForTest(state);

  assert.match(bracketHtml, /bracket-tree/);
  assert.match(bracketHtml, /淘汰赛赛程/);
  assert.doesNotMatch(bracketHtml, /杯赛支架/);
  assert.doesNotMatch(bracketHtml, /当前基调/);
  assert.match(bracketHtml, /观众|灯光|场馆|舞台|声浪|掌声/);
  assert.match(bracketHtml, /黄沙百战|长风破浪|雄关漫道|满堂花醉|会当凌绝顶/);
  assert.match(bracketHtml, /四分之一决赛/);
  assert.match(bracketHtml, /半决赛/);
  assert.match(bracketHtml, /决赛/);
  assert.match(bracketHtml, /冠军/);
  assert.match(bracketHtml, /connector/);
  assert.match(bracketHtml, /待开打|[0-3]-[0-3]/);

  const fullSourceText = JSON.stringify(state) + bracketHtml;
  assert.doesNotMatch(fullSourceText, /默认夹枪/);
});

test("bracket layout exposes explicit slot hooks for stable alignment", () => {
  const css = fs.readFileSync(new URL("../../src/ui/styles.css", import.meta.url), "utf8");
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  const bracketHtml = globalThis.__renderBrowserForTest(state);

  assert.match(css, /\.bracket-board\s*\{/);
  assert.match(css, /width:\s*1200px/);
  assert.match(css, /margin:\s*0 auto/);
  assert.match(css, /padding-bottom:\s*52px/);
  assert.match(css, /min-height:\s*700px/);
  assert.match(css, /\.bracket-score\s*\{/);
  assert.match(css, /\.bracket-tree-lines\s*\{/);
  assert.match(css, /\.bracket-node\s*\{/);
  assert.match(css, /\.bracket-champion\s*\{/);
  assert.match(bracketHtml, /slot-qf-1/);
  assert.match(bracketHtml, /slot-qf-4/);
  assert.match(bracketHtml, /slot-sf-1/);
  assert.match(bracketHtml, /slot-sf-2/);
  assert.match(bracketHtml, /slot-final/);
  assert.match(bracketHtml, /class="bracket-score"/);
  assert.match(bracketHtml, /connector-qf pair-top/);
  assert.match(bracketHtml, /connector-final main/);
});

test("draft room exposes a full eight-team player pool", () => {
  const state = createInitialState();
  const draftHtml = globalThis.__renderBrowserForTest(state);

  assert.match(draftHtml, /选手池 · 全部 · ([6-9][0-9]) 人/);
  assert.match(draftHtml, /mezii/);
  assert.match(draftHtml, /torzsi/);
  assert.match(draftHtml, /Magisk/);
  assert.match(draftHtml, /Aleksib/);
  assert.match(draftHtml, /Annihilation/);
  assert.match(draftHtml, /Twistzz/);
  assert.match(draftHtml, /s1mple/);
  assert.match(draftHtml, /jcobbb/);
  assert.match(draftHtml, /NAF/);
  assert.match(draftHtml, /electroNic/);
  assert.match(draftHtml, /device/);
  assert.match(draftHtml, /huNter-/);
  assert.match(draftHtml, /The MongolZ/);
});

test("draft pool includes TYLOO active core and DANK1NG as selectable players", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const byId = Object.fromEntries(hooks.players.map((player) => [player.id, player]));

  for (const id of ["danking", "jee", "jamyoung", "mercury", "moseyuh", "zero-tyloo"]) {
    assert.equal(byId[id]?.team, "tyloo", `${id} should be a selectable TYLOO player`);
    assert.ok(byId[id].price >= 8 && byId[id].price <= 15, `${id} should sit in a budget-to-mid price band`);
  }
  assert.equal(byId.jee.role, "awp", "Jee 在当前 TYLOO 建模里应是狙击手，不应显示为补枪手");
  assert.match(byId.jee.profile, /狙击手|AWP|开镜/);
  assert.ok(byId.jee.traits.includes("streaky_star") || byId.jee.traits.includes("calm_clutcher"), "Jee 的词条应体现年轻狙击手的高上限或残局属性");

  const draftHtml = globalThis.__renderBrowserForTest(createInitialState());
  assert.match(draftHtml, /TYLOO/);
  assert.match(draftHtml, /danking|Jee|JamYoung|Mercury|Moseyuh|Zero/);
});

test("match screen always renders five opponent starters even after drafting rival stars", () => {
  let state = createInitialState();
  for (const playerId of ["zywoo", "flamez", "apex", "mezii", "cypher-v", "s1ren"]) {
    state = applyAction(state, { type: "toggle", player: playerId });
  }
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const matchHtml = globalThis.__renderBrowserForTest(state);
  const opponentStarterCount = (matchHtml.match(/对手首发/g) ?? []).length;

  assert.equal(opponentStarterCount, 5);
});

test("opponent starters never reuse players drafted by the player team", () => {
  let state = createInitialState();
  for (const playerId of ["donk", "sh1ro", "zont1x", "chopper", "magixx", "s1ren"]) {
    state = applyAction(state, { type: "toggle", player: playerId });
  }
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const playerNames = new Set(["donk", "sh1ro", "zont1x", "chopper", "magixx"]);
  const opponentNames = Object.values(state.match.opponentStats).map((entry) => entry.name);

  assert.equal(opponentNames.length, 5);
  for (const name of opponentNames) {
    assert.equal(playerNames.has(name), false, `对手首发错误复用了玩家已选选手: ${name}`);
  }
});

test("ai tournament teams still keep six-player rosters after player drafts away stars", () => {
  let state = createInitialState();
  for (const playerId of ["donk", "mezii", "flamez", "apex", "cypher-v", "s1ren"]) {
    state = applyAction(state, { type: "toggle", player: playerId });
  }
  state = applyAction(state, { type: "confirm" });

  const quarterTeams = state.campaign.currentBracket.rounds.quarterfinal.flatMap((match) => [match.teamA, match.teamB]);
  const aiTeams = quarterTeams.filter((team) => team.id !== "player-team");

  for (const team of aiTeams) {
    assert.equal(team.stars.length, 5);
    assert.equal(Array.isArray(team.roster), true);
    assert.equal(team.roster.length, 6);
    assert.ok(team.substitute);
  }
});

test("ai roster fillers use real reserve player names instead of synthetic team-code ids", () => {
  let state = createInitialState();
  for (const playerId of ["donk", "sh1ro", "zont1x", "chopper", "magixx", "s1ren"]) {
    state = applyAction(state, { type: "toggle", player: playerId });
  }
  state = applyAction(state, { type: "confirm" });

  const quarterTeams = state.campaign.currentBracket.rounds.quarterfinal.flatMap((match) => [match.teamA, match.teamB]);
  const rosterNames = quarterTeams.flatMap((team) => team.roster ?? []);
  const rosterText = rosterNames.join(" ");

  assert.doesNotMatch(rosterText, /Reign|Trace|Volt|Echo|Keen|Riot|Glint|Mako|-[A-Z]{2,5}/);
  assert.match(rosterText, /danking|Jee|JamYoung|Mercury|ChildKing|somebody|westmelon|Starry|EmiliaQAQ/);
});

test("match decision copy uses updated CS wording and avoids typo 夹枪", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const matchText = state.match.cards.map((card) => JSON.stringify(card)).join("\n");

  assert.match(matchText, /手枪局|快攻包点|默认架枪|慢控单摸|梭哈全起|谨慎半起|eco不起/);
  assert.match(matchText, /前十五秒就压住了包点进门位置|骗走对面回防，为转点抢出时间差|等后手夹击的信号一到就打/);
  assert.doesNotMatch(matchText, /默认夹枪/);
  assert.doesNotMatch(matchText, /Kevlar|P250|Deagle|Tec-9|Galil\/FAMAS/);
  assert.doesNotMatch(matchText, /第一拍|第二拍|上一拍|下一拍|最后一拍|这一拍|半拍|几拍/);
  assert.doesNotMatch(matchText, /标准长枪局|薄道具控经济|强起翻盘|回默认，别白给|先清语音，别追上把|别再单摸送首接触|前十五秒就把点位压热了|吃的是对手回防时间|等后手夹击的 timing/);
});

test("prematch scouting buttons use concise player-facing labels", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });

  const prematchHtml = globalThis.__renderBrowserForTest(state);
  const prematchText = prematchHtml.replace(/\s+/g, " ");

  assert.match(prematchText, /data-choice="drill">激进冒险</);
  assert.match(prematchText, /data-choice="confidence">小心试探</);
  assert.match(prematchText, /data-choice="hide-looks">隐藏战术</);
  assert.doesNotMatch(prematchText, /针对反清|稳住语音|藏关键战术|赛前先把语音压稳|队伍不急着跟对手拼情绪/);

  state = applyAction(state, { type: "prematchChoice", choice: "confidence" });
  const matchHtml = globalThis.__renderBrowserForTest(state).replace(/\s+/g, " ");

  assert.match(matchHtml, /赛前先理清沟通，稳住自己的节奏/);
});

test("prematch intel includes opponent form, player status, style, and puts choices under the briefing", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state.campaign.playerForm = {
    ...state.campaign.playerForm,
    donk: { score: -2 },
    ropz: { score: 2 },
  };
  state = applyAction(state, { type: "play" });

  const prematchHtml = globalThis.__renderBrowserForTest(state);
  const prematchText = prematchHtml.replace(/\s+/g, " ");

  assert.match(prematchText, /对方状态|手感火热|近期表现平平|状态起伏/);
  assert.match(prematchText, /Team gun 状态|donk|ropz|舆论|伤病|训练|状态/);
  assert.match(prematchText, /风格判断|实力差距|克制关系/);
  assert.ok(
    prematchHtml.indexOf("prematch-choices") > prematchHtml.indexOf("event-card featured")
      && prematchHtml.indexOf("prematch-choices") < prematchHtml.indexOf("prematch-lineup"),
    "赛前决策按钮应该放在情报卡下方，而不是首发/数据区底部",
  );
});

test("prematch strength gap uses total team strength instead of firepower only", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const state = draftRoster(createInitialState(), ["zywoo", "niko", "apex", "zero-tyloo", "kscerato", "dupreeh-f"]);
  const roster = state.selected.map(hooks.findPlayer);
  const stats = hooks.teamStats(roster, "dupreeh-f");
  const opponentTeam = {
    id: "vitality",
    name: "Team Vitality",
    stars: ["ZywOo", "ropz", "flameZ", "apEX", "mezii"],
    stats: { firepower: 88, tacticalExecution: 83, cohesion: 83, discipline: 81 },
  };
  const intel = hooks.buildPrematchIntel({
    state: { ...state, substitute: "dupreeh-f", campaign: { playerForm: {} } },
    campaign: { playerForm: {} },
    opponentTeam,
    stats,
    seed: 1,
  });
  const body = intel.body.join("\n");

  assert.ok(hooks.teamStrength({ stats }) > hooks.teamStrength(opponentTeam), "测试阵容应综合强度高于对手");
  assert.doesNotMatch(body, /对方纸面火力更高|对方纸面.*更高/);
  assert.match(body, /综合实力|整体面板|纸面综合/);
});

test("prematch intel varies by opponent and can describe control-loss stories", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });

  const vitalityMatch = globalThis.__browserGameTestHooks.getPlayerCurrentMatch(state.campaign);
  const vitalityIntel = globalThis.__browserGameTestHooks.buildPrematchIntel({
    state,
    campaign: state.campaign,
    opponentTeam: vitalityMatch.teamB,
    stats: globalThis.__browserGameTestHooks.teamStats(state.selected.map(globalThis.__browserGameTestHooks.findPlayer), state.substitute),
    seed: 101,
  });
  const coachVisaIntel = globalThis.__browserGameTestHooks.buildPrematchIntel({
    state,
    campaign: { ...state.campaign, prematchEventOverride: "coach_visa" },
    opponentTeam: vitalityMatch.teamB,
    stats: globalThis.__browserGameTestHooks.teamStats(state.selected.map(globalThis.__browserGameTestHooks.findPlayer), state.substitute),
    seed: 101,
  });

  assert.notEqual(vitalityIntel.id, coachVisaIntel.id);
  assert.match(coachVisaIntel.body.join(" "), /教练|签证|无法临场|队员自己决定/);
  assert.equal(coachVisaIntel.controlLocked, true);
});

test("prematch opponent form copy avoids opaque terms like 乱回合", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });

  const match = globalThis.__browserGameTestHooks.getPlayerCurrentMatch(state.campaign);
  const text = Array.from({ length: 10 }, (_, seed) => globalThis.__browserGameTestHooks.buildPrematchIntel({
    state,
    campaign: state.campaign,
    opponentTeam: match.teamB,
    stats: globalThis.__browserGameTestHooks.teamStats(state.selected.map(globalThis.__browserGameTestHooks.findPlayer), state.substitute),
    seed,
  }).body.join(" ")).join(" ");

  assert.doesNotMatch(text, /乱回合/);
  assert.match(text, /非常规局面|节奏断档|临场处理|不舒服的节奏|慢慢磨掉耐心|经济决策|中段提速|提前做判断/);
});

test("prematch intel rotates richer narrative-library lines instead of repeating one briefing", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });

  const hooks = globalThis.__browserGameTestHooks;
  const match = hooks.getPlayerCurrentMatch(state.campaign);
  const stats = hooks.teamStats(state.selected.map(hooks.findPlayer), state.substitute);
  const samples = Array.from({ length: 14 }, (_, index) => hooks.buildPrematchIntel({
    state,
    campaign: { ...state.campaign, prematchEventOverride: "" },
    opponentTeam: match.teamB,
    stats,
    seed: index + 1,
  }));
  const bodies = samples.map((intel) => intel.body.join(" "));
  const text = `${bodies.join(" ")} ${samples.map((intel) => intel.footer).join(" ")}`;

  assert.ok(new Set(bodies).size >= 8, "赛前情报正文应该有足够轮换，不能一直重复同一套话");
  assert.match(text, /补枪链没有断过|前五局就让对手经济变形|慢慢磨掉耐心|开局数据下滑|训练赛数据是全队最高|五个人状态都在线上/);
  assert.match(text, /分析师用了两晚|职业第一年被人0-13|穿着 Team gun 队服|对手把一名首发放进替补席|新开局路线|管理层刚刚开过一个长会|手腕有轻微不适/);
  assert.match(text, /赛前能知道的东西就这么多|情报卡给你框架|剩下七成/);
});

test("coach visa prematch event removes player decisions and auto-resolves choice cards", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state.campaign.prematchEventOverride = "coach_visa";
  state = applyAction(state, { type: "play" });

  const prematchHtml = globalThis.__renderBrowserForTest(state).replace(/\s+/g, " ");
  assert.match(prematchHtml, /教练签证|无法临场|队员自己决定/);

  state = applyAction(state, { type: "prematchChoice", choice: "drill" });
  assert.equal(state.match.hidden.controlLocked, true);
  const matchHtml = globalThis.__renderBrowserForTest(state).replace(/\s+/g, " ");

  assert.doesNotMatch(matchHtml, /data-action="decision"/);
  assert.match(matchHtml, /队员自行处理|你只能在场边看着/);

  const beforeIndex = state.match.eventIndex;
  state = applyAction(state, { type: "nextEvent" });
  assert.equal(state.match.eventIndex, beforeIndex + 1);
  assert.ok(state.match.resolved.at(-1)?.choice, "锁操作后仍应由系统随机选择一个真实选项结算");
});

test("opponent style can counter matching tactics in the match engine", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const neutral = hooks.tacticEdgeForChoice("rush", "info", hooks.summarizeReadPressure(), "drill", 0, { style: "balanced" });
  const countered = hooks.tacticEdgeForChoice("rush", "info", hooks.summarizeReadPressure(), "drill", 0, { style: "stack-heavy" });

  assert.ok(countered < neutral, "对手偏叠点/防快攻时，玩家继续快攻包点应该更容易吃亏");
});

test("hiding tactics before the match creates late-round match bonuses", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "hide-looks" });

  assert.equal(state.match.hidden.scoutingPlan.id, "hide-looks");
  assert.ok((state.match.hidden.mapBonuses[2] ?? 0) > 0, "藏战术应该从第 3 局开始给反读/转点空间");
  assert.ok(state.match.hidden.seriesPlan.closeBonus > 0, "藏战术应该帮助第 4 局附近的反读回合");
  assert.ok(state.match.hidden.seriesPlan.deciderBonus > 0, "藏战术应该在决胜图仍有收益");
  assert.match(state.match.hidden.scoutingPlan.description, /藏|反读|转点|残局/);
});

test("visible player personality uses archetype labels instead of numeric values", () => {
  let state = draftTestRoster(createInitialState());
  let draftHtml = globalThis.__renderBrowserForTest(state);

  assert.match(draftHtml, /刀尖舞者|团队大脑|魔王降世|冷面终结者|沉稳老将|团队拼图/);
  assert.doesNotMatch(draftHtml, /性格\s*\d+/);

  state = applyAction(state, { type: "confirm" });
  state = playCupToAwards(state);
  const awardsHtml = globalThis.__renderBrowserForTest(state);

  assert.match(awardsHtml, /性格\s+[\u4e00-\u9fa5]/);
  assert.doesNotMatch(awardsHtml, /性格词条/);
  assert.doesNotMatch(awardsHtml, /性格\s*\d+/);
});

test("signature personality labels fit real player archetypes", () => {
  const hooks = globalThis.__browserGameTestHooks;

  assert.equal(hooks.personalityLabel(hooks.findPlayer("donk")), "魔王降世");
  assert.equal(hooks.personalityLabel(hooks.findPlayer("monesy")), "青春风暴");

  const sh1roLabel = hooks.personalityLabel(hooks.findPlayer("sh1ro"));
  assert.match(sh1roLabel, /冷面终结者|沉稳/);
  assert.notEqual(sh1roLabel, "魔王降世");
});

test("cup awards copy avoids stiff champion-discussion line and rotates MVP comments", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = {
    ...state,
    screen: "awards",
    result: {
      cupName: "IEM Katowice",
      year: 2027,
      champion: "Team Vitality",
      runnerUp: "FURIA Esports",
      placement: "八强",
      prize: 5,
      headline: "八强出局",
      tacticalStyle: "稳定",
      encouragement: hooks.pickCupEncouragement("IEM Katowice", "八强", "Team Vitality", "ropz", 0, { seed: 1 }).message,
      mvp: {
        name: "ropz",
        profile: "ropz 把 Team Vitality 的关键分一口气顶到了终点。",
        firepower: 88,
        tactics: 86,
        personalityLabel: "团队大脑",
        line: "ropz 在淘汰赛后半段几乎没掉链子。",
      },
      matchReplay: [],
      playerStats: [],
    },
  };
  const awardsHtml = globalThis.__renderBrowserForTest(state);

  assert.doesNotMatch(awardsHtml, /不会带来冠军讨论|冠军讨论|性格词条/);
  assert.match(awardsHtml, /杯赛 MVP/);

  const lines = new Set(Array.from({ length: 8 }, (_, seed) => hooks.mvpAwardText({
    name: seed % 2 === 0 ? "ropz" : "donk",
    championName: seed % 2 === 0 ? "Team Vitality" : "Team Spirit",
    impact: 10 + seed,
    cupName: "IEM Katowice",
    seed,
  }).line));

  assert.ok(lines.size >= 4, "杯赛 MVP 评语需要有多个稳定变体，不能每次都是同一句");
  assert.equal([...lines].some((line) => /淘汰赛后半段几乎没掉链子/.test(line)), false);
});

test("prematch stats render as a butterfly comparison chart", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });

  const prematchText = globalThis.__renderBrowserForTest(state).replace(/\s+/g, " ");

  assert.match(prematchText, /class="stat-butterfly"/);
  assert.match(prematchText, /<span>Team gun<\/span>/);
  assert.match(prematchText, /<span>Team Vitality<\/span>/);
  assert.match(prematchText, /class="butterfly-row"/);
  assert.match(prematchText, /class="butterfly-track left"/);
  assert.match(prematchText, /class="butterfly-track right"/);
  assert.match(prematchText, /火力/);
  assert.match(prematchText, /战术执行/);
  assert.match(prematchText, /团队配合/);
  assert.match(prematchText, /纪律/);
  assert.doesNotMatch(prematchText, /class="compact-stats"/);
});

test("prematch screen can choose the match substitute before entering play", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });

  let prematchHtml = globalThis.__renderBrowserForTest(state).replace(/\s+/g, " ");
  assert.match(prematchHtml, /本场首发/);
  assert.match(prematchHtml, /data-action="substitute" data-player="donk"/);
  assert.match(prematchHtml, /当前替补/);
  assert.match(prematchHtml, /设为本场替补/);
  assert.doesNotMatch(prematchHtml, /class="lineup-pill[^"]*"[^>]*disabled/);

  state = applyAction(state, { type: "substitute", player: "donk" });
  prematchHtml = globalThis.__renderBrowserForTest(state).replace(/\s+/g, " ");
  assert.match(prematchHtml, /donk[\s\S]*?本场替补/);

  state = applyAction(state, { type: "prematchChoice", choice: "drill" });
  const activeNames = Object.values(state.match.playerStats).map((row) => row.name);

  assert.equal(state.substitute, "donk");
  assert.equal(activeNames.includes("donk"), false);
  assert.equal(activeNames.length, 5);
});

test("forced injury or absence cannot be switched back into the match starters", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state.campaign.prematchEventOverride = "player_absence";
  state = applyAction(state, { type: "play" });
  const hooks = globalThis.__browserGameTestHooks;
  const match = hooks.getPlayerCurrentMatch(state.campaign);
  const injuredIntel = hooks.buildPrematchIntel({
    state,
    campaign: state.campaign,
    opponentTeam: match.teamA.id === "player-team" ? match.teamB : match.teamA,
    stats: hooks.teamStats(state.selected.map(hooks.findPlayer), state.substitute),
    seed: 101,
  });
  const forcedId = injuredIntel.forcedBenchId;

  state = applyAction(state, { type: "prematchChoice", choice: "drill" });
  assert.equal(state.campaign.forcedSubstitute, forcedId);
  assert.equal(state.substitute, forcedId);
  assert.equal(state.match.playerStats[forcedId], undefined, "受伤/硬性缺席选手不应该进入本场五人名单");

  state = applyAction(state, { type: "substitute", player: TEST_ROSTER_IDS.find((id) => id !== forcedId) });
  assert.equal(state.substitute, forcedId, "受伤/硬性缺席选手不能被重新切回首发");
});

test("player form is visible before and during matches", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = {
    ...state,
    campaign: {
      ...state.campaign,
      playerForm: {
        ...state.campaign.playerForm,
        donk: 2,
        ropz: -2,
      },
    },
  };

  state = applyAction(state, { type: "play" });
  const prematchHtml = globalThis.__renderBrowserForTest(state);

  assert.match(prematchHtml, /亢奋/);
  assert.match(prematchHtml, /低迷/);

  state = applyAction(state, { type: "prematchChoice", choice: "confidence" });
  const matchHtml = globalThis.__renderBrowserForTest(state);

  assert.match(matchHtml, /状态：亢奋/);
  assert.match(matchHtml, /状态：低迷/);
});

test("prematch choice does not silently change stable player form before any story event", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state.campaign.prematchEventOverride = "";
  state.campaign.playerForm = Object.fromEntries(Object.keys(state.campaign.playerForm).map((id) => [id, 0]));

  state = applyAction(state, { type: "play" });
  const prematchHtml = globalThis.__renderBrowserForTest(state);
  assert.match(prematchHtml, /Team gun 状态：首发整体平稳/);
  assert.doesNotMatch(prematchHtml, /低迷|亢奋/);

  state = applyAction(state, { type: "prematchChoice", choice: "hide-looks" });
  const labels = Object.values(state.match.playerStats).map((row) => row.formLabel);
  const matchHtml = globalThis.__renderBrowserForTest(state);

  assert.deepEqual(labels, ["平稳", "平稳", "平稳", "平稳", "平稳"]);
  assert.doesNotMatch(matchHtml, /状态：低迷|状态：亢奋/);
});

test("player form changes team stats and individual impact", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let base = draftTestRoster(createInitialState());
  base = applyAction(base, { type: "confirm" });
  const roster = hooks.players.filter((player) => base.selected.includes(player.id));

  const excitedForm = Object.fromEntries(base.selected.map((id) => [id, 2]));
  const slumpingForm = Object.fromEntries(base.selected.map((id) => [id, -2]));
  const excitedStats = hooks.teamStats(roster, base.substitute, { ...base.campaign.modifiers, playerForm: excitedForm });
  const slumpingStats = hooks.teamStats(roster, base.substitute, { ...base.campaign.modifiers, playerForm: slumpingForm });

  assert.ok(excitedStats.firepower > slumpingStats.firepower);
  assert.ok(excitedStats.discipline >= slumpingStats.discipline);

  let excitedState = {
    ...base,
    campaign: {
      ...base.campaign,
      playerForm: excitedForm,
    },
  };
  excitedState = applyAction(excitedState, { type: "play" });
  excitedState = applyAction(excitedState, { type: "prematchChoice", choice: "drill" });

  let slumpingState = {
    ...base,
    campaign: {
      ...base.campaign,
      playerForm: slumpingForm,
    },
  };
  slumpingState = applyAction(slumpingState, { type: "play" });
  slumpingState = applyAction(slumpingState, { type: "prematchChoice", choice: "hide-looks" });

  assert.ok(excitedState.match.hidden.formEdge > slumpingState.match.hidden.formEdge);
  assert.ok(Object.values(excitedState.match.playerStats).every((row) => row.formLabel === "亢奋"));
  assert.ok(Object.values(slumpingState.match.playerStats).every((row) => row.formLabel === "低迷"));
});

test("coach choices, events, continuity, and match performance update player form", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  const initialForm = state.campaign.playerForm.donk ?? 0;

  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  assert.ok((state.match.playerStats.donk.formScore ?? 0) >= initialForm);

  for (let guard = 0; guard < 30 && state.screen === "match"; guard += 1) {
    const card = state.match.cards[state.match.eventIndex];
    state = applyAction(state, card.options ? { type: "decision", choice: card.options[0].id } : { type: "nextEvent" });
  }

  assert.ok(state.campaign.playerForm);
  assert.ok(Object.keys(state.campaign.playerForm).some((id) => state.selected.includes(id)));
});

test("campaign difficulty starts hard and eases through continuity", () => {
  let yearOne = draftTestRoster(createInitialState());
  yearOne = applyAction(yearOne, { type: "confirm" });
  yearOne = applyAction(yearOne, { type: "play" });
  yearOne = applyAction(yearOne, { type: "prematchChoice", choice: "drill" });

  const yearOneEdge = yearOne.match.hidden.baseEdge;
  const yearOnePenalty = yearOne.match.hidden.difficultyAdjustment;

  let yearThree = draftTestRoster(createInitialState());
  yearThree = applyAction(yearThree, { type: "confirm" });
  const lineupKey = Object.keys(yearThree.campaign.lineupMatches)[0];
  yearThree = {
    ...yearThree,
    campaign: {
      ...yearThree.campaign,
      seasonIndex: 3,
      cupIndex: 2,
      modifiers: { firepower: 4, tacticalExecution: 4, cohesion: 5, discipline: 3 },
      lineupMatches: { [lineupKey]: 18 },
      currentBracket: yearThree.campaign.currentBracket,
    },
  };
  yearThree.campaign.currentBracket = globalThis.__browserGameTestHooks.createCupBracket(yearThree, yearThree.campaign);
  yearThree = applyAction(yearThree, { type: "play" });
  yearThree = applyAction(yearThree, { type: "prematchChoice", choice: "drill" });

  assert.ok(yearOnePenalty < 0, "第一年新队伍应该有明确难度惩罚");
  assert.ok(yearThree.match.hidden.difficultyAdjustment > yearOnePenalty, "后期难度惩罚应该被经验和连续阵容抵消");
  assert.ok(yearThree.match.hidden.baseEdge > yearOneEdge, "同一套阵容到第三年应该比第一年更容易打");
});

test("event stat stacking is soft-capped so year-one teams cannot rush to perfect execution", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  const roster = state.selected.map(hooks.findPlayer);

  const bloatedStats = hooks.teamStats(roster, state.substitute, {
    ...state.campaign.modifiers,
    tacticalExecution: 30,
    cohesion: 30,
    discipline: 24,
    firepower: 20,
  });

  assert.ok(bloatedStats.tacticalExecution < 96, `执行不应被杯间事件直接堆满：${bloatedStats.tacticalExecution}`);
  assert.ok(bloatedStats.cohesion < 96, `配合不应被杯间事件直接堆满：${bloatedStats.cohesion}`);
  assert.ok(bloatedStats.discipline < 96, `纪律不应被杯间事件直接堆满：${bloatedStats.discipline}`);
});

test("ordinary between-cup events only move a few player form states, not the whole roster", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  const event = {
    id: "test-normal-team-boost",
    title: "复盘室",
    passive: "训练室里，大家把上一场的默认和补枪重新过了一遍。",
    options: [{
      id: "review",
      label: "细看录像",
      result: "队伍找到了一些能马上改的细节。",
      delta: "细节更清楚，几名队员状态被带起来",
      effect: { cohesion: 4, tacticalExecution: 3 },
    }],
  };
  state = { ...state, screen: "between-cups", hub: { ...state.hub, events: [event], eventIndex: 0, event, passive: event.passive } };

  const before = { ...state.campaign.playerForm };
  state = applyAction(state, { type: "hubChoice", choice: "review" });
  const changedSelected = state.selected.filter((id) => state.campaign.playerForm[id] !== before[id]);

  assert.ok(changedSelected.length >= 1, "普通事件仍应影响少数选手状态");
  assert.ok(changedSelected.length <= 2, `普通事件不应整队一起亢奋/低迷：${changedSelected.join(", ")}`);
});

test("opening tactic labels stay aligned with the tactic memory labels", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const tacticCard = state.match.cards.find((card) => card.title.includes("开局战术"));
  const labels = tacticCard.options.map((option) => option.label);
  const economyCard = state.match.cards.find((card) => card.title.includes("怎么花钱"));
  const timeoutCard = state.match.cards.find((card) => card.title.includes("暂停窗口"));

  assert.deepEqual(labels.slice(0, 3), ["快攻包点", "默认架枪", "慢控单摸"]);
  assert.match(economyCard.title, /怎么花钱/);
  assert.match(economyCard.options.map((option) => option.label).join(" "), /梭哈全起/);
  assert.match(economyCard.options.map((option) => option.label).join(" "), /谨慎半起/);
  assert.match(economyCard.options.map((option) => option.label).join(" "), /eco不起/);
  assert.ok(timeoutCard.options.every((option) => option.label.length <= 10), "暂停按钮应该是短按钮文案");
  assert.deepEqual(timeoutCard.options.map((option) => option.label), ["更换战术", "安慰队员", "大骂一通"]);
  assert.doesNotMatch(globalThis.__browserGameTestHooks.visibleFeedbackText(timeoutCard.options.find((option) => option.label === "更换战术").delta), /[+-]\d/);
  assert.match(globalThis.__browserGameTestHooks.visibleFeedbackText(timeoutCard.options.find((option) => option.label === "更换战术").delta), /战术口径|默契|指令/);
  assert.doesNotMatch(globalThis.__browserGameTestHooks.visibleFeedbackText(timeoutCard.options.find((option) => option.label === "安慰队员").delta), /[+-]\d/);
  assert.match(globalThis.__browserGameTestHooks.visibleFeedbackText(timeoutCard.options.find((option) => option.label === "安慰队员").delta), /信念感|默契|状态/);
  assert.doesNotMatch(globalThis.__browserGameTestHooks.visibleFeedbackText(timeoutCard.options.find((option) => option.label === "大骂一通").delta), /[+-]\d/);
  assert.match(globalThis.__browserGameTestHooks.visibleFeedbackText(timeoutCard.options.find((option) => option.label === "大骂一通").delta), /指令|情绪|默契/);
});

test("eco at 0-2 is a save call with heavy round risk but no economy-break copy", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state.match.score = [0, 2];
  state.match.eventIndex = state.match.cards.findIndex((card) => card.title.includes("怎么花钱"));
  state = applyAction(state, { type: "decision", choice: "force_setup" });

  assert.equal(state.match.hidden.mapBonuses[2] <= -6, true);
  assert.equal(state.match.hidden.mapBonuses[3] >= 2, true);
  assert.equal(state.match.playerEconomy.tier, "eco");
  const ecoChoiceText = JSON.stringify(state.match.resolved.at(-1));
  assert.match(ecoChoiceText, /输掉即出局|低概率翻盘/);
  assert.doesNotMatch(ecoChoiceText, /留给下一局|下一局能完整起枪|下一局经济更稳/);

  while (state.screen === "match") {
    const card = state.match.cards[state.match.eventIndex];
    state = applyAction(state, card?.options ? { type: "decision", choice: card.options[0].id } : { type: "nextEvent" });
  }

  const resolvedText = state.result
    ? JSON.stringify(state.result)
    : JSON.stringify(state.campaign.currentBracket);
  assert.doesNotMatch(resolvedText, /经济彻底断了|断经济|下一局经济会很难受/);
});

test("elimination map losses do not use next-round comeback voice lines", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state.match.score = [1, 2];
  state.match.eventIndex = state.match.cards.findIndex((card) => card.title.includes("赛点边缘"));
  state.match.hidden.mapBonuses = { ...state.match.hidden.mapBonuses, 3: -60 };
  state.match.hidden.baseEdge = -60;

  state = applyAction(state, { type: "nextEvent" });
  const eliminationText = JSON.stringify(state.result?.matchReplay?.at(-1) ?? state.match.resolved.at(-1));

  assert.match(eliminationText, /BO5 到此结束|杯赛到此结束|被淘汰|没有下一局|最后几个关键回合/);
  assert.doesNotMatch(eliminationText, /下一局|下把|下一把|再给我一把枪|找回来|打回来|换开法/);
});

test("overview atmosphere and event copy is injected into match flow", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const matchText = state.match.cards.map((card) => JSON.stringify(card)).join("\n");

  assert.match(matchText, /大屏幕上跳出两队阵容|场馆的灯光|观众席|空气都不一样/);
  assert.match(matchText, /耳机|全场起哄|挑衅|手感爆发|队内摩擦|横幅|技术暂停|被反制|开局被读|反清闪|舆论压力|明星状态波动|设备故障|道具失误|语音重叠|规则争议|首发位置/);
  assert.match(matchText, /全场起立|解说|通道很长|庆祝声|这就是 CS/);
});

test("timeout communication copy keeps professional callouts instead of telling players to go silent", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const matchText = state.match.cards.map((card) => JSON.stringify(card)).join("\n");

  assert.doesNotMatch(matchText, /谁报点，谁闭麦|闭麦|闭嘴三秒|别说话|停止报点|不报点/);
  assert.match(matchText, /围着 IGL|听 IGL|围绕同一套指令|补枪|道具|回防站位/);
});

test("timeout and prematch copy avoids stiff self-proof phrasing", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const timeoutText = Object.values(hooks.timeoutScenarioLibrary)
    .map((scenario) => [
      scenario.situation,
      scenario.atmosphere,
      ...Object.values(scenario.choices).flatMap((choice) => [choice.label, choice.result, choice.delta]),
    ].join(" "))
    .join("\n");
  const matchText = state.match.cards.map((card) => JSON.stringify(card)).join("\n");
  const prematchText = JSON.stringify(state.prematchIntel);

  assert.doesNotMatch(`${timeoutText}\n${matchText}\n${prematchText}`, /证明自己|证明这支队/);
  assert.match(`${timeoutText}\n${matchText}`, /先把队伍重新拧到一起|按同一套思路打|听同一个指挥|围绕 IGL/);
});

test("timeout scenario library covers varied realistic coaching pauses", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const scenarios = Object.values(hooks.timeoutScenarioLibrary);
  const text = scenarios
    .map((scenario) => `${scenario.situation} ${scenario.atmosphere} ${Object.values(scenario.choices).map((choice) => `${choice.result} ${choice.delta}`).join(" ")}`)
    .join("\n");

  assert.ok(scenarios.length >= 12, `暂停场景池太小：${scenarios.length}`);
  assert.match(text, /心理|手腕|外设|鼠标|教练/);
  assert.match(text, /赞助|直播|媒体|采访|舆论/);
  assert.match(text, /海外集训|地图池|训练赛|泄漏|新战术/);
  assert.match(text, /新人|老将|青训|首发|替补/);
  assert.match(text, /粉丝|慈善|基地|团队|队内/);
  assert.match(text, /表演赛|跨赛区|国际赛区|时差|航班/);
});

test("timeout window is not offered after a won map without a real crisis", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state.match.score = [2, 1];
  state.match.resolved = [
    ...state.match.resolved,
    { title: "第 3 局 · 转折结算", score: [1, 0], result: "第 3 局成了你们的转折图。" },
  ];
  const timeoutIndex = state.match.cards.findIndex((card) => card.usesTimeout);
  state.match.eventIndex = timeoutIndex;

  const beforeTimeoutUsed = state.match.timeoutUsed;
  state = applyAction(state, { type: "nextEvent" });
  const resolved = state.match.resolved.at(-1);

  assert.equal(resolved.title, "第 4 局 · 调整间隙");
  assert.equal(state.match.timeoutUsed, beforeTimeoutUsed);
  assert.doesNotMatch(`${resolved.text} ${resolved.result}`, /残局没收住|为什么不先假拆|互相追责|这个暂停/);
});

test("timeout window is offered when the player trails or the previous map was lost", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  state.match.score = [1, 2];
  state.match.resolved = [
    ...state.match.resolved,
    { title: "第 3 局 · 转折结算", score: [0, 1], result: "第 3 局没拿下。" },
  ];
  const timeoutIndex = state.match.cards.findIndex((card) => card.usesTimeout);
  state.match.eventIndex = timeoutIndex;

  const timeoutCard = state.match.cards[timeoutIndex];
  state = applyAction(state, { type: "decision", choice: timeoutCard.options[0].id });
  const resolved = state.match.resolved.at(-1);

  assert.match(resolved.title, /暂停窗口/);
  assert.equal(state.match.timeoutUsed, true);
});

test("full campaign can run through three seasons and end in chronicle", () => {
  const state = autoplayFullCampaign();

  assert.equal(state.screen, "chronicle");
  assert.equal(state.campaign.seasonIndex, 3);
  assert.equal(state.campaign.cupRecords.length, 9);
  assert.equal(state.campaign.seasonRecords.length, 3);
  assert.ok(Array.isArray(state.chronicle.cups));
  assert.equal(state.chronicle.cups.length, 9);
});

test("between-cup hub loads event text and applies a choice before the next cup", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = playCupToAwards(state);
  state = applyAction(state, { type: "advance" });

  assert.equal(state.screen, "between-cups");
  assert.ok(state.hub.event.title.length > 0);
  assert.ok(state.hub.events.length >= 1);
  assert.ok(state.hub.passive.length > 0);

  const before = { ...state.campaign.modifiers };
  state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });

  assert.ok(state.hub.resolvedEvents.length >= 1);
  assert.notDeepEqual(state.campaign.modifiers, before);
});

test("cup prize is only paid once when advancing out of awards", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = playCupToAwards(state);

  const budgetAtAwards = state.campaign.budget;
  const prize = state.result.prize;
  assert.ok(prize > 0);
  assert.equal(budgetAtAwards, prize);

  state = applyAction(state, { type: "advance" });

  assert.equal(state.campaign.budget, budgetAtAwards);
});

test("early campaign difficulty suppresses smooth first-year snowball but rewards continuity later", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const yearOneStart = hooks.seasonDifficultyAdjustment({ seasonIndex: 1, cupIndex: 0, budget: 0, trophies: 0 }, 0);
  const yearOneAfterTitle = hooks.seasonDifficultyAdjustment({ seasonIndex: 1, cupIndex: 1, budget: 26, trophies: 1 }, 0);
  const yearTwoAfterTitle = hooks.seasonDifficultyAdjustment({ seasonIndex: 2, cupIndex: 0, budget: 35, trophies: 1 }, 1);
  const yearThreeStable = hooks.seasonDifficultyAdjustment({ seasonIndex: 3, cupIndex: 1, budget: 45, trophies: 1 }, 3);

  assert.ok(yearOneStart <= -10, "第一年首杯应有明显新队伍惩罚");
  assert.ok(yearOneAfterTitle <= -11, "第一年爆冷夺冠后下一站应被重点研究，不能马上滚雪球");
  assert.ok(yearTwoAfterTitle <= -7, "第二年仍应保留强队针对和经营压力");
  assert.ok(yearThreeStable > yearTwoAfterTitle, "第三年稳定阵容应明显吃到连续阵容收益");
});

test("between-cup hub can queue multiple events and blocks advancing until all are handled", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state.campaign.cupIndex = 0;
  state.campaign.cupRecords = [
    {
      cupName: "IEM Katowice",
      year: 2027,
      placement: "冠军",
      champion: "Team gun",
      championId: "player-team",
      runnerUp: "Team Vitality",
      mvp: { name: "donk" },
      prize: 26,
      seasonIndex: 1,
    },
  ];
  state.result = state.campaign.cupRecords[0];
  state.screen = "awards";

  state = applyAction(state, { type: "advance" });

  assert.equal(state.screen, "between-cups");
  assert.ok(state.hub.events.length >= 2, "早期夺冠后杯间应该有连续事件处理压力");

  state = applyAction(state, { type: "advance" });
  assert.equal(state.screen, "between-cups", "事件没处理完不能直接进下一杯");

  const firstId = state.hub.event.id;
  state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });
  if (state.hub.event) {
    assert.notEqual(state.hub.event.id, firstId);
    assert.equal(state.hub.choice, undefined);
    state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });
  }

  assert.ok(state.hub.allEventsResolved);
});

test("every between-cup stop queues two varied events regardless of last placement", () => {
  const placements = ["八强", "四强", "亚军", "冠军"];

  for (const placement of placements) {
    let state = draftTestRoster(createInitialState());
    state = applyAction(state, { type: "confirm" });
    state.campaign.cupIndex = 0;
    state.campaign.seasonIndex = 1;
    state.campaign.cupRecords = [
      {
        cupName: "IEM Katowice",
        year: 2027,
        placement,
        champion: placement === "冠军" ? "Team gun" : "Team Vitality",
        championId: placement === "冠军" ? "player-team" : "vitality",
        runnerUp: placement === "亚军" ? "Team gun" : "Team Spirit",
        mvp: { name: "ZywOo" },
        prize: 5,
        seasonIndex: 1,
      },
    ];
    state.result = state.campaign.cupRecords[0];
    state.screen = "awards";

    state = applyAction(state, { type: "advance" });

    assert.equal(state.screen, "between-cups");
    assert.equal(state.hub.events.length, 2, `${placement} 后也应该有两个杯间事件`);
    assert.notEqual(state.hub.events[0].id, state.hub.events[1].id, "同一次杯间不应重复同一个事件");
  }
});

test("between-cup event pool is broad enough for a three-year campaign", () => {
  const pool = globalThis.__browserGameTestHooks.betweenCupEventPool;
  const titles = new Set(pool.map((event) => event.title));
  const titleText = pool.map((event) => `${event.id} ${event.title} ${event.narrative}`).join("\n");

  assert.ok(pool.length >= 46, "杯间事件应吸收文本库，三年内不该反复看到同几件事");
  assert.ok(titles.size >= 42, "事件标题应该足够多样，不能像同一件事反复换皮");
  assert.match(titleText, /对手|热门队|强队|换人|教练/);
  assert.match(titleText, /舆论|粉丝|论坛|采访|私生活|商务/);
  assert.match(titleText, /地图池|战术|训练|demo|默认|道具/);
  assert.match(titleText, /航班|酒店|设备|外设|签证|转场/);
  assert.match(titleText, /赞助商追加预算|训练赛打出信心|版本更新|赔率|心理教练|启用替补/);
});

test("anti-strat between-cup event turns analysis into new tactics instead of hiding tactics", () => {
  const event = globalThis.__browserGameTestHooks.betweenCupEventPool.find((entry) => entry.id === "anti-strat");
  const optionText = event.options.map((option) => `${option.label} ${option.result}`).join(" ");

  assert.match(event.narrative, /默认控图拆成了 14 个镜头/);
  assert.match(optionText, /深度分析每一个细节，产出新战术/);
  assert.match(optionText, /细节|新战术|反清|补枪/);
  assert.doesNotMatch(optionText, /藏住新战术|留到关键局|少暴露新内容/);
});

test("between-cup event picker avoids repeats across a full three-year route while pool has alternatives", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  const placements = ["八强", "四强", "亚军", "冠军", "八强", "四强"];
  const picked = [];

  for (let index = 0; index < placements.length; index += 1) {
    state.campaign.seasonIndex = Math.floor(index / 2) + 1;
    state.campaign.cupIndex = index % 2;
    state.campaign.cupRecords = [
      {
        cupName: index % 2 === 0 ? "IEM Katowice" : "IEM Cologne",
        year: 2027 + Math.floor(index / 2),
        placement: placements[index],
        champion: placements[index] === "冠军" ? "Team gun" : "Team Vitality",
        runnerUp: placements[index] === "亚军" ? "Team gun" : "Team Spirit",
        mvp: { name: "ZywOo" },
      },
    ];
    const events = hooks.buildHubEvents(state.campaign);
    assert.equal(events.length, 2);
    for (const event of events) {
      picked.push(event.id);
      state.campaign.eventHistory = hooks.appendEventHistory(state.campaign.eventHistory, "betweenCup", event.id);
    }
  }

  assert.equal(picked.length, 12);
  assert.equal(new Set(picked).size, picked.length, "事件池够用时，三年路线里的杯间事件应优先不重复");
});

test("between-cup events are seeded and shuffled instead of following one fixed order", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const makeCampaign = (seasonIndex, cupIndex, placement = "四强") => ({
    seasonIndex,
    cupIndex,
    cupRecords: [
      {
        cupName: cupIndex === 0 ? "IEM Katowice" : "IEM Cologne",
        placement,
        champion: "Team Vitality",
        runnerUp: "Team Spirit",
        mvp: { name: "ZywOo" },
      },
    ],
    eventHistory: hooks.createEventHistory(),
  });

  const first = hooks.buildHubEvents(makeCampaign(1, 0)).map((event) => event.id).join(",");
  const second = hooks.buildHubEvents(makeCampaign(2, 1)).map((event) => event.id).join(",");
  const third = hooks.buildHubEvents(makeCampaign(3, 0)).map((event) => event.id).join(",");

  assert.notEqual(first, second, "不同赛季/杯赛的事件顺序应该被 seed 打乱");
  assert.notEqual(first, third, "事件不应该总从同一个位置开始刷");
});

test("between-cup and offseason pools include mixed mild and severe negative events", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const betweenNegative = hooks.betweenCupEventPool.filter((event) => event.severity === "severe" && event.tone === "negative");
  const offseasonNegative = hooks.offseasonEventPool.filter((event) => event.severity === "severe" && event.tone === "negative");
  const mildEvents = [...hooks.betweenCupEventPool, ...hooks.offseasonEventPool].filter((event) => event.severity === "mild");

  assert.ok(betweenNegative.length >= 2, "杯间需要多个严重负面事件，避免只有安慰和加成");
  assert.ok(offseasonNegative.length >= 2, "休赛期需要多个严重负面事件，压制前两年雪球");
  assert.ok(mildEvents.length >= 4, "事件池也要有轻微波动，不能每次都是大事故");
});

test("offseason event pool covers realistic esports operations themes", () => {
  const pool = globalThis.__browserGameTestHooks.offseasonEventPool;
  const text = pool
    .map((event) => `${event.title} ${event.narrative} ${event.options.map((option) => `${option.label} ${option.result} ${option.delta}`).join(" ")}`)
    .join("\n");

  assert.ok(pool.length >= 46, `休赛期事件池太小：${pool.length}`);
  assert.match(text, /心理辅导|体能训练|外设|教练交流/);
  assert.match(text, /赞助商|直播合约|媒体应对/);
  assert.match(text, /海外集训|地图池|训练赛泄漏/);
  assert.match(text, /新人试训|退役念头|青训提拔/);
  assert.match(text, /粉丝见面会|慈善表演赛|基地升级/);
  assert.match(text, /表演赛邀约|国际赛区情报/);
  assert.match(text, /基地网络|粉丝应援|核心选手被询价|家事请假/);
  assert.match(text, /训练强度分歧|训练赛强度|宿敌约训练赛|专项技术教练|纪录片/);
  assert.match(text, /赞助商活动|管理层换人|品牌升级|设备延迟|新游戏/);
  assert.doesNotMatch(text, /[+-]\d/);
});

test("annual offseason generates a fuller non-repeating event set", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const baseCampaign = {
    seasonIndex: 1,
    cupIndex: 2,
    trophies: 0,
    eventHistory: hooks.createEventHistory(),
    textHistory: hooks.createTextHistory(),
    selected: ["donk", "ropz", "apex", "b1t", "chopper", "s1ren"],
    cupRecords: [
      { seasonIndex: 1, cupName: "IEM Katowice", placement: "八强", champion: "Team Vitality", runnerUp: "Team Spirit", mvp: { name: "ZywOo" }, playerStats: [] },
      { seasonIndex: 1, cupName: "IEM Cologne", placement: "四强", champion: "Team Spirit", runnerUp: "FaZe Clan", mvp: { name: "donk" }, playerStats: [] },
      { seasonIndex: 1, cupName: "CS Major", placement: "八强", champion: "MOUZ", runnerUp: "Team Falcons", mvp: { name: "xertioN" }, playerStats: [] },
    ],
  };
  const summary = hooks.createAnnualSummary(baseCampaign);
  const ids = summary.offseasonEvents.map((event) => event.id);

  assert.ok(summary.offseasonEvents.length >= 4, `休赛期事件数量太少：${summary.offseasonEvents.length}`);
  assert.equal(new Set(ids).size, ids.length, "同一年休赛期不应重复同一个事件");
  assert.ok(summary.offseasonEvents.some((event) => event.tone === "negative" || event.severity === "severe"), "休赛期需要有现实压力事件，不应全是正面团建");
});

test("between-cup event stat effects are hidden from the player but still applied", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = playCupToAwards(state);
  state = applyAction(state, { type: "advance" });

  const beforeHtml = globalThis.__renderBrowserForTest(state);
  const beforeEventPanel = beforeHtml.match(/<section class="panel event-focus">[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.doesNotMatch(beforeEventPanel, /火力\s*[+-]\d|执行\s*[+-]\d|战术执行\s*[+-]\d|纪律\s*[+-]\d|配合\s*[+-]\d|团队配合\s*[+-]\d/);

  const beforeModifiers = { ...state.campaign.modifiers };
  state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });
  const afterHtml = globalThis.__renderBrowserForTest(state);
  const afterEventPanel = afterHtml.match(/<section class="panel event-focus">[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.notDeepEqual(state.campaign.modifiers, beforeModifiers);
  assert.doesNotMatch(afterEventPanel, /火力\s*[+-]\d|执行\s*[+-]\d|战术执行\s*[+-]\d|纪律\s*[+-]\d|配合\s*[+-]\d|团队配合\s*[+-]\d/);
  assert.doesNotMatch(afterEventPanel, /<footer>/);
});

test("visible event feedback uses descriptive language instead of raw stat deltas", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const numericDeltaPattern = /(?:火力|战术执行|执行|纪律|士气|配合|团队配合|状态|战术)\s*[+-]\d/;

  state = applyAction(state, { type: "decision", choice: "pistol_armor" });
  state = applyAction(state, { type: "decision", choice: "rush" });
  let matchHtml = globalThis.__renderBrowserForTest(state);
  assert.doesNotMatch(matchHtml, numericDeltaPattern);
  assert.match(matchHtml, /正面对枪|主动权|枪线|节奏|信心|默契|压力/);

  const timeoutCard = state.match.cards.find((card) => card.usesTimeout);
  assert.ok(timeoutCard, "测试需要比赛里存在暂停卡");
  state = {
    ...state,
    match: {
      ...state.match,
      eventIndex: state.match.cards.indexOf(timeoutCard),
    },
  };
  state = applyAction(state, { type: "decision", choice: timeoutCard.options[0].id });
  matchHtml = globalThis.__renderBrowserForTest(state);
  assert.doesNotMatch(matchHtml, numericDeltaPattern);
  assert.match(matchHtml, /执行|信念|默契|语音|节奏|冷静|火气/);

  let hubState = draftTestRoster(createInitialState());
  hubState = applyAction(hubState, { type: "confirm" });
  hubState = playCupToAwards(hubState);
  hubState = applyAction(hubState, { type: "advance" });
  hubState = applyAction(hubState, { type: "hubChoice", choice: hubState.hub.event.options[0].id });
  const hubHtml = globalThis.__renderBrowserForTest(hubState);
  assert.doesNotMatch(hubHtml, numericDeltaPattern);
  assert.match(hubHtml, /更稳|更清楚|信任|默契|手感|训练|复盘|压力|节奏/);
});

test("resolved final between-cup event is not rendered twice and uses natural review copy", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const event = hooks.betweenCupEventPool.find((entry) => entry.id === "anti-strat");
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = {
    ...state,
    screen: "between-cups",
    hub: {
      ...state.hub,
      events: [event],
      event,
      passive: event.passive,
      eventIndex: 0,
      resolvedEvents: [],
      allEventsResolved: false,
    },
  };

  state = applyAction(state, { type: "hubChoice", choice: "rest-reset" });
  const html = globalThis.__renderBrowserForTest(state);

  assert.equal((html.match(/只做轻复盘，让手感回暖/g) ?? []).length, 1);
  assert.match(html, /大家很配合复盘工作，保持了往常的手感/);
  assert.doesNotMatch(html, /语音轻了|枪线也不僵了/);
});

test("map pool exposed event uses coaching-style choices without showing stat deltas", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });

  const event = hooks.betweenCupEventPool.find((entry) => entry.id === "map-pool-exposed");
  state = { ...state, screen: "between-cups", hub: { ...state.hub, event, passive: event.passive } };
  const html = globalThis.__renderBrowserForTest(state);
  const eventPanel = html.match(/<section class="panel event-focus">[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.equal(event.id, "map-pool-exposed");
  assert.match(eventPanel, /反复观摩强队录像学习打法/);
  assert.match(eventPanel, /命令队员跑图寻找细节/);
  assert.match(eventPanel, /在网上搜索战术/);
  assert.doesNotMatch(eventPanel, /执行\s*[+-]\d|纪律\s*[+-]\d|配合\s*[+-]\d|火力\s*[+-]\d/);

  const beforeModifiers = { ...state.campaign.modifiers };
  const after = applyAction(state, { type: "hubChoice", choice: "study-elite-demos" });

  assert.notDeepEqual(after.campaign.modifiers, beforeModifiers);
  assert.match(after.hub.result, /录像|强队|demo|打法/);
});

test("opponent hot hand event uses natural star-duel wording without visible stat deltas", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });

  const event = hooks.betweenCupEventPool.find((entry) => entry.id === "opponent-hot-hand");
  state = { ...state, screen: "between-cups", hub: { ...state.hub, event, passive: event.passive } };
  const html = globalThis.__renderBrowserForTest(state);
  const eventPanel = html.match(/<section class="panel event-focus">[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.match(eventPanel, /让明星选手大胆发挥，针锋相对/);
  assert.doesNotMatch(eventPanel, /先练防首杀包|跟他们拼节奏|慢控拖手感/);
  assert.doesNotMatch(eventPanel, /火力\s*[+-]\d|执行\s*[+-]\d|纪律\s*[+-]\d|配合\s*[+-]\d/);

  const beforeModifiers = { ...state.campaign.modifiers };
  const after = applyAction(state, { type: "hubChoice", choice: "star-duel" });

  assert.notDeepEqual(after.campaign.modifiers, beforeModifiers);
  assert.match(after.hub.result, /明星选手|对位|针锋相对/);
});

test("between-cup events respect the previous cup placement", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = {
    ...state,
    screen: "awards",
    result: {
      cupName: "IEM Katowice",
      year: 2027,
      champion: "Team Vitality",
      runnerUp: "Team Spirit",
      placement: "八强",
      prize: 5,
      mvp: { name: "ZywOo" },
      headline: "八强出局",
      encouragement: "八强出局以后先复盘。",
      bracket: state.campaign.currentBracket,
    },
    campaign: {
      ...state.campaign,
      cupRecords: [
        {
          cupName: "IEM Katowice",
          year: 2027,
          champion: "Team Vitality",
          runnerUp: "Team Spirit",
          placement: "八强",
          prize: 5,
          mvp: { name: "ZywOo" },
          headline: "八强出局",
          signatureCall: "第一轮被淘汰，先把默认和经济线修回来。",
          playerStats: [],
        },
      ],
    },
  };

  state = applyAction(state, { type: "advance" });
  const hubText = `${state.hub.event.title} ${state.hub.event.narrative} ${state.hub.event.options.map((option) => `${option.label} ${option.result}`).join(" ")}`;

  assert.equal(state.screen, "between-cups");
  assert.doesNotMatch(hubText, /喊冠军|热度转成士气|已经开始喊冠军|接住这波关注度/);
  assert.match(hubText, /复盘|漏洞|基本功|默认|经济|训练/);
});

test("between-cup hub can surface harmful events, not only recovery bonuses", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });

  let harmfulChoices = 0;
  let negativeEvents = 0;
  for (let index = 0; index < 8; index += 1) {
    state.campaign.cupRecords = [
      {
        cupName: "IEM Katowice",
        year: 2027,
        placement: index % 2 === 0 ? "八强" : "四强",
        champion: "Team Vitality",
        runnerUp: "Team Spirit",
        mvp: { name: "ZywOo" },
      },
    ];
    state.campaign.cupIndex = index % 2;
    state.campaign.seasonIndex = 1 + Math.floor(index / 3);
    const event = globalThis.__browserGameTestHooks.buildHubEvent(state.campaign);
    if (event?.tone === "negative") negativeEvents += 1;
    if (event) {
      harmfulChoices += event.options.filter((option) => {
        const effect = option.effect ?? {};
        return (effect.firepower ?? 0) < 0
          || (effect.tacticalExecution ?? 0) < 0
          || (effect.cohesion ?? 0) < 0
          || (effect.discipline ?? 0) < 0
          || (effect.form ?? 0) < 0;
      }).length;
    }
  }

  assert.ok(negativeEvents > 0, "杯赛间事件池应该包含坏事事件");
  assert.ok(harmfulChoices > 0, "杯赛间事件应该在后台带来负面代价，而不是只给恢复奖励");
});

test("between-cup event picker avoids recently repeated events when alternatives exist", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state.campaign.cupRecords = [
    {
      cupName: "IEM Katowice",
      year: 2027,
      placement: "八强",
      champion: "Team Vitality",
      runnerUp: "Team Spirit",
      mvp: { name: "ZywOo" },
    },
  ];
  state.campaign.eventHistory = {
    betweenCup: ["early-exit-review", "scrim-collapse", "early-exit-review"],
    offseason: [],
    match: [],
  };

  const picked = new Set();
  for (let index = 0; index < 6; index += 1) {
    state.campaign.cupIndex = index % 2;
    state.campaign.seasonIndex = 1 + Math.floor(index / 3);
    const event = globalThis.__browserGameTestHooks.buildHubEvent(state.campaign);
    picked.add(event.id);
    state.campaign.eventHistory.betweenCup.push(event.id);
  }

  assert.ok(picked.size >= 3, "杯间事件应该尽量轮换，不该两三个事件反复刷屏");
  assert.equal([...picked].includes("early-exit-review"), false, "近期重复过的事件应被降权避开");
});

test("between-cup hub puts transfer work before the next-cup action", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = playCupToAwards(state);
  state = applyAction(state, { type: "advance" });
  state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });

  const hubHtml = globalThis.__renderBrowserForTest(state);
  const transferIndex = hubHtml.indexOf("转会窗口");
  const advanceIndex = hubHtml.indexOf("进入下一杯");

  assert.ok(transferIndex > -1);
  assert.ok(advanceIndex > -1);
  assert.ok(transferIndex < advanceIndex);
  assert.match(hubHtml, /hub-transfer-panel/);
  assert.match(hubHtml, /hub-footer-actions/);
  assert.match(hubHtml, /trade-player-card/);
});

test("transfer selection has explicit selected labels and negotiation wording", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = playCupToAwards(state);
  state = applyAction(state, { type: "advance" });
  state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });
  state = applyAction(state, { type: "tradePickOutgoing", playerId: "s1ren" });
  state = applyAction(state, { type: "tradePickTarget", playerId: state.hub.tradeOffers[0].id });

  const selectedHtml = globalThis.__renderBrowserForTest(state);
  assert.match(selectedHtml, /已选送出/);
  assert.match(selectedHtml, /已选目标/);

  const poorState = {
    ...state,
    campaign: {
      ...state.campaign,
      budget: 0,
    },
  };
  const failed = applyAction(poorState, { type: "tradeAttempt" });
  const failureText = `${failed.hub.tradeResult.title} ${failed.hub.tradeResult.text} ${failed.hub.tradeResult.delta}`;

  assert.match(failureText, /报价|对方|补价|谈/);
  assert.doesNotMatch(failureText, /财务直接卡住|财务卡住/);
});

test("transfer window has role tabs and stable scroll hooks for both player lists", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = playCupToAwards(state);
  state = applyAction(state, { type: "advance" });
  state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });

  let tradeHtml = globalThis.__renderBrowserForTest(state);
  assert.match(tradeHtml, /data-action="trade-filter-outgoing" data-role="awp"/);
  assert.match(tradeHtml, /data-action="trade-filter-target" data-role="rifler"/);
  assert.match(tradeHtml, /data-scroll-key="tradeOutgoing"/);
  assert.match(tradeHtml, /data-scroll-key="tradeTarget"/);

  state = applyAction(state, { type: "tradeFilterTarget", role: "awp" });
  tradeHtml = globalThis.__renderBrowserForTest(state);
  assert.equal(state.hub.tradeSelection.targetRoleFilter, "awp");
  assert.match(tradeHtml, /再选想换来谁 · 狙击手/);
  assert.match(tradeHtml, /Jee|danking|m0NESY|ZywOo|sh1ro|broky|device|910/);
  assert.doesNotMatch(tradeHtml, /data-action="trade-pick-target" data-player="karrigan"/);

  state = applyAction(state, { type: "tradeFilterOutgoing", role: "support" });
  tradeHtml = globalThis.__renderBrowserForTest(state);
  assert.equal(state.hub.tradeSelection.outgoingRoleFilter, "support");
  assert.match(tradeHtml, /先选送出谁 · 防守者/);
});

test("transfer window supports free cash bidding with changing success odds", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = playCupToAwards(state);
  state = applyAction(state, { type: "advance" });
  state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });
  state = {
    ...state,
    campaign: {
      ...state.campaign,
      budget: 20,
    },
  };
  state = applyAction(state, { type: "tradePickOutgoing", playerId: "s1ren" });
  state = applyAction(state, { type: "tradePickTarget", playerId: "naf" });

  const lowHtml = globalThis.__renderBrowserForTest(state);
  assert.match(lowHtml, /type="range"/);
  assert.match(lowHtml, /预计合理补价/);
  assert.match(lowHtml, /预估成功率/);
  assert.match(lowHtml, /试探报价|接近合理|溢价强推/);

  const lowRate = globalThis.__browserGameTestHooks.tradeSuccessWindow(state, "s1ren", "naf", 0).mid;
  const highRate = globalThis.__browserGameTestHooks.tradeSuccessWindow(state, "s1ren", "naf", 18).mid;
  assert.ok(highRate > lowRate, "提高报价应该提高预估成功率");

  const beforeBudget = state.campaign.budget;
  const attempted = applyAction(state, { type: "tradeBid", cash: 0 });
  const failed = applyAction(attempted, { type: "tradeAttempt" });
  if (!failed.hub.tradeResult.success) {
    assert.equal(failed.campaign.budget, beforeBudget);
    assert.equal(failed.hub.tradeAttemptUsed, true);
    assert.match(failed.hub.tradeResult.text, /报价|对方|兴趣|拆阵容|谈判/);
  }
});

test("market price rises after player and opponent highlight moments", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = {
    ...state,
    campaign: {
      ...state.campaign,
      budget: 30,
      highlightLog: [
        { playerId: "s1ren", playerName: "s1ren", teamId: "player-team", teamName: "Team gun", kind: "player" },
        { playerId: "naf", playerName: "NAF", teamId: "faze", teamName: "FaZe Clan", kind: "opponent" },
        { playerId: "naf", playerName: "NAF", teamId: "faze", teamName: "FaZe Clan", kind: "opponent" },
      ],
    },
  };

  const outgoing = hooks.marketPrice(hooks.findPlayer("s1ren"), state.campaign);
  const target = hooks.marketPrice(hooks.findPlayer("naf"), state.campaign);
  assert.ok(outgoing > hooks.findPlayer("s1ren").price, "player highlight should raise outgoing market price slightly");
  assert.ok(target > hooks.findPlayer("naf").price, "opponent highlight should raise target market price too");

  const baseline = hooks.getTradePackage({ ...state, campaign: { ...state.campaign, highlightLog: [] } }, { ...state.campaign, highlightLog: [] }, "s1ren", "naf");
  const heated = hooks.getTradePackage(state, state.campaign, "s1ren", "naf");
  assert.ok(heated.cash > baseline.cash, "target opponent highlights should make the trade more expensive despite outgoing player hype");
});

test("trading down pays cash back to the player instead of asking for extra money", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = playCupToAwards(state);
  state = applyAction(state, { type: "advance" });
  state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });
  state = {
    ...state,
    campaign: {
      ...state.campaign,
      budget: 8,
    },
  };
  state = applyAction(state, { type: "tradePickOutgoing", playerId: "aleksib" });
  state = applyAction(state, { type: "tradePickTarget", playerId: "makazze" });

  const offer = globalThis.__browserGameTestHooks.getTradePackage(state, state.campaign, "aleksib", "makazze");
  const tradeHtml = globalThis.__renderBrowserForTest(state);

  assert.ok(offer.cash < 0, "高身价换低身价时现金应该为负，表示对方补钱给玩家");
  assert.match(tradeHtml, /预计回收|对方补给你|预算回收/);
  assert.doesNotMatch(tradeHtml, /预计合理补价[^<]*\$2|送出 Aleksib \+ \$2/);

  const beforeBudget = state.campaign.budget;
  const bidAdjusted = applyAction(state, { type: "tradeBid", cash: offer.cash });
  assert.equal(bidAdjusted.hub.tradeSelection.cashOffer, offer.cash);

  const after = applyAction(bidAdjusted, { type: "tradeAttempt" });
  if (after.hub.tradeResult.success) {
    assert.equal(after.campaign.budget, beforeBudget + Math.abs(offer.cash));
    assert.match(after.hub.tradeResult.text, /对方补给你|预算回收|回收/);
  }
});

test("successful transfers create a temporary chemistry settling-in period", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state = playCupToAwards(state);
  state = applyAction(state, { type: "advance" });
  state = applyAction(state, { type: "hubChoice", choice: state.hub.event.options[0].id });
  state = {
    ...state,
    campaign: {
      ...state.campaign,
      budget: 50,
    },
  };

  const beforeStats = hooks.teamStats(
    state.selected.map(hooks.findPlayer),
    state.substitute,
    { ...state.campaign.modifiers, rosterFriction: state.campaign.rosterFriction ?? 0 },
  );
  state = applyAction(state, { type: "tradePickOutgoing", playerId: "s1ren" });
  state = applyAction(state, { type: "tradePickTarget", playerId: "naf" });
  state = applyAction(state, { type: "tradeBid", cash: 50 });
  const afterTrade = applyAction(state, { type: "tradeAttempt" });

  assert.equal(afterTrade.hub.tradeResult.success, true);
  assert.ok(afterTrade.campaign.rosterFriction > 0, "交易成功后应进入磨合期");
  assert.match(`${afterTrade.hub.tradeResult.text} ${afterTrade.hub.tradeResult.delta}`, /磨合期|默契|重新磨/);

  const afterStats = hooks.teamStats(
    afterTrade.selected.map(hooks.findPlayer),
    afterTrade.substitute,
    { ...afterTrade.campaign.modifiers, rosterFriction: afterTrade.campaign.rosterFriction },
  );
  assert.ok(afterStats.cohesion < beforeStats.cohesion, `磨合期应压低配合：before ${beforeStats.cohesion}, after ${afterStats.cohesion}`);
  assert.ok(afterStats.tacticalExecution < beforeStats.tacticalExecution || afterStats.discipline < beforeStats.discipline, "磨合期也应影响执行或纪律");

  const event = afterTrade.hub.event;
  const recovered = applyAction(afterTrade, { type: "hubChoice", choice: event.options[0].id });
  assert.ok(recovered.campaign.rosterFriction < afterTrade.campaign.rosterFriction, "后续杯间处理应缓解磨合期");
});

test("substitute selection affects active match text", () => {
  let state = draftTestRoster(createInitialState());

  state = applyAction(state, { type: "substitute", player: "donk" });
  state = applyAction(state, { type: "confirm" });
  state = applyAction(state, { type: "play" });
  state = applyAction(state, { type: "prematchChoice", choice: "drill" });

  const matchText = state.match.cards.map((card) => JSON.stringify(card)).join("\n");
  assert.equal(state.substitute, "donk");
  assert.doesNotMatch(matchText, /donk/);
});

test("fresh event picker prefers never-used career events before recycling old ones", () => {
  const pool = [
    { id: "already-used-long-ago", title: "旧事件" },
    { id: "never-used", title: "新事件" },
  ];
  const history = {
    betweenCup: ["already-used-long-ago", "other-1", "other-2", "other-3", "other-4", "other-5", "other-6"],
    offseason: [],
    match: [],
  };

  const picked = globalThis.__browserGameTestHooks.pickFreshEvent(pool, 0, history, "betweenCup");

  assert.equal(picked.id, "never-used");
});

test("cup encouragement library can cover nine cups without repeating the same manager message", () => {
  const hooks = globalThis.__browserGameTestHooks;
  let textHistory = hooks.createTextHistory();
  const messages = [];
  const placements = ["八强", "四强", "亚军", "冠军", "八强", "冠军", "四强", "亚军", "冠军"];

  for (let index = 0; index < 9; index += 1) {
    const picked = hooks.pickCupEncouragement(
      `测试杯赛 ${index + 1}`,
      placements[index],
      index % 3 === 0 ? "Team gun" : "Team Vitality",
      index % 2 === 0 ? "donk" : "ZywOo",
      placements.slice(0, index + 1).filter((placement) => placement === "冠军").length,
      { seed: index, textHistory },
    );
    textHistory = hooks.appendTextHistory(textHistory, "cup", picked.id);
    messages.push(picked.message);
  }

  assert.equal(new Set(messages).size, 9);
  assert.ok(messages.some((line) => /八强出局|淘汰|问题/.test(line)), "八强应触发安慰和复盘口径");
  assert.ok(messages.some((line) => /冠军|奖杯|捧杯/.test(line)), "冠军应触发夺冠口径");
});

test("annual summary includes a non-repeating quote and a condition-aware manager message", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const baseCampaign = {
    seasonIndex: 1,
    trophies: 0,
    eventHistory: hooks.createEventHistory(),
    textHistory: hooks.createTextHistory(),
    cupRecords: [
      { seasonIndex: 1, cupName: "IEM Katowice", placement: "八强", champion: "Team Vitality", championId: "vitality", runnerUp: "Team Spirit", mvp: { name: "ZywOo" }, playerStats: [], signatureCall: "默认架枪", tacticalStyle: "稳定" },
      { seasonIndex: 1, cupName: "IEM Cologne", placement: "四强", champion: "Team Spirit", championId: "spirit", runnerUp: "FaZe Clan", mvp: { name: "donk" }, playerStats: [], signatureCall: "慢控单摸", tacticalStyle: "保守" },
      { seasonIndex: 1, cupName: "CS Major", placement: "八强", champion: "MOUZ", championId: "mouz", runnerUp: "Team Falcons", mvp: { name: "xertioN" }, playerStats: [], signatureCall: "快攻包点", tacticalStyle: "激进" },
    ],
  };

  const first = hooks.createAnnualSummary(baseCampaign);
  const second = hooks.createAnnualSummary({
    ...baseCampaign,
    seasonIndex: 2,
    textHistory: hooks.appendTextHistory(baseCampaign.textHistory, "annual", first.managerMessageId),
    cupRecords: baseCampaign.cupRecords.map((record) => ({ ...record, seasonIndex: 2 })),
  });

  assert.match(first.managerMessage, /四强|奖杯|体系|复盘|下一场大赛|征途|磨/);
  assert.match(first.seasonQuote, /。|，|一剑|雄关|长风|千磨|路漫漫/);
  assert.notEqual(first.managerMessageId, second.managerMessageId);
});

test("annual player of year card rotates descriptive lines instead of using fixed copy", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const baseCampaign = {
    seasonIndex: 1,
    trophies: 0,
    eventHistory: hooks.createEventHistory(),
    textHistory: hooks.createTextHistory(),
    cupRecords: [
      {
        seasonIndex: 1,
        cupName: "IEM Katowice",
        placement: "冠军",
        champion: "Team gun",
        championId: "player-team",
        runnerUp: "Team Vitality",
        mvp: { name: "KSCERATO" },
        playerStats: [{ name: "KSCERATO", impact: 48, kills: 44, assists: 8, deaths: 12 }],
        tacticalStyle: "激进",
      },
      {
        seasonIndex: 1,
        cupName: "IEM Cologne",
        placement: "四强",
        champion: "Team Spirit",
        championId: "spirit",
        runnerUp: "Team gun",
        mvp: { name: "donk" },
        playerStats: [{ name: "KSCERATO", impact: 42, kills: 39, assists: 7, deaths: 13 }],
        tacticalStyle: "稳定",
      },
      {
        seasonIndex: 1,
        cupName: "CS Major",
        placement: "亚军",
        champion: "MOUZ",
        championId: "mouz",
        runnerUp: "Team gun",
        mvp: { name: "xertioN" },
        playerStats: [{ name: "KSCERATO", impact: 46, kills: 41, assists: 9, deaths: 11 }],
        tacticalStyle: "保守",
      },
    ],
  };

  const first = hooks.createAnnualSummary(baseCampaign);
  const second = hooks.createAnnualSummary({
    ...baseCampaign,
    seasonIndex: 2,
    textHistory: hooks.appendTextHistory(baseCampaign.textHistory, "annual", first.playerOfYearLineId),
    cupRecords: baseCampaign.cupRecords.map((record) => ({ ...record, seasonIndex: 2 })),
  });
  const html = globalThis.__renderBrowserForTest({ screen: "annual-awards", campaign: baseCampaign, annualSummary: first });

  assert.ok(first.playerOfYearLine.length > 18);
  assert.notEqual(first.playerOfYearLineId, second.playerOfYearLineId);
  assert.doesNotMatch(html, /这个名字贯穿了整年的高光和关键局/);
  assert.match(html, /KSCERATO/);
  assert.match(first.playerOfYearLine, /KSCERATO|年度|决赛|关键|高光|稳定|奖杯|强队/);
});

test("annual player of year card has enough fresh lines for a three-year campaign", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const baseRecords = [
    {
      seasonIndex: 1,
      cupName: "IEM Katowice",
      placement: "八强",
      champion: "Team Vitality",
      championId: "vitality",
      runnerUp: "Natus Vincere",
      mvp: { name: "ZywOo" },
      playerStats: [{ name: "KSCERATO", impact: 24, kills: 22, assists: 4, deaths: 19 }],
      tacticalStyle: "稳定",
    },
    {
      seasonIndex: 1,
      cupName: "IEM Cologne",
      placement: "四强",
      champion: "MOUZ",
      championId: "mouz",
      runnerUp: "Team gun",
      mvp: { name: "xertioN" },
      playerStats: [{ name: "KSCERATO", impact: 34, kills: 29, assists: 8, deaths: 17 }],
      tacticalStyle: "保守",
    },
    {
      seasonIndex: 1,
      cupName: "CS Major",
      placement: "亚军",
      champion: "Team Spirit",
      championId: "spirit",
      runnerUp: "Team gun",
      mvp: { name: "donk" },
      playerStats: [{ name: "KSCERATO", impact: 39, kills: 35, assists: 7, deaths: 16 }],
      tacticalStyle: "激进",
    },
  ];
  let textHistory = hooks.createTextHistory();
  const pickedLines = [];
  const pickedPlayers = [];

  for (let seasonIndex = 1; seasonIndex <= 3; seasonIndex += 1) {
    const campaign = {
      ...createInitialState().campaign,
      seasonIndex,
      textHistory,
      cupRecords: baseRecords.map((record) => ({ ...record, seasonIndex })),
    };
    const summary = hooks.createAnnualSummary(campaign);
    pickedLines.push(summary.playerOfYearLine);
    pickedPlayers.push(summary.playerOfYear);
    textHistory = hooks.appendTextHistory(textHistory, "annual", summary.playerOfYearLineId);
  }

  assert.equal(new Set(pickedLines).size, 3);
  assert.ok(pickedLines.every((line, index) => line.includes(pickedPlayers[index])));
  assert.doesNotMatch(pickedLines.join("\n"), /这个名字贯穿了整年的高光和关键局/);
});

test("offseason events require player choices before the next season", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state.campaign.cupIndex = 2;
  state = playCupToAwards(state);
  state = applyAction(state, { type: "advance" });

  assert.equal(state.screen, "annual-awards");
  assert.equal(state.annualSummary.allOffseasonResolved, false);
  let html = globalThis.__renderBrowserForTest(state);
  assert.match(html, /休赛期决策/);
  assert.match(html, /data-action="offseason-decision"/);
  assert.doesNotMatch(html, /默认处理/);

  const blocked = applyAction(state, { type: "advance" });
  assert.equal(blocked.screen, "annual-awards");
  assert.match(blocked.error, /休赛期事件/);

  const firstOption = state.annualSummary.offseasonEvents[0].options[0];
  state = applyAction(state, { type: "offseasonChoice", choice: firstOption.id });
  assert.equal(state.annualSummary.resolvedOffseasonEvents.length, 1);
  assert.equal(state.annualSummary.resolvedOffseasonEvents[0].choice, firstOption.label);
  assert.notDeepEqual(state.campaign.nextSeasonModifiers, { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0 });

  html = globalThis.__renderBrowserForTest(state);
  assert.match(html, /已处理/);
  assert.match(html, new RegExp(firstOption.label));
});

test("final season keeps the annual summary but removes offseason event choices", () => {
  let state = draftTestRoster(createInitialState());
  state = applyAction(state, { type: "confirm" });
  state.campaign.seasonIndex = 3;
  state.campaign.cupIndex = 2;
  state.campaign.currentBracket = globalThis.__browserGameTestHooks.createCupBracket(state, state.campaign);
  state = playCupToAwards(state);
  state = applyAction(state, { type: "advance" });

  assert.equal(state.screen, "annual-awards");
  assert.equal(state.annualSummary.offseasonEvents.length, 0);
  assert.equal(state.annualSummary.allOffseasonResolved, true);

  const html = globalThis.__renderBrowserForTest(state);
  assert.doesNotMatch(html, /休赛期决策|data-action="offseason-decision"/);
  assert.match(html, /年度奖项|年度 Top 10|本赛季三杯回顾/);
  assert.match(html, /年度收官|看完年度总结，进入三年编年史/);

  state = applyAction(state, { type: "advance" });
  assert.equal(state.screen, "chronicle");
});

test("all offseason choices unlock advancing and apply different hidden effects", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const baseCampaign = {
    seasonIndex: 1,
    trophies: 0,
    eventHistory: hooks.createEventHistory(),
    textHistory: hooks.createTextHistory(),
    cupRecords: [
      { seasonIndex: 1, cupName: "IEM Katowice", placement: "八强", champion: "Team Vitality", championId: "vitality", runnerUp: "Team Spirit", mvp: { name: "ZywOo" }, playerStats: [], signatureCall: "默认架枪", tacticalStyle: "稳定" },
      { seasonIndex: 1, cupName: "IEM Cologne", placement: "四强", champion: "Team Spirit", championId: "spirit", runnerUp: "FaZe Clan", mvp: { name: "donk" }, playerStats: [], signatureCall: "慢控单摸", tacticalStyle: "保守" },
      { seasonIndex: 1, cupName: "CS Major", placement: "八强", champion: "MOUZ", championId: "mouz", runnerUp: "Team Falcons", mvp: { name: "xertioN" }, playerStats: [], signatureCall: "快攻包点", tacticalStyle: "激进" },
    ],
    seasonRecords: [],
  };
  const event = hooks.offseasonEventPool.find((entry) => entry.id === "offseason-meta-shift");
  const summary = {
    ...hooks.createAnnualSummary(baseCampaign),
    offseasonEvents: [event],
    offseasonEventIndex: 0,
    resolvedOffseasonEvents: [],
    allOffseasonResolved: false,
  };
  let cautious = {
    ...createInitialState(),
    selected: TEST_ROSTER_IDS,
    substitute: "s1ren",
    screen: "annual-awards",
    annualSummary: summary,
    campaign: {
      ...baseCampaign,
      selected: TEST_ROSTER_IDS,
      substitute: "s1ren",
      modifiers: { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0 },
      nextSeasonModifiers: { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0 },
      seasonRecords: [summary],
      currentBracket: hooks.createCupBracket({ selected: TEST_ROSTER_IDS, substitute: "s1ren" }, { seasonIndex: 1, cupIndex: 2 }),
    },
  };
  let risky = {
    ...cautious,
    annualSummary: { ...summary, resolvedOffseasonEvents: [], allOffseasonResolved: false },
    campaign: { ...cautious.campaign, nextSeasonModifiers: { firepower: 0, tacticalExecution: 0, cohesion: 0, discipline: 0 }, seasonRecords: [summary] },
  };

  cautious = applyAction(cautious, { type: "offseasonChoice", choice: event.options[0].id });
  risky = applyAction(risky, { type: "offseasonChoice", choice: event.options[1].id });

  assert.equal(cautious.annualSummary.allOffseasonResolved, true);
  assert.notDeepEqual(cautious.campaign.nextSeasonModifiers, risky.campaign.nextSeasonModifiers);

  const next = applyAction(cautious, { type: "advance" });
  assert.equal(next.screen, "bracket");
  assert.deepEqual(next.campaign.modifiers, cautious.campaign.nextSeasonModifiers);
});

test("offseason generated choices are event-specific instead of generic buttons", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const event = hooks.offseasonEventPool.find((entry) => entry.id === "coaching-staff-change");
  const labels = event.options.map((option) => option.label).join("\n");
  const results = event.options.map((option) => option.result).join("\n");
  const effects = event.options.map((option) => JSON.stringify(option.effect));

  assert.equal(event.options.length, 3);
  assert.doesNotMatch(labels, /提高训练强度|保护选手状态|加压解决问题|先稳住队伍/);
  assert.match(labels, /小范围|试验|一线队|暂停|训练赛|复盘|搁置|保留|原体系/);
  assert.match(results, /助教|新方案|原体系|训练赛|复盘|队员/);
  assert.equal(new Set(effects).size, 3);
});

test("offseason generated choices use richer CS-specific decisions and feedback", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const ids = ["offseason-contract-talk", "offseason-fan-backlash", "offseason-training-intensity"];
  const events = ids.map((id) => hooks.offseasonEventPool.find((entry) => entry.id === id));
  const text = events.flatMap((event) => event.options.flatMap((option) => [option.label, option.result])).join("\n");

  assert.ok(events.every((event) => event?.options?.length === 3));
  assert.doesNotMatch(text, /保护选手状态|提高训练强度|加压解决问题|先稳住队伍|按计划处理/);
  assert.match(text, /角色会议|枪位|训练赛|复盘室|论坛|热搜|跑图|补枪|休息日|下一场大赛/);
  assert.match(text, /经纪人|队员|教练组|训练室|舆论|训练质量|恢复/);
});

test("player-facing offseason and event copy uses training-room wording instead of locker-room wording", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const text = [
    ...hooks.offseasonEventPool.flatMap((event) => [
      event.title,
      event.narrative,
      event.result,
      ...(event.options ?? []).flatMap((option) => [option.label, option.result]),
    ]),
    ...hooks.betweenCupEventPool.flatMap((event) => [
      event.title,
      event.narrative,
      event.result,
      ...(event.options ?? []).flatMap((option) => [option.label, option.result]),
    ]),
  ].join("\n");

  assert.doesNotMatch(text, /更衣室/);
  assert.match(text, /训练室/);
});

test("offseason decision copy points to the next big event instead of vague next year", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const text = hooks.offseasonEventPool.map((event) => [
    event.narrative,
    event.result,
    ...(event.options ?? []).flatMap((option) => [option.label, option.result]),
  ].join(" ")).join("\n");

  assert.doesNotMatch(text, /明年|下一年|新赛季/);
  assert.match(text, /下一场大赛|下一站大赛|后面的杯赛/);
});

test("annual review point includes varied slump language beyond the cup name", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const baseCampaign = {
    seasonIndex: 1,
    trophies: 0,
    eventHistory: hooks.createEventHistory(),
    textHistory: hooks.createTextHistory(),
    cupRecords: [
      { seasonIndex: 1, cupName: "IEM Katowice", placement: "八强", champion: "Team Vitality", championId: "vitality", runnerUp: "Team Spirit", mvp: { name: "ZywOo" }, playerStats: [], signatureCall: "默认架枪", tacticalStyle: "稳定" },
      { seasonIndex: 1, cupName: "IEM Cologne", placement: "四强", champion: "Team Spirit", championId: "spirit", runnerUp: "FaZe Clan", mvp: { name: "donk" }, playerStats: [], signatureCall: "慢控单摸", tacticalStyle: "保守" },
      { seasonIndex: 1, cupName: "CS Major", placement: "八强", champion: "MOUZ", championId: "mouz", runnerUp: "Team Falcons", mvp: { name: "xertioN" }, playerStats: [], signatureCall: "快攻包点", tacticalStyle: "激进" },
    ],
  };

  const first = hooks.createAnnualSummary(baseCampaign);
  const second = hooks.createAnnualSummary({
    ...baseCampaign,
    seasonIndex: 2,
    textHistory: hooks.appendTextHistory(baseCampaign.textHistory, "annual", first.collapseReviewId),
    cupRecords: baseCampaign.cupRecords.map((record) => ({ ...record, seasonIndex: 2 })),
  });

  assert.match(first.collapseReview, /IEM Katowice|八强|低谷|复盘|训练室|拆开|夜晚|风雨|问题/);
  assert.notEqual(first.collapseReview, first.biggestCollapse);
  assert.notEqual(first.collapseReviewId, second.collapseReviewId);

  const html = globalThis.__renderBrowserForTest({ screen: "annual-awards", campaign: baseCampaign, annualSummary: first });
  assert.match(html, /最需要复盘的一站/);
  assert.match(html, /IEM Katowice/);
  assert.match(html, /低谷|复盘|训练室|拆开|风雨|问题/);
});

test("annual top 10 weights individual output more than passive team exposure", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const campaign = {
    seasonIndex: 1,
    trophies: 0,
    eventHistory: hooks.createEventHistory(),
    textHistory: hooks.createTextHistory(),
    cupRecords: [
      {
        seasonIndex: 1,
        cupName: "IEM Katowice",
        placement: "四强",
        champion: "Team Vitality",
        championId: "vitality",
        runnerUp: "Team Spirit",
        mvp: { name: "ZywOo" },
        playerStats: [
          { name: "donk", impact: 64, kills: 54 },
          { name: "karrigan", impact: 14, kills: 18 },
        ],
      },
      {
        seasonIndex: 1,
        cupName: "IEM Cologne",
        placement: "八强",
        champion: "FaZe Clan",
        championId: "faze",
        runnerUp: "MOUZ",
        mvp: { name: "frozen" },
        playerStats: [
          { name: "donk", impact: 51, kills: 46 },
          { name: "ropz", impact: 18, kills: 20 },
        ],
      },
      {
        seasonIndex: 1,
        cupName: "CS Major",
        placement: "亚军",
        champion: "Team Spirit",
        championId: "spirit",
        runnerUp: "Team gun",
        mvp: { name: "sh1ro" },
        playerStats: [
          { name: "donk", impact: 58, kills: 49 },
          { name: "b1t", impact: 22, kills: 24 },
        ],
      },
    ],
  };

  const summary = hooks.createAnnualSummary(campaign);
  const names = summary.top10.map((entry) => entry.name);
  const donkRank = names.indexOf("donk");
  const passiveChampionCoreRank = names.indexOf("karrigan");

  assert.equal(summary.playerOfYear, "donk");
  assert.ok(donkRank >= 0 && donkRank <= 1, `个人高输出选手排名过低：${JSON.stringify(summary.top10)}`);
  assert.ok(passiveChampionCoreRank === -1 || passiveChampionCoreRank > donkRank, "年度个人榜不应让团队曝光压过个人输出");
});

test("first-year annual top 10 avoids runaway player-team scoring", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const campaign = {
    seasonIndex: 1,
    trophies: 0,
    eventHistory: hooks.createEventHistory(),
    textHistory: hooks.createTextHistory(),
    cupRecords: [
      {
        seasonIndex: 1,
        cupName: "IEM Katowice",
        placement: "八强",
        champion: "Team Vitality",
        championId: "vitality",
        runnerUp: "Team Spirit",
        mvp: { name: "ZywOo" },
        playerStats: [
          { name: "m0NESY", impact: 76, kills: 63, assists: 8, deaths: 7 },
          { name: "donk", impact: 31, kills: 30, assists: 4, deaths: 10 },
        ],
      },
      {
        seasonIndex: 1,
        cupName: "IEM Cologne",
        placement: "四强",
        champion: "Team Falcons",
        championId: "falcons",
        runnerUp: "MOUZ",
        mvp: { name: "NiKo" },
        playerStats: [
          { name: "m0NESY", impact: 68, kills: 55, assists: 6, deaths: 8 },
          { name: "b1t", impact: 42, kills: 37, assists: 5, deaths: 11 },
        ],
      },
      {
        seasonIndex: 1,
        cupName: "CS Major",
        placement: "亚军",
        champion: "Team Spirit",
        championId: "spirit",
        runnerUp: "Team gun",
        mvp: { name: "sh1ro" },
        playerStats: [
          { name: "m0NESY", impact: 70, kills: 58, assists: 7, deaths: 9 },
          { name: "donk", impact: 37, kills: 33, assists: 5, deaths: 12 },
          { name: "b1t", impact: 34, kills: 31, assists: 6, deaths: 10 },
        ],
      },
    ],
  };

  const summary = hooks.createAnnualSummary(campaign);
  const points = summary.top10.map((entry) => entry.points);
  const playerNames = new Set(["m0NESY", "donk", "b1t", "ropz", "apEX", "chopper"]);
  const topFivePlayerCount = summary.top10.slice(0, 5).filter((entry) => playerNames.has(entry.name)).length;

  assert.ok(points[0] <= points[1] * 1.65, `年度第一不应接近第二名三倍：${JSON.stringify(summary.top10)}`);
  assert.ok(topFivePlayerCount <= 2, `第一年 Top 5 不应被玩家队刷屏：${JSON.stringify(summary.top10)}`);
  assert.ok(Math.max(...points) <= 90, `年度榜影响分不应膨胀到近 200：${JSON.stringify(summary.top10)}`);
});

test("year-one annual top 10 stays contested even after a strong player-team season", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const campaign = {
    seasonIndex: 1,
    trophies: 0,
    eventHistory: hooks.createEventHistory(),
    textHistory: hooks.createTextHistory(),
    cupRecords: [
      {
        seasonIndex: 1,
        cupName: "IEM Katowice",
        placement: "冠军",
        champion: "Team gun",
        championId: "player-team",
        runnerUp: "Team Spirit",
        mvp: { name: "ZywOo" },
        playerStats: [
          { name: "ZywOo", impact: 94, kills: 70, assists: 8, deaths: 5 },
          { name: "KSCERATO", impact: 38, kills: 34, assists: 7, deaths: 10 },
          { name: "apEX", impact: 34, kills: 25, assists: 15, deaths: 12 },
          { name: "sh1ro", impact: 32, kills: 30, assists: 5, deaths: 9 },
          { name: "Zero", impact: 31, kills: 27, assists: 9, deaths: 11 },
        ],
      },
      {
        seasonIndex: 1,
        cupName: "IEM Cologne",
        placement: "冠军",
        champion: "Team gun",
        championId: "player-team",
        runnerUp: "Team Falcons",
        mvp: { name: "ZywOo" },
        playerStats: [
          { name: "ZywOo", impact: 88, kills: 66, assists: 10, deaths: 7 },
          { name: "NiKo", impact: 36, kills: 35, assists: 4, deaths: 12 },
          { name: "KSCERATO", impact: 35, kills: 32, assists: 8, deaths: 11 },
          { name: "apEX", impact: 32, kills: 24, assists: 16, deaths: 13 },
          { name: "sh1ro", impact: 30, kills: 29, assists: 5, deaths: 10 },
        ],
      },
      {
        seasonIndex: 1,
        cupName: "CS Major",
        placement: "亚军",
        champion: "Team Vitality",
        championId: "vitality",
        runnerUp: "Team gun",
        mvp: { name: "ZywOo" },
        playerStats: [
          { name: "ZywOo", impact: 80, kills: 62, assists: 9, deaths: 9 },
          { name: "NiKo", impact: 33, kills: 32, assists: 6, deaths: 13 },
          { name: "KSCERATO", impact: 31, kills: 30, assists: 8, deaths: 12 },
          { name: "apEX", impact: 28, kills: 23, assists: 14, deaths: 14 },
          { name: "sh1ro", impact: 26, kills: 27, assists: 5, deaths: 11 },
        ],
      },
    ],
  };

  const summary = hooks.createAnnualSummary(campaign);
  const points = summary.top10.map((entry) => entry.points);
  const playerRosterNames = new Set(["ZywOo", "KSCERATO", "apEX", "sh1ro", "Zero", "NiKo"]);
  const topFivePlayerCount = summary.top10.slice(0, 5).filter((entry) => playerRosterNames.has(entry.name)).length;
  const aiNames = new Set(hooks.aiTeamProfiles.flatMap((team) => team.stars));
  const aiTopFiveCount = summary.top10.slice(0, 5).filter((entry) => aiNames.has(entry.name) && !playerRosterNames.has(entry.name)).length;

  assert.ok(points[0] <= points[1] * 1.45, `年度第一不能断档到第二名近三倍：${JSON.stringify(summary.top10)}`);
  assert.ok(topFivePlayerCount <= 3, `第一年前五不能被玩家队伍垄断：${JSON.stringify(summary.top10)}`);
  assert.ok(aiTopFiveCount >= 1, `第一年前五至少应该有其他队伍明星竞争：${JSON.stringify(summary.top10)}`);
});

test("annual top 10 compresses superstars so one carry cannot dwarf the field", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const campaign = {
    seasonIndex: 1,
    trophies: 0,
    eventHistory: hooks.createEventHistory(),
    textHistory: hooks.createTextHistory(),
    cupRecords: [
      {
        seasonIndex: 1,
        cupName: "IEM Katowice",
        placement: "冠军",
        champion: "Team gun",
        championId: "player-team",
        runnerUp: "Team Spirit",
        mvp: { name: "ZywOo" },
        playerStats: [
          { name: "ZywOo", impact: 128, kills: 88, assists: 10, deaths: 6 },
          { name: "donk", impact: 44, kills: 41, assists: 4, deaths: 14 },
          { name: "ropz", impact: 37, kills: 33, assists: 8, deaths: 12 },
        ],
      },
      {
        seasonIndex: 1,
        cupName: "IEM Cologne",
        placement: "冠军",
        champion: "Team gun",
        championId: "player-team",
        runnerUp: "Team Falcons",
        mvp: { name: "ZywOo" },
        playerStats: [
          { name: "ZywOo", impact: 122, kills: 84, assists: 11, deaths: 7 },
          { name: "NiKo", impact: 43, kills: 40, assists: 5, deaths: 14 },
          { name: "ropz", impact: 35, kills: 31, assists: 9, deaths: 13 },
        ],
      },
      {
        seasonIndex: 1,
        cupName: "CS Major",
        placement: "亚军",
        champion: "Team Spirit",
        championId: "spirit",
        runnerUp: "Team gun",
        mvp: { name: "donk" },
        playerStats: [
          { name: "ZywOo", impact: 116, kills: 80, assists: 9, deaths: 8 },
          { name: "m0NESY", impact: 46, kills: 43, assists: 5, deaths: 14 },
          { name: "ropz", impact: 34, kills: 30, assists: 8, deaths: 13 },
        ],
      },
    ],
  };

  const summary = hooks.createAnnualSummary(campaign);
  const playerNames = new Set(["ZywOo", "donk", "ropz", "NiKo", "m0NESY"]);
  const aiNames = new Set(hooks.aiTeamProfiles.flatMap((team) => team.stars));
  const playerTopFive = summary.top10.slice(0, 5).filter((entry) => playerNames.has(entry.name)).length;
  const aiTopFive = summary.top10.slice(0, 5).filter((entry) => aiNames.has(entry.name) && !playerNames.has(entry.name)).length;

  assert.ok(summary.top10[0].points <= summary.top10[1].points * 1.25, `超巨年度分不能断档：${JSON.stringify(summary.top10)}`);
  assert.ok(playerTopFive <= 3, `玩家队即使双冠也不应前五刷屏：${JSON.stringify(summary.top10)}`);
  assert.ok(aiTopFive >= 1, `其他队伍明星需要持续竞争年度榜：${JSON.stringify(summary.top10)}`);
});

test("event pools include enough negative form debuffs for stars and role players", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const events = [
    ...hooks.betweenCupEventPool,
    ...hooks.offseasonEventPool,
  ];
  const options = events.flatMap((event) => event.options ?? [event]);
  const negativeFormOptions = options.filter((option) => (option.effect?.form ?? 0) < 0 || option.effect?.formStrong < 0);
  const starTargeted = events.filter((event) => event.target === "star" || event.tags?.includes("star-pressure"));
  const roleTargeted = events.filter((event) => event.target === "role" || event.tags?.includes("role-pressure"));
  const visibleText = events.map((event) => `${event.title}\n${event.narrative}\n${event.passive ?? ""}\n${event.result ?? ""}`).join("\n");

  assert.ok(negativeFormOptions.length >= 14, `影响状态的负面选择太少：${negativeFormOptions.length}`);
  assert.ok(starTargeted.length >= 3, "需要有专门影响明星选手的舆论/私生活/被研究事件");
  assert.ok(roleTargeted.length >= 3, "需要有专门影响拼图或角色选手的首发压力事件");
  assert.match(visibleText, /舆论|私生活|手腕|疲劳|首发|商务|训练赛|睡眠|外设/);
});

test("AI teams expose stronger distinct style profiles for season-long opposition", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const profiles = Object.fromEntries(hooks.aiTeamProfiles.map((team) => [team.id, team]));
  const styleNames = new Set(hooks.aiTeamProfiles.map((team) => team.style));

  assert.ok(styleNames.size >= 6, "AI 队伍应该有不同风格，不应只是同一套数值模板");
  assert.ok(profiles.spirit.base.firepower > profiles.vitality.base.firepower, "Spirit 应突出火力冲击");
  assert.ok(profiles.vitality.base.clutch >= profiles.spirit.base.clutch, "Vitality 应突出 ZywOo 式残局兜底");
  assert.ok(profiles.navi.base.tacticalExecution >= profiles.falcons.base.tacticalExecution, "NAVI 应突出体系执行");
  assert.ok(profiles.faze.base.discipline >= 82, "FaZe 应有老将体系和纪律特色");
  assert.match(hooks.buildAiTeamSnapshot("spirit", []).styleNote, /火力|冲击|donk/);
  assert.match(hooks.buildAiTeamSnapshot("vitality", []).styleNote, /残局|稳定|ZywOo/);
});

test("AI teams start below the ceiling and grow across three seasons", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const yearOneVitality = hooks.buildAiTeamSnapshot("vitality", [], { seasonIndex: 1, cupIndex: 0 });
  const yearThreeVitality = hooks.buildAiTeamSnapshot("vitality", [], { seasonIndex: 3, cupIndex: 2 });
  const yearOneSpirit = hooks.buildAiTeamSnapshot("spirit", [], { seasonIndex: 1, cupIndex: 0 });
  const yearThreeSpirit = hooks.buildAiTeamSnapshot("spirit", [], { seasonIndex: 3, cupIndex: 2 });

  for (const team of [yearOneVitality, yearOneSpirit]) {
    assert.ok(team.stats.firepower <= 90, `${team.name} 第一年火力不应开局接近满分`);
    assert.ok(team.stats.tacticalExecution <= 89, `${team.name} 第一年执行不应开局接近满分`);
    assert.ok(team.stats.cohesion <= 88, `${team.name} 第一年配合不应开局接近满分`);
    assert.ok(team.stats.discipline <= 88, `${team.name} 第一年纪律不应开局接近满分`);
  }

  assert.ok(hooks.teamStrength(yearThreeVitality) > hooks.teamStrength(yearOneVitality), "Vitality 三年后整体应成长");
  assert.ok(hooks.teamStrength(yearThreeSpirit) > hooks.teamStrength(yearOneSpirit), "Spirit 三年后整体应成长");
  assert.ok(yearThreeVitality.stats.tacticalExecution - yearOneVitality.stats.tacticalExecution >= 2, "体系队成长应体现在执行");
  assert.ok(yearThreeSpirit.stats.firepower - yearOneSpirit.stats.firepower >= 2, "火力队成长应体现在火力");
});

test("three-year chronicle renders a long condition-specific epilogue", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const championCampaign = {
    selected: ["donk", "ropz", "apex", "b1t", "chopper", "s1ren"],
    cupRecords: [
      { seasonIndex: 1, cupName: "IEM Katowice", placement: "冠军", champion: "Team gun", mvp: { name: "donk" }, encouragement: "第一冠。" },
      { seasonIndex: 1, cupName: "IEM Cologne", placement: "亚军", champion: "Team Vitality", mvp: { name: "ZywOo" }, encouragement: "差一步。" },
      { seasonIndex: 1, cupName: "CS Major", placement: "冠军", champion: "Team gun", mvp: { name: "ropz" }, encouragement: "Major 捧杯。" },
    ],
    seasonRecords: [],
    textHistory: hooks.createTextHistory(),
  };
  const hardRoadCampaign = {
    selected: championCampaign.selected,
    cupRecords: championCampaign.cupRecords.map((record) => ({
      ...record,
      placement: "八强",
      champion: "Team Vitality",
      mvp: { name: "ZywOo" },
      encouragement: "早早出局。",
    })),
    seasonRecords: [],
    textHistory: hooks.createTextHistory(),
  };

  const crowned = hooks.createChronicle(championCampaign);
  const hardRoad = hooks.createChronicle(hardRoadCampaign);

  assert.doesNotMatch(crowned.epilogueTitle, /王朝/);
  assert.match(crowned.epilogueTitle, /加冕|奖杯|强队/);
  assert.match(crowned.epilogue, /奖杯|冠军|捧杯|统治/);
  assert.ok(crowned.epilogue.length > 300);
  assert.match(hardRoad.epilogueTitle, /遗憾|磨砺|征途|坚韧/);
  assert.match(hardRoad.epilogue, /没有奖杯|八强|输|训练室|下一场大赛|不完整/);
  assert.notEqual(crowned.epilogueTitle, hardRoad.epilogueTitle);
});

test("chronicle only calls a run a dynasty when it shows real domination", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const almostDynasty = {
    selected: ["donk", "ropz", "apex", "b1t", "chopper", "s1ren"],
    cupRecords: [
      { seasonIndex: 1, cupIndex: 0, cupName: "IEM Katowice", placement: "冠军", champion: "Team gun", mvp: { name: "donk" }, encouragement: "第一冠。" },
      { seasonIndex: 1, cupIndex: 1, cupName: "IEM Cologne", placement: "八强", champion: "Team Vitality", mvp: { name: "ZywOo" }, encouragement: "低谷。" },
      { seasonIndex: 1, cupIndex: 2, cupName: "CS Major", placement: "冠军", champion: "Team gun", mvp: { name: "ropz" }, encouragement: "Major 冠军。" },
    ],
    seasonRecords: [],
    textHistory: hooks.createTextHistory(),
  };
  const dynasty = {
    ...almostDynasty,
    cupRecords: [
      ...almostDynasty.cupRecords,
      { seasonIndex: 2, cupIndex: 0, cupName: "IEM Katowice", placement: "亚军", champion: "Team Spirit", mvp: { name: "donk" }, encouragement: "决赛席。" },
      { seasonIndex: 2, cupIndex: 1, cupName: "IEM Cologne", placement: "冠军", champion: "Team gun", mvp: { name: "b1t" }, encouragement: "再冠。" },
      { seasonIndex: 2, cupIndex: 2, cupName: "CS Major", placement: "亚军", champion: "Team Vitality", mvp: { name: "ZywOo" }, encouragement: "Major 亚军。" },
      { seasonIndex: 3, cupIndex: 0, cupName: "IEM Katowice", placement: "四强", champion: "MOUZ", mvp: { name: "xertioN" }, encouragement: "四强。" },
      { seasonIndex: 3, cupIndex: 1, cupName: "IEM Cologne", placement: "冠军", champion: "Team gun", mvp: { name: "ropz" }, encouragement: "第四冠。" },
      { seasonIndex: 3, cupIndex: 2, cupName: "CS Major", placement: "冠军", champion: "Team gun", mvp: { name: "donk" }, encouragement: "Major 再冠。" },
    ],
  };

  const almost = hooks.createChronicle(almostDynasty);
  const real = hooks.createChronicle(dynasty);

  assert.doesNotMatch(`${almost.epilogueTitle}\n${almost.epilogue}`, /王朝/);
  assert.match(`${real.epilogueTitle}\n${real.epilogue}`, /王朝|统治/);
});

test("chronicle epilogue library has broad non-repeating endings and reserves dynasty wording for dominance", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const grouped = hooks.chronicleEpiloguePool.reduce((acc, entry) => {
    acc[entry.tier] = [...(acc[entry.tier] ?? []), entry];
    return acc;
  }, {});

  for (const tier of ["legendary", "crowned", "contender", "grinder", "heartbreak"]) {
    assert.ok((grouped[tier] ?? []).length >= 9, `${tier} 三年结语至少需要 9 种表达`);
  }

  const nonDynastyText = ["crowned", "contender", "grinder", "heartbreak"]
    .flatMap((tier) => grouped[tier] ?? [])
    .map((entry) => `${entry.title}\n${entry.text}`)
    .join("\n");
  assert.doesNotMatch(nonDynastyText, /王朝/);
});

test("three-year chronicle can mention remembered star highlight moments", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const campaign = {
    selected: ["donk", "monesy", "magisk", "apex", "ropz", "s1ren"],
    cupRecords: [
      {
        seasonIndex: 1,
        cupName: "IEM Katowice",
        placement: "冠军",
        champion: "Team gun",
        mvp: { name: "donk" },
        encouragement: "第一冠。",
        highlightMoment: "donk 在 A 点扫射转移接住三人，m0NESY 随后瞬间甩狙补掉回防。",
      },
      { seasonIndex: 1, cupName: "IEM Cologne", placement: "四强", champion: "Team Vitality", mvp: { name: "ZywOo" }, encouragement: "差一步。" },
      { seasonIndex: 1, cupName: "CS Major", placement: "亚军", champion: "Team Spirit", mvp: { name: "sh1ro" }, encouragement: "Major 差一口气。" },
    ],
    seasonRecords: [],
    textHistory: hooks.createTextHistory(),
  };

  const chronicle = hooks.createChronicle(campaign);
  assert.match(chronicle.highlightMoment, /donk|m0NESY|扫射转移|甩狙/);
  const html = globalThis.__renderBrowserForTest({ screen: "chronicle", campaign, chronicle });
  assert.match(html, /三年名场面/);
  assert.match(html, /扫射转移|甩狙/);
});

test("three-year chronicle renders multiple year-labeled moments and explains the defining cup", () => {
  const hooks = globalThis.__browserGameTestHooks;
  const campaign = {
    selected: ["donk", "monesy", "magisk", "apex", "ropz", "s1ren"],
    cupRecords: [
      {
        seasonIndex: 1,
        cupIndex: 0,
        cupName: "IEM Katowice",
        placement: "八强",
        champion: "Team Vitality",
        mvp: { name: "ZywOo" },
        encouragement: "第一站被强队上课。",
        highlightMoment: "donk 在 B 区扫射转移接住三人，保住了最后一点悬念。",
      },
      {
        seasonIndex: 2,
        cupIndex: 1,
        cupName: "IEM Cologne",
        placement: "亚军",
        champion: "Team Spirit",
        mvp: { name: "donk" },
        encouragement: "差一步进冠军。",
        highlightMoment: "m0NESY 在中路瞬间甩狙打穿回防，场馆声浪突然抬了起来。",
      },
      {
        seasonIndex: 3,
        cupIndex: 2,
        cupName: "CS Major",
        placement: "冠军",
        champion: "Team gun",
        mvp: { name: "ropz" },
        encouragement: "终于把奖杯举起来。",
        highlightMoment: "ropz 残局假拆骗出两名回防，Team gun 把 Major 决赛拖进自己的节奏。",
      },
    ],
    seasonRecords: [],
    textHistory: hooks.createTextHistory(),
  };

  const chronicle = hooks.createChronicle(campaign);
  assert.ok(chronicle.highlightMoments.length >= 2);
  assert.ok(chronicle.highlightMoments.length <= 3);
  assert.match(chronicle.highlightMoments.map((moment) => moment.label).join("\n"), /S1 \/ 2027/);
  assert.match(chronicle.highlightMoments.map((moment) => moment.label).join("\n"), /S2 \/ 2028|S3 \/ 2029/);
  assert.match(chronicle.definingCupWhy.text, /王朝|第一座奖杯|首次突破|绝地翻盘|宿敌|磨砺|关键|定义/);

  const html = globalThis.__renderBrowserForTest({ screen: "chronicle", campaign, chronicle });
  assert.match(html, /S1 \/ 2027/);
  assert.match(html, /S2 \/ 2028|S3 \/ 2029/);
  assert.match(html, /为什么关键|关键意义/);
  assert.match(html, /被记住的两三个瞬间/);
  assert.match(html, /绝地翻盘|王朝|第一座奖杯|首次突破|宿敌|磨砺|关键|定义/);
});
