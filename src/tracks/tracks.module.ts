import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [
    IntegrationModule,   // ← aqui
  ],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
