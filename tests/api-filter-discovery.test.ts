/**
 * AudienceLab API Filter Discovery Tests (Updated with Real API Structure)
 * 
 * Based on actual API response structure from production
 * Run with: pnpm test tests/api-filter-discovery.test.ts
 */

import { describe, it } from 'vitest';
import { createAudienceLabClient } from '../shared/audiencelab-client';

const API_KEY = process.env.AUDIENCELAB_API_KEY || process.env.VITE_AUDIENCELAB_API_KEY || '';

if (!API_KEY) {
  throw new Error('AUDIENCELAB_API_KEY is required for filter discovery tests');
}

const client = createAudienceLabClient(API_KEY);

async function testFilterCombination(
  testName: string,
  filters: any
): Promise<{ success: boolean; error?: string; audienceId?: string }> {
  try {
    const result = await client.createAudience({
      name: `[TEST] ${testName} - ${Date.now()}`,
      filters,
      days_back: 30,
    });

    console.log(`\n✅ ${testName}: SUCCESS`);
    console.log(`   Audience ID: ${result.audienceId}`);

    return { success: true, audienceId: result.audienceId };
  } catch (error: any) {
    console.log(`\n❌ ${testName}: FAILED`);
    console.log(`   Error: ${error.message}`);

    return { success: false, error: error.message };
  }
}

describe('AudienceLab API Filter Discovery (Real Structure)', () => {
  console.log('\n🔍 Testing with REAL API field names from production...\n');

  describe('Location Filters', () => {
    it('should test city filter', async () => {
      await testFilterCombination('City', {
        city: ['San Francisco', 'New York'],
      });
    });

    it('should test state filter', async () => {
      await testFilterCombination('State', {
        state: ['California', 'New York'],
      });
    });

    it('should test zip filter', async () => {
      await testFilterCombination('Zip', {
        zip: ['94102', '10001'],
      });
    });
  });

  describe('Age Filters', () => {
    it('should test age range', async () => {
      await testFilterCombination('Age Range', {
        age: {
          minAge: 25,
          maxAge: 45,
        },
      });
    });
  });

  describe('Business Profile Filters (camelCase)', () => {
    it('should test jobTitle', async () => {
      await testFilterCombination('Job Title', {
        businessProfile: {
          jobTitle: ['Software Engineer', 'Product Manager'],
        },
      });
    });

    it('should test seniority (CORRECTED)', async () => {
      await testFilterCombination('Seniority', {
        businessProfile: {
          seniority: ['Senior', 'Director', 'VP'],
        },
      });
    });

    it('should test industry (CORRECTED)', async () => {
      await testFilterCombination('Industry', {
        businessProfile: {
          industry: ['Technology', 'Healthcare', 'Finance'],
        },
      });
    });

    it('should test department', async () => {
      await testFilterCombination('Department', {
        businessProfile: {
          department: ['Engineering', 'Marketing', 'Sales'],
        },
      });
    });

    it('should test companyName', async () => {
      await testFilterCombination('Company Name', {
        businessProfile: {
          companyName: ['Google', 'Microsoft', 'Apple'],
        },
      });
    });

    it('should test companyDomain', async () => {
      await testFilterCombination('Company Domain', {
        businessProfile: {
          companyDomain: ['google.com', 'microsoft.com'],
        },
      });
    });

    it('should test companyDescription', async () => {
      await testFilterCombination('Company Description', {
        businessProfile: {
          companyDescription: ['Landscaping for golf courses', 'SaaS platform'],
        },
      });
    });

    it('should test employeeCount', async () => {
      await testFilterCombination('Employee Count', {
        businessProfile: {
          employeeCount: ['1-10', '11-50', '51-200'],
        },
      });
    });

    it('should test companyRevenue', async () => {
      await testFilterCombination('Company Revenue', {
        businessProfile: {
          companyRevenue: ['$1M-$10M', '$10M-$50M'],
        },
      });
    });
  });

  describe('Gender Filter', () => {
    it('should test gender', async () => {
      await testFilterCombination('Gender', {
        gender: ['Male', 'Female'],
      });
    });
  });

  describe('Profile Filters', () => {
    it('should test incomeRange', async () => {
      await testFilterCombination('Income Range', {
        profile: {
          incomeRange: ['$50K-$75K', '$75K-$100K'],
        },
      });
    });

    it('should test homeowner', async () => {
      await testFilterCombination('Homeowner', {
        profile: {
          homeowner: ['Owner', 'Renter'],
        },
      });
    });

    it('should test married', async () => {
      await testFilterCombination('Married', {
        profile: {
          married: ['Yes', 'No'],
        },
      });
    });

    it('should test netWorth', async () => {
      await testFilterCombination('Net Worth', {
        profile: {
          netWorth: ['$100K-$250K', '$250K-$500K'],
        },
      });
    });

    it('should test children', async () => {
      await testFilterCombination('Children', {
        profile: {
          children: ['0', '1', '2', '3+'],
        },
      });
    });
  });

  describe('Attributes Filters', () => {
    it('should test credit_rating', async () => {
      await testFilterCombination('Credit Rating', {
        attributes: {
          credit_rating: ['Excellent', 'Good'],
        },
      });
    });

    it('should test language_code', async () => {
      await testFilterCombination('Language Code', {
        attributes: {
          language_code: ['en', 'es'],
        },
      });
    });

    it('should test education', async () => {
      await testFilterCombination('Education', {
        attributes: {
          education: ["Bachelor's Degree", "Master's Degree"],
        },
      });
    });

    it('should test dwelling_type', async () => {
      await testFilterCombination('Dwelling Type', {
        attributes: {
          dwelling_type: ['Single Family', 'Apartment', 'Condo'],
        },
      });
    });

    it('should test marital_status', async () => {
      await testFilterCombination('Marital Status', {
        attributes: {
          marital_status: ['Married', 'Single', 'Divorced'],
        },
      });
    });

    it('should test occupation_type', async () => {
      await testFilterCombination('Occupation Type', {
        attributes: {
          occupation_type: ['Professional', 'Technical'],
        },
      });
    });

    it('should test smoker', async () => {
      await testFilterCombination('Smoker', {
        attributes: {
          smoker: ['Yes', 'No'],
        },
      });
    });

    it('should test home_year_built range', async () => {
      await testFilterCombination('Home Year Built', {
        attributes: {
          home_year_built: {
            min: 2000,
            max: 2024,
          },
        },
      });
    });
  });

  describe('Combined Filters', () => {
    it('should test multiple categories together', async () => {
      await testFilterCombination('Combined Multi-Category', {
        age: {
          minAge: 30,
          maxAge: 50,
        },
        city: ['San Francisco'],
        state: ['California'],
        businessProfile: {
          jobTitle: ['Software Engineer'],
          seniority: ['Senior', 'Director'],
          industry: ['Technology'],
        },
        profile: {
          incomeRange: ['$100K-$150K'],
        },
      });
    });
  });
});
