import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-soft">
      <main className="w-full px-4 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-[calc(env(safe-area-inset-bottom)+7rem)]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
