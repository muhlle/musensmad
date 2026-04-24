import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { lovable } from "@/integrations/lovable";
import { useNavigate } from "react-router-dom";
import { Info, Languages, LogIn, LogOut, RotateCcw, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";

const Settings = () => {
  const { user } = useAnonAuth();
  const navigate = useNavigate();
  const { t, lang, setLang } = useT();
  const isAnonymous = !user || (user as { is_anonymous?: boolean }).is_anonymous === true;
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email ||
    null;

  const signInWithGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Couldn't sign in with Google");
      return;
    }
    if (!result.redirected) {
      toast.success("Signed in with Google");
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return toast.error("Couldn't sign out");
    toast.success("Signed out");
  };

  const replayOnboarding = () => {
    localStorage.removeItem("ibs-onboarded");
    navigate("/onboarding");
  };

  const wipeData = async () => {
    if (!user) return;
    if (!confirm("Delete ALL your meal data? This cannot be undone.")) return;
    const { error } = await supabase.from("meals").delete().eq("user_id", user.id);
    if (error) return toast.error("Couldn't delete data");
    toast.success("All data deleted");
  };

  return (
    <AppShell>
      <header className="mb-5 animate-fade-in">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Settings</h1>
      </header>

      <section className="rounded-2xl bg-card p-4 shadow-soft">
        <p className="text-xs text-muted-foreground">
          {isAnonymous ? "Anonymous account" : "Signed in"}
        </p>
        <p className="mt-1 truncate text-sm font-medium text-foreground">
          {displayName ?? "Local-only device"}
        </p>
        <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{user?.id ?? "—"}</p>
        {isAnonymous && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Sign in with Google to keep your meal history safe across devices.
          </p>
        )}
      </section>

      <section className="mt-4 space-y-2">
        {isAnonymous ? (
          <Button
            variant="default"
            className="w-full justify-start rounded-xl"
            onClick={signInWithGoogle}
          >
            <LogIn className="h-4 w-4" /> Sign in with Google
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="w-full justify-start rounded-xl"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        )}
        <Button variant="secondary" className="w-full justify-start rounded-xl" onClick={replayOnboarding}>
          <RotateCcw className="h-4 w-4" /> Replay onboarding
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl text-destructive hover:bg-destructive-soft hover:text-destructive"
          onClick={wipeData}
        >
          <Trash2 className="h-4 w-4" /> Delete all my data
        </Button>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-card/60 p-4">
        <h3 className="flex items-center gap-1.5 text-sm font-medium">
          <ShieldAlert className="h-4 w-4 text-warning" /> Important disclaimer
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          This app is a personal tracking tool. It does <span className="font-medium text-foreground">not</span> provide medical diagnosis, treatment, or advice. Estimates based on photos and descriptions can be inaccurate. Always consult a qualified healthcare professional for any IBS-related concerns.
        </p>
      </section>

      <section className="mt-4 rounded-2xl bg-primary-soft p-4">
        <h3 className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <Info className="h-4 w-4" /> About FODMAPs
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-foreground/80">
          FODMAPs are short-chain carbohydrates that can trigger IBS symptoms. The low-FODMAP approach is one widely studied dietary tool. Your individual tolerance may vary.
        </p>
      </section>
    </AppShell>
  );
};

export default Settings;
