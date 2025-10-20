# 🎵 VorPlay API

Uma API em NestJS para buscar e gerenciar faixas, artistas e conteúdo de playlists usando Spotify, implementada com padrões de arquitetura orientada a serviços.

## 🗄️ Diagrama do Banco de Dados

![Diagrama UML do Banco de Dados](readme_helper/prisma-uml.png)

*Diagrama UML gerado automaticamente pelo Prisma mostrando as relações entre as entidades do sistema.*

## 📚 Informações Acadêmicas

### Disciplinas
Este projeto foi desenvolvido e utilizado em duas disciplinas:

#### 1. Computação Orientada a Serviços
- **Professor:** Tercio de Morais
- **Foco:** Implementação de padrões SOA e arquitetura orientada a serviços

#### 2. Desenvolvimento de Software para Web
- **Professor:** Alexandre de Andrade Barbosa
- **Foco:** Desenvolvimento web moderno com NestJS e integração de APIs

**Instituição:** Universidade Federal de Alagoas (UFAL) - Campus Arapiraca

### 👨‍💻 Equipe
- Caio Teixeira da Silva(Backend)
- Noemy Torres Pereira (Frontend) — [vorplay-ui](https://github.com/NoemyT/vorplay-ui)

## 🎯 Sobre

O VorPlay API é uma apliação orientada a serviços que:

- Integra-se com APIs externas (Spotify) para obtenção de dados musicais
- Oferece gerenciamento completo de usuários, playlists e interações sociais
- Implementa um sistema de feed público e estatísticas da plataforma
- Suporte para upload de fotos de perfil e gerenciamento de favoritos
- Sistema de reviews e avaliações de faixas musicais
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
┌─────────────┐     ┌────────────────┐     ┌───────────────┐       ┌─────────────┐
│  Clientes   │◀───▶│   VorPlay API  │◀───▶│   Serviços  │◀───▶│ Spotify API  │
│  (Frontend) │     │    (Gateway)   │     │   Externos    │       │             │
└─────────────┘     └────────────────┘     └───────────────┘       └─────────────┘
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
### 🛠️ Tecnologias e Bibliotecas

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

### Upload e Processamento
- **Multer**: Middleware para upload de arquivos
- **Sharp**: Processamento de imagens

### Documentação
- **Swagger/OpenAPI**: Documentação interativa
- **ReDoc**: Documentação alternativa

### Integração com APIs Externas
- **Spotify API**: Busca de músicas, artistas e álbuns

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

### ✉️ Configuração de Email

O sistema implementa recuperação de senha por email usando Gmail SMTP:

1. **Gmail App Password**: Para usar Gmail, você precisa gerar uma "Senha de App":
   - Acesse [myaccount.google.com](https://myaccount.google.com)
   - Vá em "Segurança" → "Verificação em duas etapas" → "Senhas de app"
   - Gere uma nova senha para "VorPlay API"
   - Use essa senha na variável `MAIL_PASSWORD`

2. **Template de Email**: O sistema envia emails com template HTML responsivo incluindo:
   - Logo da empresa (`media/vorp.jpg`)
   - Link de recuperação com token de 1 hora de validade
   - Design moderno e profissional

### Variáveis de Ambiente

```dotenv
# Banco de Dados
DATABASE_URL="mysql://user:pass@host:3306/dbname"

# JWT Authentication
JWT_SECRET="uma-chave-secreta-super-segura"

# Spotify Integration
SPOTIFY_CLIENT_ID="seu_client_id_do_spotify"
SPOTIFY_CLIENT_SECRET="seu_client_secret_do_spotify"
SPOTIFY_TOKEN_URL="https://accounts.spotify.com/api/token"
SPOTIFY_API_URL="https://api.spotify.com/v1"

# Email Configuration (para recuperação de senha)
MAIL_USERNAME="seu_email@gmail.com"
MAIL_PASSWORD="sua_senha_do_email_ou_app_password"

# Frontend URL (para links de recuperação)
FRONTEND_URL="http://localhost:3000"

# Uploads
UPLOADS_PATH="./uploads"  # Caminho para armazenar uploads (opcional)
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

| Método | Rota                           | Body / Params                     | Retorno               |
| ------ | ------------------------------ | --------------------------------- | --------------------- |
| GET    | `/users/me`                    | –                                 | Perfil do usuário     |
| PUT    | `/users/me`                    | `{ name?, email?, password? }`    | Perfil atualizado     |
| DELETE | `/users/me`                    | –                                 | Conta removida        |
| GET    | `/users`                       | –                                 | Lista de usuários     |
| GET    | `/users/{id}`                  | `:id`                             | Usuário por ID        |
| GET    | `/users/search`                | `?query=nome`                     | Lista de usuários     |
| PATCH  | `/users/me/profile-picture`    | `file: image`                     | URL da foto           |
| GET    | `/users/profile-picture/user/{id}` | `:id`                        | Imagem do perfil      |

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

| Método | Rota                         | Body                    | Retorno              |
| ------ | ---------------------------- | ----------------------- | -------------------- |
| GET    | `/search-history`            | –                       | Lista histórico      |
| POST   | `/search-history`            | `{ query }`             | Item adicionado      |
| DELETE | `/search-history`            | –                       | Todo histórico limpo |
| DELETE | `/search-history/{id}`       | `:id`                   | Item removido        |

### Feed

| Método | Rota           | Query                           | Retorno                |
| ------ | -------------- | ------------------------------- | ---------------------- |
| GET    | `/feed/public` | `?limit=10`                     | `PublicFeedDto[]`      |
| GET    | `/feed/stats`  | –                               | `PlatformStatsDto`     |

**Estatísticas da Plataforma (`/feed/stats`):**
- Total de usuários registrados
- Total de reviews criados
- Total de faixas favoritadas  
- Total de playlists criadas
- Número de faixas top rated (média ≥ 4)
- Número de usuários mais ativos

### Follows

> _Bearer JWT_

| Método | Rota                     | Body                        | Retorno        |
| ------ | ------------------------ | --------------------------- | -------------- |
| GET    | `/follows`               | –                           | `FollowDto[]`  |
| POST   | `/follows`               | `{ targetType, targetId }`  | `FollowDto`    |
| DELETE | `/follows/{id}`          | `:id`                       | –              |
| GET    | `/follows/user/{id}`     | `:id`                       | `FollowDto[]`  |

## 🔍 Outros Recursos

### 📷 Upload de Imagens

Sistema de upload de fotos de perfil:

- **Validação**: Apenas arquivos de imagem são aceitos
- **Processamento**: Redimensionamento automático com Sharp
- **Armazenamento**: Arquivos salvos em `./uploads/profile-pictures/`
- **Serving**: Imagens servidas estaticamente via `/uploads/`
- **Segurança**: Validação de tipos MIME e tamanho

### 📊 Feed Público

Feed em tempo real para landing page:

- **Atividades**: Reviews, favoritos e criação de playlists
- **Agregação**: Combina múltiplas fontes de dados
- **Performance**: Otimizado com queries paralelas
- **Paginação**: Limitado a 50 itens por requisição

### 🔗 Sistema de Integração Dupla

Arquitetura híbrida com dados locais e externos:

- **Cache Local**: Tracks e artistas são cachados no banco local
- **Upsert Pattern**: Atualização inteligente de dados do Spotify
- **Fallback**: Sistema de retry para APIs externas indisponíveis
- **Sincronização**: Metadados sempre atualizados do Spotify

### 📄 Paginação Cursor-Based

A API utiliza um sistema de paginação baseado em cursor para otimização de consultas:

- **cursor**: Define o ponto de início (offset) da paginação
- **limit**: Define o número máximo de itens retornados
- **nextCursor**: Presente na resposta para facilitar a paginação no cliente

### 🔒 Sistema de Recuperação de Senha

Fluxo completo de reset de senha:

- **Token Seguro**: Geração com crypto.randomBytes(32)
- **Expiração**: Tokens válidos por 1 hora
- **Email HTML**: Template profissional com logo
- **Validação**: Verificação de token e expiração
- **Limpeza**: Remoção automática de tokens após uso

---

## 📖 Documentação Adicional

### APIs Disponíveis

- **Swagger UI**: `http://localhost:3000/api/v1/docs`
- **ReDoc**: `http://localhost:3000/api/v1/redoc`
- **JSON Schema**: `http://localhost:3000/api/v1/swagger.json`

### Estrutura do Banco de Dados

O projeto usa Prisma ORM com as seguintes entidades principais:

- **User**: Usuários com autenticação e perfis
- **Track**: Faixas musicais (cache do Spotify)
- **Artist**: Artistas (cache do Spotify)
- **Review**: Avaliações de usuários (1-5 estrelas)
- **Favorite**: Sistema de favoritos
- **Playlist**: Playlists personalizadas
- **SearchHistory**: Histórico de buscas
- **Follow**: Sistema de seguir usuários/artistas

### Integração com Frontend

A API foi projetada para funcionar com aplicações frontend modernas:

- **CORS habilitado** para desenvolvimento local
- **Autenticação JWT** stateless
- **Uploads via multipart/form-data**
- **Responses padronizados** em JSON
- **Error handling** consistente