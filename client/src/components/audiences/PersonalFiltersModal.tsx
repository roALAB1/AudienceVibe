import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { User } from "lucide-react";
import { PersonalFilters, PersonalFilter } from "@/types/audience-filters";
import { toast } from "sonner";
import DynamicFilterBuilder, { FilterFieldOption, DynamicFilter } from "./DynamicFilterBuilder";

interface PersonalFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilters?: PersonalFilters;
  onSave: (filters: PersonalFilters) => void;
}

const personalFieldOptions: FilterFieldOption[] = [
  {
    value: "gender",
    label: "Gender",
    inputType: "select",
    selectOptions: ["Male", "Female", "Non-binary", "Other"],
  },
  {
    value: "ethnicity",
    label: "Ethnicity",
    inputType: "select",
    selectOptions: [
      "Asian",
      "Black or African American",
      "Hispanic or Latino",
      "White",
      "Native American",
      "Pacific Islander",
      "Other",
    ],
  },
  {
    value: "language",
    label: "Language",
    inputType: "select",
    selectOptions: ["English", "Spanish", "Chinese", "French", "German", "Other"],
  },
  {
    value: "education",
    label: "Education Level",
    inputType: "select",
    selectOptions: [
      "High School",
      "Some College",
      "Associate Degree",
      "Bachelor's Degree",
      "Master's Degree",
      "Doctorate",
    ],
  },
  {
    value: "smoker",
    label: "Smoker Status",
    inputType: "select",
    selectOptions: ["Yes", "No", "Former Smoker"],
  },
];

export default function PersonalFiltersModal({
  open,
  onOpenChange,
  initialFilters,
  onSave,
}: PersonalFiltersModalProps) {
  const [ageRange, setAgeRange] = useState<[number, number]>([
    initialFilters?.ageRange?.min || 18,
    initialFilters?.ageRange?.max || 100,
  ]);

  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>(
    initialFilters?.filters.map((f) => ({
      id: `${f.field}_${Date.now()}`,
      field: f.field,
      value: f.value,
    })) || []
  );

  const handleSave = () => {
    // Convert dynamic filters back to PersonalFilter format
    const filters: PersonalFilter[] = dynamicFilters.map((df) => ({
      field: df.field as any,
      value: String(df.value),
    }));

    const personalFilters: PersonalFilters = {
      ageRange: {
        min: ageRange[0],
        max: ageRange[1],
      },
      filters,
    };

    onSave(personalFilters);
    onOpenChange(false);
    toast.success("Personal filters saved");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            Personal Filters
          </DialogTitle>
          <DialogDescription>
            Target audiences based on personal demographics and characteristics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Age Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Age Range: {ageRange[0]} - {ageRange[1]} years
            </Label>
            <Slider
              value={ageRange}
              onValueChange={(value) => setAgeRange(value as [number, number])}
              min={18}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>18 years</span>
              <span>100 years</span>
            </div>
          </div>

          {/* Dynamic Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Additional Personal Filters</Label>
            <p className="text-xs text-gray-500">
              Add specific demographic filters to refine your audience
            </p>
            <DynamicFilterBuilder
              filters={dynamicFilters}
              fieldOptions={personalFieldOptions}
              onChange={setDynamicFilters}
            />
          </div>

          {/* Summary */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
            <p className="text-sm text-pink-900">
              <strong>Personal Summary:</strong> Age {ageRange[0]}-{ageRange[1]},{" "}
              {dynamicFilters.length} additional filters
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
