import { Calendar, FileText, Camera, ExternalLink, Download, Globe, Building2, User, Heart, GraduationCap, Leaf, Shield, DollarSign, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { usePosts, useEvents, useServices, useGallery } from './AdminDataContext-hooks';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

interface MainSectionsProps {
  onNavigateToGallery: () => void;
  onNavigateToAgenda: () => void;
  onNavigateToNews: (newsId?: number) => void;
  onNavigateToServices: () => void;
}

const MainSections = ({ onNavigateToGallery, onNavigateToAgenda, onNavigateToNews, onNavigateToServices }: MainSectionsProps) => {
  const { posts } = usePosts();
  const { events } = useEvents();
  const { services } = useServices();
  const { galleryAlbums } = useGallery();

  // Hooks de animação
  const { elementRef: newsRef, isVisible: newsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: servicesRef, isVisible: servicesVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: agendaRef, isVisible: agendaVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: galleryRef, isVisible: galleryVisible } = useScrollAnimation({ threshold: 0.1 });
  
  const { containerRef: newsCardsRef, visibleItems: newsCardsVisible } = useStaggeredAnimation(6, 150);
  const { containerRef: servicesCardsRef, visibleItems: servicesCardsVisible } = useStaggeredAnimation(6, 100);
  const { containerRef: galleryCardsRef, visibleItems: galleryCardsVisible } = useStaggeredAnimation(4, 100);

  // Mapeamento de ícones para serviços
  const iconMap = {
    'Home': Home,
    'FileText': FileText,
    'Building2': Building2,
    'User': User,
    'Heart': Heart,
    'GraduationCap': GraduationCap,
    'Leaf': Leaf,
    'Shield': Shield,
    'DollarSign': DollarSign,
    'ExternalLink': ExternalLink,
    'Download': Download,
    'Globe': Globe
  };

  // Filtrar posts publicados e ordenar por data
  const publishedPosts = posts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
    .slice(0, 6);

  // Filtrar serviços ativos e destacados
  const highlightedServices = services
    .filter(service => service.isActive && service.isHighlighted)
    .slice(0, 6);

  // Se não há serviços destacados suficientes, pegar os ativos mais recentes
  const displayServices = highlightedServices.length >= 6 
    ? highlightedServices 
    : services.filter(service => service.isActive).slice(0, 6);

  // Filtrar eventos públicos futuros
  const upcomingEvents = events
    .filter(event => event.isPublic && new Date(event.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 4);

  // Álbuns públicos para galeria
  const publicAlbums = galleryAlbums
    .filter(album => album.isPublic)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Função para formatar data
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Data inválida';
    
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  // Função para formatar data completa
  const formatFullDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Data inválida';
    
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Função para formatar horário
  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para obter categoria de posts
  const getCategoryLabel = (categories: string[]) => {
    if (categories.length === 0) return 'Geral';
    return categories[0]; // Retorna a primeira categoria
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seção de Destaques */}
        <section 
          ref={newsRef as any}
          className={`mb-16 animate-on-scroll ${newsVisible ? 'animate' : ''}`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Últimas Notícias</h2>
            <Button 
              variant="outline" 
              onClick={() => onNavigateToNews()}
              className="flex items-center btn-animated hover-glow"
            >
              Ver todas as notícias
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div 
            ref={newsCardsRef as any}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {publishedPosts.length > 0 ? (
              publishedPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className={`overflow-hidden card-animated cursor-pointer transition-all duration-300 ${
                    newsCardsVisible[index] ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => onNavigateToNews()}
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <ImageWithFallback
                      src={post.image || 'https://images.unsplash.com/photo-1526933970845-c961fad3f8eb?w=400&h=200&fit=crop'}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{getCategoryLabel(post.categories)}</Badge>
                      <span className="text-sm text-gray-500">
                        {formatFullDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                    <Button 
                      variant="link" 
                      className="mt-4 p-0 btn-animated text-[#144c9c] hover:text-[#0d3b7a]" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToNews();
                      }}
                    >
                      Leia mais
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="lg:col-span-3 text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma notícia publicada ainda.</p>
              </div>
            )}
          </div>
        </section>

        {/* Seção de Serviços Rápidos */}
        <section 
          ref={servicesRef as any}
          className={`mb-16 animate-on-scroll ${servicesVisible ? 'animate' : ''}`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Serviços Mais Utilizados</h2>
            <Button 
              variant="outline" 
              onClick={onNavigateToServices}
              className="flex items-center btn-animated hover-glow"
            >
              Ver todos os serviços
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div 
            ref={servicesCardsRef as any}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayServices.length > 0 ? (
              displayServices.map((service, index) => {
                const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Globe;
                return (
                  <Card 
                    key={service.id} 
                    className={`p-6 card-animated cursor-pointer transition-all duration-300 ${
                      servicesCardsVisible[index] ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4 hover-scale transition-transform duration-200">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="lg:col-span-3 text-center py-12">
                <ExternalLink className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum serviço disponível no momento.</p>
              </div>
            )}
          </div>
        </section>

        {/* Agenda Pública */}
        <section 
          ref={agendaRef as any}
          className={`mb-16 animate-on-scroll ${agendaVisible ? 'animate' : ''}`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Agenda Pública</h2>
            <Button 
              variant="outline" 
              onClick={onNavigateToAgenda}
              className="flex items-center btn-animated hover-glow"
            >
              Ver agenda completa
              <Calendar className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <Card className="p-8 card-animated">
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    className={`flex items-center p-4 bg-gray-50 rounded-lg hover-float cursor-pointer transition-all duration-300 ${
                      agendaVisible ? 'animate-fade-in-left' : 'opacity-0 translate-x-8'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-blue-600 text-white rounded-lg p-3 mr-4 text-center min-w-[60px]">
                      <div className="text-sm font-semibold">{formatDate(event.startDate)}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600">{formatTime(event.startDate)}</span>
                        {event.location && (
                          <>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum evento próximo agendado.</p>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Galeria de Fotos */}
        <section 
          ref={galleryRef as any}
          className={`animate-on-scroll ${galleryVisible ? 'animate' : ''}`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Galeria de Fotos</h2>
            <Button 
              variant="outline" 
              onClick={onNavigateToGallery}
              className="flex items-center btn-animated hover-glow"
            >
              Ver todas as fotos
              <Camera className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div 
            ref={galleryCardsRef as any}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          >
            {publicAlbums.length > 0 ? (
              publicAlbums.map((album, index) => (
                <div 
                  key={album.id} 
                  className={`relative group cursor-pointer hover-tilt transition-all duration-300 ${
                    galleryCardsVisible[index] ? 'animate-scale-in' : 'opacity-0 scale-90'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={onNavigateToGallery}
                >
                  <ImageWithFallback
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 rounded-lg transition-all duration-500 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge variant="secondary" className="text-xs">
                      {album.category}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-white/90 text-gray-800 text-xs">
                      {album.images.length} fotos
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-4 text-center py-12">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum álbum de fotos disponível ainda.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainSections;