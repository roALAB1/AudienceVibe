import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { FamilyFilters, FamilyFilter } from "@/types/audience-filters";
import { toast } from "sonner";
import DynamicFilterBuilder, { FilterFieldOption, DynamicFilter } from "./DynamicFilterBuilder";

interface FamilyFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilters?: FamilyFilters;
  onSave: (filters: FamilyFilters) => void;
}

const familyFieldOptions: FilterFieldOption[] = [
  {
    value: "married",
    label: "Married",
    inputType: "select",
    selectOptions: ["Yes", "No"],
  },
  {
    value: "maritalStatus",
    label: "Marital Status",
    inputType: "select",
    selectOptions: ["Single", "Married", "Divorced", "Widowed", "Separated"],
  },
  {
    value: "singleParent",
    label: "Single Parent",
    inputType: "select",
    selectOptions: ["Yes", "No"],
  },
  {
    value: "generationsInHousehold",
    label: "Generations in Household",
    inputType: "select",
    selectOptions: ["1 Generation", "2 Generations", "3+ Generations"],
  },
  {
    value: "children",
    label: "Number of Children",
    inputType: "select",
    selectOptions: ["0", "1", "2", "3", "4+"],
  },
];

export default function FamilyFiltersModal({
  open,
  onOpenChange,
  initialFilters,
  onSave,
}: FamilyFiltersModalProps) {
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>(
    initialFilters?.filters.map((f) => ({
      id: `${f.field}_${Date.now()}`,
      field: f.field,
      value: typeof f.value === 'boolean' ? (f.value ? 'Yes' : 'No') : f.value,
    })) || []
  );

  const handleSave = () => {
    if (dynamicFilters.length === 0) {
      toast.error("Please add at least one family filter");
      return;
    }

    // Convert dynamic filters back to FamilyFilter format
    const filters: FamilyFilter[] = dynamicFilters.map((df) => {
      let value: string | number | boolean;
      if (typeof df.value === 'object' && 'min' in df.value) {
        value = `${df.value.min}-${df.value.max}`;
      } else if (df.value === 'Yes') {
        value = true;
      } else if (df.value === 'No') {
        value = false;
      } else {
        value = df.value;
      }
      return {
        field: df.field as any,
        value,
      };
    });

    const familyFilters: FamilyFilters = {
      filters,
    };

    onSave(familyFilters);
    onOpenChange(false);
    toast.success("Family filters saved");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            Family Filters
          </DialogTitle>
          <DialogDescription>
            Target audiences based on family structure, marital status, and household composition
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Family filters help you target audiences by their household
              dynamics and family situation. Useful for products/services related to families.
            </p>
          </div>

          {/* Dynamic Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Family Criteria</Label>
            <p className="text-xs text-gray-500">
              Add family and household filters to refine your audience
            </p>
            <DynamicFilterBuilder
              filters={dynamicFilters}
              fieldOptions={familyFieldOptions}
              onChange={setDynamicFilters}
            />
          </div>

          {/* Summary */}
          {dynamicFilters.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <p className="text-sm text-indigo-900">
                <strong>Family Summary:</strong> {dynamicFilters.length} family filters active
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
