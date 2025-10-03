import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Limpando dados existentes...');
    await prisma.auditLog.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.user.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
  }

  // 1. Criar Permissões
  console.log('🔐 Criando permissões...');
  
  const permissions = [
    // User management
    { action: 'create', subject: 'user' },
    { action: 'read', subject: 'user' },
    { action: 'update', subject: 'user' },
    { action: 'delete', subject: 'user' },
    { action: 'manage', subject: 'user' },

    // Role management
    { action: 'create', subject: 'role' },
    { action: 'read', subject: 'role' },
    { action: 'update', subject: 'role' },
    { action: 'delete', subject: 'role' },
    { action: 'manage', subject: 'role' },

    // Content management
    { action: 'create', subject: 'post' },
    { action: 'read', subject: 'post' },
    { action: 'update', subject: 'post' },
    { action: 'delete', subject: 'post' },
    { action: 'publish', subject: 'post' },
    { action: 'schedule', subject: 'post' },

    // Page management
    { action: 'create', subject: 'page' },
    { action: 'read', subject: 'page' },
    { action: 'update', subject: 'page' },
    { action: 'delete', subject: 'page' },
    { action: 'publish', subject: 'page' },

    // Media management
    { action: 'create', subject: 'media' },
    { action: 'read', subject: 'media' },
    { action: 'update', subject: 'media' },
    { action: 'delete', subject: 'media' },
    { action: 'upload', subject: 'media' },

    // Menu management
    { action: 'create', subject: 'menu' },
    { action: 'read', subject: 'menu' },
    { action: 'update', subject: 'menu' },
    { action: 'delete', subject: 'menu' },

    // Collection management
    { action: 'create', subject: 'collection' },
    { action: 'read', subject: 'collection' },
    { action: 'update', subject: 'collection' },
    { action: 'delete', subject: 'collection' },
    { action: 'manage', subject: 'collection' },

    // Content Entry management
    { action: 'create', subject: 'entry' },
    { action: 'read', subject: 'entry' },
    { action: 'update', subject: 'entry' },
    { action: 'delete', subject: 'entry' },
    { action: 'publish', subject: 'entry' },

    // Taxonomy management
    { action: 'create', subject: 'taxonomy' },
    { action: 'read', subject: 'taxonomy' },
    { action: 'update', subject: 'taxonomy' },
    { action: 'delete', subject: 'taxonomy' },

    // Webhook management
    { action: 'create', subject: 'webhook' },
    { action: 'read', subject: 'webhook' },
    { action: 'update', subject: 'webhook' },
    { action: 'delete', subject: 'webhook' },
    { action: 'manage', subject: 'webhook' },

    // SEO management
    { action: 'manage', subject: 'seo' },

    // Settings management
    { action: 'manage', subject: 'settings' },

    // Audit logs
    { action: 'read', subject: 'audit' },
  ];

  for (const permData of permissions) {
    await prisma.permission.upsert({
      where: {
        action_subject: {
          action: permData.action,
          subject: permData.subject,
        },
      },
      update: {},
      create: permData,
    });
  }

  // 2. Criar Roles
  console.log('👥 Criando roles...');

  const roles = [
    {
      name: 'SuperAdmin',
      description: 'Acesso total ao sistema - apenas para desenvolvedores e administradores principais',
    },
    {
      name: 'Admin',
      description: 'Administrador geral - gerencia usuários, configurações e todo o conteúdo',
    },
    {
      name: 'Editor',
      description: 'Editor chefe - publica e gerencia todo tipo de conteúdo',
    },
    {
      name: 'Author',
      description: 'Autor - cria e edita próprio conteúdo, pode publicar posts',
    },
    {
      name: 'Contributor',
      description: 'Colaborador - cria rascunhos que precisam de aprovação',
    },
    {
      name: 'Moderator',
      description: 'Moderador - revisa conteúdo e gerencia comentários',
    },
    {
      name: 'Viewer',
      description: 'Visualizador - acesso apenas de leitura ao painel admin',
    },
  ];

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
  }

  // 3. Associar Permissões às Roles
  console.log('🔗 Associando permissões às roles...');

  // SuperAdmin - todas as permissões
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SuperAdmin' } });
  const allPermissions = await prisma.permission.findMany();
  
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole!.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole!.id,
        permissionId: permission.id,
      },
    });
  }

  // Admin - quase todas, exceto manage user/role (não pode criar outros admins)
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });
  const adminPermissions = allPermissions.filter(p => 
    !(p.action === 'manage' && (p.subject === 'user' || p.subject === 'role'))
  );

  for (const permission of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole!.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole!.id,
        permissionId: permission.id,
      },
    });
  }

  // Editor - gerenciamento de conteúdo completo
  const editorRole = await prisma.role.findUnique({ where: { name: 'Editor' } });
  const editorPermissions = allPermissions.filter(p => 
    ['post', 'page', 'media', 'menu', 'entry', 'taxonomy', 'seo'].includes(p.subject) ||
    (p.subject === 'user' && p.action === 'read')
  );

  for (const permission of editorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: editorRole!.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: editorRole!.id,
        permissionId: permission.id,
      },
    });
  }

  // Author - criação e edição de próprio conteúdo
  const authorRole = await prisma.role.findUnique({ where: { name: 'Author' } });
  const authorPermissions = allPermissions.filter(p => 
    (p.subject === 'post' && ['create', 'read', 'update', 'publish'].includes(p.action)) ||
    (p.subject === 'media' && ['create', 'read', 'upload'].includes(p.action)) ||
    (p.subject === 'taxonomy' && p.action === 'read')
  );

  for (const permission of authorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: authorRole!.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: authorRole!.id,
        permissionId: permission.id,
      },
    });
  }

  // Contributor - apenas rascunhos
  const contributorRole = await prisma.role.findUnique({ where: { name: 'Contributor' } });
  const contributorPermissions = allPermissions.filter(p => 
    (p.subject === 'post' && ['create', 'read', 'update'].includes(p.action)) ||
    (p.subject === 'media' && ['read', 'upload'].includes(p.action)) ||
    (p.subject === 'taxonomy' && p.action === 'read')
  );

  for (const permission of contributorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: contributorRole!.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: contributorRole!.id,
        permissionId: permission.id,
      },
    });
  }

  // Viewer - apenas leitura
  const viewerRole = await prisma.role.findUnique({ where: { name: 'Viewer' } });
  const viewerPermissions = allPermissions.filter(p => p.action === 'read');

  for (const permission of viewerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: viewerRole!.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: viewerRole!.id,
        permissionId: permission.id,
      },
    });
  }

  // 4. Criar Usuários Padrão
  console.log('👤 Criando usuários padrão...');

  const users = [
    {
      name: 'Super Administrador',
      email: 'admin@timon.ma.gov.br',
      password: 'Admin@123',
      role: 'SuperAdmin',
    },
    {
      name: 'Administrador Geral',
      email: 'admin.geral@timon.ma.gov.br',
      password: 'Admin@123',
      role: 'Admin',
    },
    {
      name: 'Editor Chefe',
      email: 'editor@timon.ma.gov.br',
      password: 'Editor@123',
      role: 'Editor',
    },
    {
      name: 'João Santos',
      email: 'author@timon.ma.gov.br',
      password: 'Author@123',
      role: 'Author',
    },
    {
      name: 'Maria Silva',
      email: 'contributor@timon.ma.gov.br',
      password: 'Contributor@123',
      role: 'Contributor',
    },
  ];

  for (const userData of users) {
    const passwordHash = await bcrypt.hash(userData.password, 12);
    const role = await prisma.role.findUnique({ where: { name: userData.role } });

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        passwordHash,
        status: 'ACTIVE',
      },
    });

    // Associar role ao usuário
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role!.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: role!.id,
      },
    });
  }

  // 5. Criar Taxonomias Básicas
  console.log('🏷️ Criando taxonomias...');

  const categories = [
    {
      slug: 'noticias',
      title: { 'pt-BR': 'Notícias', 'en-US': 'News' },
      type: 'CATEGORY',
    },
    {
      slug: 'eventos',
      title: { 'pt-BR': 'Eventos', 'en-US': 'Events' },
      type: 'CATEGORY',
    },
    {
      slug: 'comunicados',
      title: { 'pt-BR': 'Comunicados', 'en-US': 'Announcements' },
      type: 'CATEGORY',
    },
    {
      slug: 'saude',
      title: { 'pt-BR': 'Saúde', 'en-US': 'Health' },
      type: 'TAG',
    },
    {
      slug: 'educacao',
      title: { 'pt-BR': 'Educação', 'en-US': 'Education' },
      type: 'TAG',
    },
    {
      slug: 'infraestrutura',
      title: { 'pt-BR': 'Infraestrutura', 'en-US': 'Infrastructure' },
      type: 'TAG',
    },
    {
      slug: 'cultura',
      title: { 'pt-BR': 'Cultura', 'en-US': 'Culture' },
      type: 'TAG',
    },
  ];

  for (const taxData of categories) {
    await prisma.taxonomy.upsert({
      where: { slug: taxData.slug },
      update: {},
      create: taxData,
    });
  }

  // 6. Criar Menus Básicos
  console.log('📋 Criando menus...');

  const menus = [
    {
      name: 'Menu Principal',
      location: 'main',
      items: [
        {
          id: '1',
          label: { 'pt-BR': 'Início', 'en-US': 'Home' },
          url: '/',
          type: 'url',
          order: 1,
          children: [],
        },
        {
          id: '2',
          label: { 'pt-BR': 'Prefeitura', 'en-US': 'City Hall' },
          url: '/prefeitura',
          type: 'url',
          order: 2,
          children: [
            {
              id: '2-1',
              label: { 'pt-BR': 'História', 'en-US': 'History' },
              url: '/prefeitura/historia',
              type: 'url',
              order: 1,
              children: [],
            },
            {
              id: '2-2',
              label: { 'pt-BR': 'Prefeito', 'en-US': 'Mayor' },
              url: '/prefeitura/prefeito',
              type: 'url',
              order: 2,
              children: [],
            },
          ],
        },
        {
          id: '3',
          label: { 'pt-BR': 'Serviços', 'en-US': 'Services' },
          url: '/servicos',
          type: 'url',
          order: 3,
          children: [],
        },
        {
          id: '4',
          label: { 'pt-BR': 'Notícias', 'en-US': 'News' },
          url: '/noticias',
          type: 'url',
          order: 4,
          children: [],
        },
        {
          id: '5',
          label: { 'pt-BR': 'Transparência', 'en-US': 'Transparency' },
          url: '/transparencia',
          type: 'url',
          order: 5,
          children: [],
        },
      ],
    },
    {
      name: 'Menu Footer',
      location: 'footer',
      items: [
        {
          id: '1',
          label: { 'pt-BR': 'Contato', 'en-US': 'Contact' },
          url: '/contato',
          type: 'url',
          order: 1,
          children: [],
        },
        {
          id: '2',
          label: { 'pt-BR': 'Acessibilidade', 'en-US': 'Accessibility' },
          url: '/acessibilidade',
          type: 'url',
          order: 2,
          children: [],
        },
      ],
    },
  ];

  for (const menuData of menus) {
    await prisma.menu.upsert({
      where: { location: menuData.location },
      update: {},
      create: menuData,
    });
  }

  // 7. Criar Collections de Exemplo
  console.log('📚 Criando collections de exemplo...');

  const collections = [
    {
      key: 'banners',
      name: { 'pt-BR': 'Banners', 'en-US': 'Banners' },
      description: { 'pt-BR': 'Banners para homepage e páginas especiais', 'en-US': 'Banners for homepage and special pages' },
      schema: {
        type: 'object',
        properties: {
          titulo: {
            type: 'string',
            title: 'Título',
          },
          subtitulo: {
            type: 'string',
            title: 'Subtítulo',
          },
          imagem: {
            type: 'string',
            format: 'media',
            title: 'Imagem',
          },
          link: {
            type: 'string',
            format: 'uri',
            title: 'Link de Destino',
          },
          ativo: {
            type: 'boolean',
            title: 'Ativo',
            default: true,
          },
        },
        required: ['titulo', 'imagem'],
      },
      settings: {
        hasStatus: true,
        hasRevisions: true,
        hasI18n: true,
        hasSeo: false,
      },
    },
    {
      key: 'servicos',
      name: { 'pt-BR': 'Serviços', 'en-US': 'Services' },
      description: { 'pt-BR': 'Catálogo de serviços da prefeitura', 'en-US': 'City hall services catalog' },
      schema: {
        type: 'object',
        properties: {
          nome: {
            type: 'string',
            title: 'Nome do Serviço',
          },
          descricao: {
            type: 'string',
            title: 'Descrição',
          },
          categoria: {
            type: 'string',
            title: 'Categoria',
            enum: ['documentos', 'licencas', 'tributario', 'social', 'outros'],
          },
          requisitos: {
            type: 'array',
            items: { type: 'string' },
            title: 'Requisitos',
          },
          prazo: {
            type: 'string',
            title: 'Prazo de Atendimento',
          },
          responsavel: {
            type: 'string',
            title: 'Secretaria Responsável',
          },
          online: {
            type: 'boolean',
            title: 'Disponível Online',
            default: false,
          },
        },
        required: ['nome', 'descricao', 'categoria'],
      },
      settings: {
        hasStatus: true,
        hasRevisions: true,
        hasI18n: true,
        hasSeo: true,
      },
    },
  ];

  for (const collectionData of collections) {
    await prisma.collection.upsert({
      where: { key: collectionData.key },
      update: {},
      create: collectionData,
    });
  }

  // 8. Criar API Keys para desenvolvimento
  console.log('🔑 Criando API keys...');

  await prisma.apiKey.upsert({
    where: { key: 'dev-frontend-key' },
    update: {},
    create: {
      name: 'Frontend Development',
      key: 'dev-frontend-key',
      scopes: ['read:posts', 'read:pages', 'read:media', 'read:menus', 'read:entries'],
      enabled: true,
    },
  });

  await prisma.apiKey.upsert({
    where: { key: 'dev-admin-key' },
    update: {},
    create: {
      name: 'Admin Development',
      key: 'dev-admin-key',
      scopes: ['*'],
      enabled: true,
    },
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('\n📋 Resumo:');
  console.log(`- ${permissions.length} permissões criadas`);
  console.log(`- ${roles.length} roles criadas`);
  console.log(`- ${users.length} usuários criados`);
  console.log(`- ${categories.length} taxonomias criadas`);
  console.log(`- ${menus.length} menus criados`);
  console.log(`- ${collections.length} collections criadas`);
  console.log('\n🔐 Usuários de teste:');
  console.log('SuperAdmin: admin@timon.ma.gov.br / Admin@123');
  console.log('Editor: editor@timon.ma.gov.br / Editor@123');
  console.log('Author: author@timon.ma.gov.br / Author@123');
  console.log('\n🌐 Acesse: http://localhost:3000/admin');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });