import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';

import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { SearchHistoryModule } from './searchHistory/search-history.module';
import { FollowsModule } from './follows/follows.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SpotifyModule } from './integration/spotify.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: resolve(process.env.UPLOADS_PATH || './uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    TracksModule,
    ArtistsModule,
    ReviewsModule,
    FavoritesModule,
    PlaylistsModule,
    SearchHistoryModule,
    FollowsModule,
    AuthModule,
    PrismaModule,
    SpotifyModule,
  ],
})
export class AppModule {}
