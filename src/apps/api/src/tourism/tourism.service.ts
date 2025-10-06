import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourismPointDto } from './dto/create-tourism-point.dto';
import { UpdateTourismPointDto } from './dto/update-tourism-point.dto';
import { Prisma } from '@prisma/client';

const tourismInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

type TourismPointWithAuthor = Prisma.TourismPointGetPayload<{ include: typeof tourismInclude }>;

@Injectable()
export class TourismService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    active?: boolean;
  }): Promise<{ data: TourismPointWithAuthor[]; total: number }> {
    const { skip = 0, take = 25, search, active } = params;

    const where: Prisma.TourismPointWhereInput = {
      ...(active !== undefined ? { active } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.tourismPoint.count({ where }),
      this.prisma.tourismPoint.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: tourismInclude,
      }),
    ]);

    return { total, data };
  }

  async findById(id: string): Promise<TourismPointWithAuthor> {
    const point = await this.prisma.tourismPoint.findUnique({
      where: { id },
      include: tourismInclude,
    });

    if (!point) {
      throw new NotFoundException('Ponto turístico não encontrado');
    }

    return point;
  }

  async create(dto: CreateTourismPointDto, authorId: string): Promise<TourismPointWithAuthor> {
    return this.prisma.tourismPoint.create({
      data: {
        ...dto,
        author: { connect: { id: authorId } },
      },
      include: tourismInclude,
    });
  }

  async update(id: string, dto: UpdateTourismPointDto): Promise<TourismPointWithAuthor> {
    await this.ensureExists(id);
    return this.prisma.tourismPoint.update({
      where: { id },
      data: dto,
      include: tourismInclude,
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.tourismPoint.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.tourismPoint.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Ponto turístico não encontrado');
    }
  }
}
