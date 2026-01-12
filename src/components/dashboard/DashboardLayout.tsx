import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { ChartsProvider } from "@/contexts/ChartsContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
      <ChartsProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <DashboardHeader />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </ChartsProvider>
  );
}