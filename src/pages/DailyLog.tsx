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
import { enUS, da as daLocale } from "date-fns/locale";
import { useT } from "@/lib/i18n";

const DailyLog = () => {
  const navigate = useNavigate();
  const { user } = useAnonAuth();
  const { t, lang } = useT();
  const [dateKey, setDateKey] = useState<string>(todayKey());
  const { get, upsert, addBowel, removeBowel } = useDailyLog(user?.id);
  const entry = get(dateKey);

  const locale = lang === "da" ? daLocale : enUS;

  const bristolDesc = (n: number) => t(`daily.bristol.${n}`);

  const isToday = dateKey === todayKey();
  const dateLabel = useMemo(() => {
    try {
      return format(parseISO(dateKey), "EEE, MMM d", { locale });
    } catch {
      return dateKey;
    }
  }, [dateKey, locale]);

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
    toast.success(t("daily.bm.saved"));
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
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("daily.kicker")}</p>
          <h1 className="font-display text-xl font-semibold">{t("daily.title")}</h1>
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
          {dateLabel} {isToday && <span className="text-xs text-muted-foreground">{t("daily.today")}</span>}
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

      <p className="mb-4 text-[11px] text-muted-foreground">{t("daily.intro")}</p>

      {/* Stress */}
      <Card title={t("daily.stress")}>
        <SliderRow
          value={entry.stress ?? 0}
          onChange={(v) => upsert(dateKey, { stress: v })}
          left={t("daily.stress.left")}
          right={t("daily.stress.right")}
        />
      </Card>

      {/* Anxiety */}
      <Card title={t("daily.anxiety")}>
        <SliderRow
          value={entry.anxiety ?? 0}
          onChange={(v) => upsert(dateKey, { anxiety: v })}
          left={t("daily.anxiety.left")}
          right={t("daily.anxiety.right")}
        />
      </Card>

      {/* Sleep */}
      <Card title={t("daily.sleep")}>
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">{t("daily.sleep.hours")}</p>
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
              placeholder={t("daily.sleep.hours.placeholder")}
            />
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">{t("daily.sleep.quality")}</p>
            <SliderRow
              value={entry.sleepQuality ?? 0}
              onChange={(v) => upsert(dateKey, { sleepQuality: v })}
              left={t("daily.sleep.quality.left")}
              right={t("daily.sleep.quality.right")}
            />
          </div>
        </div>
      </Card>

      {/* Exercise */}
      <Card title={t("daily.exercise")}>
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
          placeholder={t("daily.exercise.placeholder")}
        />
      </Card>

      {/* Toggles */}
      <Card title={t("daily.factors")}>
        <ToggleRow
          label={t("daily.factors.alcohol")}
          checked={!!entry.alcohol}
          onChange={(v) => upsert(dateKey, { alcohol: v })}
        />
        <ToggleRow
          label={t("daily.factors.caffeine")}
          checked={!!entry.caffeine}
          onChange={(v) => upsert(dateKey, { caffeine: v })}
        />
        <ToggleRow
          label={t("daily.factors.illness")}
          checked={!!entry.illness}
          onChange={(v) => upsert(dateKey, { illness: v })}
        />
        <ToggleRow
          label={t("daily.factors.menstrual")}
          checked={!!entry.menstrual}
          onChange={(v) => upsert(dateKey, { menstrual: v })}
        />
      </Card>

      {/* Medication */}
      <Card title={t("daily.medication")}>
        <Input
          value={entry.medication ?? ""}
          onChange={(e) => upsert(dateKey, { medication: e.target.value || undefined })}
          placeholder={t("daily.medication.placeholder")}
          className="rounded-xl"
        />
      </Card>

      {/* Notes */}
      <Card title={t("daily.notes")}>
        <Textarea
          value={entry.notes ?? ""}
          onChange={(e) => upsert(dateKey, { notes: e.target.value.slice(0, 800) || undefined })}
          placeholder={t("daily.notes.placeholder")}
          className="min-h-[70px] resize-none rounded-2xl bg-card"
        />
      </Card>

      {/* Bowel movements */}
      <Card title={t("daily.bm.title")}>
        {entry.bowelMovements && entry.bowelMovements.length > 0 && (
          <ul className="mb-3 space-y-2">
            {entry.bowelMovements.map((b, i) => (
              <li key={i} className="flex items-start justify-between gap-2 rounded-xl border border-border bg-background p-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {t("daily.bm.type")} {b.bristol}{" "}
                    <span className="font-normal text-muted-foreground">· {format(new Date(b.at), "HH:mm", { locale })}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">{bristolDesc(b.bristol)}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {b.urgency && <Tag>{t("daily.bm.tag.urgency")}</Tag>}
                    {b.painful && <Tag>{t("daily.bm.tag.painful")}</Tag>}
                    {b.incomplete && <Tag>{t("daily.bm.tag.incomplete")}</Tag>}
                    {b.relief && <Tag tone="success">{t("daily.bm.tag.relief")}</Tag>}
                    {b.alarm && <Tag tone="destructive">{t("daily.bm.tag.alarm")}</Tag>}
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
          <p className="text-xs font-medium">{t("daily.bm.log")}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{t("daily.bm.scale")} — {bristolDesc(bm.bristol)}</p>
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
            <ToggleRow label={t("daily.bm.urgency")} checked={bm.urgency} onChange={(v) => setBm({ ...bm, urgency: v })} />
            <ToggleRow label={t("daily.bm.painful")} checked={bm.painful} onChange={(v) => setBm({ ...bm, painful: v })} />
            <ToggleRow label={t("daily.bm.incomplete")} checked={bm.incomplete} onChange={(v) => setBm({ ...bm, incomplete: v })} />
            <ToggleRow label={t("daily.bm.relief")} checked={bm.relief} onChange={(v) => setBm({ ...bm, relief: v })} />
            <ToggleRow label={t("daily.bm.alarm")} checked={bm.alarm} onChange={(v) => setBm({ ...bm, alarm: v })} />
          </div>
          {bm.alarm && (
            <div className="mt-2 flex items-start gap-2 rounded-lg bg-destructive-soft p-2 text-[11px] text-destructive">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {t("daily.bm.alarm.note")}
            </div>
          )}
          <Button onClick={saveBM} size="sm" className="mt-3 w-full rounded-full">
            <Plus className="h-3.5 w-3.5" /> {t("daily.bm.button")}
          </Button>
        </div>
      </Card>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">{t("daily.foot")}</p>
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
