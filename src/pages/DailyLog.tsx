import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { useDailyLog, todayKey, BowelMovement } from "@/hooks/useDailyLog";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { format, addDays, parseISO } from "date-fns";

const BRISTOL_DESCRIPTIONS: Record<number, string> = {
  1: "Separate hard lumps (constipation)",
  2: "Lumpy and sausage-like",
  3: "Sausage with cracks",
  4: "Smooth, soft sausage (ideal)",
  5: "Soft blobs with clear edges",
  6: "Mushy, ragged edges",
  7: "Entirely liquid (diarrhea)",
};

const DailyLog = () => {
  const navigate = useNavigate();
  const { user } = useAnonAuth();
  const [dateKey, setDateKey] = useState<string>(todayKey());
  const { get, upsert, addBowel, removeBowel } = useDailyLog(user?.id);
  const entry = get(dateKey);

  const isToday = dateKey === todayKey();
  const dateLabel = useMemo(() => {
    try {
      return format(parseISO(dateKey), "EEE, MMM d");
    } catch {
      return dateKey;
    }
  }, [dateKey]);

  const shiftDay = (delta: number) => {
    const d = addDays(parseISO(dateKey), delta);
    if (d > new Date()) return;
    const pad = (n: number) => `${n}`.padStart(2, "0");
    setDateKey(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  };

  // Local UI state for new bowel movement
  const [bm, setBm] = useState<BowelMovement>({
    bristol: 4,
    urgency: false,
    painful: false,
    incomplete: false,
    relief: false,
    alarm: false,
    at: new Date().toISOString(),
  });

  const saveBM = () => {
    addBowel(dateKey, { ...bm, at: new Date().toISOString() });
    toast.success("Bowel movement logged");
    setBm({ bristol: 4, urgency: false, painful: false, incomplete: false, relief: false, alarm: false, at: new Date().toISOString() });
  };

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
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Daily log</p>
          <h1 className="font-display text-xl font-semibold">How was your day?</h1>
        </div>
      </div>

      {/* Date switcher */}
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-card p-2 shadow-soft">
        <button
          onClick={() => shiftDay(-1)}
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-medium">
          {dateLabel} {isToday && <span className="text-xs text-muted-foreground">(today)</span>}
        </p>
        <button
          onClick={() => shiftDay(1)}
          disabled={isToday}
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted disabled:opacity-30"
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mb-4 text-[11px] text-muted-foreground">
        Stress, sleep and other factors often influence IBS symptoms. Tracking them helps separate food triggers from confounders.
      </p>

      {/* Stress */}
      <Card title="Stress level">
        <SliderRow
          value={entry.stress ?? 0}
          onChange={(v) => upsert(dateKey, { stress: v })}
          left="Calm"
          right="Very stressed"
        />
      </Card>

      {/* Anxiety */}
      <Card title="Anxiety">
        <SliderRow
          value={entry.anxiety ?? 0}
          onChange={(v) => upsert(dateKey, { anxiety: v })}
          left="None"
          right="High"
        />
      </Card>

      {/* Sleep */}
      <Card title="Sleep">
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Hours slept</p>
            <Input
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={entry.sleepHours ?? ""}
              onChange={(e) =>
                upsert(dateKey, {
                  sleepHours: e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="rounded-xl"
              placeholder="e.g. 7.5"
            />
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Sleep quality</p>
            <SliderRow
              value={entry.sleepQuality ?? 0}
              onChange={(v) => upsert(dateKey, { sleepQuality: v })}
              left="Poor"
              right="Excellent"
            />
          </div>
        </div>
      </Card>

      {/* Exercise */}
      <Card title="Exercise (minutes)">
        <Input
          type="number"
          min={0}
          step={5}
          value={entry.exerciseMinutes ?? ""}
          onChange={(e) =>
            upsert(dateKey, {
              exerciseMinutes: e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
          className="rounded-xl"
          placeholder="e.g. 30"
        />
      </Card>

      {/* Toggles */}
      <Card title="Other factors">
        <ToggleRow
          label="Alcohol"
          checked={!!entry.alcohol}
          onChange={(v) => upsert(dateKey, { alcohol: v })}
        />
        <ToggleRow
          label="Caffeine"
          checked={!!entry.caffeine}
          onChange={(v) => upsert(dateKey, { caffeine: v })}
        />
        <ToggleRow
          label="Illness / infection"
          checked={!!entry.illness}
          onChange={(v) => upsert(dateKey, { illness: v })}
        />
        <ToggleRow
          label="Menstrual cycle"
          checked={!!entry.menstrual}
          onChange={(v) => upsert(dateKey, { menstrual: v })}
        />
      </Card>

      {/* Medication */}
      <Card title="Medication today">
        <Input
          value={entry.medication ?? ""}
          onChange={(e) => upsert(dateKey, { medication: e.target.value || undefined })}
          placeholder="e.g. probiotic, antispasmodic"
          className="rounded-xl"
        />
      </Card>

      {/* Notes */}
      <Card title="Notes">
        <Textarea
          value={entry.notes ?? ""}
          onChange={(e) => upsert(dateKey, { notes: e.target.value.slice(0, 800) || undefined })}
          placeholder="Anything else worth remembering"
          className="min-h-[70px] resize-none rounded-2xl bg-card"
        />
      </Card>

      {/* Bowel movements */}
      <Card title="Bowel movements">
        {entry.bowelMovements && entry.bowelMovements.length > 0 && (
          <ul className="mb-3 space-y-2">
            {entry.bowelMovements.map((b, i) => (
              <li key={i} className="flex items-start justify-between gap-2 rounded-xl border border-border bg-background p-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    Type {b.bristol}{" "}
                    <span className="font-normal text-muted-foreground">· {format(new Date(b.at), "h:mm a")}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">{BRISTOL_DESCRIPTIONS[b.bristol]}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {b.urgency && <Tag>urgency</Tag>}
                    {b.painful && <Tag>painful</Tag>}
                    {b.incomplete && <Tag>incomplete</Tag>}
                    {b.relief && <Tag tone="success">relief after</Tag>}
                    {b.alarm && <Tag tone="destructive">⚠ blood/mucus</Tag>}
                  </div>
                </div>
                <button
                  onClick={() => removeBowel(dateKey, i)}
                  className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive-soft"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-xl border border-dashed border-border p-3">
          <p className="text-xs font-medium">Log a movement</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Bristol Stool Scale — {BRISTOL_DESCRIPTIONS[bm.bristol]}</p>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                onClick={() => setBm({ ...bm, bristol: n })}
                className={`rounded-lg py-2 text-xs font-medium transition-smooth ${
                  bm.bristol === n
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            <ToggleRow label="Urgency" checked={bm.urgency} onChange={(v) => setBm({ ...bm, urgency: v })} />
            <ToggleRow label="Painful" checked={bm.painful} onChange={(v) => setBm({ ...bm, painful: v })} />
            <ToggleRow label="Incomplete evacuation" checked={bm.incomplete} onChange={(v) => setBm({ ...bm, incomplete: v })} />
            <ToggleRow label="Felt relief after" checked={bm.relief} onChange={(v) => setBm({ ...bm, relief: v })} />
            <ToggleRow label="Blood or mucus present" checked={bm.alarm} onChange={(v) => setBm({ ...bm, alarm: v })} />
          </div>
          {bm.alarm && (
            <div className="mt-2 flex items-start gap-2 rounded-lg bg-destructive-soft p-2 text-[11px] text-destructive">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Blood or mucus in stool should be evaluated by a doctor.
            </div>
          )}
          <Button onClick={saveBM} size="sm" className="mt-3 w-full rounded-full">
            <Plus className="h-3.5 w-3.5" /> Log movement
          </Button>
        </div>
      </Card>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        Daily entries are saved to this device. They power your trigger insights.
      </p>
    </AppShell>
  );
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-3 rounded-2xl bg-card p-4 shadow-soft animate-fade-in-up">
    <h3 className="mb-2 text-sm font-medium">{title}</h3>
    {children}
  </section>
);

const SliderRow = ({
  value,
  onChange,
  left,
  right,
}: {
  value: number;
  onChange: (v: number) => void;
  left: string;
  right: string;
}) => (
  <div>
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>{left}</span>
      <span className="font-medium text-foreground">{value} / 10</span>
      <span>{right}</span>
    </div>
    <Slider
      value={[value]}
      onValueChange={(v) => onChange(v[0] ?? 0)}
      min={0}
      max={10}
      step={1}
      className="mt-2"
    />
  </div>
);

const ToggleRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm">{label}</span>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const Tag = ({ children, tone }: { children: React.ReactNode; tone?: "success" | "destructive" }) => {
  const cls =
    tone === "success"
      ? "bg-success-soft text-success"
      : tone === "destructive"
      ? "bg-destructive-soft text-destructive"
      : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{children}</span>;
};

export default DailyLog;
