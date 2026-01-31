import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { useChartData } from '@/hooks/useChartData';
import { useToast } from '@/hooks/use-toast';
import { useSaveShortcut, useEscapeShortcut } from '@/hooks/useKeyboardShortcuts';
import { DataInput } from './DataInput';
import { DataTable } from './DataTable';
import { ChartSettingsSidebar } from './ChartSettingsSidebar';
import { ChartCustomizer } from './ChartCustomizer';
import { ChartPreview } from './ChartPreview';
import { ExportOptions } from './ExportOptions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Table, BarChart3, Save, Loader2, Upload, Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ChartConfig, ChartDataPoint, SavedChart } from '@/types/chart';
import { useCharts } from '@/contexts/ChartsContext';

interface TemplateData {
  data: ChartDataPoint[];
  columns: string[];
  config: Partial<ChartConfig>;
  xAxisColumn?: string;
  selectedYColumns?: string[];
}

interface ChartBuilderProps {
  initialTemplate?: TemplateData;
  editingChartId?: string;
}

export function ChartBuilder({ initialTemplate, editingChartId }: ChartBuilderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveChart, updateChart } = useCharts();
  const [isSaving, setIsSaving] = useState(false);
  const [chartName, setChartName] = useState('');

  const {
    data,
    columns,
    config,
    hasData,
    xAxisColumn,
    selectedYColumns,
    loadData,
    updateCell,
    addRow,
    removeRow,
    updateColumnName,
    updateConfig,
    clearData,
    resetConfig,
    setXAxisColumn,
    setSelectedYColumns,
  } = useChartData();

  const templateLoadedRef = useRef(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Load template data if provided
  useEffect(() => {
    if (initialTemplate && !templateLoadedRef.current) {
      templateLoadedRef.current = true;
      loadData(initialTemplate.data, initialTemplate.columns);
      if (initialTemplate.config) {
        updateConfig(initialTemplate.config);
        setChartName(initialTemplate.config.title || '');
      }
      if (initialTemplate.xAxisColumn) {
        setXAxisColumn(initialTemplate.xAxisColumn);
      }
      if (initialTemplate.selectedYColumns) {
        setSelectedYColumns(initialTemplate.selectedYColumns);
      }
    }
  }, [initialTemplate, loadData, updateConfig, setXAxisColumn, setSelectedYColumns]);

  const handleClearData = () => {
    templateLoadedRef.current = false;
    clearData();
    setChartName('');
    navigate('/dashboard');
  };

  const handleSave = useCallback(async () => {
    if (!chartRef.current || isSaving) return;

    setIsSaving(true);
    try {
      const thumbnail = await toPng(chartRef.current, {
        quality: 0.8,
        pixelRatio: 1,
        backgroundColor: '#ffffff',
      });

      const chartData = {
        name: chartName || config.title || 'Untitled Chart',
        data,
        columns,
        config: { ...config, title: chartName || config.title },
        xAxisColumn,
        selectedYColumns,
        thumbnail,
        tags: [] as string[],
        isFavorite: false,
      };

      if (editingChartId) {
        await updateChart(editingChartId, chartData);
        toast({
          title: "Chart updated",
          description: "Your changes have been saved.",
        });
      } else {
        await saveChart(chartData);
        toast({
          title: "Chart saved",
          description: "Your chart has been saved to My Charts.",
        });
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save chart:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your chart.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [chartRef, isSaving, chartName, config, data, columns, xAxisColumn, selectedYColumns, editingChartId, updateChart, saveChart, toast, navigate]);

  useSaveShortcut(handleSave, !hasData);
  useEscapeShortcut(handleClearData, !hasData);

  const handleImportJSON = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content) as Partial<SavedChart>;

        if (imported.data && imported.columns) {
          loadData(imported.data, imported.columns);
          if (imported.config) {
            updateConfig(imported.config);
            setChartName(imported.config.title || imported.name || '');
          }
          if (imported.xAxisColumn) {
            setXAxisColumn(imported.xAxisColumn);
          }
          if (imported.selectedYColumns) {
            setSelectedYColumns(imported.selectedYColumns);
          }
          toast({
            title: "Chart imported",
            description: "Chart configuration loaded successfully.",
          });
        } else {
          throw new Error('Invalid chart format');
        }
      } catch {
        toast({
          title: "Import failed",
          description: "Could not parse the JSON file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [loadData, updateConfig, setXAxisColumn, setSelectedYColumns, toast]);

  const jsonInputRef = useRef<HTMLInputElement>(null);

  return (
      <div className="space-y-4 md:space-y-6 pb-6" role="main" aria-label="Chart Builder">
        <input
            ref={jsonInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportJSON}
            aria-label="Import chart from JSON file"
        />

        {/* Data Input Section */}
        {!hasData && (
            <div className="max-w-2xl mx-auto space-y-4 px-4">
              <DataInput onDataLoad={loadData} />

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Or import an existing chart</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => jsonInputRef.current?.click()}
                    className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import from JSON
                </Button>
              </div>
            </div>
        )}

        {/* Main Builder Interface */}
        {hasData && (
            <>
              {/* Header: Back Button + Chart Name + Save (Mobile Optimized) */}
              <div className="flex flex-col gap-3 px-4 md:px-0">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearData}
                    className="gap-2 text-muted-foreground hover:text-foreground self-start -ml-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Charts</span>
                  <span className="sm:hidden">Back</span>
                </Button>

                {/* Chart Name & Save - Stack on mobile */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Input
                      placeholder="Chart name..."
                      value={chartName}
                      onChange={(e) => setChartName(e.target.value)}
                      className="flex-1"
                  />
                  <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="gap-2 w-full sm:w-auto"
                  >
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {editingChartId ? 'Update' : 'Save'}
                  </Button>
                </div>
              </div>

              {/* Main Layout: Sidebar + Content */}
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block lg:w-80 flex-shrink-0">
                  <ChartSettingsSidebar
                      config={config}
                      columns={columns}
                      selectedYColumns={selectedYColumns}
                      onUpdateConfig={updateConfig}
                      onXAxisChange={setXAxisColumn}
                      onYColumnsChange={setSelectedYColumns}
                      xAxisColumn={xAxisColumn}
                      onReset={resetConfig}
                  />
                </div>

                {/* Mobile Settings (Sheet) */}
                <div className="lg:hidden px-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full gap-2">
                        <Settings className="h-4 w-4" />
                        Chart Settings
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
                      <SheetHeader className="mb-4">
                        <SheetTitle>Chart Settings</SheetTitle>
                        <SheetDescription>
                          Customize your chart appearance and data columns
                        </SheetDescription>
                      </SheetHeader>
                      <ChartSettingsSidebar
                          config={config}
                          columns={columns}
                          selectedYColumns={selectedYColumns}
                          onUpdateConfig={updateConfig}
                          onXAxisChange={setXAxisColumn}
                          onYColumnsChange={setSelectedYColumns}
                          xAxisColumn={xAxisColumn}
                          onReset={resetConfig}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 space-y-4 md:space-y-6 min-w-0 px-4 lg:px-0">
                  {/* Data Table / Chart Preview Tabs */}
                  <div className="rounded-lg border bg-card overflow-hidden">
                    <Tabs defaultValue="preview" className="w-full">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b px-4 gap-3 sm:gap-0 py-2 sm:py-0">
                        <TabsList className="h-auto sm:h-12 bg-transparent border-0 p-0 w-full sm:w-auto">
                          <TabsTrigger
                              value="table"
                              className="gap-2 flex-1 sm:flex-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none text-xs sm:text-sm"
                          >
                            <Table className="h-4 w-4" />
                            <span className="hidden sm:inline">Data Table</span>
                            <span className="sm:hidden">Table</span>
                          </TabsTrigger>
                          <TabsTrigger
                              value="preview"
                              className="gap-2 flex-1 sm:flex-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none text-xs sm:text-sm"
                          >
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Chart Preview</span>
                            <span className="sm:hidden">Chart</span>
                          </TabsTrigger>
                        </TabsList>
                        <div className="w-full sm:w-auto">
                          <ExportOptions
                              disabled={!hasData}
                              chartRef={chartRef}
                              chartTitle={config.title}
                          />
                        </div>
                      </div>

                      <TabsContent value="table" className="p-2 sm:p-4 mt-0">
                        <div className="overflow-x-auto -mx-2 sm:mx-0">
                          <DataTable
                              data={data}
                              columns={columns}
                              onUpdateCell={updateCell}
                              onAddRow={addRow}
                              onRemoveRow={removeRow}
                              onUpdateColumnName={updateColumnName}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="preview" className="p-2 sm:p-4 mt-0">
                        <div className="overflow-x-auto -mx-2 sm:mx-0">
                          <ChartPreview
                              ref={chartRef}
                              data={data}
                              columns={columns}
                              config={config}
                              xAxisColumn={xAxisColumn}
                              selectedYColumns={selectedYColumns}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Color Theme */}
                  <ChartCustomizer config={config} onUpdate={updateConfig} />
                </div>
              </div>
            </>
        )}
      </div>
  );
}