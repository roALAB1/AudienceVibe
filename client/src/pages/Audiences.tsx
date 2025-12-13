/**
 * Audiences Page
 * 
 * Displays all AudienceLab audiences with pagination, search, and CRUD operations
 * Uses tRPC routes for secure server-side API access
 */

import { useState } from 'react';
import { trpc } from '../lib/trpc';

export default function Audiences() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch audiences using tRPC
  const { data, isLoading, error, refetch } = trpc.audienceLabAPI.audiences.list.useQuery({
    page,
    pageSize,
  });

  // Delete audience mutation
  const deleteMutation = trpc.audienceLabAPI.audiences.delete.useMutation({
    onSuccess: () => {
      // Refresh the list after successful deletion
      refetch();
    },
    onError: (error) => {
      alert(`Failed to delete audience: ${error.message}`);
    },
  });

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    deleteMutation.mutate({ id });
  }

  const audiences = data?.audiences || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Audiences</h1>
              <p className="text-muted-foreground mt-1">
                Manage your AudienceLab audiences
              </p>
            </div>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
              onClick={() => alert('Create audience feature coming soon!')}
            >
              Create Audience
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground">Total Audiences</div>
            <div className="text-3xl font-bold text-foreground mt-2">{total}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground">Current Page</div>
            <div className="text-3xl font-bold text-foreground mt-2">
              {page} / {totalPages || 1}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground">Per Page</div>
            <div className="text-3xl font-bold text-foreground mt-2">{pageSize}</div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading audiences...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
            <h3 className="font-semibold text-destructive mb-2">Error</h3>
            <p className="text-destructive/90">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
            >
              Retry
            </button>
          </div>
        )}

        {/* Audiences Table */}
        {!isLoading && !error && audiences.length > 0 && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Scheduled Refresh
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Next Refresh
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {audiences.map((audience) => (
                  <tr key={audience.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{audience.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        ID: {audience.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (audience as any).scheduled_refresh
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {(audience as any).scheduled_refresh ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {(audience as any).next_scheduled_refresh
                        ? new Date((audience as any).next_scheduled_refresh).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => alert(`View audience: ${audience.name}`)}
                        className="text-primary hover:text-primary/80 font-medium text-sm mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(audience.id, audience.name)}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:text-destructive/80 font-medium text-sm disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="border-t border-border px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of{' '}
                {total} audiences
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && audiences.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">No audiences found</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first audience.
            </p>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
              onClick={() => alert('Create audience feature coming soon!')}
            >
              Create Audience
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
