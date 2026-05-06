import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useT } from "@/lib/i18n";

const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useT();

  useEffect(() => {
    if (localStorage.getItem("ibs-onboarded") === "1") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const finish = () => {
    localStorage.setItem("ibs-onboarded", "1");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <div className="flex-1 flex flex-col justify-center animate-fade-in-up">
          <div className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> {t("onboarding.welcome")}
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight">
            {t("onboarding.headlinePart1")} <span className="text-primary">{t("onboarding.headlineHighlight")}</span> {t("onboarding.headlinePart2")}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            {t("onboarding.intro")}
          </p>

          <ul className="mt-8 space-y-4">
            <Feature icon={<Camera className="h-4 w-4" />} title={t("onboarding.f1.title")}>
              {t("onboarding.f1.body")}
            </Feature>
            <Feature icon={<Sparkles className="h-4 w-4" />} title={t("onboarding.f2.title")}>
              {t("onboarding.f2.body")}
            </Feature>
            <Feature icon={<ShieldCheck className="h-4 w-4" />} title={t("onboarding.f3.title")}>
              {t("onboarding.f3.body")}
            </Feature>
          </ul>

          <div className="mt-8 rounded-2xl border border-border bg-card/70 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{t("onboarding.important")}</span> {t("onboarding.disclaimer")}
            </p>
          </div>
        </div>

        <Button onClick={finish} size="lg" className="mt-6 h-12 rounded-full text-base">
          {t("onboarding.cta")} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
      {icon}
    </span>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  </li>
);

export default Onboarding;
