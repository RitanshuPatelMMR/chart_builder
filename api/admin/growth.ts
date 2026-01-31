import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../../lib/mongodb.js";  // ← Add .js
import { requireAdmin } from "../../lib/auth.js";  // ← Add .js
import { setCorsHeaders } from "../../lib/cors.js";  // ← Add .js
import { User } from "../../models/User.js";  // ← Add .js
import { Chart } from "../../models/Chart.js";  // ← Add .js

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        await connectDB();
        await requireAdmin(req);

        const period = (req.query.period as string) || "month";

        const getDateRange = () => {
            const now = new Date();
            if (period === "week") {
                const start = new Date(now);
                start.setDate(now.getDate() - 7);
                return { start, labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] };
            } else if (period === "month") {
                const start = new Date(now);
                start.setDate(now.getDate() - 28);
                return { start, labels: ["Week 1", "Week 2", "Week 3", "Week 4"] };
            } else {
                const start = new Date(now);
                start.setMonth(now.getMonth() - 12);
                return {
                    start,
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                };
            }
        };

        const { start, labels } = getDateRange();

        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: start } } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: period === "week" ? "%u" : period === "month" ? "%U" : "%m",
                            date: "$createdAt",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const chartGrowth = await Chart.aggregate([
            { $match: { createdAt: { $gte: start } } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: period === "week" ? "%u" : period === "month" ? "%U" : "%m",
                            date: "$createdAt",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const userMap = new Map(userGrowth.map((g) => [g._id, g.count]));
        const chartMap = new Map(chartGrowth.map((g) => [g._id, g.count]));

        const data = labels.map((label, index) => ({
            period: label,
            users: userMap.get(String(index + 1)) || 0,
            charts: chartMap.get(String(index + 1)) || 0,
        }));

        return res.status(200).json(data);
    } catch (error: any) {
        console.error("❌ Admin growth error:", error);

        if (error.message === "Unauthorized" || error.message === "Admin access required") {
            return res.status(403).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
}