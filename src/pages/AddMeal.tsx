import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Image as ImageIcon, Loader2, Plus, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { toast } from "sonner";
import { AIAnalysis } from "@/lib/meal";
import { useT } from "@/lib/i18n";
import { normalizeIngredientList, displayIngredient } from "@/lib/ingredients";

const AddMeal = () => {
  const navigate = useNavigate();
  const { user } = useAnonAuth();
  const { t, lang } = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIng, setNewIng] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const onPick = (file: File | null) => {
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const addIngredient = () => {
    const v = newIng.trim();
    if (!v) return;
    if (v.length > 60) return toast.error(t("add.ing.tooLong"));
    setIngredients((prev) => normalizeIngredientList([...prev, v]));
    setNewIng("");
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

  // Returns the storage path (not a public URL) — bucket is private; we sign URLs on read.
  const uploadPhoto = async (uid: string, file: File): Promise<string | null> => {
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error(t("add.photo.tooLarge"));
      return null;
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${uid}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("meal-photos").upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (error) {
      console.error(error);
      toast.error(t("add.photo.uploadError"));
      return null;
    }
    return path;
  };

  const analyze = async () => {
    if (!photoFile && !description.trim()) {
      toast.error(t("add.needInput"));
      return;
    }
    if (!user) {
      toast.error(t("add.sessionLoading"));
      return;
    }
    setAnalyzing(true);
    try {
      // Upload photo first (if any)
      let photoUrl: string | null = null;
      if (photoFile) {
        photoUrl = await uploadPhoto(user.id, photoFile);
      }

      // Send to AI
      const imageBase64 = photoFile ? await fileToBase64(photoFile) : undefined;
      const { data, error } = await supabase.functions.invoke("analyze-meal", {
        body: {
          imageBase64,
          description: description.trim() || undefined,
          ingredientsHint: ingredients.length ? ingredients : undefined,
          language: lang,
        },
      });

      if (error) {
        console.error(error);
        toast.error(error.message || t("add.analysisFailed"));
        setAnalyzing(false);
        return;
      }
      const analysis = (data as { analysis: AIAnalysis }).analysis;

      // Save meal
      const finalIngredients = normalizeIngredientList(ingredients.length ? ingredients : analysis.ingredients);
      const finalTriggers = normalizeIngredientList(analysis.possible_triggers ?? []);

      const { data: inserted, error: insertErr } = await supabase
        .from("meals")
        .insert({
          user_id: user.id,
          photo_url: photoUrl,
          title: analysis.meal_title || "Meal",
          description: description.trim() || null,
          ingredients: finalIngredients,
          ai_summary: analysis.ai_summary,
          fodmap_level: analysis.fodmap_level,
          fodmap_score: analysis.fodmap_score,
          possible_triggers: finalTriggers,
          evidence_notes: analysis.evidence_notes,
          anecdotal_notes: analysis.anecdotal_notes,
          ai_confidence: analysis.ai_confidence,
        })
        .select("id")
        .single();

      if (insertErr || !inserted) {
        console.error(insertErr);
        toast.error(t("add.saveError"));
        setAnalyzing(false);
        return;
      }

      navigate(`/meal/${inserted.id}?fresh=1`, {
        state: { needsMoreInfo: analysis.needs_more_info, clarifyingQuestion: analysis.clarifying_question },
      });
    } catch (e) {
      console.error(e);
      toast.error(t("add.analysisFailed"));
      setAnalyzing(false);
    }
  };

  return (
    <AppShell>
      <header className="mb-5 animate-fade-in">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("add.kicker")}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">{t("add.title")}</h1>
      </header>

      {/* Photo */}
      <div className="animate-fade-in-up">
        {photoPreview ? (
          <div className="relative overflow-hidden rounded-3xl shadow-card">
            <img src={photoPreview} alt={t("add.photo.alt")} className="aspect-[4/3] w-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 text-foreground shadow-soft backdrop-blur"
              aria-label={t("add.photo.remove")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border bg-card/60 transition-smooth hover:border-primary/50 hover:bg-card"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary transition-smooth group-hover:scale-110">
              <Camera className="h-6 w-6" />
            </span>
            <span className="font-medium">{t("add.photo.cta")}</span>
            <span className="text-xs text-muted-foreground">{t("add.photo.hint")}</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
      </div>

      {/* Description */}
      <div className="mt-5 space-y-2">
        <Label htmlFor="desc" className="text-sm font-medium">
          {t("add.desc.label")} <span className="font-normal text-muted-foreground">{t("add.desc.optional")}</span>
        </Label>
        <Textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 600))}
          placeholder={t("add.desc.placeholder")}
          className="min-h-[80px] resize-none rounded-2xl bg-card"
        />
      </div>

      {/* Ingredients */}
      <div className="mt-5">
        <Label className="text-sm font-medium">
          {t("add.ing.label")} <span className="font-normal text-muted-foreground">{t("add.ing.optional")}</span>
        </Label>
        <div className="mt-2 flex gap-2">
          <Input
            value={newIng}
            onChange={(e) => setNewIng(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addIngredient();
              }
            }}
            placeholder={t("add.ing.placeholder")}
            className="rounded-xl bg-card"
          />
          <Button type="button" variant="secondary" size="icon" onClick={addIngredient} className="rounded-xl">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {ingredients.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {ingredients.map((ing, i) => {
              const display = displayIngredient(ing, lang);
              return (
                <li key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">
                  {display}
                  <button
                    type="button"
                    onClick={() => setIngredients((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={t("add.ing.remove", { item: display })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Button
        onClick={analyze}
        disabled={analyzing}
        size="lg"
        className="mt-7 h-12 w-full rounded-full text-base"
      >
        {analyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {t("add.cta.analyzing")}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" /> {t("add.cta.analyze")}
          </>
        )}
      </Button>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        {t("add.disclaimer")}
      </p>
    </AppShell>
  );
};

export default AddMeal;
