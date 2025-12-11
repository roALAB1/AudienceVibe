/**
 * Spark V2 - AdvancedOptions Component
 * Context phrases, lens selection, and granularity controls
 */

import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

import type { Lens } from "../types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";


interface AdvancedOptionsProps {
  contextPhrases: string[];
  onContextPhrasesChange: (phrases: string[]) => void;
  lens: Lens;
  onLensChange: (lens: Lens) => void;
  granularity: number;
  onGranularityChange: (level: number) => void;
  className?: string;
}

export const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  contextPhrases,
  onContextPhrasesChange,
  lens,
  onLensChange,
  granularity,
  onGranularityChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contextInput, setContextInput] = useState("");

  const handleAddContext = () => {
    if (contextInput.trim()) {
      onContextPhrasesChange([...contextPhrases, contextInput.trim()]);
      setContextInput("");
    }
  };

  const handleRemoveContext = (index: number) => {
    onContextPhrasesChange(contextPhrases.filter((_, i) => i !== index));
  };

  const granularityLabels: Record<number, string> = {
    1: "Broad",
    2: "General",
    3: "Mid-Specific",
    4: "Advanced",
    5: "Niche/Elite",
  };

  return (
    <div className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between hover:bg-accent"
          >
            <span className="font-semibold">Advanced Options</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4 pt-4">
          {/* Context Phrases */}
          <div className="space-y-2">
            <Label htmlFor="context">
              Context Phrases{" "}
              <span className="text-sm font-normal text-muted-foreground">
                (Optional)
              </span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Add related terms to refine search context
            </p>

            <div className="flex gap-2">
              <Input
                id="context"
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                placeholder="e.g., deliverability, inbox placement"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddContext();
                  }
                }}
              />
              <Button onClick={handleAddContext} size="sm" variant="secondary">
                Add
              </Button>
            </div>

            {contextPhrases.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {contextPhrases.map((phrase, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {phrase}
                    <button
                      onClick={() => handleRemoveContext(index)}
                      className="ml-1 hover:text-destructive"
                      aria-label={`Remove ${phrase}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Lens Selection */}
          <div className="space-y-2">
            <Label htmlFor="lens">Lens</Label>
            <p className="text-sm text-muted-foreground">
              Perspective for interpreting the query
            </p>
            <Select value={lens} onValueChange={(value) => onLensChange(value as Lens)}>
              <SelectTrigger id="lens">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="function">Function</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="solution">Solution</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Granularity Slider */}
          <div className="space-y-2">
            <Label htmlFor="granularity">
              Granularity: {granularity}/5{" "}
              <span className="font-normal text-muted-foreground">
                ({granularityLabels[granularity]})
              </span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Control specificity of results
            </p>
            <Slider
              id="granularity"
              value={[granularity]}
              onValueChange={([value]) => onGranularityChange(value)}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Broad</span>
              <span>Niche</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">
              <strong>💡 Tip:</strong> Advanced options help refine your search
              but are optional. Start with a simple query and add options if
              needed.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
