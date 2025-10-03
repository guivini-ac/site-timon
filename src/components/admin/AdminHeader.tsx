import { 
  Search, 
  Bell, 
  Settings, 
  Menu,
  Home,
  ChevronRight,
  User,
  Shield,
  LogOut,
  Eye,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '../ui/dropdown-menu';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAdmin } from './AdminContext';
import { cn } from '../ui/utils';
import { useState, useMemo } from 'react';

interface AdminHeaderProps {
  onNavigateBack: () => void;
}

export function AdminHeader({ onNavigateBack }: AdminHeaderProps) {
  const { 
    currentView, 
    setCurrentView,
    sidebarOpen, 
    setSidebarOpen, 
    globalSearch, 
    setGlobalSearch,
    notifications,
    removeNotification,
    clearAllNotifications
  } = useAdmin();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const unreadNotifications = notifications.filter(n => !n.read);

  const viewLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    slides: 'Banners/Slides',
    posts: 'Notícias',
    pages: 'Páginas',
    agenda: 'Agenda Pública',
    services: 'Serviços',
    media: 'Biblioteca de Mídia',
    gallery: 'Galeria Pública',
    categories: 'Categorias',
    tags: 'Tags',
    menus: 'Menus',
    forms: 'Formulários',
    'form-submissions': 'Respostas de Formulários',
    users: 'Usuários',
    roles: 'Funções',
    permissions: 'Permissões',
    'my-permissions': 'Minhas Permissões',
    settings: 'Configurações',
    profile: 'Meu Perfil',
    seo: 'SEO',
    appearance: 'Aparência',
    integrations: 'Integrações',
    comments: 'Comentários'
  };

  const searchableViews = [
    { id: 'dashboard', label: 'Dashboard', description: 'Visão geral do sistema', keywords: ['inicio', 'principal', 'estatisticas'] },
    { id: 'slides', label: 'Banners/Slides', description: 'Gerencie os banners do carrossel principal', keywords: ['carrossel', 'banner', 'slide', 'imagem'] },
    { id: 'posts', label: 'Notícias', description: 'Crie e gerencie notícias e artigos', keywords: ['noticias', 'artigos', 'publicacoes', 'posts'] },
    { id: 'pages', label: 'Páginas', description: 'Gerencie páginas estáticas do site', keywords: ['paginas', 'conteudo', 'estaticas'] },
    { id: 'agenda', label: 'Agenda Pública', description: 'Gerencie eventos e compromissos públicos', keywords: ['eventos', 'calendario', 'compromissos', 'agenda'] },
    { id: 'services', label: 'Serviços', description: 'Configure os serviços mais utilizados', keywords: ['servicos', 'atendimento', 'publico'] },
    { id: 'media', label: 'Biblioteca de Mídia', description: 'Gerencie arquivos, imagens e documentos', keywords: ['arquivos', 'imagens', 'documentos', 'upload', 'midia'] },
    { id: 'gallery', label: 'Galeria Pública', description: 'Organize álbuns de fotos públicas', keywords: ['fotos', 'galeria', 'albuns', 'imagens'] },
    { id: 'categories', label: 'Categorias', description: 'Organize o conteúdo por categorias', keywords: ['categorias', 'organizacao', 'classificacao'] },
    { id: 'tags', label: 'Tags', description: 'Gerencie etiquetas de conteúdo', keywords: ['tags', 'etiquetas', 'marcadores'] },
    { id: 'menus', label: 'Menus', description: 'Configure a estrutura de navegação', keywords: ['menu', 'navegacao', 'links'] },
    { id: 'forms', label: 'Formulários', description: 'Crie e gerencie formulários', keywords: ['formularios', 'forms', 'campos'] },
    { id: 'form-submissions', label: 'Respostas de Formulários', description: 'Visualize respostas dos formulários', keywords: ['respostas', 'submissoes', 'formularios'] },
    { id: 'users', label: 'Usuários', description: 'Gerencie usuários do sistema', keywords: ['usuarios', 'pessoas', 'accounts'] },
    { id: 'roles', label: 'Funções', description: 'Configure funções e cargos', keywords: ['funcoes', 'cargos', 'roles'] },
    { id: 'permissions', label: 'Permissões', description: 'Controle de acesso e permissões', keywords: ['permissoes', 'acesso', 'seguranca'] },
    { id: 'my-permissions', label: 'Minhas Permissões', description: 'Visualize suas permissões', keywords: ['minhas', 'permissoes', 'acesso'] },
    { id: 'settings', label: 'Configurações', description: 'Configurações gerais do sistema', keywords: ['configuracoes', 'opcoes', 'ajustes'] },
    { id: 'profile', label: 'Gerencie suas informações pessoais e configurações de conta', description: 'Gerencie suas informações pessoais e configurações de conta', keywords: ['perfil', 'informacoes', 'conta'] },
    { id: 'seo', label: 'SEO', description: 'Otimização para mecanismos de busca', keywords: ['seo', 'otimizacao', 'busca', 'google'] },
    { id: 'appearance', label: 'Aparência', description: 'Personalize a aparência do site', keywords: ['aparencia', 'tema', 'cores', 'design'] },
    { id: 'integrations', label: 'Integrações', description: 'Configure APIs e integrações externas', keywords: ['integracoes', 'api', 'externos'] },
    { id: 'comments', label: 'Comentários', description: 'Gerencie comentários', keywords: ['comentarios', 'feedback', 'interacao'] }
  ];

  const filteredViews = useMemo(() => {
    if (!globalSearch.trim()) return [];
    
    const searchTerm = globalSearch.toLowerCase().trim();
    
    return searchableViews.filter(view => {
      return (
        view.label.toLowerCase().includes(searchTerm) ||
        view.description.toLowerCase().includes(searchTerm) ||
        view.keywords.some(keyword => keyword.includes(searchTerm)) ||
        view.id.includes(searchTerm)
      );
    }).slice(0, 6); // Limita a 6 resultados
  }, [globalSearch]);

  const handleSearchSelect = (viewId: string) => {
    setCurrentView(viewId as any);
    setGlobalSearch('');
    setSearchOpen(false);
  };

  const handleSearchClear = () => {
    setGlobalSearch('');
    setSearchOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchOpen || filteredViews.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredViews.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredViews.length) {
          handleSearchSelect(filteredViews[selectedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleSearchClear();
        break;
    }
  };

  const currentViewLabel = viewLabels[currentView] || 'Página';

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  return (
    <header className="bg-background border-b border-border">
      {/* Cabeçalho Principal */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Lado Esquerdo */}
        <div className="flex items-center space-x-4">
          {/* Botão do Menu Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Título da Página */}
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {currentViewLabel}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentView === 'dashboard' && 'Visão geral do sistema'}
              {currentView === 'slides' && 'Gerencie os banners do carrossel principal'}
              {currentView === 'posts' && 'Crie e gerencie notícias e artigos'}
              {currentView === 'pages' && 'Gerencie páginas estáticas do site'}
              {currentView === 'agenda' && 'Gerencie eventos e compromissos públicos'}
              {currentView === 'services' && 'Configure os serviços mais utilizados'}
              {currentView === 'media' && 'Gerencie arquivos, imagens e documentos'}
              {currentView === 'gallery' && 'Organize álbuns de fotos públicas'}
              {currentView === 'categories' && 'Organize o conteúdo por categorias'}
              {currentView === 'tags' && 'Gerencie etiquetas de conteúdo'}
              {currentView === 'menus' && 'Configure a estrutura de navegação'}
              {currentView === 'forms' && 'Crie e gerencie formulários'}
              {currentView === 'form-submissions' && 'Visualize respostas dos formulários'}
              {currentView === 'users' && 'Gerencie usuários do sistema'}
              {currentView === 'roles' && 'Configure funções e cargos'}
              {currentView === 'permissions' && 'Controle de acesso e permissões'}
              {currentView === 'my-permissions' && 'Visualize suas permissões'}
              {currentView === 'settings' && 'Configurações gerais do sistema'}
              {currentView === 'profile' && 'Gerencie suas informações pessoais e configurações de conta'}
              {currentView === 'seo' && 'Otimização para mecanismos de busca'}
              {currentView === 'appearance' && 'Personalize a aparência do site'}
              {currentView === 'integrations' && 'Configure APIs e integrações externas'}
            </p>
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('dashboard')}
                className="h-6 px-2 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-3 w-3 mr-1" />
                Dashboard
              </Button>
              {currentView !== 'dashboard' && (
                <>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {currentViewLabel}
                  </span>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Lado Direito */}
        <div className="flex items-center space-x-3">
          {/* Busca Global */}
          <div className="relative hidden md:block">
            <Popover open={searchOpen && (globalSearch.trim() !== '' || filteredViews.length > 0)} onOpenChange={setSearchOpen}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar seções do sistema..."
                  value={globalSearch}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    setSearchOpen(true);
                    setSelectedIndex(-1);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={handleKeyDown}
                  className="w-80 pl-10 pr-10"
                />
                {globalSearch && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSearchClear}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <PopoverContent 
                className="w-80 p-0" 
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                {filteredViews.length > 0 ? (
                  <ScrollArea className="max-h-80">
                    <div className="p-2">
                      {filteredViews.map((view, index) => (
                        <Button
                          key={view.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start p-3 h-auto text-left",
                            selectedIndex === index && "bg-accent"
                          )}
                          onClick={() => handleSearchSelect(view.id)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{view.label}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {view.description}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                ) : globalSearch.trim() !== '' ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Nenhuma seção encontrada para "{globalSearch}"
                  </div>
                ) : null}
                
                {filteredViews.length > 0 && (
                  <>
                    <Separator />
                    <div className="p-2 text-xs text-muted-foreground text-center">
                      Use as setas ↑↓ para navegar e Enter para selecionar
                    </div>
                  </>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Busca Mobile */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Search className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar seções do sistema..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {filteredViews.length > 0 && (
                  <ScrollArea className="max-h-60">
                    <div className="space-y-1">
                      {filteredViews.map((view) => (
                        <Button
                          key={view.id}
                          variant="ghost"
                          className="w-full justify-start p-3 h-auto text-left"
                          onClick={() => handleSearchSelect(view.id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-sm">{view.label}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {view.description}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                )}
                
                {globalSearch.trim() !== '' && filteredViews.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Nenhuma seção encontrada
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Notificações */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadNotifications.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Notificações</h3>
                {notifications.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllNotifications}
                    className="text-xs"
                  >
                    Limpar todas
                  </Button>
                )}
              </div>
              
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Nenhuma notificação
                </p>
              ) : (
                <ScrollArea className="max-h-96">
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 rounded-lg border transition-colors cursor-pointer",
                          notification.read 
                            ? "bg-muted/30 border-border" 
                            : "bg-background border-border shadow-sm"
                        )}
                        onClick={() => removeNotification(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={
                                  notification.type === 'error' ? 'destructive' :
                                  notification.type === 'warning' ? 'outline' :
                                  notification.type === 'success' ? 'default' : 'secondary'
                                }
                                className="text-xs"
                              >
                                {notification.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                            <h4 className="font-medium text-sm mt-1 truncate">
                              {notification.title}
                            </h4>
                            {notification.message && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </PopoverContent>
          </Popover>

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 p-0 focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">Administrador</p>
                  <p className="text-xs text-muted-foreground">admin@timon.ma.gov.br</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => setCurrentView('profile')}
                className="cursor-pointer"
              >
                <User className="h-4 w-4 mr-2" />
                Meu Perfil
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => setCurrentView('my-permissions')}
                className="cursor-pointer"
              >
                <Shield className="h-4 w-4 mr-2" />
                Minhas Permissões
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={onNavigateBack}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}