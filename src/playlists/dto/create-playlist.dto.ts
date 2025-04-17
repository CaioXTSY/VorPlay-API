import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaylistDto {
  @ApiProperty({ example: 'Minhas favoritas' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Músicas pra focar', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
