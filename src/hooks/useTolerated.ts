import { useCallback, useEffect, useState } from "react";

const KEY = "ibs-tolerated-ingredients";

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map((s) => String(s).toLowerCase()) : [];
  } catch {
    return [];
  }
};

const write = (list: string[]) => {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("tolerated-changed"));
};

export const useTolerated = () => {
  const [tolerated, setTolerated] = useState<string[]>(() => read());

  useEffect(() => {
    const sync = () => setTolerated(read());
    window.addEventListener("tolerated-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tolerated-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((name: string) => {
    const k = name.trim().toLowerCase();
    if (!k) return;
    const next = Array.from(new Set([...read(), k]));
    write(next);
  }, []);

  const remove = useCallback((name: string) => {
    const k = name.trim().toLowerCase();
    write(read().filter((x) => x !== k));
  }, []);

  const isTolerated = useCallback(
    (name: string) => tolerated.includes(name.trim().toLowerCase()),
    [tolerated],
  );

  const anyTolerated = useCallback(
    (names: string[]) => names.some((n) => tolerated.includes(n.trim().toLowerCase())),
    [tolerated],
  );

  return { tolerated, add, remove, isTolerated, anyTolerated };
};
