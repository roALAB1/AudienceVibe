import { useState } from "react";
import { Search, Plus, Database, TrendingUp, Users, X, Filter, Calendar, Clock, CheckCircle2, Pause, Play, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Enrichment {
  id: string;
  name: string;
  type: "contact" | "company" | "demographic";
  status: "active" | "pending" | "completed";
  recordsProcessed: number;
  totalRecords: number;
  createdAt: string;
}

// Mock data for demonstration
const mockEnrichments: Enrichment[] = [
  {
    id: "1",
    name: "Q4 Lead Enrichment",
    type: "contact",
    status: "active",
    recordsProcessed: 1247,
    totalRecords: 2500,
    createdAt: "2025-12-10",
  },
  {
    id: "2",
    name: "Enterprise Accounts",
    type: "company",
    status: "completed",
    recordsProcessed: 850,
    totalRecords: 850,
    createdAt: "2025-12-08",
  },
  {
    id: "3",
    name: "Email Verification Batch",
    type: "contact",
    status: "pending",
    recordsProcessed: 0,
    totalRecords: 3200,
    createdAt: "2025-12-13",
  },
];

// Mock activity logs
const mockLogs = [
  { time: "2025-12-13 14:30", message: "Enrichment job started", type: "info" },
  { time: "2025-12-13 14:32", message: "Processing batch 1 of 10", type: "info" },
  { time: "2025-12-13 14:35", message: "500 records enriched successfully", type: "success" },
  { time: "2025-12-13 14:40", message: "Processing batch 2 of 10", type: "info" },
  { time: "2025-12-13 14:42", message: "Rate limit encountered, retrying...", type: "warning" },
];

const enrichmentTypeIcons = {
  contact: Users,
  company: Database,
  demographic: TrendingUp,
};

const statusColors = {
  active: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
};

type StatusFilter = "all" | "active" | "pending" | "completed";
type TypeFilter = "all" | "contact" | "company" | "demographic";

export default function EnrichmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [enrichments] = useState<Enrichment[]>(mockEnrichments);
  const [selectedEnrichment, setSelectedEnrichment] = useState<Enrichment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combined filtering logic
  const filteredEnrichments = enrichments.filter((enrichment) => {
    // Search filter
    const matchesSearch = enrichment.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || enrichment.status === statusFilter;

    // Type filter
    const matchesType =
      typeFilter === "all" || enrichment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery !== "" || statusFilter !== "all" || typeFilter !== "all";

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  // Open modal with selected enrichment
  const openEnrichmentDetails = (enrichment: Enrichment) => {
    setSelectedEnrichment(enrichment);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEnrichment(null), 200); // Clear after animation
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Enrichments
              </h1>
              <p className="text-muted-foreground mt-2">
                Enhance your data with additional contact and company information
              </p>
            </div>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              New Enrichment
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Enrichments</CardDescription>
              <CardTitle className="text-3xl">
                {enrichments.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Jobs</CardDescription>
              <CardTitle className="text-3xl">
                {enrichments.filter((e) => e.status === "active").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Records Processed</CardDescription>
              <CardTitle className="text-3xl">
                {enrichments.reduce((sum, e) => sum + e.recordsProcessed, 0).toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Success Rate</CardDescription>
              <CardTitle className="text-3xl">94%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search enrichments by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters:</span>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
                className={
                  statusFilter === "active"
                    ? ""
                    : "border-blue-500/20 text-blue-500 hover:bg-blue-500/10"
                }
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
                className={
                  statusFilter === "pending"
                    ? ""
                    : "border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10"
                }
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("completed")}
                className={
                  statusFilter === "completed"
                    ? ""
                    : "border-green-500/20 text-green-500 hover:bg-green-500/10"
                }
              >
                Completed
              </Button>
            </div>

            {/* Type Filter Dropdown */}
            <Select value={typeFilter} onValueChange={(value: string) => setTypeFilter(value as TypeFilter)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="demographic">Demographic</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm text-muted-foreground">
              Showing {filteredEnrichments.length} of {enrichments.length} enrichments
            </div>
          </div>
        </div>

        {/* Enrichments List */}
        <div className="space-y-4">
          {filteredEnrichments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No enrichments found</p>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your filters or search query."
                    : "Create your first enrichment to get started."}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredEnrichments.map((enrichment) => {
              const Icon = enrichmentTypeIcons[enrichment.type];
              const progress =
                (enrichment.recordsProcessed / enrichment.totalRecords) * 100;

              return (
                <Card 
                  key={enrichment.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openEnrichmentDetails(enrichment)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {enrichment.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Created on {new Date(enrichment.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={statusColors[enrichment.status]}
                      >
                        {enrichment.status.charAt(0).toUpperCase() +
                          enrichment.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {enrichment.recordsProcessed.toLocaleString()} /{" "}
                            {enrichment.totalRecords.toLocaleString()} records
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Type Badge */}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {enrichment.type.charAt(0).toUpperCase() +
                            enrichment.type.slice(1)}{" "}
                          Enrichment
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Enrichment Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedEnrichment && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {(() => {
                      const Icon = enrichmentTypeIcons[selectedEnrichment.type];
                      return <Icon className="w-6 h-6 text-primary" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedEnrichment.name}</DialogTitle>
                    <DialogDescription className="mt-2">
                      {selectedEnrichment.type.charAt(0).toUpperCase() + selectedEnrichment.type.slice(1)} enrichment • Created on {new Date(selectedEnrichment.createdAt).toLocaleDateString()}
                    </DialogDescription>
                  </div>
                  <Badge variant="outline" className={statusColors[selectedEnrichment.status]}>
                    {selectedEnrichment.status.charAt(0).toUpperCase() + selectedEnrichment.status.slice(1)}
                  </Badge>
                </div>
              </DialogHeader>

              <Separator className="my-4" />

              {/* Progress Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Progress</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Records Processed</span>
                    <span className="font-medium">
                      {selectedEnrichment.recordsProcessed.toLocaleString()} / {selectedEnrichment.totalRecords.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${(selectedEnrichment.recordsProcessed / selectedEnrichment.totalRecords) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{((selectedEnrichment.recordsProcessed / selectedEnrichment.totalRecords) * 100).toFixed(1)}% complete</span>
                    <span>Est. {selectedEnrichment.totalRecords - selectedEnrichment.recordsProcessed} remaining</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Details Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Created</span>
                    </div>
                    <p className="font-medium">{new Date(selectedEnrichment.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Duration</span>
                    </div>
                    <p className="font-medium">
                      {selectedEnrichment.status === "completed" ? "2h 15m" : "1h 45m (ongoing)"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Success Rate</span>
                    </div>
                    <p className="font-medium">
                      {selectedEnrichment.status === "completed" ? "100%" : "94.2%"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Database className="w-4 h-4" />
                      <span>Type</span>
                    </div>
                    <p className="font-medium capitalize">{selectedEnrichment.type}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Activity Log */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Activity Log</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm p-2 rounded-lg hover:bg-muted/50">
                      <span className="text-muted-foreground min-w-[120px]">{log.time}</span>
                      <span className={
                        log.type === "success" ? "text-green-600" :
                        log.type === "warning" ? "text-yellow-600" :
                        log.type === "error" ? "text-red-600" :
                        "text-foreground"
                      }>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {selectedEnrichment.status === "active" && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Pause className="w-4 h-4" />
                      Pause
                    </Button>
                  )}
                  {selectedEnrichment.status === "pending" && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Play className="w-4 h-4" />
                      Start
                    </Button>
                  )}
                  {selectedEnrichment.status === "completed" && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download Results
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
                <Button onClick={closeModal}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
