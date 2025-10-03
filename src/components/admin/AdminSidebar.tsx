import { 
  LayoutDashboard, 
  FileImage, 
  FileText, 
  Calendar, 
  Settings,
  Users,
  Upload,
  Image,
  FolderOpen,
  Tags,
  Shield,
  Search,
  ExternalLink,
  MessageSquare,
  ChevronLeft,
  LogOut,
  Home,
  Eye,
  Palette,
  Grid,
  FormInput,
  Building2,
  MapPin
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useAdmin, type AdminView } from './AdminContext';
import { cn } from '../ui/utils';

interface AdminSidebarProps {
  onLogout: () => void;
}

interface NavItem {
  id: AdminView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  description?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const { 
    currentView, 
    setCurrentView, 
    sidebarOpen, 
    setSidebarOpen, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    mockData 
  } = useAdmin();

  const navSections: NavSection[] = [
    {
      title: 'Principal',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          description: 'Visão geral do sistema'
        }
      ]
    },
    {
      title: 'Conteúdo',
      items: [
        {
          id: 'slides',
          label: 'Banners/Slides',
          icon: FileImage,
          description: 'Gerenciar slides do carrossel principal'
        },
        {
          id: 'posts',
          label: 'Notícias',
          icon: FileText,
          badge: mockData.recentPosts.filter(p => p.status === 'draft').length || undefined,
          description: 'Criar e gerenciar notícias'
        },
        {
          id: 'pages',
          label: 'Páginas',
          icon: FolderOpen,
          description: 'Páginas estáticas do site'
        },
        {
          id: 'events',
          label: 'Eventos',
          icon: Calendar,
          description: 'Calendário de eventos públicos'
        },
        {
          id: 'services',
          label: 'Serviços',
          icon: Grid,
          description: 'Serviços mais utilizados'
        },
        {
          id: 'secretarias',
          label: 'Secretarias',
          icon: Building2,
          description: 'Secretários e secretarias municipais'
        },
        {
          id: 'tourist-attractions',
          label: 'Pontos Turísticos',
          icon: MapPin,
          description: 'Gerenciar atrações turísticas da cidade'
        },
        {
          id: 'gallery',
          label: 'Galeria Pública',
          icon: Image,
          description: 'Álbuns de fotos públicas'
        }
      ]
    },
    {
      title: 'Mídia',
      items: [
        {
          id: 'media',
          label: 'Biblioteca de Mídia',
          icon: Upload,
          description: 'Gerenciar arquivos e imagens'
        }
      ]
    },
    {
      title: 'Organização',
      items: [
        {
          id: 'categories',
          label: 'Categorias',
          icon: Tags,
          description: 'Categorias de conteúdo'
        },
        {
          id: 'tags',
          label: 'Tags',
          icon: Tags,
          description: 'Etiquetas para organização'
        }
      ]
    },
    {
      title: 'Formulários',
      items: [
        {
          id: 'forms',
          label: 'Formulários',
          icon: FormInput,
          description: 'Criar e gerenciar formulários'
        },
        {
          id: 'form-submissions',
          label: 'Respostas',
          icon: MessageSquare,
          badge: 23,
          description: 'Respostas dos formulários'
        }
      ]
    },
    {
      title: 'Usuários',
      items: [
        {
          id: 'users',
          label: 'Usuários',
          icon: Users,
          description: 'Gerenciar usuários do sistema'
        },
        {
          id: 'permissions',
          label: 'Permissões',
          icon: Shield,
          description: 'Controle de acesso por usuário'
        }
      ]
    },
    {
      title: 'Sistema',
      items: [
        {
          id: 'settings',
          label: 'Configurações',
          icon: Settings,
          description: 'Configurações gerais'
        },
        {
          id: 'seo',
          label: 'SEO',
          icon: Search,
          description: 'Otimização para buscadores'
        },
        {
          id: 'appearance',
          label: 'Aparência',
          icon: Palette,
          description: 'Temas e personalização'
        }
      ]
    }
  ];

  const handleItemClick = (viewId: AdminView) => {
    setCurrentView(viewId);
    // Fechar sidebar no mobile após seleção
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = currentView === item.id;
    
    const content = (
      <Button
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start h-auto py-2 px-2 text-left transition-all duration-200",
          sidebarCollapsed ? "px-2" : "px-3",
          isActive && "bg-primary text-primary-foreground shadow-sm",
          !isActive && "hover:bg-accent hover:text-accent-foreground"
        )}
        onClick={() => handleItemClick(item.id)}
      >
        <item.icon className={cn(
          "flex-shrink-0",
          sidebarCollapsed ? "h-4 w-4" : "h-4 w-4 mr-2"
        )} />
        {!sidebarCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium truncate">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant={isActive ? "secondary" : "default"} 
                  className="ml-1 text-xs h-4 px-1.5"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
          </div>
        )}
      </Button>
    );

    if (sidebarCollapsed && item.description) {
      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              <div>
                <div className="font-semibold">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      sidebarCollapsed ? "w-16" : "w-72",
      // Mobile: overlay behavior
      "fixed inset-y-0 left-0 z-50 h-screen",
      sidebarOpen ? "translate-x-0" : "-translate-x-full",
      // Desktop: always visible, não overlay
      "lg:translate-x-0"
    )}>
      {/* Header da Sidebar */}
      <div className={cn(
        "flex items-center border-b border-sidebar-border flex-shrink-0",
        sidebarCollapsed ? "p-3 justify-center" : "p-4"
      )}>
        {!sidebarCollapsed ? (
          <div className="flex items-center w-full">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-sidebar-foreground truncate text-sm">
                Admin Timon
              </h2>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Painel Administrativo
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(true)}
              className="ml-1 h-7 w-7 p-0 hover:bg-sidebar-accent"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(false)}
            className="h-7 w-7 p-0 hover:bg-sidebar-accent"
          >
            <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">T</span>
            </div>
          </Button>
        )}
      </div>

      {/* Navegação */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <nav className="space-y-3">
          {navSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {!sidebarCollapsed && (
                <h3 className="px-2 mb-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItemComponent key={item.id} item={item} />
                ))}
              </div>
              {!sidebarCollapsed && sectionIndex < navSections.length - 1 && (
                <Separator className="mt-2 bg-sidebar-border" />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer da Sidebar */}
      <div className={cn(
        "border-t border-sidebar-border flex-shrink-0",
        sidebarCollapsed ? "p-2" : "p-3"
      )}>
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent py-1.5"
                    onClick={() => window.open('/', '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Site
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Visualizar o site público
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className={cn(
                    "text-destructive hover:bg-destructive/10 hover:text-destructive py-1.5",
                    sidebarCollapsed ? "w-full px-2" : "w-full justify-start"
                  )}
                >
                  <LogOut className={cn(
                    "h-4 w-4",
                    !sidebarCollapsed && "mr-2"
                  )} />
                  {!sidebarCollapsed && "Sair"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={sidebarCollapsed ? "right" : "top"}>
                Sair do sistema
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}