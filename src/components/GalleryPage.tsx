import { useState, useMemo } from 'react';
import { useGallery } from './GalleryContext';
import { 
  ArrowLeft, 
  Camera, 
  Download, 
  Search, 
  Filter, 
  Eye,
  Heart,
  Calendar,
  Building,
  Leaf,
  Palette,
  Trophy,
  GraduationCap,
  Grid,
  Star,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CommentsSection } from './CommentsSection';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import Breadcrumb from './Breadcrumb';

interface GalleryPageProps {
  onNavigateBack: () => void;
  selectedAlbumId?: string;
  onSelectAlbum: (id: string | null) => void;
}

const GalleryPage = ({ onNavigateBack, selectedAlbumId, onSelectAlbum }: GalleryPageProps) => {
  const { albums, getPublicAlbums } = useGallery();
  
  // Estados locais para filtragem e paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const itemsPerPage = 12;
  
  // Estados para modal de imagem
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Utility functions - move these BEFORE they are used
  // Obter ícone da categoria
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'eventos': Calendar,
      'obras': Building,
      'meio-ambiente': Leaf,
      'cultura': Palette,
      'esportes': Trophy,
      'educacao': GraduationCap,
      'geral': Grid
    };
    return icons[category] || Grid;
  };

  // Obter cor da categoria
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'eventos': '#DC2626',
      'obras': '#EA580C',
      'meio-ambiente': '#16A34A',
      'cultura': '#7C3AED',
      'esportes': '#2563EB',
      'educacao': '#0891B2',
      'geral': '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  // Obter label da categoria
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'eventos': 'Eventos',
      'obras': 'Obras',
      'meio-ambiente': 'Meio Ambiente',
      'cultura': 'Cultura',
      'esportes': 'Esportes',
      'educacao': 'Educação',
      'geral': 'Geral'
    };
    return labels[category] || 'Geral';
  };

  // Obter álbuns públicos
  const publicAlbums = useMemo(() => getPublicAlbums(), [albums]);

  // Filtrar e ordenar álbuns
  const filteredAlbums = useMemo(() => {
    let filtered = publicAlbums.filter(album => {
      const matchesSearch = album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           album.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || album.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Ordenação
    switch (sortOrder) {
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'most-viewed':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'most-liked':
        filtered.sort((a, b) => {
          const aLikes = a.images.reduce((sum, img) => sum + img.likes, 0);
          const bLikes = b.images.reduce((sum, img) => sum + img.likes, 0);
          return bLikes - aLikes;
        });
        break;
      default: // newest
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return filtered;
  }, [publicAlbums, searchTerm, categoryFilter, sortOrder]);

  // Paginação
  const totalItems = filteredAlbums.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredAlbums.slice(startIndex, startIndex + itemsPerPage);

  // Categorias disponíveis
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(publicAlbums.map(album => album.category))];
    return uniqueCategories.map(cat => ({
      id: cat,
      slug: cat,
      name: getCategoryLabel(cat)
    }));
  }, [publicAlbums]);

  // Encontrar o álbum selecionado
  const selectedAlbum = selectedAlbumId 
    ? albums.find(album => album.id.toString() === selectedAlbumId)
    : null;

  // Função para selecionar álbum
  const handleSelectAlbum = (id: string | null) => {
    onSelectAlbum(id);
  };

  // Função para abrir modal de imagem
  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  // Função para curtir álbum
  const handleAlbumLike = (album: any) => {
    console.log('Curtir álbum:', album.id);
  };

  // Função para curtir imagem
  const handleImageLike = (image: any) => {
    console.log('Curtir imagem:', image.id);
  };

  // Função para baixar imagem
  const handleImageDownload = (image: any) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.alt || 'imagem'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset para primeira página quando filtros mudam
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetToFirstPage();
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    resetToFirstPage();
  };

  // Gerar itens de paginação
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        items.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        items.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return items;
  };

  // Renderizar página do álbum
  if (selectedAlbum) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb 
          items={[
            { label: 'Início', onClick: onNavigateBack },
            { label: 'Galerias', onClick: () => handleSelectAlbum(null) },
            { label: selectedAlbum.name }
          ]} 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[21px] pb-[7px]">
          <Button
            variant="outline"
            onClick={() => handleSelectAlbum(null)}
            className="justify-start ml-0 inline-flex"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às galerias
          </Button>
        </div>
        
        {/* Album Content */}
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <ImageWithFallback
                src={selectedAlbum.images.find(img => img.id === selectedAlbum.coverImageId)?.url || selectedAlbum.images[0]?.url || 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=800&h=600&fit=crop'}
                alt={selectedAlbum.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Badge 
                  variant="secondary"
                  style={{ backgroundColor: getCategoryColor(selectedAlbum.category) + '20' }}
                >
                  {getCategoryLabel(selectedAlbum.category)}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {selectedAlbum.createdAt.toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Camera className="h-4 w-4 mr-1" />
                  {selectedAlbum.images.length} fotos
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  {selectedAlbum.views.toLocaleString()} visualizações
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedAlbum.name}</h1>

              <div className="prose prose-lg max-w-none text-gray-700 mb-8">
                <p>{selectedAlbum.description}</p>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {selectedAlbum.images
                  .filter(img => img.isPublic)
                  .sort((a, b) => a.order - b.order)
                  .map((image) => (
                    <div 
                      key={image.id}
                      className="group relative cursor-pointer"
                      onClick={() => handleImageClick(image)}
                    >
                      <div className="aspect-square overflow-hidden rounded-lg">
                        <ImageWithFallback
                          src={image.thumbnail}
                          alt={image.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="secondary" className="h-8 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-8 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageLike(image);
                            }}
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            {image.likes}
                          </Button>
                        </div>
                      </div>

                      {/* Image Badges */}
                      {image.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="text-xs">
                            <Star className="h-3 w-3" />
                          </Badge>
                        </div>
                      )}
                      
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {image.views} views
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {selectedAlbum.images.reduce((sum, img) => sum + img.likes, 0)} curtidas totais
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAlbumLike(selectedAlbum)}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Curtir galeria
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CommentsSection 
            postId={selectedAlbum.id.toString()}
            postType="gallery"
            postTitle={selectedAlbum.name}
          />
        </div>

        {/* Modal para visualização de imagem individual */}
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
            {selectedImage && (
              <>
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedImage.title || selectedImage.alt}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleImageLike(selectedImage)}
                        className="gap-1"
                      >
                        <Heart className="h-4 w-4" />
                        {selectedImage.likes}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleImageDownload(selectedImage)}
                        className="gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </DialogTitle>
                  {selectedImage.description && (
                    <DialogDescription>
                      {selectedImage.description}
                    </DialogDescription>
                  )}
                </DialogHeader>

                <div className="flex-1 overflow-auto">
                  <div className="p-6 pt-0 space-y-6">
                    {/* Imagem */}
                    <div className="relative">
                      <ImageWithFallback
                        src={selectedImage.url}
                        alt={selectedImage.alt}
                        className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                      />
                    </div>

                    {/* Metadados da imagem */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Visualizações:</span>
                        <p className="font-medium">{selectedImage.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Curtidas:</span>
                        <p className="font-medium">{selectedImage.likes}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Data:</span>
                        <p className="font-medium">{selectedImage.createdAt?.toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tamanho:</span>
                        <p className="font-medium">{selectedImage.size || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Comentários da foto */}
                    <CommentsSection 
                      postId={selectedImage.id.toString()}
                      postType="photo"
                      postTitle={selectedImage.title || selectedImage.alt}
                    />
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Renderizar lista de álbuns
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Início', onClick: onNavigateBack },
          { label: 'Galerias' }
        ]} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ImageIcon className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Galerias de Fotos</h1>
              <p className="text-gray-600 mt-1">Explore os momentos marcantes de nossa cidade através de imagens</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar galerias..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigas</option>
                <option value="alphabetical">Ordem alfabética</option>
                <option value="most-viewed">Mais visualizadas</option>
                <option value="most-liked">Mais curtidas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredAlbums.length} {filteredAlbums.length === 1 ? 'galeria encontrada' : 'galerias encontradas'}
            {totalPages > 1 && (
              <span className="ml-2">
                • Página {currentPage} de {totalPages}
              </span>
            )}
          </p>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentItems.map((album) => {
            const IconComponent = getCategoryIcon(album.category);
            
            return (
              <Card key={album.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleSelectAlbum(album.id.toString())}>
                <div className="aspect-w-16 aspect-h-9">
                  <ImageWithFallback
                    src={album.images.find(img => img.id === album.coverImageId)?.url || album.images[0]?.url || 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=800&h=600&fit=crop'}
                    alt={album.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant="secondary"
                      style={{ backgroundColor: getCategoryColor(album.category) + '20' }}
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {getCategoryLabel(album.category)}
                    </Badge>
                    <span className="text-sm text-gray-500">{album.createdAt.toLocaleDateString('pt-BR')}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{album.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{album.description}</p>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        {album.images.length} fotos
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {album.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {album.images.reduce((sum, img) => sum + img.likes, 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {generatePaginationItems().map((item, index) => (
                  <PaginationItem key={index}>
                    {item === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(Number(item))}
                        isActive={currentPage === item}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {filteredAlbums.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma galeria encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou termo de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;