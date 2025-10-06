# Portal Oficial da Prefeitura Municipal de Timon

Monorepositório que concentra o front-end público, o painel administrativo e a API oficial do portal da Prefeitura Municipal de Timon (MA). A solução é dividida em aplicações especializadas e pacotes compartilhados para garantir organização, segurança e escalabilidade.

## Visão geral

- **Back-end (`apps/backend`)** – API em NestJS com Prisma, PostgreSQL e MinIO para autenticação, gerenciamento de conteúdo, mídia, formulários, serviços, secretarias e configurações.
- **Front-end público (`apps/frontend/portal`)** – Portal institucional em Next.js 14 que consome a API e exibe conteúdo dinâmico.
- **Painel administrativo (`apps/frontend/admin`)** – CMS/headless admin em Next.js com shadcn/ui para gestão de conteúdo e integrações.
- **Pacotes compartilhados (`packages/`)** – Tipos, SDK e configurações reutilizadas entre aplicações.
- **Infraestrutura (`infra/`)** – Artefatos de banco de dados e utilidades para a stack Docker (Postgres, MinIO, Traefik).

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose (para execução conteinerizada)

## Estrutura de pastas

```
apps/
  backend/              # API NestJS + Prisma
  frontend/
    admin/              # Painel CMS em Next.js
    portal/             # Portal público em Next.js
packages/
  config/               # Configurações compartilhadas
  sdk/                  # Cliente HTTP/React Query para o front
  types/                # Tipos e contratos compartilhados
infra/
  postgres/init.sql     # Extensões e ajustes padrões do banco
```

## Scripts principais

Use os workspaces npm diretamente a partir da raiz do repositório:

| Comando | Descrição |
| --- | --- |
| `npm run dev:backend` | Sobe a API em modo desenvolvimento (watch) |
| `npm run dev:portal` | Executa o portal público com Next.js |
| `npm run dev:admin` | Executa o painel administrativo |
| `npm run build` | Faz o build das três aplicações |
| `npm run db:migrate` | Aplica migrations Prisma no PostgreSQL |
| `npm run db:seed` | Popula dados iniciais (usuário admin, taxonomias, conteúdos) |
| `npm run docker:up` | Sobe toda a stack via Docker Compose |
| `npm run docker:down` | Encerra os contêineres e remove órfãos |

## Variáveis de ambiente

Cada aplicação possui seu próprio arquivo `.env.example` (quando aplicável). Os valores mínimos esperados pelo Docker Compose são:

```
DATABASE_URL=postgresql://postgres:postgres@db:5432/app
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=app-bucket
JWT_SECRET=super-secret-jwt-key-for-development
SEED_ADMIN_EMAIL=admin@timon.ma.gov.br
SEED_ADMIN_PASSWORD=admin@123
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_CDN_BASE_URL=http://localhost:9000/app-bucket
```

Ajuste as credenciais em produção (principalmente `JWT_SECRET`, credenciais do banco, MinIO e usuário administrador).

## Próximos passos

1. Execute `npm install` para preparar os workspaces.
2. Rode `npm run db:migrate` para aplicar o esquema do banco.
3. Opcionalmente, execute `npm run db:seed` para criar dados base.
4. Use `npm run docker:up` para subir toda a stack integrada ou inicie cada aplicação com os comandos `dev:*`.

Mais detalhes de execução local e publicação em produção estão no arquivo [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
