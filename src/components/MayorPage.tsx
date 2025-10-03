import { Phone, Mail, Calendar, MapPin, Users, Award, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Breadcrumb from './Breadcrumb';
import { useAccessibility } from './AccessibilityContext';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

interface MayorPageProps {
  onNavigateBack: () => void;
}

const MayorPage = ({ onNavigateBack }: MayorPageProps) => {
  const { fontSize, highContrast } = useAccessibility();

  // Hooks de animação
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: profilesRef, isVisible: profilesVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: achievementsRef, isVisible: achievementsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: contactRef, isVisible: contactVisible } = useScrollAnimation({ threshold: 0.1 });
  
  const { containerRef: achievementsCardsRef, visibleItems: achievementsCardsVisible } = useStaggeredAnimation(5, 150);

  const achievements = [
    {
      title: "Educação de Qualidade",
      description: "Priorização de investimentos na educação municipal com modernização das escolas e programas educacionais inovadores"
    },
    {
      title: "Tecnologia e Inovação", 
      description: "Implementação de soluções tecnológicas para aproximar o cidadão dos serviços públicos municipais"
    },
    {
      title: "Segurança Pública",
      description: "Fortalecimento da segurança municipal com parcerias estaduais e federais para garantir tranquilidade aos cidadãos"
    },
    {
      title: "Infraestrutura Urbana",
      description: "Melhorias na infraestrutura da cidade com base na experiência como ex-secretário adjunto de Obras"
    },
    {
      title: "Transporte Público",
      description: "Modernização e expansão do sistema de transporte público municipal para melhor atender a população timonense"
    }
  ];

  const contactInfo = [
    { label: "Gabinete do Prefeito", value: "(99) 3212-3456", icon: Phone },
    { label: "E-mail Oficial", value: "prefeito@timon.ma.gov.br", icon: Mail },
    { label: "Atendimento", value: "Segunda a Sexta, 8h às 14h", icon: Calendar },
    { label: "Localização", value: "Centro Administrativo Municipal", icon: MapPin }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${highContrast ? 'high-contrast' : ''}`}>
      <Breadcrumb 
        items={[
          { label: 'Início', href: '#', onClick: onNavigateBack },
          { label: 'Prefeitura', href: '#' },
          { label: 'Prefeito e Vice-prefeita', href: '#', current: true }
        ]}
      />

      {/* Hero Section */}
      <div 
        ref={heroRef}
        className={`bg-gradient-to-r from-[#144c9c] to-[#0d3b7a] text-white animate-on-scroll ${heroVisible ? 'animate' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className={`text-center mb-12 animate-on-scroll ${heroVisible ? 'animate' : ''}`}>
            <h1 className="mb-4 text-white font-bold">
              Prefeito e Vice-prefeita
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Conheça a atual gestão municipal de Timon (2025-2028), eleita democraticamente 
              para conduzir nossa cidade rumo ao desenvolvimento e progresso.
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div 
          ref={profilesRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 animate-on-scroll ${profilesVisible ? 'animate' : ''}`}
        >
          {/* Prefeito */}
          <Card className={`overflow-hidden card-animated animate-on-scroll-left ${profilesVisible ? 'animate' : ''}`}>
            <div className="bg-gradient-to-r from-[#144c9c] to-[#0d3b7a] p-6 text-white">
              <div className="flex items-center space-x-4">
                <ImageWithFallback
                  src="https://instagram.fthe19-1.fna.fbcdn.net/v/t51.2885-19/522408281_18519838960060830_2503442724244075856_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fthe19-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QHsjUIMxraRBUV-MOHH7g_iPeVGpMZjokEk4Ck-2bcjh9pCaJ6Yt-zzzyrT3LNKRQY&_nc_ohc=E-inKt8lVboQ7kNvwElD1Q6&_nc_gid=AMjJyeQDS8eTzjAJavvprw&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfWKA1dl_IVw0CZLOmYPppVqt08P9pjJzBheI-n7aluWIA&oe=68BCCB15&_nc_sid=8b3546"
                  alt="Foto oficial do Prefeito Rafael de Brito Sousa"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/20 hover-scale transition-all duration-300"
                />
                <div>
                  <h2 className="text-white mb-1">Rafael de Brito Sousa</h2>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Prefeito Municipal
                  </Badge>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-900 mb-2 flex items-center space-x-2">
                    <Users className="h-4 w-4 text-[#144c9c]" />
                    <span className="font-bold">Biografia</span>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Nascido em 22 de abril de 1982, Rafael de Brito Sousa é engenheiro civil 
                    formado pela Universidade Federal do Piauí (UFPI) e gestor público maranhense 
                    com sólida experiência na administração pública.
                  </p>
                  <p className="text-gray-600 mb-3">
                    Atuou como secretário adjunto de Obras em Timon, onde desenvolveu 
                    conhecimento prático em infraestrutura urbana. Foi deputado estadual 
                    por três mandatos consecutivos na Assembleia Legislativa do Maranhão, 
                    consolidando sua experiência legislativa e política.
                  </p>
                  <p className="text-gray-600">
                    Eleito democraticamente nas eleições municipais de 2024, tomou posse 
                    como prefeito de Timon em 1º de janeiro de 2025, iniciando uma nova 
                    gestão focada no desenvolvimento municipal.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2 flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-[#144c9c]" />
                    <span className="font-bold">Mandato Atual</span>
                  </h3>
                  <p className="text-gray-600">2025 - 2028</p>
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2 flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-[#144c9c]" />
                    <span className="font-bold">Formação</span>
                  </h3>
                  <p className="text-gray-600">Engenheiro Civil - UFPI</p>
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2 flex items-center space-x-2">
                    <Award className="h-4 w-4 text-[#144c9c]" />
                    <span className="font-bold">Prioridades da Gestão</span>
                  </h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Educação de qualidade</li>
                    <li>• Tecnologia e inovação</li>
                    <li>• Segurança pública</li>
                    <li>• Infraestrutura urbana</li>
                    <li>• Transporte público</li>
                  </ul>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Vice-prefeita */}
          <Card className={`overflow-hidden card-animated animate-on-scroll-right ${profilesVisible ? 'animate' : ''}`}>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <div className="flex items-center space-x-4">
                <ImageWithFallback
                  src="https://instagram.fthe19-1.fna.fbcdn.net/v/t51.2885-19/505778064_18416751844103152_2421912371216186513_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby45OTAuYzIifQ&_nc_ht=instagram.fthe19-1.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2QEzTNvgj-NuQcKVYaRqll5NxtJXusGIbhZI_83-iEqQL-_X6IXIIv4-g1-L6HBq8oo&_nc_ohc=2G5Eipo8PrQQ7kNvwE6Xm5n&_nc_gid=qx01kNdgXabSeN1LflYYFw&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfUgYAlh5eKxnqiYbh4Sb9eQMa2mrhJZf1Bawdm8OPl_Aw&oe=68BCDE03&_nc_sid=8b3546"
                  alt="Foto oficial da Vice-prefeita Professora Socorro"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/20 hover-scale transition-all duration-300"
                />
                <div>
                  <h2 className="text-white mb-1">Maria do Socorro Almeida Waquim</h2>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Vice-prefeita Municipal
                  </Badge>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-900 mb-2 flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-bold">Biografia</span>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Maria do Socorro Almeida Waquim, conhecida carinhosamente como 
                    "Professora Socorro", nasceu em 30 de novembro de 1955. É educadora 
                    e servidora pública com vasta experiência em gestão municipal.
                  </p>
                  <p className="text-gray-600 mb-3">
                    Graduada em Licenciatura em Geografia pela Universidade Federal do 
                    Piauí (UFPI), levou a rica experiência da sala de aula para a vida 
                    pública, sempre mantendo o compromisso com a educação e o desenvolvimento social.
                  </p>
                  <p className="text-gray-600">
                    Eleita vice-prefeita na chapa com Rafael Brito em 2024, foi diplomada 
                    em dezembro e tomou posse em 1º de janeiro de 2025, trazendo sua 
                    experiência em gestão pública para apoiar a nova administração municipal.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2 flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="font-bold">Mandato Atual</span>
                  </h3>
                  <p className="text-gray-600">2025 - 2028</p>
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2 flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                    <span className="font-bold">Formação</span>
                  </h3>
                  <p className="text-gray-600">Licenciatura em Geografia - UFPI</p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-2 flex items-center space-x-2">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="font-bold">Áreas de Expertise</span>
                  </h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Educação Municipal</li>
                    <li>• Gestão Pública</li>
                    <li>• Desenvolvimento Social</li>
                    <li>• Políticas Educacionais</li>
                    <li>• Políticas para as Mulheres</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prioridades da Nova Gestão */}
        <div 
          ref={achievementsRef}
          className={`mb-12 animate-on-scroll ${achievementsVisible ? 'animate' : ''}`}
        >
          <div className="text-center mb-8">
            <h2 className="text-gray-900 mb-4">Prioridades da Gestão 2025-2028</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça as principais prioridades estabelecidas pela nova gestão municipal 
              para transformar Timon em uma cidade ainda melhor para todos os cidadãos.
            </p>
          </div>
          
          <div 
            ref={achievementsCardsRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {achievements.map((achievement, index) => (
              <Card 
                key={index} 
                className={`card-animated transition-all duration-300 ${
                  achievementsCardsVisible[index] ? 'animate-scale-in' : 'opacity-0 scale-90'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Award className="h-8 w-8 text-[#144c9c] hover-scale transition-transform duration-200" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-2 font-bold">{achievement.title}</h3>
                      <p className="text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contato e Atendimento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-[#144c9c]" aria-hidden="true" />
                <span className="font-bold">Contato do Gabinete</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <contact.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-gray-500">{contact.label}</p>
                    <p className="text-gray-900">{contact.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Informações da Posse */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#144c9c]" aria-hidden="true" />
                <span className="font-bold">Posse e Mandato</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Data da Posse</p>
                <p className="text-gray-900">1º de janeiro de 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duração do Mandato</p>
                <p className="text-gray-900">4 anos (2025-2028)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Eleição</p>
                <p className="text-gray-900">Eleições Municipais 2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Diplomação</p>
                <p className="text-gray-600">Dezembro de 2024</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MayorPage;