import { IsIP, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateFormResponseDto {
  @IsObject()
  data: Record<string, any>;

  @IsOptional()
  @IsIP()
  ip_address?: string;

  @IsOptional()
  @IsString()
  user_agent?: string;
}
