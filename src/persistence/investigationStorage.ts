import type { IEntityDatum } from "@opensanctions/followthemoney";

export interface PersistedCard {
  key: string;
  caption: string; // draft caption text; only meaningful when entity is undefined
  entity?: IEntityDatum; // entity.toJSON()
}

export interface PersistedInvestigation {
  version: 1;
  cards: PersistedCard[];
  canvasPositions: Record<string, { x: number; y: number }>;
}

export interface InvestigationStorage {
  load(): Promise<PersistedInvestigation | null>;
  save(data: PersistedInvestigation): Promise<void>;
}
