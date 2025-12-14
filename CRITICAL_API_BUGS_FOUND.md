# 🚨 CRITICAL API BUGS FOUND

**Date:** December 14, 2025  
**Severity:** HIGH - These bugs will cause runtime errors and incorrect behavior

---

## Summary

Found **6 critical bugs** in `shared/audiencelab-types.ts` where TypeScript interfaces don't match the official API documentation.

---

## Bug #1: AudiencesListResponse - Missing Pagination Fields

**File:** `shared/audiencelab-types.ts` lines 32-35  
**Severity:** 🔴 CRITICAL - Pagination won't work

**Current (WRONG):**
```typescript
export interface AudiencesListResponse {
  data: Audience[];
  total: number;  // ❌ Wrong field name
}
```

**Correct (from API docs):**
```typescript
export interface AudiencesListResponse {
  total_records: number;  // ✅ Not "total"
  page_size: number;      // ✅ Missing
  page: number;           // ✅ Missing
  total_pages: number;    // ✅ Missing
  data: Audience[];
}
```

**Impact:** 
- Pagination UI will break
- Can't display "Page X of Y"
- Can't show total record count correctly

---

## Bug #2: Audience - Wrong Field Type

**File:** `shared/audiencelab-types.ts` line 23  
**Severity:** 🟡 MEDIUM - Type mismatch

**Current (WRONG):**
```typescript
export interface Audience {
  id: string;
  name: string;
  next_scheduled_refresh: string | null;
  refresh_interval: number | null;  // ❌ Wrong type
  scheduled_refresh: boolean;
  webhook_url: string | null;
}
```

**Correct (from API docs):**
```typescript
export interface Audience {
  id: string;
  name: string;
  next_scheduled_refresh: string | null;
  refresh_interval: string | null;  // ✅ Should be string, not number
  scheduled_refresh: boolean;
  webhook_url: string | null;
}
```

**Impact:**
- TypeScript type errors when handling refresh_interval
- Potential runtime errors if code expects number

---

## Bug #3: CreateAudienceResponse - Completely Wrong Structure

**File:** `shared/audiencelab-types.ts` lines 62-66  
**Severity:** 🔴 CRITICAL - Response parsing will fail

**Current (WRONG):**
```typescript
export interface CreateAudienceResponse {
  id: string;
  name: string;
  created_at: string;
}
```

**Correct (from API docs):**
```typescript
export interface CreateAudienceResponse {
  audienceId: string;  // ✅ Only field in response
}
```

**Impact:**
- Code expecting `id` will get undefined
- Code expecting `name` will get undefined
- Code expecting `created_at` will get undefined
- Audience creation will appear to fail even when it succeeds

---

## Bug #4: Default pageSize Mismatch

**File:** `shared/audiencelab-client.ts` line 169  
**Severity:** 🟡 MEDIUM - Inconsistent with API defaults

**Current (WRONG):**
```typescript
async getAudiences(page = 1, pageSize = 50): Promise<AudiencesListResponse> {
  // Default pageSize is 50
}
```

**Correct (from API docs):**
```typescript
async getAudiences(page = 1, pageSize = 100): Promise<AudiencesListResponse> {
  // Default pageSize should be 100 to match API
}
```

**Impact:**
- Fetches fewer records than expected
- More API calls needed for same data
- Inconsistent behavior with API defaults

---

## Bug #5: Missing API Method - createCustomAudience

**File:** `shared/audiencelab-client.ts`  
**Severity:** 🟡 MEDIUM - Feature not implemented

**Current:** Method doesn't exist

**Required (from API docs):**
```typescript
/**
 * Create a custom audience
 * POST /audiences/custom
 */
async createCustomAudience(data: CreateCustomAudienceRequest): Promise<{ audienceId: string }> {
  return this.request<{ audienceId: string }>('POST', '/audiences/custom', { body: data });
}
```

**Impact:**
- Cannot create custom audiences
- Feature gap in application

---

## Bug #6: Endpoint Path Question - /enrich vs /enrich/contact

**File:** `shared/audiencelab-client.ts` line 217  
**Severity:** 🟠 UNKNOWN - Need to verify

**Current:**
```typescript
async enrichContact(data: EnrichmentRequest): Promise<EnrichmentResponse> {
  return this.request<EnrichmentResponse>('POST', '/enrich/contact', { body: data });
}
```

**API Docs Show:** `POST /enrich` (not `/enrich/contact`)

**Impact:**
- If path is wrong, API calls will 404
- Need to verify which path is correct

---

## Additional Issues to Investigate

### 1. PixelsListResponse Structure
**Need to verify:** Does GET /pixels return pagination fields like audiences?

**Current:**
```typescript
export interface PixelsListResponse {
  data: Pixel[];
  total: number;
}
```

**Might need:**
```typescript
export interface PixelsListResponse {
  total_records: number;
  page_size: number;
  page: number;
  total_pages: number;
  data: Pixel[];
}
```

### 2. EnrichmentJobsListResponse Structure
**Need to verify:** Does GET /enrichments return pagination fields?

**Current:**
```typescript
export interface EnrichmentJobsListResponse {
  data: EnrichmentJob[];
  total: number;
}
```

**Might need:**
```typescript
export interface EnrichmentJobsListResponse {
  total_records: number;
  page_size: number;
  page: number;
  total_pages: number;
  data: EnrichmentJob[];
}
```

---

## Fix Priority

### 🔴 CRITICAL (Fix Immediately)
1. ✅ Fix `AudiencesListResponse` - Add missing pagination fields
2. ✅ Fix `CreateAudienceResponse` - Change to `{ audienceId: string }`
3. ✅ Fix `Audience.refresh_interval` type - Change number to string

### 🟡 HIGH (Fix Soon)
4. ✅ Fix default pageSize in `getAudiences` - Change 50 to 100
5. ✅ Add `createCustomAudience` method
6. ✅ Verify `/enrich` vs `/enrich/contact` endpoint path

### 🟢 MEDIUM (Verify and Fix if Needed)
7. ✅ Verify `PixelsListResponse` structure
8. ✅ Verify `EnrichmentJobsListResponse` structure
9. ✅ Check all other list response structures

---

## Next Steps

1. ✅ Fix all critical bugs in `audiencelab-types.ts`
2. ✅ Fix default pageSize in `audiencelab-client.ts`
3. ✅ Add missing `createCustomAudience` method
4. ✅ Verify remaining endpoint structures by checking API docs
5. ✅ Update all affected code that uses these types
6. ✅ Test all fixes
7. ✅ Save checkpoint with "API Types Fixed" message

