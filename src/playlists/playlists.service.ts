import {
    Injectable,
    NotFoundException,
    ConflictException,
  } from '@nestjs/common';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { SpotifyService } from 'src/integration/spotify.service';
  import { CreatePlaylistDto } from './dto/create-playlist.dto';
  import { UpdatePlaylistDto } from './dto/update-playlist.dto';
  import { AddTrackDto } from './dto/add-track.dto';
  import { ExternalProvider } from '@prisma/client';
  
  @Injectable()
  export class PlaylistsService {
    constructor(
      private readonly prisma: PrismaService,
      private readonly spotify: SpotifyService,
    ) {}
  
    /* ───────── playlists ───────── */
  
    findAll(userId: number) {
      return this.prisma.playlist.findMany({ where: { userId } });
    }
  
    async findOne(id: number, userId: number) {
      const playlist = await this.prisma.playlist.findFirst({
        where: { id, userId },
        include: {
          playlistTracks: {
            include: { track: true },
            orderBy: { position: 'asc' },
          },
        },
      });
      if (!playlist) throw new NotFoundException('Playlist não encontrada');
      return playlist;
    }
  
    create(userId: number, dto: CreatePlaylistDto) {
      return this.prisma.playlist.create({ data: { ...dto, userId } });
    }
  
    async update(id: number, userId: number, dto: UpdatePlaylistDto) {
      await this.ensureExists(id, userId);
      return this.prisma.playlist.update({ where: { id }, data: dto });
    }
  
    async remove(id: number, userId: number) {
      await this.ensureExists(id, userId);
      await this.prisma.playlist.delete({ where: { id } });
    }
  
    /* ───────── tracks ───────── */
  
    async addTrack(
      playlistId: number,
      userId: number,
      dto: AddTrackDto,
    ) {
      await this.ensureExists(playlistId, userId);
  
      // 1. garante registro da track
      let track = await this.prisma.track.findFirst({
        where: {
          externalId: dto.externalId,
          externalProvider: dto.externalProvider,
        },
      });
  
      if (!track) {
        if (dto.externalProvider !== ExternalProvider.Spotify)
          throw new ConflictException('Apenas Spotify suportado no momento');
  
        const data = await this.spotify.getTrack(dto.externalId);
        track = await this.prisma.track.create({
          data: {
            externalId: data.id,
            externalProvider: ExternalProvider.Spotify,
            title: data.name,
            artist: data.artists.map(a => a.name).join(', '),
            album: data.album.name,
            coverUrl: data.album.images?.[0]?.url,
          },
        });
      }
  
      // 2. evita duplicidade
      const dup = await this.prisma.playlistTrack.findFirst({
        where: { playlistId, trackId: track.id },
      });
      if (dup) throw new ConflictException('Faixa já existe na playlist');
  
      // 3. calcula posição
      const last = await this.prisma.playlistTrack.aggregate({
        where: { playlistId },
        _max: { position: true },
      });
      const position = dto.position ?? (last._max.position ?? 0) + 1;
  
      // 4. insere
      return this.prisma.playlistTrack.create({
        data: { playlistId, trackId: track.id, position },
      });
    }
  
    async removeTrack(
      playlistId: number,
      userId: number,
      trackId: number,
    ) {
      await this.ensureExists(playlistId, userId);
      await this.prisma.playlistTrack.delete({
        where: { playlistId_trackId: { playlistId, trackId } },
      });
    }
  
    /* ───────── helper ───────── */
  
    /** usado internamente para validação */
    async listSpotifyUris(playlistId: number, userId: number) {
      const pl = await this.findOne(playlistId, userId);
      return pl.playlistTracks
        .filter(pt => pt.track.externalProvider === ExternalProvider.Spotify)
        .map(pt => `spotify:track:${pt.track.externalId}`);
    }
  
    private async ensureExists(id: number, userId: number) {
      const ok = await this.prisma.playlist.findFirst({ where: { id, userId } });
      if (!ok) throw new NotFoundException('Playlist não encontrada');
    }
  }
  