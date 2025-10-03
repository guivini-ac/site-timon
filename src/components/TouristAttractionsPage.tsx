import { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Camera, 
  Star, 
  Map, 
  Calendar, 
  Users,
  Heart,
  Navigation,
  Info,
  Search,
  Filter,
  ChevronRight,
  Building2,
  Church,
  TreePine,
  Waves,
  Utensils,
  ShoppingBag,
  Music,
  Mountain,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Breadcrumb from './Breadcrumb';
import { useAccessibility } from './AccessibilityContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface TouristAttractionPageProps {
  onNavigateBack: () => void;
}

interface TouristAttraction {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  category: 'religioso' | 'historico' | 'cultural' | 'natural' | 'gastronomia' | 'comercio';
  address: string;
  phone?: string;
  hours: string;
  image: string;
  rating: number;
  reviews: number;
  highlights: string[];
  coordinates?: { lat: number; lng: number };
  entrance: 'gratuito' | 'pago';
  price?: string;
  accessibility: boolean;
  parking: boolean;
  tips: string[];
}

const touristAttractions: TouristAttraction[] = [
  {
    id: 1,
    name: "Igreja Matriz de São José",
    description: "Principal igreja católica de Timon, construída no século XIX, é um marco arquitetônico e religioso da cidade. Possui bela arquitetura colonial e abriga importantes celebrações religiosas da comunidade timonense.",
    shortDescription: "Principal igreja católica com arquitetura colonial do século XIX",
    category: 'religioso',
    address: "Praça da Matriz, Centro, Timon - MA",
    phone: "(99) 3212-1234",
    hours: "Segunda a sexta: 6h às 18h | Domingos: 6h às 20h",
    image: "https://images.unsplash.com/photo-1734698144161-de5f72411b1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmF6aWxpYW4lMjBjaHVyY2glMjBjb2xvbmlhbHxlbnwxfHx8fDE3NTczNDA4OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 127,
    highlights: ["Arquitetura colonial", "Missas dominicais", "Centro histórico", "Patrimônio religioso"],
    entrance: 'gratuito',
    accessibility: true,
    parking: true,
    tips: [
      "Visite durante as missas dominicais para vivenciar a tradição local",
      "Aproveite para conhecer o centro histórico ao redor",
      "Fotografias são permitidas, mas seja respeitoso durante celebrações"
    ]
  },
  {
    id: 2,
    name: "Porto do Parnaíba",
    description: "Histórico porto fluvial às margens do Rio Parnaíba, importante para o desenvolvimento econômico da região. Oferece belas vistas do rio e é local de partida para passeios de barco e contemplação do pôr do sol.",
    shortDescription: "Porto histórico às margens do Rio Parnaíba com vista panorâmica",
    category: 'historico',
    address: "Margem do Rio Parnaíba, Centro, Timon - MA",
    hours: "24 horas (área externa)",
    image: "https://images.unsplash.com/photo-1662434148029-c8a6cca90ea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJuYWliYSUyMHJpdmVyJTIwZG9ja3xlbnwxfHx8fDE3NTczNDA4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.3,
    reviews: 89,
    highlights: ["Vista do Rio Parnaíba", "Pôr do sol", "História local", "Passeios de barco"],
    entrance: 'gratuito',
    accessibility: false,
    parking: true,
    tips: [
      "Melhor horário para visita é no fim da tarde",
      "Leve protetor solar e chapéu",
      "Ideal para caminhadas e contemplação"
    ]
  },
  {
    id: 3,
    name: "Mercado Municipal de Timon",
    description: "Centro comercial tradicional onde você encontra produtos locais, artesanatos, especiarias e comidas típicas da região. É um local vibrante que representa a cultura e o comércio local timonense.",
    shortDescription: "Mercado tradicional com produtos locais e artesanatos regionais",
    category: 'comercio',
    address: "Rua do Comércio, 123, Centro, Timon - MA",
    phone: "(99) 3212-5678",
    hours: "Segunda a sábado: 6h às 18h | Domingos: 6h às 12h",
    image: "https://images.unsplash.com/photo-1719836179378-9d847f713c46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtdW5pY2lwYWwlMjBtYXJrZXQlMjBicmF6aWx8ZW58MXx8fHwxNzU3MzQwOTAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    reviews: 156,
    highlights: ["Produtos regionais", "Artesanato local", "Comidas típicas", "Cultura popular"],
    entrance: 'gratuito',
    accessibility: true,
    parking: true,
    tips: [
      "Experimente as frutas regionais da estação",
      "Pechinche os preços dos artesanatos",
      "Vá cedo para encontrar os melhores produtos"
    ]
  },
  {
    id: 4,
    name: "Centro Cultural Timonense",
    description: "Espaço dedicado à preservação e difusão da cultura local, com exposições de arte, biblioteca, auditório e atividades culturais. Promove eventos, oficinas e apresentações que valorizam a identidade cultural de Timon.",
    shortDescription: "Espaço cultural com exposições, biblioteca e eventos artísticos",
    category: 'cultural',
    address: "Avenida Cultural, 456, Centro, Timon - MA",
    phone: "(99) 3212-9876",
    hours: "Terça a domingo: 8h às 17h",
    image: "https://images.unsplash.com/photo-1556895349-661061f64fa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGNlbnRlciUyMGJyYXppbHxlbnwxfHx8fDE3NTczNDA5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    reviews: 73,
    highlights: ["Exposições de arte", "Biblioteca pública", "Eventos culturais", "Oficinas"],
    entrance: 'gratuito',
    accessibility: true,
    parking: true,
    tips: [
      "Consulte a programação de eventos no site",
      "Participe das oficinas oferecidas",
      "Biblioteca possui acervo sobre história local"
    ]
  },
  {
    id: 5,
    name: "Praça da Independência",
    description: "Principal praça da cidade, centro de convivência social e palco de eventos cívicos e culturais. Possui área verde, playground, academia ao ar livre e é ponto de encontro tradicional da comunidade timonense.",
    shortDescription: "Praça central com área verde, playground e espaços de convivência",
    category: 'natural',
    address: "Centro, Timon - MA",
    hours: "24 horas",
    image: "https://images.unsplash.com/photo-1664817936791-964b6d040eff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmF6aWxpYW4lMjBwbGF6YSUyMHNxdWFyZXxlbnwxfHx8fDE3NTczNDA5MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.2,
    reviews: 112,
    highlights: ["Área verde", "Playground", "Academia ao ar livre", "Eventos cívicos"],
    entrance: 'gratuito',
    accessibility: true,
    parking: true,
    tips: [
      "Ideal para exercícios matinais",
      "Local seguro para crianças brincarem",
      "Eventos especiais durante feriados nacionais"
    ]
  },
  {
    id: 6,
    name: "Casa da Cultura Popular",
    description: "Espaço dedicado à preservação das tradições culturais locais, incluindo danças folclóricas, música regional e artesanato tradicional. Oferece apresentações regulares e workshops sobre cultura maranhense.",
    shortDescription: "Preservação de tradições culturais com apresentações e workshops",
    category: 'cultural',
    address: "Rua da Cultura, 789, Bairro São Francisco, Timon - MA",
    phone: "(99) 3212-4567",
    hours: "Segunda a sexta: 8h às 17h | Sábados: 8h às 12h",
    image: "https://images.unsplash.com/photo-1697957164068-ca4c7362222d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aW1vbiUyMG1hcmFuaGFvJTIwdG91cmlzbXxlbnwxfHx8fDE3NTczNDA4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 94,
    highlights: ["Danças folclóricas", "Música regional", "Artesanato tradicional", "Workshops"],
    entrance: 'gratuito',
    accessibility: true,
    parking: false,
    tips: [
      "Participe dos workshops de artesanato",
      "Apresentações de dança às sextas-feiras",
      "Loja com produtos artesanais locais"
    ]
  }
];

const categories = [
  { id: 'todos', label: 'Todos', icon: Map, color: '#144c9c' },
  { id: 'religioso', label: 'Religioso', icon: Church, color: '#6C757D' },
  { id: 'historico', label: 'Histórico', icon: Building2, color: '#FFC107' },
  { id: 'cultural', label: 'Cultural', icon: Music, color: '#DC3545' },
  { id: 'natural', label: 'Natural', icon: TreePine, color: '#228B22' },
  { id: 'gastronomia', label: 'Gastronomia', icon: Utensils, color: '#FF6B6B' },
  { id: 'comercio', label: 'Comércio', icon: ShoppingBag, color: '#4ECDC4' }
];

const TouristAttractionsPage = ({ onNavigateBack }: TouristAttractionPageProps) => {
  const { announceToScreenReader } = useAccessibility();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedAttraction, setSelectedAttraction] = useState<TouristAttraction | null>(null);

  // Animações
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const filtersAnimation = useScrollAnimation({ threshold: 0.1 });
  const categoriesAnimation = useScrollAnimation({ threshold: 0.1 });
  const listAnimation = useScrollAnimation({ threshold: 0.1 });

  const filteredAttractions = touristAttractions.filter(attraction => {
    const matchesCategory = selectedCategory === 'todos' || attraction.category === selectedCategory;
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attraction.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : Map;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      religioso: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300',
      historico: 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300',
      cultural: 'bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-300',
      natural: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      gastronomia: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300',
      comercio: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb 
        items={[
          { label: 'Início', onClick: onNavigateBack },
          { label: 'Sobre a cidade' },
          { label: 'Pontos Turísticos' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#144c9c] to-[#0d3b7a] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_2px,_transparent_2px)] bg-[length:60px_60px] opacity-10"></div>
        
        <div 
          ref={heroAnimation.elementRef}
          className={`relative max-w-6xl mx-auto px-4 py-16 transition-all duration-1000 ${
            heroAnimation.isVisible 
              ? 'animate-fade-in-up opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <MapPin className="h-12 w-12 mr-4 animate-pulse" />
              <div>
                <h1 className="text-white mb-2">
                  Pontos Turísticos de Timon
                </h1>
                <p className="text-lg text-white/90">
                  Descubra os encantos e a rica história da nossa cidade
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-white/80 mt-8">
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Camera className="h-5 w-5" />
                <span>6 Locais</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Star className="h-5 w-5" />
                <span>Bem Avaliados</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Heart className="h-5 w-5" />
                <span>Experiências Únicas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section 
        ref={filtersAnimation.elementRef}
        className={`bg-card border-b border-border sticky top-0 z-40 transition-all duration-1000 ${
          filtersAnimation.isVisible 
            ? 'animate-fade-in-up opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-110" />
                <Input
                  placeholder="Buscar pontos turísticos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 hover-glow transition-all duration-300"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] btn-animated">
                  <Filter className="h-4 w-4 mr-2 transition-transform duration-300 hover:scale-110" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="rating">Avaliação</SelectItem>
                  <SelectItem value="reviews">Mais avaliados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground hover:scale-105 transition-transform duration-300">
              {filteredAttractions.length} {filteredAttractions.length === 1 ? 'local encontrado' : 'locais encontrados'}
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section 
        ref={categoriesAnimation.elementRef}
        className={`bg-card transition-all duration-1000 ${
          categoriesAnimation.isVisible 
            ? 'animate-fade-in-up opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2 btn-animated hover-lift transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    ...(selectedCategory === category.id ? { 
                      backgroundColor: category.color,
                      borderColor: category.color 
                    } : {})
                  }}
                >
                  <Icon className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lista de Pontos Turísticos */}
      <main 
        ref={listAnimation.elementRef}
        className={`max-w-6xl mx-auto px-4 py-8 transition-all duration-1000 ${
          listAnimation.isVisible 
            ? 'animate-fade-in-up opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        {filteredAttractions.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg text-foreground mb-2">Nenhum ponto turístico encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou termos de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttractions.map((attraction, index) => {
              const IconComponent = getCategoryIcon(attraction.category);
              return (
                <Card 
                  key={attraction.id} 
                  className="hover-float cursor-pointer transition-all duration-300 card-animated overflow-hidden"
                  onClick={() => setSelectedAttraction(attraction)}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getCategoryColor(attraction.category)} hover:scale-105 transition-transform duration-300`}>
                        <IconComponent className="h-3 w-3 mr-1" />
                        {categories.find(cat => cat.id === attraction.category)?.label}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900 hover:scale-105 transition-transform duration-300">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {attraction.rating}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="line-clamp-2 hover:text-[#144c9c] transition-colors duration-300">{attraction.name}</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {attraction.shortDescription}
                    </p>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{attraction.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                        <Clock className="h-3 w-3" />
                        <span>{attraction.hours}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                          <Users className="h-3 w-3" />
                          <span>{attraction.reviews} avaliações</span>
                        </div>
                        
                        <Badge variant="outline" className="text-[#228B22] border-[#228B22] hover:scale-105 transition-transform duration-300">
                          {attraction.entrance === 'gratuito' ? 'Gratuito' : attraction.price}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de Detalhes */}
      {selectedAttraction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="relative overflow-hidden">
              <ImageWithFallback
                src={selectedAttraction.image}
                alt={selectedAttraction.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 hover-lift"
                onClick={() => setSelectedAttraction(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-foreground mb-2">{selectedAttraction.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 hover:scale-105 transition-transform duration-300">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedAttraction.rating}</span>
                      <span>({selectedAttraction.reviews} avaliações)</span>
                    </div>
                    <Badge className={`${getCategoryColor(selectedAttraction.category)} hover:scale-105 transition-transform duration-300`}>
                      {categories.find(cat => cat.id === selectedAttraction.category)?.label}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3 hover-glow">
                  <TabsTrigger value="info" className="btn-animated">Informações</TabsTrigger>
                  <TabsTrigger value="details" className="btn-animated">Detalhes</TabsTrigger>
                  <TabsTrigger value="tips" className="btn-animated">Dicas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 animate-fade-in-up">
                  <p className="text-muted-foreground">{selectedAttraction.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 hover:scale-105 transition-transform duration-300">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Endereço</p>
                          <p className="text-foreground">{selectedAttraction.address}</p>
                        </div>
                      </div>
                      
                      {selectedAttraction.phone && (
                        <div className="flex items-start gap-3 hover:scale-105 transition-transform duration-300">
                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Telefone</p>
                            <p className="text-foreground">{selectedAttraction.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 hover:scale-105 transition-transform duration-300">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Horário de funcionamento</p>
                          <p className="text-foreground">{selectedAttraction.hours}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 hover:scale-105 transition-transform duration-300">
                        <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Entrada</p>
                          <p className="text-foreground">{selectedAttraction.entrance === 'gratuito' ? 'Gratuito' : selectedAttraction.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4 animate-fade-in-up">
                  <div>
                    <h4 className="text-foreground mb-3">Destaques</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAttraction.highlights.map((highlight, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-[#144c9c] border-[#144c9c] hover:scale-105 transition-transform duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                      <div className={`h-3 w-3 rounded-full transition-all duration-300 ${selectedAttraction.accessibility ? 'bg-[#228B22]' : 'bg-[#DC3545]'}`}></div>
                      <span className="text-sm text-foreground">Acessibilidade</span>
                    </div>
                    
                    <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                      <div className={`h-3 w-3 rounded-full transition-all duration-300 ${selectedAttraction.parking ? 'bg-[#228B22]' : 'bg-[#DC3545]'}`}></div>
                      <span className="text-sm text-foreground">Estacionamento</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tips" className="space-y-4 animate-fade-in-up">
                  <div>
                    <h4 className="text-foreground mb-3">Dicas para a visita</h4>
                    <ul className="space-y-2">
                      {selectedAttraction.tips.map((tip, index) => (
                        <li 
                          key={index} 
                          className="flex items-start gap-2 hover:scale-105 transition-transform duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-[#144c9c] mt-2"></div>
                          <span className="text-sm text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TouristAttractionsPage;