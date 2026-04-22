import { useMemo, useState } from "react";
import { Search, ExternalLink, ChefHat } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RECIPES, type Recipe } from "@/lib/recipes";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<{ value: Recipe["category"] | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snacks" },
  { value: "dessert", label: "Desserts" },
];

const Recipes = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Recipe["category"] | "all">("all");

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
          Browse gut-friendly dishes or search by ingredient.
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
          <Card key={r.id} className="p-4 rounded-2xl shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold leading-tight">{r.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
              </div>
              <Badge variant="secondary" className="capitalize shrink-0">{r.category}</Badge>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {r.ingredients.map((ing) => {
                const q = query.trim().toLowerCase();
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
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-[11px] text-muted-foreground">Source: {r.source}</span>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">
                  View <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </Card>
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

export default Recipes;
