import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Redirects to /onboarding the first time a visitor opens the app.
 * Onboarding sets `ibs-onboarded=1` in localStorage.
 */
const OnboardingGate = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem("ibs-onboarded") === "1";
    if (!seen && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
};

export default OnboardingGate;
