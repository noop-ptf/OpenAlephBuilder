import type { Entity, Property, Schema } from "@opensanctions/followthemoney";
import { model } from "./ftm";

export interface AddedProperty {
  property: Property;
  values: string[];
}

export interface CardState {
  key: string; // stable id for #each/DnD; independent of entity.id
  entity: Entity | undefined; // created lazily once a schema is first chosen
  // Reactive echo of entity.getCaption() (or free text pre-entity). Entity is
  // a plain non-reactive class, so this field is what actually drives
  // re-renders — kept in lockstep with the entity by setCaption() below (a
  // single synchronous write), never by a separate $effect.
  caption: string;
  addedProps: AddedProperty[]; // both featured-toggled and "+more"-added properties
  autofocusCaption: boolean; // true only for the card just created via the ghost tile
}

export function createCardState(autofocusCaption = false): CardState {
  return createCardStateFromEntity(model.generateRandomId(), undefined, "", autofocusCaption);
}

// Canonical constructor: builds a CardState from an (optional) entity,
// re-deriving caption/addedProps fresh from it every call. This is the
// "recreate CardState on mount" seam — a later persistence pass persists
// Entity objects and always rebuilds a CardState from one via this function,
// rather than persisting/syncing a parallel copy of its fields.
export function createCardStateFromEntity(
  key: string,
  entity: Entity | undefined,
  draftCaption = "",
  autofocusCaption = false,
): CardState {
  return {
    key,
    entity,
    caption: entity ? entity.getCaption() : draftCaption,
    addedProps: entity ? buildAddedPropsFromEntity(entity) : [],
    autofocusCaption,
  };
}

// Excludes the schema's primary caption property (schema.caption[0], e.g. "name")
// since the card's dedicated caption input already covers it, and "entity"-typed
// properties (linking entities isn't supported yet — same exclusion EntityForm.svelte
// already applies).
export function getCardProperties(schema: Schema): {
  featured: Property[];
  others: Property[];
} {
  const captionName = schema.caption[0];
  const editable = schema
    .getEditableProperties()
    .filter((p) => p.type.name !== "entity" && p.name !== captionName);
  const featuredNames = new Set(
    schema.getFeaturedProperties().map((p) => p.name),
  );
  return {
    featured: editable.filter((p) => featuredNames.has(p.name)),
    others: editable.filter((p) => !featuredNames.has(p.name)),
  };
}

// Sole write path for a card's caption: updates the reactive field and, if
// an entity exists, writes straight through onto it in the same call — no
// $effect, so there's no separate reconciliation step for the two to drift.
export function setCaption(card: CardState, value: string): void {
  card.caption = value;
  if (card.entity) writeCaption(card.entity, value);
}

// setProperty()/setCaption() are append-only, so the caption property is
// cleared before being re-set.
function writeCaption(entity: Entity, value: string): void {
  entity.caption = value;
  const captionName = entity.schema.caption[0];
  if (!captionName) return;
  const captionProp = entity.schema.getProperty(captionName);
  entity.properties.delete(captionProp);
  if (value.trim().length > 0) entity.setProperty(captionProp, value);
}

// Re-derives one added property's values onto entity. Call from a scope that
// reads only this ap.values (+ entity), so a keystroke in this field never
// touches any other property's Map entry.
export function syncProperty(entity: Entity, ap: AddedProperty): void {
  entity.properties.delete(ap.property);
  for (const v of ap.values) {
    if (v.trim().length > 0) entity.setProperty(ap.property, v);
  }
}

export function buildAddedPropsFromEntity(entity: Entity): AddedProperty[] {
  const { featured, others } = getCardProperties(entity.schema);
  return [...featured, ...others]
    .map((property) => ({
      property,
      values: entity.getProperty(property) as string[],
    }))
    .filter((ap) => ap.values.length > 0);
}
