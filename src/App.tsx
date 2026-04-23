import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import AddMeal from "./pages/AddMeal.tsx";
import History from "./pages/History.tsx";
import MealDetail from "./pages/MealDetail.tsx";
import EditMeal from "./pages/EditMeal.tsx";
import SymptomLog from "./pages/SymptomLog.tsx";
import Insights from "./pages/Insights.tsx";
import TriggersLog from "./pages/TriggersLog.tsx";
import Settings from "./pages/Settings.tsx";
import OnboardingGate from "./components/OnboardingGate.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <OnboardingGate>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<Index />} />
            <Route path="/add" element={<AddMeal />} />
            <Route path="/history" element={<History />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/triggers" element={<TriggersLog />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/meal/:id" element={<MealDetail />} />
            <Route path="/meal/:id/edit" element={<EditMeal />} />
            <Route path="/meal/:id/symptoms" element={<SymptomLog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </OnboardingGate>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
