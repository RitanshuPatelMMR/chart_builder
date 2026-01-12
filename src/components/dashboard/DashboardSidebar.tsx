import { Link, useLocation } from "react-router-dom";
import { BarChart3, Plus, FolderOpen, LayoutTemplate, History, Shield } from "lucide-react"; // ← ADD Shield
import { NavLink } from "@/components/NavLink";
import { UserButton } from "@/components/layout/UserButton";
import { useCharts } from "@/contexts/ChartsContext";
import { useRole } from "@/hooks/useRole"; // ← ADD THIS
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChartHistoryItem } from "./ChartHistoryItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const navigationItems = [
  { title: "My Charts", url: "/dashboard", icon: FolderOpen },
  { title: "Templates", url: "/dashboard/templates", icon: LayoutTemplate },
];

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { charts, isLoading } = useCharts();
  const { isAdmin } = useRole(); // ← ADD THIS
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  // Get recent charts (last 4)
  const recentCharts = charts.slice(0, 4).map((chart) => ({
    id: chart.id,
    name: chart.name,
    type: chart.config.type,
    updatedAt: formatRelativeTime(chart.updatedAt),
  }));

  return (
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
                <span className="font-semibold text-lg text-sidebar-accent-foreground">
              Chartify
            </span>
            )}
          </Link>
        </SidebarHeader>

        <SidebarContent>
          {/* New Chart Button */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  {isCollapsed ? (
                      <SidebarMenuButton asChild tooltip="New Chart">
                        <Link to="/dashboard/new">
                          <Plus className="h-4 w-4" />
                        </Link>
                      </SidebarMenuButton>
                  ) : (
                      <Button asChild className="w-full justify-start gap-2" size="sm">
                        <Link to="/dashboard/new">
                          <Plus className="h-4 w-4" />
                          New Chart
                        </Link>
                      </Button>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          tooltip={item.title}
                      >
                        <NavLink
                            to={item.url}
                            end={item.url === "/dashboard"}
                            className="flex items-center gap-3"
                            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                        >
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}

                {/* ← ADD ADMIN LINK HERE */}
                {isAdmin && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                          asChild
                          isActive={location.pathname.startsWith("/admin")}
                          tooltip="Admin Panel"
                      >
                        <NavLink
                            to="/admin/dashboard"
                            className="flex items-center gap-3"
                            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                        >
                          <Shield className="h-4 w-4" />
                          {!isCollapsed && <span>Admin Panel</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Chart History */}
          <SidebarGroup>
            <SidebarGroupLabel>
              <History className="h-3.5 w-3.5 mr-2" />
              {!isCollapsed && "Recent Charts"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                          <SidebarMenuItem key={i}>
                            <div className="flex items-center gap-3 p-2">
                              <Skeleton className="h-4 w-4 rounded" />
                              {!isCollapsed && (
                                  <div className="flex-1 space-y-1">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-2 w-16" />
                                  </div>
                              )}
                            </div>
                          </SidebarMenuItem>
                      ))}
                    </>
                ) : recentCharts.length > 0 ? (
                    recentCharts.map((chart) => (
                        <ChartHistoryItem key={chart.id} chart={chart} />
                    ))
                ) : (
                    <SidebarMenuItem>
                      <p className="px-2 py-1.5 text-xs text-muted-foreground">
                        {isCollapsed ? "" : "No charts yet"}
                      </p>
                    </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="flex items-center gap-3">
            <UserButton />
            {!isCollapsed && (
                <span className="text-sm text-sidebar-foreground truncate">
              Account
            </span>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
  );
}