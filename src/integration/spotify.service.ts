import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  /** Busca uma lista de faixas */
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

  /** Busca detalhes de UMA faixa, incluindo mercado (default 'US') */
  async getTrack(id: string): Promise<any> {
    const token = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const market = this.config.get<string>('SPOTIFY_MARKET') || 'US';

    const resp = await firstValueFrom(
      this.http.get(`${apiUrl}/tracks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { market },
      }),
    ).catch(err => {
      if (err.response?.status === 404) {
        throw new InternalServerErrorException(`Faixa ${id} não encontrada no mercado ${market}`);
      }
      throw err;
    });

    return resp.data;
  }

  /** Busca detalhes de um artista */
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
}