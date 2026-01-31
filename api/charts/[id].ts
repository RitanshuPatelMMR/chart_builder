import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../../lib/mongodb.js";
import { requireAuth } from "../../lib/auth.js";
import { setCorsHeaders } from "../../lib/cors.js";
import { Chart } from "../../models/Chart.js";

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

        // GET /api/charts/:id
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

        // PUT /api/charts/:id
        if (req.method === "PUT") {
            console.log("📝 PUT /api/charts/:id - Updating chart:", id);
            console.log("📝 Updates:", req.body);

            const chart = await Chart.findOneAndUpdate(
                { _id: id, userId },
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (!chart) {
                console.log("❌ Chart not found for update");
                return res.status(404).json({ error: "Chart not found" });
            }

            console.log("✅ Chart updated successfully");
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

        // DELETE /api/charts/:id
        if (req.method === "DELETE") {
            console.log("🗑️ DELETE /api/charts/:id - Deleting chart:", id);

            const result = await Chart.deleteOne({ _id: id, userId });

            if (result.deletedCount === 0) {
                console.log("❌ Chart not found for deletion");
                return res.status(404).json({ success: false, error: "Chart not found" });
            }

            console.log("✅ Chart deleted successfully");
            return res.status(200).json({ success: true });
        }

        // Method not supported
        console.log("❌ Method not allowed:", req.method);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });

    } catch (error: any) {
        console.error("❌ Chart [id] API error:", error);

        if (error.message === "Unauthorized") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
}