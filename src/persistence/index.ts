import type { InvestigationStorage } from './investigationStorage';
import { localStorageInvestigationStorage } from './localStorageInvestigationStorage';

// We switch to the localStorage for pure frontend testing.
export const investigationStorage: InvestigationStorage =
	localStorageInvestigationStorage;

export type {
	PersistedInvestigation,
	PersistedCard,
	InvestigationStorage,
} from './investigationStorage';
