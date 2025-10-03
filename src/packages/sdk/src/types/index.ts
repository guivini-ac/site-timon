// Tipos base do CMS
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  lastLoginAt?: string;
  roles: Role[];
}

export interface Role extends BaseEntity {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission extends BaseEntity {
  action: string;
  subject: string;
  conditions?: Record<string, any>;
}

export interface Media extends BaseEntity {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  url: string;
  variants: MediaVariant[];
  createdBy: string;
}

export interface MediaVariant {
  name: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface Taxonomy extends BaseEntity {
  slug: string;
  title: Record<string, string>; // i18n
  type: 'category' | 'tag' | 'custom';
  description?: Record<string, string>;
  parent?: string;
  children?: Taxonomy[];
}

export interface Post extends BaseEntity {
  title: Record<string, string>; // i18n
  slug: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  excerpt?: Record<string, string>;
  content: Record<string, any>; // Rich text content
  cover?: Media;
  categories: Taxonomy[];
  tags: Taxonomy[];
  authorId: string;
  author: User;
  publishedAt?: string;
  scheduledAt?: string;
  seo: {
    title?: Record<string, string>;
    description?: Record<string, string>;
    ogImage?: Media;
    keywords?: string[];
  };
  revisions: PostRevision[];
}

export interface PostRevision extends BaseEntity {
  postId: string;
  version: number;
  title: Record<string, string>;
  content: Record<string, any>;
  status: string;
  createdBy: string;
  comment?: string;
}

export interface Page extends BaseEntity {
  title: Record<string, string>;
  slug: string;
  blocks: any[]; // JSON blocks for page builder
  status: 'draft' | 'published' | 'archived';
  template?: string;
  seo: {
    title?: Record<string, string>;
    description?: Record<string, string>;
    ogImage?: Media;
    keywords?: string[];
  };
  revisions: PageRevision[];
}

export interface PageRevision extends BaseEntity {
  pageId: string;
  version: number;
  title: Record<string, string>;
  blocks: any[];
  status: string;
  createdBy: string;
  comment?: string;
}

export interface Menu extends BaseEntity {
  name: string;
  location: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  label: Record<string, string>;
  url?: string;
  type: 'url' | 'post' | 'page' | 'custom';
  target?: '_blank' | '_self';
  cssClasses?: string;
  children?: MenuItem[];
  order: number;
}

export interface Collection extends BaseEntity {
  key: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  schema: any; // JSON Schema
  settings: {
    hasStatus?: boolean;
    hasRevisions?: boolean;
    hasI18n?: boolean;
    hasSeo?: boolean;
  };
}

export interface ContentEntry extends BaseEntity {
  collection: string;
  status?: 'draft' | 'published' | 'archived';
  data: Record<string, any>;
  revisions?: ContentRevision[];
}

export interface ContentRevision extends BaseEntity {
  entryId: string;
  version: number;
  data: Record<string, any>;
  createdBy: string;
  comment?: string;
}

export interface Webhook extends BaseEntity {
  name: string;
  url: string;
  secret?: string;
  events: string[];
  enabled: boolean;
  lastTriggeredAt?: string;
  headers?: Record<string, string>;
}

export interface AuditLog extends BaseEntity {
  userId: string;
  user: User;
  action: string;
  entity: string;
  entityId: string;
  diff?: any;
  ip?: string;
  userAgent?: string;
}

// Tipos para API
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  [key: string]: any;
}

export interface SortParam {
  field: string;
  order: 'asc' | 'desc';
}

export interface QueryParams extends PaginationParams {
  filters?: FilterParams;
  sort?: SortParam[];
  fields?: string[];
  expand?: string[];
  locale?: string;
}

// Tipos para preview
export interface PreviewToken {
  token: string;
  expiresAt: string;
  contentType: string;
  contentId: string;
}

// Tipos para upload
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  folder?: string;
  alt?: string;
  title?: string;
}