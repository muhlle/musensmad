import { useCallback, useEffect, useState } from "react";

/**
 * Per-day lifestyle + bowel movement log.
 * Stored in localStorage so existing user data (meals in DB) isn't touched.
 * Key: ibs-daily-log:<userId>  → Record<YYYY-MM-DD, DailyEntry>
 */

export interface BowelMovement {
  bristol: number; // 1-7
  urgency: boolean;
  painful: boolean;
  incomplete: boolean;
  relief: boolean;
  alarm: boolean; // blood / mucus
  at: string; // ISO time
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  stress?: number; // 0-10
  anxiety?: number; // 0-10
  sleepHours?: number;
  sleepQuality?: number; // 0-10
  exerciseMinutes?: number;
  alcohol?: boolean;
  caffeine?: boolean;
  medication?: string;
  illness?: boolean;
  menstrual?: boolean;
  bowelMovements?: BowelMovement[];
  notes?: string;
}

const keyFor = (uid: string | null | undefined) =>
  `ibs-daily-log${uid ? `:${uid}` : ":anon"}`;

export const todayKey = () => {
  const d = new Date();
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const read = (uid: string | null | undefined): Record<string, DailyEntry> => {
  try {
    const raw = localStorage.getItem(keyFor(uid));
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
};

const write = (uid: string | null | undefined, data: Record<string, DailyEntry>) => {
  localStorage.setItem(keyFor(uid), JSON.stringify(data));
  window.dispatchEvent(new Event("daily-log-changed"));
};

export const useDailyLog = (uid: string | null | undefined) => {
  const [entries, setEntries] = useState<Record<string, DailyEntry>>(() => read(uid));

  useEffect(() => {
    setEntries(read(uid));
    const sync = () => setEntries(read(uid));
    window.addEventListener("daily-log-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("daily-log-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [uid]);

  const get = useCallback(
    (date: string): DailyEntry => entries[date] ?? { date },
    [entries],
  );

  const upsert = useCallback(
    (date: string, patch: Partial<DailyEntry>) => {
      const current = read(uid);
      const existing = current[date] ?? { date };
      current[date] = { ...existing, ...patch, date };
      write(uid, current);
    },
    [uid],
  );

  const addBowel = useCallback(
    (date: string, bm: BowelMovement) => {
      const current = read(uid);
      const existing = current[date] ?? { date };
      const list = existing.bowelMovements ?? [];
      current[date] = { ...existing, date, bowelMovements: [...list, bm] };
      write(uid, current);
    },
    [uid],
  );

  const removeBowel = useCallback(
    (date: string, idx: number) => {
      const current = read(uid);
      const existing = current[date];
      if (!existing?.bowelMovements) return;
      const next = existing.bowelMovements.filter((_, i) => i !== idx);
      current[date] = { ...existing, bowelMovements: next };
      write(uid, current);
    },
    [uid],
  );

  const list = useCallback(
    (sinceDays?: number): DailyEntry[] => {
      const all = Object.values(entries).sort((a, b) => b.date.localeCompare(a.date));
      if (!sinceDays) return all;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - sinceDays);
      const cutoffKey = `${cutoff.getFullYear()}-${`${cutoff.getMonth() + 1}`.padStart(2, "0")}-${`${cutoff.getDate()}`.padStart(2, "0")}`;
      return all.filter((e) => e.date >= cutoffKey);
    },
    [entries],
  );

  return { entries, get, upsert, addBowel, removeBowel, list };
};
