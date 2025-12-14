/**
 * AudienceLab Dashboard API Wrapper
 * 
 * This service wraps the internal dashboard API to provide access to
 * business filters (seniority, industry, department) that are not
 * available in the public API.
 */

import { dashboardAuth } from './dashboard-auth';
import { randomUUID } from 'crypto';

interface DashboardBusinessProfile {
  companyDescription: string[];
  jobTitle: string[];
  seniority: string[];
  department: string[];
  companyName: string[];
  companyDomain: string[];
  industry: string[];
  sic: string[];
  employeeCount: string[];
  companyRevenue: string[];
  companyNaics: string[];
}

interface DashboardFilters {
  age: {
    minAge: number | null;
    maxAge: number | null;
  };
  city: string[];
  state: string[];
  zip: string[];
  gender: string[];
  profile: {
    incomeRange: string[];
    homeowner: string[];
    married: string[];
    netWorth: string[];
    children: string[];
  };
  businessProfile: DashboardBusinessProfile;
  attributes: Record<string, any>;
  notNulls: string[];
  nullOnly: string[];
}

interface CreateAudiencePayload {
  accountId: string;
  audienceId: string;
  filters: {
    audience: {
      type: string;
      b2b: boolean;
      customTopic: string;
      customDescription: string;
      segmentSearches: any[];
    };
    jobId: string;
    segment: string[];
    score: string[];
    daysBack: number | null;
    filters: DashboardFilters;
  };
  hasSegmentChanged: boolean;
  resolveIntents: boolean;
}

class DashboardAPIService {
  /**
   * Create an audience using the dashboard's internal API
   */
  async createAudience(
    name: string,
    businessProfile: Partial<DashboardBusinessProfile>
  ): Promise<{ audienceId: string; status: string }> {
    try {
      // Get session
      const session = await dashboardAuth.getSession();
      
      // Generate audience ID
      const audienceId = randomUUID();
      
      // Step 1: Create the audience record
      await this.createAudienceRecord(session.teamSlug, name, audienceId);
      
      // Step 2: Apply filters
      const result = await this.applyFilters(
        session.teamSlug,
        session.accountId,
        audienceId,
        businessProfile
      );
      
      return {
        audienceId,
        status: result.status,
      };
    } catch (error) {
      console.error('Failed to create audience via dashboard:', error);
      throw error;
    }
  }
  
  /**
   * Create the initial audience record
   */
  private async createAudienceRecord(
    teamSlug: string,
    name: string,
    audienceId: string
  ): Promise<void> {
    const response = await dashboardAuth.request(
      `/home/${teamSlug}/audiences`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          id: audienceId,
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create audience record: ${error}`);
    }
  }
  
  /**
   * Apply filters to the audience
   */
  private async applyFilters(
    teamSlug: string,
    accountId: string,
    audienceId: string,
    businessProfile: Partial<DashboardBusinessProfile>
  ): Promise<{ status: string }> {
    // Build the payload in dashboard format
    const payload: CreateAudiencePayload[] = [{
      accountId,
      audienceId,
      filters: {
        audience: {
          type: 'premade',
          b2b: false,
          customTopic: '',
          customDescription: '',
          segmentSearches: [],
        },
        jobId: '',
        segment: [],
        score: [],
        daysBack: null,
        filters: {
          age: {
            minAge: null,
            maxAge: null,
          },
          city: [],
          state: [],
          zip: [],
          gender: [],
          profile: {
            incomeRange: [],
            homeowner: [],
            married: [],
            netWorth: [],
            children: [],
          },
          businessProfile: {
            companyDescription: businessProfile.companyDescription || [],
            jobTitle: businessProfile.jobTitle || [],
            seniority: businessProfile.seniority || [],
            department: businessProfile.department || [],
            companyName: businessProfile.companyName || [],
            companyDomain: businessProfile.companyDomain || [],
            industry: businessProfile.industry || [],
            sic: businessProfile.sic || [],
            employeeCount: businessProfile.employeeCount || [],
            companyRevenue: businessProfile.companyRevenue || [],
            companyNaics: businessProfile.companyNaics || [],
          },
          attributes: {},
          notNulls: [],
          nullOnly: [],
        },
      },
      hasSegmentChanged: false,
      resolveIntents: true,
    }];
    
    const response = await dashboardAuth.request(
      `/home/${teamSlug}/audience/${audienceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/x-component',
        },
        body: JSON.stringify(payload),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to apply filters: ${error}`);
    }
    
    return { status: 'processing' };
  }
  
  /**
   * Get audience status
   */
  async getAudienceStatus(audienceId: string): Promise<{
    status: string;
    size: number;
  }> {
    const session = await dashboardAuth.getSession();
    
    const response = await dashboardAuth.request(
      `/home/${session.teamSlug}/audience/${audienceId}`,
      {
        method: 'GET',
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get audience status');
    }
    
    const data = await response.json();
    
    return {
      status: data.status || 'unknown',
      size: data.size || 0,
    };
  }
}

// Export singleton instance
export const dashboardAPI = new DashboardAPIService();
