import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartPreview } from '@/components/chart-builder/ChartPreview';
import type { ChartTemplate } from './templateData';

interface TemplateCardProps {
  template: ChartTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const navigate = useNavigate();
  const Icon = template.icon;

  const handleUseTemplate = () => {
    navigate('/dashboard', {
      state: {
        template: {
          data: template.sampleData,
          columns: template.sampleColumns,
          config: {
            type: template.chartType,
            theme: template.theme,
            ...template.config,
          },
        },
      },
    });
  };

  return (
    <Card className="flex flex-col hover:border-primary transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-base">{template.name}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="h-[150px] rounded-md border bg-muted/30 overflow-hidden">
          <ChartPreview
            data={template.sampleData}
            columns={template.sampleColumns}
            config={{
              type: template.chartType,
              theme: template.theme,
              title: '',
              xAxisLabel: '',
              yAxisLabel: '',
              showLegend: false,
              showGrid: false,
            }}
            xAxisColumn={template.sampleColumns[0]}
            selectedYColumns={template.sampleColumns.slice(1)}
          />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button onClick={handleUseTemplate} className="w-full">
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}
