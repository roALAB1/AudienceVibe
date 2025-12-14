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
          }),
          segment: z.array(z.string()).optional(),
          days_back: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const client = getClient();
          return await client.createAudience(input);
        } catch (error: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'Failed to create audience',
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
          contacts: z.array(
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
            })
          ),
          fields: z.array(z.string()).optional(),
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
