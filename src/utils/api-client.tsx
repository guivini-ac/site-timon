import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d07800a2`;

// Default timeout of 15 seconds
const DEFAULT_TIMEOUT = 15000;

export class ApiClient {
  private static instance: ApiClient;
  
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = DEFAULT_TIMEOUT): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  async get(endpoint: string, timeout?: number): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}${endpoint}`,
        { method: 'GET' },
        timeout
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post(endpoint: string, data: any, timeout?: number): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}${endpoint}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        timeout
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async put(endpoint: string, data: any, timeout?: number): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}${endpoint}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        },
        timeout
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  async delete(endpoint: string, timeout?: number): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}${endpoint}`,
        { method: 'DELETE' },
        timeout
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  // Health check with quick timeout
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health', 5000);
      return response.status === 'ok';
    } catch (error) {
      console.warn('Health check failed:', error);
      return false;
    }
  }
}

export const apiClient = ApiClient.getInstance();