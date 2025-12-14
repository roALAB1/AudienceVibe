import { useParams, useLocation, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AudienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch audience details
  const { data: audience, isLoading, error, refetch } = trpc.audienceLabAPI.audiences.getById.useQuery(
    { id: id! },
    { enabled: !!id }
  ) as { data: any; isLoading: boolean; error: any; refetch: () => void };

  // Get utils for invalidation
  const utils = trpc.useUtils();

  // Delete mutation
  const deleteMutation = trpc.audienceLabAPI.audiences.delete.useMutation({
    onSuccess: () => {
      toast.success('Audience deleted successfully');
      setLocation('/audiences');
    },
    onError: (error) => {
      toast.error(`Failed to delete audience: ${error.message}`);
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (id) {
      deleteMutation.mutate({ id });
    }
  };

  const handleReload = () => {
    refetch();
    toast.success('Audience details reloaded');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow p-12">
            <div className="flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !audience) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Audience</h3>
            <p className="text-sm text-red-700">{error?.message || 'Audience not found'}</p>
            <Link href="/audiences">
              <Button className="mt-4" variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Audiences
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/audiences">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{audience.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleReload} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Reload
            </Button>
            <Button onClick={handleDelete} variant="destructive" size="sm" className="gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Overview Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              {audience.audience_size === 0 ? (
                <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                  No Data
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Completed
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Audience Size</p>
              <p className="text-lg font-semibold text-gray-900">
                {audience.audience_size?.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created At</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(audience.created_at || null)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Refreshed</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(audience.last_refreshed || null)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Refresh Count</p>
              <p className="text-lg font-semibold text-gray-900">{audience.refresh_count || '0'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Next Scheduled Refresh</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(audience.next_scheduled_refresh)}
              </p>
            </div>
          </div>
        </div>

        {/* Refresh Settings Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Refresh Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Scheduled Refresh</p>
              <p className="text-lg font-semibold text-gray-900">
                {audience.scheduled_refresh ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Refresh Interval</p>
              <p className="text-lg font-semibold text-gray-900">
                {audience.refresh_interval || 'Not set'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Webhook URL</p>
              <p className="text-lg font-semibold text-gray-900 break-all">
                {audience.webhook_url || 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Metadata</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Audience ID</p>
              <p className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">{audience.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{audience.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
