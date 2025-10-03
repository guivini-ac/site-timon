import { useState } from 'react';
import { useEvents } from './AdminDataContext-hooks';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Breadcrumb from './Breadcrumb';

interface AgendaPageProps {
  onNavigateBack: () => void;
}

const AgendaPage = ({ onNavigateBack }: AgendaPageProps) => {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filtrar apenas eventos públicos
  const publicEvents = events.filter(event => event.isPublic);

  // Aplicar filtros de busca e categoria
  const filteredEvents = publicEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Separar eventos por período
  const now = new Date();
  const upcomingEvents = filteredEvents
    .filter(event => event.startDate >= now)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 6);

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'reuniao', label: 'Reuniões' },
    { value: 'audiencia', label: 'Audiências Públicas' },
    { value: 'cultura', label: 'Cultura' },
    { value: 'esporte', label: 'Esporte' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'festa', label: 'Eventos Especiais' }
  ];

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'reuniao': '#144c9c',
      'audiencia': '#dc3545',
      'cultura': '#6f42c1',
      'esporte': '#fd7e14',
      'saude': '#198754',
      'educacao': '#0dcaf0',
      'festa': '#ffc107'
    };
    return colors[category] || '#6c757d';
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Data inválida';
    
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Início', onClick: onNavigateBack },
          { label: 'Agenda Municipal' }
        ]} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agenda Municipal</h1>
              <p className="text-gray-600 mt-1">Acompanhe os eventos e atividades da Prefeitura de Timon</p>
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
                  placeholder="Buscar eventos por título, descrição ou local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Próximos Eventos</h2>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop"
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge 
                        variant="secondary"
                        className="bg-white/90 text-gray-800"
                        style={{ backgroundColor: getCategoryColor(event.category) + '20' }}
                      >
                        {getCategoryLabel(event.category)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {formatTime(event.startDate)}
                          {event.endDate && ` às ${formatTime(event.endDate)}`}
                        </span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      
                      {event.organizer && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="truncate">{event.organizer}</span>
                        </div>
                      )}
                    </div>

                    {event.registrationRequired && (
                      <div className="mt-4">
                        <Badge variant="outline" className="text-xs">
                          Inscrição obrigatória
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Nenhum evento encontrado' 
                  : 'Nenhum evento próximo agendado'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Novos eventos serão divulgados em breve.'}
              </p>
            </div>
          )}
        </div>

        {/* All Events */}
        {filteredEvents.length > upcomingEvents.length && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Todos os Eventos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop"
                      alt={event.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge 
                        variant="secondary"
                        className="bg-white/90 text-gray-800 text-xs"
                        style={{ backgroundColor: getCategoryColor(event.category) + '20' }}
                      >
                        {getCategoryLabel(event.category)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-blue-50 rounded-lg p-6 mt-12">
          <div className="text-center">
            <h3 className="font-bold text-blue-900 mb-2">Participe dos Eventos</h3>
            <p className="text-blue-800 text-sm mb-4">
              Para mais informações sobre os eventos ou para sugerir atividades, entre em contato conosco.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <Badge variant="outline" className="bg-white text-blue-800 border-blue-200">
                📞 (99) 3212-1234
              </Badge>
              <Badge variant="outline" className="bg-white text-blue-800 border-blue-200">
                ✉️ eventos@timon.ma.gov.br
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaPage;