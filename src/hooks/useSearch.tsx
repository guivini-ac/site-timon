import { useState, useEffect, useMemo } from 'react';
import { usePages } from '../components/PagesContext';
import { useForms } from '../components/FormsContext';
import { useServices } from '../components/ServicesContext';
import { useSecretarias } from '../components/SecretariasContext';
import { useCalendar } from '../components/CalendarContext';
import { useGallery } from '../components/GalleryContext';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'form' | 'service' | 'secretaria' | 'event' | 'gallery';
  url?: string;
  action?: () => void;
  icon?: string;
  category?: string;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  clearSearch: () => void;
}

export function useSearch(onNavigate?: (action: () => void) => void): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { customPages } = usePages();
  const { forms } = useForms();
  const { services } = useServices();
  const { secretarias } = useSecretarias();
  const { events } = useCalendar();
  const { images } = useGallery();

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 300);

    if (query.trim()) {
      setIsSearching(true);
      setShowResults(true);
    } else {
      setShowResults(false);
    }

    return () => clearTimeout(timer);
  }, [query]);

  // Resetar índice selecionado quando a query muda
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchTerm = query.toLowerCase().trim();
    const allResults: SearchResult[] = [];

    // Páginas do sistema
    const systemPages: SearchResult[] = [
      {
        id: 'home',
        title: 'Página Inicial',
        description: 'Página principal do site da Prefeitura',
        type: 'page',
        icon: '🏠',
        category: 'Navegação'
      },
      {
        id: 'news',
        title: 'Notícias',
        description: 'Últimas notícias e acontecimentos da cidade',
        type: 'page',
        icon: '📰',
        category: 'Navegação'
      },
      {
        id: 'agenda',
        title: 'Agenda',
        description: 'Eventos e compromissos oficiais',
        type: 'page',
        icon: '📅',
        category: 'Navegação'
      },
      {
        id: 'gallery',
        title: 'Galeria',
        description: 'Fotos e imagens da cidade',
        type: 'page',
        icon: '🖼️',
        category: 'Navegação'
      },
      {
        id: 'services',
        title: 'Serviços',
        description: 'Serviços oferecidos pela prefeitura',
        type: 'page',
        icon: '🏛️',
        category: 'Navegação'
      },
      {
        id: 'history',
        title: 'História',
        description: 'História da cidade de Timon',
        type: 'page',
        icon: '📜',
        category: 'Sobre a Cidade'
      },
      {
        id: 'mayor',
        title: 'Prefeito',
        description: 'Informações sobre o prefeito',
        type: 'page',
        icon: '👨‍💼',
        category: 'Governo'
      },
      {
        id: 'secretaries',
        title: 'Secretarias',
        description: 'Secretarias municipais',
        type: 'page',
        icon: '🏢',
        category: 'Governo'
      },
      {
        id: 'organogram',
        title: 'Organograma',
        description: 'Estrutura organizacional da prefeitura',
        type: 'page',
        icon: '📊',
        category: 'Governo'
      },
      {
        id: 'symbols',
        title: 'Símbolos Oficiais',
        description: 'Brasão, bandeira e hino da cidade',
        type: 'page',
        icon: '⭐',
        category: 'Sobre a Cidade'
      },
      {
        id: 'anthem',
        title: 'Hino Oficial',
        description: 'Hino oficial da cidade de Timon',
        type: 'page',
        icon: '🎵',
        category: 'Sobre a Cidade'
      },
      {
        id: 'general-data',
        title: 'Dados Gerais',
        description: 'Informações gerais sobre a cidade',
        type: 'page',
        icon: '📋',
        category: 'Sobre a Cidade'
      },
      {
        id: 'tourist-attractions',
        title: 'Pontos Turísticos',
        description: 'Principais atrações turísticas da cidade',
        type: 'page',
        icon: '🗺️',
        category: 'Turismo'
      }
    ];

    // Filtrar páginas do sistema
    systemPages.forEach(page => {
      if (
        page.title.toLowerCase().includes(searchTerm) ||
        page.description.toLowerCase().includes(searchTerm) ||
        page.category?.toLowerCase().includes(searchTerm)
      ) {
        allResults.push(page);
      }
    });

    // Páginas customizadas
    if (customPages) {
      customPages.forEach(page => {
        if (
          page.title.toLowerCase().includes(searchTerm) ||
          page.content.toLowerCase().includes(searchTerm)
        ) {
          allResults.push({
            id: `custom-${page.id}`,
            title: page.title,
            description: page.content.substring(0, 100) + '...',
            type: 'page',
            icon: '📄',
            category: 'Páginas Personalizadas'
          });
        }
      });
    }

    // Formulários
    if (forms) {
      forms.forEach(form => {
        if (
          form.title.toLowerCase().includes(searchTerm) ||
          form.description?.toLowerCase().includes(searchTerm) ||
          form.category?.toLowerCase().includes(searchTerm)
        ) {
          allResults.push({
            id: `form-${form.id}`,
            title: form.title,
            description: form.description || 'Formulário disponível para preenchimento',
            type: 'form',
            icon: '📝',
            category: 'Formulários'
          });
        }
      });
    }

    // Serviços
    if (services) {
      services.forEach(service => {
        if (
          service.title.toLowerCase().includes(searchTerm) ||
          service.description.toLowerCase().includes(searchTerm) ||
          service.category?.toLowerCase().includes(searchTerm)
        ) {
          allResults.push({
            id: `service-${service.id}`,
            title: service.title,
            description: service.description,
            type: 'service',
            icon: '⚙️',
            category: 'Serviços'
          });
        }
      });
    }

    // Secretarias
    if (secretarias) {
      secretarias.forEach(secretaria => {
        if (
          secretaria.name.toLowerCase().includes(searchTerm) ||
          secretaria.description?.toLowerCase().includes(searchTerm) ||
          secretaria.services?.some(s => s.toLowerCase().includes(searchTerm))
        ) {
          allResults.push({
            id: `secretaria-${secretaria.id}`,
            title: secretaria.name,
            description: secretaria.description || 'Secretaria municipal',
            type: 'secretaria',
            icon: '🏛️',
            category: 'Secretarias'
          });
        }
      });
    }

    // Eventos
    if (events) {
      events.forEach(event => {
        if (
          event.title.toLowerCase().includes(searchTerm) ||
          event.description?.toLowerCase().includes(searchTerm) ||
          event.location?.toLowerCase().includes(searchTerm)
        ) {
          allResults.push({
            id: `event-${event.id}`,
            title: event.title,
            description: event.description || `Evento em ${event.location || 'Local a definir'}`,
            type: 'event',
            icon: '📅',
            category: 'Eventos'
          });
        }
      });
    }

    // Imagens da galeria
    if (images) {
      images.forEach(image => {
        if (
          image.title?.toLowerCase().includes(searchTerm) ||
          image.description?.toLowerCase().includes(searchTerm) ||
          image.category?.toLowerCase().includes(searchTerm)
        ) {
          allResults.push({
            id: `gallery-${image.id}`,
            title: image.title || 'Imagem',
            description: image.description || 'Imagem da galeria',
            type: 'gallery',
            icon: '🖼️',
            category: 'Galeria'
          });
        }
      });
    }

    // Ordenar resultados por relevância
    return allResults
      .sort((a, b) => {
        // Priorizar correspondências exatas no título
        const aExactTitle = a.title.toLowerCase() === searchTerm;
        const bExactTitle = b.title.toLowerCase() === searchTerm;
        if (aExactTitle && !bExactTitle) return -1;
        if (!aExactTitle && bExactTitle) return 1;

        // Priorizar correspondências que começam com o termo
        const aStartsWith = a.title.toLowerCase().startsWith(searchTerm);
        const bStartsWith = b.title.toLowerCase().startsWith(searchTerm);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // Ordenar alfabeticamente
        return a.title.localeCompare(b.title);
      })
      .slice(0, 10); // Limitar a 10 resultados
  }, [query, customPages, forms, services, secretarias, events, images]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          const result = results[selectedIndex];
          if (result.action && onNavigate) {
            onNavigate(result.action);
          }
          clearSearch();
        }
        break;
      case 'Escape':
        e.preventDefault();
        clearSearch();
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
  };

  return {
    query,
    setQuery,
    results,
    isSearching,
    showResults,
    setShowResults,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    clearSearch
  };
}