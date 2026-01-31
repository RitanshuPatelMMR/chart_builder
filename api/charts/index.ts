import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../../lib/mongodb.js";  // ← Add .js
import { requireAuth, getOrCreateUser } from "../../lib/auth.js";  // ← Add .js
import { setCorsHeaders } from "../../lib/cors.js";  // ← Add .js
import { Chart } from "../../models/Chart.js";  // ← Add .js

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        await connectDB();
        const clerkUserId = await requireAuth(req);
        const user = await getOrCreateUser(clerkUserId);

        // GET /api/charts - List all charts for user
        if (req.method === "GET") {
            console.log("📥 GET /api/charts - User:", user.email);

            const charts = await Chart.find({ userId: clerkUserId }).sort({
                updatedAt: -1,
            });

            const formattedCharts = charts.map((chart) => ({
                id: chart._id.toString(),
                name: chart.name,
                data: chart.data,
                columns: chart.columns,
                config: chart.config,
                xAxisColumn: chart.xAxisColumn,
                selectedYColumns: chart.selectedYColumns,
                thumbnail: chart.thumbnail,
                tags: chart.tags,
                isFavorite: chart.isFavorite,
                createdAt: chart.createdAt.toISOString(),
                updatedAt: chart.updatedAt.toISOString(),
            }));

            console.log("✅ Found", formattedCharts.length, "charts");
            return res.status(200).json(formattedCharts);
        }

        // POST /api/charts - Create new chart
        if (req.method === "POST") {
            console.log("📝 Creating chart for:", user.email);
            console.log("📊 Chart name:", req.body.name);

            const chart = await Chart.create({
                userId: clerkUserId,
                name: req.body.name,
                data: req.body.data,
                columns: req.body.columns,
                config: req.body.config,
                xAxisColumn: req.body.xAxisColumn,
                selectedYColumns: req.body.selectedYColumns,
                thumbnail: req.body.thumbnail,
                tags: req.body.tags ?? [],
                isFavorite: req.body.isFavorite ?? false,
            });

            console.log("✅ Chart created with ID:", chart._id);

            return res.status(201).json({
                id: chart._id.toString(),
                name: chart.name,
                data: chart.data,
                columns: chart.columns,
                config: chart.config,
                xAxisColumn: chart.xAxisColumn,
                selectedYColumns: chart.selectedYColumns,
                thumbnail: chart.thumbnail,
                tags: chart.tags,
                isFavorite: chart.isFavorite,
                createdAt: chart.createdAt.toISOString(),
                updatedAt: chart.updatedAt.toISOString(),
            });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (error: any) {
        console.error("❌ Charts API error:", error);

        if (error.message === "Unauthorized") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
}