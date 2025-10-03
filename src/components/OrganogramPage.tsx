import { Download, Eye, Network, Users, Building, Crown, UserCheck, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Breadcrumb from './Breadcrumb';
import { useAccessibility } from './AccessibilityContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface OrganogramPageProps {
  onNavigateBack: () => void;
}

const OrganogramPage = ({ onNavigateBack }: OrganogramPageProps) => {
  const { announceToScreenReader } = useAccessibility();
  
  // Animações
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const structureAnimation = useScrollAnimation({ threshold: 0.1 });
  const organogramAnimation = useScrollAnimation({ threshold: 0.3 });
  const downloadsAnimation = useScrollAnimation({ threshold: 0.1 });

  const hierarchyStructure = [
    {
      level: "Nível Executivo",
      positions: ["Prefeito", "Vice-prefeito"],
      description: "Comando executivo do município",
      icon: Crown,
      color: "#144c9c"
    },
    {
      level: "Nível Estratégico", 
      positions: ["Secretários Municipais", "Chefe de Gabinete", "Procurador Geral"],
      description: "Alta direção das pastas municipais",
      icon: UserCheck,
      color: "#228B22"
    },
    {
      level: "Nível Tático",
      positions: ["Diretores", "Coordenadores", "Assessores"],
      description: "Gestão intermediária das secretarias",
      icon: Users,
      color: "#FFC107"
    },
    {
      level: "Nível Operacional",
      positions: ["Servidores", "Técnicos", "Agentes"],
      description: "Execução direta dos serviços públicos",
      icon: Building,
      color: "#6C757D"
    }
  ];

  const organogramFiles = [
    {
      title: "Organograma Geral da Prefeitura",
      description: "Estrutura organizacional completa da administração municipal",
      type: "PDF",
      size: "2.1 MB",
      lastUpdate: "Março 2024"
    },
    {
      title: "Organograma da Secretaria de Saúde",
      description: "Estrutura hierárquica da pasta da saúde municipal",
      type: "PDF", 
      size: "1.8 MB",
      lastUpdate: "Fevereiro 2024"
    },
    {
      title: "Organograma da Secretaria de Educação",
      description: "Organização da rede municipal de ensino",
      type: "PDF",
      size: "1.5 MB",
      lastUpdate: "Janeiro 2024"
    },
    {
      title: "Organograma das Secretarias de Apoio",
      description: "Estrutura das secretarias de administração, finanças e obras",
      type: "PDF",
      size: "1.2 MB", 
      lastUpdate: "Dezembro 2023"
    }
  ];

  const secretaries = [
    "Administração",
    "Saúde", 
    "Educação",
    "Segurança",
    "Obras",
    "Finanças", 
    "Desenvolvimento",
    "Assist. Social"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb 
        items={[
          { label: 'Início', href: '#', onClick: onNavigateBack },
          { label: 'Prefeitura', href: '#' },
          { label: 'Organograma', href: '#', current: true }
        ]}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#144c9c] to-[#0d3b7a] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_2px,_transparent_2px)] bg-[length:60px_60px] opacity-10"></div>
        
        <div 
          ref={heroAnimation.elementRef}
          className={`max-w-6xl mx-auto px-4 py-16 relative z-10 transition-all duration-1000 ${
            heroAnimation.isVisible 
              ? 'animate-fade-in-up opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center">
            <h1 className="mb-6 text-white">
              Organograma Municipal
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Conheça a estrutura organizacional da Prefeitura Municipal de Timon, 
              com a hierarquia e organização de todas as secretarias.
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Network className="h-5 w-5" />
                <span>8 Secretarias</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Users className="h-5 w-5" />
                <span>1.250+ Servidores</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Building className="h-5 w-5" />
                <span>15 Unidades</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Estrutura Hierárquica */}
        <div 
          ref={structureAnimation.elementRef}
          className={`mb-12 transition-all duration-1000 ${
            structureAnimation.isVisible 
              ? 'animate-fade-in-up opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-foreground mb-4">Estrutura Hierárquica</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A administração municipal está organizada em níveis hierárquicos 
              que garantem eficiência e clareza na gestão pública.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hierarchyStructure.map((level, index) => (
              <Card 
                key={index} 
                className="text-center hover-float transition-all duration-300 hover:shadow-xl"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-2"
                    style={{ 
                      backgroundColor: `${level.color}15`, 
                      borderColor: level.color,
                      color: level.color 
                    }}
                  >
                    <level.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-foreground mb-2">{level.level}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{level.description}</p>
                  <div className="space-y-1">
                    {level.positions.map((position, posIndex) => (
                      <Badge 
                        key={posIndex} 
                        variant="outline" 
                        className="block hover:scale-105 transition-transform"
                      >
                        {position}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Organograma Visual */}
        <div 
          ref={organogramAnimation.elementRef}
          className={`mb-12 transition-all duration-1000 ${
            organogramAnimation.isVisible 
              ? 'animate-fade-in-up opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Card className="hover-float">
            <CardHeader>
              <CardTitle className="text-center">Organograma Simplificado</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-8">
                
                {/* Prefeito */}
                <div className="bg-[#144c9c] text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform cursor-pointer">
                  <h3 className="text-white">Prefeito Municipal</h3>
                </div>

                {/* Vice-prefeito e Gabinete */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="bg-[#228B22] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform cursor-pointer">
                    <h4 className="text-white text-sm">Vice-prefeito</h4>
                  </div>
                  <div className="bg-[#6C757D] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform cursor-pointer">
                    <h4 className="text-white text-sm">Chefe de Gabinete</h4>
                  </div>
                  <div className="bg-[#FFC107] text-black px-4 py-2 rounded-lg hover:scale-105 transition-transform cursor-pointer">
                    <h4 className="text-black text-sm">Procuradoria</h4>
                  </div>
                </div>

                {/* Secretarias */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
                  {secretaries.map((secretary, index) => (
                    <div 
                      key={index} 
                      className="bg-muted text-muted-foreground px-3 py-2 rounded text-center transition-all duration-300 hover:bg-[#144c9c] hover:text-white hover:scale-105 cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <h5 className="text-sm">{secretary}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Downloads */}
        <div 
          ref={downloadsAnimation.elementRef}
          className={`mb-12 transition-all duration-1000 ${
            downloadsAnimation.isVisible 
              ? 'animate-fade-in-up opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-foreground mb-4">Downloads dos Organogramas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Faça o download dos organogramas completos em formato PDF 
              para consulta detalhada da estrutura organizacional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {organogramFiles.map((file, index) => (
              <Card 
                key={index} 
                className="hover-float transition-all duration-300 hover:shadow-xl"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-2">{file.title}</h3>
                      <p className="text-muted-foreground text-sm">{file.description}</p>
                    </div>
                    <Badge variant="outline">{file.type}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{file.size}</span>
                    <span>Atualizado em {file.lastUpdate}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="hover-float">
            <CardHeader>
              <CardTitle>Atualização dos Organogramas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Os organogramas da Prefeitura Municipal de Timon são atualizados 
                regularmente para refletir mudanças na estrutura organizacional 
                e garantir transparência na gestão pública.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#144c9c] rounded-full"></div>
                  Revisão trimestral da estrutura
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#144c9c] rounded-full"></div>
                  Atualização após mudanças administrativas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#144c9c] rounded-full"></div>
                  Disponibilização imediata no portal
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#144c9c] rounded-full"></div>
                  Histórico de versões anteriores
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-float">
            <CardHeader>
              <CardTitle>Sobre a Estrutura Organizacional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                A estrutura organizacional da Prefeitura foi desenhada para 
                otimizar a prestação de serviços públicos e garantir eficiência 
                na gestão municipal.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#228B22] rounded-full"></div>
                  Hierarquia clara e definida
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#228B22] rounded-full"></div>
                  Distribuição equilibrada de competências
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#228B22] rounded-full"></div>
                  Canais de comunicação eficientes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#228B22] rounded-full"></div>
                  Controle e transparência
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganogramPage;