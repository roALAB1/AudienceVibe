/**
 * Studio API Client
 * 
 * Provides access to AudienceLab's Studio API for viewing and exporting audience data.
 * Studio is the only way to access actual audience records programmatically.
 * 
 * @see docs/STUDIO_API_GUIDE.md for complete integration guide
 * @see docs/AUDIENCELAB_ARCHITECTURE.md for architecture overview
 */

export interface SegmentData {
  data: AudienceRecord[];
  segment_id: string;
  segment_name: string;
  total_records: number;
  total_pages: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface AudienceRecord {
  UUID: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  BUSINESS_EMAIL: string;
  PERSONAL_EMAIL: string;
  COMPANY_NAME: string;
  JOB_TITLE: string;
  PERSONAL_CITY: string;
  PERSONAL_STATE: string;
  COMPANY_INDUSTRY: string;
  SENIORITY_LEVEL: string;
  DEPARTMENT: string;
  AGE_RANGE: string;
  GENDER: string;
  LINKEDIN_URL: string;
  MOBILE_PHONE: string;
  DIRECT_NUMBER: string;
  COMPANY_DOMAIN: string;
  COMPANY_EMPLOYEE_COUNT: string;
  COMPANY_REVENUE: string;
  // ... all 74 fields (abbreviated for brevity)
  [key: string]: string | number | null;
}

export class StudioAPIClient {
  private baseURL = 'https://api.audiencelab.io';
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Studio API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Get segment data with pagination
   * 
   * @param segmentId - UUID of the Studio segment
   * @param page - Page number (1-indexed)
   * @param pageSize - Records per page (max 10000)
   * @returns Segment data with records and metadata
   */
  async getSegmentData(
    segmentId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<SegmentData> {
    if (!segmentId) {
      throw new Error('Segment ID is required');
    }

    if (page < 1) {
      throw new Error('Page must be >= 1');
    }

    if (pageSize < 1 || pageSize > 10000) {
      throw new Error('Page size must be between 1 and 10000');
    }

    const url = `${this.baseURL}/segments/${segmentId}?page=${page}&page_size=${pageSize}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Studio API error: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    return response.json();
  }

  /**
   * Get all records from a segment (handles pagination automatically)
   * 
   * WARNING: This can be slow and memory-intensive for large segments.
   * Use with caution for segments with >100k records.
   * 
   * @param segmentId - UUID of the Studio segment
   * @param onProgress - Optional callback for progress updates
   * @returns All records in the segment
   */
  async getAllRecords(
    segmentId: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<AudienceRecord[]> {
    const allRecords: AudienceRecord[] = [];
    let page = 1;
    let hasMore = true;
    let totalRecords = 0;

    while (hasMore) {
      const response = await this.getSegmentData(segmentId, page, 1000);
      
      if (page === 1) {
        totalRecords = response.total_records;
      }

      allRecords.push(...response.data);
      hasMore = response.has_more;
      page++;

      // Progress callback
      if (onProgress) {
        onProgress(allRecords.length, totalRecords);
      }

      // Rate limiting - wait 100ms between requests
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return allRecords;
  }

  /**
   * Get segment metadata without fetching records
   * 
   * @param segmentId - UUID of the Studio segment
   * @returns Segment metadata (name, total records, etc.)
   */
  async getSegmentMetadata(segmentId: string): Promise<{
    segment_id: string;
    segment_name: string;
    total_records: number;
    total_pages: number;
  }> {
    // Fetch just 1 record to get metadata
    const response = await this.getSegmentData(segmentId, 1, 1);
    
    return {
      segment_id: response.segment_id,
      segment_name: response.segment_name,
      total_records: response.total_records,
      total_pages: response.total_pages
    };
  }

  /**
   * Convert records to CSV format
   * 
   * @param records - Array of audience records
   * @returns CSV string
   */
  convertToCSV(records: AudienceRecord[]): string {
    if (records.length === 0) {
      return '';
    }

    // Get headers from first record
    const headers = Object.keys(records[0]);
    
    // Create CSV rows
    const rows = records.map(record => 
      headers.map(header => {
        const value = record[header];
        // Handle null/undefined
        if (value === null || value === undefined) {
          return '';
        }
        // Escape quotes and wrap in quotes if contains comma or newline
        const stringValue = String(value);
        const escaped = stringValue.replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('\n') 
          ? `"${escaped}"` 
          : escaped;
      }).join(',')
    );

    // Combine headers and rows
    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Export segment to CSV
   * 
   * @param segmentId - UUID of the Studio segment
   * @param onProgress - Optional callback for progress updates
   * @returns CSV string
   */
  async exportToCSV(
    segmentId: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<string> {
    const records = await this.getAllRecords(segmentId, onProgress);
    return this.convertToCSV(records);
  }
}
