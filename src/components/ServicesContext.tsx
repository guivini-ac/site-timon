import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Service {
  id: number;
  title: string;
  description: string;
  url: string;
  icon: string;
  category: 'popular' | 'digital' | 'presencial' | 'documento' | 'fiscal' | 'outros';
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  accessCount: number;
  lastAccessed?: Date;
  requirements?: string[];
  availableHours?: string;
  contact?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceFormData {
  title: string;
  description: string;
  url: string;
  icon: string;
  category: Service['category'];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  requirements?: string[];
  availableHours?: string;
  contact?: string;
}

interface ServicesContextType {
  services: Service[];
  addService: (service: ServiceFormData) => void;
  updateService: (id: number, service: Partial<Service>) => void;
  deleteService: (id: number) => void;
  toggleServiceStatus: (id: number) => void;
  toggleServiceFeatured: (id: number) => void;
  getServicesByCategory: (category: Service['category']) => Service[];
  getFeaturedServices: () => Service[];
  getPopularServices: () => Service[];
  incrementAccessCount: (id: number) => void;
  getCategoryLabel: (category: Service['category']) => string;
  getCategoryColor: (category: Service['category']) => string;
  getCategoryIcon: (category: Service['category']) => string;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);

  // Configuração de categorias
  const categoryConfig = {
    'popular': { 
      label: 'Mais Populares', 
      color: '#144c9c', 
      icon: 'TrendingUp'
    },
    'digital': { 
      label: 'Serviços Digitais', 
      color: '#28A745', 
      icon: 'Globe'
    },
    'presencial': { 
      label: 'Atendimento Presencial', 
      color: '#FFC107', 
      icon: 'Users'
    },
    'documento': { 
      label: 'Documentos e Certidões', 
      color: '#17A2B8', 
      icon: 'FileText'
    },
    'fiscal': { 
      label: 'Serviços Fiscais', 
      color: '#DC3545', 
      icon: 'Receipt'
    },
    'outros': { 
      label: 'Outros Serviços', 
      color: '#6F42C1', 
      icon: 'Grid'
    }
  };

  // Inicializar com serviços de exemplo
  useEffect(() => {
    const initialServices: Service[] = [
      {
        id: 1,
        title: 'IPTU Online',
        description: 'Consulte, emita segunda via e pague seu IPTU de forma rápida e segura.',
        url: 'https://iptu.timon.ma.gov.br',
        icon: 'Home',
        category: 'popular',
        isActive: true,
        isFeatured: true,
        order: 1,
        accessCount: 2847,
        lastAccessed: new Date('2024-12-01'),
        requirements: ['CPF do proprietário', 'Número do cadastro imobiliário'],
        availableHours: '24h por dia',
        contact: '(99) 3212-3456',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-11-20')
      },
      {
        id: 2,
        title: 'Conecta Timon',
        description: 'Portal único para acesso a todos os serviços digitais da prefeitura.',
        url: 'https://conecta.timon.ma.gov.br',
        icon: 'Link',
        category: 'digital',
        isActive: true,
        isFeatured: true,
        order: 2,
        accessCount: 1956,
        lastAccessed: new Date('2024-12-01'),
        requirements: ['CPF', 'Email válido'],
        availableHours: '24h por dia',
        contact: 'suporte@timon.ma.gov.br',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-11-25')
      },
      {
        id: 3,
        title: 'Protocolo Online',
        description: 'Abra protocolos e acompanhe processos administrativos pela internet.',
        url: 'https://protocolo.timon.ma.gov.br',
        icon: 'FileText',
        category: 'digital',
        isActive: true,
        isFeatured: true,
        order: 3,
        accessCount: 1534,
        lastAccessed: new Date('2024-11-30'),
        requirements: ['CPF', 'Documentos digitalizados'],
        availableHours: '24h por dia',
        contact: 'protocolo@timon.ma.gov.br',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-11-15')
      },
      {
        id: 4,
        title: 'Ouvidoria Municipal',
        description: 'Canal direto para denúncias, reclamações, sugestões e elogios.',
        url: 'https://ouvidoria.timon.ma.gov.br',
        icon: 'MessageSquare',
        category: 'digital',
        isActive: true,
        isFeatured: false,
        order: 4,
        accessCount: 892,
        lastAccessed: new Date('2024-11-29'),
        requirements: ['Nome completo', 'Email ou telefone'],
        availableHours: '24h por dia',
        contact: 'ouvidoria@timon.ma.gov.br',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-11-10')
      },
      {
        id: 5,
        title: 'Licenciamento e Alvarás',
        description: 'Solicite licenças comerciais e alvarás de funcionamento.',
        url: 'https://licenciamento.timon.ma.gov.br',
        icon: 'ShieldCheck',
        category: 'documento',
        isActive: true,
        isFeatured: true,
        order: 5,
        accessCount: 743,
        lastAccessed: new Date('2024-11-28'),
        requirements: ['CNPJ', 'Contrato social', 'Planta baixa'],
        availableHours: 'Segunda a sexta, 8h às 17h',
        contact: '(99) 3212-3458',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-11-05')
      },
      {
        id: 6,
        title: 'Nota Fiscal Eletrônica',
        description: 'Emissão de nota fiscal de serviços eletrônica para MEI e empresas.',
        url: 'https://nfse.timon.ma.gov.br',
        icon: 'Receipt',
        category: 'fiscal',
        isActive: true,
        isFeatured: false,
        order: 6,
        accessCount: 621,
        lastAccessed: new Date('2024-11-27'),
        requirements: ['CNPJ', 'Certificado digital'],
        availableHours: '24h por dia',
        contact: 'nfse@timon.ma.gov.br',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-10-30')
      },
      {
        id: 7,
        title: 'Agendamento de Atendimento',
        description: 'Agende seu atendimento presencial nas secretarias municipais.',
        url: 'https://agendamento.timon.ma.gov.br',
        icon: 'Calendar',
        category: 'presencial',
        isActive: true,
        isFeatured: false,
        order: 7,
        accessCount: 567,
        lastAccessed: new Date('2024-11-26'),
        requirements: ['CPF', 'Telefone'],
        availableHours: 'Segunda a sexta, 8h às 17h',
        contact: '(99) 3212-3459',
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-11-01')
      },
      {
        id: 8,
        title: 'Portal da Transparência',
        description: 'Acesse informações sobre gastos públicos, licitações e contratos.',
        url: 'https://transparencia.timon.ma.gov.br',
        icon: 'Eye',
        category: 'outros',
        isActive: true,
        isFeatured: false,
        order: 8,
        accessCount: 445,
        lastAccessed: new Date('2024-11-25'),
        availableHours: '24h por dia',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-10-25')
      }
    ];

    setServices(initialServices);
  }, []);

  const addService = (serviceData: ServiceFormData) => {
    const newService: Service = {
      ...serviceData,
      id: Date.now(),
      accessCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: number, updates: Partial<Service>) => {
    setServices(prev => prev.map(service => 
      service.id === id 
        ? { 
            ...service, 
            ...updates, 
            updatedAt: new Date()
          }
        : service
    ));
  };

  const deleteService = (id: number) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const toggleServiceStatus = (id: number) => {
    setServices(prev => prev.map(service =>
      service.id === id
        ? { ...service, isActive: !service.isActive, updatedAt: new Date() }
        : service
    ));
  };

  const toggleServiceFeatured = (id: number) => {
    setServices(prev => prev.map(service =>
      service.id === id
        ? { ...service, isFeatured: !service.isFeatured, updatedAt: new Date() }
        : service
    ));
  };

  const getServicesByCategory = (category: Service['category']) => {
    return services
      .filter(service => service.category === category && service.isActive)
      .sort((a, b) => a.order - b.order);
  };

  const getFeaturedServices = () => {
    return services
      .filter(service => service.isFeatured && service.isActive)
      .sort((a, b) => a.order - b.order);
  };

  const getPopularServices = () => {
    return services
      .filter(service => service.isActive)
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 6);
  };

  const incrementAccessCount = (id: number) => {
    setServices(prev => prev.map(service =>
      service.id === id
        ? { 
            ...service, 
            accessCount: service.accessCount + 1,
            lastAccessed: new Date(),
            updatedAt: new Date()
          }
        : service
    ));
  };

  const getCategoryLabel = (category: Service['category']) => {
    return categoryConfig[category].label;
  };

  const getCategoryColor = (category: Service['category']) => {
    return categoryConfig[category].color;
  };

  const getCategoryIcon = (category: Service['category']) => {
    return categoryConfig[category].icon;
  };

  const value: ServicesContextType = {
    services,
    addService,
    updateService,
    deleteService,
    toggleServiceStatus,
    toggleServiceFeatured,
    getServicesByCategory,
    getFeaturedServices,
    getPopularServices,
    incrementAccessCount,
    getCategoryLabel,
    getCategoryColor,
    getCategoryIcon
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}