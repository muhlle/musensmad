import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { Meal, SymptomSeverity, SYMPTOM_TYPES } from "@/lib/meal";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const severities: { value: SymptomSeverity; label: string; color: string }[] = [
  { value: "none", label: "No symptoms", color: "data-[selected=true]:bg-success data-[selected=true]:text-success-foreground data-[selected=true]:border-success" },
  { value: "mild", label: "Mild", color: "data-[selected=true]:bg-warning/70 data-[selected=true]:text-warning-foreground data-[selected=true]:border-warning" },
  { value: "moderate", label: "Moderate", color: "data-[selected=true]:bg-warning data-[selected=true]:text-warning-foreground data-[selected=true]:border-warning" },
  { value: "severe", label: "Severe", color: "data-[selected=true]:bg-destructive data-[selected=true]:text-destructive-foreground data-[selected=true]:border-destructive" },
];

const SymptomLog = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAnonAuth();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [severity, setSeverity] = useState<SymptomSeverity>("none");
  const [types, setTypes] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      const { data } = await supabase.from("meals").select("*").eq("id", id).maybeSingle();
      if (!data) {
        toast.error("Meal not found");
        navigate("/history");
        return;
      }
      const m = data as unknown as Meal;
      setMeal(m);
      setSeverity(m.symptom_severity);
      setTypes(m.symptom_types);
      setStartedAt(m.symptom_started_at ? toLocalInput(m.symptom_started_at) : "");
      setNotes(m.user_notes ?? "");
    })();
  }, [id, user, navigate]);

  const toLocalInput = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => `${n}`.padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const toggle = (t: string) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const save = async () => {
    if (!meal) return;
    setSaving(true);
    const { error } = await supabase
      .from("meals")
      .update({
        symptom_severity: severity,
        symptom_types: severity === "none" ? [] : types,
        symptom_started_at: severity === "none" || !startedAt ? null : new Date(startedAt).toISOString(),
        user_notes: notes.trim() || null,
      })
      .eq("id", meal.id);
    if (error) {
      console.error(error);
      toast.error("Couldn't save");
      setSaving(false);
      return;
    }
    toast.success("Symptoms saved");
    navigate(`/meal/${meal.id}`);
  };

  if (!meal) {
    return (
      <AppShell>
        <div className="h-48 rounded-2xl bg-muted/60 animate-pulse-soft" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3 animate-fade-in">
        <button onClick={() => navigate(-1)} className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Symptom log</p>
          <h1 className="font-display text-xl font-semibold">{meal.title}</h1>
        </div>
      </div>

      <section className="mt-4">
        <h2 className="text-sm font-medium">How are you feeling?</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {severities.map((s) => (
            <button
              key={s.value}
              type="button"
              data-selected={severity === s.value}
              onClick={() => setSeverity(s.value)}
              className={cn(
                "rounded-2xl border-2 border-border bg-card px-3 py-3 text-sm font-medium transition-smooth",
                s.color,
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {severity !== "none" && (
        <>
          <section className="mt-5 animate-fade-in">
            <h2 className="text-sm font-medium">Which symptoms?</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {SYMPTOM_TYPES.map((t) => {
                const active = types.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggle(t)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-smooth",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/40",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-5">
            <label htmlFor="started" className="text-sm font-medium">
              When did symptoms start?
            </label>
            <input
              id="started"
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm"
            />
          </section>
        </>
      )}

      <section className="mt-5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 600))}
          placeholder="Anything else to remember"
          className="mt-2 min-h-[80px] resize-none rounded-2xl bg-card"
        />
      </section>

      <Button onClick={save} disabled={saving} size="lg" className="mt-7 h-12 w-full rounded-full">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save symptoms"}
      </Button>
    </AppShell>
  );
};

export default SymptomLog;
