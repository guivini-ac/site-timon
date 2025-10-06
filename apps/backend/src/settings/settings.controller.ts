import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':key')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  findOne(@Param('key') key: string) {
    return this.settingsService.findOne(key);
  }

  @Put(':key')
  @Roles(UserRole.ADMIN)
  upsert(@Param('key') key: string, @Body() dto: UpsertSettingDto) {
    return this.settingsService.upsert(key, dto);
  }

  @Delete(':key')
  @Roles(UserRole.ADMIN)
  remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }
}
