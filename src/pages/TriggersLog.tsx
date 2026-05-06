import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { useTolerated } from "@/hooks/useTolerated";
import { useTriggerHistory } from "@/hooks/useTriggerHistory";
import { Meal } from "@/lib/meal";
import { useT } from "@/lib/i18n";
import { displayIngredient } from "@/lib/ingredients";
import { ArrowLeft, AlertTriangle, Check, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { da as daLocale, enUS } from "date-fns/locale";

type Range = "7d" | "14d" | "1m" | "all";

const RANGES: { value: Range; days: number | null }[] = [
  { value: "7d", days: 7 },
  { value: "14d", days: 14 },
  { value: "1m", days: 30 },
  { value: "all", days: null },
];

interface Occurrence {
  mealId: string;
  mealTitle: string;
  at: string;
  severity: string;
}

const TriggersLog = () => {
  const { user } = useAnonAuth();
  const navigate = useNavigate();
  const { t, lang } = useT();
  const locale = lang === "da" ? daLocale : enUS;
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("7d");
  const { isTolerated, add: addTolerated, remove: removeTolerated } = useTolerated();
  const { history, record } = useTriggerHistory(user?.id);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("meals")
        .select("*")
        .order("meal_at", { ascending: false });
      const list = (data ?? []) as unknown as Meal[];
      setMeals(list);
      setLoading(false);

      for (const m of list) {
        if (m.symptom_severity === "none") continue;
        if (!m.possible_triggers?.length) continue;
        record(m.possible_triggers, m.meal_at);
      }
    })();
  }, [user, record]);

  const cutoff = useMemo(() => {
    const days = RANGES.find((r) => r.value === range)?.days;
    if (!days) return null;
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  }, [range]);

  const aggregated = useMemo(() => {
    const map = new Map<string, { name: string; count: number; occurrences: Occurrence[] }>();
    for (const m of meals) {
      if (m.symptom_severity === "none") continue;
      if (!m.possible_triggers?.length) continue;
      const at = new Date(m.meal_at);
      if (cutoff && at < cutoff) continue;
      for (const raw of m.possible_triggers) {
        const k = raw.trim().toLowerCase();
        if (!k) continue;
        const entry = map.get(k) ?? { name: k, count: 0, occurrences: [] };
        entry.count += 1;
        entry.occurrences.push({
          mealId: m.id,
          mealTitle: m.title,
          at: m.meal_at,
          severity: m.symptom_severity,
        });
        map.set(k, entry);
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [meals, cutoff]);

  const allTimeExtras = useMemo(() => {
    if (range !== "all") return [];
    const seen = new Set(aggregated.map((a) => a.name));
    return history
      .filter((h) => !seen.has(h.name))
      .sort((a, b) => b.count - a.count)
      .map((h) => ({ name: h.name, count: h.count, occurrences: [] as Occurrence[] }));
  }, [range, aggregated, history]);

  const combined = useMemo(() => [...aggregated, ...allTimeExtras], [aggregated, allTimeExtras]);
  const max = combined[0]?.count ?? 1;

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Trigger log</p>
          <h1 className="font-display text-xl font-semibold">Ingredients you've reacted to</h1>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-1 rounded-2xl bg-muted p-1">
        {RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`rounded-xl px-2 py-1.5 text-[11px] font-medium transition-smooth ${
              range === r.value
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.label.replace("Last ", "")}
          </button>
        ))}
      </div>

      <p className="mb-3 text-xs text-muted-foreground">
        Tagged from meals where you logged symptoms. FODMAP scores are general — your reactions are personal.
      </p>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-20 rounded-2xl bg-muted/60 animate-pulse-soft" />)}
        </div>
      ) : combined.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
          <AlertTriangle className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No triggers in this period</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {range === "all"
              ? "Log meals with symptoms to start building your trigger profile."
              : "Try a longer period — or great news, no reactions here!"}
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {combined.map((entry) => {
            const tol = isTolerated(entry.name);
            return (
              <li
                key={entry.name}
                className="rounded-2xl bg-card p-3.5 shadow-soft animate-fade-in-up"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium capitalize">{entry.name}</span>
                      {tol && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-1.5 py-0.5 text-[10px] text-success">
                          <Check className="h-2.5 w-2.5" /> tolerated
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Reacted {entry.count} time{entry.count === 1 ? "" : "s"}
                    </p>
                  </div>
                  {tol ? (
                    <button
                      onClick={() => {
                        removeTolerated(entry.name);
                        toast.success(`Removed "${entry.name}" from tolerated list`);
                      }}
                      className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[11px] hover:bg-muted"
                    >
                      Unmark
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addTolerated(entry.name);
                        toast.success(`"${entry.name}" marked as tolerated`);
                      }}
                      className="shrink-0 rounded-full bg-success-soft px-2.5 py-1 text-[11px] text-success hover:opacity-80"
                    >
                      I tolerate it
                    </button>
                  )}
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${tol ? "bg-success/50" : "bg-warning"}`}
                    style={{ width: `${Math.max(8, Math.round((entry.count / max) * 100))}%` }}
                  />
                </div>

                {entry.occurrences.length > 0 && (
                  <details className="group mt-2.5">
                    <summary className="flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
                      <Calendar className="h-3 w-3" />
                      View {entry.occurrences.length} meal{entry.occurrences.length === 1 ? "" : "s"}
                    </summary>
                    <ul className="mt-2 space-y-1 border-l border-border pl-3">
                      {entry.occurrences.slice(0, 10).map((o, i) => (
                        <li key={i}>
                          <Link
                            to={`/meal/${o.mealId}`}
                            className="flex items-center justify-between text-[11px] text-muted-foreground hover:text-foreground"
                          >
                            <span className="truncate">{o.mealTitle}</span>
                            <span className="shrink-0 pl-2">{format(new Date(o.at), "MMM d")}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        Observational tracking only — not a clinical diagnosis.
      </p>
    </AppShell>
  );
};

export default TriggersLog;
