import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TagType } from '@prisma/client';

export class TagQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(TagType)
  type?: TagType;
}
