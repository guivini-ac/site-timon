import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Prisma, PostStatus } from '@prisma/client';

const defaultInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  categories: {
    include: {
      category: true,
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
};

type PostWithRelations = Prisma.PostGetPayload<{ include: typeof defaultInclude }>;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    status?: PostStatus;
  }): Promise<{ data: PostWithRelations[]; total: number }> {
    const { skip = 0, take = 25, search, status } = params;

    const where: Prisma.PostWhereInput = {
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
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: defaultInclude,
      }),
    ]);

    return { total, data };
  }

  async findById(id: string): Promise<PostWithRelations> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: defaultInclude,
    });

    if (!post) {
      throw new NotFoundException('Notícia não encontrada');
    }

    return post;
  }

  async create(createPostDto: CreatePostDto, authorId: string): Promise<PostWithRelations> {
    const { categoryIds = [], tagIds = [], ...rest } = createPostDto;

    return this.prisma.post.create({
      data: {
        ...rest,
        author: { connect: { id: authorId } },
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
        tags: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: defaultInclude,
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostWithRelations> {
    const { categoryIds, tagIds, ...rest } = updatePostDto;
    await this.ensureExists(id);

    const operations: Prisma.PrismaPromise<any>[] = [];

    if (categoryIds) {
      operations.push(
        this.prisma.postCategory.deleteMany({ where: { post_id: id } }),
      );
      if (categoryIds.length > 0) {
        operations.push(
          this.prisma.postCategory.createMany({
            data: categoryIds.map((categoryId) => ({
              post_id: id,
              category_id: categoryId,
            })),
          }),
        );
      }
    }

    if (tagIds) {
      operations.push(this.prisma.postTag.deleteMany({ where: { post_id: id } }));
      if (tagIds.length > 0) {
        operations.push(
          this.prisma.postTag.createMany({
            data: tagIds.map((tagId) => ({
              post_id: id,
              tag_id: tagId,
            })),
          }),
        );
      }
    }

    await this.prisma.$transaction([
      this.prisma.post.update({
        where: { id },
        data: rest,
      }),
      ...operations,
    ]);

    return this.findById(id);
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.prisma.post.delete({ where: { id } });
    return { deleted: true };
  }

  async publish(id: string): Promise<PostWithRelations> {
    await this.ensureExists(id);
    return this.prisma.post.update({
      where: { id },
      data: { status: PostStatus.PUBLISHED, publish_at: new Date() },
      include: defaultInclude,
    });
  }

  async incrementViews(id: string) {
    await this.ensureExists(id);
    return this.prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { id: true, views: true },
    });
  }

  private async ensureExists(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Notícia não encontrada');
    }
  }
}
