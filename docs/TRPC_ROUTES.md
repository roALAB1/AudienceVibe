# tRPC Routes Documentation

**Last Updated:** December 13, 2025  
**tRPC Version:** 11.x  
**Router Location:** `server/routers/audiencelab.ts`

---

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Audiences Routes](#audiences-routes)
4. [Pixels Routes](#pixels-routes)
5. [Segments Routes](#segments-routes)
6. [Enrichment Routes](#enrichment-routes)
7. [Error Handling](#error-handling)
8. [TypeScript Types](#typescript-types)

---

## Overview

The AudienceLab tRPC router provides **type-safe, server-side access** to the AudienceLab API. All routes:

- ✅ Use API key from environment variables (never exposed to client)
- ✅ Include input validation with Zod schemas
- ✅ Provide end-to-end type safety
- ✅ Handle errors gracefully with proper error codes
- ✅ Support retry logic with exponential backoff

---

## Setup

### Import the tRPC Client

```typescript
import { trpc } from '@/lib/trpc';
```

### Use in React Components

```typescript
import { trpc } from '@/lib/trpc';

function MyComponent() {
  const { data, isLoading, error } = trpc.audienceLab.audiences.list.useQuery({
    page: 1,
    pageSize: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Audiences ({data.total})</h1>
      {data.data.map((audience) => (
        <div key={audience.id}>{audience.name}</div>
      ))}
    </div>
  );
}
```

---

## Audiences Routes

### `audiences.list` - List All Audiences

**Type:** Query  
**Status:** ✅ Validated (399 audiences tested)

#### Usage

```typescript
const { data, isLoading, error } = trpc.audienceLab.audiences.list.useQuery({
  page: 1,
  pageSize: 20,
});
```

#### Input Schema

```typescript
{
  page: number;      // Default: 1, Min: 1
  pageSize: number;  // Default: 20, Min: 1, Max: 100
}
```

#### Response Type

```typescript
{
  data: Audience[];
  total: number;
}

interface Audience {
  id: string;
  name: string;
  next_scheduled_refresh: string | null;
  refresh_interval: number | null;
  scheduled_refresh: boolean;
  webhook_url: string | null;
}
```

#### Example

```typescript
function AudiencesList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = trpc.audienceLab.audiences.list.useQuery({
    page,
    pageSize: 20,
  });

  return (
    <div>
      {data?.data.map((audience) => (
        <div key={audience.id}>
          <h3>{audience.name}</h3>
          <p>Scheduled: {audience.scheduled_refresh ? 'Yes' : 'No'}</p>
        </div>
      ))}
      <button onClick={() => setPage(page + 1)}>Next Page</button>
    </div>
  );
}
```

---

### `audiences.get` - Get Audience by ID

**Type:** Query  
**Status:** ⚠️ Not tested

#### Usage

```typescript
const { data } = trpc.audienceLab.audiences.get.useQuery({
  id: 'aud_abc123',
});
```

#### Input Schema

```typescript
{
  id: string;  // Required: Audience ID
}
```

#### Response Type

```typescript
Audience
```

#### Example

```typescript
function AudienceDetails({ audienceId }: { audienceId: string }) {
  const { data, isLoading, error } = trpc.audienceLab.audiences.get.useQuery({
    id: audienceId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Audience not found</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>Next refresh: {data.next_scheduled_refresh}</p>
      <p>Webhook: {data.webhook_url || 'None'}</p>
    </div>
  );
}
```

---

### `audiences.create` - Create New Audience

**Type:** Mutation  
**Status:** ⚠️ Not tested

#### Usage

```typescript
const createAudience = trpc.audienceLab.audiences.create.useMutation();

await createAudience.mutateAsync({
  name: 'Software Engineers',
  description: 'Engineers in tech companies',
  filters: [
    {
      field: 'JOB_TITLE',
      operator: 'contains',
      value: 'Engineer',
    },
  ],
  webhook_url: 'https://example.com/webhook',
});
```

#### Input Schema

```typescript
{
  name: string;                    // Required, min length: 1
  description?: string;            // Optional
  filters: AudienceFilter[];       // Required
  webhook_url?: string;            // Optional, must be valid URL
}

interface AudienceFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | number | string[];
}
```

#### Response Type

```typescript
Audience
```

#### Example

```typescript
function CreateAudienceForm() {
  const createAudience = trpc.audienceLab.audiences.create.useMutation();
  const utils = trpc.useContext();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createAudience.mutateAsync({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        filters: [
          {
            field: 'JOB_TITLE',
            operator: 'contains',
            value: formData.get('jobTitle') as string,
          },
        ],
      });

      // Invalidate and refetch audiences list
      utils.audienceLab.audiences.list.invalidate();
      
      toast.success('Audience created successfully!');
    } catch (error) {
      toast.error('Failed to create audience');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Audience name" required />
      <input name="description" placeholder="Description" />
      <input name="jobTitle" placeholder="Job title filter" />
      <button type="submit" disabled={createAudience.isLoading}>
        {createAudience.isLoading ? 'Creating...' : 'Create Audience'}
      </button>
    </form>
  );
}
```

---

### `audiences.delete` - Delete Audience

**Type:** Mutation  
**Status:** ⚠️ Not tested

#### Usage

```typescript
const deleteAudience = trpc.audienceLab.audiences.delete.useMutation();

await deleteAudience.mutateAsync({ id: 'aud_abc123' });
```

#### Input Schema

```typescript
{
  id: string;  // Required: Audience ID
}
```

#### Response Type

```typescript
{
  success: boolean;
}
```

#### Example

```typescript
function DeleteAudienceButton({ audienceId }: { audienceId: string }) {
  const deleteAudience = trpc.audienceLab.audiences.delete.useMutation();
  const utils = trpc.useContext();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this audience?')) return;

    try {
      await deleteAudience.mutateAsync({ id: audienceId });
      
      // Invalidate audiences list to refetch
      utils.audienceLab.audiences.list.invalidate();
      
      toast.success('Audience deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete audience');
    }
  };

  return (
    <button onClick={handleDelete} disabled={deleteAudience.isLoading}>
      {deleteAudience.isLoading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

### `audiences.getAttributes` - Get Available Fields

**Type:** Query  
**Status:** ⚠️ Not tested

Returns all 84 available fields for filtering.

#### Usage

```typescript
const { data } = trpc.audienceLab.audiences.getAttributes.useQuery();
```

#### Response Type

```typescript
{
  attributes: AudienceAttribute[];
}

interface AudienceAttribute {
  name: string;    // Field name (e.g., "FIRST_NAME")
  label: string;   // Display label (e.g., "First Name")
  type: 'string' | 'number' | 'boolean' | 'date';
  category: 'personal' | 'contact' | 'professional' | 'company' | 'social' | 'skiptrace';
}
```

#### Example

```typescript
function FieldSelector() {
  const { data, isLoading } = trpc.audienceLab.audiences.getAttributes.useQuery();

  if (isLoading) return <div>Loading fields...</div>;

  return (
    <select>
      {data?.attributes.map((attr) => (
        <option key={attr.name} value={attr.name}>
          {attr.label} ({attr.type})
        </option>
      ))}
    </select>
  );
}
```

---

## Pixels Routes

### `pixels.list` - List All Pixels

**Type:** Query  
**Status:** ✅ Validated (6 pixels tested)

#### Usage

```typescript
const { data, isLoading } = trpc.audienceLab.pixels.list.useQuery();
```

#### Response Type

```typescript
{
  data: Pixel[];
  total: number;
}

interface Pixel {
  id: string;
  install_url: string;
  last_sync: string;
  webhook_url: string | null;
  website_name: string;
  website_url: string;
}
```

#### Example

```typescript
function PixelsList() {
  const { data, isLoading } = trpc.audienceLab.pixels.list.useQuery();

  if (isLoading) return <div>Loading pixels...</div>;

  return (
    <div>
      <h1>Pixels ({data?.total})</h1>
      {data?.data.map((pixel) => (
        <div key={pixel.id}>
          <h3>{pixel.website_name}</h3>
          <p>URL: {pixel.website_url}</p>
          <code>{pixel.install_url}</code>
          <button onClick={() => navigator.clipboard.writeText(pixel.install_url)}>
            Copy Install URL
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### `pixels.get` - Get Pixel by ID

**Type:** Query  
**Status:** ⚠️ Not tested

#### Usage

```typescript
const { data } = trpc.audienceLab.pixels.get.useQuery({
  id: 'pixel_abc123',
});
```

#### Input Schema

```typescript
{
  id: string;  // Required: Pixel ID
}
```

#### Response Type

```typescript
Pixel
```

---

### `pixels.create` - Create New Pixel

**Type:** Mutation  
**Status:** ⚠️ Not tested

#### Usage

```typescript
const createPixel = trpc.audienceLab.pixels.create.useMutation();

await createPixel.mutateAsync({
  name: 'My Website',
  domain: 'example.com',
  webhook_url: 'https://example.com/webhook',
  integrations: {
    google_analytics: {
      measurement_id: 'G-XXXXXXXXXX',
    },
  },
});
```

#### Input Schema

```typescript
{
  name: string;                    // Required, min length: 1
  domain: string;                  // Required, min length: 1
  webhook_url?: string;            // Optional, must be valid URL
  integrations?: {
    google_analytics?: {
      measurement_id: string;
    };
    microsoft_clarity?: {
      project_id: string;
    };
  };
  custom_params?: Record<string, string>;
}
```

#### Response Type

```typescript
Pixel
```

#### Example

```typescript
function CreatePixelForm() {
  const createPixel = trpc.audienceLab.pixels.create.useMutation();
  const utils = trpc.useContext();

  const handleSubmit = async (formData: FormData) => {
    try {
      const pixel = await createPixel.mutateAsync({
        name: formData.get('name') as string,
        domain: formData.get('domain') as string,
        webhook_url: formData.get('webhook') as string || undefined,
      });

      utils.audienceLab.pixels.list.invalidate();
      
      toast.success('Pixel created! Install URL copied to clipboard.');
      navigator.clipboard.writeText(pixel.install_url);
    } catch (error) {
      toast.error('Failed to create pixel');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Website name" required />
      <input name="domain" placeholder="example.com" required />
      <input name="webhook" placeholder="Webhook URL (optional)" type="url" />
      <button type="submit" disabled={createPixel.isLoading}>
        Create Pixel
      </button>
    </form>
  );
}
```

---

### `pixels.delete` - Delete Pixel

**Type:** Mutation  
**Status:** ⚠️ Not tested

#### Usage

```typescript
const deletePixel = trpc.audienceLab.pixels.delete.useMutation();

await deletePixel.mutateAsync({ id: 'pixel_abc123' });
```

#### Input Schema

```typescript
{
  id: string;  // Required: Pixel ID
}
```

#### Response Type

```typescript
{
  success: boolean;
}
```

---

## Segments Routes

### `segments.getData` - Get Segment Data

**Type:** Query  
**Status:** ⚠️ Not tested (requires valid segment ID)

#### Usage

```typescript
const { data } = trpc.audienceLab.segments.getData.useQuery({
  segmentId: 'seg_abc123',
  page: 1,
  pageSize: 50,
});
```

#### Input Schema

```typescript
{
  segmentId: string;  // Required: Segment ID
  page: number;       // Default: 1, Min: 1
  pageSize: number;   // Default: 50, Min: 1, Max: 100
}
```

#### Response Type

```typescript
{
  data: EnrichedContact[];  // Array of contacts with up to 84 fields
  total: number;
  page: number;
  page_size: number;
}
```

#### Example

```typescript
function SegmentData({ segmentId }: { segmentId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = trpc.audienceLab.segments.getData.useQuery({
    segmentId,
    page,
    pageSize: 50,
  });

  if (isLoading) return <div>Loading segment data...</div>;

  return (
    <div>
      <h1>Segment Data ({data?.total} contacts)</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Job Title</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((contact) => (
            <tr key={contact.UUID}>
              <td>{contact.FULL_NAME}</td>
              <td>{contact.BUSINESS_EMAIL}</td>
              <td>{contact.JOB_TITLE}</td>
              <td>{contact.COMPANY_NAME}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
```

---

## Enrichment Routes

### `enrichment.enrichContact` - Enrich Single Contact

**Type:** Mutation  
**Status:** ❌ Failed (400 Bad Request - needs investigation)

#### Usage

```typescript
const enrichContact = trpc.audienceLab.enrichment.enrichContact.useMutation();

const result = await enrichContact.mutateAsync({
  email: 'john@example.com',
  fields: ['FIRST_NAME', 'LAST_NAME', 'JOB_TITLE'],
});
```

#### Input Schema

```typescript
{
  email?: string;                  // Email (any format)
  personal_email?: string;         // Personal email
  business_email?: string;         // Business email
  linkedin_url?: string;           // LinkedIn profile URL
  first_name?: string;
  last_name?: string;
  company_name?: string;
  company_domain?: string;
  phone?: string;
  personal_address?: string;
  personal_city?: string;
  personal_state?: string;
  personal_zip?: string;
  sha256_personal_email?: string;  // SHA256 hash of email
  up_id?: string;                  // UniversalPerson ID
  fields?: string[];               // Fields to return (default: all 84)
}
```

#### Response Type

```typescript
{
  status: 'success' | 'partial' | 'error';
  contact?: EnrichedContact;
  credits_used: number;
  credits_remaining: number;
  error?: string;
}
```

---

### `enrichment.createJob` - Create Bulk Enrichment Job

**Type:** Mutation  
**Status:** ⚠️ Not tested

#### Usage

```typescript
const createJob = trpc.audienceLab.enrichment.createJob.useMutation();

const job = await createJob.mutateAsync({
  contacts: [
    { email: 'john@example.com', first_name: 'John' },
    { business_email: 'jane@company.com' },
  ],
  fields: ['JOB_TITLE', 'COMPANY_NAME'],
});
```

---

### `enrichment.getJobs` - List Enrichment Jobs

**Type:** Query  
**Status:** ⚠️ Not tested

#### Usage

```typescript
const { data } = trpc.audienceLab.enrichment.getJobs.useQuery({
  page: 1,
  pageSize: 20,
});
```

---

### `enrichment.getJob` - Get Job by ID

**Type:** Query  
**Status:** ⚠️ Not tested

#### Usage

```typescript
const { data } = trpc.audienceLab.enrichment.getJob.useQuery({
  id: 'job_abc123',
});
```

---

## Error Handling

### Error Types

```typescript
import { TRPCError } from '@trpc/server';

// Possible error codes:
// - 'NOT_FOUND' - Resource not found (404)
// - 'INTERNAL_SERVER_ERROR' - Server error (500)
// - 'BAD_REQUEST' - Invalid input (400)
// - 'UNAUTHORIZED' - Invalid API key (401)
```

### Handling Errors in Components

```typescript
function MyComponent() {
  const { data, error, isLoading } = trpc.audienceLab.audiences.list.useQuery({
    page: 1,
    pageSize: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  
  if (error) {
    // Error is typed with TRPCError
    return (
      <div>
        <h3>Error: {error.message}</h3>
        <p>Code: {error.data?.code}</p>
      </div>
    );
  }

  return <div>{/* Render data */}</div>;
}
```

### Handling Mutation Errors

```typescript
function CreateAudience() {
  const createAudience = trpc.audienceLab.audiences.create.useMutation({
    onSuccess: () => {
      toast.success('Audience created!');
    },
    onError: (error) => {
      if (error.data?.code === 'BAD_REQUEST') {
        toast.error('Invalid input. Please check your data.');
      } else {
        toast.error('Failed to create audience');
      }
    },
  });

  return (
    <button onClick={() => createAudience.mutate({ name: 'Test' })}>
      Create
    </button>
  );
}
```

---

## TypeScript Types

All types are exported from `shared/audiencelab-types.ts`:

```typescript
import type {
  Audience,
  AudiencesListResponse,
  CreateAudienceRequest,
  AudienceFilter,
  AudienceAttribute,
  Pixel,
  PixelsListResponse,
  CreatePixelRequest,
  EnrichedContact,
  SegmentDataResponse,
  EnrichmentRequest,
  EnrichmentResponse,
  EnrichmentJob,
  EnrichmentJobsListResponse,
  CreateEnrichmentJobRequest,
} from '@/shared/audiencelab-types';
```

---

## Best Practices

### 1. Use Optimistic Updates

```typescript
const utils = trpc.useContext();
const deleteAudience = trpc.audienceLab.audiences.delete.useMutation({
  onMutate: async ({ id }) => {
    // Cancel outgoing refetches
    await utils.audienceLab.audiences.list.cancel();

    // Snapshot previous value
    const previousAudiences = utils.audienceLab.audiences.list.getData();

    // Optimistically update
    utils.audienceLab.audiences.list.setData(
      { page: 1, pageSize: 20 },
      (old) => ({
        ...old!,
        data: old!.data.filter((a) => a.id !== id),
        total: old!.total - 1,
      })
    );

    return { previousAudiences };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    utils.audienceLab.audiences.list.setData(
      { page: 1, pageSize: 20 },
      context?.previousAudiences
    );
  },
});
```

### 2. Invalidate Queries After Mutations

```typescript
const createAudience = trpc.audienceLab.audiences.create.useMutation({
  onSuccess: () => {
    // Invalidate and refetch
    utils.audienceLab.audiences.list.invalidate();
  },
});
```

### 3. Use Loading States

```typescript
function MyComponent() {
  const { data, isLoading, isFetching } = trpc.audienceLab.audiences.list.useQuery({
    page: 1,
    pageSize: 20,
  });

  return (
    <div>
      {isLoading && <div>Initial load...</div>}
      {isFetching && !isLoading && <div>Refreshing...</div>}
      {data && <div>{/* Render data */}</div>}
    </div>
  );
}
```

---

## Summary

| Route | Type | Status | Description |
|-------|------|--------|-------------|
| `audiences.list` | Query | ✅ Validated | List audiences with pagination |
| `audiences.get` | Query | ⚠️ Not tested | Get audience by ID |
| `audiences.create` | Mutation | ⚠️ Not tested | Create new audience |
| `audiences.delete` | Mutation | ⚠️ Not tested | Delete audience |
| `audiences.getAttributes` | Query | ⚠️ Not tested | Get 84 available fields |
| `pixels.list` | Query | ✅ Validated | List all pixels |
| `pixels.get` | Query | ⚠️ Not tested | Get pixel by ID |
| `pixels.create` | Mutation | ⚠️ Not tested | Create new pixel |
| `pixels.delete` | Mutation | ⚠️ Not tested | Delete pixel |
| `segments.getData` | Query | ⚠️ Not tested | Get segment data |
| `enrichment.enrichContact` | Mutation | ❌ Failed | Enrich single contact |
| `enrichment.createJob` | Mutation | ⚠️ Not tested | Create bulk job |
| `enrichment.getJobs` | Query | ⚠️ Not tested | List enrichment jobs |
| `enrichment.getJob` | Query | ⚠️ Not tested | Get job by ID |

---

**Last Updated:** December 13, 2025  
**Router File:** `server/routers/audiencelab.ts`  
**Client File:** `client/src/lib/trpc.ts`
