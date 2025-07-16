import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService }  from '@nestjs/config';
import { HttpService }    from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { URLSearchParams } from 'url';

@Injectable()
export class SpotifyService {
  private token: string;
  private tokenExpiry: Date;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  private isTokenExpired(): boolean {
    if (!this.token || !this.tokenExpiry) return true;
    const now = new Date();
    return now >= this.tokenExpiry;
  }

  private async getToken(): Promise<string> {
    try {
      if (this.token && !this.isTokenExpired()) {
        console.log('[Spotify] Usando token existente');
        return this.token;
      }

      console.log('[Spotify] Solicitando novo token');
      const clientId     = this.config.get<string>('SPOTIFY_CLIENT_ID');
      const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');
      const tokenUrl     = this.config.get<string>('SPOTIFY_TOKEN_URL');
      
      if (!clientId || !clientSecret || !tokenUrl) {
        console.error('[Spotify] Credenciais ausentes');
        throw new InternalServerErrorException('Credenciais do Spotify ausentes');
      }

      const body = new URLSearchParams({ grant_type: 'client_credentials' });
      console.log(`[Spotify] Fazendo requisição para ${tokenUrl}`);
      
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
      
      console.log(`[Spotify] Resposta de token recebida com status: ${resp.status}`);
      
      if (!resp.data.access_token) {
        console.error('[Spotify] Token não retornado na resposta');
        throw new InternalServerErrorException('Token do Spotify não retornado');
      }
      
      this.token = resp.data.access_token;
      
      const expiresIn = resp.data.expires_in || 3600;
      this.tokenExpiry = new Date();
      this.tokenExpiry.setSeconds(this.tokenExpiry.getSeconds() + expiresIn);
      
      console.log(`[Spotify] Novo token obtido com sucesso, expira em ${expiresIn} segundos`);
      return this.token;
    } catch (error) {
      console.error('[Spotify] Erro ao obter token:', error.message);
      if (error.response) {
        console.error(`[Spotify] Status: ${error.response.status}, Data:`, error.response.data);
      }
      throw error;
    }
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

  async searchArtists(query: string, limit = 20, offset = 0, retryCount = 0): Promise<any[]> {
    return this.retryOperation(async () => {
      console.log(`[Spotify] Iniciando busca de artistas. Query: "${query}", Limit: ${limit}, Offset: ${offset}`);
      const token  = await this.getToken();
      const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
      console.log(`[Spotify] Fazendo requisição para ${apiUrl}/search`);
      const resp = await firstValueFrom(
        this.http.get(`${apiUrl}/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params : { q: query, type: 'artist', limit, offset },
        }),
      );
      console.log(`[Spotify] Resposta recebida com status: ${resp.status}`);
      return resp.data.artists.items;
    }, retryCount);
  }

  private async retryOperation<T>(operation: () => Promise<T>, retryCount = 0): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error('[Spotify] Erro na operação:', error.message);
      if (error.response) {
        console.error(`[Spotify] Status: ${error.response.status}, Data:`, error.response.data);
        
        if (error.response.status === 502) {
          console.error('[Spotify] Erro 502 Bad Gateway detectado. Esse erro geralmente indica um problema temporário com o serviço da API do Spotify ou problemas de rede.');
        }
      }
      
      const maxRetries = 2;
      if (
        retryCount < maxRetries && 
        (error.response?.status === 502 || error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT')
      ) {
        const waitTime = Math.pow(2, retryCount) * 1000;
        console.log(`[Spotify] Tentando novamente em ${waitTime}ms (tentativa ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.retryOperation(operation, retryCount + 1);
      }
      throw error;
    }
  }

  async getArtist(id: string, retryCount = 0) {
    return this.retryOperation(async () => {
      console.log(`[Spotify] Buscando artista com ID: ${id}`);
      const token  = await this.getToken();
      const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
      console.log(`[Spotify] Fazendo requisição para ${apiUrl}/artists/${id}`);
      const resp   = await firstValueFrom(
        this.http.get(`${apiUrl}/artists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      console.log(`[Spotify] Resposta de artista recebida com status: ${resp.status}`);
      if (resp.status !== 200) throw new NotFoundException('Artista não encontrado.');
      return resp.data;
    }, retryCount);
  }

  async getArtistAlbums(id: string, retryCount = 0) {
    return this.retryOperation(async () => {
      console.log(`[Spotify] Buscando álbuns do artista com ID: ${id}`);
      const token  = await this.getToken();
      const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
      console.log(`[Spotify] Fazendo requisição para ${apiUrl}/artists/${id}/albums`);
      const resp   = await firstValueFrom(
        this.http.get(`${apiUrl}/artists/${id}/albums`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      console.log(`[Spotify] Resposta de álbuns recebida com status: ${resp.status}, encontrados ${resp.data.items.length} álbuns`);
      return resp.data.items;
    }, retryCount);
  }

  async getArtistTopTracks(id: string, market = 'BR', retryCount = 0) {
    return this.retryOperation(async () => {
      console.log(`[Spotify] Buscando top tracks do artista com ID: ${id}, mercado: ${market}`);
      const token  = await this.getToken();
      const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
      console.log(`[Spotify] Fazendo requisição para ${apiUrl}/artists/${id}/top-tracks`);
      const resp   = await firstValueFrom(
        this.http.get(`${apiUrl}/artists/${id}/top-tracks`, {
          headers: { Authorization: `Bearer ${token}` },
          params : { market },
        }),
      );
      console.log(`[Spotify] Resposta de top tracks recebida com status: ${resp.status}, encontradas ${resp.data.tracks.length} faixas`);
      return resp.data.tracks;
    }, retryCount);
  }

  async getTrack(id: string, retryCount = 0) {
    return this.retryOperation(async () => {
      console.log(`[Spotify] Buscando faixa com ID: ${id}`);
      const token  = await this.getToken();
      const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
      console.log(`[Spotify] Fazendo requisição para ${apiUrl}/tracks/${id}`);
      const resp   = await firstValueFrom(
        this.http.get(`${apiUrl}/tracks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      console.log(`[Spotify] Resposta de faixa recebida com status: ${resp.status}`);
      if (resp.status !== 200) throw new NotFoundException('Faixa não encontrada.');
      return resp.data;
    }, retryCount);
  }

  async getAlbumTracks(albumId: string, retryCount = 0) {
    return this.retryOperation(async () => {
      console.log(`[Spotify] Buscando faixas do álbum com ID: ${albumId}`);
      const token  = await this.getToken();
      const apiUrl = this.config.get<string>('SPOTIFY_API_URL');
      console.log(`[Spotify] Fazendo requisição para ${apiUrl}/albums/${albumId}/tracks`);
      const resp   = await firstValueFrom(
        this.http.get(`${apiUrl}/albums/${albumId}/tracks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      console.log(`[Spotify] Resposta de faixas do álbum recebida com status: ${resp.status}`);
      return resp.data.items;
    }, retryCount);
  }
}
