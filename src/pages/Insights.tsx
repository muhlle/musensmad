import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { useTolerated } from "@/hooks/useTolerated";
import { useTriggerHistory } from "@/hooks/useTriggerHistory";
import { Meal } from "@/lib/meal";
import { TrendingUp, AlertTriangle, Heart, Sparkles, Check, X, Plus, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const Insights = () => {
  const { user } = useAnonAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { tolerated, add: addTolerated, remove: removeTolerated, isTolerated } = useTolerated();
  const { history, record, remove: removeTrigger } = useTriggerHistory(user?.id);
  const [newTolerated, setNewTolerated] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("meals").select("*").order("meal_at", { ascending: false });
      const list = (data ?? []) as unknown as Meal[];
      setMeals(list);
      setLoading(false);

      // Merge any triggers from symptom-causing meals into the persistent log.
      // This way the trigger list grows over time and never resets.
      for (const m of list) {
        if (m.symptom_severity === "none") continue;
        if (!m.possible_triggers?.length) continue;
        record(m.possible_triggers, m.meal_at);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const stats = useMemo(() => {
    const total = meals.length;
    const symptomFree = meals.filter((m) => m.symptom_severity === "none").length;
    const triggered = meals.filter((m) => m.symptom_severity !== "none").length;
    const highFodmap = meals.filter((m) => m.fodmap_level === "high").length;

    // Tolerated foods (symptom-free meals' ingredients) — observed from data
    const toleratedCounts: Record<string, number> = {};
    for (const m of meals) {
      if (m.symptom_severity !== "none") continue;
      for (const ing of m.ingredients) {
        const k = ing.toLowerCase();
        toleratedCounts[k] = (toleratedCounts[k] || 0) + 1;
      }
    }
    const topTolerated = Object.entries(toleratedCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Symptom frequency
    const symptomCounts: Record<string, number> = {};
    for (const m of meals) {
      for (const s of m.symptom_types) {
        const k = s.toLowerCase();
        symptomCounts[k] = (symptomCounts[k] || 0) + 1;
      }
    }
    const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { total, symptomFree, triggered, highFodmap, topTolerated, topSymptoms };
  }, [meals]);

  // Persistent trigger history (sorted by count desc, top 8)
  const persistentTriggers = useMemo(
    () => [...history].sort((a, b) => b.count - a.count).slice(0, 8),
    [history],
  );
  const maxTriggerCount = persistentTriggers[0]?.count ?? 1;

  const handleAddTolerated = (e: React.FormEvent) => {
    e.preventDefault();
    const v = newTolerated.trim();
    if (!v) return;
    addTolerated(v);
    setNewTolerated("");
    toast.success(`Added "${v}" to tolerated foods`);
  };

  const markAsTolerated = (name: string) => {
    addTolerated(name);
    toast.success(`"${name}" marked as tolerated`);
  };

  return (
    <AppShell>
      <header className="mb-5 animate-fade-in">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Patterns</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">Trends across your tracked meals.</p>
      </header>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-2xl bg-muted/60 animate-pulse-soft" />)}
        </div>
      ) : meals.length === 0 && history.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No data yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Track a few meals to start seeing patterns.</p>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 animate-fade-in-up">
            <Stat label="Meals tracked" value={stats.total} />
            <Stat label="Symptom-free" value={stats.symptomFree} accent="success" />
            <Stat label="With symptoms" value={stats.triggered} accent="warning" />
            <Stat label="High FODMAP" value={stats.highFodmap} accent="destructive" />
          </section>

          <Card icon={<AlertTriangle className="h-4 w-4 text-warning" />} title="Ingredients that seem to trigger symptoms">
            {persistentTriggers.length === 0 ? (
              <p className="text-xs text-muted-foreground">No symptom-causing meals logged yet.</p>
            ) : (
              <>
                <p className="mb-3 text-[11px] text-muted-foreground">
                  Saved over time. Stays here even if meals are deleted.
                </p>
                <ul className="space-y-2">
                  {persistentTriggers.map((entry) => (
                    <li key={entry.name}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="capitalize">{entry.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">{entry.count}×</span>
                          {isTolerated(entry.name) ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-1.5 py-0.5 text-[10px] text-success">
                              <Check className="h-2.5 w-2.5" /> tolerated
                            </span>
                          ) : (
                            <button
                              onClick={() => markAsTolerated(entry.name)}
                              className="rounded-full bg-success-soft px-1.5 py-0.5 text-[10px] text-success hover:opacity-80"
                              title="I tolerate this ingredient"
                            >
                              I tolerate it
                            </button>
                          )}
                          <button
                            onClick={() => removeTrigger(entry.name)}
                            className="rounded-full p-0.5 text-muted-foreground hover:text-destructive"
                            title="Remove from list"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full ${isTolerated(entry.name) ? "bg-success/50" : "bg-warning"}`}
                          style={{ width: `${Math.max(8, Math.round((entry.count / maxTriggerCount) * 100))}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>

          <Card icon={<Heart className="h-4 w-4 text-success" />} title="Foods you seem to tolerate well">
            <p className="mb-3 text-[11px] text-muted-foreground">
              Whitelisted ingredients won't be flagged as triggers — even if their FODMAP score is high.
            </p>

            {tolerated.length > 0 && (
              <ul className="mb-3 flex flex-wrap gap-1.5">
                {tolerated.map((name) => (
                  <li key={name} className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-soft px-2 py-1 text-xs text-success">
                    <span className="capitalize">{name}</span>
                    <button
                      onClick={() => removeTolerated(name)}
                      className="rounded-full hover:opacity-70"
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddTolerated} className="flex gap-2">
              <input
                type="text"
                value={newTolerated}
                onChange={(e) => setNewTolerated(e.target.value)}
                placeholder="Add an ingredient (e.g. garlic)"
                className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </form>

            {stats.topTolerated.length > 0 && (
              <div className="mt-4 border-t border-border pt-3">
                <p className="mb-2 text-[11px] text-muted-foreground">Observed from your symptom-free meals:</p>
                <ul className="space-y-2">
                  {stats.topTolerated.map(([name, count]) => (
                    <Row key={name} name={name} count={count} max={stats.topTolerated[0][1]} tone="success" />
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <Card icon={<TrendingUp className="h-4 w-4 text-primary" />} title="Symptom frequency">
            {stats.topSymptoms.length === 0 ? (
              <p className="text-xs text-muted-foreground">No symptoms logged yet — that&apos;s great!</p>
            ) : (
              <ul className="space-y-2">
                {stats.topSymptoms.map(([name, count]) => (
                  <Row key={name} name={name} count={count} max={stats.topSymptoms[0][1]} tone="primary" />
                ))}
              </ul>
            )}
          </Card>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Insights are observational and not a clinical diagnosis.
          </p>
        </>
      )}
    </AppShell>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: number; accent?: "success" | "warning" | "destructive" }) => {
  const color =
    accent === "success" ? "text-success" :
    accent === "warning" ? "text-warning" :
    accent === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <div className="rounded-2xl bg-card p-4 shadow-soft">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
};

const Card = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="mt-5 rounded-2xl bg-card p-4 shadow-soft animate-fade-in-up">
    <h3 className="mb-3 flex items-center gap-1.5 font-medium">
      {icon}
      {title}
    </h3>
    {children}
  </section>
);

const Row = ({ name, count, max, tone }: { name: string; count: number; max: number; tone: "success" | "warning" | "primary" }) => {
  const bar = tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-primary";
  const w = Math.max(8, Math.round((count / max) * 100));
  return (
    <li>
      <div className="flex items-center justify-between text-xs">
        <span className="capitalize">{name}</span>
        <span className="text-muted-foreground">{count}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${bar}`} style={{ width: `${w}%` }} />
      </div>
    </li>
  );
};

export default Insights;
