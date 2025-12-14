/**
 * API Logs tRPC Router
 * 
 * Provides endpoints for viewing and analyzing API error logs
 */

import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { getApiErrorLogs, getApiErrorLogStats } from '../db';

export const apiLogsRouter = router({
  /**
   * Get paginated list of API logs with optional filters
   */
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(50),
        level: z.enum(['INFO', 'WARN', 'ERROR', 'DEBUG']).optional(),
        endpoint: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.pageSize;
      
      const logs = await getApiErrorLogs({
        limit: input.pageSize,
        offset,
        level: input.level,
        endpoint: input.endpoint,
        startDate: input.startDate,
        endDate: input.endDate,
      });

      return {
        logs,
        page: input.page,
        pageSize: input.pageSize,
        total: logs.length, // TODO: Get actual total count from database
      };
    }),

  /**
   * Get statistics about API logs
   */
  stats: protectedProcedure.query(async () => {
    const stats = await getApiErrorLogStats();
    
    // Calculate error rate (errors per hour)
    const errorRate = stats.totalLogs > 0 
      ? (stats.errorCount / stats.totalLogs) * 100 
      : 0;

    return {
      ...stats,
      errorRate: Math.round(errorRate * 10) / 10, // Round to 1 decimal place
    };
  }),

  /**
   * Get logs for a specific correlation ID (track entire request chain)
   */
  byCorrelationId: protectedProcedure
    .input(z.object({ correlationId: z.string() }))
    .query(async ({ input }) => {
      const logs = await getApiErrorLogs({
        limit: 100,
        offset: 0,
      });

      // Filter by correlation ID (would be done in SQL query in production)
      return logs.filter(log => log.correlationId === input.correlationId);
    }),
});
