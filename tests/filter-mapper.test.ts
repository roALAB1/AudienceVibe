/**
 * Filter Mapper Integration Tests
 * 
 * Validates that UI filters are correctly converted to AudienceLab API format
 * Tests each filter category mapping function
 */

import { describe, it, expect } from 'vitest';
import {
  mapBusinessFilters,
  mapLocationFilters,
  mapPersonalFilters,
  mapFinancialFilters,
  mapFamilyFilters,
  mapHousingFilters,
  mapContactFilters,
  mapIntentFilters,
  mapFiltersToAPI,
  createAudienceRequest,
  validateFilters,
} from '../shared/filter-mapper';
import type { AudienceFilters } from '../shared/types/audience-filters';

describe('Filter Mapper - Business Filters', () => {
  it('should map job titles correctly', () => {
    const result = mapBusinessFilters({
      jobTitles: ['Software Engineer', 'Product Manager'],
    });

    expect(result.businessProfile).toBeDefined();
    expect(result.businessProfile?.jobTitle).toEqual(['Software Engineer', 'Product Manager']);
  });

  it('should map seniority levels correctly', () => {
    const result = mapBusinessFilters({
      seniority: ['Senior', 'Director'],
    });

    expect(result.businessProfile?.seniority).toEqual(['Senior', 'Director']);
  });

  it('should map industries correctly', () => {
    const result = mapBusinessFilters({
      industries: ['Technology', 'Healthcare'],
    });

    expect(result.businessProfile?.industry).toEqual(['Technology', 'Healthcare']);
  });

  it('should map all business fields together', () => {
    const result = mapBusinessFilters({
      jobTitles: ['CEO'],
      seniority: ['Executive'],
      industries: ['Finance'],
      departments: ['Sales'],
      companyNames: ['Acme Corp'],
      companyDomains: ['acme.com'],
      companyDescription: 'Software company',
      employeeCount: '100-500',
      companyRevenue: '$10M-$50M',
    });

    expect(result.businessProfile).toBeDefined();
    expect(result.businessProfile?.jobTitle).toEqual(['CEO']);
    expect(result.businessProfile?.seniority).toEqual(['Executive']);
    expect(result.businessProfile?.industry).toEqual(['Finance']);
    expect(result.businessProfile?.department).toEqual(['Sales']);
    expect(result.businessProfile?.companyName).toEqual(['Acme Corp']);
    expect(result.businessProfile?.companyDomain).toEqual(['acme.com']);
    expect(result.businessProfile?.companyDescription).toEqual(['Software company']);
    expect(result.businessProfile?.employeeCount).toEqual(['100-500']);
    expect(result.businessProfile?.companyRevenue).toEqual(['$10M-$50M']);
  });
});

describe('Filter Mapper - Location Filters', () => {
  it('should map cities correctly', () => {
    const result = mapLocationFilters({
      cities: ['New York', 'San Francisco'],
    });

    expect(result.city).toEqual(['New York', 'San Francisco']);
  });

  it('should map states correctly', () => {
    const result = mapLocationFilters({
      states: ['CA', 'NY'],
    });

    expect((result as any).state).toEqual(['CA', 'NY']);
  });

  it('should map zip codes correctly', () => {
    const result = mapLocationFilters({
      zipCodes: ['10001', '94102'],
    });

    expect((result as any).zip).toEqual(['10001', '94102']);
  });

  it('should map all location fields together', () => {
    const result = mapLocationFilters({
      cities: ['Austin'],
      states: ['TX'],
      zipCodes: ['78701'],
    });

    expect(result.city).toEqual(['Austin']);
    expect((result as any).state).toEqual(['TX']);
    expect((result as any).zip).toEqual(['78701']);
  });
});

describe('Filter Mapper - Personal Filters', () => {
  it('should map age range correctly', () => {
    const result = mapPersonalFilters({
      ageMin: 25,
      ageMax: 45,
    });

    expect(result.age).toBeDefined();
    expect(result.age?.minAge).toBe(25);
    expect(result.age?.maxAge).toBe(45);
  });

  it('should map gender correctly', () => {
    const result = mapPersonalFilters({
      gender: ['M', 'F'],
    });

    expect((result as any).gender).toEqual(['M', 'F']);
  });

  it('should map language codes correctly', () => {
    const result = mapPersonalFilters({
      languageCode: ['EN', 'ES'],
    });

    expect((result as any).attributes?.language_code).toEqual(['EN', 'ES']);
  });

  it('should map education levels correctly', () => {
    const result = mapPersonalFilters({
      education: ['Bachelor', 'Master'],
    });

    expect((result as any).attributes?.education).toEqual(['Bachelor', 'Master']);
  });

  it('should map smoker status correctly', () => {
    const result = mapPersonalFilters({
      smoker: true,
    });

    expect((result as any).attributes?.smoker).toEqual(['Y']);
  });
});

describe('Filter Mapper - Financial Filters', () => {
  it('should map income range correctly', () => {
    const result = mapFinancialFilters({
      incomeRange: ['$50K-$75K', '$75K-$100K'],
    });

    expect((result as any).profile?.incomeRange).toEqual(['$50K-$75K', '$75K-$100K']);
  });

  it('should map net worth correctly', () => {
    const result = mapFinancialFilters({
      netWorth: ['$100K-$250K'],
    });

    expect((result as any).profile?.netWorth).toEqual(['$100K-$250K']);
  });

  it('should map credit rating correctly', () => {
    const result = mapFinancialFilters({
      creditRating: ['Excellent'],
    });

    expect((result as any).attributes?.credit_rating).toEqual(['Excellent']);
  });
});

describe('Filter Mapper - Family Filters', () => {
  it('should map married status correctly', () => {
    const result = mapFamilyFilters({
      married: true,
    });

    expect((result as any).profile?.married).toEqual(['Y']);
  });

  it('should map children status correctly', () => {
    const result = mapFamilyFilters({
      children: true,
    });

    expect((result as any).profile?.children).toEqual(['Y']);
  });

  it('should map marital status codes correctly', () => {
    const result = mapFamilyFilters({
      maritalStatus: ['M', 'S'],
    });

    expect((result as any).attributes?.marital_status).toEqual(['M', 'S']);
  });
});

describe('Filter Mapper - Housing Filters', () => {
  it('should map homeowner status correctly', () => {
    const result = mapHousingFilters({
      homeowner: true,
    });

    expect((result as any).profile?.homeowner).toEqual(['Y']);
  });

  it('should map dwelling type correctly', () => {
    const result = mapHousingFilters({
      dwellingType: ['Single Family', 'Condo'],
    });

    expect((result as any).attributes?.dwelling_type).toEqual(['Single Family', 'Condo']);
  });

  it('should map home year built range correctly', () => {
    const result = mapHousingFilters({
      homeYearBuiltMin: 2000,
      homeYearBuiltMax: 2020,
    });

    expect((result as any).attributes?.home_year_built).toBeDefined();
    expect((result as any).attributes?.home_year_built.min).toBe(2000);
    expect((result as any).attributes?.home_year_built.max).toBe(2020);
  });
});

describe('Filter Mapper - Contact Filters', () => {
  it('should map verified email correctly', () => {
    const result = mapContactFilters({
      hasVerifiedEmail: true,
    });

    expect((result as any).notNulls).toContain('email');
  });

  it('should map multiple contact fields correctly', () => {
    const result = mapContactFilters({
      hasVerifiedEmail: true,
      hasValidPhone: true,
      hasLinkedIn: true,
    });

    expect((result as any).notNulls).toContain('email');
    expect((result as any).notNulls).toContain('phone');
    expect((result as any).notNulls).toContain('linkedin_url');
  });
});

describe('Filter Mapper - Intent Filters', () => {
  it('should map premade audiences correctly', () => {
    const result = mapIntentFilters({
      method: 'premade',
      premadeAudiences: ['segment-123', 'segment-456'],
    });

    expect(result.segment).toEqual(['segment-123', 'segment-456']);
  });

  it('should map keywords correctly', () => {
    const result = mapIntentFilters({
      method: 'keyword',
      keywords: ['AI', 'machine learning'],
    });

    expect(result.segment).toEqual(['AI', 'machine learning']);
  });
});

describe('Filter Mapper - Combined Filters', () => {
  it('should combine multiple filter categories correctly', () => {
    const filters: AudienceFilters = {
      business: {
        jobTitles: ['Software Engineer'],
        seniority: ['Senior'],
      },
      location: {
        cities: ['San Francisco'],
        states: ['CA'],
      },
      personal: {
        ageMin: 25,
        ageMax: 45,
      },
    };

    const result = mapFiltersToAPI(filters);

    expect(result.businessProfile?.jobTitle).toEqual(['Software Engineer']);
    expect(result.businessProfile?.seniority).toEqual(['Senior']);
    expect(result.city).toEqual(['San Francisco']);
    expect((result as any).state).toEqual(['CA']);
    expect(result.age?.minAge).toBe(25);
    expect(result.age?.maxAge).toBe(45);
  });
});

describe('Filter Mapper - Validation', () => {
  it('should validate that at least one filter is provided', () => {
    const emptyFilters: AudienceFilters = {};
    const result = validateFilters(emptyFilters);

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should validate successfully with filters', () => {
    const filters: AudienceFilters = {
      location: {
        cities: ['New York'],
      },
    };

    const result = validateFilters(filters);

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

describe('Filter Mapper - Create Audience Request', () => {
  it('should create complete audience request', () => {
    const filters: AudienceFilters = {
      business: {
        jobTitles: ['CEO'],
        industries: ['Technology'],
      },
      location: {
        cities: ['San Francisco'],
      },
    };

    const request = createAudienceRequest('Tech CEOs in SF', filters);

    expect(request.name).toBe('Tech CEOs in SF');
    expect(request.filters.businessProfile?.jobTitle).toEqual(['CEO']);
    expect(request.filters.businessProfile?.industry).toEqual(['Technology']);
    expect(request.filters.city).toEqual(['San Francisco']);
  });

  it('should include days_back option', () => {
    const filters: AudienceFilters = {
      location: {
        cities: ['Austin'],
      },
    };

    const request = createAudienceRequest('Austin Residents', filters, { daysBack: 30 });

    expect(request.days_back).toBe(30);
  });

  it('should throw error for empty filters', () => {
    const emptyFilters: AudienceFilters = {};

    expect(() => {
      createAudienceRequest('Empty Audience', emptyFilters);
    }).toThrow();
  });
});
