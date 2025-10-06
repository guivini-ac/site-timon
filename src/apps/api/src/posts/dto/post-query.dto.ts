import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PostStatus } from '@prisma/client';

export class PostQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}
