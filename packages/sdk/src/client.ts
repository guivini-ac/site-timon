import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '@timon/config';
import type {
  ApiResponse,
  PaginatedResponse,
  QueryOptions,
  User,
  Page,
  Slide,
  Event,
  Service,
  Gallery,
  Form,
  FormSubmission,
  Secretaria,
  SiteSettings,
  UploadResponse,
  MediaFile,
} from '@timon/types';

export class TimonApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const message = this.extractErrorMessage(error);
        throw new Error(message);
      }
    );
  }

  private extractErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any;
      return data.message || data.error || 'Erro desconhecido';
    }
    return error.message || 'Erro de conexão';
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  // Health Check
  async health(): Promise<{ status: string; timestamp: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Auth
  async signup(email: string, password: string, name: string): Promise<ApiResponse<User>> {
    const response = await this.client.post('/auth/signup', { email, password, name });
    return response.data;
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.data?.token) {
      this.setToken(response.data.data.token);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  // Users
  async getUsers(options?: QueryOptions): Promise<ApiResponse<PaginatedResponse<User>>> {
    const response = await this.client.get('/users', { params: options });
    return response.data;
  }

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<User>> {
    const response = await this.client.post('/users', user);
    return response.data;
  }

  async updateUser(id: string, user: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.client.put(`/users/${id}`, user);
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/users/${id}`);
    return response.data;
  }

  // Pages
  async getPages(options?: QueryOptions): Promise<ApiResponse<PaginatedResponse<Page>>> {
    const response = await this.client.get('/pages', { params: options });
    return response.data;
  }

  async getPage(id: string): Promise<ApiResponse<Page>> {
    const response = await this.client.get(`/pages/${id}`);
    return response.data;
  }

  async getPageBySlug(slug: string): Promise<ApiResponse<Page>> {
    const response = await this.client.get(`/pages/slug/${slug}`);
    return response.data;
  }

  async createPage(page: Omit<Page, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Page>> {
    const response = await this.client.post('/pages', page);
    return response.data;
  }

  async updatePage(id: string, page: Partial<Page>): Promise<ApiResponse<Page>> {
    const response = await this.client.put(`/pages/${id}`, page);
    return response.data;
  }

  async deletePage(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/pages/${id}`);
    return response.data;
  }

  // Slides/Carousel
  async getSlides(): Promise<ApiResponse<Slide[]>> {
    const response = await this.client.get('/slides');
    return response.data;
  }

  async updateSlides(slides: Slide[]): Promise<ApiResponse<void>> {
    const response = await this.client.post('/slides', { slides });
    return response.data;
  }

  // Events
  async getEvents(options?: QueryOptions): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const response = await this.client.get('/events', { params: options });
    return response.data;
  }

  async getEvent(id: string): Promise<ApiResponse<Event>> {
    const response = await this.client.get(`/events/${id}`);
    return response.data;
  }

  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Event>> {
    const response = await this.client.post('/events', event);
    return response.data;
  }

  async updateEvent(id: string, event: Partial<Event>): Promise<ApiResponse<Event>> {
    const response = await this.client.put(`/events/${id}`, event);
    return response.data;
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/events/${id}`);
    return response.data;
  }

  // Services
  async getServices(options?: QueryOptions): Promise<ApiResponse<PaginatedResponse<Service>>> {
    const response = await this.client.get('/services', { params: options });
    return response.data;
  }

  async getService(id: string): Promise<ApiResponse<Service>> {
    const response = await this.client.get(`/services/${id}`);
    return response.data;
  }

  async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Service>> {
    const response = await this.client.post('/services', service);
    return response.data;
  }

  async updateService(id: string, service: Partial<Service>): Promise<ApiResponse<Service>> {
    const response = await this.client.put(`/services/${id}`, service);
    return response.data;
  }

  async deleteService(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/services/${id}`);
    return response.data;
  }

  // Gallery
  async getGalleries(options?: QueryOptions): Promise<ApiResponse<PaginatedResponse<Gallery>>> {
    const response = await this.client.get('/gallery', { params: options });
    return response.data;
  }

  async getGallery(id: string): Promise<ApiResponse<Gallery>> {
    const response = await this.client.get(`/gallery/${id}`);
    return response.data;
  }

  async createGallery(gallery: Omit<Gallery, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Gallery>> {
    const response = await this.client.post('/gallery', gallery);
    return response.data;
  }

  async updateGallery(id: string, gallery: Partial<Gallery>): Promise<ApiResponse<Gallery>> {
    const response = await this.client.put(`/gallery/${id}`, gallery);
    return response.data;
  }

  async deleteGallery(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/gallery/${id}`);
    return response.data;
  }

  // Forms
  async getForms(options?: QueryOptions): Promise<ApiResponse<PaginatedResponse<Form>>> {
    const response = await this.client.get('/forms', { params: options });
    return response.data;
  }

  async getForm(id: string): Promise<ApiResponse<Form>> {
    const response = await this.client.get(`/forms/${id}`);
    return response.data;
  }

  async getFormBySlug(slug: string): Promise<ApiResponse<Form>> {
    const response = await this.client.get(`/forms/slug/${slug}`);
    return response.data;
  }

  async createForm(form: Omit<Form, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Form>> {
    const response = await this.client.post('/forms', form);
    return response.data;
  }

  async updateForm(id: string, form: Partial<Form>): Promise<ApiResponse<Form>> {
    const response = await this.client.put(`/forms/${id}`, form);
    return response.data;
  }

  async deleteForm(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/forms/${id}`);
    return response.data;
  }

  // Form Submissions
  async submitForm(slug: string, data: Record<string, any>): Promise<ApiResponse<{ id: string }>> {
    const response = await this.client.post(`/forms/${slug}/submit`, data);
    return response.data;
  }

  async getSubmissions(options?: QueryOptions): Promise<ApiResponse<PaginatedResponse<FormSubmission>>> {
    const response = await this.client.get('/submissions', { params: options });
    return response.data;
  }

  async getSubmission(id: string): Promise<ApiResponse<FormSubmission>> {
    const response = await this.client.get(`/submissions/${id}`);
    return response.data;
  }

  async deleteSubmission(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/submissions/${id}`);
    return response.data;
  }

  // Secretarias
  async getSecretarias(options?: QueryOptions): Promise<ApiResponse<PaginatedResponse<Secretaria>>> {
    const response = await this.client.get('/secretarias', { params: options });
    return response.data;
  }

  async getSecretaria(id: string): Promise<ApiResponse<Secretaria>> {
    const response = await this.client.get(`/secretarias/${id}`);
    return response.data;
  }

  async createSecretaria(secretaria: Omit<Secretaria, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Secretaria>> {
    const response = await this.client.post('/secretarias', secretaria);
    return response.data;
  }

  async updateSecretaria(id: string, secretaria: Partial<Secretaria>): Promise<ApiResponse<Secretaria>> {
    const response = await this.client.put(`/secretarias/${id}`, secretaria);
    return response.data;
  }

  async deleteSecretaria(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/secretarias/${id}`);
    return response.data;
  }

  // Settings
  async getSettings(): Promise<ApiResponse<SiteSettings>> {
    const response = await this.client.get('/settings');
    return response.data;
  }

  async updateSettings(settings: Partial<SiteSettings>): Promise<ApiResponse<SiteSettings>> {
    const response = await this.client.put('/settings', settings);
    return response.data;
  }

  // Media/Upload
  async uploadFile(file: File, folder?: string): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await this.client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getMediaFiles(options?: QueryOptions): Promise<ApiResponse<PaginatedResponse<MediaFile>>> {
    const response = await this.client.get('/media', { params: options });
    return response.data;
  }

  async deleteMediaFile(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/media/${id}`);
    return response.data;
  }

  // Presigned URL for direct upload to S3
  async getPresignedUrl(filename: string, mimetype: string, folder?: string): Promise<ApiResponse<{ presigned_url: string; file_url: string }>> {
    const response = await this.client.post('/upload/presigned', {
      filename,
      mimetype,
      folder,
    });
    return response.data;
  }

  async uploadToPresignedUrl(presignedUrl: string, file: File): Promise<void> {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  }
}

// Default client instance
export const apiClient = new TimonApiClient();