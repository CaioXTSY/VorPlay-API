import { FollowTargetType } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFollowDto {
  @ApiProperty({ enum: FollowTargetType, example: FollowTargetType.usuario })
  @IsEnum(FollowTargetType)
  targetType: FollowTargetType;

  @ApiProperty({ example: 42, description: 'ID interno do alvo a seguir' })
  @IsInt()
  targetId: number;
}