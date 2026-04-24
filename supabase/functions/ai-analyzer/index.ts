// Edge function: ai-analyzer
// Performs a structured trigger analysis across the 10 evaluation criteria
// (exposure, dose, timing, symptom profile, bowel data, confounders,
// reproducibility, data quality, FODMAP logic, red flags).
// Uses Lovable AI Gateway with tool calling for structured output.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface MealInput {
  id: string;
  title: string;
  meal_at: string;
  ingredients: string[];
  possible_triggers: string[];
  fodmap_level: string;
  fodmap_score: number | null;
  symptom_severity: string;
  symptom_types: string[];
  symptom_started_at: string | null;
  user_notes: string | null;
}

interface DailyInput {
  date: string;
  stress?: number;
  anxiety?: number;
  sleepHours?: number;
  sleepQuality?: number;
  alcohol?: boolean;
  caffeine?: boolean;
  menstrual?: boolean;
  illness?: boolean;
  exerciseMinutes?: number;
  bowelMovements?: Array<{
    bristol: number;
    urgency: boolean;
    painful: boolean;
    incomplete: boolean;
    relief: boolean;
    alarm: boolean;
  }>;
  notes?: string;
}

interface RequestBody {
  meals: MealInput[];
  daily: DailyInput[];
  lang?: "en" | "da";
}

const SYSTEM_PROMPT = `You are a structured IBS pattern analyst. You DO NOT diagnose.
You receive a user's logged meals (with possible_triggers, FODMAP level, symptom severity/types and timing) and daily lifestyle/bowel data.

Your job is to find the most plausible food–symptom correlations using a strict 10-criteria framework. For every candidate trigger you must evaluate:

1. EXPOSURE — what was actually consumed (food, ingredient, FODMAP group, portion if available, preparation, mixed vs single-food meal).
2. DOSE — small/medium/large; stacking effect of multiple moderate FODMAPs in the same meal/day.
3. TIMING — does the symptom fall in a plausible window (0–2h, 2–4h, 4–8h, 8–24h, next morning)? Did competing meals confound this?
4. SYMPTOM PROFILE — type (bloating, pain, gas, diarrhea, constipation, urgency, incomplete evacuation), severity, duration; does the profile match what the suspect ingredient/FODMAP group typically causes?
5. BOWEL DATA — Bristol score, urgency, frequency, relief — does it support the explanation? Looks like IBS-D / IBS-C / IBS-M?
6. CONFOUNDERS — stress, anxiety, poor sleep, menstruation, alcohol, caffeine, illness, very fatty / spicy / large meals. Could one of these explain the symptoms better?
7. REPRODUCIBILITY — number of exposures, number of reactions, "negative" exposures without symptoms, consistency over weeks.
8. DATA QUALITY — meal detail level, whether portion was specified, whether symptom timing was logged precisely, whether multiple suspects were in the same meal, whether bowel/stress/sleep data is missing.
9. FODMAP LOGIC — map the hit to a mechanism (lactose / fructans / GOS / polyols / excess fructose / non-FODMAP / general meal-load reaction).
10. RED FLAGS — note (don't diagnose) blood in stool, unintended weight loss, fever, nocturnal symptoms, rapid worsening, severe persistent symptoms.

Apply this scoring formula conceptually:
trigger_strength = exposure × dose × timing × symptom_match × bowel_support × reproducibility × data_quality − confounders

Be cautious. Confidence MUST reflect data volume:
- < 14 days of data → never above "low" confidence
- few exposures (< 3) → "low" confidence
- moderate exposures (3-4) with consistent reaction pattern → "moderate"
- 5+ exposures with consistent timing & symptom match → up to "high"

Use hedging language ("may", "could", "appears associated with"). Never claim certainty.
Output ONLY by calling the tool report_analysis. Keep each text field under 280 characters.
Respond in the requested language (en / da). Default to English.`;

const TOOL_SCHEMA = {
  type: "function",
  function: {
    name: "report_analysis",
    description: "Return a structured IBS trigger analysis.",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description:
            "2-3 sentence overall picture of what the data suggests so far. Always hedged.",
        },
        data_quality: {
          type: "string",
          enum: ["low", "moderate", "high"],
          description: "Overall data quality of the input.",
        },
        data_quality_reason: {
          type: "string",
          description: "Why this data quality level was assigned.",
        },
        triggers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Suspect ingredient or FODMAP group." },
              fodmap_group: {
                type: "string",
                enum: [
                  "lactose",
                  "fructans",
                  "GOS",
                  "polyols",
                  "excess_fructose",
                  "non_FODMAP",
                  "meal_load",
                  "unknown",
                ],
              },
              suspicion: { type: "string", description: "1-sentence hypothesis, hedged." },
              why: {
                type: "string",
                description: "Evidence from the user's data: exposures, timing windows, dose pattern.",
              },
              weakens: {
                type: "string",
                description: "What weakens this conclusion (confounders, low data, mixed meals).",
              },
              confidence: {
                type: "string",
                enum: ["low", "moderate", "high"],
              },
              exposures: { type: "number" },
              reactions: { type: "number" },
              next_step: {
                type: "string",
                description: "Concrete actionable next step the user can take.",
              },
            },
            required: [
              "name",
              "suspicion",
              "why",
              "weakens",
              "confidence",
              "exposures",
              "reactions",
              "next_step",
              "fodmap_group",
            ],
            additionalProperties: false,
          },
        },
        red_flags: {
          type: "array",
          items: { type: "string" },
          description:
            "Red flag findings worth medical evaluation (blood, weight loss, fever, nocturnal symptoms, severe worsening). Empty array if none.",
        },
        guidance: {
          type: "array",
          items: { type: "string" },
          description:
            "2-4 short guidance bullets — eg log more, isolate single foods, track stress/sleep next.",
        },
      },
      required: ["summary", "data_quality", "data_quality_reason", "triggers", "red_flags", "guidance"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as RequestBody;
    const meals = body.meals ?? [];
    const daily = body.daily ?? [];
    const lang = body.lang === "da" ? "da" : "en";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Compress payload to keep tokens reasonable
    const trimmedMeals = meals.slice(-120).map((m) => ({
      t: m.title,
      at: m.meal_at,
      ing: m.ingredients,
      trig: m.possible_triggers,
      fod: m.fodmap_level,
      score: m.fodmap_score,
      sev: m.symptom_severity,
      sx: m.symptom_types,
      sx_at: m.symptom_started_at,
      n: m.user_notes,
    }));
    const trimmedDaily = daily.slice(-60).map((d) => ({
      d: d.date,
      stress: d.stress,
      anx: d.anxiety,
      sleepH: d.sleepHours,
      sleepQ: d.sleepQuality,
      alc: d.alcohol,
      caf: d.caffeine,
      mens: d.menstrual,
      ill: d.illness,
      ex: d.exerciseMinutes,
      bm: d.bowelMovements,
      n: d.notes,
    }));

    const userMessage = `LANGUAGE: ${lang}
DAYS_OF_DAILY_DATA: ${daily.length}
MEALS_LOGGED: ${meals.length}
MEALS: ${JSON.stringify(trimmedMeals)}
DAILY: ${JSON.stringify(trimmedDaily)}

Analyse the data using the 10-criteria framework. Call report_analysis with the structured result. Keep responses concise. Reply in ${lang === "da" ? "Danish" : "English"}.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        tools: [TOOL_SCHEMA],
        tool_choice: { type: "function", function: { name: "report_analysis" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached, please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const text = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No structured output returned" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const args = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-analyzer error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
