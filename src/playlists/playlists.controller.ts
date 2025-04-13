import { Controller, Get } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('playlists')
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  getAllPlaylists() {
    return { message: 'GET all playlists endpoint stub' };
  }
}
