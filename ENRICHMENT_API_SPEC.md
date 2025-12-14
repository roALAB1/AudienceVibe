# AudienceLab Create Enrichment Job API Specification

**Endpoint**: `POST /enrichments`  
**URL**: `https://api.audiencelab.io/enrichments`

---

## Authentication

**Header**: `X-Api-Key: <api-key>`

---

## Request Body

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
    },
    {
      "first_name": "Liam",
      "last_name": "Carter",
      "phone": "+18305550987",
      "email": "liam.carter@example.com"
    }
  ]
}
```

---

## Request Parameters

### `name` (string, required)
- Name of the enrichment job
- Example: `"Prospect Upload"`

### `records` (array of objects, required)
- Array of records to enrich
- Each record contains field data (lowercase keys)
- Example:
  ```json
  [
    {
      "first_name": "Ava",
      "last_name": "Stone",
      "phone": "+12145550123",
      "email": "ava.stone@example.com"
    }
  ]
  ```

### `operator` (enum, optional, default: "OR")
- Match operator for enrichment
- Values: `"AND"` or `"OR"`

### `columns` (array of strings, optional)
- Explicit list of fields included in each record
- **Accepted values** (UPPERCASE):
  - `EMAIL`
  - `PERSONAL_EMAIL`
  - `BUSINESS_EMAIL`
  - `FIRST_NAME`
  - `LAST_NAME`
  - `PHONE`
  - `PERSONAL_ADDRESS`
  - `PERSONAL_CITY`
  - `PERSONAL_STATE`
  - `PERSONAL_ZIP`
  - `COMPANY_NAME`
  - `COMPANY_DOMAIN`
  - `COMPANY_INDUSTRY`
  - `SHA256_PERSONAL_EMAIL`
  - `LINKEDIN_URL`
  - `UP_ID`

---

## Response

### Success (202 Accepted)

```json
{
  "jobId": "399e88c3-3263-4d9a-826c-437ef57f7b6c",
  "status": "IN_QUEUE"
}
```

**Fields:**
- `jobId` (string): Unique identifier for the enrichment job
- `status` (string): Job status (e.g., "IN_QUEUE")

### Error Responses

- **400**: Bad Request
- **401**: Unauthorized
- **500**: Internal Server Error

---

## Implementation Notes

### Key Mapping

**CSV Column → API Field**:
- CSV columns use `UPPERCASE_SNAKE_CASE` (e.g., `FIRST_NAME`)
- API `columns` array uses `UPPERCASE_SNAKE_CASE` (e.g., `FIRST_NAME`)
- API `records` objects use `lowercase_snake_case` (e.g., `first_name`)

### Example Transformation

**CSV**:
```csv
FIRST_NAME,LAST_NAME,EMAIL
John,Doe,john@example.com
```

**API Request**:
```json
{
  "name": "My Upload",
  "columns": ["FIRST_NAME", "LAST_NAME", "EMAIL"],
  "records": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    }
  ]
}
```

---

## Supported Fields (16 total)

1. `EMAIL`
2. `PERSONAL_EMAIL`
3. `BUSINESS_EMAIL`
4. `FIRST_NAME`
5. `LAST_NAME`
6. `PHONE`
7. `PERSONAL_ADDRESS`
8. `PERSONAL_CITY`
9. `PERSONAL_STATE`
10. `PERSONAL_ZIP`
11. `COMPANY_NAME`
12. `COMPANY_DOMAIN`
13. `COMPANY_INDUSTRY`
14. `SHA256_PERSONAL_EMAIL`
15. `LINKEDIN_URL`
16. `UP_ID`

---

## Next Steps

1. Create tRPC endpoint: `enrichment.createJob`
2. Transform CSV data + mappings → API format
3. Handle API response (jobId, status)
4. Show success/error toast
5. Redirect to enrichments list
