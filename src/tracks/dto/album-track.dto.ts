import { ApiProperty } from '@nestjs/swagger';

export class ArtistInTrackDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ description: 'URL externa no Spotify' }) externalUrl: string;
}

export class AlbumInfoDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ description: 'URL da capa do álbum' }) coverUrl: string;
  @ApiProperty({ description: 'Data de lançamento do álbum' }) releaseDate: string;
}

export class AlbumTrackDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty({ description: 'Posição da faixa no álbum' }) trackNumber: number;
  @ApiProperty({ description: 'Duração em milissegundos' }) durationMs: number;
  @ApiProperty({ type: [ArtistInTrackDto] }) artists: ArtistInTrackDto[];
  @ApiProperty({ type: AlbumInfoDto }) album: AlbumInfoDto;
}
