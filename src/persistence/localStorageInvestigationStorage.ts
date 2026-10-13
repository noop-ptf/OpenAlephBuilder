import type {
  InvestigationStorage,
  PersistedInvestigation,
} from "./investigationStorage";

const KEY = "openaleph.investigation.v1";

export const localStorageInvestigationStorage: InvestigationStorage = {
  async load() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PersistedInvestigation;
    } catch {
      return null;
    }
  },
  async save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  },
};
