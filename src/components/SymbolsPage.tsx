import { Download, Shield, Flag, Crown, Info, Eye, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Breadcrumb from './Breadcrumb';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAccessibility } from './AccessibilityContext';

interface SymbolsPageProps {
  onNavigateBack: () => void;
}

const SymbolsPage = ({ onNavigateBack }: SymbolsPageProps) => {
  const { announceToScreenReader } = useAccessibility();
  
  // Animações
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const symbolsAnimation = useScrollAnimation({ threshold: 0.1 });
  const infoAnimation = useScrollAnimation({ threshold: 0.3 });

  const officialSymbols = [
    {
      id: 'brasao',
      name: 'Brasão de Armas',
      description: 'O escudo heráldico oficial que representa a identidade e história de Timon',
      image: 'https://transparencia.timon.ma.gov.br/upload/simbolos/75306.png',
      icon: Shield,
      color: '#144c9c',
      features: [
        'Escudo português clássico',
        'Cores azul, verde e dourado', 
        'Rio Parnaíba representado',
        'Estrela de cinco pontas',
        'Ramos de café e arroz'
      ],
      legislation: 'Lei Municipal nº 45/1960',
      usage: 'Documentos oficiais, fachadas públicas, uniformes'
    },
    {
      id: 'bandeira',
      name: 'Bandeira Municipal',
      description: 'O pavilhão oficial que representa Timon em cerimônias e eventos',
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Bandeira_de_Timon.jpg',
      icon: Flag,
      color: '#228B22',
      features: [
        'Fundo azul com faixa verde',
        'Brasão centralizado',
        'Proporção oficial 2:3',
        'Cores institucionais',
        'Tecido oficial certificado'
      ],
      legislation: 'Lei Municipal nº 78/1965',
      usage: 'Mastros públicos, eventos oficiais, representação externa'
    },
    {
      id: 'logomarca',
      name: 'Logomarca Institucional',
      description: 'A identidade visual moderna da administração municipal',
      image: 'https://timon.ma.gov.br/site/wp-content/themes/timon_atual/img/logo.png',
      icon: Crown,
      color: '#FFC107',
      features: [
        'Design contemporâneo',
        'Versões colorida e monocromática',
        'Tipografia institucional',
        'Manual de uso definido',
        'Aplicação digital e impressa'
      ],
      legislation: 'Decreto Municipal nº 1.247/2020',
      usage: 'Site oficial, redes sociais, campanhas publicitárias'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb 
        items={[
          { label: 'Início', href: '#', onClick: onNavigateBack },
          { label: 'Prefeitura', href: '#' },
          { label: 'Símbolos Oficiais', href: '#', current: true }
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
              Símbolos Oficiais de Timon
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Conheça os símbolos que representam nossa cidade: brasão de armas, 
              bandeira municipal e logomarca institucional.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Shield className="h-5 w-5" />
                <span>Brasão</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Flag className="h-5 w-5" />
                <span>Bandeira</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Crown className="h-5 w-5" />
                <span>Logomarca</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Símbolos Oficiais */}
        <div 
          ref={symbolsAnimation.elementRef}
          className={`space-y-8 transition-all duration-1000 ${
            symbolsAnimation.isVisible 
              ? 'animate-fade-in-up opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          {officialSymbols.map((symbol, index) => (
            <Card 
              key={symbol.id} 
              className="overflow-hidden hover-float transition-all duration-300 hover:shadow-xl"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Imagem */}
                <div className="p-6 flex items-center justify-center bg-gray-50">
                  <div className="relative">
                    <ImageWithFallback
                      src={symbol.image}
                      alt={`${symbol.name} de Timon`}
                      className="max-w-full h-auto max-h-64 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    />
                    <div 
                      className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center shadow-lg"
                      style={{ borderColor: symbol.color }}
                    >
                      <symbol.icon 
                        className="h-5 w-5" 
                        style={{ color: symbol.color }}
                      />
                    </div>
                  </div>
                </div>

                {/* Informações */}
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <h2 className="text-foreground">{symbol.name}</h2>
                    <Badge variant="outline">Oficial</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{symbol.description}</p>

                  {/* Características */}
                  <div className="mb-6">
                    <h3 className="text-foreground mb-3">Características</h3>
                    <ul className="space-y-2">
                      {symbol.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: symbol.color }}
                          ></div>
                          <span className="text-muted-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Legislação e Uso */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-foreground mb-2">Legislação</h4>
                      <p className="text-muted-foreground text-sm">{symbol.legislation}</p>
                    </div>
                    <div>
                      <h4 className="text-foreground mb-2">Uso Oficial</h4>
                      <p className="text-muted-foreground text-sm">{symbol.usage}</p>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex space-x-3">
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Informações Complementares */}
        <div 
          ref={infoAnimation.elementRef}
          className={`mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 ${
            infoAnimation.isVisible 
              ? 'animate-fade-in-up opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Protocolo de Uso */}
          <Card className="hover-float">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-[#144c9c]" />
                <span>Protocolo de Uso</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-foreground mb-2">Uso Obrigatório</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Documentos oficiais da Prefeitura</li>
                  <li>• Fachadas de prédios públicos</li>
                  <li>• Veículos oficiais</li>
                  <li>• Uniformes de servidores</li>
                  <li>• Cerimônias e eventos oficiais</li>
                </ul>
              </div>
              <div>
                <h4 className="text-foreground mb-2">Restrições</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Proibido uso comercial não autorizado</li>
                  <li>• Não pode ser alterado ou modificado</li>
                  <li>• Deve manter proporções originais</li>
                  <li>• Uso respeitoso e adequado</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Downloads */}
          <Card className="hover-float">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-[#228B22]" />
                <span>Downloads e Recursos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2 text-[#144c9c]" />
                  Brasão - Alta Resolução (PNG)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Flag className="h-4 w-4 mr-2 text-[#228B22]" />
                  Bandeira - Alta Resolução (JPG)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Crown className="h-4 w-4 mr-2 text-[#FFC107]" />
                  Logomarca - Alta Resolução (PNG)
                </Button>
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground text-sm mb-2">
                    <strong>Manual de Identidade Visual:</strong> Especificações técnicas 
                    e diretrizes completas de uso.
                  </p>
                  <Button size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Baixar Manual
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* História Resumida */}
        <Card className="mt-12 hover-float">
          <CardHeader>
            <CardTitle>História dos Símbolos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Os símbolos oficiais de Timon carregam uma rica história que reflete a identidade, 
              economia e valores democráticos do nosso município. Cada elemento foi cuidadosamente 
              concebido para representar aspectos fundamentais da cidade.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-foreground mb-2 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#144c9c] rounded-full"></div>
                  <span>Poder Executivo</span>
                </h4>
                <p className="text-muted-foreground text-sm">
                  Representado na parte central branca da bandeira, onde está localizado o brasão.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-foreground mb-2 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#228B22] rounded-full"></div>
                  <span>Poder Legislativo</span>
                </h4>
                <p className="text-muted-foreground text-sm">
                  Simbolizado pela faixa verde, representando a voz do povo e as leis municipais.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-foreground mb-2 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#FFC107] rounded-full"></div>
                  <span>Poder Judiciário</span>
                </h4>
                <p className="text-muted-foreground text-sm">
                  Representado pela faixa amarelo-ouro, simbolizando a justiça e cumprimento das leis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SymbolsPage;