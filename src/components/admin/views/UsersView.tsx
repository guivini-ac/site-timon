import { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Calendar,
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Switch } from '../../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Alert, AlertDescription } from '../../ui/alert';
import { Checkbox } from '../../ui/checkbox';
import { EmptyState } from '../components/EmptyState';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';
import { useUsers, type User, type UserFormData } from '../../UsersContext';
import { useAdmin } from '../AdminContext';

export function UsersView() {
  const { 
    users, 
    addUser, 
    updateUser, 
    deleteUser, 
    toggleUserStatus,
    validateUserForm,
    isEmailUnique
  } = useUsers();

  const { addNotification } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const [userForm, setUserForm] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isActive: true
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  // Bulk actions usando o hook padrão
  const bulkSelection = useBulkSelection(filteredUsers);

  // Configuração das ações em lote
  const bulkActions: BulkAction[] = [
    {
      id: 'activate',
      label: 'Ativar',
      icon: UserCheck,
      variant: 'outline'
    },
    {
      id: 'deactivate',
      label: 'Desativar',
      icon: UserX,
      variant: 'outline'
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: Trash2,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationTitle: 'Excluir usuários selecionados',
      confirmationDescription: 'Esta ação não pode ser desfeita. Os usuários selecionados serão permanentemente removidos do sistema.'
    }
  ];

  // Handler para ações em lote
  const handleBulkAction = (actionId: string, selectedIds: string[]) => {
    switch (actionId) {
      case 'activate':
        selectedIds.forEach(id => {
          const user = users.find(u => u.id === id);
          if (user && !user.isActive) {
            toggleUserStatus(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} usuário${selectedIds.length !== 1 ? 's' : ''} ativado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os usuários selecionados foram ativados com sucesso.'
        });
        break;
        
      case 'deactivate':
        selectedIds.forEach(id => {
          const user = users.find(u => u.id === id);
          if (user && user.isActive) {
            toggleUserStatus(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} usuário${selectedIds.length !== 1 ? 's' : ''} desativado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os usuários selecionados foram desativados com sucesso.'
        });
        break;
        
      case 'delete':
        selectedIds.forEach(id => {
          deleteUser(id);
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} usuário${selectedIds.length !== 1 ? 's' : ''} excluído${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os usuários selecionados foram excluídos com sucesso.'
        });
        break;
    }
  };

  const handleUserSubmit = () => {
    const errors = validateUserForm(userForm);
    
    if (!isEmailUnique(userForm.email, editingUser?.id)) {
      errors.push('Este e-mail já está em uso');
    }
    
    setFormErrors(errors);
    
    if (errors.length === 0) {
      if (editingUser) {
        updateUser(editingUser.id, {
          name: userForm.name,
          email: userForm.email,
          isActive: userForm.isActive
        });
      } else {
        addUser(userForm);
      }
      handleCloseUserDialog();
    }
  };

  const handleCloseUserDialog = () => {
    setShowUserDialog(false);
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isActive: true
    });
    setFormErrors([]);
    setShowPassword(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      isActive: user.isActive
    });
    setShowUserDialog(true);
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

  const getPermissionsBadge = (permissions: string[]) => {
    if (permissions.includes('all')) {
      return <Badge variant="default" className="gap-1">
        <Crown className="h-3 w-3" />
        Administrador
      </Badge>;
    }
    
    if (permissions.length === 0) {
      return <Badge variant="outline" className="gap-1">
        <UserX className="h-3 w-3" />
        Sem permissões
      </Badge>;
    }
    
    return <Badge variant="secondary" className="gap-1">
      <Shield className="h-3 w-3" />
      {permissions.length} permissões
    </Badge>;
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (users.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie usuários do sistema administrativo
            </p>
          </div>
          <Button onClick={() => setShowUserDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        <EmptyState
          title="Nenhum usuário encontrado"
          description="Crie o primeiro usuário para começar a gerenciar o acesso ao sistema."
          icon="Users"
          actionLabel="Novo Usuário"
          onAction={() => setShowUserDialog(true)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários do sistema. Para definir permissões, acesse a aba "Permissões"
          </p>
        </div>
        <Button onClick={() => setShowUserDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
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
              {users.filter(u => u.isActive).length} ativos
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
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((users.filter(u => u.isActive).length / users.length) * 100)}% do total
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
              Precisam configuração
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[16px]">
              <Users className="h-4 w-4" />
              Usuários ({filteredUsers.length})
            </CardTitle>

          </div>
          <CardDescription>
            Gerencie os dados básicos dos usuários. Para definir permissões, acesse a aba "Permissões"
          </CardDescription>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        {/* Componente de ações em lote */}
        <div className="px-6 pb-4">
          <BulkActions
            selectedIds={bulkSelection.selectedIds}
            totalItems={filteredUsers.length}
            onSelectAll={bulkSelection.selectAll}
            onClearSelection={bulkSelection.clearSelection}
            actions={bulkActions}
            onAction={handleBulkAction}
            itemName="usuário"
          />
        </div>
        
        <CardContent>
          {/* Tabela de Usuários */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado com os filtros aplicados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={bulkSelection.selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          bulkSelection.selectAll();
                        } else {
                          bulkSelection.clearSelection();
                        }
                      }}
                      aria-label="Selecionar todos os usuários"
                    />
                  </TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={bulkSelection.selectedIds.includes(user.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            bulkSelection.select(user.id);
                          } else {
                            bulkSelection.unselect(user.id);
                          }
                        }}
                        aria-label={`Selecionar usuário ${user.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPermissionsBadge(user.permissions)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user)}
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <div className="text-sm">
                          {user.lastLogin.toLocaleDateString('pt-BR')}
                          <div className="text-xs text-muted-foreground">
                            {user.lastLogin.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                            {user.isActive ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => deleteUser(user.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog Criar/Editar Usuário */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Modifique as informações básicas do usuário. Para gerenciar permissões, acesse a aba "Permissões".' 
                : 'Preencha os dados básicos do usuário. As permissões poderão ser definidas posteriormente na aba "Permissões".'}
            </DialogDescription>
          </DialogHeader>

          {formErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome completo"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="usuario@timon.ma.gov.br"
                className="mt-2"
              />
            </div>

            {!editingUser && (
              <>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={userForm.password}
                      onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Digite uma senha segura"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={userForm.confirmPassword}
                    onChange={(e) => setUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirme a senha"
                    className="mt-2"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={userForm.isActive}
                onCheckedChange={(checked) => setUserForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Usuário ativo</Label>
            </div>

            {!editingUser && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Após criar o usuário, acesse a aba "Permissões" para definir quais funcionalidades ele poderá acessar no sistema.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleUserSubmit} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
            <Button variant="outline" onClick={handleCloseUserDialog} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}