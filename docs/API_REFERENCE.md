# AudienceLab API Reference

**Last Updated:** December 13, 2025  
**Base URL:** `https://api.audiencelab.io`  
**Authentication:** Bearer token in `Authorization` header

---

## Table of Contents

1. [Authentication](#authentication)
2. [Audiences API](#audiences-api)
3. [Pixels API](#pixels-api)
4. [Segments API](#segments-api)
5. [Enrichment API](#enrichment-api)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

---

## Authentication

All API requests require authentication using a Bearer token.

### Request Headers

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Example

```bash
curl -X GET https://api.audiencelab.io/audiences \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

---

## Audiences API

Manage audience segments with filters and webhook integrations.

### List Audiences

**Endpoint:** `GET /audiences`  
**Status:** ✅ **VALIDATED** (December 13, 2025)  
**Test Result:** Successfully fetched 399 audiences

#### Request

```http
GET /audiences?page=1&page_size=20
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `page_size` | integer | No | 20 | Items per page (max 100) |

#### Response

```json
{
  "data": [
    {
      "id": "aud_abc123",
      "name": "High-Value Customers",
      "next_scheduled_refresh": "2025-12-14T10:00:00Z",
      "refresh_interval": 3600,
      "scheduled_refresh": true,
      "webhook_url": "https://example.com/webhook"
    }
  ],
  "total": 399
}
```

#### Response Schema

```typescript
interface AudiencesListResponse {
  data: Audience[];
  total: number;
}

interface Audience {
  id: string;                          // Unique audience ID
  name: string;                        // Audience name
  next_scheduled_refresh: string | null; // ISO 8601 datetime
  refresh_interval: number | null;     // Seconds between refreshes
  scheduled_refresh: boolean;          // Auto-refresh enabled
  webhook_url: string | null;          // Webhook for updates
}
```

---

### Get Audience by ID

**Endpoint:** `GET /audiences/{id}`  
**Status:** ⚠️ **NOT TESTED** (requires valid audience ID)

#### Request

```http
GET /audiences/aud_abc123
```

#### Response

```json
{
  "id": "aud_abc123",
  "name": "High-Value Customers",
  "next_scheduled_refresh": "2025-12-14T10:00:00Z",
  "refresh_interval": 3600,
  "scheduled_refresh": true,
  "webhook_url": "https://example.com/webhook"
}
```

---

### Create Audience

**Endpoint:** `POST /audiences`  
**Status:** ⚠️ **NOT TESTED**

#### Request

```http
POST /audiences
Content-Type: application/json

{
  "name": "Software Engineers in AI",
  "description": "Engineers interested in AI/ML",
  "filters": [
    {
      "field": "JOB_TITLE",
      "operator": "contains",
      "value": "Engineer"
    },
    {
      "field": "COMPANY_INDUSTRY",
      "operator": "in",
      "value": ["Technology", "Software"]
    }
  ],
  "webhook_url": "https://example.com/webhook"
}
```

#### Request Schema

```typescript
interface CreateAudienceRequest {
  name: string;                    // Required: Audience name
  description?: string;            // Optional: Description
  filters: AudienceFilter[];       // Required: Filter criteria
  webhook_url?: string;            // Optional: Webhook URL
}

interface AudienceFilter {
  field: string;                   // Field name (e.g., "JOB_TITLE")
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | number | string[];
}
```

#### Response

```json
{
  "id": "aud_new123",
  "name": "Software Engineers in AI",
  "next_scheduled_refresh": null,
  "refresh_interval": null,
  "scheduled_refresh": false,
  "webhook_url": "https://example.com/webhook"
}
```

---

### Delete Audience

**Endpoint:** `DELETE /audiences/{id}`  
**Status:** ⚠️ **NOT TESTED**

#### Request

```http
DELETE /audiences/aud_abc123
```

#### Response

```json
{
  "success": true
}
```

---

### Get Audience Attributes

**Endpoint:** `GET /audiences/attributes`  
**Status:** ⚠️ **NOT TESTED**

Returns all 84 available fields for filtering.

#### Response

```json
{
  "attributes": [
    {
      "name": "FIRST_NAME",
      "label": "First Name",
      "type": "string",
      "category": "personal"
    },
    {
      "name": "JOB_TITLE",
      "label": "Job Title",
      "type": "string",
      "category": "professional"
    }
  ]
}
```

---

## Pixels API

Manage tracking pixels for website visitor identification.

### List Pixels

**Endpoint:** `GET /pixels`  
**Status:** ✅ **VALIDATED** (December 13, 2025)  
**Test Result:** Successfully fetched 6 pixels

#### Request

```http
GET /pixels
```

#### Response

```json
{
  "data": [
    {
      "id": "96e62502-f16d-43fa-acf7-22ff6e7f686d",
      "install_url": "https://cdn.v3.identitypxl.app/pixels/f36d7d73-3ac5-4a41-a024-39e8fb5df7e7/p.js",
      "last_sync": "2025-12-13T22:05:02+00:00",
      "webhook_url": "https://hook.us1.make.com/webhook123",
      "website_name": "test.com",
      "website_url": "https://test.com"
    }
  ],
  "total": 6
}
```

#### Response Schema

```typescript
interface PixelsListResponse {
  data: Pixel[];
  total: number;
}

interface Pixel {
  id: string;                // Unique pixel ID
  install_url: string;       // JavaScript tracking script URL
  last_sync: string;         // ISO 8601 datetime of last sync
  webhook_url: string | null; // Webhook for visitor events
  website_name: string;      // Website display name
  website_url: string;       // Website URL
}
```

---

### Get Pixel by ID

**Endpoint:** `GET /pixels/{id}`  
**Status:** ⚠️ **NOT TESTED**

#### Request

```http
GET /pixels/96e62502-f16d-43fa-acf7-22ff6e7f686d
```

#### Response

```json
{
  "id": "96e62502-f16d-43fa-acf7-22ff6e7f686d",
  "install_url": "https://cdn.v3.identitypxl.app/pixels/f36d7d73/p.js",
  "last_sync": "2025-12-13T22:05:02+00:00",
  "webhook_url": "https://hook.us1.make.com/webhook123",
  "website_name": "test.com",
  "website_url": "https://test.com"
}
```

---

### Create Pixel

**Endpoint:** `POST /pixels`  
**Status:** ⚠️ **NOT TESTED**

#### Request

```http
POST /pixels
Content-Type: application/json

{
  "name": "My Website",
  "domain": "example.com",
  "webhook_url": "https://example.com/webhook",
  "integrations": {
    "google_analytics": {
      "measurement_id": "G-XXXXXXXXXX"
    },
    "microsoft_clarity": {
      "project_id": "abc123"
    }
  },
  "custom_params": {
    "utm_source": "direct",
    "campaign": "launch"
  }
}
```

#### Request Schema

```typescript
interface CreatePixelRequest {
  name: string;                    // Required: Pixel name
  domain: string;                  // Required: Website domain
  webhook_url?: string;            // Optional: Webhook URL
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

#### Response

```json
{
  "id": "new_pixel_123",
  "install_url": "https://cdn.v3.identitypxl.app/pixels/new_pixel_123/p.js",
  "last_sync": null,
  "webhook_url": "https://example.com/webhook",
  "website_name": "My Website",
  "website_url": "https://example.com"
}
```

---

### Delete Pixel

**Endpoint:** `DELETE /pixels/{id}`  
**Status:** ⚠️ **NOT TESTED**

#### Request

```http
DELETE /pixels/96e62502-f16d-43fa-acf7-22ff6e7f686d
```

#### Response

```json
{
  "success": true
}
```

---

## Segments API

Access segment data from Studio.

### Get Segment Data

**Endpoint:** `GET /segments/{id}`  
**Status:** ⚠️ **NOT TESTED** (requires valid segment ID)

#### Request

```http
GET /segments/seg_abc123?page=1&page_size=50
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `page_size` | integer | No | 50 | Items per page (max 100) |

#### Response

```json
{
  "data": [
    {
      "UUID": "contact_123",
      "FIRST_NAME": "John",
      "LAST_NAME": "Doe",
      "BUSINESS_EMAIL": "john@example.com",
      "JOB_TITLE": "Software Engineer",
      "COMPANY_NAME": "Tech Corp"
    }
  ],
  "total": 1523,
  "page": 1,
  "page_size": 50
}
```

#### Response Schema

```typescript
interface SegmentDataResponse {
  data: EnrichedContact[];  // Array of contacts with 84 possible fields
  total: number;            // Total contacts in segment
  page: number;             // Current page
  page_size: number;        // Items per page
}
```

---

## Enrichment API

Enrich contacts with 84 data fields.

### Enrich Single Contact

**Endpoint:** `POST /enrich/contact`  
**Status:** ❌ **FAILED** (400 Bad Request - "Malformed JSON/Unknown Field")

**Note:** This endpoint needs further investigation. The exact request format is unknown.

#### Suspected Request Format

```http
POST /enrich/contact
Content-Type: application/json

{
  "email": "john@example.com",
  "fields": ["FIRST_NAME", "LAST_NAME", "JOB_TITLE"]
}
```

---

### Create Enrichment Job (Bulk)

**Endpoint:** `POST /enrichment/jobs`  
**Status:** ⚠️ **NOT TESTED**

#### Request

```http
POST /enrichment/jobs
Content-Type: application/json

{
  "contacts": [
    {
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    {
      "business_email": "jane@company.com",
      "company_name": "Tech Corp"
    }
  ],
  "fields": ["JOB_TITLE", "COMPANY_NAME", "LINKEDIN_URL"]
}
```

---

### List Enrichment Jobs

**Endpoint:** `GET /enrichment/jobs`  
**Status:** ⚠️ **NOT TESTED**

#### Request

```http
GET /enrichment/jobs?page=1&page_size=20
```

---

### Get Enrichment Job

**Endpoint:** `GET /enrichment/jobs/{id}`  
**Status:** ⚠️ **NOT TESTED**

#### Request

```http
GET /enrichment/jobs/job_abc123
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Audience not found",
    "details": {}
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Invalid or missing API key |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

**Status:** ⚠️ **NOT DOCUMENTED**

Rate limiting details are not currently known. Monitor response headers for:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

---

## Available Fields (84 Total)

### System (1 field)
- `UUID`

### Personal Information (16 fields)
- `FIRST_NAME`, `MIDDLE_NAME`, `LAST_NAME`, `FULL_NAME`
- `AGE`, `GENDER`, `MARITAL_STATUS`, `EDUCATION_LEVEL`
- `HOUSEHOLD_INCOME`, `NET_WORTH`, `HOME_OWNER_STATUS`, `HOME_VALUE`
- `PERSONAL_ADDRESS`, `PERSONAL_CITY`, `PERSONAL_STATE`, `PERSONAL_ZIP`

### Contact Information (8 fields)
- `PERSONAL_EMAIL`, `BUSINESS_EMAIL`, `PHONE`
- `PERSONAL_MOBILE`, `PERSONAL_LANDLINE`
- `LINKEDIN_URL`, `FACEBOOK_URL`, `TWITTER_URL`

### Professional Information (12 fields)
- `JOB_TITLE`, `JOB_TITLE_ROLE`, `JOB_TITLE_SUB_ROLE`, `JOB_TITLE_LEVELS`
- `JOB_START_DATE`, `JOB_COMPANY_ID`, `JOB_COMPANY_NAME`
- `JOB_COMPANY_WEBSITE`, `JOB_COMPANY_SIZE`, `JOB_COMPANY_FOUNDED`
- `JOB_COMPANY_INDUSTRY`, `JOB_COMPANY_LINKEDIN_URL`

### Company Information (20 fields)
- `COMPANY_NAME`, `COMPANY_LEGAL_NAME`, `COMPANY_DOMAIN`
- `COMPANY_WEBSITE`, `COMPANY_SIZE`, `COMPANY_FOUNDED`
- `COMPANY_INDUSTRY`, `COMPANY_SIC_CODE`, `COMPANY_NAICS_CODE`
- `COMPANY_REVENUE`, `COMPANY_REVENUE_RANGE`, `COMPANY_TYPE`
- `COMPANY_PHONE`, `COMPANY_ADDRESS`, `COMPANY_CITY`
- `COMPANY_STATE`, `COMPANY_ZIP`, `COMPANY_COUNTRY`
- `COMPANY_LINKEDIN_URL`, `COMPANY_DESCRIPTION`

### Social Media (6 fields)
- `LINKEDIN_URL`, `LINKEDIN_USERNAME`, `LINKEDIN_ID`
- `FACEBOOK_URL`, `TWITTER_URL`, `GITHUB_URL`

### Skiptrace (21 fields)
- `RELATIVES`, `ASSOCIATES`, `NEIGHBORS`
- `PREVIOUS_ADDRESSES`, `PREVIOUS_EMPLOYERS`
- `EDUCATION_HISTORY`, `LICENSES`, `BANKRUPTCIES`
- And 13 more...

---

## Notes

### Validated Endpoints ✅
- `GET /audiences` - 399 audiences fetched successfully
- `GET /pixels` - 6 pixels fetched successfully

### Failed Endpoints ❌
- `POST /enrich/contact` - 400 Bad Request (needs investigation)

### Untested Endpoints ⚠️
- All POST/DELETE operations
- `GET /segments/{id}` (needs valid segment ID)
- All enrichment job endpoints

### Schema Accuracy
- **Audiences:** ✅ Validated with real API response
- **Pixels:** ✅ Validated with real API response
- **Segments:** ⚠️ Schema assumed, not validated
- **Enrichment:** ⚠️ Schema assumed, not validated

---

**Last Validation:** December 13, 2025  
**API Version:** v3 (inferred from pixel URLs)  
**Documentation Status:** Partially validated, ongoing testing
