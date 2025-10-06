// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Content Types
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  author_id: string;
}

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
  button_text?: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location?: string;
  image?: string;
  category?: string;
  status: 'draft' | 'published' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  requirements?: string[];
  documents?: string[];
  process_time?: string;
  cost?: string;
  responsible_department?: string;
  contact_info?: string;
  online_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  images: GalleryImage[];
  category?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  slug: string;
  fields: FormField[];
  settings: FormSettings;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // Para select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  order: number;
}

export interface FormSettings {
  submit_message?: string;
  redirect_url?: string;
  email_notifications?: boolean;
  notification_email?: string;
  max_submissions?: number;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  form_slug: string;
  data: Record<string, any>;
  submitted_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface Secretaria {
  id: string;
  name: string;
  description?: string;
  secretary_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
  services?: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Settings Types
export interface SiteSettings {
  site_name: string;
  site_description: string;
  site_logo?: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  google_analytics_id?: string;
  maintenance_mode: boolean;
  updated_at: string;
}

// Media/Upload Types
export interface UploadResponse {
  url: string;
  presigned_url?: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  mimetype: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
  created_at: string;
  updated_at: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Query Types
export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
}

// Municipal Specific Types
export interface Mayor {
  name: string;
  bio: string;
  image?: string;
  term_start: string;
  term_end: string;
  party?: string;
  previous_positions?: string[];
}

export interface TouristAttraction {
  id: string;
  name: string;
  description: string;
  category: 'cultural' | 'natural' | 'historical' | 'religious' | 'recreational';
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  visiting_hours?: string;
  admission_fee?: string;
  contact_info?: string;
  amenities?: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Symbol {
  id: string;
  type: 'flag' | 'coat_of_arms' | 'anthem';
  title: string;
  description: string;
  image?: string;
  file_url?: string; // Para hino
  history?: string;
  specifications?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Accessibility Types
export interface AccessibilitySettings {
  high_contrast: boolean;
  large_font: boolean;
  keyboard_navigation: boolean;
  screen_reader_support: boolean;
  vlibras_enabled: boolean;
}