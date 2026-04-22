import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { useEffect } from "react";

const Onboarding = () => {
  const navigate = useNavigate();

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
            <Sparkles className="h-3.5 w-3.5" /> Welcome
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight">
            Understand what your gut <span className="text-primary">really</span> tolerates.
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Track meals with photos, get instant insights on FODMAPs and possible IBS triggers, and spot patterns over time.
          </p>

          <ul className="mt-8 space-y-4">
            <Feature icon={<Camera className="h-4 w-4" />} title="Snap or describe a meal">
              We&apos;ll identify the dish and likely ingredients.
            </Feature>
            <Feature icon={<Sparkles className="h-4 w-4" />} title="FODMAP & symptom insights">
              Evidence-based and anecdotal info, side by side.
            </Feature>
            <Feature icon={<ShieldCheck className="h-4 w-4" />} title="Log symptoms in seconds">
              Add or update reactions, even hours later.
            </Feature>
          </ul>

          <div className="mt-8 rounded-2xl border border-border bg-card/70 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Important:</span> This app does not provide medical diagnosis or treatment. AI estimates can be imperfect — especially when analyzing food from images. Always consult a qualified healthcare professional.
            </p>
          </div>
        </div>

        <Button onClick={finish} size="lg" className="mt-6 h-12 rounded-full text-base">
          I understand — let&apos;s start <ArrowRight className="h-4 w-4" />
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
