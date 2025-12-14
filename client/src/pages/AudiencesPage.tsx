import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from 'sonner';
import CreateAudienceDialog from '@/components/audiences/CreateAudienceDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

type SortField = 'name' | 'creation_date' | 'last_refreshed' | 'audience_size' | 'refresh_count' | 'next_refresh';
type SortDirection = 'asc' | 'desc' | null;

export default function AudiencesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('creation_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audienceToDelete, setAudienceToDelete] = useState<{ id: string; name: string } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Fetch audiences
  const { data, isLoading, error, refetch } = trpc.audienceLabAPI.audiences.list.useQuery({
    page,
    pageSize: 100, // API max limit
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: null -> asc -> desc -> null
      if (sortDirection === null) {
        setSortDirection('asc');
      } else if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortDirection(null);
        setSortField('creation_date'); // Reset to default
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleReload = () => {
    refetch();
    toast.success('Audience list reloaded');
  };

  // Get utils for invalidation
  const utils = trpc.useUtils();

  // Delete audience mutation
  const deleteMutation = trpc.audienceLabAPI.audiences.delete.useMutation({
    onSuccess: () => {
      toast.success('Audience deleted successfully');
      utils.audienceLabAPI.audiences.list.invalidate();
      setDeleteDialogOpen(false);
      setAudienceToDelete(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete audience: ${error.message}`);
    },
  });

  const handleDeleteClick = (audience: { id: string; name: string }) => {
    setAudienceToDelete(audience);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (audienceToDelete) {
      deleteMutation.mutate({ id: audienceToDelete.id });
    }
  };

  // Bulk selection handlers
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedAudiences.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedAudiences.map((a: any) => a.id)));
    }
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    const idsToDelete = Array.from(selectedIds);
    let successCount = 0;
    let errorCount = 0;

    for (const id of idsToDelete) {
      try {
        await deleteMutation.mutateAsync({ id });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully deleted ${successCount} audience(s)`);
      utils.audienceLabAPI.audiences.list.invalidate();
    }
    if (errorCount > 0) {
      toast.error(`Failed to delete ${errorCount} audience(s)`);
    }

    setSelectedIds(new Set());
    setBulkDeleteDialogOpen(false);
  };

  // Filter and sort audiences
  let processedAudiences = data?.data || [];
  
  // Apply search filter
  if (searchQuery) {
    processedAudiences = processedAudiences.filter((audience: any) =>
      audience.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sorting
  if (sortDirection) {
    processedAudiences = [...processedAudiences].sort((a: any, b: any) => {
      let aVal, bVal;
      
      switch (sortField) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'creation_date':
          aVal = new Date(a.created_at || 0).getTime();
          bVal = new Date(b.created_at || 0).getTime();
          break;
        case 'last_refreshed':
          aVal = new Date(a.last_refreshed || 0).getTime();
          bVal = new Date(b.last_refreshed || 0).getTime();
          break;
        case 'audience_size':
          aVal = a.audience_size || 0;
          bVal = b.audience_size || 0;
          break;
        case 'refresh_count':
          aVal = a.refresh_count || 0;
          bVal = b.refresh_count || 0;
          break;
        case 'next_refresh':
          aVal = new Date(a.next_scheduled_refresh || 0).getTime();
          bVal = new Date(b.next_scheduled_refresh || 0).getTime();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  // Apply pagination
  const totalItems = processedAudiences.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAudiences = processedAudiences.slice(startIndex, endIndex);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 inline" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3 h-3 ml-1 inline" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="w-3 h-3 ml-1 inline" />;
    }
    return <ArrowUpDown className="w-3 h-3 ml-1 inline" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Audience Lists</h1>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedIds.size > 0 && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.size} audience(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                onClick={handleBulkDelete}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
              <Button
                onClick={() => setSelectedIds(new Set())}
                variant="outline"
                size="sm"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* Search and Create */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleReload} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Reload
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-1" />
              Create
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow p-12">
            <div className="flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Audiences</h3>
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === paginatedAudiences.length && paginatedAudiences.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Name
                      {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('creation_date')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Creation Date
                      {getSortIcon('creation_date')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('last_refreshed')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Last Refreshed
                      {getSortIcon('last_refreshed')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('audience_size')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Audience Size
                      {getSortIcon('audience_size')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('refresh_count')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Refresh Count
                      {getSortIcon('refresh_count')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('next_refresh')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Next Refresh
                      {getSortIcon('next_refresh')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAudiences.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? 'No audiences found matching your search.' : 'No audiences yet.'}
                    </td>
                  </tr>
                ) : (
                  paginatedAudiences.map((audience: any) => (
                    <tr key={audience.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(audience.id)}
                          onChange={() => toggleSelection(audience.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/audiences/${audience.id}`}>
                          <span className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                            {audience.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {audience.audience_size === 0 ? (
                          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                            No Data
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Completed
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(audience.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(audience.last_refreshed)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {audience.audience_size?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {audience.refresh_count || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(audience.next_scheduled_refresh)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteClick({ id: audience.id, name: audience.name })}
                          className="text-red-600 hover:text-red-800"
                          title="Delete audience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Rows per page</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(parseInt(value));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages || 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    «
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ‹
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    ›
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(totalPages)}
                    disabled={page >= totalPages}
                  >
                    »
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Audience Dialog */}
      <CreateAudienceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{audienceToDelete?.name}</strong>? This action cannot be undone.
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

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Audiences</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedIds.size} audience(s)</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBulkDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : `Delete ${selectedIds.size} Audience(s)`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
