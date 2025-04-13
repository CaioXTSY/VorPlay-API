import { ApiProperty } from '@nestjs/swagger';

export class TrackDto {
  @ApiProperty({ example: 3135556, description: 'ID da faixa no provedor externo' })
  id: number;

  @ApiProperty({ example: 'Xinoen', description: 'Título da faixa' })
  title: string;

  @ApiProperty({ example: 'Extasy', description: 'Nome do artista' })
  artist: string;

  @ApiProperty({ example: 'Enhanted Spells', description: 'Nome do álbum' })
  album: string;

  @ApiProperty({ example: 243, description: 'Duração da faixa em segundos' })
  duration: number;

  @ApiProperty({ example: 'https://cdn.deezer.com/images/cover/..../250x250-000000-80-0-0.jpg', description: 'URL da capa da música' })
  coverUrl: string;

  @ApiProperty({ example: 'https://www.deezer.com/track/3135556', description: 'URL de embed ou link da faixa' })
  embedUrl: string;
}
