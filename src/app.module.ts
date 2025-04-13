import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { PlaylistTracksModule } from './playlistTracks/playlist-tracks.module';
import { SearchHistoryModule } from './searchHistory/search-history.module';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [
    UsersModule,
    TracksModule,
    ArtistsModule,
    ReviewsModule,
    FavoritesModule,
    PlaylistsModule,
    PlaylistTracksModule,
    SearchHistoryModule,
    FollowsModule,
  ],
})
export class AppModule {}
