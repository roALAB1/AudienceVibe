import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, MapPin } from "lucide-react";
import { LocationFilters } from "@/types/audience-filters";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilters?: LocationFilters;
  onSave: (filters: LocationFilters) => void;
}

// US States list
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

export default function LocationFiltersModal({
  open,
  onOpenChange,
  initialFilters,
  onSave,
}: LocationFiltersModalProps) {
  const [filters, setFilters] = useState<LocationFilters>(
    initialFilters || {
      cities: [],
      states: [],
      zipCodes: [],
    }
  );

  const [currentInput, setCurrentInput] = useState({
    city: "",
    zipCode: "",
  });

  const [selectedState, setSelectedState] = useState<string>("");

  const handleAddCity = () => {
    const city = currentInput.city.trim();
    if (!city) return;

    if (filters.cities?.includes(city)) {
      toast.error("This city is already added");
      return;
    }

    setFilters({
      ...filters,
      cities: [...(filters.cities || []), city],
    });

    setCurrentInput({ ...currentInput, city: "" });
  };

  const handleAddState = () => {
    if (!selectedState) return;

    if (filters.states?.includes(selectedState)) {
      toast.error("This state is already added");
      return;
    }

    setFilters({
      ...filters,
      states: [...(filters.states || []), selectedState],
    });

    setSelectedState("");
  };

  const handleAddZipCode = () => {
    const zipCode = currentInput.zipCode.trim();
    
    // Validate zip code format (5 digits or 5+4 format)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zipCode)) {
      toast.error("Invalid zip code format (use 12345 or 12345-6789)");
      return;
    }

    if (filters.zipCodes?.includes(zipCode)) {
      toast.error("This zip code is already added");
      return;
    }

    setFilters({
      ...filters,
      zipCodes: [...(filters.zipCodes || []), zipCode],
    });

    setCurrentInput({ ...currentInput, zipCode: "" });
  };

  const handleRemoveItem = (
    field: keyof LocationFilters,
    index: number
  ) => {
    const currentArray = filters[field] || [];
    setFilters({
      ...filters,
      [field]: currentArray.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    // Validate at least one location filter is set
    const hasFilters =
      (filters.cities && filters.cities.length > 0) ||
      (filters.states && filters.states.length > 0) ||
      (filters.zipCodes && filters.zipCodes.length > 0);

    if (!hasFilters) {
      toast.error("Please add at least one location filter");
      return;
    }

    onSave(filters);
    onOpenChange(false);
    toast.success("Location filters saved");
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            Location Filters
          </DialogTitle>
          <DialogDescription>
            Target audiences based on geographic location (cities, states, zip codes)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Cities */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">
              Cities
            </Label>
            <p className="text-xs text-gray-500">
              Add specific cities to target
            </p>

            <div className="flex gap-2">
              <Input
                id="city"
                value={currentInput.city}
                onChange={(e) =>
                  setCurrentInput({ ...currentInput, city: e.target.value })
                }
                onKeyPress={(e) => handleKeyPress(e, handleAddCity)}
                placeholder="e.g., San Francisco, New York"
                className="flex-1"
              />
              <Button onClick={handleAddCity} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {filters.cities && filters.cities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.cities.map((city, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-3 pr-1 py-1 flex items-center gap-1"
                  >
                    {city}
                    <button
                      onClick={() => handleRemoveItem("cities", index)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* States */}
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium">
              States
            </Label>
            <p className="text-xs text-gray-500">
              Select US states to target
            </p>

            <div className="flex gap-2">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddState} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {filters.states && filters.states.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.states.map((state, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-3 pr-1 py-1 flex items-center gap-1"
                  >
                    {state}
                    <button
                      onClick={() => handleRemoveItem("states", index)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Zip Codes */}
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-sm font-medium">
              Zip Codes
            </Label>
            <p className="text-xs text-gray-500">
              Add specific zip codes (5-digit or 5+4 format)
            </p>

            <div className="flex gap-2">
              <Input
                id="zipCode"
                value={currentInput.zipCode}
                onChange={(e) =>
                  setCurrentInput({ ...currentInput, zipCode: e.target.value })
                }
                onKeyPress={(e) => handleKeyPress(e, handleAddZipCode)}
                placeholder="e.g., 94102, 10001-1234"
                className="flex-1"
              />
              <Button onClick={handleAddZipCode} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {filters.zipCodes && filters.zipCodes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.zipCodes.map((zipCode, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-3 pr-1 py-1 flex items-center gap-1"
                  >
                    {zipCode}
                    <button
                      onClick={() => handleRemoveItem("zipCodes", index)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {(filters.cities?.length || filters.states?.length || filters.zipCodes?.length) ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>Location Summary:</strong>{" "}
                {filters.cities?.length || 0} cities,{" "}
                {filters.states?.length || 0} states,{" "}
                {filters.zipCodes?.length || 0} zip codes
              </p>
            </div>
          ) : null}
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
