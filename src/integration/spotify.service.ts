import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { URLSearchParams } from 'url';

@Injectable()
export class SpotifyService {
  private token: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  private async getToken(): Promise<string> {
    if (this.token) return this.token;

    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');
    const tokenUrl = this.config.get<string>('SPOTIFY_TOKEN_URL');
    if (!clientId || !clientSecret || !tokenUrl) {
      throw new InternalServerErrorException(
        'Variáveis SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_TOKEN_URL não configuradas',
      );
    }

    const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const params = new URLSearchParams({ grant_type: 'client_credentials' });
    const resp = await firstValueFrom(
      this.http.post(tokenUrl, params.toString(), {
        headers: {
          Authorization: `Basic ${creds}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    ).catch(err => {
      throw new InternalServerErrorException(
        `Erro ao obter token Spotify: ${err.response?.data?.error_description || err.message}`,
      );
    });

    this.token = resp.data.access_token;
    return this.token;
  }

  /** Busca faixas de pesquisa */
  async searchTracks(query: string, limit = 10): Promise<any[]> {
    const token = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp = await firstValueFrom(
      this.http.get(`${apiUrl}/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: query, type: 'track', limit },
      }),
    );
    return resp.data.tracks.items;
  }

  /** Detalhes de uma faixa */
  async getTrack(id: string): Promise<any> {
    const token = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    try {
      const resp = await firstValueFrom(
        this.http.get(`${apiUrl}/tracks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { market: this.config.get('SPOTIFY_MARKET') || 'US' },
        }),
      );
      return resp.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        throw new NotFoundException(`Faixa ${id} não encontrada no Spotify`);
      }
      throw err;
    }
  }

  /** Busca artistas */
  async searchArtists(query: string, limit = 10): Promise<any[]> {
    const token = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp = await firstValueFrom(
      this.http.get(`${apiUrl}/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: query, type: 'artist', limit },
      }),
    );
    return resp.data.artists.items;
  }

  /** Detalhes de um artista */
  async getArtist(id: string): Promise<any> {
    const token = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp = await firstValueFrom(
      this.http.get(`${apiUrl}/artists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return resp.data;
  }

  /** Álbuns de um artista */
  async getArtistAlbums(id: string, limit = 20): Promise<any[]> {
    const token = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const market = this.config.get<string>('SPOTIFY_MARKET') || 'US';
    const resp = await firstValueFrom(
      this.http.get(`${apiUrl}/artists/${id}/albums`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { include_groups: 'album,single', market, limit },
      }),
    );
    return resp.data.items;
  }

  /** Top‑tracks de um artista */
  async getArtistTopTracks(id: string): Promise<any[]> {
    const token = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const market = this.config.get<string>('SPOTIFY_MARKET') || 'US';
    const resp = await firstValueFrom(
      this.http.get(`${apiUrl}/artists/${id}/top-tracks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { market },
      }),
    );
    return resp.data.tracks;
  }

  /** Detalhes de um álbum */
  async getAlbum(id: string): Promise<any> {
    const token = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp = await firstValueFrom(
      this.http.get(`${apiUrl}/albums/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return resp.data;
  }

  /** Faixas de um álbum */
  async getAlbumTracks(albumId: string, limit = 50, offset = 0): Promise<any[]> {
    const token = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp = await firstValueFrom(
      this.http.get(`${apiUrl}/albums/${albumId}/tracks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit, offset },
      }),
    );
    return resp.data.items;
  }

  async createPlaylistRemote(
    name: string,
    description = '',
    isPublic = false,
  ): Promise<string | null> {
    const token = this.config.get<string>('SPOTIFY_USER_TOKEN');
    const userId = this.config.get<string>('SPOTIFY_USER_ID');
    if (!token || !userId) return null; // integração não configurada
  
    const api = this.config.get<string>('SPOTIFY_API_URL');
    const resp = await firstValueFrom(
      this.http.post(
        `${api}/users/${userId}/playlists`,
        { name, description, public: isPublic },
        { headers: { Authorization: token } },
      ),
    );
    return resp.data.id; // retorna o id da playlist criada no Spotify
  }
  
  async addTracksRemote(playlistId: string, uris: string[]) {
    const token = this.config.get<string>('SPOTIFY_USER_TOKEN');
    if (!token || !uris.length) return;
  
    const api = this.config.get<string>('SPOTIFY_API_URL');
    await firstValueFrom(
      this.http.post(
        `${api}/playlists/${playlistId}/tracks`,
        { uris },
        { headers: { Authorization: token } },
      ),
    );
  }
}
