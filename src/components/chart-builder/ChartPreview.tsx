import { forwardRef } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint, ChartConfig, CHART_THEMES } from '@/types/chart';
import { FileSpreadsheet } from 'lucide-react';

interface ChartPreviewProps {
  data: ChartDataPoint[];
  columns: string[];
  config: ChartConfig;
  xAxisColumn?: string;
  selectedYColumns?: string[];
}

export const ChartPreview = forwardRef<HTMLDivElement, ChartPreviewProps>(
  ({ data, columns, config, xAxisColumn, selectedYColumns }, ref) => {
    const { type, theme, title, xAxisLabel, yAxisLabel, showLegend, showGrid } = config;
    const colors = CHART_THEMES[theme].colors;

    // Use provided axis columns or default to first column as label, rest as values
    const labelKey = xAxisColumn || columns[0];
    const valueKeys = selectedYColumns && selectedYColumns.length > 0 
      ? selectedYColumns 
      : columns.filter(col => col !== labelKey);

    if (data.length === 0 || columns.length < 2) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] rounded-lg border border-dashed border-border bg-muted/30">
          <FileSpreadsheet className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">Load data to see chart preview</p>
        </div>
      );
    }

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    const renderChart = () => {
      switch (type) {
        case 'line':
          return (
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
              <XAxis dataKey={labelKey} label={xAxisLabel ? { value: xAxisLabel, position: 'bottom' } : undefined} />
              <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
              <Tooltip />
              {showLegend && <Legend />}
              {valueKeys.map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          );

        case 'bar':
          return (
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
              <XAxis dataKey={labelKey} label={xAxisLabel ? { value: xAxisLabel, position: 'bottom' } : undefined} />
              <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
              <Tooltip />
              {showLegend && <Legend />}
              {valueKeys.map((key, idx) => (
                <Bar key={key} dataKey={key} fill={colors[idx % colors.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          );

        case 'area':
          return (
            <AreaChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
              <XAxis dataKey={labelKey} label={xAxisLabel ? { value: xAxisLabel, position: 'bottom' } : undefined} />
              <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
              <Tooltip />
              {showLegend && <Legend />}
              {valueKeys.map((key, idx) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[idx % colors.length]}
                  fill={colors[idx % colors.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          );

        case 'pie':
          // For pie chart, use the first value column
          const pieData = data.map((item) => ({
            name: String(item[labelKey]),
            value: Number(item[valueKeys[0]]) || 0,
          }));

          return (
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              {showLegend && <Legend />}
            </PieChart>
          );

        case 'stacked':
          return (
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
              <XAxis dataKey={labelKey} label={xAxisLabel ? { value: xAxisLabel, position: 'bottom' } : undefined} />
              <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
              <Tooltip />
              {showLegend && <Legend />}
              {valueKeys.map((key, idx) => (
                <Bar key={key} dataKey={key} stackId="stack" fill={colors[idx % colors.length]} radius={idx === valueKeys.length - 1 ? [4, 4, 0, 0] : undefined} />
              ))}
            </BarChart>
          );

        default:
          return null;
      }
    };

    return (
      <div 
        ref={ref} 
        className="space-y-4 bg-white p-6 rounded-lg"
        style={{ backgroundColor: '#ffffff', color: '#000000' }}
      >
        {title && (
          <h2 className="text-lg font-semibold text-center" style={{ color: '#000000' }}>{title}</h2>
        )}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart() as React.ReactElement}
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);

ChartPreview.displayName = 'ChartPreview';
