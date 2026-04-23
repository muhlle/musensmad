import { useCallback, useEffect, useState } from "react";

/**
 * Persistent log of ingredients that have ever been associated with symptoms.
 * Survives meal deletion and app reloads.
 * Stored per-user-id in localStorage.
 */
const keyFor = (userId: string | null | undefined) =>
  `ibs-trigger-history${userId ? `:${userId}` : ":anon"}`;

export interface TriggerEntry {
  name: string;
  count: number;
  lastAt: string; // ISO
}

const read = (userId: string | null | undefined): TriggerEntry[] => {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

const write = (userId: string | null | undefined, list: TriggerEntry[]) => {
  localStorage.setItem(keyFor(userId), JSON.stringify(list));
  window.dispatchEvent(new Event("trigger-history-changed"));
};

export const useTriggerHistory = (userId: string | null | undefined) => {
  const [history, setHistory] = useState<TriggerEntry[]>(() => read(userId));

  useEffect(() => {
    setHistory(read(userId));
    const sync = () => setHistory(read(userId));
    window.addEventListener("trigger-history-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("trigger-history-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [userId]);

  /** Merge new triggers from a meal into the persistent log */
  const record = useCallback(
    (names: string[], at: string) => {
      if (!names.length) return;
      const current = read(userId);
      const map = new Map(current.map((e) => [e.name, e]));
      for (const raw of names) {
        const k = raw.trim().toLowerCase();
        if (!k) continue;
        const existing = map.get(k);
        if (existing) {
          existing.count += 1;
          if (new Date(at) > new Date(existing.lastAt)) existing.lastAt = at;
        } else {
          map.set(k, { name: k, count: 1, lastAt: at });
        }
      }
      write(userId, Array.from(map.values()));
    },
    [userId],
  );

  const remove = useCallback(
    (name: string) => {
      const k = name.trim().toLowerCase();
      write(
        userId,
        read(userId).filter((e) => e.name !== k),
      );
    },
    [userId],
  );

  const clear = useCallback(() => write(userId, []), [userId]);

  return { history, record, remove, clear };
};
