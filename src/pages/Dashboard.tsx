import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartBuilder } from "@/components/chart-builder/ChartBuilder";
import { TemplatesPage } from "@/components/templates/TemplatesPage";
import MyCharts from "@/pages/MyCharts";
import { useLocalCharts } from "@/hooks/useLocalCharts";
import { SavedChart } from "@/types/chart";

function NewChartPage() {
    const location = useLocation();
    const templateState = location.state?.template;

    return <ChartBuilder initialTemplate={templateState} />;
}

function EditChartPage() {
    const { id } = useParams<{ id: string }>();
    const { getChart } = useLocalCharts();
    const [chart, setChart] = useState<SavedChart | null | "loading">("loading");

    useEffect(() => {
        if (!id) {
            setChart(null);
            return;
        }
        (async () => {
            try {
                const c = await getChart(id);
                setChart(c);
            } catch {
                setChart(null);
            }
        })();
    }, [id, getChart]);

    if (chart === "loading") {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <p className="text-sm text-muted-foreground mt-1">Loading chart...</p>
            </div>
        );
    }

    if (!chart) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <h2 className="text-lg font-semibold">Chart not found</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    This chart may have been deleted.
                </p>
            </div>
        );
    }

    return (
        <ChartBuilder
            editingChartId={chart.id}
            initialTemplate={{
                data: chart.data,
                columns: chart.columns,
                config: chart.config,
                xAxisColumn: chart.xAxisColumn,
                selectedYColumns: chart.selectedYColumns,
            }}
        />
    );
}

export default function Dashboard() {
    return (
        <DashboardLayout>
            <Routes>
                <Route index element={<MyCharts />} />
                <Route path="new" element={<NewChartPage />} />
                <Route path="chart/:id" element={<EditChartPage />} />
                <Route path="templates" element={<TemplatesPage />} />
            </Routes>
        </DashboardLayout>
    );
}