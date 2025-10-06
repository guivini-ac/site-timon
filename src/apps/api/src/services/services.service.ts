import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Prisma } from '@prisma/client';

const serviceInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

type ServiceWithAuthor = Prisma.ServiceGetPayload<{ include: typeof serviceInclude }>;

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    category?: string;
  }): Promise<{ data: ServiceWithAuthor[]; total: number }> {
    const { skip = 0, take = 25, search, category } = params;

    const where: Prisma.ServiceWhereInput = {
      ...(category ? { category } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.service.count({ where }),
      this.prisma.service.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: serviceInclude,
      }),
    ]);

    return { total, data };
  }

  async findById(id: string): Promise<ServiceWithAuthor> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: serviceInclude,
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return service;
  }

  async create(dto: CreateServiceDto, authorId: string): Promise<ServiceWithAuthor> {
    return this.prisma.service.create({
      data: {
        ...dto,
        author: { connect: { id: authorId } },
      },
      include: serviceInclude,
    });
  }

  async update(id: string, dto: UpdateServiceDto): Promise<ServiceWithAuthor> {
    await this.ensureExists(id);
    return this.prisma.service.update({
      where: { id },
      data: dto,
      include: serviceInclude,
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.service.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.service.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Serviço não encontrado');
    }
  }
}
