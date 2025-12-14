import { useState } from 'react';
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
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface CreateAudienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAudienceDialog({
  open,
  onOpenChange,
}: CreateAudienceDialogProps) {
  const [name, setName] = useState('');

  // Get the utils to refetch audiences list
  const utils = trpc.useUtils();

  // Create audience mutation
  const createMutation = trpc.audienceLabAPI.audiences.create.useMutation({
    onSuccess: (data) => {
      console.log('✅ Audience created successfully:', data);
      toast.success('Audience created successfully');
      // Refetch the audiences list
      utils.audienceLabAPI.audiences.list.invalidate();
      // Close dialog and reset
      onOpenChange(false);
      setName('');
    },
    onError: (error) => {
      console.error('❌ Failed to create audience:', error);
      toast.error(`Failed to create audience: ${error.message}`);
    },
  });

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    // Create audience with minimal valid filters structure
    // API requires filters to have at least one field, use empty city array
    createMutation.mutate({
      name: name.trim(),
      filters: {
        city: [],  // Minimal valid filter - empty array is accepted by API
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim() && !createMutation.isPending) {
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Audience</DialogTitle>
          <DialogDescription>
            Give your audience a name to get started.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter audience name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={createMutation.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
