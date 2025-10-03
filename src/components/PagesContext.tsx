import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CustomPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'published' | 'draft' | 'archived';
  isVisible: boolean;
  showInMenu: boolean;
  menuOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  pageType: 'standard' | 'landing' | 'institutional';
  parentPageId?: number;
  template: 'default' | 'fullwidth' | 'sidebar';
}

interface PagesContextType {
  pages: CustomPage[];
  addPage: (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: number, page: Partial<CustomPage>) => void;
  deletePage: (id: number) => void;
  togglePageStatus: (id: number) => void;
  togglePageVisibility: (id: number) => void;
  reorderPages: (pages: CustomPage[]) => void;
  getPageBySlug: (slug: string) => CustomPage | undefined;
  getPublishedPages: () => CustomPage[];
  getMenuPages: () => CustomPage[];
}

const PagesContext = createContext<PagesContextType | undefined>(undefined);

export function PagesProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(false);

  // Inicializar com apenas páginas customizadas (não-base)
  useEffect(() => {
    const initializePages = async () => {
      try {
        setLoading(true);
        
        // Try to load from API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
          // Uncomment this when API is working properly
          // const response = await fetch('/api/pages', { 
          //   signal: controller.signal 
          // });
          // const apiPages = await response.json();
          // setPages(apiPages);
        } catch (error) {
          console.warn('Failed to load pages from API, using fallback data:', error);
          // Use fallback data
          const initialPages: CustomPage[] = [
            {
              id: 1,
              title: 'Teste',
              slug: 'teste',
              content: `
                <h2>Página de Teste</h2>
                <p>Esta é uma página de teste para demonstrar o sistema de páginas customizadas da Prefeitura Municipal de Timon.</p>
                
                <h3>Funcionalidades Testadas</h3>
                <ul>
                  <li>Criação de páginas customizadas</li>
                  <li>Sistema de templates responsivos</li>
                  <li>Gerenciamento de conteúdo via painel administrativo</li>
                  <li>Integração com o menu principal do site</li>
                </ul>
                
                <h3>Próximos Passos</h3>
                <p>Esta página serve como exemplo de como criar conteúdos personalizados que complementam as funcionalidades base do site da prefeitura.</p>
                
                <p>Através do painel administrativo, é possível:</p>
                <ul>
                  <li>Editar o conteúdo desta página</li>
                  <li>Alterar configurações de visibilidade</li>
                  <li>Modificar o template de exibição</li>
                  <li>Gerenciar informações de SEO</li>
                </ul>
              `,
              excerpt: 'Página de teste para demonstrar as funcionalidades do sistema de páginas customizadas',
              status: 'published',
              isVisible: true,
              showInMenu: false,
              menuOrder: 999,
              seoTitle: 'Página de Teste - Prefeitura Municipal de Timon',
              seoDescription: 'Página de teste para demonstrar o sistema de páginas customizadas da Prefeitura de Timon.',
              coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
              createdAt: new Date('2024-12-01'),
              updatedAt: new Date('2024-12-01'),
              author: 'Sistema Administrativo',
              pageType: 'standard',
              template: 'default'
            }
          ];

          setPages(initialPages);
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('Error initializing pages:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePages();
  }, []);

  const addPage = (pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPage: CustomPage = {
      ...pageData,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPages(prev => [...prev, newPage]);
  };

  const updatePage = (id: number, updates: Partial<CustomPage>) => {
    setPages(prev => prev.map(page => 
      page.id === id 
        ? { ...page, ...updates, updatedAt: new Date() }
        : page
    ));
  };

  const deletePage = (id: number) => {
    setPages(prev => prev.filter(page => page.id !== id));
  };

  const togglePageStatus = (id: number) => {
    setPages(prev => prev.map(page => 
      page.id === id 
        ? { 
            ...page, 
            status: page.status === 'published' ? 'draft' : 'published',
            updatedAt: new Date()
          }
        : page
    ));
  };

  const togglePageVisibility = (id: number) => {
    setPages(prev => prev.map(page => 
      page.id === id 
        ? { 
            ...page, 
            isVisible: !page.isVisible,
            updatedAt: new Date()
          }
        : page
    ));
  };

  const reorderPages = (reorderedPages: CustomPage[]) => {
    setPages(reorderedPages);
  };

  const getPageBySlug = (slug: string) => {
    return pages.find(page => page.slug === slug && page.status === 'published' && page.isVisible);
  };

  const getPublishedPages = () => {
    return pages.filter(page => page.status === 'published' && page.isVisible);
  };

  const getMenuPages = () => {
    return pages
      .filter(page => page.status === 'published' && page.isVisible && page.showInMenu)
      .sort((a, b) => a.menuOrder - b.menuOrder);
  };

  const value: PagesContextType = {
    pages,
    addPage,
    updatePage,
    deletePage,
    togglePageStatus,
    togglePageVisibility,
    reorderPages,
    getPageBySlug,
    getPublishedPages,
    getMenuPages
  };

  return (
    <PagesContext.Provider value={value}>
      {children}
    </PagesContext.Provider>
  );
}

export function usePages() {
  const context = useContext(PagesContext);
  if (context === undefined) {
    throw new Error('usePages must be used within a PagesProvider');
  }
  return context;
}