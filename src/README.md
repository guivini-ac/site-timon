# Timon CMS Monorepo

Sistema de gerenciamento de conteúdo headless para a Prefeitura Municipal de Timon - MA.

## 🏛️ Sobre o Projeto

Este é um monorepo completo que contém:

- **API Backend** (NestJS + Prisma + PostgreSQL)
- **Frontend Web** (Next.js 14 + React + Tailwind CSS)
- **CMS Admin** (Next.js + shadcn/ui)
- **SDK TypeScript** para integração
- **Packages compartilhados** (types, config, utils)

### 🎯 Características

- ✅ Padrões governamentais brasileiros
- ✅ Acessibilidade WCAG 2.1 AA
- ✅ Design mobile-first
- ✅ Cores oficiais da Prefeitura de Timon
- ✅ Integração com sistemas municipais
- ✅ Docker Compose para desenvolvimento
- ✅ Sistema RBAC/ABAC
- ✅ Editor rich-text TipTap
- ✅ Upload de mídia S3-compatível (MinIO)

## 🚀 Como executar

### Pré-requisitos

- Node.js >= 18
- pnpm >= 8
- Docker & Docker Compose

### Instalação e execução

```bash
# Clone o repositório
git clone [URL_DO_REPO]
cd timon-cms-monorepo

# Execute o setup completo
pnpm setup
```

O comando `pnpm setup` irá:
1. Instalar todas as dependências
2. Subir os containers Docker
3. Executar as migrações do banco
4. Popular o banco com dados iniciais
5. Iniciar os serviços

### Execução manual

```bash
# Instalar dependências
pnpm install

# Subir infraestrutura (PostgreSQL, MinIO, Traefik)
pnpm docker:up

# Aguarde uns 30 segundos para os serviços iniciarem

# Executar migrações
pnpm migrate

# Popular banco de dados
pnpm seed

# Executar em modo desenvolvimento
pnpm dev
```

## 📁 Estrutura do Projeto

```
timon-cms-monorepo/
├── apps/
│   ├── api/           # Backend NestJS
│   ├── web/           # Frontend Next.js
│   └── cms/           # Painel Admin
├── packages/
│   ├── types/         # Definições TypeScript compartilhadas
│   ├── sdk/           # SDK para integração
│   └── config/        # Configurações compartilhadas
├── infra/
│   ├── docker-compose.yml
│   └── postgres/
└── docs/              # Documentação
```

## 🐳 Serviços Docker

| Serviço | Porta | Descrição |
|---------|--------|-----------|
| Web Frontend | 3000 | Aplicação Next.js principal |
| API Backend | 3001 | API NestJS |
| PostgreSQL | 5432 | Banco de dados |
| MinIO | 9000 | Storage S3-compatível |
| MinIO Console | 9001 | Interface web do MinIO |
| Traefik | 80/443/8080 | Proxy reverso e dashboard |

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Executa API e Web em desenvolvimento
pnpm dev:api          # Apenas API
pnpm dev:web          # Apenas Web

# Build e produção
pnpm build            # Build de todos os projetos
pnpm start            # Executa em modo produção
pnpm start:api        # Apenas API em produção
pnpm start:web        # Apenas Web em produção

# Database
pnpm migrate          # Executa migrações
pnpm migrate:generate # Gera nova migração
pnpm seed             # Popula banco com dados iniciais
pnpm db:studio        # Abre Prisma Studio

# Docker
pnpm docker:up        # Sobe containers
pnpm docker:down      # Para containers
pnpm docker:logs      # Visualiza logs
pnpm docker:reset     # Remove volumes e reinicia

# Utilidades
pnpm lint             # Linter em todos os projetos
pnpm typecheck        # Verificação de tipos
pnpm test             # Testes
pnpm clean            # Limpa builds e node_modules
```

## 🎨 Design System

O projeto utiliza as cores oficiais da Prefeitura de Timon:

- **Tory Blue**: `#144c9c` (Cor primária)
- **Saffron**: `#f4b728`
- **San Marino**: `#3f6999`
- **Steel Blue**: `#4c7cb4`
- **Polo Blue**: `#83a4cc`
- **Periwinkle Gray**: `#c2d2e5`
- **Bermuda Gray**: `#6886a6`

### Tipografia

- **Títulos**: Roboto Condensed
- **Corpo**: Open Sans
- **Tamanho base**: 14px

## 🔧 Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"

# JWT
JWT_SECRET="super-secret-jwt-key-for-development"

# S3/MinIO
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_BUCKET="app-bucket"
S3_REGION="us-east-1"
S3_FORCE_PATH_STYLE=true

# URLs
NEXT_PUBLIC_API_BASE_URL="http://localhost:3001"
NEXT_PUBLIC_CDN_BASE_URL="http://localhost:9000/app-bucket"
```

## 📱 Acessibilidade

Este projeto segue as diretrizes WCAG 2.1 AA:

- ✅ Navegação por teclado
- ✅ Leitores de tela
- ✅ Alto contraste
- ✅ Textos alternativos
- ✅ Foco visível
- ✅ Estrutura semântica
- ✅ Integração com VLibras

## 🔐 Autenticação e Autorização

- Sistema RBAC (Role-Based Access Control)
- Sistema ABAC (Attribute-Based Access Control)
- JWT para autenticação
- Níveis: Admin, Editor, Autor, Visualizador

## 📊 APIs e Integrações

- **API RESTful** com Swagger/OpenAPI
- **GraphQL** para consultas complexas
- **Webhooks** para integrações externas
- **SDK TypeScript** para facilitar integrações

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Testes unitários
pnpm test:unit

# Testes de integração
pnpm test:integration

# Testes e2e
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## 📚 Documentação

- API: `http://localhost:3001/docs` (Swagger)
- Banco: `http://localhost:5555` (Prisma Studio)
- Storage: `http://localhost:9001` (MinIO Console)
- Proxy: `http://localhost:8080` (Traefik Dashboard)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

Desenvolvido para a Prefeitura Municipal de Timon - MA

---

<p align="center">
  <strong>Prefeitura Municipal de Timon - MA</strong><br>
  Transparência, Eficiência, Cidadania
</p>