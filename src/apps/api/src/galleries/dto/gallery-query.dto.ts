import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsBooleanString, IsOptional } from 'class-validator';

export class GalleryQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsBooleanString()
  active?: string;
}
