# Buzzara Admin

## Visao Geral

O `Buzzara-Admin` e o painel administrativo e operacional da plataforma Buzzara.  
Ele e o frontend autenticado consumido por acompanhantes e administradores para:

- autenticar usuarios
- completar o perfil inicial
- gerenciar anuncios
- atualizar fotos de perfil e capa
- editar informacoes do perfil
- visualizar metricas basicas do painel

Este projeto nao acessa o banco diretamente. Toda integracao e feita pela API `Buzzara-API`, que por sua vez acessa o SQL Server no Docker.

## Stack Tecnologica

- React 18
- TypeScript
- Vite 6
- React Router
- Axios
- SCSS
- Recharts
- Lucide React

## Arquitetura do Projeto

Estrutura principal:

- `src/components`
  Componentes reutilizaveis de interface, modais e sidebar.
- `src/context`
  Contexto de autenticacao principal do painel.
- `src/hooks`
  Hooks utilitarios e estado compartilhado de autenticacao.
- `src/pages`
  Paginas principais como login, dashboard, anuncios, perfil e suporte.
- `src/services`
  Camada de integracao HTTP com a API.
- `src/types`
  Tipagens dos contratos consumidos pelo frontend.
- `src/styles`
  Estilos SCSS por pagina e componente.
- `vite.config.ts`
  Configuracao de desenvolvimento local e proxy para a API.

## Como o Projeto se Conecta com a API

Em desenvolvimento, o painel roda em:

- `http://localhost:5173`

A API roda em:

- `http://localhost:8080`

O Vite faz proxy automatico para evitar problema de CORS:

- `/api` -> `http://localhost:8080`
- `/uploads` -> `http://localhost:8080`

Com isso, o frontend usa `VITE_API_URL=/api` e continua falando com a API local.

Arquivos relevantes:

- [vite.config.ts](C:/Projects/Buzzara-Admin/vite.config.ts)
- [.env.example](C:/Projects/Buzzara-Admin/.env.example)
- [src/services/api.ts](C:/Projects/Buzzara-Admin/src/services/api.ts)

## Variaveis de Ambiente

Exemplo atual:

```env
VITE_API_URL=/api
VITE_WEB_URL=http://localhost:5174
VITE_API_IBGE_ESTADOS=https://servicodados.ibge.gov.br/api/v1/localidades/estados
```

Descricao:

- `VITE_API_URL`
  Base local da API via proxy do Vite.
- `VITE_WEB_URL`
  URL do frontend publico local, usada para abrir detalhes do anuncio.
- `VITE_API_IBGE_ESTADOS`
  Servico externo para dados de estados.

## Requisitos para Rodar Localmente

- Windows, Linux ou macOS
- Node.js 20 ou superior
- npm
- API `Buzzara-API` em execucao
- Banco SQL Server em execucao via Docker pela API

## Como Clonar e Subir o Projeto

### 1. Clonar o repositorio

```bash
git clone <URL_DO_REPOSITORIO>
cd Buzzara-Admin
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Conferir o arquivo de ambiente

Se necessario, copie:

```bash
copy .env.example .env
```

Ou crie manualmente um `.env` com:

```env
VITE_API_URL=/api
VITE_WEB_URL=http://localhost:5174
VITE_API_IBGE_ESTADOS=https://servicodados.ibge.gov.br/api/v1/localidades/estados
```

### 4. Subir a API e o banco

No projeto da API:

```bash
cd C:\Users\natan\source\repos\Buzzara-API\buzzaraApi
docker compose --env-file .env -f docker-compose.db.yml -f docker-compose.yml up -d
```

### 5. Rodar o painel admin

```bash
cd C:\Projects\Buzzara-Admin
npm run dev -- --host localhost --port 5173
```

### 6. Acessar no navegador

```text
http://localhost:5173
```

## Comandos Uteis

Rodar em desenvolvimento:

```bash
npm run dev -- --host localhost --port 5173
```

Gerar build:

```bash
npm run build
```

Rodar lint:

```bash
npm run lint
```

Preview da build:

```bash
npm run preview
```

## Fluxos Principais

### Autenticacao

- login via `/auth/login`
- validacao de sessao via `/auth/me`
- logout via `/auth/logout`
- uso de cookies HTTP-only com `withCredentials`

Arquivos principais:

- [src/context/AuthContext.tsx](C:/Projects/Buzzara-Admin/src/context/AuthContext.tsx)
- [src/services/login/login.ts](C:/Projects/Buzzara-Admin/src/services/login/login.ts)
- [src/services/login/autenticacaoUsuario.ts](C:/Projects/Buzzara-Admin/src/services/login/autenticacaoUsuario.ts)

### Perfil do Usuario

- leitura do usuario autenticado via `/usuarios/me`
- upload de foto de perfil e capa
- atualizacao de dados do perfil acompanhante
- alteracao de senha

Arquivos principais:

- [src/pages/Profile.tsx](C:/Projects/Buzzara-Admin/src/pages/Profile.tsx)
- [src/services/usuario/buscarUsuario.ts](C:/Projects/Buzzara-Admin/src/services/usuario/buscarUsuario.ts)
- [src/services/usuario/atualizarFotoDePerfil.ts](C:/Projects/Buzzara-Admin/src/services/usuario/atualizarFotoDePerfil.ts)

### Anuncios

- listagem dos anuncios do usuario
- criacao
- edicao
- remocao
- abertura do detalhe publico no `Buzzara-Web`

Arquivos principais:

- [src/pages/AnunciosPage.tsx](C:/Projects/Buzzara-Admin/src/pages/AnunciosPage.tsx)
- [src/services/anuncio/buscarAnuncio.ts](C:/Projects/Buzzara-Admin/src/services/anuncio/buscarAnuncio.ts)

### Dashboard

- metricas basicas derivadas dos anuncios do usuario
- exibicao de modal obrigatorio para concluir perfil inicial

Arquivo principal:

- [src/pages/Dashboard.tsx](C:/Projects/Buzzara-Admin/src/pages/Dashboard.tsx)

## O que Esta Mockado ou Simulado

O projeto possui partes funcionais e partes ainda simuladas.

### Mockado no painel admin

- graficos do dashboard
  Os dados de visualizacoes, origem das visitas e top cidades sao estaticos.
- contagem de anuncios ativos
  Hoje replica a quantidade total de anuncios, sem regra real de status.
- parte da experiencia de suporte
  Ainda e mais institucional do que operacional.

### Ponto importante

O painel nao possui hoje uma camada consolidada de analytics real.  
Para transformar o dashboard em algo de producao, a API precisaria expor endpoints de:

- visualizacoes por anuncio
- origem de trafego
- cidades de acesso
- conversoes por anuncio

## Pontos de Atencao para a Proxima Equipe

### Critico

- revisar todos os contratos consumidos do backend e consolidar DTOs locais
- remover logs de debug ainda presentes em paginas e services
- revisar autorizacao por papel e tela, especialmente administracao vs acompanhante
- validar todos os endpoints usados pelo painel apos futuras mudancas na API

### Importante

- criar uma camada unica de client HTTP com interceptors e tratamento padrao de erro
- centralizar normalizacao de URLs de imagens e videos
- reduzir acoplamento entre pagina e shape exato do backend
- criar tratamento global para expiracao de sessao
- adicionar estados vazios e erros mais claros em todas as telas

### Evolucao

- criar dashboard real com analytics vindos da API
- separar melhor componentes de formulario e componentes de exibicao
- adicionar testes unitarios e testes de fluxo
- adicionar controle de permissao por rota
- criar documentacao de endpoints que o admin consome

## Melhorias Recomendadas

### Tecnicas

- adicionar testes com Vitest e React Testing Library
- adicionar padronizacao de erro de API
- adicionar tipagem central por modulo de dominio
- revisar bundle size do projeto

### Produto

- criar indicadores reais de status do anuncio
- exibir historico financeiro real quando o backend suportar
- integrar suporte com backend ou canal oficial rastreavel

## Validacao Realizada

No estado atual documentado:

- o projeto compila com `npm run build`
- o projeto roda em `http://localhost:5173`
- o projeto usa proxy local para falar com a API Docker

## Ordem Recomendada para Subir o Ambiente Completo

1. Subir banco e API via Docker no projeto `Buzzara-API`
2. Subir `Buzzara-Admin`
3. Subir `Buzzara-Web`
4. Testar login no admin com:

```text
admin@buzzara.com.br
123456
```

## Arquivos Mais Importantes para Continuidade

- [src/context/AuthContext.tsx](C:/Projects/Buzzara-Admin/src/context/AuthContext.tsx)
- [src/pages/Dashboard.tsx](C:/Projects/Buzzara-Admin/src/pages/Dashboard.tsx)
- [src/pages/AnunciosPage.tsx](C:/Projects/Buzzara-Admin/src/pages/AnunciosPage.tsx)
- [src/pages/Profile.tsx](C:/Projects/Buzzara-Admin/src/pages/Profile.tsx)
- [src/services/api.ts](C:/Projects/Buzzara-Admin/src/services/api.ts)
- [vite.config.ts](C:/Projects/Buzzara-Admin/vite.config.ts)

## Observacao Final

Este painel foi ajustado para ambiente local de desenvolvimento e hoje depende da API local como fonte unica de dados.  
Ele nao deve ser conectado diretamente ao banco. Toda regra de negocio e persistencia deve continuar centralizada na `Buzzara-API`.
