import { useState } from 'react';
import { 
  Tag,
  Tags,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  Save,
  X,
  Hash,
  TrendingUp,
  BarChart3,
  Users,
  FileText,
  Calendar,
  Image,
  Grid,
  Eye,
  EyeOff,
  Copy,
  Merge,
  Star,
  Clock,
  ArrowUp,
  ArrowDown,
  Shuffle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  Target,
  Zap,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';
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
import { Checkbox } from '../../ui/checkbox';
import { Progress } from '../../ui/progress';
import { toast } from 'sonner@2.0.3';

interface TagData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  isActive: boolean;
  usage: {
    posts: number;
    events: number;
    pages: number;
    services: number;
    gallery: number;
  };
  popularity: number; // Score baseado no uso
  createdAt: Date;
  updatedAt: Date;
  suggestedBy?: 'user' | 'system';
}

interface TagFormData {
  name: string;
  slug: string;
  description: string;
  color: string;
  isActive: boolean;
}

interface MergeTagsData {
  primaryTagId: string;
  tagsToMerge: string[];
}

export function TagsView() {
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'inactive' | 'popular' | 'unused'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'created' | 'updated'>('name');
  const [selectedTag, setSelectedTag] = useState<TagData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - Tags comuns do portal da Prefeitura
  const [tags, setTags] = useState<TagData[]>([
    {
      id: '1',
      name: 'Urgente',
      slug: 'urgente',
      description: 'Informações que requerem atenção imediata',
      color: '#DC3545',
      isActive: true,
      usage: { posts: 23, events: 8, pages: 2, services: 5, gallery: 1 },
      popularity: 85,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-08-20'),
      suggestedBy: 'user'
    },
    {
      id: '2',
      name: 'Destaque',
      slug: 'destaque',
      description: 'Conteúdo em destaque na página inicial',
      color: '#FFC107',
      isActive: true,
      usage: { posts: 18, events: 12, pages: 4, services: 7, gallery: 3 },
      popularity: 92,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-08-22'),
      suggestedBy: 'user'
    },
    {
      id: '3',
      name: 'Inauguração',
      slug: 'inauguracao',
      description: 'Eventos e obras inaugurados',
      color: '#28A745',
      isActive: true,
      usage: { posts: 15, events: 22, pages: 3, services: 2, gallery: 8 },
      popularity: 78,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-18'),
      suggestedBy: 'user'
    },
    {
      id: '4',
      name: 'Licitação',
      slug: 'licitacao',
      description: 'Processos licitatórios e editais',
      color: '#6C757D',
      isActive: true,
      usage: { posts: 32, events: 5, pages: 12, services: 18, gallery: 0 },
      popularity: 88,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-08-25'),
      suggestedBy: 'user'
    },
    {
      id: '5',
      name: 'Festa Junina',
      slug: 'festa-junina',
      description: 'Eventos relacionados às festividades juninas',
      color: '#FF6B35',
      isActive: true,
      usage: { posts: 8, events: 15, pages: 2, services: 1, gallery: 12 },
      popularity: 65,
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-07-10'),
      suggestedBy: 'system'
    },
    {
      id: '6',
      name: 'Vacinação',
      slug: 'vacinacao',
      description: 'Campanhas de vacinação e saúde preventiva',
      color: '#17A2B8',
      isActive: true,
      usage: { posts: 28, events: 18, pages: 6, services: 12, gallery: 4 },
      popularity: 95,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-08-20'),
      suggestedBy: 'user'
    },
    {
      id: '7',
      name: 'Concurso Público',
      slug: 'concurso-publico',
      description: 'Concursos e processos seletivos',
      color: '#6F42C1',
      isActive: true,
      usage: { posts: 22, events: 8, pages: 15, services: 25, gallery: 2 },
      popularity: 90,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-08-15'),
      suggestedBy: 'user'
    },
    {
      id: '8',
      name: 'Pavimentação',
      slug: 'pavimentacao',
      description: 'Obras de pavimentação e asfaltamento',
      color: '#495057',
      isActive: true,
      usage: { posts: 19, events: 6, pages: 5, services: 8, gallery: 15 },
      popularity: 72,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-08-12'),
      suggestedBy: 'user'
    },
    {
      id: '9',
      name: 'IPTU',
      slug: 'iptu',
      description: 'Informações sobre IPTU e tributos municipais',
      color: '#20C997',
      isActive: true,
      usage: { posts: 12, events: 3, pages: 8, services: 35, gallery: 0 },
      popularity: 85,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-08-10'),
      suggestedBy: 'user'
    },
    {
      id: '10',
      name: 'Meio Ambiente',
      slug: 'meio-ambiente',
      description: 'Ações ambientais e sustentabilidade',
      color: '#228B22',
      isActive: true,
      usage: { posts: 16, events: 11, pages: 7, services: 6, gallery: 9 },
      popularity: 68,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-08-08'),
      suggestedBy: 'user'
    },
    {
      id: '11',
      name: 'Festival de Verão',
      slug: 'festival-verao',
      description: 'Eventos do festival de verão',
      color: '#FF9500',
      isActive: false,
      usage: { posts: 5, events: 8, pages: 1, services: 0, gallery: 6 },
      popularity: 45,
      createdAt: new Date('2023-12-01'),
      updatedAt: new Date('2024-03-01'),
      suggestedBy: 'system'
    },
    {
      id: '12',
      name: 'COVID-19',
      slug: 'covid-19',
      description: 'Informações relacionadas à pandemia',
      color: '#E83E8C',
      isActive: false,
      usage: { posts: 45, events: 12, pages: 8, services: 15, gallery: 3 },
      popularity: 60,
      createdAt: new Date('2020-03-01'),
      updatedAt: new Date('2024-01-01'),
      suggestedBy: 'user'
    }
  ]);

  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    slug: '',
    description: '',
    color: '#144c9c',
    isActive: true
  });

  const [mergeData, setMergeData] = useState<MergeTagsData>({
    primaryTagId: '',
    tagsToMerge: []
  });

  // Hook para seleção em lote
  const bulkSelection = useBulkSelection(tags);

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
      confirmationDescription: 'Esta ação não pode ser desfeita. Tags em uso não podem ser excluídas.'
    }
  ];

  // Cores predefinidas para tags
  const predefinedColors = [
    '#144c9c', '#DC3545', '#28A745', '#FFC107', '#17A2B8',
    '#6F42C1', '#20C997', '#FD7E14', '#E83E8C', '#6C757D',
    '#FF6B35', '#228B22', '#FF9500', '#495057', '#343A40'
  ];

  // Tags sugeridas pelo sistema
  const suggestedTags = [
    'Orçamento Participativo',
    'Eleições 2024',
    'Carnaval 2025',
    'Obras Emergenciais',
    'Audiência Pública',
    'Cidadania',
    'Transparência',
    'Desenvolvimento Social'
  ];

  const getTotalUsage = (tag: TagData) => {
    return tag.usage.posts + tag.usage.events + tag.usage.pages + tag.usage.services + tag.usage.gallery;
  };

  const filteredTags = tags
    .filter(tag => {
      // Filtro por texto
      const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tag.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tag.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // Filtro por status/tipo
      switch (filterBy) {
        case 'active':
          return tag.isActive;
        case 'inactive':
          return !tag.isActive;
        case 'popular':
          return tag.popularity >= 80;
        case 'unused':
          return getTotalUsage(tag) === 0;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return getTotalUsage(b) - getTotalUsage(a);
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'updated':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        default:
          return a.name.localeCompare(b.name);
      }
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

  const handleFormChange = (field: keyof TagFormData, value: any) => {
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
      toast.error('Nome da tag é obrigatório');
      return;
    }

    // Verificar se já existe uma tag com o mesmo nome
    const existingTag = tags.find(tag => 
      tag.name.toLowerCase() === formData.name.toLowerCase() && 
      tag.id !== selectedTag?.id
    );

    if (existingTag) {
      toast.error('Já existe uma tag com este nome');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTag: TagData = {
        id: selectedTag?.id || Date.now().toString(),
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description,
        color: formData.color,
        isActive: formData.isActive,
        usage: selectedTag?.usage || { posts: 0, events: 0, pages: 0, services: 0, gallery: 0 },
        popularity: selectedTag?.popularity || 0,
        createdAt: selectedTag?.createdAt || new Date(),
        updatedAt: new Date(),
        suggestedBy: 'user'
      };

      if (selectedTag) {
        setTags(prev => prev.map(tag => 
          tag.id === selectedTag.id ? newTag : tag
        ));
        toast.success('Tag atualizada com sucesso!');
      } else {
        setTags(prev => [...prev, newTag]);
        toast.success('Tag criada com sucesso!');
      }

      handleCloseDialog();
    } catch (error) {
      toast.error('Erro ao salvar tag');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (tag: TagData) => {
    setSelectedTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || '',
      color: tag.color,
      isActive: tag.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return;

    const hasUsage = getTotalUsage(tag) > 0;
    
    if (hasUsage) {
      toast.error('Não é possível excluir uma tag em uso', {
        description: 'Remova primeiro a tag de todos os conteúdos onde ela está sendo usada.'
      });
      return;
    }

    try {
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      toast.success('Tag excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir tag');
    }
  };

  const handleToggleActive = async (tagId: string) => {
    try {
      setTags(prev => prev.map(tag => 
        tag.id === tagId 
          ? { ...tag, isActive: !tag.isActive, updatedAt: new Date() }
          : tag
      ));
      
      const tag = tags.find(t => t.id === tagId);
      toast.success(`Tag ${tag?.isActive ? 'desativada' : 'ativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao atualizar status da tag');
    }
  };

  const handleBulkAction = async (actionId: string, selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast.error('Selecione pelo menos uma tag');
      return;
    }

    try {
      switch (actionId) {
        case 'activate':
          setTags(prev => prev.map(tag => 
            selectedIds.includes(tag.id) ? { ...tag, isActive: true, updatedAt: new Date() } : tag
          ));
          toast.success(`${selectedIds.length} tags ativadas`);
          break;
          
        case 'deactivate':
          setTags(prev => prev.map(tag => 
            selectedIds.includes(tag.id) ? { ...tag, isActive: false, updatedAt: new Date() } : tag
          ));
          toast.success(`${selectedIds.length} tags desativadas`);
          break;
          
        case 'delete':
          // Verificar se alguma tag tem uso
          const tagsWithUsage = tags.filter(tag => 
            selectedIds.includes(tag.id) && getTotalUsage(tag) > 0
          );
          
          if (tagsWithUsage.length > 0) {
            toast.error(`${tagsWithUsage.length} tags não podem ser excluídas pois estão em uso`);
            return;
          }
          
          setTags(prev => prev.filter(tag => !selectedIds.includes(tag.id)));
          toast.success(`${selectedIds.length} tags excluídas`);
          break;
      }
      
      bulkSelection.clearSelection();
    } catch (error) {
      toast.error('Erro ao executar ação em lote');
    }
  };

  const handleMergeTags = async () => {
    if (!mergeData.primaryTagId || mergeData.tagsToMerge.length === 0) {
      toast.error('Selecione uma tag principal e pelo menos uma tag para mesclar');
      return;
    }

    try {
      const primaryTag = tags.find(t => t.id === mergeData.primaryTagId);
      const tagsToMerge = tags.filter(t => mergeData.tagsToMerge.includes(t.id));
      
      if (!primaryTag) return;

      // Somar os usos das tags mescladas
      const mergedUsage = tagsToMerge.reduce((acc, tag) => ({
        posts: acc.posts + tag.usage.posts,
        events: acc.events + tag.usage.events,
        pages: acc.pages + tag.usage.pages,
        services: acc.services + tag.usage.services,
        gallery: acc.gallery + tag.usage.gallery
      }), primaryTag.usage);

      // Atualizar tag principal
      setTags(prev => prev.map(tag => 
        tag.id === mergeData.primaryTagId 
          ? { 
              ...tag, 
              usage: mergedUsage,
              popularity: Math.min(100, tag.popularity + tagsToMerge.length * 5),
              updatedAt: new Date() 
            }
          : tag
      ).filter(tag => !mergeData.tagsToMerge.includes(tag.id)));

      toast.success(`${mergeData.tagsToMerge.length} tags mescladas com sucesso!`);
      setIsMergeDialogOpen(false);
      setMergeData({ primaryTagId: '', tagsToMerge: [] });
    } catch (error) {
      toast.error('Erro ao mesclar tags');
    }
  };

  const handleCreateSuggested = async (tagName: string) => {
    const newTag: TagData = {
      id: Date.now().toString(),
      name: tagName,
      slug: generateSlug(tagName),
      description: `Tag criada automaticamente: ${tagName}`,
      color: predefinedColors[Math.floor(Math.random() * predefinedColors.length)],
      isActive: true,
      usage: { posts: 0, events: 0, pages: 0, services: 0, gallery: 0 },
      popularity: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      suggestedBy: 'system'
    };

    setTags(prev => [...prev, newTag]);
    toast.success(`Tag "${tagName}" criada!`);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTag(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#144c9c',
      isActive: true
    });
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Tags</h1>
          <p className="text-muted-foreground">
            Organize conteúdo com etiquetas flexíveis e precisas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsMergeDialogOpen(true)}>
            <Merge className="w-4 h-4 mr-2" />
            Mesclar Tags
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tag
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Tags className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{tags.length}</p>
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
                  {tags.filter(t => t.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Populares</p>
                <p className="text-2xl font-bold">
                  {tags.filter(t => t.popularity >= 80).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sem Uso</p>
                <p className="text-2xl font-bold">
                  {tags.filter(t => getTotalUsage(t) === 0).length}
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
                  {tags.reduce((acc, tag) => acc + getTotalUsage(tag), 0)}
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
            Lista de Tags
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Sugestões
          </TabsTrigger>
        </TabsList>

        {/* Lista de Tags */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Tags className="h-4 w-4" />
                Tags ({filteredTags.length})
              </CardTitle>
              <CardDescription>
                Gerencie todas as tags do sistema
              </CardDescription>
              <div className="mt-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="active">Ativas</SelectItem>
                        <SelectItem value="inactive">Inativas</SelectItem>
                        <SelectItem value="popular">Populares</SelectItem>
                        <SelectItem value="unused">Sem Uso</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Nome</SelectItem>
                        <SelectItem value="usage">Uso</SelectItem>
                        <SelectItem value="created">Criação</SelectItem>
                        <SelectItem value="updated">Atualização</SelectItem>
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
                totalItems={filteredTags.length}
                onSelectAll={bulkSelection.selectAll}
                onClearSelection={bulkSelection.clearSelection}
                actions={bulkActions}
                onAction={handleBulkAction}
                itemName="tag"
              />
            </div>
            
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={bulkSelection.selectedCount === filteredTags.length && filteredTags.length > 0}
                        onCheckedChange={bulkSelection.selectAll}
                        aria-label="Selecionar todas"
                      />
                    </TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Popularidade</TableHead>
                    <TableHead>Uso por Tipo</TableHead>
                    <TableHead>Atualizada</TableHead>
                    <TableHead className="text-left">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.map((tag) => {
                    const totalUsage = getTotalUsage(tag);
                    
                    return (
                      <TableRow key={tag.id}>
                        <TableCell>
                          <Checkbox
                            checked={bulkSelection.isSelected(tag.id)}
                            onCheckedChange={() => bulkSelection.selectItem(tag.id)}
                            aria-label={`Selecionar ${tag.name}`}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: tag.color }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{tag.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {tag.slug}
                                </Badge>
                                {tag.suggestedBy === 'system' && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Auto
                                  </Badge>
                                )}
                              </div>
                              {tag.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {tag.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={tag.isActive}
                              onCheckedChange={() => handleToggleActive(tag.id)}
                              size="sm"
                            />
                            <Badge variant={tag.isActive ? 'default' : 'secondary'}>
                              {tag.isActive ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Progress value={tag.popularity} className="flex-1 h-2" />
                              <span className="text-sm text-muted-foreground w-10">
                                {tag.popularity}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {tag.popularity >= 90 && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                              {tag.popularity >= 80 && <TrendingUp className="w-3 h-3 text-green-600" />}
                              {tag.popularity < 50 && <ArrowDown className="w-3 h-3 text-red-500" />}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">{totalUsage}</span>
                              <span className="text-muted-foreground">total</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>{tag.usage.posts}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{tag.usage.events}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Grid className="w-3 h-3" />
                                <span>{tag.usage.services}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Image className="w-3 h-3" />
                                <span>{tag.usage.gallery}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {tag.updatedAt.toLocaleDateString('pt-BR')}
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
                              <DropdownMenuItem onClick={() => handleEdit(tag)}>
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleActive(tag.id)}
                              >
                                {tag.isActive ? (
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
                                onClick={() => handleDelete(tag.id)}
                                className="text-destructive"
                                disabled={totalUsage > 0}
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

              {filteredTags.length === 0 && (
                <div className="text-center py-8">
                  <Tags className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Nenhuma tag encontrada</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Tente buscar com outros termos.' : 'Comece criando uma nova tag.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estatísticas */}
        <TabsContent value="stats">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tags Mais Populares</CardTitle>
                  <CardDescription>
                    Ranking por popularidade e uso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...tags]
                      .filter(t => t.isActive)
                      .sort((a, b) => b.popularity - a.popularity)
                      .slice(0, 8)
                      .map((tag, index) => (
                        <div key={tag.id} className="flex items-center gap-4">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="text-sm text-muted-foreground w-6 text-center">
                              #{index + 1}
                            </div>
                            <div 
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: tag.color }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">{tag.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {getTotalUsage(tag)} usos
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{tag.popularity}%</div>
                            <Progress value={tag.popularity} className="w-20 h-2" />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Tipo</CardTitle>
                  <CardDescription>
                    Como as tags são usadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        label: 'Notícias', 
                        value: tags.reduce((acc, tag) => acc + tag.usage.posts, 0), 
                        color: '#144c9c',
                        icon: FileText
                      },
                      { 
                        label: 'Eventos', 
                        value: tags.reduce((acc, tag) => acc + tag.usage.events, 0), 
                        color: '#228B22',
                        icon: Calendar
                      },
                      { 
                        label: 'Serviços', 
                        value: tags.reduce((acc, tag) => acc + tag.usage.services, 0), 
                        color: '#FFC107',
                        icon: Grid
                      },
                      { 
                        label: 'Galeria', 
                        value: tags.reduce((acc, tag) => acc + tag.usage.gallery, 0), 
                        color: '#DC3545',
                        icon: Image
                      }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <item.icon 
                            className="w-4 h-4" 
                            style={{ color: item.color }}
                          />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tags Criadas por Mês</CardTitle>
                <CardDescription>
                  Evolução da criação de tags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p>Gráfico de evolução será implementado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sugestões */}
        <TabsContent value="suggestions">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tags Sugeridas pelo Sistema</CardTitle>
                <CardDescription>
                  Sugestões baseadas no conteúdo existente e tendências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suggestedTags.map((suggestion) => (
                    <div key={suggestion} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{suggestion}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCreateSuggested(suggestion)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Possíveis Duplicatas</CardTitle>
                <CardDescription>
                  Tags similares que podem ser mescladas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Exemplo de possíveis duplicatas */}
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium">Tags similares encontradas</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Merge className="w-3 h-3 mr-1" />
                        Mesclar
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">COVID-19</Badge>
                      <span className="text-muted-foreground">e</span>
                      <Badge variant="outline">Pandemia</Badge>
                      <span className="text-muted-foreground">(85% similaridade)</span>
                    </div>
                  </div>
                  
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-8 h-8 mx-auto mb-2" />
                    <p>Nenhuma outra duplicata detectada</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de Criação/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedTag ? 'Editar Tag' : 'Nova Tag'}
            </DialogTitle>
            <DialogDescription>
              {selectedTag 
                ? 'Atualize as informações da tag.'
                : 'Preencha as informações da nova tag.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Tag *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Ex: Urgente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleFormChange('slug', e.target.value)}
                  placeholder="urgente"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Descreva quando usar esta tag..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Cor da Tag</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleFormChange('color', e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <div className="flex flex-wrap gap-1 flex-1">
                  {predefinedColors.slice(0, 6).map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border-2 hover:scale-110 transition-transform"
                      style={{ 
                        backgroundColor: color,
                        borderColor: formData.color === color ? '#000' : 'transparent'
                      }}
                      onClick={() => handleFormChange('color', color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="p-3 border rounded-lg bg-muted/30">
              <Label className="text-sm text-muted-foreground mb-2 block">Preview</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: formData.color }}
                />
                <Badge 
                  variant="outline"
                  style={{ 
                    borderColor: formData.color,
                    color: formData.color
                  }}
                >
                  {formData.name || 'Nome da Tag'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Tag Ativa</Label>
                <p className="text-sm text-muted-foreground">
                  Tags inativas não aparecem no site
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
                  {selectedTag ? 'Atualizar' : 'Criar'} Tag
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Mesclagem */}
      <Dialog open={isMergeDialogOpen} onOpenChange={setIsMergeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mesclar Tags</DialogTitle>
            <DialogDescription>
              Una tags similares em uma única tag principal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tag Principal (permanecerá)</Label>
              <Select 
                value={mergeData.primaryTagId}
                onValueChange={(value) => setMergeData(prev => ({ ...prev, primaryTagId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a tag principal" />
                </SelectTrigger>
                <SelectContent>
                  {tags.filter(t => t.isActive).map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags para Mesclar (serão removidas)</Label>
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                {tags
                  .filter(t => t.id !== mergeData.primaryTagId && t.isActive)
                  .map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`merge-${tag.id}`}
                        checked={mergeData.tagsToMerge.includes(tag.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setMergeData(prev => ({
                              ...prev,
                              tagsToMerge: [...prev.tagsToMerge, tag.id]
                            }));
                          } else {
                            setMergeData(prev => ({
                              ...prev,
                              tagsToMerge: prev.tagsToMerge.filter(id => id !== tag.id)
                            }));
                          }
                        }}
                      />
                      <label
                        htmlFor={`merge-${tag.id}`}
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-sm">{tag.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({getTotalUsage(tag)} usos)
                        </span>
                      </label>
                    </div>
                  ))}
              </div>
            </div>

            {mergeData.primaryTagId && mergeData.tagsToMerge.length > 0 && (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>{mergeData.tagsToMerge.length}</strong> tags serão mescladas na tag principal. 
                  Esta ação não pode ser desfeita.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsMergeDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleMergeTags}
              disabled={!mergeData.primaryTagId || mergeData.tagsToMerge.length === 0}
            >
              <Merge className="w-4 h-4 mr-2" />
              Mesclar Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alertas Informativos */}
      <div className="space-y-4">
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            <strong>Dica:</strong> Use tags para classificação granular do conteúdo. 
            Diferente das categorias, tags podem ser aplicadas livremente e em maior quantidade.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Atenção:</strong> Tags com conteúdo associado não podem ser excluídas. 
            Use a função de mesclagem para unificar tags similares.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}