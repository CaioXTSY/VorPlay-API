import { Injectable, NotFoundException } from '@nestjs/common';
import { SpotifyService } from 'src/integration/spotify.service';
import { ArtistSummaryDto } from './dto/artist-summary.dto';
import { ArtistInfoDto } from './dto/artist-info.dto';
import { AlbumSummaryDto } from './dto/album-summary.dto';
import { TrackSummaryDto } from 'src/tracks/dto/track-summary.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly spotify: SpotifyService) {}

  /**
   * Busca artistas pelo termo e retorna lista resumida.
   */
  async searchSummaries(query: string, limit = 10): Promise<ArtistSummaryDto[]> {
    const items = await this.spotify.searchArtists(query, limit);
    return items.map(item => ({
      id: item.id,
      name: item.name,
      externalUrl: item.external_urls.spotify,
      imageUrl: item.images?.[0]?.url,
    }));
  }

  /**
   * Retorna informações básicas de um artista, incluindo imagens e último release.
   */
  async findDetail(id: string): Promise<ArtistInfoDto> {
    let artist: any;
    try {
      artist = await this.spotify.getArtist(id);
    } catch {
      throw new NotFoundException(`Artista ${id} não encontrado.`);
    }

    // pega apenas o release mais recente
    const [latest] = await this.spotify.getArtistAlbums(id, 1);
    const lastRelease: AlbumSummaryDto | undefined = latest
      ? {
          id: latest.id,
          name: latest.name,
          releaseDate: latest.release_date,
          totalTracks: latest.total_tracks,
          images: latest.images.map(img => ({
            url: img.url,
            width: img.width,
            height: img.height,
          })),
        }
      : undefined;

    return {
      id: artist.id,
      name: artist.name,
      genres: artist.genres,
      followers: artist.followers.total,
      popularity: artist.popularity,
      externalUrl: artist.external_urls.spotify,
      images: artist.images.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
      })),
      lastRelease,
    };
  }

  /**
   * Retorna os álbuns de um artista.
   */
  async getAlbums(id: string): Promise<AlbumSummaryDto[]> {
    const items = await this.spotify.getArtistAlbums(id);
    return items.map(album => ({
      id: album.id,
      name: album.name,
      releaseDate: album.release_date,
      totalTracks: album.total_tracks,
      images: album.images.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
      })),
    }));
  }

  /**
   * Retorna as top‑tracks de um artista.
   */
  async getTopTracks(id: string): Promise<TrackSummaryDto[]> {
    const items = await this.spotify.getArtistTopTracks(id);
    return items.map(track => ({
      id: track.id,
      title: track.name,
      artistNames: track.artists.map(a => a.name),
      albumName: track.album.name,
      durationMs: track.duration_ms,
      href: track.href,
    }));
  }
}