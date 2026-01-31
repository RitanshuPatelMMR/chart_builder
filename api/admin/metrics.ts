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

        const totalUsers = await User.countDocuments();
        const freeUsers = await User.countDocuments({ role: "user" });
        const premiumUsers = 0; // Phase 2
        const totalCharts = await Chart.countDocuments();

        return res.status(200).json({
            totalUsers,
            freeUsers,
            premiumUsers,
            totalCharts,
            totalRevenue: 0,
        });
    } catch (error: any) {
        console.error("❌ Admin metrics error:", error);

        if (error.message === "Unauthorized" || error.message === "Admin access required") {
            return res.status(403).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
}