export type FodmapLevel = "low" | "moderate" | "high" | "unknown";
export type SymptomSeverity = "none" | "mild" | "moderate" | "severe";

export const SYMPTOM_TYPES = [
  "bloating",
  "abdominal pain",
  "gas",
  "diarrhea",
  "constipation",
  "urgency",
] as const;

export type SymptomType = (typeof SYMPTOM_TYPES)[number];

export interface Meal {
  id: string;
  user_id: string;
  photo_url: string | null;
  title: string;
  description: string | null;
  ingredients: string[];
  ai_summary: string | null;
  fodmap_level: FodmapLevel;
  fodmap_score: number | null;
  possible_triggers: string[];
  evidence_notes: string | null;
  anecdotal_notes: string | null;
  ai_confidence: string | null;
  meal_at: string;
  symptom_severity: SymptomSeverity;
  symptom_types: string[];
  symptom_started_at: string | null;
  user_notes: string | null;
  edited_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIAnalysis {
  meal_title: string;
  ai_summary: string;
  ingredients: string[];
  fodmap_level: FodmapLevel;
  fodmap_score: number;
  possible_triggers: string[];
  evidence_notes: string;
  anecdotal_notes: string;
  ai_confidence: "low" | "medium" | "high";
  needs_more_info: boolean;
  clarifying_question?: string;
}

export const fodmapColor = (level: FodmapLevel) => {
  switch (level) {
    case "low": return "bg-fodmap-low/15 text-fodmap-low border-fodmap-low/30";
    case "moderate": return "bg-fodmap-moderate/15 text-fodmap-moderate border-fodmap-moderate/30";
    case "high": return "bg-fodmap-high/15 text-fodmap-high border-fodmap-high/30";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export const severityColor = (sev: SymptomSeverity) => {
  switch (sev) {
    case "none": return "bg-success-soft text-success border-success/30";
    case "mild": return "bg-warning-soft text-warning border-warning/30";
    case "moderate": return "bg-warning-soft text-warning border-warning/40";
    case "severe": return "bg-destructive-soft text-destructive border-destructive/40";
  }
};
