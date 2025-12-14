# AudienceLab Audience Creation - Complete Specification

## Research Date
December 14, 2025

## Overview
This document provides a complete specification for building a one-to-one clone of AudienceLab's Audience Creation feature based on research of the live dashboard at `https://build.audiencelab.io`.

---

## User Flow

### 1. Audience List Page
**URL:** `/audiences` (in our app)
**AudienceLab URL:** `https://build.audiencelab.io/home/{teamSlug}`

**Components:**
- Page title: "Audiences" or "Audience Lists"
- Search bar: "Search by name..."
- "Create" button (top right)
- Data table with columns:
  - Name
  - Status (badge: "Completed", "No Data", "Processing", etc.)
  - Creation Date (sortable, default sort descending)
  - Last Refreshed (sortable)
  - Audience Size (sortable)
  - Refresh Count (sortable)
  - Next Refresh (sortable)
  - Actions (dropdown menu)

**Actions Menu:**
- View Details
- Edit Filters
- Refresh Audience
- Delete Audience

---

### 2. Create Audience Dialog (Step 1)
**Trigger:** Click "Create" button on Audience List page

**Dialog Content:**
- Title: "Create Audience"
- Single field: "Name" (text input, required)
- Buttons:
  - "Cancel" - Close dialog
  - "Create" - Create audience and navigate to filter builder

**Behavior:**
- On "Create" click:
  - Call API to create audience with name
  - Redirect to `/audiences/{audienceId}/filters`

---

### 3. Audience Filter Builder Page (Step 2)
**URL:** `/audiences/{audienceId}/filters`
**AudienceLab URL:** `https://build.audiencelab.io/home/{teamSlug}/audience/{audienceId}`

**Page Structure:**

#### Header
- Breadcrumbs: Home > {TeamName} > Audience > Filters
- Page Title: "{Audience Name} Audience Filters"
- Edit button (pencil icon) - to edit audience name

#### Top Action Buttons
- **Preview** button - Show audience size preview
- **Generate Audience** button - Finalize and generate the audience

#### Filter Category Tabs (Horizontal)
9 tabs in this order:
1. Intent
2. Date  
3. Business
4. Financial
5. Personal
6. Family
7. Housing
8. Location
9. Contact

#### Main Content Area

**Empty State** (when no filters added):
- Document icon
- Heading: "Preview Your Audience"
- Text: "Customize your filters to build your audience. Get started by building your core target audience."
- "Build Audience" button (primary CTA)

**With Filters** (after adding filters):
- Display applied filters grouped by category
- Each filter shows: Category name, filter details, remove button
- "Add More Filters" button
- Audience size estimate (if available)

---

## Filter Categories Detailed

### 1. Intent Filters
**Modal Title:** "Intent"
**Question:** TBD (need to research)

**Filter Structure:** TBD

---

### 2. Date Filters
**Modal Title:** "Date"
**Question:** TBD (need to research)

**Filter Structure:** TBD

---

### 3. Business Filters
**Modal Title:** "Business"
**Question:** "What business characteristics does this audience represent?"

**Filter Fields:**

1. **Business Keywords** (BETA)
   - Type: Multi-value text input
   - Placeholder: "Type and press enter..."
   - Special Feature: "Show AI Generator" button
   - AI Generator: Opens dialog to generate keywords using AI

2. **Titles**
   - Type: Multi-value text input
   - Placeholder: "Type and press enter..."
   - Examples: CEO, CTO, VP of Marketing, Director of Sales

3. **Seniority**
   - Type: Multi-select dropdown
   - Placeholder: "Select..."
   - Options: (need API to determine exact values)
     - Likely: C-Level, VP, Director, Manager, Individual Contributor, Entry Level

4. **Departments**
   - Type: Multi-select dropdown
   - Placeholder: "Select..."
   - Options: (need API to determine exact values)
     - Likely: Marketing, Sales, Engineering, HR, Finance, Operations, IT, Customer Success

5. **Company Names**
   - Type: Multi-value text input
   - Placeholder: "Type and press enter..."
   - Examples: Google, Microsoft, Apple, Amazon

6. **Company Domains**
   - Type: Multi-value text input
   - Placeholder: "Type and press enter..."
   - Examples: google.com, microsoft.com, apple.com

7. **Industries**
   - Type: Multi-select dropdown
   - Placeholder: "Select..."
   - Options: (need API to determine exact values)
     - Likely: Technology, Healthcare, Finance, Retail, Manufacturing, Education, etc.

**Action Buttons:**
- Reset - Clear all business filters
- Continue - Apply filters and close modal

---

### 4. Financial Filters
**Modal Title:** "Financial"
**Question:** "What is your target audience's financial profile?"

**Filter Structure:** Dynamic filter builder

**Available Filter Fields:**

1. **Income Range**
   - Type: Range (min/max inputs)
   - Format: Dollar amount

2. **Net Worth**
   - Type: Range (min/max inputs)
   - Format: Dollar amount

3. **Credit Rating**
   - Type: Dropdown or range
   - Options: (need API to determine)

4. **New Credit Range**
   - Type: Range or dropdown
   - Options: (need API to determine)

5. **Credit Card User**
   - Type: Boolean or dropdown
   - Options: Yes/No or specific card types

6. **Investment**
   - Type: Dropdown or multi-select
   - Options: (need API to determine)

7. **Mortgage Amount**
   - Type: Range (min/max inputs)
   - Format: Dollar amount

8. **Occupation Group**
   - Type: Dropdown
   - Options: (need API to determine)

9. **Occupation Type**
   - Type: Dropdown
   - Options: (need API to determine)

10. **CRA Code**
    - Type: Text input or dropdown
    - Options: (need API to determine)

**How to Add Filters:**
1. Click "Add" button
2. Select field from dropdown
3. Enter value(s) based on field type
4. Click "Add" to add to filter list
5. Repeat to add multiple filters

**Action Buttons:**
- Reset - Clear all financial filters
- Continue - Apply filters and close modal

---

### 5. Personal Filters
**Modal Title:** "Personal"
**Question:** "What are the personal characteristics of your audience?"

**Special Field (at top):**
- **Age Range**
  - Min: Text input "Enter minimum value"
  - Max: Text input "Enter maximum value"

**Filter Structure:** Dynamic filter builder (same as Financial)

**Available Filter Fields:**

1. **Gender**
   - Type: Dropdown or multi-select
   - Options: Male, Female, Other, Prefer not to say

2. **Ethnicity**
   - Type: Dropdown or multi-select
   - Options: (need API to determine)

3. **Language**
   - Type: Dropdown or multi-select
   - Options: English, Spanish, French, Chinese, etc.

4. **Education**
   - Type: Dropdown or multi-select
   - Options: High School, Bachelor's, Master's, PhD, etc.

5. **Smoker**
   - Type: Boolean dropdown
   - Options: Yes, No

**How to Add Filters:**
1. Click "Add" button
2. Select field from dropdown
3. Select value(s) from dropdown or enter text
4. Click "Add" to add to filter list
5. Repeat to add multiple filters

**Action Buttons:**
- Reset - Clear all personal filters (including age range)
- Continue - Apply filters and close modal

---

### 6. Family Filters
**Modal Title:** "Family"
**Question:** TBD (need to research)

**Filter Structure:** TBD

---

### 7. Housing Filters
**Modal Title:** "Housing"
**Question:** TBD (need to research)

**Filter Structure:** TBD

---

### 8. Location Filters
**Modal Title:** "Location"
**Question:** "Where are they located?"

**Filter Fields:**

1. **Cities**
   - Type: Searchable multi-select dropdown
   - Placeholder: "Type to search..."
   - Behavior: Type-ahead search for cities

2. **States**
   - Type: Multi-select dropdown
   - Placeholder: "Select..."
   - Options: All US states

3. **Zip Codes**
   - Type: Multi-value text input
   - Placeholder: "Type to search, or enter multiple zip codes separated by commas..."
   - Behavior: Can paste comma-separated list

**Action Buttons:**
- Reset - Clear all location filters
- Continue - Apply filters and close modal

---

### 9. Contact Filters
**Modal Title:** "Contact"
**Question:** TBD (need to research)

**Filter Structure:** TBD

---

## Filter Logic & Behavior

### Filter Combination Logic
- **Within a category:** Filters are combined with OR logic
  - Example: Title = "CEO" OR Title = "CTO"
- **Between categories:** Categories are combined with AND logic
  - Example: (Business filters) AND (Location filters) AND (Financial filters)

### Filter Display
- Applied filters are displayed in the main content area
- Grouped by category
- Each filter shows:
  - Category icon
  - Category name
  - Filter details (field: value)
  - Remove button (X)

### Filter Persistence
- Filters are saved automatically when "Continue" is clicked
- Filters persist when navigating away and back
- Filters can be edited by clicking the category tab again

---

## Preview Functionality

### Preview Button
**Location:** Top right of filter builder page

**Behavior:**
- Clicks "Preview" button
- Shows loading state
- Calls API to estimate audience size
- Displays result in modal or inline:
  - Estimated audience size (number)
  - Confidence level (if available)
  - Sample audience members (if available)
  - Breakdown by filter category (if available)

**Preview Modal Content:**
- Title: "Audience Preview"
- Estimated Size: Large number display
- Text: "Based on your current filters"
- Optional: Sample data table showing 5-10 example matches
- Close button

---

## Generate Audience Functionality

### Generate Audience Button
**Location:** Top right of filter builder page

**Behavior:**
- Validates that at least one filter is applied
- Shows confirmation dialog:
  - Title: "Generate Audience?"
  - Text: "This will process your audience based on the applied filters. This may take several minutes."
  - Estimated cost/credits (if applicable)
  - Buttons: "Cancel", "Generate"
- On "Generate" click:
  - Call API to start audience generation
  - Show loading state
  - Redirect to audience list page
  - Show toast: "Audience generation started. You'll be notified when it's complete."

---

## API Integration Requirements

### Endpoints Needed

1. **Create Audience**
   - `POST /audiences`
   - Body: `{ name: string }`
   - Returns: `{ id: string, name: string, status: string, createdAt: string }`

2. **Get Audience Details**
   - `GET /audiences/{id}`
   - Returns: Full audience object with filters

3. **Update Audience Filters**
   - `PUT /audiences/{id}/filters`
   - Body: `{ filters: FilterObject }`
   - Returns: Updated audience object

4. **Preview Audience**
   - `POST /audiences/{id}/preview`
   - Body: `{ filters: FilterObject }`
   - Returns: `{ estimatedSize: number, sampleData?: any[] }`

5. **Generate Audience**
   - `POST /audiences/{id}/generate`
   - Returns: `{ status: string, jobId: string }`

6. **Get Filter Options**
   - `GET /filter-options/{category}`
   - Returns: Available options for dropdown filters
   - Examples:
     - `/filter-options/seniority` → `["C-Level", "VP", "Director", ...]`
     - `/filter-options/industries` → `["Technology", "Healthcare", ...]`

---

## UI Components to Build

### Pages
1. `AudiencesPage.tsx` - List of audiences
2. `AudienceFilterBuilderPage.tsx` - Main filter builder page

### Modals/Dialogs
1. `CreateAudienceDialog.tsx` - Initial name input
2. `BusinessFiltersModal.tsx` - Business filters
3. `FinancialFiltersModal.tsx` - Financial filters
4. `PersonalFiltersModal.tsx` - Personal filters
5. `LocationFiltersModal.tsx` - Location filters
6. `IntentFiltersModal.tsx` - Intent filters (TBD)
7. `DateFiltersModal.tsx` - Date filters (TBD)
8. `FamilyFiltersModal.tsx` - Family filters (TBD)
9. `HousingFiltersModal.tsx` - Housing filters (TBD)
10. `ContactFiltersModal.tsx` - Contact filters (TBD)
11. `AudiencePreviewModal.tsx` - Preview results
12. `GenerateAudienceConfirmDialog.tsx` - Confirm generation

### Reusable Components
1. `FilterCategoryTab.tsx` - Tab button for each category
2. `AppliedFilterChip.tsx` - Display applied filter with remove button
3. `DynamicFilterBuilder.tsx` - Reusable for Financial/Personal/etc.
4. `AddFilterDialog.tsx` - Sub-dialog for adding dynamic filters
5. `MultiValueInput.tsx` - Input that accepts multiple values (press enter to add)
6. `RangeInput.tsx` - Min/max input pair

---

## Data Models

### Audience
```typescript
interface Audience {
  id: string;
  name: string;
  status: 'draft' | 'processing' | 'completed' | 'failed' | 'no_data';
  createdAt: string;
  lastRefreshed?: string;
  audienceSize: number;
  refreshCount: number;
  nextRefresh?: string;
  filters: AudienceFilters;
}
```

### AudienceFilters
```typescript
interface AudienceFilters {
  intent?: IntentFilters;
  date?: DateFilters;
  business?: BusinessFilters;
  financial?: FinancialFilters;
  personal?: PersonalFilters;
  family?: FamilyFilters;
  housing?: HousingFilters;
  location?: LocationFilters;
  contact?: ContactFilters;
}
```

### BusinessFilters
```typescript
interface BusinessFilters {
  businessKeywords?: string[];
  titles?: string[];
  seniority?: string[];
  departments?: string[];
  companyNames?: string[];
  companyDomains?: string[];
  industries?: string[];
}
```

### FinancialFilters
```typescript
interface FinancialFilters {
  filters: DynamicFilter[];
}

interface DynamicFilter {
  field: string; // 'incomeRange' | 'netWorth' | 'creditRating' | etc.
  value: any; // Type depends on field
}
```

### PersonalFilters
```typescript
interface PersonalFilters {
  ageRange?: {
    min?: number;
    max?: number;
  };
  filters: DynamicFilter[];
}
```

### LocationFilters
```typescript
interface LocationFilters {
  cities?: string[];
  states?: string[];
  zipCodes?: string[];
}
```

---

## Implementation Priority

### Phase 1: Core Infrastructure (MUST HAVE)
1. ✅ Create Audience dialog
2. ✅ Audience Filter Builder page layout
3. ✅ Filter category tabs
4. ✅ Empty state UI

### Phase 2: Essential Filters (MUST HAVE)
1. ✅ Business Filters modal (all 7 fields)
2. ✅ Location Filters modal (all 3 fields)
3. ✅ Applied filters display
4. ✅ Remove filter functionality

### Phase 3: Advanced Filters (SHOULD HAVE)
1. ✅ Personal Filters modal (age range + dynamic filters)
2. ✅ Financial Filters modal (dynamic filters)
3. ✅ Filter persistence

### Phase 4: Preview & Generation (MUST HAVE)
1. ✅ Preview button & modal
2. ✅ Generate Audience button & confirmation
3. ✅ API integration for preview
4. ✅ API integration for generation

### Phase 5: Remaining Filters (NICE TO HAVE)
1. ⏳ Intent Filters
2. ⏳ Date Filters
3. ⏳ Family Filters
4. ⏳ Housing Filters
5. ⏳ Contact Filters

### Phase 6: Polish & Optimization (NICE TO HAVE)
1. ⏳ AI Keyword Generator for Business Keywords
2. ⏳ Real-time audience size estimation
3. ⏳ Filter validation & error handling
4. ⏳ Keyboard shortcuts
5. ⏳ Filter templates/presets

---

## Key Design Decisions

### Modal vs Inline
- **Decision:** Use modals for filter categories (matches AudienceLab)
- **Rationale:** Keeps main page clean, focuses user attention, allows complex filter UIs

### Dynamic vs Static Filters
- **Decision:** Use dynamic filter builder for Financial/Personal categories
- **Rationale:** Matches AudienceLab's pattern, allows flexible field additions

### Filter Storage
- **Decision:** Store filters as structured JSON in database
- **Rationale:** Easy to query, modify, and display; matches API structure

### Preview Timing
- **Decision:** Manual preview via button click (not automatic)
- **Rationale:** Matches AudienceLab, avoids excessive API calls, gives user control

---

## Open Questions & Research Needed

1. ❓ **Intent Filters:** What fields are available?
2. ❓ **Date Filters:** What date-based targeting options exist?
3. ❓ **Family Filters:** What family-related fields are available?
4. ❓ **Housing Filters:** What housing-related fields are available?
5. ❓ **Contact Filters:** What contact-related fields are available?
6. ❓ **Filter Options:** What are the exact dropdown options for:
   - Seniority levels
   - Departments
   - Industries
   - Credit ratings
   - Education levels
   - Ethnicity options
7. ❓ **AI Keyword Generator:** How does the AI keyword generation work?
8. ❓ **Audience Generation:** What happens after clicking "Generate Audience"?
   - How long does it take?
   - How is the user notified?
   - Can they see progress?
9. ❓ **Filter Limits:** Are there limits on:
   - Number of filters per category?
   - Total number of filters?
   - Number of values per multi-value field?
10. ❓ **Pricing/Credits:** Does audience generation consume credits?

---

## Next Steps

1. ✅ Complete research on remaining 5 filter categories
2. ✅ Document all filter options from API
3. ✅ Create detailed component specifications
4. ✅ Build Phase 1: Core Infrastructure
5. ✅ Build Phase 2: Essential Filters
6. ✅ Test with real AudienceLab API
7. ✅ Iterate based on user feedback
8. ✅ Build Phase 3-6 based on priority

---

## Success Criteria

### Functional Requirements
- ✅ User can create a new audience with a name
- ✅ User can add filters from all 9 categories
- ✅ User can see applied filters clearly
- ✅ User can remove individual filters
- ✅ User can preview audience size
- ✅ User can generate the audience
- ✅ Filters persist when navigating away
- ✅ Generated audience appears in audience list

### UX Requirements
- ✅ UI matches AudienceLab's design patterns
- ✅ Filter modals are intuitive and easy to use
- ✅ Loading states are clear
- ✅ Error messages are helpful
- ✅ Mobile responsive (if required)

### Technical Requirements
- ✅ API integration works correctly
- ✅ Data validation prevents invalid filters
- ✅ Performance is acceptable (< 2s for preview)
- ✅ Code is maintainable and well-documented
- ✅ Unit tests cover core functionality

---

## Appendix: Screenshots

- Audience List Page: `/home/ubuntu/screenshots/build_audiencelab_io_2025-12-14_09-27-10_3316.webp`
- Business Filter Modal: `/home/ubuntu/screenshots/build_audiencelab_io_2025-12-14_09-27-31_8350.webp`
- Personal Filter Modal: (see research notes)
- Location Filter Modal: (see research notes)
- Financial Filter Modal: (see research notes)
