import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { FodmapBadge } from "@/components/FodmapBadge";
import { SeverityChip } from "@/components/SeverityChip";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { Meal } from "@/lib/meal";
import { useT } from "@/lib/i18n";
import { displayIngredient } from "@/lib/ingredients";
import { format } from "date-fns";
import { da as daLocale, enUS } from "date-fns/locale";
import { ArrowLeft, Pencil, Trash2, AlertCircle, Sparkles, BookOpen, MessageCircle, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useTolerated } from "@/hooks/useTolerated";
import { MealPhoto } from "@/components/MealPhoto";

const MealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAnonAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fresh = new URLSearchParams(location.search).get("fresh") === "1";
  const navState = (location.state as { needsMoreInfo?: boolean; clarifyingQuestion?: string } | null) ?? null;
  const { t, lang } = useT();
  const locale = lang === "da" ? daLocale : enUS;

  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const { isTolerated, add: addTolerated } = useTolerated();

  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      const { data, error } = await supabase.from("meals").select("*").eq("id", id).maybeSingle();
      if (error || !data) {
        toast.error(t("meal.notFound"));
        navigate("/history");
        return;
      }
      setMeal(data as unknown as Meal);
      setLoading(false);
    })();
  }, [id, user, navigate, t]);

  const remove = async () => {
    if (!meal) return;
    if (!confirm(t("meal.delete.confirm"))) return;
    const { error } = await supabase.from("meals").delete().eq("id", meal.id);
    if (error) return toast.error(t("meal.delete.error"));
    toast.success(t("meal.delete.success"));
    navigate("/history");
  };

  if (loading || !meal) {
    return (
      <AppShell>
        <div className="space-y-3">
          <div className="h-48 rounded-2xl bg-muted/60 animate-pulse-soft" />
          <div className="h-32 rounded-2xl bg-muted/60 animate-pulse-soft" />
        </div>
      </AppShell>
    );
  }

  const triggersAllTolerated =
    meal.possible_triggers.length > 0 &&
    meal.possible_triggers.every((trigger) => isTolerated(trigger));
  const effectiveLevel = triggersAllTolerated && meal.fodmap_level !== "low" ? "low" : meal.fodmap_level;

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between animate-fade-in">
        <button onClick={() => navigate(-1)} className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft" aria-label={t("meal.back")}>
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          <Button asChild variant="secondary" size="sm" className="rounded-full">
            <Link to={`/meal/${meal.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" /> {t("meal.edit")}
            </Link>
          </Button>
          <Button onClick={remove} variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive-soft">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {meal.photo_url && (
        <MealPhoto value={meal.photo_url} alt={meal.title} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card animate-fade-in-up" />
      )}

      <div className="mt-4 animate-fade-in-up">
        <p className="text-xs text-muted-foreground">
          {format(new Date(meal.meal_at), lang === "da" ? "EEEE d. MMM · HH:mm" : "EEEE, MMM d · h:mm a", { locale })}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold">{meal.title}</h1>
        {meal.description && <p className="mt-1 text-sm text-muted-foreground">{meal.description}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <FodmapBadge level={effectiveLevel} score={meal.fodmap_score} />
          <SeverityChip severity={meal.symptom_severity} />
          {triggersAllTolerated && (
            <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-soft px-2 py-1 text-[10px] text-success">
              <Check className="h-2.5 w-2.5" /> {t("meal.allTriggersTolerated")}
            </span>
          )}
          {meal.edited_at && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">
              <Pencil className="h-2.5 w-2.5" /> {t("meal.edited")} {format(new Date(meal.edited_at), lang === "da" ? "d. MMM" : "MMM d", { locale })}
            </span>
          )}
        </div>
      </div>

      {fresh && navState?.needsMoreInfo && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-warning/30 bg-warning-soft p-3.5 animate-fade-in">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div>
            <p className="text-xs font-medium text-warning">{t("meal.moreInfo.title")}</p>
            <p className="mt-0.5 text-xs text-warning/90">
              {navState.clarifyingQuestion || t("meal.moreInfo.body")}
            </p>
          </div>
        </div>
      )}

      {meal.ai_summary && (
        <Section icon={<Sparkles className="h-4 w-4" />} title={t("meal.summary.title")} subtitle={meal.ai_confidence ? `${meal.ai_confidence} ${t("meal.confidence")}` : undefined}>
          <p className="text-sm">{meal.ai_summary}</p>
        </Section>
      )}

      {meal.ingredients.length > 0 && (
        <Section title={t("meal.ingredients.title")}>
          <ul className="flex flex-wrap gap-1.5">
            {meal.ingredients.map((ingredient, i) => (
              <li key={`${ingredient}-${i}`} className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                {displayIngredient(ingredient, lang)}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {meal.possible_triggers.length > 0 && (
        <Section title={t("meal.triggers.title")}>
          <ul className="flex flex-wrap gap-1.5">
            {meal.possible_triggers.map((trigger, i) => {
              const tolerated = isTolerated(trigger);
              return (
                <li key={`${trigger}-${i}`} className="inline-flex items-center gap-1">
                  <span
                    className={
                      tolerated
                        ? "rounded-full border border-success/30 bg-success-soft px-2.5 py-1 text-xs text-success line-through opacity-80"
                        : "rounded-full border border-warning/30 bg-warning-soft px-2.5 py-1 text-xs text-warning"
                    }
                  >
                    {displayIngredient(trigger, lang)}
                    {tolerated && <Check className="ml-1 inline h-3 w-3" />}
                  </span>
                  {!tolerated && (
                    <button
                      onClick={() => {
                        addTolerated(trigger);
                        toast.success(t("meal.tolerated.toast", { item: displayIngredient(trigger, lang) }));
                      }}
                      className="rounded-full bg-success-soft px-2 py-1 text-[10px] text-success hover:opacity-80"
                      title={t("meal.tolerated.title")}
                    >
                      {t("meal.tolerated.button")}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {t("meal.tolerated.note")}
          </p>
        </Section>
      )}

      {meal.evidence_notes && (
        <Section icon={<BookOpen className="h-4 w-4" />} title={t("meal.evidence.title")} tone="primary">
          <p className="text-sm leading-relaxed">{meal.evidence_notes}</p>
        </Section>
      )}

      {meal.anecdotal_notes && (
        <Section icon={<MessageCircle className="h-4 w-4" />} title={t("meal.anecdotal.title")} tone="muted">
          <p className="text-sm leading-relaxed">{meal.anecdotal_notes}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">{t("meal.anecdotal.note")}</p>
        </Section>
      )}

      <div className="mt-5 rounded-2xl bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{t("meal.symptoms.title")}</h3>
            <p className="text-xs text-muted-foreground">{t("meal.symptoms.body")}</p>
          </div>
          <Button asChild variant="secondary" size="sm" className="rounded-full">
            <Link to={`/meal/${meal.id}/symptoms`}>
              {meal.symptom_severity === "none" && meal.symptom_types.length === 0 ? t("meal.symptoms.add") : t("meal.symptoms.update")}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        {meal.symptom_types.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {meal.symptom_types.map((symptom, i) => (
              <li key={`${symptom}-${i}`} className="rounded-full bg-secondary px-2.5 py-1 text-xs capitalize">
                {t(`symptom.${symptom}`)}
              </li>
            ))}
          </ul>
        )}
        {meal.symptom_started_at && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            {t("meal.symptoms.started")} {format(new Date(meal.symptom_started_at), lang === "da" ? "d. MMM, HH:mm" : "MMM d, h:mm a", { locale })}
          </p>
        )}
        {meal.user_notes && <p className="mt-2 text-sm">{meal.user_notes}</p>}
      </div>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        {t("meal.disclaimer")}
      </p>
    </AppShell>
  );
};

const Section = ({
  icon,
  title,
  subtitle,
  tone = "default",
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  tone?: "default" | "primary" | "muted";
  children: React.ReactNode;
}) => {
  const toneClass =
    tone === "primary"
      ? "bg-primary/5 border border-primary/15"
      : tone === "muted"
      ? "bg-muted/40 border border-border"
      : "bg-card shadow-soft";
  return (
    <section className={`mt-5 rounded-2xl p-4 ${toneClass}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          {icon}
          {title}
        </h3>
        {subtitle && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{subtitle}</span>}
      </div>
      {children}
    </section>
  );
};

export default MealDetail;
