import { LineChart, BarChart, AreaChart, PieChart, BarChart3 } from 'lucide-react';
import { ChartType, CHART_TYPES } from '@/types/chart';
import { cn } from '@/lib/utils';

interface ChartTypeSelectorProps {
  selected: ChartType;
  onSelect: (type: ChartType) => void;
}

const CHART_ICONS: Record<ChartType, React.ElementType> = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart,
  pie: PieChart,
  stacked: BarChart3,
};

export function ChartTypeSelector({ selected, onSelect }: ChartTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Chart Type</h3>
      <div className="grid grid-cols-5 gap-2">
        {CHART_TYPES.map(({ type, label, description }) => {
          const Icon = CHART_ICONS[type];
          const isSelected = selected === type;

          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-lg border p-3',
                'hover:border-primary/50 hover:bg-accent/50',
                isSelected && 'border-primary bg-primary/5'
              )}
              title={description}
            >
              <Icon className={cn('h-5 w-5', isSelected ? 'text-primary' : 'text-muted-foreground')} />
              <span className={cn('text-xs', isSelected ? 'font-medium text-primary' : 'text-muted-foreground')}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
