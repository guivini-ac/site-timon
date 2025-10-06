import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
  }): Promise<{ data: Array<Omit<User, 'password'>>; total: number }> {
    const { skip = 0, take = 25, search } = params;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, data] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return { total, data: data.map((user) => this.sanitize(user)) };
  }

  async findById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.sanitize(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const password = await hash(createUserDto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password,
        role: createUserDto.role ?? UserRole.EDITOR,
        active: createUserDto.active ?? true,
      },
    });

    return this.sanitize(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    await this.ensureExists(id);

    const data: Prisma.UserUpdateInput = {
      email: updateUserDto.email,
      name: updateUserDto.name,
      role: updateUserDto.role,
      active: updateUserDto.active,
    };

    if (updateUserDto.password) {
      data.password = await hash(updateUserDto.password, 12);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.sanitize(user);
  }

  async deactivate(id: string): Promise<Omit<User, 'password'>> {
    await this.ensureExists(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: { active: false },
    });

    return this.sanitize(user);
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  private sanitize(user: User): Omit<User, 'password'> {
    const { password, ...rest } = user;
    return rest;
  }
}
