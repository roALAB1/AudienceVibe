# AudienceLab API Reference (VALIDATED)

**Last Updated:** December 14, 2025  
**Base URL:** `https://api.audiencelab.io`  
**Authentication:** API Key in `X-API-Key` header  
**Validation Status:** All endpoints and schemas validated through real API testing

> ⚠️ **IMPORTANT**: This document contains ONLY validated API information confirmed through actual testing. No assumptions or unverified documentation included.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Audiences API](#audiences-api)
3. [Pixels API](#pixels-api)
4. [Enrichment API](#enrichment-api)
5. [Error Handling](#error-handling)

---

## Authentication

All API requests require authentication using an API key.

### Request Headers

```http
X-API-Key: YOUR_API_KEY
Content-Type: application/json
Accept: application/json
```

### Example

```bash
curl -X GET https://api.audiencelab.io/audiences \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

---

## Audiences API

### List Audiences

**Endpoint:** `GET /audiences`  
**Status:** ✅ **VALIDATED** (December 13, 2025)

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `page_size` | integer | No | 20 | Items per page |

#### Response

```typescript
interface AudiencesListResponse {
  total_records: number;
  page_size: number;
  page: number;
  total_pages: number;
  data: Audience[];
}

interface Audience {
  id: string;
  name: string;
  next_scheduled_refresh: string | null;
  refresh_interval: string | null;
  scheduled_refresh: boolean;
  webhook_url: string | null;
}
```

---

### Create Audience

**Endpoint:** `POST /audiences`  
**Status:** ✅ **VALIDATED** (December 14, 2025 - 28 filter tests passed)

Creates a new audience with specified filters.

#### Request Body

```typescript
interface CreateAudienceRequest {
  name: string;                    // REQUIRED
  filters: {
    // Location Filters
    city?: string[];               // e.g., ["San Francisco", "New York"]
    state?: string[];              // e.g., ["California", "Texas"]
    zip?: string[];                // e.g., ["94102", "10001"]
    
    // Age Filters
    age?: {
      minAge?: number;             // e.g., 25
      maxAge?: number;             // e.g., 45
    };
    
    // Gender
    gender?: string[];             // e.g., ["Male", "Female"]
    
    // Business Profile (all fields use camelCase)
    businessProfile?: {
      jobTitle?: string[];         // e.g., ["Software Engineer"]
      seniority?: string[];        // e.g., ["Senior", "Director"]
      industry?: string[];         // e.g., ["Technology", "Healthcare"]
      department?: string[];       // e.g., ["Engineering", "Marketing"]
      companyName?: string[];      // e.g., ["Google", "Microsoft"]
      companyDomain?: string[];    // e.g., ["google.com"]
      companyDescription?: string[]; // e.g., ["SaaS platform"]
      employeeCount?: string[];    // e.g., ["1-10", "51-200"]
      companyRevenue?: string[];   // e.g., ["$1M-$10M"]
      sic?: string[];              // Standard Industrial Classification
      companyNaics?: string[];     // NAICS codes
    };
    
    // Profile Filters
    profile?: {
      incomeRange?: string[];      // e.g., ["$50K-$75K"]
      homeowner?: string[];        // e.g., ["Owner", "Renter"]
      married?: string[];          // e.g., ["Yes", "No"]
      netWorth?: string[];         // e.g., ["$100K-$250K"]
      children?: string[];         // e.g., ["0", "1", "2", "3+"]
    };
    
    // Attributes (comprehensive demographic data)
    attributes?: {
      credit_rating?: string[];
      language_code?: string[];
      occupation_group?: string[];
      occupation_type?: string[];
      home_year_built?: { min?: number; max?: number };
      single_parent?: string[];
      cra_code?: string[];
      dwelling_type?: string[];
      credit_range_new_credit?: string[];
      ethnic_code?: string[];
      marital_status?: string[];
      net_worth?: string[];
      education?: string[];
      credit_card_user?: string[];
      investment?: string[];
      smoker?: string[];
      home_purchase_price?: { min?: number; max?: number };
      home_purchase_year?: { min?: number; max?: number };
      estimated_home_value?: string[];
      mortgage_amount?: { min?: number; max?: number };
      generations_in_household?: string[];
    };
    
    // Advanced Filters
    notNulls?: string[];           // Fields that must not be null
    nullOnly?: string[];           // Fields that must be null
  };
  segment?: string[];              // Optional segment IDs
  days_back?: number;              // Lookback period (default: 30)
}
```

#### Response

```typescript
interface CreateAudienceResponse {
  audienceId: string;              // UUID of created audience
}
```

#### Example Request

```json
{
  "name": "Tech Professionals in SF",
  "filters": {
    "city": ["San Francisco"],
    "age": {
      "minAge": 25,
      "maxAge": 45
    },
    "businessProfile": {
      "jobTitle": ["Software Engineer", "Product Manager"],
      "seniority": ["Senior", "Director"],
      "industry": ["Technology"]
    },
    "profile": {
      "incomeRange": ["$100K-$150K"]
    }
  },
  "days_back": 30
}
```

#### Example Response

```json
{
  "audienceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### Create Custom Audience

**Endpoint:** `POST /audiences/custom`  
**Status:** ✅ **VALIDATED** (December 13, 2025)

Creates an audience using natural language description.

#### Request Body

```typescript
interface CreateCustomAudienceRequest {
  topic: string;                   // REQUIRED - Interest topic
  description: string;             // REQUIRED - Description of target users
}
```

#### Response

```typescript
interface CreateCustomAudienceResponse {
  status: string;                  // "processing"
}
```

#### Example

```json
{
  "topic": "Artificial Intelligence",
  "description": "Software engineers and data scientists interested in AI and machine learning"
}
```

---

### Get Audience

**Endpoint:** `GET /audiences/{id}`  
**Status:** ✅ **VALIDATED** (December 13, 2025)

#### Response

```typescript
interface Audience {
  id: string;
  name: string;
  next_scheduled_refresh: string | null;
  refresh_interval: string | null;
  scheduled_refresh: boolean;
  webhook_url: string | null;
}
```

---

## Pixels API

### List Pixels

**Endpoint:** `GET /pixels`  
**Status:** ✅ **VALIDATED** (December 13, 2025)

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `page_size` | integer | No | 20 | Items per page |

#### Response

```typescript
interface PixelsListResponse {
  total_records: number;
  page_size: number;
  page: number;
  total_pages: number;
  data: Pixel[];
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

---

### Create Pixel

**Endpoint:** `POST /pixels`  
**Status:** ✅ **VALIDATED** (December 13, 2025)

#### Request Body

```typescript
interface CreatePixelRequest {
  website_name: string;            // REQUIRED
  website_url: string;             // REQUIRED
  webhook_url?: string;            // Optional
}
```

#### Response

```typescript
interface CreatePixelResponse {
  id: string;
  install_url: string;
  website_name: string;
  website_url: string;
  webhook_url: string | null;
  last_sync: string;
}
```

---

## Enrichment API

### List Enrichment Jobs

**Endpoint:** `GET /enrich/jobs`  
**Status:** ✅ **VALIDATED** (December 13, 2025)

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `page_size` | integer | No | 20 | Items per page |

#### Response

```typescript
interface EnrichmentJobsListResponse {
  total_records: number;
  page_size: number;
  page: number;
  total_pages: number;
  data: EnrichmentJob[];
}

interface EnrichmentJob {
  id: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  total_records: number;
  processed_records: number;
  failed_records: number;
}
```

---

### Create Enrichment Job

**Endpoint:** `POST /enrich/jobs`  
**Status:** ✅ **VALIDATED** (December 13, 2025)

#### Request Body

```typescript
interface CreateEnrichmentJobRequest {
  audience_id: string;             // REQUIRED
  fields?: string[];               // Optional fields to enrich
}
```

#### Response

```typescript
interface EnrichmentJob {
  id: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  total_records: number;
  processed_records: number;
  failed_records: number;
}
```

---

### Get Enrichment Job

**Endpoint:** `GET /enrich/jobs/{id}`  
**Status:** ✅ **VALIDATED** (December 13, 2025)

#### Response

```typescript
interface EnrichmentJob {
  id: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  total_records: number;
  processed_records: number;
  failed_records: number;
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters or body |
| 401 | Unauthorized | Missing or invalid API key |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format

```typescript
interface APIError {
  error: string;                   // Error message
  status: number;                  // HTTP status code
}
```

### Example Error Response

```json
{
  "error": "Bad Request",
  "status": 400
}
```

---

## Validation Notes

### Filter Field Naming Convention
- **Location, Age, Gender:** Top-level fields
- **Business:** Nested under `businessProfile` with camelCase
- **Financial/Family/Housing:** Nested under `profile` with camelCase
- **Demographics:** Nested under `attributes` with snake_case

### Tested Filter Combinations
- ✅ Single category filters (28/28 tests passed)
- ✅ Multi-category combined filters
- ✅ Age range filters
- ✅ Array-based filters (cities, industries, etc.)
- ✅ Range-based filters (income, home value, etc.)

### Known Limitations
- Some complex multi-category combinations may return 400
- Test filter combinations before production use
- Maximum of 5,000,000 records per audience

---

## References

- Validation Tests: `/tests/api-filter-discovery.test.ts`
- Filter Schema Documentation: `/docs/VALIDATED_FILTER_SCHEMA.md`
- Type Definitions: `/shared/audiencelab-types.ts`
- API Client: `/shared/audiencelab-client.ts`
