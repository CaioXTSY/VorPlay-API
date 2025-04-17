import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CursorPaginationDto {
  @ApiPropertyOptional({
    description: 'Cursor (offset). Informe 0 para início ou o valor de nextCursor anterior.',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cursor?: number = 0;

  @ApiPropertyOptional({
    description: 'Quantidade de itens a retornar (padrão 20).',
    minimum: 1,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
