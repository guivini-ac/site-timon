import { useState, useEffect } from 'react';
import { useServices, type Service, type ServiceFormData } from '../../ServicesContext';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  ExternalLink,
  Save,
  X,
  Star,
  StarOff,
  TrendingUp,
  Users,
  Link as LinkIcon,
  Phone,
  Clock,
  FileText,
  Receipt,
  Grid,
  Globe,
  Shield,
  ShieldCheck,
  Home,
  MessageSquare,
  Calendar as CalendarIcon,
  ArrowUpDown,
  Target
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
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';

const iconMap = {
  'Home': Home,
  'Link': LinkIcon,
  'FileText': FileText,
  'MessageSquare': MessageSquare,
  'ShieldCheck': ShieldCheck,
  'Receipt': Receipt,
  'Calendar': CalendarIcon,
  'Eye': Eye,
  'Globe': Globe,
  'Users': Users,
  'Grid': Grid,
  'TrendingUp': TrendingUp,
  'ExternalLink': ExternalLink,
  'Target': Target
};

export function ServicesView() {
  const { setBreadcrumbs, addNotification } = useAdmin();
  const { 
    services, 
    addService, 
    updateService, 
    deleteService, 
    toggleServiceStatus,
    toggleServiceFeatured,
    getPopularServices,
    getFeaturedServices,
    getCategoryLabel,
    getCategoryColor 
  } = useServices();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [previewService, setPreviewService] = useState<Service | null>(null);

  useEffect(() => {
    setBreadcrumbs([{ label: 'Serviços' }]);
  }, [setBreadcrumbs]);

  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && service.isActive) ||
        (statusFilter === 'inactive' && !service.isActive) ||
        (statusFilter === 'featured' && service.isFeatured);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => a.order - b.order);

  const popularServices = getPopularServices();
  const featuredServices = getFeaturedServices();

  // Bulk actions
  const bulkSelection = useBulkSelection(filteredServices);

  const handleDeleteService = (serviceId: number) => {
    deleteService(serviceId);
    addNotification({
      type: 'success',
      title: 'Serviço excluído',
      message: 'O serviço foi excluído com sucesso.'
    });
  };

  const handleToggleStatus = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    toggleServiceStatus(serviceId);
    addNotification({
      type: 'success',
      title: `Serviço ${service?.isActive ? 'desativado' : 'ativado'}`,
      message: `O serviço foi ${service?.isActive ? 'desativado' : 'ativado'} com sucesso.`
    });
  };

  const handleToggleFeatured = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    toggleServiceFeatured(serviceId);
    addNotification({
      type: 'success',
      title: `Serviço ${service?.isFeatured ? 'removido dos' : 'adicionado aos'} destaques`,
      message: `O serviço foi ${service?.isFeatured ? 'removido dos' : 'adicionado aos'} destaques.`
    });
  };

  // Bulk actions handlers
  const handleBulkAction = (actionId: string, selectedIds: string[]) => {
    switch (actionId) {
      case 'delete':
        selectedIds.forEach(id => deleteService(parseInt(id)));
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} serviço${selectedIds.length !== 1 ? 's' : ''} excluído${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os serviços selecionados foram excluídos com sucesso.'
        });
        break;
        
      case 'activate':
        selectedIds.forEach(id => {
          const service = services.find(s => s.id.toString() === id);
          if (service && !service.isActive) {
            toggleServiceStatus(parseInt(id));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} serviço${selectedIds.length !== 1 ? 's' : ''} ativado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os serviços selecionados foram ativados com sucesso.'
        });
        break;
        
      case 'deactivate':
        selectedIds.forEach(id => {
          const service = services.find(s => s.id.toString() === id);
          if (service && service.isActive) {
            toggleServiceStatus(parseInt(id));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} serviço${selectedIds.length !== 1 ? 's' : ''} desativado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os serviços selecionados foram desativados com sucesso.'
        });
        break;
        
      case 'feature':
        selectedIds.forEach(id => {
          const service = services.find(s => s.id.toString() === id);
          if (service && !service.isFeatured) {
            toggleServiceFeatured(parseInt(id));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} serviço${selectedIds.length !== 1 ? 's' : ''} destacado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os serviços selecionados foram adicionados aos destaques.'
        });
        break;
        
      case 'unfeature':
        selectedIds.forEach(id => {
          const service = services.find(s => s.id.toString() === id);
          if (service && service.isFeatured) {
            toggleServiceFeatured(parseInt(id));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} serviço${selectedIds.length !== 1 ? 's' : ''} removido${selectedIds.length !== 1 ? 's' : ''} dos destaques`,
          message: 'Os serviços selecionados foram removidos dos destaques.'
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
      id: 'feature',
      label: 'Destacar',
      icon: Star,
      variant: 'outline'
    },
    {
      id: 'unfeature',
      label: 'Remover Destaque',
      icon: StarOff,
      variant: 'outline'
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: Trash2,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationTitle: 'Excluir serviços selecionados',
      confirmationDescription: 'Esta ação não pode ser desfeita. Os serviços selecionados serão permanentemente removidos.'
    }
  ];

  const ServiceForm = ({ service, onSave, onCancel }: {
    service?: Service;
    onSave: (serviceData: ServiceFormData) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<ServiceFormData>({
      title: service?.title || '',
      description: service?.description || '',
      url: service?.url || '',
      icon: service?.icon || 'Globe',
      category: service?.category || 'digital',
      isActive: service?.isActive ?? true,
      isFeatured: service?.isFeatured ?? false,
      order: service?.order || (services.length + 1),
      requirements: service?.requirements || [],
      availableHours: service?.availableHours || '24h por dia',
      contact: service?.contact || ''
    });

    const [requirementInput, setRequirementInput] = useState('');

    const handleSubmit = () => {
      if (!formData.title || !formData.description || !formData.url) {
        addNotification({
          type: 'error',
          title: 'Campos obrigatórios',
          message: 'Título, descrição e URL são obrigatórios.'
        });
        return;
      }

      if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
        formData.url = 'https://' + formData.url;
      }

      onSave(formData);
    };

    const addRequirement = () => {
      if (requirementInput.trim() && !formData.requirements?.includes(requirementInput.trim())) {
        setFormData({
          ...formData,
          requirements: [...(formData.requirements || []), requirementInput.trim()]
        });
        setRequirementInput('');
      }
    };

    const removeRequirement = (requirement: string) => {
      setFormData({
        ...formData,
        requirements: formData.requirements?.filter(req => req !== requirement)
      });
    };

    return (
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Título do Serviço *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nome do serviço"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o serviço oferecido"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="url">URL do Serviço *</Label>
              <div className="relative mt-1">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://servico.timon.ma.gov.br"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Mais Populares</SelectItem>
                    <SelectItem value="digital">Serviços Digitais</SelectItem>
                    <SelectItem value="presencial">Atendimento Presencial</SelectItem>
                    <SelectItem value="documento">Documentos e Certidões</SelectItem>
                    <SelectItem value="fiscal">Serviços Fiscais</SelectItem>
                    <SelectItem value="outros">Outros Serviços</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="icon">Ícone</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Globe">Globe</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="FileText">FileText</SelectItem>
                    <SelectItem value="MessageSquare">MessageSquare</SelectItem>
                    <SelectItem value="ShieldCheck">ShieldCheck</SelectItem>
                    <SelectItem value="Receipt">Receipt</SelectItem>
                    <SelectItem value="Calendar">Calendar</SelectItem>
                    <SelectItem value="Eye">Eye</SelectItem>
                    <SelectItem value="Users">Users</SelectItem>
                    <SelectItem value="Link">Link</SelectItem>
                    <SelectItem value="Target">Target</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="order">Ordem de Exibição</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="mt-1"
                min="1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div>
            <Label htmlFor="availableHours">Horário de Funcionamento</Label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="availableHours"
                value={formData.availableHours}
                onChange={(e) => setFormData({ ...formData, availableHours: e.target.value })}
                placeholder="24h por dia"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact">Contato</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Telefone ou email para contato"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Requisitos/Documentos Necessários</Label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  placeholder="Digite um requisito"
                  onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                />
                <Button type="button" onClick={addRequirement} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.requirements && formData.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.requirements.map((requirement, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {requirement}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeRequirement(requirement)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Serviço Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Controla se o serviço aparece no site público
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Serviço em Destaque</Label>
              <p className="text-sm text-muted-foreground">
                Aparece na seção de serviços em destaque
              </p>
            </div>
            <Switch
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
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
            {service ? 'Atualizar Serviço' : 'Criar Serviço'}
          </Button>
        </div>
      </Tabs>
    );
  };

  const ServicePreview = ({ service }: { service: Service }) => {
    const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Globe;
    
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="outline"
                    style={{ backgroundColor: getCategoryColor(service.category) + '20' }}
                  >
                    {getCategoryLabel(service.category)}
                  </Badge>
                  {service.isFeatured && (
                    <Badge variant="default">Em Destaque</Badge>
                  )}
                  {!service.isActive && (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {service.availableHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{service.availableHours}</span>
                    </div>
                  )}
                  
                  {service.contact && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{service.contact}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{service.accessCount} acessos</span>
                  </div>
                </div>
                
                {service.requirements && service.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Documentos necessários:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {service.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button asChild className="w-full md:w-auto">
                  <a 
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Acessar Serviço
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Serviços</h1>
          <p className="text-muted-foreground">
            Configure serviços externos e links para o portal da prefeitura
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
              <Grid className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {services.filter(s => s.isActive).length}
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
                <p className="text-sm text-muted-foreground">Em Destaque</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {featuredServices.length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Acessos Totais</p>
                <p className="text-2xl font-bold">
                  {services.reduce((total, s) => total + s.accessCount, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[16px]">
            <Globe className="h-4 w-4" />
            Serviços ({filteredServices.length})
          </CardTitle>
          <CardDescription>
            Gerencie serviços públicos, procedimentos e portais de atendimento ao cidadão
          </CardDescription>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar serviços..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="popular">Mais Populares</SelectItem>
                  <SelectItem value="digital">Serviços Digitais</SelectItem>
                  <SelectItem value="presencial">Atendimento Presencial</SelectItem>
                  <SelectItem value="documento">Documentos e Certidões</SelectItem>
                  <SelectItem value="fiscal">Serviços Fiscais</SelectItem>
                  <SelectItem value="outros">Outros Serviços</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="featured">Em Destaque</SelectItem>
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
              totalItems={filteredServices.length}
              onSelectAll={bulkSelection.selectAll}
              onClearSelection={bulkSelection.clearSelection}
              actions={bulkActions}
              onAction={handleBulkAction}
              itemName="serviço"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={bulkSelection.selectedIds.length === filteredServices.length && filteredServices.length > 0}
                    onCheckedChange={bulkSelection.selectAll}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Acessos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => {
                const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Globe;
                return (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Checkbox
                        checked={bulkSelection.isSelected(service.id)}
                        onCheckedChange={() => bulkSelection.selectItem(service.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{service.title}</span>
                            {service.isFeatured && <Star className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        style={{ backgroundColor: getCategoryColor(service.category) + '20' }}
                      >
                        {getCategoryLabel(service.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{service.accessCount.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {service.isActive ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">
                          {service.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        Acessar
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingService(service)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPreviewService(service)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(service.id)}>
                            {service.isActive ? (
                              <><EyeOff className="h-4 w-4 mr-2" />Desativar</>
                            ) : (
                              <><Eye className="h-4 w-4 mr-2" />Ativar</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(service.id)}>
                            {service.isFeatured ? (
                              <><StarOff className="h-4 w-4 mr-2" />Remover Destaque</>
                            ) : (
                              <><Star className="h-4 w-4 mr-2" />Destacar</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteService(service.id)}
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

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Nenhum serviço encontrado com os filtros aplicados'
                  : 'Nenhum serviço criado ainda'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Service Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Serviço</DialogTitle>
            <DialogDescription>
              Adicione um novo serviço externo ao portal da prefeitura.
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            onSave={(serviceData) => {
              addService(serviceData);
              setIsCreateModalOpen(false);
              addNotification({
                type: 'success',
                title: 'Serviço criado',
                message: 'O serviço foi criado com sucesso.'
              });
            }}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no serviço selecionado.
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <ServiceForm
              service={editingService}
              onSave={(serviceData) => {
                updateService(editingService.id, serviceData);
                setEditingService(null);
                addNotification({
                  type: 'success',
                  title: 'Serviço atualizado',
                  message: 'As alterações foram salvas com sucesso.'
                });
              }}
              onCancel={() => setEditingService(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Service Modal */}
      <Dialog open={!!previewService} onOpenChange={() => setPreviewService(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visualização do Serviço
            </DialogTitle>
            <DialogDescription>
              Preview de como o serviço aparecerá no site público
            </DialogDescription>
          </DialogHeader>
          {previewService && <ServicePreview service={previewService} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}