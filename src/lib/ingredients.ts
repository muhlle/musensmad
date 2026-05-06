import { Lang } from "./i18n";

const CANONICAL_INGREDIENTS: Record<string, string> = {
  // English wheat/flour variants
  wheat: "wheat",
  flour: "wheat",
  "wheat flour": "wheat",
  "white flour": "wheat",
  "plain flour": "wheat",
  "all-purpose flour": "wheat",
  "all purpose flour": "wheat",
  bread: "wheat",
  pasta: "wheat",
  noodles: "wheat",

  // Danish wheat/flour variants
  hvede: "wheat",
  hvedemel: "wheat",
  mel: "wheat",
  "hvidt mel": "wheat",
  "almindeligt mel": "wheat",
  brød: "wheat",
  nudler: "wheat",
};

const DISPLAY_NAMES: Record<string, Record<Lang, string>> = {
  wheat: {
    en: "Wheat / wheat flour",
    da: "Hvede / hvedemel",
  },
};

export const normalizeIngredient = (value: string): string => {
  const key = value
    .trim()
    .toLowerCase()
    .replace(/[.,;:!?()[\]{}]/g, "")
    .replace(/\s+/g, " ");

  return CANONICAL_INGREDIENTS[key] ?? key;
};

export const normalizeIngredientList = (values: string[]): string[] => {
  const seen = new Set<string>();

  return values
    .map(normalizeIngredient)
    .filter(Boolean)
    .filter((value) => {
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
};

export const displayIngredient = (value: string, lang: Lang): string => {
  const normalized = normalizeIngredient(value);
  return DISPLAY_NAMES[normalized]?.[lang] ?? normalized;
};
