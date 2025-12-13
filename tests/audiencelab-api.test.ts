/**
 * AudienceLab API Client Tests
 * 
 * Validates that the API key is correct and the API client works
 */

import { describe, it, expect } from 'vitest';
import { createAudienceLabClient } from '../shared/audiencelab-client';

describe('AudienceLab API Client', () => {
  const apiKey = process.env.AUDIENCELAB_API_KEY;

  it('should have API key configured', () => {
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe('');
  });

  it('should successfully connect to API and check status', async () => {
    if (!apiKey) {
      throw new Error('AUDIENCELAB_API_KEY not configured');
    }

    const client = createAudienceLabClient(apiKey);
    
    // Test API connection with status endpoint
    const status = await client.getStatus();
    
    expect(status).toBeDefined();
    expect(status.status).toBeDefined();
  }, 30000); // 30 second timeout for API call

  it('should successfully fetch audiences', async () => {
    if (!apiKey) {
      throw new Error('AUDIENCELAB_API_KEY not configured');
    }

    const client = createAudienceLabClient(apiKey);
    
    // Test fetching audiences
    const response = await client.getAudiences(1, 10);
    
    expect(response).toBeDefined();
    expect(response.audiences).toBeDefined();
    expect(Array.isArray(response.audiences)).toBe(true);
  }, 30000);

  it('should successfully fetch pixels', async () => {
    if (!apiKey) {
      throw new Error('AUDIENCELAB_API_KEY not configured');
    }

    const client = createAudienceLabClient(apiKey);
    
    // Test fetching pixels
    const response = await client.getPixels();
    
    expect(response).toBeDefined();
    expect(response.pixels).toBeDefined();
    expect(Array.isArray(response.pixels)).toBe(true);
  }, 30000);
});
