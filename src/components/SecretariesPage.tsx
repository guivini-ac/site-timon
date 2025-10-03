import { 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Building, 
  Heart, 
  GraduationCap, 
  Shield, 
  Truck, 
  Briefcase, 
  Landmark,
  Building2,
  Hammer,
  Leaf,
  Palette,
  Trophy,
  Calculator,
  Car,
  Scale,
  Megaphone,
  FileText,
  Home,
  Clock,
  ArrowRight,
  Star,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Breadcrumb from './Breadcrumb';
import { useAccessibility } from './AccessibilityContext';
import { useSecretarias } from './SecretariasContext';
import { useState } from 'react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

interface SecretariesPageProps {
  onNavigateBack: () => void;
}

// Mapeamento de ícones
const iconMap = {
  'Building2': Building2,
  'GraduationCap': GraduationCap,
  'Heart': Heart,
  'Shield': Shield,
  'Hammer': Hammer,
  'Leaf': Leaf,
  'Users': Users,
  'Palette': Palette,
  'Trophy': Trophy,
  'Calculator': Calculator,
  'Car': Car,
  'Briefcase': Briefcase,
  'Scale': Scale,
  'Megaphone': Megaphone,
  'FileText': FileText,
  'Home': Home
};

const SecretariesPage = ({ onNavigateBack }: SecretariesPageProps) => {
  const { announceToScreenReader } = useAccessibility();
  const { 
    getActiveDepartments,
    getDepartmentBySlug
  } = useSecretarias();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  
  // Hooks de animação
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: departmentsRef, isVisible: departmentsVisible } = useScrollAnimation({ threshold: 0.1 });
  
  const activeDepartments = getActiveDepartments();

  const filteredDepartments = activeDepartments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.secretary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.services.some(service => 
      service.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    department.objectives.some(objective => 
      objective.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  const { containerRef: statsCardsRef, visibleItems: statsCardsVisible } = useStaggeredAnimation(4, 100);
  const { containerRef: departmentsCardsRef, visibleItems: departmentsCardsVisible } = useStaggeredAnimation(filteredDepartments.length, 150);

  const handleDepartmentClick = (department: any) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Início', href: '#', onClick: onNavigateBack },
          { label: 'Prefeitura', href: '#' },
          { label: 'Secretarias', href: '#', current: true }
        ]}
      />

      {/* Hero Section */}
      <div 
        ref={heroRef}
        className={`bg-gradient-to-r from-[#144c9c] to-[#0d3b7a] text-white animate-on-scroll ${heroVisible ? 'animate' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="mb-6 text-white">
              Secretarias Municipais
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Conheça a estrutura organizacional da Prefeitura Municipal de Timon, 
              suas secretarias e os responsáveis por cada área da administração pública.
            </p>
            
            {/* Busca */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar secretaria ou responsabilidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 btn-animated"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Estatísticas */}
        <div 
          ref={statsRef}
          className={`animate-on-scroll ${statsVisible ? 'animate' : ''}`}
        >
          <div 
            ref={statsCardsRef}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <Card 
              className={`text-center card-animated transition-all duration-300 ${
                statsCardsVisible[0] ? 'animate-scale-in' : 'opacity-0 scale-90'
              }`}
              style={{ animationDelay: '0ms' }}
            >
              <CardContent className="p-6">
                <Building className="h-8 w-8 text-[#144c9c] mx-auto mb-3 hover-scale transition-transform duration-200" aria-hidden="true" />
                <h3 className="text-gray-900 mb-1">{activeDepartments.length}</h3>
                <p className="text-gray-600">Secretarias</p>
              </CardContent>
            </Card>
            <Card 
              className={`text-center card-animated transition-all duration-300 ${
                statsCardsVisible[1] ? 'animate-scale-in' : 'opacity-0 scale-90'
              }`}
              style={{ animationDelay: '100ms' }}
            >
              <CardContent className="p-6">
                <User className="h-8 w-8 text-green-600 mx-auto mb-3 hover-scale transition-transform duration-200" aria-hidden="true" />
                <h3 className="text-gray-900 mb-1">{activeDepartments.filter(d => d.secretary.name).length}</h3>
                <p className="text-gray-600">Secretários</p>
              </CardContent>
            </Card>
            <Card 
              className={`text-center card-animated transition-all duration-300 ${
                statsCardsVisible[2] ? 'animate-scale-in' : 'opacity-0 scale-90'
              }`}
              style={{ animationDelay: '200ms' }}
            >
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-3 hover-scale transition-transform duration-200" aria-hidden="true" />
                <h3 className="text-gray-900 mb-1">{activeDepartments.reduce((acc, dept) => acc + dept.services.length, 0)}</h3>
                <p className="text-gray-600">Serviços</p>
              </CardContent>
            </Card>
            <Card 
              className={`text-center card-animated transition-all duration-300 ${
                statsCardsVisible[3] ? 'animate-scale-in' : 'opacity-0 scale-90'
              }`}
              style={{ animationDelay: '300ms' }}
            >
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-orange-600 mx-auto mb-3 hover-scale transition-transform duration-200" aria-hidden="true" />
                <h3 className="text-gray-900 mb-1">24h</h3>
                <p className="text-gray-600">Atendimento</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lista de Secretarias */}
        <div 
          ref={departmentsRef}
          className={`animate-on-scroll ${departmentsVisible ? 'animate' : ''}`}
        >
          <div 
            ref={departmentsCardsRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {filteredDepartments.map((department, index) => {
              const IconComponent = iconMap[department.icon as keyof typeof iconMap] || Building2;
              
              return (
                <Card 
                  key={department.id} 
                  className={`overflow-hidden card-animated cursor-pointer transition-all duration-300 ${
                    departmentsCardsVisible[index] ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => handleDepartmentClick(department)}
                >
                  <div 
                    className="p-4 text-white"
                    style={{ backgroundColor: department.color }}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-6 w-6" aria-hidden="true" />
                      <h3 className="text-white">{department.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Secretário */}
                      {department.secretary.name ? (
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={department.secretary.photo} alt={department.secretary.name} />
                            <AvatarFallback>
                              {department.secretary.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-gray-900">{department.secretary.name}</h4>
                            <Badge variant="outline">Secretário(a)</Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="text-gray-900">Sem responsável definido</h4>
                            <Badge variant="outline" className="text-orange-600">Em definição</Badge>
                          </div>
                        </div>
                      )}

                      {/* Descrição */}
                      <div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {department.description}
                        </p>
                      </div>

                      {/* Principais Serviços */}
                      <div>
                        <h4 className="text-gray-900 mb-2">Principais Serviços</h4>
                        <div className="flex flex-wrap gap-2">
                          {department.services.slice(0, 4).map((service, serviceIndex) => (
                            <Badge key={serviceIndex} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {department.services.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{department.services.length - 4} mais
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Contato */}
                      <div className="space-y-2">
                        {department.contact.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" aria-hidden="true" />
                            <span>{department.contact.phone}</span>
                          </div>
                        )}
                        {department.contact.email && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" aria-hidden="true" />
                            <span>{department.contact.email}</span>
                          </div>
                        )}
                        {department.contact.address && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            <span>{department.contact.address}</span>
                          </div>
                        )}
                      </div>

                      <Button variant="outline" className="w-full btn-animated hover-glow">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Ver Mais Informações
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-gray-900 mb-2">Nenhuma secretaria encontrada</h3>
            <p className="text-gray-600">
              Tente ajustar os termos da sua busca ou remover filtros.
            </p>
          </div>
        )}

        {/* Modal de Detalhes da Secretaria */}
        {selectedDepartment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div 
                className="p-6 text-white"
                style={{ backgroundColor: selectedDepartment.color }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const IconComponent = iconMap[selectedDepartment.icon as keyof typeof iconMap] || Building2;
                      return <IconComponent className="h-8 w-8" />;
                    })()}
                    <h2 className="text-white text-xl">{selectedDepartment.name}</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedDepartment(null)}
                    className="text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Secretário */}
                {selectedDepartment.secretary.name ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Secretário(a) Responsável</h3>
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={selectedDepartment.secretary.photo} alt={selectedDepartment.secretary.name} />
                        <AvatarFallback>
                          {selectedDepartment.secretary.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{selectedDepartment.secretary.name}</h4>
                        <p className="text-gray-600 mb-2">{selectedDepartment.secretary.role}</p>
                        <p className="text-sm text-gray-600 line-clamp-3">{selectedDepartment.secretary.biography}</p>
                        
                        {/* Contatos do Secretário */}
                        <div className="mt-3 space-y-1">
                          {selectedDepartment.secretary.email && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-3 w-3" />
                              <span>{selectedDepartment.secretary.email}</span>
                            </div>
                          )}
                          {selectedDepartment.secretary.phone && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-3 w-3" />
                              <span>{selectedDepartment.secretary.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Secretário(a) Responsável</h3>
                    <p className="text-gray-600">Responsável ainda não definido.</p>
                  </div>
                )}

                {/* Missão e Visão */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Missão e Visão</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Missão</h4>
                      <p className="text-gray-600">{selectedDepartment.mission}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Visão</h4>
                      <p className="text-gray-600">{selectedDepartment.vision}</p>
                    </div>
                  </div>
                </div>

                {/* Objetivos */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Objetivos</h3>
                  <ul className="space-y-2">
                    {selectedDepartment.objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Serviços */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Serviços Oferecidos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedDepartment.services.map((service: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contato da Secretaria */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contato</h3>
                  <div className="space-y-2">
                    {selectedDepartment.contact.address && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{selectedDepartment.contact.address}</span>
                      </div>
                    )}
                    {selectedDepartment.contact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">{selectedDepartment.contact.phone}</span>
                      </div>
                    )}
                    {selectedDepartment.contact.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">{selectedDepartment.contact.email}</span>
                      </div>
                    )}
                    {selectedDepartment.contact.workingHours && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">{selectedDepartment.contact.workingHours}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretariesPage;