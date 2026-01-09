import { useState } from 'react';
import { Copy, Image, FileCode, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { exportToPng, exportToSvg, exportToPdf, copyToClipboard } from '@/lib/chartExport';

interface ExportOptionsProps {
  disabled?: boolean;
  chartRef: React.RefObject<HTMLDivElement>;
  chartTitle?: string;
}

type ExportType = 'png' | 'svg' | 'pdf' | 'copy' | null;

export function ExportOptions({ disabled, chartRef, chartTitle = 'chart' }: ExportOptionsProps) {
  const { toast } = useToast();
  const [exporting, setExporting] = useState<ExportType>(null);

  const handleExport = async (type: ExportType) => {
    if (!chartRef.current || !type) return;

    setExporting(type);
    try {
      switch (type) {
        case 'png':
          await exportToPng(chartRef.current, chartTitle);
          toast({
            title: 'Exported as PNG',
            description: 'Your chart has been downloaded.',
          });
          break;
        case 'svg':
          await exportToSvg(chartRef.current, chartTitle);
          toast({
            title: 'Exported as SVG',
            description: 'Your chart has been downloaded.',
          });
          break;
        case 'pdf':
          await exportToPdf(chartRef.current, chartTitle);
          toast({
            title: 'Exported as PDF',
            description: 'Your chart has been downloaded.',
          });
          break;
        case 'copy':
          await copyToClipboard(chartRef.current);
          toast({
            title: 'Copied to clipboard',
            description: 'Chart image copied successfully.',
          });
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExporting(null);
    }
  };

  const isExporting = exporting !== null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Export:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('png')}
        disabled={disabled || isExporting}
        className="gap-2"
      >
        {exporting === 'png' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Image className="h-4 w-4" />
        )}
        PNG
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('svg')}
        disabled={disabled || isExporting}
        className="gap-2"
      >
        {exporting === 'svg' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileCode className="h-4 w-4" />
        )}
        SVG
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('pdf')}
        disabled={disabled || isExporting}
        className="gap-2"
      >
        {exporting === 'pdf' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('copy')}
        disabled={disabled || isExporting}
        className="gap-2"
      >
        {exporting === 'copy' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        Copy
      </Button>
    </div>
  );
}
