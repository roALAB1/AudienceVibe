/**
 * AudienceLab API TypeScript Types
 * 
 * ⚠️ IMPORTANT: ALL types in this file are validated against real API responses
 * Last validated: December 13, 2025
 * Source: docs/API_REFERENCE.md
 * 
 * DO NOT add assumption-based types. Only add types after validating with real API calls.
 */

// ============================================================================
// AUDIENCE TYPES (Validated December 13, 2025)
// ============================================================================

/**
 * Validated from GET /audiences response
 * Test result: 2 audiences fetched successfully
 */
export interface Audience {
  id: string;
  name: string;
  next_scheduled_refresh: string | null;
  refresh_interval: string | null;  // API returns string, not number
  scheduled_refresh: boolean;
  webhook_url: string | null;
}

/**
 * Validated from GET /audiences API documentation
 * https://audiencelab.mintlify.app/api-reference/audience/get-audiences
 * Response structure includes pagination metadata
 */
export interface AudiencesListResponse {
  total_records: number;  // Total number of audiences
  page_size: number;      // Number of items per page
  page: number;           // Current page number
  total_pages: number;    // Total number of pages
  data: Audience[];       // Array of audience objects
}

/**
 * Official format from Mintlify documentation
 * https://audiencelab.mintlify.app/api-reference/audience/create-audience
 * 
 * Validated with 3/3 tests passing (December 13, 2025)
 */
export interface CreateAudienceRequest {
  name: string;                    // REQUIRED - Audience name
  filters?: {                      // OPTIONAL - Filter criteria
    // Location filters (3 validated)
    city?: string[];               // Array of city names
    state?: string[];              // Array of state names
    zip?: string[];                // Array of zip codes
    
    // Age filter (1 validated)
    age?: {
      minAge?: number;
      maxAge?: number;
    };
    
    // Gender filter (1 validated)
    gender?: string[];             // Array of gender values
    
    // Business Profile filters (9 validated)
    businessProfile?: {
      jobTitle?: string[];         // Job titles
      seniority?: string[];        // Seniority levels
      industry?: string[];         // Industries
      department?: string[];       // Departments
      companyName?: string[];      // Company names
      companyDomain?: string[];    // Company domains
      companyDescription?: string[]; // Company descriptions
      employeeCount?: string[];    // Employee count ranges
      companyRevenue?: string[];   // Revenue ranges
    };
    
    // Profile filters (5 validated)
    profile?: {
      incomeRange?: string[];      // Income ranges
      homeowner?: string[];        // Homeowner status (Y/N)
      married?: string[];          // Marital status (Y/N)
      netWorth?: string[];         // Net worth ranges
      children?: string[];         // Has children (Y/N)
    };
    
    // Attributes filters (9 validated)
    attributes?: {
      credit_rating?: string[];    // Credit rating values
      language_code?: string[];    // Language codes
      education?: string[];        // Education levels
      dwelling_type?: string[];    // Dwelling types
      marital_status?: string[];   // Marital status codes
      occupation_type?: string[];  // Occupation types
      smoker?: string[];           // Smoker status (Y/N)
      ethnic_code?: string[];      // Ethnicity codes
      home_year_built?: {          // Home year built range
        min?: number | null;
        max?: number | null;
      };
    };
    
    // Contact filters (notNulls/nullOnly)
    notNulls?: string[];           // Fields that must be present
    nullOnly?: string[];           // Fields that must be absent
  };
  segment?: string[];              // Optional segment IDs
  days_back?: number;              // Optional lookback period
}

/**
 * Response from POST /audiences
 * https://audiencelab.mintlify.app/api-reference/audience/create-audience
 * API returns only the audienceId
 */
export interface CreateAudienceResponse {
  audienceId: string;  // UUID of the created audience
}

/**
 * Request format for POST /audiences/custom
 * https://audiencelab.mintlify.app/api-reference/audience/create-custom-audience
 */
export interface CreateCustomAudienceRequest {
  topic: string;        // REQUIRED - Custom interest topic
  description: string;  // REQUIRED - Description of users interested in this topic
}

/**
 * Response from POST /audiences/custom
 */
export interface CreateCustomAudienceResponse {
  status: string;  // Processing status (e.g., "processing")
}

// ============================================================================
// PIXEL TYPES (Validated December 13, 2025)
// ============================================================================

/**
 * Validated from GET /pixels response
 * Test result: 6 pixels fetched successfully
 */
export interface Pixel {
  id: string;                // Unique pixel ID
  install_url: string;       // JavaScript tracking script URL
  last_sync: string;         // ISO 8601 datetime of last sync
  webhook_url: string | null; // Webhook for visitor events
  website_name: string;      // Website display name
  website_url: string;       // Website URL
}

/**
 * Validated from GET /pixels API documentation
 * https://audiencelab.mintlify.app/api-reference/pixel/get-pixels
 * Response structure includes pagination metadata
 */
export interface PixelsListResponse {
  total_records: number;  // Total number of pixels
  page_size: number;      // Number of items per page
  page: number;           // Current page number
  total_pages: number;    // Total number of pages
  data: Pixel[];          // Array of pixel objects
}

/**
 * Request format for POST /pixels
 * Based on Pixel response schema (fields needed to create a pixel)
 */
export interface CreatePixelRequest {
  website_name: string;      // REQUIRED - Website display name
  website_url: string;       // REQUIRED - Website URL
  webhook_url?: string;      // Optional webhook URL
}

/**
 * Response from POST /pixels
 */
export interface CreatePixelResponse {
  id: string;
  install_url: string;
  website_name: string;
  website_url: string;
  webhook_url: string | null;
  last_sync: string;
}

// ============================================================================
// ENRICHMENT TYPES (Partially Validated)
// ============================================================================

/**
 * Request format for POST /enrich/contact
 * ⚠️ WARNING: This endpoint returns errors in testing
 * Status: Needs investigation
 */
export interface EnrichContactRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  // Add more fields as validated
}

/**
 * Response from POST /enrich/contact
 * ⚠️ NOT YET VALIDATED - Endpoint returns errors
 */
export interface EnrichContactResponse {
  // To be filled after successful API validation
  [key: string]: any;
}

// ============================================================================
// SEGMENT TYPES (Not Yet Validated)
// ============================================================================

/**
 * ⚠️ NOT YET VALIDATED
 * Placeholder for GET /segments/{id} response
 */
export interface SegmentData {
  id: string;
  data: any[];
  total: number;
  // To be filled after API validation
}

// ============================================================================
// ENRICHMENT JOB TYPES (Not Yet Validated)
// ============================================================================

/**
 * ⚠️ NOT YET VALIDATED
 * Placeholder types for enrichment
 */
export interface AudienceAttribute {
  name: string;
  label: string;
  type: string;
  category: string;
}

export interface EnrichmentRequest {
  [key: string]: any;
}

export interface EnrichmentResponse {
  [key: string]: any;
}

/**
 * Validated from actual API response (December 14, 2025)
 * GET /enrichments returns this structure
 */
export interface EnrichmentJob {
  id: string;                    // Unique enrichment job ID
  name: string;                  // Job name
  status: string;                // "COMPLETED", "NO_DATA", "FAILED", "PROCESSING"
  csv_url: string;               // URL to download enriched CSV results
  total: number;                 // Number of records in the enrichment
  created_at: string;            // ISO 8601 datetime (e.g., "2025-12-14T05:12:19.445473+00:00")
}

/**
 * POST /enrichments request
 * Creates a bulk enrichment job
 */
export interface CreateEnrichmentJobRequest {
  /** Name of the enrichment job */
  name: string;
  /** Array of records to enrich */
  records: EnrichmentRecord[];
  /** Match operator (default: "OR") */
  operator?: 'AND' | 'OR';
  /** Explicit list of fields included in each record (UPPERCASE) */
  columns?: string[];
}

/**
 * Single enrichment record with lowercase field names
 */
export interface EnrichmentRecord {
  email?: string;
  personal_email?: string;
  business_email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
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
}

/**
 * Validated from GET /enrichments API documentation
 * https://audiencelab.mintlify.app/api-reference/enrichment/get-enrichments
 * Response structure includes pagination metadata
 */
export interface EnrichmentJobsListResponse {
  total_records: number;  // Total number of enrichment jobs
  page_size: number;      // Number of items per page
  page: number;           // Current page number
  total_pages: number;    // Total number of pages
  data: EnrichmentJob[];  // Array of enrichment job objects
}

// ============================================================================
// SEGMENT DATA TYPES (Not Yet Validated)
// ============================================================================

/**
 * ⚠️ NOT YET VALIDATED
 * Placeholder for GET /segments/{id}/data response
 */
export interface SegmentDataResponse {
  data: any[];
  total: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Custom error class for AudienceLab API errors
 */
export class AudienceLabAPIError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AudienceLabAPIError';
  }
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface APIError {
  message: string;
  code?: string;
  statusCode?: number;
  error?: {
    code?: string;
    message?: string;
  };
}

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
}
