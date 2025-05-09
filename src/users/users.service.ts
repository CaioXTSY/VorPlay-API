import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { SearchUsersDto } from './dto/search-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }


  async create(data: { name: string; email: string; password: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findAll(): Promise<Pick<User, 'id' | 'name' | 'email' | 'profilePicture' | 'createdAt'>[]> {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, profilePicture: true, createdAt: true }
    });
  }

  async findById(id: number): Promise<Pick<User, 'id' | 'name' | 'email' | 'profilePicture' | 'createdAt'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, profilePicture: true, createdAt: true }
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<Pick<User, 'id' | 'name' | 'email' | 'profilePicture' | 'createdAt'>> {
    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, profilePicture: true, createdAt: true }
    });
    return user;
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Usuário removido com sucesso' };
  }

  async searchUsers(searchParams: SearchUsersDto): Promise<Pick<User, 'id' | 'name' | 'email' | 'profilePicture' | 'createdAt'>[]> {
    const { query } = searchParams;

    // Se não houver termo de busca, retorna lista vazia
    if (!query) {
      return [];
    }

    // Busca por nome OU email
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        createdAt: true
      }
    });
  }
}