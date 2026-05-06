import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { useDailyLog } from "@/hooks/useDailyLog";
import { useTolerated } from "@/hooks/useTolerated";
import { Meal } from "@/lib/meal";
import { useT } from "@/lib/i18n";
import { analyseTriggers } from "@/lib/triggerAnalysis";
import { buildDoctorReport, downloadText } from "@/lib/report";
import { ArrowLeft, Download, FileText, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const Report = () => {
  const { user } = useAnonAuth();
  const navigate = useNavigate();
  const { t } = useT();
  const { entries } = useDailyLog(user?.id);
  const { tolerated } = useTolerated();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<string>("");
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    if (loading) return;
    const dailyList = Object.values(entries);
    const correlations = analyseTriggers(meals, entries);
    setReport(buildDoctorReport(meals, dailyList, correlations, tolerated));
  }, [meals, entries, tolerated, loading]);

  const download = () => {
    downloadText(`ibs-summary-${format(new Date(), "yyyy-MM-dd")}.md`, report);
    toast.success(t("report.downloaded"));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      toast.success(t("report.copiedToast"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("report.copyError"));
    }
  };

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft"
          aria-label={t("common.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("report.kicker")}</p>
          <h1 className="font-display text-xl font-semibold">{t("report.title")}</h1>
        </div>
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        {t("report.intro")}
      </p>

      <div className="mb-4 flex gap-2">
        <Button onClick={download} size="sm" className="flex-1 rounded-full">
          <Download className="h-3.5 w-3.5" /> {t("report.download")}
        </Button>
        <Button onClick={copy} size="sm" variant="secondary" className="flex-1 rounded-full">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? t("report.copied") : t("report.copy")}
        </Button>
      </div>

      <section className="rounded-2xl bg-card p-4 shadow-soft">
        <div className="mb-2 flex items-center gap-1.5 text-sm font-medium">
          <FileText className="h-4 w-4 text-primary" />
          {t("report.preview")}
        </div>
        {loading ? (
          <div className="h-40 animate-pulse-soft rounded-xl bg-muted/60" />
        ) : (
          <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed text-foreground/90">
            {report}
          </pre>
        )}
      </section>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        {t("report.foot")}
      </p>
    </AppShell>
  );
};

export default Report;
