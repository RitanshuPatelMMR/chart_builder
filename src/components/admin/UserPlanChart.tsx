import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = {
    free: "hsl(215, 16%, 62%)",
    premium: "hsl(142, 71%, 45%)",
};

interface UserPlanChartProps {
    totalUsers: number;
    freeUsers: number;
}

export function UserPlanChart({ totalUsers, freeUsers }: UserPlanChartProps) {
    const premiumUsers = totalUsers - freeUsers;

    const data = [
        { name: "Free Users", value: freeUsers, color: COLORS.free },
        { name: "Premium Users", value: premiumUsers, color: COLORS.premium },
    ];

    return (
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">User Plan Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        const percentage = ((data.value / totalUsers) * 100).toFixed(1);
                                        return (
                                            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                                                <p className="font-medium text-slate-900 dark:text-slate-100">{data.name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {data.value} users ({percentage}%)
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                content={({ payload }) => (
                                    <div className="flex justify-center gap-6 pt-4">
                                        {payload?.map((entry, index) => (
                                            <div key={`legend-${index}`} className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: entry.color }}
                                                />
                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                          {entry.value}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}