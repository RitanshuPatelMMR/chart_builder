import { createContext, useContext, ReactNode } from "react";
import { useChartsApi } from "@/hooks/useChartsApi";

type ChartsContextType = ReturnType<typeof useChartsApi>;

const ChartsContext = createContext<ChartsContextType | null>(null);

export function ChartsProvider({ children }: { children: ReactNode }) {
    const chartsData = useChartsApi();

    return (
        <ChartsContext.Provider value={chartsData}>
            {children}
        </ChartsContext.Provider>
    );
}

export function useCharts() {
    const context = useContext(ChartsContext);
    if (!context) {
        throw new Error("useCharts must be used within ChartsProvider");
    }
    return context;
}