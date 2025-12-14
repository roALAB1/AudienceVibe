import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Target, X, Plus } from "lucide-react";
import { IntentFilters } from "@/types/audience-filters";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IntentFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilters?: IntentFilters;
  onSave: (filters: IntentFilters) => void;
}

// Premade audience lists
const PREMADE_AUDIENCES = [
  "Technology Enthusiasts",
  "Healthcare Professionals",
  "Financial Services",
  "Real Estate Investors",
  "E-commerce Shoppers",
  "Fitness & Wellness",
  "Travel & Hospitality",
  "Education & Learning",
  "Automotive Buyers",
  "Home Improvement",
];

export default function IntentFiltersModal({
  open,
  onOpenChange,
  initialFilters,
  onSave,
}: IntentFiltersModalProps) {
  const [filters, setFilters] = useState<IntentFilters>(
    initialFilters || {
      audienceMethod: "keyword",
      businessType: "B2C",
      minimumScore: "medium",
      keywords: [],
    }
  );

  const [currentKeyword, setCurrentKeyword] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  const handleMethodChange = (method: "premade" | "keyword" | "custom") => {
    setFilters({
      ...filters,
      audienceMethod: method,
      // Clear method-specific fields
      premadeList: undefined,
      keywords: method === "keyword" ? [] : undefined,
      customIntentId: undefined,
    });
  };

  const handleAddKeyword = () => {
    const keyword = currentKeyword.trim();
    if (!keyword) return;

    if (filters.keywords?.includes(keyword)) {
      toast.error("This keyword is already added");
      return;
    }

    setFilters({
      ...filters,
      keywords: [...(filters.keywords || []), keyword],
    });

    setCurrentKeyword("");
  };

  const handleRemoveKeyword = (index: number) => {
    setFilters({
      ...filters,
      keywords: filters.keywords?.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    // Validate based on selected method
    if (filters.audienceMethod === "premade" && !filters.premadeList) {
      toast.error("Please select a premade audience");
      return;
    }

    if (
      filters.audienceMethod === "keyword" &&
      (!filters.keywords || filters.keywords.length === 0)
    ) {
      toast.error("Please add at least one keyword");
      return;
    }

    if (filters.audienceMethod === "custom" && !customDescription.trim()) {
      toast.error("Please provide a custom intent description");
      return;
    }

    // For custom method, we'd generate an ID from the description
    if (filters.audienceMethod === "custom") {
      setFilters({
        ...filters,
        customIntentId: `custom_${Date.now()}`,
      });
    }

    onSave(filters);
    onOpenChange(false);
    toast.success("Intent filters saved");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const scoreLabels = {
    low: "Low (0-33)",
    medium: "Medium (34-66)",
    high: "High (67-100)",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            Intent Filters
          </DialogTitle>
          <DialogDescription>
            Target audiences based on their interests, behaviors, and search intent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Audience Method */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Audience Method</Label>
            <RadioGroup
              value={filters.audienceMethod}
              onValueChange={(value: string) =>
                handleMethodChange(value as "premade" | "keyword" | "custom")
              }
            >
              <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="premade" id="premade" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="premade" className="font-medium cursor-pointer">
                    Premade Audiences
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose from pre-built audience segments
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="keyword" id="keyword" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="keyword" className="font-medium cursor-pointer">
                    Keyword-Based
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Define audience by specific keywords and topics
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="custom" id="custom" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="custom" className="font-medium cursor-pointer">
                    Custom Intent
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Describe your custom audience intent in detail
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Conditional Fields Based on Method */}
          {filters.audienceMethod === "premade" && (
            <div className="space-y-2">
              <Label htmlFor="premadeList" className="text-sm font-medium">
                Select Premade Audience
              </Label>
              <Select
                value={filters.premadeList}
              onValueChange={(value: string) =>
                setFilters({ ...filters, premadeList: value })
              }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an audience" />
                </SelectTrigger>
                <SelectContent>
                  {PREMADE_AUDIENCES.map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filters.audienceMethod === "keyword" && (
            <div className="space-y-2">
              <Label htmlFor="keywords" className="text-sm font-medium">
                Keywords
              </Label>
              <p className="text-xs text-gray-500">
                Add keywords that describe your target audience's interests
              </p>

              <div className="flex gap-2">
                <Input
                  id="keywords"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., artificial intelligence, machine learning"
                  className="flex-1"
                />
                <Button onClick={handleAddKeyword} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {filters.keywords && filters.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        onClick={() => handleRemoveKeyword(index)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {filters.audienceMethod === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customDescription" className="text-sm font-medium">
                Custom Intent Description
              </Label>
              <p className="text-xs text-gray-500">
                Describe the specific intent or behavior you want to target
              </p>
              <Textarea
                id="customDescription"
                value={customDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomDescription(e.target.value)}
                placeholder="e.g., People actively researching cloud migration solutions for enterprise businesses"
                rows={4}
                className="resize-none"
              />
            </div>
          )}

          {/* Business Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Business Type</Label>
            <RadioGroup
              value={filters.businessType}
              onValueChange={(value: string) =>
                setFilters({ ...filters, businessType: value as "B2C" | "B2B" })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="B2C" id="b2c" />
                <Label htmlFor="b2c" className="font-normal cursor-pointer">
                  B2C (Consumer)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="B2B" id="b2b" />
                <Label htmlFor="b2b" className="font-normal cursor-pointer">
                  B2B (Business)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Minimum Score */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Minimum Intent Score: {scoreLabels[filters.minimumScore]}
            </Label>
            <p className="text-xs text-gray-500">
              Higher scores indicate stronger intent signals
            </p>
            <RadioGroup
              value={filters.minimumScore}
              onValueChange={(value: string) =>
                setFilters({
                  ...filters,
                  minimumScore: value as "low" | "medium" | "high",
                })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="font-normal cursor-pointer">
                  Low
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-normal cursor-pointer">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal cursor-pointer">
                  High
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Summary */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-purple-900">
              <strong>Intent Summary:</strong> {filters.audienceMethod} method,{" "}
              {filters.businessType} targeting, {filters.minimumScore} score threshold
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
