/**
 * API Log Service
 * 
 * Background service that periodically flushes API logs from memory to database
 * Runs every 30 seconds to batch insert logs for better performance
 */

import { apiLogger } from '../shared/apiLogger';
import { insertApiErrorLogs } from './db';

class ApiLogService {
  private flushInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  /**
   * Start the log flushing service
   */
  start(intervalMs = 30000): void {
    if (this.isRunning) {
      console.log('[ApiLogService] Service already running');
      return;
    }

    console.log(`[ApiLogService] Starting log flush service (interval: ${intervalMs}ms)`);
    this.isRunning = true;

    // Flush logs immediately on start
    this.flushLogs();

    // Set up periodic flushing
    this.flushInterval = setInterval(() => {
      this.flushLogs();
    }, intervalMs);
  }

  /**
   * Stop the log flushing service
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    console.log('[ApiLogService] Stopping log flush service');
    
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }

    // Flush any remaining logs before stopping
    this.flushLogs();
    
    this.isRunning = false;
  }

  /**
   * Flush buffered logs to database
   */
  private async flushLogs(): Promise<void> {
    try {
      const logs = apiLogger.getBufferedLogs();
      
      if (logs.length === 0) {
        return;
      }

      console.log(`[ApiLogService] Flushing ${logs.length} log(s) to database`);

      // Convert ApiLogEntry to InsertApiErrorLog format
      const dbLogs = logs.map(log => ({
        timestamp: log.timestamp,
        level: log.level,
        correlationId: log.correlationId,
        endpoint: log.endpoint,
        method: log.method,
        statusCode: log.statusCode,
        requestBody: log.requestBody ? JSON.stringify(log.requestBody) : null,
        responseBody: log.responseBody ? JSON.stringify(log.responseBody) : null,
        errorMessage: log.errorMessage || null,
        errorStack: log.errorStack || null,
        durationMs: log.durationMs,
        userId: log.userId,
      }));

      await insertApiErrorLogs(dbLogs);
      
      console.log(`[ApiLogService] Successfully flushed ${logs.length} log(s)`);
    } catch (error) {
      console.error('[ApiLogService] Failed to flush logs:', error);
      // Don't throw - logging failures shouldn't crash the service
    }
  }

  /**
   * Manually trigger a log flush (useful for testing or graceful shutdown)
   */
  async flush(): Promise<void> {
    await this.flushLogs();
  }
}

// Singleton instance
export const apiLogService = new ApiLogService();

// Auto-start in production
if (process.env.NODE_ENV === 'production') {
  apiLogService.start();
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[ApiLogService] SIGTERM received, flushing logs before exit');
  apiLogService.stop();
});

process.on('SIGINT', () => {
  console.log('[ApiLogService] SIGINT received, flushing logs before exit');
  apiLogService.stop();
});
