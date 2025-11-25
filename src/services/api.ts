import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  token?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}

// Generic payload type for requests
export type ApiPayload = unknown;

// API Service Class
class ApiService {
  private baseURL: string;
  private token: string | null = null;
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private requestCache: Map<string, { data: unknown; timestamp: number }> = new Map();
  // Increased cache duration for better performance (5 minutes for static data)
  private readonly CACHE_DURATION = 300000; // 5 minutes

  constructor() {
    this.baseURL = API_BASE_URL;
    this.loadToken();
  }

  // Token management
  private loadToken(): void {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Get headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Main request method with deduplication and caching
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    const cacheKey = `${method}:${url}`;

    // Check cache for GET requests
    if (method === 'GET') {
      const cached = this.requestCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data as T;
      }
    }

    // Check for pending request (deduplication)
    const pendingRequest = this.pendingRequests.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest as Promise<T>;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    // Create request promise
    const requestPromise = (async () => {
      try {
        const response = await fetch(url, config);
        const raw = await response.json().catch(() => ({})) as unknown;
        const dataObj = typeof raw === 'object' && raw !== null ? raw as Record<string, unknown> : {} as Record<string, unknown>;

        if (!response.ok) {
          const message = (dataObj['error'] as string) || (dataObj['message'] as string) || 'Request failed';
          throw { message, status: response.status } as ApiError;
        }

        const result = dataObj as unknown;
        // Cache GET requests
        if (method === 'GET') {
          this.requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
        }

        return result as T;
      } catch (error) {
        if (error instanceof TypeError) {
          // Network error - backend might not be running (expected in development)
          const errorMessage = error.message || '';
          const isConnectionRefused = errorMessage.includes('Failed to fetch') || 
                                     errorMessage.includes('ERR_CONNECTION_REFUSED') ||
                                     errorMessage.includes('NetworkError') ||
                                     errorMessage.includes('Network request failed');
          
          if (isConnectionRefused) {
            // Suppress console errors for connection refused in development
            // The DataContext already handles these gracefully with fallback data
            // Only show a helpful message, don't spam the console
            if (import.meta.env.DEV) {
              // Suppress the error - it's expected when backend is not running
              // The UI will show appropriate messages via the error state
            }
            throw { 
              message: 'Backend server is not running. Please start the server (see BACKEND_SETUP.md) to use API features.', 
              status: 0 
            } as ApiError;
          }
          
          // Log other network errors
          if (import.meta.env.DEV) {
            console.debug('API unavailable:', endpoint, errorMessage);
          }
          throw { message: 'Network error. Please check your connection.', status: 0 } as ApiError;
        }
        throw error;
      } finally {
        // Remove from pending requests
        this.pendingRequests.delete(cacheKey);
      }
    })();

    // Store pending request
    this.pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }

  // Clear cache
  clearCache() {
    this.requestCache.clear();
  }

  // Clear cache for specific endpoint
  clearCacheFor(endpoint: string) {
    const keysToDelete: string[] = [];
    this.requestCache.forEach((_, key) => {
      if (key.includes(endpoint)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.requestCache.delete(key));
  }

  // Upload file helper
  private async uploadFile(
    endpoint: string,
    file: File,
    fieldName: string,
    additionalData?: Record<string, string>
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({})) as unknown;
      const errObj = typeof error === 'object' && error !== null ? (error as Record<string, unknown>) : {};
      const message = (typeof errObj['error'] === 'string' && errObj['error']) || 'Upload failed';
      throw { message, status: response.status } as ApiError;
    }

    return await response.json() as Promise<ApiResponse>;
  }

  // Auth methods
  async login(username: string, password: string): Promise<ApiResponse> {
    const response = await this.request<ApiResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (response.token) this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.request(API_ENDPOINTS.LOGOUT, { method: 'POST' });
    this.clearToken();
  }

  async verifyToken(): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.VERIFY);
  }

  // Profile methods
  async getProfile() {
    return this.request(API_ENDPOINTS.PROFILE);
  }

  async updateProfile(profileData: ApiPayload): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadProfileImage(file: File): Promise<ApiResponse> {
    return this.uploadFile(API_ENDPOINTS.PROFILE_IMAGE, file, 'profileImage');
  }

  // Projects methods
  async getProjects() {
    return this.request(API_ENDPOINTS.PROJECTS);
  }

  async getProject(id: string) {
    return this.request(API_ENDPOINTS.PROJECT(id));
  }

  async createProject(projectData: ApiPayload): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.PROJECTS, {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: ApiPayload): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.PROJECT(id), {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.PROJECT(id), {
      method: 'DELETE',
    });
  }

  async uploadProjectImage(id: string, file: File): Promise<ApiResponse> {
    return this.uploadFile(API_ENDPOINTS.PROJECT_IMAGE(id), file, 'projectImage');
  }

  // YouTube methods
  async getYouTubeVideos() {
    return this.request(API_ENDPOINTS.YOUTUBE);
  }

  async createYouTubeVideo(videoData: ApiPayload): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.YOUTUBE, {
      method: 'POST',
      body: JSON.stringify(videoData),
    });
  }

  async updateYouTubeVideo(id: string, videoData: ApiPayload): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.YOUTUBE_VIDEO(id), {
      method: 'PUT',
      body: JSON.stringify(videoData),
    });
  }

  async deleteYouTubeVideo(id: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.YOUTUBE_VIDEO(id), {
      method: 'DELETE',
    });
  }

  // Testimonials methods
  async getTestimonials() {
    return this.request(API_ENDPOINTS.TESTIMONIALS);
  }

  async createTestimonial(testimonialData: ApiPayload): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.TESTIMONIALS, {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  }

  async updateTestimonial(id: string, testimonialData: ApiPayload): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.TESTIMONIAL(id), {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
  }

  async deleteTestimonial(id: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.TESTIMONIAL(id), {
      method: 'DELETE',
    });
  }

  async uploadTestimonialAvatar(id: string, file: File): Promise<ApiResponse> {
    return this.uploadFile(API_ENDPOINTS.TESTIMONIAL_AVATAR(id), file, 'avatar');
  }

  // Images methods
  async getImages(category?: string) {
    const endpoint = category ? `${API_ENDPOINTS.IMAGES}?category=${category}` : API_ENDPOINTS.IMAGES;
    return this.request(endpoint);
  }

  async uploadImage(file: File, category: string = 'general', altText: string = ''): Promise<ApiResponse> {
    return this.uploadFile(API_ENDPOINTS.IMAGE_UPLOAD, file, 'image', { category, alt_text: altText });
  }

  async deleteImage(id: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.IMAGE(id), {
      method: 'DELETE',
    });
  }

  async getImageCategories(): Promise<string[]> {
    return this.request<string[]>(API_ENDPOINTS.IMAGE_CATEGORIES);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_ENDPOINTS.HEALTH);
  }
}

// Export singleton instance
export default new ApiService();
