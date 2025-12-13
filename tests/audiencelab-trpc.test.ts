/**
 * AudienceLab tRPC Routes Tests
 * 
 * Tests the server-side tRPC routes to ensure they work correctly
 */

import { describe, it, expect } from 'vitest';
import { appRouter } from '../server/routers';
import type { TrpcContext } from '../server/_core/context';

// Mock context for testing
const createMockContext = (): TrpcContext => ({
  req: {} as any,
  res: {} as any,
  user: null,
});

describe('AudienceLab tRPC Routes', () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  describe('Audiences Routes', () => {
    it('should list audiences with pagination', async () => {
      const result = await caller.audienceLabAPI.audiences.list({
        page: 1,
        pageSize: 20,
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('audiences');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.audiences)).toBe(true);
      expect(typeof result.total).toBe('number');
      
      console.log(`✅ Found ${result.total} audiences`);
      if (result.audiences.length > 0) {
        console.log(`✅ First audience: ${result.audiences[0].name} (${result.audiences[0].id})`);
      }
    });

    it('should get audience attributes', async () => {
      const result = await caller.audienceLabAPI.audiences.getAttributes();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      console.log(`✅ Found ${result.length} audience attributes`);
      if (result.length > 0) {
        console.log(`✅ First attribute: ${result[0].name} (${result[0].type})`);
      }
    });
  });

  describe('Enrichment Routes', () => {
    it('should enrich a contact', async () => {
      const result = await caller.audienceLabAPI.enrichment.enrichContact({
        email: 'test@example.com',
        fields: ['first_name', 'last_name', 'company_name'],
      });

      expect(result).toBeDefined();
      console.log('✅ Enrichment result:', JSON.stringify(result, null, 2));
    });

    it('should list enrichment jobs', async () => {
      const result = await caller.audienceLabAPI.enrichment.getJobs({
        page: 1,
        pageSize: 10,
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('jobs');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.jobs)).toBe(true);
      
      console.log(`✅ Found ${result.total} enrichment jobs`);
    });
  });

  describe('Pixels Routes', () => {
    it('should list pixels', async () => {
      const result = await caller.audienceLabAPI.pixels.list();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('pixels');
      expect(Array.isArray(result.pixels)).toBe(true);
      
      console.log(`✅ Found ${result.pixels.length} pixels`);
      if (result.pixels.length > 0) {
        console.log(`✅ First pixel: ${result.pixels[0].name} (${result.pixels[0].id})`);
      }
    });
  });
});
