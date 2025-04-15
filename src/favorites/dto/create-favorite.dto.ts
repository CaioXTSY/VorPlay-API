import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExternalProvider } from '@prisma/client';

export class CreateFavoriteDto {
  @ApiProperty({
    description: 'ID da faixa no provedor externo (Spotify)',
    example: '4I4q9y76MMYLlFtLwTtG2N',
  })
  @IsString()
  externalId: string;

  @ApiProperty({
    description: 'Qual provedor gerou esse ID',
    enum: ExternalProvider,
    example: ExternalProvider.Spotify,
  })
  @IsEnum(ExternalProvider)
  externalProvider: ExternalProvider;
}
