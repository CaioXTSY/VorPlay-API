import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SpotifyService } from '../integration/spotify.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly spotify: SpotifyService,
  ) {}

  async getPublicFeed(limit = 10) {
    const [recentReviews, recentFavorites, recentPlaylists] = await Promise.all([
      this.prisma.review.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, profilePicture: true }
          },
          track: true
        }
      }),

      this.prisma.favorite.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, profilePicture: true }
          },
          track: true
        }
      }),

      this.prisma.playlist.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, profilePicture: true }
          },
          _count: {
            select: { playlistTracks: true }
          }
        }
      })
    ]);

    const activities = [
      ...recentReviews.map(review => ({
        id: `review-${review.id}`,
        type: 'review',
        action: 'avaliou',
        user: review.user,
        track: review.track,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      })),
      ...recentFavorites.map(favorite => ({
        id: `favorite-${favorite.id}`,
        type: 'favorite',
        action: 'favoritou',
        user: favorite.user,
        track: favorite.track,
        createdAt: favorite.createdAt
      })),
      ...recentPlaylists.map(playlist => ({
        id: `playlist-${playlist.id}`,
        type: 'playlist',
        action: 'criou a playlist',
        user: playlist.user,
        playlist: {
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          trackCount: playlist._count.playlistTracks
        },
        createdAt: playlist.createdAt
      }))
    ];

    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getPlatformStats() {
    const [
      totalUsers,
      totalReviews,
      totalFavorites,
      totalPlaylists,
      topRatedTracks,
      mostActiveUsers
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.review.count(),
      this.prisma.favorite.count(),
      this.prisma.playlist.count(),
      
      this.prisma.review.groupBy({
        by: ['trackId'],
        _avg: { rating: true },
        _count: { rating: true },
        having: { rating: { _count: { gte: 3 } } },
        orderBy: { _avg: { rating: 'desc' } },
        take: 5
      }),

      this.prisma.review.groupBy({
        by: ['userId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
      })
    ]);

    return {
      totalUsers,
      totalReviews,
      totalFavorites,
      totalPlaylists,
      topRatedTracks: topRatedTracks.length,
      mostActiveUsers: mostActiveUsers.length
    };
  }

  async getTrending(limit = 10) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const [recentFavorites, recentReviews] = await Promise.all([
      this.prisma.favorite.groupBy({
        by: ['trackId'],
        where: {
          createdAt: { gte: yesterday }
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: limit
      }),

      this.prisma.review.groupBy({
        by: ['trackId'],
        where: {
          createdAt: { gte: yesterday }
        },
        _count: { id: true },
        _avg: { rating: true },
        orderBy: { _count: { id: 'desc' } },
        take: limit
      })
    ]);

    const trendingTrackIds = [...new Set([
      ...recentFavorites.map(f => f.trackId),
      ...recentReviews.map(r => r.trackId)
    ])].slice(0, limit);

    const tracks = await this.prisma.track.findMany({
      where: { id: { in: trendingTrackIds } },
      include: {
        _count: {
          select: {
            favorites: true,
            reviews: true
          }
        }
      }
    });

    return tracks.map(track => ({
      ...track,
      favoritesCount: track._count.favorites,
      reviewsCount: track._count.reviews
    }));
  }

  async getNewArtists(limit = 8) {
    return this.prisma.artist.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        externalId: true,
        name: true,
        pictureUrl: true,
        externalProvider: true,
        createdAt: true
      }
    });
  }

  async getFeaturedReviews(limit = 5) {
    return this.prisma.review.findMany({
      where: {
        rating: { gte: 4 },
        comment: { not: null }
      },
      take: limit,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        user: {
          select: { id: true, name: true, profilePicture: true }
        },
        track: true
      }
    });
  }
}
