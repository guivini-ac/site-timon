import { 
  Home, 
  FileText, 
  Calendar, 
  Users,
  Building2,
  Image,
  Book,
  User,
  Music,
  Shield,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  Search,
  Settings,
  Lock,
  FileCheck,
  Scale,
  Globe,
  Accessibility,
  Eye,
  Map
} from 'lucide-react';
import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Breadcrumb from './Breadcrumb';

interface SitemapPageProps {
  onNavigateBack: () => void;
}

const SitemapPage = ({ onNavigateBack }: SitemapPageProps) => {
  const { elementRef: contentRef, isVisible: isContentVisible } = useScrollAnimation();
  const [searchTerm, setSearchTerm] = useState('');

  const breadcrumbItems = [
    {
      label: 'Início',
      onClick: onNavigateBack
    },
    {
      label: 'Mapa do Site'
    }
  ];

  const siteStructure = [
    {
      category: 'Página Principal',
      icon: Home,
      description: 'Portal de entrada da Prefeitura de Timon',
      pages: [
        { name: 'Início', path: '/', description: 'Página inicial com informações principais' }
      ]
    },
    {
      category: 'Notícias e Comunicação',
      icon: FileText,
      description: 'Central de informações e comunicados oficiais',
      pages: [
        { name: 'Notícias', path: '/noticias', description: 'Últimas notícias e comunicados da prefeitura' },
        { name: 'Agenda Pública', path: '/agenda', description: 'Agenda oficial do prefeito e eventos públicos' },
        { name: 'Diário Oficial', path: '/diario-oficial', description: 'Publicações oficiais do município' }
      ]
    },
    {
      category: 'Estrutura Municipal',
      icon: Building2,
      description: 'Organização e estrutura da administração municipal',
      pages: [
        { name: 'Secretarias', path: '/secretarias', description: 'Estrutura das secretarias municipais' },
        { name: 'Organograma', path: '/organograma', description: 'Estrutura organizacional da prefeitura' },
        { name: 'Prefeito', path: '/prefeito', description: 'Informações sobre o prefeito municipal' }
      ]
    },
    {
      category: 'Serviços ao Cidadão',
      icon: Users,
      description: 'Serviços disponíveis para a população',
      pages: [
        { name: 'Conecta Timon', path: '/servicos/conecta-timon', description: 'Portal de serviços digitais' },
        { name: 'IPTU Online', path: '/servicos/iptu', description: 'Consulta e pagamento de IPTU' },
        { name: 'Protocolo Online', path: '/servicos/protocolo', description: 'Protocolo eletrônico de documentos' },
        { name: 'Ouvidoria', path: '/servicos/ouvidoria', description: 'Canal de comunicação com o cidadão' },
        { name: 'Formulários', path: '/formularios', description: 'Formulários para solicitação de serviços' },
        { name: 'Atendimento ao Cidadão', path: '/servicos/atendimento', description: 'Informações sobre atendimento presencial' }
      ]
    },
    {
      category: 'Transparência Pública',
      icon: Eye,
      description: 'Transparência e prestação de contas públicas',
      pages: [
        { name: 'Portal da Transparência', path: '/transparencia', description: 'Informações sobre gastos públicos' },
        { name: 'Lei de Acesso à Informação', path: '/transparencia/lai', description: 'Pedidos de acesso à informação' },
        { name: 'Prestação de Contas', path: '/transparencia/contas', description: 'Relatórios de prestação de contas' },
        { name: 'Licitações e Contratos', path: '/transparencia/licitacoes', description: 'Processos licitatórios e contratos' },
        { name: 'Receitas e Despesas', path: '/transparencia/receitas-despesas', description: 'Demonstrativo de receitas e despesas' },
        { name: 'Relatórios Fiscais', path: '/transparencia/relatorios', description: 'Relatórios de gestão fiscal' }
      ]
    },
    {
      category: 'História e Cultura',
      icon: Book,
      description: 'Patrimônio histórico e cultural de Timon',
      pages: [
        { name: 'História de Timon', path: '/historia', description: 'História do município de Timon' },
        { name: 'Símbolos Oficiais', path: '/simbolos', description: 'Bandeira, brasão e símbolos municipais' },
        { name: 'Hino Municipal', path: '/hino', description: 'Hino oficial de Timon' },
        { name: 'Pontos Turísticos', path: '/turismo', description: 'Atrações turísticas da cidade' },
        { name: 'Galeria de Fotos', path: '/galeria', description: 'Galeria de imagens da cidade e eventos' }
      ]
    },
    {
      category: 'Informações Legais',
      icon: Scale,
      description: 'Documentos legais e políticas do site',
      pages: [
        { name: 'Termos de Uso', path: '/termos-de-uso', description: 'Termos e condições de uso do site' },
        { name: 'Política de Privacidade', path: '/politica-de-privacidade', description: 'Política de privacidade e proteção de dados' },
        { name: 'Acessibilidade', path: '/acessibilidade', description: 'Informações sobre acessibilidade do site' }
      ]
    }
  ];

  const quickLinks = [
    { name: 'Telefones Úteis', icon: Phone, description: 'Lista de contatos importantes' },
    { name: 'Endereços das Secretarias', icon: MapPin, description: 'Localização das secretarias municipais' },
    { name: 'Horários de Atendimento', icon: Calendar, description: 'Horários de funcionamento dos órgãos' },
    { name: 'Como Chegar', icon: MapPin, description: 'Localização da prefeitura e órgãos' }
  ];

  const externalLinks = [
    { name: 'Portal da Transparência Nacional', url: 'https://portaldatransparencia.gov.br' },
    { name: 'Tribunal de Contas do Estado', url: 'https://www.tce.ma.gov.br' },
    { name: 'Governo do Estado do Maranhão', url: 'https://www.ma.gov.br' },
    { name: 'Ministério Público do Maranhão', url: 'https://www.mpma.mp.br' },
    { name: 'IBGE - Timon', url: 'https://cidades.ibge.gov.br/brasil/ma/timon' }
  ];

  // Filtrar conteúdo baseado na busca
  const filteredSiteStructure = searchTerm 
    ? siteStructure.map(section => ({
        ...section,
        pages: section.pages.filter(page => 
          page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(section => section.pages.length > 0)
    : siteStructure;

  const filteredQuickLinks = searchTerm
    ? quickLinks.filter(link =>
        link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : quickLinks;

  const filteredExternalLinks = searchTerm
    ? externalLinks.filter(link =>
        link.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : externalLinks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-4">
          <Map className="h-8 w-8 text-[#144c9c] mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mapa do Site</h1>
            <p className="text-gray-600 mt-1">Navegue por todas as páginas e seções do portal oficial da Prefeitura Municipal de Timon</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={contentRef as any}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-800 ${
          isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Links Rápidos */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Links Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredQuickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center mb-2">
                    <IconComponent className="h-5 w-5 text-[#144c9c] mr-2" />
                    <h3 className="font-medium text-gray-900">{link.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estrutura Principal do Site */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Estrutura do Site</h2>
          <div className="space-y-8">
            {filteredSiteStructure.map((section, sectionIndex) => {
              const IconComponent = section.icon;
              return (
                <div key={sectionIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                      <IconComponent className="h-6 w-6 text-[#144c9c] mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{section.category}</h3>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {section.pages.map((page, pageIndex) => (
                        <div
                          key={pageIndex}
                          className="group border border-gray-200 rounded-lg p-4 hover:border-[#144c9c] hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 group-hover:text-[#144c9c] transition-colors">
                              {page.name}
                            </h4>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#144c9c] transition-colors" />
                          </div>
                          <p className="text-sm text-gray-600">{page.description}</p>
                          <div className="mt-2">
                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                              {page.path}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Links Externos */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Links Externos Importantes</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExternalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#144c9c] hover:shadow-sm transition-all group"
                >
                  <span className="text-gray-900 group-hover:text-[#144c9c] transition-colors">
                    {link.name}
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-[#144c9c] transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Informações de Acessibilidade */}
        <div className="mb-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Accessibility className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-blue-900">Acessibilidade e Conformidade</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Padrões Seguidos</h3>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• WCAG 2.1 AA (Web Content Accessibility Guidelines)</li>
                  <li>• e-MAG (Modelo de Acessibilidade em Governo Eletrônico)</li>
                  <li>• Lei Brasileira de Inclusão (LBI)</li>
                  <li>• Diretrizes de usabilidade governamental</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Recursos de Acessibilidade</h3>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Navegação por teclado</li>
                  <li>• Compatibilidade com leitores de tela</li>
                  <li>• Alto contraste</li>
                  <li>• Textos alternativos em imagens</li>
                  <li>• Estrutura semântica adequada</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;