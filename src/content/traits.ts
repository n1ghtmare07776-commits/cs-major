export const traitIds = [
  "hot_blooded",
  "calm_clutcher",
  "system_leader",
  "streaky_star",
  "disciplined",
  "crowd_favorite",
] as const;

export type TraitId = (typeof traitIds)[number];

export interface TraitDefinition {
  id: TraitId;
  label: string;
  modifiers: {
    firepower?: number;
    tactics?: number;
    cohesion?: number;
    discipline?: number;
    clutch?: number;
  };
}

export const traitDefinitions: Record<TraitId, TraitDefinition> = {
  hot_blooded: {
    id: "hot_blooded",
    label: "Hot Blooded",
    modifiers: { firepower: 6, discipline: -4, cohesion: -1 },
  },
  calm_clutcher: {
    id: "calm_clutcher",
    label: "Calm Clutcher",
    modifiers: { firepower: -1, clutch: 7, discipline: 3 },
  },
  system_leader: {
    id: "system_leader",
    label: "System Leader",
    modifiers: { tactics: 7, firepower: -2, cohesion: 3 },
  },
  streaky_star: {
    id: "streaky_star",
    label: "Streaky Star",
    modifiers: { firepower: 5, discipline: -2, clutch: 2 },
  },
  disciplined: {
    id: "disciplined",
    label: "Disciplined",
    modifiers: { discipline: 6, firepower: -1, tactics: 2 },
  },
  crowd_favorite: {
    id: "crowd_favorite",
    label: "Crowd Favorite",
    modifiers: { clutch: 4, firepower: 2, discipline: -1 },
  },
};
