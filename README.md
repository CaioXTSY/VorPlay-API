# 🎵 Vorplay API

Uma API em NestJS para buscar e gerenciar faixas, artistas e conteúdo de playlists usando Spotify.

## Sumário

- [Sobre](#sobre)  
- [Instalação](#instalação)  
- [Variáveis de Ambiente](#variáveis-de-ambiente)  
- [Banco de Dados](#banco-de-dados)  
- [Rodando em Dev](#rodando-em-dev)  
- [Documentação Swagger](#documentação-swagger)  
- [Endpoints](#endpoints)  
- [Paginação Cursor‑Based](#paginação-cursor-based)  
- [Interceptor de Histórico](#interceptor-de-histórico)  

---

## Sobre

Este projeto expõe vários endpoints para:  
- Pesquisar faixas e artistas (Spotify)  
- Gerenciar playlists, favoritos e reviews de usuários  
- Controlar histórico de busca e seguir artistas/usuários  

Feito em NestJS + Prisma + MySQL. Auth via JWT e validação com `class-validator`.

---

## Instalação

```bash
git clone https://github.com/CaioXTSY/vor-play.git
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
| GET    | `/auth/profile`  | (Bearer JWT)                 | `{ id, name, email }` |

### Usuários

> _Bearer JWT_

| Método | Rota          | Body / Params                     | Retorno               |
| ------ | ------------- | --------------------------------- | --------------------- |
| GET    | `/users/me`   | –                                 | Perfil do usuário    |
| PUT    | `/users/me`   | `{ name?, email?, password? }`    | Perfil atualizado     |
| DELETE | `/users/me`   | –                                 | Conta removida        |
| GET    | `/users`      | –                                 | Lista de usuários     |
| GET    | `/users/{id}` | `:id`                             | Usuário por ID        |

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

---

## Paginação Cursor‑Based

- **cursor**: offset inicial (0, 20, 40…)  
- **limit**: quantos itens retornar  
- Resposta inclui `nextCursor` ou `undefined`.

---

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