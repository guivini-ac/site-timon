import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsOptional, IsString } from 'class-validator';

export class ServiceQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  category?: string;
}
