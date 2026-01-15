import { useEffect, useState } from "react";
import { Users, UserCheck, Crown, BarChart3, DollarSign } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { UserGrowthChart } from "@/components/admin/UserGrowthChart";
import { ChartsCreatedChart } from "@/components/admin/ChartsCreatedChart";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { UserPlanChart } from "@/components/admin/UserPlanChart";
import { DashboardCalendar } from "@/components/admin/DashboardCalendar";
import { Skeleton } from "@/components/ui/skeleton";

interface Metrics {
  totalUsers: number;
  freeUsers: number;
  premiumUsers: number;
  totalCharts: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:3000/api/admin/metrics", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [getToken]);

  if (loading || !metrics) {
    return (
        <>
          <AdminHeader title="Dashboard" subtitle="Overview of your platform metrics" />
          <main className="flex-1 space-y-6 p-6">
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          </main>
        </>
    );
  }

  return (
      <>
        <AdminHeader
            title="Dashboard"
            subtitle="Overview of your platform metrics"
        />
        <main className="flex-1 space-y-6 p-6">
          {/* Metric Cards Row */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <MetricCard
                title="Total Users"
                value={metrics.totalUsers}
                icon={Users}
                trend={{ value: 12, isPositive: true }}
            />
            <MetricCard
                title="Free Users"
                value={metrics.freeUsers}
                icon={UserCheck}
            />
            <MetricCard
                title="Premium Users"
                value={metrics.premiumUsers}
                icon={Crown}
                description="Coming soon"
            />
            <MetricCard
                title="Total Charts"
                value={metrics.totalCharts}
                icon={BarChart3}
                trend={{ value: 24, isPositive: true }}
            />
            <MetricCard
                title="Total Revenue"
                value="Coming Soon"
                icon={DollarSign}
            />
          </div>

          {/* Row 1: User Growth | Charts Created | Calendar (3 columns) */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <UserGrowthChart />
            <ChartsCreatedChart />
            <DashboardCalendar />
          </div>

          {/* Row 2: Pie Chart | Revenue (2 columns) */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <UserPlanChart totalUsers={metrics.totalUsers} freeUsers={metrics.freeUsers} />
            <RevenueChart />
          </div>
        </main>
      </>
  );
}