import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeezerService {
  constructor(private http: HttpService) {}

  async search(query: string) {
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
    const resp = await firstValueFrom(this.http.get(url));
    return resp.data.data;
  }

  async getTrack(id: string) {
    const url = `https://api.deezer.com/track/${id}`;
    const resp = await firstValueFrom(this.http.get(url));
    return resp.data;
  }
}