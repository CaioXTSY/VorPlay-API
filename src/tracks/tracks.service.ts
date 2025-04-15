import { Injectable, NotFoundException } from '@nestjs/common';
import { SpotifyService } from '../integration/spotify.service';
import { TrackDto } from './dto/track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly spotify: SpotifyService) {}

  async searchTracks(query: string): Promise<TrackDto[]> {
    const results = await this.spotify.search(query);

    return results.map((item: any) => {
      // Gerando somente o link embed
      const embed = `https://open.spotify.com/embed/track/${item.id}`;

      return {
        id: item.id,
        title: item.name,
        artists: item.artists.map((artist: any) => ({
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
          images: item.album.images.map((img: any) => ({
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
        embed, // retorna somente o link embed
        href: item.href,
        genres: [] // Aqui não agregamos os gêneros para não impactar a performance da busca.
      };
    });
  }

  async getTrackDetails(id: string): Promise<TrackDto> {
    const item = await this.spotify.getTrack(id);
    if (!item) {
      throw new NotFoundException(`Faixa com id ${id} não encontrada`);
    }

    // Agrega os gêneros dos artistas:
    const genresArrays = await Promise.all(
      item.artists.map(async (artist: any) => {
        const artistDetail = await this.spotify.getArtist(artist.id);
        return artistDetail.genres || [];
      })
    );
    const genres = Array.from(new Set(genresArrays.flat()));

    // Gera o link embed a partir do id:
    const embed = `https://open.spotify.com/embed/track/${item.id}`;

    return {
      id: item.id,
      title: item.name,
      artists: item.artists.map((artist: any) => ({
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
        images: item.album.images.map((img: any) => ({
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
      embed, // retorna somente o link embed
      href: item.href,
      genres, // gêneros consolidados dos artistas
    };
  }
}