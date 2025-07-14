import { ApiProperty } from '@nestjs/swagger';

class UserSummaryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: '/uploads/profile-pictures/abc123.jpg', nullable: true })
  profilePicture?: string;
}

class TrackSummaryDto {
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
}

class PlaylistSummaryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Minha Playlist Favorita' })
  name: string;

  @ApiProperty({ example: 'As melhores músicas para relaxar' })
  description: string;

  @ApiProperty({ example: 15 })
  trackCount: number;
}

export class PublicFeedDto {
  @ApiProperty({ example: 'review-123' })
  id: string;

  @ApiProperty({ example: 'review', enum: ['review', 'favorite', 'playlist'] })
  type: string;

  @ApiProperty({ example: 'avaliou' })
  action: string;

  @ApiProperty({ type: UserSummaryDto })
  user: UserSummaryDto;

  @ApiProperty({ type: TrackSummaryDto, required: false })
  track?: TrackSummaryDto;

  @ApiProperty({ type: PlaylistSummaryDto, required: false })
  playlist?: PlaylistSummaryDto;

  @ApiProperty({ example: 5, required: false })
  rating?: number;

  @ApiProperty({ example: 'Música incrível, recomendo!', required: false })
  comment?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;
}
