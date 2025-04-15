import { ApiProperty } from '@nestjs/swagger';

export class TrackSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [String], description: 'Nomes dos artistas' })
  artistNames: string[];

  @ApiProperty({ description: 'Nome do álbum' })
  albumName: string;

  @ApiProperty({ description: 'Duração em milissegundos' })
  durationMs: number;

  @ApiProperty()
  href: string;
}