import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import { HousingFilters, HousingFilter } from "@/types/audience-filters";
import { toast } from "sonner";
import DynamicFilterBuilder, { FilterFieldOption, DynamicFilter } from "./DynamicFilterBuilder";

interface HousingFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilters?: HousingFilters;
  onSave: (filters: HousingFilters) => void;
}

const housingFieldOptions: FilterFieldOption[] = [
  {
    value: "homeownerStatus",
    label: "Homeowner Status",
    inputType: "select",
    selectOptions: ["Owner", "Renter", "Other"],
  },
  {
    value: "dwellingType",
    label: "Dwelling Type",
    inputType: "select",
    selectOptions: [
      "Single Family",
      "Multi Family",
      "Apartment",
      "Condo",
      "Townhouse",
      "Mobile Home",
    ],
  },
  {
    value: "yearBuilt",
    label: "Year Built",
    inputType: "range",
    placeholder: "Year the home was built",
  },
  {
    value: "purchasePrice",
    label: "Purchase Price",
    inputType: "range",
    placeholder: "Home purchase price in dollars",
  },
  {
    value: "purchaseYear",
    label: "Purchase Year",
    inputType: "range",
    placeholder: "Year the home was purchased",
  },
  {
    value: "estimatedHomeValue",
    label: "Estimated Home Value",
    inputType: "range",
    placeholder: "Current estimated home value in dollars",
  },
];

export default function HousingFiltersModal({
  open,
  onOpenChange,
  initialFilters,
  onSave,
}: HousingFiltersModalProps) {
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>(
    initialFilters?.filters.map((f) => ({
      id: `${f.field}_${Date.now()}`,
      field: f.field,
      value: f.value,
    })) || []
  );

  const handleSave = () => {
    if (dynamicFilters.length === 0) {
      toast.error("Please add at least one housing filter");
      return;
    }

    // Convert dynamic filters back to HousingFilter format
    const filters: HousingFilter[] = dynamicFilters.map((df) => ({
      field: df.field as any,
      value: df.value,
    }));

    const housingFilters: HousingFilters = {
      filters,
    };

    onSave(housingFilters);
    onOpenChange(false);
    toast.success("Housing filters saved");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            Housing Filters
          </DialogTitle>
          <DialogDescription>
            Target audiences based on homeownership status, dwelling type, and property characteristics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Housing filters help you target audiences by their living
              situation and property ownership. Great for real estate, home services, and
              insurance products.
            </p>
          </div>

          {/* Dynamic Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Housing Criteria</Label>
            <p className="text-xs text-gray-500">
              Add housing and property filters to refine your audience
            </p>
            <DynamicFilterBuilder
              filters={dynamicFilters}
              fieldOptions={housingFieldOptions}
              onChange={setDynamicFilters}
            />
          </div>

          {/* Summary */}
          {dynamicFilters.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-900">
                <strong>Housing Summary:</strong> {dynamicFilters.length} housing filters active
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
