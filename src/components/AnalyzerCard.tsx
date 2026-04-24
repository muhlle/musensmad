import { useState } from "react";
import { Brain, ChevronDown, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Meal } from "@/lib/meal";
import { DailyEntry } from "@/hooks/useDailyLog";
import { toast } from "sonner";

interface AnalyzerTrigger {
  name: string;
  fodmap_group: string;
  suspicion: string;
  why: string;
  weakens: string;
  confidence: "low" | "moderate" | "high";
  exposures: number;
  reactions: number;
  next_step: string;
}

interface AnalyzerResult {
  summary: string;
  data_quality: "low" | "moderate" | "high";
  data_quality_reason: string;
  triggers: AnalyzerTrigger[];
  red_flags: string[];
  guidance: string[];
}

interface Props {
  meals: Meal[];
  daily: Record<string, DailyEntry>;
}

export const AnalyzerCard = ({ meals, daily }: Props) => {
  const { t, lang } = useT();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzerResult | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const dailyArr = Object.values(daily);
  const days = dailyArr.length;
  const mealCount = meals.length;
  const enoughData = days >= 14 && mealCount >= 14;
  const canRun = mealCount >= 3;

  const run = async () => {
    if (!canRun) {
      toast.error(t("analyzer.noData"));
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-analyzer", {
        body: {
          meals: meals.map((m) => ({
            id: m.id,
            title: m.title,
            meal_at: m.meal_at,
            ingredients: m.ingredients,
            possible_triggers: m.possible_triggers,
            fodmap_level: m.fodmap_level,
            fodmap_score: m.fodmap_score,
            symptom_severity: m.symptom_severity,
            symptom_types: m.symptom_types,
            symptom_started_at: m.symptom_started_at,
            user_notes: m.user_notes,
          })),
          daily: dailyArr,
          lang,
        },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      setResult(data as AnalyzerResult);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : t("analyzer.error"));
    } finally {
      setLoading(false);
    }
  };

  const conf = (c: "low" | "moderate" | "high") =>
    c === "high"
      ? "bg-warning-soft text-warning"
      : c === "moderate"
      ? "bg-primary/10 text-primary"
      : "bg-muted text-muted-foreground";

  return (
    <section className="mt-5 rounded-2xl border border-primary/30 bg-card p-4 shadow-soft animate-fade-in-up">
      <h3 className="flex items-center gap-1.5 font-medium">
        <Brain className="h-4 w-4 text-primary" /> {t("analyzer.title")}
      </h3>
      <p className="mt-1 text-[11px] text-muted-foreground">{t("analyzer.subtitle")}</p>

      <div
        className={`mt-3 rounded-xl p-3 text-[11px] ${
          enoughData
            ? "bg-success-soft text-success"
            : "bg-warning-soft text-warning"
        }`}
      >
        <p className="font-medium">{t("analyzer.minData.title")}</p>
        <p className="mt-1 opacity-90">
          {t("analyzer.minData.body", { days, meals: mealCount })}
        </p>
        {!enoughData && <p className="mt-1 opacity-90">{t("analyzer.minData.warn")}</p>}
      </div>

      <button
        onClick={run}
        disabled={loading || !canRun}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-card transition-smooth hover:opacity-90 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {t("analyzer.running")}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" /> {result ? t("analyzer.again") : t("analyzer.run")}
          </>
        )}
      </button>

      {!result && !loading && (
        <p className="mt-3 text-center text-[11px] text-muted-foreground">{t("analyzer.empty")}</p>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-background p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t("analyzer.summary")}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{result.summary}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              <span className="font-medium">{t("analyzer.dataQuality")}: </span>
              <span className={`rounded-full px-1.5 py-0.5 ${conf(result.data_quality)}`}>
                {result.data_quality}
              </span>{" "}
              — {result.data_quality_reason}
            </p>
          </div>

          {result.red_flags.length > 0 && (
            <div className="rounded-xl border border-destructive/30 bg-destructive-soft p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-destructive">
                <ShieldAlert className="h-3.5 w-3.5" /> {t("analyzer.redFlags")}
              </p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[11px] text-destructive/90">
                {result.red_flags.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {result.triggers.map((trg, idx) => {
            const open = openIdx === idx;
            return (
              <div key={`${trg.name}-${idx}`} className="rounded-xl border border-border bg-background">
                <button
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="flex w-full items-start justify-between gap-2 p-3 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium capitalize">
                      {trg.name}
                      {trg.fodmap_group && trg.fodmap_group !== "unknown" && (
                        <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                          {trg.fodmap_group.replace("_", " ")}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{trg.suspicion}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {trg.reactions}/{trg.exposures} • {t("analyzer.confidence")}:{" "}
                      <span className={`rounded-full px-1.5 py-0.5 ${conf(trg.confidence)}`}>
                        {trg.confidence}
                      </span>
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open && (
                  <div className="space-y-2 border-t border-border px-3 pb-3 pt-2 text-[11px]">
                    <div>
                      <p className="font-medium text-foreground">{t("analyzer.why")}</p>
                      <p className="text-muted-foreground">{trg.why}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{t("analyzer.weakens")}</p>
                      <p className="text-muted-foreground">{trg.weakens}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{t("analyzer.next")}</p>
                      <p className="text-muted-foreground">{trg.next_step}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {result.guidance.length > 0 && (
            <ul className="rounded-xl bg-primary-soft p-3 text-[11px] text-foreground/80 space-y-1">
              {result.guidance.map((g, i) => (
                <li key={i}>• {g}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="mt-3 text-center text-[10px] text-muted-foreground">{t("analyzer.disclaimer")}</p>
    </section>
  );
};
