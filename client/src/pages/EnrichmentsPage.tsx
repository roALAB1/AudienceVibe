import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2, Upload } from "lucide-react";

/**
 * Enrichments Page - Simplified to match AudienceLab dashboard exactly
 * 
 * Features:
 * - Simple table with Name, Status, Creation Date columns
 * - Search by name
 * - Upload button
 * - Pagination
 * - No stats, no filters, no modals, no actions
 */
export default function EnrichmentsPage() {
  const { data: enrichments, isLoading } = trpc.audienceLabAPI.enrichment.getJobs.useQuery({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Enrichment</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {isLoading ? "..." : enrichments?.length || 0} Enrichment Lists
                </span>
                <Input
                  placeholder="Search by name..."
                  className="w-64"
                />
              </div>
              <Link href="/enrichments/upload">
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : enrichments && enrichments.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creation Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrichments.map((enrichment: any) => (
                    <tr key={enrichment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {enrichment.name || `Enrichment_${enrichment.id}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={enrichment.status === "completed" ? "default" : "secondary"}
                        >
                          {enrichment.status === "completed" ? "Completed" : enrichment.status === "failed" ? "no data" : "Processing"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrichment.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No enrichments found</p>
                <Link href="/enrichments/upload">
                  <Button className="mt-4">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First Enrichment
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Pagination */}
          {enrichments && enrichments.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Rows per page: 10
              </div>
              <div className="text-sm text-gray-600">
                Page 1 of {Math.ceil(enrichments.length / 10)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
