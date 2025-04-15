import { ApiProperty } from '@nestjs/swagger';

export class ArtistSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: 'URL externa no Spotify' })
  externalUrl: string;

  @ApiProperty({ description: 'URL da imagem principal', required: false })
  imageUrl?: string;
}
