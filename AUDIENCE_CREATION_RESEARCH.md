# AudienceLab Audience Creation Research

## Research Date
December 14, 2025

## Dashboard URL
https://build.audiencelab.io/home/onboarding

## Audience Creation Flow

### Step 1: Create Audience (Initial Dialog)
**URL:** https://build.audiencelab.io/home/onboarding (Audience Lists page)

**Action:** Click "Create" button

**Dialog:**
- Title: "Create Audience"
- Single field: "Name" (text input)
- Buttons: "Cancel", "Create"

**Behavior:** After clicking Create, redirects to audience filter builder page

---

### Step 2: Audience Filter Builder
**URL:** https://build.audiencelab.io/home/onboarding/audience/{audienceId}

**Page Title:** "{Audience Name} Audience Filters"

**Top Action Buttons:**
- **Preview** - Preview the audience size/composition
- **Generate Audience** - Finalize and generate the audience

**Filter Category Tabs:**
1. Intent
2. Date
3. Business
4. Financial
5. Personal
6. Family
7. Housing
8. Location
9. Contact

**Main Content Area:**
- Empty state with "Preview Your Audience" message
- "Build Audience" button to start adding filters

---

## Filter Categories Detailed

### Business Filters
**Modal Title:** "Business"
**Question:** "What business characteristics does this audience represent?"

**Available Filters:**

1. **Business Keywords** (BETA)
   - Type: Multi-value text input
   - Input: "Type and press enter..."
   - Special: Has "Show AI Generator" button for AI-assisted keyword generation

2. **Titles**
   - Type: Multi-value text input
   - Input: "Type and press enter..."
   - Example: CEO, CTO, Marketing Manager, etc.

3. **Seniority**
   - Type: Dropdown (multi-select)
   - Options: Need to click to see options
   - Likely: C-Level, VP, Director, Manager, Individual Contributor, etc.

4. **Departments**
   - Type: Dropdown (multi-select)
   - Options: Need to click to see options
   - Likely: Marketing, Sales, Engineering, HR, Finance, etc.

5. **Company Names**
   - Type: Multi-value text input
   - Input: "Type and press enter..."
   - Example: Google, Microsoft, Apple, etc.

6. **Company Domains**
   - Type: Multi-value text input
   - Input: "Type and press enter..."
   - Example: google.com, microsoft.com, etc.

7. **Industries**
   - Type: Dropdown (multi-select)
   - Options: Need to click to see options
   - Likely: Technology, Healthcare, Finance, Retail, etc.

**Action Buttons:**
- **Reset** - Clear all business filters
- **Continue** - Apply filters and return to main filter builder

---

## Filter Categories To Research

### Intent Filters
- [ ] Click Intent tab and document available filters

### Date Filters
- [ ] Click Date tab and document available filters

### Financial Filters
- [ ] Click Financial tab and document available filters

### Personal Filters
- [ ] Click Personal tab and document available filters

### Family Filters
- [ ] Click Family tab and document available filters

### Housing Filters
- [ ] Click Housing tab and document available filters

### Location Filters
- [ ] Click Location tab and document available filters

### Contact Filters
- [ ] Click Contact tab and document available filters

---

## Key Observations

1. **Two-Step Creation Process:**
   - Step 1: Create audience with name only
   - Step 2: Add filters in dedicated filter builder page

2. **Modal-Based Filter UI:**
   - Each filter category opens in a modal dialog
   - Modals have consistent structure: Title, Question, Filter fields, Reset/Continue buttons

3. **Filter Types:**
   - Text inputs (multi-value, press enter to add)
   - Dropdowns (likely multi-select)
   - AI-assisted generation (Business Keywords)

4. **No AND/OR Logic Visible Yet:**
   - Need to research how multiple filters combine
   - Need to check if there's AND/OR toggle between filter groups

5. **Preview Functionality:**
   - "Preview" button suggests real-time audience size estimation
   - Need to test with actual filters applied

6. **Generate vs Build:**
   - "Build Audience" button in empty state
   - "Generate Audience" button in header
   - Need to understand the difference

---

## Next Steps

1. Click through all 9 filter category tabs
2. Document all available filter options in each category
3. Test adding filters and see how they display in the main area
4. Test the Preview functionality
5. Test the Generate Audience functionality
6. Document the complete end-to-end flow
7. Create comprehensive specification document

---

## Screenshots

- Audience Lists page: `/home/ubuntu/screenshots/build_audiencelab_io_2025-12-14_09-27-10_3316.webp`
- Business Filter Modal: `/home/ubuntu/screenshots/build_audiencelab_io_2025-12-14_09-27-31_8350.webp`
