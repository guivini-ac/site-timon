import { useState, useCallback, useEffect } from 'react';
import { 
  Upload, 
  Search, 
  Grid, 
  List, 
  Filter, 
  Download,
  Trash2,
  Edit,
  Eye,
  FolderPlus,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  MoreVertical,
  X
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { useAdmin } from '../AdminContext';
import { EmptyState } from '../components/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail?: string;
  size: number;
  dimensions?: { width: number; height: number };
  uploadedAt: Date;
  uploadedBy: string;
  alt?: string;
  caption?: string;
  description?: string;
}

export function MediaView() {
  const { addNotification } = useAdmin();
  
  const [searchQuery, setSearchQuery] = useState('');

  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'audio' | 'document'>('all');
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Mock data
  const mockMedia: MediaFile[] = [
    {
      id: '1',
      name: 'escola-municipal-inauguracao.jpg',
      type: 'image',
      url: '/media/escola-municipal.jpg',
      thumbnail: '/media/escola-municipal-thumb.jpg',
      size: 2048576,
      dimensions: { width: 1920, height: 1080 },
      uploadedAt: new Date('2024-01-15T10:00:00'),
      uploadedBy: 'João Silva',
      alt: 'Inauguração da nova escola municipal de Timon',
      caption: 'Vista externa da nova escola'
    },
    {
      id: '2',
      name: 'video-vacinacao-campanha.mp4',
      type: 'video',
      url: '/media/vacinacao-campanha.mp4',
      thumbnail: '/media/vacinacao-thumb.jpg',
      size: 52428800,
      uploadedAt: new Date('2024-01-14T08:30:00'),
      uploadedBy: 'Maria Santos',
      description: 'Vídeo promocional da campanha de vacinação'
    },
    {
      id: '3',
      name: 'relatorio-obras-2024.pdf',
      type: 'document',
      url: '/media/relatorio-obras-2024.pdf',
      size: 1048576,
      uploadedAt: new Date('2024-01-13T16:45:00'),
      uploadedBy: 'Pedro Costa'
    }
  ];

  useEffect(() => {
    setMedia(mockMedia);
  }, []);

  // Hook para seleção em lote
  const bulkSelection = useBulkSelection(media);

  // Configuração das ações em lote
  const bulkActions: BulkAction[] = [
    {
      id: 'download',
      label: 'Baixar',
      icon: Download,
      variant: 'outline'
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: Trash2,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationTitle: 'Confirmar Exclusão',
      confirmationDescription: 'Esta ação não pode ser desfeita. Os arquivos selecionados serão permanentemente excluídos.'
    }
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = (files: File[]) => {
    setLoading(true);
    
    // Simular upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Adicionar arquivos mockados
        const newFiles: MediaFile[] = files.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' :
                file.type.startsWith('video/') ? 'video' :
                file.type.startsWith('audio/') ? 'audio' : 'document',
          url: URL.createObjectURL(file),
          size: file.size,
          uploadedAt: new Date(),
          uploadedBy: 'Admin',
        }));
        
        setMedia(prev => [...newFiles, ...prev]);
        setLoading(false);
        setUploadProgress(0);
        
        addNotification({
          type: 'success',
          title: 'Upload concluído',
          message: `${files.length} arquivo(s) enviado(s) com sucesso`
        });
      }
    }, 200);
  };

  const handleBulkAction = async (actionId: string, selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Selecione pelo menos um arquivo'
      });
      return;
    }

    try {
      switch (actionId) {
        case 'download':
          // Simular download dos arquivos selecionados
          const selectedFiles = media.filter(file => selectedIds.includes(file.id));
          for (const file of selectedFiles) {
            // Em produção, aqui seria feito o download real do arquivo
            console.log(`Baixando: ${file.name}`);
          }
          addNotification({
            type: 'success',
            title: 'Download iniciado',
            message: `${selectedIds.length} arquivo(s) sendo baixado(s)`
          });
          break;
          
        case 'delete':
          setMedia(prev => prev.filter(file => !selectedIds.includes(file.id)));
          addNotification({
            type: 'success',
            title: 'Arquivos excluídos',
            message: `${selectedIds.length} arquivo(s) excluído(s) com sucesso`
          });
          break;
      }
      
      bulkSelection.clearSelection();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao executar ação em lote'
      });
    }
  };

  const handleDelete = (id: string) => {
    setMedia(media.filter(file => file.id !== id));
    addNotification({
      type: 'success',
      title: 'Arquivo excluído',
      message: 'O arquivo foi excluído com sucesso'
    });
  };

  const handleEditFile = (file: MediaFile) => {
    setEditingFile(file);
  };

  const handleSaveEdit = () => {
    if (!editingFile) return;
    
    setMedia(media.map(file => 
      file.id === editingFile.id ? editingFile : file
    ));
    
    setEditingFile(null);
    addNotification({
      type: 'success',
      title: 'Arquivo atualizado',
      message: 'Os metadados do arquivo foram atualizados'
    });
  };

  const filteredMedia = media.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || file.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Biblioteca de Mídia</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie imagens, vídeos e outros arquivos de mídia
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => console.log('Nova pasta')}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Nova Pasta
          </Button>
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
          />
        </div>
      </div>

      {/* Área de Upload por Drag & Drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
          Arraste e solte arquivos aqui
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          ou clique no botão acima para selecionar arquivos
        </p>
        <p className="text-sm text-gray-400">
          Suporta: JPG, PNG, GIF, MP4, PDF, DOC - máximo 10MB por arquivo
        </p>
      </div>

      {/* Barra de progresso do upload */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Enviando arquivos...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros e Controles */}
      <Card>
        <CardHeader className="space-y-4 p-[21px]">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Busca */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar arquivos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Filtro por tipo */}
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="image">Imagens</SelectItem>
                  <SelectItem value="video">Vídeos</SelectItem>
                  <SelectItem value="audio">Áudios</SelectItem>
                  <SelectItem value="document">Documentos</SelectItem>
                </SelectContent>
              </Select>

              {/* Controle de visualização */}
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={view === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {media.filter(f => f.type === 'image').length}
              </div>
              <div className="text-sm text-gray-500">Imagens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {media.filter(f => f.type === 'video').length}
              </div>
              <div className="text-sm text-gray-500">Vídeos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {media.filter(f => f.type === 'document').length}
              </div>
              <div className="text-sm text-gray-500">Documentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {formatFileSize(media.reduce((acc, f) => acc + f.size, 0))}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Componente de ações em lote */}
      <div className="px-0">
        <BulkActions
          selectedIds={bulkSelection.selectedIds}
          totalItems={filteredMedia.length}
          onSelectAll={bulkSelection.selectAll}
          onClearSelection={bulkSelection.clearSelection}
          actions={bulkActions}
          onAction={handleBulkAction}
          itemName="arquivo"
        />
      </div>

      {/* Lista/Grade de Arquivos */}
      {filteredMedia.length === 0 ? (
        <EmptyState
          title="Nenhum arquivo encontrado"
          description="Faça upload de imagens, vídeos ou documentos para começar a usar a biblioteca de mídia."
          icon="Image"
          actionLabel="Fazer Upload"
          onAction={() => document.getElementById('file-upload')?.click()}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            {view === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filteredMedia.map((file) => (
                  <div
                    key={file.id}
                    className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Checkbox de seleção */}
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={bulkSelection.isSelected(file.id)}
                        onCheckedChange={() => bulkSelection.selectItem(file.id)}
                        className="bg-white/80 backdrop-blur-sm"
                      />
                    </div>

                    {/* Preview */}
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {file.type === 'image' ? (
                        <img
                          src={file.thumbnail || file.url}
                          alt={file.alt || file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 dark:text-gray-500">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="p-4">
                      <h4 className="font-medium text-sm truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        {file.dimensions && (
                          <span>{file.dimensions.width}×{file.dimensions.height}</span>
                        )}
                      </div>
                    </div>

                    {/* Menu de ações */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditFile(file)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Baixar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(file.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMedia.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Checkbox
                      checked={bulkSelection.isSelected(file.id)}
                      onCheckedChange={() => bulkSelection.selectItem(file.id)}
                    />
                    
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                      {file.type === 'image' ? (
                        <img
                          src={file.thumbnail || file.url}
                          alt={file.alt || file.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.uploadedBy} • {file.uploadedAt.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditFile(file)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(file.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog de Edição */}
      <Dialog open={!!editingFile} onOpenChange={(open) => !open && setEditingFile(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Arquivo</DialogTitle>
            <DialogDescription>
              Edite os metadados e informações do arquivo selecionado.
            </DialogDescription>
          </DialogHeader>
          
          {editingFile && (
            <div className="space-y-5 pt-2">
              <div className="space-y-2">
                <Label htmlFor="file-name">Nome do arquivo</Label>
                <Input
                  id="file-name"
                  value={editingFile.name}
                  onChange={(e) => setEditingFile({...editingFile, name: e.target.value})}
                />
              </div>
              
              {editingFile.type === 'image' && (
                <div className="space-y-2">
                  <Label htmlFor="alt-text">Texto alternativo</Label>
                  <Input
                    id="alt-text"
                    value={editingFile.alt || ''}
                    onChange={(e) => setEditingFile({...editingFile, alt: e.target.value})}
                    placeholder="Descreva a imagem para acessibilidade"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="caption">Legenda</Label>
                <Input
                  id="caption"
                  value={editingFile.caption || ''}
                  onChange={(e) => setEditingFile({...editingFile, caption: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={editingFile.description || ''}
                  onChange={(e) => setEditingFile({...editingFile, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditingFile(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}