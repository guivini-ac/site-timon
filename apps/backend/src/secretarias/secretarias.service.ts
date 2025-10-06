import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSecretariaDto } from './dto/create-secretaria.dto';
import { UpdateSecretariaDto } from './dto/update-secretaria.dto';
import { Prisma } from '@prisma/client';

const secretariaInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

type SecretariaWithAuthor = Prisma.SecretariaGetPayload<{ include: typeof secretariaInclude }>;

@Injectable()
export class SecretariasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    active?: boolean;
  }): Promise<{ data: SecretariaWithAuthor[]; total: number }> {
    const { skip = 0, take = 25, search, active } = params;

    const where: Prisma.SecretariaWhereInput = {
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
      this.prisma.secretaria.count({ where }),
      this.prisma.secretaria.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: secretariaInclude,
      }),
    ]);

    return { total, data };
  }

  async findById(id: string): Promise<SecretariaWithAuthor> {
    const secretaria = await this.prisma.secretaria.findUnique({
      where: { id },
      include: secretariaInclude,
    });

    if (!secretaria) {
      throw new NotFoundException('Secretaria não encontrada');
    }

    return secretaria;
  }

  async create(dto: CreateSecretariaDto, authorId: string): Promise<SecretariaWithAuthor> {
    return this.prisma.secretaria.create({
      data: {
        ...dto,
        author: { connect: { id: authorId } },
      },
      include: secretariaInclude,
    });
  }

  async update(id: string, dto: UpdateSecretariaDto): Promise<SecretariaWithAuthor> {
    await this.ensureExists(id);
    return this.prisma.secretaria.update({
      where: { id },
      data: dto,
      include: secretariaInclude,
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.secretaria.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.secretaria.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Secretaria não encontrada');
    }
  }
}
