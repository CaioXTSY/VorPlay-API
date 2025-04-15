import { ApiProperty } from '@nestjs/swagger';

export class ArtistInDetailDto {
  @ApiProperty({ example: '1Xyo4u8uXC1ZmMpatF05PJ' }) id: string;
  @ApiProperty({ example: 'The Weeknd' }) name: string;
  @ApiProperty({ example: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' }) externalUrl: string;
}

export class AlbumImageDto {
  @ApiProperty({ example: 'https://i.scdn.co/image/ab67616d0000b273e0f4f2...' }) url: string;
  @ApiProperty({ example: 640 }) width: number;
  @ApiProperty({ example: 640 }) height: number;
}

export class AlbumDetailDto {
  @ApiProperty({ example: '0sNOF9WDwhWunNAHPD3Baj' }) id: string;
  @ApiProperty({ example: 'After Hours' }) name: string;
  @ApiProperty({ example: '2020-03-20', description: 'Data de lançamento' }) releaseDate: string;
  @ApiProperty({ example: 14, description: 'Total de faixas' }) totalTracks: number;
  @ApiProperty({ type: [AlbumImageDto] }) images: AlbumImageDto[];
}

export class TrackDetailDto {
  @ApiProperty({ example: '6J3l2JHhJ4z3gJvS7rQKZk' }) id: string;
  @ApiProperty({ example: 'Blinding Lights' }) title: string;
  @ApiProperty({ type: [ArtistInDetailDto] }) artists: ArtistInDetailDto[];
  @ApiProperty({ type: AlbumDetailDto }) album: AlbumDetailDto;
  @ApiProperty({ example: 200040 }) durationMs: number;
  @ApiProperty({ example: 95, description: 'Popularidade (0–100)' }) popularity: number;
  @ApiProperty({ example: ['pop', 'r&b'] }) genres: string[];
  @ApiProperty({ example: 'https://open.spotify.com/embed/track/6J3l2JHhJ4z3gJvS7rQKZk' }) embed: string;
  @ApiProperty({ example: 'https://api.spotify.com/v1/tracks/6J3l2JHhJ4z3gJvS7rQKZk' }) href: string;
}
