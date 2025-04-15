import { ApiProperty } from '@nestjs/swagger';

export class ArtistDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  externalUrl?: string;

  @ApiProperty()
  href: string;
}

export class AlbumImageDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;
}

export class AlbumDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: 'Data de lançamento do álbum' })
  releaseDate: string;

  @ApiProperty({ description: 'Número total de faixas do álbum' })
  totalTracks: number;

  @ApiProperty({ type: [AlbumImageDto] })
  images: AlbumImageDto[];

  @ApiProperty()
  href: string;
}

export class TrackDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [ArtistDto] })
  artists: ArtistDto[];

  @ApiProperty({ type: AlbumDto })
  album: AlbumDto;

  @ApiProperty({ description: 'Duração em milissegundos' })
  durationMs: number;

  @ApiProperty()
  explicit: boolean;

  @ApiProperty({ description: 'Popularidade da faixa (0-100)' })
  popularity: number;

  @ApiProperty({ required: false })
  previewUrl: string;

  @ApiProperty()
  embedUrl: string;

  @ApiProperty()
  href: string;
}