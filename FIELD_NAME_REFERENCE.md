# AudienceLab API Field Name Reference

**Source:** Official AudienceLab API Documentation (https://audiencelab.mintlify.app)  
**Last Updated:** December 14, 2025  
**Purpose:** Authoritative reference for all accepted field names across AudienceLab API

---

## ✅ Enrichment API - Accepted Field Names

**Endpoint:** `POST /enrichments`  
**Source:** https://audiencelab.mintlify.app/api-reference/enrichment/create-enrichment-job

### Columns Array (UPPERCASE)
Used in the `columns` array parameter:

```typescript
columns: string[]  // Optional explicit list of fields
```

**Accepted Values:**

1. **EMAIL** ✅
2. **PERSONAL_EMAIL** ✅
3. **BUSINESS_EMAIL** ✅
4. **FIRST_NAME** ✅
5. **LAST_NAME** ✅
6. **PHONE** ✅ (NOT `PHONE_NUMBER`)
7. **PERSONAL_ADDRESS** ✅
8. **PERSONAL_CITY** ✅
9. **PERSONAL_STATE** ✅
10. **PERSONAL_ZIP** ✅
11. **COMPANY_NAME** ✅
12. **COMPANY_DOMAIN** ✅
13. **COMPANY_INDUSTRY** ✅
14. **SHA256_PERSONAL_EMAIL** ✅
15. **LINKEDIN_URL** ✅
16. **UP_ID** ✅

### Records Object Keys (lowercase with underscores)
Used as keys in the `records` array objects:

```typescript
records: Array<{
  email?: string;
  personal_email?: string;
  business_email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;  // NOT phone_number
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
}>
```

**Example from API Docs:**
```json
{
  "name": "Sample Upload",
  "operator": "OR",
  "columns": ["EMAIL", "FIRST_NAME", "LAST_NAME", "PHONE"],
  "records": [
    {
      "first_name": "Harper",
      "last_name": "Nguyen",
      "phone": "+12145550123",
      "email": "harper.nguyen@example.com"
    }
  ]
}
```

---

## 🔍 Field Name Mapping Rules

### Rule 1: Column Names (UPPERCASE)
- Used in `columns` array
- All UPPERCASE with underscores
- Example: `EMAIL`, `FIRST_NAME`, `PHONE`

### Rule 2: Record Keys (lowercase)
- Used as object keys in `records` array
- All lowercase with underscores
- Example: `email`, `first_name`, `phone`

### Rule 3: Conversion
```typescript
// UPPERCASE column → lowercase record key
"FIRST_NAME" → "first_name"
"PHONE" → "phone"
"COMPANY_NAME" → "company_name"
```

---

## ❌ Common Mistakes

### 1. PHONE_NUMBER vs PHONE
**Wrong:**
```typescript
{ value: 'PHONE_NUMBER', label: 'Phone Number' }  // ❌ INCORRECT
```

**Correct:**
```typescript
{ value: 'PHONE', label: 'Phone' }  // ✅ CORRECT
```

### 2. Mixed Case in Records
**Wrong:**
```typescript
{
  "firstName": "John",  // ❌ camelCase
  "Phone": "+1234567890"  // ❌ PascalCase
}
```

**Correct:**
```typescript
{
  "first_name": "John",  // ✅ snake_case
  "phone": "+1234567890"  // ✅ lowercase
}
```

### 3. Missing Underscores
**Wrong:**
```typescript
"personaladdress"  // ❌ Missing underscore
"companyname"      // ❌ Missing underscore
```

**Correct:**
```typescript
"personal_address"  // ✅ With underscore
"company_name"      // ✅ With underscore
```

---

## 📋 Field Categories

### Personal Information
- `EMAIL` / `email`
- `PERSONAL_EMAIL` / `personal_email`
- `FIRST_NAME` / `first_name`
- `LAST_NAME` / `last_name`
- `PHONE` / `phone`
- `PERSONAL_ADDRESS` / `personal_address`
- `PERSONAL_CITY` / `personal_city`
- `PERSONAL_STATE` / `personal_state`
- `PERSONAL_ZIP` / `personal_zip`
- `SHA256_PERSONAL_EMAIL` / `sha256_personal_email`

### Business Information
- `BUSINESS_EMAIL` / `business_email`
- `COMPANY_NAME` / `company_name`
- `COMPANY_DOMAIN` / `company_domain`
- `COMPANY_INDUSTRY` / `company_industry`
- `LINKEDIN_URL` / `linkedin_url`

### System Fields
- `UP_ID` / `up_id`

---

## ✅ Verification Checklist

### Code Files to Check
- [ ] `client/src/lib/fieldMapping.ts` - AVAILABLE_FIELDS array
- [ ] `shared/types.ts` - TypeScript interfaces
- [ ] `server/routers/audiencelab.ts` - API router
- [ ] Any documentation files

### What to Verify
1. ✅ All UPPERCASE field names match this reference
2. ✅ All lowercase record keys match this reference
3. ✅ No `PHONE_NUMBER` anywhere (should be `PHONE`)
4. ✅ All underscores are present
5. ✅ No camelCase or PascalCase in API calls

---

## 🔗 API Documentation Links

- **Create Enrichment Job:** https://audiencelab.mintlify.app/api-reference/enrichment/create-enrichment-job
- **Enrich Contact:** https://audiencelab.mintlify.app/api-reference/enrichment/enrich-contact
- **Get Enrichments:** https://audiencelab.mintlify.app/api-reference/enrichment/get-enrichments

---

## 📝 Notes

1. **Always refer to this document** when adding new fields or modifying field mappings
2. **Never assume field names** - always verify against official API docs
3. **Test with API docs examples** - they show the exact format expected
4. **Update this document** if API documentation changes

---

**Last Verified:** December 14, 2025  
**API Version:** V3  
**Status:** ✅ Verified against official documentation
