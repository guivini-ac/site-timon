import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: PaginationQueryDto) {
    const { skip = 0, take = 25, search } = params;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, data] = await this.prisma.$transaction([
      this.prisma.permission.count({ where }),
      this.prisma.permission.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return { total, data };
  }

  async findById(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException('Permissão não encontrada');
    }

    return permission;
  }

  async create(dto: CreatePermissionDto) {
    return this.prisma.permission.create({ data: dto });
  }

  async update(id: string, dto: UpdatePermissionDto) {
    await this.ensureExists(id);
    return this.prisma.permission.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.permission.delete({ where: { id } });
    return { deleted: true };
  }

  async assignToUser(permissionId: string, userId: string) {
    await this.ensureExists(permissionId);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        permissions: {
          upsert: {
            where: { user_id_permission_id: { user_id: userId, permission_id: permissionId } },
            update: {},
            create: { permission: { connect: { id: permissionId } } },
          },
        },
      },
    });
    return this.findById(permissionId);
  }

  async revokeFromUser(permissionId: string, userId: string) {
    await this.ensureExists(permissionId);
    await this.prisma.userPermission.delete({
      where: { user_id_permission_id: { user_id: userId, permission_id: permissionId } },
    });
    return { revoked: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.permission.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Permissão não encontrada');
    }
  }
}
