import { cn } from "@/lib/utils";
import { fodmapColor, FodmapLevel } from "@/lib/meal";

interface FodmapBadgeProps {
  level: FodmapLevel;
  score?: number | null;
  className?: string;
}

const labels: Record<FodmapLevel, string> = {
  low: "Low FODMAP",
  moderate: "Moderate FODMAP",
  high: "High FODMAP",
  unknown: "FODMAP unknown",
};

export const FodmapBadge = ({ level, score, className }: FodmapBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        fodmapColor(level),
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[level]}
      {typeof score === "number" && <span className="opacity-70">· {score}/10</span>}
    </span>
  );
};
