export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'stacked';

export type ChartTheme = 'default' | 'emerald' | 'sunset' | 'mono' | 'vibrant';

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface ChartConfig {
  type: ChartType;
  theme: ChartTheme;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  showLegend: boolean;
  showGrid: boolean;
}

export interface ChartState {
  data: ChartDataPoint[];
  columns: string[];
  config: ChartConfig;
}

export interface SavedChart {
  id: string;
  name: string;
  data: ChartDataPoint[];
  columns: string[];
  config: ChartConfig;
  xAxisColumn: string;
  selectedYColumns: string[];
  thumbnail: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CONFIG: ChartConfig = {
  type: 'bar',
  theme: 'default',
  title: '',
  xAxisLabel: '',
  yAxisLabel: '',
  showLegend: true,
  showGrid: true,
};

export const CHART_THEMES: Record<ChartTheme, { name: string; colors: string[] }> = {
  default: {
    name: 'Default (Blue)',
    colors: ['hsl(217, 91%, 60%)', 'hsl(217, 91%, 50%)', 'hsl(217, 91%, 70%)', 'hsl(217, 91%, 40%)'],
  },
  emerald: {
    name: 'Emerald',
    colors: ['hsl(158, 64%, 52%)', 'hsl(158, 64%, 42%)', 'hsl(158, 64%, 62%)', 'hsl(158, 64%, 32%)'],
  },
  sunset: {
    name: 'Sunset',
    colors: ['hsl(25, 95%, 53%)', 'hsl(45, 93%, 47%)', 'hsl(0, 84%, 60%)', 'hsl(15, 90%, 50%)'],
  },
  mono: {
    name: 'Mono (Gray)',
    colors: ['hsl(220, 9%, 30%)', 'hsl(220, 9%, 40%)', 'hsl(220, 9%, 50%)', 'hsl(220, 9%, 60%)'],
  },
  vibrant: {
    name: 'Vibrant',
    colors: ['hsl(262, 83%, 58%)', 'hsl(330, 81%, 60%)', 'hsl(25, 95%, 53%)', 'hsl(142, 71%, 45%)'],
  },
};

export const CHART_TYPES: { type: ChartType; label: string; description: string }[] = [
  { type: 'line', label: 'Line', description: 'Trends over time' },
  { type: 'bar', label: 'Bar', description: 'Compare categories' },
  { type: 'area', label: 'Area', description: 'Volume over time' },
  { type: 'pie', label: 'Pie', description: 'Parts of a whole' },
  { type: 'stacked', label: 'Stacked', description: 'Stacked comparison' },
];
