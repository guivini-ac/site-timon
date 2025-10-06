import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { PageStatus } from '@prisma/client';

export class CreatePageDto {
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
  @IsEnum(PageStatus)
  status?: PageStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  seo_title?: string;

  @IsOptional()
  @IsString()
  seo_description?: string;
}
