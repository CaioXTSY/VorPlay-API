import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { URLSearchParams } from 'url';

@Injectable()
export class SpotifyService {
  private token: string;
  constructor(private http: HttpService) {}

  private async getToken() {
    if (this.token) return this.token;
    const creds = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    ).toString('base64');
    const params = new URLSearchParams({ grant_type: 'client_credentials' });
    if (!process.env.SPOTIFY_TOKEN_URL) {
      throw new Error('SPOTIFY_TOKEN_URL environment variable is not defined');
    }
    const resp = await firstValueFrom(
      this.http.post(
        process.env.SPOTIFY_TOKEN_URL,
        params.toString(),
        { headers: {
            Authorization: `Basic ${creds}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }}
      )
    );
    this.token = resp.data.access_token;
    return this.token;
  }

  async search(query: string) {
    const token = await this.getToken();
    const url = `${process.env.SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=track`;
    const resp = await firstValueFrom(
      this.http.get(url, { headers: { Authorization: `Bearer ${token}` }})
    );
    return resp.data.tracks.items;
  }

  async getTrack(id: string) {
    const token = await this.getToken();
    const url = `${process.env.SPOTIFY_API_URL}/tracks/${id}`;
    const resp = await firstValueFrom(
      this.http.get(url, { headers: { Authorization: `Bearer ${token}` }})
    );
    return resp.data;
  }
}