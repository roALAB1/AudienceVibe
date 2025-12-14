import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateAudienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateAudienceDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateAudienceDialogProps) {
  const [name, setName] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [cities, setCities] = useState('');
  const [industries, setIndustries] = useState('');
  const [daysBack, setDaysBack] = useState('30');

  const createMutation = trpc.audienceLabAPI.audiences.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Audience created successfully! ID: ${data.audienceId}`);
      resetForm();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(`Failed to create audience: ${error.message}`);
    },
  });

  const resetForm = () => {
    setName('');
    setMinAge('');
    setMaxAge('');
    setCities('');
    setIndustries('');
    setDaysBack('30');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build filters object
    const filters: any = {};

    if (minAge || maxAge) {
      filters.age = {};
      if (minAge) filters.age.minAge = parseInt(minAge);
      if (maxAge) filters.age.maxAge = parseInt(maxAge);
    }

    if (cities) {
      filters.city = cities.split(',').map((c) => c.trim()).filter(Boolean);
    }

    if (industries) {
      filters.businessProfile = {
        industry: industries.split(',').map((i) => i.trim()).filter(Boolean),
      };
    }

    // Validate that we have at least one filter
    if (Object.keys(filters).length === 0) {
      toast.error('Please add at least one filter (age, city, or industry)');
      return;
    }

    createMutation.mutate({
      name,
      filters,
      days_back: daysBack ? parseInt(daysBack) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Audience</DialogTitle>
          <DialogDescription>
            Define your audience with filters. At least one filter is required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Audience Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Software Engineers in NYC"
              required
            />
          </div>

          {/* Age Filter */}
          <div className="space-y-2">
            <Label>Age Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAge" className="text-sm text-muted-foreground">
                  Min Age
                </Label>
                <Input
                  id="minAge"
                  type="number"
                  value={minAge}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinAge(e.target.value)}
                  placeholder="25"
                  min="18"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="maxAge" className="text-sm text-muted-foreground">
                  Max Age
                </Label>
                <Input
                  id="maxAge"
                  type="number"
                  value={maxAge}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxAge(e.target.value)}
                  placeholder="45"
                  min="18"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Cities Filter */}
          <div className="space-y-2">
            <Label htmlFor="cities">Cities</Label>
            <Input
              id="cities"
              value={cities}
              onChange={(e) => setCities(e.target.value)}
              placeholder="New York, San Francisco, Los Angeles (comma-separated)"
            />
            <p className="text-sm text-muted-foreground">
              Enter multiple cities separated by commas
            </p>
          </div>

          {/* Industries Filter */}
          <div className="space-y-2">
            <Label htmlFor="industries">Industries</Label>
            <Input
              id="industries"
              value={industries}
              onChange={(e) => setIndustries(e.target.value)}
              placeholder="Software Development, Technology, SaaS (comma-separated)"
            />
            <p className="text-sm text-muted-foreground">
              Enter multiple industries separated by commas
            </p>
          </div>

          {/* Days Back */}
          <div className="space-y-2">
            <Label htmlFor="daysBack">Days Back</Label>
            <Input
              id="daysBack"
              type="number"
              value={daysBack}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDaysBack(e.target.value)}
              placeholder="30"
              min="1"
              max="365"
            />
            <p className="text-sm text-muted-foreground">
              How many days of historical data to include
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || !name}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Audience'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
