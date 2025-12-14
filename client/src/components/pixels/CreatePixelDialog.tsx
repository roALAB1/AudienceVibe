import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreatePixelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreatePixelDialog({ open, onOpenChange, onSuccess }: CreatePixelDialogProps) {
  const [websiteName, setWebsiteName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const createMutation = trpc.audienceLabAPI.pixels.create.useMutation({
    onSuccess: () => {
      toast.success("Pixel created successfully");
      resetForm();
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to create pixel: ${error.message}`);
    },
  });

  const resetForm = () => {
    setWebsiteName("");
    setWebsiteUrl("");
    setWebhookUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!websiteName.trim()) {
      toast.error("Website name is required");
      return;
    }

    if (!websiteUrl.trim()) {
      toast.error("Website URL is required");
      return;
    }

    // Validate URL format
    try {
      new URL(websiteUrl);
    } catch {
      toast.error("Please enter a valid website URL");
      return;
    }

    // Validate webhook URL if provided
    if (webhookUrl.trim()) {
      try {
        new URL(webhookUrl);
      } catch {
        toast.error("Please enter a valid webhook URL");
        return;
      }
    }

    createMutation.mutate({
      website_name: websiteName,
      website_url: websiteUrl,
      webhook_url: webhookUrl.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Pixel</DialogTitle>
          <DialogDescription>
            Create a new tracking pixel for your website. You'll receive an install URL to add to your site.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Website Name */}
          <div className="space-y-2">
            <Label htmlFor="website-name">
              Website Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="website-name"
              placeholder="e.g., My Website"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              disabled={createMutation.isPending}
            />
            <p className="text-xs text-gray-500">
              A friendly name to identify this pixel
            </p>
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="website-url">
              Website URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="website-url"
              type="url"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              disabled={createMutation.isPending}
            />
            <p className="text-xs text-gray-500">
              The full URL of your website (including https://)
            </p>
          </div>

          {/* Webhook URL (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="webhook-url">
              Webhook URL <span className="text-gray-400">(Optional)</span>
            </Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://hooks.example.com/pixel-events"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={createMutation.isPending}
            />
            <p className="text-xs text-gray-500">
              Receive visitor events via webhook (optional)
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Pixel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
