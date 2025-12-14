# AudienceLab Enrichment Dashboard - TODO

## Critical Production Issues (URGENT)
- [x] Fix missing index.css in production build (MIME type error) - Added CSS import to index.tsx
- [ ] Fix enrichment job submission error: "failed to close storage writer: rpc error: code = Unavailable desc = connection error" - This is an AudienceLab API timeout issue, not our code
- [x] Add all 48 AudienceLab input fields to column mapping (expanded from 16 to 48 fields)
- [ ] Remove Tailwind CDN from production (use PostCSS build) - Low priority

## Multi-Field Input Matching
- [x] Create column mapping types with 16 AudienceLab input fields
- [x] Implement CSV parser utility
- [x] Add column mapping UI to select which CSV columns to use for matching
- [x] Map CSV columns to AudienceLab input fields (EMAIL, FIRST_NAME, LAST_NAME, COMPANY_NAME, etc.)
- [x] Add OR/AND toggle for match logic
- [x] Update job submission to include all selected input columns
- [x] Update validation to support multi-field input (basic implementation)
- [x] Create simplified ColumnMappingStep component (no shadcn dependencies)
- [x] Integrate ColumnMappingStep into EnrichmentTab workflow
- [x] Update job submission to use records/columns/operator
- [ ] Update cost estimation for multi-field matching
- [ ] Test with various CSV structures
- [ ] Deploy and verify multi-field matching works

See MULTI_FIELD_PROGRESS.md for detailed implementation status

Note: Project has dual structure (client/ and client/src/). Multi-field components created in client/ structure to match existing EnrichmentTab.



## Current Task: Fix Production Issues
- [ ] Investigate index.css build configuration
- [ ] Fix Vite build to include index.css
- [ ] Debug storage writer timeout error
- [ ] Expand field selection to include all 40+ AudienceLab fields



## Update Field Selection to Match AudienceLab CSV
- [x] Parse AudienceLab CSV header to get all 74 field names
- [x] Update constants.ts ALL_FIELDS to use exact AudienceLab field names (UUID, FIRST_NAME, BUSINESS_EMAIL, etc.)
- [x] Map field IDs to match AudienceLab output format
- [x] Update field packages to reference correct field IDs
- [x] Test field selection displays all AudienceLab fields
- [x] Add new categories: System, Demographics, Contact, Skiptrace



## Critical Bugs (Production)
- [x] Fix "setConcurrency is not defined" error - Added setter functions to useState
- [x] Fix "setBatchSize is not defined" error - Added setter functions to useState
- [x] Fix empty results table - Changed CSV parser to use proper parseCSVLine function
- [x] Fix results table display - Show all columns from enriched data instead of just selected fields
- [x] Fix CSV download - Now uses proper CSV parser that handles quoted values
- [ ] Credit calculation issue - AudienceLab returns all 74 fields but we only charge for selected fields (documented in code with TODO)

Note: Credit calculation needs AudienceLab API to return actual cost. Current estimate may be lower than actual usage.



## New Critical Bug
- [x] Fix "unsupported column JOB_TITLE" error - Used official API documentation
- [x] Research AudienceLab API documentation - Found AUDIENCELAB_API.md with exact list
- [x] Update AUDIENCELAB_INPUT_FIELDS to use exact API column names - Now matches the 16 supported fields

Note: AudienceLab API only supports 16 input fields for matching (EMAIL, PERSONAL_EMAIL, BUSINESS_EMAIL, FIRST_NAME, LAST_NAME, PHONE, PERSONAL_ADDRESS, PERSONAL_CITY, PERSONAL_STATE, PERSONAL_ZIP, COMPANY_NAME, COMPANY_DOMAIN, COMPANY_INDUSTRY, SHA256_PERSONAL_EMAIL, LINKEDIN_URL, UP_ID). JOB_TITLE and other fields are OUTPUT only.



## Critical CSV Parsing Bug
- [x] Fix parseCSVLine to handle multi-line fields (fields with newlines inside quotes)
- [x] Fix handling of escaped quotes inside quoted fields
- [x] Fix handling of JSON arrays in CSV fields (COMPANY_NAME_HISTORY, JOB_TITLE_HISTORY)
- [x] Test with actual AudienceLab CSV that has complex COMPANY_DESCRIPTION fields - Tested with 4527 records, all parsed correctly

Fixed: Rewrote CSV parser to use character-by-character parsing with quote state tracking instead of line-by-line splitting. Now correctly handles multi-line fields, escaped quotes, and complex data.



## Spark V2 - Smart Query Assistant Implementation
- [x] Create Spark V2 feature directory structure
- [x] Build ModeSelector component (Intent vs B2B)
- [x] Build QueryInput component with textarea
- [x] Build QueryQualityChecker component with 7 validation rules
- [x] Build AdvancedOptions component (context phrases, lens, granularity)
- [ ] Create Spark tRPC router for API integration
- [x] Add Spark search page route
- [ ] Build ExportToAudienceLab dialog component
- [ ] Add query templates library
- [ ] Test all components and validation
- [ ] Run validation: npm run validate


## Dependency Audit and Optimization
- [x] Run pnpm audit for security vulnerabilities
- [x] Analyze dependency tree for duplicates
- [x] Identify unused dependencies
- [x] Check for conflicting package versions
- [x] Remove unnecessary packages (7 removed: framer-motion, dotenv, add, autoprefixer, @tailwindcss/typography, @vercel/node, tw-animate-css)
- [x] Test build after cleanup - SUCCESS


## Code Splitting Implementation
- [x] Install rollup-plugin-visualizer for bundle analysis
- [x] Analyze current bundle composition
- [x] Implement lazy loading for all route components (Home, SparkSearchPage, NotFound)
- [x] Split Spark V2 feature into separate chunk (604KB lazy loaded)
- [x] Split Enrichment feature into separate chunk (included in main)
- [x] Split Charts/Recharts into separate chunk (436KB charts-vendor)
- [x] Configure Vite manual chunks for vendor splitting (react, ui, data, charts, aws)
- [x] Test build and verify chunk sizes
- [x] Measure bundle size reduction (Initial: 996KB → 545KB, 45% reduction)
- [x] Test dev server stability after splitting - Server running successfully


---

## NEW: Complete AudienceLab Dashboard Features

### Phase 1: API Client Foundation
- [x] Create shared/audiencelab-types.ts with all TypeScript interfaces
- [x] Create shared/audiencelab-client.ts with API client class
- [x] Add AUDIENCELAB_API_KEY to .env
- [x] Implement retry logic with exponential backoff
- [x] Add error handling for 404, 429, 500
- [x] Write tests for API client
- [x] Validate: TypeScript compiles, tests pass

### Phase 2: Audiences Management Feature
- [ ] Create client/src/pages/Audiences.tsx page
- [ ] Create client/src/components/audiences/AudienceTable.tsx
- [ ] Create client/src/components/audiences/AudienceForm.tsx
- [ ] Implement GET /audiences (list with pagination)
- [ ] Implement POST /audiences (create with filters)
- [ ] Implement DELETE /audiences/{id}
- [ ] Add loading states and error handling
- [ ] Validate: Feature works end-to-end, no errors

### Phase 3: Studio Segments Feature
- [ ] Create client/src/pages/Studio.tsx page
- [ ] Create client/src/components/studio/SegmentTable.tsx
- [ ] Implement GET /segments/{id} (with pagination)
- [ ] Display segment data in table
- [ ] Add export functionality (CSV, JSON)
- [ ] Show API endpoint with copy button
- [ ] Add loading states and error handling
- [ ] Validate: Feature works end-to-end, no errors

### Phase 4: Pixels Management Feature
- [ ] Create client/src/pages/Pixels.tsx page
- [ ] Create client/src/components/pixels/PixelTable.tsx
- [ ] Create client/src/components/pixels/PixelForm.tsx
- [ ] Implement GET /pixels (list)
- [ ] Implement POST /pixels (create)
- [ ] Implement DELETE /pixels/{id}
- [ ] Show pixel tracking code snippet
- [ ] Add loading states and error handling
- [ ] Validate: Feature works end-to-end, no errors

### Phase 5: Navigation & Layout Updates
- [ ] Add Audiences link to navigation
- [ ] Add Studio link to navigation
- [ ] Add Pixels link to navigation
- [ ] Update App.tsx with new routes
- [ ] Test navigation between all pages
- [ ] Validate: All routes work, no broken links

### Phase 6: Testing & Checkpoint
- [ ] Test all features with real API
- [ ] Fix any bugs found
- [ ] Run TypeScript validation
- [ ] Create checkpoint
- [ ] Validate: All features work, checkpoint created


---

## NEW: Server-Side tRPC Routes for AudienceLab API

### Phase 1: tRPC Router Setup
- [ ] Create server/routers/audiencelab.ts
- [ ] Import AudienceLab client and types
- [ ] Set up base router with API key from env
- [ ] Add error handling middleware
- [ ] Register router in main tRPC router
- [ ] Validate: TypeScript compiles, no errors

### Phase 2: Audiences Routes
- [ ] Create audiences.list route (with pagination)
- [ ] Create audiences.get route (by ID)
- [ ] Create audiences.create route
- [ ] Create audiences.delete route
- [ ] Create audiences.getAttributes route
- [ ] Write tests for audiences routes
- [ ] Validate: All tests pass, routes work

### Phase 3: Enrichment Routes
- [ ] Create enrichment.enrichContact route
- [ ] Create enrichment.createJob route
- [ ] Create enrichment.getJobs route
- [ ] Create enrichment.getJob route (by ID)
- [ ] Write tests for enrichment routes
- [ ] Validate: All tests pass, routes work

### Phase 4: Segments and Pixels Routes
- [ ] Create segments.getData route
- [ ] Create pixels.list route
- [ ] Create pixels.get route (by ID)
- [ ] Create pixels.create route
- [ ] Create pixels.delete route
- [ ] Write tests for segments and pixels routes
- [ ] Validate: All tests pass, routes work

### Phase 5: Update Dashboard UI
- [ ] Update Audiences page to use tRPC routes
- [ ] Test Audiences page in browser
- [ ] Create Segments page using tRPC
- [ ] Test Segments page in browser
- [ ] Create Pixels page using tRPC
- [ ] Test Pixels page in browser
- [ ] Validate: All pages work, no errors

### Phase 6: Documentation
- [ ] Create API_USAGE.md with examples
- [ ] Document each tRPC route
- [ ] Add TypeScript usage examples
- [ ] Add React component examples
- [ ] Create "Quick Start" guide for customers
- [ ] Validate: Documentation is clear and complete


---

## GitHub Repository Enhancement

- [ ] Create GitHub Actions CI/CD workflow (.github/workflows/ci.yml)
- [ ] Create bug report issue template
- [ ] Create feature request issue template
- [ ] Create pull request template
- [ ] Add CONTRIBUTING.md file
- [ ] Add LICENSE file (MIT)
- [ ] Add CODE_OF_CONDUCT.md
- [ ] Push all changes to GitHub


---

## API Documentation for GitHub

- [x] Create comprehensive API reference (docs/API_REFERENCE.md)
- [x] Create tRPC routes documentation (docs/TRPC_ROUTES.md)
- [x] Create API testing guide (docs/API_TESTING.md)
- [x] Update README.md with documentation links
- [x] Push all documentation to GitHub


---

## Follow-Up Actions (December 13, 2025)

### Critical Endpoint Identification
- [ ] Identify most critical untested endpoint for next feature
- [ ] Document required input schema for critical endpoint
- [ ] Create implementation plan for critical endpoint

### Test Coverage Improvement
- [ ] Identify three areas lacking test coverage
- [ ] Prioritize test coverage improvements
- [ ] Write tests for priority areas
- [ ] Increase coverage from 68.4% to 85%

### Fix POST /enrich/contact Endpoint
- [ ] Investigate endpoint via UI network traffic
- [ ] Capture exact request format from browser DevTools
- [ ] Test alternative endpoint paths
- [ ] Update API client with correct format
- [ ] Validate fix with tests


---

## POST /audiences Testing (Option A - Complete)

- [x] Write test for POST /audiences with minimal payload
- [x] Write test for POST /audiences with complex filters
- [x] Write test for input validation (empty name, invalid operator)
- [x] Write test for response schema validation
- [x] Run all tests and verify they pass
- [x] Update API_REFERENCE.md with validated status
- [x] Update API_TESTING.md with test results
- [x] Captured REAL format from dashboard: POST /home/{teamSlug}
- [x] Documented actual request format in REAL_POST_AUDIENCES_FORMAT.md
- [x] Discovered: api.audiencelab.io/audiences doesn't work, use build.audiencelab.io/home/{teamSlug}


---

## Update API Client with Real POST Format

- [ ] Update audiencelab-client.ts createAudience method to use POST /home/{teamSlug}
- [ ] Change request body to array format with accountId and name
- [ ] Add method to get team slug and account ID
- [ ] Update TypeScript types for new request format
- [ ] Remove filters parameter from createAudience (filters added separately)
- [ ] Write tests for updated createAudience method
- [ ] Test with real API using test account
- [ ] Update documentation with new API client usage


---

## Clean Up Incorrect API Assumptions

- [x] Delete REAL_POST_AUDIENCES_FORMAT.md (dashboard endpoint, not API)
- [x] Delete POST_AUDIENCES_TESTING_RESULTS.md (based on wrong assumptions)
- [x] Delete all test files with incorrect formats
- [x] Save official Mintlify documentation as single source of truth
- [x] Update API client to use official POST /audiences format
- [x] Update TypeScript types to match official format
- [x] Write tests using official format
- [x] Test with real API and verify success (3/3 tests passed)
- [x] Update all documentation references to point to official docs


---

## Build Audiences Management UI

- [ ] Create client/src/pages/AudiencesPage.tsx with list view
- [ ] Create client/src/components/audiences/AudienceTable.tsx
- [ ] Create client/src/components/audiences/CreateAudienceDialog.tsx
- [ ] Add pagination support (page, pageSize)
- [ ] Add search/filter functionality
- [ ] Add delete confirmation dialog
- [ ] Add loading states and error handling
- [ ] Add route to App.tsx
- [ ] Test in browser (list, create, delete)
- [ ] Mark todo items as complete


---

## Document tRPC Router Structure

- [x] Create TRPC_ROUTER_STRUCTURE.md documenting two routers
- [x] Document audienceLab router (enrichment only)
- [x] Document audienceLabAPI router (audiences, pixels, segments)
- [x] Add quick reference table
- [x] Add common mistakes section
- [ ] Update README.md with link to router documentation


---

## Project Summary Documentation

- [x] Create PROJECT_SUMMARY.md with all validated findings
- [x] Document all working endpoints (GET /audiences, GET /pixels, POST /audiences)
- [x] Document two-router structure (audienceLab vs audienceLabAPI)
- [x] Remove all incorrect assumptions from documentation
- [x] List all built features and their status
- [x] Document known issues and next steps
- [x] Update README.md with link to PROJECT_SUMMARY.md


---

## Build Pixels Management Page

- [ ] Create client/src/pages/PixelsPage.tsx with list view
- [ ] Create client/src/components/pixels/CreatePixelDialog.tsx
- [ ] Display install URLs with copy-to-clipboard functionality
- [ ] Add delete functionality with confirmation dialog
- [ ] Add loading states and error handling
- [ ] Add route to App.tsx (/pixels)
- [ ] Test in browser (list, create, delete, copy URL)
- [ ] Mark all tasks as complete


---

## Rebrand to AudienceLab Vibe Platform

- [ ] Update PROJECT_SUMMARY.md title and description
- [ ] Update README.md to reflect comprehensive platform scope
- [ ] Update package.json name and description
- [ ] Update App.tsx title
- [ ] Create comprehensive feature roadmap (Enrichments, Audiences, Pixels, Studio, Segments, Workflows)
- [ ] Update all documentation references from "enrichment dashboard" to "Vibe platform"


---

## Clean Up All TypeScript Types (CRITICAL)

- [x] Rewrite audiencelab-types.ts using ONLY validated schemas from API_REFERENCE.md
- [x] Remove all assumption-based type definitions
- [x] Update API client methods to match validated types
- [x] Fix CreatePixelRequest to match actual API format
- [x] Fix CreateAudienceRequest to match validated Mintlify format
- [x] Verify all types match actual API responses from testing
- [x] Test and resolve all TypeScript errors (0 errors!)


---

## Build Navigation Menu

- [x] Create DashboardLayout component with sidebar navigation
- [x] Add navigation links for Spark V2, Audiences, and Pixels
- [x] Add route for /pixels in App.tsx
- [x] Add route for /audiences in App.tsx
- [x] Update Home route to redirect to /spark
- [x] Test navigation between all pages
- [x] Add active state styling for current page
- [x] Add logo and branding to sidebar

All navigation features working! See NAVIGATION_TEST.md for test results.


---

## Fix Nested Anchor Tag Error

- [x] Fix DashboardLayout component - remove nested <a> tags inside <Link>
- [x] Test in browser to verify error is resolved

✅ Fixed! Changed <a> to <div> inside <Link> components. No console errors.


---

## Fix Deployment Failure - Comprehensive Cleanup

- [x] Remove old/duplicate server files (server/index.ts)
- [x] Remove dotenv imports from server/_core/index.ts
- [x] Clear node_modules and reinstall clean
- [x] Clear .vite cache
- [x] Clear dist directory
- [x] Test build succeeds (✅ 9.18s, no dotenv imports)
- [x] Verify server starts (✅ runs on port 3002)

✅ Clean slate achieved! All old dependencies removed, fresh install, build works perfectly.


---

## Add Enrichments Page

- [x] Create EnrichmentsPage component
- [x] Add enrichments icon and navigation link to DashboardLayout
- [x] Add /enrichments route to App.tsx
- [x] Design enrichments UI (list, search, create)
- [x] Test navigation and page display

✅ Enrichments page complete! Features:
- 4 stats cards (Total, Active Jobs, Records Processed, Success Rate)
- Search bar for filtering enrichments
- 3 mock enrichment cards with progress bars
- Status badges (Active, Completed, Pending)
- Type badges (Contact, Company, Demographic)
- New Enrichment button
- Clean, professional design matching other pages
