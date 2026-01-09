import { useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChartDataPoint } from '@/types/chart';

interface DataTableProps {
  data: ChartDataPoint[];
  columns: string[];
  onUpdateCell: (rowIndex: number, column: string, value: string | number) => void;
  onAddRow: () => void;
  onRemoveRow: (rowIndex: number) => void;
  onUpdateColumnName: (oldName: string, newName: string) => void;
}

export function DataTable({
  data,
  columns,
  onUpdateCell,
  onAddRow,
  onRemoveRow,
  onUpdateColumnName,
}: DataTableProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = useCallback((rowIndex: number, column: string, currentValue: string | number) => {
    setEditingCell({ row: rowIndex, col: column });
    setEditValue(String(currentValue));
  }, []);

  const handleCellBlur = useCallback(() => {
    if (editingCell) {
      const numValue = parseFloat(editValue);
      const finalValue = isNaN(numValue) ? editValue : numValue;
      onUpdateCell(editingCell.row, editingCell.col, finalValue);
      setEditingCell(null);
    }
  }, [editingCell, editValue, onUpdateCell]);

  const handleHeaderClick = useCallback((column: string) => {
    setEditingHeader(column);
    setEditValue(column);
  }, []);

  const handleHeaderBlur = useCallback(() => {
    if (editingHeader && editValue.trim()) {
      onUpdateColumnName(editingHeader, editValue.trim());
    }
    setEditingHeader(null);
  }, [editingHeader, editValue, onUpdateColumnName]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, onBlur: () => void) => {
    if (e.key === 'Enter') {
      onBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditingHeader(null);
    }
  }, []);

  if (data.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {data.length} rows × {columns.length} columns
        </h3>
        <Button variant="outline" size="sm" onClick={onAddRow} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Row
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <div className="max-h-[300px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="min-w-[100px]">
                    {editingHeader === column ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleHeaderBlur}
                        onKeyDown={(e) => handleKeyDown(e, handleHeaderBlur)}
                        className="h-7 text-sm font-medium"
                        autoFocus
                      />
                    ) : (
                      <button
                        className="text-left hover:text-primary w-full"
                        onClick={() => handleHeaderClick(column)}
                      >
                        {column}
                      </button>
                    )}
                  </TableHead>
                ))}
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {editingCell?.row === rowIndex && editingCell?.col === column ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellBlur}
                          onKeyDown={(e) => handleKeyDown(e, handleCellBlur)}
                          className="h-7 text-sm"
                          autoFocus
                        />
                      ) : (
                        <button
                          className="text-left hover:text-primary w-full min-h-[28px] block"
                          onClick={() => handleCellClick(rowIndex, column, row[column])}
                        >
                          {row[column] !== '' ? String(row[column]) : <span className="text-muted-foreground/50">—</span>}
                        </button>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveRow(rowIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
