import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, ChevronDown, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAccessibility } from './AccessibilityContext';
import { usePages } from './PagesContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSearch, SearchResult } from '../hooks/useSearch';
import SearchResults from './SearchResults';

// Componente para logo dinâmica do header
const HeaderLogo = ({ onNavigateToHome }: { onNavigateToHome?: () => void }) => {
  const [logoUrl, setLogoUrl] = useState('https://i.ibb.co/kgXRL9pT/PREFEITURA-HORIZONTAL-PADRA-O-COR.pngs');

  useEffect(() => {
    // Carregar logo das configurações de aparência
    const loadLogoFromConfig = () => {
      const savedConfig = localStorage.getItem('timon-appearance-config');
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          if (config.headerLogoUrl) {
            setLogoUrl(config.headerLogoUrl);
          }
        } catch (error) {
          console.error('Erro ao carregar logo do header:', error);
        }
      }
    };

    loadLogoFromConfig();

    // Escutar mudanças nas configurações
    const handleConfigUpdate = (event: CustomEvent) => {
      if (event.detail.headerLogoUrl) {
        setLogoUrl(event.detail.headerLogoUrl);
      }
    };

    const handleConfigReset = () => {
      setLogoUrl('https://i.ibb.co/kgXRL9pT/PREFEITURA-HORIZONTAL-PADRA-O-COR.pngs');
    };

    window.addEventListener('appearanceConfigUpdated', handleConfigUpdate as EventListener);
    window.addEventListener('appearanceConfigReset', handleConfigReset);

    return () => {
      window.removeEventListener('appearanceConfigUpdated', handleConfigUpdate as EventListener);
      window.removeEventListener('appearanceConfigReset', handleConfigReset);
    };
  }, []);

  return (
    <button
      onClick={onNavigateToHome}
      className="focus:outline-none focus:ring-2 focus:ring-[#144c9c] rounded-lg transition-all duration-300"
      aria-label="Ir para página inicial"
      type="button"
    >
      <img
        src={logoUrl}
        alt="Logo oficial da Prefeitura Municipal de Timon"
        className="h-20 w-auto object-contain max-w-none cursor-pointer"
      />
    </button>
  );
};

interface HeaderProps {
  currentPage?: string;
  onNavigateToHome?: () => void;
  onNavigateToGallery?: () => void;
  onNavigateToAgenda?: () => void;
  onNavigateToNews?: () => void;
  onNavigateToHistory?: () => void;
  onNavigateToMayor?: () => void;
  onNavigateToSecretaries?: () => void;
  onNavigateToOrganogram?: () => void;
  onNavigateToAnthem?: () => void;
  onNavigateToSymbols?: () => void;
  onNavigateToGeneralData?: () => void;
  onNavigateToTouristAttractions?: () => void;
  onNavigateToCustomPage?: (slug: string) => void;
}

const Header = ({ 
  currentPage = 'home',
  onNavigateToHome,
  onNavigateToGallery, 
  onNavigateToAgenda, 
  onNavigateToNews,
  onNavigateToHistory,
  onNavigateToMayor,
  onNavigateToSecretaries,
  onNavigateToOrganogram,
  onNavigateToAnthem,
  onNavigateToSymbols,
  onNavigateToGeneralData,
  onNavigateToTouristAttractions,
  onNavigateToCustomPage
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [clickedDropdown, setClickedDropdown] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { announceToScreenReader } = useAccessibility();
  const { getMenuPages } = usePages();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Hook de busca
  const {
    query,
    setQuery,
    results,
    isSearching,
    showResults,
    setShowResults,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown: handleSearchKeyDown,
    clearSearch
  } = useSearch((action) => action());

  // Hook de busca mobile
  const {
    query: mobileQuery,
    setQuery: setMobileQuery,
    results: mobileResults,
    isSearching: mobileIsSearching,
    showResults: mobileShowResults,
    setShowResults: setMobileShowResults,
    selectedIndex: mobileSelectedIndex,
    setSelectedIndex: setMobileSelectedIndex,
    handleKeyDown: handleMobileSearchKeyDown,
    clearSearch: clearMobileSearch
  } = useSearch((action) => action());

  // Detectar scroll para animações
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[role="menubar"]')) {
        setActiveDropdown(null);
        setClickedDropdown(null);
      }
      
      // Fechar resultados de busca quando clicar fora
      if (searchRef.current && !searchRef.current.contains(target as Node)) {
        setShowResults(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target as Node)) {
        setMobileShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setShowResults, setMobileShowResults]);

  // Funções para navegação dos resultados de busca
  const handleSearchResultClick = (result: SearchResult) => {
    // Mapear tipos para ações de navegação
    switch (result.type) {
      case 'page':
        if (result.id === 'home' && onNavigateToHome) onNavigateToHome();
        else if (result.id === 'news' && onNavigateToNews) onNavigateToNews();
        else if (result.id === 'agenda' && onNavigateToAgenda) onNavigateToAgenda();
        else if (result.id === 'gallery' && onNavigateToGallery) onNavigateToGallery();
        else if (result.id === 'history' && onNavigateToHistory) onNavigateToHistory();
        else if (result.id === 'mayor' && onNavigateToMayor) onNavigateToMayor();
        else if (result.id === 'secretaries' && onNavigateToSecretaries) onNavigateToSecretaries();
        else if (result.id === 'organogram' && onNavigateToOrganogram) onNavigateToOrganogram();
        else if (result.id === 'symbols' && onNavigateToSymbols) onNavigateToSymbols();
        else if (result.id === 'anthem' && onNavigateToAnthem) onNavigateToAnthem();
        else if (result.id === 'general-data' && onNavigateToGeneralData) onNavigateToGeneralData();
        else if (result.id === 'tourist-attractions' && onNavigateToTouristAttractions) onNavigateToTouristAttractions();
        else if (result.id.startsWith('custom-') && onNavigateToCustomPage) {
          const pageId = result.id.replace('custom-', '');
          const customPage = customMenuPages.find(p => p.id === pageId);
          if (customPage) onNavigateToCustomPage(customPage.slug);
        }
        break;
      case 'form':
        // Navegar para página de formulários ou formulário específico
        announceToScreenReader(`Abrindo formulário: ${result.title}`);
        break;
      case 'service':
        // Navegar para página de serviços ou serviço específico
        announceToScreenReader(`Abrindo serviço: ${result.title}`);
        break;
      case 'secretaria':
        if (onNavigateToSecretaries) onNavigateToSecretaries();
        break;
      case 'event':
        if (onNavigateToAgenda) onNavigateToAgenda();
        break;
      case 'gallery':
        if (onNavigateToGallery) onNavigateToGallery();
        break;
    }
    
    clearSearch();
    announceToScreenReader(`Navegando para: ${result.title}`);
  };

  const handleMobileSearchResultClick = (result: SearchResult) => {
    handleSearchResultClick(result);
    clearMobileSearch();
  };

  // Obter páginas customizadas para o menu
  const customMenuPages = getMenuPages();

  const menuItems = [
    {
      title: 'Prefeitura',
      items: [
        { title: 'História do Município', action: onNavigateToHistory }, 
        { title: 'Prefeito e Vice-prefeito', action: onNavigateToMayor }, 
        { title: 'Secretarias', action: onNavigateToSecretaries }, 
        { title: 'Organograma', action: onNavigateToOrganogram }, 
        { title: 'Hino Municipal', action: onNavigateToAnthem }, 
        { title: 'Símbolos Oficiais', action: onNavigateToSymbols },
        // Apenas páginas customizadas marcadas para aparecer no menu e do tipo 'institutional'
        ...customMenuPages
          .filter(page => page.pageType === 'institutional' && page.showInMenu)
          .map(page => ({
            title: page.title,
            action: () => onNavigateToCustomPage?.(page.slug)
          }))
      ],
      action: null
    },
    {
      title: 'Serviços',
      items: [
        'Conecta Timon', 
        'Protocolo Online', 
        'Consulta de Processos', 
        'IPTU Online', 
        'Licenciamento', 
        'Ouvidoria',
        // Apenas páginas customizadas marcadas para aparecer no menu e relacionadas a serviços
        ...customMenuPages
          .filter(page => page.showInMenu && page.pageType === 'standard' && 
                         (page.title.toLowerCase().includes('serviço') || 
                          page.title.toLowerCase().includes('download') ||
                          page.slug.includes('servico')))
          .map(page => ({
            title: page.title,
            action: () => onNavigateToCustomPage?.(page.slug)
          }))
      ],
      action: null
    },
    {
      title: 'Transparência',
      items: [
        'Portal da Transparência', 
        'Diário Oficial', 
        'Licitações e Contratos', 
        'Lei de Acesso à Informação', 
        'Prestação de Contas', 
        'Receitas e Despesas'
      ],
      action: null
    },
    {
      title: 'Sobre a cidade',
      items: [
        { title: 'Dados Gerais', action: onNavigateToGeneralData }, 
        { title: 'Pontos Turísticos', action: onNavigateToTouristAttractions }, 
        'Eventos',
        // Apenas páginas customizadas marcadas para aparecer no menu e sobre a cidade
        ...customMenuPages
          .filter(page => page.showInMenu && 
                         (page.title.toLowerCase().includes('sobre') ||
                          page.title.toLowerCase().includes('cidade') ||
                          page.slug.includes('sobre')))
          .map(page => ({
            title: page.title,
            action: () => onNavigateToCustomPage?.(page.slug)
          }))
      ],
      action: null
    },
    {
      title: 'Galeria',
      items: [
        'Fotos por Categoria', 
        'Vídeos Institucionais', 
        'Transmissões ao Vivo', 
        'Arquivo Histórico'
      ],
      action: onNavigateToGallery
    }
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    announceToScreenReader(
      isMenuOpen ? 'Menu principal fechado' : 'Menu principal aberto'
    );
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    announceToScreenReader(
      isSearchOpen ? 'Campo de busca fechado' : 'Campo de busca aberto'
    );
  };

  const handleDropdownToggle = (index: number) => {
    const isCurrentlyActive = activeDropdown === index;
    setActiveDropdown(isCurrentlyActive ? null : index);
    setClickedDropdown(isCurrentlyActive ? null : index);
    const item = menuItems[index];
    announceToScreenReader(
      `Submenu ${item.title} ${isCurrentlyActive ? 'fechado' : 'aberto'}`
    );
  };

  const handleMouseEnter = (index: number) => {
    // Se não há dropdown clicado, ou se o hover é no item clicado, mostra o dropdown
    if (clickedDropdown === null || clickedDropdown === index) {
      setActiveDropdown(index);
    }
  };

  const handleMouseLeave = (index: number) => {
    // Se não há dropdown clicado, ou se estamos saindo do item clicado, esconde o dropdown
    if (clickedDropdown === null || clickedDropdown === index) {
      setActiveDropdown(null);
    }
  };

  const handleOutsideClick = () => {
    setActiveDropdown(null);
    setClickedDropdown(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <header 
      className={`bg-white border-b sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'shadow-lg backdrop-blur-md bg-white/95' 
          : 'shadow-sm'
      }`}
      role="banner"
      aria-label="Cabeçalho do site da Prefeitura de Timon"
    >
      {/* Header Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div 
              className={`h-24 flex items-center justify-center transition-all duration-300 hover-scale ${
                scrolled ? 'transform scale-95' : ''
              }`}
            >
              <HeaderLogo onNavigateToHome={onNavigateToHome} />
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center flex-1 justify-center"
            role="navigation"
            aria-label="Menu principal"
          >
            <ul className="flex items-center space-x-6" role="menubar">
              {menuItems.map((item, index) => (
                <li key={index} className="relative" role="none">
                  {item.action ? (
                    <button
                      className="nav-item text-gray-700 hover:text-[#144c9c] px-3 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#144c9c] whitespace-nowrap font-bold"
                      onClick={item.action}
                      role="menuitem"
                      aria-label={`Ir para ${item.title}`}
                    >
                      {item.title}
                    </button>
                  ) : (
                    <div 
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => handleMouseLeave(index)}
                    >
                      <button
                        className="nav-item text-gray-700 hover:text-[#144c9c] px-3 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#144c9c] flex items-center whitespace-nowrap font-bold"
                        onClick={() => handleDropdownToggle(index)}
                        onKeyDown={(e) => handleKeyDown(e, () => handleDropdownToggle(index))}
                        aria-expanded={activeDropdown === index}
                        aria-haspopup="true"
                        aria-controls={`dropdown-${index}`}
                        role="menuitem"
                      >
                        {item.title}
                        <ChevronDown 
                          className={`ml-1 h-4 w-4 transition-transform ${
                            activeDropdown === index ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      <div 
                        id={`dropdown-${index}`}
                        className={`absolute top-full left-0 mt-2 w-64 bg-white shadow-xl rounded-lg z-50 border border-gray-100 backdrop-blur-md transition-all duration-300 transform ${
                          activeDropdown === index 
                            ? 'opacity-100 visible translate-y-0 scale-100' 
                            : 'opacity-0 invisible translate-y-[-10px] scale-95'
                        }`}
                        role="menu"
                        aria-labelledby={`menu-button-${index}`}
                      >
                        <ul className="py-2" role="none">
                          {item.items.map((subitem, subindex) => (
                            <li key={subindex} role="none">
                              {typeof subitem === 'object' && subitem.action ? (
                                <button
                                  onClick={subitem.action}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#144c9c]/10 hover:text-[#144c9c] transition-colors focus:outline-none focus:bg-[#144c9c]/10 focus:text-[#144c9c]"
                                  role="menuitem"
                                  tabIndex={activeDropdown === index ? 0 : -1}
                                  aria-label={`Ir para ${subitem.title}`}
                                >
                                  {subitem.title}
                                </button>
                              ) : (
                                <a
                                  href="#"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#144c9c]/10 hover:text-[#144c9c] transition-colors focus:outline-none focus:bg-[#144c9c]/10 focus:text-[#144c9c]"
                                  role="menuitem"
                                  tabIndex={activeDropdown === index ? 0 : -1}
                                  aria-label={`Ir para ${typeof subitem === 'string' ? subitem : subitem.title}`}
                                >
                                  {typeof subitem === 'string' ? subitem : subitem.title}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="hidden sm:block" ref={searchRef}>
              <div className="relative">
                <label htmlFor="desktop-search" className="sr-only">
                  Buscar no site
                </label>
                <Input
                  id="desktop-search"
                  type="text"
                  placeholder="Buscar no site..."
                  className="w-64 pl-10 pr-4"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => setShowResults(true)}
                  aria-describedby="search-description"
                  autoComplete="off"
                />
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
                  aria-hidden="true"
                />
                <div id="search-description" className="sr-only">
                  Digite para buscar informações no site da Prefeitura
                </div>
                
                {/* Resultados da busca desktop */}
                {showResults && (
                  <SearchResults
                    results={results}
                    isSearching={isSearching}
                    selectedIndex={selectedIndex}
                    onResultClick={handleSearchResultClick}
                    onMouseEnter={setSelectedIndex}
                    query={query}
                  />
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={handleSearchToggle}
              aria-label={isSearchOpen ? 'Fechar busca' : 'Abrir busca'}
              aria-expanded={isSearchOpen}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={handleMenuToggle}
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="sm:hidden pb-4" ref={mobileSearchRef}>
            <div className="relative">
              <label htmlFor="mobile-search" className="sr-only">
                Buscar no site
              </label>
              <Input 
                id="mobile-search"
                type="text" 
                placeholder="Buscar no site..." 
                className="w-full"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                onKeyDown={handleMobileSearchKeyDown}
                onFocus={() => setMobileShowResults(true)}
                aria-describedby="mobile-search-description"
                autoComplete="off"
              />
              <div id="mobile-search-description" className="sr-only">
                Digite para buscar informações no site da Prefeitura
              </div>
              
              {/* Resultados da busca mobile */}
              {mobileShowResults && (
                <SearchResults
                  results={mobileResults}
                  isSearching={mobileIsSearching}
                  selectedIndex={mobileSelectedIndex}
                  onResultClick={handleMobileSearchResultClick}
                  onMouseEnter={setMobileSelectedIndex}
                  query={mobileQuery}
                />
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="lg:hidden border-t bg-white animate-fade-in-down"
            role="navigation"
            aria-label="Menu principal móvel"
          >
            <div className="py-4 space-y-4">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.action ? (
                    <button
                      className="font-medium text-gray-900 px-4 py-2 w-full text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 rounded-md whitespace-nowrap"
                      onClick={item.action}
                      aria-label={`Ir para ${item.title}`}
                    >
                      {item.title}
                    </button>
                  ) : (
                    <>
                      <button
                        className="font-medium text-gray-900 px-4 py-2 w-full text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 rounded-md flex items-center justify-between whitespace-nowrap"
                        onClick={() => handleDropdownToggle(index)}
                        aria-expanded={activeDropdown === index}
                        aria-controls={`mobile-dropdown-${index}`}
                      >
                        {item.title}
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform ${
                            activeDropdown === index ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {activeDropdown === index && (
                        <div 
                          id={`mobile-dropdown-${index}`}
                          className="space-y-1 ml-4"
                        >
                          {item.items.map((subitem, subindex) => (
                            <div key={subindex}>
                              {typeof subitem === 'object' && subitem.action ? (
                                <button
                                  onClick={subitem.action}
                                  className="block w-full text-left px-8 py-2 text-sm text-gray-600 hover:text-[#144c9c] hover:bg-gray-50 transition-colors rounded-md focus:outline-none focus:bg-gray-50 focus:text-[#144c9c]"
                                  aria-label={`Ir para ${subitem.title}`}
                                >
                                  {subitem.title}
                                </button>
                              ) : (
                                <a
                                  href="#"
                                  className="block px-8 py-2 text-sm text-gray-600 hover:text-[#144c9c] hover:bg-gray-50 transition-colors rounded-md focus:outline-none focus:bg-gray-50 focus:text-[#144c9c]"
                                  aria-label={`Ir para ${typeof subitem === 'string' ? subitem : subitem.title}`}
                                >
                                  {typeof subitem === 'string' ? subitem : subitem.title}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Social Media Links - Mobile */}
            <div className="border-t px-4 py-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Redes Sociais</h3>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://facebook.com/prefeiturademon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#144c9c] hover:text-[#0d3b7a] transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#144c9c]"
                  aria-label="Facebook da Prefeitura de Timon - abre em nova janela"
                >
                  <Facebook className="h-5 w-5" aria-hidden="true" />
                </a>
                <a 
                  href="https://instagram.com/prefeiturademon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label="Instagram da Prefeitura de Timon - abre em nova janela"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
                <a 
                  href="https://youtube.com/prefeiturademon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="YouTube da Prefeitura de Timon - abre em nova janela"
                >
                  <Youtube className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Social Media Bar */}
      <div className="hidden lg:block bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Acompanhe nossas redes sociais:</span>
              <div className="flex items-center space-x-2">
                <a 
                  href="https://facebook.com/prefeiturademon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#144c9c] hover:text-[#0d3b7a] transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#144c9c]"
                  aria-label="Facebook da Prefeitura de Timon - abre em nova janela"
                >
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                </a>
                <a 
                  href="https://instagram.com/prefeiturademon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label="Instagram da Prefeitura de Timon - abre em nova janela"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                </a>
                <a 
                  href="https://youtube.com/prefeiturademon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-800 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="YouTube da Prefeitura de Timon - abre em nova janela"
                >
                  <Youtube className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Transparência:</span>
              <a 
                href="https://transparencia.timon.ma.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#144c9c] hover:text-[#0d3b7a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#144c9c] rounded px-2 py-1"
                aria-label="Portal da Transparência - abre em nova janela"
              >
                Portal da Transparência
                <ExternalLink className="inline h-3 w-3 ml-1" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;