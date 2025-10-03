import React, { createContext, useContext, useState, useEffect } from 'react';

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date' 
  | 'file' 
  | 'cpf' 
  | 'separator'
  | 'html';

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  order: number;
  options?: FieldOption[]; // Para select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    customMessage?: string;
  };
  conditionalLogic?: {
    showIf?: {
      fieldId: string;
      value: string | string[];
      operator: 'equals' | 'not_equals' | 'contains' | 'not_contains';
    };
  };
  // Para campos HTML/separator
  content?: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  slug: string;
  fields: FormField[];
  settings: {
    submitButtonText: string;
    successMessage: string;
    redirectUrl?: string;
    emailNotification?: {
      enabled: boolean;
      recipients: string[];
      subject: string;
    };
    allowMultipleSubmissions: boolean;
    captchaEnabled: boolean;
    submitLimit?: number;
    availableFrom?: Date;
    availableUntil?: Date;
  };
  design: {
    layout: 'single-column' | 'two-column';
    theme: 'default' | 'modern' | 'minimal';
    backgroundColor: string;
    textColor: string;
    primaryColor: string;
  };
  isActive: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  submissionCount: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  submitterEmail?: string;
  submitterName?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  notes?: string;
}

export interface FormFormData {
  title: string;
  description: string;
  slug: string;
  fields: FormField[];
  settings: Form['settings'];
  design: Form['design'];
  isActive: boolean;
  isPublic: boolean;
}

interface FormsContextType {
  forms: Form[];
  submissions: FormSubmission[];
  addForm: (form: FormFormData) => void;
  updateForm: (id: string, form: Partial<Form>) => void;
  deleteForm: (id: string) => void;
  toggleFormStatus: (id: string) => void;
  toggleFormVisibility: (id: string) => void;
  duplicateForm: (id: string) => void;
  getFormBySlug: (slug: string) => Form | undefined;
  getFormById: (id: string) => Form | undefined;
  getActiveForms: () => Form[];
  getPublicForms: () => Form[];
  addSubmission: (submission: Omit<FormSubmission, 'id' | 'submittedAt'>) => void;
  updateSubmissionStatus: (id: string, status: FormSubmission['status'], notes?: string) => void;
  getSubmissionsByForm: (formId: string) => FormSubmission[];
  getTotalForms: () => number;
  getTotalSubmissions: () => number;
  getFieldTypes: () => { value: FieldType; label: string; icon: string; description: string }[];
  validateField: (field: FormField, value: any) => string | null;
  exportSubmissions: (formId: string) => void;
}

const FormsContext = createContext<FormsContextType | undefined>(undefined);

export const useForms = (): FormsContextType => {
  const context = useContext(FormsContext);
  if (!context) {
    throw new Error('useForms must be used within a FormsProvider');
  }
  return context;
};

export function FormsProvider({ children }: { children: React.ReactNode }) {
  const [forms, setForms] = useState<Form[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

  // Inicializar com dados de exemplo
  useEffect(() => {
    const initialForms: Form[] = [
      {
        id: '1',
        title: 'Solicitação de Serviços Públicos',
        description: 'Formulário para solicitação de diversos serviços oferecidos pela prefeitura municipal.',
        slug: 'solicitacao-servicos-publicos',
        fields: [
          {
            id: 'field-1',
            type: 'text',
            label: 'Nome Completo',
            placeholder: 'Digite seu nome completo',
            required: true,
            order: 1,
            validation: {
              minLength: 2,
              maxLength: 100
            }
          },
          {
            id: 'field-2',
            type: 'email',
            label: 'E-mail',
            placeholder: 'seu.email@example.com',
            required: true,
            order: 2
          },
          {
            id: 'field-3',
            type: 'cpf',
            label: 'CPF',
            placeholder: '000.000.000-00',
            required: true,
            order: 3
          },
          {
            id: 'field-4',
            type: 'phone',
            label: 'Telefone',
            placeholder: '(99) 99999-9999',
            required: true,
            order: 4
          },
          {
            id: 'field-5',
            type: 'select',
            label: 'Tipo de Serviço',
            required: true,
            order: 5,
            options: [
              { id: 'opt-1', label: 'Limpeza Urbana', value: 'limpeza' },
              { id: 'opt-2', label: 'Iluminação Pública', value: 'iluminacao' },
              { id: 'opt-3', label: 'Pavimentação', value: 'pavimentacao' },
              { id: 'opt-4', label: 'Saúde', value: 'saude' },
              { id: 'opt-5', label: 'Educação', value: 'educacao' },
              { id: 'opt-6', label: 'Outros', value: 'outros' }
            ]
          },
          {
            id: 'field-6',
            type: 'textarea',
            label: 'Descrição da Solicitação',
            placeholder: 'Descreva detalhadamente sua solicitação...',
            required: true,
            order: 6,
            validation: {
              minLength: 10,
              maxLength: 1000
            }
          },
          {
            id: 'field-7',
            type: 'text',
            label: 'Endereço do Local',
            placeholder: 'Rua, número, bairro...',
            required: false,
            order: 7
          },
          {
            id: 'field-8',
            type: 'radio',
            label: 'Urgência',
            required: true,
            order: 8,
            options: [
              { id: 'urg-1', label: 'Baixa - Pode aguardar', value: 'baixa' },
              { id: 'urg-2', label: 'Média - Importante', value: 'media' },
              { id: 'urg-3', label: 'Alta - Urgente', value: 'alta' }
            ]
          },
          {
            id: 'field-9',
            type: 'file',
            label: 'Anexos (Opcional)',
            description: 'Anexe fotos ou documentos relacionados à solicitação',
            required: false,
            order: 9
          },
          {
            id: 'field-10',
            type: 'checkbox',
            label: 'Concordo com os termos de uso e política de privacidade',
            required: true,
            order: 10
          }
        ],
        settings: {
          submitButtonText: 'Enviar Solicitação',
          successMessage: 'Sua solicitação foi enviada com sucesso! Entraremos em contato em breve.',
          emailNotification: {
            enabled: true,
            recipients: ['servicos@timon.ma.gov.br'],
            subject: 'Nova Solicitação de Serviços Públicos'
          },
          allowMultipleSubmissions: false,
          captchaEnabled: true,
          submitLimit: 1
        },
        design: {
          layout: 'single-column',
          theme: 'default',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          primaryColor: '#144c9c'
        },
        isActive: true,
        isPublic: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        createdBy: 'admin@timon.ma.gov.br',
        submissionCount: 45
      },
      {
        id: '2',
        title: 'Cadastro para Benefícios Sociais',
        description: 'Formulário de cadastro para programas de assistência social da prefeitura.',
        slug: 'cadastro-beneficios-sociais',
        fields: [
          {
            id: 'field-11',
            type: 'html',
            label: 'Introdução',
            content: '<h3>Programa de Assistência Social</h3><p>Este formulário é destinado ao cadastro de famílias interessadas em participar dos programas sociais do município. <strong>Preencha todos os campos obrigatórios.</strong></p>',
            required: false,
            order: 1
          },
          {
            id: 'field-12',
            type: 'text',
            label: 'Nome do Responsável Familiar',
            required: true,
            order: 2
          },
          {
            id: 'field-13',
            type: 'cpf',
            label: 'CPF do Responsável',
            required: true,
            order: 3
          },
          {
            id: 'field-14',
            type: 'number',
            label: 'Renda Familiar Mensal (R$)',
            required: true,
            order: 4,
            validation: {
              min: 0,
              max: 50000
            }
          },
          {
            id: 'field-15',
            type: 'number',
            label: 'Número de Pessoas na Família',
            required: true,
            order: 5,
            validation: {
              min: 1,
              max: 20
            }
          },
          {
            id: 'field-16',
            type: 'checkbox',
            label: 'Programas de Interesse',
            required: true,
            order: 6,
            options: [
              { id: 'prog-1', label: 'Auxílio Alimentação', value: 'alimentacao' },
              { id: 'prog-2', label: 'Bolsa Família Municipal', value: 'bolsa-familia' },
              { id: 'prog-3', label: 'Programa Primeira Infância', value: 'primeira-infancia' },
              { id: 'prog-4', label: 'Assistência ao Idoso', value: 'idoso' }
            ]
          }
        ],
        settings: {
          submitButtonText: 'Realizar Cadastro',
          successMessage: 'Cadastro realizado com sucesso! Aguarde nossa avaliação.',
          emailNotification: {
            enabled: true,
            recipients: ['social@timon.ma.gov.br'],
            subject: 'Novo Cadastro - Benefícios Sociais'
          },
          allowMultipleSubmissions: false,
          captchaEnabled: true
        },
        design: {
          layout: 'single-column',
          theme: 'modern',
          backgroundColor: '#f8f9fa',
          textColor: '#495057',
          primaryColor: '#28a745'
        },
        isActive: true,
        isPublic: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        createdBy: 'admin@timon.ma.gov.br',
        submissionCount: 78
      },
      {
        id: '3',
        title: 'Pesquisa de Satisfação - Atendimento',
        description: 'Avalie nosso atendimento e nos ajude a melhorar nossos serviços.',
        slug: 'pesquisa-satisfacao-atendimento',
        fields: [
          {
            id: 'field-17',
            type: 'radio',
            label: 'Como você avalia nosso atendimento?',
            required: true,
            order: 1,
            options: [
              { id: 'av-1', label: 'Excelente', value: '5' },
              { id: 'av-2', label: 'Bom', value: '4' },
              { id: 'av-3', label: 'Regular', value: '3' },
              { id: 'av-4', label: 'Ruim', value: '2' },
              { id: 'av-5', label: 'Péssimo', value: '1' }
            ]
          },
          {
            id: 'field-18',
            type: 'textarea',
            label: 'Comentários e Sugestões',
            placeholder: 'Deixe seus comentários aqui...',
            required: false,
            order: 2
          }
        ],
        settings: {
          submitButtonText: 'Enviar Avaliação',
          successMessage: 'Obrigado pela sua avaliação!',
          allowMultipleSubmissions: true,
          captchaEnabled: false
        },
        design: {
          layout: 'single-column',
          theme: 'minimal',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          primaryColor: '#6c757d'
        },
        isActive: true,
        isPublic: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-22'),
        createdBy: 'admin@timon.ma.gov.br',
        submissionCount: 234
      }
    ];

    const initialSubmissions: FormSubmission[] = [
      {
        id: '1',
        formId: '1',
        data: {
          'field-1': 'João Silva Santos',
          'field-2': 'joao.silva@email.com',
          'field-3': '123.456.789-00',
          'field-4': '(99) 99999-9999',
          'field-5': 'limpeza',
          'field-6': 'Solicito limpeza da rua devido ao acúmulo de lixo próximo ao número 123.',
          'field-7': 'Rua das Flores, 123 - Centro',
          'field-8': 'media',
          'field-10': true
        },
        submittedAt: new Date('2024-01-20T10:30:00'),
        submitterEmail: 'joao.silva@email.com',
        submitterName: 'João Silva Santos',
        status: 'pending'
      },
      {
        id: '2',
        formId: '2',
        data: {
          'field-12': 'Maria das Graças',
          'field-13': '987.654.321-00',
          'field-14': 800,
          'field-15': 4,
          'field-16': ['alimentacao', 'primeira-infancia']
        },
        submittedAt: new Date('2024-01-19T14:15:00'),
        submitterEmail: 'maria.gracas@email.com',
        submitterName: 'Maria das Graças',
        status: 'reviewed'
      }
    ];

    setForms(initialForms);
    setSubmissions(initialSubmissions);
  }, []);

  const addForm = (formData: FormFormData) => {
    const newForm: Form = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin@timon.ma.gov.br',
      submissionCount: 0
    };
    setForms(prev => [...prev, newForm]);
  };

  const updateForm = (id: string, updates: Partial<Form>) => {
    setForms(prev => prev.map(form => 
      form.id === id ? { ...form, ...updates, updatedAt: new Date() } : form
    ));
  };

  const deleteForm = (id: string) => {
    setForms(prev => prev.filter(form => form.id !== id));
    setSubmissions(prev => prev.filter(submission => submission.formId !== id));
  };

  const toggleFormStatus = (id: string) => {
    setForms(prev => prev.map(form =>
      form.id === id
        ? { ...form, isActive: !form.isActive, updatedAt: new Date() }
        : form
    ));
  };

  const toggleFormVisibility = (id: string) => {
    setForms(prev => prev.map(form =>
      form.id === id
        ? { ...form, isPublic: !form.isPublic, updatedAt: new Date() }
        : form
    ));
  };

  const duplicateForm = (id: string) => {
    const originalForm = forms.find(form => form.id === id);
    if (originalForm) {
      const duplicatedForm: Form = {
        ...originalForm,
        id: Date.now().toString(),
        title: `${originalForm.title} (Cópia)`,
        slug: `${originalForm.slug}-copia`,
        createdAt: new Date(),
        updatedAt: new Date(),
        submissionCount: 0,
        isActive: false
      };
      setForms(prev => [...prev, duplicatedForm]);
    }
  };

  const getFormBySlug = (slug: string) => {
    return forms.find(form => form.slug === slug && form.isActive && form.isPublic);
  };

  const getFormById = (id: string) => {
    return forms.find(form => form.id === id);
  };

  const getActiveForms = () => {
    return forms.filter(form => form.isActive).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  };

  const getPublicForms = () => {
    return forms.filter(form => form.isActive && form.isPublic);
  };

  const addSubmission = (submissionData: Omit<FormSubmission, 'id' | 'submittedAt'>) => {
    const newSubmission: FormSubmission = {
      ...submissionData,
      id: Date.now().toString(),
      submittedAt: new Date()
    };
    setSubmissions(prev => [...prev, newSubmission]);
    
    // Atualizar contador de submissões do formulário
    setForms(prev => prev.map(form =>
      form.id === submissionData.formId
        ? { ...form, submissionCount: form.submissionCount + 1 }
        : form
    ));
  };

  const updateSubmissionStatus = (id: string, status: FormSubmission['status'], notes?: string) => {
    setSubmissions(prev => prev.map(submission =>
      submission.id === id
        ? { ...submission, status, notes }
        : submission
    ));
  };

  const getSubmissionsByForm = (formId: string) => {
    return submissions
      .filter(submission => submission.formId === formId)
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  };

  const getTotalForms = () => forms.length;

  const getTotalSubmissions = () => submissions.length;

  const getFieldTypes = () => [
    { value: 'text' as FieldType, label: 'Texto', icon: 'Type', description: 'Campo de texto simples' },
    { value: 'email' as FieldType, label: 'E-mail', icon: 'Mail', description: 'Campo para endereço de e-mail' },
    { value: 'phone' as FieldType, label: 'Telefone', icon: 'Phone', description: 'Campo para número de telefone' },
    { value: 'number' as FieldType, label: 'Número', icon: 'Hash', description: 'Campo numérico' },
    { value: 'textarea' as FieldType, label: 'Texto Longo', icon: 'AlignLeft', description: 'Área de texto para conteúdo longo' },
    { value: 'select' as FieldType, label: 'Lista Suspensa', icon: 'ChevronDown', description: 'Seleção única de uma lista' },
    { value: 'radio' as FieldType, label: 'Botões de Opção', icon: 'Circle', description: 'Seleção única entre opções visíveis' },
    { value: 'checkbox' as FieldType, label: 'Caixas de Seleção', icon: 'Square', description: 'Múltiplas seleções' },
    { value: 'date' as FieldType, label: 'Data', icon: 'Calendar', description: 'Seletor de data' },
    { value: 'file' as FieldType, label: 'Arquivo', icon: 'Upload', description: 'Upload de arquivos' },
    { value: 'cpf' as FieldType, label: 'CPF', icon: 'User', description: 'Campo específico para CPF' },
    { value: 'separator' as FieldType, label: 'Separador', icon: 'Minus', description: 'Linha divisória visual' },
    { value: 'html' as FieldType, label: 'HTML/Texto Rico', icon: 'Code', description: 'Conteúdo HTML personalizado' }
  ];

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} é obrigatório`;
    }

    if (!value || value === '') return null;

    const validation = field.validation;
    if (!validation) return null;

    if (typeof value === 'string') {
      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} deve ter pelo menos ${validation.minLength} caracteres`;
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} deve ter no máximo ${validation.maxLength} caracteres`;
      }
      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        return validation.customMessage || `${field.label} tem formato inválido`;
      }
    }

    if (typeof value === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        return `${field.label} deve ser pelo menos ${validation.min}`;
      }
      if (validation.max !== undefined && value > validation.max) {
        return `${field.label} deve ser no máximo ${validation.max}`;
      }
    }

    return null;
  };

  const exportSubmissions = (formId: string) => {
    const form = getFormById(formId);
    const formSubmissions = getSubmissionsByForm(formId);
    
    if (!form || formSubmissions.length === 0) return;

    const headers = form.fields
      .filter(field => field.type !== 'separator' && field.type !== 'html')
      .map(field => field.label);
    
    const csvContent = [
      ['Data/Hora', 'Status', ...headers].join(','),
      ...formSubmissions.map(submission => [
        submission.submittedAt.toLocaleString('pt-BR'),
        submission.status,
        ...form.fields
          .filter(field => field.type !== 'separator' && field.type !== 'html')
          .map(field => {
            const value = submission.data[field.id];
            if (Array.isArray(value)) return value.join('; ');
            return String(value || '');
          })
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${form.slug}-submissions.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const value: FormsContextType = {
    forms,
    submissions,
    addForm,
    updateForm,
    deleteForm,
    toggleFormStatus,
    toggleFormVisibility,
    duplicateForm,
    getFormBySlug,
    getFormById,
    getActiveForms,
    getPublicForms,
    addSubmission,
    updateSubmissionStatus,
    getSubmissionsByForm,
    getTotalForms,
    getTotalSubmissions,
    getFieldTypes,
    validateField,
    exportSubmissions
  };

  return (
    <FormsContext.Provider value={value}>
      {children}
    </FormsContext.Provider>
  );
}