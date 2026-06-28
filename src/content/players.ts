import type { TraitId } from "./traits.ts";

export type TeamId =
  | "spirit"
  | "vitality"
  | "falcons"
  | "mouz"
  | "faze"
  | "furia"
  | "navi"
  | "mongolz";

export type PlayerRole = "awp" | "rifler" | "entry" | "igl" | "support" | "lurker";

export interface PlayerContent {
  id: string;
  name: string;
  teamId: TeamId;
  role: PlayerRole;
  firepower: number;
  tactics: number;
  discipline: number;
  clutch: number;
  salaryLevel: number;
  price: number;
  personality: number;
  traits: TraitId[];
  sourceNote: string;
}

const snapshotDate = "2026-06-25";

function player(definition: Omit<PlayerContent, "sourceNote">): PlayerContent {
  return {
    ...definition,
    sourceNote: `Inspired by pro snapshot ${snapshotDate}; ratings are game-owned.`,
  };
}

export const playerPool: PlayerContent[] = [
  player({ id: "donk", name: "donk", teamId: "spirit", role: "entry", firepower: 93, tactics: 73, discipline: 64, clutch: 78, salaryLevel: 5, price: 29, personality: 48, traits: ["hot_blooded", "streaky_star"] }),
  player({ id: "sh1ro", name: "sh1ro", teamId: "spirit", role: "awp", firepower: 84, tactics: 79, discipline: 84, clutch: 87, salaryLevel: 5, price: 23, personality: 76, traits: ["calm_clutcher", "disciplined"] }),
  player({ id: "zont1x", name: "zont1x", teamId: "spirit", role: "rifler", firepower: 81, tactics: 73, discipline: 79, clutch: 73, salaryLevel: 4, price: 14, personality: 71, traits: ["disciplined"] }),
  player({ id: "chopper", name: "chopper", teamId: "spirit", role: "igl", firepower: 68, tactics: 88, discipline: 77, clutch: 70, salaryLevel: 3, price: 12, personality: 69, traits: ["system_leader"] }),
  player({ id: "magixx", name: "magixx", teamId: "spirit", role: "support", firepower: 74, tactics: 74, discipline: 76, clutch: 71, salaryLevel: 3, price: 11, personality: 72, traits: ["disciplined"] }),
  player({ id: "s1ren", name: "s1ren", teamId: "spirit", role: "support", firepower: 72, tactics: 72, discipline: 75, clutch: 69, salaryLevel: 2, price: 10, personality: 73, traits: ["disciplined"] }),

  player({ id: "zywoo", name: "ZywOo", teamId: "vitality", role: "awp", firepower: 90, tactics: 84, discipline: 88, clutch: 94, salaryLevel: 5, price: 28, personality: 82, traits: ["calm_clutcher", "crowd_favorite"] }),
  player({ id: "ropz", name: "ropz", teamId: "vitality", role: "lurker", firepower: 85, tactics: 82, discipline: 89, clutch: 87, salaryLevel: 5, price: 24, personality: 80, traits: ["disciplined", "calm_clutcher"] }),
  player({ id: "apex", name: "apEX", teamId: "vitality", role: "igl", firepower: 71, tactics: 90, discipline: 67, clutch: 70, salaryLevel: 4, price: 18, personality: 54, traits: ["system_leader", "hot_blooded"] }),
  player({ id: "flamez", name: "flameZ", teamId: "vitality", role: "entry", firepower: 86, tactics: 75, discipline: 76, clutch: 77, salaryLevel: 4, price: 15, personality: 66, traits: ["hot_blooded"] }),
  player({ id: "mezii", name: "mezii", teamId: "vitality", role: "support", firepower: 79, tactics: 77, discipline: 82, clutch: 74, salaryLevel: 3, price: 13, personality: 74, traits: ["disciplined"] }),
  player({ id: "cypher-v", name: "Cypher", teamId: "vitality", role: "rifler", firepower: 77, tactics: 71, discipline: 73, clutch: 72, salaryLevel: 3, price: 11, personality: 68, traits: ["streaky_star"] }),

  player({ id: "niko", name: "NiKo", teamId: "falcons", role: "rifler", firepower: 88, tactics: 77, discipline: 68, clutch: 82, salaryLevel: 5, price: 27, personality: 54, traits: ["hot_blooded", "crowd_favorite"] }),
  player({ id: "monesy", name: "m0NESY", teamId: "falcons", role: "awp", firepower: 89, tactics: 76, discipline: 72, clutch: 88, salaryLevel: 5, price: 27, personality: 63, traits: ["streaky_star", "crowd_favorite"] }),
  player({ id: "magisk", name: "Magisk", teamId: "falcons", role: "support", firepower: 80, tactics: 80, discipline: 84, clutch: 76, salaryLevel: 4, price: 14, personality: 75, traits: ["disciplined"] }),
  player({ id: "kyxsan", name: "kyxsan", teamId: "falcons", role: "igl", firepower: 70, tactics: 85, discipline: 80, clutch: 72, salaryLevel: 3, price: 12, personality: 71, traits: ["system_leader"] }),
  player({ id: "teSeS", name: "TeSeS", teamId: "falcons", role: "entry", firepower: 83, tactics: 73, discipline: 74, clutch: 75, salaryLevel: 4, price: 14, personality: 65, traits: ["hot_blooded"] }),
  player({ id: "dupreeh-f", name: "dupreeh", teamId: "falcons", role: "rifler", firepower: 74, tactics: 75, discipline: 77, clutch: 73, salaryLevel: 2, price: 10, personality: 74, traits: ["crowd_favorite"] }),

  player({ id: "xertion", name: "xertioN", teamId: "mouz", role: "entry", firepower: 81, tactics: 73, discipline: 69, clutch: 73, salaryLevel: 4, price: 15, personality: 60, traits: ["hot_blooded"] }),
  player({ id: "torzsi", name: "torzsi", teamId: "mouz", role: "awp", firepower: 80, tactics: 76, discipline: 78, clutch: 79, salaryLevel: 4, price: 15, personality: 70, traits: ["calm_clutcher"] }),
  player({ id: "jimpphat", name: "Jimpphat", teamId: "mouz", role: "lurker", firepower: 82, tactics: 79, discipline: 82, clutch: 79, salaryLevel: 4, price: 15, personality: 76, traits: ["disciplined"] }),
  player({ id: "brollan", name: "Brollan", teamId: "mouz", role: "rifler", firepower: 81, tactics: 73, discipline: 71, clutch: 72, salaryLevel: 3, price: 13, personality: 67, traits: ["streaky_star"] }),
  player({ id: "siuhy", name: "siuhy", teamId: "mouz", role: "igl", firepower: 69, tactics: 87, discipline: 81, clutch: 72, salaryLevel: 3, price: 12, personality: 75, traits: ["system_leader"] }),
  player({ id: "spinx-m", name: "Spinx", teamId: "mouz", role: "support", firepower: 78, tactics: 76, discipline: 78, clutch: 75, salaryLevel: 3, price: 12, personality: 72, traits: ["disciplined"] }),

  player({ id: "frozen", name: "frozen", teamId: "faze", role: "rifler", firepower: 82, tactics: 80, discipline: 83, clutch: 82, salaryLevel: 4, price: 16, personality: 78, traits: ["disciplined"] }),
  player({ id: "broky", name: "broky", teamId: "faze", role: "awp", firepower: 82, tactics: 77, discipline: 79, clutch: 83, salaryLevel: 4, price: 16, personality: 74, traits: ["calm_clutcher"] }),
  player({ id: "rain", name: "rain", teamId: "faze", role: "entry", firepower: 81, tactics: 74, discipline: 76, clutch: 74, salaryLevel: 3, price: 13, personality: 72, traits: ["crowd_favorite"] }),
  player({ id: "karrigan", name: "karrigan", teamId: "faze", role: "igl", firepower: 65, tactics: 92, discipline: 81, clutch: 73, salaryLevel: 3, price: 12, personality: 76, traits: ["system_leader"] }),
  player({ id: "elio", name: "EliGE", teamId: "faze", role: "rifler", firepower: 85, tactics: 74, discipline: 70, clutch: 77, salaryLevel: 4, price: 15, personality: 61, traits: ["streaky_star"] }),
  player({ id: "skullz-fz", name: "skullz", teamId: "faze", role: "support", firepower: 73, tactics: 71, discipline: 75, clutch: 69, salaryLevel: 2, price: 10, personality: 71, traits: ["disciplined"] }),
  player({ id: "twistzz", name: "Twistzz", teamId: "faze", role: "rifler", firepower: 83, tactics: 79, discipline: 82, clutch: 82, salaryLevel: 4, price: 20, personality: 76, traits: ["disciplined", "crowd_favorite"] }),
  player({ id: "simple-fz", name: "s1mple", teamId: "faze", role: "awp", firepower: 87, tactics: 76, discipline: 66, clutch: 91, salaryLevel: 5, price: 24, personality: 58, traits: ["streaky_star", "crowd_favorite"] }),
  player({ id: "jcobbb", name: "jcobbb", teamId: "faze", role: "entry", firepower: 77, tactics: 70, discipline: 72, clutch: 70, salaryLevel: 2, price: 10, personality: 67, traits: ["streaky_star"] }),
  player({ id: "olofmeister-fz", name: "olofmeister", teamId: "faze", role: "support", firepower: 70, tactics: 76, discipline: 82, clutch: 76, salaryLevel: 2, price: 10, personality: 78, traits: ["disciplined", "crowd_favorite"] }),

  player({ id: "kscerato", name: "KSCERATO", teamId: "furia", role: "lurker", firepower: 84, tactics: 79, discipline: 84, clutch: 84, salaryLevel: 5, price: 22, personality: 78, traits: ["calm_clutcher", "disciplined"] }),
  player({ id: "yuurih", name: "yuurih", teamId: "furia", role: "rifler", firepower: 81, tactics: 77, discipline: 80, clutch: 79, salaryLevel: 4, price: 16, personality: 76, traits: ["disciplined"] }),
  player({ id: "fallen", name: "FalleN", teamId: "furia", role: "igl", firepower: 68, tactics: 88, discipline: 83, clutch: 74, salaryLevel: 3, price: 12, personality: 79, traits: ["system_leader", "crowd_favorite"] }),
  player({ id: "molodoy", name: "molodoy", teamId: "furia", role: "awp", firepower: 79, tactics: 69, discipline: 71, clutch: 74, salaryLevel: 3, price: 12, personality: 66, traits: ["streaky_star"] }),
  player({ id: "yekindar", name: "YEKINDAR", teamId: "furia", role: "entry", firepower: 79, tactics: 70, discipline: 63, clutch: 71, salaryLevel: 4, price: 14, personality: 52, traits: ["hot_blooded"] }),
  player({ id: "chelo", name: "chelo", teamId: "furia", role: "support", firepower: 72, tactics: 70, discipline: 72, clutch: 68, salaryLevel: 2, price: 10, personality: 68, traits: ["crowd_favorite"] }),

  player({ id: "b1t", name: "b1t", teamId: "navi", role: "rifler", firepower: 83, tactics: 77, discipline: 82, clutch: 81, salaryLevel: 4, price: 17, personality: 77, traits: ["disciplined"] }),
  player({ id: "w0nderful", name: "w0nderful", teamId: "navi", role: "awp", firepower: 82, tactics: 76, discipline: 80, clutch: 84, salaryLevel: 4, price: 17, personality: 73, traits: ["calm_clutcher"] }),
  player({ id: "jl", name: "jL", teamId: "navi", role: "entry", firepower: 79, tactics: 74, discipline: 75, clutch: 78, salaryLevel: 4, price: 14, personality: 66, traits: ["crowd_favorite"] }),
  player({ id: "im", name: "iM", teamId: "navi", role: "rifler", firepower: 82, tactics: 73, discipline: 73, clutch: 75, salaryLevel: 3, price: 13, personality: 64, traits: ["streaky_star"] }),
  player({ id: "aleksib", name: "Aleksib", teamId: "navi", role: "igl", firepower: 66, tactics: 89, discipline: 84, clutch: 73, salaryLevel: 3, price: 12, personality: 77, traits: ["system_leader", "disciplined"] }),
  player({ id: "makazze", name: "makazze", teamId: "navi", role: "support", firepower: 72, tactics: 69, discipline: 71, clutch: 68, salaryLevel: 2, price: 10, personality: 69, traits: ["disciplined"] }),

  player({ id: "910", name: "910", teamId: "mongolz", role: "awp", firepower: 80, tactics: 73, discipline: 75, clutch: 79, salaryLevel: 4, price: 15, personality: 70, traits: ["calm_clutcher"] }),
  player({ id: "senzu", name: "Senzu", teamId: "mongolz", role: "entry", firepower: 81, tactics: 71, discipline: 70, clutch: 74, salaryLevel: 4, price: 15, personality: 61, traits: ["hot_blooded"] }),
  player({ id: "bLitz", name: "bLitz", teamId: "mongolz", role: "igl", firepower: 74, tactics: 84, discipline: 79, clutch: 73, salaryLevel: 3, price: 12, personality: 74, traits: ["system_leader"] }),
  player({ id: "mzinho", name: "mzinho", teamId: "mongolz", role: "rifler", firepower: 81, tactics: 71, discipline: 74, clutch: 74, salaryLevel: 3, price: 13, personality: 68, traits: ["streaky_star"] }),
  player({ id: "techno", name: "Techno", teamId: "mongolz", role: "support", firepower: 78, tactics: 72, discipline: 75, clutch: 72, salaryLevel: 3, price: 12, personality: 71, traits: ["disciplined"] }),
  player({ id: "annihilation", name: "Annihilation", teamId: "mongolz", role: "awp", firepower: 76, tactics: 68, discipline: 69, clutch: 70, salaryLevel: 2, price: 10, personality: 65, traits: ["streaky_star"] }),
];

export function getPlayersByTeam(teamId: TeamId): PlayerContent[] {
  return playerPool.filter((player) => player.teamId === teamId);
}
