import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryType, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    type?: CategoryType;
  }): Promise<{ data: Category[]; total: number }> {
    const { skip = 0, take = 25, search, type } = params;

    const where: Prisma.CategoryWhereInput = {
      ...(type ? { type } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.category.count({ where }),
      this.prisma.category.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return { total, data };
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.ensureExists(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.category.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.category.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Categoria não encontrada');
    }
  }
}
