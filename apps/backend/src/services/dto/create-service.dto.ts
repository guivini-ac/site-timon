import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  @IsOptional()
  @IsString()
  process_time?: string;

  @IsOptional()
  @IsString()
  cost?: string;

  @IsOptional()
  @IsString()
  responsible_department?: string;

  @IsOptional()
  @IsString()
  contact_info?: string;

  @IsOptional()
  @IsString()
  online_url?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
