import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Timon CMS API')
    .setDescription('API do CMS Headless da Prefeitura Municipal de Timon - MA')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('posts', 'Gerenciamento de posts/notícias')
    .addTag('pages', 'Gerenciamento de páginas')
    .addTag('media', 'Gerenciamento de mídia')
    .addTag('forms', 'Formulários dinâmicos')
    .addTag('secretarias', 'Secretarias municipais')
    .addTag('services', 'Serviços públicos')
    .addTag('events', 'Eventos e agenda pública')
    .addTag('slides', 'Banners e destaques do portal')
    .addTag('galleries', 'Galerias públicas de mídia')
    .addTag('categories', 'Categorias de conteúdo')
    .addTag('tags', 'Etiquetas para classificação')
    .addTag('tourism-points', 'Pontos turísticos de Timon')
    .addTag('permissions', 'Controle de permissões granulares')
    .addTag('settings', 'Configurações gerais, SEO e aparência')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
  console.log(`📚 Documentation available at http://localhost:${port}/docs`);
}

bootstrap();