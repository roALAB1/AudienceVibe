# Hybrid API Implementation Guide

**Last Updated:** December 14, 2025  
**Purpose:** Guide for implementing the Audiences + Studio hybrid approach

---

## Overview

This guide provides a complete implementation plan for integrating both the Audiences API (management) and Studio API (data access) into a single cohesive application.

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                      │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │  Audiences     │  │  Audience      │  │  Data Export  │ │
│  │  List Page     │  │  Detail Page   │  │  Features     │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Layer (tRPC)                  │
│  ┌────────────────┐                  ┌───────────────────┐ │
│  │  Audiences     │                  │  Studio Segments  │ │
│  │  Router        │                  │  Router           │ │
│  └────────────────┘                  └───────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          │                                      │
          ▼                                      ▼
┌──────────────────────┐          ┌──────────────────────────┐
│   Audiences API      │          │    Studio API            │
│  (Management)        │          │    (Data Access)         │
│  - Create            │          │    - View records        │
│  - Delete            │          │    - Get size            │
│  - List              │          │    - Export data         │
│  - Configure         │          │    - Pagination          │
└──────────────────────┘          └──────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Backend - Studio API Integration

#### 1.1 Create Studio API Client

**File:** `shared/studio-client.ts`

```typescript
export interface SegmentData {
  data: AudienceRecord[];
  segment_id: string;
  segment_name: string;
  total_records: number;
  total_pages: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface AudienceRecord {
  UUID: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  BUSINESS_EMAIL: string;
  PERSONAL_EMAIL: string;
  COMPANY_NAME: string;
  JOB_TITLE: string;
  // ... all 74 fields
}

export class StudioAPIClient {
  private baseURL = 'https://api.audiencelab.io';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getSegmentData(
    segmentId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<SegmentData> {
    const url = `${this.baseURL}/segments/${segmentId}?page=${page}&page_size=${pageSize}`;
    
    const response = await fetch(url, {
      headers: {
        'X-API-KEY': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Studio API error: ${response.status}`);
    }

    return response.json();
  }

  async getAllRecords(segmentId: string): Promise<AudienceRecord[]> {
    const allRecords: AudienceRecord[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getSegmentData(segmentId, page, 1000);
      allRecords.push(...response.data);
      hasMore = response.has_more;
      page++;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allRecords;
  }
}
```

#### 1.2 Create tRPC Router for Studio

**File:** `server/routers/studio.ts`

```typescript
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { StudioAPIClient } from '../../shared/studio-client';

export const studioRouter = router({
  getSegmentData: publicProcedure
    .input(z.object({
      segmentId: z.string(),
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(10000).default(50)
    }))
    .query(async ({ input }) => {
      const client = new StudioAPIClient(process.env.AUDIENCELAB_API_KEY!);
      return client.getSegmentData(input.segmentId, input.page, input.pageSize);
    }),

  exportSegment: publicProcedure
    .input(z.object({
      segmentId: z.string()
    }))
    .mutation(async ({ input }) => {
      const client = new StudioAPIClient(process.env.AUDIENCELAB_API_KEY!);
      const records = await client.getAllRecords(input.segmentId);
      return { records, count: records.length };
    })
});
```

#### 1.3 Register Router

**File:** `server/index.ts`

```typescript
import { studioRouter } from './routers/studio';

export const appRouter = router({
  // ... existing routers
  studio: studioRouter
});
```

---

### Phase 2: Database - Segment Mapping

#### 2.1 Create Database Schema

**File:** `server/db/schema.ts`

```typescript
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const audienceSegments = pgTable('audience_segments', {
  id: text('id').primaryKey(),
  audienceId: text('audience_id').notNull(),
  audienceName: text('audience_name').notNull(),
  segmentId: text('segment_id').notNull().unique(),
  segmentName: text('segment_name').notNull(),
  totalRecords: integer('total_records'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

#### 2.2 Run Migration

```bash
cd /home/ubuntu/audiencelab-enrichment
pnpm db:push
```

#### 2.3 Create Segment Mapping Service

**File:** `server/services/segment-mapping.ts`

```typescript
import { db } from '../db';
import { audienceSegments } from '../db/schema';
import { eq } from 'drizzle-orm';

export class SegmentMappingService {
  async createMapping(
    audienceId: string,
    audienceName: string,
    segmentId: string,
    segmentName: string,
    totalRecords: number
  ) {
    return db.insert(audienceSegments).values({
      id: `map_${Date.now()}`,
      audienceId,
      audienceName,
      segmentId,
      segmentName,
      totalRecords
    });
  }

  async getSegmentForAudience(audienceId: string) {
    const result = await db
      .select()
      .from(audienceSegments)
      .where(eq(audienceSegments.audienceId, audienceId))
      .limit(1);
    
    return result[0] || null;
  }

  async updateRecordCount(segmentId: string, totalRecords: number) {
    return db
      .update(audienceSegments)
      .set({ totalRecords, updatedAt: new Date() })
      .where(eq(audienceSegments.segmentId, segmentId));
  }
}
```

---

### Phase 3: Frontend - Audience Detail Page

#### 3.1 Update Audience Detail Page

**File:** `client/src/pages/AudienceDetailPage.tsx`

```typescript
import { useState } from 'react';
import { useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

export default function AudienceDetailPage() {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [showData, setShowData] = useState(false);

  // Get audience metadata
  const { data: audiences } = trpc.audienceLabAPI.audiences.list.useQuery();
  const audience = audiences?.audiences.find(a => a.id === id);

  // Get segment mapping
  const { data: segment } = trpc.studio.getSegmentForAudience.useQuery(
    { audienceId: id! },
    { enabled: showData }
  );

  // Get segment data
  const { data: segmentData, isLoading } = trpc.studio.getSegmentData.useQuery(
    {
      segmentId: segment?.segmentId!,
      page: currentPage,
      pageSize: 50
    },
    { enabled: showData && !!segment }
  );

  const handleViewData = () => {
    setShowData(true);
  };

  const handleExport = async () => {
    const result = await trpc.studio.exportSegment.mutate({
      segmentId: segment!.segmentId
    });
    
    // Convert to CSV and download
    const csv = convertToCSV(result.records);
    downloadCSV(csv, `${audience?.name}.csv`);
  };

  if (!audience) return <div>Audience not found</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{audience.name}</h1>

      {/* Metadata Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold">Audience ID</h3>
          <p>{audience.id}</p>
        </div>
        <div>
          <h3 className="font-semibold">Audience Size</h3>
          <p>{segment?.totalRecords?.toLocaleString() || 'Unknown'}</p>
        </div>
        <div>
          <h3 className="font-semibold">Scheduled Refresh</h3>
          <p>{audience.scheduled_refresh ? 'Enabled' : 'Disabled'}</p>
        </div>
        <div>
          <h3 className="font-semibold">Next Refresh</h3>
          <p>{audience.next_scheduled_refresh || 'Not set'}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        {!showData && (
          <Button onClick={handleViewData}>
            View Data
          </Button>
        )}
        {showData && segment && (
          <Button onClick={handleExport}>
            Export to CSV
          </Button>
        )}
      </div>

      {/* Data Table */}
      {showData && segmentData && (
        <div>
          <DataTable
            data={segmentData.data}
            columns={Object.keys(segmentData.data[0] || {})}
            pagination={{
              page: currentPage,
              pageSize: 50,
              totalPages: segmentData.total_pages,
              onPageChange: setCurrentPage
            }}
          />
        </div>
      )}

      {isLoading && <div>Loading data...</div>}
    </div>
  );
}
```

#### 3.2 Create Data Table Component

**File:** `client/src/components/ui/data-table.tsx`

```typescript
interface DataTableProps {
  data: any[];
  columns: string[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable({ data, columns, pagination }: DataTableProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Page {pagination.page} of {pagination.totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

### Phase 4: Segment Auto-Creation

#### 4.1 Add Studio Automation Service

**File:** `server/services/studio-automation.ts`

```typescript
/**
 * Note: This is a placeholder for future Studio API automation.
 * Currently, segments must be created manually in the Studio UI.
 * 
 * Future implementation will use Studio API to:
 * 1. Automatically create segments for new audiences
 * 2. Configure filters and fields programmatically
 * 3. Return segment ID for immediate data access
 */

export class StudioAutomationService {
  async createSegmentForAudience(audienceId: string, audienceName: string) {
    // TODO: Implement when Studio API supports programmatic segment creation
    throw new Error('Segment creation must be done manually in Studio UI for now');
  }

  async getOrCreateSegment(audienceId: string, audienceName: string) {
    const mapping = await segmentMappingService.getSegmentForAudience(audienceId);
    
    if (mapping) {
      return mapping;
    }

    // For now, return null and show instructions to user
    return null;
  }
}
```

#### 4.2 Add Manual Segment Linking

**File:** `client/src/components/LinkSegmentDialog.tsx`

```typescript
export function LinkSegmentDialog({ audienceId, audienceName }: Props) {
  const [segmentId, setSegmentId] = useState('');
  
  const linkMutation = trpc.studio.linkSegment.useMutation();

  const handleLink = async () => {
    await linkMutation.mutateAsync({
      audienceId,
      audienceName,
      segmentId
    });
  };

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Studio Segment</DialogTitle>
          <DialogDescription>
            Create a segment in Studio, then paste the segment ID here.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to Studio in AudienceLab dashboard</li>
            <li>Select the "{audienceName}" audience</li>
            <li>Choose fields and filters</li>
            <li>Save the segment</li>
            <li>Click "Show API" and copy the segment ID</li>
            <li>Paste the segment ID below</li>
          </ol>

          <Input
            placeholder="04111f25-a796-494d-a8e0-a2dd541a5768"
            value={segmentId}
            onChange={(e) => setSegmentId(e.target.value)}
          />

          <Button onClick={handleLink} disabled={!segmentId}>
            Link Segment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Testing Checklist

### Backend Tests

- [ ] Studio API client can fetch segment data
- [ ] Pagination works correctly
- [ ] Export functionality retrieves all records
- [ ] Error handling works for invalid segment IDs
- [ ] Rate limiting is respected
- [ ] Database schema is created successfully
- [ ] Segment mapping CRUD operations work

### Frontend Tests

- [ ] Audience list page displays all audiences
- [ ] Audience detail page shows metadata
- [ ] "View Data" button triggers segment data fetch
- [ ] Data table displays records correctly
- [ ] Pagination controls work
- [ ] Export to CSV downloads correct data
- [ ] Link segment dialog works
- [ ] Loading states display properly
- [ ] Error states display properly

### Integration Tests

- [ ] End-to-end: Create audience → Link segment → View data
- [ ] End-to-end: View data → Export CSV
- [ ] Segment mapping persists across sessions
- [ ] Record count updates when segment is refreshed

---

## Deployment Checklist

- [ ] Environment variables configured (AUDIENCELAB_API_KEY)
- [ ] Database migrations run successfully
- [ ] Frontend build completes without errors
- [ ] Backend server starts without errors
- [ ] API endpoints are accessible
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Error logging configured
- [ ] User documentation created
- [ ] Developer documentation created

---

## User Documentation

Create user-facing documentation explaining:

1. **How to view audience data**
   - Navigate to audience detail page
   - Click "View Data" button
   - Browse paginated results

2. **How to export data**
   - Click "Export to CSV" button
   - Wait for download to complete
   - Open CSV in Excel or other tools

3. **How to link a segment**
   - Create segment in Studio
   - Copy segment ID
   - Paste in "Link Segment" dialog

---

## Developer Documentation

Create developer documentation explaining:

1. **Architecture overview**
2. **API integration patterns**
3. **Database schema**
4. **tRPC router structure**
5. **Error handling strategies**
6. **Testing procedures**
7. **Deployment process**

---

## Future Enhancements

1. **Automated segment creation** - When Studio API supports it
2. **Real-time updates** - WebSocket connection for live data
3. **Advanced filtering** - Client-side filtering on fetched data
4. **Data visualization** - Charts and graphs for audience insights
5. **Scheduled exports** - Automated CSV exports on schedule
6. **Webhook integration** - Receive notifications when data updates

---

## Support Resources

- **AudienceLab Documentation:** https://docs.audiencelab.io
- **Studio Guide:** `/docs/STUDIO_API_GUIDE.md`
- **Architecture Overview:** `/docs/AUDIENCELAB_ARCHITECTURE.md`
- **API Reference:** `/docs/API_REFERENCE.md`
