import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from './storage/minio.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async findAll(params: PaginationQueryDto & { folder?: string }) {
    const { skip = 0, take = 25, search, folder } = params;

    const where = {
      ...(search
        ? {
            OR: [
              { original_name: { contains: search, mode: 'insensitive' } },
              { filename: { contains: search, mode: 'insensitive' } },
              { alt: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(folder ? { folder } : {}),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.mediaFile.count({ where }),
      this.prisma.mediaFile.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          uploader: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    return { total, data };
  }

  async upload(file: Express.Multer.File, userId: string, folder?: string) {
    const { key, url } = await this.minioService.upload(file, folder);

    return this.prisma.mediaFile.create({
      data: {
        filename: key,
        original_name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url,
        folder,
        uploaded_by: userId,
      },
      include: {
        uploader: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateMediaDto) {
    await this.ensureExists(id);
    return this.prisma.mediaFile.update({
      where: { id },
      data: dto,
      include: {
        uploader: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async delete(id: string) {
    const media = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException('Arquivo de mídia não encontrado');
    }

    await this.minioService.remove(media.filename);
    await this.prisma.mediaFile.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Arquivo de mídia não encontrado');
    }
  }
}
