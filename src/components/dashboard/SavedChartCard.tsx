import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Type,
  Tag,
  Star,
  BarChart3,
  LineChart,
  AreaChart,
  PieChart,
  Layers,
} from "lucide-react";
import { SavedChart, ChartType } from "@/types/chart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagManager } from "./TagManager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const chartTypeIcons: Record<ChartType, React.ElementType> = {
  bar: BarChart3,
  line: LineChart,
  area: AreaChart,
  pie: PieChart,
  stacked: Layers,
};

const chartTypeLabels: Record<ChartType, string> = {
  bar: "Bar",
  line: "Line",
  area: "Area",
  pie: "Pie",
  stacked: "Stacked",
};

const chartTypeColors: Record<ChartType, string> = {
  bar: "bg-blue-100 text-blue-700",
  line: "bg-green-100 text-green-700",
  area: "bg-purple-100 text-purple-700",
  pie: "bg-orange-100 text-orange-700",
  stacked: "bg-pink-100 text-pink-700",
};

interface SavedChartCardProps {
  chart: SavedChart;
  onEdit: (chart: SavedChart) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
  onTagsChange?: (id: string, tags: string[]) => void;
  onToggleFavorite?: (id: string) => void;
  availableTags?: string[];
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function SavedChartCard({
                                 chart,
                                 onEdit,
                                 onDelete,
                                 onDuplicate,
                                 onRename,
                                 onTagsChange,
                                 onToggleFavorite,
                                 availableTags = [],
                                 selectionMode = false,
                                 isSelected = false,
                                 onToggleSelect,
                               }: SavedChartCardProps) {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(chart.name);

  const Icon = chartTypeIcons[chart.config.type] || BarChart3;
  const formattedDate = new Date(chart.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCardClick = () => {
    if (selectionMode && onToggleSelect) {
      onToggleSelect(chart.id);
    }
  };

  const handleRenameSubmit = () => {
    if (newName.trim() && newName !== chart.name) {
      onRename?.(chart.id, newName.trim());
    }
    setRenameDialogOpen(false);
  };

  const handleOpenRename = () => {
    setNewName(chart.name);
    setRenameDialogOpen(true);
  };

  const handleTagsChange = (newTags: string[]) => {
    onTagsChange?.(chart.id, newTags);
  };

  const chartTags = chart.tags || [];
  const isFavorite = chart.isFavorite || false;

  return (
      <>
        <Card
            className={`group border bg-white hover:shadow-lg transition-all ${
                isSelected ? "ring-2 ring-primary" : ""
            } ${selectionMode ? "cursor-pointer" : ""}`}
            onClick={handleCardClick}
            role="listitem"
            aria-label={`${chart.name || "Untitled Chart"}, ${
                chartTypeLabels[chart.config.type]
            } chart${isFavorite ? ", favorite" : ""}`}
        >
          {/* ================= Preview ================= */}
          <div className="relative h-[200px] border-b bg-white overflow-hidden">
            {chart.thumbnail ? (
                <img
                    src={chart.thumbnail}
                    alt=""
                    className="h-full w-full object-contain"
                    aria-hidden="true"
                />
            ) : (
                <div className="flex h-full items-center justify-center">
                  <Icon className="h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
                </div>
            )}

            {/* Favorite Star */}
            {isFavorite && !selectionMode && (
                <div className="absolute right-3 top-3 z-10">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 drop-shadow" aria-hidden="true" />
                </div>
            )}

            {/* Selection Checkbox */}
            {selectionMode && (
                <div
                    className="absolute left-3 top-3 z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect?.(chart.id)}
                      className="h-5 w-5 border-2 bg-background"
                      aria-label={isSelected ? `Deselect ${chart.name}` : `Select ${chart.name}`}
                  />
                </div>
            )}

            {/* Hover Edit/Delete Overlay */}
            {!selectionMode && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/90 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <Button size="sm" onClick={() => onEdit(chart)} aria-label={`Edit ${chart.name}`}>
                    <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" aria-label={`Delete ${chart.name}`}>
                        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete chart?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{chart.name}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(chart.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
            )}
          </div>

          {/* ================= Content ================= */}
          <CardContent className="p-4 space-y-3">
            {/* Title + Menu */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">
                  {chart.name || "Untitled Chart"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Edited {formattedDate}
                </p>
              </div>

              {!selectionMode && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          aria-label={`More options for ${chart.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(chart)}>
                        <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleOpenRename}>
                        <Type className="mr-2 h-4 w-4" aria-hidden="true" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate?.(chart.id)}>
                        <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleFavorite?.(chart.id)}>
                        <Star
                            className={`mr-2 h-4 w-4 ${
                                isFavorite ? "fill-yellow-500 text-yellow-500" : ""
                            }`}
                            aria-hidden="true"
                        />
                        {isFavorite ? "Remove from favorites" : "Add to favorites"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete chart?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{chart.name}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(chart.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
              )}
            </div>

            {/* Tags + Chart Type Badge */}
            <div className="flex items-center justify-between gap-2">
              {!selectionMode ? (
                  <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                    {chartTags.length > 0 ? (
                        <>
                          {chartTags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                          ))}
                          {chartTags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{chartTags.length - 2}
                              </Badge>
                          )}
                          <TagManager
                              tags={chartTags}
                              onTagsChange={handleTagsChange}
                              availableTags={availableTags}
                          />
                        </>
                    ) : (
                        <TagManager
                            tags={[]}
                            onTagsChange={handleTagsChange}
                            availableTags={availableTags}
                        />
                    )}
                  </div>
              ) : (
                  <div className="flex-1" />
              )}

              {/* Chart Type Badge (Colored) */}
              <Badge
                  className={`${chartTypeColors[chart.config.type]} rounded-full px-3 py-1 text-xs font-medium shrink-0`}
              >
                <Icon className="mr-1 h-3 w-3" aria-hidden="true" />
                {chartTypeLabels[chart.config.type]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Rename Dialog */}
        <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Chart</DialogTitle>
              <DialogDescription>
                Enter a new name for your chart.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="chart-name" className="sr-only">
                Chart name
              </Label>
              <Input
                  id="chart-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Chart name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSubmit();
                    }
                  }}
                  autoFocus
                  aria-describedby="rename-description"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRenameSubmit} disabled={!newName.trim()}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
  );
}