# Official POST /audiences Format (from Mintlify Docs)

**Date:** December 13, 2025  
**Source:** https://audiencelab.mintlify.app/api-reference/audience/create-audience  
**Status:** ✅ OFFICIAL DOCUMENTATION - USE THIS FORMAT

---

## ⚠️ IMPORTANT: This is the ONLY validated format for POST /audiences

All previous assumptions about dashboard endpoints, array formats, or session authentication were **INCORRECT**.  
This is the official public API format from AudienceLab's Mintlify documentation.

---

## Endpoint

```
POST https://api.audiencelab.io/audiences
```

## Authentication

```
X-Api-Key: <api-key>
```

## Request Format

```bash
curl --request POST \
  --url https://api.audiencelab.io/audiences \
  --header 'Content-Type: application/json' \
  --header 'X-Api-Key: <api-key>' \
  --data '{
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
    "segment": [
      "100073"
    ],
    "days_back": 7
  }'
```

## Request Body Schema

```typescript
interface CreateAudienceRequest {
  name: string;          // REQUIRED - Audience name
  filters: {             // REQUIRED - Filter criteria
    age?: {
      minAge?: number;
      maxAge?: number;
    };
    city?: string[];
    businessProfile?: {
      industry?: string[];
    };
    // ... other filter fields
  };
  segment?: string[];    // OPTIONAL - Segment IDs
  days_back?: integer;   // OPTIONAL - Days to look back
}
```

## Response Format

### Success (200)

```json
{
  "audienceId": "812b78c3-83e6-4d6a-8245-def0dde26223"
}
```

### Error (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body"
  }
}
```

---

## Complete Example

```typescript
import { AudienceLabClient } from './audiencelab-client';

const client = new AudienceLabClient(process.env.AUDIENCELAB_API_KEY!);

const result = await client.createAudience({
  name: "Software Engineers in NYC",
  filters: {
    age: {
      minAge: 25,
      maxAge: 45
    },
    city: ["New York"],
    businessProfile: {
      industry: ["Software Development"]
    }
  },
  days_back: 30
});

console.log('Audience created:', result.audienceId);
```

---

## What We Learned (Mistakes to Avoid)

### ❌ WRONG: Dashboard Endpoint
```
POST https://build.audiencelab.io/home/{teamSlug}
Body: [{accountId, name}]
Auth: Session cookies
```
This is for internal dashboard use only, not the public API.

### ✅ CORRECT: Public API Endpoint
```
POST https://api.audiencelab.io/audiences
Body: {name, filters, segment?, days_back?}
Auth: X-Api-Key header
```
This is the official documented public API.

---

## Always Check Official Docs First!

Before making assumptions about API formats:
1. ✅ Check https://audiencelab.mintlify.app
2. ✅ Use the documented format exactly
3. ❌ Don't assume based on dashboard behavior
4. ❌ Don't guess request formats

---

**This documentation is the single source of truth for POST /audiences.**
