import { PartialType } from '@nestjs/mapped-types';
import { CreateGalleryDto } from './create-gallery.dto';
import { IsOptional, IsArray } from 'class-validator';
import { GalleryImageDto } from './gallery-image.dto';
import { Type } from 'class-transformer';

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {
  @IsOptional()
  @IsArray()
  @Type(() => GalleryImageDto)
  images?: GalleryImageDto[];
}
