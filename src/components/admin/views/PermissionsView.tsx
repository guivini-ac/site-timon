import { useState, useMemo } from 'react';
import { 
  Shield, 
  Users, 
  Search,
  Edit2,
  Save,
  X,
  Crown,
  Settings,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserX
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { EmptyState } from '../components/EmptyState';
import { useUsers, type User, type Permission } from '../../UsersContext';

export function PermissionsView() {
  const { 
    users,
    getAllPermissions,
    updateUserPermissions,
    getUserPermissions
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);

  const permissionCategories = getAllPermissions();

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [users, searchTerm]);

  const handleEditPermissions = (user: User) => {
    setEditingUser(user);
    setSelectedPermissions(getUserPermissions(user.id));
    setShowPermissionsDialog(true);
  };

  const handleSavePermissions = () => {
    if (editingUser) {
      updateUserPermissions(editingUser.id, selectedPermissions);
      setShowPermissionsDialog(false);
      setEditingUser(null);
      setSelectedPermissions([]);
    }
  };

  const handleCloseDialog = () => {
    setShowPermissionsDialog(false);
    setEditingUser(null);
    setSelectedPermissions([]);
  };

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    if (permission === 'all') {
      setSelectedPermissions(checked ? ['all'] : []);
    } else {
      setSelectedPermissions(prev => {
        const filtered = prev.filter(p => p !== 'all');
        return checked 
          ? [...filtered, permission]
          : filtered.filter(p => p !== permission);
      });
    }
  };

  const getPermissionsBadge = (userPermissions: Permission[]) => {
    if (userPermissions.includes('all')) {
      return <Badge variant="default" className="gap-1">
        <Crown className="h-3 w-3" />
        Administrador
      </Badge>;
    }
    
    if (userPermissions.length === 0) {
      return <Badge variant="outline" className="gap-1">
        <UserX className="h-3 w-3" />
        Sem permissões
      </Badge>;
    }
    
    return <Badge variant="secondary" className="gap-1">
      <Shield className="h-3 w-3" />
      {userPermissions.length} permissões
    </Badge>;
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusBadge = (user: User) => {
    return user.isActive ? (
      <Badge variant="default" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="gap-1">
        <UserX className="h-3 w-3" />
        Inativo
      </Badge>
    );
  };

  if (users.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Permissões</h1>
          <p className="text-muted-foreground">
            Gerencie as permissões individuais de cada usuário
          </p>
        </div>

        <EmptyState
          title="Nenhum usuário encontrado"
          description="É necessário ter usuários cadastrados para gerenciar suas permissões. Acesse a aba 'Usuários' para criar o primeiro usuário."
          icon="Users"
          actionLabel="Ir para Usuários"
          onAction={() => console.log('Navegar para usuários')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Gestão de Permissões</h1>
        <p className="text-muted-foreground">
          Defina as permissões individuais para cada usuário do sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Para gerenciar permissões
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.permissions.includes('all')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Com acesso total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Permissões</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.permissions.length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuários configurados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Permissões</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.permissions.length === 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Precisam ser configurados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários e Permissões */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[16px]">
              <Shield className="h-4 w-4" />
              Usuários e suas Permissões ({filteredUsers.length})
            </CardTitle>
          </div>
          <CardDescription>
            Clique em "Editar Permissões" para definir o que cada usuário pode acessar no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtro de busca */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuário por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Lista de Usuários */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado com os filtros aplicados.
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-l-4 border-l-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{user.name}</h4>
                            {getStatusBadge(user)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                          <div className="flex items-center gap-2">
                            {getPermissionsBadge(user.permissions)}
                            {user.permissions.length > 0 && !user.permissions.includes('all') && (
                              <span className="text-xs text-muted-foreground">
                                {user.permissions.map(p => p.replace('.', ' › ')).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPermissions(user)}
                          className="gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Editar Permissões
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Edição de Permissões */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Editar Permissões - {editingUser?.name}
            </DialogTitle>
            <DialogDescription>
              Defina quais funcionalidades {editingUser?.name} pode acessar no sistema administrativo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Opção Administrador Total */}
            <div className="p-4 border rounded-lg bg-primary/5">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="admin-total"
                  checked={selectedPermissions.includes('all')}
                  onCheckedChange={(checked) => 
                    handlePermissionChange('all', checked as boolean)
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="admin-total" className="font-medium cursor-pointer flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    Administrador Total
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Acesso completo a todas as funcionalidades do sistema (recomendado apenas para administradores principais)
                  </p>
                </div>
              </div>
            </div>

            {/* Alerta quando administrador total está selecionado */}
            {selectedPermissions.includes('all') && (
              <Alert>
                <Crown className="h-4 w-4" />
                <AlertDescription>
                  Com "Administrador Total" selecionado, este usuário terá acesso irrestrito a todas as funcionalidades, 
                  incluindo gerenciamento de outros usuários e configurações críticas do sistema.
                </AlertDescription>
              </Alert>
            )}

            {/* Permissões específicas */}
            {!selectedPermissions.includes('all') && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Permissões Específicas</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecione as permissões específicas que este usuário deve ter. As abas administrativas (Usuários, Permissões, Configurações, SEO, Aparência) são exclusivas do Super Admin.
                  </p>
                </div>

                {/* Banners/Slides */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Banners/Slides</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="carousel.view"
                        checked={selectedPermissions.includes("carousel.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("carousel.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="carousel.view" className="text-sm cursor-pointer">
                          Visualizar Banners/Slides
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver lista de banners e slides do carrossel principal
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="carousel.manage"
                        checked={selectedPermissions.includes("carousel.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("carousel.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="carousel.manage" className="text-sm cursor-pointer">
                          Gerenciar Banners/Slides
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criar, editar e configurar slides e banners do carrossel
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notícias */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Notícias</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="posts.view"
                        checked={selectedPermissions.includes("posts.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("posts.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="posts.view" className="text-sm cursor-pointer">
                          Visualizar Notícias
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver lista de notícias e acessar detalhes de postagens
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="posts.create"
                        checked={selectedPermissions.includes("posts.create")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("posts.create", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="posts.create" className="text-sm cursor-pointer">
                          Criar Notícias
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criar novas postagens e rascunhos de notícias
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="posts.edit"
                        checked={selectedPermissions.includes("posts.edit")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("posts.edit", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="posts.edit" className="text-sm cursor-pointer">
                          Editar Notícias
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Modificar conteúdo de notícias existentes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="posts.publish"
                        checked={selectedPermissions.includes("posts.publish")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("posts.publish", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="posts.publish" className="text-sm cursor-pointer">
                          Publicar Notícias
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Publicar e despublicar notícias no site
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="posts.delete"
                        checked={selectedPermissions.includes("posts.delete")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("posts.delete", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="posts.delete" className="text-sm cursor-pointer">
                          Excluir Notícias
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Excluir permanentemente notícias do sistema
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Páginas */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Páginas</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="pages.view"
                        checked={selectedPermissions.includes("pages.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("pages.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="pages.view" className="text-sm cursor-pointer">
                          Visualizar Páginas
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver lista de páginas estáticas do site
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="pages.manage"
                        checked={selectedPermissions.includes("pages.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("pages.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="pages.manage" className="text-sm cursor-pointer">
                          Gerenciar Páginas
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criar, editar e excluir páginas estáticas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eventos */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Eventos</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="events.view"
                        checked={selectedPermissions.includes("events.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("events.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="events.view" className="text-sm cursor-pointer">
                          Visualizar Eventos
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver agenda de eventos públicos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="events.manage"
                        checked={selectedPermissions.includes("events.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("events.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="events.manage" className="text-sm cursor-pointer">
                          Gerenciar Eventos
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criar, editar e publicar eventos na agenda
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Serviços */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Serviços</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="services.view"
                        checked={selectedPermissions.includes("services.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("services.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="services.view" className="text-sm cursor-pointer">
                          Visualizar Serviços
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver lista de serviços municipais disponíveis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="services.manage"
                        checked={selectedPermissions.includes("services.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("services.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="services.manage" className="text-sm cursor-pointer">
                          Gerenciar Serviços
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Configurar e atualizar serviços municipais
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secretarias */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Secretarias</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="secretarias.view"
                        checked={selectedPermissions.includes("secretarias.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("secretarias.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="secretarias.view" className="text-sm cursor-pointer">
                          Visualizar Secretarias
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver informações das secretarias municipais
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="secretarias.manage"
                        checked={selectedPermissions.includes("secretarias.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("secretarias.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="secretarias.manage" className="text-sm cursor-pointer">
                          Gerenciar Secretarias
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Atualizar informações e estrutura das secretarias
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pontos Turísticos */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Pontos Turísticos</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="tourism.view"
                        checked={selectedPermissions.includes("tourism.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("tourism.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="tourism.view" className="text-sm cursor-pointer">
                          Visualizar Pontos Turísticos
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver informações sobre pontos turísticos da cidade
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="tourism.manage"
                        checked={selectedPermissions.includes("tourism.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("tourism.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="tourism.manage" className="text-sm cursor-pointer">
                          Gerenciar Pontos Turísticos
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Adicionar e editar informações turísticas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Galeria Pública */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Galeria Pública</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="gallery.view"
                        checked={selectedPermissions.includes("gallery.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("gallery.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="gallery.view" className="text-sm cursor-pointer">
                          Visualizar Galeria
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver galerias de fotos públicas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="gallery.manage"
                        checked={selectedPermissions.includes("gallery.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("gallery.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="gallery.manage" className="text-sm cursor-pointer">
                          Gerenciar Galeria
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criar, organizar e publicar galerias de fotos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Biblioteca de Mídia */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Biblioteca de Mídia</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="media.view"
                        checked={selectedPermissions.includes("media.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("media.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="media.view" className="text-sm cursor-pointer">
                          Visualizar Mídia
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver arquivos na biblioteca de mídia
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="media.upload"
                        checked={selectedPermissions.includes("media.upload")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("media.upload", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="media.upload" className="text-sm cursor-pointer">
                          Upload de Arquivos
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Fazer upload de imagens e documentos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="media.manage"
                        checked={selectedPermissions.includes("media.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("media.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="media.manage" className="text-sm cursor-pointer">
                          Gerenciar Mídia
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Organizar, editar metadados e excluir arquivos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categorias */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Categorias</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="categories.view"
                        checked={selectedPermissions.includes("categories.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("categories.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="categories.view" className="text-sm cursor-pointer">
                          Visualizar Categorias
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver lista de categorias de conteúdo
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="categories.manage"
                        checked={selectedPermissions.includes("categories.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("categories.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="categories.manage" className="text-sm cursor-pointer">
                          Gerenciar Categorias
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criar, editar e organizar categorias de conteúdo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Tags</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="tags.view"
                        checked={selectedPermissions.includes("tags.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("tags.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="tags.view" className="text-sm cursor-pointer">
                          Visualizar Tags
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver lista de etiquetas para organização de conteúdo
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="tags.manage"
                        checked={selectedPermissions.includes("tags.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("tags.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="tags.manage" className="text-sm cursor-pointer">
                          Gerenciar Tags
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criar, editar e organizar tags para categorização
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulários */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Formulários</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="forms.view"
                        checked={selectedPermissions.includes("forms.view")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("forms.view", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="forms.view" className="text-sm cursor-pointer">
                          Visualizar Formulários
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ver lista de formulários criados
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="forms.manage"
                        checked={selectedPermissions.includes("forms.manage")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("forms.manage", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="forms.manage" className="text-sm cursor-pointer">
                          Gerenciar Formulários
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criar, editar e configurar formulários públicos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Respostas de Formulários */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h5 className="font-medium text-primary">Respostas</h5>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="forms.submissions"
                        checked={selectedPermissions.includes("forms.submissions")}
                        onCheckedChange={(checked) => 
                          handlePermissionChange("forms.submissions", checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="forms.submissions" className="text-sm cursor-pointer">
                          Ver Respostas de Formulários
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Acessar e analisar respostas enviadas pelos cidadãos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Crown className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h6 className="font-medium text-amber-800 mb-1">
                        Permissões Exclusivas do Super Admin
                      </h6>
                      <p className="text-sm text-amber-700">
                        As seguintes abas são exclusivas do Super Admin e não podem ser atribuídas individualmente: 
                        <strong>Usuários, Permissões, Configurações, SEO e Aparência</strong>. 
                        Para acessar essas funcionalidades, o usuário deve ter a permissão "Administrador Total".
                      </p>
                    </div>
                  </div>
                </div>

                {selectedPermissions.length === 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Este usuário não terá acesso a nenhuma funcionalidade do sistema. 
                      Selecione ao menos uma permissão ou configure como "Administrador Total".
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSavePermissions} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              Salvar Permissões
            </Button>
            <Button variant="outline" onClick={handleCloseDialog} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}