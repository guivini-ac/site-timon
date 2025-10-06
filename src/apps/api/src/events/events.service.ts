import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus, Prisma } from '@prisma/client';

const eventInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

type EventWithAuthor = Prisma.EventGetPayload<{ include: typeof eventInclude }>;

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    status?: EventStatus;
  }): Promise<{ data: EventWithAuthor[]; total: number }> {
    const { skip = 0, take = 25, search, status } = params;

    const where: Prisma.EventWhereInput = {
      ...(status ? { status } : {}),
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
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        skip,
        take,
        orderBy: { start_date: 'desc' },
        include: eventInclude,
      }),
    ]);

    return { total, data };
  }

  async findById(id: string): Promise<EventWithAuthor> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: eventInclude,
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event;
  }

  async create(dto: CreateEventDto, authorId: string): Promise<EventWithAuthor> {
    return this.prisma.event.create({
      data: {
        ...dto,
        author: { connect: { id: authorId } },
      },
      include: eventInclude,
    });
  }

  async update(id: string, dto: UpdateEventDto): Promise<EventWithAuthor> {
    await this.ensureExists(id);
    return this.prisma.event.update({
      where: { id },
      data: dto,
      include: eventInclude,
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.event.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.event.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Evento não encontrado');
    }
  }
}
