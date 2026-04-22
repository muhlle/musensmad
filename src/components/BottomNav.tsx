import { NavLink, useLocation } from "react-router-dom";
import { Home, Plus, BookOpen, BarChart3, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/history", label: "History", icon: BookOpen },
  { to: "/add", label: "Add", icon: Plus, primary: true },
  { to: "/recipes", label: "Recipes", icon: ChefHat },
  { to: "/insights", label: "Insights", icon: BarChart3 },
];

export const BottomNav = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/onboarding")) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/90 backdrop-blur-xl">
      <div className="mx-auto max-w-md grid grid-cols-5 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map(({ to, label, icon: Icon, primary }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-smooth",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            {primary ? (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground shadow-card -mt-5">
                <Icon className="h-5 w-5" strokeWidth={2.4} />
              </span>
            ) : (
              <Icon className="h-5 w-5" strokeWidth={2} />
            )}
            <span className={cn("text-[10px] font-medium", primary && "mt-0")}>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
