/**
 * Spark V2 - ModeSelector Component
 * Toggle between Intent Search and B2B Search modes
 */

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Brain, Building2 } from "lucide-react";

import type { SearchMode } from "../types";

interface ModeSelectorProps {
  mode: SearchMode;
  onChange: (mode: SearchMode) => void;
  className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      <h3 className="mb-3 text-lg font-semibold">Search Mode</h3>
      <RadioGroup
        value={mode}
        onValueChange={(value) => onChange(value as SearchMode)}
        className="space-y-3"
      >
        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50">
          <RadioGroupItem value="intent" id="intent" className="mt-1" />
          <Label htmlFor="intent" className="flex-1 cursor-pointer space-y-1">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Intent Search</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Find audiences by what they <strong>search for</strong> and their
              interests
            </p>
            <p className="text-xs text-muted-foreground">
              Example: "email marketing software", "cold email deliverability"
            </p>
          </Label>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50">
          <RadioGroupItem value="b2b" id="b2b" className="mt-1" />
          <Label htmlFor="b2b" className="flex-1 cursor-pointer space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-green-600" />
              <span className="font-medium">B2B Search</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Find businesses by what they <strong>do</strong> and{" "}
              <strong>offer</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Example: "independent hotels", "SaaS companies", "marketing
              agencies"
            </p>
          </Label>
        </div>
      </RadioGroup>

      <div className="mt-4 rounded-lg bg-muted/50 p-3">
        <p className="text-sm text-muted-foreground">
          <strong>💡 Tip:</strong>{" "}
          {mode === "intent"
            ? "Intent uses OpenAI embeddings to find people interested in specific topics"
            : "B2B uses BAAI/bge-large-en-v1.5 to find businesses by their offerings"}
        </p>
      </div>
    </div>
  );
};
