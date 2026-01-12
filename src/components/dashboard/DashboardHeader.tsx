import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton } from "@/components/layout/UserButton";
import { Separator } from "@/components/ui/separator";

export function DashboardHeader() {
  return (
    <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-background sticky top-0 z-10">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="font-semibold text-foreground">Dashboard</h1>
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}
