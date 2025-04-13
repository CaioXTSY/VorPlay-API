import { Controller, Get } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  getAllTracks() {
    return { message: 'GET all tracks endpoint stub' };
  }
}
