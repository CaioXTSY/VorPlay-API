import { ApiProperty } from '@nestjs/swagger';

class ArtistInfo {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  externalUrl: string;
}

class AlbumInfo {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  releaseDate: string;
  @ApiProperty()
  totalTracks: number;
  @ApiProperty({ type: [Object] })
  images: { url: string; width: number; height: number }[];
}

export class TrackDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [ArtistInfo] })
  artists: ArtistInfo[];

  @ApiProperty({ type: AlbumInfo })
  album: AlbumInfo;

  @ApiProperty({ description: 'Duração em milissegundos' })
  durationMs: number;

  @ApiProperty()
  popularity: number;

  @ApiProperty({ type: [String] })
  genres: string[];

  @ApiProperty({ description: 'URL para embed do player' })
  embed: string;

  @ApiProperty()
  href: string;
}