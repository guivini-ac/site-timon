import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Page, PageStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    status?: PageStatus;
  }): Promise<{ data: Page[]; total: number }> {
    const { skip = 0, take = 25, search, status } = params;

    const where: Prisma.PageWhereInput = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.page.count({ where }),
      this.prisma.page.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return { total, data };
  }

  async findById(id: string) {
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }
    return page;
  }

  async create(createPageDto: CreatePageDto, authorId: string) {
    return this.prisma.page.create({
      data: {
        ...createPageDto,
        author: { connect: { id: authorId } },
      },
    });
  }

  async update(id: string, updatePageDto: UpdatePageDto) {
    await this.ensureExists(id);
    return this.prisma.page.update({
      where: { id },
      data: updatePageDto,
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.page.delete({ where: { id } });
  }

  async publish(id: string) {
    await this.ensureExists(id);
    return this.prisma.page.update({
      where: { id },
      data: { status: PageStatus.PUBLISHED },
    });
  }

  private async ensureExists(id: string) {
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }
  }
}
