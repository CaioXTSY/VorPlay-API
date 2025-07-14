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

export class FeaturedReviewDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  rating: number;

  @ApiProperty({ example: 'Música incrível! Uma das melhores do ano, recomendo demais.' })
  comment: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;

  @ApiProperty({ type: UserSummaryDto })
  user: UserSummaryDto;

  @ApiProperty({ type: TrackSummaryDto })
  track: TrackSummaryDto;
}
