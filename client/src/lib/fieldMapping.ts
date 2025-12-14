/**
 * Field Mapping Utility
 * Intelligent detection and mapping of CSV columns to AudienceLab fields
 */

import { type ColumnData, analyzeColumn } from './csvParser';

export interface FieldMapping {
  csvColumn: string;           // Original CSV column name
  mappedField: string | null;  // Detected AudienceLab field
  confidence: number;          // 0-100 confidence score
  completeness: number;        // 0-100 data completeness
  samples: string[];           // Sample values
  isAutoMapped: boolean;       // True if auto-detected
}

export interface AvailableField {
  value: string;
  label: string;
  category: string;
}

/**
 * Available AudienceLab fields for mapping
 */
export const AVAILABLE_FIELDS: AvailableField[] = [
  // Personal Information
  { value: 'FIRST_NAME', label: 'First Name', category: 'Personal' },
  { value: 'LAST_NAME', label: 'Last Name', category: 'Personal' },
  { value: 'EMAIL', label: 'Email', category: 'Personal' },
  { value: 'PHONE', label: 'Phone', category: 'Personal' },
  { value: 'PERSONAL_ADDRESS', label: 'Personal Address', category: 'Personal' },
  { value: 'PERSONAL_ZIP', label: 'Personal Zip', category: 'Personal' },
  { value: 'PERSONAL_STATE', label: 'Personal State', category: 'Personal' },
  { value: 'PERSONAL_CITY', label: 'Personal City', category: 'Personal' },
  { value: 'PERSONAL_EMAIL', label: 'Personal Email', category: 'Personal' },
  { value: 'SHA256_PERSONAL_EMAIL', label: 'SHA256 Personal Email', category: 'Personal' },
  
  // Business Information
  { value: 'BUSINESS_EMAIL', label: 'Business Email', category: 'Business' },
  { value: 'COMPANY_NAME', label: 'Company Name', category: 'Business' },
  { value: 'COMPANY_DOMAIN', label: 'Company Domain', category: 'Business' },
  { value: 'COMPANY_INDUSTRY', label: 'Company Industry', category: 'Business' },
  { value: 'LINKEDIN_URL', label: 'LinkedIn URL', category: 'Business' },
  
  // System Fields
  { value: 'UP_ID', label: 'UP ID', category: 'System' }
];

/**
 * Detect field mappings for all columns
 */
export function detectFields(
  columns: string[],
  rows: Record<string, string>[]
): FieldMapping[] {
  return columns.map(column => {
    const columnData = analyzeColumn(column, rows);
    const detectedField = detectFieldType(column, columnData.samples);
    
    return {
      csvColumn: column,
      mappedField: detectedField.field,
      confidence: detectedField.confidence,
      completeness: columnData.completeness,
      samples: columnData.samples,
      isAutoMapped: detectedField.confidence > 70
    };
  });
}

/**
 * Detect field type based on column name and sample values
 */
function detectFieldType(
  columnName: string,
  samples: string[]
): { field: string | null; confidence: number } {
  
  const normalized = columnName.toLowerCase().replace(/[_\s-]/g, '');
  
  // Email detection
  if (
    normalized.includes('email') ||
    normalized === 'e' ||
    samples.some(s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))
  ) {
    if (normalized.includes('business') || normalized.includes('work')) {
      return { field: 'BUSINESS_EMAIL', confidence: 95 };
    }
    if (normalized.includes('personal')) {
      return { field: 'PERSONAL_EMAIL', confidence: 95 };
    }
    return { field: 'EMAIL', confidence: 90 };
  }
  
  // First Name detection
  if (
    (normalized.includes('first') && normalized.includes('name')) ||
    normalized === 'firstname' ||
    normalized === 'fname' ||
    normalized === 'givenname'
  ) {
    return { field: 'FIRST_NAME', confidence: 95 };
  }
  
  // Last Name detection
  if (
    (normalized.includes('last') && normalized.includes('name')) ||
    normalized === 'lastname' ||
    normalized === 'lname' ||
    normalized === 'surname' ||
    normalized === 'familyname'
  ) {
    return { field: 'LAST_NAME', confidence: 95 };
  }
  
  // Zip detection (check before phone to avoid confusion)
  if (
    normalized.includes('zip') ||
    normalized.includes('postal') ||
    normalized.includes('postcode')
  ) {
    return { field: 'PERSONAL_ZIP', confidence: 90 };
  }
  
  // Phone Number detection
  if (
    normalized.includes('phone') ||
    normalized.includes('tel') ||
    normalized.includes('mobile') ||
    normalized.includes('cell') ||
    samples.some(s => /^\+?[\d\s\-()]+$/.test(s))
  ) {
    return { field: 'PHONE', confidence: 85 };
  }
  
  // Company Name detection
  if (
    (normalized.includes('company') && normalized.includes('name')) ||
    normalized === 'company' ||
    normalized === 'companyname' ||
    normalized === 'organization' ||
    normalized === 'business'
  ) {
    return { field: 'COMPANY_NAME', confidence: 90 };
  }
  
  // Company Domain detection
  if (
    normalized.includes('domain') ||
    normalized.includes('website') ||
    samples.some(s => /^[a-z0-9-]+\.[a-z]{2,}$/i.test(s))
  ) {
    return { field: 'COMPANY_DOMAIN', confidence: 85 };
  }
  
  // LinkedIn URL detection
  if (
    normalized.includes('linkedin') ||
    samples.some(s => s.includes('linkedin.com'))
  ) {
    return { field: 'LINKEDIN_URL', confidence: 95 };
  }
  
  // Address detection
  if (
    normalized.includes('address') ||
    normalized.includes('street')
  ) {
    return { field: 'PERSONAL_ADDRESS', confidence: 80 };
  }
  
  // City detection
  if (normalized.includes('city')) {
    return { field: 'PERSONAL_CITY', confidence: 90 };
  }
  
  // State detection
  if (normalized.includes('state') || normalized.includes('province')) {
    return { field: 'PERSONAL_STATE', confidence: 90 };
  }
  
  // Industry detection
  if (normalized.includes('industry') || normalized.includes('sector')) {
    return { field: 'COMPANY_INDUSTRY', confidence: 85 };
  }
  
  // UP ID detection
  if (normalized.includes('upid') || normalized === 'id') {
    return { field: 'UP_ID', confidence: 80 };
  }
  
  // No match found - default to DO_NOT_IMPORT
  return { field: 'DO_NOT_IMPORT', confidence: 0 };
}

/**
 * Validate field mappings
 */
export function validateMappings(mappings: FieldMapping[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // At least one field must be mapped (excluding DO_NOT_IMPORT)
  const mappedFields = mappings.filter(
    m => m.mappedField && m.mappedField !== 'DO_NOT_IMPORT'
  );
  
  if (mappedFields.length === 0) {
    errors.push('At least one field must be mapped');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
