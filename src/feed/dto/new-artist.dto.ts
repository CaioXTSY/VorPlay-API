import { ApiProperty } from '@nestjs/swagger';
import { ExternalProvider } from '@prisma/client';

export class NewArtistDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '4q3ewBCX7sLwd24euuV69X' })
  externalId: string;

  @ApiProperty({ example: 'The Weeknd' })
  name: string;

  @ApiProperty({ example: 'https://i.scdn.co/image/ab6761610000e5eb123abc.jpg' })
  pictureUrl: string;

  @ApiProperty({ enum: ExternalProvider, example: 'Spotify' })
  externalProvider: ExternalProvider;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;
}
