import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
  @ApiProperty({ description: 'ID interno do review' })
  id: number;

  @ApiProperty({ description: 'ID interno da faixa' })
  trackId: number;

  @ApiProperty({ description: 'ID externo da faixa (Spotify)' })
  externalId: string;

  @ApiProperty({ description: 'Título da faixa' })
  title: string;

  @ApiProperty({ description: 'Artista da faixa', nullable: true })
  artist: string | null;

  @ApiProperty({ description: 'Álbum da faixa', nullable: true })
  album: string | null;

  @ApiProperty({ description: 'URL da capa', nullable: true })
  coverUrl: string | null;

  @ApiProperty({ description: 'Nota atribuída à faixa (1 a 5)' })
  rating: number;

  @ApiProperty({ description: 'Comentário do usuário', nullable: true })
  comment?: string | null;

  @ApiProperty({ description: 'ID do usuário que comentou' })
  userId: number;

  @ApiProperty({ description: 'Nome do usuário que comentou' })
  userName: string;

  @ApiProperty({ description: 'Foto de perfil do usuário que comentou', nullable: true })
  profilePicture?: string | null;

  @ApiProperty({ description: 'Data em que o review foi criado' })
  createdAt: Date;
}
