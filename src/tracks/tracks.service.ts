import { Injectable, NotFoundException } from '@nestjs/common';
import { TrackDto } from './dto/track.dto';
import { SpotifyService } from 'src/integration/spotify.service';

@Injectable()
export class TracksService {
  constructor(private readonly spotify: SpotifyService) {}

  async searchTracks(query: string): Promise<TrackDto[]> {
    const items = await this.spotify.searchTracks(query);

    return items.map(item => {
      const embed = `https://open.spotify.com/embed/track/${item.id}`;

      return {
        id: item.id,
        title: item.name,
        artists: item.artists.map(artist => ({
          id: artist.id,
          name: artist.name,
          externalUrl: artist.external_urls.spotify,
          href: artist.href,
        })),
        album: {
          id: item.album.id,
          name: item.album.name,
          releaseDate: item.album.release_date,
          totalTracks: item.album.total_tracks,
          images: item.album.images.map(img => ({
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
        embed,
        href: item.href,
        genres: [],  // mantido vazio para não impactar performance
      };
    });
  }

  async getTrackDetails(id: string): Promise<TrackDto> {
    let item: any;
    try {
      item = await this.spotify.getTrack(id);
    } catch {
      throw new NotFoundException(`Faixa com id ${id} não encontrada`);
    }

    // agrega gêneros dos artistas
    const genresArrays = await Promise.all(
      item.artists.map(async artist => {
        const detail = await this.spotify.getArtist(artist.id);
        return detail.genres || [];
      }),
    );
    const genres = Array.from(new Set(genresArrays.flat()));
    const embed = `https://open.spotify.com/embed/track/${item.id}`;

    return {
      id: item.id,
      title: item.name,
      artists: item.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        externalUrl: artist.external_urls.spotify,
        href: artist.href,
      })),
      album: {
        id: item.album.id,
        name: item.album.name,
        releaseDate: item.album.release_date,
        totalTracks: item.album.total_tracks,
        images: item.album.images.map(img => ({
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
      embed,
      href: item.href,
      genres,
    };
  }
}
