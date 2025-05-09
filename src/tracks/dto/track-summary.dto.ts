import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlbumImageDto } from './track.dto';

export class TrackSummaryDto {
  @ApiProperty({ example: '6J3l2JHhJ4z3gJvS7rQKZk' })
  id: string;

  @ApiProperty({ example: 'Blinding Lights' })
  title: string;

  @ApiProperty({ example: ['The Weeknd'], type: [String] })
  artistNames: string[];

  @ApiProperty({ example: 'After Hours' })
  albumName: string;

  @ApiProperty({ example: 200040, description: 'Duração em milissegundos' })
  durationMs: number;

  @ApiPropertyOptional({
    example: 'https://i.scdn.co/image/ab67616d0000b273e0f4f2... (thumbnail)',
    description: 'URL da imagem do álbum (thumbnail)',
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    type: [AlbumImageDto],
    description: 'Todas as imagens do álbum em diferentes resoluções',
  })
  images?: AlbumImageDto[];

  @ApiProperty({ example: 'https://api.spotify.com/v1/tracks/6J3l2JHhJ4z3gJvS7rQKZk' })
  href: string;
}
