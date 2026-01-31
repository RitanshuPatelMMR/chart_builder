import { ChartConfig, ChartTheme, CHART_THEMES } from '@/types/chart';
import { cn } from '@/lib/utils';

interface ChartCustomizerProps {
    config: ChartConfig;
    onUpdate: (updates: Partial<ChartConfig>) => void;
}

export function ChartCustomizer({ config, onUpdate }: ChartCustomizerProps) {
    return (
        <div className="rounded-lg border bg-card p-4 sm:p-6">
            <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Color Theme</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 sm:gap-3">
                {(Object.entries(CHART_THEMES) as [ChartTheme, { name: string; colors: string[] }][]).map(
                    ([key, { name, colors }]) => (
                        <button
                            key={key}
                            onClick={() => onUpdate({ theme: key })}
                            className={cn(
                                'flex items-center gap-2 rounded-lg border px-3 sm:px-4 py-2 sm:py-2.5',
                                'hover:border-primary/50 transition-colors w-full lg:w-auto',
                                config.theme === key
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border bg-background'
                            )}
                        >
                            <div className="flex gap-0.5">
                                {colors.slice(0, 4).map((color, idx) => (
                                    <div
                                        key={idx}
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm font-medium">{name}</span>
                        </button>
                    )
                )}
            </div>
        </div>
    );
}