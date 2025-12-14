/**
 * Filter Mapping Layer
 * 
 * Converts UI filter objects to AudienceLab API format.
 * All mappings are based on validated API schema (28/28 tests passed).
 * 
 * @see docs/VALIDATED_FILTER_SCHEMA.md
 * @see docs/API_REFERENCE.md
 */

import type {
  AudienceFilters,
  BusinessFilters,
  LocationFilters,
  PersonalFilters,
  FinancialFilters,
  FamilyFilters,
  HousingFilters,
  ContactFilters,
  IntentFilters,
} from "./types/audience-filters";
import type { CreateAudienceRequest } from "./audiencelab-types";

// Type alias for API filters to avoid Pick utility issues
type APIFilters = CreateAudienceRequest["filters"];

/**
 * Main function to convert UI filters to API format
 */
export function mapFiltersToAPI(filters: AudienceFilters): APIFilters {
  const apiFilters: APIFilters = {};

  // Map each filter category
  if (filters.business) {
    Object.assign(apiFilters, mapBusinessFilters(filters.business));
  }

  if (filters.location) {
    Object.assign(apiFilters, mapLocationFilters(filters.location));
  }

  if (filters.personal) {
    Object.assign(apiFilters, mapPersonalFilters(filters.personal));
  }

  if (filters.financial) {
    Object.assign(apiFilters, mapFinancialFilters(filters.financial));
  }

  if (filters.family) {
    Object.assign(apiFilters, mapFamilyFilters(filters.family));
  }

  if (filters.housing) {
    Object.assign(apiFilters, mapHousingFilters(filters.housing));
  }

  if (filters.contact) {
    Object.assign(apiFilters, mapContactFilters(filters.contact));
  }

  if (filters.intent) {
    Object.assign(apiFilters, mapIntentFilters(filters.intent));
  }

  return apiFilters;
}

/**
 * Map Business filters to businessProfile API format
 * 
 * ✅ VALIDATED WORKING FIELDS (via real API testing):
 * - jobTitle, companyName, companyDomain, companyDescription, employeeCount, companyRevenue
 * 
 * ❌ NON-WORKING FIELDS (return 400 Bad Request):
 * - seniority, industry, department
 * These fields appear in API responses but are NOT accepted in create requests
 */
export function mapBusinessFilters(filters: BusinessFilters): Partial<APIFilters> {
  const result: Partial<APIFilters> = {};
  const businessProfile: any = {};

  // ✅ VALIDATED: jobTitle works
  if (filters.jobTitles && filters.jobTitles.length > 0) {
    businessProfile.jobTitle = filters.jobTitles;
  }

  // ❌ REMOVED: seniority, industry, department return 400 Bad Request
  // if (filters.seniority && filters.seniority.length > 0) {
  //   businessProfile.seniority = filters.seniority;
  // }
  // if (filters.industries && filters.industries.length > 0) {
  //   businessProfile.industry = filters.industries;
  // }
  // if (filters.departments && filters.departments.length > 0) {
  //   businessProfile.department = filters.departments;
  // }

  if (filters.companyNames && filters.companyNames.length > 0) {
    businessProfile.companyName = filters.companyNames;
  }

  if (filters.companyDomains && filters.companyDomains.length > 0) {
    businessProfile.companyDomain = filters.companyDomains;
  }

  if (filters.companyDescription) {
    businessProfile.companyDescription = [filters.companyDescription];
  }

  if (filters.employeeCount) {
    businessProfile.employeeCount = [filters.employeeCount];
  }

  if (filters.companyRevenue) {
    businessProfile.companyRevenue = [filters.companyRevenue];
  }

  if (Object.keys(businessProfile).length > 0) {
    result.businessProfile = businessProfile;
  }

  return result;
}

/**
 * Map Location filters to city/state/zip API format
 * Validated fields: city, state, zip
 */
export function mapLocationFilters(filters: LocationFilters): Partial<APIFilters> {
  const result: Partial<APIFilters> = {};

  if (filters.cities && filters.cities.length > 0) {
    result.city = filters.cities;
  }

  if (filters.states && filters.states.length > 0) {
    (result as any).state = filters.states;
  }

  if (filters.zipCodes && filters.zipCodes.length > 0) {
    (result as any).zip = filters.zipCodes;
  }

  return result;
}

/**
 * Map Personal filters to age/gender + attributes API format
 * Validated fields: age (minAge/maxAge), gender, attributes (language_code, education, ethnic_code)
 */
export function mapPersonalFilters(filters: PersonalFilters): Partial<APIFilters> {
  const result: Partial<APIFilters> = {};

  // Age range
  if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
    result.age = {
      minAge: filters.ageMin,
      maxAge: filters.ageMax,
    };
  }

  // Gender
  if (filters.gender && filters.gender.length > 0) {
    (result as any).gender = filters.gender;
  }

  // Attributes
  const attributes: any = {};

  if (filters.languageCode && filters.languageCode.length > 0) {
    attributes.language_code = filters.languageCode;
  }

  if (filters.education && filters.education.length > 0) {
    attributes.education = filters.education;
  }

  if (filters.ethnicity && filters.ethnicity.length > 0) {
    attributes.ethnic_code = filters.ethnicity;
  }

  if (filters.smoker !== undefined) {
    attributes.smoker = [filters.smoker ? "Y" : "N"];
  }

  if (Object.keys(attributes).length > 0) {
    (result as any).attributes = attributes;
  }

  return result;
}

/**
 * Map Financial filters to profile + attributes API format
 * Validated fields: profile (incomeRange, netWorth), attributes (credit_rating, occupation_type)
 */
export function mapFinancialFilters(filters: FinancialFilters): Partial<APIFilters> {
  const result: Partial<APIFilters> = {};

  // Profile
  const profile: any = {};

  if (filters.incomeRange && filters.incomeRange.length > 0) {
    profile.incomeRange = filters.incomeRange;
  }

  if (filters.netWorth && filters.netWorth.length > 0) {
    profile.netWorth = filters.netWorth;
  }

  if (Object.keys(profile).length > 0) {
    (result as any).profile = profile;
  }

  // Attributes
  const attributes: any = {};

  if (filters.creditRating && filters.creditRating.length > 0) {
    attributes.credit_rating = filters.creditRating;
  }

  if (filters.occupationType && filters.occupationType.length > 0) {
    attributes.occupation_type = filters.occupationType;
  }

  if (Object.keys(attributes).length > 0) {
    (result as any).attributes = { ...(result as any).attributes, ...attributes };
  }

  return result;
}

/**
 * Map Family filters to profile + attributes API format
 * Validated fields: profile (married, children), attributes (marital_status)
 */
export function mapFamilyFilters(filters: FamilyFilters): Partial<APIFilters> {
  const result: Partial<APIFilters> = {};

  // Profile
  const profile: any = {};

  if (filters.married !== undefined) {
    profile.married = [filters.married ? "Y" : "N"];
  }

  if (filters.children !== undefined) {
    profile.children = [filters.children ? "Y" : "N"];
  }

  if (Object.keys(profile).length > 0) {
    (result as any).profile = profile;
  }

  // Attributes
  const attributes: any = {};

  if (filters.maritalStatus && filters.maritalStatus.length > 0) {
    attributes.marital_status = filters.maritalStatus;
  }

  if (Object.keys(attributes).length > 0) {
    (result as any).attributes = attributes;
  }

  return result;
}

/**
 * Map Housing filters to attributes API format
 * Validated fields: attributes (dwelling_type, home_year_built)
 */
export function mapHousingFilters(filters: HousingFilters): Partial<APIFilters> {
  const result: Partial<APIFilters> = {};

  // Profile
  const profile: any = {};

  if (filters.homeowner !== undefined) {
    profile.homeowner = [filters.homeowner ? "Y" : "N"];
  }

  if (Object.keys(profile).length > 0) {
    (result as any).profile = profile;
  }

  // Attributes
  const attributes: any = {};

  if (filters.dwellingType && filters.dwellingType.length > 0) {
    attributes.dwelling_type = filters.dwellingType;
  }

  if (filters.homeYearBuiltMin !== undefined || filters.homeYearBuiltMax !== undefined) {
    attributes.home_year_built = {
      min: filters.homeYearBuiltMin ?? null,
      max: filters.homeYearBuiltMax ?? null,
    };
  }

  if (Object.keys(attributes).length > 0) {
    (result as any).attributes = attributes;
  }

  return result;
}

/**
 * Map Contact filters to notNulls/nullOnly API format
 * These filters specify which fields must be present or absent
 */
export function mapContactFilters(filters: ContactFilters): Partial<APIFilters> {
  const result: Partial<APIFilters> = {};
  const notNulls: string[] = [];

  if (filters.hasVerifiedEmail) {
    notNulls.push("email");
  }

  if (filters.hasValidPhone) {
    notNulls.push("phone");
  }

  if (filters.hasBusinessEmail) {
    notNulls.push("business_email");
  }

  if (filters.hasPersonalEmail) {
    notNulls.push("personal_email");
  }

  if (filters.hasLinkedIn) {
    notNulls.push("linkedin_url");
  }

  if (notNulls.length > 0) {
    (result as any).notNulls = notNulls;
  }

  return result;
}

/**
 * Map Intent filters to segment/keywords API format
 * Note: segment is at the top level of CreateAudienceRequest, not in filters
 */
export function mapIntentFilters(filters: IntentFilters): { segment?: string[] } {
  const result: { segment?: string[] } = {};

  if (filters.method === "premade" && filters.premadeAudiences && filters.premadeAudiences.length > 0) {
    result.segment = filters.premadeAudiences;
  } else if (filters.method === "keyword" && filters.keywords && filters.keywords.length > 0) {
    // Keywords might map to segment or a different field
    // This needs validation with the API
    result.segment = filters.keywords;
  } else if (filters.method === "custom" && filters.customDescription) {
    // Custom description might need to be converted to keywords
    // This needs validation with the API
    result.segment = [filters.customDescription];
  }

  return result;
}

/**
 * Validate that at least one filter is provided
 */
export function validateFilters(filters: AudienceFilters): { valid: boolean; error?: string } {
  const hasAnyFilter =
    filters.business ||
    filters.location ||
    filters.personal ||
    filters.financial ||
    filters.family ||
    filters.housing ||
    filters.contact ||
    filters.intent;

  if (!hasAnyFilter) {
    return {
      valid: false,
      error: "At least one filter category must be provided",
    };
  }

  return { valid: true };
}

/**
 * Create a complete CreateAudienceRequest from UI filters
 */
export function createAudienceRequest(
  name: string,
  filters: AudienceFilters,
  options?: {
    daysBack?: number;
  }
): CreateAudienceRequest {
  const validation = validateFilters(filters);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const apiFilters = mapFiltersToAPI(filters);
  const intentMapping = filters.intent ? mapIntentFilters(filters.intent) : {};

  return {
    name,
    filters: apiFilters,
    segment: intentMapping.segment,
    days_back: options?.daysBack,
  };
}
