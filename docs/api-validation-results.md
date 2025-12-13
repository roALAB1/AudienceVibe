# API Validation Results
**Date:** December 13, 2025  
**Tested Endpoints:** 3 core endpoints

---

## ✅ **Successfully Validated**

### 1. GET /pixels

**Status:** ✅ **WORKING**  
**Response Time:** ~1.4 seconds

**ACTUAL Response Structure:**
```json
{
  "data": [
    {
      "id": "96e62502-f16d-43fa-acf7-22ff6e7f686d",
      "install_url": "https://cdn.v3.identitypxl.app/pixels/f36d7d73-3ac5-4a41-a024-39e8fb5df7e7/p.js",
      "last_sync": "2025-12-13T22:05:02+00:00",
      "webhook_url": "https://hook.us1.make.com/s9xnwo1qntvj1kpgdwxna9u85x6o16ps",
      "website_name": "test.com",
      "website_url": "https://test.com"
    }
  ],
  "total": 6
}
```

**TypeScript Interface (VALIDATED):**
```typescript
export interface Pixel {
  id: string;
  install_url: string;
  last_sync: string; // ISO 8601 datetime
  webhook_url: string | null;
  website_name: string;
  website_url: string;
}

export interface PixelsListResponse {
  data: Pixel[];
  total: number;
}
```

**Documentation Accuracy:** ❌ **INCORRECT**
- Documented fields: `name`, `created_at`, `script_url`, `events_count`
- Actual fields: `install_url`, `last_sync`, `webhook_url`, `website_name`, `website_url`

---

## ❌ **Failed Validation**

### 2. POST /enrich/contact

**Status:** ❌ **FAILED**  
**Error:** "Malformed JSON/Unknown Field detected: <nil>"  
**HTTP Status:** 400

**Test Request:**
```json
{
  "email": "test@example.com"
}
```

**Possible Issues:**
1. ❌ Endpoint path might be wrong (maybe `/enrichments/contact` instead of `/enrich/contact`)
2. ❌ Request body structure might be different
3. ❌ Might require additional fields
4. ❌ Might use different field names

**Next Steps:**
- Check UI network traffic for actual enrichment requests
- Try alternative endpoint paths
- Try different request body structures

---

### 3. GET /segments/{id}

**Status:** ⚠️ **NEEDS SEGMENT ID**  
**Error:** HTTP 404 (expected - used placeholder ID)

**Note:** Cannot test without a real segment ID. Need to:
1. Create a segment in the UI, OR
2. Get an existing segment ID from Studio

---

## 📊 Summary

| Endpoint | Status | Documentation Accuracy |
|----------|--------|------------------------|
| GET /audiences | ✅ VALIDATED | ❌ WRONG (30% accurate) |
| GET /pixels | ✅ VALIDATED | ❌ WRONG (0% accurate) |
| POST /enrich/contact | ❌ FAILED | ⚠️ UNKNOWN |
| GET /segments/{id} | ⚠️ NEEDS ID | ⚠️ UNKNOWN |

---

## 🎯 Key Findings

### **Pattern Discovered:**
Both validated endpoints (`GET /audiences` and `GET /pixels`) return:
```json
{
  "data": [...],
  "total": number
}
```

This suggests ALL list endpoints follow this pattern.

### **Documentation Reliability:**
- GET /audiences: 30% accurate (wrong field names, missing fields)
- GET /pixels: 0% accurate (completely different schema)

**Conclusion:** Cannot trust documentation schemas. Must test every endpoint.

---

## ✅ **Updated TypeScript Types (Validated)**

```typescript
// VALIDATED: GET /audiences
export interface Audience {
  id: string;
  name: string;
  next_scheduled_refresh: string | null;
  refresh_interval: number | null;
  scheduled_refresh: boolean;
  webhook_url: string | null;
}

export interface AudiencesListResponse {
  data: Audience[];
  total: number;
}

// VALIDATED: GET /pixels
export interface Pixel {
  id: string;
  install_url: string;
  last_sync: string;
  webhook_url: string | null;
  website_name: string;
  website_url: string;
}

export interface PixelsListResponse {
  data: Pixel[];
  total: number;
}
```

---

## 🚀 Recommended Next Steps

### **Immediate (to unblock MVP):**
1. ✅ Update types with validated schemas
2. ⚠️ Fix POST /enrich/contact endpoint (check UI network traffic)
3. ⚠️ Get a real segment ID to test GET /segments/{id}

### **For Complete Validation:**
4. Test POST /audiences
5. Test GET /audiences/{id}
6. Test DELETE /audiences/{id}
7. Test POST /pixels
8. Test DELETE /pixels/{id}

---

## 💡 Insights

**Why Documentation Was Wrong:**
1. ✅ Network traffic was analyzed (correct endpoints found)
2. ❌ Response schemas were assumed (not validated)
3. ❌ Field names were guessed based on UI labels
4. ❌ No actual API calls were made during documentation

**Lesson Learned:**
- Documentation ≠ Reality
- Must test EVERY endpoint
- Cannot assume schema consistency
- UI labels ≠ API field names
