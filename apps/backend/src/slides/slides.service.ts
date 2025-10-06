import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { Prisma, Slide } from '@prisma/client';

@Injectable()
export class SlidesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    active?: boolean;
  }): Promise<{ data: Slide[]; total: number }> {
    const { skip = 0, take = 25, search, active } = params;

    const where: Prisma.SlideWhereInput = {
      ...(active !== undefined ? { active } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { subtitle: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.slide.count({ where }),
      this.prisma.slide.findMany({
        where,
        skip,
        take,
        orderBy: [{ order: 'asc' }, { created_at: 'desc' }],
      }),
    ]);

    return { total, data };
  }

  async findById(id: string) {
    const slide = await this.prisma.slide.findUnique({ where: { id } });
    if (!slide) {
      throw new NotFoundException('Slide não encontrado');
    }
    return slide;
  }

  async create(dto: CreateSlideDto) {
    return this.prisma.slide.create({ data: dto });
  }

  async update(id: string, dto: UpdateSlideDto) {
    await this.ensureExists(id);
    return this.prisma.slide.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.slide.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.slide.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Slide não encontrado');
    }
  }
}
