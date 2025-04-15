import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExternalProvider } from '@prisma/client';
import { SpotifyService } from 'src/integration/spotify.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly spotify: SpotifyService,
  ) {}

  async add(
    userId: number,
    externalId: string,
    externalProvider: ExternalProvider,
  ) {
    let trackData: any;
    try {
      if (externalProvider === ExternalProvider.Spotify) {
        trackData = await this.spotify.getTrack(externalId);
      } else {
        throw new NotFoundException('Provider não suportado');
      }
    } catch {
      throw new NotFoundException('Faixa não encontrada na API externa');
    }

    const track = await this.prisma.track.upsert({
      where: {
        uk_track_provider: { externalId, externalProvider },
      },
      create: {
        externalId,
        externalProvider,
        title: trackData.name,
        artist: trackData.artists.map(a => a.name).join(', '),
        album: trackData.album.name,
        coverUrl: trackData.album.images[0]?.url,
      },
      update: {
        title: trackData.name,
        artist: trackData.artists.map(a => a.name).join(', '),
        album: trackData.album.name,
        coverUrl: trackData.album.images[0]?.url,
      },
    });

    try {
      return await this.prisma.favorite.create({
        data: {
          user:  { connect: { id: userId } },
          track: { connect: { id: track.id } },
        },
        include: { track: true },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ConflictException('Já favoritado');
      }
      throw err;
    }
  }

  async remove(userId: number, trackId: number) {
    const res = await this.prisma.favorite.deleteMany({
      where: { userId, trackId },
    });
    if (res.count === 0) {
      throw new NotFoundException('Favorite não encontrado');
    }
  }

  async list(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { track: true },
    });
  }
}