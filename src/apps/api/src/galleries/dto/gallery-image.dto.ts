import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class GalleryImageDto {
  @IsUrl()
  url: string;

  @IsString()
  alt: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order?: number;
}
