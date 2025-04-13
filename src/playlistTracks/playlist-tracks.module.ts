import { Module } from '@nestjs/common';
import { PlaylistTracksController } from './playlist-tracks.controller';
import { PlaylistTracksService } from './playlist-tracks.service';

@Module({
  controllers: [PlaylistTracksController],
  providers: [PlaylistTracksService],
})
export class PlaylistTracksModule {}
