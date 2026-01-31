import { useEffect, useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/config/api";
import type { SavedChart } from "@/types/chart";
import { useUser, useSession } from "@clerk/clerk-react";

interface ChartInput {
    name: string;
    data: SavedChart["data"];
    columns: SavedChart["columns"];
    config: SavedChart["config"];
    xAxisColumn: string;
    selectedYColumns: string[];
    thumbnail: string;
    tags: string[];
    isFavorite: boolean;
}

export function useChartsApi() {
    const { isSignedIn } = useUser();
    const { session } = useSession();
    const [charts, setCharts] = useState<SavedChart[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getToken = useCallback(async () => {
        if (!session) return null;
        return session.getToken();
    }, [session]);

    const loadCharts = useCallback(async () => {
        if (!isSignedIn) {
            setCharts([]);
            return;
        }

        setIsLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(API_ENDPOINTS.charts.list, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!res.ok) throw new Error("Failed to load charts");

            const data = (await res.json()) as SavedChart[];
            setCharts(data);
            console.log("📥 Charts loaded:", data.length, "charts");
        } catch (err) {
            console.error("❌ Failed to load charts", err);
        } finally {
            setIsLoading(false);
        }
    }, [getToken, isSignedIn]);

    useEffect(() => {
        loadCharts();
    }, [loadCharts]);

    const saveChart = useCallback(
        async (input: ChartInput): Promise<SavedChart | null> => {
            const token = await getToken();
            const res = await fetch(API_ENDPOINTS.charts.create, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(input),
            });

            if (!res.ok) {
                console.error("❌ Failed to save chart", await res.text());
                return null;
            }

            const created = (await res.json()) as SavedChart;
            setCharts((prev) => [created, ...prev]);
            return created;
        },
        [getToken]
    );

    const updateChart = useCallback(
        async (
            id: string,
            updates: Partial<ChartInput>
        ): Promise<SavedChart | null> => {
            const token = await getToken();
            const res = await fetch(API_ENDPOINTS.charts.update(id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(updates),
            });

            if (!res.ok) {
                console.error("❌ Failed to update chart", await res.text());
                return null;
            }

            const updated = (await res.json()) as SavedChart;
            setCharts((prev) => prev.map((c) => (c.id === id ? updated : c)));
            return updated;
        },
        [getToken]
    );

    const deleteChart = useCallback(
        async (id: string): Promise<boolean> => {
            const token = await getToken();
            const res = await fetch(API_ENDPOINTS.charts.delete(id), {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!res.ok) {
                console.error("❌ Failed to delete chart", await res.text());
                return false;
            }

            const json = await res.json();
            if (!json.success) return false;

            setCharts((prev) => prev.filter((c) => c.id !== id));
            return true;
        },
        [getToken]
    );

    const duplicateChart = useCallback(
        async (id: string): Promise<SavedChart | null> => {
            const token = await getToken();
            const res = await fetch(API_ENDPOINTS.charts.duplicate(id), {
                method: "POST",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!res.ok) {
                console.error("❌ Failed to duplicate chart", await res.text());
                return null;
            }

            const duplicated = (await res.json()) as SavedChart;
            setCharts((prev) => [duplicated, ...prev]);
            return duplicated;
        },
        [getToken]
    );

    const getChart = useCallback(
        async (id: string): Promise<SavedChart | null> => {
            const existing = charts.find((c) => c.id === id);
            if (existing) return existing;

            const token = await getToken();
            const res = await fetch(API_ENDPOINTS.charts.get(id), {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!res.ok) return null;

            const chart = (await res.json()) as SavedChart;
            // Optionally merge into state
            setCharts((prev) =>
                prev.some((c) => c.id === id) ? prev : [chart, ...prev]
            );
            return chart;
        },
        [charts, getToken]
    );

    return {
        charts,
        isLoading,
        loadCharts,
        saveChart,
        updateChart,
        deleteChart,
        duplicateChart,
        getChart,
    };
}