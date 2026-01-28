import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_ENDPOINTS } from "@/config/api";

type Period = "week" | "month" | "year";

interface GrowthData {
  period: string;
  users: number;
  charts: number;
}

export function ChartsCreatedChart() {
  const { getToken } = useAuth();
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<GrowthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getToken();
        const res = await fetch(
            `${API_ENDPOINTS.admin.growth}?period=${period}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch growth data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [period, getToken]);

  return (
      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Charts Created
          </CardTitle>
          <div className="flex gap-1">
            {(["week", "month", "year"] as Period[]).map((p) => (
                <Button
                    key={p}
                    variant="ghost"
                    size="sm"
                    onClick={() => setPeriod(p)}
                    className={cn(
                        "h-7 px-2 text-xs capitalize",
                        period === p
                            ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    )}
                >
                  {p}
                </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
              <div className="h-[240px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
          ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(215, 16%, 90%)"
                        className="dark:stroke-slate-700"
                    />
                    <XAxis
                        dataKey="period"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        className="text-slate-500 dark:text-slate-400"
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        className="text-slate-500 dark:text-slate-400"
                    />
                    <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid hsl(215, 16%, 90%)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                    />
                    <Bar
                        dataKey="charts"
                        fill="hsl(215, 20%, 65%)"
                        radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
          )}
        </CardContent>
      </Card>
  );
}