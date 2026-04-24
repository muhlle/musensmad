import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { FodmapBadge } from "@/components/FodmapBadge";
import { SeverityChip } from "@/components/SeverityChip";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { Meal } from "@/lib/meal";
import { Search, Pencil } from "lucide-react";
import { format } from "date-fns";
import { MealPhoto } from "@/components/MealPhoto";

const History = () => {
  const { user } = useAnonAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("meals")
        .select("*")
        .order("meal_at", { ascending: false });
      setMeals((data ?? []) as unknown as Meal[]);
      setLoading(false);
    })();
  }, [user]);

  const filtered = useMemo(() => {
    if (!q.trim()) return meals;
    const t = q.toLowerCase();
    return meals.filter(
      (m) =>
        m.title.toLowerCase().includes(t) ||
        (m.ai_summary ?? "").toLowerCase().includes(t) ||
        m.ingredients.some((i) => i.toLowerCase().includes(t)),
    );
  }, [q, meals]);

  // Group by day
  const grouped = useMemo(() => {
    const g: Record<string, Meal[]> = {};
    for (const m of filtered) {
      const day = format(new Date(m.meal_at), "EEEE, MMM d");
      g[day] = g[day] || [];
      g[day].push(m);
    }
    return g;
  }, [filtered]);

  return (
    <AppShell>
      <header className="mb-5 animate-fade-in">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your log</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Meal history</h1>
      </header>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search meals or ingredients"
          className="rounded-full bg-card pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/60 animate-pulse-soft" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-sm font-medium">No meals match</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different search or add a new meal.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, items]) => (
            <section key={day}>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{day}</h3>
              <ul className="space-y-3">
                {items.map((m) => (
                  <li key={m.id}>
                    <Link
                      to={`/meal/${m.id}`}
                      className="flex gap-3 rounded-2xl bg-card p-3 shadow-soft transition-smooth hover:shadow-card"
                    >
                      {m.photo_url ? (
                        <MealPhoto value={m.photo_url} alt={m.title} loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                      ) : (
                        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-secondary text-2xl">🍽️</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-medium">{m.title}</p>
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {format(new Date(m.meal_at), "h:mm a")}
                          </span>
                        </div>
                        {m.ai_summary && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{m.ai_summary}</p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <FodmapBadge level={m.fodmap_level} score={m.fodmap_score} />
                          <SeverityChip severity={m.symptom_severity} />
                          {m.edited_at && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Pencil className="h-2.5 w-2.5" /> edited
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </AppShell>
  );
};

export default History;
