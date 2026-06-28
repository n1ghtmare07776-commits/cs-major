type TeamAccent = {
  name: string;
  shortName: string;
  color: string;
};

type DraftPlayer = {
  id: string;
  name: string;
  team: TeamAccent;
  firepower: number;
  tactics: number;
  price: number;
  traits: string[];
  selected?: boolean;
};

type BracketTeam = TeamAccent & {
  score?: number;
  eliminated?: boolean;
  isPlayer?: boolean;
};

type BracketMatch = {
  id: string;
  teams: [BracketTeam, BracketTeam];
};

type MatchEvent = {
  id: string;
  label: string;
  tone: "neutral" | "positive" | "negative" | "decision";
  body: string;
  delta: string;
  choices?: Array<{ label: string; hint: string; tone: "positive" | "neutral" | "danger" }>;
  result?: string;
};

type AwardStanding = {
  place: string;
  team: TeamAccent;
  prize: string;
  isPlayer?: boolean;
};

type DemoState = {
  teams: Record<string, TeamAccent>;
  draft: {
    budget: number;
    players: DraftPlayer[];
    selectedIds: string[];
  };
  bracket: {
    cupName: string;
    stage: string;
    quarterfinals: BracketMatch[];
    semifinals: BracketMatch[];
    final: BracketMatch;
    champion: TeamAccent;
    nextOpponent: TeamAccent;
  };
  match: {
    playerTeam: TeamAccent;
    opponent: TeamAccent;
    score: [number, number];
    round: number;
    timeoutAvailable: boolean;
    events: MatchEvent[];
    stats: Array<{ label: string; value: number }>;
  };
  awards: {
    cupName: string;
    champion: TeamAccent;
    mvp: { name: string; team: TeamAccent; summary: string; isPlayerTeam: boolean };
    standings: AwardStanding[];
    prizePool: string;
    playerPrize: string;
    nextLabel: string;
  };
};

export function createDemoState(): DemoState {
  const teams = {
    player: { name: "枪神队伍", shortName: "枪神", color: "#3E6FFF" },
    vitality: { name: "Team Vitality", shortName: "VIT", color: "#F5D800" },
    spirit: { name: "Team Spirit", shortName: "SPI", color: "#00B37A" },
    falcons: { name: "Team Falcons", shortName: "FLC", color: "#00BFFF" },
    faze: { name: "FaZe Clan", shortName: "FAZE", color: "#FF4500" },
    furia: { name: "FURIA Esports", shortName: "FUR", color: "#FF6B00" },
    navi: { name: "Natus Vincere", shortName: "NAVI", color: "#FFD700" },
    mouz: { name: "MOUZ", shortName: "MOUZ", color: "#FF2244" },
    mongolz: { name: "The MongolZ", shortName: "MGLZ", color: "#4682B4" },
  };

  return {
    teams,
    draft: {
      budget: 100,
      selectedIds: ["zywoo", "ropz", "donk", "siuhy"],
      players: [
        player("zywoo", "ZywOo", teams.vitality, 98, 88, 30, ["clutch", "AWP anchor"], true),
        player("donk", "donk", teams.spirit, 99, 76, 28, ["hot_blooded", "entry"], true),
        player("ropz", "ropz", teams.faze, 91, 90, 22, ["lurker", "discipline"], true),
        player("siuhy", "siuhy", teams.mouz, 79, 96, 18, ["IGL", "structure"], true),
        player("m0NESY", "m0NESY", teams.falcons, 96, 81, 27, ["flash form", "AWP"]),
        player("KSCERATO", "KSCERATO", teams.furia, 88, 82, 17, ["anchor", "calm"]),
        player("b1t", "b1t", teams.navi, 86, 84, 16, ["rifle", "spacing"]),
        player("910", "910", teams.mongolz, 83, 78, 12, ["tempo", "clutch"]),
      ],
    },
    bracket: {
      cupName: "IEM KATOWICE 2027",
      stage: "四强赛 SEMIFINAL",
      quarterfinals: [
        match("q1", [bracketTeam(teams.player, 2, false, true), bracketTeam(teams.vitality, 1, true)]),
        match("q2", [bracketTeam(teams.spirit, 2, false), bracketTeam(teams.mongolz, 0, true)]),
        match("q3", [bracketTeam(teams.faze, 2, false), bracketTeam(teams.furia, 1, true)]),
        match("q4", [bracketTeam(teams.navi, 0, true), bracketTeam(teams.mouz, 2, false)]),
      ],
      semifinals: [
        match("s1", [bracketTeam(teams.player, undefined, false, true), bracketTeam(teams.spirit)]),
        match("s2", [bracketTeam(teams.faze), bracketTeam(teams.mouz)]),
      ],
      final: match("f1", [bracketTeam(teams.player), bracketTeam(teams.mouz)]),
      champion: teams.player,
      nextOpponent: teams.spirit,
    },
    match: {
      playerTeam: teams.player,
      opponent: teams.spirit,
      score: [1, 2],
      round: 4,
      timeoutAvailable: true,
      events: [
        event("e1", "ROUND 1 · OPENING", "neutral", "你选择半买后慢控中路，队伍保住了两把长枪，但包点交换偏慢。", "经济 +2  ·  战术执行 -1"),
        event("e2", "ROUND 2 · PRESSURE", "negative", "donk 连续抢下首杀，枪神队伍被迫提前交出烟雾。", "士气 -3  ·  装备质量 -4"),
        {
          id: "e3",
          label: "ROUND 3 · MANAGER CALL",
          tone: "decision",
          body: "对手开始重压香蕉道。你需要决定是否继续默认控图，还是用一波假打拉开防线。",
          delta: "等待决策",
          choices: [
            { label: "假打 A 后转 B", hint: "战术执行 +4 / 风险中", tone: "positive" },
            { label: "默认慢控", hint: "纪律 +2 / 节奏慢", tone: "neutral" },
            { label: "让明星强行开路", hint: "火力 +6 / 士气风险", tone: "danger" },
          ],
          result: "你让 ZywOo 先压住警家视野，再用假动作骗出 Spirit 的双人回防。B 点只剩单人，ropz 收下残局。",
        },
        event("e4", "ROUND 4 · ADJUSTMENT", "positive", "暂停后队伍重新分配道具，siuhy 的二层默认让对手第一时间读错方向。", "团队配合 +4  ·  战术执行 +2"),
      ],
      stats: [
        { label: "FIREPOWER 火力", value: 91 },
        { label: "TACTICS 战术执行", value: 84 },
        { label: "COHESION 凝聚力", value: 76 },
        { label: "DISCIPLINE 纪律", value: 81 },
      ],
    },
    awards: {
      cupName: "IEM KATOWICE 2027",
      champion: teams.player,
      mvp: {
        name: "ZywOo",
        team: teams.player,
        summary: "5 MVP Events · avg impact rating 94 · 3 clutch rounds won",
        isPlayerTeam: true,
      },
      standings: [
        standing("1st", teams.player, "$250,000", true),
        standing("2nd", teams.spirit, "$120,000"),
        standing("3rd", teams.faze, "$65,000"),
        standing("3rd", teams.mouz, "$65,000"),
        standing("5th", teams.vitality, "$30,000"),
        standing("5th", teams.furia, "$30,000"),
        standing("5th", teams.navi, "$30,000"),
        standing("5th", teams.mongolz, "$30,000"),
      ],
      prizePool: "$620,000",
      playerPrize: "$250,000",
      nextLabel: "进入转会窗口",
    },
  };
}

export function renderAppShell(root: HTMLElement, state: DemoState): void {
  let activeScreen = "draft";

  const render = () => {
    root.innerHTML = `
      <main class="manager-shell">
        <nav class="top-nav" aria-label="Screens">
          <div>
            <p class="eyebrow">CS CUP MANAGER · V0.1 UI SHELL</p>
            <h1>枪神队伍控制台</h1>
          </div>
          <div class="screen-tabs">
            ${tabButton("draft", "征召室", activeScreen)}
            ${tabButton("bracket", "杯赛支架", activeScreen)}
            ${tabButton("match", "比赛室", activeScreen)}
            ${tabButton("awards", "杯赛颁奖", activeScreen)}
          </div>
        </nav>
        <section class="screen-frame">${renderScreen(activeScreen, state)}</section>
      </main>
    `;

    root.querySelectorAll<HTMLButtonElement>("[data-screen]").forEach((button) => {
      button.addEventListener("click", () => {
        activeScreen = button.dataset.screen ?? activeScreen;
        render();
      });
    });
  };

  render();
}

function renderScreen(screen: string, state: DemoState): string {
  if (screen === "bracket") return renderBracketScreen(state.bracket);
  if (screen === "match") return renderMatchRoom(state.match);
  if (screen === "awards") return renderCupAwards(state.awards);
  return renderDraftRoom(state.draft);
}

function renderDraftRoom(draft: DemoState["draft"]): string {
  const spent = draft.players.filter((item) => item.selected).reduce((sum, item) => sum + item.price, 0);
  const remaining = draft.budget - spent;
  const selected = draft.players.filter((item) => item.selected);
  const isValid = selected.length >= 5 && remaining >= 0;

  return `
    <article class="draft-layout">
      <section class="panel player-pool">
        <header class="panel-header">
          <div>
            <p class="eyebrow">01 / DRAFT</p>
            <h2>征召室</h2>
          </div>
          <span class="meta-chip">可选球员 ${draft.players.length}</span>
        </header>
        <div class="player-table" role="table" aria-label="Player draft table">
          <div class="player-row table-head" role="row">
            <span>PLAYER</span><span>FIRE</span><span>TACTICS</span><span>PRICE</span><span>TRAITS</span>
          </div>
          ${draft.players.map(renderPlayerRow).join("")}
        </div>
      </section>
      <aside class="panel draft-sidebar">
        <section class="budget-box">
          <span class="eyebrow">预算 / BUDGET</span>
          <strong class="budget-value">$${remaining}M</strong>
          <div class="meter"><span style="width: ${clamp((remaining / draft.budget) * 100, 0, 100)}%"></span></div>
          <p>已投入 $${spent}M / 总预算 $${draft.budget}M</p>
        </section>
        <section class="slot-list" aria-label="Selected roster slots">
          ${Array.from({ length: 6 }, (_, index) => renderRosterSlot(index, selected[index])).join("")}
        </section>
        <button class="primary-action" ${isValid ? "" : "disabled"}>确认阵容 / CONFIRM ROSTER</button>
      </aside>
    </article>
  `;
}

function renderBracketScreen(bracket: DemoState["bracket"]): string {
  // ── Layout coordinates (viewport‑percentage system) ──
  const qfY = [10, 31, 52, 73]; // 4 quarterfinal match centers
  const sfY = [20.5, 62.5];     // 2 semifinal match centers
  const finY = 41.5;             // final match center
  const champY = 41.5;           // champion card center
  const matchW = 21;             // match‑card width %
  const qfL = 2;                // QF left edge
  const sfL = 27;               // SF left edge
  const finL = 52;              // Final left edge
  const champL = 78;            // Champion left edge
  const qfR = qfL + matchW;     // 23
  const sfR = sfL + matchW;     // 48
  const finR = finL + matchW;   // 73
  const mid1 = (qfR + sfL) / 2; // ≈ 25
  const mid2 = (sfR + finL) / 2; // ≈ 50

  const lines = [
    // QF → SF
    `M${qfR},${qfY[0]} h2 V${sfY[0]} H${sfL}`,
    `M${qfR},${qfY[1]} h2 V${sfY[0]} H${sfL}`,
    `M${qfR},${qfY[2]} h2 V${sfY[1]} H${sfL}`,
    `M${qfR},${qfY[3]} h2 V${sfY[1]} H${sfL}`,
    // SF → Final
    `M${sfR},${sfY[0]} h2 V${finY} H${finL}`,
    `M${sfR},${sfY[1]} h2 V${finY} H${finL}`,
    // Final → Champion
    `M${finR},${finY} H${champL - 1.5}`,
    // Accent dashed line for advancing teams (styled via CSS class)
  ];

  const strokeDefault = `fill="none" stroke="currentColor" stroke-width="0.3" vector-effect="non-scaling-stroke"`;
  const strokeAccent = `fill="none" stroke="currentColor" stroke-width="0.55" vector-effect="non-scaling-stroke" opacity="0.55"`;

  // Build advancing-path highlight (player‑team trace)
  const advLines: string[] = [];
  // Find which QF slots the player is in, trace → SF → Final
  for (let i = 0; i < bracket.quarterfinals.length; i++) {
    const m = bracket.quarterfinals[i];
    if (m.teams.some(t => t.isPlayer && !t.eliminated)) {
      const si = i < 2 ? 0 : 1;
      advLines.push(`M${qfR},${qfY[i]} h2 V${sfY[si]} H${sfL}`);
    }
  }
  for (let i = 0; i < bracket.semifinals.length; i++) {
    const m = bracket.semifinals[i];
    if (m.teams.some(t => t.isPlayer && !t.eliminated)) {
      advLines.push(`M${sfR},${sfY[i]} h2 V${finY} H${finL}`);
    }
  }
  if (bracket.final.teams.some(t => t.isPlayer && !t.eliminated)) {
    advLines.push(`M${finR},${finY} H${champL - 1.5}`);
  }

  return `
    <article class="bracket-screen">
      <header class="screen-heading">
        <div>
          <p class="eyebrow">${bracket.stage}</p>
          <h2>${bracket.cupName}</h2>
        </div>
        <div class="stage-tabs">
          <span>八强赛 QUARTERFINAL</span>
          <span class="active">四强赛 SEMIFINAL</span>
          <span>决赛 FINAL</span>
        </div>
      </header>
      <section class="bracket-board" aria-label="Eight-team single-elimination bracket tree">
        <svg class="bracket-tree-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          <g class="bracket-line-normal">${lines.map(d => `<path d="${d}" ${strokeDefault} />`).join("")}</g>
          <g class="bracket-line-player">${advLines.map(d => `<path d="${d}" ${strokeAccent} />`).join("")}</g>
        </svg>

        ${bracket.quarterfinals.map((m, i) => renderPosMatch(m, qfL, qfY[i], matchW, "Quarterfinal")).join("")}
        ${bracket.semifinals.map((m, i) => renderPosMatch(m, sfL, sfY[i], matchW, "Semifinal")).join("")}
        ${renderPosMatch(bracket.final, finL, finY, matchW, "Final")}

        <div class="bracket-champion" style="--team-color: ${bracket.champion.color}; top: ${champY}%; left: ${champL}%">
          <span class="champ-badge">🏆</span>
          <span class="champ-name">${bracket.champion.name}</span>
        </div>
      </section>
      <footer class="next-match-bar" style="--team-color: ${bracket.nextOpponent.color}">
        <div>
          <span class="next-opponent-icon">⚔</span>
          <span class="eyebrow">下一场对手 / NEXT MATCH</span>
          <strong>vs ${bracket.nextOpponent.name}</strong>
        </div>
        <button class="primary-action">准备开始 / START MATCH</button>
      </footer>
    </article>
  `;
}

/** Positioned match card — absolute within bracket‑board */
function renderPosMatch(m: BracketMatch, leftPct: number, topPct: number, widthPct: number, label: string): string {
  const hasPlayer = m.teams.some(t => t.isPlayer);
  const completed = m.teams.every(t => typeof t.score === "number");
  return `
    <div class="bracket-node ${hasPlayer ? "has-player" : ""} ${completed ? "completed" : ""}" style="top: ${topPct}%; left: ${leftPct}%; width: ${widthPct}%">
      <span class="node-label">${label}</span>
      ${m.teams.map(renderBracketTeamRow).join("")}
      ${completed ? "" : '<span class="node-status">vs</span>'}
    </div>
  `;
}

function renderBracketTeamRow(team: BracketTeam): string {
  const score = typeof team.score === "number" ? team.score : "—";
  return `
    <div class="bracket-team-row ${team.eliminated ? "eliminated" : ""} ${team.isPlayer ? "is-player" : ""}" style="--team-color: ${team.color}">
      <span class="team-chip" style="background: ${team.color}"></span>
      <span class="team-name">${team.name}</span>
      <span class="team-score">${score}</span>
    </div>
  `;
}

function renderMatchRoom(matchState: DemoState["match"]): string {
  return `
    <article class="match-room">
      <header class="score-bar">
        <div class="team-score player-team" style="--team-color: ${matchState.playerTeam.color}">${matchState.playerTeam.name}</div>
        <div class="score-core">
          <strong>${matchState.score[0]} - ${matchState.score[1]}</strong>
          <div class="round-dots">${Array.from({ length: 5 }, (_, index) => `<span class="${index < matchState.round - 1 ? "filled" : index === matchState.round - 1 ? "active" : ""}"></span>`).join("")}</div>
        </div>
        <div class="team-score opponent" style="--team-color: ${matchState.opponent.color}">VS ${matchState.opponent.name}</div>
        <button class="timeout-button ${matchState.timeoutAvailable ? "" : "spent"}">${matchState.timeoutAvailable ? "暂停 / TIMEOUT" : "暂停已用"}</button>
      </header>
      <section class="match-grid">
        <div class="event-log">${matchState.events.map(renderEventCard).join("")}</div>
        <aside class="stats-panel">
          ${matchState.stats.map((stat) => `
            <div class="stat-readout">
              <span>${stat.label}</span>
              <strong>${stat.value}</strong>
              <div class="meter"><span style="width: ${stat.value}%"></span></div>
            </div>
          `).join("")}
        </aside>
      </section>
      <footer class="decision-panel">
        <button>全买 / FULL BUY<span>装备质量 +8</span></button>
        <button>半买 / PARTIAL BUY<span>保留经济</span></button>
        <button>省钱 / ECO<span>下局资金 +10</span></button>
      </footer>
    </article>
  `;
}

function renderCupAwards(awards: DemoState["awards"]): string {
  return `
    <article class="awards-screen">
      <section class="champion-banner" style="--team-color: ${awards.champion.color}">
        <span class="eyebrow">CHAMPION · 冠军</span>
        <h2><span class="team-dot" style="background: ${awards.champion.color}"></span>${awards.champion.name}</h2>
        <p>🏆 ${awards.cupName} · 第 1 冠 / FIRST TITLE</p>
      </section>
      <section class="mvp-card ${awards.mvp.isPlayerTeam ? "spark" : ""}">
        <span>★ 杯赛 MVP · TOURNAMENT MVP ★</span>
        <h3><i style="background: ${awards.mvp.team.color}"></i>${awards.mvp.name}</h3>
        <p>${awards.mvp.team.name} · ${awards.mvp.summary}</p>
        <small>跨全部 8 支战队评选 / Voted across all 8 teams</small>
      </section>
      <section class="standings-table" aria-label="Final standings and prizes">
        <div class="standing-row table-head"><span>名次 / PLACE</span><span>队伍 / TEAM</span><span>奖金 / PRIZE</span></div>
        ${awards.standings.map(renderStandingRow).join("")}
      </section>
      <footer class="prize-summary">
        <span>总奖金池: ${awards.prizePool}</span>
        <strong>枪神队伍获得: ${awards.playerPrize}</strong>
        <button class="primary-action">继续 / CONTINUE · ${awards.nextLabel}</button>
      </footer>
    </article>
  `;
}

function renderPlayerRow(player: DraftPlayer): string {
  return `
    <button class="player-row ${player.selected ? "selected" : ""}" style="--team-color: ${player.team.color}" type="button">
      <span class="player-name"><i></i><strong>${player.name}</strong><small>${player.team.shortName}</small></span>
      ${statBar(player.firepower)}
      ${statBar(player.tactics)}
      <span class="price-tag">$${player.price}M</span>
      <span class="trait-list">${player.traits.map((trait) => `<em>${trait}</em>`).join("")}</span>
    </button>
  `;
}

function renderRosterSlot(index: number, player?: DraftPlayer): string {
  const label = index < 5 ? `首发 ${index + 1}` : "替补";
  if (!player) {
    return `<div class="roster-slot empty"><span>${label}</span><strong>+</strong></div>`;
  }

  return `
    <div class="roster-slot filled" style="--team-color: ${player.team.color}">
      <span>${label}</span>
      <strong>${player.name}</strong>
      <button aria-label="Remove ${player.name}">x</button>
    </div>
  `;
}

function renderEventCard(item: MatchEvent): string {
  return `
    <article class="event-card ${item.tone}">
      <span class="eyebrow">${item.label}</span>
      <p>${item.body}</p>
      ${item.choices ? `<div class="choice-stack">${item.choices.map((choice) => `<button class="${choice.tone}"><span>${choice.label}</span><small>${choice.hint}</small></button>`).join("")}</div>` : ""}
      ${item.result ? `<p class="resolution">${item.result}</p>` : ""}
      <footer>${item.delta}</footer>
    </article>
  `;
}

function renderStandingRow(item: AwardStanding): string {
  const rankClass = item.place === "1st" ? "gold" : item.place === "2nd" ? "silver" : item.place === "3rd" ? "bronze" : "";
  return `
    <div class="standing-row ${rankClass} ${item.isPlayer ? "is-player" : ""}" style="--team-color: ${item.team.color}">
      <span>${item.place}</span>
      <span><i style="background: ${item.team.color}"></i>${item.team.name}</span>
      <strong>${item.prize}</strong>
    </div>
  `;
}

function tabButton(id: string, label: string, activeScreen: string): string {
  return `<button class="${activeScreen === id ? "active" : ""}" data-screen="${id}" type="button">${label}</button>`;
}

function statBar(value: number): string {
  return `<span class="stat-bar" title="${value}"><i style="width: ${value}%"></i></span>`;
}

function player(id: string, name: string, team: TeamAccent, firepower: number, tactics: number, price: number, traits: string[], selected = false): DraftPlayer {
  return { id, name, team, firepower, tactics, price, traits, selected };
}

function bracketTeam(team: TeamAccent, score?: number, eliminated = false, isPlayer = false): BracketTeam {
  return { ...team, score, eliminated, isPlayer };
}

function match(id: string, teams: [BracketTeam, BracketTeam]): BracketMatch {
  return { id, teams };
}

function event(id: string, label: string, tone: MatchEvent["tone"], body: string, delta: string): MatchEvent {
  return { id, label, tone, body, delta };
}

function standing(place: string, team: TeamAccent, prize: string, isPlayer = false): AwardStanding {
  return { place, team, prize, isPlayer };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
