import { cn } from "@/lib/utils";
import { fodmapColor, FodmapLevel } from "@/lib/meal";
import { useT } from "@/lib/i18n";

interface FodmapBadgeProps {
  level: FodmapLevel;
  score?: number | null;
  className?: string;
}

export const FodmapBadge = ({ level, score, className }: FodmapBadgeProps) => {
  const { t } = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        fodmapColor(level),
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {t(`fodmap.${level}`)}
      {typeof score === "number" && <span className="opacity-70">· {score}/10</span>}
    </span>
  );
};
