import { PrismaClient, UserRole, CategoryType, TagType, PostStatus, PageStatus, EventStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[^\p{ASCII}]/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .toLowerCase();

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@timon.ma.gov.br';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'admin@123';

  const hashed = await hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Administrador Geral',
      password: hashed,
      role: UserRole.ADMIN,
      active: true,
    },
    create: {
      email,
      name: 'Administrador Geral',
      password: hashed,
      role: UserRole.ADMIN,
    },
  });

  return admin;
}

async function seedTaxonomies() {
  const categories = [
    { name: 'Notícias', type: CategoryType.POST, description: 'Publicações oficiais e novidades da prefeitura.' },
    { name: 'Eventos', type: CategoryType.EVENT, description: 'Agenda cultural e administrativa de Timon.' },
    { name: 'Serviços', type: CategoryType.SERVICE, description: 'Serviços públicos disponíveis aos cidadãos.' },
    { name: 'Turismo', type: CategoryType.TOURISM, description: 'Pontos turísticos, cultura e lazer.' },
  ];

  for (const category of categories) {
    const slug = slugify(category.name);
    await prisma.category.upsert({
      where: { slug },
      update: {
        name: category.name,
        description: category.description,
        type: category.type,
      },
      create: {
        name: category.name,
        slug,
        description: category.description,
        type: category.type,
      },
    });
  }

  const tags = [
    { name: 'Prefeitura', type: TagType.POST },
    { name: 'Cidadania', type: TagType.POST },
    { name: 'Desenvolvimento', type: TagType.SERVICE },
    { name: 'Cultura', type: TagType.EVENT },
  ];

  for (const tag of tags) {
    const slug = slugify(tag.name);
    await prisma.tag.upsert({
      where: { slug },
      update: { name: tag.name, type: tag.type },
      create: {
        name: tag.name,
        slug,
        type: tag.type,
      },
    });
  }
}

async function seedPermissions(adminId: string) {
  const permissions = [
    {
      name: 'content.manage',
      description: 'Gerenciar posts, páginas, banners e galerias.',
      scopes: ['posts', 'pages', 'slides', 'galleries'],
    },
    {
      name: 'services.manage',
      description: 'Administrar secretarias e serviços públicos.',
      scopes: ['services', 'secretarias'],
    },
    {
      name: 'settings.manage',
      description: 'Configurar SEO, aparência e integrações do portal.',
      scopes: ['settings', 'seo', 'appearance'],
    },
  ];

  for (const permission of permissions) {
    const record = await prisma.permission.upsert({
      where: { name: permission.name },
      update: {
        description: permission.description,
        scopes: permission.scopes,
      },
      create: permission,
    });

    await prisma.userPermission.upsert({
      where: {
        user_id_permission_id: { user_id: adminId, permission_id: record.id },
      },
      update: {},
      create: {
        user: { connect: { id: adminId } },
        permission: { connect: { id: record.id } },
      },
    });
  }
}

async function seedSettings() {
  await prisma.setting.upsert({
    where: { key: 'general.site' },
    update: {
      value: {
        name: 'Prefeitura Municipal de Timon',
        shortName: 'Prefeitura de Timon',
        city: 'Timon - MA',
        email: 'contato@timon.ma.gov.br',
        phone: '+55 99 3212-0000',
      },
    },
    create: {
      key: 'general.site',
      value: {
        name: 'Prefeitura Municipal de Timon',
        shortName: 'Prefeitura de Timon',
        city: 'Timon - MA',
        email: 'contato@timon.ma.gov.br',
        phone: '+55 99 3212-0000',
      },
    },
  });

  await prisma.setting.upsert({
    where: { key: 'seo.default' },
    update: {
      value: {
        title: 'Portal Oficial da Prefeitura Municipal de Timon',
        description:
          'Informações oficiais, serviços, notícias e transparência da Prefeitura Municipal de Timon - Maranhão.',
        keywords: ['Timon', 'Prefeitura', 'Serviços Públicos', 'Cidadania'],
        image: 'https://images.prismic.io/static-timon/portal-prefeitura.jpg',
      },
    },
    create: {
      key: 'seo.default',
      value: {
        title: 'Portal Oficial da Prefeitura Municipal de Timon',
        description:
          'Informações oficiais, serviços, notícias e transparência da Prefeitura Municipal de Timon - Maranhão.',
        keywords: ['Timon', 'Prefeitura', 'Serviços Públicos', 'Cidadania'],
        image: 'https://images.prismic.io/static-timon/portal-prefeitura.jpg',
      },
    },
  });

  await prisma.setting.upsert({
    where: { key: 'appearance.theme' },
    update: {
      value: {
        primaryColor: '#0B3D91',
        secondaryColor: '#FFD200',
        accentColor: '#00A859',
        lightLogo: 'https://images.prismic.io/static-timon/logo-horizontal-branca.png',
        darkLogo: 'https://images.prismic.io/static-timon/logo-horizontal-colorida.png',
      },
    },
    create: {
      key: 'appearance.theme',
      value: {
        primaryColor: '#0B3D91',
        secondaryColor: '#FFD200',
        accentColor: '#00A859',
        lightLogo: 'https://images.prismic.io/static-timon/logo-horizontal-branca.png',
        darkLogo: 'https://images.prismic.io/static-timon/logo-horizontal-colorida.png',
      },
    },
  });
}

async function seedContent(adminId: string) {
  const noticiasCategory = await prisma.category.findUnique({ where: { slug: 'noticias' } });
  const turismoCategory = await prisma.category.findUnique({ where: { slug: 'turismo' } });
  const prefeituraTag = await prisma.tag.findUnique({ where: { slug: 'prefeitura' } });
  const cidadaniaTag = await prisma.tag.findUnique({ where: { slug: 'cidadania' } });

  if (noticiasCategory && prefeituraTag && cidadaniaTag) {
    const postSlug = 'boas-vindas-prefeitura-timon';
    const exists = await prisma.post.findUnique({ where: { slug: postSlug } });
    if (!exists) {
      await prisma.post.create({
        data: {
          title: 'Prefeitura de Timon dá boas-vindas ao novo portal oficial',
          slug: postSlug,
          content:
            'O novo portal da Prefeitura Municipal de Timon foi lançado para facilitar o acesso às informações oficiais, serviços públicos e notícias da nossa cidade. Explore as secretarias, agenda de eventos, serviços digitais e as principais iniciativas do governo municipal.',
          excerpt:
            'Conheça o novo portal da Prefeitura Municipal de Timon com serviços digitais, transparência e informações oficiais para toda a população.',
          status: PostStatus.PUBLISHED,
          publish_at: new Date(),
          author: { connect: { id: adminId } },
          categories: {
            create: [{ category: { connect: { id: noticiasCategory.id } } }],
          },
          tags: {
            create: [
              { tag: { connect: { id: prefeituraTag.id } } },
              { tag: { connect: { id: cidadaniaTag.id } } },
            ],
          },
        },
      });
    }
  }

  const pageSlug = 'portal-institucional';
  const existingPage = await prisma.page.findUnique({ where: { slug: pageSlug } });
  if (!existingPage) {
    await prisma.page.create({
      data: {
        title: 'Portal Institucional',
        slug: pageSlug,
        content:
          'Bem-vindo ao Portal Institucional da Prefeitura Municipal de Timon. Aqui você encontra informações sobre os serviços públicos, agenda oficial, notícias, programas sociais e ações estratégicas para o desenvolvimento da nossa cidade.',
        excerpt: 'Conheça a Prefeitura Municipal de Timon e os projetos que transformam a cidade.',
        status: PageStatus.PUBLISHED,
        author: { connect: { id: adminId } },
      },
    });
  }

  const slideId = 'home-hero-slide';
  await prisma.slide.upsert({
    where: { id: slideId },
    update: {
      title: 'Bem-vindo ao Portal Oficial de Timon',
      subtitle: 'Serviços digitais, transparência e notícias em um só lugar.',
      description:
        'Acesse serviços on-line, acompanhe projetos estratégicos e fique por dentro da agenda oficial da Prefeitura de Timon.',
      image: 'https://images.prismic.io/static-timon/hero-prefeitura-timon.jpg',
      link: 'https://portal.timon.ma.gov.br',
      button_text: 'Conheça os serviços',
      order: 1,
      active: true,
    },
    create: {
      id: slideId,
      title: 'Bem-vindo ao Portal Oficial de Timon',
      subtitle: 'Serviços digitais, transparência e notícias em um só lugar.',
      description:
        'Acesse serviços on-line, acompanhe projetos estratégicos e fique por dentro da agenda oficial da Prefeitura de Timon.',
      image: 'https://images.prismic.io/static-timon/hero-prefeitura-timon.jpg',
      link: 'https://portal.timon.ma.gov.br',
      button_text: 'Conheça os serviços',
      order: 1,
      active: true,
    },
  });

  const eventId = 'evento-virada-cultural';
  const existingEvent = await prisma.event.findUnique({ where: { id: eventId } });
  if (!existingEvent) {
    await prisma.event.create({
      data: {
        id: eventId,
        title: 'Virada Cultural de Timon',
        description:
          'A Virada Cultural reúne artistas locais, oficinas, apresentações e ações de cidadania em toda a cidade de Timon.',
        start_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
        location: 'Praça São José, Centro',
        image: 'https://images.prismic.io/static-timon/evento-virada-cultural.jpg',
        category: 'Cultura',
        status: EventStatus.PUBLISHED,
        author: { connect: { id: adminId } },
      },
    });
  }

  const serviceId = 'servico-emissao-iptv';
  const existingService = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!existingService) {
    await prisma.service.create({
      data: {
        id: serviceId,
        title: 'Emissão da Guia do IPTU',
        description:
          'Serviço digital para emissão da Guia do IPTU de Timon. Permite consultar débitos, gerar boletos atualizados e emitir segunda via.',
        category: 'Tributos Municipais',
        requirements: ['Número da inscrição municipal', 'CPF ou CNPJ do contribuinte'],
        documents: ['Documento oficial com foto', 'Comprovante de endereço atualizado'],
        process_time: 'Imediato',
        cost: 'Consultar valores atualizados no portal',
        responsible_department: 'Secretaria Municipal de Receita',
        contact_info: 'atendimento@timon.ma.gov.br | (99) 3212-0010',
        online_url: 'https://portal.timon.ma.gov.br/servicos/iptv',
        author: { connect: { id: adminId } },
      },
    });
  }

  const secretariaId = 'secretaria-planejamento';
  const existingSecretaria = await prisma.secretaria.findUnique({ where: { id: secretariaId } });
  if (!existingSecretaria) {
    await prisma.secretaria.create({
      data: {
        id: secretariaId,
        name: 'Secretaria Municipal de Planejamento',
        description:
          'Responsável pela coordenação das políticas públicas, planejamento estratégico e monitoramento de indicadores do município de Timon.',
        secretary_name: 'Maria das Graças Sousa',
        address: 'Av. Piauí, 1234 - Centro, Timon - MA',
        phone: '+55 99 3212-0020',
        email: 'planejamento@timon.ma.gov.br',
        website: 'https://portal.timon.ma.gov.br/secretarias/planejamento',
        image: 'https://images.prismic.io/static-timon/secretaria-planejamento.jpg',
        services: ['servico-emissao-iptv'],
        author: { connect: { id: adminId } },
      },
    });
  }

  if (turismoCategory) {
    const tourismSlug = 'parque-municipal-sao-francisco';
    const existingTourism = await prisma.tourismPoint.findUnique({ where: { slug: tourismSlug } });
    if (!existingTourism) {
      await prisma.tourismPoint.create({
        data: {
          name: 'Parque Municipal São Francisco',
          slug: tourismSlug,
          description:
            'O Parque Municipal São Francisco é um espaço de lazer, cultura e esporte, com áreas verdes, quadras e agenda permanente de eventos para toda a família.',
          address: 'Av. Parnarama, s/n - Parque Alvorada, Timon - MA',
          latitude: -5.09625,
          longitude: -42.83654,
          image: 'https://images.prismic.io/static-timon/parque-sao-francisco.jpg',
          gallery: [
            'https://images.prismic.io/static-timon/parque-sao-francisco-01.jpg',
            'https://images.prismic.io/static-timon/parque-sao-francisco-02.jpg',
          ],
          contact_info: 'turismo@timon.ma.gov.br | (99) 3212-0035',
          author: { connect: { id: adminId } },
        },
      });
    }
  }

  const mediaId = 'default-logo';
  await prisma.mediaFile.upsert({
    where: { id: mediaId },
    update: {
      filename: 'logo-prefeitura-timon.png',
      original_name: 'logo-prefeitura-timon.png',
      mimetype: 'image/png',
      size: 20480,
      url: 'https://images.prismic.io/static-timon/logo-horizontal-colorida.png',
      alt: 'Logotipo oficial da Prefeitura Municipal de Timon',
      caption: 'Logotipo oficial utilizado em materiais institucionais.',
      folder: 'identidade-visual',
      uploaded_by: adminId,
    },
    create: {
      id: mediaId,
      filename: 'logo-prefeitura-timon.png',
      original_name: 'logo-prefeitura-timon.png',
      mimetype: 'image/png',
      size: 20480,
      url: 'https://images.prismic.io/static-timon/logo-horizontal-colorida.png',
      alt: 'Logotipo oficial da Prefeitura Municipal de Timon',
      caption: 'Logotipo oficial utilizado em materiais institucionais.',
      folder: 'identidade-visual',
      uploader: { connect: { id: adminId } },
    },
  });

  const galleryId = 'galeria-cidade';
  const existingGallery = await prisma.gallery.findUnique({ where: { id: galleryId } });
  if (!existingGallery) {
    await prisma.gallery.create({
      data: {
        id: galleryId,
        title: 'Timon em Imagens',
        description: 'Seleção de fotografias da cidade e de projetos estruturantes.',
        category: 'Institucional',
        author: { connect: { id: adminId } },
        images: {
          create: [
            {
              id: 'galeria-cidade-01',
              url: 'https://images.prismic.io/static-timon/galeria-timon-01.jpg',
              alt: 'Vista aérea da cidade de Timon',
              caption: 'Vista aérea destacando a integração urbana de Timon.',
              order: 1,
            },
            {
              id: 'galeria-cidade-02',
              url: 'https://images.prismic.io/static-timon/galeria-timon-02.jpg',
              alt: 'Praça pública revitalizada em Timon',
              caption: 'Praça central revitalizada com área de convivência e lazer.',
              order: 2,
            },
          ],
        },
      },
    });
  }

  const formSlug = 'fale-conosco';
  const existingForm = await prisma.form.findUnique({ where: { slug: formSlug } });
  if (!existingForm) {
    await prisma.form.create({
      data: {
        title: 'Fale Conosco',
        slug: formSlug,
        description: 'Canal oficial para atendimento ao cidadão pela Prefeitura Municipal de Timon.',
        fields: [
          { type: 'text', name: 'nome', label: 'Nome completo', required: true },
          { type: 'email', name: 'email', label: 'E-mail', required: true },
          { type: 'select', name: 'assunto', label: 'Assunto', options: ['Ouvidoria', 'Serviços', 'Transparência', 'Outros'] },
          { type: 'textarea', name: 'mensagem', label: 'Mensagem', required: true },
        ],
        settings: { notifyEmail: 'ouvidoria@timon.ma.gov.br' },
        author: { connect: { id: adminId } },
      },
    });
  }
}

async function main() {
  try {
    const admin = await seedAdmin();
    await seedTaxonomies();
    await seedPermissions(admin.id);
    await seedSettings();
    await seedContent(admin.id);
  } catch (error) {
    console.error('Erro ao executar seed:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
