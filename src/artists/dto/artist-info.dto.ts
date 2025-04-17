import { ApiProperty } from '@nestjs/swagger';

/**
 * Informações detalhadas de um artista.
 * Inclui `imageUrl` para facilitar o consumo no front‑end.
 */
export class ArtistInfoDto {
  @ApiProperty({ example: '37PZXblQTqpEWGdjctNcGP' })
  id: string;

  @ApiProperty({ example: 'Space Laces' })
  name: string;

  @ApiProperty({ example: ['dubstep', 'riddim'], type: [String] })
  genres: string[];

  @ApiProperty({ example: 109_566, description: 'Número de seguidores' })
  followers: number;

  @ApiProperty({ example: 56, description: 'Popularidade (0–100)' })
  popularity: number;

  @ApiProperty({ example: 'https://open.spotify.com/artist/37PZXblQTqpEWGdjctNcGP' })
  externalUrl: string;

  @ApiProperty({
    example: 'https://i.scdn.co/image/ab6761610000e5eb1234567890abcdef12345678',
    required: false,
  })
  imageUrl?: string;
}
