// Re-export all types from @timon/types
export * from '@timon/types';

// SDK-specific types
export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  status?: number;
}

export interface RequestConfig {
  signal?: AbortSignal;
  timeout?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions extends RequestConfig {
  onProgress?: (progress: UploadProgress) => void;
  folder?: string;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_prev: boolean;
}