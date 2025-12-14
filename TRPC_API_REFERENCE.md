# tRPC API Reference - AudienceLab

## Available Procedures

All procedures are accessed via `trpc.audienceLabAPI.*`

---

## Audiences

### `audiences.list`
**Type**: Query  
**Input**:
```typescript
{
  page: number (min: 1, default: 1)
  pageSize: number (min: 1, max: 100, default: 20)
}
```
**Returns**: Paginated list of audiences

### `audiences.get`
**Type**: Query  
**Input**:
```typescript
{
  id: string
}
```
**Returns**: Single audience details

### `audiences.create`
**Type**: Mutation  
**Input**:
```typescript
{
  name: string (required)
  filters: {
    age?: {
      minAge?: number
      maxAge?: number
    }
    city?: string[]
    businessProfile?: {
      industry?: string[]
    }
  }
  segment?: string[]
  days_back?: number
}
```
**Returns**: Created audience

### `audiences.delete`
**Type**: Mutation  
**Input**:
```typescript
{
  id: string
}
```
**Returns**: `{ success: true }`

### `audiences.getAttributes`
**Type**: Query  
**Input**: None  
**Returns**: List of 84 available audience attributes

---

## Enrichments

### `enrichment.getJobs`
**Type**: Query  
**Input**:
```typescript
{
  page: number (min: 1, default: 1)
  pageSize: number (min: 1, max: 100, default: 20)
}
```
**Returns**: Paginated list of enrichment jobs

### `enrichment.getJob`
**Type**: Query  
**Input**:
```typescript
{
  id: string
}
```
**Returns**: Single enrichment job details

### `enrichment.createJob`
**Type**: Mutation  
**Input**:
```typescript
{
  contacts: Array<{
    email?: string
    personal_email?: string
    business_email?: string
    linkedin_url?: string
    first_name?: string
    last_name?: string
    company_name?: string
    company_domain?: string
    phone?: string
    personal_address?: string
    personal_city?: string
    personal_state?: string
    personal_zip?: string
    sha256_personal_email?: string
    up_id?: string
  }>
  fields?: string[]
}
```
**Returns**: Created enrichment job

### `enrichment.enrichContact`
**Type**: Mutation  
**Input**: Single contact object (same fields as above)  
**Returns**: Enriched contact data

---

## Segments

### `segments.getData`
**Type**: Query  
**Input**:
```typescript
{
  segmentId: string
  page: number (min: 1, default: 1)
  pageSize: number (min: 1, max: 100, default: 50)
}
```
**Returns**: Paginated segment data

---

## Pixels

### `pixels.list`
**Type**: Query  
**Input**: None  
**Returns**: List of all pixels

### `pixels.get`
**Type**: Query  
**Input**:
```typescript
{
  id: string
}
```
**Returns**: Single pixel details

### `pixels.create`
**Type**: Mutation  
**Input**:
```typescript
{
  website_name: string (required)
  website_url: string (required, valid URL)
  webhook_url?: string (optional, valid URL)
}
```
**Returns**: Created pixel

### `pixels.delete`
**Type**: Mutation  
**Input**:
```typescript
{
  id: string
}
```
**Returns**: `{ success: true }`

---

## Usage Examples

### Fetch Audiences
```typescript
const { data, isLoading, error } = trpc.audienceLabAPI.audiences.list.useQuery({
  page: 1,
  pageSize: 20
});
```

### Fetch Enrichment Jobs
```typescript
const { data, isLoading, error } = trpc.audienceLabAPI.enrichment.getJobs.useQuery({
  page: 1,
  pageSize: 20
});
```

### Create Audience
```typescript
const createMutation = trpc.audienceLabAPI.audiences.create.useMutation({
  onSuccess: () => {
    toast.success("Audience created!");
    refetch();
  }
});

createMutation.mutate({
  name: "Tech Professionals",
  filters: {
    businessProfile: {
      industry: ["Technology", "Software"]
    }
  }
});
```

### Delete Enrichment Job
```typescript
const deleteMutation = trpc.audienceLabAPI.enrichment.deleteJob.useMutation({
  onSuccess: () => {
    toast.success("Job deleted!");
    refetch();
  }
});

deleteMutation.mutate({ id: "job-123" });
```

---

## Error Handling

All procedures throw `TRPCError` with appropriate codes:
- `NOT_FOUND`: Resource doesn't exist (404)
- `INTERNAL_SERVER_ERROR`: API error or configuration issue

Handle errors in mutations:
```typescript
const mutation = trpc.audienceLabAPI.audiences.create.useMutation({
  onError: (error) => {
    toast.error(`Failed: ${error.message}`);
  }
});
```

---

## Environment Variables

**Required**: `AUDIENCELAB_API_KEY`

The API key is automatically injected server-side and never exposed to the client.
