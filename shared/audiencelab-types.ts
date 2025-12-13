/**
 * AudienceLab API TypeScript Types
 * Based on comprehensive API investigation (December 11, 2025)
 * 
 * This file contains all type definitions for the AudienceLab API
 * including Audiences, Enrichment, Segments, Pixels, Syncs, and Workflows.
 */

// ============================================================================
// AUDIENCE TYPES
// ============================================================================

export interface Audience {
  id: string;
  name: string;
  description?: string;
  filters: AudienceFilter[];
  total_contacts: number;
  created_at: string;
  updated_at: string;
  last_refreshed_at?: string;
  webhook_url?: string;
}

export interface AudienceFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | number | string[];
}

export interface AudienceAttribute {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  category: 'personal' | 'contact' | 'professional' | 'company' | 'social' | 'skiptrace';
}

export interface AudiencesListResponse {
  audiences: Audience[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateAudienceRequest {
  name: string;
  description?: string;
  filters: AudienceFilter[];
  webhook_url?: string;
}

// ============================================================================
// ENRICHMENT TYPES
// ============================================================================

export interface EnrichmentRequest {
  email?: string;
  personal_email?: string;
  business_email?: string;
  linkedin_url?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  company_domain?: string;
  phone?: string;
  personal_address?: string;
  personal_city?: string;
  personal_state?: string;
  personal_zip?: string;
  sha256_personal_email?: string;
  up_id?: string;
  fields?: string[];  // Fields to return (default: all 84 fields)
}

export interface EnrichmentResponse {
  status: 'success' | 'partial' | 'error';
  contact?: EnrichedContact;
  credits_used: number;
  credits_remaining: number;
  error?: string;
}

export interface EnrichedContact {
  // System (1 field)
  UUID?: string;
  
  // Personal Information (16 fields)
  FIRST_NAME?: string;
  MIDDLE_NAME?: string;
  LAST_NAME?: string;
  FULL_NAME?: string;
  AGE?: number;
  GENDER?: string;
  MARITAL_STATUS?: string;
  EDUCATION_LEVEL?: string;
  HOUSEHOLD_INCOME?: string;
  NET_WORTH?: string;
  HOME_OWNER_STATUS?: string;
  HOME_VALUE?: string;
  PERSONAL_ADDRESS?: string;
  PERSONAL_CITY?: string;
  PERSONAL_STATE?: string;
  PERSONAL_ZIP?: string;
  
  // Contact Information (12 fields)
  BUSINESS_EMAIL?: string;
  PERSONAL_EMAIL?: string;
  VERIFIED_EMAIL?: boolean;
  SHA256_EMAIL?: string;
  DIRECT_NUMBER?: string;
  MOBILE_NUMBER?: string;
  PERSONAL_PHONE?: string;
  VALID_PHONE?: boolean;
  DIRECT_NUMBER_DNC?: boolean;
  MOBILE_NUMBER_DNC?: boolean;
  PERSONAL_PHONE_DNC?: boolean;
  
  // Professional Information (18 fields)
  JOB_TITLE?: string;
  DEPARTMENT?: string;
  SENIORITY_LEVEL?: string;
  JOB_FUNCTION?: string;
  MANAGEMENT_LEVEL?: string;
  YEARS_EXPERIENCE?: number;
  YEARS_IN_CURRENT_ROLE?: number;
  JOB_START_DATE?: string;
  PREVIOUS_JOB_TITLE?: string;
  PREVIOUS_COMPANY?: string;
  PREVIOUS_COMPANY_DOMAIN?: string;
  SKILLS?: string[];
  CERTIFICATIONS?: string[];
  LANGUAGES?: string[];
  WORK_ADDRESS?: string;
  WORK_CITY?: string;
  WORK_STATE?: string;
  WORK_ZIP?: string;
  
  // Company Information (20 fields)
  COMPANY_NAME?: string;
  COMPANY_DOMAIN?: string;
  COMPANY_DESCRIPTION?: string;
  COMPANY_INDUSTRY?: string;
  COMPANY_SUB_INDUSTRY?: string;
  COMPANY_SIC_CODE?: string;
  COMPANY_NAICS_CODE?: string;
  COMPANY_REVENUE?: string;
  COMPANY_REVENUE_RANGE?: string;
  COMPANY_EMPLOYEE_COUNT?: number;
  COMPANY_EMPLOYEE_RANGE?: string;
  COMPANY_FOUNDED_YEAR?: number;
  COMPANY_TYPE?: string;
  COMPANY_TICKER?: string;
  COMPANY_PHONE?: string;
  COMPANY_ADDRESS?: string;
  COMPANY_CITY?: string;
  COMPANY_STATE?: string;
  COMPANY_ZIP?: string;
  COMPANY_COUNTRY?: string;
  
  // Social Media (6 fields)
  LINKEDIN_URL?: string;
  TWITTER_URL?: string;
  FACEBOOK_URL?: string;
  GITHUB_URL?: string;
  TWITTER_FOLLOWERS?: number;
  LINKEDIN_CONNECTIONS?: number;
  
  // Skiptrace (12 fields)
  SKIPTRACE_ADDRESSES?: string[];
  SKIPTRACE_PHONES?: string[];
  SKIPTRACE_EMAILS?: string[];
  CREDIT_RATING?: string;
  BANKRUPTCY?: boolean;
  FORECLOSURE?: boolean;
  TAX_LIEN?: boolean;
  JUDGMENT?: boolean;
  CRIMINAL_RECORD?: boolean;
  EVICTION?: boolean;
  PROPERTY_OWNERSHIP?: string[];
  VEHICLE_OWNERSHIP?: string[];
}

export interface EnrichmentJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_contacts: number;
  processed_contacts: number;
  successful_enrichments: number;
  failed_enrichments: number;
  created_at: string;
  completed_at?: string;
  download_url?: string;
}

export interface EnrichmentJobsListResponse {
  jobs: EnrichmentJob[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateEnrichmentJobRequest {
  contacts: EnrichmentRequest[];
  fields?: string[];
}

// ============================================================================
// STUDIO SEGMENT TYPES
// ============================================================================

export interface Segment {
  id: string;
  name: string;
  audience_id: string;
  filters: SegmentFilter[];
  selected_fields: string[];
  total_rows: number;
  created_at: string;
  api_endpoint: string;  // Persistent endpoint that never expires
}

export interface SegmentFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | number | string[];
}

export interface SegmentDataResponse {
  segment_id: string;
  total_rows: number;
  page: number;
  page_size: number;
  data: Record<string, any>[];
}

// ============================================================================
// PIXEL TYPES
// ============================================================================

export interface Pixel {
  id: string;
  name: string;
  domain: string;
  organization_id: string;
  created_at: string;
  webhook_url?: string;
  integrations?: {
    google_analytics?: { measurement_id: string };
    microsoft_clarity?: { project_id: string };
  };
  custom_params?: Record<string, string>;
}

export interface PixelsListResponse {
  pixels: Pixel[];
  total: number;
}

export interface CreatePixelRequest {
  name: string;
  domain: string;
  webhook_url?: string;
  integrations?: {
    google_analytics?: { measurement_id: string };
    microsoft_clarity?: { project_id: string };
  };
  custom_params?: Record<string, string>;
}

export type PixelEventType =
  | 'page_view'
  | 'click'
  | 'form_submission'
  | 'file_download'
  | 'scroll_depth'
  | 'exit_intent'
  | 'user_idle'
  | 'copy'
  | 'video_play'
  | 'video_pause'
  | 'video_complete';

export interface PixelEvent {
  id: string;
  pixel_id: string;
  event_type: PixelEventType;
  event_data: Record<string, any>;
  timestamp: string;
  visitor_id?: string;
  enriched_contact?: EnrichedContact;
}

// ============================================================================
// SYNC TYPES
// ============================================================================

export interface Sync {
  id: string;
  name: string;
  source_type: 'audience' | 'segment';
  source_id: string;
  destination_type: 'google_sheets' | 'facebook_ads';
  destination_config: GoogleSheetConfig | FacebookAdsConfig;
  refresh_interval: 'everyday' | '3_days' | '7_days' | '14_days' | 'monthly';
  status: 'processing' | 'completed' | 'failed';
  last_synced_at?: string;
  next_sync_at?: string;
  created_at: string;
}

export interface GoogleSheetConfig {
  workbook_id: string;
  tab_name: string;
  field_mapping: Record<string, string>;
}

export interface FacebookAdsConfig {
  ad_account_id: string;
  custom_audience_id: string;
  field_mapping: Record<string, string>;
}

// ============================================================================
// WORKFLOW TYPES
// ============================================================================

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  graph: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  };
  status: 'active' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action';
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export type WorkflowNodeData =
  | AudienceTriggerData
  | PixelTriggerData
  | SegmentTriggerData
  | EmailActionData
  | InstantlyActionData
  | AdKernalActionData;

export interface AudienceTriggerData {
  kind: 'audienceTrigger';
  audience_id: string;
  deduplicate_emails: boolean;
  auto_sync_enabled: boolean;
}

export interface PixelTriggerData {
  kind: 'pixelTrigger';
  pixel_id: string;
  event_types: PixelEventType[];
}

export interface SegmentTriggerData {
  kind: 'segmentTrigger';
  segment_id: string;
}

export interface EmailActionData {
  kind: 'sendEmail';
  smtp_ids: string[];
  subject: string;
  body: string;
  variables: Record<string, string>;
}

export interface InstantlyActionData {
  kind: 'instantly';
  campaign_id: string;
  api_key: string;
}

export interface AdKernalActionData {
  kind: 'adKernal';
  campaign_id: string;
  api_key: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  steps: WorkflowExecutionStep[];
}

export interface WorkflowExecutionStep {
  id: string;
  node_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  error?: string;
  contacts_processed: number;
}

// ============================================================================
// API ERROR TYPES
// ============================================================================

export interface APIError {
  error: {
    code: string;
    message: string;
  };
}

export class AudienceLabAPIError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AudienceLabAPIError';
  }
}
