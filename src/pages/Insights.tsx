import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { useTolerated } from "@/hooks/useTolerated";
import { useTriggerHistory } from "@/hooks/useTriggerHistory";
import { useDailyLog } from "@/hooks/useDailyLog";
import { Meal } from "@/lib/meal";
import { analyseTriggers } from "@/lib/triggerAnalysis";
import { scanForAlarmSymptoms } from "@/lib/safety";
import { TrendingUp, AlertTriangle, Heart, Sparkles, Check, X, Plus, ChevronRight, FileText, ShieldAlert, Activity } from "lucide-react";
import { toast } from "sonner";

const Insights = () => {
  const { user } = useAnonAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { tolerated, add: addTolerated, remove: removeTolerated, isTolerated } = useTolerated();
  const { history, record } = useTriggerHistory(user?.id);
  const { entries: dailyEntries } = useDailyLog(user?.id);
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

  // Trigger correlation engine — uses meals + daily log to spot patterns
  const correlations = useMemo(
    () => analyseTriggers(meals, dailyEntries).slice(0, 5),
    [meals, dailyEntries],
  );

  // Alarm-symptom scan across all user-entered text
  const alarms = useMemo(() => {
    const texts: { text: string; source: string }[] = [];
    for (const m of meals) {
      if (m.user_notes) texts.push({ text: m.user_notes, source: `meal: ${m.title}` });
    }
    for (const d of Object.values(dailyEntries)) {
      if (d.notes) texts.push({ text: d.notes, source: `daily ${d.date}` });
      if (d.bowelMovements?.some((b) => b.alarm)) {
        texts.push({ text: "blood mucus", source: `bowel log ${d.date}` });
      }
    }
    return scanForAlarmSymptoms(texts);
  }, [meals, dailyEntries]);

  // Today's triggers (only meals from today with logged symptoms)
  const todaysTriggers = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const counts: Record<string, number> = {};
    for (const m of meals) {
      if (m.symptom_severity === "none") continue;
      if (new Date(m.meal_at) < start) continue;
      for (const t of m.possible_triggers ?? []) {
        const k = t.toLowerCase();
        counts[k] = (counts[k] || 0) + 1;
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [meals]);

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

          {alarms.length > 0 && (
            <section className="mt-5 rounded-2xl border border-destructive/30 bg-destructive-soft p-4 animate-fade-in-up">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                <ShieldAlert className="h-4 w-4" /> Please consider seeing a doctor
              </h3>
              <p className="mt-1 text-[11px] text-destructive/90">
                You've logged symptoms that aren't typical for IBS alone:
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {alarms.map((a) => (
                  <li key={a.key} className="rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-medium text-destructive">
                    {a.label}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-destructive/80">
                These don't mean something is wrong, but they should be evaluated by a healthcare professional.
              </p>
            </section>
          )}

          {correlations.length > 0 && (
            <section className="mt-5 rounded-2xl bg-card p-4 shadow-soft animate-fade-in-up">
              <h3 className="mb-1 flex items-center gap-1.5 font-medium">
                <Activity className="h-4 w-4 text-primary" /> Possible correlations
              </h3>
              <p className="mb-3 text-[11px] text-muted-foreground">
                Patterns from your data — not certainties. More entries = better signal.
              </p>
              <ul className="space-y-2.5">
                {correlations.map((c) => (
                  <li key={c.ingredient} className="rounded-xl border border-border bg-background p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium capitalize">{c.ingredient}</span>
                      <span
                        className={
                          c.confidence === "high"
                            ? "rounded-full bg-warning-soft px-1.5 py-0.5 text-[10px] font-medium text-warning"
                            : c.confidence === "moderate"
                            ? "rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                            : "rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        }
                      >
                        {c.confidence} confidence
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Reacted {c.reactions}/{c.exposures} exposures ({Math.round(c.reactionRate * 100)}%)
                    </p>
                    {c.altExplanationHint && (
                      <p className="mt-1 text-[11px] italic text-muted-foreground">{c.altExplanationHint}</p>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Tip: try not to test multiple suspect foods on the same day.
              </p>
            </section>
          )}

          <Link
            to="/insights/triggers"
            className="mt-5 block rounded-2xl bg-card p-4 shadow-soft animate-fade-in-up transition-smooth hover:shadow-card active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Ingredients that seem to trigger symptoms
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Today's view — tap for full log (7d / 14d / 1m / all time)
                </p>
              </div>
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            </div>

            <div className="mt-3">
              {todaysTriggers.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No symptom triggers logged today. Tap to see your full history.
                </p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {todaysTriggers.map(([name, count]) => {
                    const tol = isTolerated(name);
                    return (
                      <li
                        key={name}
                        className={
                          tol
                            ? "inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-soft px-2.5 py-1 text-xs text-success"
                            : "inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning-soft px-2.5 py-1 text-xs text-warning"
                        }
                      >
                        <span className="capitalize">{name}</span>
                        {count > 1 && <span className="opacity-70">×{count}</span>}
                        {tol && <Check className="h-2.5 w-2.5" />}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <p className="mt-3 text-[11px] font-medium text-primary">
              View full trigger log →
            </p>
          </Link>

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
