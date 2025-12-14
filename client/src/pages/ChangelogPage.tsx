import { FileText, Calendar, Tag, CheckCircle2, AlertCircle, Wrench, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Release {
  version: string;
  date: string;
  checkpoint?: string;
  sections: {
    type: "added" | "changed" | "fixed" | "removed";
    items: string[];
  }[];
}

const releases: Release[] = [
  {
    version: "v3.1.0",
    date: "2025-12-14",
    checkpoint: "6a605328",
    sections: [
      {
        type: "added",
        items: [
          "API Error Logging System: Real-time monitoring of all AudienceLab API calls",
          "API Logs Dashboard: Admin interface at /api-logs with stats and filtering",
          "Stats Cards: Total Logs, Errors, Warnings, Average Duration",
          "Correlation IDs: Track entire request chains across multiple API calls",
          "Log Levels: INFO, WARN, ERROR, DEBUG with color-coded badges",
          "Filterable Table: Search by endpoint, filter by log level",
          "Pagination: Handle large log datasets efficiently",
          "Background Service: Automatic log flushing every 30 seconds",
          "Database Table: api_error_logs with 14 columns for persistent storage",
          "Performance Metrics: Response time tracking and error rate calculation",
          "Stack Traces: Full error details with correlation IDs",
          "Body Truncation: Automatic truncation for large payloads (>10KB)",
          "Navigation: Added 'API Logs' link to sidebar with Activity icon",
          "Testing: 13/13 tests passing with full coverage",
          "Documentation: Complete API_LOGGING.md guide (2000+ words)",
        ],
      },
      {
        type: "changed",
        items: [
          "AudienceLab Client: All API calls now automatically logged",
          "Server Startup: Integrated API log service with graceful shutdown",
          "README: Added API Error Logging feature section",
        ],
      },
    ],
  },
  {
    version: "v3.0.0",
    date: "2025-12-14",
    checkpoint: "44204205",
    sections: [
      {
        type: "added",
        items: [
          "Vibe Code Prototype: Complete research on all 9 audience filter categories",
          "Vibe Code: Intent filters (Premade, Keyword, Custom methods)",
          "Vibe Code: Business filters (7 fields with AI keyword generator)",
          "Vibe Code: Location filters (Cities, States, Zip Codes)",
          "Vibe Code: Contact filters (5 toggle switches)",
          "Vibe Code: Personal, Financial, Family, Housing filters (dynamic builders)",
          "Vibe Code: CreateAudienceDialog - Simple name-only input",
          "Vibe Code: AudienceFilterBuilderPage - 9 filter category tabs",
          "Vibe Code: Empty state with 'Build Audience' CTA",
          "Vibe Code: Preview and Generate Audience buttons",
          "TypeScript: Complete type definitions for all filter categories (200+ lines)",
          "Documentation: COMPLETE_AUDIENCE_FILTERS_SPEC.md (700+ lines)",
          "Route: /audiences/:id/filters for filter builder",
        ],
      },
      {
        type: "changed",
        items: [
          "README: Complete rewrite with comprehensive overview",
          "README: Updated title to 'AudienceLab Vibe Platform'",
          "README: Added detailed feature status table",
          "README: Documented all 9 filter categories",
          "CreateAudienceDialog: Simplified to name-only input (matches AudienceLab UX)",
          "CreateAudienceDialog: Now uses two-step creation flow (name → filters)",
          "Project Scope: Expanded from 'Enrichment Dashboard' to 'Complete Platform'",
        ],
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "2025-12-13",
    checkpoint: "8946b8f6",
    sections: [
      {
        type: "changed",
        items: [
          "Audiences Page: Converted from card layout to 7-column sortable table",
          "Audiences: Added columns - Name, Status, Creation Date, Last Refreshed, Audience Size, Refresh Count, Next Refresh, Actions",
          "Audiences: Implemented sortable headers with visual indicators (↕️ ↑ ↓)",
          "Audiences: Added status badges (red 'No Data', green 'Completed')",
          "Audiences: Added refresh action buttons on each row",
          "Audiences: Implemented pagination controls (rows per page + navigation)",
          "Pixels Page: Added 'Available Pixel Actions' box with 4 buttons",
          "Pixels: Converted from card grid to 3-column table (Website Name, Website Url, Last Sync)",
          "Pixels: Implemented sortable headers for all columns",
          "Pixels: Added pixel counter display",
          "Pixels: Implemented pagination controls",
        ],
      },
      {
        type: "removed",
        items: [
          "Audiences: Removed gradient background header with icon",
          "Audiences: Removed subtitle text and info cards",
          "Audiences: Removed card-based layout",
          "Audiences: Removed delete buttons on cards",
          "Pixels: Removed gradient background header with icon",
          "Pixels: Removed 2-column card grid layout",
          "Pixels: Removed Pixel ID, Install URL, and Webhook URL display on cards",
          "Pixels: Removed copy-to-clipboard buttons",
          "Pixels: Removed delete buttons on cards",
        ],
      },
      {
        type: "added",
        items: [
          "Documentation: AUDIENCELAB_AUDIENCES_EXACT.md - Exact structure documentation",
          "Documentation: AUDIENCELAB_PIXEL_EXACT.md - Exact structure documentation",
          "Documentation: AUDIENCELAB_ENRICHMENT_EXACT.md - Confirmation of matching structure",
          "Documentation: CARBON_COPY_TEST.md - Comprehensive testing results",
          "Documentation: UPDATE_PAGES_COMPLETE.md - Implementation summary",
          "Client-side sorting and filtering for both pages",
          "Proper loading states with spinners",
          "Comprehensive error handling",
        ],
      },
    ],
  },
  {
    version: "v0.8.0",
    date: "2025-12-13",
    checkpoint: "ccc89ad2",
    sections: [
      {
        type: "added",
        items: [
          "Real-time Progress Polling on Enrichments page",
          "Automatic data refresh every 5 seconds when page is visible",
          "Intelligent polling that stops when tab is inactive",
          "Pulsing green 'Live' badge in header when active jobs exist",
          "'Updated [time]' timestamp showing last data fetch",
          "Smooth updates without flickering for stats cards, progress bars, and status badges",
        ],
      },
    ],
  },
  {
    version: "v0.7.0",
    date: "2025-12-13",
    checkpoint: "bfc09b28",
    sections: [
      {
        type: "added",
        items: [
          "API Integration for Enrichments and Audiences pages",
          "Connected Enrichments page to real AudienceLab API",
          "Loading states with spinner animations",
          "Error handling with user-friendly messages",
          "Empty states with helpful guidance",
        ],
      },
      {
        type: "changed",
        items: [
          "Replaced mock enrichment data with live API calls",
          "Transformed API response to match UI interface",
        ],
      },
    ],
  },
  {
    version: "v0.6.0",
    date: "2025-12-13",
    checkpoint: "ec328bd9",
    sections: [
      {
        type: "added",
        items: [
          "Complete UI Redesign matching Spark V2 theme",
          "Redesigned Audiences, Enrichments, and Pixels pages",
          "Unified gradient backgrounds (gray-50 to gray-100)",
          "Consistent white headers with blue gradient icons",
          "Standardized card styling (rounded-xl, shadow-sm)",
          "Unified typography across all pages",
          "Professional blue info cards",
        ],
      },
    ],
  },
  {
    version: "v0.5.0",
    date: "2025-12-13",
    checkpoint: "81742e3e",
    sections: [
      {
        type: "added",
        items: [
          "Enrichment Details Modal with comprehensive job information",
          "Progress section with visual bar and percentage",
          "Details grid (Created date, Duration, Success Rate, Type)",
          "Scrollable activity log with color-coded messages",
          "Contextual action buttons based on status",
          "Multiple close methods (button/X/backdrop/ESC)",
        ],
      },
      {
        type: "fixed",
        items: [
          "Modal background styling - added explicit bg-white",
          "Modal content now clearly visible against dark overlay",
        ],
      },
    ],
  },
  {
    version: "v0.4.0",
    date: "2025-12-13",
    checkpoint: "ce6a3e95",
    sections: [
      {
        type: "added",
        items: [
          "Advanced Filtering System for Enrichments page",
          "Real-time search by enrichment name",
          "Status filter buttons with color coding",
          "Type filter dropdown",
          "Combined filtering (all filters work together)",
          "Clear Filters button",
          "Dynamic results counter",
          "Instant client-side filtering",
        ],
      },
    ],
  },
  {
    version: "v0.3.0",
    date: "2025-12-13",
    checkpoint: "74836c6c",
    sections: [
      {
        type: "added",
        items: [
          "Enrichments Page with full UI",
          "Navigation link in sidebar with Database icon",
          "4 stats cards (Total, Active Jobs, Records Processed, Success Rate)",
          "Search bar for filtering enrichments",
          "Mock enrichment cards with progress bars",
          "Status and Type badges",
          "New Enrichment button",
        ],
      },
    ],
  },
  {
    version: "v0.2.0",
    date: "2025-12-13",
    checkpoint: "c0f2292e",
    sections: [
      {
        type: "added",
        items: [
          "Navigation Menu with sidebar",
          "DashboardLayout component with 256px sidebar",
          "Navigation links: Home, Spark V2, Audiences, Pixels",
          "AudienceLab Vibe branding with gradient icon",
          "Active state highlighting",
          "Routes for all pages",
        ],
      },
      {
        type: "fixed",
        items: [
          "Nested Anchor Tag Error in DashboardLayout",
          "Changed <a> to <div> inside <Link> components",
        ],
      },
    ],
  },
  {
    version: "v0.1.0",
    date: "2025-12-13",
    checkpoint: "30df0d4f",
    sections: [
      {
        type: "added",
        items: [
          "Initial Project Setup with React 19 + Tailwind 4",
          "shadcn/ui components integrated",
          "tRPC client configured",
          "Basic routing with Wouter",
          "Spark V2 Page with query configuration",
          "Audiences Page with CRUD operations",
          "Pixels Page with tracking management",
        ],
      },
    ],
  },
];

const sectionIcons = {
  added: CheckCircle2,
  changed: Wrench,
  fixed: AlertCircle,
  removed: Trash2,
};

const sectionColors = {
  added: "text-green-600 bg-green-50 border-green-200",
  changed: "text-blue-600 bg-blue-50 border-blue-200",
  fixed: "text-orange-600 bg-orange-50 border-orange-200",
  removed: "text-red-600 bg-red-50 border-red-200",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Changelog</h1>
              <p className="text-sm text-gray-600">
                Track all updates, features, and improvements to the platform
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">📋 Release Notes</p>
              <p className="text-blue-700">
                This changelog documents all notable changes to the AudienceLab Enrichment Dashboard.
                Each release includes new features, improvements, bug fixes, and technical updates.
              </p>
            </div>
          </div>
        </div>

        {/* Releases */}
        <div className="space-y-6">
          {releases.map((release, index) => (
            <div
              key={release.version}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Release Header */}
              <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{release.version}</h2>
                      {index === 0 && (
                        <Badge className="bg-blue-600 text-white">Latest</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{release.date}</span>
                      </div>
                      {release.checkpoint && (
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-4 h-4" />
                          <code className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">
                            {release.checkpoint}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Release Sections */}
              <div className="p-6 space-y-6">
                {release.sections.map((section, sectionIndex) => {
                  const Icon = sectionIcons[section.type];
                  const colorClass = sectionColors[section.type];

                  return (
                    <div key={sectionIndex}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-1.5 rounded-lg border ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {section.type}
                        </h3>
                      </div>
                      <ul className="space-y-2 ml-8">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 AudienceLab Vibe Platform • All updates documented</p>
        </div>
      </main>
    </div>
  );
}
