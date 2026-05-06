import { cn } from "@/lib/utils";
import { severityColor, SymptomSeverity } from "@/lib/meal";
import { useT } from "@/lib/i18n";

export const SeverityChip = ({ severity, className }: { severity: SymptomSeverity; className?: string }) => {
  const { t } = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        severityColor(severity),
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {t(`severity.${severity}`)}
    </span>
  );
};
