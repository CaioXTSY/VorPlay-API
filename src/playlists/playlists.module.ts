import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { IntegrationModule } from 'src/integration/integration.module'; // ⬅️

@Module({
  imports: [PrismaModule, IntegrationModule],   // ⬅️  agora o módulo vê o SpotifyService
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
