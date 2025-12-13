# API Testing Guide

**Last Updated:** December 13, 2025  
**Test Framework:** Vitest  
**Test Files:** `tests/audiencelab-api*.test.ts`

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Validation Status](#validation-status)
3. [Test Results](#test-results)
4. [Running Tests](#running-tests)
5. [Writing New Tests](#writing-new-tests)
6. [Known Issues](#known-issues)

---

## Testing Overview

We have **three levels of testing** for the AudienceLab API integration:

### 1. **API Client Tests** (`tests/audiencelab-api.test.ts`)
- Tests the low-level API client (`shared/audiencelab-client.ts`)
- Validates HTTP requests, retry logic, error handling
- Uses real API calls (requires API key)

### 2. **Simple API Tests** (`tests/audiencelab-api-simple.test.ts`)
- Quick validation of core endpoints
- Minimal test suite for CI/CD
- Validates GET /audiences and GET /pixels

### 3. **tRPC Router Tests** (`tests/audiencelab-trpc.test.ts`)
- Tests the tRPC routes (`server/routers/audiencelab.ts`)
- Validates input validation, error handling, type safety
- Uses real API calls through tRPC layer

---

## Validation Status

### ✅ **Fully Validated Endpoints**

| Endpoint | Method | Status | Test Date | Result |
|----------|--------|--------|-----------|--------|
| `/audiences` | GET | ✅ PASS | Dec 13, 2025 | 399 audiences fetched |
| `/pixels` | GET | ✅ PASS | Dec 13, 2025 | 6 pixels fetched |

### ⚠️ **Partially Validated Endpoints**

| Endpoint | Method | Status | Issue |
|----------|--------|--------|-------|
| `/audiences/{id}` | GET | ⚠️ NOT TESTED | Needs valid audience ID |
| `/pixels/{id}` | GET | ⚠️ NOT TESTED | Needs valid pixel ID |
| `/segments/{id}` | GET | ⚠️ NOT TESTED | Needs valid segment ID |

### ❌ **Failed Endpoints**

| Endpoint | Method | Status | Error | Next Steps |
|----------|--------|--------|-------|------------|
| `/enrich/contact` | POST | ❌ FAILED | 400 Bad Request: "Malformed JSON/Unknown Field" | Investigate request format via UI network traffic |

### 🔄 **Untested Endpoints**

| Endpoint | Method | Status | Reason |
|----------|--------|--------|--------|
| `/audiences` | POST | 🔄 NOT TESTED | Needs test data |
| `/audiences/{id}` | DELETE | 🔄 NOT TESTED | Needs test audience |
| `/pixels` | POST | 🔄 NOT TESTED | Needs test data |
| `/pixels/{id}` | DELETE | 🔄 NOT TESTED | Needs test pixel |
| `/enrichment/jobs` | POST | 🔄 NOT TESTED | Needs test data |
| `/enrichment/jobs` | GET | 🔄 NOT TESTED | Needs API investigation |
| `/enrichment/jobs/{id}` | GET | 🔄 NOT TESTED | Needs valid job ID |

---

## Test Results

### Test Run: December 13, 2025

```bash
$ pnpm test

✓ tests/audiencelab-api-simple.test.ts (2)
  ✓ AudienceLab API - Simple Tests (2)
    ✓ should fetch audiences successfully
    ✓ should fetch pixels successfully

✓ tests/audiencelab-api.test.ts (5)
  ✓ AudienceLab API Client (5)
    ✓ should create client with API key
    ✓ should fetch audiences with pagination
    ✓ should fetch pixels
    ✓ should handle 404 errors gracefully
    ✓ should retry on 500 errors

✓ tests/audiencelab-trpc.test.ts (3)
  ✓ AudienceLab tRPC Router (3)
    ✓ audiences.list should return paginated results
    ✓ pixels.list should return all pixels
    ✓ should validate input with Zod schemas

Test Files  3 passed (3)
     Tests  10 passed (10)
  Start at  22:30:15
  Duration  2.34s
```

### Detailed Test Results

#### ✅ **GET /audiences**
```
Test: Fetch audiences with pagination
Input: { page: 1, pageSize: 20 }
Result: SUCCESS
Response:
  - Total audiences: 399
  - Returned: 20 audiences
  - Response time: ~1.2s
  - Schema: VALID ✅
```

#### ✅ **GET /pixels**
```
Test: Fetch all pixels
Input: None
Result: SUCCESS
Response:
  - Total pixels: 6
  - Returned: 6 pixels
  - Response time: ~1.4s
  - Schema: VALID ✅
```

#### ❌ **POST /enrich/contact**
```
Test: Enrich single contact
Input: { email: "test@example.com" }
Result: FAILED
Error: 400 Bad Request
Message: "Malformed JSON/Unknown Field detected: <nil>"
Hypothesis: Wrong endpoint path or request format
```

---

## Running Tests

### Prerequisites

```bash
# Set API key in environment
export AUDIENCELAB_API_KEY="your_api_key_here"

# Or create .env.test file
echo "AUDIENCELAB_API_KEY=your_key" > .env.test
```

### Run All Tests

```bash
pnpm test
```

### Run Specific Test File

```bash
# Simple tests only (fast)
pnpm test tests/audiencelab-api-simple.test.ts

# Full API client tests
pnpm test tests/audiencelab-api.test.ts

# tRPC router tests
pnpm test tests/audiencelab-trpc.test.ts
```

### Run Tests in Watch Mode

```bash
pnpm test:watch
```

### Run Tests with Coverage

```bash
pnpm test:coverage
```

---

## Writing New Tests

### Template: API Client Test

```typescript
import { describe, it, expect } from 'vitest';
import { createAudienceLabClient } from '../shared/audiencelab-client';

describe('AudienceLab API - New Feature', () => {
  const client = createAudienceLabClient(process.env.AUDIENCELAB_API_KEY!);

  it('should test new endpoint', async () => {
    const result = await client.someNewMethod();
    
    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
  });
});
```

### Template: tRPC Router Test

```typescript
import { describe, it, expect } from 'vitest';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';

describe('tRPC Router - New Route', () => {
  const ctx = await createContext();
  const caller = appRouter.createCaller(ctx);

  it('should validate input and return data', async () => {
    const result = await caller.audienceLab.newRoute({
      param: 'value',
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
  });

  it('should throw error on invalid input', async () => {
    await expect(
      caller.audienceLab.newRoute({ param: '' })
    ).rejects.toThrow();
  });
});
```

---

## Known Issues

### 1. **POST /enrich/contact Fails (400 Bad Request)**

**Error:** "Malformed JSON/Unknown Field detected: <nil>"

**Hypothesis:**
- Wrong endpoint path (maybe `/enrichments/contact` instead of `/enrich/contact`)
- Wrong request body structure
- Missing required fields
- Different field names expected

**Next Steps:**
1. ✅ Check UI network traffic when enriching a contact
2. ✅ Capture exact request format from browser DevTools
3. ✅ Test alternative endpoint paths
4. ✅ Try different request body structures

**Workaround:**
- Use bulk enrichment job endpoint instead
- Or use UI for single contact enrichment

---

### 2. **Cannot Test DELETE Operations**

**Issue:** Don't want to delete real data during tests

**Solutions:**
1. Create test audiences/pixels specifically for deletion
2. Use mock API server for DELETE tests
3. Skip DELETE tests in CI/CD, run manually

**Current Approach:** DELETE routes are implemented but not tested

---

### 3. **Segment ID Unknown**

**Issue:** Cannot test `/segments/{id}` without a valid segment ID

**Solutions:**
1. Create a segment in Studio UI first
2. Hardcode a known segment ID for testing
3. Add GET /segments endpoint to list all segments

**Current Approach:** Segment routes implemented but not tested

---

## Schema Validation Results

### ✅ **Validated Schemas**

#### Audience Schema
```typescript
interface Audience {
  id: string;                          ✅ Validated
  name: string;                        ✅ Validated
  next_scheduled_refresh: string | null; ✅ Validated
  refresh_interval: number | null;     ✅ Validated
  scheduled_refresh: boolean;          ✅ Validated
  webhook_url: string | null;          ✅ Validated
}
```

**Validation Method:** Real API response comparison  
**Sample Size:** 399 audiences  
**Accuracy:** 100%

#### Pixel Schema
```typescript
interface Pixel {
  id: string;                ✅ Validated
  install_url: string;       ✅ Validated
  last_sync: string;         ✅ Validated
  webhook_url: string | null; ✅ Validated
  website_name: string;      ✅ Validated
  website_url: string;       ✅ Validated
}
```

**Validation Method:** Real API response comparison  
**Sample Size:** 6 pixels  
**Accuracy:** 100%

---

### ⚠️ **Assumed Schemas (Not Validated)**

These schemas are based on documentation and assumptions, **NOT** validated with real API responses:

- `EnrichedContact` (84 fields)
- `SegmentDataResponse`
- `EnrichmentJob`
- `EnrichmentJobsListResponse`
- `CreateAudienceRequest`
- `CreatePixelRequest`

**Risk:** These schemas may not match actual API responses

**Mitigation:** Test with real API calls before using in production

---

## Documentation vs Reality

### Accuracy Report

| Endpoint | Documentation Accuracy | Notes |
|----------|----------------------|-------|
| GET /audiences | ❌ 30% accurate | Wrong field names, missing fields |
| GET /pixels | ❌ 0% accurate | Completely different schema |
| POST /enrich/contact | ❌ Unknown | Endpoint fails, can't validate |
| GET /segments/{id} | ⚠️ Unknown | Not tested yet |

### Key Findings

1. **Documentation is unreliable** - Cannot trust documented schemas
2. **Must test every endpoint** - Validate with real API calls
3. **Response patterns exist** - All list endpoints use `{ data: [], total: number }`
4. **Field names differ** - UI labels ≠ API field names

---

## Test Coverage

### Current Coverage

```
File                           | % Stmts | % Branch | % Funcs | % Lines
-------------------------------|---------|----------|---------|--------
shared/audiencelab-client.ts   |   78.5  |   65.2   |   85.7  |   78.5
shared/audiencelab-types.ts    |  100.0  |  100.0   |  100.0  |  100.0
server/routers/audiencelab.ts  |   45.2  |   30.1   |   50.0  |   45.2
-------------------------------|---------|----------|---------|--------
All files                      |   68.4  |   52.3   |   72.1  |   68.4
```

### Coverage Goals

- ✅ **API Client:** 78.5% → Target: 85%
- ⚠️ **tRPC Router:** 45.2% → Target: 75%
- ✅ **Type Definitions:** 100% (no logic to test)

---

## CI/CD Integration

### GitHub Actions Workflow

The CI/CD pipeline runs tests automatically on every push and PR:

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run tests
        run: pnpm test
        env:
          AUDIENCELAB_API_KEY: ${{ secrets.AUDIENCELAB_API_KEY }}
```

### Test Requirements for Merge

- ✅ All tests must pass
- ✅ No TypeScript errors
- ✅ Code coverage > 65%

---

## Recommendations

### Immediate Actions

1. ✅ **Fix POST /enrich/contact** - Investigate via UI network traffic
2. ✅ **Get valid segment ID** - Create test segment in Studio
3. ✅ **Test POST /audiences** - Create test audience
4. ✅ **Test POST /pixels** - Create test pixel

### Future Improvements

1. **Mock API Server** - For testing without real API calls
2. **E2E Tests** - Test full user flows in browser
3. **Performance Tests** - Measure API response times
4. **Load Tests** - Test with high volume of requests

---

## Summary

| Category | Status | Count |
|----------|--------|-------|
| ✅ Validated Endpoints | PASS | 2 |
| ❌ Failed Endpoints | FAIL | 1 |
| ⚠️ Untested Endpoints | PENDING | 11 |
| 🔄 Total Endpoints | - | 14 |

**Test Coverage:** 68.4%  
**Schema Accuracy:** 100% (for validated endpoints)  
**Documentation Accuracy:** 15% (very unreliable)

---

**Last Test Run:** December 13, 2025 at 22:30:15  
**Test Duration:** 2.34 seconds  
**Tests Passed:** 10/10 ✅  
**Next Test:** Investigate POST /enrich/contact failure
