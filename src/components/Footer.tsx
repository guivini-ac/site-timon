import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

// Componente para logo dinâmica do footer
const FooterLogo = () => {
  const [logoUrl, setLogoUrl] = useState('https://i.ibb.co/yBmCGg0j/PREFEITURA-HORIZONTAL-PADRA-O-BRANCA.png');

  useEffect(() => {
    // Carregar logo das configurações de aparência
    const loadLogoFromConfig = () => {
      const savedConfig = localStorage.getItem('timon-appearance-config');
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          if (config.footerLogoUrl) {
            setLogoUrl(config.footerLogoUrl);
          }
        } catch (error) {
          console.error('Erro ao carregar logo do footer:', error);
        }
      }
    };

    loadLogoFromConfig();

    // Escutar mudanças nas configurações
    const handleConfigUpdate = (event: CustomEvent) => {
      if (event.detail.footerLogoUrl) {
        setLogoUrl(event.detail.footerLogoUrl);
      }
    };

    const handleConfigReset = () => {
      setLogoUrl('https://i.ibb.co/yBmCGg0j/PREFEITURA-HORIZONTAL-PADRA-O-BRANCA.png');
    };

    window.addEventListener('appearanceConfigUpdated', handleConfigUpdate as EventListener);
    window.addEventListener('appearanceConfigReset', handleConfigReset);

    return () => {
      window.removeEventListener('appearanceConfigUpdated', handleConfigUpdate as EventListener);
      window.removeEventListener('appearanceConfigReset', handleConfigReset);
    };
  }, []);

  return (
    <img
      src={logoUrl}
      alt="Logo oficial da Prefeitura Municipal de Timon"
      className="h-16 w-auto object-contain"
    />
  );
};

interface FooterProps {
  onNavigateToAdmin: () => void;
}

const Footer = ({ onNavigateToAdmin }: FooterProps) => {
  const { elementRef: footerRef, isVisible: footerVisible } = useScrollAnimation({ threshold: 0.1 });
  const { containerRef: linksRef, visibleItems: linksVisible } = useStaggeredAnimation(4, 150);

  const secretarias = [
    'Secretaria de Administração',
    'Secretaria de Saúde',
    'Secretaria de Educação',
    'Secretaria de Obras',
    'Secretaria de Assistência Social',
    'Secretaria de Meio Ambiente'
  ];

  const servicos = [
    'Conecta Timon',
    'IPTU Online',
    'Protocolo Online',
    'Ouvidoria',
    'Portal da Transparência',
    'Diário Oficial'
  ];

  const transparencia = [
    'Portal da Transparência',
    'Lei de Acesso à Informação',
    'Prestação de Contas',
    'Licitações e Contratos',
    'Receitas e Despesas',
    'Relatórios Fiscais'
  ];

  return (
    <footer 
      ref={footerRef as any}
      className={`bg-gray-900 text-white animate-on-scroll ${footerVisible ? 'animate' : ''}`}
      role="contentinfo"
      aria-label="Rodapé do site da Prefeitura de Timon"
    >
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Receba nossas notícias</h3>
            <p className="text-gray-400 mb-6">Cadastre-se para receber informações da Prefeitura de Timon</p>
            <form className="max-w-md mx-auto flex" role="search" aria-label="Inscrição na newsletter">
              <label htmlFor="newsletter-email" className="sr-only">
                Digite seu e-mail para receber notícias da Prefeitura
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Seu e-mail"
                required
                aria-required="true"
                aria-describedby="newsletter-description"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-[rgba(20,76,156,1)] hover:bg-blue-700 rounded-r-lg btn-animated focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-describedby="newsletter-description"
              >
                Inscrever
              </button>
              <div id="newsletter-description" className="sr-only">
                Ao se inscrever, você receberá notícias e atualizações da Prefeitura de Timon por e-mail
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Prefeitura Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <FooterLogo />
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-blue-400 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p>Praça São José, s/n</p>
                  <p className="text-gray-400">Centro - Timon/MA</p>
                  <p className="text-gray-400">CEP: 65630-000</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-blue-400 mr-2" />
                <span>(99) 3212-1500</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-blue-400 mr-2" />
                <span>contato@timon.ma.gov.br</span>
              </div>
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-blue-400 mr-2 mt-1" />
                <div>
                  <p>Segunda a Sexta: 7h30 às 13h30</p>
                  <p className="text-gray-400">Atendimento ao público</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secretarias */}
          <div>
            <h3 className="font-semibold mb-4">Secretarias</h3>
            <nav aria-label="Links das secretarias municipais">
              <ul className="space-y-2 text-sm" role="list">
                {secretarias.map((secretaria, index) => (
                  <li key={index} role="listitem">
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                      aria-label={`Ir para ${secretaria}`}
                    >
                      {secretaria}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-semibold mb-4">Serviços ao Cidadão</h3>
            <nav aria-label="Links dos serviços municipais">
              <ul className="space-y-2 text-sm" role="list">
                {servicos.map((servico, index) => (
                  <li key={index} role="listitem">
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                      aria-label={`Acessar ${servico}`}
                    >
                      {servico}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Transparência */}
          <div>
            <h3 className="font-semibold mb-4">Transparência</h3>
            <nav aria-label="Links de transparência pública">
              <ul className="space-y-2 text-sm" role="list">
                {transparencia.map((item, index) => (
                  <li key={index} role="listitem">
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                      aria-label={`Acessar ${item}`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h4 className="font-semibold mb-2">Siga-nos nas redes sociais</h4>
              <nav aria-label="Links das redes sociais da Prefeitura">
                <ul className="flex space-x-4" role="list">
                  <li role="listitem">
                    <a 
                      href="https://facebook.com/prefeiturademon" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 block"
                      aria-label="Facebook da Prefeitura de Timon - abre em nova janela"
                    >
                      <Facebook className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                  <li role="listitem">
                    <a 
                      href="https://instagram.com/prefeiturademon" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-600 hover:bg-pink-700 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 block"
                      aria-label="Instagram da Prefeitura de Timon - abre em nova janela"
                    >
                      <Instagram className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                  <li role="listitem">
                    <a 
                      href="https://youtube.com/prefeiturademon" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 block"
                      aria-label="YouTube da Prefeitura de Timon - abre em nova janela"
                    >
                      <Youtube className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="text-center sm:text-right">
              <div className="mb-2">
                <span 
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                  role="img"
                  aria-label="Site certificado com acessibilidade WCAG 2.1 AA"
                >
                  ✓ Acessibilidade WCAG 2.1 AA
                </span>
              </div>
              <div className="mb-2">
                <span 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                  role="img"
                  aria-label="Site certificado pelo e-MAG - Modelo de Acessibilidade em Governo Eletrônico"
                >
                  ✓ e-MAG Certificado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
            <div>
              <p>&copy; 2025 Prefeitura Municipal de Timon - MA. Todos os direitos reservados.</p>
            </div>
            <nav aria-label="Links legais e informativos">
              <ul className="flex space-x-6 mt-2 sm:mt-0" role="list">
                <li role="listitem">
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'privacy-policy' } }));
                    }}
                    className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                    aria-label="Política de Privacidade do site"
                  >
                    Política de Privacidade
                  </a>
                </li>
                <li role="listitem">
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'terms-of-use' } }));
                    }}
                    className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                    aria-label="Termos de Uso do site"
                  >
                    Termos de Uso
                  </a>
                </li>
                <li role="listitem">
                  <a 
                    href="/mapa-do-site" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'sitemap' } }));
                    }}
                    className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                    aria-label="Mapa do Site com todos os links"
                  >
                    Mapa do Site
                  </a>
                </li>
                <li role="listitem">
                  <button 
                    onClick={onNavigateToAdmin}
                    className="flex items-center space-x-1 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                    aria-label="Acessar Painel Administrativo"
                  >
                    <User className="w-4 h-4" />
                    <span>Painel Admin</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;