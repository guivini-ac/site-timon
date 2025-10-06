import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Prisma, Tag, TagType } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    type?: TagType;
  }): Promise<{ data: Tag[]; total: number }> {
    const { skip = 0, take = 25, search, type } = params;

    const where: Prisma.TagWhereInput = {
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
      this.prisma.tag.count({ where }),
      this.prisma.tag.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return { total, data };
  }

  async findById(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag não encontrada');
    }
    return tag;
  }

  async create(dto: CreateTagDto) {
    return this.prisma.tag.create({ data: dto });
  }

  async update(id: string, dto: UpdateTagDto) {
    await this.ensureExists(id);
    return this.prisma.tag.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.tag.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.tag.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Tag não encontrada');
    }
  }
}
