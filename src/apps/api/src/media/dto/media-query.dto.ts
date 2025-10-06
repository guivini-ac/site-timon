import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsOptional, IsString } from 'class-validator';

export class MediaQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  folder?: string;
}
