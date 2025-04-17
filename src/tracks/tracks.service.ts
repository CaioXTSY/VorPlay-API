import { Injectable, NotFoundException } from '@nestjs/common';
import { SpotifyService }   from 'src/integration/spotify.service';
import { TrackSummaryDto }  from './dto/track-summary.dto';
import { TrackDetailDto }   from './dto/track-detail.dto';
import { AlbumTrackDto }    from './dto/album-track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly spotify: SpotifyService) {}

  /**
   * Busca faixas com paginação cursor‑based numérico.
   * @param query termo de pesquisa
   * @param limit número de itens a retornar
   * @param cursor offset inicial para busca
   */
  async searchSummaries(
    query: string,
    limit  = 20,
    cursor = 0,
  ): Promise<{ items: TrackSummaryDto[]; nextCursor?: number }> {
    const raw = await this.spotify.searchTracks(query, limit, cursor);

    const items = raw.map(item => ({
      id         : item.id,
      title      : item.name,
      artistNames: item.artists.map(a => a.name),
      albumName  : item.album?.name,
      durationMs : item.duration_ms,
      href       : item.external_urls.spotify,
    }));

    const nextOffset = cursor + items.length;
    const nextCursor = items.length === limit ? nextOffset : undefined;

    return { items, nextCursor };
  }

  async detail(id: string): Promise<TrackDetailDto> {
    const item = await this.spotify.getTrack(id);
    if (!item) throw new NotFoundException('Faixa não encontrada.');

    return {
      id         : item.id,
      title      : item.name,
      artistNames: item.artists.map(a => a.name),
      albumName  : item.album?.name,
      durationMs : item.duration_ms,
      previewUrl : item.preview_url,
      popularity : item.popularity,
      imageUrl   : item.album?.images?.[0]?.url,
      href       : item.external_urls.spotify,
    };
  }

  async getAlbumTracks(albumId: string): Promise<AlbumTrackDto[]> {
    const tracks = await this.spotify.getAlbumTracks(albumId);
    return tracks.map(t => ({
      id         : t.id,
      title      : t.name,
      durationMs : t.duration_ms,
      trackNumber: t.track_number,
    }));
  }
}
