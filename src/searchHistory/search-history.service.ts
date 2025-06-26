import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: number, limit = 20, cursor = 0) {
    return this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: cursor,
      take: limit,
    });
  }

  clearAll(userId: number) {
    return this.prisma.searchHistory.deleteMany({ where: { userId } });
  }

  async remove(userId: number, id: number) {
    const row = await this.prisma.searchHistory.findFirst({
      where: { id, userId },
    });
    if (!row) throw new NotFoundException('Item não encontrado');
    await this.prisma.searchHistory.delete({ where: { id } });
  }

  /** usado pelo interceptor */
  async record(userId: number, query?: string) {
    if (!query?.trim()) return;
    await this.prisma.searchHistory.create({
      data: { userId, query: query.trim() },
    });
  }
}