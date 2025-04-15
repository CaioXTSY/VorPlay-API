import { ApiProperty } from '@nestjs/swagger';
import { AlbumImageDto, AlbumSummaryDto } from './album-summary.dto';

export class ArtistInfoDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ type: [String] }) genres: string[];
  @ApiProperty({ description: 'Número de seguidores' }) followers: number;
  @ApiProperty({ description: 'Popularidade (0–100)' }) popularity: number;
  @ApiProperty({ description: 'URL externa no Spotify' }) externalUrl: string;

  @ApiProperty({
    type: [AlbumImageDto],
    description: 'Imagens do artista (url, largura e altura)',
  })
  images: AlbumImageDto[];

  @ApiProperty({
    type: AlbumSummaryDto,
    description: 'Último release (álbum ou single)',
    required: false,
  })
  lastRelease?: AlbumSummaryDto;
}