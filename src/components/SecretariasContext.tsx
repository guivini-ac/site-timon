import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Department {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
  color: string;
  secretary: {
    name: string;
    role: string;
    photo: string;
    biography: string;
    email: string;
    phone: string;
  };
  mission: string;
  vision: string;
  objectives: string[];
  services: string[];
  contact: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentFormData {
  name: string;
  description: string;
  slug: string;
  icon: string;
  color: string;
  secretary: {
    name: string;
    role: string;
    photo: string;
    biography: string;
    email: string;
    phone: string;
  };
  mission: string;
  vision: string;
  objectives: string[];
  services: string[];
  contact: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
  isActive: boolean;
  order: number;
}

interface SecretariasContextType {
  departments: Department[];
  addDepartment: (department: DepartmentFormData) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  toggleDepartmentStatus: (id: string) => void;
  reorderDepartments: (departments: Department[]) => void;
  getActiveDepartments: () => Department[];
  getDepartmentBySlug: (slug: string) => Department | undefined;
  getTotalDepartments: () => number;
  getIconOptions: () => { value: string; label: string; icon: string }[];
  getColorOptions: () => { value: string; label: string; color: string }[];
}

const SecretariasContext = createContext<SecretariasContextType | undefined>(undefined);

export function SecretariasProvider({ children }: { children: React.ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>([]);

  // Opções de ícones para as secretarias
  const iconOptions = [
    { value: 'Building2', label: 'Administração', icon: 'Building2' },
    { value: 'GraduationCap', label: 'Educação', icon: 'GraduationCap' },
    { value: 'Heart', label: 'Saúde', icon: 'Heart' },
    { value: 'Shield', label: 'Segurança', icon: 'Shield' },
    { value: 'Hammer', label: 'Obras', icon: 'Hammer' },
    { value: 'Leaf', label: 'Meio Ambiente', icon: 'Leaf' },
    { value: 'Users', label: 'Assistência Social', icon: 'Users' },
    { value: 'Palette', label: 'Cultura', icon: 'Palette' },
    { value: 'Trophy', label: 'Esportes', icon: 'Trophy' },
    { value: 'Calculator', label: 'Finanças', icon: 'Calculator' },
    { value: 'Car', label: 'Transporte', icon: 'Car' },
    { value: 'Briefcase', label: 'Trabalho', icon: 'Briefcase' },
    { value: 'Scale', label: 'Jurídico', icon: 'Scale' },
    { value: 'Megaphone', label: 'Comunicação', icon: 'Megaphone' },
    { value: 'FileText', label: 'Planejamento', icon: 'FileText' },
    { value: 'Home', label: 'Habitação', icon: 'Home' }
  ];

  // Opções de cores para as secretarias
  const colorOptions = [
    { value: '#144c9c', label: 'Azul Institucional', color: '#144c9c' },
    { value: '#228B22', label: 'Verde', color: '#228B22' },
    { value: '#DC3545', label: 'Vermelho', color: '#DC3545' },
    { value: '#FFC107', label: 'Amarelo', color: '#FFC107' },
    { value: '#6f42c1', label: 'Roxo', color: '#6f42c1' },
    { value: '#fd7e14', label: 'Laranja', color: '#fd7e14' },
    { value: '#20c997', label: 'Turquesa', color: '#20c997' },
    { value: '#e83e8c', label: 'Rosa', color: '#e83e8c' },
    { value: '#6c757d', label: 'Cinza', color: '#6c757d' },
    { value: '#17a2b8', label: 'Ciano', color: '#17a2b8' },
    { value: '#28a745', label: 'Verde Escuro', color: '#28a745' },
    { value: '#007bff', label: 'Azul', color: '#007bff' }
  ];

  // Inicializar com dados de exemplo
  useEffect(() => {
    const initialDepartments: Department[] = [
      {
        id: '1',
        name: 'Secretaria Municipal de Saúde',
        description: 'Responsável pela gestão e coordenação do sistema de saúde municipal, garantindo acesso universal e integral aos serviços de saúde.',
        slug: 'saude',
        icon: 'Heart',
        color: '#DC3545',
        secretary: {
          name: 'Dr. João Silva Santos',
          role: 'Secretário Municipal de Saúde',
          photo: '/secretaries/joao-silva.jpg',
          biography: 'Médico formado pela UFMA com especialização em Saúde Pública. Possui vasta experiência em gestão de saúde municipal e tem se dedicado à melhoria dos serviços de saúde em Timon.',
          email: 'joao.silva@timon.ma.gov.br',
          phone: '(99) 3212-3456'
        },
        mission: 'Promover, proteger e recuperar a saúde da população timonense através de ações e serviços de qualidade.',
        vision: 'Ser referência em saúde pública no Maranhão, oferecendo atendimento humanizado e resolutivo.',
        objectives: [
          'Ampliar a cobertura da Atenção Básica',
          'Melhorar a qualidade dos serviços de saúde',
          'Reduzir a mortalidade materno-infantil',
          'Fortalecer a vigilância epidemiológica',
          'Implementar políticas de promoção da saúde'
        ],
        services: [
          'Atenção Básica em Saúde',
          'Urgência e Emergência',
          'Saúde da Mulher',
          'Saúde da Criança',
          'Saúde do Idoso',
          'Saúde Mental',
          'Vigilância Sanitária',
          'Vigilância Epidemiológica',
          'Assistência Farmacêutica'
        ],
        contact: {
          address: 'Rua Presidente Vargas, 1234 - Centro, Timon - MA',
          phone: '(99) 3212-3456',
          email: 'saude@timon.ma.gov.br',
          workingHours: 'Segunda a Sexta: 07:00 às 17:00'
        },
        isActive: true,
        order: 1,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Secretaria Municipal de Educação',
        description: 'Coordena e executa a política educacional do município, garantindo educação de qualidade para todos.',
        slug: 'educacao',
        icon: 'GraduationCap',
        color: '#007bff',
        secretary: {
          name: 'Profª. Maria das Graças Oliveira',
          role: 'Secretária Municipal de Educação',
          photo: '/secretaries/maria-gracas.jpg',
          biography: 'Pedagoga com mais de 20 anos de experiência na educação municipal. Dedicada à transformação da educação pública em Timon através de metodologias inovadoras e tecnologia educacional.',
          email: 'maria.gracas@timon.ma.gov.br',
          phone: '(99) 3212-3457'
        },
        mission: 'Oferecer educação pública de qualidade, inclusiva e transformadora para todos os munícipes.',
        vision: 'Ser referência em educação municipal, formando cidadãos críticos e preparados para o futuro.',
        objectives: [
          'Universalizar o acesso à educação infantil',
          'Melhorar os índices de qualidade educacional',
          'Reduzir a evasão escolar',
          'Modernizar a infraestrutura escolar',
          'Capacitar continuamente os profissionais da educação'
        ],
        services: [
          'Educação Infantil',
          'Ensino Fundamental',
          'Educação de Jovens e Adultos',
          'Educação Especial',
          'Transporte Escolar',
          'Alimentação Escolar',
          'Formação Continuada',
          'Apoio Pedagógico'
        ],
        contact: {
          address: 'Av. Getúlio Vargas, 567 - Centro, Timon - MA',
          phone: '(99) 3212-3457',
          email: 'educacao@timon.ma.gov.br',
          workingHours: 'Segunda a Sexta: 07:30 às 17:30'
        },
        isActive: true,
        order: 2,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '3',
        name: 'Secretaria Municipal de Obras e Infraestrutura',
        description: 'Planeja, executa e mantém as obras públicas e infraestrutura urbana do município.',
        slug: 'obras-infraestrutura',
        icon: 'Hammer',
        color: '#FFC107',
        secretary: {
          name: 'Eng. Carlos Eduardo Mendes',
          role: 'Secretário Municipal de Obras e Infraestrutura',
          photo: '/secretaries/carlos-mendes.jpg',
          biography: 'Engenheiro Civil com especialização em Infraestrutura Urbana. Responsável pelos grandes projetos de modernização da infraestrutura de Timon.',
          email: 'carlos.mendes@timon.ma.gov.br',
          phone: '(99) 3212-3458'
        },
        mission: 'Promover o desenvolvimento urbano sustentável através de obras e infraestrutura de qualidade.',
        vision: 'Transformar Timon em uma cidade moderna, acessível e bem estruturada.',
        objectives: [
          'Modernizar a infraestrutura urbana',
          'Ampliar a rede de saneamento',
          'Melhorar o sistema viário',
          'Construir equipamentos públicos',
          'Implementar projetos sustentáveis'
        ],
        services: [
          'Pavimentação de Ruas',
          'Construção Civil',
          'Manutenção Urbana',
          'Drenagem Urbana',
          'Iluminação Pública',
          'Pontes e Viadutos',
          'Praças e Parques',
          'Cemitérios Públicos'
        ],
        contact: {
          address: 'Rua São Pedro, 890 - São Pedro, Timon - MA',
          phone: '(99) 3212-3458',
          email: 'obras@timon.ma.gov.br',
          workingHours: 'Segunda a Sexta: 07:00 às 17:00'
        },
        isActive: true,
        order: 3,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '4',
        name: 'Secretaria Municipal de Assistência Social',
        description: 'Coordena as políticas de assistência social, proteção e inclusão social no município.',
        slug: 'assistencia-social',
        icon: 'Users',
        color: '#28a745',
        secretary: {
          name: 'Dra. Ana Paula Costa',
          role: 'Secretária Municipal de Assistência Social',
          photo: '/secretaries/ana-paula.jpg',
          biography: 'Assistente Social dedicada aos programas sociais do município. Coordena ações de combate à pobreza e inclusão social em Timon.',
          email: 'ana.paula@timon.ma.gov.br',
          phone: '(99) 3212-3459'
        },
        mission: 'Garantir a proteção social e promover a inclusão de pessoas em situação de vulnerabilidade.',
        vision: 'Construir uma sociedade mais justa e solidária, sem pobreza e desigualdade social.',
        objectives: [
          'Fortalecer a rede de proteção social',
          'Combater a pobreza extrema',
          'Promover a inclusão social',
          'Proteger crianças e adolescentes',
          'Atender famílias em vulnerabilidade'
        ],
        services: [
          'CRAS - Centro de Referência de Assistência Social',
          'CREAS - Centro de Referência Especializado',
          'Programa Bolsa Família',
          'Auxílio Emergencial',
          'Programa Primeira Infância',
          'Casa de Passagem',
          'Atendimento ao Idoso',
          'Proteção à Criança e Adolescente'
        ],
        contact: {
          address: 'Av. Maranhão, 345 - Parque Alvorada, Timon - MA',
          phone: '(99) 3212-3459',
          email: 'assistencia@timon.ma.gov.br',
          workingHours: 'Segunda a Sexta: 08:00 às 18:00'
        },
        isActive: true,
        order: 4,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '5',
        name: 'Secretaria Municipal de Meio Ambiente',
        description: 'Desenvolve políticas ambientais e promove a sustentabilidade no município.',
        slug: 'meio-ambiente',
        icon: 'Leaf',
        color: '#228B22',
        secretary: {
          name: 'Biól. Roberto Andrade Silva',
          role: 'Secretário Municipal de Meio Ambiente',
          photo: '/secretaries/roberto-andrade.jpg',
          biography: 'Biólogo especializado em gestão ambiental, com foco em desenvolvimento sustentável e preservação dos recursos naturais de Timon.',
          email: 'roberto.andrade@timon.ma.gov.br',
          phone: '(99) 3212-3460'
        },
        mission: 'Preservar o meio ambiente e promover o desenvolvimento sustentável.',
        vision: 'Fazer de Timon uma cidade ecologicamente equilibrada e sustentável.',
        objectives: [
          'Preservar os recursos naturais',
          'Promover educação ambiental',
          'Implementar políticas sustentáveis',
          'Fiscalizar atividades ambientais',
          'Desenvolver projetos verdes'
        ],
        services: [
          'Licenciamento Ambiental',
          'Fiscalização Ambiental',
          'Educação Ambiental',
          'Coleta Seletiva',
          'Arborização Urbana',
          'Controle de Poluição',
          'Projetos Sustentáveis'
        ],
        contact: {
          address: 'Rua das Flores, 123 - Cidade Nova, Timon - MA',
          phone: '(99) 3212-3460',
          email: 'meioambiente@timon.ma.gov.br',
          workingHours: 'Segunda a Sexta: 07:30 às 16:30'
        },
        isActive: true,
        order: 5,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    setDepartments(initialDepartments);
  }, []);

  const addDepartment = (departmentData: DepartmentFormData) => {
    const newDepartment: Department = {
      ...departmentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setDepartments(prev => [...prev, newDepartment]);
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments(prev => prev.map(department => 
      department.id === id 
        ? { ...department, ...updates, updatedAt: new Date() }
        : department
    ));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(department => department.id !== id));
  };

  const toggleDepartmentStatus = (id: string) => {
    setDepartments(prev => prev.map(department =>
      department.id === id
        ? { ...department, isActive: !department.isActive, updatedAt: new Date() }
        : department
    ));
  };



  const reorderDepartments = (reorderedDepartments: Department[]) => {
    setDepartments(reorderedDepartments.map((department, index) => ({ 
      ...department, 
      order: index + 1,
      updatedAt: new Date()
    })));
  };

  const getActiveDepartments = () => {
    return departments
      .filter(department => department.isActive)
      .sort((a, b) => a.order - b.order);
  };

  const getDepartmentBySlug = (slug: string) => {
    return departments.find(department => department.slug === slug && department.isActive);
  };

  const getTotalDepartments = () => departments.length;

  const getIconOptions = () => iconOptions;

  const getColorOptions = () => colorOptions;

  const value: SecretariasContextType = {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    toggleDepartmentStatus,
    reorderDepartments,
    getActiveDepartments,
    getDepartmentBySlug,
    getTotalDepartments,
    getIconOptions,
    getColorOptions
  };

  return (
    <SecretariasContext.Provider value={value}>
      {children}
    </SecretariasContext.Provider>
  );
}

export function useSecretarias() {
  const context = useContext(SecretariasContext);
  if (context === undefined) {
    throw new Error('useSecretarias must be used within a SecretariasProvider');
  }
  return context;
}