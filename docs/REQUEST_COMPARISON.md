# Dashboard vs Public API Request Comparison

## Dashboard Request (WORKS with seniority)

**Endpoint:** `POST /home/onboarding/audience/44cf56d8-5634-4658-9cc4-c8b284ef1e71`

**Body:**
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
      "age": { "minAge": null, "maxAge": null },
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
      "attributes": {...},
      "notNulls": [],
      "nullOnly": []
    }
  },
  "hasSegmentChanged": false,
  "resolveIntents": true
}]
```

## Our API Request (FAILS with 400)

**Endpoint:** `POST https://api.audiencelab.io/audiences`

**Body:**
```json
{
  "name": "[TEST] seniority only",
  "filters": [
    {
      "field": "SENIORITY_LEVEL",
      "operator": "in",
      "value": ["Manager", "Director"]
    }
  ]
}
```

## Key Differences

| Aspect | Dashboard | Our API |
|--------|-----------|---------|
| **Endpoint** | `/home/{team}/audience/{id}` | `/audiences` |
| **Request Type** | Array `[{...}]` | Object `{...}` |
| **Filter Structure** | Nested object | Array of filters |
| **Field Names** | lowercase (`seniority`) | UPPERCASE (`SENIORITY_LEVEL`) |
| **Authentication** | Session cookies | API Key header |
| **Additional Fields** | accountId, audienceId, resolveIntents | Just name + filters |

## Hypothesis

**The dashboard is NOT using the public API at all!** It's using an internal Next.js API route that has different:
- Authentication (sessions vs API keys)
- Request format (nested vs array)
- Supported fields (more permissive)

**But wait...** Maybe the public API DOES support these fields, but we need to:
1. Use the correct field names
2. Include additional required parameters
3. Use a different request structure

Let me check the official Mintlify documentation again for the exact format...
