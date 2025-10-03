import { useState } from 'react';
import { 
  Tags,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Search,
  Filter,
  MoreHorizontal,
  Hash,
  Palette,
  Link,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Copy,
  Archive,
  Star,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  Calendar,
  Image,
  Building2,
  Heart,
  Shield,
  Briefcase,
  GraduationCap,
  TreePine,
  Car,
  Users,
  Home,
  Zap,
  Globe,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Alert, AlertDescription } from '../../ui/alert';
import { ScrollArea } from '../../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner@2.0.3';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';
import { Checkbox } from '../../ui/checkbox';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  parentId?: string;
  isActive: boolean;
  order: number;
  usage: {
    posts: number;
    events: number;
    pages: number;
    services: number;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  parentId?: string;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
}

export function CategoriesView() {
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Mock data inicial - categorias da Prefeitura de Timon
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Saúde',
      slug: 'saude',
      description: 'Notícias e informações sobre saúde pública',
      color: '#DC3545',
      icon: 'Heart',
      isActive: true,
      order: 1,
      usage: { posts: 45, events: 12, pages: 8, services: 15 },
      seo: {
        metaTitle: 'Saúde - Prefeitura de Timon',
        metaDescription: 'Acompanhe as últimas notícias e informações sobre saúde pública em Timon'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-20')
    },
    {
      id: '2',
      name: 'Infraestrutura',
      slug: 'infraestrutura',
      description: 'Obras públicas, pavimentação e melhorias urbanas',
      color: '#6C757D',
      icon: 'Building2',
      isActive: true,
      order: 2,
      usage: { posts: 38, events: 8, pages: 12, services: 22 },
      seo: {
        metaTitle: 'Infraestrutura - Prefeitura de Timon',
        metaDescription: 'Acompanhe as obras e melhorias na infraestrutura de Timon'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-18')
    },
    {
      id: '3',
      name: 'Segurança',
      slug: 'seguranca',
      description: 'Segurança pública e ações preventivas',
      color: '#FFC107',
      icon: 'Shield',
      isActive: true,
      order: 3,
      usage: { posts: 28, events: 5, pages: 6, services: 10 },
      seo: {
        metaTitle: 'Segurança - Prefeitura de Timon',
        metaDescription: 'Informações sobre segurança pública e ações preventivas em Timon'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-15')
    },
    {
      id: '4',
      name: 'Educação',
      slug: 'educacao',
      description: 'Ensino, escolas e programas educacionais',
      color: '#28A745',
      icon: 'GraduationCap',
      isActive: true,
      order: 4,
      usage: { posts: 52, events: 18, pages: 15, services: 25 },
      seo: {
        metaTitle: 'Educação - Prefeitura de Timon',
        metaDescription: 'Acompanhe as novidades da educação municipal em Timon'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-22')
    },
    {
      id: '5',
      name: 'Meio Ambiente',
      slug: 'meio-ambiente',
      description: 'Preservação ambiental e sustentabilidade',
      color: '#228B22',
      icon: 'TreePine',
      isActive: true,
      order: 5,
      usage: { posts: 24, events: 9, pages: 7, services: 8 },
      seo: {
        metaTitle: 'Meio Ambiente - Prefeitura de Timon',
        metaDescription: 'Ações ambientais e sustentabilidade em Timon'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-10')
    },
    {
      id: '6',
      name: 'Cultura',
      slug: 'cultura',
      description: 'Eventos culturais, festivais e patrimônio histórico',
      color: '#6F42C1',
      icon: 'Star',
      isActive: true,
      order: 6,
      usage: { posts: 35, events: 25, pages: 10, services: 12 },
      seo: {
        metaTitle: 'Cultura - Prefeitura de Timon',
        metaDescription: 'Descubra a rica cultura e eventos de Timon'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-25')
    },
    {
      id: '7',
      name: 'Esportes',
      slug: 'esportes',
      description: 'Atividades esportivas e recreação',
      color: '#FF6B35',
      icon: 'Zap',
      isActive: true,
      order: 7,
      usage: { posts: 22, events: 15, pages: 5, services: 8 },
      seo: {
        metaTitle: 'Esportes - Prefeitura de Timon',
        metaDescription: 'Acompanhe os esportes e atividades recreativas em Timon'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-12')
    },
    {
      id: '8',
      name: 'Assistência Social',
      slug: 'assistencia-social',
      description: 'Programas sociais e assistência à população',
      color: '#17A2B8',
      icon: 'Users',
      isActive: true,
      order: 8,
      usage: { posts: 41, events: 12, pages: 18, services: 32 },
      seo: {
        metaTitle: 'Assistência Social - Prefeitura de Timon',
        metaDescription: 'Programas de assistência social e apoio à comunidade'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-20')
    }
  ]);

  // Hook para seleção em lote
  const bulkSelection = useBulkSelection(categories);

  // Configuração das ações em lote
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
      confirmationTitle: 'Confirmar Exclusão',
      confirmationDescription: 'Esta ação não pode ser desfeita. Categorias em uso não podem ser excluídas.'
    }
  ];

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    color: '#144c9c',
    icon: 'Hash',
    parentId: '',
    isActive: true,
    metaTitle: '',
    metaDescription: ''
  });

  // Ícones disponíveis
  const availableIcons = [
    { name: 'Heart', label: 'Coração', icon: Heart },
    { name: 'Building2', label: 'Edifício', icon: Building2 },
    { name: 'Shield', label: 'Escudo', icon: Shield },
    { name: 'GraduationCap', label: 'Formatura', icon: GraduationCap },
    { name: 'TreePine', label: 'Árvore', icon: TreePine },
    { name: 'Star', label: 'Estrela', icon: Star },
    { name: 'Zap', label: 'Raio', icon: Zap },
    { name: 'Users', label: 'Usuários', icon: Users },
    { name: 'Car', label: 'Carro', icon: Car },
    { name: 'Home', label: 'Casa', icon: Home },
    { name: 'Briefcase', label: 'Maleta', icon: Briefcase },
    { name: 'Globe', label: 'Globo', icon: Globe },
    { name: 'Hash', label: 'Hashtag', icon: Hash },
    { name: 'FileText', label: 'Documento', icon: FileText }
  ];

  // Cores predefinidas
  const predefinedColors = [
    '#144c9c', '#228B22', '#DC3545', '#FFC107', '#28A745', 
    '#6F42C1', '#FF6B35', '#17A2B8', '#6C757D', '#E83E8C'
  ];

  const filteredCategories = categories.filter(category => {
    // Filtro por busca
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por status
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && category.isActive) ||
                         (statusFilter === 'inactive' && !category.isActive);
    
    // Filtro por tipo (baseado no uso das categorias)
    const matchesType = typeFilter === 'all' ||
                       (typeFilter === 'news' && category.usage.posts > 0) ||
                       (typeFilter === 'pages' && category.usage.pages > 0) ||
                       (typeFilter === 'events' && category.usage.events > 0) ||
                       (typeFilter === 'services' && category.usage.services > 0);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalUsage = (category: Category) => {
    return category.usage.posts + category.usage.events + category.usage.pages + category.usage.services;
  };

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

  const handleFormChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generate slug when name changes
      if (field === 'name' && value) {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCategory: Category = {
        id: selectedCategory?.id || Date.now().toString(),
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        parentId: formData.parentId || undefined,
        isActive: formData.isActive,
        order: selectedCategory?.order || categories.length + 1,
        usage: selectedCategory?.usage || { posts: 0, events: 0, pages: 0, services: 0 },
        seo: {
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription
        },
        createdAt: selectedCategory?.createdAt || new Date(),
        updatedAt: new Date()
      };

      if (selectedCategory) {
        setCategories(prev => prev.map(cat => 
          cat.id === selectedCategory.id ? newCategory : cat
        ));
        toast.success('Categoria atualizada com sucesso!');
      } else {
        setCategories(prev => [...prev, newCategory]);
        toast.success('Categoria criada com sucesso!');
      }

      handleCloseDialog();
    } catch (error) {
      toast.error('Erro ao salvar categoria');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      icon: category.icon,
      parentId: category.parentId || '',
      isActive: category.isActive,
      metaTitle: category.seo.metaTitle || '',
      metaDescription: category.seo.metaDescription || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const hasUsage = totalUsage(category) > 0;
    
    if (hasUsage) {
      toast.error('Não é possível excluir uma categoria em uso', {
        description: 'Remova primeiro todos os itens associados a esta categoria.'
      });
      return;
    }

    try {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success('Categoria excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir categoria');
    }
  };

  const handleToggleActive = async (categoryId: string) => {
    try {
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, isActive: !cat.isActive, updatedAt: new Date() }
          : cat
      ));
      
      const category = categories.find(c => c.id === categoryId);
      toast.success(`Categoria ${category?.isActive ? 'desativada' : 'ativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao atualizar status da categoria');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#144c9c',
      icon: 'Hash',
      parentId: '',
      isActive: true,
      metaTitle: '',
      metaDescription: ''
    });
  };

  const handleDuplicate = (category: Category) => {
    setFormData({
      name: `${category.name} (Cópia)`,
      slug: '',
      description: category.description,
      color: category.color,
      icon: category.icon,
      parentId: category.parentId || '',
      isActive: category.isActive,
      metaTitle: category.seo.metaTitle || '',
      metaDescription: category.seo.metaDescription || ''
    });
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleBulkAction = async (actionId: string, selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast.error('Selecione pelo menos uma categoria');
      return;
    }

    try {
      switch (actionId) {
        case 'activate':
          setCategories(prev => prev.map(category => 
            selectedIds.includes(category.id) ? { ...category, isActive: true, updatedAt: new Date() } : category
          ));
          toast.success(`${selectedIds.length} categorias ativadas`);
          break;
          
        case 'deactivate':
          setCategories(prev => prev.map(category => 
            selectedIds.includes(category.id) ? { ...category, isActive: false, updatedAt: new Date() } : category
          ));
          toast.success(`${selectedIds.length} categorias desativadas`);
          break;
          
        case 'delete':
          // Verificar se alguma categoria tem uso
          const categoriesWithUsage = categories.filter(category => 
            selectedIds.includes(category.id) && totalUsage(category) > 0
          );
          
          if (categoriesWithUsage.length > 0) {
            toast.error(`${categoriesWithUsage.length} categorias não podem ser excluídas pois estão em uso`);
            return;
          }
          
          setCategories(prev => prev.filter(category => !selectedIds.includes(category.id)));
          toast.success(`${selectedIds.length} categorias excluídas`);
          break;
      }
      
      bulkSelection.clearSelection();
    } catch (error) {
      toast.error('Erro ao executar ação em lote');
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find(i => i.name === iconName);
    return iconData ? iconData.icon : Hash;
  };

  const toggleExpanded = (categoryId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Categorias</h1>
          <p className="text-muted-foreground">
            Organize e gerencie as categorias de conteúdo do portal
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Tags className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">
                  {categories.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Archive className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inativas</p>
                <p className="text-2xl font-bold">
                  {categories.filter(c => !c.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uso Total</p>
                <p className="text-2xl font-bold">
                  {categories.reduce((acc, cat) => acc + totalUsage(cat), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Tags className="w-4 h-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        {/* Lista de Categorias */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Tags className="h-4 w-4" />
                Categorias ({filteredCategories.length})
              </CardTitle>
              <CardDescription>
                Lista de todas as categorias disponíveis
              </CardDescription>
              <div className="mt-4 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar categorias..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Ativas</SelectItem>
                        <SelectItem value="inactive">Inativas</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os tipos</SelectItem>
                        <SelectItem value="news">Notícias</SelectItem>
                        <SelectItem value="pages">Páginas</SelectItem>
                        <SelectItem value="events">Eventos</SelectItem>
                        <SelectItem value="services">Serviços</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            {/* Componente de ações em lote */}
            <div className="px-6 pb-4">
              <BulkActions
                selectedIds={bulkSelection.selectedIds}
                totalItems={filteredCategories.length}
                onSelectAll={bulkSelection.selectAll}
                onClearSelection={bulkSelection.clearSelection}
                actions={bulkActions}
                onAction={handleBulkAction}
                itemName="categoria"
              />
            </div>
            
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={bulkSelection.selectedCount === filteredCategories.length && filteredCategories.length > 0}
                        onCheckedChange={bulkSelection.selectAll}
                        aria-label="Selecionar todas"
                      />
                    </TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Atualizada</TableHead>
                    <TableHead className="text-left">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => {
                    const IconComponent = getIconComponent(category.icon);
                    const usage = totalUsage(category);
                    
                    return (
                      <TableRow key={category.id}>
                        <TableCell>
                          <Checkbox
                            checked={bulkSelection.isSelected(category.id)}
                            onCheckedChange={() => bulkSelection.selectItem(category.id)}
                            aria-label={`Selecionar ${category.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <IconComponent 
                                className="w-4 h-4"
                                style={{ color: category.color }}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{category.name}</span>
                                <Badge 
                                  variant="outline"
                                  style={{ 
                                    borderColor: category.color,
                                    color: category.color
                                  }}
                                >
                                  {category.slug}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {category.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={category.isActive}
                              onCheckedChange={() => handleToggleActive(category.id)}
                              size="sm"
                            />
                            <Badge variant={category.isActive ? 'default' : 'secondary'}>
                              {category.isActive ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">{usage}</span>
                              <span className="text-muted-foreground">itens</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <FileText className="w-3 h-3" />
                              <span>{category.usage.posts}</span>
                              <Calendar className="w-3 h-3" />
                              <span>{category.usage.events}</span>
                              <Folder className="w-3 h-3" />
                              <span>{category.usage.pages}</span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {category.updatedAt.toLocaleDateString('pt-BR')}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-left">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(category)}>
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(category)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleActive(category.id)}
                              >
                                {category.isActive ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ativar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(category.id)}
                                className="text-destructive"
                                disabled={usage > 0}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
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

              {filteredCategories.length === 0 && (
                <div className="text-center py-8">
                  <Tags className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Nenhuma categoria encontrada</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Tente buscar com outros termos.' : 'Comece criando uma nova categoria.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estatísticas */}
        <TabsContent value="stats">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[16px]">Categorias Mais Usadas</CardTitle>
                <CardDescription>
                  Ranking de categorias por número de conteúdos associados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...categories]
                    .sort((a, b) => totalUsage(b) - totalUsage(a))
                    .slice(0, 8)
                    .map((category, index) => {
                      const IconComponent = getIconComponent(category.icon);
                      const usage = totalUsage(category);
                      const maxUsage = totalUsage(categories.reduce((a, b) => totalUsage(a) > totalUsage(b) ? a : b));
                      const percentage = maxUsage > 0 ? (usage / maxUsage) * 100 : 0;
                      
                      return (
                        <div key={category.id} className="flex items-center gap-4">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="text-sm text-muted-foreground w-6 text-center">
                              #{index + 1}
                            </div>
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <IconComponent 
                                className="w-4 h-4"
                                style={{ color: category.color }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">{category.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {category.usage.posts} notícias • {category.usage.events} eventos • {category.usage.pages} páginas
                              </div>
                            </div>
                          </div>
                          <div className="text-right min-w-0">
                            <div className="font-medium">{usage} itens</div>
                            <div className="w-24 bg-muted rounded-full h-2 mt-1">
                              <div 
                                className="h-2 rounded-full transition-all"
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: category.color
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Notícias', value: categories.reduce((acc, cat) => acc + cat.usage.posts, 0), color: '#144c9c' },
                      { label: 'Eventos', value: categories.reduce((acc, cat) => acc + cat.usage.events, 0), color: '#228B22' },
                      { label: 'Páginas', value: categories.reduce((acc, cat) => acc + cat.usage.pages, 0), color: '#FFC107' },
                      { label: 'Serviços', value: categories.reduce((acc, cat) => acc + cat.usage.services, 0), color: '#DC3545' }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status das Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Ativas</span>
                      </div>
                      <span className="font-medium">{categories.filter(c => c.isActive).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Archive className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Inativas</span>
                      </div>
                      <span className="font-medium">{categories.filter(c => !c.isActive).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de Criação/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory 
                ? 'Atualize as informações da categoria.'
                : 'Preencha as informações da nova categoria.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Ex: Saúde"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleFormChange('slug', e.target.value)}
                  placeholder="saude"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Descreva o conteúdo desta categoria..."
                rows={3}
              />
            </div>

            {/* Visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cor da Categoria</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleFormChange('color', e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Select 
                    value={formData.color} 
                    onValueChange={(value) => handleFormChange('color', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedColors.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded" 
                              style={{ backgroundColor: color }}
                            />
                            {color}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ícone</Label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => handleFormChange('icon', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon.name} value={icon.name}>
                        <div className="flex items-center gap-2">
                          <icon.icon className="w-4 h-4" />
                          {icon.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <Label className="text-sm text-muted-foreground mb-2 block">Preview</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${formData.color}20` }}
                >
                  {(() => {
                    const IconComponent = getIconComponent(formData.icon);
                    return <IconComponent 
                      className="w-5 h-5"
                      style={{ color: formData.color }}
                    />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formData.name || 'Nome da Categoria'}</span>
                    <Badge 
                      variant="outline"
                      style={{ 
                        borderColor: formData.color,
                        color: formData.color
                      }}
                    >
                      {formData.slug || 'slug'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formData.description || 'Descrição da categoria'}
                  </p>
                </div>
              </div>
            </div>

            {/* SEO */}
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">Configurações SEO</h4>
              
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Título SEO</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleFormChange('metaTitle', e.target.value)}
                  placeholder="Ex: Saúde - Prefeitura de Timon"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Descrição SEO</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleFormChange('metaDescription', e.target.value)}
                  placeholder="Descrição para motores de busca..."
                  rows={2}
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Status da Categoria</Label>
                <p className="text-sm text-muted-foreground">
                  Categorias inativas não aparecem no site
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleFormChange('isActive', checked)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {selectedCategory ? 'Atualizar' : 'Criar'} Categoria
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alertas */}
      <div className="space-y-4">
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            <strong>Dica:</strong> Use cores consistentes para categorias relacionadas e 
            escolha ícones representativos para facilitar a identificação visual.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Atenção:</strong> Categorias com conteúdo associado não podem ser excluídas. 
            Remova primeiro todos os itens da categoria.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}