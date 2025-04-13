import { Injectable, NotFoundException } from '@nestjs/common';
import { DeezerService } from '../integration/deezer.service';
import { SpotifyService } from '../integration/spotify.service';
import { TrackDto } from './dto/track.dto';

@Injectable()
export class TracksService {
  constructor(
    private readonly deezer: DeezerService,
    private readonly spotify: SpotifyService,
  ) {}

  async searchTracks(query: string): Promise<TrackDto[]> {
    const results = await this.deezer.search(query);

    return results.map(item => ({
      id: item.id,
      title: item.title,
      artist: item.artist.name,
      album: item.album?.title ?? '',
      duration: item.duration,
      coverUrl: item.album.cover_medium,
      embedUrl: item.link,
    }));
  }

  async getTrackDetails(id: string): Promise<TrackDto> {
    const item = await this.deezer.getTrack(id);
    if (!item) {
      throw new NotFoundException(`Faixa com id ${id} não encontrada`);
    }
    return {
      id: item.id,
      title: item.title,
      artist: item.artist.name,
      album: item.album.title,
      duration: item.duration,
      coverUrl: item.album.cover_medium,
      embedUrl: item.link,
    };
  }
}
