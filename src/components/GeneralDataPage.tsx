import { useState } from 'react';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  School, 
  Building2, 
  Thermometer,
  Calendar,
  Calculator,
  BarChart3,
  DollarSign,
  Heart,
  GraduationCap,
  Factory,
  Wheat,
  Home,
  Car,
  Droplets,
  Zap,
  Phone,
  TreePine,
  Award,
  Globe,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Progress } from './ui/progress';
import Breadcrumb from './Breadcrumb';
import { useAccessibility } from './AccessibilityContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface GeneralDataPageProps {
  onNavigateBack: () => void;
}

const GeneralDataPage = ({ onNavigateBack }: GeneralDataPageProps) => {
  const { announceToScreenReader } = useAccessibility();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Animações
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const contentAnimation = useScrollAnimation({ threshold: 0.1 });
  const statsAnimation = useScrollAnimation({ threshold: 0.3 });
  const tabAnimation = useScrollAnimation({ threshold: 0.1 });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Dados gerais do município
  const municipalData = {
    basic: {
      name: 'Timon',
      state: 'Maranhão',
      region: 'Nordeste',
      microregion: 'Teresina',
      mesoregion: 'Centro Maranhense',
      ibgeCode: '2112209',
      founded: '1938',
      emancipation: '10 de novembro de 1948',
      area: 1743.41, // km²
      population: 180457, // estimativa 2021
      density: 103.51, // hab/km²
      altitude: 72, // metros
      coordinates: {
        latitude: '-5.0950',
        longitude: '-42.8356'
      }
    },
    economic: {
      gdp: 2845.67, // milhões de reais (2019)
      gdpPerCapita: 16879.23, // reais
      participationStateGdp: 4.2, // %
      mainActivities: [
        'Comércio e Serviços',
        'Administração Pública',
        'Indústria de Transformação',
        'Agropecuária'
      ],
      economicSectors: {
        services: 68.5,
        industry: 18.3,
        agriculture: 13.2
      }
    },
    demographic: {
      populationGrowth: 1.8, // % ao ano
      urbanization: 94.2, // %
      ageGroups: {
        children: 23.4, // 0-14 anos
        young: 29.8, // 15-29 anos
        adults: 38.6, // 30-59 anos
        elderly: 8.2 // 60+ anos
      },
      gender: {
        male: 48.9,
        female: 51.1
      }
    },
    social: {
      hdi: 0.649, // IDH 2010
      hdiRanking: 3089, // posição nacional
      lifeExpectancy: 71.2, // anos
      mortality: {
        infant: 18.4, // por mil nascidos vivos
        maternal: 45.2 // por 100 mil nascidos vivos
      },
      poverty: {
        extreme: 8.7, // %
        moderate: 23.4 // %
      }
    },
    education: {
      literacy: 87.3, // %
      enrollment: {
        preschool: 89.2,
        elementary: 96.8,
        highschool: 84.5,
        higher: 23.7
      },
      schools: {
        municipal: 78,
        state: 29,
        federal: 2,
        private: 34
      },
      teachers: 2847,
      students: 48329
    },
    health: {
      hospitals: 4,
      healthCenters: 42,
      beds: 286,
      doctors: 234,
      bedsPerThousand: 1.58,
      doctorsPerThousand: 1.29
    },
    infrastructure: {
      water: {
        access: 89.3, // %
        treatment: 76.8 // %
      },
      sewage: {
        collection: 45.2, // %
        treatment: 34.7 // %
      },
      energy: {
        access: 99.1, // %
        rural: 97.4 // %
      },
      internet: {
        households: 73.5, // %
        broadband: 68.2 // %
      },
      transport: {
        pavedRoads: 67.8, // %
        publicTransport: true,
        airport: false,
        port: true // fluvial
      }
    },
    environment: {
      climate: 'Tropical Semi-Árido',
      temperature: {
        average: 27.5, // °C
        min: 22.3, // °C
        max: 35.2 // °C
      },
      rainfall: 1200, // mm/ano
      vegetation: 'Cerrado e Caatinga',
      rivers: ['Rio Parnaíba', 'Rio Poti'],
      preservedArea: 23.4 // %
    }
  };

  const statistics = [
    {
      icon: Users,
      label: 'População',
      value: municipalData.basic.population.toLocaleString('pt-BR'),
      description: 'habitantes (IBGE 2021)',
      color: '#144c9c'
    },
    {
      icon: MapPin,
      label: 'Área Territorial',
      value: `${municipalData.basic.area.toLocaleString('pt-BR')} km²`,
      description: 'área total do município',
      color: '#228B22'
    },
    {
      icon: TrendingUp,
      label: 'PIB',
      value: `R$ ${municipalData.economic.gdp.toFixed(2)} mi`,
      description: 'Produto Interno Bruto (2019)',
      color: '#6C757D'
    },
    {
      icon: Heart,
      label: 'IDH',
      value: municipalData.social.hdi.toFixed(3),
      description: 'Índice de Desenvolvimento Humano',
      color: '#DC3545'
    }
  ];

  const economicData = [
    {
      sector: 'Serviços',
      percentage: municipalData.economic.economicSectors.services,
      color: '#144c9c'
    },
    {
      sector: 'Indústria',
      percentage: municipalData.economic.economicSectors.industry,
      color: '#FFC107'
    },
    {
      sector: 'Agropecuária',
      percentage: municipalData.economic.economicSectors.agriculture,
      color: '#228B22'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb 
        items={[
          { label: 'Início', href: '#', onClick: onNavigateBack },
          { label: 'Prefeitura', href: '#' },
          { label: 'Dados Gerais', href: '#', current: true }
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
              <BarChart3 className="h-12 w-12 mr-4 animate-pulse" />
              <div>
                <h1 className="text-white mb-2">
                  Dados Gerais de Timon
                </h1>
                <p className="text-xl text-white/90">
                  Informações oficiais do município segundo IBGE
                </p>
              </div>
            </div>
            
            <div 
              ref={statsAnimation.elementRef}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 transition-all duration-1200 ${
                statsAnimation.isVisible 
                  ? 'animate-fade-in-up opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {statistics.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all duration-300 hover-float card-animated"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <stat.icon 
                    className="h-8 w-8 mx-auto mb-3 text-white transition-transform duration-300 hover:scale-110" 
                    style={{ color: stat.color }} 
                  />
                  <div className="text-2xl font-bold text-white mb-1 hover:scale-105 transition-transform">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                  <div className="text-xs text-white/60 mt-1">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div 
          ref={tabAnimation.elementRef}
          className={`transition-all duration-1000 ${
            tabAnimation.isVisible 
              ? 'animate-fade-in-up opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8 hover-glow">
              <TabsTrigger value="overview" className="flex items-center space-x-2 btn-animated">
                <Globe className="h-4 w-4" />
                <span>Visão Geral</span>
              </TabsTrigger>
              <TabsTrigger value="economy" className="flex items-center space-x-2 btn-animated">
                <DollarSign className="h-4 w-4" />
                <span>Economia</span>
              </TabsTrigger>
              <TabsTrigger value="demographics" className="flex items-center space-x-2 btn-animated">
                <Users className="h-4 w-4" />
                <span>Demografia</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center space-x-2 btn-animated">
                <Heart className="h-4 w-4" />
                <span>Social</span>
              </TabsTrigger>
              <TabsTrigger value="infrastructure" className="flex items-center space-x-2 btn-animated">
                <Building2 className="h-4 w-4" />
                <span>Infraestrutura</span>
              </TabsTrigger>
              <TabsTrigger value="environment" className="flex items-center space-x-2 btn-animated">
                <TreePine className="h-4 w-4" />
                <span>Meio Ambiente</span>
              </TabsTrigger>
            </TabsList>

            <div 
              ref={contentAnimation.elementRef}
              className={`transition-all duration-1000 ${
                contentAnimation.isVisible 
                  ? 'animate-fade-in-up opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Informações Básicas */}
                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Informações Básicas</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="hover:scale-105 transition-transform duration-300">
                          <label className="text-sm text-muted-foreground">Nome Oficial</label>
                          <p className="font-semibold text-foreground">{municipalData.basic.name}</p>
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <label className="text-sm text-muted-foreground">Estado</label>
                          <p className="font-semibold text-foreground">{municipalData.basic.state}</p>
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <label className="text-sm text-muted-foreground">Código IBGE</label>
                          <p className="font-semibold text-foreground">{municipalData.basic.ibgeCode}</p>
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <label className="text-sm text-muted-foreground">Emancipação</label>
                          <p className="font-semibold text-foreground">{municipalData.basic.emancipation}</p>
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <label className="text-sm text-muted-foreground">Microrregião</label>
                          <p className="font-semibold text-foreground">{municipalData.basic.microregion}</p>
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <label className="text-sm text-muted-foreground">Mesorregião</label>
                          <p className="font-semibold text-foreground">{municipalData.basic.mesoregion}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <label className="text-sm text-muted-foreground">Coordenadas</label>
                        <p className="text-sm text-muted-foreground">
                          Latitude: {municipalData.basic.coordinates.latitude}° | 
                          Longitude: {municipalData.basic.coordinates.longitude}°
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Indicadores Principais */}
                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Indicadores Principais</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center hover:scale-105 transition-transform duration-300">
                          <span className="text-sm text-muted-foreground">Densidade Demográfica</span>
                          <span className="font-semibold text-foreground">{municipalData.basic.density} hab/km²</span>
                        </div>
                        <div className="flex justify-between items-center hover:scale-105 transition-transform duration-300">
                          <span className="text-sm text-muted-foreground">PIB per capita</span>
                          <span className="font-semibold text-foreground">R$ {municipalData.economic.gdpPerCapita.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between items-center hover:scale-105 transition-transform duration-300">
                          <span className="text-sm text-muted-foreground">Taxa de Urbanização</span>
                          <span className="font-semibold text-foreground">{municipalData.demographic.urbanization}%</span>
                        </div>
                        <div className="flex justify-between items-center hover:scale-105 transition-transform duration-300">
                          <span className="text-sm text-muted-foreground">Expectativa de Vida</span>
                          <span className="font-semibold text-foreground">{municipalData.social.lifeExpectancy} anos</span>
                        </div>
                        <div className="flex justify-between items-center hover:scale-105 transition-transform duration-300">
                          <span className="text-sm text-muted-foreground">Taxa de Alfabetização</span>
                          <span className="font-semibold text-foreground">{municipalData.education.literacy}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Ranking e Comparações */}
                <Card className="hover-float card-animated">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                      <span>Posição no Ranking Nacional</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-2xl font-bold text-[#144c9c]">{municipalData.social.hdiRanking}°</div>
                        <div className="text-sm text-muted-foreground">IDH Nacional</div>
                        <div className="text-xs text-muted-foreground mt-1">entre 5.570 municípios</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-2xl font-bold text-[#228B22]">{municipalData.economic.participationStateGdp}%</div>
                        <div className="text-sm text-muted-foreground">PIB Estadual</div>
                        <div className="text-xs text-muted-foreground mt-1">participação no MA</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-2xl font-bold text-[#6C757D]">{municipalData.basic.altitude}m</div>
                        <div className="text-sm text-muted-foreground">Altitude</div>
                        <div className="text-xs text-muted-foreground mt-1">nível do mar</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Economy Tab */}
              <TabsContent value="economy" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Estrutura Econômica</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {economicData.map((sector, index) => (
                          <div key={index} className="space-y-2 hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-foreground">{sector.sector}</span>
                              <span className="text-sm text-muted-foreground">{sector.percentage}%</span>
                            </div>
                            <Progress value={sector.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="font-semibold mb-3 text-foreground">Principais Atividades</h4>
                        <div className="flex flex-wrap gap-2">
                          {municipalData.economic.mainActivities.map((activity, index) => (
                            <Badge key={index} variant="outline" className="hover:scale-105 transition-transform duration-300">{activity}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calculator className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Dados Econômicos</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg hover-scale transition-all duration-300">
                          <span className="text-sm font-medium text-foreground">PIB Total</span>
                          <span className="font-bold text-lg text-foreground">R$ {municipalData.economic.gdp.toFixed(2)} mi</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg hover-scale transition-all duration-300">
                          <span className="text-sm font-medium text-foreground">PIB per capita</span>
                          <span className="font-bold text-lg text-foreground">R$ {municipalData.economic.gdpPerCapita.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg hover-scale transition-all duration-300">
                          <span className="text-sm font-medium text-foreground">Participação no PIB do MA</span>
                          <span className="font-bold text-lg text-foreground">{municipalData.economic.participationStateGdp}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Demographics Tab */}
              <TabsContent value="demographics" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Estrutura Etária</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2 hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">Crianças (0-14 anos)</span>
                            <span className="text-sm text-muted-foreground">{municipalData.demographic.ageGroups.children}%</span>
                          </div>
                          <Progress value={municipalData.demographic.ageGroups.children} className="h-2" />
                        </div>
                        <div className="space-y-2 hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">Jovens (15-29 anos)</span>
                            <span className="text-sm text-muted-foreground">{municipalData.demographic.ageGroups.young}%</span>
                          </div>
                          <Progress value={municipalData.demographic.ageGroups.young} className="h-2" />
                        </div>
                        <div className="space-y-2 hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">Adultos (30-59 anos)</span>
                            <span className="text-sm text-muted-foreground">{municipalData.demographic.ageGroups.adults}%</span>
                          </div>
                          <Progress value={municipalData.demographic.ageGroups.adults} className="h-2" />
                        </div>
                        <div className="space-y-2 hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">Idosos (60+ anos)</span>
                            <span className="text-sm text-muted-foreground">{municipalData.demographic.ageGroups.elderly}%</span>
                          </div>
                          <Progress value={municipalData.demographic.ageGroups.elderly} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Crescimento Populacional</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-3xl font-bold text-[#144c9c] mb-2">
                          +{municipalData.demographic.populationGrowth}%
                        </div>
                        <div className="text-sm text-muted-foreground">Taxa de crescimento anual</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-xl font-bold text-[#DC3545]">{municipalData.demographic.gender.female}%</div>
                          <div className="text-sm text-muted-foreground">Mulheres</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-xl font-bold text-[#144c9c]">{municipalData.demographic.gender.male}%</div>
                          <div className="text-sm text-muted-foreground">Homens</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Social Tab */}
              <TabsContent value="social" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Educação */}
                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Educação</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#144c9c]">{municipalData.education.schools.municipal}</div>
                          <div className="text-xs text-muted-foreground">Escolas Municipais</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#228B22]">{municipalData.education.schools.state}</div>
                          <div className="text-xs text-muted-foreground">Escolas Estaduais</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#6C757D]">{municipalData.education.teachers.toLocaleString('pt-BR')}</div>
                          <div className="text-xs text-muted-foreground">Professores</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#FFC107]">{municipalData.education.students.toLocaleString('pt-BR')}</div>
                          <div className="text-xs text-muted-foreground">Estudantes</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <h5 className="font-medium mb-3 text-foreground">Taxa de Matrícula</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm hover:scale-105 transition-transform duration-300">
                            <span className="text-foreground">Pré-escola</span>
                            <span className="text-muted-foreground">{municipalData.education.enrollment.preschool}%</span>
                          </div>
                          <div className="flex justify-between text-sm hover:scale-105 transition-transform duration-300">
                            <span className="text-foreground">Ensino Fundamental</span>
                            <span className="text-muted-foreground">{municipalData.education.enrollment.elementary}%</span>
                          </div>
                          <div className="flex justify-between text-sm hover:scale-105 transition-transform duration-300">
                            <span className="text-foreground">Ensino Médio</span>
                            <span className="text-muted-foreground">{municipalData.education.enrollment.highschool}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Saúde */}
                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Heart className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Saúde</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#DC3545]">{municipalData.health.hospitals}</div>
                          <div className="text-xs text-muted-foreground">Hospitais</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#144c9c]">{municipalData.health.healthCenters}</div>
                          <div className="text-xs text-muted-foreground">Postos de Saúde</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#228B22]">{municipalData.health.beds}</div>
                          <div className="text-xs text-muted-foreground">Leitos</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#6C757D]">{municipalData.health.doctors}</div>
                          <div className="text-xs text-muted-foreground">Médicos</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between hover:scale-105 transition-transform duration-300">
                            <span className="text-foreground">Leitos por mil hab.</span>
                            <span className="font-medium text-foreground">{municipalData.health.bedsPerThousand}</span>
                          </div>
                          <div className="flex justify-between hover:scale-105 transition-transform duration-300">
                            <span className="text-foreground">Médicos por mil hab.</span>
                            <span className="font-medium text-foreground">{municipalData.health.doctorsPerThousand}</span>
                          </div>
                          <div className="flex justify-between hover:scale-105 transition-transform duration-300">
                            <span className="text-foreground">Mortalidade infantil</span>
                            <span className="font-medium text-foreground">{municipalData.social.mortality.infant}/1000</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pobreza e IDH */}
                <Card className="hover-float card-animated">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                      <span>Indicadores Sociais</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-2xl font-bold text-[#FFC107] mb-2">{municipalData.social.hdi}</div>
                        <div className="text-sm text-muted-foreground mb-1">Índice de Desenvolvimento Humano</div>
                        <Badge variant="outline" className="text-xs">Médio Desenvolvimento</Badge>
                      </div>
                      <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-2xl font-bold text-[#DC3545] mb-2">{municipalData.social.poverty.extreme}%</div>
                        <div className="text-sm text-muted-foreground mb-1">Pobreza Extrema</div>
                        <div className="text-xs text-muted-foreground">População vulnerável</div>
                      </div>
                      <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-2xl font-bold text-[#FFC107] mb-2">{municipalData.social.poverty.moderate}%</div>
                        <div className="text-sm text-muted-foreground mb-1">Pobreza Moderada</div>
                        <div className="text-xs text-muted-foreground">Renda familiar baixa</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Infrastructure Tab */}
              <TabsContent value="infrastructure" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Saneamento */}
                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Droplets className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Saneamento Básico</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">Acesso à Água Tratada</span>
                            <span className="text-sm text-muted-foreground">{municipalData.infrastructure.water.access}%</span>
                          </div>
                          <Progress value={municipalData.infrastructure.water.access} className="h-2" />
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">Tratamento de Água</span>
                            <span className="text-sm text-muted-foreground">{municipalData.infrastructure.water.treatment}%</span>
                          </div>
                          <Progress value={municipalData.infrastructure.water.treatment} className="h-2" />
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">Coleta de Esgoto</span>
                            <span className="text-sm text-muted-foreground">{municipalData.infrastructure.sewage.collection}%</span>
                          </div>
                          <Progress value={municipalData.infrastructure.sewage.collection} className="h-2" />
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">Tratamento de Esgoto</span>
                            <span className="text-sm text-muted-foreground">{municipalData.infrastructure.sewage.treatment}%</span>
                          </div>
                          <Progress value={municipalData.infrastructure.sewage.treatment} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Energia e Telecomunicações */}
                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Energia e Telecomunicações</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">Energia Elétrica</span>
                            <span className="text-sm text-muted-foreground">{municipalData.infrastructure.energy.access}%</span>
                          </div>
                          <Progress value={municipalData.infrastructure.energy.access} className="h-2" />
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">Energia Rural</span>
                            <span className="text-sm text-muted-foreground">{municipalData.infrastructure.energy.rural}%</span>
                          </div>
                          <Progress value={municipalData.infrastructure.energy.rural} className="h-2" />
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">Internet Domiciliar</span>
                            <span className="text-sm text-muted-foreground">{municipalData.infrastructure.internet.households}%</span>
                          </div>
                          <Progress value={municipalData.infrastructure.internet.households} className="h-2" />
                        </div>
                        <div className="hover:scale-105 transition-transform duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">Banda Larga</span>
                            <span className="text-sm text-muted-foreground">{municipalData.infrastructure.internet.broadband}%</span>
                          </div>
                          <Progress value={municipalData.infrastructure.internet.broadband} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Transporte */}
                <Card className="hover-float card-animated">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Car className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                      <span>Transporte e Mobilidade</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-lg font-bold text-[#144c9c]">{municipalData.infrastructure.transport.pavedRoads}%</div>
                        <div className="text-sm text-muted-foreground">Vias Pavimentadas</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-lg font-bold text-[#228B22]">
                          {municipalData.infrastructure.transport.publicTransport ? 'Sim' : 'Não'}
                        </div>
                        <div className="text-sm text-muted-foreground">Transporte Público</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-lg font-bold text-[#6C757D]">
                          {municipalData.infrastructure.transport.airport ? 'Sim' : 'Não'}
                        </div>
                        <div className="text-sm text-muted-foreground">Aeroporto</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover-scale transition-all duration-300">
                        <div className="text-lg font-bold text-[#FFC107]">
                          {municipalData.infrastructure.transport.port ? 'Sim' : 'Não'}
                        </div>
                        <div className="text-sm text-muted-foreground">Porto Fluvial</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Environment Tab */}
              <TabsContent value="environment" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Clima */}
                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Thermometer className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Características Climáticas</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-4 hover-scale transition-all duration-300">
                        <div className="text-lg font-bold text-[#FFC107] mb-1">{municipalData.environment.climate}</div>
                        <div className="text-sm text-muted-foreground">Tipo Climático</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#DC3545]">{municipalData.environment.temperature.max}°C</div>
                          <div className="text-xs text-muted-foreground">Temp. Máxima</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#228B22]">{municipalData.environment.temperature.average}°C</div>
                          <div className="text-xs text-muted-foreground">Temp. Média</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-lg font-bold text-[#144c9c]">{municipalData.environment.temperature.min}°C</div>
                          <div className="text-xs text-muted-foreground">Temp. Mínima</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <div className="flex justify-between items-center hover:scale-105 transition-transform duration-300">
                          <span className="text-sm font-medium text-foreground">Precipitação Anual</span>
                          <span className="font-semibold text-foreground">{municipalData.environment.rainfall} mm</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Geografia e Meio Ambiente */}
                  <Card className="hover-float card-animated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TreePine className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                        <span>Geografia e Meio Ambiente</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="hover:scale-105 transition-transform duration-300">
                        <label className="text-sm text-muted-foreground">Vegetação Predominante</label>
                        <p className="font-semibold text-foreground">{municipalData.environment.vegetation}</p>
                      </div>
                      
                      <div className="hover:scale-105 transition-transform duration-300">
                        <label className="text-sm text-muted-foreground">Principais Rios</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {municipalData.environment.rivers.map((river, index) => (
                            <Badge key={index} variant="outline" className="hover:scale-105 transition-transform duration-300">{river}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover-scale transition-all duration-300">
                          <div className="text-2xl font-bold text-[#228B22] mb-1">{municipalData.environment.preservedArea}%</div>
                          <div className="text-sm text-muted-foreground">Área Preservada</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Download e Links */}
          <Card className="mt-8 hover-float card-animated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-[#144c9c] transition-transform duration-300 hover:scale-110" />
                <span>Downloads e Links Úteis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start btn-animated hover-lift">
                  <Download className="h-4 w-4 mr-2" />
                  Relatório Completo PDF
                </Button>
                <Button variant="outline" className="justify-start btn-animated hover-lift">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  IBGE - Cidades@
                </Button>
                <Button variant="outline" className="justify-start btn-animated hover-lift">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Atlas do Desenvolvimento
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover-glow transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-[#144c9c] mt-0.5 transition-transform duration-300 hover:scale-110" />
                  <div>
                    <p className="text-sm text-[#144c9c] mb-2">
                      <strong>Fonte dos Dados:</strong> Instituto Brasileiro de Geografia e Estatística (IBGE)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Os dados apresentados são baseados nos censos demográficos, pesquisas amostrais e 
                      estimativas oficiais do IBGE, última atualização em 2021.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeneralDataPage;