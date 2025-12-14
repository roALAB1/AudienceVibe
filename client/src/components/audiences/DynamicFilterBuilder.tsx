import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

export interface FilterFieldOption {
  value: string;
  label: string;
  inputType: "text" | "number" | "select" | "range";
  selectOptions?: string[];
  placeholder?: string;
}

export interface DynamicFilter {
  id: string;
  field: string;
  value: string | number | { min: number; max: number };
}

interface DynamicFilterBuilderProps {
  filters: DynamicFilter[];
  fieldOptions: FilterFieldOption[];
  onChange: (filters: DynamicFilter[]) => void;
}

export default function DynamicFilterBuilder({
  filters,
  fieldOptions,
  onChange,
}: DynamicFilterBuilderProps) {
  const [selectedField, setSelectedField] = useState<string>("");
  const [currentValue, setCurrentValue] = useState<string>("");
  const [rangeMin, setRangeMin] = useState<string>("");
  const [rangeMax, setRangeMax] = useState<string>("");

  const getFieldOption = (fieldValue: string): FilterFieldOption | undefined => {
    return fieldOptions.find((opt) => opt.value === fieldValue);
  };

  const handleAddFilter = () => {
    if (!selectedField) {
      toast.error("Please select a field");
      return;
    }

    const fieldOption = getFieldOption(selectedField);
    if (!fieldOption) return;

    let value: string | number | { min: number; max: number };

    // Validate and set value based on input type
    if (fieldOption.inputType === "range") {
      const min = parseFloat(rangeMin);
      const max = parseFloat(rangeMax);

      if (isNaN(min) || isNaN(max)) {
        toast.error("Please enter valid numbers for range");
        return;
      }

      if (min >= max) {
        toast.error("Minimum must be less than maximum");
        return;
      }

      value = { min, max };
    } else if (fieldOption.inputType === "number") {
      const num = parseFloat(currentValue);
      if (isNaN(num)) {
        toast.error("Please enter a valid number");
        return;
      }
      value = num;
    } else {
      if (!currentValue.trim()) {
        toast.error("Please enter a value");
        return;
      }
      value = currentValue.trim();
    }

    // Check if filter already exists for this field
    const existingIndex = filters.findIndex((f) => f.field === selectedField);
    if (existingIndex !== -1) {
      toast.error("A filter for this field already exists");
      return;
    }

    const newFilter: DynamicFilter = {
      id: `${selectedField}_${Date.now()}`,
      field: selectedField,
      value,
    };

    onChange([...filters, newFilter]);

    // Reset form
    setSelectedField("");
    setCurrentValue("");
    setRangeMin("");
    setRangeMax("");
  };

  const handleRemoveFilter = (id: string) => {
    onChange(filters.filter((f) => f.id !== id));
  };

  const formatValue = (value: string | number | { min: number; max: number }): string => {
    if (typeof value === "object" && "min" in value) {
      return `${value.min} - ${value.max}`;
    }
    return String(value);
  };

  const getFieldLabel = (fieldValue: string): string => {
    const option = getFieldOption(fieldValue);
    return option?.label || fieldValue;
  };

  const selectedFieldOption = selectedField ? getFieldOption(selectedField) : null;

  return (
    <div className="space-y-4">
      {/* Add Filter Form */}
      <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
        <Label className="text-sm font-medium">Add Filter</Label>

        {/* Field Selection */}
        <Select value={selectedField} onValueChange={(value: string) => setSelectedField(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a field" />
          </SelectTrigger>
          <SelectContent>
            {fieldOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Value Input (conditional based on field type) */}
        {selectedFieldOption && (
          <div className="space-y-2">
            {selectedFieldOption.inputType === "text" && (
              <Input
                value={currentValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentValue(e.target.value)
                }
                placeholder={selectedFieldOption.placeholder || "Enter value"}
              />
            )}

            {selectedFieldOption.inputType === "number" && (
              <Input
                type="number"
                value={currentValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentValue(e.target.value)
                }
                placeholder={selectedFieldOption.placeholder || "Enter number"}
              />
            )}

            {selectedFieldOption.inputType === "select" && (
              <Select
                value={currentValue}
                onValueChange={(value: string) => setCurrentValue(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {selectedFieldOption.selectOptions?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedFieldOption.inputType === "range" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-500">Minimum</Label>
                  <Input
                    type="number"
                    value={rangeMin}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRangeMin(e.target.value)
                    }
                    placeholder="Min"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Maximum</Label>
                  <Input
                    type="number"
                    value={rangeMax}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRangeMax(e.target.value)
                    }
                    placeholder="Max"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleAddFilter}
          size="sm"
          className="w-full"
          disabled={!selectedField}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Filter
        </Button>
      </div>

      {/* Active Filters List */}
      {filters.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Active Filters</Label>
          <div className="space-y-2">
            {filters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-white"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{getFieldLabel(filter.field)}</p>
                  <p className="text-xs text-gray-500">{formatValue(filter.value)}</p>
                </div>
                <Button
                  onClick={() => handleRemoveFilter(filter.id)}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filters.length === 0 && (
        <div className="text-center py-6 text-sm text-gray-500">
          No filters added yet. Select a field above to get started.
        </div>
      )}
    </div>
  );
}
