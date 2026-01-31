import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../../lib/mongodb.js";  // ← Add .js
import { requireAuth } from "../../lib/auth.js";  // ← Add .js
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
        const userId = await requireAuth(req);
        const { id } = req.query;

        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Invalid chart ID" });
        }

        // GET /api/charts/:id - Get single chart
        if (req.method === "GET") {
            console.log("📥 GET /api/charts/:id - Chart:", id);

            const chart = await Chart.findOne({ _id: id, userId });

            if (!chart) {
                console.log("❌ Chart not found");
                return res.status(404).json({ error: "Chart not found" });
            }

            console.log("✅ Chart found");
            return res.status(200).json({
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

        // PUT /api/charts/:id - Update chart
        if (req.method === "PUT") {
            console.log("📝 Updating chart:", id);

            const chart = await Chart.findOneAndUpdate(
                { _id: id, userId },
                { ...req.body },
                { new: true }
            );

            if (!chart) {
                return res.status(404).json({ error: "Chart not found" });
            }

            console.log("✅ Chart updated");
            return res.status(200).json({
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

        // DELETE /api/charts/:id - Delete chart
        if (req.method === "DELETE") {
            console.log("🗑️ Deleting chart:", id);

            const result = await Chart.deleteOne({ _id: id, userId });

            if (result.deletedCount === 0) {
                return res.status(404).json({ success: false });
            }

            console.log("✅ Chart deleted");
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (error: any) {
        console.error("❌ Chart API error:", error);

        if (error.message === "Unauthorized") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
}