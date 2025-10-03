import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  FileText,
  Calendar,
  User,
  BarChart3,
  Tag,
  Image as ImageIcon,
  Save,
  X
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
  DialogDescription,
  DialogFooter 
} from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { RichTextEditor } from '../components/RichTextEditor';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { Separator } from '../../ui/separator';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Checkbox } from '../../ui/checkbox';
import { useAdmin } from '../AdminContext';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  authorEmail: string;
  category: string;
  tags: string[];
  date: string;
  publishedDate?: string;
  views: number;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export function PostsView() {
  const { addNotification } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<any>(null);

  // Mock data - em produção viria da API
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: 'Nova Unidade Básica de Saúde inaugurada no Bairro São José',
      excerpt: 'A UBS vai atender mais de 5 mil famílias da região com serviços de saúde primária e especializada.',
      content: 'Conteúdo completo da notícia...',
      status: 'published',
      author: 'Maria Silva',
      authorEmail: 'maria.silva@timon.ma.gov.br',
      category: 'Saúde',
      tags: ['UBS', 'Saúde Pública', 'São José'],
      date: '2025-08-15T10:30:00',
      publishedDate: '2025-08-15T10:30:00',
      views: 1234,
      coverImage: 'https://images.unsplash.com/photo-1605934079907-5028658e4cab?w=300',
      seoTitle: 'Nova UBS no Bairro São José - Prefeitura de Timon',
      seoDescription: 'Inauguração da nova Unidade Básica de Saúde beneficiará mais de 5 mil famílias.'
    },
    {
      id: 2,
      title: 'Programa de Pavimentação Asfáltica atinge 80% das obras',
      excerpt: 'Mais 15 ruas receberam asfalto neste mês, melhorando a mobilidade urbana na cidade.',
      content: 'Conteúdo completo da notícia...',
      status: 'published',
      author: 'João Santos',
      authorEmail: 'joao.santos@timon.ma.gov.br',
      category: 'Infraestrutura',
      tags: ['Pavimentação', 'Obras', 'Mobilidade'],
      date: '2025-08-12T14:15:00',
      publishedDate: '2025-08-12T14:15:00',
      views: 987,
      coverImage: 'https://images.unsplash.com/photo-1595176889189-bbc4a4af88aa?w=300'
    },
    {
      id: 3,
      title: 'Festival de Cultura Popular movimenta o centro da cidade',
      excerpt: 'Evento celebra as tradições culturais timonenses com shows e exposições.',
      content: 'Conteúdo completo da notícia...',
      status: 'draft',
      author: 'Ana Costa',
      authorEmail: 'ana.costa@timon.ma.gov.br',
      category: 'Cultura',
      tags: ['Festival', 'Cultura', 'Tradições'],
      date: '2025-08-10T16:00:00',
      views: 0,
      coverImage: 'https://images.unsplash.com/photo-1678544759093-2cae8fa21c9e?w=300'
    }
  ]);

  const categories = ['Saúde', 'Infraestrutura', 'Cultura', 'Educação', 'Meio Ambiente', 'Esporte'];
  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'published', label: 'Publicados' },
    { value: 'draft', label: 'Rascunhos' },
    { value: 'archived', label: 'Arquivados' }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Bulk actions usando o hook padrão
  const bulkSelection = useBulkSelection(filteredPosts);

  // Configuração das ações em lote
  const bulkActions: BulkAction[] = [
    {
      id: 'publish',
      label: 'Publicar',
      icon: Eye,
      variant: 'outline'
    },
    {
      id: 'unpublish',
      label: 'Despublicar',
      icon: EyeOff,
      variant: 'outline'
    },
    {
      id: 'archive',
      label: 'Arquivar',
      icon: FileText,
      variant: 'outline'
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: Trash2,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationTitle: 'Excluir notícias selecionadas',
      confirmationDescription: 'Esta ação não pode ser desfeita. As notícias selecionadas serão permanentemente removidas.'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Publicado</Badge>;
      case 'draft':
        return <Badge variant="secondary">Rascunho</Badge>;
      case 'archived':
        return <Badge variant="outline">Arquivado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleToggleStatus = (postId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, status: newStatus as 'published' | 'draft' | 'archived' }
        : post
    ));
    
    addNotification({
      type: 'success',
      title: `Post ${newStatus === 'published' ? 'publicado' : 'despublicado'}`,
      message: `O post foi ${newStatus === 'published' ? 'publicado' : 'movido para rascunho'} com sucesso.`
    });
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
    addNotification({
      type: 'success',
      title: 'Post excluído',
      message: 'O post foi excluído com sucesso.'
    });
  };

  // Handler para ações em lote
  const handleBulkAction = (actionId: string, selectedIds: string[]) => {
    switch (actionId) {
      case 'publish':
        selectedIds.forEach(id => {
          const numericId = parseInt(id);
          const post = posts.find(p => p.id === numericId);
          if (post && post.status !== 'published') {
            setPosts(prev => prev.map(p => 
              p.id === numericId ? { ...p, status: 'published' as const } : p
            ));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} notícia${selectedIds.length !== 1 ? 's' : ''} publicada${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As notícias selecionadas foram publicadas com sucesso.'
        });
        break;
        
      case 'unpublish':
        selectedIds.forEach(id => {
          const numericId = parseInt(id);
          const post = posts.find(p => p.id === numericId);
          if (post && post.status === 'published') {
            setPosts(prev => prev.map(p => 
              p.id === numericId ? { ...p, status: 'draft' as const } : p
            ));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} notícia${selectedIds.length !== 1 ? 's' : ''} despublicada${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As notícias selecionadas foram movidas para rascunho.'
        });
        break;
        
      case 'archive':
        selectedIds.forEach(id => {
          const numericId = parseInt(id);
          setPosts(prev => prev.map(p => 
            p.id === numericId ? { ...p, status: 'archived' as const } : p
          ));
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} notícia${selectedIds.length !== 1 ? 's' : ''} arquivada${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As notícias selecionadas foram arquivadas com sucesso.'
        });
        break;
        
      case 'delete':
        selectedIds.forEach(id => {
          const numericId = parseInt(id);
          setPosts(prev => prev.filter(p => p.id !== numericId));
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} notícia${selectedIds.length !== 1 ? 's' : ''} excluída${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As notícias selecionadas foram excluídas com sucesso.'
        });
        break;
    }
  };

  // Mock biblioteca de mídia
  const mockMediaLibrary = [
    { id: 1, url: 'https://images.unsplash.com/photo-1605934079907-5028658e4cab?w=800', alt: 'UBS - Unidade Básica de Saúde', name: 'ubs-timon.jpg' },
    { id: 2, url: 'https://images.unsplash.com/photo-1595176889189-bbc4a4af88aa?w=800', alt: 'Obras de Pavimentação', name: 'pavimentacao-timon.jpg' },
    { id: 3, url: 'https://images.unsplash.com/photo-1678544759093-2cae8fa21c9e?w=800', alt: 'Festival Cultural', name: 'cultura-timon.jpg' },
    { id: 4, url: 'https://images.unsplash.com/photo-1722865061205-a99bc25b536d?w=800', alt: 'Meio Ambiente', name: 'meio-ambiente-timon.jpg' },
    { id: 5, url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800', alt: 'Educação', name: 'educacao-timon.jpg' },
    { id: 6, url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800', alt: 'Esportes', name: 'esportes-timon.jpg' },
    { id: 7, url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800', alt: 'Administração Pública', name: 'prefeitura-timon.jpg' },
    { id: 8, url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', alt: 'Assistência Social', name: 'assistencia-social.jpg' },
  ];

  const PostForm = ({ post, onSave, onCancel, formData, setFormData }: {
    post?: Post;
    onSave: (postData: Partial<Post>) => void;
    onCancel: () => void;
    formData: any;
    setFormData: (data: any) => void;
  }) => {

    const handleSubmit = (status: 'published' | 'draft') => {
      const postData = {
        ...formData,
        status,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        date: new Date().toISOString(),
        author: 'Usuário Atual',
        authorEmail: 'usuario@timon.ma.gov.br',
        views: post?.views || 0,
        coverImage: formData.coverImage
      };
      onSave(postData);
    };

    return (
      <div className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Digite o título da notícia"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Resumo</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Breve resumo da notícia"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content">Conteúdo *</Label>
            <div className="mt-1">
              <RichTextEditor
                id="content"
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Escreva o conteúdo completo da notícia usando o editor rich-text..."
              />
            </div>
          </div>

          <div>
            <Label>Imagem de Capa</Label>
            <div className="mt-2">
              {formData.coverImage ? (
                <div className="relative">
                  <div className="relative w-full max-w-md h-32 border border-border rounded-lg overflow-hidden">
                    <img
                      src={formData.coverImage}
                      alt="Capa selecionada"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsMediaSelectorOpen(true)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Alterar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => setFormData({ ...formData, coverImage: '' })}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMediaSelectorOpen(true)}
                  className="w-full max-w-md h-32 border-2 border-dashed border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm">Clique para selecionar uma imagem</span>
                    <span className="text-xs text-muted-foreground">Escolha da biblioteca de mídia</span>
                  </div>
                </Button>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                A imagem de capa será exibida no card da notícia e no topo do artigo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Tags separadas por vírgula"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">SEO</h4>
          <div>
            <Label htmlFor="seoTitle">Título SEO</Label>
            <Input
              id="seoTitle"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="Título otimizado para SEO"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="seoDescription">Meta Descrição</Label>
            <Textarea
              id="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="Descrição para mecanismos de busca"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => handleSubmit('draft')}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button onClick={() => handleSubmit('published')}>
              <FileText className="h-4 w-4 mr-2" />
              Publicar
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const MediaSelector = () => (
    <Dialog open={isMediaSelectorOpen} onOpenChange={setIsMediaSelectorOpen}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Imagem de Capa</DialogTitle>
          <DialogDescription>
            Escolha uma imagem da biblioteca de mídia para usar como capa da notícia.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
          {mockMediaLibrary.map((media) => (
            <div
              key={media.id}
              className="relative group cursor-pointer border-2 border-transparent hover:border-primary rounded-lg overflow-hidden transition-all"
              onClick={() => {
                if (currentFormData) {
                  setCurrentFormData({ ...currentFormData, coverImage: media.url });
                }
                setIsMediaSelectorOpen(false);
              }}
            >
              <div className="aspect-video bg-muted">
                <img
                  src={media.url}
                  alt={media.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="secondary">
                  Selecionar
                </Button>
              </div>
              <div className="p-2 bg-card">
                <p className="text-xs font-medium truncate">{media.name}</p>
                <p className="text-xs text-muted-foreground truncate">{media.alt}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsMediaSelectorOpen(false)}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Notícias</h1>
          <p className="text-muted-foreground">
            Crie e gerencie notícias e artigos do site
          </p>
        </div>
        <Button onClick={() => {
          setCurrentFormData({
            title: '',
            excerpt: '',
            content: '',
            category: '',
            tags: '',
            seoTitle: '',
            seoDescription: '',
            coverImage: ''
          });
          setIsCreateModalOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Notícia
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{posts.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Publicados</p>
                <p className="text-2xl font-bold text-green-600">
                  {posts.filter(p => p.status === 'published').length}
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
                <p className="text-sm text-muted-foreground">Rascunhos</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
              <EyeOff className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[16px] flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notícias ({filteredPosts.length})
          </CardTitle>
          <CardDescription>
            Gerencie notícias, artigos e comunicados oficiais da prefeitura
          </CardDescription>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar notícias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        {/* Componente de ações em lote */}
        <div className="px-6 pb-4">
          <BulkActions
            selectedIds={bulkSelection.selectedIds}
            totalItems={filteredPosts.length}
            onSelectAll={bulkSelection.selectAll}
            onClearSelection={bulkSelection.clearSelection}
            actions={bulkActions}
            onAction={handleBulkAction}
            itemName="notícia"
          />
        </div>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={bulkSelection.selectedIds.length === filteredPosts.length && filteredPosts.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        bulkSelection.selectAll();
                      } else {
                        bulkSelection.clearSelection();
                      }
                    }}
                    aria-label="Selecionar todas as notícias"
                  />
                </TableHead>
                <TableHead>Notícia</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="w-[50px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox
                      checked={bulkSelection.selectedIds.includes(post.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          bulkSelection.select(post.id);
                        } else {
                          bulkSelection.unselect(post.id);
                        }
                      }}
                      aria-label={`Selecionar notícia ${post.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          alt=""
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {post.excerpt}
                        </p>
                        {post.tags.length > 0 && (
                          <div className="flex items-center mt-1 space-x-1">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {post.tags.slice(0, 2).join(', ')}
                              {post.tags.length > 2 && '...'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{post.author}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {post.authorEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(post.date).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BarChart3 className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-sm">{post.views.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setCurrentFormData({
                            title: post.title || '',
                            excerpt: post.excerpt || '',
                            content: post.content || '',
                            category: post.category || '',
                            tags: post.tags?.join(', ') || '',
                            seoTitle: post.seoTitle || '',
                            seoDescription: post.seoDescription || '',
                            coverImage: post.coverImage || ''
                          });
                          setEditingPost(post);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(post.id, post.status)}
                        >
                          {post.status === 'published' ? (
                            <><EyeOff className="h-4 w-4 mr-2" />Despublicar</>
                          ) : (
                            <><Eye className="h-4 w-4 mr-2" />Publicar</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeletePost(post.id)}
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

          {filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Nenhuma notícia encontrada com os filtros aplicados'
                  : 'Nenhuma notícia criada ainda'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Post Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Notícia</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar uma nova notícia para o site da Prefeitura.
            </DialogDescription>
          </DialogHeader>
          <PostForm
            formData={currentFormData || {
              title: '',
              excerpt: '',
              content: '',
              category: '',
              tags: '',
              seoTitle: '',
              seoDescription: '',
              coverImage: ''
            }}
            setFormData={setCurrentFormData}
            onSave={(postData) => {
              const newPost: Post = {
                id: Date.now(),
                ...postData,
                views: 0
              } as Post;
              setPosts([newPost, ...posts]);
              setIsCreateModalOpen(false);
              setCurrentFormData(null);
              addNotification({
                type: 'success',
                title: 'Notícia criada',
                message: `A notícia foi ${postData.status === 'published' ? 'publicada' : 'salva como rascunho'} com sucesso.`
              });
            }}
            onCancel={() => {
              setIsCreateModalOpen(false);
              setCurrentFormData(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Post Modal */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Notícia</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias na notícia selecionada.
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <PostForm
              post={editingPost}
              formData={currentFormData || {
                title: editingPost.title || '',
                excerpt: editingPost.excerpt || '',
                content: editingPost.content || '',
                category: editingPost.category || '',
                tags: editingPost.tags?.join(', ') || '',
                seoTitle: editingPost.seoTitle || '',
                seoDescription: editingPost.seoDescription || '',
                coverImage: editingPost.coverImage || ''
              }}
              setFormData={setCurrentFormData}
              onSave={(postData) => {
                setPosts(posts.map(post => 
                  post.id === editingPost.id 
                    ? { ...post, ...postData }
                    : post
                ));
                setEditingPost(null);
                setCurrentFormData(null);
                addNotification({
                  type: 'success',
                  title: 'Notícia atualizada',
                  message: 'As alterações foram salvas com sucesso.'
                });
              }}
              onCancel={() => {
                setEditingPost(null);
                setCurrentFormData(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Media Selector Modal */}
      <MediaSelector />
    </div>
  );
}