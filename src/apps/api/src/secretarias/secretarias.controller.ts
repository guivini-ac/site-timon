import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SecretariasService } from './secretarias.service';
import { CreateSecretariaDto } from './dto/create-secretaria.dto';
import { UpdateSecretariaDto } from './dto/update-secretaria.dto';
import { SecretariaQueryDto } from './dto/secretaria-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('secretarias')
@Controller('secretarias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SecretariasController {
  constructor(private readonly secretariasService: SecretariasService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findAll(@Query() query: SecretariaQueryDto) {
    const { active, ...rest } = query;
    return this.secretariasService.findAll({
      ...rest,
      active: active !== undefined ? active === 'true' : undefined,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findOne(@Param('id') id: string) {
    return this.secretariasService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() dto: CreateSecretariaDto, @CurrentUser() user: any) {
    return this.secretariasService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() dto: UpdateSecretariaDto) {
    return this.secretariasService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.secretariasService.delete(id);
  }
}
