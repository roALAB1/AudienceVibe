/**
 * AudienceLab Dashboard Authentication Service
 * 
 * This service handles authentication to the AudienceLab dashboard
 * (build.audiencelab.io) to access internal APIs that support additional
 * filters not available in the public API.
 * 
 * WARNING: This is an unofficial/unsupported approach that may violate
 * AudienceLab's terms of service. Use at your own risk.
 */

interface DashboardSession {
  cookies: string[];
  accountId: string;
  teamSlug: string;
  expiresAt: number;
}

class DashboardAuthService {
  private session: DashboardSession | null = null;
  private readonly baseUrl = 'https://build.audiencelab.io';
  
  /**
   * Authenticate to the dashboard and get session cookies
   */
  async login(email: string, password: string): Promise<DashboardSession> {
    try {
      // Step 1: Get CSRF token
      const csrfResponse = await fetch(`${this.baseUrl}/api/auth/csrf`);
      const { csrfToken } = await csrfResponse.json();
      
      // Step 2: Login
      const loginResponse = await fetch(`${this.baseUrl}/api/auth/callback/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          csrfToken,
          email,
          password,
          callbackUrl: `${this.baseUrl}/home`,
          json: 'true',
        }),
        redirect: 'manual',
      });
      
      // Extract session cookies
      const cookies = loginResponse.headers.getSetCookie();
      
      if (!cookies || cookies.length === 0) {
        throw new Error('Login failed: No session cookies received');
      }
      
      // Step 3: Get account info
      const accountInfo = await this.getAccountInfo(cookies);
      
      // Store session
      this.session = {
        cookies,
        accountId: accountInfo.accountId,
        teamSlug: accountInfo.teamSlug,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };
      
      return this.session;
    } catch (error) {
      console.error('Dashboard login failed:', error);
      throw new Error(`Failed to authenticate to dashboard: ${error}`);
    }
  }
  
  /**
   * Get account information from the dashboard
   */
  private async getAccountInfo(cookies: string[]): Promise<{ accountId: string; teamSlug: string }> {
    const response = await fetch(`${this.baseUrl}/api/account`, {
      headers: {
        'Cookie': cookies.join('; '),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get account info');
    }
    
    const data = await response.json();
    
    return {
      accountId: data.id,
      teamSlug: data.slug,
    };
  }
  
  /**
   * Get current session or login if needed
   */
  async getSession(): Promise<DashboardSession> {
    // Check if we have a valid session
    if (this.session && this.session.expiresAt > Date.now()) {
      return this.session;
    }
    
    // Login with stored credentials
    const email = process.env.AUDIENCELAB_DASHBOARD_EMAIL;
    const password = process.env.AUDIENCELAB_DASHBOARD_PASSWORD;
    
    if (!email || !password) {
      throw new Error('Dashboard credentials not configured');
    }
    
    return await this.login(email, password);
  }
  
  /**
   * Make an authenticated request to the dashboard
   */
  async request(path: string, options: RequestInit = {}): Promise<Response> {
    const session = await this.getSession();
    
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        'Cookie': session.cookies.join('; '),
      },
    });
    
    // If unauthorized, try to re-login
    if (response.status === 401) {
      this.session = null;
      const newSession = await this.getSession();
      
      return await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          ...options.headers,
          'Cookie': newSession.cookies.join('; '),
        },
      });
    }
    
    return response;
  }
  
  /**
   * Clear session
   */
  logout() {
    this.session = null;
  }
}

// Export singleton instance
export const dashboardAuth = new DashboardAuthService();
