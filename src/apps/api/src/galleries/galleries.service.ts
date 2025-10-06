import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Prisma } from '@prisma/client';

const galleryInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  images: true,
};

type GalleryWithRelations = Prisma.GalleryGetPayload<{ include: typeof galleryInclude }>;

@Injectable()
export class GalleriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    active?: boolean;
  }): Promise<{ data: GalleryWithRelations[]; total: number }> {
    const { skip = 0, take = 25, search, active } = params;

    const where: Prisma.GalleryWhereInput = {
      ...(active !== undefined ? { active } : {}),
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
      this.prisma.gallery.count({ where }),
      this.prisma.gallery.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: galleryInclude,
      }),
    ]);

    return { total, data };
  }

  async findById(id: string): Promise<GalleryWithRelations> {
    const gallery = await this.prisma.gallery.findUnique({
      where: { id },
      include: galleryInclude,
    });

    if (!gallery) {
      throw new NotFoundException('Galeria não encontrada');
    }

    return gallery;
  }

  async create(dto: CreateGalleryDto, authorId: string): Promise<GalleryWithRelations> {
    const { images = [], ...rest } = dto;
    return this.prisma.gallery.create({
      data: {
        ...rest,
        author: { connect: { id: authorId } },
        images: {
          create: images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            caption: image.caption,
            order: image.order ?? index,
          })),
        },
      },
      include: galleryInclude,
    });
  }

  async update(id: string, dto: UpdateGalleryDto): Promise<GalleryWithRelations> {
    const { images, ...rest } = dto;
    await this.ensureExists(id);

    if (images) {
      await this.prisma.$transaction([
        this.prisma.galleryImage.deleteMany({ where: { gallery_id: id } }),
        this.prisma.galleryImage.createMany({
          data: images.map((image, index) => ({
            gallery_id: id,
            url: image.url,
            alt: image.alt,
            caption: image.caption,
            order: image.order ?? index,
          })),
        }),
      ]);
    }

    await this.prisma.gallery.update({
      where: { id },
      data: rest,
    });

    return this.findById(id);
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.gallery.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.gallery.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Galeria não encontrada');
    }
  }
}
