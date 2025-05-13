# 🎵 Vorplay API

Uma API em NestJS para buscar e gerenciar faixas, artistas e conteúdo de playlists usando Spotify, implementada com padrões de arquitetura orientada a serviços.


## 📚 Informações Acadêmicas

### Disciplina
- **Nome:** Computação Orientada a Serviços
- **Professor:** Tercio de Morais
- **Instituição:** Universidade Federal de Alagoas (UFAL) - Campus Arapiraca

### 👨‍💻 Equipe
- Caio Teixeira da Silva
- Gustavo Henrique dos Santos Malaquias

---
## Sumário

- [Visão Geral](#-sobre)
- [Princípios SOA Implementados](#-padrões-de-arquitetura-aplicados)
- [Padrões de Arquitetura](#-padrões-de-arquitetura-aplicados)
- [Tecnologias e Frameworks](#-tecnologias-e-bibliotecas)
- [Configuração e Instalação](#instalação)
  - [Banco de Dados](#banco-de-dados)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Rodando em Dev](#rodando-em-dev)
- [Documentação da API](#documentação-swagger)
  - [Endpoints](#endpoints)
- [Recursos Avançados](#-recursos-avançados)
  - [Paginação Cursor-Based](#paginação-cursor-based)
  - [Interceptor de Histórico](#interceptor-de-histórico)

---

## 🎯 Sobre

O VorPlay API é um sistema orientado a serviços que:

- Integra-se com a API do Spotify para obtenção de dados musicais
- Oferece gerenciamento completo de usuários, playlists e interações sociais
- Implementa padrões arquiteturais SOA para desacoplamento e reusabilidade
- Fornece endpoints RESTful para interações cliente-servidor

---

## 🔄 Princípios SOA Implementados

### Abstração
- Encapsulamento das complexidades de comunicação com APIs externas
- Exposição de interfaces simplificadas para os consumidores

### Autonomia
- Serviços independentes que podem ser modificados sem afetar outros componentes
- Cada módulo (users, tracks, artists, etc.) gerencia seu próprio domínio

### Contrato de Serviço
- DTOs bem definidos para entrada e saída de dados
- Validação de entrada usando class-validator
- Documentação via Swagger/OpenAPI

### Descoberta de Serviço
- Metadados de API expostos via Swagger
- Versionamento de API (/api/v1)

### Composição
- Combinação de múltiplos serviços para criar funcionalidades complexas
- Exemplo: Reviews combinam dados do Spotify com avaliações de usuários

### Reusabilidade
- Módulos compartilhados (PrismaService, SpotifyService)
- Interceptores e filtros aplicáveis em toda a aplicação

---

## 🏗️ Padrões de Arquitetura Aplicados

### 🔄 Proxy/Adapter
O sistema implementa o padrão Proxy/Adapter para intermediar e adaptar comunicações externas:

- **Spotify Integration Service**:
  - Encapsula complexidades da API do Spotify
  - Gerencia autenticação e renovação de tokens
  - Adapta respostas para DTOs internos padronizados
  - Exemplo: `spotify.service.ts`

- **Auth Proxy**:
  - Intermediação segura de autenticação
  - Adaptação de tokens JWT para o fluxo interno
  - Exemplo: `jwt.strategy.ts`

### 🔄 Aggregator
O padrão Aggregator combina dados de diferentes fontes para criar uma resposta unificada:

- **Reviews + Tracks**:
  - Combina metadados de faixas do Spotify com avaliações do banco local
  - Implementação em `reviews.service.ts`

- **User Follows**:
  - Agrega dados de usuários internos com artistas externos
  - Implementação em `follows.service.ts`

### 🔄 API Gateway
O sistema atua como um gateway simplificado:

- Encaminha solicitações para serviços apropriados
- Normaliza respostas para um formato consistente
- Implementa autenticação e autorização centralizadas
- Exemplo: Controladores no padrão NestJS (`*.controller.ts`)
---

## 🏛️ Arquitetura do Sistema

O VorPlay API implementa uma arquitetura orientada a serviços que atua como gateway entre clientes e serviços externos:

```
┌─────────────┐     ┌────────────────┐     ┌───────────────┐     ┌─────────────┐
│  Clientes   │◀───▶│   VorPlay API  │◀───▶│   Serviços    │◀───▶│ Spotify API │
│  (Frontend) │     │    (Gateway)   │     │   Externos    │     │             │
└─────────────┘     └────────────────┘     └───────────────┘     └─────────────┘
                            ▲
                            │
                            ▼
                     ┌──────────────┐
                     │  Banco de    │
                     │   Dados      │
                     └──────────────┘
```

- **Clientes**: Aplicações frontend que consomem a API
- **VorPlay API**: Gateway central que gerencia autenticação, roteamento e integração
- **Banco de Dados**: Armazena dados de usuários, playlists, avaliações e histórico
- **Serviços Externos**: Integrações com APIs externas, principalmente o Spotify
## 🛠️ Tecnologias e Bibliotecas

### Core
- **NestJS**: Framework backend com arquitetura modular
- **TypeScript**: Tipagem estática para JavaScript
- **Prisma**: ORM para manipulação de banco de dados
- **MySQL**: Sistema de gerenciamento de banco de dados

### Autenticação e Segurança
- **Passport**: Middleware de autenticação
- **JWT**: Tokens para autenticação stateless
- **bcrypt**: Hashing de senhas

### Integração e Validação
- **Axios**: Cliente HTTP para integrações
- **class-validator**: Validação de DTOs
- **class-transformer**: Transformação de objetos

### Documentação
- **Swagger/OpenAPI**: Documentação interativa
- **ReDoc**: Documentação alternativa

---


## Instalação

```bash
git clone https://github.com/CaioXTSY/VorPlay-API.git
cd vor-play
npm install
```

### Banco de Dados

1. Configure `DATABASE_URL` (MySQL) no `.env`.  
2. Rode:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Variáveis de Ambiente

```dotenv
DATABASE_URL="mysql://user:pass@host:3306/dbname"
JWT_SECRET="uma-chave-secreta"
SPOTIFY_CLIENT_ID="..."
SPOTIFY_CLIENT_SECRET="..."
SPOTIFY_TOKEN_URL="https://accounts.spotify.com/api/token"
SPOTIFY_API_URL="https://api.spotify.com/v1"
```

---

## Rodando em Dev

```bash
npm run start:dev
```

Servidor em `http://localhost:3000`.

---

## Documentação Swagger

Acesse `http://localhost:3000/api`.

---

## Endpoints

### Autenticação

| Método | Rota             | Body                         | Retorno               |
| ------ | ---------------- | ---------------------------- | --------------------- |
| POST   | `/auth/register` | `{ name, email, password }`  | `{ access_token, expires_in, user }` |
| POST   | `/auth/login`    | `{ email, password }`        | `{ access_token, expires_in, user }` |
| POST   | `/auth/validate` | (Bearer JWT)                 | `{ access_token, expires_in, user }` |

### Usuários

> _Bearer JWT_

| Método | Rota          | Body / Params                     | Retorno               |
| ------ | ------------- | --------------------------------- | --------------------- |
| GET    | `/users/me`   | –                                 | Perfil do usuário    |
| PUT    | `/users/me`   | `{ name?, email?, password? }`    | Perfil atualizado     |
| DELETE | `/users/me`   | –                                 | Conta removida        |
| GET    | `/users`      | –                                 | Lista de usuários     |
| GET    | `/users/{id}` | `:id`                             | Usuário por ID        |
| GET    | `/users/search`| `nome,email`                      | Lista de usuários |

### Faixas

| Método | Rota                             | Query                                  | Retorno                                    |
| ------ | -------------------------------- | -------------------------------------- | ------------------------------------------ |
| GET    | `/tracks/search`                 | `?query=texto&cursor=0&limit=20`       | `{ items: TrackSummaryDto[], nextCursor }` |
| GET    | `/tracks/{id}`                   | `:id`                                  | `TrackDetailDto`                           |
| GET    | `/tracks/{albumId}/tracks`       | `:albumId`                             | `AlbumTrackDto[]`                          |

### Artistas

| Método | Rota                             | Query                                  | Retorno                                    |
| ------ | -------------------------------- | -------------------------------------- | ------------------------------------------ |
| GET    | `/artists/search`                | `?query=texto&cursor=0&limit=20`       | `{ items: ArtistSummaryDto[], nextCursor }` |
| GET    | `/artists/{id}`                  | `:id`                                  | `ArtistInfoDto`                            |
| GET    | `/artists/{id}/albums`           | `:id`                                  | `AlbumSummaryDto[]`                        |
| GET    | `/artists/{id}/top-tracks`       | `:id`                                  | `TrackSummaryDto[]`                        |
| GET    | `/artists/{id}/tracks`           | `?cursor=0&limit=20`                   | `ArtistTrackCursorPageDto`                 |

### Playlists

> _Bearer JWT_

| Método | Rota                                       | Body / Params                                | Retorno         |
| ------ | ------------------------------------------ | -------------------------------------------- | --------------- |
| GET    | `/playlists`                               | –                                            | `PlaylistDto[]` |
| POST   | `/playlists`                               | `{ name, description? }`                     | `PlaylistDto`   |
| GET    | `/playlists/{id}`                          | `:id`                                        | `PlaylistDto`   |
| PUT    | `/playlists/{id}`                          | `{ name?, description? }`                    | `PlaylistDto`   |
| DELETE | `/playlists/{id}`                          | `:id`                                        | –               |
| POST   | `/playlists/{id}/tracks`                   | `{ externalId, externalProvider, position? }`| `PlaylistDto`   |
| DELETE | `/playlists/{playlistId}/tracks/{trackId}` | `:playlistId`, `:trackId`                    | –               |

### Favoritos

> _Bearer JWT_

| Método | Rota                           | Body                                 | Retorno          |
| ------ | ------------------------------ | ------------------------------------ | ---------------- |
| GET    | `/favorites`                   | –                                    | `FavoriteDto[]`  |
| POST   | `/favorites`                   | `{ externalId, externalProvider }`   | `FavoriteDto`    |
| DELETE | `/favorites/{trackId}`         | `:trackId`                           | –                |
| GET    | `/favorites/user/{userId}`     | `:userId`                            | `FavoriteDto[]`  |

### Reviews

> _Bearer JWT_

| Método | Rota                          | Body                                 | Retorno          |
| ------ | ----------------------------- | ------------------------------------ | ---------------- |
| POST   | `/reviews`                    | `{ trackId, rating, comment? }`      | `ReviewDto`      |
| GET    | `/reviews`                    | –                                    | `ReviewDto[]`    |
| DELETE | `/reviews/{reviewId}`         | `:reviewId`                          | –                |
| GET    | `/reviews/user/{userId}`      | `:userId`                            | `ReviewDto[]`    |
| GET    | `/reviews/track/{externalId}` | `:externalId`                        | `ReviewDto[]`    |

### Search History

> _Bearer JWT_

| Método | Rota                         | Descrição                     |
| ------ | ---------------------------- | ----------------------------- |
| GET    | `/search-history`            | Lista histórico do usuário    |
| DELETE | `/search-history`            | Limpa todo histórico          |
| DELETE | `/search-history/{id}`       | Remove item específico        |

### Follows

> _Bearer JWT_

| Método | Rota                     | Body                        | Retorno        |
| ------ | ------------------------ | --------------------------- | -------------- |
| GET    | `/follows`               | –                           | `FollowDto[]`  |
| POST   | `/follows`               | `{ targetType, targetId }`  | `FollowDto`    |
| DELETE | `/follows/{id}`          | `:id`                       | –              |
| GET    | `/follows/user/{userId}` | `:userId`                   | `FollowDto[]`  |

## 🔍 Recursos Avançados

### Paginação Cursor-Based

A API utiliza um sistema de paginação baseado em cursor para otimização de consultas:

- **cursor**: Define o ponto de início (offset) da paginação
- **limit**: Define o número máximo de itens retornados
- **nextCursor**: Presente na resposta para facilitar a paginação no cliente

### Interceptores e Middleware

O sistema implementa diversos interceptores para aspectos transversais:

- **Search History**: Registra automaticamente buscas realizadas pelos usuários
- **Error Handling**: Tratamento padronizado de erros
- **Authentication**: Middleware para validação de tokens JWT

## Interceptor de Histórico

O interceptor registra cada busca de faixas e artistas:

```ts
// src/common/interceptors/search-history.interceptor.ts
intercept(ctx, next) {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  const query = req.query.query;
  return next.handle().pipe(
    tap(() => {
      if (user && query) {
        this.historyService.logSearch(user.id, query);
      }
    }),
  );
}
```

Aplicado globalmente em `main.ts`:

```ts
app.useGlobalInterceptors(
  new SearchHistoryInterceptor(app.get(SearchHistoryService)),
);
```