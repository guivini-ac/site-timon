import { useState, useEffect } from 'react';
import { useSecretarias, type Department, type DepartmentFormData } from '../../SecretariasContext';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Building2,
  Save,
  X,
  GraduationCap,
  Heart,
  Hammer,
  Leaf,
  Palette,
  Trophy,
  Calculator,
  Car,
  Briefcase,
  Scale,
  Megaphone,
  FileText,
  Home,
  Shield,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  User
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../../ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Separator } from '../../ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Checkbox } from '../../ui/checkbox';
import { useAdmin } from '../AdminContext';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';

// Mapeamento de ícones
const iconMap = {
  'Building2': Building2,
  'GraduationCap': GraduationCap,
  'Heart': Heart,
  'Shield': Shield,
  'Hammer': Hammer,
  'Leaf': Leaf,
  'Users': Users,
  'Palette': Palette,
  'Trophy': Trophy,
  'Calculator': Calculator,
  'Car': Car,
  'Briefcase': Briefcase,
  'Scale': Scale,
  'Megaphone': Megaphone,
  'FileText': FileText,
  'Home': Home
};

export function SecretariasView() {
  const { setBreadcrumbs, addNotification } = useAdmin();
  const {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    toggleDepartmentStatus,
    getActiveDepartments,
    getTotalDepartments,
    getIconOptions,
    getColorOptions
  } = useSecretarias();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  useEffect(() => {
    setBreadcrumbs([{ label: 'Secretarias' }]);
  }, [setBreadcrumbs]);

  const activeDepartments = getActiveDepartments();

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.secretary.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && department.isActive) ||
      (statusFilter === 'inactive' && !department.isActive);
    return matchesSearch && matchesStatus;
  });

  // Bulk actions
  const bulkSelection = useBulkSelection(filteredDepartments);

  const handleDeleteDepartment = (departmentId: string) => {
    deleteDepartment(departmentId);
    addNotification({
      type: 'success',
      title: 'Secretaria excluída',
      message: 'A secretaria foi excluída com sucesso.'
    });
  };

  const handleToggleDepartmentStatus = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    toggleDepartmentStatus(departmentId);
    addNotification({
      type: 'success',
      title: `Secretaria ${department?.isActive ? 'desativada' : 'ativada'}`,
      message: `A secretaria foi ${department?.isActive ? 'desativada' : 'ativada'} com sucesso.`
    });
  };

  // Bulk actions handlers
  const handleBulkAction = (actionId: string, selectedIds: string[]) => {
    switch (actionId) {
      case 'delete':
        selectedIds.forEach(id => deleteDepartment(id));
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} secretaria${selectedIds.length !== 1 ? 's' : ''} excluída${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As secretarias selecionadas foram excluídas com sucesso.'
        });
        break;
        
      case 'activate':
        selectedIds.forEach(id => {
          const department = departments.find(d => d.id === id);
          if (department && !department.isActive) {
            toggleDepartmentStatus(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} secretaria${selectedIds.length !== 1 ? 's' : ''} ativada${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As secretarias selecionadas foram ativadas com sucesso.'
        });
        break;
        
      case 'deactivate':
        selectedIds.forEach(id => {
          const department = departments.find(d => d.id === id);
          if (department && department.isActive) {
            toggleDepartmentStatus(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} secretaria${selectedIds.length !== 1 ? 's' : ''} desativada${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As secretarias selecionadas foram desativadas com sucesso.'
        });
        break;
    }
  };

  const bulkActions: BulkAction[] = [
    {
      id: 'activate',
      label: 'Ativar',
      icon: Eye,
      variant: 'outline'
    },
    {
      id: 'deactivate',
      label: 'Desativar',
      icon: EyeOff,
      variant: 'outline'
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: Trash2,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationTitle: 'Excluir secretarias selecionadas',
      confirmationDescription: 'Esta ação não pode ser desfeita. As secretarias selecionadas serão permanentemente removidas.'
    }
  ];

  const DepartmentForm = ({ department, onSave, onCancel }: {
    department?: Department;
    onSave: (departmentData: DepartmentFormData) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<DepartmentFormData>({
      name: department?.name || '',
      description: department?.description || '',
      slug: department?.slug || '',
      icon: department?.icon || 'Building2',
      color: department?.color || '#144c9c',
      secretary: department?.secretary || {
        name: '',
        role: '',
        photo: '',
        biography: '',
        email: '',
        phone: ''
      },
      mission: department?.mission || '',
      vision: department?.vision || '',
      objectives: department?.objectives || [''],
      services: department?.services || [''],
      contact: department?.contact || {
        address: '',
        phone: '',
        email: '',
        workingHours: ''
      },
      isActive: department?.isActive ?? true,
      order: department?.order || (departments.length + 1)
    });

    const generateSlug = (name: string) => {
      return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const handleNameChange = (name: string) => {
      setFormData({
        ...formData,
        name,
        slug: generateSlug(name)
      });
    };

    const handleArrayChange = (field: 'objectives' | 'services', index: number, value: string) => {
      const newArray = [...formData[field]];
      newArray[index] = value;
      setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: 'objectives' | 'services') => {
      setFormData({
        ...formData,
        [field]: [...formData[field], '']
      });
    };

    const removeArrayItem = (field: 'objectives' | 'services', index: number) => {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newArray });
    };

    const handleSubmit = () => {
      if (!formData.name || !formData.description) {
        addNotification({
          type: 'error',
          title: 'Campos obrigatórios',
          message: 'Nome e descrição são obrigatórios.'
        });
        return;
      }

      // Remove empty array items
      const cleanedData = {
        ...formData,
        objectives: formData.objectives.filter(item => item.trim()),
        services: formData.services.filter(item => item.trim())
      };

      onSave(cleanedData);
    };

    return (
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="secretary">Secretário</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Secretaria *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nome da secretaria"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da secretaria"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL/Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="url-da-secretaria"
            />
            <p className="text-xs text-muted-foreground">
              URL será: /secretarias/{formData.slug}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Ícone</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getIconOptions().map((option) => {
                    const IconComponent = iconMap[option.icon as keyof typeof iconMap];
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getColorOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: option.color }}
                        />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Ordem de Exibição</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
            <div className="flex items-center space-x-2 pt-7">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Secretaria Ativa</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="secretary" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="secretaryName">Nome do Secretário</Label>
              <Input
                id="secretaryName"
                value={formData.secretary.name}
                onChange={(e) => setFormData({
                  ...formData,
                  secretary: { ...formData.secretary, name: e.target.value }
                })}
                placeholder="Nome completo do secretário"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretaryRole">Cargo</Label>
              <Input
                id="secretaryRole"
                value={formData.secretary.role}
                onChange={(e) => setFormData({
                  ...formData,
                  secretary: { ...formData.secretary, role: e.target.value }
                })}
                placeholder="Ex: Secretário Municipal de Saúde"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretaryPhoto">URL da Foto</Label>
            <Input
              id="secretaryPhoto"
              value={formData.secretary.photo}
              onChange={(e) => setFormData({
                ...formData,
                secretary: { ...formData.secretary, photo: e.target.value }
              })}
              placeholder="URL da foto do secretário"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretaryBiography">Biografia</Label>
            <Textarea
              id="secretaryBiography"
              value={formData.secretary.biography}
              onChange={(e) => setFormData({
                ...formData,
                secretary: { ...formData.secretary, biography: e.target.value }
              })}
              placeholder="Breve biografia do secretário"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="secretaryEmail">E-mail</Label>
              <Input
                id="secretaryEmail"
                type="email"
                value={formData.secretary.email}
                onChange={(e) => setFormData({
                  ...formData,
                  secretary: { ...formData.secretary, email: e.target.value }
                })}
                placeholder="email@timon.ma.gov.br"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretaryPhone">Telefone</Label>
              <Input
                id="secretaryPhone"
                value={formData.secretary.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  secretary: { ...formData.secretary, phone: e.target.value }
                })}
                placeholder="(99) 3212-3456"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mission">Missão</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              placeholder="Missão da secretaria"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vision">Visão</Label>
            <Textarea
              id="vision"
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              placeholder="Visão da secretaria"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Objetivos</Label>
            {formData.objectives.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                  placeholder="Objetivo da secretaria"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('objectives', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('objectives')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Objetivo
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Serviços Oferecidos</Label>
            {formData.services.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleArrayChange('services', index, e.target.value)}
                  placeholder="Serviço oferecido"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('services', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('services')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.contact.address}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, address: e.target.value }
              })}
              placeholder="Endereço completo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.contact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value }
                })}
                placeholder="(99) 3212-3456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value }
                })}
                placeholder="secretaria@timon.ma.gov.br"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workingHours">Horário de Funcionamento</Label>
            <Input
              id="workingHours"
              value={formData.contact.workingHours}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, workingHours: e.target.value }
              })}
              placeholder="Segunda a Sexta: 07:00 às 17:00"
            />
          </div>
        </TabsContent>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            {department ? 'Atualizar Secretaria' : 'Criar Secretaria'}
          </Button>
        </div>
      </Tabs>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Secretarias</h1>
          <p className="text-muted-foreground">
            Gerencie as secretarias municipais da Prefeitura de Timon
          </p>
        </div>
        <Button onClick={() => setIsCreateDepartmentOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Secretaria
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Secretarias</p>
                <p className="text-2xl font-bold">{getTotalDepartments()}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Secretarias Ativas</p>
                <p className="text-2xl font-bold text-green-600">
                  {activeDepartments.length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Serviços</p>
                <p className="text-2xl font-bold text-blue-600">
                  {departments.reduce((acc, dept) => acc + dept.services.length, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[16px]">
            <Building2 className="h-4 w-4" />
            Secretarias ({filteredDepartments.length})
          </CardTitle>
          <CardDescription>
            Gerencie secretarias municipais, órgãos e departamentos da prefeitura
          </CardDescription>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar secretarias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions */}
          <div className="mb-4">
            <BulkActions
              selectedIds={bulkSelection.selectedIds}
              totalItems={filteredDepartments.length}
              onSelectAll={bulkSelection.selectAll}
              onClearSelection={bulkSelection.clearSelection}
              actions={bulkActions}
              onAction={handleBulkAction}
              itemName="secretaria"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pr-4">
                  <Checkbox
                    checked={bulkSelection.selectedIds.length === filteredDepartments.length && filteredDepartments.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        bulkSelection.selectAll();
                      } else {
                        bulkSelection.clearSelection();
                      }
                    }}
                    aria-label="Selecionar todas as secretarias"
                  />
                </TableHead>
                <TableHead className="pl-6">Secretaria</TableHead>
                <TableHead>Secretário</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => {
                const IconComponent = iconMap[department.icon as keyof typeof iconMap] || Building2;
                
                return (
                  <TableRow key={department.id}>
                    <TableCell className="pr-4 text-[12px]">
                      <Checkbox
                        checked={bulkSelection.isSelected(department.id)}
                        onCheckedChange={() => bulkSelection.selectItem(department.id)}
                      />
                    </TableCell>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: department.color + '20' }}
                        >
                          <IconComponent 
                            className="h-5 w-5" 
                            style={{ color: department.color }} 
                          />
                        </div>
                        <div>
                          <div className="font-medium">{department.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {department.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {department.secretary.name ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={department.secretary.photo} alt={department.secretary.name} />
                            <AvatarFallback className="text-xs">
                              {department.secretary.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{department.secretary.name}</div>
                            <div className="text-xs text-muted-foreground">{department.secretary.role}</div>
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-orange-600">
                          Sem responsável
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {department.contact.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {department.contact.phone}
                          </div>
                        )}
                        {department.contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {department.contact.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {department.isActive ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">
                          {department.isActive ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingDepartment(department)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleDepartmentStatus(department.id)}>
                            {department.isActive ? (
                              <><EyeOff className="h-4 w-4 mr-2" />Desativar</>
                            ) : (
                              <><Eye className="h-4 w-4 mr-2" />Ativar</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDepartment(department.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredDepartments.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Nenhuma secretaria encontrada com os filtros aplicados'
                  : 'Nenhuma secretaria cadastrada ainda'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Department Modal */}
      <Dialog open={isCreateDepartmentOpen} onOpenChange={setIsCreateDepartmentOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Secretaria</DialogTitle>
            <DialogDescription>
              Cadastre uma nova secretaria municipal.
            </DialogDescription>
          </DialogHeader>
          <DepartmentForm
            onSave={(departmentData) => {
              addDepartment(departmentData);
              setIsCreateDepartmentOpen(false);
              addNotification({
                type: 'success',
                title: 'Secretaria criada',
                message: 'A secretaria foi criada com sucesso.'
              });
            }}
            onCancel={() => setIsCreateDepartmentOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Department Modal */}
      <Dialog open={!!editingDepartment} onOpenChange={() => setEditingDepartment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Secretaria</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias na secretaria selecionada.
            </DialogDescription>
          </DialogHeader>
          {editingDepartment && (
            <DepartmentForm
              department={editingDepartment}
              onSave={(departmentData) => {
                updateDepartment(editingDepartment.id, departmentData);
                setEditingDepartment(null);
                addNotification({
                  type: 'success',
                  title: 'Secretaria atualizada',
                  message: 'As alterações foram salvas com sucesso.'
                });
              }}
              onCancel={() => setEditingDepartment(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}