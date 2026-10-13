import { createCardStateFromEntity, type CardState } from "./entityCard";
import { model } from "./ftm";
import {
  investigationStorage,
  type PersistedCard,
  type PersistedInvestigation,
} from "./persistence";

export const cards = $state<CardState[]>([]);
export const canvasPositions = $state<Record<string, { x: number; y: number }>>(
  {},
);

let loaded = $state(false);

function rehydrateCard(pc: PersistedCard): CardState {
  const entity = pc.entity ? model.getEntity(pc.entity) : undefined;
  return createCardStateFromEntity(pc.key, entity, pc.caption);
}

function toPersisted(): PersistedInvestigation {
  return {
    version: 1,
    cards: cards.map((c) => ({
      key: c.key,
      caption: c.caption,
      entity: c.entity?.toJSON(),
    })),
    canvasPositions: { ...canvasPositions },
  };
}

async function loadInvestigation(): Promise<void> {
  const persisted = await investigationStorage.load();
  if (persisted) {
    cards.splice(0, cards.length, ...persisted.cards.map(rehydrateCard));
    Object.assign(canvasPositions, persisted.canvasPositions);
  }
  loaded = true;
}

const SAVE_DEBOUNCE_MS = 500;
let saveTimer: ReturnType<typeof setTimeout> | undefined;

// Keeps `cards`/`canvasPositions` themselves instant (nothing here delays
// those), but coalesces the actual disk write — without this, every
// keystroke in a caption/property field would trigger its own save.
function scheduleSave(snapshot: PersistedInvestigation): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = undefined;
    investigationStorage.save(snapshot);
  }, SAVE_DEBOUNCE_MS);
}

// Forces a pending debounced save through immediately. Call before the app
// might quit/reload, so the last few edits within the debounce window aren't
// lost.
export function flushInvestigationSave(): void {
  if (!saveTimer) return;
  clearTimeout(saveTimer);
  saveTimer = undefined;
  investigationStorage.save(toPersisted());
}

// Called once, synchronously, from +layout.svelte's <script> — $effect can't
// live at a .svelte.ts module's top level (it needs an active component-init
// call stack), but calling it from inside a plain function invoked during
// +layout.svelte's own init satisfies that, and the effect then lives for the
// app's whole session since the layout never unmounts.
export function initInvestigationPersistence(): void {
  loadInvestigation();
  $effect(() => {
    // Entity is a plain non-reactive class, so toJSON() below subscribes to
    // nothing for property edits — read through each addedProps' values (the
    // reactive mirror PropertyField edits in place) so those re-fire too.
    cards.forEach((c) => c.addedProps.forEach((ap) => ap.values.join(",")));
    const snapshot = toPersisted();
    // Don't clobber the persisted file with empty state while the async
    // load() above is still in flight.
    if (!loaded) return;
    scheduleSave(snapshot);
  });
}
