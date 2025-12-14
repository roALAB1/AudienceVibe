# Complete AudienceLab Audience Filter System Specification

## Overview

AudienceLab's audience creation system uses a **2-step process** with a comprehensive **9-category filter builder**. This document provides complete specifications for all filter categories based on live dashboard research.

---

## Audience Creation Flow

### Step 1: Create Audience (Simple Dialog)
- **Input:** Audience Name (text field)
- **Action:** Click "Create" → Redirects to Filter Builder page
- **URL Pattern:** `/home/{teamSlug}/audience/{audienceId}`

### Step 2: Filter Builder Page
- **Page Title:** "{Audience Name} Audience Filters"
- **Top Actions:**
  - **Preview** button - Estimate audience size
  - **Generate Audience** button - Finalize and generate the audience
- **Main Content:** Empty state with "Build Audience" CTA button
- **Filter Categories:** 9 tabs (Intent, Date, Business, Financial, Personal, Family, Housing, Location, Contact)

---

## Filter Categories (Complete Specifications)

### 1. Intent Filters

**Modal Title:** "Intent"  
**Question:** "Build your core target audience."

**Filter Structure:** Radio button selection with conditional fields

#### Fields:

**1.1 Audience Method** (Radio buttons - Required)
- Premade
- Keyword
- Custom

**1.2 Business Type** (Radio buttons - Required)
- B2C
- B2B

**1.3 Intent Selection** (Conditional based on Audience Method)

**When "Premade" selected:**
- **What interests does your audience have?**
  - Type: Searchable dropdown
  - Placeholder: "Type to search..."
  - Description: "Search and select a premade list."

**When "Keyword" selected:**
- **What interests does your audience have?**
  - Type: Multi-value text input
  - Placeholder: "Type and press enter..."
  - Description: "Build your own audience based on search terms."
  
- **AI Intent Keyword Generator** (Optional AI assist)
  - Section title with sparkle icon
  - **Describe your audience intent**
  - Large textarea: "Describe your audience intent to generate relevant keywords..."
  - **"Generate"** button to create keywords from description

**When "Custom" selected:**
- **Your Custom Intents**
  - Type: Dropdown
  - Placeholder: "Select..."
  - Description: "Select a custom intent you have created."
  
- **New Custom Intent** button
  - Opens dialog/page to create and save custom intent configurations

**1.4 Minimum Score** (Radio buttons - Required)
- Low
- Medium
- High
- Description: "Set an intent score for your audience."

---

### 2. Date Filters

**Status:** Tab exists but appears to be empty/placeholder
**Note:** May be under development or used for internal filtering

---

### 3. Business Filters

**Modal Title:** "Business"  
**Question:** "What business characteristics does this audience represent?"

**Filter Structure:** Individual fields with various input types

#### Fields:

1. **Business Keywords** (BETA)
   - Type: Multi-value text input
   - Placeholder: "Type and press enter..."
   - Feature: "Show AI Generator" button for AI-assisted keyword generation

2. **Titles**
   - Type: Multi-value text input
   - Placeholder: "Type and press enter..."
   - Examples: CEO, CTO, Marketing Manager, etc.

3. **Seniority**
   - Type: Dropdown (single or multi-select)
   - Placeholder: "Select..."
   - Options: C-Level, VP, Director, Manager, Individual Contributor, etc.

4. **Departments**
   - Type: Dropdown (single or multi-select)
   - Placeholder: "Select..."
   - Examples: Engineering, Marketing, Sales, Finance, etc.

5. **Company Names**
   - Type: Multi-value text input
   - Placeholder: "Type and press enter..."
   - Allows entering specific company names

6. **Company Domains**
   - Type: Multi-value text input
   - Placeholder: "Type and press enter..."
   - Format: company.com

7. **Industries**
   - Type: Dropdown (single or multi-select)
   - Placeholder: "Select..."
   - Examples: Technology, Healthcare, Finance, Retail, etc.

---

### 4. Financial Filters

**Modal Title:** "Financial"  
**Question:** "What is your target audience's financial profile?"

**Filter Structure:** Dynamic filter builder (add multiple field/value pairs)

#### Available Filter Fields:

1. **Income Range**
   - Type: Range or dropdown
   - Format: Dollar amount ranges

2. **Net Worth**
   - Type: Range or dropdown
   - Format: Dollar amount ranges

3. **Credit Rating**
   - Type: Dropdown or range
   - Examples: Excellent, Good, Fair, Poor

4. **New Credit Range**
   - Type: Range or dropdown

5. **Credit Card User**
   - Type: Boolean or dropdown
   - Options: Yes/No or card types

6. **Investment**
   - Type: Dropdown or boolean
   - Examples: Stocks, Bonds, Real Estate, etc.

7. **Mortgage Amount**
   - Type: Range
   - Format: Dollar amount

8. **Occupation Group**
   - Type: Dropdown
   - Examples: Professional, Service, Sales, etc.

9. **Occupation Type**
   - Type: Dropdown
   - More specific than Occupation Group

10. **CRA Code**
    - Type: Text input or dropdown
    - Format: Credit Reporting Agency codes

**UI Pattern:**
- Table with columns: "Field" | "Value"
- "Add" button opens "Add Filter" dialog
- Each filter shows as a row with field name and value
- Can add multiple filters of different types

---

### 5. Personal Filters

**Modal Title:** "Personal"  
**Question:** "What are the personal characteristics of your audience?"

**Filter Structure:** Age range + Dynamic filter builder

#### Fields:

**5.1 Age Range** (Always visible)
- **Min:** Text input - "Enter minimum value"
- **Max:** Text input - "Enter maximum value"

**5.2 Dynamic Filters** (Add multiple field/value pairs)

Available Filter Fields:

1. **Gender**
   - Type: Dropdown
   - Options: Male, Female, Other

2. **Ethnicity**
   - Type: Dropdown
   - Options: Various ethnicity options

3. **Language**
   - Type: Dropdown
   - Options: English, Spanish, Chinese, etc.

4. **Education**
   - Type: Dropdown
   - Options: High School, Bachelor's, Master's, PhD, etc.

5. **Smoker**
   - Type: Boolean dropdown
   - Options: Yes, No

**UI Pattern:**
- Table with columns: "Field" | "Value"
- "Add" button opens "Add Filter" dialog
- Each filter shows as a row with field name and value

---

### 6. Family Filters

**Modal Title:** "Family"  
**Question:** "What is your audience's family composition?"

**Filter Structure:** Dynamic filter builder (add multiple field/value pairs)

#### Available Filter Fields:

1. **Married**
   - Type: Boolean dropdown
   - Options: Yes, No

2. **Marital Status**
   - Type: Dropdown
   - Options: Single, Married, Divorced, Widowed, etc.

3. **Single Parent**
   - Type: Boolean dropdown
   - Options: Yes, No

4. **Generations in Household**
   - Type: Dropdown or number
   - Options: 1, 2, 3+

5. **Children**
   - Type: Dropdown or number
   - Options: 0, 1, 2, 3, 4+

**UI Pattern:**
- Table with columns: "Field" | "Value"
- "Add" button opens "Add Filter" dialog
- Each filter shows as a row with field name and value

---

### 7. Housing Filters

**Modal Title:** "Housing"  
**Question:** "What type of housing does your target audience have?"

**Filter Structure:** Dynamic filter builder (add multiple field/value pairs)

#### Available Filter Fields:

1. **Homeowner Status**
   - Type: Dropdown
   - Options: Own, Rent, Other

2. **Dwelling Type**
   - Type: Dropdown
   - Options: Single Family, Apartment, Condo, Townhouse, Mobile Home, etc.

3. **Year Built**
   - Type: Range (min/max) or dropdown
   - Format: Year (e.g., 1950-2023)

4. **Purchase Price**
   - Type: Range (min/max inputs)
   - Format: Dollar amount

5. **Purchase Year**
   - Type: Range (min/max) or dropdown
   - Format: Year

6. **Estimated Home Value**
   - Type: Range (min/max inputs)
   - Format: Dollar amount

**UI Pattern:**
- Table with columns: "Field" | "Value"
- "Add" button opens "Add Filter" dialog
- Each filter shows as a row with field name and value

---

### 8. Location Filters

**Modal Title:** "Location"  
**Question:** "Where are they located?"

**Filter Structure:** Individual fields with various input types

#### Fields:

1. **Cities**
   - Type: Searchable dropdown (multi-select)
   - Placeholder: "Type to search..."
   - Allows selecting multiple cities

2. **States**
   - Type: Dropdown (multi-select)
   - Placeholder: "Select..."
   - Shows all US states

3. **Zip Codes**
   - Type: Multi-value text input
   - Placeholder: "Type to search, or enter multiple zip codes separated by commas..."
   - Format: Comma-separated zip codes

---

### 9. Contact Filters

**Modal Title:** "Contact"  
**Question:** "What contact information should be included?"

**Filter Structure:** Toggle switches (unique pattern!)

#### Fields:

1. **Verified Personal Emails**
   - Type: Toggle switch
   - Default: Off
   - Description: Include only verified personal email addresses

2. **Verified Business Emails**
   - Type: Toggle switch
   - Default: Off
   - Description: Include only verified business email addresses

3. **Valid Phones**
   - Type: Toggle switch
   - Default: Off
   - Description: Include only valid phone numbers

4. **Skip Traced Wireless Phone Number**
   - Type: Toggle switch
   - Default: Off
   - Description: Include skip-traced wireless phone numbers

5. **Skip Traced Wireless B2B Phone Number**
   - Type: Toggle switch
   - Default: Off
   - Description: Include skip-traced wireless B2B phone numbers

**Note:** Contact filters use toggle switches instead of the dropdown/input pattern used in other categories.

---

## UI Patterns Summary

### Pattern 1: Individual Fields (Intent, Business, Location)
- Each filter has its own dedicated UI element
- Mix of dropdowns, text inputs, radio buttons
- All fields visible in the modal

### Pattern 2: Dynamic Filter Builder (Financial, Personal, Family, Housing)
- Table layout with "Field" and "Value" columns
- "Add" button opens "Add Filter" dialog
- User selects field from dropdown, then enters value
- Can add multiple filters of different types
- Each filter appears as a row in the table

### Pattern 3: Toggle Switches (Contact)
- List of toggle switches
- Each switch enables/disables a specific contact data type
- Simple on/off interaction

### Common Elements (All Modals)
- **Reset** button - Clear all filters in the category
- **Continue** button - Apply filters and close modal
- **Close** (X) button - Close modal without applying changes

---

## TypeScript Data Models

```typescript
// Audience Filter Types
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

// Intent Filters
export interface IntentFilters {
  audienceMethod: 'premade' | 'keyword' | 'custom';
  businessType: 'B2C' | 'B2B';
  minimumScore: 'low' | 'medium' | 'high';
  
  // Conditional fields based on audienceMethod
  premadeList?: string; // When method is 'premade'
  keywords?: string[]; // When method is 'keyword'
  customIntentId?: string; // When method is 'custom'
}

// Business Filters
export interface BusinessFilters {
  businessKeywords?: string[];
  titles?: string[];
  seniority?: string[];
  departments?: string[];
  companyNames?: string[];
  companyDomains?: string[];
  industries?: string[];
}

// Financial Filters (Dynamic)
export interface FinancialFilter {
  field: 
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
  value: string | number | { min: number; max: number };
}

export interface FinancialFilters {
  filters: FinancialFilter[];
}

// Personal Filters
export interface PersonalFilter {
  field: 'gender' | 'ethnicity' | 'language' | 'education' | 'smoker';
  value: string;
}

export interface PersonalFilters {
  ageRange?: {
    min?: number;
    max?: number;
  };
  filters: PersonalFilter[];
}

// Family Filters (Dynamic)
export interface FamilyFilter {
  field: 
    | 'married'
    | 'maritalStatus'
    | 'singleParent'
    | 'generationsInHousehold'
    | 'children';
  value: string | number | boolean;
}

export interface FamilyFilters {
  filters: FamilyFilter[];
}

// Housing Filters (Dynamic)
export interface HousingFilter {
  field:
    | 'homeownerStatus'
    | 'dwellingType'
    | 'yearBuilt'
    | 'purchasePrice'
    | 'purchaseYear'
    | 'estimatedHomeValue';
  value: string | number | { min: number; max: number };
}

export interface HousingFilters {
  filters: HousingFilter[];
}

// Location Filters
export interface LocationFilters {
  cities?: string[];
  states?: string[];
  zipCodes?: string[];
}

// Contact Filters (Toggle switches)
export interface ContactFilters {
  verifiedPersonalEmails: boolean;
  verifiedBusinessEmails: boolean;
  validPhones: boolean;
  skipTracedWirelessPhone: boolean;
  skipTracedWirelessB2BPhone: boolean;
}

// Complete Audience Filter Configuration
export interface AudienceFilters {
  intent?: IntentFilters;
  date?: any; // TBD - appears to be empty/placeholder
  business?: BusinessFilters;
  financial?: FinancialFilters;
  personal?: PersonalFilters;
  family?: FamilyFilters;
  housing?: HousingFilters;
  location?: LocationFilters;
  contact?: ContactFilters;
}

// Audience Model
export interface Audience {
  id: string;
  name: string;
  status: 'draft' | 'generating' | 'active' | 'failed';
  filters: AudienceFilters;
  createdAt: string;
  lastRefreshed?: string;
  audienceSize?: number;
  refreshCount?: number;
  nextRefresh?: string;
}
```

---

## Component Architecture

### Page Components
```
AudienceListPage
├── AudienceTable
│   ├── AudienceRow
│   └── CreateAudienceButton
└── SearchBar

AudienceFilterBuilderPage
├── FilterCategoryTabs
│   ├── IntentTab
│   ├── DateTab
│   ├── BusinessTab
│   ├── FinancialTab
│   ├── PersonalTab
│   ├── FamilyTab
│   ├── HousingTab
│   ├── LocationTab
│   └── ContactTab
├── PreviewButton
├── GenerateAudienceButton
└── EmptyState (when no filters added)
```

### Modal Components
```
IntentFilterModal
├── AudienceMethodSelector (Radio buttons)
├── BusinessTypeSelector (Radio buttons)
├── ConditionalIntentInput (Premade/Keyword/Custom)
└── MinimumScoreSelector (Radio buttons)

BusinessFilterModal
├── BusinessKeywordsInput (with AI generator)
├── TitlesInput
├── SeniorityDropdown
├── DepartmentsDropdown
├── CompanyNamesInput
├── CompanyDomainsInput
└── IndustriesDropdown

DynamicFilterModal (Financial, Personal, Family, Housing)
├── FilterTable
│   └── FilterRow[]
└── AddFilterButton
    └── AddFilterDialog
        ├── FieldDropdown
        └── ValueInput

LocationFilterModal
├── CitiesSearchableDropdown
├── StatesDropdown
└── ZipCodesInput

ContactFilterModal
├── VerifiedPersonalEmailsToggle
├── VerifiedBusinessEmailsToggle
├── ValidPhonesToggle
├── SkipTracedWirelessPhoneToggle
└── SkipTracedWirelessB2BPhoneToggle
```

---

## API Endpoints (Expected)

```typescript
// Create audience (Step 1)
POST /api/audiences
Body: { name: string }
Response: { id: string, name: string, status: 'draft' }

// Update audience filters (Step 2)
PATCH /api/audiences/:id/filters
Body: { filters: AudienceFilters }
Response: { success: boolean }

// Preview audience size
POST /api/audiences/:id/preview
Body: { filters: AudienceFilters }
Response: { estimatedSize: number }

// Generate audience (finalize)
POST /api/audiences/:id/generate
Response: { success: boolean, status: 'generating' }

// Get audience details
GET /api/audiences/:id
Response: Audience

// List audiences
GET /api/audiences
Response: { audiences: Audience[] }

// Delete audience
DELETE /api/audiences/:id
Response: { success: boolean }
```

---

## Implementation Phases

### Phase 1: Core UI Structure ✅ (Research Complete)
- [x] Research all 9 filter categories
- [x] Document filter fields and UI patterns
- [x] Create TypeScript data models
- [x] Define component architecture

### Phase 2: Basic Audience Creation Flow
- [ ] Create Audience List page
- [ ] Implement Create Audience dialog
- [ ] Build Filter Builder page layout
- [ ] Add filter category tabs
- [ ] Implement empty state

### Phase 3: Filter Modals (Priority Order)
- [ ] Business filters (most common for B2B)
- [ ] Location filters (simple, high-value)
- [ ] Intent filters (core targeting)
- [ ] Contact filters (simple toggles)
- [ ] Personal filters (dynamic builder)
- [ ] Financial filters (dynamic builder)
- [ ] Family filters (dynamic builder)
- [ ] Housing filters (dynamic builder)
- [ ] Date filters (if needed)

### Phase 4: Actions & Integration
- [ ] Preview functionality
- [ ] Generate Audience action
- [ ] API integration
- [ ] Filter persistence
- [ ] Validation and error handling

### Phase 5: Advanced Features
- [ ] AI keyword generator (Intent & Business)
- [ ] Custom intent creation
- [ ] Filter templates/presets
- [ ] Audience duplication
- [ ] Bulk actions

---

## Key Design Decisions

### 1. Modal-Based Filter UI
- Each filter category opens in a modal
- Keeps main page clean and focused
- Allows complex filter configurations without overwhelming the user

### 2. Three UI Patterns
- **Individual Fields:** For categories with fixed, well-defined fields
- **Dynamic Builder:** For categories with many optional field/value combinations
- **Toggle Switches:** For simple enable/disable options

### 3. Progressive Disclosure
- Start with empty state
- Show filter tabs upfront
- Open modals on demand
- Only show "Preview" and "Generate" when filters are added

### 4. Flexible Filter Combinations
- All filter categories are optional
- Within categories, most fields are optional
- Allows both simple and complex audience definitions

---

## Screenshots Reference

All research screenshots saved in:
- `/home/ubuntu/screenshots/build_audiencelab_io_2025-12-14_*.webp`

Key screenshots:
- Audience List page
- Filter Builder page (empty state)
- Intent filter modal (all 3 methods)
- Business filter modal
- Financial filter modal with Add Filter dialog
- Personal filter modal with Add Filter dialog
- Family filter modal with Add Filter dialog
- Housing filter modal with Add Filter dialog
- Location filter modal
- Contact filter modal

---

## Next Steps

1. **Review this specification** with stakeholders
2. **Prioritize filter categories** for MVP (suggest: Business, Location, Intent, Contact)
3. **Design database schema** for storing filter configurations
4. **Create UI mockups** in Figma (optional, can build directly from this spec)
5. **Start implementation** with Phase 2 (Basic Audience Creation Flow)

---

## Notes

- **Date filters** appear to be empty/placeholder - may not need implementation initially
- **AI features** (keyword generators) can be Phase 5 - not critical for MVP
- **Custom intents** can be Phase 5 - users can start with Premade and Keyword methods
- Focus on **Business, Location, and Intent** filters first - these cover most B2B use cases
- **Dynamic filter builders** (Financial, Personal, Family, Housing) share the same UI pattern - can create reusable component

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-14  
**Research Source:** Live AudienceLab Dashboard (build.audiencelab.io)  
**Researcher:** Manus AI
