import { 
  Shield, 
  Eye,
  User,
  CheckCircle2,
  AlertCircle,
  Crown,
  Settings,
  Lock,
  Unlock,
  Info,
  Calendar,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Alert, AlertDescription } from '../../ui/alert';
import { Separator } from '../../ui/separator';
import { Progress } from '../../ui/progress';

interface PermissionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  granted: boolean;
  level: 'read' | 'write' | 'admin';
  lastUsed?: string;
}

interface PermissionCategory {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  permissions: PermissionItem[];
}

export default function MyPermissionsView() {
  // Mock data - dados do usuário atual logado
  const currentUser = {
    id: '1',
    name: 'Administrador do Sistema',
    email: 'admin@timon.ma.gov.br',
    role: 'Super Admin',
    avatar: undefined,
    isActive: true,
    lastLogin: '2024-12-16T10:30:00Z',
    accountCreated: '2023-01-15T00:00:00Z'
  };

  // Mock data - categorias de permissões do usuário
  const permissionCategories: PermissionCategory[] = [
    {
      name: 'Conteúdo e Publicações',
      icon: Settings,
      description: 'Gerenciamento de conteúdo do site',
      permissions: [
        {
          id: 'posts.read',
          name: 'Visualizar Notícias',
          description: 'Pode visualizar e navegar pelas notícias publicadas',
          category: 'posts',
          granted: true,
          level: 'read',
          lastUsed: '2024-12-16T09:15:00Z'
        },
        {
          id: 'posts.write',
          name: 'Gerenciar Notícias',
          description: 'Pode criar, editar e publicar notícias no site',
          category: 'posts',
          granted: true,
          level: 'write',
          lastUsed: '2024-12-15T14:20:00Z'
        },
        {
          id: 'posts.delete',
          name: 'Excluir Notícias',
          description: 'Pode excluir notícias e conteúdo publicado',
          category: 'posts',
          granted: true,
          level: 'admin',
          lastUsed: '2024-12-14T11:30:00Z'
        },
        {
          id: 'pages.manage',
          name: 'Gerenciar Páginas',
          description: 'Pode criar e editar páginas estáticas do site',
          category: 'pages',
          granted: true,
          level: 'write',
          lastUsed: '2024-12-13T16:45:00Z'
        }
      ]
    },
    {
      name: 'Mídia e Arquivos',
      icon: Eye,
      description: 'Acesso à biblioteca de mídia',
      permissions: [
        {
          id: 'media.upload',
          name: 'Upload de Arquivos',
          description: 'Pode fazer upload de imagens e documentos',
          category: 'media',
          granted: true,
          level: 'write',
          lastUsed: '2024-12-16T08:30:00Z'
        },
        {
          id: 'media.manage',
          name: 'Gerenciar Mídia',
          description: 'Pode organizar e excluir arquivos da biblioteca',
          category: 'media',
          granted: true,
          level: 'admin',
          lastUsed: '2024-12-15T10:15:00Z'
        },
        {
          id: 'gallery.manage',
          name: 'Gerenciar Galeria',
          description: 'Pode criar e organizar galerias de fotos públicas',
          category: 'gallery',
          granted: true,
          level: 'write',
          lastUsed: '2024-12-12T15:20:00Z'
        }
      ]
    },
    {
      name: 'Usuários e Administração',
      icon: User,
      description: 'Gerenciamento de usuários e sistema',
      permissions: [
        {
          id: 'users.read',
          name: 'Visualizar Usuários',
          description: 'Pode visualizar a lista de usuários do sistema',
          category: 'users',
          granted: true,
          level: 'read',
          lastUsed: '2024-12-16T07:45:00Z'
        },
        {
          id: 'users.manage',
          name: 'Gerenciar Usuários',
          description: 'Pode criar, editar e excluir usuários',
          category: 'users',
          granted: true,
          level: 'admin',
          lastUsed: '2024-12-14T09:30:00Z'
        },
        {
          id: 'permissions.manage',
          name: 'Gerenciar Permissões',
          description: 'Pode definir permissões para outros usuários',
          category: 'permissions',
          granted: true,
          level: 'admin',
          lastUsed: '2024-12-13T11:15:00Z'
        },
        {
          id: 'system.settings',
          name: 'Configurações do Sistema',
          description: 'Pode alterar configurações gerais do sistema',
          category: 'system',
          granted: true,
          level: 'admin',
          lastUsed: '2024-12-11T14:00:00Z'
        }
      ]
    },
    {
      name: 'Eventos e Serviços',
      icon: Calendar,
      description: 'Gestão de eventos e serviços públicos',
      permissions: [
        {
          id: 'events.manage',
          name: 'Gerenciar Eventos',
          description: 'Pode criar e editar eventos na agenda pública',
          category: 'events',
          granted: true,
          level: 'write',
          lastUsed: '2024-12-15T12:30:00Z'
        },
        {
          id: 'services.manage',
          name: 'Gerenciar Serviços',
          description: 'Pode configurar os serviços mais utilizados',
          category: 'services',
          granted: true,
          level: 'write',
          lastUsed: '2024-12-14T16:20:00Z'
        },
        {
          id: 'secretarias.manage',
          name: 'Gerenciar Secretarias',
          description: 'Pode atualizar informações das secretarias',
          category: 'secretarias',
          granted: true,
          level: 'write',
          lastUsed: '2024-12-10T10:45:00Z'
        }
      ]
    }
  ];

  const formatLastUsed = (dateString?: string) => {
    if (!dateString) return 'Nunca usado';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'write':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'read':
        return <Eye className="h-3 w-3" />;
      case 'write':
        return <Settings className="h-3 w-3" />;
      case 'admin':
        return <Crown className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'read':
        return 'Leitura';
      case 'write':
        return 'Escrita';
      case 'admin':
        return 'Admin';
      default:
        return 'Básico';
    }
  };

  const getAllPermissions = () => {
    return permissionCategories.flatMap(cat => cat.permissions);
  };

  const getGrantedPermissions = () => {
    return getAllPermissions().filter(p => p.granted);
  };

  const getPermissionUsagePercentage = () => {
    const total = getAllPermissions().length;
    const granted = getGrantedPermissions().length;
    return Math.round((granted / total) * 100);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Minhas Permissões</h1>
        <p className="text-gray-600">Visualize as permissões e níveis de acesso da sua conta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda - Informações do usuário */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card de Informações do Usuário */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  {currentUser.avatar ? (
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getUserInitials(currentUser.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              
              <CardTitle className="text-lg">{currentUser.name}</CardTitle>
              <div className="space-y-2">
                <Badge className="bg-red-100 text-red-800">
                  <Crown className="h-3 w-3 mr-1" />
                  {currentUser.role}
                </Badge>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Separator />
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Conta criada:</span>
                  <span>{formatDate(currentUser.accountCreated)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Último acesso:</span>
                  <span>{formatLastUsed(currentUser.lastLogin)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Estatísticas de Permissões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Resumo de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Permissões concedidas</span>
                  <span>{getGrantedPermissions().length} de {getAllPermissions().length}</span>
                </div>
                <Progress value={getPermissionUsagePercentage()} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {getPermissionUsagePercentage()}% de acesso total
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {getGrantedPermissions().filter(p => p.level === 'read').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Leitura</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {getGrantedPermissions().filter(p => p.level === 'write').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Escrita</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {getGrantedPermissions().filter(p => p.level === 'admin').length}
                </div>
                <p className="text-xs text-muted-foreground">Administração</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita - Detalhes das permissões */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alerta para usuário Super Admin */}
          <Alert>
            <Crown className="h-4 w-4" />
            <AlertDescription>
              <strong>Acesso Administrativo Total:</strong> Como Super Admin, você possui acesso irrestrito a todas as funcionalidades do sistema, incluindo gerenciamento de usuários e configurações críticas.
            </AlertDescription>
          </Alert>

          {/* Categorias de Permissões */}
          {permissionCategories.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-primary" />
                  {category.name}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {permission.granted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{permission.name}</h4>
                            <Badge variant="outline" className={`text-xs ${getLevelColor(permission.level)}`}>
                              {getLevelIcon(permission.level)}
                              <span className="ml-1">{getLevelLabel(permission.level)}</span>
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2">
                            {permission.description}
                          </p>
                          
                          {permission.granted && permission.lastUsed && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Usado pela última vez: {formatLastUsed(permission.lastUsed)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-3">
                        {permission.granted ? (
                          <Unlock className="h-4 w-4 text-green-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>
                  <strong>Níveis de Permissão:</strong>
                </p>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-center gap-2">
                    <Eye className="h-3 w-3 text-blue-600" />
                    <span><strong>Leitura:</strong> Permite visualizar informações</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings className="h-3 w-3 text-green-600" />
                    <span><strong>Escrita:</strong> Permite criar e editar conteúdo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown className="h-3 w-3 text-red-600" />
                    <span><strong>Admin:</strong> Controle total sobre a funcionalidade</span>
                  </li>
                </ul>
              </div>
              
              <Separator />
              
              <p className="text-sm text-muted-foreground">
                Se você precisar de permissões adicionais ou tiver dúvidas sobre seu nível de acesso, 
                entre em contato com outro administrador do sistema.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}