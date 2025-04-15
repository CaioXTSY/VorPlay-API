// src/reviews/reviews.service.ts

import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { SpotifyService } from 'src/integration/spotify.service';
  import { ExternalProvider, Review, Track } from '@prisma/client';
  
  type ReviewWithTrackAndUserName = Review & {
    track: Track;
    user: { id: number; name: string };
  };
  
  @Injectable()
  export class ReviewsService {
    constructor(
      private readonly prisma: PrismaService,
      private readonly spotify: SpotifyService,
    ) {}
  
    async add(
      userId: number,
      spotifyId: string,
      rating: number,
      comment?: string,
    ): Promise<ReviewWithTrackAndUserName> {
      if (!spotifyId) {
        throw new BadRequestException('É necessário informar o ID da faixa no Spotify');
      }
  
      let trackData: any;
      try {
        trackData = await this.spotify.getTrack(spotifyId);
      } catch {
        throw new NotFoundException(`Faixa não encontrada no Spotify (ID: ${spotifyId})`);
      }
  
      const provider = ExternalProvider.Spotify;
      const trackRecord = await this.prisma.track.upsert({
        where: {
          uk_track_provider: { externalId: spotifyId, externalProvider: provider },
        },
        create: {
          externalId: spotifyId,
          externalProvider: provider,
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
  
      return this.prisma.review.create({
        data: {
          user:    { connect: { id: userId } },
          track:   { connect: { id: trackRecord.id } },
          rating,
          comment,
        },
        include: {
          track: true,
          user: { select: { id: true, name: true } },
        },
      });
    }
  
    async remove(userId: number, reviewId: number): Promise<void> {
      const res = await this.prisma.review.deleteMany({
        where: { id: reviewId, userId },
      });
      if (res.count === 0) {
        throw new NotFoundException('Review não encontrado ou não pertence ao usuário');
      }
    }
  
    async listByUser(userId: number): Promise<ReviewWithTrackAndUserName[]> {
      return this.prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          track: true,
          user: { select: { id: true, name: true } },
        },
      });
    }
  
    async getTrackByExternalId(externalId: string): Promise<Track> {
      const track = await this.prisma.track.findUnique({
        where: {
          uk_track_provider: {
            externalId,
            externalProvider: ExternalProvider.Spotify,
          },
        },
      });
      if (!track) {
        throw new NotFoundException(`Faixa não encontrada (Spotify ID: ${externalId})`);
      }
      return track;
    }
  
    async listByTrack(trackId: number): Promise<ReviewWithTrackAndUserName[]> {
      return this.prisma.review.findMany({
        where: { trackId },
        orderBy: { createdAt: 'desc' },
        include: {
          track: true,
          user: { select: { id: true, name: true } },
        },
      });
    }
  }
  