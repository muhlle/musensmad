import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

/**
 * Lightweight anonymous-auth bootstrap.
 * Each device gets a Supabase anonymous session so RLS works
 * without forcing the user through a sign-up flow.
 */
export function useAnonAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (cancelled) return;
      setSession(s);
      setUser(s?.user ?? null);
    });

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setLoading(false);
        return;
      }

      // No session — sign in anonymously.
      const { data: anon, error } = await supabase.auth.signInAnonymously();
      if (cancelled) return;
      if (error) {
        console.error("Anonymous sign-in failed", error);
      } else {
        setSession(anon.session);
        setUser(anon.user);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading };
}
