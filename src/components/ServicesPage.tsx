import { useState } from 'react';
import { useServices } from './ServicesContext';
import { 
  ArrowLeft, 
  Settings, 
  Search, 
  ExternalLink, 
  FileText, 
  User, 
  Building2, 
  Heart, 
  GraduationCap, 
  Leaf, 
  Shield, 
  DollarSign,
  Home,
  Link as LinkIcon,
  MessageSquare,
  ShieldCheck,
  Receipt,
  Calendar as CalendarIcon,
  Eye,
  Globe,
  Users,
  Grid,
  TrendingUp,
  Target,
  Clock,
  Phone,
  Star
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
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

interface ServicesPageProps {
  onNavigateBack: () => void;
}

// Mapeamento de ícones
const iconMap = {
  'Home': Home,
  'Link': LinkIcon,
  'FileText': FileText,
  'MessageSquare': MessageSquare,
  'ShieldCheck': ShieldCheck,
  'Receipt': Receipt,
  'Calendar': CalendarIcon,
  'Eye': Eye,
  'Globe': Globe,
  'Users': Users,
  'Grid': Grid,
  'TrendingUp': TrendingUp,
  'ExternalLink': ExternalLink,
  'Target': Target,
  'DollarSign': DollarSign,
  'User': User,
  'Building2': Building2,
  'Heart': Heart,
  'GraduationCap': GraduationCap,
  'Leaf': Leaf,
  'Shield': Shield
};

const ServicesPage = ({ onNavigateBack }: ServicesPageProps) => {
  const { 
    services, 
    getFeaturedServices, 
    getPopularServices,
    incrementAccessCount,
    getCategoryLabel 
  } = useServices();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'popular', label: 'Mais Populares' },
    { value: 'digital', label: 'Serviços Digitais' },
    { value: 'presencial', label: 'Atendimento Presencial' },
    { value: 'documento', label: 'Documentos e Certidões' },
    { value: 'fiscal', label: 'Serviços Fiscais' },
    { value: 'outros', label: 'Outros Serviços' }
  ];

  const activeServices = services.filter(service => service.isActive);
  const featuredServices = getFeaturedServices();
  const popularServices = getPopularServices();

  const filteredServices = activeServices.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleServiceClick = (service: any) => {
    incrementAccessCount(service.id);
    window.open(service.url, '_blank');
  };

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
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredServices.slice(startIndex, endIndex);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Início', onClick: onNavigateBack },
          { label: 'Serviços da Prefeitura' }
        ]} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-[#144c9c] mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Serviços da Prefeitura</h1>
              <p className="text-gray-600 mt-1">Acesse todos os serviços digitais disponíveis para os cidadãos</p>
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
                  placeholder="Buscar serviços por nome, descrição ou tags..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#144c9c]"
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

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredServices.length} {filteredServices.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}
            {totalPages > 1 && (
              <span className="ml-2">
                • Página {currentPage} de {totalPages}
              </span>
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentItems.map((service) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Globe;
            return (
              <Card key={service.id} className="group hover:shadow-lg transition-shadow flex flex-col h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-[#144c9c]/10 p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-[#144c9c]" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryLabel(service.category)}
                      </Badge>
                      {service.isFeatured && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {service.accessCount} acessos
                      </div>
                      {service.availableHours && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.availableHours}
                        </div>
                      )}
                    </div>

                    {service.requirements && service.requirements.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-1">Documentos necessários:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.requirements.slice(0, 2).map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {service.requirements.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.requirements.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full mt-auto" 
                    size="sm"
                    onClick={() => handleServiceClick(service)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Acessar Serviço
                  </Button>
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

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou termo de busca.</p>
          </div>
        )}

        {/* Information Card */}
        <div className="bg-[#144c9c]/5 rounded-lg p-6 mt-8">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-[#144c9c] mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#144c9c] mb-2">Precisa de Ajuda?</h3>
              <p className="text-[#144c9c]/80 text-sm mb-3">
                Se você não encontrou o serviço que procura ou tem dificuldades para acessar algum sistema, entre em contato conosco:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Badge variant="outline" className="bg-white text-[#144c9c] border-[#144c9c]/30">
                  📞 (99) 3212-3456
                </Badge>
                <Badge variant="outline" className="bg-white text-[#144c9c] border-[#144c9c]/30">
                  ✉️ atendimento@timon.ma.gov.br
                </Badge>
                <Badge variant="outline" className="bg-white text-[#144c9c] border-[#144c9c]/30">
                  🕒 Seg-Sex: 8h às 18h
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;