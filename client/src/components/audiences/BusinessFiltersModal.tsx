import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, Plus } from "lucide-react";
import { BusinessFilters } from "@/types/audience-filters";
import { toast } from "sonner";

interface BusinessFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilters?: BusinessFilters;
  onSave: (filters: BusinessFilters) => void;
}

export default function BusinessFiltersModal({
  open,
  onOpenChange,
  initialFilters,
  onSave,
}: BusinessFiltersModalProps) {
  const [filters, setFilters] = useState<BusinessFilters>(
    initialFilters || {
      businessKeywords: [],
      titles: [],
      seniority: [],
      departments: [],
      companyNames: [],
      companyDomains: [],
      industries: [],
    }
  );

  const [currentInput, setCurrentInput] = useState({
    businessKeywords: "",
    titles: "",
    seniority: "",
    departments: "",
    companyNames: "",
    companyDomains: "",
    industries: "",
  });

  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);

  const handleAddItem = (field: keyof BusinessFilters, value: string) => {
    if (!value.trim()) return;

    const currentArray = filters[field] || [];
    if (currentArray.includes(value.trim())) {
      toast.error("This item already exists");
      return;
    }

    setFilters({
      ...filters,
      [field]: [...currentArray, value.trim()],
    });

    setCurrentInput({
      ...currentInput,
      [field]: "",
    });
  };

  const handleRemoveItem = (field: keyof BusinessFilters, index: number) => {
    const currentArray = filters[field] || [];
    setFilters({
      ...filters,
      [field]: currentArray.filter((_, i) => i !== index),
    });
  };

  const handleGenerateKeywords = async () => {
    setIsGeneratingKeywords(true);
    
    // Simulate AI keyword generation
    // In production, this would call an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const suggestedKeywords = [
      "SaaS",
      "Cloud Computing",
      "Enterprise Software",
      "B2B Technology",
      "Digital Transformation",
    ];

    setFilters({
      ...filters,
      businessKeywords: [
        ...(filters.businessKeywords || []),
        ...suggestedKeywords.filter(
          (kw) => !(filters.businessKeywords || []).includes(kw)
        ),
      ],
    });

    setIsGeneratingKeywords(false);
    toast.success("AI keywords generated!");
  };

  const handleSave = () => {
    // Validate at least one filter is set
    const hasFilters = Object.values(filters).some(
      (arr) => arr && arr.length > 0
    );

    if (!hasFilters) {
      toast.error("Please add at least one business filter");
      return;
    }

    onSave(filters);
    onOpenChange(false);
    toast.success("Business filters saved");
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof BusinessFilters
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem(field, currentInput[field]);
    }
  };

  const filterFields: Array<{
    key: keyof BusinessFilters;
    label: string;
    placeholder: string;
    description: string;
  }> = [
    {
      key: "businessKeywords",
      label: "Business Keywords",
      placeholder: "e.g., SaaS, Cloud Computing",
      description: "Keywords describing the business or industry",
    },
    {
      key: "titles",
      label: "Job Titles",
      placeholder: "e.g., Software Engineer, Product Manager",
      description: "Specific job titles to target",
    },
    {
      key: "seniority",
      label: "Seniority Levels",
      placeholder: "e.g., Senior, Director, VP",
      description: "Job seniority or level",
    },
    {
      key: "departments",
      label: "Departments",
      placeholder: "e.g., Engineering, Marketing, Sales",
      description: "Company departments",
    },
    {
      key: "companyNames",
      label: "Company Names",
      placeholder: "e.g., Google, Microsoft",
      description: "Specific company names",
    },
    {
      key: "companyDomains",
      label: "Company Domains",
      placeholder: "e.g., google.com, microsoft.com",
      description: "Company website domains",
    },
    {
      key: "industries",
      label: "Industries",
      placeholder: "e.g., Technology, Healthcare",
      description: "Industry sectors",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💼</span>
            </div>
            Business Filters
          </DialogTitle>
          <DialogDescription>
            Target audiences based on business attributes, job titles, and company information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* AI Keyword Generator */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  AI Keyword Generator
                </h4>
                <p className="text-xs text-gray-600">
                  Let AI suggest relevant business keywords based on your target audience
                </p>
              </div>
              <Button
                onClick={handleGenerateKeywords}
                disabled={isGeneratingKeywords}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGeneratingKeywords ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Filter Fields */}
          {filterFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-sm font-medium">
                {field.label}
              </Label>
              <p className="text-xs text-gray-500">{field.description}</p>
              
              <div className="flex gap-2">
                <Input
                  id={field.key}
                  value={currentInput[field.key]}
                  onChange={(e) =>
                    setCurrentInput({
                      ...currentInput,
                      [field.key]: e.target.value,
                    })
                  }
                  onKeyPress={(e) => handleKeyPress(e, field.key)}
                  placeholder={field.placeholder}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleAddItem(field.key, currentInput[field.key])}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Display added items */}
              {filters[field.key] && filters[field.key]!.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters[field.key]!.map((item, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 flex items-center gap-1"
                    >
                      {item}
                      <button
                        onClick={() => handleRemoveItem(field.key, index)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
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
