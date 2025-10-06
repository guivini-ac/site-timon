import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSlideDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsString()
  button_text?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
