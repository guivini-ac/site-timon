import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateFormResponseDto } from './dto/create-form-response.dto';

@Injectable()
export class FormsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: PaginationQueryDto) {
    const { skip = 0, take = 25, search } = params;

    const where: Prisma.FormWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, data] = await this.prisma.$transaction([
      this.prisma.form.count({ where }),
      this.prisma.form.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    return { total, data };
  }

  async findById(id: string) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!form) {
      throw new NotFoundException('Formulário não encontrado');
    }

    return form;
  }

  async create(dto: CreateFormDto, authorId: string) {
    return this.prisma.form.create({
      data: {
        ...dto,
        author: { connect: { id: authorId } },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateFormDto) {
    await this.ensureExists(id);
    return this.prisma.form.update({
      where: { id },
      data: dto,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.form.delete({ where: { id } });
    return { deleted: true };
  }

  async listResponses(formId: string, params: PaginationQueryDto) {
    await this.ensureExists(formId);
    const { skip = 0, take = 25 } = params;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.formSubmission.count({ where: { form_id: formId } }),
      this.prisma.formSubmission.findMany({
        where: { form_id: formId },
        skip,
        take,
        orderBy: { submitted_at: 'desc' },
      }),
    ]);

    return { total, data };
  }

  async submitResponse(formId: string, dto: CreateFormResponseDto) {
    await this.ensureExists(formId);
    return this.prisma.formSubmission.create({
      data: {
        form: { connect: { id: formId } },
        data: dto.data,
        ip_address: dto.ip_address,
        user_agent: dto.user_agent,
      },
    });
  }

  async deleteResponse(formId: string, id: string) {
    const submission = await this.prisma.formSubmission.findUnique({ where: { id } });
    if (!submission || submission.form_id !== formId) {
      throw new NotFoundException('Resposta não encontrada');
    }
    await this.prisma.formSubmission.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.form.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Formulário não encontrado');
    }
  }
}
