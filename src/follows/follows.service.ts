import {
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { CreateFollowDto } from './dto/create-follow.dto';
  import { FollowTargetType, Prisma } from '@prisma/client';
  
  @Injectable()
  export class FollowsService {
    constructor(private readonly prisma: PrismaService) {}
  
    listByUser(
      followerId: number,
      type?: FollowTargetType,
    ) {
      return this.prisma.follow.findMany({
        where: { followerId, ...(type && { targetType: type }) },
      });
    }
  
    listFollowersOfUser(userId: number) {
      return this.prisma.follow.findMany({
        where: { targetType: 'usuario', targetId: userId },
      });
    }
  
    async isFollowing(
      followerId: number,
      targetType: FollowTargetType,
      targetId: number,
    ) {
      return this.prisma.follow.findFirst({
        where: { followerId, targetType, targetId },
      });
    }
  
  
    async create(
      followerId: number,
      dto: CreateFollowDto,
    ) {
      const exists = await this.isFollowing(
        followerId,
        dto.targetType,
        dto.targetId,
      );
      if (exists) throw new ConflictException('Você já segue esse alvo.');
  
      return this.prisma.follow.create({
        data: {
          followerId,
          targetType: dto.targetType,
          targetId: dto.targetId,
        } as Prisma.FollowUncheckedCreateInput,
      });
    }
  
    async remove(followerId: number, id: number) {
      const follow = await this.prisma.follow.findFirst({
        where: { id, followerId },
      });
      if (!follow) throw new NotFoundException('Follow não encontrado.');
      await this.prisma.follow.delete({ where: { id } });
    }
  }
  