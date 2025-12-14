import { useParams, Link, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, RefreshCw, Trash2, Download, AlertCircle, Link as LinkIcon, Database } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LinkSegmentDialog } from '@/components/LinkSegmentDialog';

export default function AudienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkSegmentDialogOpen, setLinkSegmentDialogOpen] = useState(false);
  const [viewingData, setViewingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Fetch all audiences
  const { data: audiencesList, isLoading, error, refetch } = trpc.audienceLabAPI.audiences.list.useQuery(
    { page: 1, pageSize: 100 },
    { enabled: !!id }
  );

  // Find the specific audience
  const audience = useMemo(() => {
    if (!audiencesList?.data) return null;
    return audiencesList.data.find(a => a.id === id);
  }, [audiencesList, id]);

  // Check if segment is linked
  const { data: segmentMapping, refetch: refetchSegment } = trpc.studio.getSegmentForAudience.useQuery(
    { audienceId: id! },
    { enabled: !!id }
  );

  // Fetch segment data if viewing
  const { data: segmentData, isLoading: isLoadingData } = trpc.studio.getSegmentData.useQuery(
    {
      segmentId: segmentMapping?.segmentId!,
      page: currentPage,
      pageSize: PAGE_SIZE
    },
    { enabled: viewingData && !!segmentMapping?.segmentId }
  );

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

  // Export CSV mutation
  const exportMutation = trpc.studio.exportSegment.useMutation({
    onSuccess: (data) => {
      // Download CSV
      const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `audience_${audience?.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success(`Exported ${data.recordCount.toLocaleString()} records to CSV`);
    },
    onError: (error) => {
      toast.error(`Failed to export: ${error.message}`);
    }
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
    refetchSegment();
    toast.success('Audience details reloaded');
  };

  const handleViewData = () => {
    if (!segmentMapping) {
      toast.error('No segment linked. Please link a segment first.');
      return;
    }
    setViewingData(true);
    setCurrentPage(1);
  };

  const handleExportData = () => {
    if (!segmentMapping) {
      toast.error('No segment linked. Please link a segment first.');
      return;
    }
    exportMutation.mutate({ segmentId: segmentMapping.segmentId });
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Not set';
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Not set';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
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
        <div className="max-w-6xl mx-auto">
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
      <div className="max-w-6xl mx-auto">
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

        {/* Segment Status Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Access</h2>
              {segmentMapping ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Segment Linked
                    </Badge>
                    <span className="text-sm text-gray-600">{segmentMapping.segmentName}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {segmentMapping.totalRecords?.toLocaleString() || 'Unknown'} records available
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    No Segment Linked
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Link a Studio segment to view and export audience data
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {!segmentMapping && (
                <Button onClick={() => setLinkSegmentDialogOpen(true)} className="gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Link Segment
                </Button>
              )}
              {segmentMapping && (
                <>
                  <Button onClick={handleViewData} variant="outline" className="gap-2">
                    <Database className="w-4 h-4" />
                    {viewingData ? 'Refresh Data' : 'View Data'}
                  </Button>
                  <Button 
                    onClick={handleExportData} 
                    variant="outline" 
                    className="gap-2"
                    disabled={exportMutation.isPending}
                  >
                    {exportMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Export CSV
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        {viewingData && segmentMapping && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Audience Data</h2>
            {isLoadingData ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : segmentData && segmentData.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(segmentData.data[0]).slice(0, 8).map(key => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {segmentData.data.map((row, idx) => (
                        <TableRow key={idx}>
                          {Object.values(row).slice(0, 8).map((value, cellIdx) => (
                            <TableCell key={cellIdx} className="max-w-[200px] truncate">
                              {String(value || '')}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, segmentMapping.totalRecords || 0)} of {segmentMapping.totalRecords?.toLocaleString() || 0} records
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1 || isLoadingData}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={!segmentData?.has_more || isLoadingData}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-12">No data available</p>
            )}
          </div>
        )}

        {/* Overview Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Audience Name</p>
              <p className="text-lg font-semibold text-gray-900">{audience.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Audience ID</p>
              <p className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">
                {audience.id}
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
              <div className="flex items-center gap-2">
                {audience.scheduled_refresh ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                    Disabled
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Refresh Interval</p>
              <p className="text-lg font-semibold text-gray-900">
                {audience.refresh_interval || 'Not set'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Next Scheduled Refresh</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(audience.next_scheduled_refresh)}
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Audience</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{audience.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Link Segment Dialog */}
        <LinkSegmentDialog
          open={linkSegmentDialogOpen}
          onOpenChange={setLinkSegmentDialogOpen}
          audienceId={id!}
          audienceName={audience.name}
          onSuccess={() => {
            refetchSegment();
            utils.studio.getSegmentForAudience.invalidate();
          }}
        />
      </div>
    </div>
  );
}
