// Audience Filter Types for Vibe Code Feature
// Based on complete research of AudienceLab dashboard

export type FilterCategory =
  | 'intent'
  | 'date'
  | 'business'
  | 'financial'
  | 'personal'
  | 'family'
  | 'housing'
  | 'location'
  | 'contact';

// ============================================================================
// Intent Filters
// ============================================================================

export interface IntentFilters {
  audienceMethod: 'premade' | 'keyword' | 'custom';
  businessType: 'B2C' | 'B2B';
  minimumScore: 'low' | 'medium' | 'high';

  // Conditional fields based on audienceMethod
  premadeList?: string; // When method is 'premade'
  keywords?: string[]; // When method is 'keyword'
  customIntentId?: string; // When method is 'custom'
}

// ============================================================================
// Business Filters
// ============================================================================

export interface BusinessFilters {
  businessKeywords?: string[];
  titles?: string[];
  seniority?: string[];
  departments?: string[];
  companyNames?: string[];
  companyDomains?: string[];
  industries?: string[];
}

// ============================================================================
// Financial Filters (Dynamic Builder Pattern)
// ============================================================================

export type FinancialFilterField =
  | 'incomeRange'
  | 'netWorth'
  | 'creditRating'
  | 'newCreditRange'
  | 'creditCardUser'
  | 'investment'
  | 'mortgageAmount'
  | 'occupationGroup'
  | 'occupationType'
  | 'craCode';

export interface FinancialFilter {
  field: FinancialFilterField;
  value: string | number | { min: number; max: number };
}

export interface FinancialFilters {
  filters: FinancialFilter[];
}

// ============================================================================
// Personal Filters (Age Range + Dynamic Builder)
// ============================================================================

export type PersonalFilterField =
  | 'gender'
  | 'ethnicity'
  | 'language'
  | 'education'
  | 'smoker';

export interface PersonalFilter {
  field: PersonalFilterField;
  value: string;
}

export interface PersonalFilters {
  ageRange?: {
    min?: number;
    max?: number;
  };
  filters: PersonalFilter[];
}

// ============================================================================
// Family Filters (Dynamic Builder Pattern)
// ============================================================================

export type FamilyFilterField =
  | 'married'
  | 'maritalStatus'
  | 'singleParent'
  | 'generationsInHousehold'
  | 'children';

export interface FamilyFilter {
  field: FamilyFilterField;
  value: string | number | boolean;
}

export interface FamilyFilters {
  filters: FamilyFilter[];
}

// ============================================================================
// Housing Filters (Dynamic Builder Pattern)
// ============================================================================

export type HousingFilterField =
  | 'homeownerStatus'
  | 'dwellingType'
  | 'yearBuilt'
  | 'purchasePrice'
  | 'purchaseYear'
  | 'estimatedHomeValue';

export interface HousingFilter {
  field: HousingFilterField;
  value: string | number | { min: number; max: number };
}

export interface HousingFilters {
  filters: HousingFilter[];
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
// Contact Filters (Toggle Switches Pattern)
// ============================================================================

export interface ContactFilters {
  verifiedPersonalEmails: boolean;
  verifiedBusinessEmails: boolean;
  validPhones: boolean;
  skipTracedWirelessPhone: boolean;
  skipTracedWirelessB2BPhone: boolean;
}

// ============================================================================
// Complete Audience Filter Configuration
// ============================================================================

export interface AudienceFilters {
  intent?: IntentFilters;
  date?: any; // TBD - appears to be empty/placeholder in dashboard
  business?: BusinessFilters;
  financial?: FinancialFilters;
  personal?: PersonalFilters;
  family?: FamilyFilters;
  housing?: HousingFilters;
  location?: LocationFilters;
  contact?: ContactFilters;
}

// ============================================================================
// Helper Types
// ============================================================================

export interface FilterCategoryInfo {
  id: FilterCategory;
  label: string;
  icon: string;
  enabled: boolean; // Whether this category has filters configured
}

// For dynamic filter builders
export interface DynamicFilterRow {
  id: string; // Unique ID for React key
  field: string;
  value: string | number | boolean | { min: number; max: number };
}
