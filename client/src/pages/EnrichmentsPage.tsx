import { useState } from "react";
import { Search, Plus, Database, TrendingUp, Users, Mail } from "lucide-react";
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

export default function EnrichmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [enrichments] = useState<Enrichment[]>(mockEnrichments);

  const filteredEnrichments = enrichments.filter((enrichment) =>
    enrichment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Search */}
        <div className="mb-6">
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
        </div>

        {/* Enrichments List */}
        <div className="space-y-4">
          {filteredEnrichments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No enrichments found. Create your first enrichment to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEnrichments.map((enrichment) => {
              const Icon = enrichmentTypeIcons[enrichment.type];
              const progress =
                (enrichment.recordsProcessed / enrichment.totalRecords) * 100;

              return (
                <Card key={enrichment.id} className="hover:shadow-md transition-shadow">
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
    </div>
  );
}
