# Limpeza do Projeto - Prefeitura de Timon

## Arquivos para Remover (Redundantes/Antigos)

### 1. Arquivos de Configuração Antigos na Raiz
- [ ] `/App.tsx` - Código legado, substituído por apps/web
- [ ] `/temp-fix.js` - Script temporário não necessário
- [ ] `/components/temp-delete.md` - Arquivo temporário

### 2. Apps Redundantes/Incompletos
- [ ] `/apps/frontend/` - Redundante, já temos apps/web (Next.js)
- [ ] `/apps/cms/` - Redundante, CMS está em components/admin

### 3. Componentes Duplicados
- [ ] `/components/SymbolsPage-fixed.tsx` - Manter apenas SymbolsPage.tsx
- [ ] Verificar duplicações em `/components/admin/` vs `/apps/cms/`

### 4. Arquivos Dockerfile Mal Nomeados
- [ ] `/apps/api/Dockerfile/Code-component-*.tsx` - Já corrigido
- [ ] `/apps/web/Dockerfile/Code-component-*.tsx` - Já corrigido

### 5. Estruturas Redundantes
- [ ] docker-compose.yml duplicado em `/infra/`
- [ ] Configurações duplicadas entre apps

### 6. Hooks e Contextos Não Utilizados
- [ ] Verificar hooks em `/hooks/` se estão sendo usados
- [ ] Verificar contextos em `/components/` se estão ativos

## Consolidação Necessária

### 1. Estrutura Final do Monorepo
```
/
├── apps/
│   ├── web/          # Frontend Next.js (principal)
│   └── api/          # Backend NestJS
├── packages/         # Shared code
├── components/       # Shared UI components (temporário, migrar para apps/web)
├── styles/          # Global styles (mover para apps/web)
└── infra/           # Docker, configs
```

### 2. Migração de Componentes
- Mover `/components/` para `/apps/web/components/`
- Mover `/styles/` para `/apps/web/styles/`
- Mover `/utils/` para `/packages/shared/`

### 3. Limpeza de Dependências
- Remover dependências não utilizadas
- Consolidar versões entre packages
- Atualizar imports após reorganização