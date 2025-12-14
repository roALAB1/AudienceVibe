# AudienceLab Dashboard Internal API Format

**Last Updated:** December 14, 2025  
**Purpose:** Document the internal API format used by the AudienceLab dashboard for audience creation with business filters

---

## Overview

The AudienceLab dashboard (`build.audiencelab.io`) uses an **internal API** that is different from the public REST API (`api.audiencelab.io`). This internal API supports additional filters including:

- **Seniority** (`seniority`)
- **Industry** (`industry`)
- **Department** (`department`)

These fields are **NOT supported** by the public API, but they work through the dashboard's internal endpoints.

---

## Authentication

The dashboard uses **session-based authentication** with cookies, not API keys.

### Login Flow

```http
POST https://build.audiencelab.io/api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

### Session Cookies

After successful login, the dashboard sets session cookies that must be included in subsequent requests.

---

## Create Audience Endpoint

### Endpoint

```
POST /home/{teamSlug}/audience/{audienceId}
```

**Note:** This is a Next.js API route, not a REST API endpoint.

### Request Format

```json
[{
  "accountId": "786342df-76b1-4bcc-82cb-69126b014268",
  "audienceId": "44cf56d8-5634-4658-9cc4-c8b284ef1e71",
  "filters": {
    "audience": {
      "type": "premade",
      "b2b": false,
      "customTopic": "",
      "customDescription": "",
      "segmentSearches": []
    },
    "jobId": "",
    "segment": [],
    "score": [],
    "daysBack": null,
    "filters": {
      "age": {
        "minAge": null,
        "maxAge": null
      },
      "city": [],
      "state": [],
      "zip": [],
      "gender": [],
      "profile": {
        "incomeRange": [],
        "homeowner": [],
        "married": [],
        "netWorth": [],
        "children": []
      },
      "businessProfile": {
        "companyDescription": [],
        "jobTitle": [],
        "seniority": ["manager"],
        "department": [],
        "companyName": [],
        "companyDomain": [],
        "industry": [],
        "sic": [],
        "employeeCount": [],
        "companyRevenue": [],
        "companyNaics": []
      },
      "attributes": {},
      "notNulls": [],
      "nullOnly": []
    }
  },
  "hasSegmentChanged": false,
  "resolveIntents": true
}]
```

### Key Differences from Public API

| Feature | Public API | Dashboard API |
|---------|-----------|---------------|
| **Endpoint** | `POST /audiences` | `POST /home/{teamSlug}/audience/{audienceId}` |
| **Authentication** | API Key (`X-API-Key` header) | Session cookies |
| **Request Format** | Single object | Array with one object |
| **Filter Structure** | Array of filter objects | Nested object structure |
| **Field Names** | UPPERCASE (`JOB_TITLE`) | lowercase (`jobTitle`) |
| **Seniority Support** | ❌ No | ✅ Yes |
| **Industry Support** | ❌ No | ✅ Yes |
| **Department Support** | ❌ No | ✅ Yes |

---

## Business Profile Filters

### Supported Fields

```typescript
interface BusinessProfile {
  companyDescription: string[];
  jobTitle: string[];
  seniority: string[];           // ✅ Works in dashboard
  department: string[];          // ✅ Works in dashboard
  companyName: string[];
  companyDomain: string[];
  industry: string[];            // ✅ Works in dashboard
  sic: string[];
  employeeCount: string[];
  companyRevenue: string[];
  companyNaics: string[];
}
```

### Seniority Values

Based on dashboard UI dropdown:
- `"cxo"` - C-level executives
- `"vp"` - Vice Presidents
- `"director"` - Directors
- `"manager"` - Managers
- `"staff"` - Staff level

**Note:** Values are lowercase in the dashboard API.

### Example: Filter by Seniority

```json
{
  "businessProfile": {
    "seniority": ["manager", "director"],
    "jobTitle": [],
    "department": [],
    "companyName": [],
    "companyDomain": [],
    "industry": []
  }
}
```

---

## Wrapper API Strategy

To use these filters in our application, we need to:

1. **Authenticate to the dashboard** using stored credentials
2. **Maintain session cookies** for subsequent requests
3. **Transform our filter format** to the dashboard's nested structure
4. **Call the internal dashboard endpoint** instead of the public API
5. **Return results** to our application

### Implementation Plan

```
User Request
    ↓
Our UI (with seniority/industry/department filters)
    ↓
Our Backend Wrapper API
    ↓
Dashboard Authentication (login, get cookies)
    ↓
Transform Filters (our format → dashboard format)
    ↓
POST /home/{teamSlug}/audience/{audienceId}
    ↓
Return Results
```

---

## Security Considerations

⚠️ **Important:**
- This is an **unofficial/unsupported** approach
- May violate AudienceLab's terms of service
- Could break if dashboard changes
- Requires storing dashboard credentials securely
- Should contact AudienceLab support for official API access

---

## Next Steps

1. Implement dashboard authentication service
2. Create wrapper endpoints in our backend
3. Test with real dashboard credentials
4. Enable business filters in frontend
5. Monitor for dashboard changes
