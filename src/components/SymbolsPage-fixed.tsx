import { Download, Shield, Flag, Stamp, Crown, Info, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Breadcrumb from './Breadcrumb';
import { useAccessibility } from './AccessibilityContext';
import { useScrollAnimation, useStaggeredAnimation, useHoverAnimation } from '../hooks/useScrollAnimation';

interface SymbolsPageProps {
  onNavigateBack: () => void;
}

const SymbolsPage = ({ onNavigateBack }: SymbolsPageProps) => {
  const { announceToScreenReader } = useAccessibility();

  // Animations hooks
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const symbolsAnimation = useStaggeredAnimation(3, 200);
  const protocolAnimation = useScrollAnimation({ threshold: 0.3, delay: 100 });
  const downloadAnimation = useScrollAnimation({ threshold: 0.3, delay: 200 });
  const historyAnimation = useScrollAnimation({ threshold: 0.2 });
  const flagHistoryAnimation = useScrollAnimation({ threshold: 0.3, delay: 150 });
  const evolutionAnimation = useScrollAnimation({ threshold: 0.3, delay: 100 });

  // Componente com hover avançado para ícones
  const AnimatedSymbolIcon = ({ icon: Icon, color, isHovered }: { 
    icon: React.ComponentType<any>, 
    color: string, 
    isHovered: boolean 
  }) => {
    return (
      <div className={`relative transition-all duration-500 ${isHovered ? 'scale-110' : ''}`}>
        <Icon 
          className={`h-5 w-5 transition-all duration-300 ${
            isHovered ? 'drop-shadow-lg' : ''
          } ${
            color === 'blue' ? 'text-blue-600' : 
            color === 'green' ? 'text-green-600' : 
            color === 'orange' ? 'text-orange-600' : 
            'text-gray-600'
          }`} 
          aria-hidden="true" 
        />
        {isHovered && (
          <div className="absolute inset-0 animate-ping">
            <Icon 
              className={`h-5 w-5 opacity-75 ${
                color === 'blue' ? 'text-blue-400' : 
                color === 'green' ? 'text-green-400' : 
                color === 'orange' ? 'text-orange-400' : 
                'text-gray-400'
              }`} 
              aria-hidden="true" 
            />
          </div>
        )}
      </div>
    );
  };



  const officialSymbols = [
    {
      name: "Brasão de Armas",
      description: "Símbolo heráldico oficial da cidade, representa a identidade e história de Timon",
      image: "https://transparencia.timon.ma.gov.br/upload/simbolos/75306.png",
      icon: Shield,
      color: "blue",
      details: [
        "Escudo português clássico",
        "Cores: azul, verde e dourado",
        "Rio Parnaíba representado",
        "Estrela de cinco pontas",
        "Ramos de café e arroz"
      ],
      legislation: "Lei Municipal nº 45/1960",
      usage: "Documentos oficiais, fachadas de prédios públicos, uniformes"
    },
    {
      name: "Bandeira Municipal",
      description: "Pavilhão oficial que representa Timon em cerimônias e eventos oficiais",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Bandeira_de_Timon.jpg",
      icon: Flag,
      color: "green",
      details: [
        "Fundo azul com faixa verde",
        "Brasão centralizado",
        "Proporção 2:3",
        "Cores oficiais da cidade",
        "Tecido oficial: algodão ou nylon"
      ],
      legislation: "Lei Municipal nº 78/1965",
      usage: "Mastros públicos, eventos oficiais, representação externa"
    },
    {
      name: "Logomarca Institucional",
      description: "Identidade visual moderna da administração municipal para comunicação",
      image: "https://timon.ma.gov.br/site/wp-content/themes/timon_atual/img/logo.png",
      icon: Crown,
      color: "orange",
      details: [
        "Design contemporâneo",
        "Versões colorida e monocromática",
        "Tipografia institucional",
        "Aplicação digital e impressa",
        "Manual de uso definido"
      ],
      legislation: "Decreto Municipal nº 1.247/2020",
      usage: "Site oficial, redes sociais, campanhas publicitárias"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "border-blue-200 bg-blue-50",
      green: "border-green-200 bg-green-50",
      purple: "border-purple-200 bg-purple-50",
      orange: "border-orange-200 bg-orange-50"
    };
    return colorMap[color as keyof typeof colorMap] || "border-gray-200 bg-gray-50";
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      blue: "text-blue-600",
      green: "text-green-600", 
      purple: "text-purple-600",
      orange: "text-orange-600"
    };
    return colorMap[color as keyof typeof colorMap] || "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Início', href: '#', onClick: onNavigateBack },
          { label: 'Prefeitura', href: '#' },
          { label: 'Símbolos Oficiais', href: '#', current: true }
        ]}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#144c9c] to-[#0d3b7a] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_white_2px,_transparent_2px)] bg-[length:60px_60px]"></div>
        </div>
        
        <div 
          ref={heroAnimation.elementRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 transition-all duration-1000 ${
            heroAnimation.isVisible 
              ? 'animate-fade-in-up opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center">
            <div className="animate-on-scroll-scale">
              <h1 className="mb-6 text-white">
                Símbolos Oficiais de Timon
              </h1>
            </div>
            <div className="animate-on-scroll delay-200">
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Conheça os símbolos oficiais que representam nossa cidade: o brasão de armas, 
                a bandeira municipal e a logomarca institucional.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-8 text-white/70 animate-on-scroll delay-400">
              {[
                { icon: Shield, label: 'Brasão', color: 'blue' },
                { icon: Flag, label: 'Bandeira', color: 'green' },
                { icon: Crown, label: 'Logomarca', color: 'orange' }
              ].map((item, index) => {
                const itemHover = useHoverAnimation();
                return (
                  <div 
                    key={item.label}
                    ref={itemHover.elementRef}
                    className="flex items-center space-x-2 hero-symbol-item hover-float transition-all duration-300 hover:text-white cursor-pointer group"
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    <div className="hero-symbol-icon">
                      <AnimatedSymbolIcon 
                        icon={item.icon} 
                        color={item.color} 
                        isHovered={itemHover.isHovered} 
                      />
                    </div>
                    <span className="transition-all duration-300 group-hover:scale-105">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Símbolos Oficiais */}
        <div 
          ref={symbolsAnimation.containerRef}
          className="space-y-12"
        >
          {officialSymbols.map((symbol, index) => {
            const SymbolCard = () => {
              const cardHover = useHoverAnimation();
              const isVisible = symbolsAnimation.visibleItems[index];
              
              return (
                <div
                  ref={cardHover.elementRef}
                  className={`transition-all duration-700 ${
                    isVisible 
                      ? 'animate-fade-in-up opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <Card 
                    className={`overflow-hidden border-2 ${getColorClasses(symbol.color)} symbol-card ripple-effect transition-all duration-500 ${
                      cardHover.isHovered ? 'shadow-2xl border-opacity-60' : 'shadow-lg'
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Imagem */}
                      <div className="p-6 flex items-center justify-center">
                        <div className="relative group">
                          <div className={`symbol-image-container transition-all duration-500 ${cardHover.isHovered ? 'transform scale-105' : ''}`}>
                            <ImageWithFallback
                              src={symbol.image}
                              alt={`${symbol.name} de Timon`}
                              className="max-w-full h-auto rounded-lg shadow-lg transition-all duration-500 group-hover:shadow-xl"
                            />
                          </div>
                          <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full ${getColorClasses(symbol.color)} border-2 border-white flex items-center justify-center shadow-lg symbol-badge ${
                            cardHover.isHovered ? 'transform scale-110 shadow-xl' : ''
                          }`}>
                            <symbol.icon className={`h-6 w-6 ${getIconColor(symbol.color)} transition-all duration-300 ${
                              cardHover.isHovered ? 'transform scale-110' : ''
                            }`} aria-hidden="true" />
                          </div>
                        </div>
                      </div>

                      {/* Informações */}
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-4 animate-on-scroll-left">
                          <h2 className="text-gray-900">{symbol.name}</h2>
                          <Badge 
                            variant="outline" 
                            className={`${getIconColor(symbol.color)} transition-all duration-300 ${
                              cardHover.isHovered ? 'scale-105' : ''
                            }`}
                          >
                            Oficial
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-6 animate-on-scroll-left delay-100">{symbol.description}</p>

                        {/* Características */}
                        <div className="mb-6 animate-on-scroll-left delay-200">
                          <h3 className="text-gray-900 mb-3">Características</h3>
                          <ul className="space-y-2">
                            {symbol.details.map((detail, detailIndex) => (
                              <li 
                                key={detailIndex} 
                                className={`flex items-center space-x-2 symbol-detail-item relative ${
                                  cardHover.isHovered ? 'transform translate-x-1' : ''
                                }`}
                                style={{ transitionDelay: `${detailIndex * 50}ms` }}
                              >
                                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${symbol.color === 'blue' ? 'bg-blue-400' : symbol.color === 'green' ? 'bg-green-400' : symbol.color === 'purple' ? 'bg-purple-400' : 'bg-orange-400'} ${
                                  cardHover.isHovered ? 'scale-125' : ''
                                }`}></div>
                                <span className="text-gray-600 text-sm">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Legislação e Uso */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 animate-on-scroll-left delay-300">
                          <div>
                            <h4 className="text-gray-900 mb-2">Legislação</h4>
                            <p className="text-gray-600 text-sm">{symbol.legislation}</p>
                          </div>
                          <div>
                            <h4 className="text-gray-900 mb-2">Uso Oficial</h4>
                            <p className="text-gray-600 text-sm">{symbol.usage}</p>
                          </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex space-x-3 animate-on-scroll-left delay-400">
                          <Button size="sm" className="flex-1 btn-animated hover-lift">
                            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                            Download HD
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 btn-animated hover-lift">
                            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                            Visualizar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            };
            
            return <SymbolCard key={index} />;
          })}
        </div>

        {/* Informações Complementares */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Protocolo de Uso */}
          <div
            ref={protocolAnimation.elementRef}
            className={`transition-all duration-700 ${
              protocolAnimation.isVisible 
                ? 'animate-fade-in-left opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
            }`}
          >
            <Card className="card-animated hover-glow h-full particle-effect">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 animate-on-scroll-scale">
                  <Info className="h-5 w-5 text-[#144c9c] transition-all duration-300 hover:scale-110" aria-hidden="true" />
                  <span>Protocolo de Uso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="animate-on-scroll-left delay-100">
                  <h4 className="text-gray-900 mb-2">Uso Obrigatório</h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li className="transition-all duration-300 hover:translate-x-1 hover:text-gray-800">• Documentos oficiais da Prefeitura</li>
                    <li className="transition-all duration-300 hover:translate-x-1 hover:text-gray-800">• Fachadas de prédios públicos</li>
                    <li className="transition-all duration-300 hover:translate-x-1 hover:text-gray-800">• Veículos oficiais</li>
                    <li className="transition-all duration-300 hover:translate-x-1 hover:text-gray-800">• Uniformes de servidores</li>
                    <li className="transition-all duration-300 hover:translate-x-1 hover:text-gray-800">• Cerimônias e eventos oficiais</li>
                  </ul>
                </div>
                <div className="animate-on-scroll-left delay-200">
                  <h4 className="text-gray-900 mb-2">Restrições</h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li className="transition-all duration-300 hover:translate-x-1 hover:text-gray-800">• Proibido uso comercial não autorizado</li>
                    <li className="transition-all duration-300 hover:translate-x-1 hover:text-gray-800">• Não pode ser alterado ou modificado</li>
                    <li className="transition-all duration-300 hover:translate-x-1 hover:text-gray-800">• Deve manter proporções originais</li>
                    <li className="transition-all duration-300 hover:translate-x-1 hover:text-gray-800">• Uso respeitoso e adequado</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Downloads e Recursos */}
          <div
            ref={downloadAnimation.elementRef}
            className={`transition-all duration-700 ${
              downloadAnimation.isVisible 
                ? 'animate-fade-in-right opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8'
            }`}
          >
            <Card className="card-animated hover-glow h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 animate-on-scroll-scale">
                  <Download className="h-5 w-5 text-green-600 transition-all duration-300 hover:scale-110" aria-hidden="true" />
                  <span>Downloads e Recursos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start btn-animated hover-lift animate-on-scroll-left delay-100">
                    <Shield className="h-4 w-4 mr-2 text-[#144c9c] transition-all duration-300" aria-hidden="true" />
                    Brasão de Armas - Alta Resolução (PNG)
                  </Button>
                  <Button variant="outline" className="w-full justify-start btn-animated hover-lift animate-on-scroll-left delay-200">
                    <Flag className="h-4 w-4 mr-2 text-green-600 transition-all duration-300" aria-hidden="true" />
                    Bandeira Municipal - Alta Resolução (JPG)
                  </Button>
                  <Button variant="outline" className="w-full justify-start btn-animated hover-lift animate-on-scroll-left delay-300">
                    <Crown className="h-4 w-4 mr-2 text-orange-600 transition-all duration-300" aria-hidden="true" />
                    Logomarca - Alta Resolução (PNG)
                  </Button>
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg hover-glow transition-all duration-300 animate-on-scroll-left delay-400">
                    <p className="text-gray-600 text-sm">
                      <strong>Manual de Identidade Visual:</strong> Disponível para download 
                      com todas as especificações técnicas e diretrizes de uso.
                    </p>
                    <Button size="sm" className="mt-2 btn-animated hover-lift">
                      <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                      Baixar Manual Completo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* História dos Símbolos */}
        <div className="mt-12 space-y-8">
          <div
            ref={historyAnimation.elementRef}
            className={`transition-all duration-800 ${
              historyAnimation.isVisible 
                ? 'animate-fade-in-up opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <Card className="card-animated hover-glow">
              <CardHeader>
                <CardTitle className="animate-on-scroll-scale">História dos Símbolos Municipais</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-600 mb-6 animate-on-scroll-left delay-100">
                  Os símbolos oficiais de Timon carregam uma rica história que reflete a identidade, 
                  a economia e os valores democráticos do nosso município. Cada elemento foi 
                  cuidadosamente concebido para representar aspectos fundamentais da cidade.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* História da Bandeira */}
          <div
            ref={flagHistoryAnimation.elementRef}
            className={`transition-all duration-800 ${
              flagHistoryAnimation.isVisible 
                ? 'animate-fade-in-up opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <Card className="card-animated hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 animate-on-scroll-scale">
                  <Flag className="h-5 w-5 text-green-600 transition-all duration-300 hover:scale-110" aria-hidden="true" />
                  <span>História da Bandeira Municipal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="animate-on-scroll-left delay-100">
                  <h4 className="text-gray-900 mb-3">Criação Original (1981)</h4>
                  <p className="text-gray-600 mb-4">
                    A primeira bandeira de Timon foi elaborada há mais de 40 anos pela professora 
                    <strong> Raimunda de Carvalho Sousa</strong>, carinhosamente conhecida como 
                    <strong> Dona Mundoca</strong>. Esta educadora visionária compreendeu a 
                    importância de criar um símbolo que representasse verdadeiramente nossa cidade.
                  </p>
                </div>

                <div className="animate-on-scroll-left delay-200">
                  <h4 className="text-gray-900 mb-3">O Símbolo Original: O Babaçu</h4>
                  <p className="text-gray-600 mb-4">
                    O elemento central da bandeira original era um <strong>cacho de babaçu 
                    entrelaçado por duas palhas de babaçu</strong>, uma escolha que não foi 
                    casual. Este símbolo destacava a importância fundamental da <strong>palmeira 
                    do babaçu como a principal fonte econômica</strong> do município de Timon, 
                    representando a base da sustentabilidade e desenvolvimento local.
                  </p>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 hover-glow transition-all duration-300">
                    <p className="text-green-800 text-sm">
                      <strong>Curiosidade:</strong> O babaçu não era apenas um recurso econômico, 
                      mas um símbolo de resistência e sustentabilidade, fornecendo desde alimento 
                      até materiais para construção e artesanato.
                    </p>
                  </div>
                </div>

                <div className="animate-on-scroll-left delay-300">
                  <h4 className="text-gray-900 mb-3">A Reformulação Democrática</h4>
                  <p className="text-gray-600 mb-4">
                    Anos depois, a bandeira passou por uma reformulação cuidadosa, sendo 
                    <strong> adaptada e adicionada para eternizar acontecimentos e características 
                    marcantes</strong> do passado e presente, incluindo fatos que se tornaram 
                    parte da economia e da história do município.
                  </p>
                </div>

                <div className="animate-on-scroll-left delay-400">
                  <h4 className="text-gray-900 mb-3">Formato Atual: Simbolismo Democrático</h4>
                  <p className="text-gray-600 mb-4">
                    A bandeira atual mantém um formato <strong>retangular terciado em banda</strong>, 
                    onde cada cor possui um significado profundo relacionado à organização 
                    democrática do poder:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg hover-glow transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full transition-all duration-300 hover:scale-110"></div>
                        <h5 className="text-gray-900">Faixa Amarelo-Ouro</h5>
                      </div>
                      <p className="text-gray-600 text-sm">Representa o <strong>Poder Legislativo</strong>, 
                      simbolizando a voz do povo e a criação das leis municipais.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover-glow transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 bg-white border border-gray-300 rounded-full transition-all duration-300 hover:scale-110"></div>
                        <h5 className="text-gray-900">Parte Central Branca</h5>
                      </div>
                      <p className="text-gray-600 text-sm">Representa o <strong>Poder Executivo</strong>, 
                      onde está localizado o brasão, simbolizando a administração municipal.</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg hover-glow transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 bg-blue-400 rounded-full transition-all duration-300 hover:scale-110"></div>
                        <h5 className="text-gray-900">Faixa Azul</h5>
                      </div>
                      <p className="text-gray-600 text-sm">Representa o <strong>Poder Judiciário</strong>, 
                      simbolizando a justiça e o cumprimento das leis.</p>
                    </div>
                  </div>
                </div>

                <div className="animate-on-scroll-left delay-500">
                  <h4 className="text-gray-900 mb-3">Preservação da Essência</h4>
                  <p className="text-gray-600 mb-4">
                    Um aspecto fundamental da reformulação foi a <strong>manutenção da essência 
                    do símbolo original</strong>. O cacho de babaçu, elemento central da criação 
                    de Dona Mundoca, foi preservado e <strong>integrado ao brasão municipal</strong>, 
                    garantindo que a história econômica e cultural de Timon continuasse representada 
                    em nosso principal símbolo.
                  </p>
                </div>

                <div className="bg-[#144c9c]/10 border border-[#144c9c]/20 p-6 rounded-lg highlight-pulse hover-glow transition-all duration-300 animate-on-scroll-scale delay-600">
                  <h4 className="text-[#144c9c] mb-3 flex items-center space-x-2">
                    <Shield className="h-5 w-5 transition-all duration-300 hover:scale-110" aria-hidden="true" />
                    <span>Legado de Dona Mundoca</span>
                  </h4>
                  <p className="text-gray-700 reveal-content">
                    A professora Raimunda de Carvalho Sousa (Dona Mundoca) deixou um legado 
                    duradouro para Timon. Sua visão de criar um símbolo que representasse 
                    verdadeiramente nossa cidade - com o babaçu como elemento central da 
                    economia local - permanece viva até hoje no coração do brasão municipal. 
                    Sua contribuição é um exemplo do poder da educação e da participação 
                    cidadã na construção da identidade municipal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Evolução dos Outros Símbolos */}
          <div
            ref={evolutionAnimation.elementRef}
            className={`transition-all duration-800 ${
              evolutionAnimation.isVisible 
                ? 'animate-fade-in-up opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <Card className="card-animated hover-glow">
              <CardHeader>
                <CardTitle className="animate-on-scroll-scale">Evolução dos Demais Símbolos</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-600 mb-4 animate-on-scroll-left delay-100">
                  O brasão de armas incorporou os elementos históricos da bandeira original, 
                  mantendo o cacho de babaçu como elemento central e adicionando outros 
                  símbolos que representam a geografia, história e aspirações de Timon.
                </p>
                <p className="text-gray-600 animate-on-scroll-left delay-200">
                  A logomarca institucional, criada mais recentemente em 2020, representa 
                  a modernização da comunicação municipal, mantendo respeito aos símbolos 
                  tradicionais enquanto oferece uma identidade visual contemporânea para 
                  a era digital.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolsPage;