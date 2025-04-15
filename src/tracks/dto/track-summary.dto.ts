import { ApiProperty } from '@nestjs/swagger';

export class TrackSummaryDto {
  @ApiProperty({ example: '6J3l2JHhJ4z3gJvS7rQKZk' })
  id: string;

  @ApiProperty({ example: 'Blinding Lights' })
  title: string;

  @ApiProperty({ example: ['The Weeknd'] })
  artistNames: string[];

  @ApiProperty({ example: 'After Hours' })
  albumName: string;

  @ApiProperty({ example: 200040, description: 'Duração em milissegundos' })
  durationMs: number;

  @ApiProperty({ example: 'https://api.spotify.com/v1/tracks/6J3l2JHhJ4z3gJvS7rQKZk' })
  href: string;
}
