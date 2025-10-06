import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsBooleanString, IsOptional } from 'class-validator';

export class SlidesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsBooleanString()
  active?: string;
}
