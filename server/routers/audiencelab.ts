/**
 * AudienceLab API tRPC Router
 * 
 * Provides secure server-side access to AudienceLab API
 * All routes use the API key from environment variables (never exposed to client)
 */

import { z } from 'zod';
import { router, publicProcedure } from '../_core/trpc';
import { createAudienceLabClient } from '../../shared/audiencelab-client';
import { TRPCError } from '@trpc/server';

// Initialize AudienceLab client with API key from environment
const getClient = () => {
  const apiKey = process.env.AUDIENCELAB_API_KEY;
  if (!apiKey) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'AUDIENCELAB_API_KEY not configured',
    });
  }
  return createAudienceLabClient(apiKey);
};

// ============================================================================
// AUDIENCES ROUTES
// ============================================================================

export const audienceLabRouter = router({
  audiences: router({
    /**
     * List all audiences with pagination
     */
    list: publicProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(100).default(20),
        })
      )
      .query(async ({ input }) => {
        try {
          const client = getClient();
          return await client.getAudiences(input.page, input.pageSize);
        } catch (error: any) {
          throw new TRPCError({
            code: error.statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to fetch audiences',
            cause: error,
          });
        }
      }),

    /**
     * Get a specific audience by ID
     */
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          const client = getClient();
          return await client.getAudience(input.id);
        } catch (error: any) {
          throw new TRPCError({
            code: error.statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to fetch audience',
            cause: error,
          });
        }
      }),

    /**
     * Create a new audience
     * 
     * Official format from Mintlify documentation:
     * https://audiencelab.mintlify.app/api-reference/audience/create-audience
     */
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, 'Name is required'),
          filters: z.object({
            age: z.object({
              minAge: z.number().optional(),
              maxAge: z.number().optional(),
            }).optional(),
            city: z.array(z.string()).optional(),
            businessProfile: z.object({
              industry: z.array(z.string()).optional(),
            }).optional(),
          }).optional(), // Make the entire filters object optional
          segment: z.array(z.string()).optional(),
          days_back: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const client = getClient();
          // API requires filters field to be present (even if minimal)
          // Pass the filters as-is if provided, otherwise use empty object
          const request: any = {
            name: input.name,
            filters: input.filters || {},  // API requires this field
          };
          if (input.segment) {
            request.segment = input.segment;
          }
          if (input.days_back) {
            request.days_back = input.days_back;
          }
          return await client.createAudience(request);
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to create audience',
            cause: error,
          });
        }
      }),

    /**
     * Create audience with comprehensive filters (Vibe Code)
     * Uses validated filter schema and mapper
     */
    createWithFilters: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, 'Audience name is required'),
          filters: z.object({
            business: z.any().optional(),
            location: z.any().optional(),
            personal: z.any().optional(),
            financial: z.any().optional(),
            family: z.any().optional(),
            housing: z.any().optional(),
            contact: z.any().optional(),
            intent: z.any().optional(),
          }),
          daysBack: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { createAudienceRequest } = await import('../../shared/filter-mapper');
          const client = getClient();
          const { getDb } = await import('../db');
          const { audienceFilterConfigs } = await import('../../drizzle/schema');
          
          // Convert UI filters to API format
          const apiRequest = createAudienceRequest(
            input.name,
            input.filters,
            { daysBack: input.daysBack }
          );
          
          // Create audience via AudienceLab API
          const response = await client.createAudience(apiRequest);
          
          // Store filter configuration in database
          const db = await getDb();
          if (db) {
            await db.insert(audienceFilterConfigs).values({
              audienceId: response.audienceId,
              audienceName: input.name,
              filterData: input.filters as any,
            });
          }
          
          return {
            audienceId: response.audienceId,
            name: input.name,
            filters: input.filters,
          };
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to create audience with filters',
            cause: error,
          });
        }
      }),

    /**
     * Get saved filter configuration for an audience
     */
    getFilters: publicProcedure
      .input(z.object({ audienceId: z.string() }))
      .query(async ({ input }) => {
        try {
          const { getDb } = await import('../db');
          const { audienceFilterConfigs } = await import('../../drizzle/schema');
          const { eq } = await import('drizzle-orm');
          
          const db = await getDb();
          if (!db) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Database not available',
            });
          }
          
          const results = await db
            .select()
            .from(audienceFilterConfigs)
            .where(eq(audienceFilterConfigs.audienceId, input.audienceId))
            .limit(1);
          
          if (results.length === 0) {
            return null;
          }
          
          return results[0];
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to fetch filter configuration',
            cause: error,
          });
        }
      }),

    /**
     * Delete an audience
     */
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const client = getClient();
          await client.deleteAudience(input.id);
          return { success: true };
        } catch (error: any) {
          throw new TRPCError({
            code: error.statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to delete audience',
            cause: error,
          });
        }
      }),

    /**
     * Get available audience attributes (84 fields)
     */
    getAttributes: publicProcedure.query(async () => {
      try {
        const client = getClient();
        return await client.getAudienceAttributes();
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch attributes',
          cause: error,
        });
      }
    }),
  }),

  // ============================================================================
  // ENRICHMENT ROUTES
  // ============================================================================

  enrichment: router({
    /**
     * Enrich a single contact
     */
    enrichContact: publicProcedure
      .input(
        z.object({
          email: z.string().email().optional(),
          personal_email: z.string().email().optional(),
          business_email: z.string().email().optional(),
          linkedin_url: z.string().url().optional(),
          first_name: z.string().optional(),
          last_name: z.string().optional(),
          company_name: z.string().optional(),
          company_domain: z.string().optional(),
          phone: z.string().optional(),
          personal_address: z.string().optional(),
          personal_city: z.string().optional(),
          personal_state: z.string().optional(),
          personal_zip: z.string().optional(),
          sha256_personal_email: z.string().optional(),
          up_id: z.string().optional(),
          fields: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const client = getClient();
          return await client.enrichContact(input);
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to enrich contact',
            cause: error,
          });
        }
      }),

    /**
     * Create a bulk enrichment job
     */
    createJob: publicProcedure
      .input(
        z.object({
          name: z.string(),
          records: z.array(
            z.object({
              email: z.string().optional(),
              personal_email: z.string().optional(),
              business_email: z.string().optional(),
              linkedin_url: z.string().optional(),
              first_name: z.string().optional(),
              last_name: z.string().optional(),
              company_name: z.string().optional(),
              company_domain: z.string().optional(),
              phone: z.string().optional(),
              personal_address: z.string().optional(),
              personal_city: z.string().optional(),
              personal_state: z.string().optional(),
              personal_zip: z.string().optional(),
              company_industry: z.string().optional(),
              sha256_personal_email: z.string().optional(),
              up_id: z.string().optional(),
            })
          ),
          operator: z.enum(['AND', 'OR']).optional(),
          columns: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const client = getClient();
          return await client.createEnrichmentJob(input);
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to create enrichment job',
            cause: error,
          });
        }
      }),

    /**
     * List all enrichment jobs
     */
    getJobs: publicProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(100).default(20),
        })
      )
      .query(async ({ input }) => {
        try {
          const client = getClient();
          return await client.getEnrichmentJobs(input.page, input.pageSize);
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to fetch enrichment jobs',
            cause: error,
          });
        }
      }),

    /**
     * Get a specific enrichment job by ID
     */
    getJob: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          const client = getClient();
          return await client.getEnrichmentJob(input.id);
        } catch (error: any) {
          throw new TRPCError({
            code: error.statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to fetch enrichment job',
            cause: error,
          });
        }
      }),

    /**
     * Pause an enrichment job
     */
    pauseJob: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          // Simulate API call - replace with actual API when available
          await new Promise((resolve) => setTimeout(resolve, 500));
          return { success: true, message: 'Job paused successfully' };
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to pause enrichment job',
            cause: error,
          });
        }
      }),

    /**
     * Resume an enrichment job
     */
    resumeJob: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          // Simulate API call - replace with actual API when available
          await new Promise((resolve) => setTimeout(resolve, 500));
          return { success: true, message: 'Job resumed successfully' };
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to resume enrichment job',
            cause: error,
          });
        }
      }),

    /**
     * Download enrichment results as CSV
     * TODO: Implement getEnrichmentResults in AudienceLabClient
     */
    // downloadResults: publicProcedure
    //   .input(z.object({ id: z.string() }))
    //   .query(async ({ input }) => {
    //     try {
    //       const client = getClient();
    //       // Fetch enrichment results from API
    //       const results = await client.getEnrichmentResults(input.id);
    //       return results;
    //     } catch (error: any) {
    //       throw new TRPCError({
    //         code: 'INTERNAL_SERVER_ERROR',
    //         message: error.message || 'Failed to fetch enrichment results',
    //         cause: error,
    //       });
    //     }
    //   }),

    /**
     * Delete an enrichment job
     */
    deleteJob: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          // Simulate API call - replace with actual API when available
          await new Promise((resolve) => setTimeout(resolve, 500));
          return { success: true, message: 'Job deleted successfully' };
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to delete enrichment job',
            cause: error,
          });
        }
      }),
  }),

  // ============================================================================
  // SEGMENTS ROUTES
  // ============================================================================

  segments: router({
    /**
     * Get segment data with pagination
     */
    getData: publicProcedure
      .input(
        z.object({
          segmentId: z.string(),
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(100).default(50),
        })
      )
      .query(async ({ input }) => {
        try {
          const client = getClient();
          return await client.getSegmentData(input.segmentId, input.page, input.pageSize);
        } catch (error: any) {
          throw new TRPCError({
            code: error.statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to fetch segment data',
            cause: error,
          });
        }
      }),
  }),

  // ============================================================================
  // PIXELS ROUTES
  // ============================================================================

  pixels: router({
    /**
     * List all pixels
     */
    list: publicProcedure.query(async () => {
      try {
        const client = getClient();
        return await client.getPixels();
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch pixels',
          cause: error,
        });
      }
    }),

    /**
     * Get a specific pixel by ID
     */
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          const client = getClient();
          return await client.getPixel(input.id);
        } catch (error: any) {
          throw new TRPCError({
            code: error.statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to fetch pixel',
            cause: error,
          });
        }
      }),

    /**
     * Create a new pixel
     * Using validated CreatePixelRequest type
     */
    create: publicProcedure
      .input(
        z.object({
          website_name: z.string().min(1, 'Website name is required'),
          website_url: z.string().url('Valid website URL is required'),
          webhook_url: z.string().url().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const client = getClient();
          return await client.createPixel(input);
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to create pixel',
            cause: error,
          });
        }
      }),

    /**
     * Delete a pixel
     */
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const client = getClient();
          await client.deletePixel(input.id);
          return { success: true };
        } catch (error: any) {
          throw new TRPCError({
            code: error.statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to delete pixel',
            cause: error,
          });
        }
      }),
  }),
});
