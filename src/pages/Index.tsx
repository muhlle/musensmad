import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { FodmapBadge } from "@/components/FodmapBadge";
import { SeverityChip } from "@/components/SeverityChip";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { Meal } from "@/lib/meal";
import { Camera, Sparkles, AlertCircle, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-meal.jpg";

const Index = () => {
  const { user, loading: authLoading } = useAnonAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("meals")
        .select("*")
        .order("meal_at", { ascending: false })
        .limit(3);
      setMeals((data ?? []) as unknown as Meal[]);
      setLoading(false);
    })();
  }, [user]);

  const totalMeals = meals.length;
  const symptomFree = meals.filter((m) => m.symptom_severity === "none").length;

  return (
    <AppShell>
      {/* Header */}
      <header className="mb-6 animate-fade-in">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">IBS Food Tracker</p>
        <h1 className="mt-1 text-3xl font-semibold text-foreground">Hi there 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tracking your meals helps you spot what your gut tolerates.
        </p>
      </header>

      {/* Hero card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elevated animate-fade-in-up">
        <div className="relative z-10 max-w-[60%]">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider backdrop-blur">
            <Sparkles className="h-3 w-3" /> AI-powered
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold leading-tight">
            Snap a photo. Understand your meal.
          </h2>
          <p className="mt-1.5 text-xs text-primary-foreground/80">
            Get an instant FODMAP estimate and possible IBS triggers.
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-4 rounded-full font-semibold">
            <Link to="/add">
              <Camera className="h-4 w-4" /> Add meal
            </Link>
          </Button>
        </div>
        <img
          src={heroImg}
          alt=""
          width={1280}
          height={896}
          className="absolute -right-10 -bottom-6 h-44 w-44 rounded-full object-cover opacity-90 ring-8 ring-primary-foreground/10"
        />
      </section>

      {/* Quick stats */}
      <section className="mt-5 grid grid-cols-2 gap-3 animate-fade-in-up">
        <div className="rounded-2xl bg-card p-4 shadow-soft">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Recent meals</p>
          <p className="mt-1 text-2xl font-semibold">{totalMeals}</p>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-soft">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Symptom-free</p>
          <p className="mt-1 text-2xl font-semibold text-success">{symptomFree}</p>
        </div>
      </section>

      {/* Recent meals */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Recent meals</h3>
          <Link to="/history" className="text-xs font-medium text-primary inline-flex items-center gap-0.5">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {(authLoading || loading) ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted/60 animate-pulse-soft" />
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
            <p className="text-sm font-medium">No meals yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Add your first meal to start tracking.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {meals.map((m) => (
              <li key={m.id}>
                <Link
                  to={`/meal/${m.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft transition-smooth hover:shadow-card"
                >
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.title} loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                      🍽️
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{m.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <FodmapBadge level={m.fodmap_level} score={m.fodmap_score} />
                      <SeverityChip severity={m.symptom_severity} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Disclaimer */}
      <section className="mt-7 flex items-start gap-2.5 rounded-2xl border border-border bg-card/60 p-3.5">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          This app does <span className="font-medium text-foreground">not</span> provide medical diagnosis.
          AI estimates from photos may be imperfect. Always consult a healthcare professional.
        </p>
      </section>
    </AppShell>
  );
};

export default Index;
