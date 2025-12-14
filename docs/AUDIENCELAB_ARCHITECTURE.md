# AudienceLab API Architecture

**Last Updated:** December 14, 2025  
**Status:** Verified through testing and network traffic analysis

---

## Overview

AudienceLab provides two distinct API layers for different purposes. Understanding when to use each is critical for building robust integrations.

---

## The Two API Layers

### 1. Audiences API (Management Layer)

**Base URL:** `https://api.audiencelab.io`

**Purpose:** Audience lifecycle management and configuration

**Capabilities:**
- Create new audiences
- Delete audiences
- List all audiences
- Configure refresh settings
- Set webhook URLs

**Limitations:**
- Cannot retrieve audience size
- Cannot access actual audience records
- Cannot export data
- Limited metadata (only 6 fields returned)

**Supported Endpoints:**
- `GET /audiences` - List all audiences
- `POST /audiences` - Create new audience
- `DELETE /audiences/:id` - Delete audience
- `GET /audiences/:id` - Returns `{status: "no data"}` (not useful)

---

### 2. Studio API (Data Access Layer)

**Base URL:** `https://api.audiencelab.io`

**Purpose:** Query, view, and export audience data

**Capabilities:**
- Access actual audience records
- Get audience size (via segment metadata)
- Export data in multiple formats
- Filter and segment data
- Query with DuckDB on Google Cloud Storage

**Limitations:**
- Cannot create new audiences
- Cannot modify audience settings
- Requires creating a segment first
- Read-only access

**Supported Endpoints:**
- `GET /segments/:id` - Get segment data with pagination

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER APPLICATION                          │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼                                 ▼
┌──────────────────────┐          ┌──────────────────────┐
│   Audiences API      │          │    Studio API        │
│  (Management Layer)  │          │  (Data Access Layer) │
└──────────────────────┘          └──────────────────────┘
          │                                 │
          ▼                                 ▼
┌──────────────────────┐          ┌──────────────────────┐
│  Audience Metadata   │          │   Segment Data       │
│  - ID                │          │   - All 74 fields    │
│  - Name              │          │   - Pagination       │
│  - Refresh settings  │          │   - Total count      │
│  - Webhook URL       │          │   - Export formats   │
└──────────────────────┘          └──────────────────────┘
          │                                 │
          └────────────────┬────────────────┘
                           ▼
                  ┌─────────────────┐
                  │  Google Cloud   │
                  │  Storage Bucket │
                  │  (DuckDB)       │
                  └─────────────────┘
```

---

## Hybrid Integration Pattern

To build a complete AudienceLab integration, you **must** use both APIs:

### Use Audiences API For:

1. **Creating Audiences**
   ```typescript
   POST /audiences
   {
     "name": "High-Value Customers",
     "filters": {
       "city": ["New York", "San Francisco"]
     }
   }
   ```

2. **Listing Audiences**
   ```typescript
   GET /audiences
   // Returns: id, name, scheduled_refresh, refresh_interval, etc.
   ```

3. **Deleting Audiences**
   ```typescript
   DELETE /audiences/:id
   ```

### Use Studio API For:

1. **Viewing Audience Data**
   ```typescript
   GET /segments/:segment_id?page=1&page_size=50
   // Returns: actual records with all 74 enriched fields
   ```

2. **Getting Audience Size**
   ```typescript
   GET /segments/:segment_id
   // Response includes: total_records, total_pages
   ```

3. **Exporting Data**
   ```typescript
   GET /segments/:segment_id?page=1&page_size=10000
   // Paginate through all records for export
   ```

---

## Studio Workflow

Studio is accessed through the AudienceLab dashboard at `https://build.audiencelab.io/home/:teamSlug/studio`

### 6-Step Process:

1. **Choose Dataset** - Select an existing audience
2. **Build Filters** - Apply optional filters (city, industry, etc.)
3. **Choose Fields** - Select which of the 74 fields to include
4. **Create Segment** - Save the configuration
5. **View Table** - Preview the data
6. **Export** - Download or access via API

### Creating a Segment:

Segments are created through the Studio UI. Once saved, Studio generates a **persistent API endpoint**:

```
https://api.audiencelab.io/segments/{segment_id}?page=1&page_size=50
```

This endpoint:
- Stays available permanently
- Always returns up-to-date data
- Supports pagination
- Requires `X-API-KEY` header

---

## API Response Formats

### Audiences API Response

```json
{
  "audiences": [
    {
      "id": "aud_123",
      "name": "High-Value Customers",
      "scheduled_refresh": false,
      "refresh_interval": null,
      "next_scheduled_refresh": null,
      "webhook_url": null
    }
  ]
}
```

**Note:** No `audience_size`, `created_at`, `last_refreshed`, or `refresh_count` fields.

### Studio API Response

```json
{
  "data": [
    {
      "UUID": "b90a22fe-9627-55a6-a4d3-b5ba044c28a8",
      "FIRST_NAME": "Wilson",
      "LAST_NAME": "Am",
      "BUSINESS_EMAIL": "",
      "PERSONAL_EMAIL": "gerscyfreshyauto@gmail.com",
      "COMPANY_NAME": "",
      "JOB_TITLE": "",
      ... // 67 more fields
    }
  ],
  "segment_id": "04111f25-a796-494d-a8e0-a2dd541a5768",
  "segment_name": "[MANUS TEST] Studio API Investigation",
  "total_records": 500000,
  "total_pages": 250000,
  "page": 1,
  "page_size": 2,
  "has_more": true
}
```

---

## Authentication

Both APIs use the same authentication method:

```
Header: X-API-KEY: your_api_key
```

API keys are managed at `https://build.audiencelab.io/home/:teamSlug/api-keys`

---

## Key Limitations

### Audiences API Cannot:
- ❌ Return audience size
- ❌ Access actual records
- ❌ Export data
- ❌ Show enriched fields

### Studio API Cannot:
- ❌ Create audiences
- ❌ Delete audiences
- ❌ Modify settings
- ❌ Configure webhooks

### Why Both Are Required:

Audiences API provides **management** capabilities, while Studio API provides **data access**. Neither is complete without the other.

---

## Recommended Integration Architecture

```typescript
// 1. Create audience (Audiences API)
const audience = await audienceLabClient.createAudience({
  name: "New Customers 2025",
  filters: { city: ["Boston"] }
});

// 2. Create Studio segment (via UI or future API)
// Currently: User must create segment manually in Studio UI
// Future: Automated segment creation via API

// 3. Access data (Studio API)
const segmentData = await fetch(
  `https://api.audiencelab.io/segments/${segmentId}?page=1&page_size=50`,
  {
    headers: { 'X-API-KEY': apiKey }
  }
);

// 4. Get audience size
const { total_records } = await segmentData.json();
console.log(`Audience size: ${total_records}`);
```

---

## Common Mistakes

### ❌ Trying to get audience size from Audiences API
```typescript
// This won't work - endpoint returns {status: "no data"}
const audience = await GET /audiences/:id
console.log(audience.size); // undefined
```

### ✅ Correct approach
```typescript
// Create segment first, then access via Studio API
const segment = await GET /segments/:segment_id
console.log(segment.total_records); // 500000
```

---

## Future Improvements

AudienceLab may add these features in the future:

1. **Automated segment creation API** - Create segments programmatically without UI
2. **Audience size in Audiences API** - Return `total_records` in GET /audiences response
3. **Direct data access** - Access audience records without creating segments first
4. **Webhook support for data changes** - Get notified when audience data updates

---

## Summary

| Feature | Audiences API | Studio API |
|---------|--------------|------------|
| **Create audiences** | ✅ | ❌ |
| **Delete audiences** | ✅ | ❌ |
| **List audiences** | ✅ | ❌ |
| **Get audience size** | ❌ | ✅ |
| **View records** | ❌ | ✅ |
| **Export data** | ❌ | ✅ |
| **Filter/segment** | ❌ | ✅ |
| **Configure settings** | ✅ | ❌ |

**Integration Strategy:** Use Audiences API for management, Studio API for data access. Both are required for a complete solution.
