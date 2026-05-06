import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { FodmapBadge } from "@/components/FodmapBadge";
import { SeverityChip } from "@/components/SeverityChip";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { Meal } from "@/lib/meal";
import { useT } from "@/lib/i18n";
import { Search, Pencil, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { da as daLocale, enUS } from "date-fns/locale";
import { MealPhoto } from "@/components/MealPhoto";

const History = () => {
  const { user } = useAnonAuth();
  const { t, lang } = useT();
  const locale = lang === "da" ? daLocale : enUS;

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
    const query = q.toLowerCase();
    return meals.filter(
      (meal) =>
        meal.title.toLowerCase().includes(query) ||
        (meal.ai_summary ?? "").toLowerCase().includes(query) ||
        meal.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query)),
    );
  }, [q, meals]);

  const grouped = useMemo(() => {
    const groups: Record<string, Meal[]> = {};
    for (const meal of filtered) {
      const day = format(
        new Date(meal.meal_at),
        lang === "da" ? "EEEE d. MMM" : "EEEE, MMM d",
        { locale },
      );
      groups[day] = groups[day] || [];
      groups[day].push(meal);
    }
    return groups;
  }, [filtered, lang, locale]);

  return (
    <AppShell>
      <header className="mb-5 animate-fade-in">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("history.kicker")}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">{t("history.title")}</h1>
      </header>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder={t("history.search.placeholder")}
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
          <p className="text-sm font-medium">{t("history.empty.title")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("history.empty.body")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, items]) => (
            <section key={day}>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{day}</h3>
              <ul className="space-y-3">
                {items.map((meal) => (
                  <li key={meal.id}>
                    <div className="rounded-2xl bg-card p-3 shadow-soft transition-smooth hover:shadow-card">
                      <Link to={`/meal/${meal.id}`} className="flex gap-3">
                        {meal.photo_url ? (
                          <MealPhoto value={meal.photo_url} alt={meal.title} loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                        ) : (
                          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-secondary text-2xl">🍽️</div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate font-medium">{meal.title}</p>
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {format(new Date(meal.meal_at), lang === "da" ? "HH:mm" : "h:mm a", { locale })}
                            </span>
                          </div>
                          {meal.ai_summary && (
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{meal.ai_summary}</p>
                          )}
                        </div>
                      </Link>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-0 md:pl-[5.75rem]">
                        <FodmapBadge level={meal.fodmap_level} score={meal.fodmap_score} />
                        <Link
                          to={`/meal/${meal.id}/symptoms`}
                          className="rounded-full outline-none ring-offset-background transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label={`${t("meal.symptoms.update")} ${meal.title}`}
                        >
                          <SeverityChip severity={meal.symptom_severity} />
                        </Link>
                        <Link
                          to={`/meal/${meal.id}/symptoms`}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground transition-smooth hover:bg-secondary/80"
                        >
                          {meal.symptom_severity === "none" && meal.symptom_types.length === 0 ? t("meal.symptoms.add") : t("meal.symptoms.update")}
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                        {meal.edited_at && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Pencil className="h-2.5 w-2.5" /> {t("history.edited")}
                          </span>
                        )}
                      </div>
                    </div>
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
