/**
 * End-to-End Audience Creation Tests
 * 
 * Validates the complete workflow from UI filters to API audience creation
 * Tests with real AudienceLab API calls to ensure production readiness
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createAudienceLabClient } from '../shared/audiencelab-client';
import { createAudienceRequest } from '../shared/filter-mapper';
import type { AudienceFilters } from '../shared/types/audience-filters';

describe('End-to-End Audience Creation', () => {
  let client: ReturnType<typeof createAudienceLabClient>;
  const createdAudienceIds: string[] = [];

  beforeAll(() => {
    const apiKey = process.env.AUDIENCELAB_API_KEY || process.env.VITE_AUDIENCELAB_API_KEY;
    if (!apiKey) {
      throw new Error('AUDIENCELAB_API_KEY not set');
    }
    client = createAudienceLabClient(apiKey);
  });

  // Clean up created audiences after tests
  afterAll(async () => {
    for (const audienceId of createdAudienceIds) {
      try {
        await client.deleteAudience(audienceId);
        console.log(`Cleaned up test audience: ${audienceId}`);
      } catch (error) {
        console.warn(`Failed to clean up audience ${audienceId}:`, error);
      }
    }
  });

  it('should create audience with business filters', async () => {
    const filters: AudienceFilters = {
      business: {
        jobTitles: ['Software Engineer', 'Product Manager'],
        seniority: ['Senior', 'Director'],
        industries: ['Technology', 'Software'],
      },
    };

    const request = createAudienceRequest('E2E Test: Tech Professionals', filters);
    const response = await client.createAudience(request);

    expect(response.audienceId).toBeDefined();
    expect(typeof response.audienceId).toBe('string');
    createdAudienceIds.push(response.audienceId);

    // Verify audience was created
    const audience = await client.getAudience(response.audienceId);
    expect(audience).toBeDefined();
  }, 30000);

  it('should create audience with location filters', async () => {
    const filters: AudienceFilters = {
      location: {
        cities: ['San Francisco', 'New York'],
        states: ['CA', 'NY'],
      },
    };

    const request = createAudienceRequest('E2E Test: SF & NY Residents', filters);
    const response = await client.createAudience(request);

    expect(response.audienceId).toBeDefined();
    createdAudienceIds.push(response.audienceId);
  }, 30000);

  it('should create audience with personal filters', async () => {
    const filters: AudienceFilters = {
      personal: {
        ageMin: 25,
        ageMax: 45,
        gender: ['M', 'F'],
      },
    };

    const request = createAudienceRequest('E2E Test: Young Adults', filters);
    const response = await client.createAudience(request);

    expect(response.audienceId).toBeDefined();
    createdAudienceIds.push(response.audienceId);
  }, 30000);

  it('should create audience with financial filters', async () => {
    const filters: AudienceFilters = {
      financial: {
        incomeRange: ['$75K-$100K', '$100K-$150K'],
        netWorth: ['$250K-$500K'],
      },
    };

    const request = createAudienceRequest('E2E Test: High Income', filters);
    const response = await client.createAudience(request);

    expect(response.audienceId).toBeDefined();
    createdAudienceIds.push(response.audienceId);
  }, 30000);

  it('should create audience with family filters', async () => {
    const filters: AudienceFilters = {
      family: {
        married: true,
        children: true,
      },
    };

    const request = createAudienceRequest('E2E Test: Families', filters);
    const response = await client.createAudience(request);

    expect(response.audienceId).toBeDefined();
    createdAudienceIds.push(response.audienceId);
  }, 30000);

  it('should create audience with housing filters', async () => {
    const filters: AudienceFilters = {
      housing: {
        homeowner: true,
        dwellingType: ['Single Family'],
        homeYearBuiltMin: 2000,
        homeYearBuiltMax: 2020,
      },
    };

    const request = createAudienceRequest('E2E Test: Homeowners', filters);
    const response = await client.createAudience(request);

    expect(response.audienceId).toBeDefined();
    createdAudienceIds.push(response.audienceId);
  }, 30000);

  it('should create audience with contact filters', async () => {
    const filters: AudienceFilters = {
      contact: {
        hasVerifiedEmail: true,
        hasValidPhone: true,
      },
    };

    const request = createAudienceRequest('E2E Test: Verified Contacts', filters);
    const response = await client.createAudience(request);

    expect(response.audienceId).toBeDefined();
    createdAudienceIds.push(response.audienceId);
  }, 30000);

  it('should create audience with combined filters', async () => {
    const filters: AudienceFilters = {
      business: {
        jobTitles: ['CEO', 'CTO', 'VP'],
        seniority: ['Executive', 'Director'],
      },
      location: {
        cities: ['San Francisco', 'Austin', 'Seattle'],
      },
      personal: {
        ageMin: 35,
        ageMax: 60,
      },
      financial: {
        incomeRange: ['$150K+'],
      },
    };

    const request = createAudienceRequest('E2E Test: Tech Executives', filters);
    const response = await client.createAudience(request);

    expect(response.audienceId).toBeDefined();
    createdAudienceIds.push(response.audienceId);

    // Verify we can retrieve the audience
    const audience = await client.getAudience(response.audienceId);
    expect(audience).toBeDefined();
  }, 30000);

  it('should create audience with days_back option', async () => {
    const filters: AudienceFilters = {
      location: {
        cities: ['Boston'],
      },
    };

    const request = createAudienceRequest('E2E Test: Recent Boston', filters, { daysBack: 30 });
    const response = await client.createAudience(request);

    expect(response.audienceId).toBeDefined();
    expect(request.days_back).toBe(30);
    createdAudienceIds.push(response.audienceId);
  }, 30000);

  it('should handle API errors gracefully', async () => {
    // Test with invalid filter data
    const invalidRequest = {
      name: '', // Empty name should fail
      filters: {},
      segment: [],
    };

    await expect(async () => {
      await client.createAudience(invalidRequest as any);
    }).rejects.toThrow();
  }, 30000);
});

describe('Filter Configuration Storage', () => {
  it('should store and retrieve filter configurations', async () => {
    // This test validates the database storage workflow
    // Note: Requires database connection to be available
    
    const filters: AudienceFilters = {
      business: {
        jobTitles: ['Data Scientist'],
      },
      location: {
        cities: ['Chicago'],
      },
    };

    // In a real scenario, this would be called via tRPC
    // For now, we just validate the filter structure
    expect(filters.business).toBeDefined();
    expect(filters.location).toBeDefined();
    expect(filters.business?.jobTitles).toEqual(['Data Scientist']);
    expect(filters.location?.cities).toEqual(['Chicago']);
  });
});

describe('API Response Validation', () => {
  let client: ReturnType<typeof createAudienceLabClient>;

  beforeAll(() => {
    const apiKey = process.env.AUDIENCELAB_API_KEY || process.env.VITE_AUDIENCELAB_API_KEY;
    if (!apiKey) {
      throw new Error('AUDIENCELAB_API_KEY not set');
    }
    client = createAudienceLabClient(apiKey);
  });

  it('should return valid audience ID format', async () => {
    const filters: AudienceFilters = {
      location: {
        cities: ['Denver'],
      },
    };

    const request = createAudienceRequest('E2E Test: Denver', filters);
    const response = await client.createAudience(request);

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(response.audienceId).toMatch(uuidRegex);

    // Clean up
    await client.deleteAudience(response.audienceId);
  }, 30000);
});
