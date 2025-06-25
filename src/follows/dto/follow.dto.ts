import { FollowTargetType, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FollowDto {
  @ApiProperty({ example: 7 })
  id: number;

  @ApiProperty({ enum: FollowTargetType, example: FollowTargetType.artista })
  targetType: FollowTargetType;

  @ApiProperty({ example: 22 })
  targetId: number;

  @ApiProperty({ example: 3 })
  followerId: number;

  @ApiProperty({ example: '2025-04-17T14:40:12.000Z' })
  createdAt: Date;

  @ApiProperty({ type: () => Object, description: 'Usuário seguido', required: false })
  user?: Pick<User, 'id' | 'name' | 'email' | 'profilePicture' | 'createdAt'>;
}