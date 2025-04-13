import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeezerService } from './deezer.service';
import { SpotifyService } from './spotify.service';

@Module({
  imports: [HttpModule],
  providers: [DeezerService, SpotifyService],
  exports: [DeezerService, SpotifyService],
})
export class IntegrationModule {}