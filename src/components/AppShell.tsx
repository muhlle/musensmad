import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <main className="mx-auto max-w-md px-5 pt-6 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
