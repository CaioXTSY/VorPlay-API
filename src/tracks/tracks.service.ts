import { Injectable, NotFoundException } from '@nestjs/common';
import { SpotifyService } from 'src/integration/spotify.service';
import { TrackSummaryDto } from './dto/track-summary.dto';
import { TrackDetailDto } from './dto/track-detail.dto';
import { AlbumTrackDto } from './dto/album-track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly spotify: SpotifyService) {}

  async searchSummaries(query: string): Promise<TrackSummaryDto[]> {
    const items = await this.spotify.searchTracks(query);
    return items.map(item => ({
      id: item.id,
      title: item.name,
      artistNames: item.artists.map(a => a.name),
      albumName: item.album.name,
      durationMs: item.duration_ms,
      href: item.href,
    }));
  }

  async findDetail(id: string): Promise<TrackDetailDto> {
    let item: any;
    try {
      item = await this.spotify.getTrack(id);
    } catch {
      throw new NotFoundException(`Faixa ${id} não encontrada.`);
    }
    const genresArrays = await Promise.all(
      item.artists.map(a => this.spotify.getArtist(a.id).then(d => d.genres || [])),
    );
    const genres = Array.from(new Set(genresArrays.flat()));
    return {
      id: item.id,
      title: item.name,
      artists: item.artists.map(a => ({
        id: a.id,
        name: a.name,
        externalUrl: a.external_urls.spotify,
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
      },
      durationMs: item.duration_ms,
      popularity: item.popularity,
      genres,
      embed: `https://open.spotify.com/embed/track/${item.id}`,
      href: item.href,
    };
  }

  /** Novo: faixas de um álbum com detalhes de álbum e artistas */
  async findByAlbum(albumId: string): Promise<AlbumTrackDto[]> {
    // busca metadados do álbum
    let album: any;
    try {
      album = await this.spotify.getAlbum(albumId);
    } catch {
      throw new NotFoundException(`Álbum ${albumId} não encontrado.`);
    }

    // busca faixas
    const items = await this.spotify.getAlbumTracks(albumId);

    return items.map(track => ({
      id: track.id,
      title: track.name,
      trackNumber: track.track_number,
      durationMs: track.duration_ms,
      artists: track.artists.map(a => ({
        id: a.id,
        name: a.name,
        externalUrl: a.external_urls.spotify,
      })),
      album: {
        id: album.id,
        name: album.name,
        coverUrl: album.images[0]?.url,
        releaseDate: album.release_date,
      },
    }));
  }
}
