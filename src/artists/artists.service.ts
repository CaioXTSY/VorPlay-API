import { Injectable, NotFoundException } from '@nestjs/common';
import { SpotifyService }     from 'src/integration/spotify.service';
import { ArtistSummaryDto }   from './dto/artist-summary.dto';
import { ArtistInfoDto }      from './dto/artist-info.dto';
import { AlbumSummaryDto }    from './dto/album-summary.dto';
import { TrackSummaryDto }    from '../tracks/dto/track-summary.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly spotify: SpotifyService) {}

  async searchSummaries(
    query: string,
    limit  = 20,
    cursor = 0,
  ): Promise<{ items: ArtistSummaryDto[]; nextCursor?: number }> {
    const raw = await this.spotify.searchArtists(query, limit, cursor);

    const items = raw.map(item => ({
      id         : item.id,
      name       : item.name,
      externalUrl: item.external_urls.spotify,
      imageUrl   : item.images?.[0]?.url,
    }));

    const nextOffset = cursor + items.length;
    const nextCursor = items.length === limit ? nextOffset : undefined;

    return { items, nextCursor };
  }

  async getInfo(id: string): Promise<ArtistInfoDto> {
    const data = await this.spotify.getArtist(id);
    if (!data) throw new NotFoundException('Artista não encontrado.');

    return {
      id         : data.id,
      name       : data.name,
      genres     : data.genres,
      followers  : data.followers.total,
      popularity : data.popularity,
      externalUrl: data.external_urls.spotify,
      imageUrl   : data.images?.[0]?.url,
    };
  }

  async getAlbums(id: string): Promise<AlbumSummaryDto[]> {
    const albums = await this.spotify.getArtistAlbums(id);
    return albums.map(a => ({
      id          : a.id,
      title       : a.name,
      imageUrl    : a.images?.[0]?.url,
      totalTracks : a.total_tracks,
      releaseDate : a.release_date,
    }));
  }

  async getTopTracks(id: string): Promise<TrackSummaryDto[]> {
    const tracks = await this.spotify.getArtistTopTracks(id);
    return tracks.map(t => ({
      id         : t.id,
      title      : t.name,
      artistNames: t.artists.map(a => a.name),
      albumName  : t.album?.name,
      durationMs : t.duration_ms,
      href       : t.external_urls.spotify,
    }));
  }
}
