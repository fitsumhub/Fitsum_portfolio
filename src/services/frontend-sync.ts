import { API_BASE_URL } from '../config/api';

export interface BackendDataSummary {
  hasData: boolean;
  counts: {
    projects: number;
    profile: number;
    testimonials: number;
    youtube: number;
  };
}

interface SyncResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data?: {
    projects: number;
    profile: number;
    testimonials: number;
    youtubeVideos: number;
  };
  error?: string;
}

class FrontendSyncService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem('authToken');
    } catch {
      return null;
    }
  }

  private async makeRequest(endpoint: string, method: string = 'POST'): Promise<SyncResponse> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Frontend sync request failed:', error);
      throw error;
    }
  }

  // Sync all frontend data to backend
  async syncAll(frontendData?: any): Promise<SyncResponse> {
    if (frontendData) {
      try {
        const token = this.getAuthToken();
        const response = await fetch(`${this.baseURL}/frontend-sync/sync-all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          credentials: 'include',
          body: JSON.stringify(frontendData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Frontend sync request failed:', error);
        throw error;
      }
    }
    return this.makeRequest('/frontend-sync/sync-all');
  }

  // Sync only projects
  async syncProjects(): Promise<SyncResponse> {
    return this.makeRequest('/frontend-sync/sync-projects');
  }

  // Sync only profile
  async syncProfile(): Promise<SyncResponse> {
    return this.makeRequest('/frontend-sync/sync-profile');
  }

  // Reset all data to frontend defaults
  async resetToFrontend(frontendData?: any): Promise<SyncResponse> {
    if (frontendData) {
      try {
        const token = this.getAuthToken();
        const response = await fetch(`${this.baseURL}/frontend-sync/reset-to-frontend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          credentials: 'include',
          body: JSON.stringify(frontendData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Frontend reset request failed:', error);
        throw error;
      }
    }
    return this.makeRequest('/frontend-sync/reset-to-frontend');
  }

  // Check if backend has data
  async checkBackendData(): Promise<BackendDataSummary> {
    try {
      const [projectsRes, profileRes, testimonialsRes, youtubeRes] = await Promise.all([
        fetch(`${this.baseURL}/projects`),
        fetch(`${this.baseURL}/profile`),
        fetch(`${this.baseURL}/testimonials`),
        fetch(`${this.baseURL}/youtube`)
      ]);

      const [projects, profile, testimonials, youtube] = await Promise.all([
        projectsRes.json(),
        profileRes.json(),
        testimonialsRes.json(),
        youtubeRes.json()
      ]);

      const counts = {
        projects: Array.isArray(projects) ? projects.length : 0,
        profile: profile ? 1 : 0,
        testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        youtube: Array.isArray(youtube) ? youtube.length : 0
      };

      const hasData = Object.values(counts).some(count => count > 0);

      return { hasData, counts };
    } catch (error) {
      console.error('Error checking backend data:', error);
      return { hasData: false, counts: { projects: 0, profile: 0, testimonials: 0, youtube: 0 } };
    }
  }
}

// Create and export a singleton instance
const frontendSyncService = new FrontendSyncService();
export default frontendSyncService;
