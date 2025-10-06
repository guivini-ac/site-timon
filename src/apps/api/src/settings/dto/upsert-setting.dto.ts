import { IsNotEmpty } from 'class-validator';

export class UpsertSettingDto {
  @IsNotEmpty()
  value: any;
}
