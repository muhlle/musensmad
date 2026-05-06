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
      toast.error(t("settings.signInError"));
      return;
    }
    if (!result.redirected) {
      toast.success(t("settings.signedInToast"));
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return toast.error(t("settings.signOutError"));
    toast.success(t("settings.signedOutToast"));
  };

  const replayOnboarding = () => {
    localStorage.removeItem("ibs-onboarded");
    navigate("/onboarding");
  };

  const wipeData = async () => {
    if (!user) return;
    if (!confirm(t("settings.deleteConfirm"))) return;
    const { error } = await supabase.from("meals").delete().eq("user_id", user.id);
    if (error) return toast.error(t("settings.deleteError"));
    toast.success(t("settings.deleteSuccess"));
  };

  return (
    <AppShell>
      <header className="mb-5 animate-fade-in">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("settings.kicker")}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">{t("settings.title")}</h1>
      </header>

      <section className="mb-4 rounded-2xl bg-card p-4 shadow-soft">
        <h3 className="flex items-center gap-1.5 text-sm font-medium">
          <Languages className="h-4 w-4 text-primary" /> {t("settings.lang.title")}
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setLang("en")}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition-smooth ${
              lang === "en"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:border-primary/50"
            }`}
          >
            {t("settings.lang.en")}
          </button>
          <button
            onClick={() => setLang("da")}
            className={`rounded-xl border px-3 py-2 text-sm font-medium transition-smooth ${
              lang === "da"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:border-primary/50"
            }`}
          >
            {t("settings.lang.da")}
          </button>
        </div>
      </section>

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
