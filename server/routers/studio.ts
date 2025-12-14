/**
 * Studio tRPC Router
 * 
 * Provides server-side endpoints for accessing Studio API (audience data access layer)
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { StudioAPIClient } from '../../shared/studio-client';
import { segmentMappingService } from '../services/segment-mapping';

// Initialize Studio API client with API key from environment
const getStudioClient = () => {
  const apiKey = process.env.AUDIENCELAB_API_KEY;
  if (!apiKey) {
    throw new Error('AUDIENCELAB_API_KEY environment variable is not set');
  }
  return new StudioAPIClient(apiKey);
};

export const studioRouter = router({
  /**
   * Get segment data with pagination
   */
  getSegmentData: publicProcedure
    .input(z.object({
      segmentId: z.string().uuid('Segment ID must be a valid UUID'),
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(10000).default(50)
    }))
    .query(async ({ input }) => {
      const client = getStudioClient();
      return client.getSegmentData(input.segmentId, input.page, input.pageSize);
    }),

  /**
   * Get segment metadata (without fetching all records)
   */
  getSegmentMetadata: publicProcedure
    .input(z.object({
      segmentId: z.string().uuid('Segment ID must be a valid UUID')
    }))
    .query(async ({ input }) => {
      const client = getStudioClient();
      return client.getSegmentMetadata(input.segmentId);
    }),

  /**
   * Export segment to CSV
   * 
   * WARNING: This can be slow for large segments (>100k records)
   */
  exportSegment: publicProcedure
    .input(z.object({
      segmentId: z.string().uuid('Segment ID must be a valid UUID')
    }))
    .mutation(async ({ input }) => {
      const client = getStudioClient();
      const csv = await client.exportToCSV(input.segmentId);
      
      return {
        csv,
        recordCount: csv.split('\n').length - 1 // Subtract header row
      };
    }),

  /**
   * Link a Studio segment to an audience
   */
  linkSegment: publicProcedure
    .input(z.object({
      audienceId: z.string().min(1, 'Audience ID is required'),
      audienceName: z.string().min(1, 'Audience name is required'),
      segmentId: z.string().uuid('Segment ID must be a valid UUID'),
      segmentName: z.string().min(1, 'Segment name is required')
    }))
    .mutation(async ({ input }) => {
      // Get segment metadata to verify it exists and get record count
      const client = getStudioClient();
      const metadata = await client.getSegmentMetadata(input.segmentId);

      // Create mapping
      await segmentMappingService.createMapping(
        input.audienceId,
        input.audienceName,
        input.segmentId,
        input.segmentName,
        metadata.total_records
      );

      return {
        success: true,
        totalRecords: metadata.total_records
      };
    }),

  /**
   * Get segment mapping for an audience
   */
  getSegmentForAudience: publicProcedure
    .input(z.object({
      audienceId: z.string().min(1, 'Audience ID is required')
    }))
    .query(async ({ input }) => {
      return segmentMappingService.getSegmentForAudience(input.audienceId);
    }),

  /**
   * Get all segment mappings
   */
  getAllMappings: publicProcedure
    .query(async () => {
      return segmentMappingService.getAllMappings();
    }),

  /**
   * Delete segment mapping
   */
  deleteMapping: publicProcedure
    .input(z.object({
      audienceId: z.string().min(1, 'Audience ID is required')
    }))
    .mutation(async ({ input }) => {
      await segmentMappingService.deleteMapping(input.audienceId);
      return { success: true };
    })
});
