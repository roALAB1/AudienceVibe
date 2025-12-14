import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Loader2, ExternalLink } from 'lucide-react';

interface LinkSegmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audienceId: string;
  audienceName: string;
  onSuccess: () => void;
}

export function LinkSegmentDialog({
  open,
  onOpenChange,
  audienceId,
  audienceName,
  onSuccess
}: LinkSegmentDialogProps) {
  const [segmentId, setSegmentId] = useState('');
  const [segmentName, setSegmentName] = useState('');

  const linkMutation = trpc.studio.linkSegment.useMutation({
    onSuccess: (data) => {
      toast.success(`Segment linked successfully! ${data.totalRecords.toLocaleString()} records found.`);
      setSegmentId('');
      setSegmentName('');
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to link segment: ${error.message}`);
    }
  });

  const handleLink = () => {
    if (!segmentId.trim()) {
      toast.error('Please enter a segment ID');
      return;
    }
    if (!segmentName.trim()) {
      toast.error('Please enter a segment name');
      return;
    }

    linkMutation.mutate({
      audienceId,
      audienceName,
      segmentId: segmentId.trim(),
      segmentName: segmentName.trim()
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Link Studio Segment</DialogTitle>
          <DialogDescription>
            Create a segment in Studio, then link it here to view audience data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">How to create a segment:</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-blue-800">
              <li>
                Go to{' '}
                <a 
                  href="https://build.audiencelab.io/home/onboarding/studio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline inline-flex items-center gap-1 hover:text-blue-900"
                >
                  Studio in AudienceLab
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Select the "{audienceName}" audience</li>
              <li>Choose fields and filters (optional)</li>
              <li>Click "Save First Segment" or "Save Current"</li>
              <li>Click "Show API" to get the segment ID</li>
              <li>Copy the segment ID and name, then paste below</li>
            </ol>
          </div>

          {/* Segment ID Input */}
          <div className="space-y-2">
            <Label htmlFor="segmentId">Segment ID *</Label>
            <Input
              id="segmentId"
              placeholder="04111f25-a796-494d-a8e0-a2dd541a5768"
              value={segmentId}
              onChange={(e) => setSegmentId(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              UUID format from Studio's "Show API" button
            </p>
          </div>

          {/* Segment Name Input */}
          <div className="space-y-2">
            <Label htmlFor="segmentName">Segment Name *</Label>
            <Input
              id="segmentName"
              placeholder="My Segment Name"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              The name you gave the segment in Studio
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={linkMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLink}
            disabled={linkMutation.isPending || !segmentId.trim() || !segmentName.trim()}
          >
            {linkMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Link Segment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
