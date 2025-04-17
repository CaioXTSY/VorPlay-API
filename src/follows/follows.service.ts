import {
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { CreateFollowDto } from './dto/create-follow.dto';
  
  @Injectable()
  export class FollowsService {
    constructor(private readonly prisma: PrismaService) {}
  
    listByUser(followerId: number) {
      return this.prisma.follow.findMany({
        where: { followerId },
      });
    }
  
    listForUser(userId: number) {
      return this.prisma.follow.findMany({
        where: { followerId: userId },
      });
    }
  
    async create(followerId: number, dto: CreateFollowDto) {
      if (followerId === dto.targetId) {
        throw new ConflictException('Você não pode seguir a si mesmo.');
      }
  
      const dup = await this.prisma.follow.findFirst({
        where: { followerId, targetId: dto.targetId },
      });
      if (dup) throw new ConflictException('Você já segue esse usuário.');
  
      return this.prisma.follow.create({
        data: {
          followerId,
          targetId: dto.targetId,
          targetType: 'usuario', // constante
        },
      });
    }
  
    async remove(followerId: number, id: number) {
      const row = await this.prisma.follow.findFirst({
        where: { id, followerId },
      });
      if (!row) throw new NotFoundException('Follow não encontrado');
      await this.prisma.follow.delete({ where: { id } });
    }
  }