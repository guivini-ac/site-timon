import { useState, useEffect } from 'react';
import { useSlides, type Slide } from '../../SlidesContext';
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
  GripVertical,
  Link as LinkIcon,
  Upload,
  Monitor,
  Smartphone,
  MousePointer
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
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
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Checkbox } from '../../ui/checkbox';
import { useAdmin } from '../AdminContext';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';

export function CarouselView() {
  const { setBreadcrumbs, addNotification } = useAdmin();
  const { 
    slides, 
    addSlide, 
    updateSlide, 
    deleteSlide, 
    toggleSlideStatus, 
    reorderSlides 
  } = useSlides();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<string>('');
  const [draggedItem, setDraggedItem] = useState<Slide | null>(null);

  // Mock media library
  const mockMediaLibrary = [
    { id: 1, url: 'https://images.unsplash.com/photo-1605934079907-5028658e4cab?w=800', alt: 'UBS' },
    { id: 2, url: 'https://images.unsplash.com/photo-1595176889189-bbc4a4af88aa?w=800', alt: 'Pavimentação' },
    { id: 3, url: 'https://images.unsplash.com/photo-1678544759093-2cae8fa21c9e?w=800', alt: 'Cultura' },
    { id: 4, url: 'https://images.unsplash.com/photo-1722865061205-a99bc25b536d?w=800', alt: 'Meio ambiente' },
    { id: 5, url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800', alt: 'Educação' },
    { id: 6, url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800', alt: 'Esportes' }
  ];

  useEffect(() => {
    setBreadcrumbs([{ label: 'Carrossel Principal' }]);
  }, [setBreadcrumbs]);

  const filteredSlides = slides
    .filter(slide => 
      slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.order - b.order);

  // Bulk actions
  const bulkSelection = useBulkSelection(filteredSlides);

  const handleToggleStatus = (slideId: number) => {
    const slide = slides.find(s => s.id === slideId);
    const activeSlides = slides.filter(s => s.isActive);
    
    // Impedir desativar o último slide ativo
    if (slide?.isActive && activeSlides.length === 1) {
      addNotification({
        type: 'error',
        title: 'Ação não permitida',
        message: 'Pelo menos um slide deve permanecer ativo no carrossel.'
      });
      return;
    }
    
    toggleSlideStatus(slideId);
    addNotification({
      type: 'success',
      title: `Slide ${slide?.isActive ? 'desativado' : 'ativado'}`,
      message: `O slide foi ${slide?.isActive ? 'desativado' : 'ativado'} com sucesso.`
    });
  };

  const handleDeleteSlide = (slideId: number) => {
    const slide = slides.find(s => s.id === slideId);
    const activeSlides = slides.filter(s => s.isActive);
    
    // Impedir excluir o último slide ativo
    if (slide?.isActive && activeSlides.length === 1) {
      addNotification({
        type: 'error',
        title: 'Ação não permitida',
        message: 'Não é possível excluir o último slide ativo. Ative outro slide primeiro.'
      });
      return;
    }
    
    deleteSlide(slideId);
    addNotification({
      type: 'success',
      title: 'Slide excluído',
      message: 'O slide foi excluído com sucesso.'
    });
  };

  // Bulk actions handlers
  const handleBulkAction = (actionId: string, selectedIds: string[]) => {
    const selectedSlides = slides.filter(slide => selectedIds.includes(slide.id.toString()));
    
    switch (actionId) {
      case 'delete':
        const activeSlides = slides.filter(s => s.isActive);
        const selectedActiveSlides = selectedSlides.filter(s => s.isActive);
        
        // Verificar se está tentando excluir todos os slides ativos
        if (selectedActiveSlides.length === activeSlides.length) {
          addNotification({
            type: 'error',
            title: 'Ação não permitida',
            message: 'Não é possível excluir todos os slides ativos. Mantenha pelo menos um slide ativo.'
          });
          return;
        }
        
        selectedIds.forEach(id => deleteSlide(parseInt(id)));
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} slide${selectedIds.length !== 1 ? 's' : ''} excluído${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os slides selecionados foram excluídos com sucesso.'
        });
        break;
        
      case 'activate':
        selectedIds.forEach(id => {
          const slide = slides.find(s => s.id.toString() === id);
          if (slide && !slide.isActive) {
            toggleSlideStatus(parseInt(id));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} slide${selectedIds.length !== 1 ? 's' : ''} ativado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os slides selecionados foram ativados com sucesso.'
        });
        break;
        
      case 'deactivate':
        const activeCount = slides.filter(s => s.isActive).length;
        const toDeactivateCount = selectedSlides.filter(s => s.isActive).length;
        
        if (activeCount <= toDeactivateCount) {
          addNotification({
            type: 'error',
            title: 'Ação não permitida',
            message: 'Pelo menos um slide deve permanecer ativo no carrossel.'
          });
          return;
        }
        
        selectedIds.forEach(id => {
          const slide = slides.find(s => s.id.toString() === id);
          if (slide && slide.isActive) {
            toggleSlideStatus(parseInt(id));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} slide${selectedIds.length !== 1 ? 's' : ''} desativado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os slides selecionados foram desativados com sucesso.'
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
      confirmationTitle: 'Excluir slides selecionados',
      confirmationDescription: 'Esta ação não pode ser desfeita. Os slides selecionados serão permanentemente removidos do carrossel.'
    }
  ];

  const handleDragStart = (slide: Slide) => {
    setDraggedItem(slide);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSlide: Slide) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetSlide.id) return;

    const newSlides = [...slides];
    const draggedIndex = newSlides.findIndex(s => s.id === draggedItem.id);
    const targetIndex = newSlides.findIndex(s => s.id === targetSlide.id);

    // Remove o item da posição original
    const [removed] = newSlides.splice(draggedIndex, 1);
    // Insere na nova posição
    newSlides.splice(targetIndex, 0, removed);

    // Atualiza as ordens
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      order: index + 1
    }));

    reorderSlides(updatedSlides);
    setDraggedItem(null);

    addNotification({
      type: 'success',
      title: 'Ordem atualizada',
      message: 'A ordem dos slides foi atualizada com sucesso.'
    });
  };

  const SlideForm = ({ slide, onSave, onCancel }: {
    slide?: Slide;
    onSave: (slideData: Partial<Slide>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: slide?.title || '',
      description: slide?.description || '',
      imageUrl: slide?.imageUrl || '',
      imageAlt: slide?.imageAlt || '',
      hasButton: slide?.hasButton || false,
      buttonText: slide?.buttonText || '',
      buttonLink: slide?.buttonLink || ''
    });

    const handleSubmit = () => {
      if (!formData.title || !formData.imageUrl) {
        addNotification({
          type: 'error',
          title: 'Campos obrigatórios',
          message: 'Título e imagem são obrigatórios.'
        });
        return;
      }

      const slideData = {
        ...formData,
        order: slide?.order || slides.length + 1,
        isActive: slide?.isActive ?? true
      };
      
      onSave(slideData);
    };

    const openMediaLibrary = () => {
      setSelectedImageForEdit(formData.imageUrl);
      setIsMediaModalOpen(true);
    };

    const selectImage = (imageUrl: string, imageAlt: string) => {
      setFormData({ ...formData, imageUrl, imageAlt });
      setIsMediaModalOpen(false);
    };

    return (
      <>
        <div className="space-y-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título do slide"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição opcional do slide"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Imagem *</Label>
              <div className="mt-2 space-y-3">
                {formData.imageUrl ? (
                  <div className="relative">
                    <ImageWithFallback
                      src={formData.imageUrl}
                      alt={formData.imageAlt}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={openMediaLibrary}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Alterar
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-48 border-dashed"
                    onClick={openMediaLibrary}
                  >
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Clique para selecionar uma imagem
                      </p>
                    </div>
                  </Button>
                )}
                
                <div>
                  <Label htmlFor="imageAlt">Texto alternativo da imagem</Label>
                  <Input
                    id="imageAlt"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                    placeholder="Descrição da imagem para acessibilidade"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Botão de Ação</Label>
                <p className="text-sm text-muted-foreground">
                  Adicionar um botão call-to-action no slide
                </p>
              </div>
              <Switch
                checked={formData.hasButton}
                onCheckedChange={(checked) => setFormData({ ...formData, hasButton: checked })}
              />
            </div>

            {formData.hasButton && (
              <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
                <div>
                  <Label htmlFor="buttonText">Texto do Botão</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="ex: Saiba mais"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="buttonLink">Link do Botão</Label>
                  <div className="relative mt-1">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="buttonLink"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                      placeholder="/noticias/exemplo"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {slide ? 'Atualizar Slide' : 'Criar Slide'}
            </Button>
          </div>
        </div>

        {/* Media Library Modal */}
        <Dialog open={isMediaModalOpen} onOpenChange={setIsMediaModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Biblioteca de Mídia</DialogTitle>
              <DialogDescription>
                Selecione uma imagem para o slide
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockMediaLibrary.map((media) => (
                <div
                  key={media.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageForEdit === media.url
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                  onClick={() => selectImage(media.url, media.alt)}
                >
                  <ImageWithFallback
                    src={media.url}
                    alt={media.alt}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <MousePointer className="h-6 w-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Carrossel Principal</h1>
          <p className="text-muted-foreground">
            Gerencie os slides do banner rotativo da página inicial
          </p>
          {slides.filter(s => s.isActive).length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-green-600">
                {slides.filter(s => s.isActive).length} slide(s) ativo(s) no site
              </span>
            </div>
          )}
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Slide
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{slides.length}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {slides.filter(s => s.isActive).length}
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
                <p className="text-sm text-muted-foreground">Inativos</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {slides.filter(s => !s.isActive).length}
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
                <p className="text-sm text-muted-foreground">Com Botões</p>
                <p className="text-2xl font-bold">
                  {slides.filter(s => s.hasButton).length}
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Slides List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[16px]">
            <ImageIcon className="h-5 w-5" />
            Lista de Slides ({filteredSlides.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Arraste os slides para reordenar. A ordem aqui define a sequência no carrossel.
          </p>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar slides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions */}
          <div className="mb-4">
            <BulkActions
              selectedIds={bulkSelection.selectedIds}
              totalItems={filteredSlides.length}
              onSelectAll={bulkSelection.selectAll}
              onClearSelection={bulkSelection.clearSelection}
              actions={bulkActions}
              onAction={handleBulkAction}
              itemName="slide"
            />
          </div>

          <div className="space-y-3">
            {filteredSlides.map((slide) => (
              <div
                key={slide.id}
                className="flex items-center gap-4 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                draggable
                onDragStart={() => handleDragStart(slide)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slide)}
              >
                {/* Checkbox */}
                <Checkbox
                  checked={bulkSelection.isSelected(slide.id)}
                  onCheckedChange={() => bulkSelection.selectItem(slide.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />

                {/* Drag Handle & Order */}
                <div className="flex items-center gap-3">
                  <div className="cursor-move p-1 hover:bg-muted rounded">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {slide.order}
                  </div>
                </div>

                {/* Miniatura */}
                <div className="relative w-16 h-12 flex-shrink-0">
                  <ImageWithFallback
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    className="w-full h-full object-cover rounded border"
                  />
                  {!slide.isActive && (
                    <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                      <EyeOff className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{slide.title}</h3>
                    <div className="flex items-center gap-1">
                      <Badge variant={slide.isActive ? "default" : "secondary"} className="text-xs">
                        {slide.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {slide.hasButton && (
                        <Badge variant="outline" className="text-xs">
                          <MousePointer className="h-2 w-2 mr-1" />
                          Botão
                        </Badge>
                      )}
                    </div>
                  </div>
                  {slide.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {slide.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Atualizado em {new Date(slide.updatedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSlide(slide)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(slide.id)}
                    className="h-8 w-8 p-0"
                  >
                    {slide.isActive ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingSlide(slide)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(slide.id)}
                      >
                        {slide.isActive ? (
                          <><EyeOff className="h-4 w-4 mr-2" />Desativar</>
                        ) : (
                          <><Eye className="h-4 w-4 mr-2" />Ativar</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredSlides.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Nenhum slide encontrado com os filtros aplicados'
                : 'Nenhum slide criado ainda'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Preview do Carrossel Público */}
      {slides.filter(s => s.isActive).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Preview do Site
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Visualização de como o carrossel aparece na página inicial
            </p>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
                {slides.filter(s => s.isActive)[0] && (
                  <>
                    <ImageWithFallback
                      src={slides.filter(s => s.isActive)[0].imageUrl}
                      alt={slides.filter(s => s.isActive)[0].imageAlt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_2px,_transparent_2px)] bg-[length:60px_60px] opacity-10"></div>
                      <div className="absolute inset-0 flex items-center z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                          <div className="max-w-2xl text-white">
                            <div className="transform translate-y-0 opacity-100">
                              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight transform translate-y-0 opacity-100">
                                {slides.filter(s => s.isActive)[0].title}
                              </h2>
                              
                              {slides.filter(s => s.isActive)[0].subtitle && (
                                <h3 className="text-xl md:text-2xl mb-3 font-light opacity-95 transform translate-y-0 opacity-95">
                                  {slides.filter(s => s.isActive)[0].subtitle}
                                </h3>
                              )}
                              
                              {slides.filter(s => s.isActive)[0].description && (
                                <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-xl transform translate-y-0 opacity-100">
                                  {slides.filter(s => s.isActive)[0].description}
                                </p>
                              )}
                              
                              {slides.filter(s => s.isActive)[0].hasButton && slides.filter(s => s.isActive)[0].buttonText && (
                                <div className="transform translate-y-0 opacity-100">
                                  <Button 
                                    size="lg" 
                                    className="bg-[#144c9c] hover:bg-[#0d3b7a] text-lg px-8 py-3 h-auto transform hover:scale-105 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-white/20"
                                  >
                                    {slides.filter(s => s.isActive)[0].buttonText}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {slides.filter(s => s.isActive).length} slide(s)
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Slide Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Slide</DialogTitle>
            <DialogDescription>
              Crie um novo slide para o carrossel principal da página inicial.
            </DialogDescription>
          </DialogHeader>
          <SlideForm
            onSave={(slideData) => {
              addSlide(slideData);
              setIsCreateModalOpen(false);
              addNotification({
                type: 'success',
                title: 'Slide criado',
                message: 'O slide foi criado com sucesso.'
              });
            }}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Slide Modal */}
      <Dialog open={!!editingSlide} onOpenChange={() => setEditingSlide(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Slide</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no slide selecionado.
            </DialogDescription>
          </DialogHeader>
          {editingSlide && (
            <SlideForm
              slide={editingSlide}
              onSave={(slideData) => {
                updateSlide(editingSlide.id, slideData);
                setEditingSlide(null);
                addNotification({
                  type: 'success',
                  title: 'Slide atualizado',
                  message: 'As alterações foram salvas com sucesso.'
                });
              }}
              onCancel={() => setEditingSlide(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}