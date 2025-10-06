import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsBooleanString, IsOptional } from 'class-validator';

export class SecretariaQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsBooleanString()
  active?: string;
}
