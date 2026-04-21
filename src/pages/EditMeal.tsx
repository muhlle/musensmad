import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAnonAuth } from "@/hooks/useAnonAuth";
import { FodmapLevel, Meal } from "@/lib/meal";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fodmapOptions: { value: FodmapLevel; label: string; cls: string }[] = [
  { value: "low", label: "Low", cls: "data-[selected=true]:bg-fodmap-low data-[selected=true]:text-success-foreground data-[selected=true]:border-fodmap-low" },
  { value: "moderate", label: "Moderate", cls: "data-[selected=true]:bg-fodmap-moderate data-[selected=true]:text-warning-foreground data-[selected=true]:border-fodmap-moderate" },
  { value: "high", label: "High", cls: "data-[selected=true]:bg-fodmap-high data-[selected=true]:text-destructive-foreground data-[selected=true]:border-fodmap-high" },
  { value: "unknown", label: "Unknown", cls: "data-[selected=true]:bg-muted-foreground data-[selected=true]:text-background data-[selected=true]:border-muted-foreground" },
];

const EditMeal = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAnonAuth();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIng, setNewIng] = useState("");
  const [fodmap, setFodmap] = useState<FodmapLevel>("unknown");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      const { data } = await supabase.from("meals").select("*").eq("id", id).maybeSingle();
      if (!data) {
        toast.error("Meal not found");
        navigate("/history");
        return;
      }
      const m = data as unknown as Meal;
      setMeal(m);
      setTitle(m.title);
      setDescription(m.description ?? "");
      setIngredients(m.ingredients);
      setFodmap(m.fodmap_level);
    })();
  }, [id, user, navigate]);

  const addIng = () => {
    const v = newIng.trim();
    if (!v) return;
    setIngredients((p) => [...p, v]);
    setNewIng("");
  };

  const save = async () => {
    if (!meal) return;
    if (!title.trim()) return toast.error("Title is required");
    setSaving(true);
    const { error } = await supabase
      .from("meals")
      .update({
        title: title.trim().slice(0, 120),
        description: description.trim() || null,
        ingredients,
        fodmap_level: fodmap,
      })
      .eq("id", meal.id);
    if (error) {
      console.error(error);
      toast.error("Couldn't save");
      setSaving(false);
      return;
    }
    toast.success("Meal updated");
    navigate(`/meal/${meal.id}`);
  };

  if (!meal) {
    return (
      <AppShell>
        <div className="h-48 rounded-2xl bg-muted/60 animate-pulse-soft" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3 animate-fade-in">
        <button onClick={() => navigate(-1)} className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="font-display text-xl font-semibold">Edit meal</h1>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 rounded-xl bg-card" />
        </div>
        <div>
          <Label htmlFor="desc" className="text-sm font-medium">Description</Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 600))}
            className="mt-2 min-h-[80px] resize-none rounded-2xl bg-card"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Ingredients</Label>
          <div className="mt-2 flex gap-2">
            <Input
              value={newIng}
              onChange={(e) => setNewIng(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIng())}
              placeholder="Add ingredient"
              className="rounded-xl bg-card"
            />
            <Button type="button" variant="secondary" size="icon" onClick={addIng} className="rounded-xl">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {ingredients.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">
                  {ing}
                  <button
                    type="button"
                    onClick={() => setIngredients((p) => p.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium">FODMAP level</Label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {fodmapOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                data-selected={fodmap === o.value}
                onClick={() => setFodmap(o.value)}
                className={cn(
                  "rounded-xl border-2 border-border bg-card px-2 py-2.5 text-xs font-medium transition-smooth",
                  o.cls,
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={save} disabled={saving} size="lg" className="mt-7 h-12 w-full rounded-full">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
      </Button>
    </AppShell>
  );
};

export default EditMeal;
