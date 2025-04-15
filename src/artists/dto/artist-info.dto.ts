import { ApiProperty } from '@nestjs/swagger';
import { AlbumImageDto } from './album-summary.dto';

export class ArtistInfoDto {
  @ApiProperty({ example: '37PZXblQTqpEWGdjctNcGP' }) id: string;
  @ApiProperty({ example: 'Space Laces' }) name: string;
  @ApiProperty({ example: ['dubstep','riddim'], type: [String] }) genres: string[];
  @ApiProperty({ example: 109566, description: 'Número de seguidores' }) followers: number;
  @ApiProperty({ example: 56, description: 'Popularidade (0–100)' }) popularity: number;
  @ApiProperty({ example: 'https://open.spotify.com/artist/37PZXblQTqpEWGdjctNcGP' }) externalUrl: string;
  @ApiProperty({ type: [AlbumImageDto], description: 'Imagens do artista' }) images: AlbumImageDto[];
}
