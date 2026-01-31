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

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        await connectDB();
        const userId = await requireAuth(req);
        const { id } = req.query;

        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Invalid chart ID" });
        }

        console.log("📋 Duplicating chart:", id);

        const original = await Chart.findOne({ _id: id, userId });

        if (!original) {
            return res.status(404).json({ error: "Chart not found" });
        }

        const duplicate = await Chart.create({
            userId,
            name: `${original.name} (Copy)`,
            data: original.data,
            columns: original.columns,
            config: original.config,
            xAxisColumn: original.xAxisColumn,
            selectedYColumns: original.selectedYColumns,
            thumbnail: original.thumbnail,
            tags: original.tags,
            isFavorite: original.isFavorite,
        });

        console.log("✅ Chart duplicated with ID:", duplicate._id);

        return res.status(201).json({
            id: duplicate._id.toString(),
            name: duplicate.name,
            data: duplicate.data,
            columns: duplicate.columns,
            config: duplicate.config,
            xAxisColumn: duplicate.xAxisColumn,
            selectedYColumns: duplicate.selectedYColumns,
            thumbnail: duplicate.thumbnail,
            tags: duplicate.tags,
            isFavorite: duplicate.isFavorite,
            createdAt: duplicate.createdAt.toISOString(),
            updatedAt: duplicate.updatedAt.toISOString(),
        });
    } catch (error: any) {
        console.error("❌ Duplicate chart error:", error);

        if (error.message === "Unauthorized") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
}