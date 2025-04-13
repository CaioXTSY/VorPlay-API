import { Controller, Get } from '@nestjs/common';
import { PlaylistTracksService } from './playlist-tracks.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('playlist-tracks')
@Controller('playlist-tracks')
export class PlaylistTracksController {
  constructor(private readonly playlistTracksService: PlaylistTracksService) {}

  @Get()
  getAllPlaylistTracks() {
    return { message: 'GET all playlist-tracks endpoint stub' };
  }
}
