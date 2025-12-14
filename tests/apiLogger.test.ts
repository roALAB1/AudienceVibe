import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiLogger, logApiCall } from '../shared/apiLogger';

describe('API Logger', () => {
  beforeEach(() => {
    // Enable database logging for tests (default is production only)
    apiLogger.updateConfig({ enableDatabase: true });
    // Clear any buffered logs before each test
    apiLogger.getBufferedLogs();
  });

  describe('generateCorrelationId', () => {
    it('should generate unique correlation IDs', () => {
      const id1 = apiLogger.generateCorrelationId();
      const id2 = apiLogger.generateCorrelationId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });

  describe('logRequest', () => {
    it('should log API request with all details', () => {
      const correlationId = apiLogger.generateCorrelationId();
      
      apiLogger.logRequest({
        correlationId,
        endpoint: '/audiences',
        method: 'GET',
        requestBody: { page: 1 },
        userId: 123,
      });

      const logs = apiLogger.getBufferedLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toMatchObject({
        level: 'INFO',
        correlationId,
        endpoint: '/audiences',
        method: 'GET',
        userId: 123,
      });
      expect(logs[0].requestBody).toEqual({ page: 1 });
    });
  });

  describe('logResponse', () => {
    it('should log successful API response', () => {
      const correlationId = apiLogger.generateCorrelationId();
      
      apiLogger.logResponse({
        correlationId,
        endpoint: '/audiences',
        method: 'GET',
        statusCode: 200,
        responseBody: { data: [] },
        durationMs: 150,
        userId: 123,
      });

      const logs = apiLogger.getBufferedLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toMatchObject({
        level: 'INFO',
        correlationId,
        endpoint: '/audiences',
        method: 'GET',
        statusCode: 200,
        durationMs: 150,
        userId: 123,
      });
      expect(logs[0].responseBody).toEqual({ data: [] });
    });
  });

  describe('logError', () => {
    it('should log API error with full details', () => {
      const correlationId = apiLogger.generateCorrelationId();
      
      apiLogger.logError({
        correlationId,
        endpoint: '/audiences',
        method: 'POST',
        statusCode: 400,
        errorMessage: 'Invalid request',
        errorStack: 'Error: Invalid request\n  at ...',
        requestBody: { name: '' },
        responseBody: { error: 'Name is required' },
        durationMs: 50,
        userId: 123,
      });

      const logs = apiLogger.getBufferedLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toMatchObject({
        level: 'ERROR',
        correlationId,
        endpoint: '/audiences',
        method: 'POST',
        statusCode: 400,
        errorMessage: 'Invalid request',
        durationMs: 50,
        userId: 123,
      });
      expect(logs[0].errorStack).toContain('Error: Invalid request');
    });
  });

  describe('logWarning', () => {
    it('should log warning message', () => {
      const correlationId = apiLogger.generateCorrelationId();
      
      apiLogger.logWarning({
        correlationId,
        endpoint: '/audiences',
        method: 'GET',
        message: 'Rate limit approaching',
        userId: 123,
      });

      const logs = apiLogger.getBufferedLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toMatchObject({
        level: 'WARN',
        correlationId,
        endpoint: '/audiences',
        method: 'GET',
        errorMessage: 'Rate limit approaching',
        userId: 123,
      });
    });
  });

  describe('logDebug', () => {
    it('should log debug message with data', () => {
      // Enable DEBUG level logging for this test
      apiLogger.updateConfig({ logLevel: 'DEBUG' });
      const correlationId = apiLogger.generateCorrelationId();
      
      apiLogger.logDebug({
        correlationId,
        endpoint: '/audiences',
        method: 'GET',
        message: 'Cache hit',
        data: { cacheKey: 'audiences:1' },
        userId: 123,
      });

      const logs = apiLogger.getBufferedLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toMatchObject({
        level: 'DEBUG',
        correlationId,
        endpoint: '/audiences',
        method: 'GET',
        errorMessage: 'Cache hit',
        userId: 123,
      });
      expect(logs[0].requestBody).toEqual({ cacheKey: 'audiences:1' });
    });
  });

  describe('getBufferedLogs', () => {
    it('should return all buffered logs and clear buffer', () => {
      const correlationId = apiLogger.generateCorrelationId();
      
      apiLogger.logRequest({
        correlationId,
        endpoint: '/audiences',
        method: 'GET',
      });
      
      apiLogger.logResponse({
        correlationId,
        endpoint: '/audiences',
        method: 'GET',
        statusCode: 200,
        durationMs: 100,
      });

      const logs = apiLogger.getBufferedLogs();
      expect(logs).toHaveLength(2);

      // Buffer should be cleared
      const logsAgain = apiLogger.getBufferedLogs();
      expect(logsAgain).toHaveLength(0);
    });
  });

  describe('logApiCall wrapper', () => {
    it('should log successful API call', async () => {
      const mockApiCall = vi.fn().mockResolvedValue({ data: 'success' });

      const result = await logApiCall(
        {
          endpoint: '/audiences',
          method: 'GET',
          userId: 123,
        },
        mockApiCall
      );

      expect(result).toEqual({ data: 'success' });
      expect(mockApiCall).toHaveBeenCalledTimes(1);

      const logs = apiLogger.getBufferedLogs();
      expect(logs).toHaveLength(2); // Request + Response
      expect(logs[0].level).toBe('INFO'); // Request
      expect(logs[1].level).toBe('INFO'); // Response
      expect(logs[1].statusCode).toBe(200);
    });

    it('should log failed API call', async () => {
      const mockError = new Error('Network error');
      const mockApiCall = vi.fn().mockRejectedValue(mockError);

      await expect(
        logApiCall(
          {
            endpoint: '/audiences',
            method: 'POST',
            requestBody: { name: 'Test' },
            userId: 123,
          },
          mockApiCall
        )
      ).rejects.toThrow('Network error');

      const logs = apiLogger.getBufferedLogs();
      expect(logs).toHaveLength(2); // Request + Error
      expect(logs[0].level).toBe('INFO'); // Request
      expect(logs[1].level).toBe('ERROR'); // Error
      expect(logs[1].errorMessage).toBe('Network error');
      expect(logs[1].errorStack).toBeTruthy();
    });

    it('should track duration for both success and failure', async () => {
      // Successful call
      const mockSuccess = vi.fn().mockResolvedValue({ data: 'ok' });
      await logApiCall({ endpoint: '/test', method: 'GET' }, mockSuccess);
      
      const successLogs = apiLogger.getBufferedLogs();
      expect(successLogs[1].durationMs).toBeGreaterThanOrEqual(0);

      // Failed call
      const mockFailure = vi.fn().mockRejectedValue(new Error('Fail'));
      await expect(
        logApiCall({ endpoint: '/test', method: 'POST' }, mockFailure)
      ).rejects.toThrow();
      
      const failureLogs = apiLogger.getBufferedLogs();
      expect(failureLogs[1].durationMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('body truncation', () => {
    it('should truncate large request bodies', () => {
      const correlationId = apiLogger.generateCorrelationId();
      const largeBody = { data: 'x'.repeat(20000) }; // 20KB

      apiLogger.logRequest({
        correlationId,
        endpoint: '/audiences',
        method: 'POST',
        requestBody: largeBody,
      });

      const logs = apiLogger.getBufferedLogs();
      const loggedBody = logs[0].requestBody as any;
      
      expect(loggedBody._truncated).toBe(true);
      expect(loggedBody._originalSize).toBeGreaterThan(10000);
      expect(loggedBody._preview).toBeTruthy();
    });

    it('should not truncate small bodies', () => {
      const correlationId = apiLogger.generateCorrelationId();
      const smallBody = { name: 'Test Audience' };

      apiLogger.logRequest({
        correlationId,
        endpoint: '/audiences',
        method: 'POST',
        requestBody: smallBody,
      });

      const logs = apiLogger.getBufferedLogs();
      expect(logs[0].requestBody).toEqual(smallBody);
    });
  });

  describe('correlation ID tracking', () => {
    it('should use same correlation ID for request chain', () => {
      const correlationId = apiLogger.generateCorrelationId();

      apiLogger.logRequest({ correlationId, endpoint: '/audiences', method: 'GET' });
      apiLogger.logResponse({ correlationId, endpoint: '/audiences', method: 'GET', statusCode: 200, durationMs: 100 });

      const logs = apiLogger.getBufferedLogs();
      expect(logs[0].correlationId).toBe(correlationId);
      expect(logs[1].correlationId).toBe(correlationId);
    });
  });
});
