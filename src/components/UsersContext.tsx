import React, { createContext, useContext, useState, useEffect } from 'react';

export type Permission = 
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete'
  | 'posts.view' | 'posts.create' | 'posts.edit' | 'posts.delete' | 'posts.publish'
  | 'pages.view' | 'pages.create' | 'pages.edit' | 'pages.delete' | 'pages.publish'
  | 'events.view' | 'events.create' | 'events.edit' | 'events.delete'
  | 'gallery.view' | 'gallery.create' | 'gallery.edit' | 'gallery.delete'
  | 'forms.view' | 'forms.create' | 'forms.edit' | 'forms.delete' | 'forms.submissions'
  | 'media.view' | 'media.upload' | 'media.delete'
  | 'settings.view' | 'settings.edit'
  | 'analytics.view'
  | 'system.backup' | 'system.maintenance'
  | 'all';

export interface User {
  id: string;
  name: string;
  email: string;
  permissions: Permission[];
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
}

interface UsersContextType {
  // Usuários
  users: User[];
  addUser: (user: UserFormData) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getTotalUsers: () => number;
  getActiveUsers: () => User[];

  // Permissões
  getAllPermissions: () => { category: string; permissions: { value: Permission; label: string; description: string }[] }[];
  hasPermission: (userId: string, permission: Permission) => boolean;
  getUserPermissions: (userId: string) => Permission[];
  updateUserPermissions: (userId: string, permissions: Permission[]) => void;

  // Utilitários
  validateUserForm: (data: UserFormData) => string[];
  isEmailUnique: (email: string, excludeId?: string) => boolean;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  // Inicializar com dados de exemplo
  useEffect(() => {
    const initialUsers: User[] = [
      {
        id: '1',
        name: 'João Santos Silva',
        email: 'admin@timon.ma.gov.br',
        permissions: ['all'],
        isActive: true,
        lastLogin: new Date('2024-01-22T09:30:00'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-22'),
        createdBy: 'system'
      },
      {
        id: '2',
        name: 'Maria Conceição Santos',
        email: 'maria.santos@timon.ma.gov.br',
        permissions: [],
        isActive: true,
        lastLogin: new Date('2024-01-21T16:45:00'),
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-21'),
        createdBy: '1'
      },
      {
        id: '3',
        name: 'Carlos Roberto Lima',
        email: 'carlos.lima@timon.ma.gov.br',
        permissions: [],
        isActive: true,
        lastLogin: new Date('2024-01-22T08:15:00'),
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-22'),
        createdBy: '1'
      },
      {
        id: '4',
        name: 'Ana Paula Costa',
        email: 'ana.costa@timon.ma.gov.br',
        permissions: [],
        isActive: true,
        lastLogin: new Date('2024-01-20T14:20:00'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20'),
        createdBy: '1'
      },
      {
        id: '5',
        name: 'José Francisco Oliveira',
        email: 'jose.oliveira@timon.ma.gov.br',
        permissions: [],
        isActive: true,
        lastLogin: new Date('2024-01-19T11:10:00'),
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-19'),
        createdBy: '1'
      },
      {
        id: '6',
        name: 'Luciana Ferreira Silva',
        email: 'luciana.silva@timon.ma.gov.br',
        permissions: [],
        isActive: false,
        lastLogin: new Date('2024-01-15T17:30:00'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18'),
        createdBy: '1'
      }
    ];

    setUsers(initialUsers);
  }, []);

  const addUser = (userData: UserFormData) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      permissions: [], // Permissões serão definidas na aba "Permissões"
      isActive: userData.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '1' // ID do usuário atual logado
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates, updatedAt: new Date() } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(user =>
      user.id === id
        ? { ...user, isActive: !user.isActive, updatedAt: new Date() }
        : user
    ));
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const getTotalUsers = () => users.length;

  const getActiveUsers = () => users.filter(user => user.isActive);

  const getAllPermissions = () => [
    {
      category: 'Usuários e Acesso',
      permissions: [
        { value: 'users.view' as Permission, label: 'Visualizar Usuários', description: 'Ver lista de usuários' },
        { value: 'users.create' as Permission, label: 'Criar Usuários', description: 'Adicionar novos usuários' },
        { value: 'users.edit' as Permission, label: 'Editar Usuários', description: 'Modificar dados de usuários' },
        { value: 'users.delete' as Permission, label: 'Excluir Usuários', description: 'Remover usuários do sistema' }
      ]
    },
    {
      category: 'Conteúdo',
      permissions: [
        { value: 'posts.view' as Permission, label: 'Visualizar Notícias', description: 'Ver notícias do site' },
        { value: 'posts.create' as Permission, label: 'Criar Notícias', description: 'Adicionar novas notícias' },
        { value: 'posts.edit' as Permission, label: 'Editar Notícias', description: 'Modificar notícias existentes' },
        { value: 'posts.delete' as Permission, label: 'Excluir Notícias', description: 'Remover notícias' },
        { value: 'posts.publish' as Permission, label: 'Publicar Notícias', description: 'Publicar/despublicar notícias' },
        { value: 'pages.view' as Permission, label: 'Visualizar Páginas', description: 'Ver páginas do site' },
        { value: 'pages.create' as Permission, label: 'Criar Páginas', description: 'Adicionar novas páginas' },
        { value: 'pages.edit' as Permission, label: 'Editar Páginas', description: 'Modificar páginas existentes' },
        { value: 'pages.delete' as Permission, label: 'Excluir Páginas', description: 'Remover páginas' },
        { value: 'pages.publish' as Permission, label: 'Publicar Páginas', description: 'Publicar/despublicar páginas' }
      ]
    },
    {
      category: 'Eventos e Mídia',
      permissions: [
        { value: 'events.view' as Permission, label: 'Visualizar Eventos', description: 'Ver calendário de eventos' },
        { value: 'events.create' as Permission, label: 'Criar Eventos', description: 'Adicionar novos eventos' },
        { value: 'events.edit' as Permission, label: 'Editar Eventos', description: 'Modificar eventos existentes' },
        { value: 'events.delete' as Permission, label: 'Excluir Eventos', description: 'Remover eventos' },
        { value: 'gallery.view' as Permission, label: 'Visualizar Galeria', description: 'Ver galeria de fotos' },
        { value: 'gallery.create' as Permission, label: 'Criar Álbuns', description: 'Adicionar novos álbuns' },
        { value: 'gallery.edit' as Permission, label: 'Editar Galeria', description: 'Modificar álbuns e fotos' },
        { value: 'gallery.delete' as Permission, label: 'Excluir da Galeria', description: 'Remover álbuns e fotos' },
        { value: 'media.view' as Permission, label: 'Visualizar Mídia', description: 'Ver biblioteca de mídia' },
        { value: 'media.upload' as Permission, label: 'Upload de Mídia', description: 'Enviar novos arquivos' },
        { value: 'media.delete' as Permission, label: 'Excluir Mídia', description: 'Remover arquivos de mídia' }
      ]
    },
    {
      category: 'Formulários',
      permissions: [
        { value: 'forms.view' as Permission, label: 'Visualizar Formulários', description: 'Ver formulários criados' },
        { value: 'forms.create' as Permission, label: 'Criar Formulários', description: 'Adicionar novos formulários' },
        { value: 'forms.edit' as Permission, label: 'Editar Formulários', description: 'Modificar formulários existentes' },
        { value: 'forms.delete' as Permission, label: 'Excluir Formulários', description: 'Remover formulários' },
        { value: 'forms.submissions' as Permission, label: 'Ver Respostas', description: 'Acessar submissões de formulários' }
      ]
    },
    {
      category: 'Sistema',
      permissions: [
        { value: 'settings.view' as Permission, label: 'Visualizar Configurações', description: 'Ver configurações do sistema' },
        { value: 'settings.edit' as Permission, label: 'Editar Configurações', description: 'Modificar configurações' },
        { value: 'analytics.view' as Permission, label: 'Visualizar Analytics', description: 'Ver relatórios e estatísticas' },
        { value: 'system.backup' as Permission, label: 'Backup do Sistema', description: 'Realizar backups' },
        { value: 'system.maintenance' as Permission, label: 'Manutenção', description: 'Modo de manutenção' }
      ]
    }
  ];

  const hasPermission = (userId: string, permission: Permission) => {
    const user = getUserById(userId);
    if (!user) return false;
    
    return user.permissions.includes('all') || user.permissions.includes(permission);
  };

  const getUserPermissions = (userId: string) => {
    const user = getUserById(userId);
    if (!user) return [];
    
    return user.permissions;
  };

  const validateUserForm = (data: UserFormData): string[] => {
    const errors: string[] = [];
    
    if (!data.name.trim()) {
      errors.push('Nome é obrigatório');
    }
    
    if (!data.email.trim()) {
      errors.push('E-mail é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('E-mail inválido');
    }
    
    if (!data.password) {
      errors.push('Senha é obrigatória');
    } else if (data.password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }
    
    if (data.password !== data.confirmPassword) {
      errors.push('Senhas não coincidem');
    }
    
    return errors;
  };

  const updateUserPermissions = (userId: string, permissions: Permission[]) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, permissions, updatedAt: new Date() }
        : user
    ));
  };

  const isEmailUnique = (email: string, excludeId?: string): boolean => {
    return !users.some(user => user.email === email && user.id !== excludeId);
  };

  const value: UsersContextType = {
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserById,
    getTotalUsers,
    getActiveUsers,
    getAllPermissions,
    hasPermission,
    getUserPermissions,
    updateUserPermissions,
    validateUserForm,
    isEmailUnique
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
}