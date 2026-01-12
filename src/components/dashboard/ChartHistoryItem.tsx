import { Link } from "react-router-dom";
import { BarChart3, LineChart, PieChart, AreaChart } from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface ChartHistoryItemData {
  id: string;
  name: string;
  type: "bar" | "line" | "pie" | "area" | "stacked";
  updatedAt: string;
}

const chartIcons = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: AreaChart,
  stacked: BarChart3,
};

interface ChartHistoryItemProps {
  chart: ChartHistoryItemData;
}

export function ChartHistoryItem({ chart }: ChartHistoryItemProps) {
  const Icon = chartIcons[chart.type] || BarChart3;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={chart.name}>
        <Link to={`/dashboard/chart/${chart.id}`} className="flex items-center gap-3">
          <Icon className="h-4 w-4 shrink-0 text-sidebar-foreground" />
          <div className="flex-1 min-w-0">
            <span className="block truncate text-sm">{chart.name}</span>
            <span className="block text-xs text-muted-foreground">{chart.updatedAt}</span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
