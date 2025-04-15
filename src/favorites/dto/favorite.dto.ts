import { ApiProperty } from '@nestjs/swagger';

export class FavoriteDto {
  @ApiProperty({ description: 'ID interno do favorito', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID interno da faixa', example: 42 })
  trackId: number;

  @ApiProperty({
    description: 'ID externo da faixa',
    example: '4I4q9y76MMYLlFtLwTtG2N',
  })
  externalId: string;

  @ApiProperty({ description: 'Título da faixa', example: 'Overdrive' })
  title: string;

  @ApiProperty({
    description: 'Artista(s) da faixa',
    example: 'Space Laces',
    nullable: true,
  })
  artist: string | null;

  @ApiProperty({
    description: 'Álbum da faixa',
    example: 'Overdrive EP',
    nullable: true,
  })
  album: string | null;

  @ApiProperty({
    description: 'URL da capa',
    example: 'https://i.scdn.co/image/…',
    nullable: true,
  })
  coverUrl: string | null;

  @ApiProperty({
    description: 'Quando o favorito foi criado',
    type: 'string',
    format: 'date-time',
    example: '2025-04-15T12:34:56.789Z',
  })
  createdAt: Date;
}
