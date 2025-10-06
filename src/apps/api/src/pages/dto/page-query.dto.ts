import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PageStatus } from '@prisma/client';

export class PageQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(PageStatus)
  status?: PageStatus;
}
