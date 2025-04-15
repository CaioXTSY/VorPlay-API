import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SpotifyService } from 'src/integration/spotify.service';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [SpotifyService, ArtistsService],
  controllers: [ArtistsController],
})
export class ArtistsModule {}
