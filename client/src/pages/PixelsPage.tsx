import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Copy, Plus, Trash2, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreatePixelDialog } from "@/components/pixels/CreatePixelDialog";
import { toast } from "sonner";

export default function PixelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pixelToDelete, setPixelToDelete] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch pixels
  const { data: pixelsResponse, isLoading, error, refetch } = trpc.audienceLabAPI.pixels.list.useQuery();

  // Delete pixel mutation
  const deleteMutation = trpc.audienceLabAPI.pixels.delete.useMutation({
    onSuccess: () => {
      toast.success("Pixel deleted successfully");
      refetch();
      setDeleteDialogOpen(false);
      setPixelToDelete(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete pixel: ${error.message}`);
    },
  });

  // Extract pixels array from response
  const pixels = pixelsResponse?.data || [];

  // Filter pixels based on search
  const filteredPixels = pixels.filter((pixel) =>
    pixel.website_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pixel.website_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pixel.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (pixelId: string) => {
    setPixelToDelete(pixelId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (pixelToDelete) {
      deleteMutation.mutate({ id: pixelToDelete });
    }
  };

  const copyToClipboard = async (text: string, pixelId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(pixelId);
      toast.success("Install URL copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Pixels</h1>
            <p className="text-gray-600 mt-2">Manage your tracking pixels and install URLs</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Create Pixel
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search pixels by name, URL, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error Loading Pixels: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Pixels Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPixels.length > 0 ? (
              filteredPixels.map((pixel) => (
                <Card key={pixel.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{pixel.website_name}</CardTitle>
                        <CardDescription className="mt-1">
                          {pixel.website_url}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(pixel.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pixel ID */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Pixel ID</p>
                      <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                        {pixel.id}
                      </p>
                    </div>

                    {/* Install URL */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-700">Install URL</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(pixel.install_url, pixel.id)}
                          className="h-6 px-2"
                        >
                          {copiedId === pixel.id ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                              <span className="text-xs text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              <span className="text-xs">Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded break-all">
                        {pixel.install_url}
                      </p>
                    </div>

                    {/* Last Sync */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Last Sync</p>
                      <p className="text-sm text-gray-600">
                        {new Date(pixel.last_sync).toLocaleString()}
                      </p>
                    </div>

                    {/* Webhook URL */}
                    {pixel.webhook_url && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Webhook URL</p>
                        <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded break-all">
                          {pixel.webhook_url}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchQuery ? "No pixels found matching your search" : "No pixels yet"}
                </p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Pixel
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Pixels Count */}
        {!isLoading && !error && (
          <div className="text-center text-sm text-gray-600">
            Showing {filteredPixels.length} of {pixels.length} pixels
          </div>
        )}
      </div>

      {/* Create Pixel Dialog */}
      <CreatePixelDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          refetch();
          setCreateDialogOpen(false);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pixel?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the pixel and remove
              all tracking data associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
