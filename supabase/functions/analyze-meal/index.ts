// Edge function: analyze-meal
// Uses Lovable AI Gateway (Gemini multimodal) to analyze a meal photo + optional text
// and return structured FODMAP / IBS information.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

interface AnalyzeRequest {
  imageBase64?: string; // data URL or raw base64
  imageUrl?: string;
  description?: string;
  ingredientsHint?: string[];
}

const SYSTEM_PROMPT = `You are a careful nutrition assistant for people with IBS (Irritable Bowel Syndrome).
You analyze a meal (from a photo and/or a short user description) and return a structured assessment focused on FODMAP content and possible IBS triggers.

Critical rules:
- You are NOT a doctor. Never present anything as medical fact.
- If the image is unclear or you are guessing, set ai_confidence to "low" and clearly say so in the summary.
- If you truly cannot identify the dish, set needs_more_info to true and explain what info would help.
- Separate symptom information into "evidence_notes" (well-documented, peer-reviewed associations between FODMAPs/ingredients and IBS symptoms) vs "anecdotal_notes" (commonly reported by IBS users online but not clearly proven).
- Possible symptoms to consider: bloating, abdominal pain, gas, diarrhea, constipation, urgency.
- Use cautious, hedging language ("may", "can sometimes", "is often reported to").
- Keep summary under 300 characters. Keep notes under 500 characters each.`;

const TOOL_SCHEMA = {
  type: "function",
  function: {
    name: "report_meal_analysis",
    description: "Return a structured FODMAP / IBS analysis of the meal.",
    parameters: {
      type: "object",
      properties: {
        meal_title: { type: "string", description: "Best guess of the meal name." },
        ai_summary: { type: "string", description: "Short 1-2 sentence summary of the meal and its IBS profile." },
        ingredients: {
          type: "array",
          items: { type: "string" },
          description: "Likely ingredients identified in the meal.",
        },
        fodmap_level: {
          type: "string",
          enum: ["low", "moderate", "high", "unknown"],
          description: "Overall FODMAP load category for this meal.",
        },
        fodmap_score: {
          type: "integer",
          minimum: 1,
          maximum: 10,
          description: "Numeric FODMAP intensity score 1 (very low) to 10 (very high).",
        },
        possible_triggers: {
          type: "array",
          items: { type: "string" },
          description: "Specific ingredients in this meal that may trigger IBS symptoms.",
        },
        evidence_notes: {
          type: "string",
          description: "Documented / evidence-based info about how these ingredients can affect IBS symptoms.",
        },
        anecdotal_notes: {
          type: "string",
          description: "Anecdotal / commonly reported IBS reactions from community reports (clearly framed as anecdotal).",
        },
        ai_confidence: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Confidence in the identification.",
        },
        needs_more_info: {
          type: "boolean",
          description: "True if the AI cannot reliably identify the dish and should ask the user for more detail.",
        },
        clarifying_question: {
          type: "string",
          description: "If needs_more_info is true, the question to ask the user.",
        },
      },
      required: [
        "meal_title", "ai_summary", "ingredients", "fodmap_level",
        "fodmap_score", "possible_triggers", "evidence_notes",
        "anecdotal_notes", "ai_confidence", "needs_more_info",
      ],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const body = (await req.json()) as AnalyzeRequest;
    const { imageBase64, imageUrl, description, ingredientsHint } = body;

    if (!imageBase64 && !imageUrl && !description) {
      return new Response(
        JSON.stringify({ error: "Provide an image or a description." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userParts: any[] = [];
    let userText = "Please analyze this meal for someone with IBS.";
    if (description) userText += `\n\nUser description: ${description}`;
    if (ingredientsHint && ingredientsHint.length) {
      userText += `\n\nUser-provided ingredients: ${ingredientsHint.join(", ")}`;
    }
    userParts.push({ type: "text", text: userText });

    if (imageBase64) {
      const dataUrl = imageBase64.startsWith("data:")
        ? imageBase64
        : `data:image/jpeg;base64,${imageBase64}`;
      userParts.push({ type: "image_url", image_url: { url: dataUrl } });
    } else if (imageUrl) {
      userParts.push({ type: "image_url", image_url: { url: imageUrl } });
    }

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
          { role: "user", content: userParts },
        ],
        tools: [TOOL_SCHEMA],
        tool_choice: { type: "function", function: { name: "report_meal_analysis" } },
      }),
    });

    if (!aiResp.ok) {
      const txt = await aiResp.text();
      console.error("AI gateway error", aiResp.status, txt);
      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: "AI analysis failed." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await aiResp.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call returned", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "AI did not return a structured response." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-meal error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
