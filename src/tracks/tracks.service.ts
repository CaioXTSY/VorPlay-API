import { Injectable, NotFoundException } from '@nestjs/common';
import { SpotifyService } from '../integration/spotify.service';
import { TrackDto } from './dto/track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly spotify: SpotifyService) {}

  async searchTracks(query: string): Promise<TrackDto[]> {
    const results = await this.spotify.search(query);

    return results.map((item) => ({
      id: item.id,
      title: item.name,
      artists: item.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        externalUrl: artist.external_urls?.spotify,
        href: artist.href,
      })),
      album: {
        id: item.album.id,
        name: item.album.name,
        releaseDate: item.album.release_date,
        totalTracks: item.album.total_tracks,
        images: item.album.images.map((img) => ({
          url: img.url,
          width: img.width,
          height: img.height,
        })),
        href: item.album.href,
      },
      durationMs: item.duration_ms,
      explicit: item.explicit,
      popularity: item.popularity,
      previewUrl: item.preview_url,
      embedUrl: item.external_urls?.spotify,
      href: item.href,
    }));
  }

  async getTrackDetails(id: string): Promise<TrackDto> {
    const item = await this.spotify.getTrack(id);
    if (!item) {
      throw new NotFoundException(`Faixa com id ${id} não encontrada`);
    }
    return {
      id: item.id,
      title: item.name,
      artists: item.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        externalUrl: artist.external_urls?.spotify,
        href: artist.href,
      })),
      album: {
        id: item.album.id,
        name: item.album.name,
        releaseDate: item.album.release_date,
        totalTracks: item.album.total_tracks,
        images: item.album.images.map((img) => ({
          url: img.url,
          width: img.width,
          height: img.height,
        })),
        href: item.album.href,
      },
      durationMs: item.duration_ms,
      explicit: item.explicit,
      popularity: item.popularity,
      previewUrl: item.preview_url,
      embedUrl: item.external_urls?.spotify,
      href: item.href,
    };
  }
}