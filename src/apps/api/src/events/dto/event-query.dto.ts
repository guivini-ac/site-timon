import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from '@prisma/client';

export class EventQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
