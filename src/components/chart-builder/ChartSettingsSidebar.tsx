import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChartConfig, ChartType, CHART_TYPES } from '@/types/chart';
import { cn } from '@/lib/utils';
import { RotateCcw, LineChart, BarChart, AreaChart, PieChart, Layers } from 'lucide-react';

interface ChartSettingsSidebarProps {
  config: ChartConfig;
  columns: string[];
  selectedYColumns: string[];
  onUpdateConfig: (updates: Partial<ChartConfig>) => void;
  onXAxisChange: (column: string) => void;
  onYColumnsChange: (columns: string[]) => void;
  xAxisColumn: string;
  onReset: () => void;
}

const CHART_TYPE_ICONS: Record<ChartType, React.ElementType> = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart,
  pie: PieChart,
  stacked: Layers,
};

export function ChartSettingsSidebar({
  config,
  columns,
  selectedYColumns,
  onUpdateConfig,
  onXAxisChange,
  onYColumnsChange,
  xAxisColumn,
  onReset,
}: ChartSettingsSidebarProps) {
  // Get numeric columns for Y-axis (excluding the X-axis column)
  const availableYColumns = columns.filter(col => col !== xAxisColumn);

  const handleYColumnToggle = (column: string, checked: boolean) => {
    if (checked) {
      onYColumnsChange([...selectedYColumns, column]);
    } else {
      onYColumnsChange(selectedYColumns.filter(c => c !== column));
    }
  };

  return (
    <aside 
      className="rounded-lg border bg-card p-4 sm:p-5 space-y-4 sm:space-y-6 w-full lg:w-72 shrink-0"
      role="region"
      aria-label="Chart settings"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Chart Settings</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      {/* Chart Title */}
      <div className="space-y-2">
        <Label htmlFor="chart-title" className="text-sm font-medium">
          Chart Title
        </Label>
        <Input
          id="chart-title"
          placeholder="Enter title..."
          value={config.title}
          onChange={(e) => onUpdateConfig({ title: e.target.value })}
          className="h-9"
        />
      </div>

      {/* Chart Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Chart Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {CHART_TYPES.map(({ type, label }) => {
            const Icon = CHART_TYPE_ICONS[type];
            return (
              <button
                key={type}
                onClick={() => onUpdateConfig({ type })}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
                  'hover:border-primary/50 transition-colors',
                  config.type === type
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-background'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* X-Axis */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">X-Axis</Label>
        <Select value={xAxisColumn} onValueChange={onXAxisChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {columns.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Y-Axis (Values) */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Y-Axis (Values)</Label>
        <div className="rounded-lg border bg-background p-3 space-y-2 max-h-32 overflow-y-auto">
          {availableYColumns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No columns available</p>
          ) : (
            availableYColumns.map((column) => (
              <div key={column} className="flex items-center gap-2">
                <Checkbox
                  id={`y-${column}`}
                  checked={selectedYColumns.includes(column)}
                  onCheckedChange={(checked) => handleYColumnToggle(column, checked === true)}
                />
                <label
                  htmlFor={`y-${column}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {column}
                </label>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4 pt-2 border-t">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-legend" className="text-sm cursor-pointer">
            Show Legend
          </Label>
          <Switch
            id="show-legend"
            checked={config.showLegend}
            onCheckedChange={(checked) => onUpdateConfig({ showLegend: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-grid" className="text-sm cursor-pointer">
            Show Grid
          </Label>
          <Switch
            id="show-grid"
            checked={config.showGrid}
            onCheckedChange={(checked) => onUpdateConfig({ showGrid: checked })}
          />
        </div>
      </div>
    </aside>
  );
}
