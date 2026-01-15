import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

// Placeholder data structure
const placeholderData = [
    { period: "W1", revenue: 0 },
    { period: "W2", revenue: 0 },
    { period: "W3", revenue: 0 },
    { period: "W4", revenue: 0 },
];

export function RevenueChart() {
    return (
        <Card className="relative border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                        <IndianRupee className="h-4 w-4 text-slate-400" />
                    </div>
                    <CardTitle className="text-base font-semibold text-slate-500 dark:text-slate-400">
                        Revenue Analytics
                    </CardTitle>
                </div>
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    Phase 2
                </Badge>
            </CardHeader>
            <CardContent className="relative pt-4">
                {/* Grayed out chart preview */}
                <div className="h-[280px] opacity-20 grayscale">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={placeholderData}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="hsl(142, 76%, 36%)"
                                fill="url(#revenueGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Overlay message */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-lg border border-slate-200 bg-white/95 p-6 text-center shadow-lg dark:border-slate-700 dark:bg-slate-900/95">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <Lock className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Coming Soon
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Available after payment integration
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}