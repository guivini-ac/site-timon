import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class CategoryQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;
}
