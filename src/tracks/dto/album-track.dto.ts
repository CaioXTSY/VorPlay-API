import { ApiProperty } from '@nestjs/swagger';

export class ArtistInTrackDto {
  @ApiProperty({ example: '1Xyo4u8uXC1ZmMpatF05PJ' }) id: string;
  @ApiProperty({ example: 'The Weeknd' }) name: string;
  @ApiProperty({ example: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' }) externalUrl: string;
}

export class AlbumInfoDto {
  @ApiProperty({ example: '0sNOF9WDwhWunNAHPD3Baj' }) id: string;
  @ApiProperty({ example: 'After Hours' }) name: string;
  @ApiProperty({ example: 'https://i.scdn.co/image/ab67616d0000b273e0f4f2...' }) coverUrl: string;
  @ApiProperty({ example: '2020-03-20' }) releaseDate: string;
}

export class AlbumTrackDto {
  @ApiProperty({ example: '0VjIjW4GlUZAMYd2vXMi3b3l2JHhJ4z3gJvS7rQKZk' }) id: string;
  @ApiProperty({ example: 'Blinding Lights' }) title: string;
  @ApiProperty({ example: 1, description: 'Posição da faixa no álbum' }) trackNumber: number;
  @ApiProperty({ example: 200040, description: 'Duração em milissegundos' }) durationMs: number;
  @ApiProperty({ type: [ArtistInTrackDto] }) artists: ArtistInTrackDto[];
  @ApiProperty({ type: AlbumInfoDto }) album: AlbumInfoDto;
  @ApiProperty({ example: 'https://p.scdn.co/mp3-preview/...' })
  previewUrl?: string;
}
