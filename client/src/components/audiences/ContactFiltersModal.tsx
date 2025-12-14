import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail } from "lucide-react";
import { ContactFilters } from "@/types/audience-filters";
import { toast } from "sonner";

interface ContactFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilters?: ContactFilters;
  onSave: (filters: ContactFilters) => void;
}

export default function ContactFiltersModal({
  open,
  onOpenChange,
  initialFilters,
  onSave,
}: ContactFiltersModalProps) {
  const [filters, setFilters] = useState<ContactFilters>(
    initialFilters || {
      verifiedPersonalEmails: false,
      verifiedBusinessEmails: false,
      validPhones: false,
      skipTracedWirelessPhone: false,
      skipTracedWirelessB2BPhone: false,
    }
  );

  const handleToggle = (field: keyof ContactFilters) => {
    setFilters({
      ...filters,
      [field]: !filters[field],
    });
  };

  const handleSave = () => {
    // Validate at least one filter is enabled
    const hasFilters = Object.values(filters).some((value) => value === true);

    if (!hasFilters) {
      toast.error("Please enable at least one contact filter");
      return;
    }

    onSave(filters);
    onOpenChange(false);
    toast.success("Contact filters saved");
  };

  const contactOptions: Array<{
    key: keyof ContactFilters;
    label: string;
    description: string;
  }> = [
    {
      key: "verifiedPersonalEmails",
      label: "Verified Personal Emails",
      description: "Only include contacts with verified personal email addresses",
    },
    {
      key: "verifiedBusinessEmails",
      label: "Verified Business Emails",
      description: "Only include contacts with verified business email addresses",
    },
    {
      key: "validPhones",
      label: "Valid Phone Numbers",
      description: "Only include contacts with valid, verified phone numbers",
    },
    {
      key: "skipTracedWirelessPhone",
      label: "Skip Traced Wireless Phones",
      description: "Exclude wireless phone numbers that were traced/appended",
    },
    {
      key: "skipTracedWirelessB2BPhone",
      label: "Skip Traced Wireless B2B Phones",
      description: "Exclude traced wireless numbers for business contacts",
    },
  ];

  const enabledCount = Object.values(filters).filter((v) => v === true).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            Contact Filters
          </DialogTitle>
          <DialogDescription>
            Filter audiences by contact information quality and verification status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Enable these filters to ensure high-quality contact data
              for your audience. Verified contacts have higher deliverability rates.
            </p>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-4">
            {contactOptions.map((option) => (
              <div
                key={option.key}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <Label
                    htmlFor={option.key}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </p>
                </div>
                <Switch
                  id={option.key}
                  checked={filters[option.key]}
                  onCheckedChange={() => handleToggle(option.key)}
                />
              </div>
            ))}
          </div>

          {/* Summary */}
          {enabledCount > 0 && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
              <p className="text-sm text-teal-900">
                <strong>Active Filters:</strong> {enabledCount} of {contactOptions.length} contact
                filters enabled
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
