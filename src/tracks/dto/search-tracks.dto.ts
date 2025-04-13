import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchTracksDto {
  @ApiProperty({
    example: 'Extasy Xinoen',
    description: 'Termo de busca para pesquisar músicas',
  })
  @IsNotEmpty()
  query: string;
}
