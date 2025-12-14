# Complete AudienceLab API Verification

**Date:** December 14, 2025  
**Purpose:** Exhaustive verification of all API endpoints against official documentation  
**Source:** https://audiencelab.mintlify.app/api-reference  
**Status:** 🔄 In Progress

---

## Verification Summary

| Endpoint | Method | Status | Issues Found |
|----------|--------|--------|--------------|
| /audiences | GET | ✅ VERIFIED | None |
| /audiences | POST | 🔄 Pending | - |
| /audiences/custom | POST | 🔄 Pending | - |
| /audiences/:id | GET | 🔄 Pending | - |
| /audiences/:id | DELETE | 🔄 Pending | - |
| /audiences/attributes | GET | 🔄 Pending | - |
| /enrich | POST | 🔄 Pending | - |
| /enrichments | GET | 🔄 Pending | - |
| /enrichments | POST | ✅ VERIFIED | Fixed: PHONE_NUMBER → PHONE |
| /pixels | GET | 🔄 Pending | - |
| /pixels | POST | 🔄 Pending | - |
| /pixels/:id | GET | 🔄 Pending | - |
| /pixels/:id | DELETE | 🔄 Pending | - |

---

## 1. GET /audiences

**Status:** ✅ VERIFIED  
**Documentation:** https://audiencelab.mintlify.app/api-reference/audience/get-audiences

### Request

**Headers:**
- `X-Api-Key` (string, required) - API authentication key

**Query Parameters:**
- `page` (integer, optional, default: 1) - Page number (1-indexed), min: 1
- `page_size` (integer, optional, default: 100) - Items per page, range: 1-1000

**Example Request:**
```bash
curl --request GET \
  --url https://api.audiencelab.io/audiences \
  --header 'X-Api-Key: <api-key>'
```

### Response (200 OK)

**Fields:**
- `total_records` (integer) - Total number of audiences
- `page_size` (integer) - Number of items per page
- `page` (integer) - Current page number
- `total_pages` (integer) - Total number of pages
- `data` (array of objects) - Array of audience objects

**Audience Object Fields:**
- `id` (string) - Unique audience ID (UUID format)
- `name` (string) - Audience name
- `next_scheduled_refresh` (string | null) - Next refresh timestamp
- `scheduled_refresh` (boolean) - Whether scheduled refresh is enabled
- `refresh_interval` (string | null) - Refresh interval
- `webhook_url` (string | null) - Webhook URL for notifications

**Example Response:**
```json
{
  "total_records": 50,
  "page_size": 100,
  "page": 1,
  "total_pages": 1,
  "data": [
    {
      "id": "aa1a0c14-2dff-4389-b025-06a308df9ee9",
      "name": "My Test Audience",
      "next_scheduled_refresh": null,
      "scheduled_refresh": false,
      "refresh_interval": null,
      "webhook_url": null
    }
  ]
}
```

### Code Verification

**Files to Check:**
- ✅ `client/src/pages/AudiencesPage.tsx` - Uses `trpc.audienceLabAPI.audiences.list.useQuery()`
- ✅ `server/routers/audiencelab.ts` - Has `list` procedure
- ✅ `shared/audiencelab-types.ts` - Has `Audience` interface

**TypeScript Interface (Expected):**
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
  scheduled_refresh: boolean;
  refresh_interval: string | null;
  webhook_url: string | null;
}
```

**Status:** ✅ Need to verify TypeScript types match exactly

---

## 2. POST /audiences (Create Audience)

**Status:** 🔄 VERIFYING...



### Request

**Headers:**
- `X-Api-Key` (string, required) - API authentication key
- `Content-Type: application/json` (required)

**Body Parameters:**
- `name` (string, required) - Audience name
- `filters` (object, required) - Filter criteria object
- `segment` (string[], optional) - Array of segment IDs
- `days_back` (integer, optional) - Number of days to look back

**Example Request:**
```json
{
  "name": "My Test Audience",
  "filters": {
    "age": {
      "minAge": 25,
      "maxAge": 45
    },
    "city": [
      "New York",
      "San Francisco"
    ],
    "businessProfile": {
      "industry": [
        "Software Development"
      ]
    }
  },
  "segment": ["100073"],
  "days_back": 7
}
```

### Response (200 OK)

**Fields:**
- `audienceId` (string) - Unique ID of created audience (UUID format)

**Example Response:**
```json
{
  "audienceId": "812b78c3-83e6-4d6a-8245-def0dde26223"
}
```

### Code Verification

**Files to Check:**
- ⏳ `client/src/components/audiences/CreateAudienceDialog.tsx`
- ⏳ `server/routers/audiencelab.ts` - `create` procedure
- ⏳ `shared/audiencelab-types.ts` - `CreateAudienceRequest` interface

**TypeScript Interface (Expected):**
```typescript
interface CreateAudienceRequest {
  name: string;
  filters: AudienceFilters;
  segment?: string[];
  days_back?: number;
}

interface CreateAudienceResponse {
  audienceId: string;
}
```

**Status:** ⏳ Need to verify against code

---

## 3. POST /audiences/custom (Create Custom Audience)

**Status:** 🔄 VERIFYING...

