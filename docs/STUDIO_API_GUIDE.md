# Studio API Integration Guide

**Last Updated:** December 14, 2025  
**Status:** Verified through direct API testing

---

## Overview

This guide provides step-by-step instructions for integrating with AudienceLab's Studio API to access audience data programmatically.

---

## Prerequisites

1. **AudienceLab Account** with access to Studio
2. **API Key** from `https://build.audiencelab.io/home/:teamSlug/api-keys`
3. **Existing Audience** created via Audiences API or Pixel tracking
4. **Studio Segment** created from the audience (see Creating Segments section)

---

## Creating a Segment

Segments must be created through the Studio UI before they can be accessed via API.

### Step-by-Step Process:

1. **Navigate to Studio**
   ```
   https://build.audiencelab.io/home/:teamSlug/studio
   ```

2. **Select a Dataset** (Step 1)
   - Choose an existing audience from the list
   - Audiences can be created via Audiences API or Pixel tracking

3. **Build Filters** (Step 2) - Optional
   - Add filters to narrow down the data
   - Example: `city = "New York"` OR `industry = "Technology"`
   - Filters use AND/OR logic

4. **Choose Visible Fields** (Step 3)
   - Select which of the 74 enriched fields to include
   - Default: All fields selected
   - Common fields: FIRST_NAME, LAST_NAME, BUSINESS_EMAIL, COMPANY_NAME, JOB_TITLE

5. **Create Segment** (Step 4)
   - Click "Save First Segment" or "Save Current"
   - Enter a descriptive name
   - Click "Save Segment"

6. **Get API Endpoint** (Step 4)
   - Click "Show API" button
   - Copy the persistent endpoint URL
   - Format: `https://api.audiencelab.io/segments/{segment_id}?page=1&page_size=50`

---

## API Endpoint Format

### Base Endpoint

```
GET https://api.audiencelab.io/segments/:segment_id
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `page_size` | integer | No | 50 | Records per page (max: 10000) |

### Headers

```
X-API-KEY: your_api_key_here
```

---

## Example Requests

### cURL

```bash
curl -H "X-API-KEY: your_api_key" \
  "https://api.audiencelab.io/segments/04111f25-a796-494d-a8e0-a2dd541a5768?page=1&page_size=50"
```

### JavaScript (Fetch)

```javascript
const response = await fetch(
  'https://api.audiencelab.io/segments/04111f25-a796-494d-a8e0-a2dd541a5768?page=1&page_size=50',
  {
    headers: {
      'X-API-KEY': 'your_api_key'
    }
  }
);

const data = await response.json();
console.log(`Total records: ${data.total_records}`);
console.log(`First record:`, data.data[0]);
```

### TypeScript

```typescript
interface SegmentResponse {
  data: AudienceRecord[];
  segment_id: string;
  segment_name: string;
  total_records: number;
  total_pages: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

interface AudienceRecord {
  UUID: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  BUSINESS_EMAIL: string;
  PERSONAL_EMAIL: string;
  COMPANY_NAME: string;
  JOB_TITLE: string;
  // ... 67 more fields
}

async function getSegmentData(
  segmentId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<SegmentResponse> {
  const response = await fetch(
    `https://api.audiencelab.io/segments/${segmentId}?page=${page}&page_size=${pageSize}`,
    {
      headers: {
        'X-API-KEY': process.env.AUDIENCELAB_API_KEY!
      }
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
```

---

## Response Format

### Successful Response (200 OK)

```json
{
  "data": [
    {
      "UUID": "b90a22fe-9627-55a6-a4d3-b5ba044c28a8",
      "FIRST_NAME": "Wilson",
      "LAST_NAME": "Am",
      "BUSINESS_EMAIL": "",
      "PERSONAL_EMAIL": "gerscyfreshyauto@gmail.com",
      "PERSONAL_CITY": "Mount Holly",
      "PERSONAL_STATE": "NJ",
      "COMPANY_NAME": "",
      "JOB_TITLE": "",
      "DIRECT_NUMBER": "+16092225589",
      "MOBILE_PHONE": "+16092225589",
      "AGE_RANGE": "",
      "CHILDREN": "",
      "COMPANY_ADDRESS": "",
      "COMPANY_CITY": "",
      "COMPANY_DESCRIPTION": "",
      "COMPANY_DOMAIN": "",
      "COMPANY_EMPLOYEE_COUNT": "",
      "COMPANY_INDUSTRY": "",
      "COMPANY_LINKEDIN_URL": "",
      "COMPANY_NAICS": "",
      "COMPANY_NAME_HISTORY": "null",
      "COMPANY_PHONE": "",
      "COMPANY_REVENUE": "",
      "COMPANY_SIC": "",
      "COMPANY_STATE": "",
      "COMPANY_ZIP": "",
      "DEPARTMENT": "",
      "DIRECT_NUMBER_DNC": "N",
      "EDUCATION_HISTORY": "",
      "FACEBOOK_URL": "",
      "GENDER": "",
      "HEADLINE": "",
      "HOMEOWNER": "",
      "INCOME_RANGE": "",
      "INFERRED_YEARS_EXPERIENCE": "",
      "INTERESTS": "",
      "JOB_TITLE_HISTORY": "null",
      "LINKEDIN_URL": "",
      "MARRIED": "",
      "MOBILE_PHONE_DNC": "N",
      "NET_WORTH": "",
      "PERSONAL_ADDRESS": "",
      "PERSONAL_PHONE": "+16092225589",
      "PERSONAL_PHONE_DNC": "N",
      "PERSONAL_VERIFIED_EMAILS": "",
      "PERSONAL_ZIP": "",
      "PERSONAL_ZIP4": "",
      "SENIORITY_LEVEL": "",
      "SHA256_BUSINESS_EMAIL": "",
      "SHA256_PERSONAL_EMAIL": "e763530843e3483c287d8725676ed1a51052bf25aa527cc5dd40216ec2ab9ee6",
      "SKILLS": "",
      "SKIPTRACE_ADDRESS": "",
      "SKIPTRACE_B2B_ADDRESS": "",
      "SKIPTRACE_B2B_PHONE": "",
      "SKIPTRACE_B2B_SOURCE": "",
      "SKIPTRACE_B2B_WEBSITE": "",
      "SKIPTRACE_CITY": "",
      "SKIPTRACE_CREDIT_RATING": "",
      "SKIPTRACE_DNC": "",
      "SKIPTRACE_ETHNIC_CODE": "",
      "SKIPTRACE_EXACT_AGE": "",
      "SKIPTRACE_IP": "",
      "SKIPTRACE_LANDLINE_NUMBERS": "",
      "SKIPTRACE_LANGUAGE_CODE": "",
      "SKIPTRACE_MATCH_SCORE": "",
      "SKIPTRACE_NAME": "",
      "SKIPTRACE_STATE": "",
      "SKIPTRACE_WIRELESS_NUMBERS": "",
      "SKIPTRACE_ZIP": "",
      "SOCIAL_CONNECTIONS": "",
      "TWITTER_URL": "",
      "BUSINESS_VERIFIED_EMAILS": "",
      "VALID_PHONES": ""
    }
  ],
  "segment_id": "04111f25-a796-494d-a8e0-a2dd541a5768",
  "segment_name": "[MANUS TEST] Studio API Investigation",
  "total_records": 500000,
  "total_pages": 10000,
  "page": 1,
  "page_size": 50,
  "has_more": true
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `data` | array | Array of audience records with all selected fields |
| `segment_id` | string | UUID of the segment |
| `segment_name` | string | Name given when segment was created |
| `total_records` | integer | Total number of records in the segment |
| `total_pages` | integer | Total number of pages (based on page_size) |
| `page` | integer | Current page number |
| `page_size` | integer | Number of records per page |
| `has_more` | boolean | Whether more pages are available |

---

## Pagination

### Fetching All Records

```typescript
async function getAllSegmentRecords(segmentId: string): Promise<AudienceRecord[]> {
  const allRecords: AudienceRecord[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await getSegmentData(segmentId, page, 1000);
    allRecords.push(...response.data);
    hasMore = response.has_more;
    page++;

    // Optional: Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return allRecords;
}
```

### Pagination Best Practices

1. **Use large page_size** (up to 10,000) to minimize API calls
2. **Check `has_more`** instead of calculating pages manually
3. **Add delays** between requests to avoid rate limiting
4. **Handle errors** gracefully with retry logic
5. **Show progress** to users for large datasets

---

## Export to CSV

### Example Implementation

```typescript
function convertToCSV(records: AudienceRecord[]): string {
  if (records.length === 0) return '';

  // Get headers from first record
  const headers = Object.keys(records[0]);
  
  // Create CSV rows
  const rows = records.map(record => 
    headers.map(header => {
      const value = record[header as keyof AudienceRecord];
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    }).join(',')
  );

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
}

async function exportSegmentToCSV(segmentId: string, filename: string) {
  const records = await getAllSegmentRecords(segmentId);
  const csv = convertToCSV(records);
  
  // Node.js
  const fs = require('fs');
  fs.writeFileSync(filename, csv);
  
  // Browser
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
```

---

## Error Handling

### Common Errors

| Status Code | Error | Solution |
|-------------|-------|----------|
| 401 | Unauthorized | Check API key is correct and active |
| 404 | Not Found | Verify segment ID exists |
| 429 | Too Many Requests | Implement rate limiting and retry logic |
| 500 | Internal Server Error | Retry with exponential backoff |

### Retry Logic Example

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 429) {
        // Rate limited - wait and retry
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

---

## Rate Limiting

AudienceLab may implement rate limiting. Best practices:

1. **Limit concurrent requests** to 5-10 at a time
2. **Add delays** between requests (100-500ms)
3. **Implement exponential backoff** for 429 errors
4. **Cache responses** when appropriate
5. **Use webhooks** for real-time updates instead of polling

---

## Security Best Practices

1. **Never expose API keys** in client-side code
2. **Use environment variables** for API keys
3. **Implement server-side proxy** for client applications
4. **Rotate API keys** regularly
5. **Monitor API usage** for suspicious activity
6. **Use HTTPS** for all requests

---

## Complete Integration Example

```typescript
import { config } from 'dotenv';
config();

class StudioAPIClient {
  private apiKey: string;
  private baseURL = 'https://api.audiencelab.io';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getSegmentData(
    segmentId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<SegmentResponse> {
    const url = `${this.baseURL}/segments/${segmentId}?page=${page}&page_size=${pageSize}`;
    
    const response = await fetch(url, {
      headers: {
        'X-API-KEY': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async getAllRecords(segmentId: string): Promise<AudienceRecord[]> {
    const allRecords: AudienceRecord[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getSegmentData(segmentId, page, 1000);
      allRecords.push(...response.data);
      hasMore = response.has_more;
      page++;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allRecords;
  }

  async exportToCSV(segmentId: string, filename: string): Promise<void> {
    const records = await this.getAllRecords(segmentId);
    const csv = this.convertToCSV(records);
    
    const fs = require('fs');
    fs.writeFileSync(filename, csv);
    console.log(`Exported ${records.length} records to ${filename}`);
  }

  private convertToCSV(records: AudienceRecord[]): string {
    if (records.length === 0) return '';
    
    const headers = Object.keys(records[0]);
    const rows = records.map(record => 
      headers.map(header => {
        const value = record[header as keyof AudienceRecord];
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }
}

// Usage
const client = new StudioAPIClient(process.env.AUDIENCELAB_API_KEY!);

// Get first page
const data = await client.getSegmentData('04111f25-a796-494d-a8e0-a2dd541a5768');
console.log(`Total records: ${data.total_records}`);

// Export all records
await client.exportToCSV('04111f25-a796-494d-a8e0-a2dd541a5768', 'audience.csv');
```

---

## Next Steps

1. **Create a segment** in Studio UI
2. **Copy the segment ID** from the API endpoint
3. **Test the API** using cURL or Postman
4. **Implement pagination** for large datasets
5. **Add error handling** and retry logic
6. **Build export functionality** for your users

---

## Support

For issues or questions:
- **Documentation:** https://docs.audiencelab.io
- **Support:** https://help.manus.im
- **API Status:** https://status.audiencelab.io (if available)
