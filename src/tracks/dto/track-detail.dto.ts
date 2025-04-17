import { ApiProperty } from '@nestjs/swagger';

/**
 * Detalhes completos de uma faixa.
 * Estrutura simplificada para refletir o que o `TracksService` devolve.
 */
export class TrackDetailDto {
  @ApiProperty({ example: '0VjIjW4GlUZAMYd2vXMi3b3l2JHhJ4z3gJvS7rQKZk' })
  id: string;

  @ApiProperty({ example: 'Blinding Lights' })
  title: string;

  @ApiProperty({ example: ['The Weeknd'], type: [String] })
  artistNames: string[];

  @ApiProperty({ example: 'After Hours' })
  albumName: string;

  @ApiProperty({ example: 200_040, description: 'Duração em milissegundos' })
  durationMs: number;

  @ApiProperty({
    example: 'https://p.scdn.co/mp3-preview/abc123...',
    required: false,
  })
  previewUrl?: string;

  @ApiProperty({ example: 95, description: 'Popularidade (0–100)' })
  popularity: number;

  @ApiProperty({
    example: 'https://i.scdn.co/image/ab67616d0000b273e0f4f2...',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    example: 'https://api.spotify.com/v1/tracks/0VjIjW4GlUZAMYd2vXMi3b3l2JHhJ4z3gJvS7rQKZk',
  })
  href: string;
}
