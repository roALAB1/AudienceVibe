/**
 * AudienceLab API Client
 * 
 * Provides a typed interface to the AudienceLab API with:
 * - Automatic retry logic (exponential backoff)
 * - Error handling (404, 429, 500)
 * - TypeScript type safety
 * - Request/response validation
 */

import type {
  Audience,
  AudiencesListResponse,
  CreateAudienceRequest,
  AudienceAttribute,
  EnrichmentRequest,
  EnrichmentResponse,
  EnrichmentJob,
  EnrichmentJobsListResponse,
  CreateEnrichmentJobRequest,
  SegmentDataResponse,
  Pixel,
  PixelsListResponse,
  CreatePixelRequest,
  APIError,
} from './audiencelab-types';

import { AudienceLabAPIError } from './audiencelab-types';

export class AudienceLabClient {
  private baseURL: string;
  private apiKey: string;
  private maxRetries: number;

  constructor(apiKey: string, options?: { baseURL?: string; maxRetries?: number }) {
    this.apiKey = apiKey;
    this.baseURL = options?.baseURL || 'https://api.audiencelab.io';
    this.maxRetries = options?.maxRetries || 3;
  }

  /**
   * Make an HTTP request with retry logic
   */
  private async request<T>(
    method: string,
    path: string,
    options?: {
      body?: any;
      params?: Record<string, string | number>;
      retryCount?: number;
    }
  ): Promise<T> {
    const retryCount = options?.retryCount || 0;
    
    // Build URL with query params
    const url = new URL(path, this.baseURL);
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    // Build request
    const requestInit: RequestInit = {
      method,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (options?.body) {
      requestInit.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url.toString(), requestInit);

      // Handle successful responses
      if (response.ok) {
        return await response.json();
      }

      // Handle error responses
      const errorData: APIError = await response.json().catch(() => ({
        error: {
          code: 'UNKNOWN_ERROR',
          message: response.statusText,
        },
      }));

      // Retry on 429 (rate limit) and 500 (server error)
      if (
        (response.status === 429 || response.status >= 500) &&
        retryCount < this.maxRetries
      ) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Retrying request (attempt ${retryCount + 1}/${this.maxRetries}) after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request<T>(method, path, {
          ...options,
          retryCount: retryCount + 1,
        });
      }

      // Throw error if no retry or max retries exceeded
      throw new AudienceLabAPIError(
        errorData.error.code,
        errorData.error.message,
        response.status
      );
    } catch (error) {
      if (error instanceof AudienceLabAPIError) {
        throw error;
      }
      // Network error or other unexpected error
      throw new AudienceLabAPIError(
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }

  // ============================================================================
  // AUDIENCES API
  // ============================================================================

  /**
   * List all audiences with pagination
   */
  async getAudiences(page = 1, pageSize = 50): Promise<AudiencesListResponse> {
    return this.request<AudiencesListResponse>('GET', '/audiences', {
      params: { page, page_size: pageSize },
    });
  }

  /**
   * Create a new audience
   */
  async createAudience(data: CreateAudienceRequest): Promise<Audience> {
    return this.request<Audience>('POST', '/audiences', { body: data });
  }

  /**
   * Get a specific audience by ID
   */
  async getAudience(id: string): Promise<Audience> {
    return this.request<Audience>('GET', `/audiences/${id}`);
  }

  /**
   * Delete an audience
   */
  async deleteAudience(id: string): Promise<void> {
    return this.request<void>('DELETE', `/audiences/${id}`);
  }

  /**
   * Get available audience attributes (84 fields)
   */
  async getAudienceAttributes(): Promise<AudienceAttribute[]> {
    return this.request<AudienceAttribute[]>('GET', '/audiences/attributes');
  }

  // ============================================================================
  // ENRICHMENT API
  // ============================================================================

  /**
   * Enrich a single contact
   */
  async enrichContact(data: EnrichmentRequest): Promise<EnrichmentResponse> {
    return this.request<EnrichmentResponse>('POST', '/enrich/contact', { body: data });
  }

  /**
   * Create a bulk enrichment job
   */
  async createEnrichmentJob(data: CreateEnrichmentJobRequest): Promise<EnrichmentJob> {
    return this.request<EnrichmentJob>('POST', '/enrichments', { body: data });
  }

  /**
   * List all enrichment jobs
   */
  async getEnrichmentJobs(page = 1, pageSize = 50): Promise<EnrichmentJobsListResponse> {
    return this.request<EnrichmentJobsListResponse>('GET', '/enrichments', {
      params: { page, page_size: pageSize },
    });
  }

  /**
   * Get a specific enrichment job by ID
   */
  async getEnrichmentJob(id: string): Promise<EnrichmentJob> {
    return this.request<EnrichmentJob>('GET', `/enrichments/${id}`);
  }

  // ============================================================================
  // STUDIO SEGMENTS API
  // ============================================================================

  /**
   * Get segment data with pagination
   */
  async getSegmentData(
    segmentId: string,
    page = 1,
    pageSize = 50
  ): Promise<SegmentDataResponse> {
    return this.request<SegmentDataResponse>('GET', `/segments/${segmentId}`, {
      params: { page, page_size: pageSize },
    });
  }

  // ============================================================================
  // PIXELS API
  // ============================================================================

  /**
   * List all pixels
   */
  async getPixels(): Promise<PixelsListResponse> {
    return this.request<PixelsListResponse>('GET', '/pixels');
  }

  /**
   * Create a new pixel
   */
  async createPixel(data: CreatePixelRequest): Promise<Pixel> {
    return this.request<Pixel>('POST', '/pixels', { body: data });
  }

  /**
   * Get a specific pixel by ID
   */
  async getPixel(id: string): Promise<Pixel> {
    return this.request<Pixel>('GET', `/pixels/${id}`);
  }

  /**
   * Delete a pixel
   */
  async deletePixel(id: string): Promise<void> {
    return this.request<void>('DELETE', `/pixels/${id}`);
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  /**
   * Check API health status
   */
  async getStatus(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('GET', '/v1/status');
  }
}

/**
 * Create a new AudienceLab API client instance
 */
export function createAudienceLabClient(apiKey: string, options?: { baseURL?: string; maxRetries?: number }) {
  return new AudienceLabClient(apiKey, options);
}
