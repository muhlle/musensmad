import { Meal } from "./meal";
import { DailyEntry } from "@/hooks/useDailyLog";

export interface TriggerCorrelation {
  ingredient: string;
  exposures: number;        // meals containing the ingredient
  reactions: number;        // exposures followed by symptoms
  reactionRate: number;     // 0..1
  confidence: "low" | "moderate" | "high";
  avgSeverityScore: number; // none=0 mild=1 moderate=2 severe=3
  altExplanationHint?: string;
}

const sevScore = (s: string): number =>
  s === "severe" ? 3 : s === "moderate" ? 2 : s === "mild" ? 1 : 0;

const dayKeyOf = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/**
 * Compute trigger correlations across all meals.
 * Confidence is heuristic (not clinical) and based on number of exposures.
 */
export const analyseTriggers = (
  meals: Meal[],
  daily: Record<string, DailyEntry> = {},
): TriggerCorrelation[] => {
  const map = new Map<string, { ing: string; exposures: number; reactions: number; sevSum: number; reactionDays: string[] }>();

  for (const m of meals) {
    const reacted = m.symptom_severity !== "none";
    const sev = sevScore(m.symptom_severity);
    const day = dayKeyOf(m.meal_at);

    // Use ingredients (broader) for exposure counting; possible_triggers for the relevant ones
    const all = new Set<string>([
      ...m.ingredients.map((x) => x.trim().toLowerCase()),
      ...(m.possible_triggers ?? []).map((x) => x.trim().toLowerCase()),
    ]);

    for (const ing of all) {
      if (!ing) continue;
      const e = map.get(ing) ?? { ing, exposures: 0, reactions: 0, sevSum: 0, reactionDays: [] };
      e.exposures += 1;
      if (reacted) {
        e.reactions += 1;
        e.sevSum += sev;
        e.reactionDays.push(day);
      }
      map.set(ing, e);
    }
  }

  const results: TriggerCorrelation[] = [];
  for (const e of map.values()) {
    if (e.reactions === 0 && e.exposures < 2) continue;
    const reactionRate = e.exposures > 0 ? e.reactions / e.exposures : 0;

    let confidence: TriggerCorrelation["confidence"] = "low";
    if (e.exposures >= 5 && reactionRate >= 0.6) confidence = "high";
    else if (e.exposures >= 3 && reactionRate >= 0.5) confidence = "moderate";

    // Confounder check: were the reaction days also high-stress / poor-sleep days?
    let altHint: string | undefined;
    if (e.reactionDays.length >= 2) {
      const stressy = e.reactionDays.filter((d) => (daily[d]?.stress ?? 0) >= 7).length;
      const poorSleep = e.reactionDays.filter((d) => (daily[d]?.sleepQuality ?? 10) <= 4).length;
      if (stressy / e.reactionDays.length >= 0.6) {
        altHint = "Many of these days were also high-stress — symptoms could be stress-related.";
      } else if (poorSleep / e.reactionDays.length >= 0.6) {
        altHint = "These days had poor sleep — sleep may be a confounding factor.";
      }
    }

    results.push({
      ingredient: e.ing,
      exposures: e.exposures,
      reactions: e.reactions,
      reactionRate,
      confidence,
      avgSeverityScore: e.reactions > 0 ? e.sevSum / e.reactions : 0,
      altExplanationHint: altHint,
    });
  }

  // Rank: prefer higher reaction count, then rate, then confidence
  return results.sort((a, b) => {
    if (b.reactions !== a.reactions) return b.reactions - a.reactions;
    if (b.reactionRate !== a.reactionRate) return b.reactionRate - a.reactionRate;
    return b.exposures - a.exposures;
  });
};

/**
 * Tolerated foods discovered from data: appeared >= 2 times, never with symptoms.
 */
export const findToleratedFoods = (meals: Meal[]): { ingredient: string; times: number }[] => {
  const map = new Map<string, { times: number; reactions: number }>();
  for (const m of meals) {
    const reacted = m.symptom_severity !== "none";
    for (const ing of m.ingredients) {
      const k = ing.trim().toLowerCase();
      if (!k) continue;
      const e = map.get(k) ?? { times: 0, reactions: 0 };
      e.times += 1;
      if (reacted) e.reactions += 1;
      map.set(k, e);
    }
  }
  return Array.from(map.entries())
    .filter(([, v]) => v.times >= 2 && v.reactions === 0)
    .map(([ingredient, v]) => ({ ingredient, times: v.times }))
    .sort((a, b) => b.times - a.times);
};
