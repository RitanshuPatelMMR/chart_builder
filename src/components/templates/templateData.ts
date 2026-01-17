import { TrendingUp, BarChart3, AreaChart, PieChart, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ChartType, ChartTheme, ChartDataPoint, ChartConfig } from '@/types/chart';

export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  chartType: ChartType;
  theme: ChartTheme;
  sampleData: ChartDataPoint[];
  sampleColumns: string[];
  config: Partial<ChartConfig>;
}

export const chartTemplates: ChartTemplate[] = [
  {
    id: 'trend-analysis',
    name: 'Trend Analysis',
    description: 'Track metrics over time with a line chart',
    icon: TrendingUp,
    chartType: 'line',
    theme: 'default',
    sampleData: [
      { Month: 'Jan', Sales: 4000, Revenue: 2400 },
      { Month: 'Feb', Sales: 3000, Revenue: 1398 },
      { Month: 'Mar', Sales: 5000, Revenue: 3800 },
      { Month: 'Apr', Sales: 2780, Revenue: 3908 },
      { Month: 'May', Sales: 4890, Revenue: 4800 },
      { Month: 'Jun', Sales: 6390, Revenue: 5800 },
    ],
    sampleColumns: ['Month', 'Sales', 'Revenue'],
    config: {
      title: 'Monthly Performance',
      xAxisLabel: 'Month',
      yAxisLabel: 'Value',
      showLegend: true,
      showGrid: true,
    },
  },
  {
    id: 'category-comparison',
    name: 'Category Comparison',
    description: 'Compare different categories with a bar chart',
    icon: BarChart3,
    chartType: 'bar',
    theme: 'emerald',
    sampleData: [
      { Product: 'Laptops', Sales: 4200 },
      { Product: 'Phones', Sales: 3800 },
      { Product: 'Tablets', Sales: 2900 },
      { Product: 'Watches', Sales: 1800 },
      { Product: 'Headphones', Sales: 2400 },
    ],
    sampleColumns: ['Product', 'Sales'],
    config: {
      title: 'Product Sales Comparison',
      xAxisLabel: 'Product',
      yAxisLabel: 'Sales ($)',
      showLegend: false,
      showGrid: true,
    },
  },
  {
    id: 'growth-chart',
    name: 'Growth Chart',
    description: 'Visualize growth trends with an area chart',
    icon: AreaChart,
    chartType: 'area',
    theme: 'sunset',
    sampleData: [
      { Quarter: 'Q1 2023', Revenue: 12000, Expenses: 8000 },
      { Quarter: 'Q2 2023', Revenue: 15000, Expenses: 9500 },
      { Quarter: 'Q3 2023', Revenue: 18500, Expenses: 10200 },
      { Quarter: 'Q4 2023', Revenue: 22000, Expenses: 11800 },
      { Quarter: 'Q1 2024', Revenue: 26500, Expenses: 13000 },
    ],
    sampleColumns: ['Quarter', 'Revenue', 'Expenses'],
    config: {
      title: 'Quarterly Financial Growth',
      xAxisLabel: 'Quarter',
      yAxisLabel: 'Amount ($)',
      showLegend: true,
      showGrid: true,
    },
  },
  {
    id: 'distribution',
    name: 'Distribution',
    description: 'Show proportions with a pie chart',
    icon: PieChart,
    chartType: 'pie',
    theme: 'vibrant',
    sampleData: [
      { Segment: 'Enterprise', Share: 42 },
      { Segment: 'SMB', Share: 28 },
      { Segment: 'Startup', Share: 18 },
      { Segment: 'Individual', Share: 12 },
    ],
    sampleColumns: ['Segment', 'Share'],
    config: {
      title: 'Market Share Distribution',
      showLegend: true,
      showGrid: false,
    },
  },
  {
    id: 'stacked-comparison',
    name: 'Stacked Comparison',
    description: 'Compare multiple series with stacked bars',
    icon: Layers,
    chartType: 'stacked',
    theme: 'mono',
    sampleData: [
      { Region: 'North', Q1: 4000, Q2: 3500, Q3: 4200, Q4: 5100 },
      { Region: 'South', Q1: 3200, Q2: 2800, Q3: 3600, Q4: 4200 },
      { Region: 'East', Q1: 2800, Q2: 3200, Q3: 2900, Q4: 3800 },
      { Region: 'West', Q1: 3600, Q2: 4100, Q3: 3800, Q4: 4600 },
    ],
    sampleColumns: ['Region', 'Q1', 'Q2', 'Q3', 'Q4'],
    config: {
      title: 'Regional Sales by Quarter',
      xAxisLabel: 'Region',
      yAxisLabel: 'Sales ($)',
      showLegend: true,
      showGrid: true,
    },
  },
];
