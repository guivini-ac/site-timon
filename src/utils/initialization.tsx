import { apiClient } from './api';

export interface InitializationData {
  slides: any[];
  settings: any;
  defaultPages: any[];
  defaultSecretarias: any[];
}

// Dados padrão do sistema
const defaultSlides = [
  {
    id: 1,
    image: '/api/placeholder/1200/600',
    title: 'Bem-vindos à Prefeitura de Timon',
    subtitle: 'Trabalhando por uma cidade melhor para todos',
    link: '/servicos',
    linkText: 'Conheça nossos serviços'
  },
  {
    id: 2,
    image: '/api/placeholder/1200/600',
    title: 'Transparência e Eficiência',
    subtitle: 'Acesse nosso portal da transparência e acompanhe as ações da gestão municipal',
    link: '/transparencia',
    linkText: 'Portal da Transparência'
  },
  {
    id: 3,
    image: '/api/placeholder/1200/600',
    title: 'Serviços Digitais',
    subtitle: 'Facilite sua vida com nossos serviços online disponíveis 24 horas',
    link: '/servicos-digitais',
    linkText: 'Acessar Serviços'
  }
];

const defaultSettings = {
  siteName: 'Prefeitura Municipal de Timon',
  siteDescription: 'Portal Oficial da Prefeitura Municipal de Timon - Maranhão',
  siteUrl: 'https://timon.ma.gov.br',
  contactEmail: 'contato@timon.ma.gov.br',
  contactPhone: '(99) 3212-3456',
  address: 'Praça da Bandeira, s/n - Centro, Timon - MA, CEP: 65631-000',
  socialMedia: {
    facebook: 'https://facebook.com/prefeituradotimon',
    instagram: 'https://instagram.com/prefeituradotimon',
    twitter: 'https://twitter.com/prefeituradotimon',
    youtube: 'https://youtube.com/prefeituradotimon'
  },
  theme: {
    primaryColor: '#144c9c',
    secondaryColor: '#228B22',
    accentColor: '#f4b728'
  },
  seo: {
    keywords: 'Prefeitura Timon, Timon MA, Maranhão, Serviços Públicos, Transparência',
    ogImage: '/api/placeholder/1200/630'
  }
};

const defaultSecretarias = [
  {
    id: 'educacao',
    name: 'Secretaria de Educação',
    description: 'Responsável pela educação municipal, escolas e programas educacionais',
    phone: '(99) 3212-3457',
    email: 'educacao@timon.ma.gov.br',
    address: 'Rua da Educação, 100 - Centro',
    secretary: 'João Silva',
    image: '/api/placeholder/400/300'
  },
  {
    id: 'saude',
    name: 'Secretaria de Saúde',
    description: 'Gestão da saúde pública municipal, UBS e programas de saúde',
    phone: '(99) 3212-3458',
    email: 'saude@timon.ma.gov.br',
    address: 'Avenida da Saúde, 200 - Centro',
    secretary: 'Maria Santos',
    image: '/api/placeholder/400/300'
  },
  {
    id: 'obras',
    name: 'Secretaria de Obras e Infraestrutura',
    description: 'Desenvolvimento urbano, obras públicas e infraestrutura municipal',
    phone: '(99) 3212-3459',
    email: 'obras@timon.ma.gov.br',
    address: 'Rua das Obras, 300 - Industrial',
    secretary: 'Carlos Oliveira',
    image: '/api/placeholder/400/300'
  },
  {
    id: 'assistencia-social',
    name: 'Secretaria de Assistência Social',
    description: 'Programas sociais, CRAS, CREAS e assistência às famílias em vulnerabilidade',
    phone: '(99) 3212-3460',
    email: 'assistenciasocial@timon.ma.gov.br',
    address: 'Praça Social, 50 - Centro',
    secretary: 'Ana Costa',
    image: '/api/placeholder/400/300'
  }
];

const defaultPages = [
  {
    id: 'sobre-timon',
    title: 'Sobre Timon',
    slug: 'sobre-timon',
    content: `
      <h2>História de Timon</h2>
      <p>Timon é um município brasileiro do estado do Maranhão, localizado na região do Médio Parnaíba. Com uma população de aproximadamente 180 mil habitantes, é uma das principais cidades do interior maranhense.</p>
      
      <h3>Fundação e Desenvolvimento</h3>
      <p>A cidade foi fundada em 1948 e se desenvolveu rapidamente devido à sua localização estratégica às margens do Rio Parnaíba, fazendo divisa com o estado do Piauí.</p>
      
      <h3>Economia</h3>
      <p>A economia de Timon é baseada no comércio, serviços e agropecuária. A cidade é um importante centro comercial da região.</p>
    `,
    status: 'published',
    featured: true,
    metaDescription: 'Conheça a história e características do município de Timon no Maranhão'
  },
  {
    id: 'estrutura-administrativa',
    title: 'Estrutura Administrativa',
    slug: 'estrutura-administrativa',
    content: `
      <h2>Organização da Prefeitura</h2>
      <p>A Prefeitura Municipal de Timon está organizada para atender da melhor forma possível as demandas da população.</p>
      
      <h3>Gabinete do Prefeito</h3>
      <p>Órgão responsável pela coordenação geral das ações do governo municipal.</p>
      
      <h3>Secretarias Municipais</h3>
      <p>As secretarias são os órgãos executivos responsáveis por áreas específicas da administração municipal.</p>
    `,
    status: 'published',
    featured: false,
    metaDescription: 'Conheça a estrutura administrativa da Prefeitura Municipal de Timon'
  }
];

// Verifica se o sistema precisa ser inicializado
export async function checkInitialization(): Promise<boolean> {
  try {
    const { settings } = await apiClient.getSettings();
    return !!settings?.siteName; // Se tem siteName, está inicializado
  } catch (error) {
    console.log('Sistema não inicializado, necessária configuração inicial');
    return false;
  }
}

// Inicializa o sistema com dados padrão
export async function initializeSystem(): Promise<void> {
  try {
    console.log('Inicializando sistema com dados padrão...');

    // Inicializar slides
    await apiClient.updateSlides(defaultSlides);
    console.log('✓ Slides inicializados');

    // Inicializar configurações
    await apiClient.saveSettings(defaultSettings);
    console.log('✓ Configurações inicializadas');

    // Inicializar secretarias
    for (const secretaria of defaultSecretarias) {
      await apiClient.saveSecretaria(secretaria);
    }
    console.log('✓ Secretarias inicializadas');

    // Inicializar páginas padrão
    for (const page of defaultPages) {
      await apiClient.savePage(page);
    }
    console.log('✓ Páginas padrão inicializadas');

    console.log('Sistema inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar sistema:', error);
    throw error;
  }
}

// Hook para verificar e inicializar automaticamente
export function useSystemInitialization() {
  const initializeIfNeeded = async () => {
    try {
      const isInitialized = await checkInitialization();
      if (!isInitialized) {
        await initializeSystem();
      }
    } catch (error) {
      console.error('Erro na inicialização automática:', error);
    }
  };

  return { initializeIfNeeded };
}