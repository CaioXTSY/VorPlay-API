import { ApiProperty } from '@nestjs/swagger';

export class AlbumImageDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;
}

export class AlbumSummaryDto {
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
}
