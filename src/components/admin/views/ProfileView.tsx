import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Save,
  Upload,
  Camera,
  Edit,
  Check,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  bio: string;
  address: string;
  avatar?: string;
  joinDate: string;
  lastLogin: string;
  role: string;
  permissions: string[];
  preferences: {
    emailNotifications: boolean;
    systemNotifications: boolean;
    language: string;
    timezone: string;
  };
}

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - em uma aplicação real, isso viria de uma API
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Administrador do Sistema',
    email: 'admin@timon.ma.gov.br',
    phone: '+55 (99) 3212-1500',
    position: 'Administrador Geral',
    department: 'Tecnologia da Informação',
    bio: 'Responsável pela administração e manutenção do portal oficial da Prefeitura Municipal de Timon.',
    address: 'Centro Administrativo Municipal, Timon - MA',
    avatar: undefined,
    joinDate: '2023-01-15',
    lastLogin: '2024-12-16T10:30:00Z',
    role: 'Super Admin',
    permissions: ['read', 'write', 'delete', 'admin'],
    preferences: {
      emailNotifications: true,
      systemNotifications: true,
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo'
    }
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      toast.error('Erro ao alterar senha. Verifique sua senha atual.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    // Simular upload de avatar
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const avatarUrl = event.target?.result as string;
          setEditedProfile(prev => ({ ...prev, avatar: avatarUrl }));
          toast.success('Avatar atualizado!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-red-100 text-red-800';
      case 'Admin':
        return 'bg-blue-100 text-blue-800';
      case 'Editor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e configurações de conta</p>
        </div>
        
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda - Informações básicas */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card do Avatar e Informações Básicas */}
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="h-24 w-24 mx-auto">
                  {editedProfile.avatar ? (
                    <AvatarImage src={editedProfile.avatar} alt={editedProfile.name} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {editedProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={handleAvatarUpload}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Badge className={getRoleColor(profile.role)}>
                    {profile.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{profile.position}</p>
                <p className="text-xs text-muted-foreground">{profile.department}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Separator />
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Membro desde:</span>
                  <span>{formatJoinDate(profile.joinDate)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Último acesso:</span>
                  <span>{formatLastLogin(profile.lastLogin)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Permissões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.permissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita - Formulários */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Mantenha suas informações pessoais atualizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={editedProfile.position}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, position: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={editedProfile.department}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, department: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={editedProfile.address}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Descreva sua função e responsabilidades..."
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Altere sua senha para manter sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                  />
                </div>
              </div>

              <Button 
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword || isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Shield className="h-4 w-4 mr-2" />
                {isLoading ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Configure suas preferências de notificação e sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por E-mail</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações importantes por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={editedProfile.preferences.emailNotifications}
                    onCheckedChange={(checked) => 
                      setEditedProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, emailNotifications: checked }
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações do Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações dentro do sistema
                    </p>
                  </div>
                  <Switch
                    checked={editedProfile.preferences.systemNotifications}
                    onCheckedChange={(checked) => 
                      setEditedProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, systemNotifications: checked }
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={editedProfile.preferences.language}
                    onValueChange={(value) => 
                      setEditedProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, language: value }
                      }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={editedProfile.preferences.timezone}
                    onValueChange={(value) => 
                      setEditedProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, timezone: value }
                      }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}