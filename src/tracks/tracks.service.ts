// src/tracks/tracks.service.ts
import { Injectable } from '@nestjs/common';
import { DeezerService } from '../integration/deezer.service';
import { SpotifyService } from '../integration/spotify.service';

@Injectable()
export class TracksService {
  constructor(
    private deezer: DeezerService,
    private spotify: SpotifyService,
  ) {}

  async searchTracks(query: string) {
    const results = await this.deezer.search(query);
    return results.map(item => ({
      id: item.id,
      title: item.title,
      artist: item.artist.name,
      coverUrl: item.album.cover_medium,
      embedUrl: item.link,
    }));
  }

  async getTrackDetails(id: string) {
    const item = await this.deezer.getTrack(id);
    return {
      id: item.id,
      title: item.title,
      artist: item.artist.name,
      album: item.album.title,
      coverUrl: item.album.cover_medium,
      duration: item.duration,
      embedUrl: item.link,
    };
  }
}
