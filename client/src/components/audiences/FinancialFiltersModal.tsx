import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { FinancialFilters, FinancialFilter } from "@/types/audience-filters";
import { toast } from "sonner";
import DynamicFilterBuilder, { FilterFieldOption, DynamicFilter } from "./DynamicFilterBuilder";

interface FinancialFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilters?: FinancialFilters;
  onSave: (filters: FinancialFilters) => void;
}

const financialFieldOptions: FilterFieldOption[] = [
  {
    value: "incomeRange",
    label: "Income Range",
    inputType: "range",
    placeholder: "Annual income in dollars",
  },
  {
    value: "netWorth",
    label: "Net Worth",
    inputType: "range",
    placeholder: "Total net worth in dollars",
  },
  {
    value: "creditRating",
    label: "Credit Rating",
    inputType: "select",
    selectOptions: ["Excellent (750+)", "Good (700-749)", "Fair (650-699)", "Poor (<650)"],
  },
  {
    value: "newCreditRange",
    label: "New Credit Range",
    inputType: "select",
    selectOptions: ["0-2 accounts", "3-5 accounts", "6-10 accounts", "10+ accounts"],
  },
  {
    value: "creditCardUser",
    label: "Credit Card User",
    inputType: "select",
    selectOptions: ["Yes", "No", "Premium Cards Only"],
  },
  {
    value: "investment",
    label: "Investment Type",
    inputType: "select",
    selectOptions: ["Stocks", "Bonds", "Real Estate", "Mutual Funds", "Cryptocurrency", "None"],
  },
  {
    value: "mortgageAmount",
    label: "Mortgage Amount",
    inputType: "range",
    placeholder: "Mortgage amount in dollars",
  },
  {
    value: "occupationGroup",
    label: "Occupation Group",
    inputType: "select",
    selectOptions: [
      "Professional",
      "Management",
      "Technical",
      "Sales",
      "Service",
      "Administrative",
      "Labor",
    ],
  },
  {
    value: "occupationType",
    label: "Occupation Type",
    inputType: "select",
    selectOptions: ["Full-time", "Part-time", "Self-employed", "Retired", "Student"],
  },
  {
    value: "craCode",
    label: "CRA Code",
    inputType: "text",
    placeholder: "Consumer Reporting Agency code",
  },
];

export default function FinancialFiltersModal({
  open,
  onOpenChange,
  initialFilters,
  onSave,
}: FinancialFiltersModalProps) {
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>(
    initialFilters?.filters.map((f) => ({
      id: `${f.field}_${Date.now()}`,
      field: f.field,
      value: f.value,
    })) || []
  );

  const handleSave = () => {
    if (dynamicFilters.length === 0) {
      toast.error("Please add at least one financial filter");
      return;
    }

    // Convert dynamic filters back to FinancialFilter format
    const filters: FinancialFilter[] = dynamicFilters.map((df) => ({
      field: df.field as any,
      value: df.value,
    }));

    const financialFilters: FinancialFilters = {
      filters,
    };

    onSave(financialFilters);
    onOpenChange(false);
    toast.success("Financial filters saved");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            Financial Filters
          </DialogTitle>
          <DialogDescription>
            Target audiences based on income, net worth, credit, and financial behaviors
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Financial filters help you target audiences by their
              economic status and purchasing power. Combine multiple filters for precise
              targeting.
            </p>
          </div>

          {/* Dynamic Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Financial Criteria</Label>
            <p className="text-xs text-gray-500">
              Add financial filters to refine your audience
            </p>
            <DynamicFilterBuilder
              filters={dynamicFilters}
              fieldOptions={financialFieldOptions}
              onChange={setDynamicFilters}
            />
          </div>

          {/* Summary */}
          {dynamicFilters.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-900">
                <strong>Financial Summary:</strong> {dynamicFilters.length} financial filters
                active
              </p>
            </div>
          )}
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
