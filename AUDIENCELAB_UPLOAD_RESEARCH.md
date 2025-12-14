# AudienceLab Enrichment Upload Page Research

## URL
https://build.audiencelab.io/home/onboarding/enrichment/upload

## Screenshot
![AudienceLab Upload Page](/home/ubuntu/screenshots/build_audiencelab_io_2025-12-13_23-03-36_7261.webp)

## Key Findings

### Page Structure
- **Breadcrumb**: Home > Onboarding > Enrichment > Upload
- **Title**: "Enrichment" (h1)
- **Section Title**: "Upload CSV File" (h3)

### Upload Interface
1. **Single upload area** - Large drag-and-drop zone
2. **Text**: "Click to upload or drag and drop a file"
3. **Submit button**: "Submit Enrichment" (bottom right, appears to be disabled until file is uploaded)

### Design Details
- Clean, minimal interface
- No form fields for name, type, configuration
- No multi-step wizard
- Just: upload CSV → submit
- Auto-generates enrichment name from timestamp

### Workflow
1. User clicks "Upload" from enrichments list
2. Navigates to `/enrichments/upload` page
3. Drag-and-drop or click to upload CSV file
4. Click "Submit Enrichment" button
5. Redirects back to enrichments list
6. New enrichment appears with auto-generated name

## Implementation Requirements

**EnrichmentUploadPage.tsx should have:**
- Simple header with "Enrichment" title
- Breadcrumb navigation
- Large drag-and-drop upload zone
- "Click to upload or drag and drop a file" text
- File input (hidden, triggered by click)
- "Submit Enrichment" button (disabled until file selected)
- No additional form fields
- No wizard steps
- Auto-generate name from timestamp on submit

**Route**: `/enrichments/upload`
