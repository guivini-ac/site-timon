import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminView = 
  | 'dashboard'
  | 'slides'
  | 'posts'
  | 'pages'
  | 'events'
  | 'services'
  | 'secretarias'
  | 'tourist-attractions'
  | 'media'
  | 'gallery'
  | 'categories'
  | 'tags'
  | 'users'
  | 'permissions'
  | 'my-permissions'
  | 'settings'
  | 'profile'
  | 'seo'
  | 'forms'
  | 'form-submissions'
  | 'appearance'
  | 'comments';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminContextType {
  // Navegação
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
  
  // Breadcrumbs
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  
  // Layout
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Busca global
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  
  // Notificações
  notifications: AdminNotification[];
  addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Dados mockados para demonstração
  mockData: MockData;
  
  // Estado de carregamento
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface AdminNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: Date;
  read?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface MockData {
  totalPosts: number;
  totalPages: number;
  totalUsers: number;
  totalMedia: number;
  recentPosts: Array<{
    id: number;
    title: string;
    status: 'published' | 'draft' | 'archived';
    author: string;
    date: string;
    views: number;
    category: string;
  }>;
  recentEvents: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    status: 'upcoming' | 'ongoing' | 'completed';
  }>;
  systemStats: {
    totalVisits: number;
    avgLoadTime: number;
    uptime: number;
    errorRate: number;
  };
  popularServices: Array<{
    name: string;
    usage: number;
    growth: number;
  }>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  // Inicializar com true em desktop, false em mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true; // Default para SSR
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dados mockados para demonstração
  const mockData: MockData = {
    totalPosts: 247,
    totalPages: 23,
    totalUsers: 12,
    totalMedia: 1456,
    recentPosts: [
      {
        id: 1,
        title: 'Nova UBS inaugurada no Bairro São José',
        status: 'published',
        author: 'Maria Silva',
        date: '15 Ago 2025',
        views: 1234,
        category: 'Saúde'
      },
      {
        id: 2,
        title: 'Programa de Pavimentação atinge 80%',
        status: 'published',
        author: 'João Santos',
        date: '12 Ago 2025',
        views: 987,
        category: 'Infraestrutura'
      },
      {
        id: 3,
        title: 'Festival Cultural no centro da cidade',
        status: 'draft',
        author: 'Ana Costa',
        date: '10 Ago 2025',
        views: 0,
        category: 'Cultura'
      }
    ],
    recentEvents: [
      {
        id: 1,
        title: 'Sessão Ordinária da Câmara',
        date: '20 Ago 2025',
        time: '14:00',
        location: 'Câmara Municipal',
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Audiência Pública - Saúde',
        date: '22 Ago 2025',
        time: '19:00',
        location: 'Centro de Convenções',
        status: 'upcoming'
      },
      {
        id: 3,
        title: 'Inauguração da Praça Central',
        date: '25 Ago 2025',
        time: '16:00',
        location: 'Praça Central',
        status: 'upcoming'
      }
    ],
    systemStats: {
      totalVisits: 45678,
      avgLoadTime: 1.2,
      uptime: 99.8,
      errorRate: 0.2
    },
    popularServices: [
      { name: 'IPTU Online', usage: 78, growth: 12 },
      { name: 'Protocolo Online', usage: 65, growth: 8 },
      { name: 'Conecta Timon', usage: 59, growth: 15 },
      { name: 'Ouvidoria', usage: 45, growth: 5 },
      { name: 'Licenciamento', usage: 38, growth: -3 }
    ]
  };

  const addNotification = (notification: Omit<AdminNotification, 'id' | 'timestamp'>) => {
    const newNotification: AdminNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Inicializar com algumas notificações de exemplo
  useEffect(() => {
    const initialNotifications: AdminNotification[] = [
      {
        id: '1',
        type: 'info',
        title: 'Bem-vindo ao painel administrativo!',
        message: 'Gerencie todo o conteúdo do site da Prefeitura de Timon',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        read: false
      },
      {
        id: '2',
        type: 'success',
        title: 'Backup automático realizado',
        message: 'Backup do sistema foi concluído com sucesso',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        read: false
      }
    ];
    setNotifications(initialNotifications);
  }, []);

  const value: AdminContextType = {
    currentView,
    setCurrentView,
    breadcrumbs,
    setBreadcrumbs,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    globalSearch,
    setGlobalSearch,
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    mockData,
    isLoading,
    setIsLoading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}