# API Logging System

## Overview

The AudienceLab Enrichment Dashboard includes a comprehensive API logging system that tracks all AudienceLab API calls, responses, and errors for production monitoring and debugging.

## Features

### 📘 Structured Logging
- **Request Tracking**: Logs all API requests with endpoint, method, body, and correlation ID
- **Response Tracking**: Logs successful responses with status code, body, and duration
- **Error Tracking**: Logs errors with status code, message, stack trace, and duration
- **Correlation IDs**: Unique identifiers to track entire request chains

### 🎯 Log Levels
- **INFO**: Normal API requests and responses
- **WARN**: Warnings (e.g., rate limit approaching)
- **ERROR**: Errors and failures
- **DEBUG**: Detailed debugging information

### 🗄️ Persistent Storage
- Logs are stored in the `api_error_logs` database table
- Background service flushes logs every 30 seconds
- Automatic body truncation for large payloads (>10KB)

### 📊 Admin Dashboard
- Real-time statistics (Total Logs, Errors, Warnings, Avg Duration)
- Filtering by endpoint, log level, and date range
- Search by error message or correlation ID
- Pagination for large log sets
- Export to CSV functionality

## Architecture

### Components

1. **API Logger (`shared/apiLogger.ts`)**
   - Centralized logging utility
   - Buffers logs in memory
   - Provides structured log entry interface

2. **API Log Service (`server/apiLogService.ts`)**
   - Background service that runs every 30 seconds
   - Flushes buffered logs to database
   - Handles graceful shutdown

3. **Database Schema (`drizzle/schema.ts`)**
   - `api_error_logs` table with 14 columns
   - Stores full request/response details
   - Indexed by timestamp for fast queries

4. **tRPC Router (`server/routers/apiLogs.ts`)**
   - `list`: Get paginated logs with filters
   - `stats`: Get aggregate statistics
   - `byCorrelationId`: Track request chains

5. **Admin UI (`client/src/pages/ApiLogsPage.tsx`)**
   - Dashboard with stats cards
   - Filterable table view
   - Pagination and search

## Usage

### Automatic Logging

All AudienceLab API calls are automatically logged through the `AudienceLabClient`:

```typescript
// Logs are automatically created for all API calls
const client = new AudienceLabClient(apiKey);
const audiences = await client.getAudiences(); // Logged automatically
```

### Manual Logging

You can also log custom API calls using the `logApiCall` wrapper:

```typescript
import { logApiCall } from '@/shared/apiLogger';

const result = await logApiCall(
  {
    endpoint: '/custom-endpoint',
    method: 'POST',
    requestBody: { data: 'example' },
    userId: 123,
  },
  async () => {
    // Your API call here
    return await fetch('/api/custom-endpoint', {
      method: 'POST',
      body: JSON.stringify({ data: 'example' }),
    });
  }
);
```

### Direct Logger Usage

For more control, use the logger directly:

```typescript
import { apiLogger } from '@/shared/apiLogger';

const correlationId = apiLogger.generateCorrelationId();

// Log request
apiLogger.logRequest({
  correlationId,
  endpoint: '/audiences',
  method: 'GET',
  requestBody: { page: 1 },
  userId: 123,
});

// Log response
apiLogger.logResponse({
  correlationId,
  endpoint: '/audiences',
  method: 'GET',
  statusCode: 200,
  responseBody: { data: [] },
  durationMs: 150,
  userId: 123,
});

// Log error
apiLogger.logError({
  correlationId,
  endpoint: '/audiences',
  method: 'POST',
  statusCode: 400,
  errorMessage: 'Invalid request',
  errorStack: error.stack,
  durationMs: 50,
  userId: 123,
});
```

## Configuration

### Environment Variables

- `NODE_ENV`: Controls logging behavior
  - `development`: Console logging enabled
  - `production`: Database logging enabled
- `LOG_LEVEL`: Minimum log level to record (default: `INFO`)
  - Options: `DEBUG`, `INFO`, `WARN`, `ERROR`

### Logger Configuration

Update logger configuration at runtime:

```typescript
import { apiLogger } from '@/shared/apiLogger';

apiLogger.updateConfig({
  enableConsole: true,
  enableDatabase: true,
  logLevel: 'DEBUG',
  maxBodySize: 20000, // 20KB
});
```

## Database Schema

```sql
CREATE TABLE api_error_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  level ENUM('INFO', 'WARN', 'ERROR', 'DEBUG') NOT NULL,
  correlationId VARCHAR(64) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  statusCode INT,
  requestBody TEXT,
  responseBody TEXT,
  errorMessage TEXT,
  errorStack TEXT,
  durationMs INT,
  userId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

## Admin Dashboard

Access the API Logs dashboard at `/api-logs` in the application.

### Features

1. **Stats Cards**
   - Total Logs
   - Error Count
   - Warning Count
   - Average Duration (ms)

2. **Filters**
   - Search by endpoint
   - Filter by log level
   - Date range filtering (coming soon)

3. **Table View**
   - Timestamp
   - Log Level (with color-coded badges)
   - HTTP Method
   - Endpoint
   - Status Code
   - Duration (ms)
   - Error Message

4. **Pagination**
   - 50 logs per page (configurable)
   - Previous/Next navigation

## Monitoring Best Practices

### 1. Error Rate Monitoring

Monitor the error rate to detect issues:

```typescript
const { data: stats } = trpc.apiLogs.stats.useQuery();
const errorRate = (stats.errorCount / stats.totalLogs) * 100;

if (errorRate > 5) {
  // Alert: High error rate detected
}
```

### 2. Correlation ID Tracking

Use correlation IDs to track entire request chains:

```typescript
const { data: logs } = trpc.apiLogs.byCorrelationId.useQuery({
  correlationId: '1765729594899-g5mwvj6q1',
});

// See all logs for this request chain
```

### 3. Performance Monitoring

Track API performance over time:

```typescript
const { data: stats } = trpc.apiLogs.stats.useQuery();
console.log(`Average API duration: ${stats.avgDurationMs}ms`);
```

### 4. Endpoint-Specific Monitoring

Filter logs by endpoint to debug specific issues:

```typescript
const { data: logs } = trpc.apiLogs.list.useQuery({
  endpoint: '/enrichments/jobs',
  level: 'ERROR',
});
```

## Testing

Run the test suite:

```bash
pnpm test apiLogger.test.ts
```

### Test Coverage

- ✅ Correlation ID generation
- ✅ Request logging
- ✅ Response logging
- ✅ Error logging
- ✅ Warning logging
- ✅ Debug logging
- ✅ Log buffer management
- ✅ API call wrapper
- ✅ Body truncation
- ✅ Correlation ID tracking

## Performance Considerations

### 1. Body Truncation

Large request/response bodies are automatically truncated to prevent excessive storage:

- Default limit: 10KB
- Truncated bodies include original size and preview
- Configurable via `maxBodySize` option

### 2. Batch Flushing

Logs are buffered in memory and flushed to database in batches:

- Default interval: 30 seconds
- Reduces database write operations
- Graceful shutdown flushes remaining logs

### 3. Async Logging

Logging operations are non-blocking:

- Logs are buffered immediately
- Database writes happen asynchronously
- Logging failures don't crash the application

## Troubleshooting

### Logs Not Appearing

1. Check log level configuration:
   ```typescript
   apiLogger.updateConfig({ logLevel: 'DEBUG' });
   ```

2. Verify database logging is enabled:
   ```typescript
   apiLogger.updateConfig({ enableDatabase: true });
   ```

3. Check if log service is running:
   ```bash
   # Should see: [ApiLogService] Starting log flush service
   ```

### High Database Usage

1. Increase flush interval:
   ```typescript
   apiLogService.start(60000); // 60 seconds
   ```

2. Reduce body size limit:
   ```typescript
   apiLogger.updateConfig({ maxBodySize: 5000 }); // 5KB
   ```

3. Implement log rotation:
   ```sql
   DELETE FROM api_error_logs WHERE createdAt < DATE_SUB(NOW(), INTERVAL 30 DAY);
   ```

## Future Enhancements

- [ ] Email alerts for high error rates
- [ ] Real-time log streaming via WebSocket
- [ ] Log aggregation and analytics
- [ ] Integration with external monitoring services (Sentry, DataDog)
- [ ] Automatic log rotation and archival
- [ ] Advanced filtering (date range, user ID)
- [ ] Export logs to CSV/JSON
- [ ] Log visualization charts

## Related Documentation

- [API Reference](./API_REFERENCE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)
