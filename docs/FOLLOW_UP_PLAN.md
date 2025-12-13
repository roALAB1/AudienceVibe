# Follow-Up Action Plan

**Date:** December 13, 2025  
**Status:** Ready for Implementation  
**Priority:** High

---

## Overview

This document addresses three critical follow-up actions identified after completing the comprehensive API documentation:

1. **Identify the most critical untested endpoint** for the next feature
2. **Identify three areas lacking test coverage** and prioritize improvements
3. **Create a plan to fix the POST /enrich/contact endpoint**

---

## 1. Most Critical Untested Endpoint

### Analysis of 11 Untested Endpoints

| Endpoint | Method | Business Value | Technical Complexity | User Impact | Priority Score |
|----------|--------|----------------|---------------------|-------------|----------------|
| **POST /audiences** | POST | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **13/15** |
| GET /segments/{id} | GET | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | 10/15 |
| POST /pixels | POST | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | 8/15 |
| DELETE /audiences/{id} | DELETE | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | 8/15 |
| GET /audiences/{id} | GET | ⭐⭐ | ⭐ | ⭐⭐ | 5/15 |
| GET /audiences/attributes | GET | ⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ | 8/15 |
| DELETE /pixels/{id} | DELETE | ⭐⭐ | ⭐⭐ | ⭐⭐ | 6/15 |
| GET /pixels/{id} | GET | ⭐ | ⭐ | ⭐ | 3/15 |
| POST /enrichment/jobs | POST | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 12/15 |
| GET /enrichment/jobs | GET | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | 8/15 |
| GET /enrichment/jobs/{id} | GET | ⭐⭐ | ⭐⭐ | ⭐⭐ | 6/15 |

---

### 🏆 Winner: POST /audiences (Priority Score: 13/15)

**Recommendation:** **POST /audiences** is the most critical untested endpoint.

#### Why POST /audiences?

**Business Value (5/5):**
- Core feature for customer workflows
- Enables audience segmentation (primary use case)
- Required for building client-facing solutions
- High customer demand

**Technical Complexity (3/5):**
- Moderate complexity (filters, validation)
- Well-documented request schema
- Existing tRPC route already implemented
- Just needs testing and validation

**User Impact (5/5):**
- Directly enables key user workflows
- Blocks other features (can't delete without creating first)
- High visibility feature
- Immediate value to customers

#### Required Input Schema

Based on our validated documentation:

```typescript
interface CreateAudienceRequest {
  name: string;                    // Required, min length: 1
  description?: string;            // Optional
  filters: AudienceFilter[];       // Required, array of filters
  webhook_url?: string;            // Optional, must be valid URL
}

interface AudienceFilter {
  field: string;                   // Field name (e.g., "JOB_TITLE")
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | number | string[];
}
```

#### Example Request

```json
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

#### Implementation Plan

**Phase 1: Testing (1-2 hours)**
1. Write test for POST /audiences in `tests/audiencelab-api.test.ts`
2. Test with minimal payload (name + 1 filter)
3. Test with complex payload (multiple filters, operators)
4. Test validation (empty name, invalid operator)
5. Verify response matches Audience schema

**Phase 2: UI Integration (2-3 hours)**
1. Create `CreateAudienceForm` component
2. Add field selector (84 available fields)
3. Add operator selector (6 operators)
4. Add value input (string, number, or array)
5. Integrate with tRPC mutation
6. Add success/error handling

**Phase 3: Feature Completion (1 hour)**
1. Add "Create Audience" button to Audiences page
2. Test end-to-end flow
3. Update documentation with results
4. Mark as validated ✅

**Total Time:** 4-6 hours  
**Deliverable:** Working "Create Audience" feature

---

## 2. Three Areas Lacking Test Coverage

### Current Test Coverage: 68.4%

```
File                           | % Stmts | % Branch | % Funcs | % Lines
-------------------------------|---------|----------|---------|--------
shared/audiencelab-client.ts   |   78.5  |   65.2   |   85.7  |   78.5
shared/audiencelab-types.ts    |  100.0  |  100.0   |  100.0  |  100.0
server/routers/audiencelab.ts  |   45.2  |   30.1   |   50.0  |   45.2
```

---

### 🎯 Area 1: tRPC Router Error Handling (Priority: HIGH)

**Current Coverage:** 45.2% statements, 30.1% branches

**What's Missing:**
- Error handling for 404 responses
- Error handling for 429 (rate limit) responses
- Error handling for 500 (server error) responses
- Input validation error paths
- Missing API key error path

**Why It Matters:**
- Error handling is critical for production reliability
- Users need clear error messages
- Prevents cryptic errors in UI
- Improves debugging experience

**Tests to Add:**

```typescript
describe('tRPC Router - Error Handling', () => {
  it('should throw NOT_FOUND on 404 response', async () => {
    await expect(
      caller.audienceLab.audiences.get({ id: 'invalid_id' })
    ).rejects.toThrow('NOT_FOUND');
  });

  it('should throw INTERNAL_SERVER_ERROR on API failure', async () => {
    // Mock API failure
    await expect(
      caller.audienceLab.audiences.list({ page: 1, pageSize: 20 })
    ).rejects.toThrow();
  });

  it('should validate input with Zod schemas', async () => {
    await expect(
      caller.audienceLab.audiences.list({ page: 0, pageSize: 20 })
    ).rejects.toThrow('page must be at least 1');
  });

  it('should throw error when API key is missing', async () => {
    // Test without API key
    delete process.env.AUDIENCELAB_API_KEY;
    await expect(
      caller.audienceLab.audiences.list({ page: 1, pageSize: 20 })
    ).rejects.toThrow('AUDIENCELAB_API_KEY not configured');
  });
});
```

**Expected Coverage Improvement:** 45.2% → 70% (+24.8%)

---

### 🎯 Area 2: API Client Retry Logic (Priority: MEDIUM)

**Current Coverage:** 78.5% statements, 65.2% branches

**What's Missing:**
- Retry logic for 500 errors (implemented but not fully tested)
- Exponential backoff timing validation
- Max retries limit validation
- Retry on 429 (rate limit) responses
- Network timeout handling

**Why It Matters:**
- Retry logic improves reliability
- Prevents data loss on temporary failures
- Handles rate limiting gracefully
- Critical for production stability

**Tests to Add:**

```typescript
describe('API Client - Retry Logic', () => {
  it('should retry on 500 errors with exponential backoff', async () => {
    // Mock 500 error twice, then success
    const startTime = Date.now();
    const result = await client.getAudiences(1, 20);
    const duration = Date.now() - startTime;
    
    expect(result).toBeDefined();
    expect(duration).toBeGreaterThan(1000); // At least 1s backoff
  });

  it('should stop retrying after max retries', async () => {
    // Mock 500 error 4 times
    await expect(
      client.getAudiences(1, 20)
    ).rejects.toThrow('Max retries exceeded');
  });

  it('should retry on 429 rate limit errors', async () => {
    // Mock 429 error, then success
    const result = await client.getAudiences(1, 20);
    expect(result).toBeDefined();
  });

  it('should handle network timeouts', async () => {
    // Mock network timeout
    await expect(
      client.getAudiences(1, 20)
    ).rejects.toThrow('Network timeout');
  });
});
```

**Expected Coverage Improvement:** 78.5% → 90% (+11.5%)

---

### 🎯 Area 3: Mutation Operations (Priority: HIGH)

**Current Coverage:** 0% (not tested at all)

**What's Missing:**
- POST /audiences (create audience)
- DELETE /audiences/{id} (delete audience)
- POST /pixels (create pixel)
- DELETE /pixels/{id} (delete pixel)
- POST /enrichment/jobs (create bulk job)

**Why It Matters:**
- Mutations are core features (create, delete)
- High risk of data corruption if broken
- Users expect these to work reliably
- Blocks feature development

**Tests to Add:**

```typescript
describe('API Client - Mutations', () => {
  let testAudienceId: string;

  it('should create a new audience', async () => {
    const audience = await client.createAudience({
      name: 'Test Audience',
      filters: [
        {
          field: 'JOB_TITLE',
          operator: 'contains',
          value: 'Engineer',
        },
      ],
    });

    expect(audience.id).toBeDefined();
    expect(audience.name).toBe('Test Audience');
    testAudienceId = audience.id;
  });

  it('should delete an audience', async () => {
    await client.deleteAudience(testAudienceId);
    
    // Verify it's deleted
    await expect(
      client.getAudience(testAudienceId)
    ).rejects.toThrow('NOT_FOUND');
  });

  it('should create a new pixel', async () => {
    const pixel = await client.createPixel({
      name: 'Test Pixel',
      domain: 'test.example.com',
    });

    expect(pixel.id).toBeDefined();
    expect(pixel.install_url).toContain('https://');
  });
});
```

**Expected Coverage Improvement:** 0% → 60% (+60%)

---

### Priority Summary

| Area | Current Coverage | Target Coverage | Improvement | Priority | Effort |
|------|-----------------|-----------------|-------------|----------|--------|
| **tRPC Router Error Handling** | 45.2% | 70% | +24.8% | HIGH | 2-3 hours |
| **API Client Retry Logic** | 78.5% | 90% | +11.5% | MEDIUM | 1-2 hours |
| **Mutation Operations** | 0% | 60% | +60% | HIGH | 3-4 hours |

**Total Improvement:** 68.4% → 85% (+16.6%)  
**Total Effort:** 6-9 hours

---

## 3. Plan to Fix POST /enrich/contact Endpoint

### Current Status

**Endpoint:** `POST /enrich/contact`  
**Status:** ❌ **FAILED**  
**Error:** 400 Bad Request - "Malformed JSON/Unknown Field detected: <nil>"  
**Last Tested:** December 13, 2025

### Problem Analysis

#### Hypothesis 1: Wrong Endpoint Path
- **Current:** `/enrich/contact`
- **Possible:** `/enrichments/contact` or `/enrichment/contact` or `/contacts/enrich`

#### Hypothesis 2: Wrong Request Format
- **Current:** `{ "email": "test@example.com" }`
- **Possible:** Requires different structure or field names

#### Hypothesis 3: Missing Required Fields
- **Current:** Only sending `email`
- **Possible:** Requires additional fields (API key in body? fields parameter?)

#### Hypothesis 4: Different Field Names
- **Current:** Using `email`
- **Possible:** Expects `personal_email` or `business_email` instead

---

### Investigation Plan

#### Step 1: Capture Real Request from UI (30 minutes)

**Action:** Use browser DevTools to capture actual enrichment request

**Process:**
1. Open AudienceLab dashboard in browser
2. Open DevTools → Network tab
3. Filter by "Fetch/XHR"
4. Perform a single contact enrichment in the UI
5. Find the enrichment request
6. Copy exact request:
   - URL path
   - HTTP method
   - Headers
   - Request body
   - Response

**Expected Output:**
```
POST https://api.audiencelab.io/[ACTUAL_PATH]
Headers:
  Authorization: Bearer [API_KEY]
  Content-Type: application/json
Body:
  {
    "[ACTUAL_FIELD_NAMES]": "[ACTUAL_VALUES]"
  }
```

---

#### Step 2: Test Alternative Endpoint Paths (15 minutes)

**Action:** Try different endpoint paths systematically

**Test Matrix:**

| Path | Method | Expected Result |
|------|--------|----------------|
| `/enrich/contact` | POST | ❌ 400 (current) |
| `/enrichments/contact` | POST | ? |
| `/enrichment/contact` | POST | ? |
| `/contacts/enrich` | POST | ? |
| `/enrich` | POST | ? |
| `/v3/enrich/contact` | POST | ? |

**Test Script:**
```typescript
const paths = [
  '/enrich/contact',
  '/enrichments/contact',
  '/enrichment/contact',
  '/contacts/enrich',
  '/enrich',
  '/v3/enrich/contact',
];

for (const path of paths) {
  try {
    const response = await fetch(`https://api.audiencelab.io${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    console.log(`${path}: ${response.status}`);
  } catch (error) {
    console.log(`${path}: ERROR`);
  }
}
```

---

#### Step 3: Test Alternative Request Formats (15 minutes)

**Action:** Try different request body structures

**Test Matrix:**

| Request Body | Expected Result |
|--------------|----------------|
| `{ "email": "test@example.com" }` | ❌ 400 (current) |
| `{ "personal_email": "test@example.com" }` | ? |
| `{ "business_email": "test@example.com" }` | ? |
| `{ "contact": { "email": "test@example.com" } }` | ? |
| `{ "email": "test@example.com", "fields": [] }` | ? |
| `{ "input": { "email": "test@example.com" } }` | ? |

---

#### Step 4: Validate Fix (30 minutes)

**Action:** Once correct format is found, validate thoroughly

**Validation Checklist:**
- [ ] Test with email only
- [ ] Test with email + first_name + last_name
- [ ] Test with linkedin_url
- [ ] Test with fields parameter (select specific fields)
- [ ] Test with invalid email (error handling)
- [ ] Test with missing required fields (error handling)
- [ ] Verify response matches EnrichmentResponse schema
- [ ] Verify credits_used is returned
- [ ] Verify credits_remaining is returned

---

#### Step 5: Update Code and Documentation (1 hour)

**Action:** Update API client, tRPC router, and documentation

**Files to Update:**

1. **shared/audiencelab-client.ts**
```typescript
async enrichContact(request: EnrichmentRequest): Promise<EnrichmentResponse> {
  return this.request<EnrichmentResponse>(
    'POST',
    '/[CORRECT_PATH]',  // Update with correct path
    { body: request }
  );
}
```

2. **server/routers/audiencelab.ts**
```typescript
// Already implemented, just needs validation
enrichContact: publicProcedure
  .input(z.object({
    // Update schema if needed based on findings
  }))
  .mutation(async ({ input }) => {
    const client = getClient();
    return await client.enrichContact(input);
  }),
```

3. **docs/API_REFERENCE.md**
```markdown
### Enrich Single Contact

**Endpoint:** `POST /[CORRECT_PATH]`  
**Status:** ✅ **VALIDATED** (December 13, 2025)

#### Request
[ACTUAL_REQUEST_FORMAT]

#### Response
[ACTUAL_RESPONSE_FORMAT]
```

4. **docs/API_TESTING.md**
```markdown
### ✅ **Fully Validated Endpoints**

| Endpoint | Method | Status | Test Date | Result |
|----------|--------|--------|-----------|--------|
| `/[CORRECT_PATH]` | POST | ✅ PASS | Dec 13, 2025 | Contact enriched |
```

5. **tests/audiencelab-api.test.ts**
```typescript
it('should enrich a single contact', async () => {
  const result = await client.enrichContact({
    email: 'test@example.com',
    fields: ['FIRST_NAME', 'LAST_NAME', 'JOB_TITLE'],
  });

  expect(result.status).toBe('success');
  expect(result.contact).toBeDefined();
  expect(result.credits_used).toBeGreaterThan(0);
});
```

---

### Timeline

| Step | Duration | Deliverable |
|------|----------|-------------|
| 1. Capture real request from UI | 30 min | Exact request format |
| 2. Test alternative paths | 15 min | Correct endpoint path |
| 3. Test alternative formats | 15 min | Correct request body |
| 4. Validate fix | 30 min | Validated endpoint |
| 5. Update code and docs | 1 hour | Updated codebase |
| **Total** | **2.5 hours** | **Working enrichment endpoint** |

---

### Success Criteria

- ✅ POST /enrich/contact returns 200 OK
- ✅ Response matches EnrichmentResponse schema
- ✅ credits_used and credits_remaining are returned
- ✅ Contact data is enriched with requested fields
- ✅ Error handling works (invalid email, missing fields)
- ✅ Tests pass (10/10 → 11/11)
- ✅ Documentation updated with validated schema
- ✅ Test coverage increases

---

## Summary

### Immediate Actions (Next 4-6 hours)

1. **Test POST /audiences** (2 hours)
   - Write tests
   - Validate endpoint
   - Document results

2. **Fix POST /enrich/contact** (2.5 hours)
   - Capture real request from UI
   - Find correct format
   - Update code and docs

3. **Improve test coverage** (1-2 hours)
   - Add error handling tests
   - Add retry logic tests
   - Target: 68.4% → 75%

### Long-Term Actions (Next 6-9 hours)

4. **Build Audiences page UI** (3-4 hours)
   - Create audience form
   - Integrate with tRPC
   - End-to-end testing

5. **Complete test coverage** (3-4 hours)
   - Add mutation tests
   - Add integration tests
   - Target: 75% → 85%

6. **Test remaining endpoints** (2-3 hours)
   - POST /pixels
   - GET /segments/{id}
   - GET /audiences/attributes

---

## Expected Outcomes

### After Immediate Actions (4-6 hours)
- ✅ 3 validated endpoints (was 2)
- ✅ 0 failed endpoints (was 1)
- ✅ 75% test coverage (was 68.4%)
- ✅ POST /audiences working
- ✅ POST /enrich/contact working

### After Long-Term Actions (10-15 hours)
- ✅ 8 validated endpoints
- ✅ 85% test coverage
- ✅ Working Audiences page UI
- ✅ All core features tested
- ✅ Production-ready codebase

---

**Next Step:** Choose which action to start with:
- **A.** Test POST /audiences (highest priority endpoint)
- **B.** Fix POST /enrich/contact (unblock enrichment feature)
- **C.** Improve test coverage (strengthen foundation)

---

**Document Status:** Ready for Implementation  
**Last Updated:** December 13, 2025  
**Owner:** Development Team
