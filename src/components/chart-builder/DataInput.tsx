import { useCallback, useRef, useState } from 'react';
import { Upload, FileSpreadsheet, ClipboardPaste } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ChartDataPoint } from '@/types/chart';
import * as XLSX from 'xlsx';

interface DataInputProps {
  onDataLoad: (data: ChartDataPoint[], columns: string[]) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ROWS = 1000;

export function DataInput({ onDataLoad }: DataInputProps) {
  const [pasteValue, setPasteValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Helper to parse CSV text manually
  const parseCSV = useCallback((text: string): { data: ChartDataPoint[]; columns: string[] } | null => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return null;

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const data: ChartDataPoint[] = [];

    for (let i = 1; i < Math.min(lines.length, MAX_ROWS + 1); i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const row: ChartDataPoint = {};
      headers.forEach((header, idx) => {
        const value = values[idx] || '';
        const numValue = parseFloat(value);
        row[header] = isNaN(numValue) ? value : numValue;
      });
      data.push(row);
    }

    return { data, columns: headers };
  }, []);

  // Helper to parse JSON text
  const parseJSON = useCallback((text: string): { data: ChartDataPoint[]; columns: string[] } | null => {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed) || parsed.length === 0) return null;

      const columns = Object.keys(parsed[0]);
      const data = parsed.slice(0, MAX_ROWS);
      return { data, columns };
    } catch {
      return null;
    }
  }, []);

  // Unified File Handler
  const handleFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON - this handles both CSV and Excel effectively
        const jsonData = XLSX.utils.sheet_to_json<ChartDataPoint>(worksheet, { defval: '' });

        if (jsonData.length > 0) {
          const columns = Object.keys(jsonData[0]);
          const limitedData = jsonData.slice(0, MAX_ROWS);

          onDataLoad(limitedData, columns);

          toast({
            title: "Data loaded",
            description: `Successfully imported ${limitedData.length} rows.`,
          });
        } else {
          throw new Error('No data found');
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Could not parse the file. Ensure it is a valid Excel or CSV file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onDataLoad, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handlePaste = useCallback(() => {
    if (!pasteValue.trim()) return;

    let result = parseJSON(pasteValue);
    if (!result) {
      result = parseCSV(pasteValue);
    }

    if (!result || result.data.length === 0) {
      toast({
        title: 'Invalid data format',
        description: 'Please paste valid CSV or JSON data',
        variant: 'destructive',
      });
      return;
    }

    onDataLoad(result.data, result.columns);
    setPasteValue('');
    toast({
      title: 'Data loaded',
      description: `Loaded ${result.data.length} rows.`,
    });
  }, [pasteValue, parseCSV, parseJSON, onDataLoad, toast]);

  return (
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="paste" className="gap-2">
            <ClipboardPaste className="h-4 w-4" />
            Paste Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <div
              className={`
            relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          `}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
          >
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
            />
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">Drop your file here, or click to browse</p>
            <p className="text-xs text-muted-foreground">Supports Excel (.xlsx) and CSV files up to 5MB</p>
          </div>
        </TabsContent>

        <TabsContent value="paste" className="mt-4 space-y-4">
          <Textarea
              placeholder={`Paste your data here...\n\nCSV format:\nName,Value,Category\nItem 1,100,A\nItem 2,200,B\n\nOr JSON format:\n[{"name": "Item 1", "value": 100}]`}
              className="min-h-[200px] font-mono text-sm"
              value={pasteValue}
              onChange={(e) => setPasteValue(e.target.value)}
          />
          <Button onClick={handlePaste} disabled={!pasteValue.trim()} className="w-full">
            Load Data
          </Button>
        </TabsContent>
      </Tabs>
  );
}