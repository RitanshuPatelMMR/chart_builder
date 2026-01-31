import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../../lib/mongodb.js";  // ← Add .js
import { requireAuth, getOrCreateUser } from "../../lib/auth.js";  // ← Add .js
import { setCorsHeaders } from "../../lib/cors.js";  // ← Add .js

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
        const clerkUserId = await requireAuth(req);
        const user = await getOrCreateUser(clerkUserId);

        return res.status(200).json({
            id: user.clerkUserId,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        });
    } catch (error: any) {
        console.error("❌ User API error:", error);

        if (error.message === "Unauthorized") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
}