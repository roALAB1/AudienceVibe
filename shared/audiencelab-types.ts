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
  refresh_interval: number | null;
  scheduled_refresh: boolean;
  webhook_url: string | null;
}

/**
 * Validated from GET /audiences response
 * Response structure: { data: Audience[], total: number }
 */
export interface AudiencesListResponse {
  data: Audience[];
  total: number;
}

/**
 * Official format from Mintlify documentation
 * https://audiencelab.mintlify.app/api-reference/audience/create-audience
 * 
 * Validated with 3/3 tests passing (December 13, 2025)
 */
export interface CreateAudienceRequest {
  name: string;                    // REQUIRED - Audience name
  filters: {
    age?: {
      minAge?: number;
      maxAge?: number;
    };
    city?: string[];
    businessProfile?: {
      industry?: string[];
    };
  };
  segment?: string[];              // Optional segment IDs
  days_back?: number;              // Optional lookback period
}

/**
 * Response from POST /audiences
 */
export interface CreateAudienceResponse {
  id: string;
  name: string;
  created_at: string;
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
 * Validated from GET /pixels response
 * Response structure: { data: Pixel[], total: number }
 */
export interface PixelsListResponse {
  data: Pixel[];
  total: number;
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

export interface EnrichmentJob {
  [key: string]: any;
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
 * ⚠️ NOT YET VALIDATED
 * Placeholder for GET /enrichment/jobs response
 */
export interface EnrichmentJobsListResponse {
  data: any[];
  total: number;
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
