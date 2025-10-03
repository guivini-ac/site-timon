import { Music, Download, Play, Pause, Volume2, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Breadcrumb from './Breadcrumb';
import { useAccessibility } from './AccessibilityContext';
import { useState } from 'react';
import { useScrollAnimation, useStaggeredAnimation, useHoverAnimation } from '../hooks/useScrollAnimation';

interface AnthemPageProps {
  onNavigateBack: () => void;
}

const AnthemPage = ({ onNavigateBack }: AnthemPageProps) => {
  const { announceToScreenReader } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Animation hooks
  const heroAnimation = useScrollAnimation({ threshold: 0.3 });
  const lyricsAnimation = useScrollAnimation({ delay: 200 });
  const historyAnimation = useScrollAnimation({ delay: 400 });
  const sidebarAnimation = useScrollAnimation({ delay: 300 });
  
  // Staggered animations for different sections
  const { containerRef: lyricsRef, visibleItems: lyricsItems } = useStaggeredAnimation(4, 200);
  const { containerRef: infoRef, visibleItems: infoItems } = useStaggeredAnimation(5, 100);
  const { containerRef: themesRef, visibleItems: themeItems } = useStaggeredAnimation(4, 150);
  
  // Player animation
  const playerAnimation = useHoverAnimation();



  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    announceToScreenReader(isPlaying ? 'Hino pausado' : 'Hino sendo reproduzido');
  };

  const anthemLyrics = [
    {
      stanza: 1,
      lines: [
        "Salve amada terra",
        "Bravo povo inteligente",
        "Que em si encerra",
        "Todo o valor da nossa gente",
        "Dos engenhos e das flores",
        "Tu surgiste para nós",
        "Entre lutas e ardores",
        "Levantaste a tua voz"
      ]
    },
    {
      stanza: "Refrão",
      lines: [
        "Timonense, tu és um forte",
        "Timonense, tu és um bom",
        "Enfrentas até a morte",
        "Pela defesa de Timon"
      ]
    },
    {
      stanza: 2,
      lines: [
        "Sempre foste bem valoroso",
        "pelo trabalho e pela fé",
        "Cultuas o glorioso",
        "Marceneiro São José",
        "Teu trabalho sempre novo",
        "De artista artesão",
        "Orgulha o nosso povo",
        "E exalta o Maranhão"
      ]
    },
    {
      stanza: "Refrão",
      lines: [
        "Timonense, tu és um forte",
        "Timonense, tu és um bom",
        "Enfrentas até a morte",
        "Pela defesa de Timon"
      ]
    }
  ];

  const anthemInfo = [
    { label: "Autores", value: "Ermelindo Soares e Chico Poeta" },
    { label: "Composição", value: "Letra e música" },
    { label: "Tema Principal", value: "Força e inteligência do povo timonense" },
    { label: "Mensagem", value: "Amor, orgulho e compromisso com Timon" },
    { label: "Características", value: "Exalta união e espírito de comunidade" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Início', href: '#', onClick: onNavigateBack },
          { label: 'Prefeitura', href: '#' },
          { label: 'Hino Municipal', href: '#', current: true }
        ]}
      />

      {/* Hero Section */}
      <div 
        ref={heroAnimation.elementRef}
        className={`bg-gradient-to-r from-[#144c9c] to-[#0d3b7a] text-white transition-all duration-1000 ${
          heroAnimation.isVisible 
            ? 'animate-fade-in-up opacity-100' 
            : 'opacity-0 transform translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className={`mb-6 text-white transition-all duration-800 delay-200 ${
              heroAnimation.isVisible 
                ? 'animate-fade-in-up opacity-100' 
                : 'opacity-0 transform translate-y-6'
            }`}>
              Hino Municipal de Timon
            </h1>
            <p className={`text-xl text-white/80 mb-8 max-w-3xl mx-auto transition-all duration-800 delay-400 ${
              heroAnimation.isVisible 
                ? 'animate-fade-in-up opacity-100' 
                : 'opacity-0 transform translate-y-6'
            }`}>
              Criado por Ermelindo Soares e Chico Poeta, nosso hino celebra a força e 
              inteligência do povo timonense, expressando o amor e o compromisso de 
              construir um futuro próspero em nossa querida cidade.
            </p>
            
            {/* Player de Áudio */}
            <div 
              ref={playerAnimation.elementRef}
              className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto transition-all duration-800 delay-600 ${
                heroAnimation.isVisible 
                  ? 'animate-scale-in opacity-100' 
                  : 'opacity-0 transform scale-90'
              } ${
                playerAnimation.isHovered 
                  ? 'bg-white/20 scale-105 shadow-2xl' 
                  : ''
              }`}
            >
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Button
                  onClick={handlePlayPause}
                  className={`bg-white text-[#144c9c] hover:bg-gray-50 rounded-full w-16 h-16 transition-all duration-300 ${
                    isPlaying ? 'animate-pulse scale-110 shadow-lg' : 'hover:scale-110'
                  }`}
                  aria-label={isPlaying ? 'Pausar hino' : 'Reproduzir hino'}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 transition-transform duration-300" aria-hidden="true" />
                  ) : (
                    <Play className="h-8 w-8 ml-1 transition-transform duration-300" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-4 text-white/70">
                <Volume2 className={`h-5 w-5 transition-all duration-300 ${isPlaying ? 'animate-pulse text-white' : ''}`} aria-hidden="true" />
                <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div className={`bg-white rounded-full h-2 transition-all duration-300 ${isPlaying ? 'w-1/3 animate-pulse' : 'w-1/4'}`}></div>
                </div>
                <span className="text-sm transition-colors duration-300 hover:text-white">1:25 / 3:45</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Letra do Hino */}
          <div 
            ref={lyricsAnimation.elementRef}
            className={`lg:col-span-2 transition-all duration-1000 ${
              lyricsAnimation.isVisible 
                ? 'animate-fade-in-up opacity-100' 
                : 'opacity-0 transform translate-y-8'
            }`}
          >
            <Card className="hover-glow transition-all duration-500 hover:shadow-xl group">
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 transition-all duration-800 delay-200 ${
                  lyricsAnimation.isVisible 
                    ? 'animate-fade-in-left opacity-100' 
                    : 'opacity-0 transform translate-x-[-20px]'
                }`}>
                  <FileText className="h-5 w-5 text-[#144c9c] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  <span className="transition-colors duration-300 group-hover:text-[#144c9c]">Letra do Hino Municipal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div ref={lyricsRef}>
                  {anthemLyrics.map((section, index) => (
                    <div 
                      key={index} 
                      className={`space-y-2 transition-all duration-700 ${
                        lyricsItems[index] 
                          ? 'animate-fade-in-left opacity-100' 
                          : 'opacity-0 transform translate-x-[-30px]'
                      }`}
                    >
                      <h3 className="text-[#144c9c] mb-3 transition-all duration-300 hover:scale-105 cursor-pointer">
                        {typeof section.stanza === 'number' ? `${section.stanza}ª Estrofe` : section.stanza}
                      </h3>
                      <div className="space-y-1 pl-4 border-l-2 border-[#144c9c]/30 hover:border-[#144c9c]/60 transition-colors duration-300">
                        {section.lines.map((line, lineIndex) => (
                          <p 
                            key={lineIndex} 
                            className="text-gray-700 italic leading-relaxed transition-all duration-300 hover:text-gray-900 hover:translate-x-2 cursor-pointer"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>



            {/* História e Significado */}
            <div 
              ref={historyAnimation.elementRef}
              className={`mt-8 transition-all duration-1000 ${
                historyAnimation.isVisible 
                  ? 'animate-fade-in-up opacity-100' 
                  : 'opacity-0 transform translate-y-8'
              }`}
            >
              <Card className="hover-float transition-all duration-500 hover:shadow-xl group">
                <CardHeader>
                  <CardTitle className={`transition-all duration-800 delay-200 group-hover:text-[#144c9c] ${
                    historyAnimation.isVisible 
                      ? 'animate-fade-in-right opacity-100' 
                      : 'opacity-0 transform translate-x-[20px]'
                  }`}>História e Significado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-gray-600 text-sm mb-4 transition-all duration-800 delay-300 hover:text-gray-700 ${
                    historyAnimation.isVisible 
                      ? 'animate-fade-in-up opacity-100' 
                      : 'opacity-0 transform translate-y-6'
                  }`}>
                    O Hino Municipal de Timon foi criado por Ermelindo Soares e Chico Poeta, 
                    dois autores que souberam capturar a essência e o espírito do povo timonense.
                  </p>
                  <p className={`text-gray-600 text-sm mb-4 transition-all duration-800 delay-500 hover:text-gray-700 ${
                    historyAnimation.isVisible 
                      ? 'animate-fade-in-up opacity-100' 
                      : 'opacity-0 transform translate-y-6'
                  }`}>
                    A obra celebra as principais características dos timonenses: sua força, 
                    inteligência e o profundo amor pela cidade. O hino expressa também o 
                    compromisso de construir um futuro próspero em Timon.
                  </p>
                  <p className={`text-gray-600 text-sm transition-all duration-800 delay-700 hover:text-gray-700 ${
                    historyAnimation.isVisible 
                      ? 'animate-fade-in-up opacity-100' 
                      : 'opacity-0 transform translate-y-6'
                  }`}>
                    Com forte senso de coletividade, o hino ressalta a união do povo 
                    timonense e seu compromisso com a defesa do território, conforme 
                    expressa o marcante refrão sobre enfrentar "até a morte" por Timon.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar com Informações */}
          <div 
            ref={sidebarAnimation.elementRef}
            className={`space-y-6 transition-all duration-1000 ${
              sidebarAnimation.isVisible 
                ? 'animate-fade-in-right opacity-100' 
                : 'opacity-0 transform translate-x-8'
            }`}
          >

            {/* Informações Técnicas */}
            <Card className={`hover-float transition-all duration-700 delay-200 hover:shadow-xl group ${
              sidebarAnimation.isVisible 
                ? 'animate-fade-in-up opacity-100' 
                : 'opacity-0 transform translate-y-8'
            }`}>
              <CardHeader>
                <CardTitle className="transition-colors duration-300 group-hover:text-[#144c9c]">Informações do Hino</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div ref={infoRef} className="space-y-4">
                  {anthemInfo.map((info, index) => (
                    <div 
                      key={index}
                      className={`transition-all duration-700 hover:bg-gray-50 p-2 rounded cursor-pointer ${
                        infoItems[index] 
                          ? 'animate-fade-in-left opacity-100' 
                          : 'opacity-0 transform translate-x-[-20px]'
                      }`}
                    >
                      <h4 className="text-gray-900 mb-1 transition-colors duration-300 hover:text-[#144c9c]">{info.label}</h4>
                      <p className="text-gray-600 text-sm transition-colors duration-300 hover:text-gray-700">{info.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>


            {/* Temas Centrais */}
            <Card className={`hover-float transition-all duration-700 delay-400 hover:shadow-xl group ${
              sidebarAnimation.isVisible 
                ? 'animate-fade-in-up opacity-100' 
                : 'opacity-0 transform translate-y-8'
            }`}>
              <CardHeader>
                <CardTitle className="transition-colors duration-300 group-hover:text-[#144c9c]">Temas Centrais</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={themesRef} className="space-y-4">
                  {[
                    {
                      title: "Força e Inteligência",
                      description: "O hino destaca as qualidades excepcionais do povo de Timon, celebrando sua força de caráter e inteligência."
                    },
                    {
                      title: "Orgulho e Amor pela Cidade", 
                      description: "Uma expressão do carinho profundo e do orgulho que os timonenses sentem por sua terra natal."
                    },
                    {
                      title: "Construção do Futuro",
                      description: "Ressalta Timon como um lugar de esperança para o futuro e para as famílias que aqui constroem suas vidas."
                    },
                    {
                      title: "União e Defesa",
                      description: "O refrão expressa um forte senso de coletividade e compromisso com a defesa do território."
                    }
                  ].map((theme, index) => (
                    <div 
                      key={index}
                      className={`transition-all duration-700 hover:bg-gray-50 p-3 rounded cursor-pointer ${
                        themeItems[index] 
                          ? 'animate-fade-in-right opacity-100' 
                          : 'opacity-0 transform translate-x-[20px]'
                      }`}
                    >
                      <h4 className="text-gray-900 mb-2 transition-colors duration-300 hover:text-[#144c9c]">{theme.title}</h4>
                      <p className="text-gray-600 text-sm transition-colors duration-300 hover:text-gray-700">
                        {theme.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Uso do Hino */}
            <Card className={`hover-float transition-all duration-700 delay-600 hover:shadow-xl group ${
              sidebarAnimation.isVisible 
                ? 'animate-fade-in-up opacity-100' 
                : 'opacity-0 transform translate-y-8'
            }`}>
              <CardHeader>
                <CardTitle className="transition-colors duration-300 group-hover:text-[#144c9c]">Protocolo de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="transition-all duration-300 hover:text-[#144c9c] hover:translate-x-2 cursor-pointer">• Solenidades oficiais do município</li>
                  <li className="transition-all duration-300 hover:text-[#144c9c] hover:translate-x-2 cursor-pointer">• Eventos cívicos e patrióticos</li>
                  <li className="transition-all duration-300 hover:text-[#144c9c] hover:translate-x-2 cursor-pointer">• Inaugurações de obras públicas</li>
                  <li className="transition-all duration-300 hover:text-[#144c9c] hover:translate-x-2 cursor-pointer">• Cerimônias de posse</li>
                  <li className="transition-all duration-300 hover:text-[#144c9c] hover:translate-x-2 cursor-pointer">• Formatura de escolas municipais</li>
                  <li className="transition-all duration-300 hover:text-[#144c9c] hover:translate-x-2 cursor-pointer">• Abertura de sessões solenes</li>
                </ul>
                <div className="mt-4 p-3 bg-[#144c9c]/5 rounded-lg hover:bg-[#144c9c]/10 transition-all duration-300 hover:scale-105">
                  <p className="text-[#144c9c] text-sm">
                    <strong>Importante:</strong> Durante a execução do hino, 
                    todos os presentes devem permanecer em pé e em posição 
                    de respeito.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnthemPage;