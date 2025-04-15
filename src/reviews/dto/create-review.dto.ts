import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID da faixa no Spotify' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Nota de 1 a 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Comentário (opcional)', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
