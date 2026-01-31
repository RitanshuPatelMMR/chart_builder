import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../../../lib/mongodb.js";  // ← Add .js
import { requireAdmin } from "../../../lib/auth.js";  // ← Add .js
import { setCorsHeaders } from "../../../lib/cors.js";  // ← Add .js
import { User } from "../../../models/User.js";  // ← Add .js
import { Chart } from "../../../models/Chart.js";  // ← Add .js

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

        console.log("📥 Admin fetching all users");

        const users = await User.find().sort({ createdAt: -1 });

        const usersWithCharts = await Promise.all(
            users.map(async (user) => {
                const chartsCount = await Chart.countDocuments({
                    userId: user.clerkUserId,
                });

                return {
                    id: user.clerkUserId,
                    name: user.email.split("@")[0],
                    email: user.email,
                    role: user.role,
                    plan: "free" as const,
                    status: (user.isActive ? "active" : "inactive") as "active" | "inactive",
                    chartsCount,
                    joinedAt: user.createdAt.toISOString(),
                    lastLogin: user.lastLoginAt?.toISOString() || null,
                    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                };
            })
        );

        console.log("✅ Returning", usersWithCharts.length, "users");
        return res.status(200).json(usersWithCharts);
    } catch (error: any) {
        console.error("❌ Admin users error:", error);

        if (error.message === "Unauthorized" || error.message === "Admin access required") {
            return res.status(403).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
}