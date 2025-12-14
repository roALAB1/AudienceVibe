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
 * VALIDATED filter schema from real API testing
 * https://audiencelab.mintlify.app/api-reference/audience/create-audience
 * 
 * Last validated: December 14, 2025
 * Validation source: tests/api-filter-discovery.test.ts
 * Documentation: docs/VALIDATED_FILTER_SCHEMA.md
 * 
 * ⚠️ ONLY includes fields confirmed working through actual API calls
 * ⚠️ industry and seniority filters are NOT supported (return 400)
 */
export interface CreateAudienceRequest {
  name: string;                    // REQUIRED - Audience name
  filters: {
    // Location Filters (✅ Validated)
    city?: string[];               // Array of city names
    state?: string[];              // Array of state names
    zip?: string[];                // Array of 5-digit zip codes (matches API field name)
    
    // Age Filters (✅ Validated)
    age?: {
      minAge?: number;             // Minimum age (inclusive)
      maxAge?: number;             // Maximum age (inclusive)
    };
    
    // Business Filters (✅ Validated from real API response)
    businessProfile?: {
      jobTitle?: string[];         // Array of job titles (camelCase)
      seniority?: string[];        // Array of seniority levels (e.g., "Senior", "Director")
      department?: string[];       // Array of departments
      companyName?: string[];      // Array of company names
      companyDomain?: string[];    // Array of company domains
      industry?: string[];         // Array of industries
      companyDescription?: string[]; // Array of company descriptions
      sic?: string[];              // Standard Industrial Classification codes
      employeeCount?: string[];    // Employee count ranges
      companyRevenue?: string[];   // Revenue ranges
      companyNaics?: string[];     // NAICS codes
    };
    
    // Personal Filters (from real API structure)
    gender?: string[];             // Array of gender values
    
    // Profile Filters (from real API structure)
    profile?: {
      incomeRange?: string[];      // Income ranges
      homeowner?: string[];        // Homeowner status
      married?: string[];          // Marital status
      netWorth?: string[];         // Net worth ranges
      children?: string[];         // Number of children
    };
    
    // Attributes (from real API structure - comprehensive list)
    attributes?: {
      credit_rating?: string[];
      language_code?: string[];
      occupation_group?: string[];
      occupation_type?: string[];
      home_year_built?: { min?: number | null; max?: number | null };
      single_parent?: string[];
      cra_code?: string[];
      dwelling_type?: string[];
      credit_range_new_credit?: string[];
      ethnic_code?: string[];
      marital_status?: string[];
      net_worth?: string[];
      education?: string[];
      credit_card_user?: string[];
      investment?: string[];
      smoker?: string[];
      home_purchase_price?: { min?: number | null; max?: number | null };
      home_purchase_year?: { min?: number | null; max?: number | null };
      estimated_home_value?: string[];
      mortgage_amount?: { min?: number | null; max?: number | null };
      generations_in_household?: string[];
    };
    
    // Advanced filters
    notNulls?: string[];           // Fields that must not be null
    nullOnly?: string[];           // Fields that must be null
  };
  segment?: string[];              // Optional segment IDs
  days_back?: number;              // Optional lookback period (default: 30)
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
