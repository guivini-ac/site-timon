// Brand Colors - Cores oficiais da Prefeitura de Timon
export const BRAND_COLORS = {
  TORY_BLUE: '#144c9c',
  SAFFRON: '#f4b728',
  SAN_MARINO: '#3f6999',
  STEEL_BLUE: '#4c7cb4',
  POLO_BLUE: '#83a4cc',
  PERIWINKLE_GRAY: '#c2d2e5',
  BERMUDA_GRAY: '#6886a6',
  GREEN: '#228B22',
  GRAY: '#6C757D',
  SUCCESS: '#28A745',
  WARNING: '#FFC107',
  ERROR: '#DC3545',
} as const;

// Site Configuration
export const SITE_CONFIG = {
  NAME: 'Prefeitura Municipal de Timon',
  SHORT_NAME: 'Prefeitura Timon',
  DESCRIPTION: 'Portal oficial da Prefeitura Municipal de Timon - MA',
  URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://timon.ma.gov.br',
  LOGO: '/images/logo-timon.png',
  FAVICON: '/favicon.ico',
  SOCIAL_IMAGE: '/images/og-image.jpg',
  LANGUAGE: 'pt-BR',
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  CDN_BASE_URL: process.env.NEXT_PUBLIC_CDN_BASE_URL || 'http://localhost:9000/app-bucket',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
} as const;

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg'],
} as const;

// Form Configuration
export const FORM_CONFIG = {
  MAX_FIELDS: 50,
  MAX_OPTIONS_PER_FIELD: 20,
  MAX_SUBMISSIONS_DEFAULT: 1000,
  REQUIRED_FIELDS: ['text', 'email'],
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  TTL: {
    SHORT: 5 * 60, // 5 minutes
    MEDIUM: 30 * 60, // 30 minutes
    LONG: 60 * 60, // 1 hour
    VERY_LONG: 24 * 60 * 60, // 24 hours
  },
  KEYS: {
    PAGES: 'pages',
    EVENTS: 'events',
    SERVICES: 'services',
    GALLERY: 'gallery',
    FORMS: 'forms',
    SECRETARIAS: 'secretarias',
    SETTINGS: 'settings',
  },
} as const;

// Navigation Menu
export const NAVIGATION_MENU = [
  {
    title: 'Início',
    href: '/',
  },
  {
    title: 'A Cidade',
    href: '/cidade',
    children: [
      { title: 'História', href: '/cidade/historia' },
      { title: 'Símbolos', href: '/cidade/simbolos' },
      { title: 'Pontos Turísticos', href: '/cidade/pontos-turisticos' },
      { title: 'Dados Gerais', href: '/cidade/dados-gerais' },
    ],
  },
  {
    title: 'Governo',
    href: '/governo',
    children: [
      { title: 'Prefeito', href: '/governo/prefeito' },
      { title: 'Secretarias', href: '/governo/secretarias' },
      { title: 'Organograma', href: '/governo/organograma' },
    ],
  },
  {
    title: 'Serviços',
    href: '/servicos',
  },
  {
    title: 'Notícias',
    href: '/noticias',
  },
  {
    title: 'Eventos',
    href: '/eventos',
  },
  {
    title: 'Transparência',
    href: '/transparencia',
    children: [
      { title: 'Portal da Transparência', href: 'https://transparencia.timon.ma.gov.br', external: true },
      { title: 'Diário Oficial', href: 'https://diario.timon.ma.gov.br', external: true },
      { title: 'Lei de Acesso à Informação', href: '/transparencia/lai' },
    ],
  },
  {
    title: 'Contato',
    href: '/contato',
  },
] as const;

// Social Media Links
export const SOCIAL_MEDIA = {
  FACEBOOK: 'https://facebook.com/prefeituratimon',
  INSTAGRAM: 'https://instagram.com/prefeituratimon',
  TWITTER: 'https://twitter.com/prefeituratimon',
  YOUTUBE: 'https://youtube.com/@prefeituratimon',
} as const;

// Contact Information
export const CONTACT_INFO = {
  ADDRESS: 'Av. Getúlio Vargas, 1234 - Centro - Timon/MA - CEP: 65630-000',
  PHONE: '(99) 3212-3456',
  WHATSAPP: '(99) 99999-9999',
  EMAIL: 'contato@timon.ma.gov.br',
  HOURS: 'Segunda a Sexta: 8h às 17h',
} as const;

// SEO Configuration
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Prefeitura Municipal de Timon - MA',
  TITLE_TEMPLATE: '%s | Prefeitura Municipal de Timon',
  DEFAULT_DESCRIPTION: 'Portal oficial da Prefeitura Municipal de Timon - MA. Acesse informações sobre serviços, notícias, eventos e transparência pública.',
  KEYWORDS: [
    'Timon',
    'Maranhão',
    'Prefeitura',
    'Governo Municipal',
    'Serviços Públicos',
    'Transparência',
    'Portal Oficial',
  ],
  OPEN_GRAPH: {
    TYPE: 'website',
    LOCALE: 'pt_BR',
    SITE_NAME: 'Prefeitura Municipal de Timon',
  },
  TWITTER: {
    HANDLE: '@prefeituratimon',
    SITE: '@prefeituratimon',
    CARD_TYPE: 'summary_large_image',
  },
} as const;

// Accessibility Configuration  
export const ACCESSIBILITY_CONFIG = {
  FONT_SIZES: {
    NORMAL: '16px',
    LARGE: '18px',
    EXTRA_LARGE: '20px',
  },
  CONTRAST_RATIOS: {
    NORMAL: 'normal',
    HIGH: 'high',
  },
  KEYBOARD_NAVIGATION: true,
  SCREEN_READER_SUPPORT: true,
  VLIBRAS_ENABLED: true,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  NOT_FOUND: 'Página não encontrada.',
  UNAUTHORIZED: 'Acesso não autorizado.',
  FORBIDDEN: 'Acesso negado.',
  VALIDATION: 'Dados inválidos. Verifique os campos.',
  SERVER_ERROR: 'Erro interno do servidor.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Salvo com sucesso!',
  UPDATED: 'Atualizado com sucesso!',
  DELETED: 'Excluído com sucesso!',
  SENT: 'Enviado com sucesso!',
  CREATED: 'Criado com sucesso!',
} as const;

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  CEP: /^\d{5}-\d{3}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: "dd 'de' MMMM 'de' yyyy",
  WITH_TIME: 'dd/MM/yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;