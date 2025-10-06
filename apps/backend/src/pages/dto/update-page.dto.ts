import { PartialType } from '@nestjs/mapped-types';
import { CreatePageDto } from './create-page.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PageStatus } from '@prisma/client';

export class UpdatePageDto extends PartialType(CreatePageDto) {
  @IsOptional()
  @IsEnum(PageStatus)
  status?: PageStatus;
}
