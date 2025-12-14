# AudienceLab API Verification Matrix

**Date:** December 14, 2025  
**Purpose:** Comprehensive comparison of API documentation vs implemented code  
**Status:** 🔄 In Progress

---

## Verification Matrix

| API Endpoint | Method | Docs Exist | Code Exists | Field Names Match | Status |
|--------------|--------|------------|-------------|-------------------|--------|
| `/audiences` | GET | ✅ | ✅ | ⏳ | Verifying |
| `/audiences` | POST | ✅ | ✅ | ⏳ | Verifying |
| `/audiences/custom` | POST | ✅ | ❌ | N/A | **MISSING** |
| `/audiences/:id` | GET | ✅ | ✅ | ⏳ | Verifying |
| `/audiences/:id` | DELETE | ✅ | ✅ | ⏳ | Verifying |
| `/audiences/attributes` | GET | ✅ | ✅ | ⏳ | Verifying |
| `/enrich` | POST | ✅ | ✅ | ⏳ | Verifying |
| `/enrichments` | GET | ✅ | ✅ | ⏳ | Verifying |
| `/enrichments` | POST | ✅ | ✅ | ✅ | **VERIFIED** |
| `/enrichments/:id` | GET | ✅ | ✅ | ⏳ | Verifying |
| `/pixels` | GET | ✅ | ✅ | ⏳ | Verifying |
| `/pixels` | POST | ✅ | ✅ | ⏳ | Verifying |
| `/pixels/:id` | GET | ✅ | ✅ | ⏳ | Verifying |
| `/pixels/:id` | DELETE | ✅ | ✅ | ⏳ | Verifying |
| `/segments/:id` | GET | ❓ | ✅ | ⏳ | **UNDOCUMENTED** |

---

## Issues Found

### 1. **MISSING: POST /audiences/custom**
- **Documentation:** https://audiencelab.mintlify.app/api-reference/audience/create-custom-audience
- **Code:** Not implemented in `audiencelab-client.ts`
- **Impact:** Cannot create custom audiences
- **Action Required:** Add `createCustomAudience()` method

### 2. **UNDOCUMENTED: GET /segments/:id**
- **Code:** Implemented as `getSegmentData()` in `audiencelab-client.ts`
- **Documentation:** Not found in Mintlify docs
- **Impact:** Unknown if this endpoint exists or if it's deprecated
- **Action Required:** Verify with AudienceLab team or remove if deprecated

### 3. **POTENTIAL ISSUE: POST /enrich**
- **Code:** Implemented as `/enrich/contact`
- **Documentation:** Shows as `/enrich`
- **Impact:** Endpoint path mismatch
- **Action Required:** Verify correct path

---

## Detailed Verification

### ✅ POST /enrichments (Create Enrichment Job)

**Documentation:** https://audiencelab.mintlify.app/api-reference/enrichment/create-enrichment-job

**Request Fields (Docs):**
- `name` (string, required)
- `records` (array, required)
- `operator` (enum: "AND" | "OR", optional, default: "OR")
- `columns` (array of strings, optional)

**Accepted Field Names (16 total):**
- EMAIL, PERSONAL_EMAIL, BUSINESS_EMAIL
- FIRST_NAME, LAST_NAME
- PHONE (NOT PHONE_NUMBER) ✅ FIXED
- PERSONAL_ADDRESS, PERSONAL_CITY, PERSONAL_STATE, PERSONAL_ZIP
- COMPANY_NAME, COMPANY_DOMAIN, COMPANY_INDUSTRY
- LINKEDIN_URL, SHA256_PERSONAL_EMAIL, UP_ID

**Code Implementation:**
```typescript
// audiencelab-client.ts line 223-224
async createEnrichmentJob(data: CreateEnrichmentJobRequest): Promise<EnrichmentJob> {
  return this.request<EnrichmentJob>('POST', '/enrichments', { body: data });
}
```

**TypeScript Types:**
```typescript
// audiencelab-types.ts lines 197-206
interface CreateEnrichmentJobRequest {
  name: string;
  records: EnrichmentRecord[];
  operator?: 'AND' | 'OR';
  columns?: string[];
}

// audiencelab-types.ts lines 211-228
interface EnrichmentRecord {
  email?: string;
  personal_email?: string;
  business_email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;  // ✅ CORRECT (was phone_number, now fixed)
  personal_address?: string;
  personal_city?: string;
  personal_state?: string;
  personal_zip?: string;
  company_name?: string;
  company_domain?: string;
  company_industry?: string;
  sha256_personal_email?: string;
  linkedin_url?: string;
  up_id?: string;
}
```

**Field Mapping:**
```typescript
// client/src/lib/fieldMapping.ts lines 4-19
export const AVAILABLE_FIELDS = [
  { value: 'EMAIL', label: 'Email', category: 'Personal' },
  { value: 'PERSONAL_EMAIL', label: 'Personal Email', category: 'Personal' },
  { value: 'BUSINESS_EMAIL', label: 'Business Email', category: 'Business' },
  { value: 'FIRST_NAME', label: 'First Name', category: 'Personal' },
  { value: 'LAST_NAME', label: 'Last Name', category: 'Personal' },
  { value: 'PHONE', label: 'Phone', category: 'Personal' },  // ✅ CORRECT
  { value: 'PERSONAL_ADDRESS', label: 'Personal Address', category: 'Personal' },
  { value: 'PERSONAL_CITY', label: 'Personal City', category: 'Personal' },
  { value: 'PERSONAL_STATE', label: 'Personal State', category: 'Personal' },
  { value: 'PERSONAL_ZIP', label: 'Personal Zip', category: 'Personal' },
  { value: 'COMPANY_NAME', label: 'Company Name', category: 'Business' },
  { value: 'COMPANY_DOMAIN', label: 'Company Domain', category: 'Business' },
  { value: 'COMPANY_INDUSTRY', label: 'Company Industry', category: 'Business' },
  { value: 'LINKEDIN_URL', label: 'LinkedIn URL', category: 'Business' },
  { value: 'SHA256_PERSONAL_EMAIL', label: 'SHA256 Personal Email', category: 'Personal' },
  { value: 'UP_ID', label: 'UP ID', category: 'System' },
] as const;
```

**Status:** ✅ **100% VERIFIED AND CORRECT**

---

### ⏳ GET /audiences

**Documentation:** https://audiencelab.mintlify.app/api-reference/audience/get-audiences

**Request Parameters (Docs):**
- `page` (integer, optional, default: 1, min: 1)
- `page_size` (integer, optional, default: 100, range: 1-1000)

**Response Fields (Docs):**
- `total_records` (integer)
- `page_size` (integer)
- `page` (integer)
- `total_pages` (integer)
- `data` (array of Audience objects)

**Audience Object Fields (Docs):**
- `id` (string, UUID)
- `name` (string)
- `next_scheduled_refresh` (string | null)
- `scheduled_refresh` (boolean)
- `refresh_interval` (string | null)
- `webhook_url` (string | null)

**Code Implementation:**
```typescript
// audiencelab-client.ts lines 169-173
async getAudiences(page = 1, pageSize = 50): Promise<AudiencesListResponse> {
  return this.request<AudiencesListResponse>('GET', '/audiences', {
    params: { page, page_size: pageSize },
  });
}
```

**⚠️ ISSUE FOUND:** Default `pageSize` is 50 in code but 100 in docs

**TypeScript Types to Verify:**
```typescript
// Need to check audiencelab-types.ts for:
// - AudiencesListResponse interface
// - Audience interface
```

**Status:** ⏳ Need to verify TypeScript types

---

### ⏳ POST /audiences (Create Audience)

**Documentation:** https://audiencelab.mintlify.app/api-reference/audience/create-audience

**Request Fields (Docs):**
- `name` (string, required)
- `filters` (object, required)
- `segment` (string[], optional)
- `days_back` (integer, optional)

**Response Fields (Docs):**
- `audienceId` (string, UUID)

**Code Implementation:**
```typescript
// audiencelab-client.ts lines 184-186
async createAudience(data: CreateAudienceRequest): Promise<{ audienceId: string }> {
  return this.request<{ audienceId: string }>('POST', '/audiences', { body: data });
}
```

**TypeScript Types to Verify:**
```typescript
// Need to check audiencelab-types.ts for:
// - CreateAudienceRequest interface
// - Filters structure
```

**Status:** ⏳ Need to verify TypeScript types and filters structure

---

## Next Steps

1. ✅ Verify all TypeScript interfaces match API docs exactly
2. ✅ Fix default pageSize (50 → 100) in getAudiences
3. ✅ Add missing createCustomAudience method
4. ✅ Verify /enrich vs /enrich/contact endpoint path
5. ✅ Check if /segments/:id is a valid endpoint
6. ✅ Review all remaining endpoints systematically

