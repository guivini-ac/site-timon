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
import { TourismService } from './tourism.service';
import { CreateTourismPointDto } from './dto/create-tourism-point.dto';
import { UpdateTourismPointDto } from './dto/update-tourism-point.dto';
import { TourismQueryDto } from './dto/tourism-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tourism-points')
@Controller('tourism-points')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TourismController {
  constructor(private readonly tourismService: TourismService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findAll(@Query() query: TourismQueryDto) {
    const { active, ...rest } = query;
    return this.tourismService.findAll({
      ...rest,
      active: active !== undefined ? active === 'true' : undefined,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  findOne(@Param('id') id: string) {
    return this.tourismService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() dto: CreateTourismPointDto, @CurrentUser() user: any) {
    return this.tourismService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() dto: UpdateTourismPointDto) {
    return this.tourismService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.tourismService.delete(id);
  }
}
