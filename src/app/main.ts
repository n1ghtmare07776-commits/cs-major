import { STARTING_BUDGET, playerPool, traitDefinitions } from "../content/index.ts";
import type { PlayerContent } from "../content/index.ts";
import { confirmRoster, getSelectedPrice, initialState, playCup, setSubstitute, togglePlayer, type GameState } from "./game.ts";
import "../ui/styles.css";

let state: GameState = initialState;

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app root.");

function bar(value: number): string {
  return `<span class="bar"><span style="width:${value}%"></span></span>`;
}

function playerRow(player: PlayerContent): string {
  const selected = state.selectedIds.includes(player.id);
  const disabled = !selected && state.selectedIds.length >= 6;
  return `
    <button class="player-row ${selected ? "selected" : ""}" data-action="toggle" data-player="${player.id}" ${disabled ? "disabled" : ""}>
      <span class="team-dot team-${player.teamId}"></span>
      <span class="player-main">
        <strong>${player.name}</strong>
        <small>${player.teamId.toUpperCase()} · ${player.role}</small>
      </span>
      <span class="stat-pair">${bar(player.firepower)}${bar(player.tactics)}</span>
      <span class="price">$${player.price}</span>
      <span class="traits">${player.traits.map((trait) => `<em>${traitDefinitions[trait].label}</em>`).join("")}</span>
    </button>
  `;
}

function draftScreen(): string {
  const spent = getSelectedPrice(state);
  const remaining = STARTING_BUDGET - spent;
  const valid = state.selectedIds.length === 6 && remaining >= 0;
  return `
    <section class="screen draft">
      <header class="topbar">
        <div>
          <p class="eyebrow">01 / DRAFT ROOM</p>
          <h1>枪神队伍 · 征召室</h1>
        </div>
        <button class="ghost" data-action="autofill">推荐阵容</button>
      </header>
      <main class="draft-grid">
        <section class="panel player-list">
          <div class="panel-title"><span>选手池</span><span>火力 / 战术 / 身价</span></div>
          ${playerPool.map(playerRow).join("")}
        </section>
        <aside class="panel roster-panel">
          <div class="budget ${remaining < 0 ? "bad" : ""}">
            <span>预算</span>
            <strong>${remaining}</strong>
            <div><span style="width:${Math.max(0, Math.min(100, (remaining / STARTING_BUDGET) * 100))}%"></span></div>
          </div>
          <div class="slots">
            ${Array.from({ length: 6 }).map((_, index) => {
              const id = state.selectedIds[index];
              const player = playerPool.find((entry) => entry.id === id);
              return `
                <button class="slot ${player ? "filled" : ""} ${state.substituteId === id ? "substitute" : ""}" ${player ? `data-action="substitute" data-player="${player.id}"` : ""}>
                  <small>${index < 5 ? `首发 ${index + 1}` : "替补"}</small>
                  <strong>${player?.name ?? "+"}</strong>
                  <span>${player ? `$${player.price}` : "选择选手"}</span>
                </button>
              `;
            }).join("")}
          </div>
          ${state.error ? `<p class="error">${state.error}</p>` : ""}
          <button class="primary" data-action="confirm" ${valid ? "" : "disabled"}>确认阵容</button>
        </aside>
      </main>
    </section>
  `;
}

function bracketScreen(): string {
  const teams = [state.playerTeam!, ...state.aiTeams];
  return `
    <section class="screen">
      <header class="topbar">
        <div>
          <p class="eyebrow">IEM KATOWICE 2027</p>
          <h1>杯赛支架</h1>
        </div>
        <button class="primary" data-action="play">开始杯赛</button>
      </header>
      <main class="bracket panel">
        ${teams.map((team, index) => `
          <div class="team-card ${team.id === "player-team" ? "player-team" : ""}">
            <span class="seed">#${index + 1}</span>
            <strong>${team.name}</strong>
            <small>火力 ${team.stats.firepower} · 执行 ${team.stats.tacticalExecution} · 配合 ${team.stats.cohesion} · 纪律 ${team.stats.discipline}</small>
          </div>
        `).join("")}
      </main>
    </section>
  `;
}

function awardsScreen(): string {
  const result = state.cupResult!;
  const playerMatch = result.rounds.flat().find((match) => match.teamA === "player-team" || match.teamB === "player-team");
  return `
    <section class="screen awards-screen">
      <header class="topbar">
        <div>
          <p class="eyebrow">CUP COMPLETE</p>
          <h1>${result.cupName} 颁奖</h1>
        </div>
        <button class="ghost" data-action="restart">重新开始</button>
      </header>
      <main class="awards-grid">
        <section class="panel trophy">
          <p>冠军</p>
          <h2>${result.champion.name}</h2>
          <p>${result.headline}</p>
        </section>
        <section class="panel mvp">
          <p>杯赛 MVP</p>
          <h2>${result.cupMvp.playerName}</h2>
          <p>${result.cupMvp.reason}</p>
          <strong>Rating ${result.cupMvp.rating}</strong>
        </section>
        <section class="panel match-log">
          <div class="panel-title"><span>枪神队伍首场比赛事件</span><span>${result.playerPlacement}</span></div>
          ${(playerMatch?.eventCards ?? []).map((card) => `
            <article class="event-card">
              <h3>${card.title}</h3>
              <p>${card.text}</p>
              ${card.decision ? `<div class="decision">${card.decision.prompt}: ${card.decision.choice}</div>` : ""}
              <footer>${card.delta}</footer>
            </article>
          `).join("")}
        </section>
      </main>
    </section>
  `;
}

function render(): void {
  if (state.cupResult) app!.innerHTML = awardsScreen();
  else if (state.playerTeam) app!.innerHTML = bracketScreen();
  else app!.innerHTML = draftScreen();
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const playerId = target.dataset.player;
  if (action === "toggle" && playerId) state = togglePlayer(state, playerId);
  if (action === "substitute" && playerId) state = setSubstitute(state, playerId);
  if (action === "confirm") state = confirmRoster(state);
  if (action === "play") state = playCup(state);
  if (action === "restart") state = initialState;
  if (action === "autofill") {
    state = { ...state, selectedIds: ["donk", "zywoo", "ropz", "apex", "b1t", "jimpphat"], substituteId: "jimpphat" };
  }
  render();
});

render();

