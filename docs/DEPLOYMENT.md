# Guia de Deploy – Portal Prefeitura de Timon

Este documento descreve como executar o portal em ambiente local e como publicar em produção utilizando Docker, PostgreSQL, MinIO e Traefik.

## 1. Preparação de ambiente

1. Instale Docker Engine e Docker Compose (v2).
2. Configure o arquivo `/etc/hosts` (ou equivalente) para apontar os subdomínios locais usados pelo Traefik:
   ```
   127.0.0.1 portal.localhost admin.localhost api.localhost traefik.localhost
   ```
3. Copie os arquivos `.env.example` (quando existentes) para `.env` em cada aplicação ou defina variáveis em um arquivo `.env` na raiz para uso com o Docker Compose. Um conjunto mínimo para desenvolvimento é:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@db:5432/app
   S3_ENDPOINT=http://minio:9000
   S3_ACCESS_KEY=minioadmin
   S3_SECRET_KEY=minioadmin
   S3_BUCKET=app-bucket
   S3_REGION=us-east-1
   S3_FORCE_PATH_STYLE=true
   JWT_SECRET=super-secret-jwt-key-for-development
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_CDN_BASE_URL=http://localhost:9000/app-bucket
   PORTAL_HOST=portal.localhost
   ADMIN_HOST=admin.localhost
   API_HOST=api.localhost
   TRAEFIK_HOST=traefik.localhost
   ```

## 2. Execução local com Docker

1. Instale as dependências para gerar os `node_modules` (necessário apenas na primeira execução):
   ```bash
   npm install
   ```
2. Suba a stack completa (Postgres, MinIO, Traefik, API, Portal e Admin) em modo desenvolvimento com hot reload:
   ```bash
   npm run docker:up
   ```
3. Acesse os serviços:
   - API: http://api.localhost (porta 80 via Traefik) ou http://localhost:3001
   - Portal público: http://portal.localhost ou http://localhost:3000
   - Painel admin: http://admin.localhost ou http://localhost:3100
   - Traefik Dashboard: http://traefik.localhost:8080
   - MinIO Console: http://localhost:9001 (usuário `minioadmin` / senha `minioadmin`)
4. Aplique migrations e seeds da API em um terminal separado (apenas uma vez):
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
5. Para desligar toda a stack:
   ```bash
   npm run docker:down
   ```

### Serviços e volumes criados

- `postgres_data` – volume de dados do PostgreSQL
- `minio_data` – volume para os objetos do MinIO
- `backend_node_modules`, `portal_node_modules`, `admin_node_modules` – cache dos `node_modules` em ambiente dev
- `portal_next`, `admin_next` – cache do diretório `.next` para hot reload

## 3. Execução local manual (sem Docker)

1. Inicie um PostgreSQL e um MinIO locais ou use as instâncias já fornecidas pelo Docker.
2. Crie um arquivo `.env` em `apps/backend` apontando para seu banco e MinIO.
3. Rode as migrations e seed:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
4. Suba a API, o portal e o admin em terminais distintos:
   ```bash
   npm run dev:backend
   npm run dev:portal
   npm run dev:admin
   ```

## 4. Deploy em produção

1. Configure um arquivo `.env.production` com credenciais reais:
   ```env
   DATABASE_URL=postgresql://usuario:senha@postgres:5432/app
   S3_ENDPOINT=http://minio:9000
   S3_ACCESS_KEY=chave
   S3_SECRET_KEY=segredo
   S3_BUCKET=portal-timon
   S3_REGION=us-east-1
   S3_FORCE_PATH_STYLE=true
   JWT_SECRET=uma-chave-segura
   NEXT_PUBLIC_API_BASE_URL=https://api.timon.ma.gov.br
   NEXT_PUBLIC_CDN_BASE_URL=https://cdn.timon.ma.gov.br
   PORTAL_HOST=portal.timon.ma.gov.br
   ADMIN_HOST=admin.timon.ma.gov.br
   API_HOST=api.timon.ma.gov.br
   TRAEFIK_HOST=proxy.timon.ma.gov.br
   TRAEFIK_ACME_EMAIL=infra@timon.ma.gov.br
   ```
2. Gere as imagens e suba os contêineres em modo detached usando o arquivo de override de produção:
   ```bash
   docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```
3. Verifique os logs das aplicações:
   ```bash
   docker compose logs -f backend
   docker compose logs -f portal
   docker compose logs -f admin
   ```
4. A primeira execução deve contemplar migrations e seed (apenas em ambientes novos):
   ```bash
   docker compose exec backend npm run db:migrate --workspace @timon/backend
   docker compose exec backend npm run db:seed --workspace @timon/backend
   ```
5. Garanta que as portas 80/443 do host estejam liberadas para o Traefik emitir certificados com Let’s Encrypt (TLS challenge).
6. Faça backup periódico dos volumes `postgres_data` e `minio_data` para preservação de dados.

## 5. Atualizações contínuas

1. Puxe a nova versão do código e gere as imagens novamente:
   ```bash
   git pull
   docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```
2. Aplique migrations adicionais, caso existam:
   ```bash
   docker compose exec backend npm run db:migrate --workspace @timon/backend
   ```
3. Reinicie serviços específicos, se necessário:
   ```bash
   docker compose restart backend portal admin
   ```

## 6. Usuário administrador inicial

Ao rodar `npm run db:seed`, o sistema cria um usuário administrador com as credenciais padrão abaixo (personalize via `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` antes de executar o seed):

```
E-mail: admin@timon.ma.gov.br
Senha: admin@123
```

Altere a senha imediatamente após o primeiro login no painel administrativo.
