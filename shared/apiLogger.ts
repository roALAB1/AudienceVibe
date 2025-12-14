/**
 * Centralized API Logger
 * 
 * Provides structured logging for all API calls with:
 * - Request/response tracking
 * - Error logging with stack traces
 * - Correlation IDs for request chains
 * - Environment-aware logging (dev vs production)
 * - Log levels (INFO, WARN, ERROR, DEBUG)
 */

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface ApiLogEntry {
  timestamp: Date;
  level: LogLevel;
  correlationId: string;
  endpoint: string;
  method: string;
  statusCode?: number;
  requestBody?: unknown;
  responseBody?: unknown;
  errorMessage?: string;
  errorStack?: string;
  durationMs?: number;
  userId?: number;
}

export interface ApiLoggerConfig {
  enableConsole: boolean;
  enableDatabase: boolean;
  logLevel: LogLevel;
  maxBodySize: number; // Max size of request/response body to log (in bytes)
}

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class ApiLogger {
  private config: ApiLoggerConfig;
  private logBuffer: ApiLogEntry[] = [];

  constructor(config?: Partial<ApiLoggerConfig>) {
    this.config = {
      enableConsole: process.env.NODE_ENV === 'development',
      enableDatabase: process.env.NODE_ENV === 'production',
      logLevel: (process.env.LOG_LEVEL as LogLevel) || 'INFO',
      maxBodySize: 10000, // 10KB default
      ...config,
    };
  }

  /**
   * Generate a unique correlation ID for tracking request chains
   */
  generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Check if a log level should be logged based on config
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.logLevel];
  }

  /**
   * Truncate large bodies to prevent excessive log storage
   */
  private truncateBody(body: unknown): unknown {
    if (!body) return body;
    
    const bodyStr = JSON.stringify(body);
    if (bodyStr.length <= this.config.maxBodySize) {
      return body;
    }

    return {
      _truncated: true,
      _originalSize: bodyStr.length,
      _preview: bodyStr.substring(0, this.config.maxBodySize),
    };
  }

  /**
   * Format log entry for console output with colors and emojis
   */
  private formatConsoleLog(entry: ApiLogEntry): string {
    const emoji = {
      INFO: '📘',
      WARN: '⚠️',
      ERROR: '🚨',
      DEBUG: '🔍',
    }[entry.level];

    const timestamp = entry.timestamp.toISOString();
    const duration = entry.durationMs ? ` (${entry.durationMs}ms)` : '';
    const status = entry.statusCode ? ` [${entry.statusCode}]` : '';

    let message = `${emoji} [${entry.level}] ${timestamp} ${entry.method} ${entry.endpoint}${status}${duration}`;
    
    if (entry.errorMessage) {
      message += `\n   Error: ${entry.errorMessage}`;
    }

    if (entry.correlationId) {
      message += `\n   Correlation ID: ${entry.correlationId}`;
    }

    return message;
  }

  /**
   * Log an API request
   */
  logRequest(params: {
    correlationId: string;
    endpoint: string;
    method: string;
    requestBody?: unknown;
    userId?: number;
  }): void {
    if (!this.shouldLog('INFO')) return;

    const entry: ApiLogEntry = {
      timestamp: new Date(),
      level: 'INFO',
      correlationId: params.correlationId,
      endpoint: params.endpoint,
      method: params.method,
      requestBody: this.truncateBody(params.requestBody),
      userId: params.userId,
    };

    this.logEntry(entry);
  }

  /**
   * Log a successful API response
   */
  logResponse(params: {
    correlationId: string;
    endpoint: string;
    method: string;
    statusCode: number;
    responseBody?: unknown;
    durationMs: number;
    userId?: number;
  }): void {
    if (!this.shouldLog('INFO')) return;

    const entry: ApiLogEntry = {
      timestamp: new Date(),
      level: 'INFO',
      correlationId: params.correlationId,
      endpoint: params.endpoint,
      method: params.method,
      statusCode: params.statusCode,
      responseBody: this.truncateBody(params.responseBody),
      durationMs: params.durationMs,
      userId: params.userId,
    };

    this.logEntry(entry);
  }

  /**
   * Log an API error
   */
  logError(params: {
    correlationId: string;
    endpoint: string;
    method: string;
    statusCode?: number;
    errorMessage: string;
    errorStack?: string;
    requestBody?: unknown;
    responseBody?: unknown;
    durationMs?: number;
    userId?: number;
  }): void {
    if (!this.shouldLog('ERROR')) return;

    const entry: ApiLogEntry = {
      timestamp: new Date(),
      level: 'ERROR',
      correlationId: params.correlationId,
      endpoint: params.endpoint,
      method: params.method,
      statusCode: params.statusCode,
      errorMessage: params.errorMessage,
      errorStack: params.errorStack,
      requestBody: this.truncateBody(params.requestBody),
      responseBody: this.truncateBody(params.responseBody),
      durationMs: params.durationMs,
      userId: params.userId,
    };

    this.logEntry(entry);
  }

  /**
   * Log a warning
   */
  logWarning(params: {
    correlationId: string;
    endpoint: string;
    method: string;
    message: string;
    userId?: number;
  }): void {
    if (!this.shouldLog('WARN')) return;

    const entry: ApiLogEntry = {
      timestamp: new Date(),
      level: 'WARN',
      correlationId: params.correlationId,
      endpoint: params.endpoint,
      method: params.method,
      errorMessage: params.message,
      userId: params.userId,
    };

    this.logEntry(entry);
  }

  /**
   * Log a debug message
   */
  logDebug(params: {
    correlationId: string;
    endpoint: string;
    method: string;
    message: string;
    data?: unknown;
    userId?: number;
  }): void {
    if (!this.shouldLog('DEBUG')) return;

    const entry: ApiLogEntry = {
      timestamp: new Date(),
      level: 'DEBUG',
      correlationId: params.correlationId,
      endpoint: params.endpoint,
      method: params.method,
      errorMessage: params.message,
      requestBody: params.data,
      userId: params.userId,
    };

    this.logEntry(entry);
  }

  /**
   * Internal method to process and store log entry
   */
  private logEntry(entry: ApiLogEntry): void {
    // Console logging (development)
    if (this.config.enableConsole) {
      console.log(this.formatConsoleLog(entry));
      
      // Show detailed info for errors
      if (entry.level === 'ERROR' && entry.errorStack) {
        console.error('Stack trace:', entry.errorStack);
      }
    }

    // Buffer for database storage (production)
    if (this.config.enableDatabase) {
      this.logBuffer.push(entry);
    }
  }

  /**
   * Get buffered logs for database persistence
   */
  getBufferedLogs(): ApiLogEntry[] {
    const logs = [...this.logBuffer];
    this.logBuffer = []; // Clear buffer after retrieval
    return logs;
  }

  /**
   * Update logger configuration
   */
  updateConfig(config: Partial<ApiLoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Singleton instance
export const apiLogger = new ApiLogger();

/**
 * Helper function to wrap API calls with automatic logging
 */
export async function logApiCall<T>(
  params: {
    endpoint: string;
    method: string;
    requestBody?: unknown;
    userId?: number;
  },
  apiCall: () => Promise<T>
): Promise<T> {
  const correlationId = apiLogger.generateCorrelationId();
  const startTime = Date.now();

  // Log request
  apiLogger.logRequest({
    correlationId,
    endpoint: params.endpoint,
    method: params.method,
    requestBody: params.requestBody,
    userId: params.userId,
  });

  try {
    // Execute API call
    const response = await apiCall();
    const durationMs = Date.now() - startTime;

    // Log successful response
    apiLogger.logResponse({
      correlationId,
      endpoint: params.endpoint,
      method: params.method,
      statusCode: 200, // Assume 200 for successful responses
      responseBody: response,
      durationMs,
      userId: params.userId,
    });

    return response;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    
    // Extract error details
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const statusCode = (error as any)?.response?.status || (error as any)?.statusCode;
    const responseBody = (error as any)?.response?.data;

    // Log error
    apiLogger.logError({
      correlationId,
      endpoint: params.endpoint,
      method: params.method,
      statusCode,
      errorMessage,
      errorStack,
      requestBody: params.requestBody,
      responseBody,
      durationMs,
      userId: params.userId,
    });

    // Re-throw error
    throw error;
  }
}
