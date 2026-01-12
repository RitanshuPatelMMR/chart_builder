import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BarChart3, Search, X, Trash2, CheckSquare, Tag, Star } from "lucide-react";
import { useLocalCharts } from "@/hooks/useLocalCharts";
import { SavedChartCard } from "@/components/dashboard/SavedChartCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SavedChart } from "@/types/chart";

import { useCharts } from "@/contexts/ChartsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

const CHART_TYPES = [
  { value: "all", label: "All Types" },
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "area", label: "Area Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "stacked", label: "Stacked Bar" },
];

const SORT_OPTIONS = [
  { value: "updated-desc", label: "Last Updated" },
  { value: "updated-asc", label: "Oldest Updated" },
  { value: "created-desc", label: "Newest Created" },
  { value: "created-asc", label: "Oldest Created" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

export default function MyCharts() {
  const navigate = useNavigate();
  const { charts, isLoading, deleteChart, duplicateChart, updateChart } = useCharts();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("updated-desc");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Get all unique tags from charts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    charts.forEach((chart) => {
      (chart.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [charts]);

  // Separate favorites and regular charts
  const { favoriteCharts, regularCharts } = useMemo(() => {
    const filtered = charts.filter((chart) => {
      const matchesSearch = chart.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === "all" || chart.config.type === typeFilter;
      const matchesTags =
        tagFilter.length === 0 ||
        tagFilter.every((tag) => (chart.tags || []).includes(tag));
      return matchesSearch && matchesType && matchesTags;
    });

    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "created-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "created-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updated-asc":
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case "updated-desc":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return {
      favoriteCharts: sorted.filter((c) => c.isFavorite),
      regularCharts: sorted.filter((c) => !c.isFavorite),
    };
  }, [charts, searchQuery, typeFilter, tagFilter, sortBy]);

  const filteredAndSortedCharts = [...favoriteCharts, ...regularCharts];

  const handleEdit = (chart: SavedChart) => {
    navigate(`/dashboard/chart/${chart.id}`);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteChart(id);
    if (success) {
      toast({
        title: "Chart deleted",
        description: "The chart has been permanently removed.",
      });
    }
  };


  const handleDuplicate = async (id: string) => {
    const duplicated = await duplicateChart(id);
    if (duplicated) {
      toast({
        title: "Chart duplicated",
        description: `"${duplicated.name}" has been created.`,
      });
    }
  };

  const handleRename = async (id: string, newName: string) => {
    const updated = await updateChart(id, { name: newName });
    if (updated) {
      toast({
        title: "Chart renamed",
        description: `Chart renamed to "${newName}".`,
      });
    }
  };
  const handleTagsChange = async (id: string, newTags: string[]) => {
    await updateChart(id, { tags: newTags });
  };

  const handleToggleFavorite = async (id: string) => {
    const chart = charts.find((c) => c.id === id);
    if (chart) {
      const newFavorite = !chart.isFavorite;
      await updateChart(id, { isFavorite: newFavorite });
      toast({
        title: newFavorite ? "Added to favorites" : "Removed from favorites",
        description: newFavorite
            ? "Chart will appear at the top of your gallery."
            : "Chart moved back to regular charts.",
      });
    }
  };

  const handleToggleTagFilter = (tag: string) => {
    setTagFilter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedCharts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedCharts.map((c) => c.id)));
    }
  };

  const handleBulkDelete = () => {
    let deletedCount = 0;
    selectedIds.forEach((id) => {
      if (deleteChart(id)) {
        deletedCount++;
      }
    });
    
    toast({
      title: `${deletedCount} chart${deletedCount !== 1 ? "s" : ""} deleted`,
      description: "The selected charts have been permanently removed.",
    });
    
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setTagFilter([]);
    setSortBy("updated-desc");
  };

  const hasActiveFilters = searchQuery !== "" || typeFilter !== "all" || tagFilter.length > 0 || sortBy !== "updated-desc";
  const allSelected = filteredAndSortedCharts.length > 0 && selectedIds.size === filteredAndSortedCharts.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < filteredAndSortedCharts.length;

  if (isLoading) {
    return (
      <div className="space-y-6" role="main" aria-label="My Charts loading">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" aria-hidden="true" />
          <Skeleton className="h-10 w-28" aria-hidden="true" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 max-w-sm" aria-hidden="true" />
          <Skeleton className="h-10 w-40" aria-hidden="true" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main" aria-label="My Charts">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Charts</h1>
          <p className="text-muted-foreground mt-1">
            {charts.length} {charts.length === 1 ? "chart" : "charts"} saved
            {favoriteCharts.length > 0 && ` • ${favoriteCharts.length} favorite${favoriteCharts.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {charts.length > 0 && !selectionMode && (
            <Button 
              variant="outline" 
              onClick={() => setSelectionMode(true)}
              aria-label="Enter selection mode"
            >
              <CheckSquare className="mr-2 h-4 w-4" aria-hidden="true" />
              Select
            </Button>
          )}
          <Button onClick={() => navigate("/dashboard/new")} aria-label="Create new chart">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Chart
          </Button>
        </div>
      </div>

      {/* Bulk selection bar */}
      {selectionMode && (
        <div 
          className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
          role="toolbar"
          aria-label="Bulk selection actions"
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allSelected}
              ref={(el) => {
                if (el) {
                  (el as unknown as HTMLInputElement).indeterminate = someSelected;
                }
              }}
              onCheckedChange={handleSelectAll}
              aria-label={allSelected ? "Deselect all charts" : "Select all charts"}
            />
            <span className="text-sm font-medium" aria-live="polite">
              {selectedIds.size === 0
                ? "Select charts"
                : `${selectedIds.size} selected`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={selectedIds.size === 0}
                  aria-label={`Delete ${selectedIds.size} selected charts`}
                >
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Delete ({selectedIds.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {selectedIds.size} charts?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the selected charts. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="ghost" size="sm" onClick={exitSelectionMode}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {charts.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Search charts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search charts by name"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-44" aria-label="Filter by chart type">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Tag filter */}
            {allTags.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto gap-2" aria-label="Filter by tags">
                    <Tag className="h-4 w-4" aria-hidden="true" />
                    {tagFilter.length > 0 ? `${tagFilter.length} tags` : "Filter by tag"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Filter by tags</p>
                    <div className="flex flex-wrap gap-1" role="group" aria-label="Available tags">
                      {allTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={tagFilter.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleToggleTagFilter(tag)}
                          role="checkbox"
                          aria-checked={tagFilter.includes(tag)}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleToggleTagFilter(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {tagFilter.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => setTagFilter([])}
                      >
                        Clear tags
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-44" aria-label="Sort charts">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters} aria-label="Clear all filters">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Active tag filters display */}
          {tagFilter.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap" role="status" aria-live="polite">
              <span className="text-sm text-muted-foreground">Filtered by:</span>
              {tagFilter.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {tag}
                  <button
                    onClick={() => handleToggleTagFilter(tag)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20"
                    aria-label={`Remove ${tag} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {charts.length === 0 ? (
        <div 
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16"
          role="status"
          aria-label="No charts"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <BarChart3 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No charts yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first chart to get started
          </p>
          <Button className="mt-4" onClick={() => navigate("/dashboard/new")}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Create Chart
          </Button>
        </div>
      ) : filteredAndSortedCharts.length === 0 ? (
        <div 
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16"
          role="status"
          aria-label="No matching charts"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No matching charts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filter
          </p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          {hasActiveFilters && (
            <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
              Showing {filteredAndSortedCharts.length} of {charts.length} charts
            </p>
          )}
          
          {/* Favorites Section */}
          {favoriteCharts.length > 0 && (
            <section aria-labelledby="favorites-heading">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                <h2 id="favorites-heading" className="text-sm font-medium text-muted-foreground">
                  Favorites ({favoriteCharts.length})
                </h2>
              </div>
              <div 
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8"
                role="list"
                aria-label="Favorite charts"
              >
                {favoriteCharts.map((chart) => (
                  <SavedChartCard
                    key={chart.id}
                    chart={chart}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onRename={handleRename}
                    onTagsChange={handleTagsChange}
                    onToggleFavorite={handleToggleFavorite}
                    availableTags={allTags}
                    selectionMode={selectionMode}
                    isSelected={selectedIds.has(chart.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            </section>
          )}
          
          {/* Regular Charts Section */}
          {regularCharts.length > 0 && (
            <section aria-labelledby={favoriteCharts.length > 0 ? "all-charts-heading" : undefined}>
              {favoriteCharts.length > 0 && (
                <h2 id="all-charts-heading" className="text-sm font-medium text-muted-foreground mb-4">
                  All Charts ({regularCharts.length})
                </h2>
              )}
              <div 
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                role="list"
                aria-label="All charts"
              >
                {regularCharts.map((chart) => (
                  <SavedChartCard
                    key={chart.id}
                    chart={chart}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onRename={handleRename}
                    onTagsChange={handleTagsChange}
                    onToggleFavorite={handleToggleFavorite}
                    availableTags={allTags}
                    selectionMode={selectionMode}
                    isSelected={selectedIds.has(chart.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
