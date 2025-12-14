import { useParams, useLocation, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, RefreshCw, Trash2, Download } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const handleExportCSV = () => {
    if (!audience) {
      toast.error('No audience data to export');
      return;
    }

    // Create CSV content
    const headers = ['Field', 'Value'];
    const rows = [
      ['ID', audience.id],
      ['Name', audience.name],
      ['Status', 'Completed'],
      ['Audience Size', audience.audience_size?.toString() || '0'],
      ['Created At', audience.created_at || 'Not set'],
      ['Last Refreshed', audience.last_refreshed || 'Not set'],
      ['Refresh Count', audience.refresh_count?.toString() || '0'],
      ['Next Scheduled Refresh', audience.next_scheduled_refresh || 'Not set'],
      ['Scheduled Refresh', audience.scheduled_refresh ? 'Enabled' : 'Disabled'],
      ['Refresh Interval', audience.refresh_interval || 'Not set'],
      ['Webhook URL', audience.webhook_url || 'Not set']
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audience_${audience.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Audience exported to CSV');
  };

  const handleExportJSON = () => {
    if (!audience) {
      toast.error('No audience data to export');
      return;
    }

    // Create JSON content
    const jsonContent = JSON.stringify(audience, null, 2);

    // Download JSON
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audience_${audience.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('Audience exported to JSON');
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportCSV}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

        {/* Analytics Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h2>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">Total Size</p>
              <p className="text-3xl font-bold text-blue-900">{audience.audience_size?.toLocaleString() || '0'}</p>
              <p className="text-xs text-blue-600 mt-1">members</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-600 font-medium mb-1">Refresh Count</p>
              <p className="text-3xl font-bold text-green-900">{audience.refresh_count || '0'}</p>
              <p className="text-xs text-green-600 mt-1">total refreshes</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-600 font-medium mb-1">Status</p>
              <p className="text-2xl font-bold text-purple-900">
                {audience.scheduled_refresh ? 'Active' : 'Inactive'}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {audience.scheduled_refresh ? 'auto-refresh enabled' : 'manual only'}
              </p>
            </div>
          </div>

          {/* Refresh Timeline */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Refresh Timeline</h3>
            <div className="space-y-3">
              {audience.created_at && (
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-xs text-gray-500">{formatDate(audience.created_at)}</p>
                  </div>
                </div>
              )}
              {audience.last_refreshed && (
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Last Refreshed</p>
                    <p className="text-xs text-gray-500">{formatDate(audience.last_refreshed)}</p>
                  </div>
                </div>
              )}
              {audience.next_scheduled_refresh && (
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Next Scheduled Refresh</p>
                    <p className="text-xs text-gray-500">{formatDate(audience.next_scheduled_refresh)}</p>
                  </div>
                </div>
              )}
              {!audience.created_at && !audience.last_refreshed && !audience.next_scheduled_refresh && (
                <p className="text-sm text-gray-500 italic">No refresh history available</p>
              )}
            </div>
          </div>

          {/* Audience Health Indicator */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Health</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Data Availability</span>
                  <span className="text-sm font-medium text-gray-900">
                    {audience.audience_size > 0 ? '100%' : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      audience.audience_size > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: audience.audience_size > 0 ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Refresh Activity</span>
                  <span className="text-sm font-medium text-gray-900">
                    {audience.refresh_count > 0 ? 'Active' : 'None'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      audience.refresh_count > 0 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: audience.refresh_count > 0 ? '75%' : '0%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Automation Status</span>
                  <span className="text-sm font-medium text-gray-900">
                    {audience.scheduled_refresh ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      audience.scheduled_refresh ? 'bg-purple-500' : 'bg-gray-400'
                    }`}
                    style={{ width: audience.scheduled_refresh ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
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
