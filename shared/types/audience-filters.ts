/**
 * Simplified Audience Filter Types for Backend Integration
 * 
 * These types represent the UI filter state that needs to be mapped
 * to the AudienceLab API format.
 */

// ============================================================================
// Combined Filter State
// ============================================================================

export interface AudienceFilters {
  business?: BusinessFilters;
  location?: LocationFilters;
  personal?: PersonalFilters;
  financial?: FinancialFilters;
  family?: FamilyFilters;
  housing?: HousingFilters;
  contact?: ContactFilters;
  intent?: IntentFilters;
}

// ============================================================================
// Business Filters
// ============================================================================

export interface BusinessFilters {
  jobTitles?: string[];
  seniority?: string[];
  industries?: string[];
  departments?: string[];
  companyNames?: string[];
  companyDomains?: string[];
  companyDescription?: string;
  employeeCount?: string;
  companyRevenue?: string;
}

// ============================================================================
// Location Filters
// ============================================================================

export interface LocationFilters {
  cities?: string[];
  states?: string[];
  zipCodes?: string[];
}

// ============================================================================
// Personal Filters
// ============================================================================

export interface PersonalFilters {
  ageMin?: number;
  ageMax?: number;
  gender?: string[];
  languageCode?: string[];
  education?: string[];
  ethnicity?: string[];
  smoker?: boolean;
}

// ============================================================================
// Financial Filters
// ============================================================================

export interface FinancialFilters {
  incomeRange?: string[];
  netWorth?: string[];
  creditRating?: string[];
  occupationType?: string[];
}

// ============================================================================
// Family Filters
// ============================================================================

export interface FamilyFilters {
  married?: boolean;
  children?: boolean;
  maritalStatus?: string[];
}

// ============================================================================
// Housing Filters
// ============================================================================

export interface HousingFilters {
  homeowner?: boolean;
  dwellingType?: string[];
  homeYearBuiltMin?: number;
  homeYearBuiltMax?: number;
}

// ============================================================================
// Contact Filters
// ============================================================================

export interface ContactFilters {
  hasVerifiedEmail?: boolean;
  hasValidPhone?: boolean;
  hasBusinessEmail?: boolean;
  hasPersonalEmail?: boolean;
  hasLinkedIn?: boolean;
}

// ============================================================================
// Intent Filters
// ============================================================================

export interface IntentFilters {
  method: 'premade' | 'keyword' | 'custom';
  premadeAudiences?: string[];
  keywords?: string[];
  customDescription?: string;
  minimumScore?: number;
}
