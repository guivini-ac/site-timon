import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

// ==============================================
// TIPOS E INTERFACES
// ==============================================

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  operatingHours: string;
  emergencyPhone: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage?: string;
  favicon?: string;
  googleAnalytics?: string;
  googleSearchConsole?: string;
}

export interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  darkMode: boolean;
  fontFamily: string;
  customCss?: string;
}

export interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  categories: string[];
  tags: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  views: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  category: 'saude' | 'educacao' | 'cultura' | 'esporte' | 'reuniao' | 'audiencia' | 'festa';
  isPublic: boolean;
  organizer?: string;
  capacity?: number;
  registrationRequired: boolean;
  registrationLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: 'documentos' | 'tributos' | 'licencas' | 'social' | 'saude' | 'outros';
  icon: string;
  isActive: boolean;
  isHighlighted: boolean;
  requirements?: string[];
  documents?: string[];
  fees?: string;
  processingTime?: string;
  responsibleDepartment: string;
  onlineService: boolean;
  serviceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  category: 'eventos' | 'obras' | 'reunioes' | 'cultura' | 'esporte' | 'saude' | 'educacao' | 'outros';
  coverImage: string;
  images: GalleryImage[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  alt: string;
  uploadedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'viewer';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date' | 'time' | 'number' | 'url' | 'password';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  conditionalLogic?: {
    dependsOn: string;
    value: string;
    action: 'show' | 'hide' | 'require';
  };
}

export interface Form {
  id: string;
  title: string;
  slug: string;
  description?: string;
  fields: FormField[];
  settings: {
    allowMultipleSubmissions: boolean;
    requireLogin: boolean;
    successMessage: string;
    redirectUrl?: string;
    notificationEmail?: string;
    isActive: boolean;
  };
  design: {
    theme: 'default' | 'modern' | 'minimal';
    primaryColor: string;
    layout: 'single-column' | 'two-column';
  };
  submissions: FormSubmission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  submitterInfo?: {
    ip: string;
    userAgent: string;
    email?: string;
  };
  status: 'new' | 'read' | 'responded' | 'archived';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  isActive: boolean;
  contentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  isActive: boolean;
  usage: {
    posts: number;
    events: number;
    pages: number;
    services: number;
    gallery: number;
  };
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  template: 'default' | 'full-width' | 'sidebar' | 'landing';
  status: 'draft' | 'published' | 'private';
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
  uploadedBy: string;
  uploadedAt: Date;
  usedIn: {
    posts: string[];
    pages: string[];
    events: string[];
    slides: string[];
  };
}

// ==============================================
// ESTADO GLOBAL
// ==============================================

export interface AdminState {
  // Configurações
  siteSettings: SiteSettings;
  seoSettings: SeoSettings;
  appearanceSettings: AppearanceSettings;
  
  // Conteúdo
  slides: SlideData[];
  posts: NewsPost[];
  events: Event[];
  services: Service[];
  galleryAlbums: GalleryAlbum[];
  customPages: CustomPage[];
  forms: Form[];
  
  // Organização
  categories: Category[];
  tags: Tag[];
  
  // Sistema
  users: User[];
  mediaFiles: MediaFile[];
  
  // Estado UI
  loading: {
    slides: boolean;
    posts: boolean;
    events: boolean;
    services: boolean;
    gallery: boolean;
    forms: boolean;
    categories: boolean;
    tags: boolean;
    users: boolean;
    media: boolean;
    settings: boolean;
  };
  
  // Usuário logado
  currentUser: User | null;
  isAuthenticated: boolean;
}

type AdminAction = 
  // Slides
  | { type: 'SET_SLIDES'; payload: SlideData[] }
  | { type: 'ADD_SLIDE'; payload: SlideData }
  | { type: 'UPDATE_SLIDE'; payload: { id: string; data: Partial<SlideData> } }
  | { type: 'DELETE_SLIDE'; payload: string }
  | { type: 'REORDER_SLIDES'; payload: { oldIndex: number; newIndex: number } }
  
  // Posts
  | { type: 'SET_POSTS'; payload: NewsPost[] }
  | { type: 'ADD_POST'; payload: NewsPost }
  | { type: 'UPDATE_POST'; payload: { id: string; data: Partial<NewsPost> } }
  | { type: 'DELETE_POST'; payload: string }
  
  // Events
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: { id: string; data: Partial<Event> } }
  | { type: 'DELETE_EVENT'; payload: string }
  
  // Services
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: { id: string; data: Partial<Service> } }
  | { type: 'DELETE_SERVICE'; payload: string }
  
  // Gallery
  | { type: 'SET_GALLERY_ALBUMS'; payload: GalleryAlbum[] }
  | { type: 'ADD_GALLERY_ALBUM'; payload: GalleryAlbum }
  | { type: 'UPDATE_GALLERY_ALBUM'; payload: { id: string; data: Partial<GalleryAlbum> } }
  | { type: 'DELETE_GALLERY_ALBUM'; payload: string }
  
  // Forms
  | { type: 'SET_FORMS'; payload: Form[] }
  | { type: 'ADD_FORM'; payload: Form }
  | { type: 'UPDATE_FORM'; payload: { id: string; data: Partial<Form> } }
  | { type: 'DELETE_FORM'; payload: string }
  | { type: 'ADD_FORM_SUBMISSION'; payload: { formId: string; submission: FormSubmission } }
  
  // Categories & Tags
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; data: Partial<Category> } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_TAGS'; payload: Tag[] }
  | { type: 'ADD_TAG'; payload: Tag }
  | { type: 'UPDATE_TAG'; payload: { id: string; data: Partial<Tag> } }
  | { type: 'DELETE_TAG'; payload: string }
  
  // Pages
  | { type: 'SET_CUSTOM_PAGES'; payload: CustomPage[] }
  | { type: 'ADD_CUSTOM_PAGE'; payload: CustomPage }
  | { type: 'UPDATE_CUSTOM_PAGE'; payload: { id: string; data: Partial<CustomPage> } }
  | { type: 'DELETE_CUSTOM_PAGE'; payload: string }
  
  // Users
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: { id: string; data: Partial<User> } }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  
  // Media
  | { type: 'SET_MEDIA_FILES'; payload: MediaFile[] }
  | { type: 'ADD_MEDIA_FILE'; payload: MediaFile }
  | { type: 'UPDATE_MEDIA_FILE'; payload: { id: string; data: Partial<MediaFile> } }
  | { type: 'DELETE_MEDIA_FILE'; payload: string }
  
  // Settings
  | { type: 'UPDATE_SITE_SETTINGS'; payload: Partial<SiteSettings> }
  | { type: 'UPDATE_SEO_SETTINGS'; payload: Partial<SeoSettings> }
  | { type: 'UPDATE_APPEARANCE_SETTINGS'; payload: Partial<AppearanceSettings> }
  
  // Loading states
  | { type: 'SET_LOADING'; payload: { key: keyof AdminState['loading']; value: boolean } };

// ==============================================
// DADOS INICIAIS MOCK
// ==============================================

const initialState: AdminState = {
  siteSettings: {
    siteName: 'Prefeitura Municipal de Timon',
    siteDescription: 'Portal oficial da Prefeitura Municipal de Timon - MA',
    contactEmail: 'contato@timon.ma.gov.br',
    contactPhone: '(99) 3212-1234',
    address: 'Av. Getúlio Vargas, 123 - Centro, Timon - MA, 65633-000',
    socialMedia: {
      facebook: 'https://facebook.com/prefeituratimon',
      instagram: 'https://instagram.com/prefeituratimon',
      youtube: 'https://youtube.com/@prefeituratimon'
    },
    operatingHours: 'Segunda a Sexta: 7:00 às 17:00',
    emergencyPhone: '199'
  },

  seoSettings: {
    metaTitle: 'Prefeitura Municipal de Timon - Portal Oficial',
    metaDescription: 'Portal oficial da Prefeitura Municipal de Timon - MA. Acesse serviços, notícias, eventos e informações sobre nossa cidade.',
    metaKeywords: 'prefeitura, timon, maranhão, governo municipal, serviços públicos',
    googleAnalytics: 'G-XXXXXXXXXX'
  },

  appearanceSettings: {
    primaryColor: '#144c9c',
    secondaryColor: '#228B22',
    darkMode: false,
    fontFamily: 'Open Sans'
  },

  slides: [
    {
      id: '1',
      title: 'Bem-vindos ao Portal da Prefeitura de Timon',
      subtitle: 'Transparência e Eficiência',
      description: 'Acesse todos os serviços municipais de forma rápida e transparente.',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
      buttonText: 'Conheça os Serviços',
      buttonLink: '#services',
      isActive: true,
      order: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-20')
    },
    {
      id: '2',
      title: 'Obras de Pavimentação em Andamento',
      subtitle: 'Desenvolvimento da Infraestrutura',
      description: 'Acompanhe o progresso das obras de pavimentação que transformam nossa cidade.',
      image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&h=600&fit=crop',
      buttonText: 'Ver Obras',
      buttonLink: '#news',
      isActive: true,
      order: 2,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-08-18')
    },
    {
      id: '3',
      title: 'Campanha de Vacinação 2024',
      subtitle: 'Saúde em Primeiro Lugar',
      description: 'Mantenha sua vacinação em dia. Procure a unidade de saúde mais próxima.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop',
      buttonText: 'Saiba Mais',
      buttonLink: '#health',
      isActive: true,
      order: 3,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-08-15')
    }
  ],

  posts: [
    {
      id: '1',
      title: 'Prefeitura inaugura nova pavimentação na Avenida Principal',
      slug: 'pavimentacao-avenida-principal',
      excerpt: 'A obra beneficia diretamente mais de 2.000 famílias da região central.',
      content: 'A Prefeitura Municipal de Timon inaugurou hoje a nova pavimentação da Avenida Principal...',
      image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&h=400&fit=crop',
      author: 'Assessoria de Comunicação',
      status: 'published',
      categories: ['infraestrutura'],
      tags: ['obras', 'pavimentacao'],
      publishedAt: new Date('2024-08-20'),
      createdAt: new Date('2024-08-20'),
      updatedAt: new Date('2024-08-20'),
      featured: true,
      views: 324
    },
    {
      id: '2',
      title: 'Campanha de vacinação contra gripe está disponível',
      slug: 'campanha-vacinacao-gripe',
      excerpt: 'Todos os postos de saúde estão abertos para imunização da população.',
      content: 'A Secretaria Municipal de Saúde informa que está disponível a campanha...',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
      author: 'Secretaria de Saúde',
      status: 'published',
      categories: ['saude'],
      tags: ['vacinacao', 'saude'],
      publishedAt: new Date('2024-08-18'),
      createdAt: new Date('2024-08-18'),
      updatedAt: new Date('2024-08-18'),
      featured: false,
      views: 156
    }
  ],

  events: [
    {
      id: '1',
      title: 'Audiência Pública - Orçamento 2025',
      description: 'Discussão sobre o orçamento municipal para o próximo ano.',
      startDate: new Date('2024-09-15T14:00:00'),
      endDate: new Date('2024-09-15T17:00:00'),
      location: 'Câmara Municipal de Timon',
      category: 'audiencia',
      isPublic: true,
      organizer: 'Secretaria de Planejamento',
      capacity: 200,
      registrationRequired: false,
      createdAt: new Date('2024-08-15'),
      updatedAt: new Date('2024-08-15')
    },
    {
      id: '2',
      title: 'Festival de Cultura Popular',
      description: 'Apresentações culturais da nossa região.',
      startDate: new Date('2024-09-22T18:00:00'),
      endDate: new Date('2024-09-24T22:00:00'),
      location: 'Praça Central',
      category: 'cultura',
      isPublic: true,
      organizer: 'Secretaria de Cultura',
      registrationRequired: false,
      createdAt: new Date('2024-08-10'),
      updatedAt: new Date('2024-08-10')
    }
  ],

  services: [
    {
      id: '1',
      title: 'Certidão Negativa de Débitos',
      description: 'Emissão de certidão negativa de débitos municipais.',
      category: 'tributos',
      icon: 'FileText',
      isActive: true,
      isHighlighted: true,
      requirements: ['CPF ou CNPJ', 'Comprovante de endereço'],
      documents: ['Documento de identidade', 'CPF'],
      fees: 'Gratuito',
      processingTime: '24 horas',
      responsibleDepartment: 'Secretaria da Fazenda',
      onlineService: true,
      serviceUrl: '/servicos/certidao-negativa',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-08-20')
    },
    {
      id: '2',
      title: 'Alvará de Funcionamento',
      description: 'Solicitação de alvará para estabelecimentos comerciais.',
      category: 'licencas',
      icon: 'Building2',
      isActive: true,
      isHighlighted: true,
      requirements: ['CNPJ da empresa', 'Contrato de locação'],
      documents: ['Formulário preenchido', 'Planta baixa'],
      fees: 'R$ 120,00',
      processingTime: '15 dias úteis',
      responsibleDepartment: 'Secretaria de Desenvolvimento',
      onlineService: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-18')
    }
  ],

  galleryAlbums: [
    {
      id: '1',
      title: 'Inauguração da Nova Escola Municipal',
      description: 'Cerimônia de inauguração da Escola Municipal Dr. João Silva.',
      category: 'eventos',
      coverImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop',
      images: [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop',
          caption: 'Fachada da nova escola',
          alt: 'Fachada da Escola Municipal Dr. João Silva',
          uploadedAt: new Date('2024-08-15')
        }
      ],
      isPublic: true,
      createdAt: new Date('2024-08-15'),
      updatedAt: new Date('2024-08-15')
    }
  ],

  customPages: [
    {
      id: '1',
      title: 'Transparência Municipal',
      slug: 'transparencia',
      content: '<h1>Portal da Transparência</h1><p>Acesse todas as informações sobre os gastos públicos...</p>',
      excerpt: 'Portal com informações sobre gastos públicos e transparência.',
      template: 'default',
      status: 'published',
      seo: {
        metaTitle: 'Transparência - Prefeitura de Timon',
        metaDescription: 'Portal da transparência da Prefeitura Municipal de Timon'
      },
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-08-20')
    }
  ],

  forms: [],
  categories: [],
  tags: [],
  users: [],
  mediaFiles: [],

  loading: {
    slides: false,
    posts: false,
    events: false,
    services: false,
    gallery: false,
    forms: false,
    categories: false,
    tags: false,
    users: false,
    media: false,
    settings: false
  },

  currentUser: null,
  isAuthenticated: false
};

// ==============================================
// REDUCER
// ==============================================

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    // Slides
    case 'SET_SLIDES':
      return { ...state, slides: action.payload };
    
    case 'ADD_SLIDE':
      return { ...state, slides: [...state.slides, action.payload] };
    
    case 'UPDATE_SLIDE':
      return {
        ...state,
        slides: state.slides.map(slide =>
          slide.id === action.payload.id
            ? { ...slide, ...action.payload.data, updatedAt: new Date() }
            : slide
        )
      };
    
    case 'DELETE_SLIDE':
      return {
        ...state,
        slides: state.slides.filter(slide => slide.id !== action.payload)
      };

    case 'REORDER_SLIDES':
      const { oldIndex, newIndex } = action.payload;
      const newSlides = [...state.slides];
      const [movedSlide] = newSlides.splice(oldIndex, 1);
      newSlides.splice(newIndex, 0, movedSlide);
      
      // Update order numbers
      const reorderedSlides = newSlides.map((slide, index) => ({
        ...slide,
        order: index + 1,
        updatedAt: new Date()
      }));
      
      return { ...state, slides: reorderedSlides };

    // Posts
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id
            ? { ...post, ...action.payload.data, updatedAt: new Date() }
            : post
        )
      };
    
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      };

    // Events
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    
    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };
    
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id
            ? { ...event, ...action.payload.data, updatedAt: new Date() }
            : event
        )
      };
    
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };

    // Services
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    
    case 'ADD_SERVICE':
      return { ...state, services: [action.payload, ...state.services] };
    
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.id
            ? { ...service, ...action.payload.data, updatedAt: new Date() }
            : service
        )
      };
    
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(service => service.id !== action.payload)
      };

    // Gallery
    case 'SET_GALLERY_ALBUMS':
      return { ...state, galleryAlbums: action.payload };
    
    case 'ADD_GALLERY_ALBUM':
      return { ...state, galleryAlbums: [action.payload, ...state.galleryAlbums] };
    
    case 'UPDATE_GALLERY_ALBUM':
      return {
        ...state,
        galleryAlbums: state.galleryAlbums.map(album =>
          album.id === action.payload.id
            ? { ...album, ...action.payload.data, updatedAt: new Date() }
            : album
        )
      };
    
    case 'DELETE_GALLERY_ALBUM':
      return {
        ...state,
        galleryAlbums: state.galleryAlbums.filter(album => album.id !== action.payload)
      };

    // Forms
    case 'SET_FORMS':
      return { ...state, forms: action.payload };
    
    case 'ADD_FORM':
      return { ...state, forms: [action.payload, ...state.forms] };
    
    case 'UPDATE_FORM':
      return {
        ...state,
        forms: state.forms.map(form =>
          form.id === action.payload.id
            ? { ...form, ...action.payload.data, updatedAt: new Date() }
            : form
        )
      };
    
    case 'DELETE_FORM':
      return {
        ...state,
        forms: state.forms.filter(form => form.id !== action.payload)
      };

    case 'ADD_FORM_SUBMISSION':
      return {
        ...state,
        forms: state.forms.map(form =>
          form.id === action.payload.formId
            ? { ...form, submissions: [action.payload.submission, ...form.submissions] }
            : form
        )
      };

    // Categories
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'ADD_CATEGORY':
      return { ...state, categories: [action.payload, ...state.categories] };
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id
            ? { ...category, ...action.payload.data, updatedAt: new Date() }
            : category
        )
      };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };

    // Tags
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    
    case 'ADD_TAG':
      return { ...state, tags: [action.payload, ...state.tags] };
    
    case 'UPDATE_TAG':
      return {
        ...state,
        tags: state.tags.map(tag =>
          tag.id === action.payload.id
            ? { ...tag, ...action.payload.data, updatedAt: new Date() }
            : tag
        )
      };
    
    case 'DELETE_TAG':
      return {
        ...state,
        tags: state.tags.filter(tag => tag.id !== action.payload)
      };

    // Custom Pages
    case 'SET_CUSTOM_PAGES':
      return { ...state, customPages: action.payload };
    
    case 'ADD_CUSTOM_PAGE':
      return { ...state, customPages: [action.payload, ...state.customPages] };
    
    case 'UPDATE_CUSTOM_PAGE':
      return {
        ...state,
        customPages: state.customPages.map(page =>
          page.id === action.payload.id
            ? { ...page, ...action.payload.data, updatedAt: new Date() }
            : page
        )
      };
    
    case 'DELETE_CUSTOM_PAGE':
      return {
        ...state,
        customPages: state.customPages.filter(page => page.id !== action.payload)
      };

    // Users
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'ADD_USER':
      return { ...state, users: [action.payload, ...state.users] };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id
            ? { ...user, ...action.payload.data }
            : user
        )
      };
    
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };

    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };

    // Media
    case 'SET_MEDIA_FILES':
      return { ...state, mediaFiles: action.payload };
    
    case 'ADD_MEDIA_FILE':
      return { ...state, mediaFiles: [action.payload, ...state.mediaFiles] };
    
    case 'UPDATE_MEDIA_FILE':
      return {
        ...state,
        mediaFiles: state.mediaFiles.map(file =>
          file.id === action.payload.id
            ? { ...file, ...action.payload.data }
            : file
        )
      };
    
    case 'DELETE_MEDIA_FILE':
      return {
        ...state,
        mediaFiles: state.mediaFiles.filter(file => file.id !== action.payload)
      };

    // Settings
    case 'UPDATE_SITE_SETTINGS':
      return {
        ...state,
        siteSettings: { ...state.siteSettings, ...action.payload }
      };

    case 'UPDATE_SEO_SETTINGS':
      return {
        ...state,
        seoSettings: { ...state.seoSettings, ...action.payload }
      };

    case 'UPDATE_APPEARANCE_SETTINGS':
      return {
        ...state,
        appearanceSettings: { ...state.appearanceSettings, ...action.payload }
      };

    // Loading states
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value }
      };

    default:
      return state;
  }
}

// ==============================================
// CONTEXT E PROVIDER
// ==============================================

interface AdminDataContextType {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
}

export const AdminDataContext = createContext<AdminDataContextType | null>(null);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Simular carregamento de dados
  useEffect(() => {
    // Aqui você poderia fazer chamadas para APIs reais
    // Por enquanto, usamos os dados mock já definidos no initialState
    console.log('AdminDataProvider initialized with mock data');
  }, []);

  const value: AdminDataContextType = {
    state,
    dispatch
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};