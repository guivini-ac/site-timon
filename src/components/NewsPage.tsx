import { useState } from 'react';
import { ArrowLeft, Calendar, Tag, Share2, Search, FileText, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
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
import Breadcrumb from './Breadcrumb';
import { usePosts } from './AdminDataContext-hooks';

interface NewsPageProps {
  onNavigateBack: () => void;
  selectedNewsId?: number;
  onSelectNews: (id: number | null) => void;
}

const NewsPage = ({ onNavigateBack, selectedNewsId, onSelectNews }: NewsPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const { posts, updatePost } = usePosts();

  // Função helper para formatar datas (pode ser Date ou string)
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Converter posts do admin para o formato da NewsPage
  const newsArticles = posts.map(post => ({
    id: parseInt(post.id),
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: formatDate(post.publishedAt) || formatDate(post.createdAt) || 'Data não informada',
    category: post.categories[0] || 'Geral',
    author: post.author,
    image: post.image || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop',
    tags: post.tags,
    views: post.views
  }));

  // Extrair categorias únicas dos posts
  const uniqueCategories = [...new Set(posts.map(post => post.categories[0] || 'Geral').filter(Boolean))];
  const categories = ['todas', ...uniqueCategories];

  const selectedNews = newsArticles.find(news => news.id === selectedNewsId);

  // Incrementar visualizações quando uma notícia é visualizada
  const handleSelectNews = (id: number | null) => {
    if (id && !selectedNewsId) {
      const post = posts.find(p => p.id === id.toString());
      if (post) {
        updatePost(post.id, { views: post.views + 1 });
      }
    }
    onSelectNews(id);
  };

  const filteredNews = newsArticles.filter(news => {
    const matchesCategory = selectedCategory === 'todas' || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset to first page when filters change
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  // Reset page when search or category changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetToFirstPage();
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    resetToFirstPage();
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredNews.slice(startIndex, endIndex);

  // Generate pagination numbers
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

  if (selectedNews) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb 
          items={[
            { label: 'Início', onClick: onNavigateBack },
            { label: 'Notícias', onClick: () => handleSelectNews(null) },
            { label: selectedNews.title }
          ]} 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[21px] pb-[7px]">
          <Button
            variant="outline"
            onClick={() => handleSelectNews(null)}
            className="justify-start ml-0 inline-flex"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para notícias
          </Button>
        </div>
        
        {/* Article Content */}
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <ImageWithFallback
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-96 object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary">{selectedNews.category}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {selectedNews.date}
                </div>
                <span className="text-sm text-gray-500">Por {selectedNews.author}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedNews.title}</h1>

              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
              />

              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Tags:</span>
                    {selectedNews.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CommentsSection 
            postId={selectedNews.id.toString()}
            postType="news"
            postTitle={selectedNews.title}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Início', onClick: onNavigateBack },
          { label: 'Notícias' }
        ]} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notícias</h1>
              <p className="text-gray-600 mt-1">Fique por dentro das principais informações da cidade</p>
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
                  placeholder="Buscar notcias..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'todas' ? 'Todas as Categorias' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredNews.length} {filteredNews.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
            {totalPages > 1 && (
              <span className="ml-2">
                • Página {currentPage} de {totalPages}
              </span>
            )}
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentItems.map((news) => (
            <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleSelectNews(news.id)}>
              <div className="aspect-w-16 aspect-h-9">
                <ImageWithFallback
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{news.category}</Badge>
                  <span className="text-sm text-gray-500">{news.date}</span>
                </div>
                <CardTitle className="line-clamp-2">{news.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">{news.excerpt}</p>
                <div className="mt-4 pt-4 border-t">
                  <span className="text-xs text-gray-500">Por {news.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
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

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou termo de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;