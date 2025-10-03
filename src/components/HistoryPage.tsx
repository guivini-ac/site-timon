import { Calendar, MapPin, Users, Building, Construction, Factory, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Breadcrumb from './Breadcrumb';
import { useAccessibility } from './AccessibilityContext';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

interface HistoryPageProps {
  onNavigateBack: () => void;
}

const HistoryPage = ({ onNavigateBack }: HistoryPageProps) => {
  const { announceToScreenReader } = useAccessibility();
  
  // Hooks de animação
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: timelineRef, isVisible: timelineVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: sidebarRef, isVisible: sidebarVisible } = useScrollAnimation({ threshold: 0.1 });
  
  const { containerRef: milestonesRef, visibleItems: milestonesVisible } = useStaggeredAnimation(8, 150);
  const { containerRef: cardsRef, visibleItems: cardsVisible } = useStaggeredAnimation(4, 200);
  const { containerRef: statsRef, visibleItems: statsVisible } = useStaggeredAnimation(4, 100);

  const historicalMilestones = [
    {
      year: "Séc. XVIII",
      title: "Passagem de Santo Antônio",
      description: "Estabelecimento das comunicações entre Vila da Mocha (hoje Oeiras/PI) e Aldeias Altas (hoje Caxias/MA). Único aglomerado humano existente até 1779."
    },
    {
      year: "1855",
      title: "Elevação à Vila",
      description: "O presidente da Província do Maranhão, Eduardo Olímpio, elevou o povoado à categoria de vila com o nome de São José do Parnaíba."
    },
    {
      year: "1863-1864",
      title: "Revogação e Renomeação",
      description: "A lei foi revogada em 1863 e no ano seguinte passou a ser chamado São José das Cajazeiras."
    },
    {
      year: "1890",
      title: "Vila de Flores",
      description: "Em 22 de dezembro, o primeiro governador republicano do Maranhão elevou o povoado à categoria de vila com o nome de Flores."
    },
    {
      year: "1896",
      title: "Restauração da Vila",
      description: "Após três anos como povoado novamente, Flores voltou a ser vila com infraestrutura necessária para funcionar como tal."
    },
    {
      year: "1924",
      title: "Elevação à Cidade",
      description: "Em 10 de abril, através da Lei nº 1.139, foi elevada à categoria de cidade, mantendo o nome de Flores."
    },
    {
      year: "1939",
      title: "Ponte Metálica",
      description: "Inauguração da Ponte Metálica projetada pelo engenheiro alemão Germano Franz, ligando Teresina a Timon após 17 anos de construção."
    },
    {
      year: "1943",
      title: "Mudança para Timon",
      description: "Por exigência do IBGE, o Governador Paulo Ramos editou o Decreto-Lei nº 820, mudando o nome para Timon em homenagem ao intelectual João Francisco Lisboa."
    }
  ];

  const demographicData = [
    { label: "População (2024)", value: "182.241", icon: Users },
    { label: "Área", value: "1.763,22 km²", icon: MapPin },
    { label: "Densidade (2022)", value: "98,95 hab/km²", icon: Building },
    { label: "Fundação como Timon", value: "1943", icon: Calendar }
  ];

  const populationGrowth = [
    { year: "1900", population: "7.136" },
    { year: "1920", population: "12.877" },
    { year: "1940", population: "17.118" },
    { year: "1950", population: "21.154" },
    { year: "1960", population: "29.407" },
    { year: "1970", population: "36.893" },
    { year: "1980", population: "74.399" },
    { year: "1991", population: "107.439" },
    { year: "2000", population: "129.692" },
    { year: "2010", population: "155.460" },
    { year: "2022", population: "174.465" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Início', href: '#', onClick: onNavigateBack },
          { label: 'Prefeitura', href: '#' },
          { label: 'História do Município', href: '#', current: true }
        ]}
      />

      {/* Hero Section */}
      <div 
        ref={heroRef}
        className={`bg-gradient-to-r from-[#144c9c] to-[#0d3b7a] text-white animate-on-scroll ${heroVisible ? 'animate' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`animate-on-scroll-left ${heroVisible ? 'animate' : ''}`}>
              <h1 className="mb-6 text-white font-bold">
                História do Município de Timon
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Conheça a rica história de Timon, da Passagem de Santo Antônio no século XVIII 
                até a quarta maior cidade do Maranhão, conurbada com Teresina e parte da 
                Região Integrada de Desenvolvimento da Grande Teresina.
              </p>
              <div 
                ref={statsRef}
                className="grid grid-cols-2 gap-4"
              >
                {demographicData.map((item, index) => (
                  <div 
                    key={index} 
                    className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 hover-float transition-all duration-300 ${
                      statsVisible[index] ? 'animate-scale-in' : 'opacity-0 scale-90'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <item.icon className="h-5 w-5 text-white/70" aria-hidden="true" />
                      <span className="text-sm text-white/70">{item.label}</span>
                    </div>
                    <p className="text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`relative animate-on-scroll-right ${heroVisible ? 'animate' : ''}`}>
              <ImageWithFallback
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/EDI_7533.jpg/330px-EDI_7533.jpg"
                alt="Vista panorâmica da cidade de Timon - MA"
                className="rounded-lg shadow-2xl w-full h-96 object-cover hover-tilt transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div 
        ref={contentRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div 
            ref={cardsRef}
            className={`lg:col-span-2 space-y-8 animate-on-scroll ${contentVisible ? 'animate' : ''}`}
          >
            {/* Origem */}
            <div 
              className={`card-animated transition-all duration-300 ${
                cardsVisible[0] ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
              }`}
              style={{ animationDelay: '0ms' }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-[#144c9c]" aria-hidden="true" />
                    <span className="font-bold">Origem</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    A ocupação de Timon começou com o estabelecimento das comunicações entre a Vila da Mocha, 
                    hoje Oeiras, no Piauí, e Aldeias Altas, hoje Caxias, no Maranhão, ainda no século XVIII. 
                    A Passagem de Santo Antônio, como se chamava o ponto de travessia no Rio Parnaíba, 
                    situava-se a montante de Timon, distante 13km da sede.
                  </p>
                  <p>
                    Até 1779, era o único aglomerado humano existente, inserido no traçado da estrada real 
                    que ligava os dois estados. Com a instalação de Teresina, em meados do século XIX, 
                    ganhou importância o porto de São José do Parnaíba (mais tarde das Cajazeiras), 
                    por situar-se privilegiadamente defronte à nova capital do Piauí.
                  </p>
                  <p>
                    Foi então que fazendeiros de diversas regiões e aventureiros vindos com os jesuítas 
                    que colonizaram as Aldeias Altas estabeleceram-se ao longo de uma outra estrada, 
                    aberta para ligar Teresina àquele povoado maranhense.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Flores: de vila à cidade */}
            <div 
              className={`card-animated transition-all duration-300 ${
                cardsVisible[1] ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
              }`}
              style={{ animationDelay: '200ms' }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-green-600" aria-hidden="true" />
                    <span className="font-bold">Flores: de vila à cidade</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Proclamada a República, em 1889, o primeiro governador do estado do Maranhão sancionou, 
                    a 22 de dezembro de 1890, a lei que eleva o povoado de São José das Cajazeiras à 
                    categoria de vila com o nome de Flores.
                  </p>
                  <p>
                    Porém cerca de três anos depois, foi constatado que Flores não tinha a infraestrutura 
                    necessária para funcionar como vila, então o decreto de 1890 foi anulado e Flores 
                    voltou a ser um povoado. Somente em 1896, o povoado voltou a ser uma vila por já 
                    ter a infraestrutura necessária para funcionar como tal.
                  </p>
                  <p>
                    Em 10 de abril de 1924, foi elevada à categoria de cidade, mantendo o nome de Flores, 
                    através da Lei nº 1.139, assinada pelo governador Godofredo Mendes Viana. Foi nessa 
                    época que o Cel. Firmo Pedreira doou para a cidade uma área de um quilômetro quadrado 
                    de terra, onde foi erguido o primeiro templo católico, feito de pedra.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* A Ponte Metálica e os anos 1920-1940 */}
            <div 
              className={`card-animated transition-all duration-300 ${
                cardsVisible[2] ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
              }`}
              style={{ animationDelay: '400ms' }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Construction className="h-5 w-5 text-[#144c9c]" aria-hidden="true" />
                    <span className="font-bold">A Ponte Metálica e o desenvolvimento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Em 1927, assumiu a administração do município o Dr. Francisco Vitorino de Assunção, 
                    que fez obras muito importantes ao município como ligar Flores a Matões por meio de 
                    uma estrada, além de abastecer a cidade com energia elétrica - algo inovador para 
                    a época - através de um cabo submarino que passava pela Ponte Metálica.
                  </p>
                  <p>
                    A Ponte Metálica foi inaugurada em 1939, após 17 anos de construção, para ligar 
                    Teresina a Timon. Foi projetada pelo engenheiro alemão Germano Franz e com o tempo 
                    virou um dos símbolos tanto da cidade de Teresina quanto de Timon, sendo sua 
                    importância tão grande que foi declarada patrimônio cultural pelo IPHAN em 2008.
                  </p>
                  <p>
                    Dentre os membros do grupo de Assunção, se destacou o jornalista Antônio Lemos, 
                    que fez circular na época o jornal "Gazeta de Flôres" e o Dr. Jaime Rios, que 
                    exerceu o cargo de prefeito por três vezes e que também teve sua casa como ponto 
                    de encontro do então presidente Getúlio Vargas e Nilo Peçanha, que estavam 
                    viajando a Teresina.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* A mudança para Timon */}
            <div 
              className={`card-animated transition-all duration-300 ${
                cardsVisible[3] ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
              }`}
              style={{ animationDelay: '600ms' }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-[#144c9c]" aria-hidden="true" />
                    <span className="font-bold">De Flores para Timon</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    No início dos anos 1940, em decorrência do Estado Novo, o Sr. Urbano Martins passou 
                    a ser o interventor do município e fez grandes obras como a construção do campo que 
                    futuramente seria o Estádio Miguel Lima, deu incentivo ao desenvolvimento das artes 
                    no município, e também ocorreu a mudança de nome do município de Flores para Timon.
                  </p>
                  <p>
                    Em 1943, por exigência do IBGE que não admitia duas cidades homônimas, o Governador 
                    Paulo Ramos editou o Decreto-Lei nº 820, mudando o nome para Timon, numa homenagem 
                    ao intelectual maranhense João Francisco Lisboa, que deixou uma obra com o título 
                    "Jornal de Tímon" (numa referência ao célebre filósofo da Antiga Grécia).
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Linha do Tempo */}
            <div 
              ref={timelineRef}
              className={`card-animated animate-on-scroll ${timelineVisible ? 'animate' : ''}`}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-[#144c9c]" aria-hidden="true" />
                    <span className="font-bold">Marcos Históricos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    ref={milestonesRef}
                    className="space-y-6"
                  >
                    {historicalMilestones.map((milestone, index) => (
                      <div 
                        key={index} 
                        className={`flex space-x-4 hover-lift transition-all duration-300 p-2 rounded-lg ${
                          milestonesVisible[index] ? 'animate-fade-in-left' : 'opacity-0 translate-x-8'
                        }`}
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="bg-[#144c9c]/10 text-[#144c9c] border-[#144c9c]/30 hover-scale">
                            {milestone.year}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-2">{milestone.title}</h4>
                          <p className="text-gray-600 text-sm">{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div 
            ref={sidebarRef}
            className={`space-y-6 animate-on-scroll-right ${sidebarVisible ? 'animate' : ''}`}
          >
            {/* Informações Gerais */}
            <Card className="card-animated hover-glow">
              <CardHeader>
                <CardTitle className="font-bold">Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-gray-900 mb-1">Estado</h4>
                  <p className="text-gray-600">Maranhão</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Posição no Estado</h4>
                  <p className="text-gray-600">4ª maior cidade</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Região Imediata</h4>
                  <p className="text-gray-600">Timon</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Região Intermediária</h4>
                  <p className="text-gray-600">Caxias</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Microrregião</h4>
                  <p className="text-gray-600">Caxias</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Mesorregião</h4>
                  <p className="text-gray-600">Leste Maranhense</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Gentílico</h4>
                  <p className="text-gray-600">Timonense</p>
                </div>
              </CardContent>
            </Card>

            {/* Geografia */}
            <Card className="card-animated hover-glow">
              <CardHeader>
                <CardTitle className="font-bold">Geografia e Território</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-gray-900 mb-1">Área Total</h4>
                  <p className="text-gray-600">1.763,22 km²</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Posição no MA</h4>
                  <p className="text-gray-600">49º de 217 municípios</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Posição no Brasil</h4>
                  <p className="text-gray-600">846º de 5.570 municípios</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Hierarquia Urbana</h4>
                  <p className="text-gray-600">Capital Regional</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Arranjo Populacional</h4>
                  <p className="text-gray-600">Grande Teresina</p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Região de Planejamento</h4>
                  <p className="text-gray-600">Médio Parnaíba</p>
                </div>
              </CardContent>
            </Card>

            {/* Crescimento Populacional */}
            <Card className="card-animated hover-glow">
              <CardHeader>
                <CardTitle className="font-bold">Crescimento Populacional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {populationGrowth.slice(-6).map((data, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm text-gray-600">{data.year}</span>
                      <span className="text-gray-900">{data.population}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-[#144c9c]/5 rounded-lg">
                  <p className="text-xs text-gray-600">
                    <strong>Estimativa 2024:</strong> 182.241 habitantes
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Imagem Histórica */}
            <Card className="card-animated hover-glow">
              <CardHeader>
                <CardTitle className="font-bold">Patrimônio Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageWithFallback
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ponte_Met%C3%A1lica_Teresina.jpg/250px-Ponte_Met%C3%A1lica_Teresina.jpg"
                  alt="Ponte Metálica de Timon, patrimônio histórico tombado pelo IPHAN em 2008"
                  className="w-full h-40 object-cover rounded-lg mb-3 hover-scale transition-transform duration-300"
                />
                <p className="text-sm text-gray-600">
                  A Ponte Metálica, inaugurada em 1939 e projetada pelo engenheiro alemão 
                  Germano Franz, é patrimônio cultural tombado pelo IPHAN desde 2008.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;