import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFollowDto {
  @ApiProperty({ example: 42, description: 'ID interno do usuário a seguir' })
  @IsInt()
  targetId: number;
}