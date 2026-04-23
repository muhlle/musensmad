/**
 * Alarm symptoms that warrant medical evaluation (non-diagnostic).
 * Detected from free-text user notes across meals and daily log.
 */
const ALARM_PATTERNS = [
  { key: "blood", re: /\b(blood|bloody|hematochezia|rectal bleeding|blod i|bloed)\b/i, label: "Blood in stool" },
  { key: "weight_loss", re: /\b(weight ?loss|losing weight|unintended (?:weight )?loss|vægttab|vegttab)\b/i, label: "Unintended weight loss" },
  { key: "fever", re: /\b(fever|febrile|feber)\b/i, label: "Fever" },
  { key: "severe_pain", re: /\b(severe pain|excruciating|unbearable pain|stærke smerter|staerke smerter)\b/i, label: "Severe pain" },
  { key: "night_symptoms", re: /\b(wakes? me up|nocturnal|night ?time pain|vågner om natten|vagner om natten)\b/i, label: "Night-time symptoms" },
  { key: "vomiting", re: /\b(vomit(?:ing)?|throwing up|opkast)\b/i, label: "Persistent vomiting" },
  { key: "anemia", re: /\b(anemia|anaemia|pale|anæmi|anaemi)\b/i, label: "Possible anaemia" },
];

export interface AlarmFinding {
  key: string;
  label: string;
  source: string; // short description of where it was found
}

export const scanForAlarmSymptoms = (texts: { text: string; source: string }[]): AlarmFinding[] => {
  const found = new Map<string, AlarmFinding>();
  for (const { text, source } of texts) {
    if (!text) continue;
    for (const p of ALARM_PATTERNS) {
      if (p.re.test(text) && !found.has(p.key)) {
        found.set(p.key, { key: p.key, label: p.label, source });
      }
    }
  }
  return Array.from(found.values());
};
