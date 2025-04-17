import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService }  from '@nestjs/config';
import { HttpService }    from '@nestjs/axios';
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

    const clientId     = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');
    const tokenUrl     = this.config.get<string>('SPOTIFY_TOKEN_URL');
    if (!clientId || !clientSecret || !tokenUrl) {
      throw new InternalServerErrorException('Credenciais do Spotify ausentes');
    }

    const body = new URLSearchParams({ grant_type: 'client_credentials' });
    const resp = await firstValueFrom(
      this.http.post(
        tokenUrl,
        body.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
              `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          },
        },
      ),
    );
    if (!resp.data.access_token) {
      throw new InternalServerErrorException('Token do Spotify não retornado');
    }
    this.token = resp.data.access_token;
    return this.token;
  }

  async searchTracks(query: string, limit = 20, offset = 0): Promise<any[]> {
    const token  = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp   = await firstValueFrom(
      this.http.get(`${apiUrl}/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params : { q: query, type: 'track', limit, offset },
      }),
    );
    return resp.data.tracks.items;
  }

  async searchArtists(query: string, limit = 20, offset = 0): Promise<any[]> {
    const token  = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp   = await firstValueFrom(
      this.http.get(`${apiUrl}/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params : { q: query, type: 'artist', limit, offset },
      }),
    );
    return resp.data.artists.items;
  }

  async getArtist(id: string) {
    const token  = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp   = await firstValueFrom(
      this.http.get(`${apiUrl}/artists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    if (resp.status !== 200) throw new NotFoundException('Artista não encontrado.');
    return resp.data;
  }

  async getArtistAlbums(id: string) {
    const token  = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp   = await firstValueFrom(
      this.http.get(`${apiUrl}/artists/${id}/albums`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return resp.data.items;
  }

  async getArtistTopTracks(id: string, market = 'BR') {
    const token  = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp   = await firstValueFrom(
      this.http.get(`${apiUrl}/artists/${id}/top-tracks`, {
        headers: { Authorization: `Bearer ${token}` },
        params : { market },
      }),
    );
    return resp.data.tracks;
  }

  async getTrack(id: string) {
    const token  = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp   = await firstValueFrom(
      this.http.get(`${apiUrl}/tracks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    if (resp.status !== 200) throw new NotFoundException('Faixa não encontrada.');
    return resp.data;
  }

  async getAlbumTracks(albumId: string) {
    const token  = await this.getToken();
    const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
    const resp   = await firstValueFrom(
      this.http.get(`${apiUrl}/albums/${albumId}/tracks`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return resp.data.items;
  }
}
