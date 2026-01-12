import { useState } from "react";
import { X, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: string[];
}

export function TagManager({ tags, onTagsChange, availableTags = [] }: TagManagerProps) {
  const [newTag, setNewTag] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && trimmedTag.length <= 20) {
      onTagsChange([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const suggestedTags = availableTags.filter(
    (tag) => !tags.includes(tag) && tag.includes(newTag.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1 px-2">
          <Tag className="h-3 w-3" />
          {tags.length > 0 ? `${tags.length} tags` : "Add tags"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm"
              maxLength={20}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              className="h-8 px-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Current tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 pr-1 text-xs"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestedTags.length > 0 && newTag && (
            <div className="border-t pt-2">
              <p className="mb-1 text-xs text-muted-foreground">Suggestions</p>
              <div className="flex flex-wrap gap-1">
                {suggestedTags.slice(0, 5).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer text-xs hover:bg-secondary"
                    onClick={() => {
                      onTagsChange([...tags, tag]);
                      setNewTag("");
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
