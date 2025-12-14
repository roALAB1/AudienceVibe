/**
 * Debug Test: Business Filters API Request
 * 
 * Investigates why business filter combinations fail with Bad Request
 */

import { describe, it, expect } from 'vitest';
import { createAudienceLabClient } from '../shared/audiencelab-client';
import { createAudienceRequest } from '../shared/filter-mapper';
import type { AudienceFilters } from '../shared/types/audience-filters';

describe('Debug: Business Filters', () => {
  const apiKey = process.env.AUDIENCELAB_API_KEY || process.env.VITE_AUDIENCELAB_API_KEY;
  const client = createAudienceLabClient(apiKey!);

  it('should show exact API request for business filters', () => {
    const filters: AudienceFilters = {
      business: {
        jobTitles: ['Software Engineer'],
        seniority: ['Senior'],
        industries: ['Technology'],
      },
    };

    const request = createAudienceRequest('Debug Test', filters);
    
    console.log('=== API Request ===');
    console.log(JSON.stringify(request, null, 2));
    
    expect(request.filters.businessProfile).toBeDefined();
    expect(request.filters.businessProfile?.jobTitle).toEqual(['Software Engineer']);
    expect(request.filters.businessProfile?.seniority).toEqual(['Senior']);
    expect(request.filters.businessProfile?.industry).toEqual(['Technology']);
  });

  it('should test business filters one at a time', async () => {
    // Test jobTitle only
    const jobTitleOnly: AudienceFilters = {
      business: {
        jobTitles: ['Software Engineer'],
      },
    };

    const request1 = createAudienceRequest('Debug: Job Title Only', jobTitleOnly);
    console.log('\n=== Job Title Only Request ===');
    console.log(JSON.stringify(request1, null, 2));

    try {
      const response1 = await client.createAudience(request1);
      console.log('✅ Job Title Only: SUCCESS', response1.audienceId);
      await client.deleteAudience(response1.audienceId);
    } catch (error: any) {
      console.log('❌ Job Title Only: FAILED', error.message);
      console.log('Error details:', error);
    }

    // Test seniority only
    const seniorityOnly: AudienceFilters = {
      business: {
        seniority: ['Senior'],
      },
    };

    const request2 = createAudienceRequest('Debug: Seniority Only', seniorityOnly);
    console.log('\n=== Seniority Only Request ===');
    console.log(JSON.stringify(request2, null, 2));

    try {
      const response2 = await client.createAudience(request2);
      console.log('✅ Seniority Only: SUCCESS', response2.audienceId);
      await client.deleteAudience(response2.audienceId);
    } catch (error: any) {
      console.log('❌ Seniority Only: FAILED', error.message);
      console.log('Error details:', error);
    }

    // Test industry only
    const industryOnly: AudienceFilters = {
      business: {
        industries: ['Technology'],
      },
    };

    const request3 = createAudienceRequest('Debug: Industry Only', industryOnly);
    console.log('\n=== Industry Only Request ===');
    console.log(JSON.stringify(request3, null, 2));

    try {
      const response3 = await client.createAudience(request3);
      console.log('✅ Industry Only: SUCCESS', response3.audienceId);
      await client.deleteAudience(response3.audienceId);
    } catch (error: any) {
      console.log('❌ Industry Only: FAILED', error.message);
      console.log('Error details:', error);
    }

    // Test combination
    const combination: AudienceFilters = {
      business: {
        jobTitles: ['Software Engineer'],
        seniority: ['Senior'],
      },
    };

    const request4 = createAudienceRequest('Debug: Job + Seniority', combination);
    console.log('\n=== Job + Seniority Request ===');
    console.log(JSON.stringify(request4, null, 2));

    try {
      const response4 = await client.createAudience(request4);
      console.log('✅ Job + Seniority: SUCCESS', response4.audienceId);
      await client.deleteAudience(response4.audienceId);
    } catch (error: any) {
      console.log('❌ Job + Seniority: FAILED', error.message);
      console.log('Error details:', error);
    }
  }, 60000);
});
