import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { PostStatus } from '@prisma/client';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsUrl()
  featured_image?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsDateString()
  publish_at?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  seo_title?: string;

  @IsOptional()
  @IsString()
  seo_description?: string;

  @IsOptional()
  @IsArray()
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  tagIds?: string[];
}
