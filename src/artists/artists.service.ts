import { Injectable, NotFoundException, BadGatewayException } from '@nestjs/common';
import { SpotifyService } from 'src/integration/spotify.service';
import { ArtistSummaryDto } from './dto/artist-summary.dto';
import { ArtistInfoDto } from './dto/artist-info.dto';
import { AlbumSummaryDto } from './dto/album-summary.dto';
import { TrackSummaryDto } from '../tracks/dto/track-summary.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly spotify: SpotifyService) {}

  async searchSummaries(
    query: string,
    limit = 20,
    cursor = 0,
  ): Promise<{ items: ArtistSummaryDto[]; nextCursor?: number }> {
    try {
      console.log(`[Artists] Buscando artistas com query: "${query}", limit: ${limit}, cursor: ${cursor}`);
      const raw = await this.spotify.searchArtists(query, limit, cursor);
      const items = raw.map(item => ({
        id: item.id,
        name: item.name,
        externalUrl: item.external_urls.spotify,
        imageUrl: item.images?.[0]?.url,
      }));
      const nextOffset = cursor + items.length;
      const nextCursor = items.length === limit ? nextOffset : undefined;
      console.log(`[Artists] Encontrados ${items.length} artistas`);
      return { items, nextCursor };
    } catch (error) {
      console.error('[Artists] Erro ao buscar artistas:', error.message);
      if (error.response) {
        console.error(`[Artists] Status: ${error.response?.status}, Data:`, error.response?.data);
      }
      throw new BadGatewayException('Erro ao buscar artistas');
    }
  }

  async getInfo(id: string): Promise<ArtistInfoDto> {
    try {
      console.log(`[Artists] Buscando informações do artista com ID: ${id}`);
      const data = await this.spotify.getArtist(id);
      if (!data) throw new NotFoundException('Artista não encontrado.');
      console.log(`[Artists] Informações do artista ${data.name} encontradas`);
      return {
        id: data.id,
        name: data.name,
        genres: data.genres,
        followers: data.followers.total,
        popularity: data.popularity,
        externalUrl: data.external_urls.spotify,
        imageUrl: data.images?.[0]?.url,
      };
    } catch (error) {
      console.error(`[Artists] Erro ao buscar informações do artista ${id}:`, error.message);
      if (error.response) {
        console.error(`[Artists] Status: ${error.response?.status}, Data:`, error.response?.data);
      }
      if (error instanceof NotFoundException) throw error;
      throw new BadGatewayException('Erro ao buscar informações do artista');
    }
  }

  async getAlbums(id: string): Promise<AlbumSummaryDto[]> {
    try {
      const albums = await this.spotify.getArtistAlbums(id);
      return albums.map(a => ({
        id: a.id,
        title: a.name,
        imageUrl: a.images?.[0]?.url,
        totalTracks: a.total_tracks,
        releaseDate: a.release_date,
      }));
    } catch {
      throw new BadGatewayException('Erro ao buscar álbuns do artista');
    }
  }

  async getTopTracks(id: string): Promise<TrackSummaryDto[]> {
    try {
      const tracks = await this.spotify.getArtistTopTracks(id);
      return tracks.map(t => ({
        id: t.id,
        title: t.name,
        artistNames: t.artists.map(a => a.name),
        albumName: t.album?.name,
        durationMs: t.duration_ms,
        imageUrl: t.album?.images?.[0]?.url,
        images: t.album?.images?.map(img => ({
          url: img.url,
          width: img.width,
          height: img.height,
        })),
        href: t.external_urls.spotify,
      }));
    } catch {
      throw new BadGatewayException('Erro ao buscar top tracks do artista');
    }
  }

  async searchArtistTracks(
    id: string,
    limit = 20,
    cursor = 0,
  ): Promise<{ items: TrackSummaryDto[]; nextCursor?: number }> {
    try {
      await this.getInfo(id);
      const all = await this.getTopTracks(id);
      const slice = all.slice(cursor, cursor + limit);
      const next = cursor + slice.length;
      const nextCursor = next < all.length ? next : undefined;
      return { items: slice, nextCursor };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadGatewayException('Erro ao buscar faixas do artista');
    }
  }
}
