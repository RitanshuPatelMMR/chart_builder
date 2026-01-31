import mongoose, { Schema, Document } from "mongoose";

export type ChartType = "line" | "bar" | "area" | "pie" | "stacked";
export type ChartTheme = "default" | "emerald" | "sunset" | "mono" | "vibrant";

export interface ChartConfig {
    type: ChartType;
    theme: ChartTheme;
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    showLegend: boolean;
    showGrid: boolean;
}

export interface ChartDataPoint {
    [key: string]: string | number;
}

export interface SavedChartDocument extends Document {
    userId: string;
    name: string;
    data: ChartDataPoint[];
    columns: string[];
    config: ChartConfig;
    xAxisColumn: string;
    selectedYColumns: string[];
    thumbnail: string;
    tags: string[];
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChartSchema = new Schema<SavedChartDocument>(
    {
        userId: { type: String, required: true, index: true },
        name: { type: String, required: true },
        data: { type: Schema.Types.Mixed, required: true },
        columns: { type: [String], required: true },
        config: {
            type: {
                type: String,
                enum: ["line", "bar", "area", "pie", "stacked"],
                required: true
            },
            theme: {
                type: String,
                enum: ["default", "emerald", "sunset", "mono", "vibrant"],
                required: true
            },
            title: { type: String, default: "" },  // ✅ Changed: allow empty, default to ""
            xAxisLabel: { type: String, default: "" },  // ✅ Changed: allow empty, default to ""
            yAxisLabel: { type: String, default: "" },  // ✅ Changed: allow empty, default to ""
            showLegend: { type: Boolean, required: true },
            showGrid: { type: Boolean, required: true }
        },
        xAxisColumn: { type: String, required: true },
        selectedYColumns: { type: [String], required: true },
        thumbnail: { type: String, required: true },
        tags: { type: [String], default: [] },
        isFavorite: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const Chart = mongoose.model<SavedChartDocument>("Chart", ChartSchema);