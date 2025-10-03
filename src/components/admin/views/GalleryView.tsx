import { useState, useEffect } from 'react';
import { useGallery, type GalleryAlbum, type GalleryFormData, type GalleryImage } from '../../GalleryContext';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  Save,
  X,
  Star,
  StarOff,
  Calendar,
  Building,
  Leaf,
  Palette,
  Trophy,
  GraduationCap,
  Heart,
  Grid,
  ArrowUpDown,
  Upload,
  Camera,
  Users,
  TrendingUp,
  Copy,
  ExternalLink,
  Move,
  Settings
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
import { useAdmin } from '../AdminContext';
import { Checkbox } from '../../ui/checkbox';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';

// Mock data da biblioteca de mídia (normalmente viria do MediaView)
const mockMediaLibrary = [
  {
    id: 'media1',
    name: 'escola-fachada.jpg',
    url: '/gallery/escola-fachada.jpg',
    thumbnail: '/gallery/escola-fachada-thumb.jpg',
    dimensions: { width: 1920, height: 1080 },
    alt: 'Fachada da escola municipal'
  },
  {
    id: 'media2',
    name: 'cerimonia-inauguracao.jpg',
    url: '/gallery/cerimonia-inauguracao.jpg',
    thumbnail: '/gallery/cerimonia-inauguracao-thumb.jpg',
    dimensions: { width: 1920, height: 1080 },
    alt: 'Cerimônia de inauguração'
  },
  {
    id: 'media3',
    name: 'salas-aula.jpg',
    url: '/gallery/salas-aula.jpg',
    thumbnail: '/gallery/salas-aula-thumb.jpg',
    dimensions: { width: 1920, height: 1080 },
    alt: 'Salas de aula modernas'
  },
  {
    id: 'media4',
    name: 'vacinacao-ubs.jpg',
    url: '/gallery/vacinacao-ubs.jpg',
    thumbnail: '/gallery/vacinacao-ubs-thumb.jpg',
    dimensions: { width: 1920, height: 1080 },
    alt: 'Vacinação na UBS'
  }
];

const iconMap = {
  'Calendar': Calendar,
  'Building': Building,
  'Leaf': Leaf,
  'Palette': Palette,
  'Trophy': Trophy,
  'GraduationCap': GraduationCap,
  'Heart': Heart,
  'Grid': Grid
};

export function GalleryView() {
  const { setBreadcrumbs, addNotification } = useAdmin();
  const { 
    albums, 
    addAlbum, 
    updateAlbum, 
    deleteAlbum, 
    toggleAlbumStatus,
    toggleAlbumFeatured,
    addImageToAlbum,
    updateImageInAlbum,
    removeImageFromAlbum,
    toggleImageStatus,
    toggleImageFeatured,
    getFeaturedAlbums,
    getPublicAlbums,
    getCategoryLabel,
    getCategoryColor,
    getCategoryIcon,
    getTotalImages,
    getTotalViews
  } = useGallery();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [managingAlbum, setManagingAlbum] = useState<GalleryAlbum | null>(null);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    setBreadcrumbs([{ label: 'Galeria' }]);
  }, [setBreadcrumbs]);

  const filteredAlbums = albums
    .filter(album => {
      const matchesSearch = album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           album.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || album.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'public' && album.isPublic) ||
        (statusFilter === 'private' && !album.isPublic) ||
        (statusFilter === 'featured' && album.isFeatured);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => a.order - b.order);

  const featuredAlbums = getFeaturedAlbums();
  const publicAlbums = getPublicAlbums();

  // Bulk actions
  const bulkSelection = useBulkSelection(filteredAlbums);

  const handleDeleteAlbum = (albumId: string) => {
    deleteAlbum(albumId);
    addNotification({
      type: 'success',
      title: 'Álbum excluído',
      message: 'O álbum foi excluído com sucesso.'
    });
  };

  const handleToggleStatus = (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    toggleAlbumStatus(albumId);
    addNotification({
      type: 'success',
      title: `Álbum ${album?.isPublic ? 'ocultado' : 'publicado'}`,
      message: `O álbum foi ${album?.isPublic ? 'ocultado' : 'publicado'} com sucesso.`
    });
  };

  const handleToggleFeatured = (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    toggleAlbumFeatured(albumId);
    addNotification({
      type: 'success',
      title: `Álbum ${album?.isFeatured ? 'removido dos' : 'adicionado aos'} destaques`,
      message: `O álbum foi ${album?.isFeatured ? 'removido dos' : 'adicionado aos'} destaques.`
    });
  };

  const handleAddImagesToAlbum = () => {
    if (!managingAlbum || selectedImages.length === 0) return;

    selectedImages.forEach(mediaId => {
      const mediaItem = mockMediaLibrary.find(m => m.id === mediaId);
      if (mediaItem) {
        addImageToAlbum(managingAlbum.id, {
          mediaId: mediaItem.id,
          title: mediaItem.name.split('.')[0].replace(/-/g, ' '),
          alt: mediaItem.alt,
          url: mediaItem.url,
          thumbnail: mediaItem.thumbnail,
          dimensions: mediaItem.dimensions,
          isPublic: true,
          isFeatured: false
        });
      }
    });

    setSelectedImages([]);
    setIsMediaSelectorOpen(false);
    addNotification({
      type: 'success',
      title: 'Imagens adicionadas',
      message: `${selectedImages.length} imagem(ns) adicionada(s) ao álbum.`
    });
  };

  // Bulk actions handlers
  const handleBulkAction = (actionId: string, selectedIds: string[]) => {
    switch (actionId) {
      case 'delete':
        selectedIds.forEach(id => deleteAlbum(id));
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} álbum${selectedIds.length !== 1 ? 's' : ''} excluído${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os álbuns selecionados foram excluídos com sucesso.'
        });
        break;
        
      case 'publish':
        selectedIds.forEach(id => {
          const album = albums.find(a => a.id === id);
          if (album && !album.isPublic) {
            toggleAlbumStatus(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} álbum${selectedIds.length !== 1 ? 's' : ''} publicado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os álbuns selecionados foram publicados com sucesso.'
        });
        break;
        
      case 'unpublish':
        selectedIds.forEach(id => {
          const album = albums.find(a => a.id === id);
          if (album && album.isPublic) {
            toggleAlbumStatus(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} álbum${selectedIds.length !== 1 ? 's' : ''} ocultado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os álbuns selecionados foram ocultados com sucesso.'
        });
        break;
        
      case 'feature':
        selectedIds.forEach(id => {
          const album = albums.find(a => a.id === id);
          if (album && !album.isFeatured) {
            toggleAlbumFeatured(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} álbum${selectedIds.length !== 1 ? 's' : ''} destacado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os álbuns selecionados foram adicionados aos destaques.'
        });
        break;
        
      case 'unfeature':
        selectedIds.forEach(id => {
          const album = albums.find(a => a.id === id);
          if (album && album.isFeatured) {
            toggleAlbumFeatured(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} álbum${selectedIds.length !== 1 ? 's' : ''} removido${selectedIds.length !== 1 ? 's' : ''} dos destaques`,
          message: 'Os álbuns selecionados foram removidos dos destaques.'
        });
        break;
    }
  };

  const bulkActions: BulkAction[] = [
    {
      id: 'publish',
      label: 'Publicar',
      icon: Eye,
      variant: 'outline'
    },
    {
      id: 'unpublish',
      label: 'Ocultar',
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
      confirmationTitle: 'Excluir álbuns selecionados',
      confirmationDescription: 'Esta ação não pode ser desfeita. Os álbuns selecionados e todas as suas imagens serão permanentemente removidos.'
    }
  ];

  const AlbumForm = ({ album, onSave, onCancel }: {
    album?: GalleryAlbum;
    onSave: (albumData: GalleryFormData) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<GalleryFormData>({
      name: album?.name || '',
      description: album?.description || '',
      slug: album?.slug || '',
      category: album?.category || 'outros',
      coverImageId: album?.coverImageId || '',
      isPublic: album?.isPublic ?? true,
      isFeatured: album?.isFeatured ?? false,
      order: album?.order || (albums.length + 1)
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

    const handleSubmit = () => {
      if (!formData.name || !formData.description) {
        addNotification({
          type: 'error',
          title: 'Campos obrigatórios',
          message: 'Nome e descrição são obrigatórios.'
        });
        return;
      }

      onSave(formData);
    };

    return (
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Álbum *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nome do álbum"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o conteúdo do álbum"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL/Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="url-do-album"
            />
            <p className="text-xs text-muted-foreground">
              URL será: /galeria/{formData.slug}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eventos">Eventos</SelectItem>
                  <SelectItem value="obras">Obras Públicas</SelectItem>
                  <SelectItem value="natureza">Natureza e Meio Ambiente</SelectItem>
                  <SelectItem value="cultura">Cultura e Arte</SelectItem>
                  <SelectItem value="esportes">Esportes e Lazer</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Álbum Público</Label>
              <p className="text-sm text-muted-foreground">
                Controla se o álbum aparece no site público
              </p>
            </div>
            <Switch
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Álbum em Destaque</Label>
              <p className="text-sm text-muted-foreground">
                Aparece na seção de álbuns em destaque
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
            {album ? 'Atualizar Álbum' : 'Criar Álbum'}
          </Button>
        </div>
      </Tabs>
    );
  };

  const MediaSelector = () => (
    <Dialog open={isMediaSelectorOpen} onOpenChange={setIsMediaSelectorOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Imagens da Biblioteca</DialogTitle>
          <DialogDescription>
            Escolha as imagens que deseja adicionar ao álbum "{managingAlbum?.name}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedImages.length} imagem(ns) selecionada(s)
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedImages([])}
              disabled={selectedImages.length === 0}
            >
              Limpar Seleção
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockMediaLibrary.map((media) => (
              <div 
                key={media.id}
                className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedImages.includes(media.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  if (selectedImages.includes(media.id)) {
                    setSelectedImages(prev => prev.filter(id => id !== media.id));
                  } else {
                    setSelectedImages(prev => [...prev, media.id]);
                  }
                }}
              >
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedImages.includes(media.id)}
                    onCheckedChange={() => {}}
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>
                
                <div className="aspect-square">
                  <img
                    src={media.thumbnail}
                    alt={media.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{media.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {media.dimensions.width}×{media.dimensions.height}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsMediaSelectorOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddImagesToAlbum}
              disabled={selectedImages.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar {selectedImages.length} Imagem(ns)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const AlbumManager = ({ album }: { album: GalleryAlbum }) => (
    <Dialog open={!!managingAlbum} onOpenChange={() => setManagingAlbum(null)}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Gerenciar Álbum: {album.name}
          </DialogTitle>
          <DialogDescription>
            Adicione, edite e organize as imagens do álbum.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Controles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {album.images.length} imagem(ns)
              </Badge>
              <Badge 
                variant={album.isPublic ? "default" : "secondary"}
              >
                {album.isPublic ? 'Público' : 'Privado'}
              </Badge>
              {album.isFeatured && (
                <Badge variant="default">
                  <Star className="h-3 w-3 mr-1" />
                  Destaque
                </Badge>
              )}
            </div>
            
            <Button onClick={() => setIsMediaSelectorOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Imagens
            </Button>
          </div>

          {/* Grid de Imagens */}
          {album.images.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma imagem no álbum
              </h3>
              <p className="text-gray-600 mb-4">
                Adicione imagens da biblioteca de mídia para começar.
              </p>
              <Button onClick={() => setIsMediaSelectorOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Imagem
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {album.images
                .sort((a, b) => a.order - b.order)
                .map((image) => (
                  <Card key={image.id} className="group">
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-3">
                        <img
                          src={image.thumbnail}
                          alt={image.alt}
                          className="w-full h-full object-cover rounded-md"
                        />
                        
                        {/* Badges de Status */}
                        <div className="absolute top-2 left-2 flex gap-1">
                          {image.isFeatured && (
                            <Badge className="text-xs">
                              <Star className="h-3 w-3" />
                            </Badge>
                          )}
                          {!image.isPublic && (
                            <Badge variant="secondary" className="text-xs">
                              Privado
                            </Badge>
                          )}
                        </div>

                        {/* Menu de Ações */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toggleImageStatus(album.id, image.id)}
                              >
                                {image.isPublic ? (
                                  <><EyeOff className="mr-2 h-4 w-4" />Ocultar</>
                                ) : (
                                  <><Eye className="mr-2 h-4 w-4" />Publicar</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toggleImageFeatured(album.id, image.id)}
                              >
                                {image.isFeatured ? (
                                  <><StarOff className="mr-2 h-4 w-4" />Remover Destaque</>
                                ) : (
                                  <><Star className="mr-2 h-4 w-4" />Destacar</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => removeImageFromAlbum(album.id, image.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm line-clamp-2">{image.title}</h4>
                        {image.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {image.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{image.dimensions.width}×{image.dimensions.height}</span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {image.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {image.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Galeria</h1>
          <p className="text-muted-foreground">
            Organize imagens em álbuns categorizados para exibição pública
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Álbum
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Álbuns</p>
                <p className="text-2xl font-bold">{albums.length}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Públicos</p>
                <p className="text-2xl font-bold text-green-600">
                  {publicAlbums.length}
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
                  {featuredAlbums.length}
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
                <p className="text-sm text-muted-foreground">Total Imagens</p>
                <p className="text-2xl font-bold">
                  {getTotalImages()}
                </p>
              </div>
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Albums Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[16px]">
            <ImageIcon className="h-4 w-4" />
            Galeria Pública ({filteredAlbums.length})
          </CardTitle>
          <CardDescription>
            Gerencie álbuns de fotos, eventos e imagens institucionais da prefeitura
          </CardDescription>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar álbuns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="eventos">Eventos</SelectItem>
                  <SelectItem value="obras">Obras Públicas</SelectItem>
                  <SelectItem value="natureza">Natureza e Meio Ambiente</SelectItem>
                  <SelectItem value="cultura">Cultura e Arte</SelectItem>
                  <SelectItem value="esportes">Esportes e Lazer</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Eye className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="public">Públicos</SelectItem>
                  <SelectItem value="private">Privados</SelectItem>
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
              totalItems={filteredAlbums.length}
              onSelectAll={bulkSelection.selectAll}
              onClearSelection={bulkSelection.clearSelection}
              actions={bulkActions}
              onAction={handleBulkAction}
              itemName="álbum"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={bulkSelection.selectedIds.length === filteredAlbums.length && filteredAlbums.length > 0}
                    onCheckedChange={bulkSelection.selectAll}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
                <TableHead>Álbum</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Imagens</TableHead>
                <TableHead>Visualizações</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlbums.map((album) => {
                const IconComponent = iconMap[getCategoryIcon(album.category) as keyof typeof iconMap] || Grid;
                const coverImage = album.images.find(img => img.id === album.coverImageId) || album.images[0];
                
                return (
                  <TableRow key={album.id}>
                    <TableCell>
                      <Checkbox
                        checked={bulkSelection.isSelected(album.id)}
                        onCheckedChange={() => bulkSelection.selectItem(album.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {coverImage ? (
                            <img
                              src={coverImage.thumbnail}
                              alt={coverImage.alt}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{album.name}</span>
                            {album.isFeatured && <Star className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {album.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" style={{ color: getCategoryColor(album.category) }} />
                        <Badge 
                          variant="outline"
                          style={{ backgroundColor: getCategoryColor(album.category) + '20' }}
                        >
                          {getCategoryLabel(album.category)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <span>{album.images.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{album.views.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {album.isPublic ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">
                          {album.isPublic ? 'Público' : 'Privado'}
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
                          <DropdownMenuItem onClick={() => setManagingAlbum(album)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Gerenciar Imagens
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingAlbum(album)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(album.id)}>
                            {album.isPublic ? (
                              <><EyeOff className="h-4 w-4 mr-2" />Ocultar</>
                            ) : (
                              <><Eye className="h-4 w-4 mr-2" />Publicar</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(album.id)}>
                            {album.isFeatured ? (
                              <><StarOff className="h-4 w-4 mr-2" />Remover Destaque</>
                            ) : (
                              <><Star className="h-4 w-4 mr-2" />Destacar</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteAlbum(album.id)}
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

          {filteredAlbums.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Nenhum álbum encontrado com os filtros aplicados'
                  : 'Nenhum álbum criado ainda'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Album Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Álbum</DialogTitle>
            <DialogDescription>
              Crie um novo álbum para organizar suas imagens.
            </DialogDescription>
          </DialogHeader>
          <AlbumForm
            onSave={(albumData) => {
              addAlbum(albumData);
              setIsCreateModalOpen(false);
              addNotification({
                type: 'success',
                title: 'Álbum criado',
                message: 'O álbum foi criado com sucesso.'
              });
            }}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Album Modal */}
      <Dialog open={!!editingAlbum} onOpenChange={() => setEditingAlbum(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Álbum</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no álbum selecionado.
            </DialogDescription>
          </DialogHeader>
          {editingAlbum && (
            <AlbumForm
              album={editingAlbum}
              onSave={(albumData) => {
                updateAlbum(editingAlbum.id, albumData);
                setEditingAlbum(null);
                addNotification({
                  type: 'success',
                  title: 'Álbum atualizado',
                  message: 'As alterações foram salvas com sucesso.'
                });
              }}
              onCancel={() => setEditingAlbum(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Album Manager */}
      {managingAlbum && <AlbumManager album={managingAlbum} />}

      {/* Media Selector */}
      <MediaSelector />
    </div>
  );
}