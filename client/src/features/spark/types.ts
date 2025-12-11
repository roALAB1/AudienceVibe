/**
 * Spark V2 - Type Definitions
 * Smart Query Assistant and AudienceLab Integration
 */

export type SearchMode = "intent" | "b2b";

export type Lens =
  | "brand"
  | "product"
  | "function"
  | "service"
  | "solution"
  | "event";

export interface QueryValidationIssue {
  type: "error" | "warning" | "info";
  message: string;
  suggestion: string;
}

export interface QueryQualityResult {
  score: number; // 0-100
  issues: QueryValidationIssue[];
  passedRules: string[];
  failedRules: string[];
}

export interface SearchQuery {
  query: string;
  mode: SearchMode;
  contextPhrases?: string[];
  lens?: Lens;
  granularity?: number; // 1-5
  topK?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface AudienceConfig {
  name: string;
  description: string;
  filters: unknown[];
  fields: string[];
  refresh_schedule: string;
}

export interface QueryTemplate {
  id: string;
  name: string;
  category: string;
  mode: SearchMode;
  query: string;
  contextPhrases?: string[];
  lens?: Lens;
  granularity?: number;
  description: string;
  tags: string[];
}
