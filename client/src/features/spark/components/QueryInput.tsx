/**
 * Spark V2 - QueryInput Component
 * Text area for entering search queries with character count and submit
 */

import { Search } from "lucide-react";
import { useCallback } from "react";

import type { SearchMode } from "../types";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  mode: SearchMode;
  onSearch: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  value,
  onChange,
  mode,
  onSearch,
  isLoading = false,
  placeholder,
  className,
}) => {
  const placeholders = {
    intent: "e.g., email marketing software, cold email deliverability",
    b2b: "e.g., independent hotels, SaaS companies, marketing agencies",
  };

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && !isLoading) {
          onSearch();
        }
      }
    },
    [value, isLoading, onSearch]
  );

  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const charCount = value.length;

  return (
    <div className={className}>
      <Label htmlFor="query" className="text-base font-semibold">
        What are you looking for?
      </Label>
      <p className="mb-2 text-sm text-muted-foreground">
        {mode === "intent"
          ? "Enter topics or interests people search for"
          : "Describe the type of businesses you want to find"}
      </p>

      <Textarea
        id="query"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder || placeholders[mode]}
        rows={3}
        className="resize-none"
        disabled={isLoading}
      />

      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
          <span>•</span>
          <span>{charCount} characters</span>
          <span>•</span>
          <span
            className={
              wordCount >= 2 && wordCount <= 10
                ? "text-green-600"
                : "text-yellow-600"
            }
          >
            {wordCount < 2 && "Too short"}
            {wordCount >= 2 && wordCount <= 10 && "Optimal length"}
            {wordCount > 10 && "Consider simplifying"}
          </span>
        </div>

        <Button
          onClick={onSearch}
          disabled={!value.trim() || isLoading}
          size="sm"
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
