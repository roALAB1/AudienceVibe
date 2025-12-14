// Audience Model Types for Vibe Code Feature

import { AudienceFilters } from './audience-filters';

export type AudienceStatus = 'draft' | 'generating' | 'active' | 'failed' | 'paused';

export interface Audience {
  id: string;
  name: string;
  status: AudienceStatus;
  filters: AudienceFilters;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  lastRefreshed?: string; // ISO 8601 date string
  audienceSize?: number;
  refreshCount?: number;
  nextRefresh?: string; // ISO 8601 date string
}

export interface CreateAudienceRequest {
  name: string;
}

export interface CreateAudienceResponse {
  id: string;
  name: string;
  status: AudienceStatus;
  createdAt: string;
}

export interface UpdateAudienceFiltersRequest {
  filters: AudienceFilters;
}

export interface PreviewAudienceRequest {
  filters: AudienceFilters;
}

export interface PreviewAudienceResponse {
  estimatedSize: number;
}

export interface GenerateAudienceResponse {
  success: boolean;
  status: AudienceStatus;
  message?: string;
}

export interface AudienceListResponse {
  audiences: Audience[];
  total: number;
  page: number;
  pageSize: number;
}
