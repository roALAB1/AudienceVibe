/**
 * Test to discover which businessProfile fields actually work
 */

import { describe, it } from 'vitest';
import { createAudienceLabClient } from '../shared/audiencelab-client';

describe('Find Working Business Fields', () => {
  const apiKey = process.env.AUDIENCELAB_API_KEY || process.env.VITE_AUDIENCELAB_API_KEY;
  const client = createAudienceLabClient(apiKey!);

  const fieldsToTest = [
    { name: 'jobTitle', value: ['Software Engineer'] },
    { name: 'seniority', value: ['Senior'] },
    { name: 'industry', value: ['Technology'] },
    { name: 'department', value: ['Engineering'] },
    { name: 'companyName', value: ['Google'] },
    { name: 'companyDomain', value: ['google.com'] },
    { name: 'companyDescription', value: ['Search engine'] },
    { name: 'employeeCount', value: ['1000+'] },
    { name: 'companyRevenue', value: ['$1B+'] },
  ];

  it('should test each business field individually', async () => {
    const results: Record<string, { success: boolean; audienceId?: string; error?: string }> = {};

    for (const field of fieldsToTest) {
      const request = {
        name: `Test: ${field.name}`,
        filters: {
          businessProfile: {
            [field.name]: field.value,
          },
        },
      };

      console.log(`\n Testing ${field.name}...`);
      console.log(JSON.stringify(request, null, 2));

      try {
        const response = await client.createAudience(request as any);
        results[field.name] = {
          success: true,
          audienceId: response.audienceId,
        };
        console.log(`✅ ${field.name}: SUCCESS (${response.audienceId})`);
        
        // Clean up
        await client.deleteAudience(response.audienceId);
      } catch (error: any) {
        results[field.name] = {
          success: false,
          error: error.message,
        };
        console.log(`❌ ${field.name}: FAILED (${error.message})`);
      }

      // Wait between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n=== SUMMARY ===');
    console.log('Working fields:');
    Object.entries(results).forEach(([field, result]) => {
      if (result.success) {
        console.log(`  ✅ ${field}`);
      }
    });

    console.log('\nNon-working fields:');
    Object.entries(results).forEach(([field, result]) => {
      if (!result.success) {
        console.log(`  ❌ ${field}: ${result.error}`);
      }
    });
  }, 120000);
});
