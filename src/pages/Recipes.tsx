import { useMemo, useState } from "react";
import { Search, ChefHat, Clock, Users, ChevronDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RECIPES, CATEGORY_IMAGES, type Recipe, type RecipeCategory } from "@/lib/recipes";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<{ value: RecipeCategory | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snacks" },
  { value: "dessert", label: "Desserts" },
];

const Recipes = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<RecipeCategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (!q) return true;
      if (r.title.toLowerCase().includes(q)) return true;
      if (r.description.toLowerCase().includes(q)) return true;
      return r.ingredients.some((ing) => ing.toLowerCase().includes(q));
    });
  }, [query, category]);

  return (
    <AppShell>
      <header className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground shadow-card">
            <ChefHat className="h-4 w-4" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Low-FODMAP Recipes</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          100 gut-friendly dishes — search by ingredient (e.g. chicken).
        </p>
      </header>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes or ingredients (e.g. chicken)"
          className="pl-9 h-11 rounded-xl"
          aria-label="Search recipes"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1 scrollbar-thin">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth",
              category === c.value
                ? "bg-primary text-primary-foreground border-primary shadow-card"
                : "bg-card text-muted-foreground border-border hover:text-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}
      </p>

      <div className="space-y-3">
        {filtered.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            query={query}
            isOpen={openId === r.id}
            onToggle={() => setOpenId((prev) => (prev === r.id ? null : r.id))}
          />
        ))}

        {filtered.length === 0 && (
          <Card className="p-6 rounded-2xl text-center">
            <p className="text-sm text-muted-foreground">
              No recipes match "{query}". Try another ingredient.
            </p>
          </Card>
        )}
      </div>
    </AppShell>
  );
};

const RecipeCard = ({
  recipe,
  query,
  isOpen,
  onToggle,
}: {
  recipe: Recipe;
  query: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const q = query.trim().toLowerCase();
  return (
    <Card className="overflow-hidden rounded-2xl shadow-card">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="block w-full text-left">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            <img
              src={CATEGORY_IMAGES[recipe.category]}
              alt={recipe.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            <Badge variant="secondary" className="absolute top-3 right-3 capitalize">
              {recipe.category}
            </Badge>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold leading-tight">{recipe.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{recipe.description}</p>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 mt-1 shrink-0 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-muted-foreground">
              {recipe.timeMinutes && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {recipe.timeMinutes} min
                </span>
              )}
              {recipe.servings && (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" /> Serves {recipe.servings}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {recipe.ingredients.slice(0, 6).map((ing) => {
                const match = q && ing.toLowerCase().includes(q);
                return (
                  <span
                    key={ing}
                    className={cn(
                      "text-[11px] px-2 py-0.5 rounded-full border",
                      match
                        ? "bg-primary/15 text-primary border-primary/30"
                        : "bg-muted text-muted-foreground border-border",
                    )}
                  >
                    {ing}
                  </span>
                );
              })}
              {recipe.ingredients.length > 6 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full border bg-muted/50 text-muted-foreground border-border">
                  +{recipe.ingredients.length - 6} more
                </span>
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 pt-0 border-t border-border space-y-4">
            <section className="pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Ingredients
              </h3>
              <ul className="space-y-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Instructions
              </h3>
              <ol className="space-y-2">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="text-sm flex gap-3">
                    <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                      {i + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default Recipes;
