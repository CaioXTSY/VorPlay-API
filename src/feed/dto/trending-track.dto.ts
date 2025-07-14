import { ApiProperty } from '@nestjs/swagger';
import { ExternalProvider } from '@prisma/client';

export class TrendingTrackDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '4uLU6hMCjMI75M1A2tKUQC' })
  externalId: string;

  @ApiProperty({ example: 'Blinding Lights' })
  title: string;

  @ApiProperty({ example: 'The Weeknd' })
  artist: string;

  @ApiProperty({ example: 'After Hours' })
  album: string;

  @ApiProperty({ example: 'https://i.scdn.co/image/ab67616d0000b273abc123.jpg' })
  coverUrl: string;

  @ApiProperty({ enum: ExternalProvider, example: 'Spotify' })
  externalProvider: ExternalProvider;

  @ApiProperty({ example: 45, description: 'Número de favoritos' })
  favoritesCount: number;

  @ApiProperty({ example: 23, description: 'Número de reviews' })
  reviewsCount: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;
}
