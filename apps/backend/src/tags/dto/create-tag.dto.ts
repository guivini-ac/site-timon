import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TagType } from '@prisma/client';

export class CreateTagDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TagType)
  type: TagType;
}
