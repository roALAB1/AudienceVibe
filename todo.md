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
